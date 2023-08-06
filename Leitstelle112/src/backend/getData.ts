import { readTextFile, BaseDirectory, exists } from '@tauri-apps/api/fs';
import { logFile } from './log';
import { session } from './backend_setup';

export const fetchFrom = new class fetchData {
    file(filePath: string, fileName: string) {
        return new Promise<string>(async (resolve, reject) => {
            const doesFileExist = await exists(`${filePath}/${fileName}`, { dir: BaseDirectory.Document })
                .catch((err) => {
                    reject(err);
                    throw new Error(err);
                });

            if (doesFileExist) {
                await readTextFile(`${filePath}/${fileName}`, { dir: BaseDirectory.Document })
                    .then((r: any) => {
                        logFile.write('INFO', `fetched file: ${filePath}/${fileName} [success]`, session);
                        resolve(r);
                    })
                    .catch((err) => {
                        logFile.write('ERROR', `error: ${err}`, session)
                        reject(err);
                        throw new Error(err);
                    });
            }
            else {
                logFile.write('ERROR', `File ${filePath}/${fileName} missing.`, session);
                reject(`File ${filePath}/${fileName} missing.`);
                throw new Error(`File ${filePath}/${fileName} missing.`);
            }
        });
    }
};