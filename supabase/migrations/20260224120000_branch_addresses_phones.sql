-- Update branch addresses and phones to Sri Lanka locations (+94 format).

update public.branches set address = 'Kandy road, Kurunegala', phone = '+94 37 030 3000', updated_at = now() where name = 'Kurunegala';
update public.branches set address = 'Kandy road, Mallawapitiya, Kurunegala', phone = '+94 37 020 2000', updated_at = now() where name = 'Mallawapitiya';
update public.branches set address = 'Kandy road, Paragahadeniya, Kurunegala', phone = '+94 37 040 4000', updated_at = now() where name = 'Paragahadeniya';
update public.branches set address = 'Kandy road, Theliyagonna, Kurunegala', phone = '+94 37 010 1000', updated_at = now() where name = 'Theliyagonna';
