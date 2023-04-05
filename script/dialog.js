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
                        <div class="emergency-head">
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
                        <div class="emergency-interface">
                            <button class="emergency-cancel">Abbrechen</button>
                            <button class="emergency-respond">Annehmen</button>
                        </div>
                    </div>
                    <div class="dialog-content-item">
                        <div class="emergency-head">
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
                        <div class="emergency-interface">
                            <button class="emergency-cancel">Abbrechen</button>
                            <button class="emergency-respond">Annehmen</button>
                        </div>
                    </div>
                    <div class="dialog-content-item">
                        <div class="emergency-head">
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
    }
}

export const dialog = new DIALOG();