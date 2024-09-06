#!/usr/bin/env node

import readline from 'node:readline';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import { createNextjsDashboard } from './repo.mjs';

const execAsync = promisify(exec);

const header = `
 █████╗ ██╗     ███╗   ███╗ █████╗       ███████╗██████╗ ███████╗ ██████╗
██╔══██╗██║     ████╗ ████║██╔══██╗      ██╔════╝██╔══██╗██╔════╝██╔════╝
███████║██║     ██╔████╔██║███████║█████╗███████╗██████╔╝█████╗  ██║     
██╔══██║██║     ██║╚██╔╝██║██╔══██║╚════╝╚════██║██╔═══╝ ██╔══╝  ██║     
██║  ██║███████╗██║ ╚═╝ ██║██║  ██║      ███████║██║     ███████╗╚██████╗
╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝      ╚══════╝╚═╝     ╚══════╝ ╚═════╝
`;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (question, prefill = '') => new Promise((resolve) => {
  rl.question(question + ' ', (answer) => {
    resolve(answer || prefill);
  });
  rl.write(prefill);
});

const kebabCase = (string) => string.replace(/\s+/g, '-').toLowerCase();

console.log(header);
console.log('Welcome to the Alma-Spec Wizard!');
console.log('Please answer the following questions to generate your app.');

ask('Enter the URL of the OpenAPI specs:', 'https://api-staging.jamboo.app/swagger.json')
  .then(url => ask('Enter the name of your app:', 'Alma').then(appName => ({ url, appName })))
  .then(async (state) => {
    console.log('\nGenerating app with the following details:');
    console.log('OpenAPI Specs URL:', state.url);
    console.log('App Name:', state.appName);
    
    const folderName = kebabCase(state.appName);
    
    // Check if the folder exists
    if (await fs.access(folderName).then(() => true).catch(() => false)) {
      const answer = await ask(`Folder "${folderName}" already exists. Do you want to delete it? (y/n):`, "y");
      if (answer.toLowerCase() !== 'y') {
        console.log('Operation cancelled. Please choose a different app name.');
        rl.close();
        process.exit(0);
      }
      await fs.rm(folderName, { recursive: true, force: true });
    }

    console.log('\nScaffolding your app...');

    await execAsync(`npx create-flowbite-react ${folderName} -- --template nextjs --git no`);
    await execAsync(`cd ${folderName} && npm install`);
    console.log(`\nNext.js app scaffolded in ./${folderName}`);

    rl.close();
    return state;
  })
  .then(async (state) => {
    console.log('\nScaffolding dashboard...');
    const folderPath = kebabCase(state.appName);
    await createNextjsDashboard(folderPath);
    console.log('Dashboard scaffolded successfully!');
    return state;
  })
  .then(() => {
    console.log('Thank you for using the Alma-Spec Wizard. Goodbye!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('An error occurred:', error);
    process.exit(1);
  });
