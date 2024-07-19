"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProject = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
// Helper function to execute shell commands as a promise
const executeCommand = (command, workingDirectory) => {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, { cwd: workingDirectory }, (error, stdout, stderr) => {
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
const buildProject = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const repoPath = path_1.default.join(__dirname, `output/${id}`);
    try {
        // Verifying npm cache instead of cleaning it
        console.log('Verifying npm cache...');
        yield executeCommand('npm cache verify', repoPath);
        // Navigate to the repository and install dependencies
        console.log('Installing dependencies...');
        yield executeCommand('npm install', repoPath);
        // Build the React application
        console.log('Building the application...');
        yield executeCommand('npm run build', repoPath);
        console.log('Build process completed successfully for ID: ' + id);
        return 'Build successful';
    }
    catch (error) {
        console.error('An error occurred during the build process:', error);
        throw new Error('Build failed: ' + error);
    }
});
exports.buildProject = buildProject;
