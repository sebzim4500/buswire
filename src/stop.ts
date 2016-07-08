import fs = require("fs");
import { Location } from "./location"

export class BusStop {
    location : Location;

    constructor (public code : string, public name : string, easting : number, northing : number) {
        this.code = code;
        this.name = name;
        this.location = new Location(easting, northing);
    }
}

export function loadBusStops(file : string) : BusStop[] {
    let data = fs.readFileSync(file).toString();
    let lines = data.split("\n");
    let stops : BusStop[] = [];
    // start at 1 to skip the first line (which gives the title of each column)
    for (let i = 1; i < lines.length; i++) {
        let line = lines[i];
        let sections = line.split(",");
        let code = sections[2]; // This is the field in the CSV file labeled 'Naptan_Atco', not the one labeled code
        let name = sections[3];
        let easting = +sections[4];
        let northing = +sections[5];
        stops.push(new BusStop(code, name, easting, northing));
    }
    return stops;
}

export function closestTwoStops(location : Location, stops : BusStop[]) : BusStop[] {
    let lowestDistance = Infinity;
    let closestStop : BusStop = null;
    stops.forEach(stop => {
        if (location.distTo(stop.location) < lowestDistance) {
            lowestDistance = location.distTo(stop.location);
            closestStop = stop;
        }
    });
    lowestDistance = Infinity;
    let secondClosestStop : BusStop = null;
    stops.forEach(stop => {
        if (stop != closestStop && location.distTo(stop.location) < lowestDistance) {
            lowestDistance = location.distTo(stop.location);
            secondClosestStop = stop;
        }
    });
    return [closestStop, secondClosestStop];
}