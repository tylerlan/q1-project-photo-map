/* Calling Google Maps Geocoding API */

const URL = 'https://maps.googleapis.com/maps/api/geocode/json?address='
const KEY = 'AIzaSyA05MTxlz_LxdlkkhBtcp56kBDFt3pwbgE';
var location = '1600 Amphitheatre Parkway, Mountain View, CA';


// Geocoding request and response (latitude/longitude lookup)
let lookup = `${URL}${location}&key=${KEY}`;

fetch(lookup).then(mapsResponse => mapsResponse.json())
