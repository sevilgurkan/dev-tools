import {setup} from '../src/commands/setup.js';
import {getPackageManager, Logger} from '../src/utils';

(async () => {
  if (import.meta.url === `file://${process.argv[1]}`) {
    const pm = await getPackageManager();

    const isNpx = process.env._?.includes('npx');
    const isPnpmDlx =
      process.env._?.includes('pnpm') && process.argv[1].includes('.pnpm');
    const isYarnDlx =
      process.env._?.includes('yarn') && process.argv[1].includes('.yarn');

    if (pm || isNpx || isPnpmDlx || isYarnDlx) {
      setup();
      return;
    }

    Logger.error('❌ Setup failed');
    process.exit(1);
  }
})();
