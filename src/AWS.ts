import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";

const s3= new S3({
    accessKeyId: "843025fbbc1a11529d9886dd7a3bde22",
    secretAccessKey: "0f587fc2f03e6aaaa4049b46296b0de8a748ec3a485a51a03e8f6fa190b3bfcd",
    endpoint: "https://84e761527c3629c31e8a5a30fe2d8e12.r2.cloudflarestorage.com" 
})

export async function downloadS3Folder(prefix: string) { //function to downloading from the cloud, hence if the folder is built then the connection is working
    const allFiles = await s3.listObjectsV2({            // allFiles looks like this [output/asdasd/index.html, output/asdasd/index.css]. i.e. copying all the files in this variable
        Bucket: "vercel-homeproject",
        Prefix: prefix
    }).promise();
    
    // 
    const allPromises = allFiles.Contents?.map(async ({Key}) => {
        return new Promise(async (resolve) => {
            if (!Key) {
                resolve("");
                return;
            }
            const finalOutputPath = path.join(__dirname, Key);
            const outputFile = fs.createWriteStream(finalOutputPath);
            const dirName = path.dirname(finalOutputPath);
            if (!fs.existsSync(dirName)){                       //making sure that the path exists before saving the file
                fs.mkdirSync(dirName, { recursive: true });
            }
            s3.getObject({                                      //getting object from S3 and creating a pipe output for the opbejct
                Bucket: "vercel-homeproject",
                Key: Key || ""
            }).createReadStream().pipe(outputFile).on("finish", () => {
                resolve("");
            })
        })
    }) || []
    console.log("awaiting");

    await Promise.all(allPromises?.filter(x => x !== undefined));
}

export function copyFinalDist(id: string) {
    const folderPath = path.join(__dirname, `output/${id}/build`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach((file: any) => {
        uploadFile(`build/${id}/` + file.slice(folderPath.length +1), file);
    })
}

export const uploadFile = async (fileName: string, localFilePath: string) => {
    console.log("Called")
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel-homeproject",
        Key: fileName,
    }).promise();
    console.log(response);
}

export const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath))
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
}