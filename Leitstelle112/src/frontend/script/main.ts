import { TT_API_KEY } from "../env.ts";
import { database } from "./database.ts";
import { genLocation } from "./gen/location.ts";
import { itemOnMap } from "./gen/onmap.ts";
import { dialog } from "./ui/dialog.ts";

export const newMission = new Worker('../../script/gen/mission.ts');

database.get({
    'database': 'mission',
    'version': 1,
    'object_store': 'mission_active',
    'keyPath': 'mission'
}).then((r: any) => {
    r.data.forEach(async (mission: any) => {
        itemOnMap.loadMarker(mission);
    })
}).catch((err) => {
    throw new Error(`${err.code} - ${err.text}`);
});

const toggleEmergencyDialog = document.querySelector('#emergency')!;
toggleEmergencyDialog.addEventListener('click', async () => {
    await dialog.openMissionDialog().then((r) => {
        if (r.code > 299 && r.code < 400) {
            throw new Error(`${r.code} - ${r.text}`);
        }
    }).catch((err) => {
        throw new Error(err);
    })
});

const toggleRadioDialog = document.querySelector('#radio')!;
toggleRadioDialog.addEventListener('click', () => {
    dialog.openRadioDialog();
});

const toggleBuildingDialog = document.querySelector('#building')!;
toggleBuildingDialog.addEventListener('click', () => {
    dialog.openBuildingDialog();
});

const toggleAddNewDialog = document.querySelector('#new')!;
toggleAddNewDialog.addEventListener('click', () => {
    dialog.openManageDialog();
});


// const rNumb = new Array();
// for (let i = 0; i < 10; i++) {
//     const numb = Math.random()*100
//     rNumb.push(Math.round(numb));
// }
// const randomInterval = rNumb[Math.round(Math.random()*10)]*1000; //time in seconds

let i: number;
let allowMissionGen = false;

setInterval(() => {
    const openMissions = Number(localStorage.getItem('open_mission'));
    const gameHasArea = localStorage.getItem('gameHasArea');

    database.get({
        'database': 'area',
        'version': 1,
        'object_store': 'area_building',
        'keyPath': 'area'
    }).then((r: any) => {
        if (r.status.code === 200) {
            localStorage.setItem('gameHasArea', 'true');
        }
        else {
            localStorage.setItem('gameHasArea', 'false');
        }
    }).catch((err) => {
        throw new Error(`${err.code} - ${err.text}`);
    });

    if (openMissions === null || isNaN(openMissions)) {
        localStorage.setItem('open_mission', '0');
        i = 0;
    }

    if (gameHasArea && openMissions < 12) {
        allowMissionGen = true;
    }
    else {
        allowMissionGen = false;
    }

    if (allowMissionGen) {
        i++;
        localStorage.setItem('open_mission', `${i}`);

        const missionUUID = crypto.randomUUID();
        const cmd = {
            missionType: 'fire',
            missionUUID: missionUUID
        }
        newMission.postMessage(cmd);

        newMission.onmessage = async (r) => {

            const response = r.data;

            const geoData = await database.get({
                'database': 'area',
                'version': 1,
                'object_store': 'area_building',
                'keyPath': 'area'
            })
                .then((r: any) => r.data[0].geotsON)
                .catch((err) => {
                    throw new Error(err);
                });

            await genLocation.withinPolygon(TT_API_KEY, geoData, true).then((r: any): void => {
                response.data.emergencyHeader.location = r.data.addresses[0].address.freeformAddress;
                response.data.emergencyHeader.lngLat = r.data.addresses[0].position;
            }).catch((err) => {
                throw new Error(err);
            });

            if (response.status.code === 200) {
                database.post({
                    'database': 'mission',
                    'version': 1,
                    'object_store': 'mission_active',
                    'keyPath': 'mission'
                },
                    response.data
                );
            }
            else if (response.status.code != 200) {
                throw new Error(`${response.status.code} - ${response.status.text}`);
            }
        }
    }
}, 10000);