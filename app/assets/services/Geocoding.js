/* Calling Google Maps Geocoding API */ 

const URL = 'https://maps.googleapis.com/maps/api/geocode/json?address='
const KEY = 'AIzaSyA05MTxlz_LxdlkkhBtcp56kBDFt3pwbgE';
var location; // The contents of form input
// 1600+Amphitheatre+Parkway,+Mountain+View,+CA


fetch(`${URL}${location}&key=${KEY}`)
