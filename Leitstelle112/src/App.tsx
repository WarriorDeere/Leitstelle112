import { useEffect, useRef, useCallback } from 'react';
import { emergencyDialog } from "./init";
import "./style.css";
import { cstData } from './backend/dataSetup';
import { logFile } from './backend/log';
import { session } from './backend/backend_setup';
import { databaseAPI } from './backend/db';

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
                    <MissionItem />
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
    mission_caller: string
    mission_text: string
    mission_title: string
    mission_type: string
    mission_uuid: string
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

    console.log(allOpenMissions);

    return allOpenMissions;
}

const openMissions = await pushMissions();

function MissionItem() {
    openMissions.forEach(mission => {
        console.log(mission);
    })
    const missionItems = openMissions
        .map(mission =>
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