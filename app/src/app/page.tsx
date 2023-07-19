export default function Home() {
  return (
    <body>
      <nav className="sidebar">
        <div className="sidebar-item">
          <button className="sidebar-btn" id="emergency">
            <span className="material-symbols-outlined">
              e911_emergency
            </span>
            <span className="tooltip">
              Einsätze
            </span>
          </button>
        </div>
        <div className="sidebar-item">
          <button className="sidebar-btn" id="radio">
            <span className="material-symbols-outlined">
              support_agent
            </span>
            <span className="tooltip">
              Funk
            </span>
          </button>
        </div>
        <div className="sidebar-item">
          <button className="sidebar-btn" id="building">
            <span className="material-symbols-outlined">
              apartment
            </span>
            <span className="tooltip">
              Gebäude
            </span>
          </button>
        </div>
        <div className="sidebar-item">
          <button className="sidebar-btn" id="new">
            <span className="material-symbols-outlined">
              hub
            </span>
            <span className="tooltip">
              Verwaltung
            </span>
          </button>
        </div>
        <span className="placeholder"></span>
        <div className="sidebar-item settings">
          <button className="sidebar-btn" id="settings">
            <span className="material-symbols-outlined">
              settings
            </span>
            <span className="tooltip">
              Einstellungen
            </span>
          </button>
        </div>
      </nav>

      <section className="dialog-container" id="dialog-container"></section>

      <section className="map-container" id="map"></section>
    </body>
  )
}
