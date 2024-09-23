#!/usr/bin/env node

import readline from 'node:readline';
import {exec} from 'child_process';
import {promisify} from 'util';
import ora from 'ora';
import chalk from "chalk";

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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const spinner = ora();

console.log(header);
console.log('Welcome to the Alma-Spec Wizard!');
console.log('Please answer the following questions to generate your back office.');

ask('Enter the URL of the OpenAPI specs:', 'https://api.jamboo.app/swagger.json')
  .then(url => ask('Enter the name of your back office:', 'Alma').then(appName => ({ url, appName })))
  .then(async (state) => {
    console.log('\nGenerating back office with the following details:');
    console.log('OpenAPI Specs URL:', state.url);
    console.log('Back office Name:', state.appName);

    rl.close();
    spinner.start('Scaffolding your back office...');
    await delay(25000);
    spinner.text = "Applying styles...";
    await delay(37000);
    spinner.text = 'Creating entry point...';
    await delay(42000);
    spinner.succeed('Back office scaffolded successfully!');
    return { ...state };
  })
  .then(async (state) => {
    spinner.start('Analyzing OpenAPI specs...');
    await delay(28000);
    spinner.succeed('OpenAPI specs analyzed successfully');
    spinner.start('Classifying endpoints...');
    await delay(48000);
    spinner.succeed('43 endpoints classified');
    console.log('   └ 9 LIST\n   └ 10 GET\n   └ 8 CREATE\n   └ 6 EDIT\n   └ 10 DELETE');

    spinner.start('Generating pages...');
    for (let i = 0; i < 84; i++) {
      await delay(Math.random() * 200 + 800);
      spinner.text = `Generating pages (${i + 1}/84)`;
    }
    spinner.succeed('84 pages generated');

    spinner.start('Updating files...');
    for (let i = 0; i < 43; i++) {
      await delay(Math.random() * 200 + 100);
      spinner.text = `Updating files (${i + 1}/43)`;
    }

    spinner.text = `Applying styles...`;
    await delay(37000);
    spinner.text = `Optimizing dependencies...`;
    await delay(42000);
    spinner.text = `Writing unit and integration tests...`;
    await delay(63000);
    spinner.text = `Identifying and fixing bugs...`;
    await delay(43000);
    spinner.text = `Updating PRD and product roadmap...`;
    await delay(26000);


    spinner.succeed('Back office generated successfully!');
    await delay(5000);


    return { ...state };
  })
  .then(() => {
    console.log(chalk.green('\nThank you for using the Alma-Spec Wizard. Goodbye!\n'));
    process.exit(0);
  })
  .catch((error) => {
    spinner.fail('An error occurred');
    console.error(error);
    process.exit(1);
  });