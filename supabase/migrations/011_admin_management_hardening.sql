-- FreshBite — Supabase migration 011: admin management hardening
--
-- Depends on: 001_initial_schema.sql, 002_rls_policies.sql (is_admin()),
-- 003_functions.sql (admin_set_user_role()), 008_admin_list_users.sql.
--
-- Adds:
--   1. admin_activity_log — immutable audit trail for admin actions.
--   2. Last-admin lockout protection inside admin_set_user_role() itself
--      (not just the UI) — demoting the sole remaining admin is refused by
--      the database, the same way self-demotion already was.
--   3. admin_list_users() extended with email_confirmed_at / banned_until so
--      the Users CMS can show a real "Status" column without a new table or
--      column — both already exist on auth.users.

-- ============================================================================
-- admin_activity_log — actor_user_id defaults to auth.uid(), so a normal
-- authenticated admin write never has to pass it explicitly. No
-- UPDATE/DELETE policy or grant for anyone — an audit log that can be
-- edited or erased by the very accounts it watches isn't an audit log.
-- ============================================================================
create table if not exists public.admin_activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null default auth.uid(),
  action text not null,
  target_type text not null,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_activity_log_created_at_idx on public.admin_activity_log (created_at desc);

alter table public.admin_activity_log enable row level security;

drop policy if exists admin_activity_log_select_admin on public.admin_activity_log;
create policy admin_activity_log_select_admin
  on public.admin_activity_log for select
  using (public.is_admin());

drop policy if exists admin_activity_log_insert_admin on public.admin_activity_log;
create policy admin_activity_log_insert_admin
  on public.admin_activity_log for insert
  with check (public.is_admin());

grant select, insert on public.admin_activity_log to authenticated;

-- ============================================================================
-- admin_set_user_role — now also refuses to demote the last remaining admin,
-- and records the change in admin_activity_log. Self-demotion was already
-- blocked (003_functions.sql); that check is unchanged.
-- ============================================================================
create or replace function public.admin_set_user_role(
  p_user_id uuid,
  p_role text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_previous_role text;
  v_admin_count int;
begin
  if not public.is_admin() then
    raise exception 'Admin access required.' using errcode = '42501';
  end if;

  if p_role not in ('customer', 'admin') then
    raise exception 'Invalid role.' using errcode = '22023';
  end if;

  if p_user_id = auth.uid() then
    raise exception 'Admins cannot change their own role.' using errcode = '42501';
  end if;

  select role into v_previous_role from public.user_roles where user_id = p_user_id;

  if p_role = 'customer' and coalesce(v_previous_role, 'customer') = 'admin' then
    select count(*) into v_admin_count from public.user_roles where role = 'admin';
    if v_admin_count <= 1 then
      raise exception 'You cannot remove the last administrator. Add another administrator first.'
        using errcode = '42501';
    end if;
  end if;

  insert into public.user_roles (user_id, role)
  values (p_user_id, p_role)
  on conflict (user_id) do update set role = excluded.role;

  insert into public.admin_activity_log (action, target_type, target_id, metadata)
  values (
    case when p_role = 'admin' then 'user_promoted_to_admin' else 'admin_access_removed' end,
    'user',
    p_user_id::text,
    jsonb_build_object('previous_role', coalesce(v_previous_role, 'customer'), 'new_role', p_role)
  );
end;
$$;

revoke all on function public.admin_set_user_role(uuid, text) from public;
grant execute on function public.admin_set_user_role(uuid, text) to authenticated;

-- ============================================================================
-- admin_list_users — adds email_confirmed_at + banned_until (both already on
-- auth.users) so the Users CMS can derive a real Status column. Still no
-- password hash, confirmation tokens, or other auth internals selected.
-- ============================================================================
-- Return type (OUT params) is changing, so plain CREATE OR REPLACE is
-- rejected by Postgres (42P13) — drop first, same as any signature change.
drop function if exists public.admin_list_users();

create or replace function public.admin_list_users()
returns table (
  id uuid,
  email text,
  full_name text,
  phone text,
  role text,
  created_at timestamptz,
  email_confirmed_at timestamptz,
  banned_until timestamptz
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
      u.created_at,
      u.email_confirmed_at,
      u.banned_until
    from auth.users u
    left join public.profiles p on p.id = u.id
    left join public.user_roles ur on ur.user_id = u.id
    order by u.created_at desc;
end;
$$;

revoke all on function public.admin_list_users() from public;
grant execute on function public.admin_list_users() to authenticated;
