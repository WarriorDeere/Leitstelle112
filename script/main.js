import { dialog } from "./dialog.js";

const toggleEmergencyDialog = document.querySelector('#emergency');
toggleEmergencyDialog.addEventListener('click', () => {
    dialog.openEmergnecyDialog();
});

const toggleRadioDialog = document.querySelector('#radio');
toggleRadioDialog.addEventListener('click', () => {
});
dialog.openRadioDialog();