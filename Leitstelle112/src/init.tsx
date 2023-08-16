import { createRoot } from "react-dom/client";
import { BuildingSceneUi, DefaultItems } from "../src/app.tsx";
import { TT_API_KEY } from "./setup.ts";

const root = createRoot(document.querySelector('#react-ui') as HTMLElement);

if (TT_API_KEY.length == 0) {
    root.render(
        <>
            <DefaultItems data={{ validation_dialog: true, dialog_data: { className: "validation-dialog" } }} />
        </>
    );
}
else {
    root.render(
        <>
            <DefaultItems data={{ validation_dialog: false }} />
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