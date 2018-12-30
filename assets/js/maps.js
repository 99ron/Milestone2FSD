var map, places, infoWindow, dirService, dirDisplay, startID, finishID;
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
    content: document.getElementById('info-content')
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

// When the user types a location in, it then zooms the map on the location specified.
function onPlaceChanged() {
  var place = autocomplete.getPlace();
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(12);
    // Sets the class's from display =none to =inline block.
    // Changes the class to fit on the page. 
    showMAP();
    showDisplayOne();
    searchLodging();
  }
  else {
    document.getElementById('autocomplete').placeholder = 'Enter a city';
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
} else {
  alert('Please type a location!');
  } 
}


// Search for POI's from the dropdown within the viewpoint of the map.
function searchPOI() {
  search = {
    bounds: map.getBounds(),
    types: [document.getElementById('poi').value]
  };
  //clearNavMarkers();
  searchNearby();
}

//Searches with the types as selected above.
function searchNearby() {
  places.nearbySearch(search, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
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
          startID = place.formatted_address;
          // Displays the text boxes for selected locations.
          showDisplayTwo();
          
      }
      else {
        document.getElementsByClassName('selectedPOItb')[0].value =
          place.name,
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
}



//-------------***** print results to table in html *****-------------

function addResult(result, i) {
  places.getDetails({ placeId: result.place_id },
    function(place, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
      }

      var results = document.getElementById('mapResultsFull');
      var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
      var markerIcon = MARKER_PATH + markerLetter + '.png';
      var tr = document.createElement('resultsContainer');
      //tr.style.backgroundColor = (i % 2 === 0 ? '#4d98df' : '#4c4c4c');
      tr.onclick = function() {
        google.maps.event.trigger(markers[i], 'click');
        map.panTo(place.geometry.location);
        map.setZoom(12);
      };

      console.log(place);

      var name = document.createTextNode(place.name);
      var address = document.createTextNode(place.formatted_address);
      var phoneNumber = document.createTextNode(place.formatted_phone_number);
      //var nameHeader = document.createTextNode("Name: ");
      var addressHeader = document.createTextNode("Address: ");
      var phoneNumberHeader = document.createTextNode("Phone Number: ");
      var photo = place.photos[0].getUrl({ 'maxWidth': 250, 'maxHeight': 250 });
      
      
      var iconTd = document.createElement('td');
      var nameTd = document.createElement('td');
      var addressTd = document.createElement('td');
      var phoneTd = document.createElement('td');
      var icon = document.createElement('img');
      icon.src = photo;

      icon.setAttribute('class', 'img');
      icon.setAttribute('className', 'img');
      iconTd.setAttribute('class', 'td-img');
      nameTd.setAttribute('class', 'td-name');
      addressTd.setAttribute('class', 'td-address');
      phoneTd.setAttribute('class', 'td-phone');
      tr.setAttribute('class', 'resultscontainer');

      iconTd.appendChild(icon);
      //nameTd.appendChild(nameHeader);
      nameTd.appendChild(name);
      addressTd.appendChild(addressHeader);
      addressTd.appendChild(address);
      phoneTd.appendChild(phoneNumberHeader);
      phoneTd.appendChild(phoneNumber);
      tr.appendChild(iconTd);
      tr.appendChild(nameTd);
      tr.appendChild(addressTd);
      tr.appendChild(phoneTd);
      results.appendChild(tr);
    });
}

// Empties the table out.
function clearResults() {
  var results = document.getElementById('mapResultsFull');
  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
}

//****************SatNav Element******************//

//Creates a function to set the route by driving method.
function setRoute() {
    clearMarkers();
    clearResults();
    //removeResultTable();
    dirService = new google.maps.DirectionsService();
    dirDisplay = new google.maps.DirectionsRenderer({ map });
    dirDisplay.setPanel(document.getElementById('mapResultsFull'));
  
    var start = startID;
    var end = finishID;

    var request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING',
    };

    //console.log(request);

    dirService.route(request, function(result, status) {
        if (status == 'OK') {
            dirDisplay.setDirections(result);
        } else {
            window.alert('Directions request failed due to ' + status + '\n Try searching for another location!');
            searchPOI();
          }
    });
}

// Clears the navPoints
function clearNavMarkers() {
    dirDisplay.setMap(null);
    dirDisplay.setPanel(null);
    //resetData();
}
