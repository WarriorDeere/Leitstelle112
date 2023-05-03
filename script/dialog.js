import { database } from "./database.js";

const newMission = new Worker('../script/gen/mission.js');

class DIALOG {

    constructor() {
        this.dialogBone = document.createElement('dialog');
        this.dialogContainer = document.querySelector('#dialog-container');
        this.closeStatus = {
            code: 300,
            text: 'Closed without feedback'
        };
    }

    async openMissionDialog(type) {
        try {

            database.operateWithDB(undefined, 'GET').
                then((r) => {
                    r.data.forEach(async (mission) => {
                        await this.setContent(mission, mission.mission).then((setContentStatus) => {
                            return setContentStatus;
                        }).catch((err) => {
                            throw new Error(err);
                        });
                    })
                }).catch((err) => {
                    throw new Error(`${err.code} - ${err.text}`);
                });

            // create base ('bone')
            const dialogUUID = crypto.randomUUID();

            this.dialogBone.id = dialogUUID;
            this.dialogBone.innerHTML =
                `
                <article class="dialog-item" id="dialog-item-${dialogUUID}">
                    <header class="dialog-head">
                        <div class="header-text">
                            <p>
                                Eingegangene Einsätze
                            </p>
                        </div>
                        <div class="header-ui">
                            <button class="close-dialog" id="close-dialog">
                                <p>ESC</p>
                                <span class="material-symbols-outlined">
                                    cancel
                                </span>
                            </button>    
                        </div>
                    </header>
                </article>
            `;

            this.dialogContainer.appendChild(this.dialogBone);

            const thisDialog = document.getElementById(dialogUUID);
            thisDialog.classList.add('dialog-emergency');

            thisDialog.showModal();

            const closeDialog = document.querySelector('#close-dialog');
            closeDialog.addEventListener('click', () => {
                thisDialog.close();
            })

            const itemContainer = document.querySelector(`#dialog-item-${dialogUUID}`);
            const itemBone = document.createElement('section');

            //set content

            const missionUUID = crypto.randomUUID();

            switch (type) {
                case 'fd':
                    const post = {
                        missionType: 'fire',
                        missionUUID: missionUUID
                    }
                    newMission.postMessage(post);
                    break;

                default:
                    this.closeStatus = {
                        code: 301,
                        text: 'Operation failed'
                    };
                    console.error(this.closeStatus);
                    break;
            }

            newMission.onmessage = async (r) => {

                const response = r.data;

                if (response.status.code === 200) {
                    const rawText = response.data.emergencyText;

                    function repPlaceholder() {
                        const filteredText = rawText.replace('${NAME}', response.data.emergencyDummy);
                        return filteredText;
                    };

                    const missionsDesc = document.querySelector(`#mission-text-${missionUUID}`);
                    missionsDesc.innerHTML = '';

                    const missionTitle = document.querySelector(`#mission-title-${missionUUID}`);
                    missionTitle.innerHTML = response.data.emergencyHeader.title;

                    const missionType = document.querySelector(`#mission-type-${missionUUID}`);
                    missionType.innerHTML = response.data.emergencyHeader.type;

                    const missionLocation = document.querySelector(`#mission-location-${missionUUID}`);
                    missionLocation.innerHTML = response.data.emergencyHeader.location;

                    const text = await repPlaceholder();
                    const textBone = document.createTextNode(text);
                    missionsDesc.appendChild(textBone);

                    database.operateWithDB(response.data, 'POST');
                }
                else if (response.status.code != 200) {
                    throw new Error(`${response.status.code} - ${response.status.text}`);
                }
            }

            itemBone.classList.add('em-dialog-content');
            itemBone.id = 'dialog-content-container';
            itemBone.innerHTML = `
            <div class="dialog-content-item" id="${missionUUID}">
                <div class="emergency-content">
                    <div class="emergency-head emergency-fire">
                        <div class="emergency-icon">
                            <img src="https://cdn-icons-png.flaticon.com/512/1453/1453025.png">
                        </div>
                        <div class="emergency-title" id="mission-title-${missionUUID}">Stichwort lädt...</div>
                        <div class="emergency-type" id="mission-type-${missionUUID}">Kategorie lädt...</div>
                        <div class="emergency-location" id="mission-location-${missionUUID}">Adresse lädt...</div>
                    </div>
                    <div class="emergency-information">
                        <div class="emergency-desc">
                            <p id="mission-text-${missionUUID}">Text lädt...</p>
                        </div>
                    </div>
                </div>
                <div class="emergency-interface">
                    <button class="emergency-cancel">Abbrechen</button>
                    <button class="emergency-respond">Annehmen</button>
                </div>
            </div>
            `

            itemContainer.appendChild(itemBone);

            this.closeStatus = {
                code: 200,
                text: 'Request successfull'
            };

        } catch (err) {
            this.closeStatus = {
                code: 301,
                text: 'Request failed'
            };
            throw new Error(err);
        }

        return this.closeStatus;
    }

