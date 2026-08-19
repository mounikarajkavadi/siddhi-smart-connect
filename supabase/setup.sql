-- ============================================================
-- siddhi-E-learn — complete database setup
-- Paste this whole file into Supabase → SQL Editor → New query → Run.
-- Safe to run more than once.
-- ============================================================

-- ---------- ROLES ----------
do $$ begin
  create type public.app_role as enum ('student','admin');
exception when duplicate_object then null; end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

drop policy if exists "Users can read own roles" on public.user_roles;
create policy "Users can read own roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

drop policy if exists "Admins manage roles" on public.user_roles;
create policy "Admins manage roles" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ---------- PROFILES ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  email text not null default '',
  phone text not null default '',
  age integer,
  gender text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

drop policy if exists "Read own profile or admin" on public.profiles;
create policy "Read own profile or admin" on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(),'admin'));

drop policy if exists "Update own profile" on public.profiles;
create policy "Update own profile" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "Insert own profile" on public.profiles;
create policy "Insert own profile" on public.profiles for insert to authenticated
  with check (id = auth.uid());

-- Auto-create a profile on sign-up; first ever user becomes admin.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, first_name, last_name, email, phone, age, gender)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name',''),
    coalesce(new.raw_user_meta_data->>'last_name',''),
    coalesce(new.email,''),
    coalesce(new.raw_user_meta_data->>'phone',''),
    nullif(new.raw_user_meta_data->>'age','')::int,
    nullif(new.raw_user_meta_data->>'gender','')
  )
  on conflict (id) do nothing;

  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin') on conflict do nothing;
  else
    insert into public.user_roles (user_id, role) values (new.id, 'student') on conflict do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------- COURSES ----------
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null default '',
  price_text text not null default '',
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.courses to authenticated;
grant all on public.courses to service_role;
alter table public.courses enable row level security;

drop policy if exists "Signed-in users read courses" on public.courses;
create policy "Signed-in users read courses" on public.courses for select to authenticated using (true);

drop policy if exists "Admins manage courses" on public.courses;
create policy "Admins manage courses" on public.courses for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ---------- ENROLLMENTS ----------
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  unique (student_id, course_id)
);
grant select, insert, update, delete on public.enrollments to authenticated;
grant all on public.enrollments to service_role;
alter table public.enrollments enable row level security;

create or replace function public.is_enrolled(_user_id uuid, _course_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.enrollments
    where student_id = _user_id and course_id = _course_id and status = 'active'
  )
$$;

drop policy if exists "Read own enrollments or admin" on public.enrollments;
create policy "Read own enrollments or admin" on public.enrollments for select to authenticated
  using (student_id = auth.uid() or public.has_role(auth.uid(),'admin'));

drop policy if exists "Admins manage enrollments" on public.enrollments;
create policy "Admins manage enrollments" on public.enrollments for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ---------- LESSONS ----------
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  type text not null default 'video',
  video_url text,
  file_url text,
  live_url text,
  live_datetime timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.lessons to authenticated;
grant all on public.lessons to service_role;
alter table public.lessons enable row level security;

drop policy if exists "Enrolled students read lessons" on public.lessons;
create policy "Enrolled students read lessons" on public.lessons for select to authenticated
  using (public.is_enrolled(auth.uid(), course_id) or public.has_role(auth.uid(),'admin'));

drop policy if exists "Admins manage lessons" on public.lessons;
create policy "Admins manage lessons" on public.lessons for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ---------- LESSON PROGRESS ----------
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean not null default true,
  created_at timestamptz not null default now(),
  unique (student_id, lesson_id)
);
grant select, insert, update, delete on public.lesson_progress to authenticated;
grant all on public.lesson_progress to service_role;
alter table public.lesson_progress enable row level security;

drop policy if exists "Manage own progress" on public.lesson_progress;
create policy "Manage own progress" on public.lesson_progress for all to authenticated
  using (student_id = auth.uid() or public.has_role(auth.uid(),'admin'))
  with check (student_id = auth.uid());

-- ---------- STORAGE: private course-notes bucket ----------
-- The bucket itself (Lovable's migration never created it).
insert into storage.buckets (id, name, public)
values ('course-notes', 'course-notes', false)
on conflict (id) do nothing;

drop policy if exists "Admins manage course notes" on storage.objects;
create policy "Admins manage course notes" on storage.objects for all to authenticated
  using (bucket_id = 'course-notes' and public.has_role(auth.uid(),'admin'))
  with check (bucket_id = 'course-notes' and public.has_role(auth.uid(),'admin'));

-- Notes are stored at {course_id}/{filename}, so the first path segment is the course.
drop policy if exists "Enrolled students read course notes" on storage.objects;
create policy "Enrolled students read course notes" on storage.objects for select to authenticated
  using (
    bucket_id = 'course-notes'
    and public.is_enrolled(auth.uid(), nullif(split_part(name,'/',1),'')::uuid)
  );

-- ---------- LOCK DOWN FUNCTION EXECUTION ----------
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.has_role(uuid, public.app_role) from public, anon;
revoke all on function public.is_enrolled(uuid, uuid) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;
grant execute on function public.is_enrolled(uuid, uuid) to authenticated;

-- ---------- OPTIONAL: seed the two courses ----------
insert into public.courses (title, category, description, price_text)
select 'UPSC Foundation', 'Civil Services',
       'Structured preparation for UPSC aspirants — clear concepts, current affairs and guidance.',
       '₹499 / month'
where not exists (select 1 from public.courses where title = 'UPSC Foundation');

insert into public.courses (title, category, description, price_text)
select 'NEET Preparation', 'Medical Entrance',
       'Concept-first NEET coaching covering Physics, Chemistry and Biology fundamentals.',
       '₹499 / month'
where not exists (select 1 from public.courses where title = 'NEET Preparation');
