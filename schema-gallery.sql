-- Create the 'gallery_folders' table
CREATE TABLE gallery_folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: We assume the `gallery_images` table already exists.
-- We safely add the `folder_id` column to it.
ALTER TABLE gallery_images 
ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES gallery_folders(id) ON DELETE CASCADE;

-- Enable RLS for the new table
ALTER TABLE gallery_folders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read folders (for the public gallery)
CREATE POLICY "Enable read for all users" ON gallery_folders FOR SELECT USING (true);

-- Allow only authenticated users to insert, update, delete
CREATE POLICY "Enable insert for authenticated users only" ON gallery_folders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON gallery_folders FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON gallery_folders FOR DELETE TO authenticated USING (true);