    async setContent(content, identifer) {
        const container = document.querySelector('#dialog-content-container');
        const item = document.createElement('div');

        item.classList.add('dialog-content-item');
        item.id = identifer;
        item.innerHTML = `
            <div class="emergency-content">
                <div class="emergency-head emergency-fire">
                    <div class="emergency-icon">
                        <img src="https://cdn-icons-png.flaticon.com/512/1453/1453025.png">
                    </div>
                    <div class="emergency-title" id="mission-title-${identifer}">Stichwort lädt...</div>
                    <div class="emergency-type" id="mission-type-${identifer}">Kategorie lädt...</div>
                    <div class="emergency-location" id="mission-location-${identifer}">Adresse lädt...</div>
                </div>
                <div class="emergency-information">
                    <div class="emergency-desc">
                        <p id="mission-text-${identifer}">Text lädt...</p>
                    </div>
                </div>
            </div>
            <div class="emergency-interface">
                <button class="emergency-cancel">Abbrechen</button>
                <button class="emergency-respond">Annehmen</button>
            </div>`;

        container.appendChild(item);

        const rawText = content.emergencyText;

        function repPlaceholder() {
            const filteredText = rawText.replace('${NAME}', content.emergencyDummy);
            return filteredText;
        };

        const missionDesc = document.querySelector(`#mission-text-${identifer}`);
        missionDesc.innerHTML = '';

        const missionTitle = document.querySelector(`#mission-title-${identifer}`);
        missionTitle.innerHTML = content.emergencyHeader.title;

        const missionType = document.querySelector(`#mission-type-${identifer}`);
        missionType.innerHTML = content.emergencyHeader.type;

        const missionLocation = document.querySelector(`#mission-location-${identifer}`);
        missionLocation.innerHTML = content.emergencyHeader.location;

        const text = await repPlaceholder();
        const textBone = document.createTextNode(text);
        missionDesc.appendChild(textBone);
        return;
    }

    openRadioDialog() {
        const dialogUUID = crypto.randomUUID();

        this.dialogBone.innerHTML = `
        <article class="dialog-item">
            <header class="dialog-head">
                <div class="header-text">
                    <p>
                        Funk
                    </p>
                </div>
                <div class="header-ui">
                    <button class="close-dialog" id="close-dialog">
                        <p>ESC</p>
                        <span class="material-symbols-outlined">
                            cancel
                        </span>
                    </button>    
                </div>
            </header>

            <section class="radio-content">
                <div class="radio-device">
                    <div class="radio-preview">
                        Leitstelle für FL BE 83/8/8
                    </div>
                    <div class="radio-code">
                        <span class="radio-code-digit">1</span>
                        <span class="radio-code-digit">2</span>
                        <span class="radio-code-digit">3</span>
                        <span class="radio-code-digit">4</span>
                        <span class="radio-code-digit">5</span>
                        <span class="radio-code-digit">6</span>
                        <span class="radio-code-digit">7</span>
                        <span class="radio-code-digit">8</span>
                        <span class="radio-code-digit">9</span>
                        <span class="radio-code-digit material-symbols-outlined" id="cancel-radio">
                            call_end
                        </span>
                        <span class="radio-code-digit">0</span>
                        <span class="radio-code-digit material-symbols-outlined" id="send-radio">
                            call
                        </span>
                    </div>
                </div>
                
                <div class="radio-response">
                    <div class="radio-msg">
                        <div class="radio-sender">
                            <p class="sender-name">FL POTS 15/34/2</p>
                            <p class="sender-status status-3">3</p>
                        </div>
                        <div class="radio-msg-content">
                            <span>Anfahrt:</span>
                            <a href="#" class="msg-destination">Tragehilfe, Rettungsdienst (#3541)</a>
                        </div>
                    </div>
                </div>

                <div class="radio-response">
                    <div class="radio-msg">
                        <div class="radio-sender">
                            <p class="sender-name">FL BE 18/83/8</p>
                            <p class="sender-status status-1">1</p>
                        </div>
                        <div class="radio-msg-content">
                            <a href="#" class="msg-destination">Einsatzbereit über Funk</a>
                        </div>
                    </div>
                </div>
                
                <div class="radio-response">
                    <div class="radio-msg">
                        <div class="radio-sender">
                            <p class="sender-name">SAMA BE 21/24/4</p>
                            <p class="sender-status status-2">2</p>
                        </div>
                        <div class="radio-msg-content">
                            <a href="#" class="msg-destination">Einsatzbereit auf Wache</a>
                        </div>
                    </div>
                </div>
                
                <div class="radio-response">
                    <div class="radio-msg">
                        <div class="radio-sender">
                            <p class="sender-name">SAMA BE 21/24/4</p>
                            <p class="sender-status status-4">4</p>
                        </div>
                        <div class="radio-msg-content">
                            <span>Einsatzort:</span>
                            <a href="#" class="msg-destination">B2 MiG (#2451)</a>
                        </div>
                    </div>
                </div>
                
                <div class="radio-response">
                    <div class="radio-msg">
                        <div class="radio-sender">
                            <p class="sender-name">SAMA BE 21/24/4</p>
                            <p class="sender-status status-6">6</p>
                        </div>
                        <div class="radio-msg-content">
                            <a href="#" class="msg-destination">Außer Dienst</a>
                        </div>
                    </div>
                </div>

                <div class="radio-response">
                    <div class="radio-msg">
                        <div class="radio-sender">
                            <p class="sender-name">SAMA BE 21/24/4</p>
                            <p class="sender-status status-5">5</p>
                        </div>
                        <div class="radio-msg-content">
                            <a href="#" class="msg-destination">Sprechwunsch (#9237)</a>
                        </div>
                    </div>
                </div>                
            </section >
        </article>
        `;

        this.dialogBone.id = dialogUUID;

        this.dialogContainer.appendChild(this.dialogBone);

        const thisDialog = document.getElementById(dialogUUID);
        thisDialog.classList.add('dialog-radio');

        thisDialog.showModal();

        const closeDialog = document.querySelector('#close-dialog');
        closeDialog.addEventListener('click', () => {
            thisDialog.close();
        })
    }

    openBuildingDialog() {
        const dialogUUID = crypto.randomUUID();

        this.dialogBone.innerHTML = `
        <article class="dialog-item">
            <header class="dialog-head">
                <div class="header-text">
                    <p>
                        Gebäude
                    </p>
                </div>
                <div class="header-ui">
                    <button class="close-dialog" id="close-dialog">
                        <p>ESC</p>
                        <span class="material-symbols-outlined">
                            cancel
                        </span>
                    </button>    
                </div>
            </header>

            <section class="building-content">
                <div class="building-group type-fire">
                    <header class="building-group-header">
                        <span class="material-symbols-outlined group-icon">
                            local_fire_department
                        </span>
                        <p class="group-name">
                            Feuerwehr
                        </p>
                    </header>

                    <div class="building-item">
                        <header class="building-header">
                            <div class="building-icon">
                                <img src="https://media.istockphoto.com/id/523392641/de/foto/notfall-feuer-und-rettung-truck.webp?s=2048x2048&w=is&k=20&c=v1zlmCe6Z9wYP96CdUzjm9hjh_5-SCxKOkbTKIE1WyY=">
                            </div>
                            <p class="building-name">
                                Berufsfeuerwehr Neustadt
                            </p>
                            <div class="building-detail">
                                <div class="detail-item">
                                    <span class="detail-title">LF</span>
                                    <span class="detail-value">2</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-title">RW</span>
                                    <span class="detail-value">1</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-title">ELW</span>
                                    <span class="detail-value">1</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-title">DLK</span>
                                    <span class="detail-value">1</span>
                                </div>
                            </div>
                        </header>
                        
                        <div class="building-fleet">
                            <div class="fleet-item">
                                <div class="vehicle-icon">
                                    <img src="https://tse1.mm.bing.net/th?id=OIP.BkbqXNjKQ3bwAgUdySYPTQHaFj&pid=Api">
                                </div>
                                <div class="vehicle-name">
                                    FL NEU 22/48/2
                                </div>
                                <div class="vehicle-type">
                                    Löschfahrzeug
                                </div>
                                <div class="vehicle-status status-2">
                                    2
                                </div>
                                <div class="vehicle-mission">
                                    Baum auf PKW <a href="#">(#2372)</a>
                                </div>
                            </div>
                            <div class="fleet-item">
                                <div class="vehicle-icon">
                                    <img src="https://tse1.explicit.bing.net/th?id=OIP.cayoz-I7Smzcm0Kvr0Sx-wHaFU&pid=Api">
                                </div>
                                <div class="vehicle-name">
                                    FL NEU 22/11/1
                                </div>
                                <div class="vehicle-type">
                                    Einsatzleitung
                                </div>
                                <div class="vehicle-status status-4">
                                    4
                                </div>
                                <div class="vehicle-mission">
                                    Baum auf PKW <a href="#">(#2372)</a>
                                </div>
                            </div>
                            <div class="fleet-item">
                                <div class="vehicle-icon">
                                    <img src="https://tse3.mm.bing.net/th?id=OIP.R_zdsl7d93Dw36EOI3flPgAAAA&pid=Api">
                                </div>
                                <div class="vehicle-name">
                                    FL NEU 22/48/1
                                </div>
                                <div class="vehicle-type">
                                    Löschfahrzeug
                                </div>
                                <div class="vehicle-status status-5">
                                    5
                                </div>
                                <div class="vehicle-mission">
                                    Baum auf PKW <a href="#">(#2372)</a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </article>
        `;

        this.dialogBone.id = dialogUUID;

        this.dialogContainer.appendChild(this.dialogBone);

        const thisDialog = document.getElementById(dialogUUID);
        thisDialog.classList.add('dialog-building');

        thisDialog.showModal();

        const closeDialog = document.querySelector('#close-dialog');
        closeDialog.addEventListener('click', () => {
            thisDialog.close();
        })
    }
}

export const dialog = new DIALOG();