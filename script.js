/* ===================================================================
          I N I T I A L     M A P     G E N E R A T I O N
===================================================================*/

var map;

// NOTE: Google scirpt in HTMl looks for this function initMap and runs it as a callback on page load
function initMap() {
  // eslint-disable-line
  let latitude = Number((Math.random() * 90).toFixed(3));
  let longitude = Number((Math.random() * -130).toFixed(3));

  var startingPosition = new google.maps.LatLng(latitude, longitude);
  var mapSpecs = {
    zoom: 10,
    center: startingPosition,
    mapTypeId: "satellite"
  };
  map = new google.maps.Map(document.getElementById("map"), mapSpecs);

  let contentString = `<h4>Welcome</h4><p>Where are we?</p><p>Who cares, there's nothing interesting here. Enter a location in the search bar above and click generate to view that location and see if there are any pictures there.</p>`;

  let marker = new google.maps.Marker({
    position: startingPosition,
    map: map,
    title: "Starting Location"
  });

  var infowindow = new google.maps.InfoWindow();

  marker.addListener("click", function() {
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

$("#submit").click(event => {
  event.preventDefault();

  let searchTerm = $("#location")[0].value;

  if (searchTerm.length === 0) {
    alert("You must enter a new location");
  } else {
    processUserInput(searchTerm);
  }
});

function processUserInput(searchTerm) {
  let generateMap = new Map();
  let newMapPosition = generateMap.search(searchTerm);

  newMapPosition
    .then(currentLocation => {
      var generateInstaContent = new InstaData();
      return generateInstaContent.getRecentPics(currentLocation);
    })
    .catch(err => console.log(err)); // eslint-disable-line
}

/* ===================================================================
            N E W      M A P      G E N E R A T I O N
===================================================================*/

const GEO_URL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
const GEO_KEY = "AIzaSyAAM1zPuVWdHPXAyIN7rhgk6lNsPVC-oIc";

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
        return this._createMap(lat, lng);
      })
      .catch(err => console.log(err)); // eslint-disable-line
  }

  _createMap(latitude, longitude) {
    var newPosition = new google.maps.LatLng(latitude, longitude);
    var mapSpecs = {
      zoom: 12,
      center: newPosition
    };
    map = new google.maps.Map(document.getElementById("map"), mapSpecs);

    return { lat: latitude, lng: longitude };
  }
}

/* ===================================================================
                          I N S T A G R A M
===================================================================*/

// Get a new TOKEN:
// https://api.instagram.com/oauth/authorize/?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token

// REDIRECT_URI and CLIENT_ID are both references to my app, not the user

// CLIENT-ID:
// 4f9ed3b9afd94c3fbf0536a3a54f7a68

// REDIRECT-URI:
// http://mapstagram.surge.sh/

// https://api.instagram.com/oauth/authorize/?client_id=4f9ed3b9afd94c3fbf0536a3a54f7a68&redirect_uri=http://mapstagram.surge.sh/&response_type=token

// NEW TOKEN: 256450119.4f9ed3b.85b25e00bb864c6aa837a5896060080f

class InstaData {
  constructor() {
    this.TOKEN = "256450119.4f9ed3b.85b25e00bb864c6aa837a5896060080f";
  }

  getMyInfo() {
    const aboutMe = `https://api.instagram.com/v1/users/self/?access_token=${this
      .TOKEN}`;

    var request = fetch(aboutMe);

    request
      .then(response => response.json())
      .then(data => data.data)
      .then(bio => {
        $("#instabio").html(
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
      .catch(err => console.log("There was an error getting my info:", err)); // eslint-disable-line
  }

  getRecentPics(currentLocation) {
    const recentPics = `https://api.instagram.com/v1/users/self/media/recent/?access_token=${this
      .TOKEN}`;

    var request = fetch(recentPics);

    request
      .then(response => response.json())
      .then(data => {
        var numberOfPhotosAtThisLocation = 0;
        data.data.forEach(photoObject => {
          let thumbnail = photoObject.images.thumbnail.url;
          let caption = photoObject.caption.text;
          let link = photoObject.link;

          if (photoObject.location) {
            // If the image is geocoded...
            let lat = photoObject.location.latitude;
            let lng = photoObject.location.longitude;
            let coords = { lat: lat, lng: lng };
            let locationName = photoObject.location.name;

            if (isNearby(coords, currentLocation)) {
              // If the photo is nearby, render it
              numberOfPhotosAtThisLocation++;
              createMarker(coords, locationName, caption, link);
              $("#instafeed").append(`
                <a target="_blank" href="${link}"><img class="fade" src="${thumbnail}"></a>
                `);
            }
          }
          // NOTE: If the photo has no location, it disppears into the ether...
        });

        if (numberOfPhotosAtThisLocation > 0) {
          this.getMyInfo();
        } else {
          alert("No photos at this location. Looks like a lovely area though.");
        }
      })
      .catch(err =>
        console.log("There was an error getting recent pics:", err)
      ); // eslint-disable-line
  }
}

function isNearby(photoCoords, referenceCoords) {
  let testLat = photoCoords.lat;
  let testLng = photoCoords.lng;

  let maxLat = referenceCoords.lat + 0.08;
  let minLat = referenceCoords.lat - 0.08;
  let maxLng = referenceCoords.lng + 0.08;
  let minLng = referenceCoords.lng - 0.08;

  return (
    testLat <= maxLat &&
    testLat >= minLat &&
    (testLng <= maxLng && testLng >= minLng)
  );
}

function createMarker(position, title, description, link) {
  let marker = new google.maps.Marker({
    position: position,
    map: map,
    title: title,
    icon: "assets/img/ic_camera_1x.png",
    animation: google.maps.Animation.DROP
  });

  let contentString = `<h6>${title}</h6><p>${description}</p><a target="_blank" href="${link}">original</a>`;

  let infowindow = new google.maps.InfoWindow({
    content: contentString,
    maxWidth: 200
  });

  marker.addListener("click", function() {
    infowindow.open(map, marker);
  });
}
