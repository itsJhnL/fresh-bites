// Every Supabase call in this app (postgrest queries AND auth.getSession())
// routes through GoTrueClient's session check first (see
// SupabaseClient._getAccessToken in @supabase/supabase-js). On a hard
// network failure — dropped wifi, DNS failure, Supabase unreachable at the
// TCP level, not just a 4xx/5xx HTTP response — that check can retry
// internally with a growing backoff instead of ever rejecting, which left
// pages stuck on their loading skeleton forever with no error shown and no
// way to retry. Wrapping calls in withTimeout() guarantees our own promise
// settles even if the underlying client call never does, so the normal
// .catch()-driven ErrorState/"Try Again" UI still kicks in.
const DEFAULT_TIMEOUT_MS = 15000;

export function withTimeout(promise, ms = DEFAULT_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Request timed out. Please check your connection and try again."));
      }, ms);
    }),
  ]);
}
