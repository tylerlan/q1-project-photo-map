// Start by generating a Google map over San Francisco

// Mark the map with pins representing the geolocation of all the pictures I've taken recently

// When the user enters info in the search box, it moves the map to that area and re-renders the marks with my photos


/* ===================================================================
                            GOOGLE MAP
===================================================================*/

// const MAP_KEY = 'AIzaSyDtet_-9zOt0miA0G0mlaeldeICJvlrBVI';

var map;

function initMap() {
  var san_francisco = {
    lat: 37.7749295,
    lng: -122.4194155
  };
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: san_francisco
  });

  var contentString = `<div id="content"><h4>This City</h4><div id="bodyContent"><p>Here is some text</p></div></div>`;

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  var marker = new google.maps.Marker({
    position: seattle,
    map: map,
    title: 'Seattle'
  });

  var anotherMarker = new google.maps.Marker({
    position: san_francisco,
    map: map,
    title: 'San Francisco'
  });

  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

  anotherMarker.addListener('click', function() {
    infowindow.open(map, anotherMarker);
  });

}

// /* ===================================================================
//                     MAKER DROPPING ANIMATION
// ===================================================================*/
//
//       // If you're adding a number of markers, you may want to drop them on the map
//       // consecutively rather than all at once. This example shows how to use
//       // window.setTimeout() to space your markers' animation.
//
//
//
//       class RenderMarkers {
//         constructor(coords) {
//
//           this.photoPositions = coords;
//
//
//         }
//
//         var photoMarkers = [];
//
//         drop() {
//           clearMarkers();
//           for (var i = 0; i < photoPositions.length; i++) {
//             addMarkerWithTimeout(photoPositions[i], i * 200);
//           }
//         }
//
//
//
//         addMarkerWithTimeout(position, timeout) {
//           window.setTimeout(function() {
//             photoMarkers.push(new google.maps.Marker({
//               position: position,
//               map: map,
//               animation: google.maps.Animation.DROP
//             }));
//           }, timeout);
//         }
//
//         clearMarkers() {
//           for (var i = 0; i < photoMarkers.length; i++) {
//             photoMarkers[i].setMap(null);
//           }
//           photoMarkers = [];
//         }
//       }

/* ===================================================================
                            GEOCODING
===================================================================*/

const GEO_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address='
const GEO_KEY = 'AIzaSyA05MTxlz_LxdlkkhBtcp56kBDFt3pwbgE';

class Map {
  search(searchTerm) {
    var lookup = `${GEO_URL}${searchTerm}&key=${GEO_KEY}`;
    var request = fetch(encodeURI(lookup));

    request
      .then(mapsResponse => mapsResponse.json())
      .then(locationObject => locationObject.results[0].geometry.location)
      .then(locationCoordinates => {
        let lat = locationCoordinates.lat;
        let lng = locationCoordinates.lng;
        this.initMap(lat, lng);
      })
  }

  initMap(latitude, longitude) {
    console.log("LATITUDE:", latitude, "LONGITUDE:", longitude);
    map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: latitude,
        lng: longitude
      },
      zoom: 12
    });
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
                            INSTAGRAM
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
        $('#instabio').append(
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

  getRecentPics() {
    const recentPics = `https://api.instagram.com/v1/users/self/media/recent/?access_token=${this.TOKEN}`;

    var request = fetch(recentPics);

    request
    .then(response => response.json())
    .then(data => {
      for (let x in data.data) { // PRINCIPAL FOR LOOP ---------------
        let thumbnailURL = data.data[x].images.thumbnail.url;
        if (data.data[x].location) {
          let lat = data.data[x].location.latitude;
          let lng = data.data[x].location.longitude;
          let coordinates = { lat: lat, lng: lng};
          let caption = data.data[x].caption.text;
          let imgId = data.data[x].id;

          // Check to see whether the available photos are near the search coordinates
          // photoPositions.push(coordinates);

          createMarker(coordinates, imgId, caption);

        }
        $('#instafeed').append(`<img src="${thumbnailURL}">`);
      }
    })
    .catch(console.log)
  }
}

function createMarker(position, title, description) {
  console.log('MAKING A NEW MARKER');
    let marker = new google.maps.Marker({
                  position: position,
                  map: map, // map is a global variable
                  title: title,
                  icon: "assets/img/ic_camera_1x.png",
                  animation: google.maps.Animation.DROP
                  });

    let contentString = `<h3>${title}</h3><p>${description}</p>`;

    let infowindow = new google.maps.InfoWindow({
                      content: description,
                      maxWidth: 200
                      });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });

}

/* *****************************************************************
                            RUN IT
*****************************************************************
*/

$('#submit').click((event) => {
  event.preventDefault();
  let value = $('#location')[0].value;
  console.log('VALUE', value);
  doSomethingWithUserInput(value);
})

function doSomethingWithUserInput(searchTerm) {
  let generateMap = new Map;
  generateMap.search(searchTerm);

  let generateInstaContent = new InstaData;
  generateInstaContent.getRecentPics();
  generateInstaContent.getMyInfo();

}






//
