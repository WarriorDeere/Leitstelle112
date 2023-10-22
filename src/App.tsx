import { useEffect, useState, useRef, useCallback } from 'react';
import "./style.css";
import { cstData } from './backend/dataSetup';
import { logFile } from './backend/log';
import { session } from './backend/backend_setup';
import { databaseAPI } from './backend/db';
import { createRoot } from 'react-dom/client';
import { building } from './frontend/script/feature/building';
import { TT_API_KEY } from './setup';
import * as tts from '@tomtom-international/web-sdk-services';
import * as ttm from '@tomtom-international/web-sdk-maps';
import SearchBox from '@tomtom-international/web-sdk-plugin-searchbox';
import { map } from './frontend/script/init/map';
import Draggable from 'react-draggable';

type defaultItemsData = {
    data: renderDialogFalse | renderDialogTrue
};

type renderDialogFalse = {
    show_user_modal: false
}

type renderDialogTrue = {
    show_user_modal: true
    modal_data: {
        modal_order: string[]
    }
}

type KeyValidationData = {
    data: {
        className: string;
    };
};

type FirstLoginData = {
    data: {
        menu: "type_language_select"
    }
}

type DialogHeadType = {
    "dialog": {
        "id": string,
        "title": string,
        "dialogDOM": HTMLDialogElement
    }
}

type DialogBodyType = {
    "dialog":
    {
        "id": string
        "type": "missions" | "buildings"
    }
    "process"?: any
}

type allMissionsReturn = {
    mission_caller: string
    mission_text: string
    mission_title: string
    mission_type: string
    mission_uuid: string
}

type buildingMenuFormData = {
    building_name: string,
    building_type: string,
    building_geo: {
        building_position: string
    },
    building_id: string
}

type submitAddressData = {
    data: {
        address: string
    }
}

export function DeveloperMenu() {

    return (
        <Draggable
            handle=".dev-menu-drag"
            defaultPosition={{ x: 25, y: 25 }}
            bounds={'body'}
        >
            <div className="developer-menu">
                <span className="dev-menu-drag"></span>
                <h3>Developer Menu</h3>
                <button onClick={() => {
                    import("../src/debug/debug.ts").then((module) => {
                        module.default();
                    })
                }}>Run Debug Script</button>
            </div>
        </Draggable>
    );
}

export function DefaultItems({ data }: defaultItemsData) {
    if (data.show_user_modal == true) {
        for (let i = 0; i < data.modal_data.modal_order.length; i++) {
            switch (data.modal_data.modal_order[i]) {
                case 'type_api_key':
                    return (
                        <>
                            <span id="interface-layer">
                                <Navigation />
                                <Skillbar />
                            </span>
                            <dialog id="dialog-template"></dialog>
                            <KeyValidationDialog data={{ className: 'validation-dialog' }} />
                        </>
                    );

                case 'type_language_select':
                    return (
                        <>
                            <span id="interface-layer">
                                <Navigation />
                                <Skillbar />
                            </span>
                            <dialog id="dialog-template"></dialog>
                            <FirstLoginDialog data={{ menu: 'type_language_select' }} />
                        </>
                    );
            }
        }
    } else {
        return (
            <>
                <span id="interface-layer">
                    <Navigation />
                    <Skillbar />
                </span>
                <dialog id="dialog-template"></dialog>
            </>
        );
    }
}

