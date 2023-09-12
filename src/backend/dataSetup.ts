import { createDir, writeTextFile, BaseDirectory, exists } from '@tauri-apps/api/fs';
import { logFile } from './log';
import { session } from './backend_setup';

export const cstData = new class files {

    writePath(paths: string[]) {
        return new Promise<void>(async (resolve, reject) => {
            for (let i = 0; i < paths.length; i++) {
                const filePathAlreadyExists = await exists(paths[i], { dir: BaseDirectory.Document });
                if (filePathAlreadyExists) {
                    resolve()
                    return;
                }
                else {
                    createDir(paths[i], { dir: BaseDirectory.Document, recursive: true })
                        .then(() => {
                            logFile.write('INFO', `${paths[i]} created`, session);
                            console.log(`path ${paths[i]} created`);
                            resolve();
                        })
                        .catch((err) => {
                            reject(err);
                            throw new Error(err)
                        })
                }
            }
        })
    }

    async writeFile(files: { file_name: string; file_path: string; file_content: string; }[]): Promise<void> {

        for (let i = 0; i < files.length; i++) {
            if (files[i].file_path.endsWith('/')) {
                const filePathValid = await exists(files[i].file_path, { dir: BaseDirectory.Document });
                if (filePathValid) {
                    const doesFileExist = await exists(files[i].file_path + files[i].file_name, { dir: BaseDirectory.Document });
                    if (doesFileExist) {
                        logFile.write('INFO', `file ${files[i].file_name} loaded`, session);
                        console.log(`file ${files[i].file_name} loaded`);
                        continue;
                    }
                    else {
                        await writeTextFile(`${files[i].file_path}/${files[i].file_name}`, files[i].file_content, { dir: BaseDirectory.Document })
                            .then(() => {
                                logFile.write('INFO', `file ${files[i].file_name} created`, session);
                                console.log(`file ${files[i].file_name} created`);
                            })
                            .catch((err) => {
                                throw new Error(err)
                            })
                    }
                }
                else {
                    try {
                        await this.writePath([files[i].file_path])
                        await this.writeFile([{
                            "file_name": files[i].file_name,
                            "file_path": files[i].file_path,
                            "file_content": files[i].file_content
                        }])
                    }
                    catch (err: any) {
                        throw new Error(err)
                    }
                }
            }
            else {
                logFile.write('ERROR', `file_path must end with "/"! (given input: ${files[i].file_path})`, session);
                throw new Error(`file_path must end with "/"! (given input: ${files[i].file_path})`)
            }
        }
    }

    async writeData(files: { file_name: string; file_path: string; file_content: string; }[]): Promise<void> {
        for (let i = 0; i < files.length; i++) {
            if (files[i].file_path.endsWith('/')) {
                const filePathValid = await exists(files[i].file_path, { dir: BaseDirectory.Document });
                if (filePathValid) {
                    const doesFileExist = await exists(files[i].file_path + files[i].file_name, { dir: BaseDirectory.Document });
                    if (doesFileExist) {
                        await writeTextFile(`${files[i].file_path}/${files[i].file_name}`, files[i].file_content, { dir: BaseDirectory.Document })
                            .then(() => {
                                logFile.write('INFO', `data written to file at ${files[i].file_path}${files[i].file_name} [success]`, session);
                                console.log(`data written to file at ${files[i].file_path}${files[i].file_name} [success]`);
                            })
                            .catch((err) => {
                                logFile.write('ERROR', err, session);
                                throw new Error(err)
                            })
                        continue;
                    }
                    else {
                        logFile.write('WARNING', `file at ${files[i].file_path}${files[i].file_name} does not exist! [fail]`, session);
                        console.warn(`file at ${files[i].file_path}${files[i].file_name} does not exist! [fail]`);
                        await this.writeFile([{
                            "file_name": files[i].file_name,
                            "file_path": files[i].file_path,
                            "file_content": files[i].file_content
                        }])
                            .then(() => {
                                logFile.write('INFO', `created missing file. Data written to file at ${files[i].file_path}${files[i].file_name} [success]`, session);
                                console.log(`created missing file. Data written to file at ${files[i].file_path}${files[i].file_name} [success]`);
                            })
                            .catch((err) => {
                                logFile.write('ERROR', err, session);
                                throw new Error(err)
                            })
                    }
                }
                else {
                    try {
                        await this.writePath([files[i].file_path])
                        await this.writeFile([{
                            "file_name": files[i].file_name,
                            "file_path": files[i].file_path,
                            "file_content": files[i].file_content
                        }])
                    }
                    catch (err: any) {
                        throw new Error(err)
                    }
                }
            }
            else {
                logFile.write('ERROR', `file_path must end with "/"! (given input: ${files[i].file_path})`, session);
                throw new Error(`file_path must end with "/"! (given input: ${files[i].file_path})`)
            }
        }
    }
};