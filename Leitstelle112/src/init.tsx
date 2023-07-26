import { createRoot } from "react-dom/client";
import { DialogBody, DialogHead, Navigation, Skillbar } from "../src/app.tsx";
import { logFile } from "./backend/log.ts";
import { session } from "./backend/backend_setup.ts";

try {
    const root = createRoot(document.querySelector('#interface-layer') as HTMLElement);
    root.render(
        <>
            <Navigation />
            <Skillbar />
        </>
    );

    const dialogTemplate = document.querySelector('#dialog-template') as HTMLDialogElement;
    dialogTemplate.classList.add('dialog');
    const dialogRoot = createRoot(document.querySelector('#dialog-template') as HTMLDialogElement);
    const dialogId = crypto.randomUUID();

    dialogRoot.render(
        <>
            <DialogHead dialog={{ id: `${dialogId}`, title: 'Debug', dialogDOM: dialogTemplate }}></DialogHead>
            <DialogBody dialog={{ id: `${dialogId}` }}></DialogBody>
        </>
    )

    dialogTemplate.showModal();
} catch (err) {
    logFile.write('ERROR', `Catch: ${err}`, session);
    throw new Error(`Catch: ${err}`);
}