function FirstLoginDialog({ data }: FirstLoginData) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const handleCloseModal = useCallback(() => {
        if (dialogRef.current) {
            dialogRef.current.close();
            location.reload()
        }
    }, []);
    useEffect(() => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                handleCloseModal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleCloseModal]);

    switch (data.menu) {
        case 'type_language_select':
            return (
                <dialog ref={dialogRef} className="language-select" id='lang-modal'>
                    <div className="modal-inner-container">
                        <div className="language-wheel" role='menu'>
                            <span role='menuitem' defaultValue={'fr'} className="lang-item">
                                French Français
                                <span className="fi fi-fr"></span>
                            </span>
                            <span role='menuitem' defaultValue={'us'} className="lang-item">
                                English English
                                <span className="fi fi-us"></span>
                            </span>
                            <span role='menuitem' defaultValue={'de'} className="lang-item lang-item-active">
                                German Deutsch
                                <span className="fi fi-de"></span>
                            </span>
                            <span role='menuitem' defaultValue={'es'} className="lang-item">
                                Spanish Español
                                <span className="fi fi-es"></span>
                            </span>
                            <span role='menuitem' defaultValue={'pl'} className="lang-item">
                                Polish Polski
                                <span className="fi fi-pl"></span>
                            </span>
                        </div>
                        <span className="lang-preview">Sprache</span>
                    </div>
                </dialog>
            )
    }
}

export function KeyValidationDialog({ data }: KeyValidationData) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    const handleCloseModal = useCallback(() => {
        if (dialogRef.current) {
            dialogRef.current.close();
            location.reload()
        }
    }, []);

    useEffect(() => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                handleCloseModal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleCloseModal]);

    return (
        <dialog ref={dialogRef} className={data.className} id='validation-dialog'>
            <div className="desc">
                <h2>API-Key</h2>
                <p>Bitte gib deinen Key ein, um fortzufahren</p>
            </div>
            <div className="interface">
                <div className="input-container">
                    <input id="key-input" type='text' placeholder='Key' />
                    <input id='save-file' type='checkbox' name='save' />
                    <label htmlFor="save">Merken</label>
                </div>
                <button className='enter-key' onClick={async () => {
                    const saveToFile = document.querySelector('#save-file') as HTMLInputElement;
                    const key = document.querySelector('#key-input') as HTMLInputElement;
                    if (saveToFile?.checked) {
                        await cstData.writeData([{
                            "file_name": "api.key",
                            "file_path": "Leitstelle112/userdata/",
                            "file_content": key.value
                        }])
                            .then(() => {
                                const obfSymbol = '*';
                                const obfuscatedKey = key.value.substring(0, 5) + obfSymbol.repeat(key.value.length - 5);
                                logFile.write('INFO', `New API-Key registered: ${obfuscatedKey}`, session)
                                console.log(`New API-Key registered: ${obfuscatedKey}`);
                                handleCloseModal();
                            })
                            .catch((err) => {
                                logFile.write('ERROR', err, session)
                                throw new Error(err);
                            })
                    }
                    else {
                        sessionStorage.setItem('api_key', key.value);
                        handleCloseModal();
                    }
                }}>ok</button>
            </div>
        </dialog>
    );
}

export function Skillbar() {
    return (
        <section className="user-data-bar" id="ud-bar">
            <div className="user-skill-container">
                <span className="skill-bar progress"></span>
                <span className="skill-xp">
                    295
                    <span className="material-symbols-outlined">
                        science
                    </span>
                </span>
                <span className="skill-level">Level 3 Einsatzleiter</span>
            </div>
            <div className="user-wallet">
                35.045
                <span className="material-symbols-outlined">
                    payments
                </span>
            </div>
        </section>);
}

export function Navigation() {
    return (
        <nav className="sidebar">
            <div className="sidebar-item">
                <NavigationButton data={{ iconName: "e911_emergency", tooltip: "Einsätze", buttonId: "emergency", execute: () => { emergencyDialog() } }}></NavigationButton>
            </div>
            <div className="sidebar-item">
                <NavigationButton data={{ iconName: "support_agent", tooltip: "Funk", buttonId: "radio" }}></NavigationButton>
            </div>
            <div className="sidebar-item">
                <NavigationButton data={{ iconName: "apartment", tooltip: "Gebäude", buttonId: "building", execute: () => { buildingDialog() } }}></NavigationButton>
            </div>
            <div className="sidebar-item">
                <NavigationButton data={{ iconName: "hub", tooltip: "Verwaltung", buttonId: "new" }}></NavigationButton>
            </div>
            <span className="placeholder"></span>
            <div className="sidebar-item settings">
                <NavigationButton data={{ iconName: "settings", tooltip: "Einstellungen", buttonId: "settings" }}></NavigationButton>
            </div>
        </nav>
    );
}

