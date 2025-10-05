import { spawn } from "child_process";

export const runPythonScript = (scriptPath, input = {}, args = []) => {
    return new Promise((resolve, reject) => {
        const process = spawn("python3", [scriptPath, ...args]);

        let data="";
        let error="";

        if(Object.keys(input).length) {
            process.stdin.write(JSON.stringify(input));
            process.stdin.end();
        }

        process.stdout.on("data", (chunk) => (data += chunk.toString()));
        process.stderr.on("data", (chunk) => (error += chunk.toString()));

        process.on("close", (code) => {
            if(code != 0) return reject(error || "Unkonwn Python Error");
            resolve(data.trim());
        })
        
    })
}