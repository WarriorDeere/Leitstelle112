import { randomMission } from "../frontend/script/gen/mission";
import { databaseAPI } from "./db";
import { logFile } from "./log";
import { WebviewWindow } from '@tauri-apps/api/window';

const mainWindow = WebviewWindow.getByLabel('app-window')!;

// await mainWindow.isMaximized()
//     .then((r) => {
//         if (!r) {
//             mainWindow.maximize();
//         }
//     });

document.addEventListener('DOMContentLoaded', async () => {
    await mainWindow.show();
});

const session_id = crypto.randomUUID();

if (!sessionStorage.getItem('session')) {
    sessionStorage.setItem('session', session_id);
    logFile.setup(session_id)
        .catch((err) => {
            throw new Error(err);
        });
    logFile.write('INFO', `current session: ${session_id}`, session_id)
        .catch((err) => {
            throw new Error(err);
        });
}

export const session = sessionStorage.getItem('session')!;

async function newMissionToDb() {

    const allOpenMissions = await databaseAPI.select({
        database: {
            name: "mission"
        },
        table: {
            name: "active_missions",
            options: "all"
        }
    })
        .catch((err) => {
            logFile.write('ERROR', err, session);
            throw new Error(err)
        });

    if (allOpenMissions.length < 15) {
        const missionData = await randomMission();
        await databaseAPI.insert({
            database: {
                name: "mission"
            },
            table: {
                name: "active_missions",
                columns: "'mission_uuid', 'mission_title', 'mission_type', 'mission_text', 'mission_caller'",
                values: `'${missionData.header.id}', '${missionData.header.title}', '${missionData.header.type}', '${missionData.mission.text}', '${missionData.mission.caller}'`
            }
        })
            .catch((err) => {
                logFile.write('ERROR', err, session);
                throw new Error(err)
            })

        logFile.write('INFO', `open missions: ${allOpenMissions.length}`, session);
        console.log(`open missions: ${allOpenMissions.length}`);
    }
    else {
        logFile.write('INFO', `limit reached. There're ${allOpenMissions.length} open missions. (max. are 15)`, session);
        console.log(`limit reached. There're ${allOpenMissions.length} open missions. (max. are 15)`);
    }
}

let timeoutSeconds = 300;

setInterval(() => {
    newMissionToDb();
}, timeoutSeconds * 1000)