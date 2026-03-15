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
