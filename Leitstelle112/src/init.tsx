import { createRoot } from "react-dom/client";
import { DialogBody, DialogHead, Navigation, Skillbar } from "../src/app.tsx";

const root = createRoot(document.querySelector('#interface-layer') as HTMLElement);
root.render(
    <>
        <Navigation />
        <Skillbar />
    </>
);

export function emergencyDialog() {
    const dialogTemplate = document.querySelector('#dialog-template') as HTMLDialogElement;
    dialogTemplate.classList.add('dialog');
    const dialogRoot = createRoot(document.querySelector('#dialog-template') as HTMLDialogElement);
    const dialogId = crypto.randomUUID();

    dialogRoot.render(
        <>
            <DialogHead dialog={{ id: `${dialogId}`, title: 'Einsätze', dialogDOM: dialogTemplate }} />
            <DialogBody dialog={{ id: `${dialogId}`, type: 'mission' }} />
        </>
    );

    dialogTemplate.showModal();
}