insert into plan_catalog (id, name, price, member_cap, is_enterprise, display_order) values
  ('starter', 'Starter', 2500, 50, false, 1),
  ('growth', 'Growth', 4500, 100, false, 2),
  ('pro', 'Pro', 6000, 150, false, 3),
  ('enterprise', 'Enterprise', null, 9999, true, 4)
on conflict (id) do nothing;

insert into payment_settings (
  id, active_provider, manual_upi_id, manual_account_name, manual_instructions
) values (
  'default',
  'manual',
  'getdownfitness@upi',
  'Get Down Foundation',
  'Transfer the monthly fee on UPI and tap I have paid. We activate the gym from the god panel the same day.'
) on conflict (id) do nothing;

insert into gyms (
  id, name, slug, city, address, phone, email, logo_url, cover_image_url,
  brand_color, about_text, established_year, opening_hours, plan, member_cap,
  subscription_status, trial_ends_at, current_period_end, domain_status,
  show_powered_by, onboarding_completed
) values (
  'gym_shakti',
  'Shakti Fitness',
  'shakti-fitness',
  'Prayagraj',
  '12/4 Muir Road, near Company Bagh, Prayagraj 211001',
  '0532-2461800',
  'hello@shaktifitness.in',
  '/getdown-logo.jpg',
  '/gym/cover.jpg',
  '#5B8C51',
  'Shakti Fitness is a neighbourhood gym in Prayagraj for people who want to train seriously without a chain-gym price. We opened in 2018 with two benches and a register. Today the floor is still the same size — the difference is we know every member by name, and we do not let a renewal slip.',
  2018,
  '{"mon":"6:00–22:00","tue":"6:00–22:00","wed":"6:00–22:00","thu":"6:00–22:00","fri":"6:00–22:00","sat":"6:00–21:00","sun":"7:00–13:00"}'::jsonb,
  'growth',
  100,
  'active',
  null,
  now() + interval '20 days',
  'none',
  true,
  true
) on conflict (id) do nothing;

insert into plans (id, gym_id, name, duration_days, price, is_active, display_order) values
  ('plan_monthly', 'gym_shakti', 'Monthly', 30, 1500, true, 1),
  ('plan_quarter', 'gym_shakti', 'Quarterly', 90, 4000, true, 2),
  ('plan_yearly', 'gym_shakti', 'Yearly', 365, 12000, true, 3)
on conflict (id) do nothing;

insert into members (id, gym_id, full_name, phone, email, gender, status, joined_at, notes) values
  ('mem_aman', 'gym_shakti', 'Aman Verma', '9415121001', 'aman.verma@email.com', 'male', 'active', current_date - 80, null),
  ('mem_priya', 'gym_shakti', 'Priya Singh', '9415121002', 'priya.singh@email.com', 'female', 'active', current_date - 200, null),
  ('mem_rahul', 'gym_shakti', 'Rahul Yadav', '9415121003', 'rahul.yadav@email.com', 'male', 'active', current_date - 140, 'Ask about back pain'),
  ('mem_sneha', 'gym_shakti', 'Sneha Mishra', '9415121004', 'sneha.mishra@email.com', 'female', 'pending', current_date, 'Self sign-up'),
  ('mem_vikram', 'gym_shakti', 'Vikram Patel', '9415121005', 'vikram.patel@email.com', 'male', 'active', current_date - 60, null),
  ('mem_anjali', 'gym_shakti', 'Anjali Tiwari', '9415121006', 'anjali.tiwari@email.com', 'female', 'active', current_date - 27, null),
  ('mem_arif', 'gym_shakti', 'Mohd. Arif', '9415121007', 'arif@email.com', 'male', 'expired', current_date - 400, null),
  ('mem_kavita', 'gym_shakti', 'Kavita Sharma', '9415121008', 'kavita.sharma@email.com', 'female', 'active', current_date - 90, null),
  ('mem_deepak', 'gym_shakti', 'Deepak Gupta', '9415121009', 'deepak.gupta@email.com', 'male', 'active', current_date - 110, null),
  ('mem_nisha', 'gym_shakti', 'Nisha Rai', '9415121010', 'nisha.rai@email.com', 'female', 'active', current_date - 45, null),
  ('mem_rohit', 'gym_shakti', 'Rohit Kumar', '9415121011', 'rohit.kumar@email.com', 'male', 'pending', current_date, 'QR sign-up'),
  ('mem_pooja', 'gym_shakti', 'Pooja Dubey', '9415121012', 'pooja.dubey@email.com', 'female', 'active', current_date - 300, null),
  ('mem_sanjay', 'gym_shakti', 'Sanjay Srivastava', '9415121013', 'sanjay.s@email.com', 'male', 'active', current_date - 18, null),
  ('mem_meena', 'gym_shakti', 'Meenakshi Jaiswal', '9415121014', 'meena.j@email.com', 'female', 'active', current_date - 70, null),
  ('mem_farhan', 'gym_shakti', 'Farhan Ali', '9415121015', 'farhan.ali@email.com', 'male', 'active', current_date - 12, null)
