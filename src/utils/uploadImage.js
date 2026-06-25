/**
 * Upload an image File to imgBB and return the hosted URL.
 */
export async function uploadImage(file) {
  const form = new FormData()
  form.append('image', file)

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
    { method: 'POST', body: form }
  )
  const data = await res.json()
  if (!data.success) throw new Error('Image upload failed')
  return data.data.url
}
