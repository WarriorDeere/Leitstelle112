class DATABASE {
    post(target, data) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(target.database, target.version);

            request.onerror = () => {
                reject({
                    code: 301,
                    text: 'Operation failed'
                });
            };

            request.onsuccess = (e) => {
                const db = e.target.result;

                if (db.objectStoreNames.contains(target.object_store)) {
                    const version = db.version;
                    db.close();

                    const upgradeRequest = indexedDB.open(target.database, version);

                    upgradeRequest.onerror = () => {
                        reject({
                            code: 301,
                            text: 'Operation failed'
                        });
                    };

                    upgradeRequest.onupgradeneeded = (e) => {
                        const upgradeDb = e.target.result;
                        upgradeDb.createObjectStore(target.object_store, { keyPath: target.keyPath });
                    };

                    upgradeRequest.onsuccess = (e) => {
                        const upgradeDb = e.target.result;

                        const upgradeTransaction = upgradeDb.transaction([target.object_store], 'readwrite');
                        const objectStore = upgradeTransaction.objectStore(target.object_store);

                        const request = objectStore.add(data);

                        request.onerror = (err) => {
                            console.error(err.target.error);
                            reject({
                                code: 301,
                                text: 'Operation failed',
                                further: err.target.error
                            });
                        };

                        request.onsuccess = () => {
                            resolve({
                                code: 200,
                                text: 'Operation successful'
                            });
                        };

                        upgradeTransaction.oncomplete = () => {
                            upgradeDb.close();
                        };
                    };
                } else {

                    const upgradeDb = e.target.result;
                    upgradeDb.createObjectStore(target.object_store, { keyPath: target.keyPath });

                    const transaction = db.transaction([target.object_store], 'readwrite');
                    const objectStore = transaction.objectStore(target.object_store);

                    const request = objectStore.add(data);

                    request.onerror = (err) => {
                        console.error(err.target.error);
                        reject({
                            code: 301,
                            text: 'Operation failed',
                            further: err.target.error
                        });
                    };

                    request.onsuccess = () => {
                        resolve({
                            code: 200,
                            text: 'Operation successful'
                        });
                    };

                    transaction.oncomplete = () => {
                        db.close();
                    };
                }
            };
        });
    }

    get(target) {
        return new Promise((resolve, reject) => {
            let request = indexedDB.open(target.database, target.version);

            request.onerror = (() => {
                reject({
                    code: 301,
                    text: 'Operation failed'
                });
            });

            request.onupgradeneeded = ((e) => {
                let db = e.target.result;

                let objStore = db.createObjectStore(target.object_store, { keyPath: target.keyPath });
            });

            request.onsuccess = ((e) => {
                let db = e.target.result;

                let transaction = db.transaction(target.object_store, "readonly");
                let objectStore = transaction.objectStore(target.object_store);

                let getAll = objectStore.getAll();

                getAll.onerror = () => {
                    reject({
                        code: 301,
                        text: 'Request failed'
                    });
                };

                let r = {
                    status: {
                        code: 200,
                        text: 'Operation successfull'
                    },
                    data: new Array()
                };

                getAll.onsuccess = (e) => {
                    e.target.result.forEach((mission) => {
                        r.data.push(mission);
                    });
                    resolve(r);
                };
            })
        })
    }

}

export const database = new DATABASE();