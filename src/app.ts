import { Location, locationFromPostCode } from "./location";
import { closestTwoStops, BusStop, loadBusStops } from "./stop";
import { getArrivalsAtStop, BusInformation} from "./busInformation"
import http = require("http");

let stops = loadBusStops("data/bus-stops.csv");
console.log(`Loaded ${stops.length} stops into memory.`);

const pageStart = "<html><head> <title> BusWire Live View </title> <script> window.setTimeout(function() { window.location = window.location }, 5000) </script> </head> <body>";
const pageEnd = "</body></html>";

const homepage = `<html><head> <title>BusWire</title> </head>
    <body> Enter postcode: <input id = "postcode" type="textarea"/>
    <input type = "button" value = "submit" onclick = "window.location = '/postcode/' + document.getElementById('postcode').value"/> </body> 
    </html>`;

function displayDataForPostcode(postcode : string, response : http.ServerResponse) {
    locationFromPostCode(postcode, location => {
        let [closestStop, secondClosestStop] = closestTwoStops(location, stops);
        getArrivalsAtStop(closestStop, arrivalsAtFirst => {
            getArrivalsAtStop(secondClosestStop, arrivalsAtSecond => {
                response.write(pageStart);
                writeTableForInformation(closestStop, arrivalsAtFirst, response);
                writeTableForInformation(secondClosestStop, arrivalsAtSecond, response);
                response.end(pageEnd);
            });
        });
    }, () => {
        response.end(`<html> <head> <title> Invalid postcode </title> </head>
            <body> Could not get information for postcode: ${postcode}. <br>
            <a href = "/"> Return to home. </a> </body> </html>`);
    });
}

function writeTableForInformation(stop : BusStop, information : BusInformation[], response : http.ServerResponse) {
    information.sort((a, b) => a.timeToStation < b.timeToStation ? -1 : 1);
    information = information.splice(0,5);
    response.write(`<br><heading> Arrivals at ${stop.name}: </heading>`);
    response.write("<table>");
    for(let bus of information) {
        response.write(`<tr><td><b>${bus.line.toUpperCase()}</b></td> <td>${bus.destination}</td> <td>${bus.timeToStation}</td></tr>`);
    }
    response.write("</table>");
}

const port = 8080;

function handleResponse(request : http.IncomingMessage, response : http.ServerResponse) {
    console.log("received request with url = " + request.url);
    if (request.url.substr(0,10) == "/postcode/") {
        let code = decodeURI(request.url.substr(10));
        console.log("postcode = " + code);
        displayDataForPostcode(code, response);
    } else if (request.url == "/" || request.url == "") {
        response.end(homepage);
    } else {
        response.end("Invalid page");
    }
}

let server = http.createServer(handleResponse);

server.listen(port, () => {
    console.log(`listening on port ${port}`);
});