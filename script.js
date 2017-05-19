/* ===================================================================
          I N I T I A L     M A P     G E N E R A T I O N
===================================================================*/

// const MAP_KEY = 'AIzaSyDtet_-9zOt0miA0G0mlaeldeICJvlrBVI';

var map;

function initMap() {
  let latitude = Number((Math.random() * 90).toFixed(3));
  let longitude = Number((Math.random() * -130).toFixed(3));

  var startingPosition = new google.maps.LatLng(latitude, longitude);
  var mapSpecs = {
    zoom: 10,
    center: startingPosition,
  }
  map = new google.maps.Map(document.getElementById("map"), mapSpecs);

  let contentString = `<div id="content"><h4>Welcome</h4><div id="bodyContent"><p>Where are we?</p><p>Nevermind.</p><p>There's nothing interesting here.</p><p>Let's go somewhere else.</p></div></div>`;

  let marker = new google.maps.Marker({
    position: startingPosition,
    map: map,
    title: 'Starting Location'
  });

  var infowindow = new google.maps.InfoWindow();

  marker.addListener('click', function() {
    infowindow.setContent(contentString);
    infowindow.setOptions({
      maxWidth: 400
    });
    infowindow.open(map, marker);
  });

}

/* **************************************************************
     L I S T E N I N G     F O R     U S E R     I N P U T
*************************************************************** */

$('#submit').click((event) => {
  event.preventDefault();

  let searchTerm = $('#location')[0].value;

  if (searchTerm.length === 0) {
    alert('You must enter a new location')
  } else {
    processUserInput(searchTerm);
  }

})

function processUserInput(searchTerm) {
  let generateMap = new Map;
  let newMapPosition = generateMap.search(searchTerm);

  newMapPosition.then(currentLocation => {
    let generateInstaContent = new InstaData;
    generateInstaContent.getRecentPics(currentLocation);
    generateInstaContent.getMyInfo();

  })


}

/* ===================================================================
            N E W      M A P      G E N E R A T I O N
===================================================================*/

const GEO_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address='
const GEO_KEY = 'AIzaSyA05MTxlz_LxdlkkhBtcp56kBDFt3pwbgE';

class Map {
  search(searchTerm) {
    var lookup = `${GEO_URL}${searchTerm}&key=${GEO_KEY}`;
    var request = fetch(encodeURI(lookup));

    return request
      .then(mapsResponse => mapsResponse.json())
      .then(locationObject => locationObject.results[0].geometry.location)
      .then(locationCoordinates => {
        let lat = locationCoordinates.lat;
        let lng = locationCoordinates.lng;
        return this.createMap(lat, lng);
      })
  }

  createMap(latitude, longitude) {
    var newPosition = new google.maps.LatLng(latitude, longitude);
    var mapSpecs = {
      zoom: 12,
      center: newPosition,
    }
    map = new google.maps.Map(document.getElementById("map"), mapSpecs);

    // return `${latitude}, ${longitude}`;
    return {lat: latitude, lng: longitude};
  }

};





// // REDIRECT_URI and CLIENT_ID are both references to my app, not the user
// const REDIRECT_URI = 'http://localhost:3333'
// const CLIENT_ID = '4f9ed3b9afd94c3fbf0536a3a54f7a68'

// // I would need to put a 'log in' at the beginning, using the AUTH-URL
// const AUTH_URL = `https://api.instagram.com/oauth/authorize/?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token

// const MyRecentMedia = `https://api.instagram.com/v1/users/self/media/recent/?access_token=${MY_AUTH_TOKEN}`;

// const aboutMe = `https://api.instagram.com/v1/users/self/?access_token=${MY_AUTH_TOKEN}`


/* ===================================================================
                          I N S T A G R A M
===================================================================*/

class InstaData {
  constructor() {
    this.TOKEN = '256450119.4f9ed3b.85b25e00bb864c6aa837a5896060080f';
  }

  getMyInfo() {
    const aboutMe = `https://api.instagram.com/v1/users/self/?access_token=${this.TOKEN}`

    var request = fetch(aboutMe);

    request
      .then(response => response.json())
      .then(data => data.data)
      .then(bio => {
        $('#instabio').html(
          `<div class="row valign-wrapper">
            <div class="col s8 offset-s2 valign">
              <div class="card horizontal">
                  <div class="card-image">
                    <img src="${bio.profile_picture}">
                  </div>
                  <div class="card-stacked">
                    <div class="card-content">
                      <h4>${bio.full_name}</h4>
                      <p>${bio.bio}</p>
                    </div>
                    <div class="card-action">
                      <a target="_blank" href="https://www.linkedin.com/in/tylerlangenbrunner/"><i class="material-icons">domain</i></a>
                      <a target="_blank" href="https://github.com/tylerlan"><i class="material-icons">code</i></a>
                      <a target="_blank" href="https://twitter.com/tylerdevs"><i class="material-icons">trending_up</i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>`
        );

      })
  }

  getRecentPics(currentLocation) {
    const recentPics = `https://api.instagram.com/v1/users/self/media/recent/?access_token=${this.TOKEN}`;

    var request = fetch(recentPics);
    console.log(currentLocation);

    request
    .then(response => response.json())
    .then(data => {
      data.data.forEach( (photoObject) => {

        // start loading content
          let thumbnail = photoObject.images.thumbnail.url;
          let caption = photoObject.caption.text;
          let link = photoObject.link;
          let tagsArray = photoObject.tags;

          if (photoObject.location) { // If the image is geocoded...
            let lat = photoObject.location.latitude;
            let lng = photoObject.location.longitude;
            let coords = { lat: lat, lng: lng};
            let locationName = photoObject.location.name;

            if (isNearby(coords, currentLocation)) { // If the photo is nearby, render it

              createMarker(coords, locationName, caption, link);
              $('#instafeed').append(`
                <a target="_blank" href="${link}"><img class="fade" src="${thumbnail}"></a>
                `)
            }
          }
          // If the photo has no location, it disppears into the ether...
      } )
      if
    })
    .catch(console.log)
  }
}

function isNearby(photoCoords, referenceCoords) {
  let testLat = photoCoords.lat;
  let testLng = photoCoords.lng;

  let maxLat = referenceCoords.lat + 0.08;
  let minLat = referenceCoords.lat - 0.08;
  let maxLng = referenceCoords.lng + 0.08;
  let minLng = referenceCoords.lng - 0.08;

  return (testLat <= maxLat && testLat >= minLat) && (testLng <= maxLng && testLng >= minLng);
}

function createMarker(position, title, description, link) {
  console.log('MAKING A NEW MARKER');
    let marker = new google.maps.Marker({
                  position: position,
                  map: map, // map is a global variable
                  title: title,
                  icon: "assets/img/ic_camera_1x.png",
                  animation: google.maps.Animation.DROP
                  });

    let contentString = `<h6>${title}</h6><p>${description}</p><a target="_blank" href="${link}">original</a>`;

    let infowindow = new google.maps.InfoWindow({
                      content: contentString,
                      maxWidth: 200
                      });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });

}








//
