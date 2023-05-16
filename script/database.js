class DATABASE {
    async operateWithDB(data, command) {
        return new Promise((resolve, reject) => {
            let request = indexedDB.open('missionStorage', 1);
            let resultFromGetMethod;

            if (data === undefined && command === 'POST') {
                this.closeStatus = {
                    code: 304,
                    text: 'Invalid input in combination with command'
                };
                reject(this.closeStatus);
                throw new Error(`${this.closeStatus.code} - ${this.closeStatus.text}`);
            }

            request.onerror = (() => {
                this.closeStatus = {
                    code: 301,
                    text: 'Operation failed'
                };
                resultFromGetMethod = {
                    status: this.closeStatus,
                    data: undefined
                };
                reject(this.closeStatus);
            });

            request.onupgradeneeded = ((event) => {
                let db = event.target.result;

                let activeMission = db.createObjectStore("activeMission", { keyPath: "mission" });
            });

            request.onsuccess = ((event) => {

                if (command === 'GET') {
                    let db = event.target.result;

                    let transaction = db.transaction("activeMission", "readonly");
                    let missionsStore = transaction.objectStore("activeMission");

                    // Abfrage zum Abrufen aller Einträge im Objektstore
                    let getAllRequest = missionsStore.getAll();

                    getAllRequest.onerror = () => {
                        this.closeStatus = {
                            code: 301,
                            text: 'Request failed'
                        };
                        reject(this.closeStatus);
                    };

                    resultFromGetMethod = {
                        status: {
                            code: 200,
                            text: 'Operation successfull'
                        },
                        data: new Array()
                    };

                    getAllRequest.onsuccess = (event) => {
                        event.target.result.forEach((mission) => {
                            resultFromGetMethod.data.push(mission);
                        });

                        resolve(resultFromGetMethod);
                    };
                }

                if (command === 'POST') {

                    let db = event.target.result;

                    let transaction = db.transaction("activeMission", "readwrite");
                    let missionsStore = transaction.objectStore("activeMission");

                    let addRequest = missionsStore.add(data);

                    addRequest.onerror = (() => {
                        this.closeStatus = {
                            code: 301,
                            text: 'Operation failed'
                        };
                        reject(this.closeStatus);
                    });

                    addRequest.onsuccess = (() => {
                        this.closeStatus = {
                            code: 200,
                            text: 'Operation successfull'
                        };
                        resolve(this.closeStatus);
                    });

                }

            });
        });

    }

}

export const database = new DATABASE();