import { supabaseClient } from '@/lib/supabase-client'

export async function uploadToSupabase(
  file: File, 
  userId: string
) {
  const fileName = `${userId}/${Date.now()}-${file.name}`
  
  console.log('Attempting upload with path:', fileName)
  
  const { data, error } = await supabaseClient
    .storage
    .from('upload')
    .upload(fileName, file)

  if (error) {
    console.error('Supabase upload error details:', error)
    throw new Error(`Upload failed: ${error.message}`)
  }

  return data.path
} 