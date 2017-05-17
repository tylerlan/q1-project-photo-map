const KEY = 'AIzaSyDtet_-9zOt0miA0G0mlaeldeICJvlrBVI';

module.exports = class MapService {
  constructor () {

  }

  initMap(latitude, longitude) {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: latitude, lng: longitude},
          zoom: 8
        });

        return map;
      }


}
