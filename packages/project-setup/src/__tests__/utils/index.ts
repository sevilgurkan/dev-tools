import path from 'node:path';
import {isDeepStrictEqual} from 'node:util';

import fs from 'fs-extra';

export async function checkFilesExist(cwd: string, filePaths: string[]) {
  try {
    for (const filePath of filePaths) {
      const exists = await fs.pathExists(path.resolve(cwd, filePath));
      if (!exists) {
        return false;
      }
    }
    return true;
  } catch (error) {
    return false;
  }
}

type FileContent = string | object;

export async function checkValidFileContent(
  filePath: string,
  expectedContent: FileContent,
): Promise<boolean> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');

    if (filePath.endsWith('.js')) {
      const normalizedFile = normalizeJSContent(fileContent);
      const normalizedExpected = normalizeJSContent(expectedContent as string);
      return normalizedFile === normalizedExpected;
    }

    if (filePath.endsWith('.json') && typeof expectedContent === 'object') {
      let parsedContent;
      try {
        parsedContent = JSON.parse(fileContent);
      } catch (error) {
        return false;
      }

      return isDeepStrictEqual(parsedContent, expectedContent);
    }

    if (typeof expectedContent === 'string') {
      const normalizedFile = fileContent.replace(/\r\n/g, '\n').trim();
      const normalizedExpected = expectedContent.replace(/\r\n/g, '\n').trim();
      return normalizedFile === normalizedExpected;
    }

    return false;
  } catch (error) {
    return false;
  }
}

function normalizeJSContent(content: string): string {
  return content
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Yorumları kaldır
    .replace(/\s+/g, ' ') // Fazla boşlukları tek boşluğa indir
    .replace(/;\s*/g, ';') // Noktalı virgül sonrası boşlukları temizle
    .replace(/{\s*/g, '{') // Süslü parantez öncesi boşlukları temizle
    .replace(/\s*}/g, '}') // Süslü parantez sonrası boşlukları temizle
    .trim(); // Baş ve sondaki boşlukları temizle
}
