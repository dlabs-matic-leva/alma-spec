#!/usr/bin/env node

import readline from 'node:readline';

const header = `
 █████╗ ██╗     ███╗   ███╗ █████╗       ███████╗██████╗ ███████╗ ██████╗
██╔══██╗██║     ████╗ ████║██╔══██╗      ██╔════╝██╔══██╗██╔════╝██╔════╝
███████║██║     ██╔████╔██║███████║█████╗███████╗██████╔╝█████╗  ██║     
██╔══██║██║     ██║╚██╔╝██║██╔══██║╚════╝╚════██║██╔═══╝ ██╔══╝  ██║     
██║  ██║███████╗██║ ╚═╝ ██║██║  ██║      ███████║██║     ███████╗╚██████╗
╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝      ╚══════╝╚═╝     ╚══════╝ ╚═════╝
`;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (question) => new Promise((resolve) => rl.question(question + ' ', resolve));

console.log(header);
console.log('Welcome to the Alma-Spec Wizard!');
console.log('Please answer the following questions to generate your app.');

ask('Enter the URL of the OpenAPI specs:')
  .then(url => ask('Enter the name of your app:').then(appName => ({ url, appName })))
  .then(state => {
    console.log('\nGenerating app with the following details:');
    console.log('OpenAPI Specs URL:', state.url);
    console.log('App Name:', state.appName);
    console.log('\nApp generation complete!');
    rl.close();
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
