const Geocoding = require('../services/Geocoding');
const ImageService = require('../services/ImageService');
const MapService = require('../services/MapService');

module.exports = class IndexPage {
  constructor (main) {
    this.main = main;

    this.geocoding = new Geocoding();
    this.imageService = new ImageService();

    // Event handlers must be explicitly bound to this
    this.processSearch = this.processSearch.bind(this);
  }

  processSearch(event) {
    event.preventDefault();

    const form = event.target;
    let searchTerm = form.search.value ? form.search.value.trim() : '';

    if (searchTerm === '') return;

    // The search term goes through geocoding
    this.geocoding.search(searchTerm).then(locationInfo => {
      // cache resulting locationInfo as page state (i.e., as an instance variables on the page object)
      this.currentLocation = []; // a string
      this.currentLocationCoordinates = []; // a couple strings for lat. and long.

      // The geocoded search term goes into imageService
      this.imageService();
    });
    // Updating the page with the images returned from imageService
    this.updateImagesPage();

  }

  updateImagesPage () {
    $(this.main).find('#images').empty().html(renderImages({ images }));

  }




}
