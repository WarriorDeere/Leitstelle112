import tt from "@tomtom-international/web-sdk-services";
import tt_map from "@tomtom-international/web-sdk-maps";
import { map } from "../init/map.ts";
import { fleet } from "./fleet.ts";
import { TT_API_KEY } from "../../../setup.ts";

class DIALOG {
    dialogBone: HTMLDialogElement;
    dialogContainer: any;
    closeStatus: { code: number; text: string; };

    constructor() {
        this.dialogBone = document.createElement('dialog');
        this.dialogContainer = document.querySelector('#dialog-container');
        this.closeStatus = {
            code: 300,
            text: 'Closed without feedback'
        };
    }

    async openMissionDialog() {
        try {
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

            const thisDialog = document.getElementById(dialogUUID) as HTMLDialogElement;
            thisDialog.classList.add('dialog-emergency');
            thisDialog.showModal();

            const itemContainer = document.querySelector(`#dialog-item-${dialogUUID}`)!;
            const itemBone = document.createElement('section');

            itemBone.id = 'dialog-content-container';
            itemBone.classList.add('em-dialog-content');
            itemBone.innerHTML = ``;
            itemContainer.appendChild(itemBone);

            const closeDialog = document.querySelector('#close-dialog') as HTMLDialogElement;
            closeDialog.addEventListener('click', () => {
                thisDialog.close();
            });

            this.closeStatus = {
                code: 200,
                text: 'Request successfull'
            };

        } catch (err: any) {
            this.closeStatus = {
                code: 301,
                text: 'Request failed'
            };
            throw new Error(err);
        }

        return this.closeStatus;
    }

    async setMissionContent(content: { emergencyText: any; emergencyDummy: any; emergencyHeader: { location: string; title: string; type: string; }; }, identifer: string) {
        const container = document.querySelector('#dialog-content-container')!;
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
            let filteredText = rawText.replaceAll('${NAME}', content.emergencyDummy);
            filteredText = filteredText.replaceAll('${ADRESSE}', content.emergencyHeader.location);
            return filteredText;
        };

        const missionDesc = document.querySelector(`#mission-text-${identifer}`)!;
        missionDesc.innerHTML = '';

        const missionTitle = document.querySelector(`#mission-title-${identifer}`)!;
        missionTitle.innerHTML = content.emergencyHeader.title;

        const missionType = document.querySelector(`#mission-type-${identifer}`)!;
        missionType.innerHTML = content.emergencyHeader.type;

        const missionLocation = document.querySelector(`#mission-location-${identifer}`)!;
        missionLocation.innerHTML = content.emergencyHeader.location;

