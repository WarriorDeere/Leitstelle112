class EMERGENCY {

    constructor() {
        this.missionURL = 'http://127.0.0.1:5500/blueprints/missions.json';
        this.dummyURL = 'http://127.0.0.1:5500/blueprints/dummy.json';
    }

    async genMission() {
        let final = {
            type: undefined,
            text: undefined
        };
        let finalDummy;

        await fetch(this.missionURL).then(async (response) => {
            const data = await response.json();
            const typeArray = Math.floor(Math.random() * data.missions.length);
            final.type = data.missions[typeArray].type.cago + ' - ' + data.missions[typeArray].type.desc;

            await genText(data.missions[typeArray].type.file, data.missions[typeArray].caller_hint).then((r) => {
                final.text = r;
                return final.text;
            });

            return final;
        }).catch((err) => {
            console.error(err);
            throw new Error(err);
        });

        await fetch(this.dummyURL).then(async (response) => {
            const data = await response.json();
            finalDummy = `${data.first_names[Math.floor(Math.random() * data.first_names.length)]} ${data.last_names[Math.floor(Math.random() * data.last_names.length)]}`;
            return finalDummy;
        }).catch((err) => {
            throw new Error(err);
        });


        async function genText(detailData, callerHint) {
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

            const fetchURL = `http://127.0.0.1:5500/blueprints/text/${detailData}.json`;

            await fetch(fetchURL).then(async (response) => {
                const data = await response.json();
                textDetail = data[callerHint][Math.floor(Math.random() * data[callerHint].length)];
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
    if (data === 'mission') {
        await emergency.genMission().then((r) => {
            postMessage(r);
        })
    }
}