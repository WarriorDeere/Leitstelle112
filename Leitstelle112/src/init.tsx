import { createRoot } from "react-dom/client";
import { DefaultItems, DialogBody, DialogHead } from "../src/app.tsx";
import { TT_API_KEY } from "./setup.ts";

const root = createRoot(document.querySelector('#react-ui') as HTMLElement);

if (TT_API_KEY.length == 0) {
    root.render(
        <>
            <DefaultItems data={{ validation_dialog: true, dialog_data: { class: "validation-dialog" } }} />
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

export function emergencyDialog() {
    const dialogRoot = createRoot(document.querySelector('#dialog-template') as HTMLDialogElement);
    const dialogTemplate = document.querySelector('#dialog-template') as HTMLDialogElement;
    dialogTemplate.classList.add('dialog');
    const dialogId = crypto.randomUUID();

    dialogRoot.render(
        <>
            <DialogHead dialog={{ id: `${dialogId}`, title: 'Einsätze', dialogDOM: dialogTemplate }} />
            <DialogBody dialog={{ id: `${dialogId}`, type: 'mission' }} />
        </>
    );

    dialogTemplate.showModal();
}