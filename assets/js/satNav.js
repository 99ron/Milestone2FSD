//Creates a function to set the route by driving method.
function planRoute(dirDisplay) {
    //  clear();
    clearMarkers();
    clearResults();
    removeResultTable();
    
    var dirDisplay = new google.maps.DirectionsRenderer({ map });
    var dirService = new google.maps.DirectionsService();
    dirDisplay.set('directions', null);
    var start = document.getElementsByClassName('selectedHotelTB')[0].value;
    var end = document.getElementsByClassName('selectedPOItb')[0].value;
   
    var request = {
        origin: start,
        destination: end,
        travelMode: 'WALKING',
    };
   
    console.log(request);
    
    dirService.route(request, function(result, status) {
        if (status == 'OK') {
            dirDisplay.setDirections(result);
            console.log(dirDisplay);
        }
    });

}


