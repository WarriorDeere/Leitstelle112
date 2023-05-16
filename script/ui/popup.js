class popup {

    constructor(){
        this.container = document.querySelector('body');
        this.popupBone = document.createElement('div');
        this.popupBone.classList.add('popup');
    }

    info(inp){
        this.popupBone.innerHTML = inp;
        this.popupBone.classList.add('info');
        this.container.appendChild(this.popupBone);
    }
}

export const pp = new popup();