alter table moments
add column if not exists relevance_score integer not null default 80 check (relevance_score >= 0 and relevance_score <= 100);
