import {setup} from '../src/commands/setup.js';
import {Logger} from '../src/utils';
import {getPackageManager} from '../src/utils/get-package-manager.js';

(async () => {
  console.log('Module loaded:', import.meta.url);
  console.log('Process argv:', process.argv[1]);
  console.log('Process env:', process.env._);
  console.log(
    'Process env npm_config_user_agent:',
    process.env.npm_config_user_agent,
  );

  if (import.meta.url === `file://${process.argv[1]}`) {
    const isDirectNodeExecution =
      !process.env._ || process.env._.endsWith('node');

    if (isDirectNodeExecution) {
      console.log('Setup is running through direct node execution');
      await setup();
      return;
    }

    const pm = await getPackageManager();

    const isNpx = process.env._?.includes('npx');
    const isPnpmDlx =
      process.env._?.includes('pnpm') && process.argv[1].includes('.pnpm');
    const isYarnDlx =
      process.env._?.includes('yarn') && process.argv[1].includes('.yarn');

    if (pm || isNpx || isPnpmDlx || isYarnDlx) {
      console.log('Setup is running');
      await setup();
      return;
    }

    Logger.error('❌ Setup failed');
    process.exit(1);
  }
})();
