import { writeTextFile, BaseDirectory, readDir, readTextFile } from "@tauri-apps/api/fs";

export const logFile = new class writeLog {
    setup(instance: string) {
        return new Promise<object>(async (resolve, reject) => {
            const fileName = `${instance.slice(0, 8)}-${new Date().toJSON().replace(/[:.]/g, '-')}.log`;
            const content =
            `${new Date().toUTCString()}: ${fileName} created
               config files: $DOCUMENT/Arcavigi Interactive/Leitstelle112/config/*
               game files: $DOCUMENT/Leitstelle112/*
               log files: $DOCUMENT/Leitstelle112/logs/*
               version: devbuild-v0.0.3
               build:
               release:
               © 2023 Warrior Deere, Arcavigi Interactive
            `;

            await writeTextFile(`Leitstelle112/logs/${fileName}`, content, { dir: BaseDirectory.Document })
                .then(() => {
                    resolve({
                        "file": fileName,
                        "content": content
                    })
                })
                .catch((err: any) => {
                    reject({
                        "initial_error": err
                    })
                });
        })
    }

    write(type: string, content: string, instance_id: string) {
        return new Promise<object>(async (resolve, reject) => {
            const logs = await readDir('Leitstelle112/logs/', { dir: BaseDirectory.Document })
            for (let i = 0; i < logs.length; i++) {
                if (logs[i].name?.slice(0, 8) === instance_id.slice(0, 8)) {
                    if (logs[i].name?.endsWith('.log')) {
                        const currentFileContent = await readTextFile(`Leitstelle112/logs/${logs[i].name}`, { dir: BaseDirectory.Document });
                        await writeTextFile(`Leitstelle112/logs/${logs[i].name}`,
                            `${currentFileContent}\n${new Date().toUTCString()}: ${type}: ${content}`, { dir: BaseDirectory.Document })
                            .then(() => {
                                resolve({
                                    "file": instance_id
                                })
                            })
                            .catch((err: any) => {
                                reject({
                                    "initial_error": err
                                })
                            });
                    }
                }
            }
        })
    }
};