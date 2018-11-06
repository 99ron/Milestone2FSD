var map, places, infoWindow, poiInfoWindow //;
var search = {};
var markers = [];
var autocomplete;

var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
var MARK_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
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
    content: document.getElementById('info-content')
  });

  poiInfoWindow = new google.maps.InfoWindow({
    content: document.getElementById('poi-info-content')
  });

  // Clears the input boxes for a new search. 
  document.getElementsByClassName('selectedHotelTB')[0].value = "";
  document.getElementsByClassName('selectedPOItb')[0].value = "";
  document.getElementById('locationSearch').value = "";

  // Create the autocomplete object and associate it with the UI input control.
  autocomplete = new google.maps.places.Autocomplete(
    (
      document.getElementById('locationSearch')), {
      types: ['(cities)']
    });
  places = new google.maps.places.PlacesService(map);
  autocomplete.addListener('place_changed', onPlaceChanged);
}

// When the user types a location in, it then zooms the map in on the location specified.
function onPlaceChanged() {
  var place = autocomplete.getPlace();
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(12);
    // Sets the 2 Class's from display =none to inline block.
    document.getElementsByClassName("poiShowContainer")[0].style.display = "inline-block";
    document.getElementsByClassName("mapResultsContainer")[0].style.display = "inline-block";
    // Changes the class to fit in the results next to search bar and map. 
    $('#IBID').removeClass('col-lg-12').addClass('col-lg-8');
    $('#MAP').removeClass('col-lg-12').addClass('col-lg-8');
    searchLodging();
  }
  else {
    document.getElementById('autocomplete').placeholder = 'Enter a city';
  }
}

// Search for hotels within the viewport of the map.
function searchLodging() {
  search = {
    bounds: map.getBounds(),
    types: ['lodging']
  };
  searchNearby();
}
// Search for POI's from the dropdown within the viewpoint of the map.
function searchPOI() {
  search = {
    bounds: map.getBounds(),
    types: [document.getElementById("poi").value]
  };
  searchNearby();
}

function searchNearby() {
  places.nearbySearch(search, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      clearResults();
      clearMarkers();
      // Create a marker for each hotel/POI found, and
      // assign a letter of the alphabetic to each marker icon.
      for (var i = 0; i < results.length; i++) {
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
        var markerIcon = MARKER_PATH + markerLetter + '.png';
        // Use marker animation to drop the icons incrementally on the map.
        markers[i] = new google.maps.Marker({
          position: results[i].geometry.location,
          animation: google.maps.Animation.DROP,
          icon: markerIcon
        });
        // If the user clicks a hotel marker, show the details of that hotel
        // in an info window.
        markers[i].placeResult = results[i];
        google.maps.event.addListener(markers[i], 'click', showInfoWindow);
        setTimeout(dropMarker(i), i * 100);
        addResult(results[i], i);
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

// Adds the results into a table which is associated by the ID 'results'.
function addResult(result, i) {
  var results = document.getElementById('results');
  var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
  var markerIcon = MARKER_PATH + markerLetter + '.png';

  var tr = document.createElement('tr');
  tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
  tr.onclick = function() {
    google.maps.event.trigger(markers[i], 'click');
  };

  var iconTd = document.createElement('td');
  var nameTd = document.createElement('td');
  var icon = document.createElement('img');
  icon.src = markerIcon;
  icon.setAttribute('class', 'placeIcon');
  icon.setAttribute('className', 'placeIcon');
  var name = document.createTextNode(result.name);
  iconTd.appendChild(icon);
  nameTd.appendChild(name);
  tr.appendChild(iconTd);
  tr.appendChild(nameTd);
  results.appendChild(tr);
}

// Empties the table out.
function clearResults() {
  var results = document.getElementById('results');
  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
}

// Get the place details for a hotel. Show the information in an info window,
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
      if (document.getElementById("poi").value === 'lodging')
        document.getElementsByClassName('selectedHotelTB')[0].value =
        place.name;

      else {
        document.getElementsByClassName('selectedPOItb')[0].value =
          place.name;
      }
    });
}


// Load the place information into the HTML elements used by the info window.
function buildIWContent(place) {
  document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
    'src="' + place.icon + '"/>';
  document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
    '">' + place.name + '</a></b>';
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
    document.getElementById('iw-website').textContent = website;
  }
  else {
    document.getElementById('iw-website-row').style.display = 'none';
  }


  //-----------------------------------------------------------------------------

function planRoute() {
  var dirDisplay = new google.maps.DirectionsRenderer();
  var dirService = new google.maps.DirectionsService();
  var start = document.getElementById('selectedHotelTB').value;
  var end = document.getElementById('selectedPOItb').value;
  var request = {
    origin: start,
    destination: end,
    travelMode: 'WALKING'
  };
  dirService.route(request, function(result, status) {
    if (status == 'OK') {
      dirDisplay.setDirections(result);
    }
  });
}


}