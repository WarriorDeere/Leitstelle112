import { map } from "../init/map.js";

class location {

    /**
     * @description generate a random location within a given polygon.
     * @param {string} apiKey valid tomtom apiKey.
     * @param {string} additionalDataResult polygon GeoJSON.
     * @param {boolean} addToMap default: true. Whether a marker will added
     */

    async withinPolygon(apiKey, additionalDataResult, addToMap) {
        return new Promise((resolve, reject) => {
            const randomPointWithinPolygon = turf.randomPoint(1, { bbox: turf.bbox(additionalDataResult.geometryData) });
            const randomCoordinate = randomPointWithinPolygon.features[0].geometry.coordinates;
            var newMission = new tt.LngLat.convert(randomCoordinate);

            let response = {
                'status': {
                    code: 300,
                    text: 'Closed without feedback'
                },
                'data': new Object(undefined)
            };

            if (!addToMap) {
                tt.services.reverseGeocode({
                    key: apiKey,
                    position: newMission
                }).then((r) => {
                    response = {
                        'status': {
                            code: 200,
                            text: 'Request successfull'
                        },
                        'data': r
                    }
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                });
            }
            else {
                tt.services.reverseGeocode({
                    key: apiKey,
                    position: newMission
                }).then((r) => {
                    const municipality = String(r.addresses[0].address.municipality);
                    const municipalitySubdivision = String(r.addresses[0].address.municipalitySubdivision);
                    const streetNameAndNumber = String(r.addresses[0].address.streetNameAndNumber);

                    var missionPp = new tt.Popup({ className: 'tt-popup', closeOnClick: false });
                    missionPp.setHTML(`<strong>Neuer Einsatz</strong><div>${municipality.replace('undefined', '')}, ${municipalitySubdivision.replace('undefined', '')}, ${streetNameAndNumber.replace('undefined', '')}</div>`);
                    missionPp.setLngLat(newMission);
                    missionPp.addTo(map);

                    response = {
                        'status': {
                            code: 200,
                            text: 'Request successfull'
                        },
                        'data': r
                    }
                    resolve(response);
                }).catch((err) => {
                    reject(err);
                });
            }

        });

    }
}

export const genLocation = new location();