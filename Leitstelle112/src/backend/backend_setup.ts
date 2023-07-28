import { logFile } from "./log";

const session_id = crypto.randomUUID();

if (!sessionStorage.getItem('session')) {
    sessionStorage.setItem('session', session_id);
    logFile.setup(session_id)
        .catch((err) => {
            throw new Error(err);
        });
    logFile.write('INFO', `current session: ${session_id}`, session_id)
        .catch((err) => {
            throw new Error(err);
        });
}

export const session = sessionStorage.getItem('session')!;