class DATABASE {
    async operateWithDB(data, command) {
        console.log('establishing connection to db');
        let request = indexedDB.open('missionStorage', 1);
        let resultFromGetMethod;

        if (data === undefined && command === 'POST') {
            this.closeStatus = {
                code: 304,
                text: 'Invalid input in combination with command'
            };
            throw new Error(`${this.closeStatus.code} - ${this.closeStatus.text}`);
        }

        switch (command) {
            case 'POST':
                console.log('db connected with method post');

                request.onerror = ((event) => {
                    this.closeStatus = {
                        code: 301,
                        text: 'Operation failed'
                    };
                    console.error(`${this.closeStatus.code} - ${this.closeStatus.text}`);
                });

                request.onupgradeneeded = ((event) => {
                    let db = event.target.result;

                    let activeMission = db.createObjectStore("activeMission", { keyPath: "mission" });
                });

                request.onsuccess = ((event) => {
                    let db = event.target.result;

                    let transaction = db.transaction("activeMission", "readwrite");
                    let missionsStore = transaction.objectStore("activeMission");

                    let addRequest = missionsStore.add(data);

                    addRequest.onerror = (() => {
                        this.closeStatus = {
                            code: 301,
                            text: 'Operation failed'
                        };
                        console.error(`${this.closeStatus.code} - ${this.closeStatus.text}`);
                    });

                    addRequest.onsuccess = (() => {
                        this.closeStatus = {
                            code: 200,
                            text: 'Operation successfull'
                        };
                        console.log(`${this.closeStatus.code} - ${this.closeStatus.text}`);
                    });

                });


                break;

            case 'GET':
                console.log('db connected with method get');

                request.onerror = (() => {
                    this.closeStatus = {
                        code: 301,
                        text: 'Operation failed'
                    };
                    console.error(`${this.closeStatus.code} - ${this.closeStatus.text}`);
                });

                request.onsuccess = ((event) => {
                    let db = event.target.result;

                    let transaction = db.transaction("activeMission", "readonly");
                    let missionsStore = transaction.objectStore("activeMission");

                    // Abfrage zum Abrufen aller Einträge im Objektstore
                    let getAllRequest = missionsStore.getAll();

                    getAllRequest.onerror = function (event) {
                        console.error("Fehler beim Abrufen der Daten:", event.target.error);
                    };

                    resultFromGetMethod = {
                        status: {
                            code: 200,
                            text: 'Operation successfull'
                        },
                        data: new Array()
                    };

                    getAllRequest.onsuccess = function (event) {
                        console.log("Alle Einträge im Objektstore 'missions':");
                        event.target.result.forEach((mission) => {
                            console.log(mission);
                            resultFromGetMethod.data.push(mission);
                        });
                        console.log(resultFromGetMethod);
                    };
                });

                break;

            default:
                this.closeStatus = {
                    code: 302,
                    text: 'Invalid command'
                };
                console.error(`${this.closeStatus.code} - ${this.closeStatus.text}`);
                break;
        }

        return resultFromGetMethod;
    }
}

export const database = new DATABASE();