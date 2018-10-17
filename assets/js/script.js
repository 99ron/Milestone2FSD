/* Initilises the map */
function initMap() {
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 3,
        center: {
            lat: 46.619261,
            lng: -33.134766
        }
    });
   
    // Create the search box
    var input = document.getElementById('locationSearch');
    var searchBox = new google.maps.places.SearchBox(input);


   
    // SearchBox results near viewpoint.
    map.addListener('bounds_changed', function(){
       searchBox.setBounds(map.getBounds());
    });
    
    var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }
          
          // Clear out old markers.
          markers.forEach(function(marker) {
              marker.setMap(null);
          });
          markers = [];
          
          // Icon, name and location for each place.
          var bounds = new google.maps.LatLngBounds();
          places, forEach(function(place) {
              if (!place.geometry) {
                  console.log("No geometry for this place");
                  return;
              }
              var icon = {
                  url: place.icon,
                  size: new google.maps.Size(71,71),
                  origin: new google.maps.Point(0,0),
                  anchor: new google.maps.Point(17,34),
                  scaledSize: new google.maps.Size(25,25)
              };
              
              // Create a marker for each place.
              markers.push(new google.maps.Marker({
                  map: map,
                  icon: icon,
                  title: place.name,
                  position: place.geometry.location
              }));
              
              if (place.geometry.viewport) {
                  
                  bounds.union(place.geometry.viewport);
              } else {
                  bounds.extend(place.geometry.location);
              }
            });
            map.fitBounds(bounds);  
          });


}
