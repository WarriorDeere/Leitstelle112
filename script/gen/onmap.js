import { map } from "../init/map.js";

class onMap {
    loadMarker(data) {
        const missionMarker = new tt.Popup({ className: 'tt-popup', closeOnClick: false });
        missionMarker.setHTML(`
            <strong>${data.emergencyHeader.type}</strong>
            <br>
            <span>
                ${data.emergencyHeader.location}
            </span>
        `);
        missionMarker.setLngLat(data.emergencyHeader.lngLat);
        missionMarker.addTo(map);
    }
}

export const itemOnMap = new onMap();