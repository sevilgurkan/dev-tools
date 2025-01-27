import type {PM} from 'detect-package-manager';

export type PackageManager = Exclude<PM, 'bun'>;
