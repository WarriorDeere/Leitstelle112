export const fleet = new class {
    manage() {

    }

    async add(identifier) {

        async function fetchPaths() {
            return new Promise(async (resolve, reject) => {
                await fetch('http://127.0.0.1:5500/config/app.json')
                    .then(async (r) => {
                        const configObject = await r.json();
                        resolve(configObject.paths);
                    })
                    .catch((err) => {
                        reject(err);
                        throw new Error(err);
                    });
            })
        }

        const shopItemData = fetchPaths()
            .then(async (r) => {
                const path = await r.shop_items;
                return path;
            })
            .then(async (path) => {
                return await fetch(`http://127.0.0.1:5500/${path}`)
                    .then(async (r) => {
                        const data = await r.json();
                        return data;
                    })
                    .catch((err) => {
                        throw new Error(err);
                    });
            })
            .catch((err) => {
                throw new Error(err);
            })

        const content = document.querySelector(`#${identifier.content}`);
        const vehicleArray = await shopItemData.then((r) => { return r.vehicle })
        content.innerHTML = '';

        vehicleArray.forEach(vehicle => {
            const vehicleCardBone = document.createElement('div');
            const vehicleCardUUID = crypto.randomUUID();
            content.appendChild(vehicleCardBone);
            vehicleCardBone.id = vehicleCardUUID;
            vehicleCardBone.innerHTML = JSON.stringify(vehicle);
        });

        const dialogTitle = document.querySelector(`#${identifier.title}`);
        dialogTitle.innerHTML = `
            Fahrzeugmarkt
        `;
    }
}