function NavigationButton({ data }: any) {
    return (
        <button className="sidebar-btn" id={data.buttonId} onClick={data.execute}>
            <span className="material-symbols-outlined">
                {data.iconName}
            </span>
            <span className="tooltip">
                {data.tooltip}
            </span>
        </button >
    );
}

function emergencyDialog() {
    const dialogRoot = createRoot(document.querySelector('#dialog-template') as HTMLDialogElement);
    const dialogTemplate = document.querySelector('#dialog-template') as HTMLDialogElement;
    dialogTemplate.classList.add('dialog');
    const dialogId = crypto.randomUUID();

    dialogRoot.render(
        <>
            <DialogHead dialog={{ id: `${dialogId}`, title: 'Einsätze', dialogDOM: dialogTemplate }} />
            <DialogBody dialog={{ id: `${dialogId}`, type: 'missions' }} />
        </>
    );

    dialogTemplate.showModal();
}

export function DialogHead({ dialog }: DialogHeadType) {
    return (
        <header className="dialog-head">
            <div className="header-text">
                <p>{dialog.title}</p>
            </div>
            <div className="header-ui">
                <button className="close-dialog" onClick={() => { dialog.dialogDOM.close() }}>
                    <p>ESC</p>
                    <span className="material-symbols-outlined">cancel</span>
                </button>
            </div>
        </header>
    );
}

export function DialogBody({ dialog, process }: DialogBodyType) {
    switch (dialog.type) {
        case "missions":
            return (
                <article className="dialog-item" id={`content-${dialog.id}`}>
                    <MissionItem />
                </article>
            );

        case "buildings":
            return (
                <article className='dialog-item' id={`content-${dialog.id}`}>
                    <section className="buildings">
                        <div className="group-item">
                            <button className="dialog-btn" id="new-building" onClick={process}>
                                <span className="icon material-symbols-outlined">
                                    add
                                </span>
                                <span className="dialog-btn-title">neues Gebäude</span>
                            </button>
                            <button className="dialog-btn" id="manage-buildings" disabled>
                                <span className="icon material-symbols-outlined">
                                    edit
                                </span>
                                <span className="dialog-btn-title">Gebäude bearbeiten</span>
                            </button>
                        </div>
                        <div className="buildings-table-container">
                            <table className="building-table">
                                <thead>
                                    <tr>
                                        <th>Wache</th>
                                        <th>Einsatzgebiet</th>
                                    </tr>
                                </thead>
                                <tbody id={`list-${dialog.id}`}></tbody>
                            </table>
                        </div>
                    </section>
                </article>
            );

        default:
            return (
                <article className="dialog-item">
                    <div className="debug-container">
                        <DebugItem />
                    </div>
                </article>
            );
    }
}

async function pushMissions(): Promise<allMissionsReturn[]> {
    const allOpenMissions = await databaseAPI.select({
        database: {
            name: "mission"
        },
        table: {
            name: "active_missions",
            options: "all"
        }
    })
        .catch((err) => {
            logFile.write('ERROR', err, session);
            throw new Error(err)
        });

    return allOpenMissions;
}

const openMissions = await pushMissions();

