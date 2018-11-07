function resetData() {
    // Clears the input boxes for a new search. 
    document.getElementsByClassName('selectedHotelTB')[0].value = "";
    document.getElementsByClassName('selectedPOItb')[0].value = "";
    document.getElementById('locationSearch').value = "";
    document.getElementById('poi').value = "lodging";
}

function showDisplayOne() {
    document.getElementsByClassName("poiShow-Container")[0].style.display = "inline-block";
    document.getElementsByClassName("mapResults-Container")[0].style.display = "inline-block";
    $('#IBID').removeClass('col-lg-12').addClass('col-lg-8');
    $('#MAP').removeClass('col-lg-12').addClass('col-lg-8');
}

function showDisplayTwo() {
    document.getElementsByClassName("interestSelected-Container")[0].style.display = "inline-block";
    document.getElementById("isContainer-sH").style.display = "inline-block";
}

function showDisplayThree() {
    document.getElementsByClassName("satNav-Container")[0].style.display = "inline-block";
}

function showDisplayFour() {
    document.getElementById("isContainer-sPOI").style.display = "inline-block";
}

/*function pageLoadUp() {
var poiShowContain = document.getElementsByClassName('poiShowContainer');
var mapResultsContain = document.getElementsByClassName('mapResultsContainer');

poiShowContain.style.visibility = 'hidden';
mapResultsContain.style.visibility = 'hidden';
}*/
