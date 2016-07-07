import request = require("request");

export class Location {
    easting : number;
    northing : number;

    constructor (easting : number, northing : number) {
        this.easting = easting;
        this.northing = northing;
    }

    distTo (other : Location) : number {
        return Math.sqrt(Math.pow(this.easting - other.easting, 2) + Math.pow(this.northing - other.northing, 2));
    }
}

export function locationFromPostCode(postcode : string, callback : (location : Location) => void) {
    request("https://api.postcodes.io/postcodes/"+encodeURIComponent(postcode), (error, response, body) => {
        //TODO error handling
        var result = JSON.parse(body).result;
        var eastings = result.eastings;
        var northings = result.northings;

        callback(new Location(eastings, northings));
    })
}