on conflict (id) do nothing;

insert into member_subscriptions (id, gym_id, member_id, plan_id, starts_on, ends_on, status, amount) values
  ('sub_aman', 'gym_shakti', 'mem_aman', 'plan_monthly', current_date - 25, current_date + 5, 'active', 1500),
  ('sub_priya', 'gym_shakti', 'mem_priya', 'plan_yearly', current_date - 200, current_date + 165, 'active', 12000),
  ('sub_rahul', 'gym_shakti', 'mem_rahul', 'plan_quarter', current_date - 70, current_date + 20, 'active', 4000),
  ('sub_vikram', 'gym_shakti', 'mem_vikram', 'plan_monthly', current_date - 10, current_date + 20, 'active', 1500),
  ('sub_anjali', 'gym_shakti', 'mem_anjali', 'plan_monthly', current_date - 27, current_date + 3, 'active', 1500),
  ('sub_arif', 'gym_shakti', 'mem_arif', 'plan_yearly', current_date - 400, current_date - 35, 'expired', 12000),
  ('sub_kavita', 'gym_shakti', 'mem_kavita', 'plan_quarter', current_date - 40, current_date + 50, 'active', 4000),
  ('sub_deepak', 'gym_shakti', 'mem_deepak', 'plan_yearly', current_date - 110, current_date + 255, 'active', 12000),
  ('sub_nisha', 'gym_shakti', 'mem_nisha', 'plan_monthly', current_date - 8, current_date + 22, 'active', 1500),
  ('sub_pooja', 'gym_shakti', 'mem_pooja', 'plan_yearly', current_date - 300, current_date + 65, 'active', 12000),
  ('sub_sanjay', 'gym_shakti', 'mem_sanjay', 'plan_monthly', current_date - 18, current_date + 12, 'active', 1500),
  ('sub_meena', 'gym_shakti', 'mem_meena', 'plan_quarter', current_date - 20, current_date + 70, 'active', 4000),
  ('sub_farhan', 'gym_shakti', 'mem_farhan', 'plan_monthly', current_date - 12, current_date + 18, 'active', 1500)
on conflict (id) do nothing;

insert into checkins (id, gym_id, member_id, checked_in_at, source)
select
  'chk_' || gs::text,
  'gym_shakti',
  case (gs % 8)
    when 0 then 'mem_aman'
    when 1 then 'mem_priya'
    when 2 then 'mem_vikram'
    when 3 then 'mem_kavita'
    when 4 then 'mem_nisha'
    when 5 then 'mem_pooja'
    when 6 then 'mem_sanjay'
    else 'mem_meena'
  end,
  now() - (gs * interval '9 hours'),
  'gate'
from generate_series(1, 48) as gs
on conflict (id) do nothing;

insert into enquiries (id, gym_id, name, phone, message, status, created_at) values
  ('enq_1', 'gym_shakti', 'Alok Pandey', '9876543210', 'Do you have a ladies batch in the morning?', 'new', now() - interval '2 hours'),
  ('enq_2', 'gym_shakti', 'Ritu Sen', '9876543211', 'Personal training rates for weight loss.', 'new', now() - interval '1 day'),
  ('enq_3', 'gym_shakti', 'Gaurav Jain', '9876543212', 'Can I freeze a membership for two months?', 'closed', now() - interval '6 days')
on conflict (id) do nothing;

insert into trainers (id, gym_id, name, photo_url, speciality, bio, display_order, is_visible) values
  ('tr_arjun', 'gym_shakti', 'Arjun Mishra', '/gym/trainer-arjun.jpg', 'Strength & powerlifting', 'Former state-level lifter. Trains the early-morning heavy crew.', 1, true),
  ('tr_meera', 'gym_shakti', 'Meera Kapoor', '/gym/trainer-meera.jpg', 'Weight loss & conditioning', 'Eight years coaching busy professionals who can only train at lunch.', 2, true)
on conflict (id) do nothing;

insert into trainer_clients (trainer_id, member_id, gym_id) values
  ('tr_arjun', 'mem_aman', 'gym_shakti'),
  ('tr_arjun', 'mem_vikram', 'gym_shakti'),
  ('tr_arjun', 'mem_sanjay', 'gym_shakti'),
  ('tr_meera', 'mem_priya', 'gym_shakti'),
  ('tr_meera', 'mem_anjali', 'gym_shakti'),
  ('tr_meera', 'mem_nisha', 'gym_shakti')
on conflict do nothing;

