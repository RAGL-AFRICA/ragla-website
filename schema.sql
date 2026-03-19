-- Create the 'events' table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: To ensure only authenticated users can modify but anyone can read:
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON events FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON events FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON events FOR DELETE TO authenticated USING (true);

-- Create the 'gallery_images' table
CREATE TABLE gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: To ensure only authenticated users can modify but anyone can read:
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON gallery_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON gallery_images FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON gallery_images FOR DELETE TO authenticated USING (true);
-- Existing schema: events, gallery_images ...

-- Create the 'contact_messages' table
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: To ensure anyone can insert (contact form submitting) but only authenticated can read/update:
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert access for all users" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read for authenticated users only" ON contact_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable update for authenticated users only" ON contact_messages FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON contact_messages FOR DELETE TO authenticated USING (true);
-- Create the 'membership_applications' table
CREATE TABLE membership_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  profession TEXT NOT NULL,
  place_of_work TEXT NOT NULL,
  work_address TEXT NOT NULL,
  current_rank TEXT NOT NULL,
  work_experience TEXT NOT NULL,
  industry TEXT,
  academic_qualification TEXT NOT NULL,
  added_qualification TEXT,
  membership_category TEXT NOT NULL,
  payment_evidence_url TEXT NOT NULL,
  ragla_number TEXT,
  other_membership TEXT,
  passport_photo_url TEXT NOT NULL,
  resume_url TEXT NOT NULL,
  professional_referees TEXT NOT NULL,
  academic_referee TEXT,
  statement_of_purpose TEXT NOT NULL,
  certificates_url TEXT NOT NULL,
  membership_code TEXT UNIQUE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safe migration for existing databases
ALTER TABLE membership_applications
ADD COLUMN IF NOT EXISTS membership_code TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS membership_applications_membership_code_key
ON membership_applications (membership_code)
WHERE membership_code IS NOT NULL;

-- Enable RLS
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form submission)
CREATE POLICY "Enable insert access for all users" ON membership_applications FOR INSERT WITH CHECK (true);

-- Allow only authenticated users to read
CREATE POLICY "Enable read for authenticated users only" ON membership_applications FOR SELECT TO authenticated USING (true);

-- Allow only authenticated users to update
CREATE POLICY "Enable update for authenticated users only" ON membership_applications FOR UPDATE TO authenticated USING (true);

-- Allow only authenticated users to delete
CREATE POLICY "Enable delete for authenticated users only" ON membership_applications FOR DELETE TO authenticated USING (true);

-- Storage buckets used by the website uploads
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('events', 'events', true),
  ('gallery', 'gallery', true),
  ('membership_applications', 'membership_applications', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access so visitors can see uploaded flyers/gallery images/files
CREATE POLICY "Public read events bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'events');

CREATE POLICY "Public read gallery bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

CREATE POLICY "Public read membership bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'membership_applications');

-- Authenticated admins can upload and manage objects
CREATE POLICY "Authenticated write events bucket"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'events');

CREATE POLICY "Authenticated update events bucket"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'events');

CREATE POLICY "Authenticated delete events bucket"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'events');

CREATE POLICY "Authenticated write gallery bucket"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Authenticated update gallery bucket"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'gallery');

CREATE POLICY "Authenticated delete gallery bucket"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'gallery');

-- Public form submissions need to upload application files
CREATE POLICY "Public write membership bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'membership_applications');

CREATE POLICY "Public update membership bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'membership_applications');

CREATE POLICY "Public delete membership bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'membership_applications');

-- News and posts table (for homepage updates + dedicated pages)
CREATE TABLE IF NOT EXISTS news_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT NOT NULL CHECK (category IN ('news', 'post')),
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON news_posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON news_posts;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON news_posts;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON news_posts;

CREATE POLICY "Enable read access for all users" ON news_posts FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON news_posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON news_posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON news_posts FOR DELETE TO authenticated USING (true);