        const text = await repPlaceholder();
        const textBone = document.createTextNode(text);
        missionDesc.appendChild(textBone);
        return;
    }

    async openManageDialog() {
        const dialogUUID = crypto.randomUUID();

        this.dialogBone.innerHTML = `
            <article class="dialog-item">
                <header class="dialog-head">
                    <div class="header-text">
                        <p id="dialog-title-${dialogUUID}">
                            Verwaltung
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
    
                <section class="create-content" id="content-${dialogUUID}">
                    <div class="create-content-item">
                        <div class="group-header">
                            <h2>Fahrzeuge</h2>
                        </div>
                        <div class="group-item">
                            <button class="create-element" id="manage-fleet">
                                <span class="icon material-symbols-outlined">
                                    garage
                                </span>
                                <div class="title">Fahrzeuge verwalten</div>
                            </button>
                            <button class="create-element" id="add-fleet">
                                <span class="icon material-symbols-outlined">
                                    shopping_cart
                                </span>
                                <div class="title">Neue Fahrzeuge</div>
                            </button>
                        </div>
                    </div>
                    <div class="create-content-item">
                        <div class="group-header">
                            <h2>Personal</h2>
                        </div>
                        <div class="group-item">
                            <button class="create-element">
                                <span class="icon material-symbols-outlined">
                                    manage_accounts
                                </span>
                                <div class="title">Personal verwalten</div>
                            </button>
                            <button class="create-element">
                                <span class="icon material-symbols-outlined">
                                    person_add
                                </span>
                                <div class="title">Personal einstellen</div>
                            </button>
                        </div>
                    </div>
                    <div class="create-content-item">
                        <div class="group-header">
                            <h2>Einsatzgebiete</h2>
                        </div>
                        <div class="group-item">
                            <button class="create-element" id="manage-mission-area">
                                <span class="icon material-symbols-outlined">
                                    question_mark
                                </span>
                                <div class="title">Einsatzgebiete verwalten</div>
                            </button>
                            <button class="create-element" id="new-mission-area">
                                <span class="icon material-symbols-outlined">
                                    question_mark
                                </span>
                                <div class="title">neues Einsatzgebiet</div>
                            </button>
                        </div>
                    </div>
                </section>
            </article>
            `;

        this.dialogBone.id = dialogUUID;

        this.dialogContainer.appendChild(this.dialogBone);

        const thisDialog = document.getElementById(dialogUUID) as HTMLDialogElement;
        thisDialog.classList.add('dialog-admin');

        thisDialog.showModal();

        const closeDialog = document.querySelector('#close-dialog') as HTMLDialogElement;
        closeDialog.addEventListener('click', () => {
            thisDialog.close();
        })

        const manageFleet = document.querySelector('#manage-fleet');
        if (manageFleet) {
            manageFleet.addEventListener('click', () => {
                fleet.manage();
            });
        }

        const addFleet = document.querySelector('#add-fleet');
        if (addFleet) {
            addFleet.addEventListener('click', () => {
                fleet.add({
                    'content': `content-${dialogUUID}`,
                    'title': `dialog-title-${dialogUUID}`
                });
            });
        }

        const newMissionArea = document.querySelector('#new-mission-area');
        if (newMissionArea) {
            newMissionArea.addEventListener('click', () => {
                thisDialog.close();
                this.processAddDialog('district', { apiKey: TT_API_KEY });
            })
        }

        const manageMissionArea = document.querySelector('#manage-mission-area');
        if (manageMissionArea) {
            manageMissionArea.addEventListener('click', () => {
                thisDialog.close();
                this.missionAreaDialog();
            })
        }
    }

    processAddDialog(type: string, options: { apiKey: any; }) {
        switch (type) {
            case 'district':
                const interfaceContainer = document.querySelector('#map')!;
                const interfaceBone = document.createElement('div');

                interfaceBone.innerHTML = `
                    <form>
                        <label id='searchBoxPlaceholder' class='tt-form-label'></label>
                    </form>
                `;

                interfaceContainer.appendChild(interfaceBone);
                interfaceBone.id = 'foldable';
                interfaceBone.classList.add(...['tt-overlay-panel', '-left-top', '-medium', 'ts-foldable']);

                // pp.toolHint('<h1> <span class="material-symbols-outlined">tips_and_updates</span> Tipp</h1><p>Einsatzgebiete sind feste Zonen, in welchen neue Einsätze auftreten. Du kannst Städte, Kommunen oder Stadtteile bzw. Bezirke wählen.</p><p>Entweder suchst du nach dem Namen in der Suchleiste oben oder du klickst mit der Maus auf die Karte um einen Stadtteil bzw. Bezirk zu markieren.</p><p>Jede Wache muss ein Einsatzgebiet zugewiesen haben.</p>', '#foldable');

                map.on('click', (pnt: { lngLat: any; }) => {

                    function clearLayer(layerID: string) {
                        if (map.getLayer(layerID)) {
                            map.removeLayer(layerID);
                            map.removeSource(layerID);
                        }
                    }

                    clearLayer('geo_filler');
                    clearLayer('geo_line');

                    tt.services.reverseGeocode({
                        key: options.apiKey,
                        position: pnt.lngLat,
                        entityType: 'MunicipalitySubdivision',
                        language: 'de-DE'
                    }).then((r: any) => {
                        new Promise<void>((resolve) => {
                            if (r.addresses[0] === undefined) {
                                let areaHint = new tt_map.Popup();
                                areaHint
                                    .setLngLat(pnt.lngLat)
                                    .setHTML(`<strong>Kein Stadtteil gefunden!</strong><br>An dieser Position konnte kein Stadtteil gefunden werden`)
                                    .addTo(map)
                                resolve();
                            }
                            else {
                                let geometryId = r.addresses[0].dataSources.geometry.id;

                                fitMap(r.addresses[0].address);
                                showPopUp(r.addresses[0].position, r.addresses[0].address);
                                tt.services.additionalData({
                                    key: options.apiKey,
                                    geometries: [geometryId],
                                    geometriesZoom: 22
                                }).then((r: any) => {
                                    let additionalDataResult = r && r.additionalData && r.additionalData[0];
                                    let geoJson = additionalDataResult && additionalDataResult.geometryData;
                                    map.addLayer({
                                        id: 'geo_filler',
                                        type: 'fill',
                                        source: {
                                            type: 'geojson',
                                            data: geoJson
                                        },
                                        paint: {
                                            'fill-color': '#ff0000',
                                            'fill-opacity': .35
                                        }
                                    });
                                    map.addLayer({
                                        id: 'geo_line',
                                        type: 'line',
                                        source: {
                                            type: 'geojson',
                                            data: geoJson
                                        },
                                        paint: {
                                            'line-color': '#ff0000',
                                            'line-width': 1
                                        }
                                    });
                                });

                                resolve();
                            }
                        })

                    }).catch((err: string | undefined) => {
                        throw new Error(err);
                    });

                    function fitMap(searchResult: { boundingBox: any; viewport: any; }) {
                        let boundingBox = searchResult.boundingBox || searchResult.viewport;
                        const sw = new tt.LngLat(boundingBox.southWest.lng, boundingBox.southWest.lat);
                        const ne = new tt.LngLat(boundingBox.northEast.lng, boundingBox.northEast.lat);
                        boundingBox = new tt.LngLatBounds(sw, ne);
                        map.fitBounds(boundingBox, { padding: 100, linear: true });
                    }

                    function showPopUp(position: any, address: { freeformAddress: any; }) {
                        let areaHint = new tt_map.Popup();
                        areaHint
                            .setLngLat(position)
                            .setHTML(`<strong>Einsatzgebiet</strong><br><i>${address.freeformAddress}</i><br><p>Bereits Zugewiesene Wachen: 0</p>`)
                            .addTo(map)
                    }
                });
                // District.create(options.apiKey);
                break;

            default:
                console.error('303 - Invalid input');
                break;
        }
    }

    async editMissionArea(areaDetail: { object_title: any; area_title: any; status: any; }) {

        const dialogUUID = crypto.randomUUID();

        const dialogContentContainer = document.createElement('article');
        dialogContentContainer.classList.add('dialog-item');
        dialogContentContainer.id = `edit-mission-area-${dialogUUID}`;


        this.dialogBone.innerHTML = '';
        this.dialogBone.id = dialogUUID;
        this.dialogBone.classList.add('dialog-edit-mission-area');

        this.dialogBone.appendChild(dialogContentContainer);
        this.dialogContainer.appendChild(this.dialogBone);

        // gp.dialogHead(dialogUUID, title, `#edit-mission-area-${dialogUUID}`);

        const dialogContent = document.querySelector(`#edit-mission-area-${dialogUUID}`);
        const dialogContentBone = document.createElement('section');
        dialogContentBone.innerHTML = `
            <section class="e_sect-container">
                <div class="edit-item-cont edit-general">
                    <div class="e_item e_name">
                        <span class="e_ui-hint">
                            Wache
                        </span>
                        <input type="text" value="${areaDetail.object_title}">
                    </div>
                    <div class="e_item e_area">
                        <span class="e_ui-hint">
                            Einsatzgebiet
                        </span>
                        <button id="add-area">
                            ${areaDetail.area_title}
                            <span class="material-symbols-outlined">
                                edit
                            </span>
                        </button>
                    </div>
                    <div class="e_item e_status">
                        <span class="e_ui-hint">
                            Status
                        </span>
                        <button id="toggle-status" class="ui dr-do">
                            ${areaDetail.status}    
                            <span class="material-symbols-outlined">
                                edit
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            <section class="e_sect-container e_s-con_closed">
                <div class="edit-item edit-fleet">
                    <div class="e_vehicle"></div>
                    <div class="e_garage"></div>
                </div>
            </section>

            <section class="e_sect-container e_s-con_closed">
                <div class="edit-item edit-staff">
                    <div class="e_staff"></div>
                    <div class="e_recruit"></div>
                </div>
            </section>

            <section class="e_sect-container e_s-con_closed">
                <div class="edit-item edit-visuals">
                    <div class="e_icon"></div>
                </div>
            </section>`;


        dialogContentBone.classList.add('tune-area-content');
        if (dialogContent) {
            dialogContent.appendChild(dialogContentBone);
        }

        const thisDialog = document.getElementById(dialogUUID) as HTMLDialogElement;
        thisDialog.classList.add('dialog-mission-area');

        thisDialog.showModal();
    }

    async missionAreaDialog() {

        const dialogUUID = crypto.randomUUID();

        this.dialogBone.innerHTML = '';
        const dialogContentContainer = document.createElement('article');
        this.dialogBone.appendChild(dialogContentContainer);

        dialogContentContainer.classList.add('dialog-item');
        dialogContentContainer.id = `content-${dialogUUID}`;
        const dialogContent = document.querySelector(`#content-${dialogUUID}`);

        // gp.dialogHead(dialogUUID, 'Einsatzgebiete', `#${dialogContentContainer.id}`);
        const dialogContentBone = document.createElement('section');
        dialogContentBone.innerHTML = `
            <div class="manage-desc">
                Hier sind deine Wachen übersichtlich aufgelistet. Du siehst dort welche Wache welches Einsatzgebiet zugewiesen hat und kannst dieses auch bearbeiten.
            </div>
            <div class="manage-mission-area-content">
                <table class="mission-area-list">
                    <thead>
                        <tr>
                            <th>Wache</th>
                            <th>Einsatzgebiet</th>
                        </tr>
                    </thead>
                    <tbody id="list-${dialogUUID}"><tbody>
                </table>
            </div>`;
        dialogContentBone.classList.add('manage-mission-area');
        if (dialogContent) {
            dialogContent.appendChild(dialogContentBone);
        }

        this.dialogBone.id = dialogUUID;
        this.dialogContainer.appendChild(this.dialogBone);

        const thisDialog = document.getElementById(dialogUUID) as HTMLDialogElement;
        thisDialog.classList.add('dialog-mission-area');

        // await database.get({
        //     'database': 'area',
        //     'version': 1,
        //     'object_store': 'area_building',
        //     'keyPath': 'area'
        // }).then((r: any) => {
        //     for (let i = 0; i < r.data.length; i++) {
        //         gp.addContentToTable(
        //             `<tr class="list-item"><td class="list-title">${r.data[i].object_title}</td><td class="list-location">${r.data[i].area_title}</td><td class="list-ui"><span role="button" class="ui-item list-edit material-symbols-outlined" id="edit-${r.data[i].area}">tune</span><span role="button" class="ui-item list-del material-symbols-outlined" id="delete-${r.data[i].area}">delete</span></td></tr>`,
        //             `list-${dialogUUID}`,
        //             'list-item')
        //             .then(() => {
        //                 const deleteItem = document.querySelector(`#delete-${r.data[i].area}`);
        //                 if (deleteItem) {
        //                     deleteItem.addEventListener('click', () => {
        //                         thisDialog.close();

        //                     });
        //                 }

        //                 const editItem = document.querySelector(`#edit-${r.data[i].area}`);
        //                 if (editItem) {
        //                     editItem.addEventListener('click', () => {
        //                         thisDialog.close();
        //                         this.editMissionArea(`Einsatzgebiet ${r.data[i].area_title}`, r.data[i]);
        //                     });
        //                 }
        //             })
        //             .catch((err) => {
        //                 throw new Error(err);
        //             });
        //     }
        // }).catch((err) => {
        //     throw new Error(err);
        // });

        thisDialog.showModal();
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

        const thisDialog = document.getElementById(dialogUUID) as HTMLDialogElement;
        thisDialog.classList.add('dialog-radio');

        thisDialog.showModal();

        const closeDialog = document.querySelector('#close-dialog') as HTMLDialogElement;
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

        const thisDialog = document.getElementById(dialogUUID) as HTMLDialogElement;
        thisDialog.classList.add('dialog-building');

        thisDialog.showModal();

        const closeDialog = document.querySelector('#close-dialog') as HTMLDialogElement;
        closeDialog.addEventListener('click', () => {
            thisDialog.close();
        })
    }
}

export const dialog = new DIALOG();