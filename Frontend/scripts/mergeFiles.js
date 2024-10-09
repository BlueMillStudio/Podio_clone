// scripts/mergeFiles.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Merges files in a directory into a single output file.
 * @param {string} rootDirectory - The root directory to traverse.
 * @param {string} outputFile - The path to the output file.
 * @param {Array<string>} excludeFolders - Folders to exclude.
 */
function mergeFilesInDirectory(rootDirectory, outputFile, excludeFolders = []) {
    // Check if rootDirectory exists
    if (!fs.existsSync(rootDirectory)) {
        console.error(`The root directory "${rootDirectory}" does not exist.`);
        process.exit(1);
    }

    // Create or overwrite the output file
    fs.writeFileSync(outputFile, '', 'utf8');

    // Function to recursively traverse directories
    function traverseDirectory(currentPath) {
        const items = fs.readdirSync(currentPath, { withFileTypes: true });

        for (const item of items) {
            const itemPath = path.join(currentPath, item.name);

            if (item.isDirectory()) {
                if (!excludeFolders.includes(item.name)) {
                    traverseDirectory(itemPath);
                }
            } else if (item.isFile()) {
                try {
                    const content = fs.readFileSync(itemPath, 'utf8');
                    fs.appendFileSync(
                        outputFile,
                        `\n--- Content from: ${itemPath} ---\n${content}\n`
                    );
                } catch (err) {
                    if (err instanceof SyntaxError) {
                        console.error(`Skipping file due to encoding error: ${itemPath}`);
                    } else {
                        console.error(`An unexpected error occurred while processing ${itemPath}: ${err}`);
                    }
                }
            }
        }
    }

    traverseDirectory(rootDirectory);
    console.log(`All files (excluding ${excludeFolders}) have been merged into ${outputFile}`);
}

// Usage Example
// Corrected rootDirectory path
const rootDirectory = path.resolve(__dirname, '..', 'src/pages'); // Adjusted to point to the project root's src
const outputFile = path.resolve(__dirname, '..', 'merged_output.txt'); // Output at project root
const excludeFolders = ['node_modules'];

mergeFilesInDirectory(rootDirectory, outputFile, excludeFolders);
