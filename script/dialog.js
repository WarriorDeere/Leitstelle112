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

                <section class="dialog-content">
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
        <section class="radio-content">
            <div class="radio-device">
                Funkgerät
            </div>
            <div class="radio-response">
                <div class="radio-msg">
                    <div class="radio-sender">
                        <p class="sender-name">Florian 11/49/1</p>
                        <p class="sender-status">3</p>
                    </div>
                    <div class="radio-msg-content">
                        <a href="#" class="msg-destination">Tragehilfe, Rettungsdienst</a>
                    </div>
                </div>
            </div>
        </section >
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
}

export const dialog = new DIALOG();