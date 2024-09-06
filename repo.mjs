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
1. app/page.tsx
2. app/layout.tsx
3. components/Sidebar.tsx
4. app/globals.css

Ensure the dashboard has a clean, modern look using Flowbite React components. Include placeholder content for the main area, but keep the sidebar empty as we will be adding subpages later with further prompts. Make sure to import and use appropriate Flowbite React components such as Sidebar, Navbar, and any other relevant components for the dashboard layout.

Important:
- Use TypeScript for all components.
- Name the main component in each file 'Page', 'RootLayout', and 'Sidebar' respectively.
- When importing components from 'flowbite-react', use named imports (e.g., import { Sidebar, Navbar } from 'flowbite-react').
- Ensure all imports and exports are correctly named and matched.
- Use the 'use client' directive at the top of client components.

Use the following Sidebar component as a reference for the layout, but remove all the SidebarItem components:

// components/Sidebar.tsx
"use client";

import { Sidebar as FlowbiteSidebar, SidebarItems, SidebarItemGroup } from "flowbite-react";

export function Sidebar() {
  return (
    <FlowbiteSidebar aria-label="Empty sidebar example">
      <SidebarItems>
        <SidebarItemGroup>
          {/* Sidebar items will be added later */}
        </SidebarItemGroup>
      </SidebarItems>
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



export async function generateListingPages(classifications, openApiSpec) {
  const listingEndpoints = Object.entries(classifications)
    .filter(([_, type]) => type === 'listing')
    .slice(0, 1);

  const pages = [];

  for (const [endpoint, _] of listingEndpoints) {
    const [method, path] = endpoint.split(' ');
    const pathParts = path.split('/').filter(part => part);
    const pageName = pathParts[pathParts.length - 1];
    const componentName = `${pageName.charAt(0).toUpperCase() + pageName.slice(1)}ListingPage`;

    const system = "You are an expert Next.js and React developer with extensive knowledge of Flowbite React. Provide concise, well-structured code for a listing page using Flowbite React components. Output your response as a JSON object with a single key 'component' containing the entire component code.";

    const prompt = `
Create a complete Next.js page component for a listing page for the endpoint: ${endpoint}
Use the following OpenAPI spec for this endpoint:
${JSON.stringify(openApiSpec.paths[path][method.toLowerCase()])}

Requirements:
1. Use 'use client' at the top of the file.
2. Name the component '${componentName}'.
3. Use TypeScript for the component.
4. Include all necessary imports from flowbite-react, react, and any other required libraries.
5. Use Flowbite React's Table component for displaying data.
6. Implement pagination using the Pagination component from flowbite-react.
7. Use the response schema to determine the table columns.
8. Add an Edit link in the last column of each row.
9. Implement a basic fetch function to get data from the API (you can use a placeholder URL).
10. Use React hooks for state management and side effects.
11. Handle loading and error states.
12. Ensure the component has a clean, modern look using Flowbite React components.
13. Include appropriate TypeScript types.

Important:
- When importing components from 'flowbite-react', use named imports (e.g., import { Table, Pagination } from 'flowbite-react').
- Ensure all imports and exports are correctly named and matched.
- Use the 'use client' directive at the top of the file.
- Use arrow functions for the component and any internal functions.
- Provide comprehensive TypeScript types for all props, state, and functions.

Respond with a JSON object where the key is 'component' and the value is the complete file content.
`;

    const response = await generateCompletion(system, prompt);
    const pageContent = JSON.parse(response).component;
    pages.push({ name: pageName, content: pageContent });
  }

  return pages;
}
  
  export async function updateSidebar(pages) {
    const system = "You are an expert Next.js and React developer with extensive knowledge of Flowbite React. Provide concise, well-structured code for an updated sidebar component using Flowbite React components. Output your response as a JSON object with a single key 'component' containing the entire component code.";

    const prompt = `
Update the following sidebar component to include new navigation items for these pages: ${pages.map(p => p.name).join(', ')}

Current sidebar component:
import { Sidebar as FlowbiteSidebar, SidebarItems, SidebarItemGroup, SidebarItem } from 'flowbite-react';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from 'react-icons/hi';

export default function Sidebar() {
  return (
    <FlowbiteSidebar aria-label="Default sidebar example">
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem href="#" icon={HiChartPie}>
            Dashboard
          </SidebarItem>
          <SidebarItem href="#" icon={HiViewBoards} label="Pro" labelColor="dark">
            Kanban
          </SidebarItem>
          <SidebarItem href="#" icon={HiInbox} label="3">
            Inbox
          </SidebarItem>
          <SidebarItem href="#" icon={HiUser}>
            Users
          </SidebarItem>
          <SidebarItem href="#" icon={HiShoppingBag}>
            Products
          </SidebarItem>
          <SidebarItem href="#" icon={HiArrowSmRight}>
            Sign In
          </SidebarItem>
          <SidebarItem href="#" icon={HiTable}>
            Sign Up
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </FlowbiteSidebar>
  );
}

Requirements:
1. Use 'use client' at the top of the file as it's a client component.
2. Use TypeScript for the component.
3. Name the component 'Sidebar' and export it as the default.
4. Import individual components from flowbite-react (Sidebar, SidebarItems, SidebarItemGroup, SidebarItem).
5. Include all necessary imports from react-icons/hi, and any other required libraries.
6. Add new SidebarItem components for each new page, using appropriate icons.
7. Ensure the component has a clean, modern look using Flowbite React components.
8. Include appropriate TypeScript types.
9. Maintain the existing structure and styling of the sidebar.
10. Use relative paths for the 'href' prop in new SidebarItem components (e.g., '/users' for a Users page).

Important:
- Use full component names (e.g., SidebarItems instead of Sidebar.Items).
- When importing components from 'flowbite-react', use named imports.
- Ensure all imports and exports are correctly named and matched.
- Choose appropriate icons from the HeroIcons (hi) set for the new pages.
- Use an arrow function for the component.
- Provide comprehensive TypeScript types for props if applicable.

Respond with a JSON object where the key is 'component' and the value is the complete file content.
`;

    const response = await generateCompletion(system, prompt);
    return JSON.parse(response).component;
  }
