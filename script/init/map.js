const data =
    await fetch('http://127.0.0.1:5500/config/config.json')
        .then((response) => {
            return response.json();
        })
        .catch((err) => {
            throw new Error(err);
        })
    ;

export const map = tt.map({
    key: data.APIKey,
    container: "map",
    center: [13.5, 52.5],
    zoom: 10,
    style: `https://api.tomtom.com/style/1/style/*?map=2/basic_street-satellite&poi=2/poi_dynamic-satellite&key=${data.APIKey}`
})

map.addControl(new tt.FullscreenControl())
    .addControl(new tt.NavigationControl())
    .addControl(new tt.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }))