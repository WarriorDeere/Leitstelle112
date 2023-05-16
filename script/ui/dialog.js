import { database } from "../database.js";

const newMission = new Worker('../../script/gen/mission.js');

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
                        await this.setMissionContent(mission, mission.mission).then((setContentStatus) => {
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

    async setMissionContent(content, identifer) {
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

    openAddDialog() {
        const dialogUUID = crypto.randomUUID();

        this.dialogBone.innerHTML = `
        <article class="dialog-item">
            <header class="dialog-head">
                <div class="header-text">
                    <p>
                        Gruppe (Besetzung)
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

            <section class="vehicle-menu_content" id="newContent">
                <div class="vehicle-menu_interface-container">
                    <svg class="_svg-crew-interface" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70.24401 33.31083">
                        <g stroke-linecap="round" stroke-linejoin="round" transform="translate(.025 -9.242)"><path fill="#979797" stroke="#979797" d="M3.5 11.922s-3 5.838-3 9v10c0 3.162 3 9 3 9 .15.447.312 1.01 1 1h2v-30h-2m-1 1c.15-.447.312-1.01 1-1"/><rect width="11.921" height="1.921" x="10.539" y="9.947" fill="#979797" stroke="#979797" stroke-dashoffset="1" stroke-width="1.079" rx=".511" ry=".57"/><rect width="11.921" height="1.921" x="10.539" y="40.092" fill="#979797" stroke="#979797" stroke-dashoffset="1" stroke-width="1.079" rx=".511" ry=".57"/><rect width="12.185" height="1.159" x="25.037" y="10.709" fill="#7b7b7b" stroke="#7b7b7b" stroke-dashoffset="1" stroke-width=".847" rx=".522" ry=".344"/><rect width="12.185" height="1.159" x="25.037" y="40.074" fill="#7b7b7b" stroke="#7b7b7b" stroke-dashoffset="1" stroke-width=".847" rx=".522" ry=".344"/><rect width="11.921" height="1.921" x="48.56" y="9.781" fill="#979797" stroke="#979797" stroke-dashoffset="1" stroke-width="1.079" rx=".511" ry=".57"/><rect width="11.921" height="1.921" x="48.56" y="39.926" fill="#979797" stroke="#979797" stroke-dashoffset="1" stroke-width="1.079" rx=".511" ry=".57"/></g>
                        <g fill="red" stroke="red" stroke-linecap="round" stroke-linejoin="round" transform="translate(.025 -9.242)"><path stroke-width=".937" d="M4.74 12.806S2 18.163 2 21.238v9.369c0 3.075 2.74 8.432 2.74 8.432.18.404.293.946.938.937H40.5V11.869H5.678m-.938.937c.14-.42.293-.947.938-.937"/><rect width="28.057" height="28.057" x="41.693" y="11.869" stroke-dashoffset="1" stroke-width=".987" rx=".557" ry=".497"/></g>
                        <g transform="translate(.025 -9.242)"><path fill="#ffa000" d="M5.503 13.532s-2.653 5.06-2.653 7.965v8.85c0 2.905 2.653 7.965 2.653 7.965.173.381.283.894.907.885H40v-26.55H6.41m-.907.885c.135-.396.283-.894.907-.885"/><path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".2" d="M4.74 12.806S2 18.163 2 21.238v9.369c0 3.075 2.74 8.432 2.74 8.432.18.404.293.946.938.937H40.5V11.869H5.678m-.938.937c.14-.42.293-.947.938-.937"/><rect width="28.057" height="28.057" x="41.693" y="11.869" fill="none" stroke="#000" stroke-dashoffset="1" stroke-linecap="round" stroke-linejoin="round" stroke-width=".2" rx=".557" ry=".497"/></g>
                        <g stroke="#404040" stroke-linecap="round" stroke-linejoin="round">
                            <g transform="translate(15.635 19.717)"><rect width="7" height="6" x="-7.535" y="-14.046" fill="#7d7d7d" stroke-dashoffset="1" stroke-width=".15" rx=".5" ry=".5"/><path fill="none" stroke-width=".1" d="M-7.535-13.046h1.232c1.951 0 5.768 1 5.768 1m-7 3h1.232c1.951 0 5.768-1 5.768-1m-5.768-3v4"/></g>
                            <g transform="translate(15.635 35.717)"><rect width="7" height="6" x="-7.535" y="-14.046" fill="#7d7d7d" stroke-dashoffset="1" stroke-width=".15" rx=".5" ry=".5"/><path fill="none" stroke-width=".1" d="M-7.535-13.046h1.232c1.951 0 5.768 1 5.768 1m-7 3h1.232c1.951 0 5.768-1 5.768-1m-5.768-3v4"/></g>
                            <g transform="matrix(-1 0 0 1 15.565 35.717)"><rect width="7" height="6" x="-7.535" y="-14.046" fill="#7d7d7d" stroke-dashoffset="1" stroke-width=".15" rx=".5" ry=".5"/><path fill="none" stroke-width=".1" d="M-7.535-13.046h1.232c1.951 0 5.768 1 5.768 1m-7 3h1.232c1.951 0 5.768-1 5.768-1m-5.768-3v4"/></g>
                            <g transform="matrix(-1 0 0 1 15.565 19.717)"><rect width="7" height="6" x="-7.535" y="-14.046" fill="#7d7d7d" stroke-dashoffset="1" stroke-width=".15" rx=".5" ry=".5"/><path fill="none" stroke-width=".1" d="M-7.535-13.046h1.232c1.951 0 5.768 1 5.768 1m-7 3h1.232c1.951 0 5.768-1 5.768-1m-5.768-3v4"/></g>
                            <g transform="matrix(-1 0 0 1 15.565 27.717)"><rect width="7" height="6" x="-7.535" y="-14.046" fill="#7d7d7d" stroke-dashoffset="1" stroke-width=".15" rx=".5" ry=".5"/><path fill="none" stroke-width=".1" d="M-7.535-13.046h1.232c1.951 0 5.768 1 5.768 1m-7 3h1.232c1.951 0 5.768-1 5.768-1m-5.768-3v4"/></g>
                            <g transform="translate(39.635 37)"><rect width="7" height="6" x="-7.535" y="-14.046" fill="#7d7d7d" stroke-dashoffset="1" stroke-width=".15" rx=".5" ry=".5"/><path fill="none" stroke-width=".1" d="M-7.535-13.046h1.232c1.951 0 5.768 1 5.768 1m-7 3h1.232c1.951 0 5.768-1 5.768-1m-5.768-3v4"/></g>
                            <g transform="translate(39.635 18.45)"><rect width="7" height="6" x="-7.535" y="-14.046" fill="#7d7d7d" stroke-dashoffset="1" stroke-width=".15" rx=".5" ry=".5"/><path fill="none" stroke-width=".1" d="M-7.535-13.046h1.232c1.951 0 5.768 1 5.768 1m-7 3h1.232c1.951 0 5.768-1 5.768-1m-5.768-3v4"/></g>
                            <g transform="translate(39.635 24.635)"><rect width="7" height="6" x="-7.535" y="-14.046" fill="#7d7d7d" stroke-dashoffset="1" stroke-width=".15" rx=".5" ry=".5"/><path fill="none" stroke-width=".1" d="M-7.535-13.046h1.232c1.951 0 5.768 1 5.768 1m-7 3h1.232c1.951 0 5.768-1 5.768-1m-5.768-3v4"/></g>
                            <g transform="translate(39.635 30.818)"><rect width="7" height="6" x="-7.535" y="-14.046" fill="#7d7d7d" stroke-dashoffset="1" stroke-width=".15" rx=".5" ry=".5"/><path fill="none" stroke-width=".1" d="M-7.535-13.046h1.232c1.951 0 5.768 1 5.768 1m-7 3h1.232c1.951 0 5.768-1 5.768-1m-5.768-3v4"/></g>
                        </g>
                        <g stroke-width=".15" class="_svg-symbol-container" id=""><g id="crew-ma" transform="translate(8.763 -23.166)"><rect width="4" height="4" x="33.831" y="29.82" fill="#fff" stroke="#000" stroke-dashoffset="1" stroke-linecap="round" stroke-linejoin="round" paint-order="markers fill stroke" rx=".1" ry=".1" transform="rotate(45)"/>  <text xml:space="preserve" x="1.752" y="48.319" font-family="Poppins" font-size="1.411" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:none;font-variant-numeric:normal;line-height:1.25"><tspan x="1.752" y="48.319" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:none;font-variant-numeric:normal">Ma</tspan></text></g><g id="crew-me" transform="translate(-5.864 -31.166)">  <rect width="4" height="4" x="49.831" y="13.82" fill="#fff" stroke="#000" stroke-dashoffset="1" stroke-linecap="round" stroke-linejoin="round" paint-order="markers fill stroke" rx=".1" ry=".1" transform="rotate(45)"/>  <text xml:space="preserve" x="24.38" y="48.319" font-family="Poppins" font-size="1.411" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:none;font-variant-numeric:normal;line-height:1.25"><tspan x="24.38" y="48.319" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:none;font-variant-numeric:normal">Me</tspan></text></g><g id="crew-gf" transform="translate(3.106 -39.166)">  <rect width="4" height="4" x="37.831" y="25.82" fill="#1a994e" stroke="#000" stroke-dashoffset="1" stroke-linecap="round" stroke-linejoin="round" paint-order="markers fill stroke" rx=".1" ry=".1" transform="rotate(45)"/>  <path d="m8.493 45.008-.562.563h1.125l-.563-.563"/>  <circle cx="7.931" cy="44.808" r=".2" paint-order="markers fill stroke"/>  <circle cx="9.056" cy="44.808" r=".2" paint-order="markers fill stroke"/></g><g id="crew-a-tf" transform="translate(5.45 -23.166)">  <rect width="4" height="4" x="41.831" y="21.82" fill="#ff2300" stroke="#000" stroke-dashoffset="1" stroke-linecap="round" stroke-linejoin="round" paint-order="markers fill stroke" rx=".1" ry=".1" transform="rotate(45)"/>  <path d="m14.15 45.008-.563.563h1.126l-.563-.563"/>  <text xml:space="preserve" x="13.675" y="48.326" font-family="Poppins" font-size="1.411" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:none;font-variant-numeric:normal;line-height:1.25"><tspan x="13.675" y="48.326" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:none;font-variant-numeric:normal">A</tspan></text></g><g id="crew-a" transform="translate(-.207 -39.166)">  <rect width="4" height="4" x="45.831" y="17.82" fill="#ff2300" stroke="#000" stroke-dashoffset="1" stroke-linecap="round" stroke-linejoin="round" paint-order="markers fill stroke" rx=".1" ry=".1" transform="rotate(45)"/>  <text xml:space="preserve" x="19.332" y="48.326" font-family="Poppins" font-size="1.411" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:none;font-variant-numeric:normal;line-height:1.25"><tspan x="19.332" y="48.326" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:none;font-variant-numeric:normal">A</tspan></text></g><g id="crew-w-tf" transform="translate(4.479 -21.882)">  <rect width="4" height="4" x="53.831" y="9.82" fill="#0852ae" stroke="#000" stroke-dashoffset="1" stroke-linecap="round" stroke-linejoin="round" paint-order="markers fill stroke" rx=".1" ry=".1" transform="rotate(45)"/>  <path d="m31.121 45.008-.563.563h1.126l-.563-.563"/>  <text xml:space="preserve" x="30.432" y="48.328" font-family="Poppins" font-size="1.411" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:none;font-variant-numeric:normal;line-height:1.25"><tspan x="30.432" y="48.328" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:none;font-variant-numeric:normal">W</tspan></text></g><g id="crew-w" transform="translate(-1.178 -40.432)">  <rect width="4" height="4" x="57.831" y="5.82" fill="#0852ae" stroke="#000" stroke-dashoffset="1" stroke-linecap="round" stroke-linejoin="round" paint-order="markers fill stroke" rx=".1" ry=".1" transform="rotate(45)"/>  <text xml:space="preserve" x="36.089" y="48.328" font-family="Poppins" font-size="1.411" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:none;font-variant-numeric:normal;line-height:1.25"><tspan x="36.089" y="48.328" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:none;font-variant-numeric:normal">W</tspan></text></g><g id="crew-s-tf" transform="translate(-6.835 -28.065)">  <rect width="4" height="4" x="61.831" y="1.82" fill="#ffc900" stroke="#000" stroke-dashoffset="1" stroke-linecap="round" stroke-linejoin="round" paint-order="markers fill stroke" rx=".1" ry=".1" transform="rotate(45)"/>  <path d="m42.435 45.008-.563.563h1.126l-.563-.563"/>  <text xml:space="preserve" x="42.021" y="48.33" font-family="Poppins" font-size="1.411" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:none;font-variant-numeric:normal;line-height:1.25"><tspan x="42.021" y="48.33" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:none;font-variant-numeric:normal">S</tspan></text></g><g id="crew-s" transform="translate(-12.492 -34.248)">  <rect width="4" height="4" x="65.831" y="-2.18" fill="#ffc900" stroke="#000" stroke-dashoffset="1" stroke-linecap="round" stroke-linejoin="round" paint-order="markers fill stroke" rx=".1" ry=".1" transform="rotate(45)"/>  <text xml:space="preserve" x="47.677" y="48.33" font-family="Poppins" font-size="1.411" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:none;font-variant-numeric:normal;line-height:1.25"><tspan x="47.677" y="48.33" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:none;font-variant-numeric:normal">S</tspan></text></g></g>
                    </svg>
                </div>
                <div class="vehicle-menu_hint">
                    Gruppenmitglied
                </div>
            </section>
        </article>
        `;

        this.dialogBone.id = dialogUUID;

        this.dialogContainer.appendChild(this.dialogBone);

        const thisDialog = document.getElementById(dialogUUID);
        thisDialog.classList.add('dialog-new');

        thisDialog.showModal();

        const closeDialog = document.querySelector('#close-dialog');
        closeDialog.addEventListener('click', () => {
            thisDialog.close();
        });

        const symbolCollection = document.querySelector('._svg-symbol-container');
        const hintArea = document.querySelector('.vehicle-menu_hint');

        for (let i = 0; i < symbolCollection.childElementCount; i++) {
            const child = symbolCollection.children.item(i);
            child.addEventListener('mouseover', () => {
                const childType = child.id.replace('crew-', '');
                switch (childType) {
                    case 'ma':
                        hintArea.innerHTML = `Maschinist`;
                    break;
                    case 'me':
                        hintArea.innerHTML = `Melder`;
                    break;
                    case 'gf':
                        hintArea.innerHTML = `Gruppenführer`;
                    break;
                    case 's-tf':
                        hintArea.innerHTML = `Schlauchtruppführer`;
                    break;
                    case 's':
                        hintArea.innerHTML = `Schlauchtruppmann`;
                    break;
                    case 'w-tf':
                        hintArea.innerHTML = `Wassertruppführer`;
                    break;
                    case 'w':
                        hintArea.innerHTML = `Wassertruppmann`;
                    break;
                    case 'a-tf':
                        hintArea.innerHTML = `Angriffstruppführer`;
                    break;
                    case 'a':
                        hintArea.innerHTML = `Angriffstruppmann`;
                    break;
                        
                    default:
                        hintArea.innerHTML = `Gruppenmitglied unbekannt`;
                        break;
                }
            })
        }

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