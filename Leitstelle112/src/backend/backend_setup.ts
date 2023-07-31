import { randomMission } from "../frontend/script/gen/mission";
import { databaseAPI } from "./db";
import { logFile } from "./log";

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
    const missionData = await randomMission();
    databaseAPI.insert({
        database: {
            name: "mission"
        },
        table: {
            name: "active_missions",
            columns: "'mission_uuid', 'mission_title', 'mission_type', 'mission_text', 'mission_caller'",
            values: `'${missionData.header.id}', '${missionData.header.title}', '${missionData.header.type}', '${missionData.mission.text}', '${missionData.mission.caller}'`
        }
    })
}

// newMissionToDb();