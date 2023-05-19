class popup {

    constructor() {
        this.container = document.querySelector('body');
        this.popupBone = document.createElement('div');
    }

    /**
     * @param {string} inp text to display
     */

    info(inp) {
        const uuid = crypto.randomUUID();

        this.popupBone.classList.add('pp_dialog');
        this.popupBone.innerHTML = `<span class="pp-icon material-symbols-outlined">lightbulb</span><div class="pp-text">${inp}</div><span class="pp-close material-symbols-outlined" id="close-${uuid}">close</span>`;

        this.popupBone.classList.add('info');
        this.container.appendChild(this.popupBone);

        const close_pp = document.querySelector(`#close-${uuid}`);
        close_pp.addEventListener('click', () => {
            this.popupBone.remove();
        })
    }

    /**
     * @param {object} inp 
     *  {
            'display_text': 'text to display',
            'ui_text': {
                'save': 'button to save',
                'close': 'button to cancel'
            }
        }
     * @param {CallableFunction} onSave
     * @param {CallableFunction} onCancel
     */

    save(inp, onSave, onCancel) {
        const uuid = crypto.randomUUID();

        this.popupBone.classList.add('pp_action');
        this.popupBone.innerHTML = `
            <span class="pp-icon material-symbols-outlined">save</span>
            <div class="pp_action-text">
                ${inp.display_text}
            </div>
            <div class="pp_action-ui">
                <button class="pp_action-ui-element pp_action-save" id="save-${uuid}">
                    ${inp.ui_text.save}
                </button>
                <button class="pp_action-ui-element pp_action-cancel" id="cancel-${uuid}">
                    ${inp.ui_text.close}
                </button>
            </div>`;

        this.popupBone.classList.add('pp_save');
        this.container.appendChild(this.popupBone);

        const pp_save = document.querySelector(`#save-${uuid}`);
        pp_save.addEventListener('click', () => {
            this.popupBone.remove();
            onSave();
        })
        
        const pp_cancel = document.querySelector(`#cancel-${uuid}`);
        pp_cancel.addEventListener('click', () => {
            this.popupBone.remove();
            onCancel();
        })
    }
}

export const pp = new popup();