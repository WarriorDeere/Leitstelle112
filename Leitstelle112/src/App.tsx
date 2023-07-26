import { randomMission } from "./frontend/script/gen/mission";
import "./style.css";

const dialogTemplate = document.querySelector('#dialog-template') as HTMLDialogElement;

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
                <NavigationButton data={{ iconName: "e911_emergency", tooltip: "Einsätze", buttonId: "emergency", execute: () => { dialogTemplate.showModal(); } }}></NavigationButton>
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

export function DialogHead({ dialog }: any) {
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

export function DialogBody({ dialog }: any) {
    const dialogContenId = `content-${dialog.id}`
    return (
        <article className="dialog-item" id={dialogContenId}>
            <div className="mission-container">
                <MissionItem />
            </div>
        </article>
    );
}

const missionDialogContent = await randomMission().then((r) => {
    const rawText = new String(r.mission.text)
    const callerName: any = r.mission.caller
    const finalText = rawText.replace('#NAME#', callerName).replace('#LOCATION#', '~~~');
    return {
        "text": finalText,
        "title": r.header.title,
        "type": r.header.type
    };
});

function MissionItem() {
    return (
        <>
            <div className="mission-head">
                <div className="mission-icon">
                    {/* <img src="https://cdn-icons-png.flaticon.com/512/1453/1453025.png"> */}
                </div>
                <div className="mission-title" id="mission-title-${identifer}">{missionDialogContent.title}</div>
                <div className="mission-type" id="mission-type-${identifer}">{missionDialogContent.type}</div>
                <div className="mission-location" id="mission-location-${identifer}">Adresse lädt...</div>
            </div>
            <div className="mission-information">
                <div className="mission-desc">
                    <p id="mission-text-${identifer}">{missionDialogContent.text}</p>
                </div>
            </div>
            <div className="mission-interface">
                <button className="mission-cancel">Abbrechen</button>
                <button className="mission-respond">Annehmen</button>
            </div>
        </>
    );
}