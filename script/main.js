import { database } from "./database.js";
import { dialog } from "./ui/dialog.js";
import { pp } from "./ui/popup.js";

const data =
    await fetch('http://127.0.0.1:5500/config/config.json')
        .then((response) => {
            return response.json();
        })
        .catch((err) => {
            throw new Error(err);
        })
    ;

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
    dialog.openAddDialog();
});