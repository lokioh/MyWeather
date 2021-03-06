$(document).ready(function () {

    var map = L.map('mapDiv').setView([46.7111, 1.7191], 6);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

    var marker;

    map.on('click', function (e) {
        if (marker) {
            map.removeLayer(marker);
        }
        marker = new L.Marker(e.latlng).addTo(map);


        alert(marker._latlng);
    });
    

});