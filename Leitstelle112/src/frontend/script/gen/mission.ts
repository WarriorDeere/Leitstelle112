import { session } from "../../../backend/backend_setup";
import { fetchFrom } from "../../../backend/getData";
import { logFile } from "../../../backend/log";

function fetchFile(filePath: string, fileName: string) {
    return new Promise<any>(async (resolve, reject) => {
        await fetchFrom.file(filePath, fileName)
            .then((fileContent: any) => {
                resolve(JSON.parse(fileContent));
            })
            .catch((err) => {
                reject(err);
            })
    });
};

async function randomName() {
    return new Promise<any>(async (resolve, reject) => {
        try {
            const namesFile = await fetchFile('Leitstelle112/default', 'names');
            resolve(new String(`${namesFile.first_names[Math.floor(Math.random() * namesFile.first_names.length)]} ${namesFile.last_names[Math.floor(Math.random() * namesFile.last_names.length)]}`))
        } catch (err) {
            reject(err)
        }
    })
}

async function randomCall(fileName: string, textHint: string | number) {
    return new Promise<any>(async (resolve, reject) => {
        try {
            const textFile = await fetchFile('Leitstelle112/default/calls', fileName);
            const callText = textFile[textHint][Math.floor(Math.random() * textFile[textHint].length)];
            const fillerTextFile = await fetchFile('Leitstelle112/default/calls', 'filler');
            const randomStartTxt = fillerTextFile.start[Math.floor(Math.random() * fillerTextFile.start.length)];
            const randomEndTxt = fillerTextFile.end[Math.floor(Math.random() * fillerTextFile.end.length)];
            resolve(new String(randomStartTxt + callText + randomEndTxt))
        } catch (err) {
            reject(err)
        }
    })
}

type randomMissionPromise = {
    "header": {
        "title": string,
        "type": string,
        "id": string
    },
    "mission": {
        "text": string,
        "caller": string
    }
}

let lastCalled = 0;
const cooldown = 1000;

export async function randomMission() {
    return new Promise<randomMissionPromise>(async (resolve, reject) => {
        try {
            const missionsFile = await fetchFile('Leitstelle112/default', 'missions');
            const i = Math.floor(Math.random() * missionsFile.missions.length);
            const missionObject = missionsFile.missions[i];
            const mission_uuid = crypto.randomUUID();

            const currentTime = Date.now();

            if (currentTime - lastCalled >= cooldown) {
                lastCalled = currentTime;
                resolve({
                    "header": {
                        "title": `${missionObject.type.cago} - ${missionObject.type.desc}`,
                        "type": missionObject.type.desc,
                        "id": mission_uuid
                    },
                    "mission": {
                        "text": await randomCall(missionObject.type.file, missionObject.caller_hint),
                        "caller": await randomName()
                    }
                })
                logFile.write('INFO', `new mission: ${mission_uuid}: (category: ${missionObject.type.cago} | description: ${missionObject.type.desc})`, session);
            }
            else {
                const remainingTime = Math.ceil((lastCalled + cooldown - currentTime) / 1000)
                reject(`randomMission() is on cooldown! Try again in ${remainingTime}s`)
                logFile.write('WARNING', `randomMission() is on cooldown! Try again in ${remainingTime}s`, session);
            }

        } catch (err) {
            logFile.write('ERROR', `mission generation failed: ${err}`, session);
            reject(err)
        }
    })
}