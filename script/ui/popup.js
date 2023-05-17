class popup {

    constructor() {
        this.container = document.querySelector('body');
        this.popupBone = document.createElement('div');
        this.popupBone.classList.add('popup');
    }

    info(inp) {
        const uuid = crypto.randomUUID();
        this.popupBone.innerHTML = `<span class="pp-icon material-symbols-outlined">lightbulb</span><div class="pp-text">${inp}</div><span class="pp-close material-symbols-outlined" id="close-${uuid}">close</span>`;
        this.popupBone.classList.add('info');
        this.container.appendChild(this.popupBone);
        const close_pp = document.querySelector(`#close-${uuid}`);
        close_pp.addEventListener('click', () => {
            this.popupBone.remove();
        })
    }
}

export const pp = new popup();