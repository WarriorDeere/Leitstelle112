import { database } from "../database.js";
import { map } from "../init/map.js";
import { dialog } from "./dialog.js";
import { pp } from "./popup.js";

class district {

    constructor() {
        this.closeStatus = {
            code: 300,
            text: 'Closed without feedback'
        };
    }

    async create(apiKey) {
        var NO_POLYGON_MESSAGE = 'Kein Ergebnis';
        var POLYGON_ID = 'searchResultPolygon';
        var OUTLINE_ID = 'searchResultOutline';
        new Foldable('#foldable', 'top-right');
        var roundLatLng = Formatters.roundLatLng;

        var popup = new tt.Popup({ className: 'tt-popup', closeOnClick: false });

        function clearLayer(layerID) {
            if (map.getLayer(layerID)) {
                map.removeLayer(layerID);
                map.removeSource(layerID);
            }
        }

        function clearPopup() {
            popup.remove();
        }

        function renderPolygon(searchResult, additionalDataResult) {
            var geoJson = additionalDataResult && additionalDataResult.geometryData;
            if (!geoJson) {
                throw Error(NO_POLYGON_MESSAGE);
            }
            map.addLayer({
                id: POLYGON_ID,
                type: 'fill',
                source: {
                    type: 'geojson',
                    data: geoJson
                },
                paint: {
                    'fill-color': '#ff0000',
                    'fill-opacity': .35
                }
            });
            map.addLayer({
                id: OUTLINE_ID,
                type: 'line',
                source: {
                    type: 'geojson',
                    data: geoJson
                },
                paint: {
                    'line-color': '#ff0000',
                    'line-width': 1
                }
            });

            var boundingBox = searchResult.boundingBox || searchResult.viewport;
            boundingBox = new tt.LngLatBounds([
                [boundingBox.topLeftPoint.lng, boundingBox.btmRightPoint.lat],
                [boundingBox.btmRightPoint.lng, boundingBox.topLeftPoint.lat]
            ]);

            map.fitBounds(boundingBox, { padding: 100, linear: true });

            pp.save(
                {
                    'ui_text': {
                        'save': 'Übernehmen',
                        'close': 'Abbrechen'
                    },
                    'user_input':{
                        'add': true,
                        'id': 'object-title',
                        'display': 'Name deiner Wache'
                    }
                },
                () => {
                    const uuid = crypto.randomUUID();

                    dialog.editMissionArea('Einsatzgebiet')

                    const objectTitle = document.querySelector('#object-title');
                    let objectLocation;

                    database.post({
                        'database': 'missionStorage',
                        'version': 2,
                        'object_store': 'missionArea',
                        'keyPath': 'area'
                    },
                        {
                            area: uuid,
                            geoJSON: additionalDataResult,
                            object_title: objectTitle.value,
                            object_location: objectLocation,
                            area_title: `${searchResult.address.municipality} ${searchResult.address.municipalitySubdivision}`
                        }
                    );

                    clearLayer(POLYGON_ID);
                    clearLayer(OUTLINE_ID);
                    popup.remove()
                    ttSearchBox.onRemove();
                },
                () => {
                    clearLayer(POLYGON_ID);
                    clearLayer(OUTLINE_ID);
                    popup.remove()
                    ttSearchBox.onRemove();
                }
            );
        }

        function showPopup(searchResult) {
            if (!searchResult.position) {
                return;
            }

            var resultPosition = {
                lng: roundLatLng(searchResult.position.lng),
                lat: roundLatLng(searchResult.position.lat)
            };

            popup.setHTML(`
                <div>
                    <strong>${searchResult.address.municipality} ${searchResult.address.municipalitySubdivision}</strong>
                    <br>
                    <i>Das neue Einsatzgebiet ist Rot markiert.</i>
                </div>
            `);
            popup.setLngLat([resultPosition.lng, resultPosition.lat]);
            popup.addTo(map);
        }

        function showLoadingPopup() {
            popup.setHTML('<strong>Loading...</strong>');
            if (!popup.isOpen()) {
                popup.setLngLat(map.getCenter());
                popup.addTo(map);
            }
        }

        function loadPolygon(searchResult) {
            if (!searchResult) {
                return;
            }
            return new Promise(function (resolve) {
                clearLayer(POLYGON_ID);
                clearLayer(OUTLINE_ID);
                showLoadingPopup();
                resolve();
            }).then(function () {
                var polygonId = searchResult && searchResult.dataSources && searchResult.dataSources.geometry.id;
                if (!polygonId) {
                    throw Error(NO_POLYGON_MESSAGE);
                }
                return tt.services.additionalData({
                    key: apiKey,
                    geometries: [polygonId],
                    geometriesZoom: 22
                });
            }).then(function (additionalDataResponse) {
                var additionalDataResult = additionalDataResponse && additionalDataResponse.additionalData &&
                    additionalDataResponse.additionalData[0];
                renderPolygon(searchResult, additionalDataResult);
                showPopup(searchResult);
            }).catch((error) => {
                clearPopup();
                if (error.message) {
                    console.error(error)
                }
            });
        }

        var ttSearchBox = new tt.plugins.SearchBox(tt.services, {
            searchOptions: {
                key: apiKey,
                language: 'de-DE'
            },
            filterSearchResults: (searchResult) => {

                return Boolean(
                    searchResult.dataSources &&
                    searchResult.dataSources.geometry &&
                    searchResult.dataSources.geometry.id &&
                    searchResult.address.countryCode === 'DE'
                );
            },
            labels: {
                noResultsMessage: 'Kein Ergebnis',
                placeholder: 'Suchen'
            }
        });

        document.getElementById('searchBoxPlaceholder').appendChild(ttSearchBox.getSearchBoxHTML());

        ttSearchBox.on('tomtom.searchbox.resultselected', function (event) {
            loadPolygon(event.data.result);
        });

        ttSearchBox.on('tomtom.searchbox.resultsfound', function (event) {
            handleEnterSubmit(event, loadPolygon.bind(this));
        });

        ttSearchBox.on('tomtom.searchbox.resultscleared', function () {
            clearLayer(POLYGON_ID);
            clearLayer(OUTLINE_ID);
        });

        const finalResult = {
            status: this.closeStatus,
            data: {
                'district': undefined
            }
        }

        return finalResult;
    }
}

export const District = new district();