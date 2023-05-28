import { database } from "./database.js";
import { genLocation } from "./gen/location.js";
import { itemOnMap } from "./gen/onmap.js";
import { dialog } from "./ui/dialog.js";

export const newMission = new Worker('../../script/gen/mission.js');

const config = await fetch('http://127.0.0.1:5500/config/config.json')
    .then((response) => {
        return response.json();
    })
    .catch((err) => {
        throw new Error(err);
    });

database.get({
    'database': 'missionStorage',
    'version': 2,
    'object_store': 'activeMission',
    'keyPath': 'mission'
}).then((r) => {
    r.data.forEach(async (mission) => {
        itemOnMap.loadMarker(mission);
    })
}).catch((err) => {
    throw new Error(`${err.code} - ${err.text}`);
});

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

setInterval(() => {
    const missionUUID = crypto.randomUUID();
    const cmd = {
        missionType: 'fire',
        missionUUID: missionUUID
    }
    newMission.postMessage(cmd);
}, 60000);

newMission.onmessage = async (r) => {

    const response = r.data;

    const geoData = await database.get({
        'database': 'missionStorage',
        'version': 2,
        'object_store': 'missionArea',
        'keyPath': 'area'
    }).then((r) => {
        return r.data[0].geoJSON;
    }).catch((err) => {
        throw new Error(err);
    });

    await genLocation.withinPolygon(config.APIKey, geoData, true).then((r) => {
        response.data.emergencyHeader.location = r.data.addresses[0].address.freeformAddress;
        response.data.emergencyHeader.lngLat = r.data.addresses[0].position;
    }).catch((err) => {
        throw new Error(err);
    });

    if (response.status.code === 200) {
        database.post({
            'database': 'missionStorage',
            'version': 2,
            'object_store': 'activeMission',
            'keyPath': 'mission'
        },
            response.data
        );
    }
    else if (response.status.code != 200) {
        throw new Error(`${response.status.code} - ${response.status.text}`);
    }
}