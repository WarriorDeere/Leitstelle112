import { fetchFrom } from "../../../backend/getData";

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
    const namesFile = await fetchFile('Leitstelle112/default', 'names');
    return new String(`${namesFile.first_names[Math.floor(Math.random() * namesFile.first_names.length)]} ${namesFile.last_names[Math.floor(Math.random() * namesFile.last_names.length)]}`);
}

async function randomCall(fileName: string, textHint: string | number) {
    const textFile = await fetchFile('Leitstelle112/default/calls', fileName);
    const callText = textFile[textHint][Math.floor(Math.random() * textFile[textHint].length)];
    const fillerTextFile = await fetchFile('Leitstelle112/default/calls', 'filler');
    const randomStartTxt = fillerTextFile.start[Math.floor(Math.random() * fillerTextFile.start.length)];
    const randomEndTxt = fillerTextFile.end[Math.floor(Math.random() * fillerTextFile.end.length)];

    return new String(randomStartTxt + callText + randomEndTxt);
}

export async function randomMission() {
    const missionsFile = await fetchFile('Leitstelle112/default', 'missions');
    const i = Math.floor(Math.random() * missionsFile.missions.length);
    const missionObject = missionsFile.missions[i];

    return {
        "header": {
            "title": `${missionObject.type.cago} - ${missionObject.type.desc}`,
            "type": missionObject.type.desc,
            "id": new String(crypto.randomUUID())
        },
        "mission": {
            "text": await randomCall(missionObject.type.file, missionObject.caller_hint),
            "caller": await randomName()
        }
    };
}