import { data } from "../main.js";

async function loadMap() {

    const map = tt.map({
        key: data.APIKey,
        container: "map",
        center: [13.5, 52.5],
        zoom: 10,
        style: `https://api.tomtom.com/style/1/style/*?map=2/basic_street-satellite&poi=2/poi_dynamic-satellite&key=${data.APIKey}`
    })

    map.addControl(new tt.FullscreenControl())
        .addControl(new tt.NavigationControl())
        .addControl(new tt.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }))
}

loadMap();