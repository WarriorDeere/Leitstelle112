import { dialog } from "./ui/dialog.ts";

const toggleEmergencyDialog = document.querySelector('#emergency')!;
toggleEmergencyDialog.addEventListener('click', () => {
    dialog.openMissionDialog();
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