import { createRoot } from "react-dom/client";
import { BuildingSceneUi, DefaultItems, DeveloperMenu } from "../src/App.tsx";
import { TT_API_KEY } from "./setup.ts";

const root = createRoot(document.querySelector('#react-ui') as HTMLElement);

if (TT_API_KEY.length == 0) {
    root.render(
        <>
            <DefaultItems data={{ show_user_modal: true, modal_data: { modal_order: ["type_api_key"] } }} />
        </>
    );
}
else {
    root.render(
        <>
            <DefaultItems data={{ show_user_modal: false }} />
            <DeveloperMenu />
        </>
    );
}

export function addBuildingMenuInterface() {
    root.render(
        <>
            <BuildingSceneUi />
        </>
    )
}