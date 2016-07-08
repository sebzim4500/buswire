import request = require("request");

export class Location {
    constructor (public easting : number, public northing : number) { }

    distTo (other : Location) : number {
        return Math.sqrt(Math.pow(this.easting - other.easting, 2) + Math.pow(this.northing - other.northing, 2));
    }
}

export function locationFromPostCode(postcode : string, callback : (location : Location) => void, onError : () => void) {
    request("https://api.postcodes.io/postcodes/"+encodeURIComponent(postcode), (error, response, body) => {
        //TODO more error handling
        let returned = JSON.parse(body);
        if (returned.status == "200") {
            let result = returned.result;
            let eastings = result.eastings;
            let northings = result.northings;

            callback(new Location(eastings, northings));
        } else {
            onError();
        }
    })
}