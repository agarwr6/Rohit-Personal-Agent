import { readFileSync } from 'fs';
import { join } from 'path';

const KB_DIR = join(process.cwd(), 'app', 'lib', 'knowledge');
const FILES = ['resume.md', 'projects.md', 'about.md', 'faq.md'];

// Read and concatenate the knowledge base once at module load.
// KB is small enough to fully inject — no RAG/retrieval needed.
export const KNOWLEDGE: string = FILES.map((f) => {
  const content = readFileSync(join(KB_DIR, f), 'utf-8');
  return `--- FILE: ${f} ---\n${content}`;
}).join('\n\n');
