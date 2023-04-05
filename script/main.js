import { dialog } from "./dialog.js";

const toggleEmergencyDialog = document.querySelector('#emergency');
toggleEmergencyDialog.addEventListener('click', () => {
    dialog.openEmergnecyDialog();
})