import { map } from "../init/map.js";

class location {
    async withinPolygon(apiKey, additionalDataResult) {

        const randomPointWithinPolygon = turf.randomPoint(1, { bbox: turf.bbox(additionalDataResult.geometryData) });
        const randomCoordinate = randomPointWithinPolygon.features[0].geometry.coordinates;
        var newMission = new tt.LngLat.convert(randomCoordinate);

        tt.services.reverseGeocode({
            key: apiKey,
            position: newMission
        }).then((response) => {
            var missionPp = new tt.Popup({ className: 'tt-popup', closeOnClick: false });
            missionPp.setHTML(`<strong>Neuer Einsatz</strong><div>${response.addresses[0].address.countrySubdivision}, ${response.addresses[0].address.municipality}, ${response.addresses[0].address.streetNameAndNumber}</div>`);
            missionPp.setLngLat(newMission);
            missionPp.addTo(map);
        });
    }
}

export const genLocation = new location();