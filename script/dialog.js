class DIALOG {

    constructor() {
        this.dialogBone = document.createElement('dialog');
        this.dialogContainer = document.querySelector('#dialog-container');
    }

    openEmergnecyDialog() {
        const dialogUUID = crypto.randomUUID();

        this.dialogBone.innerHTML =
            `
            <article class="dialog-item">
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

                <section class="em-dialog-content">
                    <div class="dialog-content-item">
                        <div class="emergency-content">
                            <div class="emergency-head emergency-fire">
                                <div class="emergency-icon">
                                    <img src="https://cdn-icons-png.flaticon.com/512/1453/1453025.png">
                                </div>
                                <div class="emergency-title">Mittelbrand, Menschenleben in Gefahr</div>
                                <div class="emergency-type">B2 - MiG</div>
                                <div class="emergency-location">Sonnenstraße 24, 02193 Berlin</div>
                            </div>
                            <div class="emergency-information">
                                <div class="emergency-desc">
                                    <p>Hallo, hier ist Jannie Müller. Ich bin hier in der Sonnenstraße 24 und da qualmt es aus dem Fenster! bitte kommen Sie schnell, da sind noch Personen im Haus!</p>
                                </div>
                            </div>
                        </div>
                        <div class="emergency-interface">
                            <button class="emergency-cancel">Abbrechen</button>
                            <button class="emergency-respond">Annehmen</button>
                        </div>
                    </div>

                    <div class="dialog-content-item">
                        <div class="emergency-content">
                            <div class="emergency-head emergency-ambulance">
                                <div class="emergency-icon">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2955/2955619.png">
                                </div>
                                <div class="emergency-title">Kreislaufzusammenbruch</div>
                                <div class="emergency-type">RD2 - Herz/Kreislauf</div>
                                <div class="emergency-location">Straße des 17. Juni, 24271 Berlin</div>
                            </div>
                            <div class="emergency-information">
                                <div class="emergency-desc">
                                    <p>Schnell, kommen Sie!! Hier bei Brandburg Tor. Mann umgekippt, nix bewegen mehr!</p>
                                </div>
                            </div>
                        </div>
                        <div class="emergency-interface">
                            <button class="emergency-cancel">Abbrechen</button>
                            <button class="emergency-respond">Annehmen</button>
                        </div>
                    </div>

                    <div class="dialog-content-item">
                        <div class="emergency-content">
                            <div class="emergency-head emergency-assistance">
                                <div class="emergency-icon">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2125/2125190.png">
                                </div>
                                <div class="emergency-title">VU Person unter Straßenbahn</div>
                                <div class="emergency-type">TH/VU P - Straßenbahn</div>
                                <div class="emergency-location">Alexanderstraße, 19382 Berlin</div>
                            </div>
                            <div class="emergency-information">
                                <div class="emergency-desc">
                                    <p>Hier an der Haltestelle Berlin Alexanderplatz ist wer ohne zu gucken über die Schienen gegangen. Der liegt da jetzt unter der Straßenbahn. Beeilen sich sich, Ja? Ich muss nämlich weiter, habe noch einen wichtigen Termin! Schönen Tag noch.</p>
                                </div>
                            </div>
                        </div>
                        <div class="emergency-interface">
                            <button class="emergency-cancel">Abbrechen</button>
                            <button class="emergency-respond">Annehmen</button>
                        </div>
                    </div>

                    <div class="dialog-content-item">
                        <div class="emergency-content">
                            <div class="emergency-head emergency-police">
                                <div class="emergency-icon">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2204/2204022.png">
                                </div>
                                <div class="emergency-title">Ladenraub</div>
                                <div class="emergency-type">POL - Raub</div>
                                <div class="emergency-location">Juwelierstraße 13a, 83714 Potsdam</div>
                            </div>
                            <div class="emergency-information">
                                <div class="emergency-desc">
                                    <p>Peter Groszek hier, auf der Juwelierstraße 13 hat grade jemand den Schmuckladen leer geräumt. Da ist alles zerdeppert, die ganzen Scheiben sind alle kaputt!</p>
                                </div>
                            </div>
                        </div>
                        <div class="emergency-interface">
                            <button class="emergency-cancel">Abbrechen</button>
                            <button class="emergency-respond">Annehmen</button>
                        </div>
                    </div>
                    
                    <div class="dialog-content-item">
                        <div class="emergency-content">
                            <div class="emergency-head emergency-misc">
                                <div class="emergency-icon">
                                    <img src="https://cdn-icons-png.flaticon.com/512/6835/6835898.png">
                                </div>
                                <div class="emergency-title">Tragehilfe, Rettungsdienst</div>
                                <div class="emergency-type">SPEZI Tragehilfe</div>
                                <div class="emergency-location">Magdeburger Straße 23b, 12661 Berlin</div>
                            </div>
                            <div class="emergency-information">
                                <div class="emergency-desc">
                                    <p>RK BE 43/23/2 für Leitstelle. Benötigen einmal die FW an der Einsatzstelle, Tragehilfe.</p>
                                </div>
                            </div>
                        </div>
                        <div class="emergency-interface">
                            <button class="emergency-cancel">Abbrechen</button>
                            <button class="emergency-respond">Annehmen</button>
                        </div>
                    </div>
                </section>
            </article>
        `;

        this.dialogBone.id = dialogUUID;

        this.dialogContainer.appendChild(this.dialogBone);

        const thisDialog = document.getElementById(dialogUUID);
        thisDialog.classList.add('dialog-emergency');

        thisDialog.showModal();

        const closeDialog = document.querySelector('#close-dialog');
        closeDialog.addEventListener('click', () => {
            thisDialog.close();
        })
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

    openBuildingDialog(){
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