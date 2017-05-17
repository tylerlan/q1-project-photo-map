/* Calling Google Maps Geocoding API */

const URL = 'https://maps.googleapis.com/maps/api/geocode/json?address='
const KEY = 'AIzaSyA05MTxlz_LxdlkkhBtcp56kBDFt3pwbgE';


class Geocoding {
  search(searchTerm) {
  var lookup = `${URL}${searchTerm}&key=${KEY}`;
  var request = fetch(encodeURI(lookup));

  request
    .then(mapsResponse => mapsResponse.json())
    .then(locationObject => locationObject.results[0].geometry.location)
    .then(locationCoordinates => {
        let lat = locationCoordinates.lat;
        let lng = locationCoordinates.lng
        this.doSomethingWithCoordinates(lat, lng)
    })
  }

  doSomethingWithCoordinates(latitude, longitude) {
    console.log(`Lat: ${latitude} and Long: ${longitude}`);
  }

};

let testLookup = new Geocoding;
testLookup.search('1600 Amphitheatre Parkway, Mountain View, CA');
