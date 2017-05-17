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
        let lng = locationCoordinates.lng;
        this.initMap(lat, lng);
        this.doSomethingWithCoordinates(lat, lng)
      })
  }

  // doSomethingWithCoordinates() is probably going to have to be the Instagram call
  // ... So I need to import the method from ImageService and run it here
  // aaaand, maybe we want to put this whole then look in IndexPage

  doSomethingWithCoordinates(latitude, longitude) {
    console.log(`Lat: ${latitude} and Long: ${longitude}`);
  }

  // initMap belongs in its own file (i.e. Map Services), but I want to keep it here for testing purposes right now
  initMap(latitude, longitude) {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: latitude, lng: longitude},
      zoom: 8
    });

    return map;
  }

};

let testLookup = new Geocoding;
testLookup.search('1600 Amphitheatre Parkway, Mountain View, CA');
