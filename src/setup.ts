import { session } from "./backend/backend_setup";
import { cstData } from "./backend/dataSetup";
import { databaseAPI } from "./backend/db";
import { fetchFrom } from "./backend/getData";
import { logFile } from "./backend/log";
import * as tts from '@tomtom-international/web-sdk-services';
import * as ttm from '@tomtom-international/web-sdk-maps';
import { map } from "./frontend/script/init/map";

type buildingMenuFormData = {
    building_name: string,
    building_type: string,
    building_geo: {
        building_position: tts.LngLatLike
    },
    building_id: string
}

export const TT_API_KEY = await fetchFrom.file('Leitstelle112/userdata', 'api.key')
    .then((r) => {
        return r;
    });

cstData.writePath([
    "Leitstelle112",
    "Leitstelle112/logs",
    "Leitstelle112/userdata",
    "Leitstelle112/custom",
    "Leitstelle112/default",
    "Leitstelle112/default/calls"
])

cstData.writeFile([
    {
        "file_name": "config.json",
        "file_path": "Leitstelle112/userdata/",
        "file_content": `{"isFirstStartAfterInstall": true,"isFirstStartAfterUpdate": true,"update": {"current_version": "undefined","version_before": "undefined","version_after": "undefined"}}`
    },
    {
        "file_name": "api.key",
        "file_path": "Leitstelle112/userdata/",
        "file_content": ""
    },
    {
        "file_name": "app.json",
        "file_path": "Leitstelle112/userdata/",
        "file_content": `{"version": "dev-0.0.3","release": "none"}`
    },
    {
        "file_name": "profile.json",
        "file_path": "Leitstelle112/userdata/profile/",
        "file_content": `{"tt_api": {"path": "Leitstelle112/userdata/","file": "api.key"}}`
    },
    {
        "file_name": "names.json",
        "file_path": "Leitstelle112/default/",
        "file_content": `{"first_names":["Lena","Niklas","Emilia","Felix","Hannah","David","Sophia","Maximilian","Johanna","Timo","Laura","Sebastian","Marie","Tobias","Tobi","Torben","Lisa","Benjamin","Anna","Simon","Lina","Lukas","Julia","Jan","Lea","Philipp","Katharina","Christian","Clara","Cindy","Jonas","Nora","Alexander","Mia","Luca","Elias","Sarah","Tim","Vanessa","Julian","Caroline","Daniel","Franziska","Paulina","Paula","Paul","Emma","Olivia","Ava","Sophia","Isabella","Mia","Charlotte","Amelia","Harper","Evelyn","Yuna","Sakura","Mei","Airi","Sora","Santiago","Mateo","Sebastian","Benjamin","Noah","Lucas","Ethan","Alexander","William","Michael","James","Daniel","David","Joseph","Christopher","Anthony","Matthew","Andrew","Joshua","Jacob","Ryan","Brandon","Tyler","Hannah","Emily","Chloe","Aria","Abigail","Elizabeth","Grace","Ella","Victoria","Natalie","Isabella","Sophia"],"last_names":["Müller","Schmidt","Schneider","Fischer","Weber","Meyer","Wagner","Becker","Schulz","Hoffmann","Schäfer","Koch","Bauer","Richter","Klein","Wolf","Neumann","Schwarz","Zimmermann","Braun","Lange","Krause","Werner","Schmidt","Schneider","Schultz","Schmitt","Klein","Meier","Fischer","Wagner","Schuster","Vogel","Stein","Jung","Roth","Böhmer","Köhler","Maier","Lehmann","Schmid","Berger","Novak","Kovacs","Szabo","Horvath","Balogh","Varga","Takacs","Papp","Farkas","Toth","Nagy","Kovalev","Ivanov","Kuznetsov","Sokolov","Popov","Orlov","Kozlov","Mikhailov","Smith","Johnson","Garcia","Gonzalez","Kim","Lee","Park","Wang","Chen","Wu","Yamamoto","Tanaka","Suzuki","Takahashi","Ito","Hernandez","Lopez","Perez","Rodriguez","Gomez","Martinez","Sanchez","Ramirez","Jackson","Williams","Jones","Brown","Davis","Wilson","Taylor","Anderson","Johnson","Clark","Thomas","Moore","Allen","Baker","Carter","Mitchell","Nguyen","Robinson","Scott","Turner","Walker","Young","Zhang","Li","Liu"]}`
    },
    {
        "file_name": "missions.json",
        "file_path": "Leitstelle112/default/",
        "file_content": `{"missions":[{"type":{"cago":"FEU","desc":"eingelaufene BMA","file":"alarm"},"prerequisites":{"fleet":{"lf":3,"dlk":1,"elw1":1,"pol":1},"staff":{}},"caller_hint":"fire_detection"},{"type":{"cago":"FEU","desc":"ausgelöster Heimrauchmelder","file":"alarm"},"prerequisites":{"fleet":{"lf":3,"dlk":1,"elw1":1,"pol":1},"staff":{}},"caller_hint":"smoke_detector"},{"type":{"cago":"B2 - MiG","desc":"Feuer, MiG","file":"fire"},"prerequisites":{"fleet":{"lf":3,"dlk":1,"elw1":1,"pol":2},"staff":{"fd":12,"pd":4,"md":2}},"caller_hint":"fire4"},{"type":{"cago":"B1","desc":"Rauchentwicklung","file":"fire"},"prerequisites":{"fleet":{"lf":3,"dlk":1,"elw1":1,"pol":2},"staff":{"fd":12,"pd":4,"md":2}},"caller_hint":"smoke"},{"type":{"cago":"B1","desc":"Flächenbrand","file":"fire"},"prerequisites":{"fleet":{"lf":3,"dlk":1,"elw1":1,"pol":2},"staff":{"fd":12,"pd":4,"md":2}},"caller_hint":"area1"},{"type":{"cago":"B2","desc":"Flächenbrand","file":"fire"},"prerequisites":{"fleet":{"lf":3,"dlk":1,"elw1":1,"pol":2},"staff":{"fd":12,"pd":4,"md":2}},"caller_hint":"area2"},{"type":{"cago":"B3","desc":"Flächenbrand","file":"fire"},"prerequisites":{"fleet":{"lf":4,"dlk":1,"elw1":1,"gw_l2":1,"pol":2},"staff":{"fd":15,"pd":4,"md":2}},"caller_hint":"area3"},{"type":{"cago":"TH","desc":"Technische Hilfeleistung","file":"assist"},"prerequisites":{"fleet":{"lf":1,"rw":1,"gw_t":1,"gw_l2":1,"pol":1},"staff":{"fd":6,"pd":2,"md":1}},"caller_hint":"assist"},{"type":{"cago":"TH","desc":"Personenrettung","file":"assist"},"prerequisites":{"fleet":{"lf":1,"rw":1,"elw1":1,"gw_h":1,"pol":1},"staff":{"fd":6,"pd":2,"md":1}},"caller_hint":"human"},{"type":{"cago":"TH","desc":"Verkehrsunfall","file":"assist"},"prerequisites":{"fleet":{"lf":1,"rw":1,"elw1":1,"pol":1},"staff":{"fd":6,"pd":2,"md":1}},"caller_hint":"accident"},{"type":{"cago":"TH","desc":"Ölspur","file":"fluids"},"prerequisites":{"fleet":{"lf":2,"gw_oel":1,"gw_l":1,"pol":3},"staff":{"fd":30,"pd":6}},"caller_hint":"oil_big"},{"type":{"cago":"TH","desc":"Baum auf Fahrzeug","file":"assist"},"prerequisites":{"fleet":{"lf":1,"rw":1,"dlk":1,"pol":1},"staff":{"fd":13,"pd":2}},"caller_hint":"tree_vehicle"}]}`
    },
    {
        "file_name": "fire.json",
        "file_path": "Leitstelle112/default/calls/",
        "file_content": '{"fire":["Hier brennt es! Bitte kommen Sie schnell!","Da ist so ein roter Flammenschein, ich glaube es brennt!","Ich höre den Feueralarm und es riecht auch nach Rauch. Hier muss es brennen!","Die scheiße hier brennt Lichterloh, das kann ich unter keinen Umständen selbst löschen.","Ich brauche hier sofort die Feuerwehr, es brennt!"],"fire1":["Es brennt in einem Mülleimer!","Hier ist eine Meldung über einen Kleinbrand in unserem Gebäude.","Ich sehe Flammen in einem Raum und der Rauch wird dichter.","Ich habe einen Feuerlöscher benutzt, aber das Feuer ist außer Kontrolle geraten.","Bitte kommen Sie schnell, es gibt einen kleinen Brand in unserem Gebäude!"],"fire2":["Es brennt in einem Raum und der Rauch wird immer dichter!","Hier ist eine Meldung über einen Mittelbrand in unserem Gebäude.","Ich sehe Flammen aus einem Fenster und der Rauch wird immer stärker.","Das Feuer hat sich ausgebreitet und wir können es nicht mehr selbst löschen.","Bitte kommen Sie schnell, es gibt einen Mittelbrand in unserem Gebäude!"],"fire3":["Es brennt in einem großen Gebäudekomplex und das Feuer breitet sich schnell aus!","Hier ist eine Meldung über einen Großbrand in unserem Gebäude.","Ich sehe Flammen aus vielen Fenstern und der Rauch ist überall.","Das Feuer hat sich auf mehrere Stockwerke ausgebreitet und wir können nicht entkommen.","Bitte kommen Sie schnell, es gibt einen Großbrand in unserem Gebäude!"],"fire4":["Es brennt in unserem Gebäude und es sind Menschen eingeschlossen!","Hier ist eine Meldung über einen Brand mit Menschenleben in Gefahr.","Ich sehe Flammen aus einem Fenster und höre Menschen schreien.","Wir haben versucht zu fliehen, aber wir können den Rauch nicht mehr atmen.","Bitte kommen Sie schnell, es gibt einen Brand mit Menschenleben in Gefahr in unserem Gebäude!"],"area1":["Hallo, ich möchte einen kleinen Flächenbrand melden.","Es gibt hier einen kleinen Flächenbrand.","Ich habe einen kleinen Flächenbrand gesehen und wollte es melden.","Ich bin mir nicht sicher, aber ich denke, es gibt hier einen kleinen Flächenbrand.","Es brennt hier gerade auf einer kleinen Fläche.","Ich beobachte einen kleinen Flächenbrand, der gerade entstanden ist.","Ich sehe einen kleinen Flächenbrand, der schnell größer werden könnte.","Ich sehe einen kleinen Flächenbrand, der sich schnell ausbreiten könnte.","Es gibt hier einen kleinen Flächenbrand und ich glaube, er wird größer.","Ich habe gerade einen kleinen Flächenbrand entdeckt und dachte, ich rufe die Feuerwehr an.","Ich sehe Rauch in der Nähe eines Feldes.","Es brennt auf einer Wiese in der Nähe meines Hauses.","Ich habe gerade bemerkt, dass ein kleiner Flächenbrand auf einem Feld in der Nähe ausgebrochen ist.","Es gibt einen Brand auf einem Feld neben der Straße, den ich gerade entlangfahre.","Ich habe eine Rauchentwicklung auf einer Wiese in der Nähe eines Parks bemerkt.","Es brennt auf einem Feld in der Nähe meines Arbeitsplatzes.","Ich sehe Flammen in der Nähe einer Farm.","Es gibt einen kleinen Flächenbrand in der Nähe eines Parks.","Ich kann Rauch aufsteigen sehen von einem brennenden Feld in der Nähe meiner Wohnung.","Ich habe einen Brand auf einer Wiese neben dem Highway gesehen."],"area2":["Ich sehe Rauch und Flammen auf einem Feld in der Nähe.","Es gibt einen Brand auf einer Wiese hier in der Nähe.","Es brennt auf einem Acker neben der Straße.","Ich kann einen Feuerschein und Rauch in der Ferne sehen, es könnte ein mittlerer Brand sein.","Ich habe gerade einen mittleren Brand in der Nähe von #LOCATION# gesehen!","Es gibt ein Feuer auf einem Feld, aber ich kann die Größe des Brandes nicht genau bestimmen.","Es gibt eine starke Rauchentwicklung auf einem Acker neben der Straße.","Ich habe einen Brand auf einem Feld in der Nähe bemerkt.","Ich denke, es brennt auf einem Acker in der Nähe.","Ich habe gerade einen großen Feuerschein in der Ferne gesehen, es könnte ein mittlerer Brand sein."],"area3":["Großer Flächenbrand auf einem Feld nahe #LOCATION#!","Es brennt auf einer großen Wiese in der Nähe von #LOCATION#!","Mehrere Hektar Fläche brennen auf einem Feld in der Nähe von #LOCATION#!","Ein großer Flächenbrand breitet sich auf einem Acker in der Nähe von #LOCATION# aus!","Es brennt auf einem größeren Gebiet auf einem Feld in der Nähe von #LOCATION#!","Ein großer Flächenbrand hat sich auf einem Wiesengrundstück in der Nähe von #LOCATION# ausgebreitet!","Mehrere Hektar Land stehen auf einem Feld in der Nähe von #LOCATION# in Flammen!","Ein großer Brand auf einem Feld in der Nähe von #LOCATION# erfordert sofortige Feuerwehrunterstützung!","Es brennt auf einem großen Stück Land auf einem Feld in der Nähe von #LOCATION#!","Ein großer Flächenbrand bedroht ein Wohngebiet nahe #LOCATION#!"],"smoke":["Hallo, ich möchte eine starke Rauchentwicklung melden.","Es sieht so aus, als ob da Rauch aus einem Gebäude aufsteigt.","Ich sehe Rauch aus einem Fenster in der 2. Etage kommen.","Es gibt eine starke Rauchentwicklung in meiner Nachbarschaft.","Hier kommt ganz viel , dicker schwarzer Rauch aus dem Gewerbegebiet!","Ich kann einen sehr starken Geruch nach Rauch wahrnehmen.","Der Rauch wird auch immer dichter und wird immer mehr","Ich kann nicht sehen, woher der Rauch kommt, aber es ist sehr dicht.","Es riecht sehr nach Rauch in meiner Nähe.","Ich kann die Ursache des Rauchs nicht sehen, aber es riecht sehr nach Verbrennung.","Ich kann das Gebäude nicht sehen, aber der Rauch steigt sehr hoch auf.","Ich sehe keine Flammen, aber es gibt eine Menge Rauch.","Ich kann keine Feuerwehrfahrzeuge sehen, aber ich sehe viel Rauch.","Der Rauch ist sehr dunkel und dick, aber ich kann keine Flammen sehen.","Es sieht so aus, als ob sich der Rauch ausbreitet und immer mehr wird.","Ich kann keine Menschen oder Tiere in der Nähe des Rauchs sehen.","Ich kann nicht sagen, ob es sich um einen Gebäudebrand handelt, aber es ist sehr viel Rauch.","Ich kann keinen Feueralarm hören, aber es gibt eine Menge Rauch.","Ich bin mir nicht sicher, was brennt, aber der Rauch ist sehr dicht.","Ich kann keine Flammen sehen, aber der Rauch ist sehr schwarz.","Der Rauch wird immer dichter und ich kann kaum noch sehen.","Es riecht sehr nach verbranntem Material und der Rauch wird immer stärker.","Ich kann nicht sagen, woher der Rauch kommt, aber es ist sehr viel.","Der Rauch sieht sehr gefährlich aus und ich mache mir Sorgen.","Ich kann keine Feuerwehrfahrzeuge in der Nähe sehen, aber es gibt viel Rauch.","Ich sehe keine Flammen, aber der Rauch ist sehr dicht und schwarz."]}'
    },
    {
        "file_name": "alarm.json",
        "file_path": "Leitstelle112/default/calls/",
        "file_content": '{"fire_detection":["Brandmeldeanlage #LOCATION#: Auslösung Brandmelder, Alarmstufe 1","Alarmierung der Feuerwehr: Brandmeldeanlage #LOCATION# hat Rauchentwicklung festgestellt","Brandmeldeanlage #LOCATION# hat Feueralarm ausgelöst. Bitte umgehend ausrücken.","Notfall in #LOCATION#: Brandmeldeanlage hat ausgelöst und Feuerwehr alarmiert","Brandmeldeanlage #LOCATION# meldet Feueralarm. Bitte umgehend Einsatzkräfte entsenden.","Es wurde eine Brandmeldung von der Anlage in #LOCATION# empfangen. Bitte sofortige Überprüfung.","Alarmierung der Feuerwehr: Brandmeldeanlage #LOCATION# hat Feuer erkannt.","Brandmeldeanlage #LOCATION#: Alarmstufe 2, Rauchentwicklung gemeldet.","Alarmmeldung aus #LOCATION#: Brandmeldeanlage hat Alarm ausgelöst, Feuerwehr benötigt","Die Brandmeldeanlage in #LOCATION# hat Feueralarm ausgelöst. Bitte umgehend prüfen."],"smoke_detector":["Rauchmelder wurde ausgelöst in der Küche von #LOCATION#.","Es wurde ein Feueralarm in der Wohnung von #LOCATION# ausgelöst.","Der Rauchmelder in der Schlafzimmerdecke von #LOCATION# hat ausgelöst.","Alarm ausgelöst in der Wohnung von #LOCATION#. Der Grund ist Rauchentwicklung.","Die Rauchentwicklung im Badezimmer von #LOCATION# hat den Heimrauchmelder ausgelöst.","In der Wohnung von #LOCATION# hat der Rauchmelder in der Diele Alarm ausgelöst.","Der Heimrauchmelder in der Wohnung von #LOCATION# hat einen Brand detektiert.","In der Küche von #LOCATION# hat der Heimrauchmelder ausgelöst, weil Essen angebrannt ist.","Der Rauchmelder im Wohnzimmer von #LOCATION# hat Alarm geschlagen.","Ein Feueralarm wurde in der Wohnung von #LOCATION# ausgelöst. Die Ursache ist ein ausgelöster Heimrauchmelder."]}'
    },
    {
        "file_name": "assist.json",
        "file_path": "Leitstelle112/default/calls/",
        "file_content": '{"accident":["Guten Tag, ich habe gerade einen Unfall gesehen. Ein Auto ist von der Straße abgekommen und der Fahrer scheint verletzt zu sein.","Hier gab es einen schweren Unfall auf der Autobahn. Da sind mehrere Autos beteiligt. Das sieht sehr schlimm aus."],"assist":["Ich bin gerade an einer Baustelle vorbeigefahren. Da ist der große gelbe Kran umgestürzt. Ich glaube aber, dass da keiner in der Nähe war. Ist ja schließlich schon Feierabend.","Hier liegt ein Baum auf der Straße! Der blockiert den ganzen Verkehr.","Hallo, ich brauche dringend Hilfe. Ich bin mit meinem Auto liegen geblieben und komme nicht weiter.","Da ist gerade ein großes Stück von der Fassade eingestürzt. Da könnten noch Menschen drin sein, die dringend Hilfe brauchen."],"human":["Ich habe gerade einen Mann von der Brücke geholt. Der wollte da runterspringen. Ich konnte ihn gerade noch zurückhalten, aber ich denke, er braucht professionelle Hilfe.","Ich bin gerade Zeuge eines Überfalls geworden. Die Täter sind geflüchtet, aber das Opfer scheint schwer verletzt zu sein.","Ich habe gerade gesehen, wie ein Kind in einen offenen Schacht gefallen ist. Der ist ganz schön tief, das Kind hat sich bestimmt verletzt.","Hallo, ich brauche dringend Hilfe. Die Treppe zum Dachboden ist eingebrochen und meine Mutter ist noch da oben. Die kommt nicht mehr von allein runter!"],"tree_vehicle":["Ich bin gerade auf der #LOCATION# und habe gesehen, wie ein großer Ast auf ein parkendes Auto gestürzt ist.","Eine dringende Meldung. Vor mir ist ein Baum gerade auf einen LKW gekippt und hat ihn zum Stillstand gebracht. Das war ganz fürchterlich laut","Ein Baum an der #LOCATION# hat soeben einen PKW getroffen, nachdem er einfach umgekippt ist.","Ich rufe an, weil ein Baum auf ein Auto gestürzt ist. Das ist hier an der #LOCATION#.","Hier ist ein großer Baum auf die #LOCATION# gefallen. Wie Sie sicherlich wissen ist das eine viel befahrene Straße und blockiert nun den Verkehr."]}'
    },
    {
        "file_name": "fluids.json",
        "file_path": "Leitstelle112/default/calls/",
        "file_content": '{"oil_big":["Da hat eben ein LKW irgendeine Ölige Chemikalie verloren. Das läuft alles Richtung Brücke. Die Brücke wo auch der Fluss drunterdurch geht!!","Hier ist so ein öliger Film auf der Straße, das ist eine Gefahr für den Verkehr. Diese rutschige Spur zieht sich schon ein paar hundert Meter!","Mir ist gerade ein kleines Missgeschick passiert. Ich habe den Tankdenkel nicht richtig zugemacht. Jetzt ist der ganze Inhalt auf der Straße hinter mir verteilt.","Hier ist eine größere Ölspur im Bereich der #LOCATION#. Die Spur zieht sich über eine Strecke von etwa 500 Metern und ist eine mehrere Zentimeter dicke Schicht aus Öl, die sich auf der Fahrbahn und auf dem Gehweg ausgebreitet hat."],"oil_small":["Ich habe gerade eine kleine Ölspur auf der Straße bemerkt, das kann ziemlich gefährlich werden. Hier ist nämlich ziemlich viel los.","Hier ist so ein öliger Film auf der Straße, das ist eine Gefahr für den Verkehr. Diese rutschige Spur ist aber nicht so lang.","Hier ist eine ziemlich große Pfütze auf der Straße. Die riecht stark nach Öl. Das ist bestimmt gefährlich für andere Autofahrer.","Ich möchte eine kleine Ölspur melden. Die muss da sofrt weg. Sonst passiert noch ein Unfall!"],"unknown":["Ich möchte hier eine komisch riechende Flüssigkeit melden. Vielleicht ist das was gefährliches, besser Sie schauen sich das mal an!","Ich bin gerade an einer Stelle vorbeigefahren, wo es ganz schön dolle nach Benzin riecht. Da ist bestimmt etwas ausgelaufen.","Ich bin da gerade an einem Unfallort vorbeigefahren, es sieht so aus, als würde da Öl auf die Straße laufen."],"other":["Ich glaube, hier gab es gerade einen Unfall oder sowas. Da laufen eine Menge Betriebsstoffe oder Öl oder sowas auf der Straße aus.","Mir ist bei meinem Gabelstapler die Ölwanne aufgerissen. Das ist jetzt quer über unseren Betriebshof verteilt"]}'
    },
    {
        "file_name": "filler.json",
        "file_path": "Leitstelle112/default/calls/",
        "file_content": '{"start":["Guten Tag, mein Name ist #NAME# und ich bin hier an der #LOCATION#.","Hallo, ich brauche hier wirklich dringend Hilfe. Ich heiße #NAME#.","Moin, #NAME# hier. Ich möchte einen Notfall melden.","#NAME#, kommen Sie schnell!","Ich brauche sofort Hilfe. #NAME# ist mein Name.","Ich rufe wegen einer Notlage an. Mein Name ist #NAME#.","Hier ist #NAME# und ich brauche Ihre Hilfe.","Ich befinde mich an der Adresse #LOCATION# und brauche dringend Hilfe. Meine Name ist #NAME#.","Hier braucht jemand ihre Hilfe.","#NAME# am Apparat. Gut, dass Sie endlich rangehen! Ich habe es schon zich mal versucht. Es ist nämlich wirklich dringend!"],"end":["Vielen Dank für Ihre Hilfe!","Ich danke Ihnen für Ihre Unterstützung!","Nochmals vielen Dank!","Ich bin sehr dankbar für Ihre Hilfe!","Mensch bin ich erleichtert, dass jetzt endlich jemand kommt!","Danke, für ihre Hilfe.","Ich warte dann hier auf die Kollegen.","Danke für Ihre Zeit und Unterstützung!","Ich bin froh, dass ich mich auf Sie verlassen konnte.","Gut, dann lege ich jetzt auf und warte auf die Rettungskräfte.","Vielen Dank.","Bitte beeilen Sie sich!","Vielen Dank für Ihre schnelle Hilfe!","Bitte bringen Sie genug Einsatzkräfte mit!","Ich bleibe am Telefon, falls Sie weitere Fragen haben!","Ich habe alle notwendigen Informationen gegeben, bitte helfen Sie schnell!","Bitte kommen Sie so schnell wie möglich!","Ich danke Ihnen für Ihre Unterstützung!","Ich warte hier auf die Feuerwehr / den Rettungsdienst!","Bitte rufen Sie mich zurück, falls es Neuigkeiten gibt!","Ich stehe für weitere Informationen zur Verfügung."]}'
    }
])

async function showMissionsOnMap() {
    const allOpenMissions = await databaseAPI.select({
        database: {
            name: "mission"
        },
        table: {
            name: "active_missions",
            options: "all"
        }
    })
        .catch((err) => {
            logFile.write('ERROR', err, session);
            throw new Error(err)
        });

    allOpenMissions.forEach((element: any) => {
        // console.log(element);
    });
}

async function showItemsOnMap() {
    const allItems = await databaseAPI.select({
        database: {
            name: "items"
        },
        table: {
            name: "buildings",
            options: "all"
        }
    })
        .catch((err) => {
            logFile.write('ERROR', err, session);
            throw new Error(err)
        });

    allItems.forEach((element: any) => {
        console.log(element);
        const buildingItem = new ttm.Marker({
            color: "red"
        });
        buildingItem.setLngLat(element.building_position);
        buildingItem.addTo(map);
    });
}

showMissionsOnMap();
showItemsOnMap();