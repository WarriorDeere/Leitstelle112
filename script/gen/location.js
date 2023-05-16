class location {
    async withinBorder(countryCode, apiKey) {
        tt.services.bboxSearch({
            key: apiKey,
            countryCode: countryCode,
            limit: 1,
        }).go()
            .then((response) => {
                const results = response.results;
                if (results && results.length > 0) {
                    const bounds = results[0].bounds;
                    const northEast = bounds.topRightPoint;
                    const southWest = bounds.bottomLeftPoint;

                    const randomLat = Math.random() * (northEast.lat - southWest.lat) + southWest.lat;
                    const randomLng = Math.random() * (northEast.lng - southWest.lng) + southWest.lng;

                    const marker = new tt.Marker().setLngLat([randomLng, randomLat]).addTo(map);
                }
            })
            .catch((error) => {
                console.error('Fehler beim Abrufen der Gebietsgrenzen:', error);
            });

    }
}

export const genLocation = new location();