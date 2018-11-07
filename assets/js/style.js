function showDisplayNone() {
    document.getElementsByClassName("poiShowContainer")[0].style.display = "inline-block";
    document.getElementsByClassName("mapResultsContainer")[0].style.display = "inline-block";
    
    $('#IBID').removeClass('col-lg-12').addClass('col-lg-8');
    $('#MAP').removeClass('col-lg-12').addClass('col-lg-8');
}


/*function pageLoadUp() {
var poiShowContain = document.getElementsByClassName('poiShowContainer');
var mapResultsContain = document.getElementsByClassName('mapResultsContainer');

poiShowContain.style.visibility = 'hidden';
mapResultsContain.style.visibility = 'hidden';
}*/
