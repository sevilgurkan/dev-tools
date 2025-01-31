import path from 'node:path';
import {exec} from 'node:child_process';

import fs from 'fs-extra';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const generateTestTemplates = async () => {
  const templates = [
    {
      fileName: 'nextjs',
      command: 'npx create-next-app@latest nextjs --yes --skip-install',
    },
    {
      fileName: 'react-vite',
      command: 'npm create vite@latest react-vite -- --template react-ts',
    },
  ];

  const templateDir = path.resolve(
    __dirname,
    '..',
    'src',
    '__tests__',
    'templates',
  );

  const exists = await fs.pathExists(templateDir);
  if (exists) {
    await fs.rm(templateDir, {
      recursive: true,
      force: true,
    });
  }

  for (const {command} of templates) {
    await fs.ensureDir(templateDir);

    exec(command, {cwd: templateDir});
  }
};

if (import.meta.url === new URL(import.meta.url).href) {
  generateTestTemplates().catch((error) => {
    console.error('Generate test templates error:', error);
    process.exit(1);
  });
}