insert into amenities (id, gym_id, name, icon, description, image_url, display_order, is_visible) values
  ('am_ac', 'gym_shakti', 'Air conditioning', 'wind', 'The floor stays cool even in May.', null, 1, true),
  ('am_lock', 'gym_shakti', 'Lockers', 'lock', 'Day lockers next to the changing rooms.', '/gym/amenity-lockers.jpg', 2, true),
  ('am_water', 'gym_shakti', 'Drinking water', 'droplets', 'RO water, refilled twice a day.', null, 3, true),
  ('am_park', 'gym_shakti', 'Two-wheeler parking', 'car', 'Covered parking on Muir Road.', null, 4, true),
  ('am_pt', 'gym_shakti', 'Personal training', 'user', 'Arjun and Meera take a limited number of clients.', null, 5, true),
  ('am_yoga', 'gym_shakti', 'Stretching corner', 'waves', 'Mats and a quiet corner after 8pm.', '/gym/amenity-yoga.jpg', 6, true)
on conflict (id) do nothing;

insert into equipment (id, gym_id, name, icon, description, image_url, display_order, is_visible) values
  ('eq_db', 'gym_shakti', 'Dumbbells', 'dumbbell', '2.5 kg to 40 kg, paired.', '/gym/equipment-dumbbells.jpg', 1, true),
  ('eq_tm', 'gym_shakti', 'Treadmills', 'activity', 'Four commercial treadmills.', null, 2, true),
  ('eq_rack', 'gym_shakti', 'Squat rack', 'columns-3', 'Two racks with safety arms.', null, 3, true),
  ('eq_cable', 'gym_shakti', 'Cable machines', 'stretch-horizontal', 'Dual pulley and lat pulldown.', null, 4, true),
  ('eq_bench', 'gym_shakti', 'Benches', 'armchair', 'Flat, incline, and decline.', null, 5, true)
on conflict (id) do nothing;

insert into testimonials (id, gym_id, member_name, quote, rating, is_visible) values
  ('ts_1', 'gym_shakti', 'Priya Singh', 'They messaged me three days before my yearly ended. In my last gym I found out I had expired when the gate did not open.', 5, true),
  ('ts_2', 'gym_shakti', 'Aman Verma', 'Arjun does not let me skip legs. The place is small and that is why it works.', 5, true)
on conflict (id) do nothing;

insert into transformations (id, gym_id, member_name, story, before_url, after_url, is_visible) values
  ('tf_1', 'gym_shakti', 'Rahul Yadav', '14 kg down in eight months. No crash diet — Meera just made the lunch box boring and the squats honest.', '/gym/transform-rahul.jpg', '/gym/transform-rahul.jpg', true)
on conflict (id) do nothing;

insert into member_programs (id, gym_id, member_id, trainer_id, workout_text, diet_text) values
  ('prg_aman', 'gym_shakti', 'mem_aman', 'tr_arjun',
   E'Mon — Squat 5x5, RDL 4x8, walking lunges\nWed — Bench 5x5, rows, face pulls\nFri — Deadlift 5x3, pull-ups, core',
   E'Breakfast: 4 eggs + roti\nLunch: dal, rice, sabzi, dahi\nDinner: chicken or paneer, salad\nWater: 4 litres'),
  ('prg_priya', 'gym_shakti', 'mem_priya', 'tr_meera',
   E'Tue — Treadmill intervals 20 min + full-body circuit\nThu — Hip thrust, cable kickback, core\nSat — Long walk + mobility',
   E'High protein, drop the evening chai-with-biscuit. 1.6g protein per kg.')
on conflict (id) do nothing;

insert into progress_logs (id, gym_id, member_id, logged_on, weight_kg, notes) values
  ('pl_1', 'gym_shakti', 'mem_aman', current_date - 40, 82.4, null),
  ('pl_2', 'gym_shakti', 'mem_aman', current_date - 20, 81.1, null),
  ('pl_3', 'gym_shakti', 'mem_aman', current_date - 2, 80.2, 'Belt feels looser')
on conflict (id) do nothing;

insert into leads (id, gym_name, owner_name, phone, city, member_count, message, status) values
  ('lead_1', 'Iron Temple Gym', 'Rakesh Dwivedi', '9935120001', 'Lucknow', 80, 'Currently on Excel. Want QR check-in.', 'new'),
  ('lead_2', 'FitZone Civil Lines', 'Neha Agarwal', '9935120002', 'Prayagraj', 40, 'How does the member app look on a cheap Android?', 'open')
on conflict (id) do nothing;

insert into payments (id, gym_id, amount, method, provider, status, reference, notes, created_at) values
  ('pay_1', 'gym_shakti', 4500, 'upi', 'manual', 'received', 'UPI/2049182', 'Growth plan — April', now() - interval '28 days'),
  ('pay_2', 'gym_shakti', 4500, 'upi', 'manual', 'pending', null, 'Growth plan — this month, owner says paid this morning', now() - interval '3 hours')
on conflict (id) do nothing;
