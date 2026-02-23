INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tulip-photos',
  'tulip-photos',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view tulip photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'tulip-photos');
