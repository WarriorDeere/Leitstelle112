import { Fragment, useEffect, useRef, useCallback } from 'react';
import { randomMission } from "./frontend/script/gen/mission";
import { emergencyDialog } from "./init";
import "./style.css";
import { cstData } from './backend/dataSetup';
import { logFile } from './backend/log';
import { session } from './backend/backend_setup';

type defaultItemsData = {
    data: renderDialogFalse | renderDialogTrue
};

type renderDialogFalse = {
    validation_dialog: false
}

type renderDialogTrue = {
    validation_dialog: true
    dialog_data: {
        class: string
    }
}

export function DefaultItems({ data }: defaultItemsData) {
    if (data.validation_dialog == true) {
        // const dialog = document.querySelector('#validation-dialog') as HTMLDialogElement;
        // dialog.showModal();
        return (
            <>
                <span id="interface-layer">
                    <Navigation />
                    <Skillbar />
                </span>
                <dialog id="dialog-template"></dialog>
                <KeyValidationDialog data={{ class: data.dialog_data.class }} />
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

type KeyValidationData = {
    data: {
        class: string;
    };
};

export function KeyValidationDialog({ data }: KeyValidationData) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    const handleCloseModal = useCallback(() => {
        if (dialogRef.current) {
            dialogRef.current.close();
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
        <dialog ref={dialogRef} className={data.class} id='validation-dialog'>
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
                        console.log(key.value);

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
                                handleCloseModal(); // Schließe das Modal nach erfolgreichem Schreibvorgang
                            })
                            .catch((err) => {
                                logFile.write('ERROR', err, session)
                                throw new Error(err);
                            })
                    }
                    else {
                        sessionStorage.setItem('api_key', key.value);
                        handleCloseModal(); // Schließe das Modal
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
                <NavigationButton data={{ iconName: "apartment", tooltip: "Gebäude", buttonId: "building" }}></NavigationButton>
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

type DialogHeadType = {
    "dialog": {
        "id": string,
        "title": string,
        "dialogDOM": HTMLDialogElement
    }
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

type DialogBodyType = {
    "dialog": {
        "id": string,
        "type": string
    }
}

export function DialogBody({ dialog }: DialogBodyType) {
    const dialogContentId = `content-${dialog.id}`;

    switch (dialog.type) {
        case "mission":
            return (
                <article className="dialog-item" id={dialogContentId}>
                    <div className="mission-container" id="mission-container-">
                        <MissionItem />
                    </div>
                </article>
            );

        default:
            return (
                <article className="dialog-item" id={dialogContentId}>
                    <div className="debug-container">
                        <DebugItem />
                    </div>
                </article>
            );
    }
}

type allMissionsReturn = {
    "header": {
        "title": string,
        "type": string,
        "id": string
    },
    "mission": {
        "text": string,
        "caller": string
    }
}

async function pushMissions(): Promise<allMissionsReturn[]> {
    const allMissions = [];
    allMissions.push(await randomMission());
    return allMissions;
}

const openMissions = await pushMissions();

function MissionItem() {
    const missionItems = openMissions
        .map(mission =>
            <Fragment key={mission.header.id}>
                <div className="mission-head">
                    <div className="mission-icon">
                        {/* <img src="https://cdn-icons-png.flaticon.com/512/1453/1453025.png"> */}
                    </div>
                    <div className="mission-title" id={`mission-title-${mission.header.id}`}>{mission.header.title}</div>
                    <div className="mission-type" id={`mission-type-${mission.header.id}`}>{mission.header.type}</div>
                    <div className="mission-location" id={`mission-location-${mission.header.id}`}>Adresse lädt...</div>
                </div>
                <div className="mission-information">
                    <div className="mission-desc">
                        <p id={`mission-text-${mission.header.id}`}>{mission.mission.text}</p>
                    </div>
                </div>
                <div className="mission-interface">
                    <button className="mission-cancel">Abbrechen</button>
                    <button className="mission-respond">Annehmen</button>
                </div>
            </Fragment>
        )
    return (
        <>
            {missionItems}
        </>
    );
    // if () {
    // } else if (missionDialogContent.success === false) {
    //     return (
    //         <div className="error-msg">
    //             <h1>oopsie, doopise - an error occured.</h1>
    //             <code className="error-field">{missionDialogContent.data.cause}</code>
    //             <i>
    //                 Please relaunch the App. If the error persist <a title="Opens: https://github.com/WarriorDeere/Leitstelle112/issues/new in your browser" href="https://github.com/WarriorDeere/Leitstelle112/issues/new" target="_blank">submit a bug report</a> on GitHub.
    //             </i>
    //         </div>
    //     )
    // }
}

function DebugItem() {
    return (
        <p>How did we get here? Nobody knows...</p>
    )
}