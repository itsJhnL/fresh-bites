-- FreshBite — Supabase migration 008: admin_list_users()
--
-- Depends on: 001_initial_schema.sql (profiles, user_roles),
-- 002_rls_policies.sql (is_admin()).
--
-- auth.users is never queried directly by any client, and profiles never
-- stores a second copy of email (which could drift out of sync) — this
-- function is the one controlled, filtered view an admin gets: id, email,
-- full_name, phone, role, created_at. No password hash, no confirmation
-- tokens, no other auth.users internals are selected, ever.

create or replace function public.admin_list_users()
returns table (
  id uuid,
  email text,
  full_name text,
  phone text,
  role text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required.' using errcode = '42501';
  end if;

  return query
    select
      u.id,
      u.email::text,
      p.full_name,
      p.phone,
      coalesce(ur.role, 'customer') as role,
      u.created_at
    from auth.users u
    left join public.profiles p on p.id = u.id
    left join public.user_roles ur on ur.user_id = u.id
    order by u.created_at desc;
end;
$$;

revoke all on function public.admin_list_users() from public;
grant execute on function public.admin_list_users() to authenticated;
