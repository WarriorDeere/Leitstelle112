import { useEffect, useRef, useCallback } from 'react';
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

type defaultItemsData = {
    data: renderDialogFalse | renderDialogTrue
};

type renderDialogFalse = {
    validation_dialog: false
}

type renderDialogTrue = {
    validation_dialog: true
    dialog_data: {
        className: string
    }
}

type KeyValidationData = {
    data: {
        className: string;
    };
};

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

export function DefaultItems({ data }: defaultItemsData) {
    if (data.validation_dialog == true) {
        return (
            <>
                <span id="interface-layer">
                    <Navigation />
                    <Skillbar />
                </span>
                <dialog id="dialog-template"></dialog>
                <KeyValidationDialog data={{ className: data.dialog_data.className }} />
            </>
        )
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
    const searchBox = new SearchBox(tts.services, {
        idleTimePress: 1000,
        minNumberOfCharacters: 2,
        searchOptions: {
            key: TT_API_KEY,
            language: 'de-DE',
            countrySet: 'DE'
        },
        labels: {
            placeholder: 'Addresse',
            noResultsMessage: 'Kein Ergebnis.'
        },
        filterSearchResults: (result: void): boolean => {
            // @ts-ignore
            switch (result.type) {
                case 'POI':
                    return false;
                case 'Address':
                    return true;
                default:
                    return true;
            }
        }
    })

    type SearchBoxResult = {
        "type": string,
        "id": string,
        "score": number,
        "address": {
            "streetNumber": string,
            "streetName": string,
            "municipality": string,
            "countrySecondarySubdivision": string,
            "countrySubdivision": string,
            "postalCode": string,
            "countryCode": string,
            "country": string,
            "countryCodeISO3": string,
            "freeformAddress": string,
            "localName": string
        },
        "position": {
            "lng": number,
            "lat": number
        },
        "viewport": {
            "topLeftPoint": {
                "lng": number,
                "lat": number
            },
            "btmRightPoint": {
                "lng": number,
                "lat": number
            }
        },
        "entryPoints": [
            {
                "type": "main",
                "position": {
                    "lng": number,
                    "lat": number
                }
            }
        ],
        "__resultListIdx__": number
    }

    searchBox.on('tomtom.searchbox.resultselected', (tar) => {
        // @ts-expect-error
        const result: SearchBoxResult = tar.data.result;
        const resultMarker = new ttm.Marker();
        const resultToolHint = new ttm.Popup({ anchor: 'top' });

        map.panTo(result.position, { animate: true })
        resultToolHint.setText(result.address.freeformAddress);
        resultMarker.setLngLat(result.position).addTo(map);

        resultMarker.setPopup(resultToolHint);
        resultMarker.on('click', () => {
            resultToolHint.addTo(map);
        })
    })

    const searchBoxDOMRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (searchBoxDOMRef.current) {
            const searchBoxDOM: HTMLElement = searchBox.getSearchBoxHTML();
            searchBoxDOMRef.current.appendChild(searchBoxDOM);
        }
    }, []);

    return (
        <div className="search-box">
            <p className="user-hint">Die Ergebnisse werden mit einem Marker auf der Karte markiert.</p>
            <br />
            <p className="user-hint">Diesen kannst du jederzeit verschieben, die Addresse wird automatisch aktualisiert.</p>
            <span ref={searchBoxDOMRef}></span>
        </div>
    );
}

// function SearchResultItem(props: { results: any[] }) {

//     map.triggerRepaint();

//     for (let i = 0; i < props.results.length; i++) {

//         const resultMapMarker = new ttm.Marker();
//         const resultToolHint = new ttm.Popup({ anchor: 'top' });

//         resultToolHint.setText(props.results[i].address?.freeformAddress);

//         resultMapMarker.setLngLat(props.results[i].position).addTo(map);

//         resultMapMarker.setPopup(resultToolHint);
//         resultMapMarker.on('click', () => {
//             resultToolHint.addTo(map);
//         })


//         if (i === 0) {
//             map.panTo(props.results[i].position, { animate: true })
//         }

//     }

//     const bestMatchArray = props.results.slice(0, 3);

//     return (
//         <div className="result-area" id='result-container'>
//             <div className="best-match-container">
//                 {bestMatchArray.map((result, index) => (
//                     <div className="best-item" key={index}>
//                         {result.address.freeformAddress}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }