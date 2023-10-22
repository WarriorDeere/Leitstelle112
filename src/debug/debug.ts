import { session } from "../backend/backend_setup";
import { databaseAPI } from "../backend/db";
import { logFile } from "../backend/log";

export default function runDebugScript() {
    console.debug('starting debug script');
    logFile.write('DEBUG', 'debug script started', session)

    databaseAPI.delete({
        database: {
            name: "items"
        },
        table: {
            name: "buildings",
            condition: "building_type='fire'"
        }
    })
        .then((r) => {
            console.log(r);
        })

        .catch((err) => {
            throw new Error(err);
        })

}