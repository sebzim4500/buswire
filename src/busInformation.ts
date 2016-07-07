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
        var json = JSON.parse(body);
        var result : BusInformation[] = [];
        for (var i = 0; i < json.length; i++) {
            result.push(new BusInformation(json[i]));
        }
        callback(result);
    });
}