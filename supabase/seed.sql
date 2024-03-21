insert into auth.users (id, email, email_confirmed_at)
select gen_random_uuid(), i || '@example.com', now()
from generate_series(1, 99) as i
union values (gen_random_uuid(), 'mrcaidev@gmail.com', now());
