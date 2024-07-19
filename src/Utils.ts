import { exec, spawn } from "child_process";
import path from "path";

console.log("Reached Building stage 1")
export function buildProject(id: string) {
    return new Promise((resolve) => {
        console.log("Reached Building stage function 2")

        console.log('CHECK')

        console.log(`DIR NAME ${__dirname}`)

        console.log('CHECK2', `output/${id}}`)

        const child = exec(`cd ${path.join(__dirname, `output/${id}`)} && npm install && npm run build`)

        console.log('vv', child);

        child.stdout?.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        child.stderr?.on('data', function(data) {
            console.log('stderr: ' + data);
        });

        child.on('close', function(code) {
           resolve("")
        });

    })
}