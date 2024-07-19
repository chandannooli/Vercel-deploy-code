import { exec } from "child_process";
import path from "path";

// Helper function to execute shell commands as a promise
const executeCommand = (command: string, workingDirectory: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        exec(command, { cwd: workingDirectory }, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                reject(error);
                return;
            }
            console.log(`stdout: ${stdout}`);
            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }
            resolve(stdout);
        });
    });
};

// Function to clean npm cache, install dependencies, and build the React app in sequence
export const buildProject = async (id: string): Promise<string> => {
    const repoPath = path.join(__dirname, `output/${id}`);
    try {
        // Verifying npm cache instead of cleaning it
        console.log('Verifying npm cache...');
        await executeCommand('npm cache verify', repoPath);

        // Navigate to the repository and install dependencies
        console.log('Installing dependencies...');
        await executeCommand('npm install', repoPath);

        // Build the React application
        console.log('Building the application...');
        await executeCommand('npm run build', repoPath);

        console.log('Build process completed successfully for ID: ' + id);
        return 'Build successful';
    } catch (error) {
        console.error('An error occurred during the build process:', error);
        throw new Error('Build failed: ' + error);
    }
};
