create table subscriptions (
    type text not null
);

create unique index idx_unique_subs_type on subscriptions(type);

insert into subscriptions (type) values('Basic'), ('Plus'), ('Pro');

create table users (
    user_id bigserial primary key,
    full_name text,
    is_active boolean default true,
    phone_number text not null,
    email text,
    created_at timestamp with time zone default now(),
    subs_type text REFERENCES subscriptions (type) DEFAULT 'Basic'
);

create index idx_users_phone_number_is_active on users(phone_number, is_active);
create unique index idx_unique_users_phone_number on users(phone_number);

create table phone_number_otp (
  id bigserial primary key,
  phone_number text,
  otp text,
  failed_attempts integer default 0,
  expires_at timestamp with time zone default now() + interval '10 minutes',
  verified_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

create index idx_phone_number_otp_phone_number on phone_number_otp(phone_number)
  where verified_at is null;

create index idx_phone_number_otp on phone_number_otp(phone_number, otp)
  where verified_at is null;

create table sessions (
  id uuid primary key,
  user_id bigint,
  device_id text,
  user_agent text,
  logged_out_at timestamp with time zone,
  expires_at timestamp with time zone default now() + interval '1 month',
  created_at timestamp with time zone default now()
);

create view active_sessions as select
* from sessions
where logged_out_at is null and expires_at > now();