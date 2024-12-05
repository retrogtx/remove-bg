import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function createBucketIfNotExists() {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets()
  
  if (!buckets?.find(b => b.name === 'upload')) {
    await supabaseAdmin.storage.createBucket('upload', {
      public: false,
      fileSizeLimit: 100 * 1024 * 1024 // 100MB
    })
  }
} 