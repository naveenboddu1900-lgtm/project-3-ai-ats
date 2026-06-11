export async function persistResume(file) {
  if (!file) return { name: '', location: '' };
  return {
    name: file.originalname,
    location: `memory://${file.originalname}`
  };
}
