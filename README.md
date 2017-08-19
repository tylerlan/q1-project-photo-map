# Galvanize WDI Q1 Project

This is a front-end application demonstrating skills gained in the first quarter of Web Development Immersive program at [Galvanize, San Francisco](http://www.galvanize.com/san-francisco/campus).

The code features ES6 syntax and jQuery, it makes extensive use of promises and OOP perform asynchronous actions in response to user behavior, it coordinates operations across three APIs to deliver a virtually seamless UI.

Deployed: https://mapstagram.surge.sh/

## Current Features
* Allows user search Google Maps, and view/ examine Instagram photos tagged with the searched location.
* Project currently only has access to the most recent photos of my personal account, but for Future Features, I hope to gain access to public data in order to curate a more impactful experience.

## Future Features
* Allows user to sign in and see their own photos.
* Access public data to allow users to view the most recent photos taken at a particular location, anywhere in the world.

## Components
* Languages Used:
    * HTML5
    * CSS
    * JavaScript (ES6)
* APIs Used:
    * [Google Maps](https://developers.google.com/maps/documentation/geocoding/start)
    * [Google Maps JS](https://developers.google.com/maps/documentation/javascript/)
    * [Instagram](https://www.instagram.com/developer/) (OAuth 2.0)
* Other Tools:
    * [Materialize](http://materializecss.com/) front-end framework
    * [jQuery](https://code.jquery.com/) JavaScript library

## Mission
* My inspiration for this app came from a past feature of the Instagram mobile app which allowed users to see their photos on an interactive map based on geotags. I wanted to recreate this feature for myself, to see my recent photos mapped as a means of visual storytelling, and potentially open it up as a social tool to examine patterns of data and share maps with friends.
* I am also interested in highlighting the pervasiveness of geocoding, creating space for questions about the risks and benefits of having so much of our digital lives tracked spatially.
* The linear timeline in an inherently limited medium for self-expression and reflection. Leveraging spatial relationships to understand the complexities of identity and interconnection provide a far more nuanced perspective.

## Getting Started
1. Fork and Clone this repo.
2. Register for [Google Maps API Keys](https://console.developers.google.com/apis/) (You will need one each for the *Geocode*, and *Google Maps JS* APIs).
3. Create an **api-keys.js** file. The file should look like this:
    ```js
    const GEOCODE_KEY = 'bcowbrouwcblew'
    const GOOGLE_MAPS_JS_KEY = 'cblqbwqlwbcejl'
    ```
4. Run `npm start` to get started with localhost in the browser.
5. Explore your visual story in a spatial context!
