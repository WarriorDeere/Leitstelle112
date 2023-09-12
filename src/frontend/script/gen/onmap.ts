import tt_map from "@tomtom-international/web-sdk-maps";
import { map } from "../init/map.ts";

class onMap {
    loadMarker(data: any) {
        const missionMarker = new tt_map.Popup({ className: 'tt-popup', closeOnClick: false });
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