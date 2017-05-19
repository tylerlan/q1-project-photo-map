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

  getRecentPics() {
    const recentPics = `https://api.instagram.com/v1/users/self/media/recent/?access_token=${this.TOKEN}`;

    var request = fetch(recentPics);

    request
      .then(response => response.json())
      .then(data => {
        var parsedPhotoObjectsArray = []; // Resets the array every time you call the method

        data.data.forEach((photoObject) => {
          // console.log(photoObject);
          var parsedPhotoObject = {
            thumbnail: photoObject.images.thumbnail.url,
            imgId: photoObject.id,
            caption: photoObject.caption.text,
            link: photoObject.link,
            tagsArray: photoObject.tags
          }

          if (photoObject.location) { // If the image is geocoded...
            let lat = photoObject.location.latitude;
            let lng = photoObject.location.longitude;
            parsedPhotoObject.lat = lat;
            parsedPhotoObject.lng = lng;
            parsedPhotoObject.coords = {
              lat: lat,
              lng: lng
            };
            parsedPhotoObject.locationName = photoObject.location.name;

          }
          parsedPhotoObjectsArray.push(parsedPhotoObject);

        })
        return parsedPhotoObjectsArray;

      })
      .then(objsArray => {
        objsArray.forEach((obj) => {

          createMarker(obj.coords, obj.locationName, obj.caption, obj.link);

          if(map.getBounds().contains(marker.getPosition())) {
            $('#instafeed').append(`
              <a target="_blank" href="${obj.link}"><img class="fade" src="${obj.thumbnail}"></a>
              `)
          }



        })
        })
      .catch(console.log)
  }
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
