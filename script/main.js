import { dialog } from "./dialog.js";

const toggleEmergencyDialog = document.querySelector('#emergency');
toggleEmergencyDialog.addEventListener('click', () => {
    dialog.openEmergnecyDialog();
});

const toggleRadioDialog = document.querySelector('#radio');
toggleRadioDialog.addEventListener('click', () => {
    dialog.openRadioDialog();
});

const toggleBuildingDialog = document.querySelector('#building');
toggleBuildingDialog.addEventListener('click', () => {
    dialog.openBuildingDialog();
});

if (window.Worker) {
    const newMission = new Worker('../script/gen/mission.js');
    newMission.postMessage('mission');

    newMission.onmessage = async (r) => {
        const rawText = r.data.emergencyText;
        function repPlaceholder(){
          const filteredText = rawText.replace('${NAME}', r.data.emergencyDummy);
          return filteredText;
        };
        document.querySelector('#map-container').innerHTML = `${r.data.emergencyHeader} <br> ${await repPlaceholder()} <br> ${r.data.emergencyDummy}`;
    }
}