function MissionItem() {
    const missionItems =
        openMissions.map(mission =>
            <div className="mission-container" id={`mission-container-${mission.mission_uuid}`} key={mission.mission_uuid}>
                <div className="mission-head">
                    <div className="mission-icon">
                        {/* <img src="https://cdn-icons-png.flaticon.com/512/1453/1453025.png"> */}
                    </div>
                    <div className="mission-title" id={`mission-title-${mission.mission_uuid}`}>{mission.mission_title}</div>
                    <div className="mission-type" id={`mission-type-${mission.mission_uuid}`}>{mission.mission_type}</div>
                    <div className="mission-location" id={`mission-location-${mission.mission_uuid}`}>Adresse lädt...</div>
                </div>
                <div className="mission-information">
                    <div className="mission-desc">
                        <p id={`mission-text-${mission.mission_uuid}`}>{mission.mission_text}</p>
                    </div>
                </div>
                <div className="mission-interface">
                    <button className="mission-cancel">Abbrechen</button>
                    <button className="mission-respond">Annehmen</button>
                </div>
            </div>
        )

    return (
        <>
            {missionItems}
        </>
    );
}

function DebugItem() {
    return (
        <p>How did we get here? Nobody knows...</p>
    )
}

function buildingDialog() {
    const dialogRoot = createRoot(document.querySelector('#dialog-template') as HTMLDialogElement);
    const dialogTemplate = document.querySelector('#dialog-template') as HTMLDialogElement;
    dialogTemplate.classList.add('dialog');
    const dialogId = crypto.randomUUID();

    dialogRoot.render(
        <>
            <DialogHead dialog={{ id: `${dialogId}`, title: 'Gebäude', dialogDOM: dialogTemplate }} />
            <DialogBody dialog={{ id: `${dialogId}`, type: 'buildings' }} process={() => {
                dialogTemplate.close();
                building.add();
            }} />
        </>
    );

    dialogTemplate.showModal();
}

