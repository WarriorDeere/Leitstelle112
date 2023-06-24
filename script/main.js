import { TT_API_KEY } from "../env.js";
import { database } from "./database.js";
import { genLocation } from "./gen/location.js";
import { itemOnMap } from "./gen/onmap.js";
import { dialog } from "./ui/dialog.js";
import { pp } from "./ui/popup.js";

export const newMission = new Worker('../../script/gen/mission.js');

// database.get({
//     'database': 'missionStorage',
//     'version': 1,
//     'object_store': 'activeMission',
//     'keyPath': 'mission'
// }).then((r) => {
//     r.data.forEach(async (mission) => {
//         itemOnMap.loadMarker(mission);
//     })
// }).catch((err) => {
//     throw new Error(`${err.code} - ${err.text}`);
// });

const toggleEmergencyDialog = document.querySelector('#emergency');
toggleEmergencyDialog.addEventListener('click', async () => {
    await dialog.openMissionDialog('fd').then((r) => {
        if (r.code > 299 && r.code < 400) {
            throw new Error(`${r.code} - ${r.text}`);
        }
    }).catch((err) => {
        throw new Error(err);
    })
});

const toggleRadioDialog = document.querySelector('#radio');
toggleRadioDialog.addEventListener('click', () => {
    dialog.openRadioDialog();
});

const toggleBuildingDialog = document.querySelector('#building');
toggleBuildingDialog.addEventListener('click', () => {
    dialog.openBuildingDialog();
});

const toggleAddNewDialog = document.querySelector('#new');
toggleAddNewDialog.addEventListener('click', () => {
    dialog.openManageDialog();
});


// const rNumb = new Array();
// for (let i = 0; i < 10; i++) {
//     const numb = Math.random()*100
//     rNumb.push(Math.round(numb));
// }
// const randomInterval = rNumb[Math.round(Math.random()*10)]*1000; //time in seconds

let i;
let allowMissionGen = false;

setInterval(() => {
    const openMissions = localStorage.getItem('open_mission');
    const gameHasArea = localStorage.getItem('gameHasArea');

    if (gameHasArea === null) {
        localStorage.setItem('gameHasArea', false);
    }

    if (openMissions === null) {
        localStorage.setItem('open_mission', 0);
        i = 0;
    }

    console.log(openMissions);
    console.log(i);

    if (gameHasArea && i < 12) {
        allowMissionGen = true;
    }

    if (allowMissionGen) {
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
            }).then((r) => {
                return r.data[0].geoJSON;
            }).catch((err) => {
                throw new Error(err);
            });

            await genLocation.withinPolygon(TT_API_KEY, geoData, true).then((r) => {
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
                i++;
                localStorage.setItem('open_mission', i);
            }
            else if (response.status.code != 200) {
                throw new Error(`${response.status.code} - ${response.status.text}`);
            }
        }
    }
}, 5000);
