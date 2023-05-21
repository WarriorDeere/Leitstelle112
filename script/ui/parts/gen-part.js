class genPart {

    /**
     * @param {string} identifier must be the dialogs id
     * @param {string} title title to display in the header
     * @param {string} container must be any valid CSS-Selector
     */

    async dialogHead(identifier, title, container) {
        new Promise((resolve, reject) => {
            try {
                const bone = document.createElement('header');
                bone.classList.add('dialog-head');

                const titleContainer = document.createElement('div');
                titleContainer.classList.add('header-text')
                bone.appendChild(titleContainer);

                const titleParagraph = document.createElement('p');
                const titleContent = document.createTextNode(title);
                titleParagraph.appendChild(titleContent);
                titleContainer.appendChild(titleParagraph);
                bone.appendChild(titleContainer);

                const uiContainer = document.createElement('div');
                uiContainer.classList.add('header-ui')
                bone.appendChild(uiContainer);

                const uiButton = document.createElement('button');
                uiButton.classList.add('close-dialog');
                uiButton.id = `close-${identifier}`;
                uiContainer.appendChild(uiButton);

                uiButton.addEventListener('click', () => {
                    const dialog = document.getElementById(identifier);
                    dialog.close()
                })

                const buttonParagraph = document.createElement('p');
                const buttonContent = document.createTextNode('ESC');
                buttonParagraph.appendChild(buttonContent);
                uiButton.appendChild(buttonParagraph);

                const buttonIconBone = document.createElement('span');
                const buttonIcon = document.createTextNode('cancel');
                buttonIconBone.classList.add('material-symbols-outlined');
                buttonIconBone.appendChild(buttonIcon);
                uiButton.appendChild(buttonIconBone);

                const cnt = document.querySelector(container);
                console.log(cnt);
                cnt.appendChild(bone)

                resolve({
                    'status': {
                        code: 200,
                        text: 'Request successfull'
                    }
                });
            } catch (err) {
                console.error(err);
                reject({
                    code: 301,
                    text: 'Operation failed',
                    further: err
                });
            }
        })
    }

    async addContentToTable(content, container, contentClass) {
        new Promise((resolve, reject) => {
            try {
                const target = document.getElementById(container);
                const bone = document.createElement('tr');
                bone.classList.add(contentClass);
                bone.innerHTML = content;
                target.appendChild(bone);

                resolve({
                    'status': {
                        code: 200,
                        text: 'Request successfull'
                    }
                });
            } catch (err) {
                console.error(err);
                reject({
                    code: 301,
                    text: 'Operation failed',
                    further: err
                });
            }
        })
    }
}

export const gp = new genPart();