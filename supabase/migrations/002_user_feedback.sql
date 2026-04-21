-- User feedback (bug reports, suggestions, praise)
-- Mounted by /api/user/feedback and the FeedbackWidget in the dashboard.
CREATE TABLE IF NOT EXISTS public.user_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  category TEXT NOT NULL CHECK (category IN ('bug', 'suggestion', 'praise', 'other')),
  message TEXT NOT NULL,
  rating SMALLINT CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  page TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'triaged', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_feedback_user_idx ON public.user_feedback (user_id);
CREATE INDEX IF NOT EXISTS user_feedback_category_idx ON public.user_feedback (category);
CREATE INDEX IF NOT EXISTS user_feedback_created_idx ON public.user_feedback (created_at DESC);

-- RLS: users can insert and read their own rows; staff read everything via
-- service role. The API uses the service role key, so these policies are
-- mostly defensive if anon key ever reaches this table.
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "users insert own feedback"
    ON public.user_feedback FOR INSERT
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "users read own feedback"
    ON public.user_feedback FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- Recommended therapists (curated directory).
-- Local practices + online platforms the team vouches for.
CREATE TABLE IF NOT EXISTS public.recommended_therapists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('local', 'online')),
  name TEXT NOT NULL,
  summary TEXT,
  specialties TEXT[] DEFAULT '{}',
  website_url TEXT,
  booking_url TEXT,
  phone TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  postal_code TEXT,
  -- For online platforms
  platform_tier TEXT,        -- e.g. 'consumer', 'enterprise', 'hybrid'
  insurance_accepted TEXT[],
  price_range TEXT,          -- e.g. '$', '$$', '$$$'
  rating NUMERIC(3,2),
  review_count INTEGER DEFAULT 0,
  logo_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS recommended_therapists_kind_idx ON public.recommended_therapists (kind);
CREATE INDEX IF NOT EXISTS recommended_therapists_city_idx ON public.recommended_therapists (city);
CREATE INDEX IF NOT EXISTS recommended_therapists_featured_idx ON public.recommended_therapists (featured DESC, rating DESC);

ALTER TABLE public.recommended_therapists ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "public read recommended therapists"
    ON public.recommended_therapists FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
