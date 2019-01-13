var map, places, infoWindow, dirService, dirDisplay, startID, finishID, place, google;
var search = {};
var markers = [];
var autocomplete;
var MARKER_PATH = 'http://www.google.com/mapfiles/kml/paddle/';
var hostnameRegexp = new RegExp('^https?://.+?/');


// Creates the map and associates it to the ID 'map'.
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: { lat: 48.446913, lng: -3.3781 },
    mapTypeControl: false,
    panControl: false,
    zoomControl: true,
    streetViewControl: false
  });

  infoWindow = new google.maps.InfoWindow({
    content: document.getElementById('infoMapWindow')
  });
  // Resets textboxes and drop down list.
  resetData();
  // Create the autocomplete object and associate it with the UI input control.
  autocomplete = new google.maps.places.Autocomplete(
    (
      document.getElementById('locationSearch')), {
      types: ['(cities)']
    });
  places = new google.maps.places.PlacesService(map);
  autocomplete.addListener('place_changed', onPlaceChanged);
}

// When the user types a location, it then zooms the map on the location found.
function onPlaceChanged() {
  var place = autocomplete.getPlace();
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(12);
    // Sets the class's from display =none to =inline block.
    showMAP();
    showDisplayOne();
    searchLodging();
  }
  else {
    document.getElementById('locationSearch').placeholder = 'Enter a city';
  }
}

// Search for hotels within the viewport of the map only if a location is in the
// search box.
function searchLodging() {
  if (document.getElementById('locationSearch').value !== "") {
    search = {
      bounds: map.getBounds(),
      types: ['lodging']
    };
    searchNearby();
  }
  else {
    alert('Please type a location!');
  }
}

// Search for POI's from the dropdown within the viewpoint of the map.
function searchPOI() {
  search = {
    bounds: map.getBounds(),
    types: [document.getElementById('poi').value]
  };
  searchNearby();
}

//Searches with the types as selected above if both status is OK and results comes back with at least
// one item, if not displays a message to the user.
function searchNearby() {
  places.nearbySearch(search, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK && results !== null) {
      clearResults();
      clearMarkers();

      // Create a marker for each hotel/POI found, and
      // assign a letter of the alphabet to each marker icon.
      for (var i = 0; i < results.length; i++) {
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
        var markerIcon = MARKER_PATH + markerLetter + '.png';

        // Use marker animation to drop the icons incrementally on the map.
        markers[i] = new google.maps.Marker({
          position: results[i].geometry.location,
          animation: google.maps.Animation.DROP,
          icon: markerIcon
        });

        // If the user clicks a marker, this show the details of that location
        // in an info window.
        markers[i].placeResult = results[i];
        google.maps.event.addListener(markers[i], 'click', showInfoWindow);
        setTimeout(dropMarker(i), i * 100);
        getLocationInfo(results[i], i, markerIcon);
      }
    }
    else {
      alert('No places found for this type in this location, please try another!');
    }
  });
}


// This gets the results from the SearchPOI() and requests for more info, if it gets OVER QUERY LIMIT status
// then it'll wait 800ms until it tries to get more details again so all 20 results are displayed. 
function getLocationInfo(results, i, markerIcon) {
  places.getDetails({ placeId: results.place_id },
    function(place, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        addResult(results, i, place, markerIcon);
      }
      else {
        if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
          setTimeout(function() { getLocationInfo(results, i, markerIcon) }, 800);
        }
      }
    });
}

// Clears the markers from the map.
function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }
  markers = [];
}

// Drops markers onto the map from the search done in searchNearby().
function dropMarker(i) {
  return function() {
    markers[i].setMap(map);
  };
}

// Get the place details for the location. Show the information in an info window,
// anchored on the marker for the hotel that the user selected.
function showInfoWindow() {
  var marker = this;
  places.getDetails({ placeId: marker.placeResult.place_id },
    function(place, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
      }
      infoWindow.open(map, marker);
      buildIWContent(place);

      // Checks what the dropdown list is currently selected on and fills either
      // text boxes with the location's name.
      if (document.getElementById('poi').value === 'lodging') {
        document.getElementsByClassName('selectedHotelTB')[0].value =
          place.name,
          // Stores address for Navigation.
          startID = place.formatted_address;
        // Displays the text boxes for selected locations.
        showDisplayTwo();

      }
      else {
        document.getElementsByClassName('selectedPOItb')[0].value =
          place.name,
          // Stores address for Navigation.
          finishID = place.formatted_address;
        // Displays the POI textbox.
        showDisplayFour();
      }
      // if textbox ISN'T empty then display satnav btn.
      if (document.getElementsByClassName('selectedPOItb')[0].value !== "") {
        showDisplayThree();
      }
      else {
        return;
      }
    });
}

