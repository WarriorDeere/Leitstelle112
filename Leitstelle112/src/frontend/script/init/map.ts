import tt from "@tomtom-international/web-sdk-maps";
import { TT_API_KEY } from "../../env.ts";

export const map = tt.map({
    key: TT_API_KEY,
    container: "map",
    center: [13.5, 52.5],
    zoom: 10,
    style: `https://api.tomtom.com/style/1/style/*?map=2/basic_street-satellite&poi=2/poi_dynamic-satellite&key=${TT_API_KEY}`
})

map.addControl(new tt.FullscreenControl())
    .addControl(new tt.NavigationControl())
    .addControl(new tt.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }))