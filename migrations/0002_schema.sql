-- Getdown Fitness multi-tenant schema.
-- Application-level tenancy is enforced in server functions via authMiddleware.

create table if not exists gyms (
  id text primary key,
  name text not null,
  slug text not null unique,
  city text,
  address text,
  phone text,
  email text,
  logo_url text,
  cover_image_url text,
  brand_color text not null default '#5B8C51',
  about_text text,
  established_year int,
  opening_hours jsonb,
  plan text not null default 'starter',
  member_cap int not null default 50,
  subscription_status text not null default 'trial',
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  custom_domain text,
  domain_status text not null default 'none',
  show_powered_by boolean not null default true,
  onboarding_completed boolean not null default false,
  owner_user_id text,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  user_id text primary key,
  gym_id text references gyms(id) on delete set null,
  full_name text,
  phone text,
  avatar_url text,
  last_login_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists user_roles (
  id text primary key,
  user_id text not null,
  role text not null,
  gym_id text references gyms(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists user_roles_user_idx on user_roles (user_id);
create unique index if not exists user_roles_unique on user_roles (user_id, role, gym_id);

create table if not exists members (
  id text primary key,
  gym_id text not null references gyms(id) on delete cascade,
  user_id text,
  full_name text not null,
  phone text,
  email text,
  gender text,
  date_of_birth date,
  photo_url text,
  status text not null default 'active',
  joined_at date,
  notes text,
  emergency_contact text,
  created_at timestamptz not null default now()
);
create index if not exists members_gym_idx on members (gym_id);
create index if not exists members_email_idx on members (email);

create table if not exists plans (
  id text primary key,
  gym_id text not null references gyms(id) on delete cascade,
  name text not null,
  duration_days int not null,
  price numeric not null,
  is_active boolean not null default true,
  display_order int not null default 0
);

create table if not exists member_subscriptions (
  id text primary key,
  gym_id text not null references gyms(id) on delete cascade,
  member_id text not null references members(id) on delete cascade,
  plan_id text references plans(id) on delete set null,
  starts_on date not null,
  ends_on date not null,
  status text not null default 'active',
  amount numeric
);
create index if not exists subs_gym_idx on member_subscriptions (gym_id);
create index if not exists subs_end_idx on member_subscriptions (ends_on);

create table if not exists checkins (
  id text primary key,
  gym_id text not null references gyms(id) on delete cascade,
  member_id text not null references members(id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  source text not null default 'app'
);
create index if not exists checkins_gym_idx on checkins (gym_id, checked_in_at desc);

create table if not exists enquiries (
  id text primary key,
  gym_id text not null references gyms(id) on delete cascade,
  name text not null,
  phone text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists trainers (
  id text primary key,
  gym_id text not null references gyms(id) on delete cascade,
  user_id text,
  name text not null,
  photo_url text,
  speciality text,
  bio text,
  phone text,
  display_order int not null default 0,
  is_visible boolean not null default true
);

create table if not exists amenities (
  id text primary key,
  gym_id text not null references gyms(id) on delete cascade,
  name text not null,
  icon text,
  description text,
  image_url text,
  display_order int not null default 0,
  is_visible boolean not null default true
);

create table if not exists equipment (
  id text primary key,
  gym_id text not null references gyms(id) on delete cascade,
  name text not null,
  icon text,
  description text,
  image_url text,
  display_order int not null default 0,
  is_visible boolean not null default true
);

create table if not exists testimonials (
  id text primary key,
  gym_id text not null references gyms(id) on delete cascade,
  member_name text not null,
  quote text not null,
  rating int,
  is_visible boolean not null default true
);

create table if not exists transformations (
  id text primary key,
  gym_id text not null references gyms(id) on delete cascade,
  member_name text not null,
  story text,
  before_url text,
  after_url text,
  is_visible boolean not null default true
);

create table if not exists payments (
  id text primary key,
  gym_id text references gyms(id) on delete set null,
  amount numeric not null,
  method text not null,
  provider text not null default 'manual',
  status text not null default 'pending',
  reference text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists payment_settings (
  id text primary key default 'default',
  active_provider text not null default 'manual',
  manual_upi_id text,
  manual_account_name text,
  manual_instructions text,
  razorpay_key_id text,
  razorpay_key_secret text,
  stub_label text default 'Coming soon'
);

create table if not exists leads (
  id text primary key,
  gym_name text not null,
  owner_name text not null,
  phone text,
  city text,
  member_count int,
  message text,
  status text not null default 'new',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists staff_invites (
  id text primary key,
  gym_id text not null references gyms(id) on delete cascade,
  email text not null,
  role text not null,
  invited_by text,
  accepted boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists audit_log (
  id text primary key,
  actor_user_id text,
  gym_id text,
  action text not null,
  detail text,
  created_at timestamptz not null default now()
);

create table if not exists member_programs (
  id text primary key,
  gym_id text not null references gyms(id) on delete cascade,
  member_id text not null references members(id) on delete cascade,
  trainer_id text,
  workout_text text,
  diet_text text,
  updated_at timestamptz not null default now()
);

create table if not exists progress_logs (
  id text primary key,
  gym_id text not null references gyms(id) on delete cascade,
  member_id text not null references members(id) on delete cascade,
  logged_on date not null default current_date,
  weight_kg numeric,
  photo_url text,
  notes text
);

create table if not exists impersonations (
  user_id text primary key,
  gym_id text not null references gyms(id) on delete cascade,
  started_at timestamptz not null default now()
);

create table if not exists plan_catalog (
  id text primary key,
  name text not null,
  price numeric,
  member_cap int not null,
  is_enterprise boolean not null default false,
  display_order int not null default 0
);

create table if not exists trainer_clients (
  trainer_id text not null references trainers(id) on delete cascade,
  member_id text not null references members(id) on delete cascade,
  gym_id text not null,
  primary key (trainer_id, member_id)
);

create or replace function app_user_id() returns text as $$
  select nullif(current_setting('app.user_id', true), '');
$$ language sql stable;

create or replace function has_role(p_user_id text, p_role text) returns boolean as $$
  select exists (
    select 1 from user_roles
    where user_id = p_user_id and role = p_role
  );
$$ language sql stable security definer;

create or replace function get_my_gym_id() returns text as $$
  select coalesce(
    (select gym_id from impersonations where user_id = app_user_id()),
    (select gym_id from user_roles
      where user_id = app_user_id() and gym_id is not null
      order by case role
        when 'gym_owner' then 0 when 'staff' then 1
        when 'trainer' then 2 else 3 end
      limit 1)
  );
$$ language sql stable security definer;

create or replace function enforce_member_cap() returns trigger as $$
declare
  cap int;
  used int;
begin
  if new.status is distinct from 'active' then
    return new;
  end if;
  select member_cap into cap from gyms where id = new.gym_id;
  select count(*)::int into used from members
    where gym_id = new.gym_id and status = 'active' and id <> new.id;
  if cap is not null and used >= cap then
    raise exception 'MEMBER_CAP_EXCEEDED';
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists members_cap_trg on members;
create trigger members_cap_trg
  before insert or update of status on members
  for each row execute procedure enforce_member_cap();
