import fs = require("fs");
import { Location } from "./location"

export class BusStop {
    code : string;
    name : string;
    location : Location;

    constructor (code : string, name : string, easting : number, northing : number) {
        this.code = code;
        this.name = name;
        this.location = new Location(easting, northing);
    }
}

export function loadBusStops(file : string) : BusStop[] {
    var data = fs.readFileSync(file).toString();
    var lines = data.split("\n");
    var stops : BusStop[] = [];
    // start at 1 to skip the first line (which gives the title of each column)
    for (var i = 1; i < lines.length; i++) {
        var line = lines[i];
        var sections = line.split(",");
        var code = sections[2]; // This is the field in the CSV file labeled 'Naptan_Atco', not the one labeled code
        var name = sections[3];
        var easting = +sections[4];
        var northing = +sections[5];
        stops.push(new BusStop(code, name, easting, northing));
    }
    return stops;
}

export function closestTwoStops(location : Location, stops : BusStop[]) : BusStop[] {
    var lowestDistance = Infinity;
    var closestStop : BusStop = null;
    stops.forEach(stop => {
        if (location.distTo(stop.location) < lowestDistance) {
            lowestDistance = location.distTo(stop.location);
            closestStop = stop;
        }
    });
    lowestDistance = Infinity;
    var secondClosestStop : BusStop = null;
    stops.forEach(stop => {
        if (stop != closestStop && location.distTo(stop.location) < lowestDistance) {
            lowestDistance = location.distTo(stop.location);
            secondClosestStop = stop;
        }
    });
    return [closestStop, secondClosestStop];
}