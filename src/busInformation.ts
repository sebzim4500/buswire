import request = require("request");
import { BusStop } from "./stop";

export class BusInformation {
    line : string;
    destination : string;
    timeToStation : number;

    constructor (json : any) {
        this.line = json.lineName;
        this.destination = json.destinationName;
        this.timeToStation = json.timeToStation;
    }
}

export function getArrivalsAtStop(stop : BusStop, callback : (information : BusInformation[]) => void) {
    request(`https://api.tfl.gov.uk/StopPoint/${stop.code}/arrivals`, (error, response, body) => {
        //TODO error handling
        let json = JSON.parse(body);
        let result : BusInformation[] = [];
        for (let i = 0; i < json.length; i++) {
            result.push(new BusInformation(json[i]));
        }
        callback(result);
    });
}