import { databaseAPI } from "./db";

export function debugScript() {

    databaseAPI.delete({
        database: {
            name: "items"
        },
        table: {
            name: "buildings",
            condition: "building_id='35f9bedc-d005-4155-a3f3-025beb6506c0'"
        }
    })
        .then((r) => {
            console.log(r);
        })
        .catch((err) => {
            throw new Error(err);
        })

}