import fs from 'fs/promises';
import path from 'path';
import { generateCompletion } from './openai.mjs';

/**
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function listFiles(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  const fileList = [];

  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      fileList.push(...await listFiles(filePath));
    } else {
      fileList.push(filePath);
    }
  }

  return fileList;
}

/**
 * @param {string} filePath
 * @returns {Promise<string>}
 */
async function readFile(filePath) {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return '';
  }
}

/**
 * @param {string} repoPath
 * @returns {Promise<string>}
 */
export async function concatenateRepoFiles(repoPath) {
  const files = await listFiles(repoPath);
  let concatenatedContent = '';

  for (const file of files) {
    const relativePath = path.relative(repoPath, file);
    const content = await readFile(file);
    concatenatedContent += `File: ${relativePath}\n\n${content}\n\n`;
  }

  return concatenatedContent;
}

/**
 * @param {Array<{path: string, content: string}>} files
 * @returns {Promise<void>}
 */
export async function updateFiles(files) {
  for (const file of files) {
    try {
      // Ensure the directory exists
      await fs.mkdir(path.dirname(file.path), { recursive: true });
      
      // Check if the file already exists
      const fileExists = await fs.access(file.path).then(() => true).catch(() => false);
      
      // Write the file, creating it if it doesn't exist
      await fs.writeFile(file.path, file.content, 'utf-8');
      
      if (fileExists) {
        console.log(`Updated file: ${file.path}`);
      } else {
        console.log(`Created file: ${file.path}`);
      }
    } catch (error) {
      console.error(`Error updating/creating file ${file.path}:`, error);
    }
  }
}

/**
 * @param {string} folderPath
 * @returns {Promise<void>}
 */
export async function createNextjsDashboard(folderPath) {
  const appPath = path.join(folderPath, 'app');
  const componentsPath = path.join(folderPath, 'components');

  // Read the contents of the app folder
  const appContent = await concatenateRepoFiles(appPath);

  // Read contents of components folder if it exists
  const componentsExists = await fs.access(componentsPath).then(() => true).catch(() => false);
  const componentsContent = componentsExists ? await concatenateRepoFiles(componentsPath) : '';

  // Create the prompt for GPT
  const prompt = `
Based on the following app${componentsContent ? ' and components' : ''} folder content, create a simple Next.js dashboard with an empty navigation sidebar using Flowbite React for UI components:

App folder content:
${appContent}

${componentsContent ? `Components folder content:
${componentsContent}

` : ''}Please provide the necessary code changes for the following files in a JSON format:
1. app/page.js (or app/page.tsx if using TypeScript)
2. app/layout.js (or app/layout.tsx)
3. components/Sidebar.js (or components/Sidebar.tsx)
4. app/globals.css

Ensure the dashboard has a clean, modern look using Flowbite React components. Include placeholder content for the main area, but keep the sidebar empty as we will be adding subpages later with further prompts. Make sure to import and use appropriate Flowbite React components such as Sidebar, Navbar, and any other relevant components for the dashboard layout.

Important:
- Name the main component in each file 'Page', 'Layout', and 'Sidebar' respectively.
- When importing components, use the exact same name as the exported component.
- Ensure all imports and exports are correctly named and matched.

Use the following Sidebar component as a reference for the layout, but remove all the Sidebar.Item components:

// components/Sidebar.js
"use client";

import { Sidebar as FlowbiteSidebar } from "flowbite-react";

export function Sidebar() {
  return (
    <FlowbiteSidebar aria-label="Empty sidebar example">
      <FlowbiteSidebar.Items>
        <FlowbiteSidebar.ItemGroup>
          {/* Sidebar items will be added later */}
        </FlowbiteSidebar.ItemGroup>
      </FlowbiteSidebar.Items>
    </FlowbiteSidebar>
  );
}

Respond with a JSON object where each key is the file path and the value is the file content.
`;

  const systemMessage = "You are an expert Next.js developer with extensive knowledge of Flowbite React. Provide concise, well-structured code for a dashboard layout with left sidebar navigation using Flowbite React components. Output your response as a JSON object.";

  const response = await generateCompletion(systemMessage, prompt);

const updatedFiles = JSON.parse(response);
const filesToUpdate = Object.entries(updatedFiles).map(([filePath, content]) => ({
    path: path.join(folderPath, filePath),
    content
}));
await updateFiles(filesToUpdate);
}


