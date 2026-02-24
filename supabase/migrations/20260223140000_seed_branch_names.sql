-- FN Family Mart: set branch names to Theliyagonna, Mallawapitiya, Kurunegala, Paragahadeniya.
-- Images in public: theliyagonna.jpg, mallawapitiya.jpg, kurunegala.jpg, paragahadeniya.jpg

-- 1) If no branches exist, insert the four.
insert into public.branches (name, address, is_active)
select v.name, v.address, true
from (values
  ('Theliyagonna', 'Theliyagonna, Sri Lanka'),
  ('Mallawapitiya', 'Mallawapitiya, Sri Lanka'),
  ('Kurunegala', 'Kurunegala, Sri Lanka'),
  ('Paragahadeniya', 'Paragahadeniya, Sri Lanka')
) as v(name, address)
where (select count(*) from public.branches) = 0;

-- 2) If branches already exist, rename the first 4 (by created_at) to these names.
with ordered as (
  select id, row_number() over (order by created_at) as rn
  from public.branches
),
names as (
  select 1 as rn, 'Theliyagonna' as name union all
  select 2, 'Mallawapitiya' union all
  select 3, 'Kurunegala' union all
  select 4, 'Paragahadeniya'
)
update public.branches b
set name = n.name, updated_at = now()
from ordered o
join names n on n.rn = o.rn
where b.id = o.id;
