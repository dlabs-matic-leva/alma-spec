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

  // Read the contents of the app folder
  const appContent = await concatenateRepoFiles(appPath);

  // Create the prompt for GPT
  const prompt = `
Based on the following app folder content, create a simple Next.js dashboard with navigation in the left sidebar using Flowbite React for UI components:

${appContent}

Please provide the necessary code changes for the following files in a JSON format:
1. app/page.js (or app/page.tsx if using TypeScript)
2. app/layout.js (or app/layout.tsx)
3. components/Sidebar.js (or components/Sidebar.tsx)
4. app/globals.css

Ensure the dashboard has a clean, modern look using Flowbite React components. Include placeholder content for demonstration purposes. Make sure to import and use appropriate Flowbite React components such as Sidebar, Navbar, and any other relevant components for the dashboard layout.

Respond with a JSON object where each key is the file path and the value is the file content.
`;

  const systemMessage = "You are an expert Next.js developer with extensive knowledge of Flowbite React. Provide concise, well-structured code for a dashboard layout with left sidebar navigation using Flowbite React components. Output your response as a JSON object.";

  // Generate the dashboard code using GPT
  const response = await generateCompletion(systemMessage, prompt);

  // Parse the response and update files
  try {
    const updatedFiles = JSON.parse(response);
    const filesToUpdate = Object.entries(updatedFiles).map(([filePath, content]) => ({
      path: path.join(folderPath, filePath),
      content
    }));
    await updateFiles(filesToUpdate);
    console.log("Next.js dashboard with Flowbite React components created successfully!");
  } catch (error) {
    console.error("Error parsing or updating files:", error);
  }
}


