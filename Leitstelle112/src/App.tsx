import { Fragment } from 'react';
import { randomMission } from "./frontend/script/gen/mission";
import { emergencyDialog } from "./init";
import "./style.css";

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