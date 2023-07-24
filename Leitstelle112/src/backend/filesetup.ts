import { createDir, writeTextFile, BaseDirectory } from '@tauri-apps/api/fs';

export const setup_files = new class files {
    async config(fileData: string, fileName: string) {
        await createDir('Arcavigi Interactive', { dir: BaseDirectory.Document, recursive: true });
        await createDir('Arcavigi Interactive/Leitstelle112', { dir: BaseDirectory.Document, recursive: true });
        await createDir('Arcavigi Interactive/Leitstelle112/config', { dir: BaseDirectory.Document, recursive: true });

        await writeTextFile(`Arcavigi Interactive/Leitstelle112/config/${fileName}`, fileData, { dir: BaseDirectory.Document });
    }

    async main() {
        await createDir('Leitstelle112', { dir: BaseDirectory.Document, recursive: true });
        await createDir('Leitstelle112/userdata', { dir: BaseDirectory.Document, recursive: true });
        await createDir('Leitstelle112/custom', { dir: BaseDirectory.Document, recursive: true });
        await createDir('Leitstelle112/default', { dir: BaseDirectory.Document, recursive: true });
        await createDir('Leitstelle112/default/calls', { dir: BaseDirectory.Document, recursive: true });

        await writeTextFile('Leitstelle112/userdata/profile.json', '', { dir: BaseDirectory.Document });
    }
    
    async defaultData(fileData: string, fileName: string){
        await writeTextFile(`Leitstelle112/default/${fileName}`, fileData, { dir: BaseDirectory.Document });
    }
};