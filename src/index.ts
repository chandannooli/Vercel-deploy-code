import { createClient, commandOptions } from "redis";
import { copyFinalDist, downloadS3Folder } from "./AWS";
import { buildProject } from "./Utils";

const subscriber = createClient();
subscriber.connect();



async function main() {
    while(1) {
        const res = await subscriber.brPop(
            commandOptions({ isolated: true }),
            'build-queue',
            0
        );

        var id = null;

        if (res !== null) {
            id = res.element
        } else {
            console.log("Response was Null. Operation complete.");
            stop
        }
        
    

        await downloadS3Folder (`output/${id}`)
        console.log(`output/${id}`)
        await buildProject (`${id}`)
        await copyFinalDist (`${id}`)
		
    }
}
main();