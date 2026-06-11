import pdfParse from 'pdf-parse';

export async function extractResumeText(file) {
  if (!file) return '';
  const original = file.originalname.toLowerCase();
  if (original.endsWith('.pdf')) {
    try {
      const parsed = await pdfParse(file.buffer);
      return parsed.text;
    } catch {
      return file.buffer.toString('utf8');
    }
  }
  return file.buffer.toString('utf8');
}
