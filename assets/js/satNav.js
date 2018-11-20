//Creates a function to set the route by driving method.
function planRoute() {
    //  clear();
    clearMarkers();
    clearResults();
    removeResultTable();
    
    var start = document.getElementsByClassName('selectedHotelTB')[0].value;
    var end = document.getElementsByClassName('selectedPOItb')[0].value;
    var dirDisplay = new google.maps.DirectionsRenderer({ map: map });
    var dirService = new google.maps.DirectionsService();
    
    
    
    var request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING',
    };
    
    if(dirDisplay != null) {
    dirDisplay.setMap(null);
    dirDisplay = null;
    
    }
    console.log(request);
    dirService.route(request, function(result, status) {
        if (status == 'OK') {
            dirDisplay.setDirections(result);
            console.log(dirDisplay);
        }
    });

}
