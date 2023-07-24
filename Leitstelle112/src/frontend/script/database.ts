class DATABASE {
    post({ }, { }) {
        return new Promise((reject) => {
            reject('depreceated');
        });
    }

    get({ }) {
        return new Promise((reject) => {
            reject('depreceated');
        });
    }

}

export const database = new DATABASE();