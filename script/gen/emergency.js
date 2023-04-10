class EMERGENCY {

    constructor() {
        this.typeURL = 'http://127.0.0.1:5500/blueprints/types.json';
        this.dummyURL = 'http://127.0.0.1:5500/blueprints/dummy.json';
    }

    async genFire() {
        let final = {
            type: undefined,
            text: undefined
        };
        let finalDummy;

        await fetch(this.typeURL).then(async (response) => {
            const data = await response.json();
            const typeArray = Math.floor(Math.random() * data.length);
            final.type = data[typeArray].cago + ' - ' + data[typeArray].desc;

            await genText(data[typeArray].file).then((r) => {
                final.text = r;
                return final.text;
            });

            return final;
        }).catch((err) => {
            throw new Error(err);
        });

        await fetch(this.dummyURL).then(async (response) => {
            const data = await response.json();
            finalDummy = `${data.first_names[Math.floor(Math.random() * data.first_names.length)]} ${data.last_names[Math.floor(Math.random() * data.last_names.length)]}`;
            return finalDummy;
        }).catch((err) => {
            throw new Error(err);
        });


        async function genText(detailData) {
            const introURL = 'http://127.0.0.1:5500/blueprints/text/intro.json';
            const outroURL = 'http://127.0.0.1:5500/blueprints/text/outro.json';

            let intro;

            await fetch(introURL).then(async (response) => {
                const data = await response.json();
                intro = data[Math.floor(Math.random() * data.length)];
                return intro;
            }).catch((err) => {
                throw new Error(err);
            });

            let outro;

            await fetch(outroURL).then(async (response) => {
                const data = await response.json();
                outro = data[Math.floor(Math.random() * data.length)];
                return outro;
            }).catch((err) => {
                throw new Error(err);
            });

            let textDetail;

            await fetch(`http://127.0.0.1:5500/blueprints/text/${detailData}.json`).then(async (response) => {
                const data = await response.json();
                console.debug(`http://127.0.0.1:5500/blueprints/text/${detailData}.json`);
                textDetail = data[Math.floor(Math.random() * data.length)];
                return textDetail;
            }).catch((err) => {
                throw new Error(err);
            })

            let finalText;

            finalText = `${intro} ${textDetail} ${outro}`;
            return finalText;
        }

        const finalEmergency = {
            emergencyHeader: final.type,
            emergencyText: final.text,
            emergencyDummy: finalDummy
        };

        return finalEmergency;
    }
}

const emergency = new EMERGENCY();

onmessage = async (input) => {
    const data = input.data
    if (data === 'fire') {
        await emergency.genFire().then((r) => {
            postMessage(r);
        })
    }
}