// Instagram requires that we use jsonp, but normal fetch cannot understand jsonp
// Therefore, we installed this fetch-jsonp [https://www.npmjs.com/package/fetch-jsonp]

/*

const fetchJsonp = require('fetch-jsonp');

*/

/*==========
HELP ME, JOSH, I CAN'T SEEM TO:
- USE FETCH() WITHOUT CORS EXTENSION
OR
- USE FETCHJSONP
==========*/

/* =============================================================== */


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

// var TOKEN = '256450119.4f9ed3b.85b25e00bb864c6aa837a5896060080f';
// var num_photos = 20;

/* GET MY INFO */
// $.ajax({
//   type: "GET",
//   dataType: "jsonp",
//   url: 'https://api.instagram.com/v1/users/self',
//   data: {access_token: TOKEN},
//
//   success: function(data) {
//     $('.name').text(data.data.username);
//     $('.tagline').text(data.data.bio);
//   }
//   error: function(data) {
//     // console.log(data);
//   }
//
// });




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
        // console.log(bio.bio);
        // console.log(bio.full_name);
        // console.log(bio.profile_picture);

        $('#instabio').append(
          `<div class="card horizontal">
              <div class="card-image">
                <img src="${bio.profile_picture}">
              </div>
              <div class="card-stacked">
                <div class="card-content">
                  <h4>${bio.full_name}</h4>
                  <p>${bio.bio}</p>
                </div>
                <div class="card-action">
                  <a href="#">This is a link</a>
                </div>
              </div>
            </div>`
      );

      })
  }

  getRecentPics() {
    const recentPics = `https://api.instagram.com/v1/users/self/media/recent/?access_token=${this.TOKEN}`;

    // var request = fetchJsonp(recentPics);
    var request = fetch(recentPics);

    request
    .then(response => response.json())
    .then(data => {
      for (let x in data.data) {
        // console.log(data.data[0]);
        let thumbnailURL = data.data[x].images.thumbnail.url;
        // console.log(thumbnailURL);
        if (data.data[x].location) {
          let lat = data.data[x].location.latitude;
          let lng = data.data[x].location.longitude;
          let coordinates = { lat: lat, lng: lng};
          let caption = data.data[x].caption.text;
          let imgId = data.data[x].id;
          // if (lat && lng) { console.log('LOCATION DATA:', lat, lng) };
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
                  title: title
                  });

    let contentString = `<p>${description}</p>`;

    let infowindow = new google.maps.InfoWindow({
                      content: description
                      });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });

}

// /* GET MY RECENT PICTURES */
// $.ajax({
//   url: 'https://api.instagram.com/v1/users/self/media/recent',
//   dataType: 'jsonp',
//   type: 'GET',
//   data: {
//     access_token: TOKEN,
//     count: num_photos
//   },
  // success: function(data) {
  //   // console.log(data);
  //   for (x in data.data) {
  //     console.log(data.data[x].images);
  //     let lat = data.data[x].location.latitude;
  //     let lng = data.data[x].location.longitude;
  //     if (lat && lng) { console.log('LOCATION DATA:', lat, lng) };
  //
      // console.log(data.data[x].location);
//
//     $('#instafeed').append(
//       '<div class="col s12 m8 l3"><img src="' + data.data[x].images.thumbnail.url + '"></div>');
//   }
// },
//   error: function(data) {
//     // console.log(data);
//   }
// });

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

// let testSearch = new Map;
// testSearch.search('44 Tehama St, San Francisco, CA')









//