// Load the place information into the HTML elements used by the info window.
function buildIWContent(place) {
  document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
    'src="' + place.icon + '"/>';
  document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
    '" target="_blank">' + place.name + '</a></b>';
  document.getElementById('iw-address').textContent = place.vicinity;

  if (place.formatted_phone_number) {
    document.getElementById('iw-phone-row').style.display = '';
    document.getElementById('iw-phone').textContent =
      place.formatted_phone_number;
  }
  else {
    document.getElementById('iw-phone-row').style.display = 'none';
  }

  // Assign a five-star rating to the hotel/POI, using a black star ('&#10029;')
  // to indicate the rating the hotel has earned, and a white star ('&#10025;')
  // for the rating points not achieved.
  if (place.rating) {
    var ratingHtml = '';
    for (var i = 0; i < 5; i++) {
      if (place.rating < (i + 0.5)) {
        ratingHtml += '&#10025;';
      }
      else {
        ratingHtml += '&#10029;';
      }
      document.getElementById('iw-rating-row').style.display = '';
      document.getElementById('iw-rating').innerHTML = ratingHtml;
    }
  }
  else {
    document.getElementById('iw-rating-row').style.display = 'none';
  }

  // The regexp isolates the first part of the URL (domain plus subdomain)
  // to give a short URL for displaying in the info window.
  if (place.website) {
    var fullUrl = place.website;
    var website = hostnameRegexp.exec(place.website);
    if (website === null) {
      website = 'http://' + place.website + '/';
      fullUrl = website;
    }
    document.getElementById('iw-website-row').style.display = '';
    document.getElementById('iw-website').innerHTML = '<a href="' + website +
      '" target="_blank">' + website + '</a>';
  }
  else {
    document.getElementById('iw-website-row').style.display = 'none';
  }
}

//-------------***** print results to the table *****-------------

// Once the function to request more info on found locations has been processed,
// it gets put through to here to get be displayed.
function addResult(results, i, place, markerIcon) {
  var result = document.getElementById('mapResultsFull');
  var tr = document.createElement('resultsContainer');

  tr.onclick = function() {
    google.maps.event.trigger(markers[i], 'click');
    map.panTo(place.geometry.location);
    map.setZoom(13);
  };
  var name = document.createTextNode(place.name);
  var address;
  var photo;
  var phoneNumber;
  var addressHeader = document.createTextNode("Address: ");
  var phoneNumberHeader = document.createTextNode("Phone Number: ");

  // Checks if location has the photo array. If not then uses the markerIcon.
  if (!place.photos) {
    photo = markerIcon;
  }
  else {
    photo = place.photos[0].getUrl({ 'maxWidth': 250, 'maxHeight': 250 });
  }
  // Checks if location has formatted address, if not then gets the road name.
  if (!place.formatted_address) {
    address = document.createTextNode(place.vicinity);
  }
  else {
    address = document.createTextNode(place.formatted_address);
  }
  // Checks if location has a phone number and if not then to display text.
  if (!place.formatted_phone_number) {
    phoneNumber = document.createTextNode("Not Available.");
  }
  else {
    phoneNumber = document.createTextNode(place.formatted_phone_number);
  }

  // From this point it sets each information gathered to it's own "cell", 
  // apart from the icon which creates an image element.
  var iconTd = document.createElement('td');
  var nameTd = document.createElement('td');
  var addressTd = document.createElement('td');
  var phoneTd = document.createElement('td');
  var icon = document.createElement('img');
  icon.src = photo;

  // From here we assign the created elements above with an appropriate 
  // attribute names so we can associate styles to them.
  icon.setAttribute('class', 'img');
  icon.setAttribute('className', 'img');
  iconTd.setAttribute('class', 'td-img');
  nameTd.setAttribute('class', 'td-name');
  addressTd.setAttribute('class', 'td-address');
  phoneTd.setAttribute('class', 'td-phone');
  tr.setAttribute('class', 'resultscontainer');

  // Here combines the gathered details into their allocated cells and pushed
  // into a table.
  iconTd.appendChild(icon);
  nameTd.appendChild(name);
  addressTd.appendChild(addressHeader);
  addressTd.appendChild(address);
  phoneTd.appendChild(phoneNumberHeader);
  phoneTd.appendChild(phoneNumber);
  tr.appendChild(iconTd);
  tr.appendChild(nameTd);
  tr.appendChild(addressTd);
  tr.appendChild(phoneTd);
  result.appendChild(tr);
}

// Resets both result and nav tables to null.
function clearResults() {
  var mapResults = document.getElementById('mapResultsFull');
  var navResults = document.getElementById('navResults');
  while (mapResults.childNodes[0]) {
    mapResults.removeChild(mapResults.childNodes[0]);
  }
  while (navResults.childNodes[0]) {
    navResults.remove(navResults.childNodes[0]);
  }
}

//****************Navigation Element******************//

//Creates a function to set the route by driving method.
function setRoute() {
  clearMarkers();
  clearResults();
  showNavResults();
  dirService = new google.maps.DirectionsService();
  dirDisplay = new google.maps.DirectionsRenderer({ map });
  dirDisplay.setPanel(document.getElementById('navResults'));
  
  // Uses the formatted address from the previous chosen locations by the user 
  // so it can be referenced for the navigation API.
  var start = startID;
  var end = finishID;
  
  // Does a quick check to see if an address is in both variables and if not
  // simply displays a message to the user to select a location.
  if (startID == null || finishID == null) {
    alert('Please select locations to travel to and from.');
    searchPOI();
  } else {
  var request = {
    origin: start,
    destination: end,
    travelMode: 'DRIVING',
  };
  dirService.route(request, function(result, status) {
    if (status == 'OK') {
      dirDisplay.setDirections(result);
    }
    else {
      window.alert('Directions request failed due to ' + status + '\n Try searching for another location!');
      resetSearch();
      searchPOI();
    }
  });
  }
}

// Clears the navPoints and removes some of the elements.
function clearNavMarkers() {
  dirDisplay.setMap(null);
  dirDisplay.setPanel(null);
  finishID= null;
  resetSearch();
  searchNearby();
  map.setZoom(12);
}
