import { writeTextFile, BaseDirectory, readTextFile } from "@tauri-apps/api/fs";
import { session } from "./backend_setup";

export const logFile = new class writeLog {

    setup(instance: string) {
        return new Promise<object>(async (resolve, reject) => {
            const fileName = `${instance.slice(0, 8)}-${new Date().toJSON().replace(/[:.]/g, '-')}.log`;
            const content =
                `${new Date().toUTCString()}: ${fileName} created
               app config: $DOCUMENT/Leitstelle112/config/*
               game data: $DOCUMENT/Leitstelle112/*
               logs: $DOCUMENT/Leitstelle112/logs/*
               version: devbuild-v0.0.3
               build: in-development
               release: none/pre
               © 2023 Warrior Deere, Arcavigi Interactive
            `;

            await writeTextFile(`Leitstelle112/logs/${fileName}`, content, { dir: BaseDirectory.Document })
                .then(() => {
                    sessionStorage.setItem('log_file', fileName);
                    sessionStorage.setItem('isLogFileCreated', 'true');
                    resolve({
                        "file": fileName,
                        "content": content
                    })
                })
                .catch((err: any) => {
                    reject({
                        "initial_error": err
                    })
                    sessionStorage.setItem('isLogFileCreated', 'false');
                    throw new Error(`Error setting up log file: ${err}`);
                });
        })
    }

    private logBuffer: string[] = [];
    private isWriting: boolean = false;
    private cooldownTime: number = 1000;

    write(type: string, content: string, instance_id: string) {
        return new Promise<object>((resolve, reject) => {
            const logMsgContent = `${new Date().toUTCString()}: ${type}: ${content}`;
            this.logBuffer.push(logMsgContent);


            if (!this.isWriting && this.logBuffer.length > 0) {
                this.isWriting = true;


                setTimeout(async () => {
                    const currentFile = sessionStorage.getItem('log_file');
                    if (currentFile !== undefined || currentFile !== null) {
                        const currentFileContent = await readTextFile(`Leitstelle112/logs/${currentFile}`, { dir: BaseDirectory.Document });
                        const newFileContent = [currentFileContent, ...this.logBuffer].join("\n");

                        await writeTextFile(`Leitstelle112/logs/${currentFile}`, newFileContent, { dir: BaseDirectory.Document })
                            .then(() => {
                                sessionStorage.setItem('isLogFileCreated', 'true');
                                this.logBuffer = [];
                                this.isWriting = false;
                                resolve({
                                    "file": instance_id
                                });
                            })
                            .catch((err: any) => {
                                sessionStorage.setItem('isLogFileCreated', 'false');
                                this.isWriting = false;
                                reject({
                                    "initial_error": err
                                });
                            });
                    } else {
                        sessionStorage.setItem('isLogFileCreated', 'false');
                        this.setup(session);
                    }
                }, this.cooldownTime);
            } else {

                resolve({
                    "file": instance_id
                });
            }
        });
    }
};