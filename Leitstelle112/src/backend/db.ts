import Database from "tauri-plugin-sql-api";
import { logFile } from "./log";
import { session } from "./backend_setup";

type insertObject = {
    database: {
        name: string
    },
    table: {
        name: string
        columns: string
        values: string
    }
}

type selectObject = {
    database: {
        name: string;
    };
    table: AllTable | SpecialTable;
};

type AllTable = {
    name: string;
    options: 'all';
};

type SpecialTable = {
    name: string;
    options: 'column';
    columns: string;
};

type deleteObject = {
    database: {
        name: string
    },
    table: {
        name: string
        condition: string
    }
}

type updateObject = {
    database: {
        name: string
    },
    table: {
        name: string
        set: string
        condition: string
    }
}

export const databaseAPI = new class interactWithDB {

    async insert(data: insertObject) {
        const db = await Database.load(`sqlite:${data.database.name}.db`);

        await db.execute(`
            CREATE TABLE IF NOT EXISTS ${data.table.name} (
                ${data.table.columns}
            )
        `)
            .then(async () => {
                if (data.table.columns) {
                    await db.execute(`
                    INSERT INTO ${data.table.name} (${data.table.columns})
                    VALUES (${data.table.values})
                `)
                }
                else {
                    await db.execute(`
                    INSERT INTO ${data.table.name}
                    VALUES (${data.table.values})
                `)
                }
            })
            .catch(async (err) => {
                logFile.write('ERROR', `Database failed: ${err}`, session);
                throw new Error(err);
            })
    }

    async select(data: selectObject) {
        const db = await Database.load(`sqlite:${data.database.name}.db`);
        return new Promise<any>(async (resolve) => {
            switch (data.table.options) {
                case 'all':
                    resolve(await db.select(`
                        SELECT * FROM ${data.table.name}
                    `));
                    break;
                case 'column':
                    resolve(await db.select(`
                        SELECT ${data.table.columns} FROM ${data.table.name}
                    `));
                    break;
            }
        });
    }

    async delete(data: deleteObject) {
        const db = await Database.load(`sqlite:${data.database.name}.db`);

        await db.execute(`
        DELETE FROM ${data.table.name} WHERE ${data.table.condition}
        `)
            .catch(async (err) => {
                logFile.write('ERROR', `Database failed: ${err}`, session);
                throw new Error(err);
            })
    }

    async update(data: updateObject) {
        const db = await Database.load(`sqlite:${data.database.name}.db`);

        await db.execute(`
            UPDATE ${data.table.name} 
            SET ${data.table.set}
            WHERE ${data.table.condition}
        `).catch((err) => { throw new Error(err) });
    }
};

// databaseAPI.update({
//     database: {
//         name: "mission"
//     },
//     table: {
//         name: "active_missions",
//         set: "mission_uuid = 'Missions Uuid'",
//         condition: "mission_uuid = 'uuid'"
//     }
// }).catch((err) => { throw new Error(err) })

// await databaseAPI.delete({
//     database: {
//         name: "mission"
//     },
//     table: {
//         name: "active_missions",
//         condition: "test"
//     }
// })

await databaseAPI.select({
    database: {
        name: "mission"
    },
    table: {
        name: "active_missions",
        options: "all"
    }
})