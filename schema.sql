-- Supabase Schema for Marketing Agency CRM

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  role text check (role in ('admin', 'manager', 'employee')) default 'employee',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Clients
create table public.clients (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  industry text,
  website text,
  status text check (status in ('active', 'inactive', 'prospect')) default 'prospect',
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Contacts
create table public.contacts (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.clients(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  position text,
  is_primary boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Leads / Deals Pipeline
create table public.deals (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.clients(id),
  title text not null,
  value numeric(10, 2) default 0,
  stage text check (stage in ('discovery', 'proposal', 'negotiation', 'closed_won', 'closed_lost')) default 'discovery',
  assigned_to uuid references public.profiles(id),
  expected_close_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Projects
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.clients(id) on delete cascade,
  name text not null,
  description text,
  status text check (status in ('planning', 'active', 'on_hold', 'completed')) default 'planning',
  start_date date,
  end_date date,
  manager_id uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tasks
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  description text,
  status text check (status in ('todo', 'in_progress', 'review', 'done')) default 'todo',
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  assignee_id uuid references public.profiles(id),
  due_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Task Comments
create table public.task_comments (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks(id) on delete cascade,
  user_id uuid references public.profiles(id),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) Policies

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.contacts enable row level security;
alter table public.deals enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.task_comments enable row level security;

-- Profiles: Users can read all profiles, but only update their own
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Clients: All authenticated users can read, only admins/managers can insert/update/delete
create policy "Clients viewable by authenticated users" on public.clients for select using (auth.role() = 'authenticated');
create policy "Clients insertable by admins/managers" on public.clients for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'manager'))
);
create policy "Clients updatable by admins/managers" on public.clients for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'manager'))
);

-- Tasks: All authenticated users can read, create, and update tasks
create policy "Tasks viewable by authenticated users" on public.tasks for select using (auth.role() = 'authenticated');
create policy "Tasks insertable by authenticated users" on public.tasks for insert with check (auth.role() = 'authenticated');
create policy "Tasks updatable by authenticated users" on public.tasks for update using (auth.role() = 'authenticated');

-- (Add similar policies for other tables based on your specific business logic)

-- Functions and Triggers
-- Automatically create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
