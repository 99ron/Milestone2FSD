//Creates a function to set the route by walking method.
function planRoute() {
    var dirDisplay = new google.maps.DirectionsRenderer({ map: map });
    var dirService = new google.maps.DirectionsService();
    var start = document.getElementsByClassName('selectedHotelTB')[0].value;
    var end = document.getElementsByClassName('selectedPOItb')[0].value;
    clearMarkers();
    clearResults();
    var request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    };
    dirService.route(request, function(result, status) {
        if (status == 'OK') {
            dirDisplay.setDirections(result);
            console.log(result);
        }
    });
}

function clearRoute() {
    
}