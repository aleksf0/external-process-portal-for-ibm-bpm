/* eslint-disable no-console */
import { chalkSuccess, chalkProcessing } from './chalkConfig';
import childProcess from 'child_process';

if (!process.env.DEPLOYMENT_VERSION) {

  console.log(chalkSuccess('The DEPLOYMENT_VERSION variable is not set, repository reset will not be performed.'));

} else {

  console.log(chalkProcessing(`The DEPLOYMENT_VERSION variable value is '${process.env.DEPLOYMENT_VERSION}'.`));

  let tag = null;

  if (process.env.DEPLOYMENT_VERSION === 'latest-tag') {
    tag = childProcess.execSync('git describe --abbrev=0').toString().trim();
  } else if (/^v\d+\.\d+\.\d+$/.test(process.env.DEPLOYMENT_VERSION)) {
    tag = process.env.DEPLOYMENT_VERSION;
  } else {
    // do nothing
  }

  console.log(chalkProcessing(`Tag resolved to '${tag}'.`));

  if (tag) {
    childProcess.execSync(`git reset --hard ${tag}`);
    console.log(chalkSuccess('Reset complete.'));
  } else {
    console.log(chalkSuccess('No tag, abort reset.'));
  }
}
