import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import supabase from "../lib/supabaseClient";
import { withTimeout } from "../lib/withTimeout";

const AuthContext = createContext(null);

// NOTE: this is now the customer-facing authentication source. The old
// Express/JWT auth (backend/src/routes/auth.js, frontend/src/api/authApi.js)
// is kept in the repo but is no longer called from here — see
// frontend/src/api/authApi.js and backend/README.md for the current status
// of that transition. No JWT is stored manually anywhere in this file:
// supabase-js persists its own session (localStorage, under its own key)
// and onAuthStateChange is the single source of truth for "are we logged in".

async function fetchProfile(userId) {
  try {
    const { data, error } = await withTimeout(
      supabase.from("profiles").select("id, full_name, phone, avatar_url").eq("id", userId).maybeSingle()
    );
    if (error) {
      console.error("Could not load profile:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Could not load profile:", err.message);
    return null;
  }
}

async function fetchRole(userId) {
  try {
    const { data, error } = await withTimeout(
      supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle()
    );
    if (error) {
      console.error("Could not load role:", error.message);
      return "customer";
    }
    // Absence of a row (e.g. the handle_new_user trigger hasn't run yet) is
    // not an error — just means "not an admin".
    return data?.role || "customer";
  } catch (err) {
    console.error("Could not load role:", err.message);
    return "customer";
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);

  // Loads profile/role for whatever session is current. isAdmin only
  // resolves to its real value once this has finished — that's what keeps
  // AdminRoute from flickering "not admin" before the role is known.
  const loadUserData = useCallback(async (nextSession) => {
    const nextUser = nextSession?.user || null;

    if (!nextUser) {
      if (isMountedRef.current) {
        setSession(nextSession || null);
        setUser(null);
        setProfile(null);
        setRole("customer");
      }
      return;
    }

    const [profileData, roleData] = await Promise.all([
      fetchProfile(nextUser.id),
      fetchRole(nextUser.id),
    ]);

    if (!isMountedRef.current) return;
    setSession(nextSession);
    setUser(nextUser);
    setProfile(profileData);
    setRole(roleData);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    // Falls back to "no session" (logged out) rather than hanging forever —
    // without this, a network outage during the very first load leaves
    // `loading` stuck true, which blanks every ProtectedRoute/AdminRoute
    // page indefinitely with no error and no way to retry.
    withTimeout(supabase.auth.getSession())
      .then(({ data }) => loadUserData(data.session))
      .catch(() => loadUserData(null))
      .finally(() => {
        if (isMountedRef.current) setLoading(false);
      });

    // Fires on sign-in, sign-out, token refresh, and password-recovery
    // sessions — this is what keeps the whole app's auth state (including
    // ProtectedRoute/AdminRoute) in sync without manual token handling.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      loadUserData(nextSession);
    });

    return () => {
      isMountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [loadUserData]);

  const signUp = useCallback(async (fullName, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Read by the handle_new_user() database trigger (see
        // supabase/migrations/001_initial_schema.sql) to populate
        // profiles.full_name automatically.
        data: { full_name: fullName },
      },
    });
    if (error) throw error;
    // Caller decides what to do next: data.user.identities?.length === 0
    // means the email is already registered; a null data.session means
    // email confirmation is required before the account can log in.
    // If a session WAS issued (email confirmation off), load it now rather
    // than waiting on onAuthStateChange — see the note in login() below.
    if (data.session) await loadUserData(data.session);
    return data;
  }, [loadUserData]);

  const login = useCallback(
    async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // onAuthStateChange also fires for this and calls loadUserData again
      // (a harmless redundant fetch) — but callers like Login.jsx navigate
      // immediately after this resolves, and ProtectedRoute/AdminRoute
      // check isAuthenticated on the very next render. Without awaiting
      // this here, that render can land before the listener has updated
      // state, bouncing an just-logged-in user straight back to the login
      // page. Awaiting it here guarantees the state is already correct by
      // the time login() returns.
      await loadUserData(data.session);
      return data;
    },
    [loadUserData]
  );

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const refreshUser = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    await loadUserData(data.session);
  }, [loadUserData]);

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      isAuthenticated: Boolean(user),
      isAdmin: role === "admin",
      loading,
      signUp,
      login,
      logout,
      refreshUser,
    }),
    [user, session, profile, role, loading, signUp, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}
