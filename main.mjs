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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'CLI> '
});

console.log(header);
console.log('Interactive CLI started. Type "exit" to quit.');
rl.prompt();

rl.on('line', (line) => {
  const input = line.trim();
  if (input === 'exit') {
    rl.close();
    return;
  }

  const [command, ...args] = input.split(' ');
  switch (command) {
    case 'hello':
      if (args.length === 0) {
        console.log('Error: Name is required for the hello command.');
      } else {
        console.log(`Hello, ${args[0]}!`);
      }
      break;
    default:
      console.log(`Unknown command: ${command}`);
  }

  rl.prompt();
}).on('close', () => {
  console.log('Exiting CLI. Goodbye!');
  process.exit(0);
});
