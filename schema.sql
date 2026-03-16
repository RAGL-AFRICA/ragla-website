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
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
