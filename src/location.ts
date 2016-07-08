import request = require("request");

export class Location {
    constructor (public easting : number, public northing : number) { }

    distTo (other : Location) : number {
        return Math.sqrt((this.easting - other.easting) ** 2 + (this.northing - other.northing) ** 2);
    }
}

export function locationFromPostCode(postcode : string, callback : (location : Location) => void, onError : () => void) {
    request("https://api.postcodes.io/postcodes/"+encodeURIComponent(postcode), (error, response, body) => {
        //TODO more error handling
        let returned = JSON.parse(body);
        if (returned.status == "200") {
            let {eastings, northings} = returned.result;
            callback(new Location(eastings, northings));
        } else {
            onError();
        }
    })
}