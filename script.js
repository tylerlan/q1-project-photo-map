// JQuery for dropdown options and food truck list
$(document).ready(() => {
  $('.button-collapse').sideNav();
});

/* ===================================================================
          I N I T I A L     M A P     G E N E R A T I O N
===================================================================*/

var map;

// NOTE: Google scirpt in HTML looks for this function initMap and runs it as a callback on page load

function initMap() {
  // eslint-disable-line
  let latitude = Number((Math.random() * 90).toFixed(3));
  let longitude = Number((Math.random() * -130).toFixed(3));

  var startingPosition = new google.maps.LatLng(latitude, longitude);
  var mapSpecs = {
    zoom: 10,
    center: startingPosition,
    mapTypeId: 'satellite',
  };

  map = new google.maps.Map(document.getElementById('map'), mapSpecs);

  let contentString = `<h4>Welcome</h4><p>Where are we?</p><p>Who cares, there's nothing interesting here. Enter a location in the search bar above and click generate to view that location and see if there are any pictures there.</p>`;

  let marker = new google.maps.Marker({
    position: startingPosition,
    map: map,
    title: 'Starting Location',
  });

  var infowindow = new google.maps.InfoWindow();

  marker.addListener('click', function() {
    infowindow.setContent(contentString);
    infowindow.setOptions({
      maxWidth: 400,
    });
    infowindow.open(map, marker);
  });
}

/* **************************************************************
     L I S T E N I N G     F O R     U S E R     I N P U T
*************************************************************** */

$('#submit').click(event => {
  event.preventDefault();

  let searchTerm = $('#location')[0].value;

  if (searchTerm.length === 0) {
    alert('You must enter a new location');
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

const GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

class Map {
  search(searchTerm) {
    var lookup = `${GEOCODE_URL}${searchTerm}&key=${GEOCODE_KEY}`;
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
      center: newPosition,
    };
    map = new google.maps.Map(document.getElementById('map'), mapSpecs);

    return { lat: latitude, lng: longitude };
  }
}

/* ===================================================================
                          I N S T A G R A M
===================================================================*/

function getUserAccessToken() {
  const url = window.location.href;

  // if access_token is in there, get everything that follows the = sign
  if (!url.includes('#access_token=')) return;

  const start = url.indexOf('=') + 1;
  const end = url.length;

  const userAccessToken = url.slice(start, end);

  console.log('userAccessToken: ', userAccessToken);

  return userAccessToken;
}

class InstaData {
  constructor() {
    this.TOKEN = getUserAccessToken();
  }

  getMyInfo() {
    const aboutMe = `https://api.instagram.com/v1/users/self/?access_token=${this.TOKEN}`;

    $.ajax({
      url: `${aboutMe}&callback=?`,
      type: 'GET',
      dataType: 'jsonp',

      error: () => {
        alert('error');
      },

      success: response => {
        const bio = response.data;

        return $('#instabio').html(
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
            </div>`,
        );
      },
    });
  }

  getRecentPics(currentLocation) {
    const recentPics = `https://api.instagram.com/v1/users/self/media/recent/?access_token=${this
      .TOKEN}`;

    $.ajax({
      url: `${recentPics}&callback=?`,
      type: 'GET',
      dataType: 'jsonp',

      error: () => {
        alert('error');
      },

      success: response => {
        const data = response;

        var numberOfPhotosAtThisLocation = 0;

        // clear child nodes (pictures) before generating to prevent duplications from recurring generations
        $('#instafeed').empty();

        data.data.forEach(photoObject => {
          let thumbnail = photoObject.images.thumbnail.url;
          let caption = photoObject.caption ? photoObject.caption.text : '';
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
              $('#instafeed').append(
                `<a target="_blank" href="${link}"><img class="fade" src="${thumbnail}"></a>`,
              );
            }
          }
          // NOTE: If the photo has no location, it disppears into the ether...
        });

        if (numberOfPhotosAtThisLocation > 0) {
          // since there are photos to display, show the owner's info as well
          this.getMyInfo();
        } else {
          alert('No photos at this location. Looks like a lovely area though.');
        }
      },
    });
  }
}

function isNearby(photoCoords, referenceCoords) {
  let testLat = photoCoords.lat;
  let testLng = photoCoords.lng;

  let maxLat = referenceCoords.lat + 0.08;
  let minLat = referenceCoords.lat - 0.08;
  let maxLng = referenceCoords.lng + 0.08;
  let minLng = referenceCoords.lng - 0.08;

  return testLat <= maxLat && testLat >= minLat && (testLng <= maxLng && testLng >= minLng);
}

function createMarker(position, title, description, link) {
  let marker = new google.maps.Marker({
    position: position,
    map: map,
    title: title,
    icon: 'assets/img/ic_camera_1x.png',
    animation: google.maps.Animation.DROP,
  });

  let contentString = `<h6>${title}</h6><p>${description}</p><a target="_blank" href="${link}">original</a>`;

  let infowindow = new google.maps.InfoWindow({
    content: contentString,
    maxWidth: 200,
  });

  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}