export function BuildingSceneUi() {
    const [selectedResult, setSelectedResult] = useState(null);
    const [step, setStep] = useState("submitAddress");
    const [selectedBuildingType, setSelectedBuildingType] = useState("debug");
    const [buildingPosition, setBuildingPosition] = useState<ttm.LngLatLike | undefined>(undefined);
    const [resultMarkerState, setResultMarker] = useState<ttm.Marker | null>(null);
    const [isFormComplete, setIsFormComplete] = useState(false);

    const [buildingName, setBuildingName] = useState('');

    const searchBox = new SearchBox(tts.services, {
        idleTimePress: 800,
        minNumberOfCharacters: 2,
        searchOptions: {
            key: TT_API_KEY,
            language: 'de-DE',
            countrySet: 'DE',
            idxSet: 'PAD,Str'
        },
        labels: {
            placeholder: 'Addresse',
            noResultsMessage: 'Kein Ergebnis.'
        }
    })

    const areaSearchbox = new SearchBox(tts.services, {
        idleTimePress: 800,
        minNumberOfCharacters: 2,
        searchOptions: {
            key: TT_API_KEY,
            language: 'de-DE',
            countrySet: 'DE',
            idxSet: 'Geo'
        },
        labels: {
            placeholder: 'Einsatzgebiet (Stadtteil, Gemeinde, Landkreis, ...)',
            noResultsMessage: 'Kein Ergebnis.'
        }
    })

    searchBox.on('tomtom.searchbox.resultselected', (tar) => {
        const resultMarker = new ttm.Marker({ draggable: true });
        const resultToolHint = new ttm.Popup({ anchor: 'top' });
        // @ts-expect-error
        const result: SearchBoxResult = tar.data.result;

        map.panTo(result.position, { animate: true })
        resultToolHint.setText(result.address.freeformAddress.replace('undefined', ''));
        resultMarker.setLngLat(result.position);
        resultMarker.setPopup(resultToolHint);
        resultMarker.addTo(map);
        setResultMarker(resultMarker);

        setIsFormComplete(true);

        resultMarker.on('click', () => {
            resultToolHint.addTo(map);
        })

        resultMarker.on('dragstart', () => {
            resultToolHint.remove();
        })

        resultMarker.on('dragend', () => {
            const newPosition = resultMarker.getLngLat();
            tts.services.reverseGeocode({
                key: TT_API_KEY,
                position: newPosition
            })
                .then((r) => {
                    resultToolHint.setText(r.addresses[0].address.freeformAddress.replace('undefined', ''))
                    resultToolHint.addTo(map);
                })
                .catch((err) => {
                    throw new Error(err);
                })
        })

        handleResultSelected(result);
    })

    areaSearchbox.on('tomtom.searchbox.resultselected', (r: any) => {

        const areaId = r.data.result.dataSources.geometry.id;
        map.panTo(r.data.result.position, { animate: true });
        const bounding_roots = r.data.result.boundingBox || r.data.result.viewport;
        if (bounding_roots) {
            const boundingBox = new ttm.LngLatBounds([bounding_roots.topLeftPoint.lng, bounding_roots.btmRightPoint.lat], [bounding_roots.btmRightPoint.lng, bounding_roots.topLeftPoint.lat])
            map.fitBounds(boundingBox, { padding: 100, linear: true });
        }

        tts.services.additionalData({
            key: TT_API_KEY,
            geometriesZoom: 22,
            geometries: [areaId]
        })
            .then((r) => {
                for (let i = 0; i < r.additionalData.length; i++) {
                    const geoJson = r.additionalData[0].geometryData

                    if (map.getLayer(`polygon-mission_area${i}`)) {
                        map.removeLayer(`polygon-mission_area${i}`);
                    }

                    if (map.getLayer(`line-mission_area`)) {
                        map.removeLayer(`line-mission_area`);
                    }

                    map.addLayer({
                        id: `polygon-mission_area`,
                        type: 'fill',
                        source: {
                            type: 'geojson',
                            data: geoJson
                        },
                        paint: {
                            'fill-color': '#ff0000',
                            'fill-opacity': .35
                        }
                    });

                    map.addLayer({
                        id: `line-mission_area`,
                        type: 'line',
                        source: {
                            type: 'geojson',
                            data: geoJson
                        },
                        paint: {
                            'line-color': '#ff0000',
                            'line-width': 1
                        }
                    });
                }
            })
    });

    const handleResultSelected = (result: any) => {
        setSelectedResult(result);
    };

    const handleCancel = () => {

    };

    const handleNext = () => {
        if (step === "submitAddress" && resultMarkerState) {
            resultMarkerState.setDraggable(false);
            setStep("detailBuilding");
        } else if (step === "detailBuilding" && buildingPosition) {
            const uuid = crypto.randomUUID();
            console.log(buildingPosition);
            const positionStringfy = buildingPosition.toString();
            const formData: buildingMenuFormData = {
                building_name: buildingName,
                building_type: selectedBuildingType,
                building_geo: {
                    building_position: positionStringfy
                },
                building_id: uuid
            };

            console.log('db ins');
            console.log(formData);

            databaseAPI.insert({
                database: {
                    name: 'items'
                },
                table: {
                    name: 'buildings',
                    columns: 'building_type, building_position, building_price, building_name, building_id',
                    values: `'${formData.building_type}', '${formData.building_geo.building_position}', 'undefined', '${formData.building_name}', '${formData.building_id}'`
                }
            })
                .catch((err) => {
                    throw new Error(err)
                })
        }
    };

    const handleBuildingTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBuildingType(event.target.value);
        setIsFormComplete(false);
        if (resultMarkerState) {
            const newBuildingPosition = resultMarkerState.getLngLat();
            resultMarkerState.remove()

            switch (event.target.value) {
                case 'fire':
                    const fireBuildingMarker = new ttm.Marker({ color: 'rgb(255, 0, 0)' });
                    fireBuildingMarker.remove();
                    fireBuildingMarker.setLngLat(newBuildingPosition).addTo(map);
                    setBuildingPosition(newBuildingPosition);
                    break;

                case 'fire_volunteer':
                    const volunteerBuildingMarker = new ttm.Marker({ color: 'rgb(255, 150, 0)' });
                    volunteerBuildingMarker.remove();
                    volunteerBuildingMarker.setLngLat(newBuildingPosition).addTo(map);
                    break;

                default:
                    const debugBuildingMarker = new ttm.Marker();
                    debugBuildingMarker.remove();
                    debugBuildingMarker.setLngLat(newBuildingPosition).addTo(map);
                    break;
            }
        }
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newName = event.target.value;
        const isValidName = /^[A-Za-z0-9-_\säöüÄÖÜß]*$/.test(newName);
        if (isValidName) {
            setBuildingName(newName);
        }
        setIsFormComplete(isValidName && newName !== "" && selectedBuildingType !== 'debug');
    };

    const searchBoxDOMRef = useRef<HTMLSpanElement>(null);
    const areaSearchboxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (searchBoxDOMRef.current) {
            const searchBoxDOM = searchBox.getSearchBoxHTML();
            searchBoxDOMRef.current.appendChild(searchBoxDOM);
        }
        if (areaSearchboxRef.current) {
            const areaSearchboxDOM = areaSearchbox.getSearchBoxHTML();
            areaSearchboxRef.current.appendChild(areaSearchboxDOM);
        }
    }, []);

    const SubmitAddress = ({ data }: submitAddressData) => (
        <>
            <p className="user-hint">Verschiebe den Marker um den Standort anzupassen.</p>
            <br></br>
            <p className="user-hint">Aktuelle Addresse: {data.address}</p>
        </>
    );

    const DetailBuilding = () => {
        useEffect(() => {
            if (areaSearchboxRef.current) {
                const areaSearchboxDOM = areaSearchbox.getSearchBoxHTML();
                areaSearchboxRef.current.appendChild(areaSearchboxDOM);
            }
        }, []);

        return (
            <>
                <div className="user-in-text">
                    <label htmlFor='building-name' className="user-hint">gebäudename</label>
                    <input
                        name="building-name"
                        type="text"
                        placeholder="Gebäudename"
                        value={buildingName}
                        onChange={handleNameChange}
                        pattern="^[A-Za-z0-9_\-]*$"
                        required
                        className="building-name-input"
                    />
                    <span className="input-feedback">
                        Es sind nur Buchstaben, Zahlen, Bindestriche und Unterstriche erlaubt!
                    </span>
                </div>
                <div className="user-dropdown">
                    <label htmlFor='building-type' className="user-hint">gebäudetyp</label>
                    <select name="building-type" id="building-type" value={selectedBuildingType} onChange={handleBuildingTypeChange}>
                        <option value="fire">Berufsfeuerwehr</option>
                        <option value="fire_volunteer">Freiwillige Feuerwehr</option>
                        <option value="debug">Debug Building</option>
                    </select>
                </div>
                <div className="mission-area-container">
                    <span className="user-hint">einsatzgebiet</span>
                    <div ref={areaSearchboxRef}></div>
                </div>
            </>
        );
    };

    const StepComponent = () => {
        switch (step) {
            case "submitAddress":
                return <SubmitAddress data={{ "address": step }} />;
            case "detailBuilding":
                return <DetailBuilding />;
            default:
                return null;
        }
    };

    return (
        <div className="search-box">
            <div className="user-hint-container">
                {
                    selectedResult
                        ? (
                            <StepComponent />
                        )
                        : (
                            <>
                                <p className="user-hint">Klicke ein Ergebnis an, es wird mit einem Marker auf der Karte angezeigt.</p>
                                <br />
                                <p className="user-hint">Diesen kannst du jederzeit verschieben, die Adresse wird automatisch aktualisiert.</p>
                                <span ref={searchBoxDOMRef}></span>
                            </>
                        )
                }
            </div>
            <div className="place-building-ui">
                <button className="btn-cancel" onClick={handleCancel}>Abbrechen</button>
                <button className="btn-next" onClick={handleNext} disabled={!isFormComplete}>Weiter</button>
            </div>
        </div>
    );
}