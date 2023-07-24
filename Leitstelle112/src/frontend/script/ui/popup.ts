class popup {
    /**
     * @param {string} inp text to display
     */

    info(inp: any) {
        const container = document.querySelector('body');
        const popupBone = document.createElement('div');

        popupBone.remove();
        const uuid = crypto.randomUUID();

        popupBone.classList.add('pp_dialog');
        popupBone.innerHTML = `<span class="pp-icon material-symbols-outlined">lightbulb</span><div class="pp-text">${inp}</div><span class="pp-close material-symbols-outlined" id="close-${uuid}">close</span>`;

        popupBone.classList.add('info');
        container.appendChild(popupBone);

        const close_pp = document.querySelector(`#close-${uuid}`);
        close_pp.addEventListener('click', () => {
            popupBone.remove();
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
            'user_input': {
                'add': true,
                'id': 'valid CSS selector',
                'display': 'text to display'
            }
        }
     * @param {CallableFunction} onSave
     * @param {CallableFunction} onCancel
     */

    save(inp: { ui_text: any; user_input: any; }, onSave: { (): void; (): void; }, onCancel: { (): void; (): void; }) {
        const container = document.querySelector('body');
        const popupBone = document.createElement('div');

        popupBone.remove();
        const uuid = crypto.randomUUID();

        popupBone.classList.add('pp_action');
        popupBone.innerHTML = `
            <span class="pp-icon material-symbols-outlined">save</span>
            <div class="pp_action-inp" id="input-container"></div>
            <div class="pp_action-ui">
                <button class="pp_action-ui-element pp_action-save" id="save-${uuid}">
                    ${inp.ui_text.save}
                </button>
                <button class="pp_action-ui-element pp_action-cancel" id="cancel-${uuid}">
                    ${inp.ui_text.close}
                </button>
            </div>`;

        container.appendChild(popupBone);
        popupBone.classList.add('pp_save');

        if (inp.user_input.add) {
            const inputElement = document.createElement('input');
            const inputContainer = document.querySelector('#input-container');
            inputElement.setAttribute('type', 'text');
            inputElement.setAttribute('placeholder', inp.user_input.display);
            inputElement.id = inp.user_input.id;
            inputContainer.appendChild(inputElement);
        }

        const pp_save = document.querySelector(`#save-${uuid}`);
        pp_save.addEventListener('click', () => {
            onSave();
            popupBone.remove();
        })

        const pp_cancel = document.querySelector(`#cancel-${uuid}`);
        pp_cancel.addEventListener('click', () => {
            onCancel();
            popupBone.remove();
        })

    }

    /**
     * @param {string} input text to show (may be HTML-Markup)
     * @param {string} container where the hint should appear (any valid CSS-selector)
     */

    toolHint(input: string, container: string) {
        const popupBone = document.createElement('div');

        popupBone.remove();
        popupBone.classList.remove('pp_tool-hint');

        const uuid = crypto.randomUUID();
        popupBone.classList.add('pp_tool-hint');
        popupBone.id = uuid;
        document.querySelector(container).appendChild(popupBone);
        popupBone.innerHTML = input;
    }
}

export const pp = new popup();