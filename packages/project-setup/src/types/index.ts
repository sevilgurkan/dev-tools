import type {PM} from 'detect-package-manager';

export type PackageManager = Exclude<PM, 'bun'>;

export interface SetupOptions {
  useBitbucket: boolean;
  pm: PackageManager;
  cwd: string;
}
