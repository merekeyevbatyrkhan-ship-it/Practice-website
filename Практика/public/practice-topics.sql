-- Учебная таблица. Анонимный API может только читать эти данные.
begin;

create table if not exists public.practice_topics (
  id bigint primary key,
  title text not null,
  platform text not null check (platform in ('Vercel', 'Supabase')),
  done boolean not null default false
);

alter table public.practice_topics enable row level security;
revoke all on table public.practice_topics from public, anon, authenticated;
grant select on table public.practice_topics to anon;

drop policy if exists practice_topics_anon_read on public.practice_topics;
create policy practice_topics_anon_read on public.practice_topics
  for select to anon using (true);

insert into public.practice_topics (id, title, platform, done) values
  (1, 'Первый деплой', 'Vercel', true),
  (2, 'Переменные окружения', 'Vercel', false),
  (3, 'Подключение проекта', 'Supabase', true),
  (4, 'Таблицы и RLS', 'Supabase', false),
  (5, 'Serverless-функции', 'Vercel', false),
  (6, 'Auth и Storage', 'Supabase', false)
on conflict (id) do nothing;

commit;
