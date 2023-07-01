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
            });

        const shopSetupData = fetchPaths()
            .then(async (r) => {
                const path = await r.shop_setup;
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
            });

        const content = document.querySelector(`#${identifier.content}`);
        const vehicleArray = await shopItemData.then((r) => { return r.vehicle })
        const categoryObject = await shopSetupData.then((r) => { return r.category })
        content.innerHTML = '';

        vehicleArray.forEach(async vehicle => {
            const vehicleCardBone = document.createElement('div');
            const vehicleCardUUID = crypto.randomUUID();
            content.appendChild(vehicleCardBone);
            vehicleCardBone.id = vehicleCardUUID;
            vehicleCardBone.classList.add('vehicle-card');

            const vehicleType = String(vehicle.type);

            vehicleCardBone.innerHTML = `

            <div class="vc-header">
                <img class="vc-icon" src="https://xn--feuerwehr-fssen-9vb.de/wp-content/uploads/2019/07/HLF-20-2019-06-05-001.jpg">
                ${vehicleType}
            </div>
            <div class="vc-strength">Personal: zwischen ${Number(vehicle.crew_min)} und ${Number(vehicle.crew_max)}</div>
            <div class="vc-crew" id="crew-member-area-${vehicleCardUUID}">Mögliche Aufteilung: </div>
            <div class="vc-default-inventory" id="default-inventory-area-${vehicleCardUUID}"></div>
            <div class="vc-extra-inventory" id="extra-inventory-area-${vehicleCardUUID}"></div>
            <div class="vc-interact">
            <button class="buy-vehicle-btn" id="buy-${vehicleCardUUID}">
                <span class="material-symbols-outlined">
                    shopping_cart
                </span>                
                <span class="buy-price-area">
                    <span id="price-${vehicleCardUUID}">Kaufpreis lädt</span>                        
                    <span class="material-symbols-outlined">
                        payments
                    </span>
                </span>
            </button>
            </div>
            `;

            const vehiclePriceDOM = document.querySelector(`#price-${vehicleCardUUID}`);
            if (vehicle.price.use_default_price) {
                if (vehicle.category in categoryObject) {
                    if (!isNaN(categoryObject[vehicle.category].default.price)) {
                        vehiclePriceDOM.innerHTML = Number(categoryObject[vehicle.category].default.price);
                    }
                    else {
                        vehiclePriceDOM.innerHTML = `Error: x001e02 - invalid value, '##shop_setup.json##.price' must be a number`;
                        throw new Error(`Error: x001e02 - invalid value, '##shop_setup.json##.price' must be a number`);
                    }
                }
                else {
                    vehiclePriceDOM.innerHTML = `Error: x002e01 - not found, '##shop_setup.json##.category' was not found`;
                    throw new Error(`Error: x002e01 - not found, '##shop_setup.json##.category' was not found`);
                }
            }
            else {
                vehiclePriceDOM.innerHTML = `Error: x001e - invalid value, '##shop_items.json##.use_default_price' must be set to 'true'`;
                throw new Error(`Error: x001e - invalid value, '##shop_items.json##.use_default_price' must be set to 'true'`);
            }

            const crewCardContainer = document.querySelector(`#crew-member-area-${vehicleCardUUID}`);

            vehicle.crew.forEach(crewMember => {
                const crewMemberUUID = crypto.randomUUID();
                const crewMemberCardBone = document.createElement('div');

                crewMemberCardBone.classList.add('crew-meber-card');
                if (crewMember.required) {
                    crewMemberCardBone.classList.add('crew-meber-req');
                }
                crewMemberCardBone.id = `crew-member-${crewMemberUUID}`

                crewMemberCardBone.innerHTML = String(crewMember.type_long);

                crewCardContainer.appendChild(crewMemberCardBone);
            });

            const extraInventoryCardContainer = document.querySelector(`#extra-inventory-area-${vehicleCardUUID}`);

            vehicle.equipment.vehicle_specific.forEach(kit => {
                const kitUUID = crypto.randomUUID();
                const equipmentKitBone = document.createElement('div');

                equipmentKitBone.classList.add('equipment-kit-card');
                equipmentKitBone.id = `kit-${kitUUID}`;

                if (kit === undefined) {
                    equipmentKitBone.innerHTML = 'Keine Ausrüstung verfügbar';
                }
                else {
                    equipmentKitBone.innerHTML = `Zusätzliche Ausrüstung: ${String(kit)}`;
                }

                extraInventoryCardContainer.appendChild(equipmentKitBone);
            });

            const defaultInventoryCardContainer = document.querySelector(`#default-inventory-area-${vehicleCardUUID}`);

            if (vehicle.equipment.default) {
                const defaultKitUUID = crypto.randomUUID();
                const defaultKitBone = document.createElement('div');

                defaultKitBone.classList.add('equipment-kit-card');
                defaultKitBone.id = `default-kit-${defaultKitUUID}`;

                defaultInventoryCardContainer.appendChild(defaultKitBone);
                if (vehicle.equipment.default.hose) {
                    const hoseTextDOM = document.createTextNode(`Schläuche: ${Number(vehicle.equipment.default.hose)}m`);
                    defaultKitBone.appendChild(hoseTextDOM);
                }
                if (vehicle.equipment.default.scba) {
                    const scbaTextDOM = document.createTextNode(`Atemschutzgeräte: ${Number(vehicle.equipment.default.scba)}`);
                    defaultKitBone.appendChild(scbaTextDOM);
                }
            }
        });

        const dialogTitle = document.querySelector(`#${identifier.title}`);
        dialogTitle.innerHTML = `Fahrzeugmarkt`;
    }
}