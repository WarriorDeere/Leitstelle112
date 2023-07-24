import { readTextFile, BaseDirectory } from '@tauri-apps/api/fs';
export const fetchFrom = new class fetchData {
    file(filePath: string, fileName: string) {
        return new Promise(async (resolve, reject) => {
            const fileContent = await readTextFile(`${filePath}/${fileName}.json`, { dir: BaseDirectory.Document })
                .catch((err) => {
                    reject(err);
                });
            resolve(fileContent);
        });
    }
};