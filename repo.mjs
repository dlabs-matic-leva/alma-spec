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

Include placeholder content for the main area in page.tsx, and implement the layout with Sidebar in layout.tsx. Make sure to import and use appropriate Flowbite React components such as Sidebar, Navbar, and any other relevant components for the dashboard layout.

Important:
- Name the main component in each file 'Page', 'RootLayout', and 'Sidebar' respectively.
- Include the Sidebar component in layout.tsx, not in page.tsx.
- Implement a basic layout in layout.tsx that includes the Sidebar and the main content area.

Use the following Sidebar component as a reference for the layout, but remove all the SidebarItem components:

// components/Sidebar.tsx
"use client";

import { Sidebar, SidebarItems, SidebarItemGroup } from "flowbite-react";

export function MySidebar() {
  return (
    <Sidebar aria-label="Empty sidebar example">
      <SidebarItems>
        <SidebarItemGroup>
          {/* Sidebar items will be added later */}
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}

For layout.tsx, implement a layout that includes the Sidebar and a main content area. Use Flowbite React components for structuring the layout if applicable.
`;

    const response = await generateCompletion(prompt);

  const updatedFiles = JSON.parse(response);
  const filesToUpdate = Object.entries(updatedFiles).map(([filePath, content]) => ({
    path: path.join(folderPath, filePath),
    content
  }));
  await updateFiles(filesToUpdate);
}



export async function generateListingPages(folderPath, classifications, openApiSpec) {
  const appPath = path.join(folderPath, 'app');
  const componentsPath = path.join(folderPath, 'components');

  // Read contents of app and components folders
  const appContent = await concatenateRepoFiles(appPath);
  const componentsContent = await concatenateRepoFiles(componentsPath);

  const listingEndpoints = Object.entries(classifications)
    .filter(([_, type]) => type === 'listing')
    .slice(0, 1);

  const pages = [];

  for (const [endpoint, _] of listingEndpoints) {
    const [method, path] = endpoint.split(' ');
    const pathParts = path.split('/').filter(part => part);
    const pageName = pathParts[pathParts.length - 1];
    const componentName = `${pageName.charAt(0).toUpperCase() + pageName.slice(1)}ListingPage`;

    const prompt = `
Based on the following app and components folder content, create a complete Next.js page component for a listing page for the endpoint: ${endpoint}

App folder content:
${appContent}

Components folder content:
${componentsContent}

Use the following OpenAPI spec for this endpoint:
${JSON.stringify(openApiSpec.paths[path][method.toLowerCase()])}

Requirements:
1. Use 'use client' at the top of the file.
2. Name the component '${componentName}'.
3. Use Flowbite React's Table component for displaying data.
4. Implement pagination using the Pagination component from flowbite-react.
5. Use the response schema to determine the table columns.
6. Add an Edit link in the last column of each row.
7. Implement a basic fetch function to get data from the API (pick hostname from OpenAPI specs).
8. Use React hooks for state management and side effects.
9. Handle loading and error states.
10. The file should be named 'page.tsx' and placed in the appropriate directory structure for Next.js 13+ app directory.

Important:
- Ensure the new component is consistent with the existing project structure and styling.
- Use appropriate TypeScript types for props, state, and functions.
- When importing components from 'flowbite-react', use named imports.
- Provide the complete file content for the new page component.

Respond with a JSON object where the key is the file path (e.g., "${pageName}/page.tsx") and the value is the complete file content.
`;

    const response = await generateCompletion(prompt);
    const parsedResponse = JSON.parse(response);
    
    const filePath = Object.keys(parsedResponse)[0];
    const content = parsedResponse[filePath];
    
    pages.push({
      name: pageName,
      path: filePath,
      content: content
    });
  }

  return pages;
}
  
export async function updateSidebar(folderPath, pages) {
  const appPath = path.join(folderPath, 'app');
  const componentsPath = path.join(folderPath, 'components');

  // Read contents of app and components folders
  const appContent = await concatenateRepoFiles(appPath);
  const componentsContent = await concatenateRepoFiles(componentsPath);

  const prompt = `
Based on the following app and components folder content, update the Sidebar component to include new navigation items for these pages: ${pages.map(p => p.name).join(', ')}

App folder content:
${appContent}

Components folder content:
${componentsContent}

Requirements:
9. Maintain the existing structure and styling of the sidebar.
10. Use relative paths for the 'href' prop in new SidebarItem components.

Important:
- Choose appropriate icons from the HeroIcons (hi) set for the new pages.
- Provide the complete updated Sidebar.tsx file content.
`;

  const response = await generateCompletion(prompt);
  const updatedFiles = JSON.parse(response);
  return updatedFiles['components/Sidebar.tsx'];
}
