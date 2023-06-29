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

        vehicleArray.forEach(async vehicle => {
            const vehicleCardBone = document.createElement('div');
            const vehicleCardUUID = crypto.randomUUID();
            content.appendChild(vehicleCardBone);
            vehicleCardBone.id = vehicleCardUUID;
            vehicleCardBone.classList.add('vehicle-card');

            const vehicleType = String(vehicle.type);

            vehicleCardBone.innerHTML = `
            <div class="vc-type">${vehicleType}</div>
            <div class="vc-crew" id="crew-member-area-${vehicleCardUUID}">Mögliche Aufteilung: </div>
            <div class="vc-inventory" id="inventory-area-${vehicleCardUUID}"></div>
            <div class="vc-interact"></div>
            `;

            const crewCardContainer = document.querySelector(`#crew-member-area-${vehicleCardUUID}`);

            const crewStrengthCardBone = document.createElement('div');
            crewStrengthCardBone.innerHTML = `Personal: zwischen ${Number(vehicle.crew_min)} und ${Number(vehicle.crew_max)}`;
            crewCardContainer.appendChild(crewStrengthCardBone);

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

            const inventoryCardContainer = document.querySelector(`#inventory-area-${vehicleCardUUID}`);
            
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

                inventoryCardContainer.appendChild(equipmentKitBone);
            });

            if (vehicle.equipment.default) {
                const defaultKitUUID = crypto.randomUUID();
                const defaultKitBone = document.createElement('div');

                defaultKitBone.classList.add('equipment-kit-card');
                defaultKitBone.id = `default-kit-${defaultKitUUID}`;

                inventoryCardContainer.appendChild(defaultKitBone);
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