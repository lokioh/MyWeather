$(document).ready(function () {

    var map = L.map('mapDiv').setView([46.7111, 1.7191], 6);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

    var marker;


        map.on('click', function (e) {
            if (marker) {
                map.removeLayer(marker);
            }
            
            marker = new L.Marker(e.latlng).addTo(map);
            var lat = marker._latlng.lat;
            var lng = marker._latlng.lng;
            var county = getCounty(lat, lng)
            getWeatherByCounty(county);
        });



    function getCounty(lat, lng) {

        var addr = null;

        $.ajax({
            async: false,
            type: "GET",
            url: "https://nominatim.openstreetmap.org/reverse",
            timeout: 5000,
            data: "format=geojson&lat=" + lat + "&lon=" + lng,
            success: function (resultat) {
                addr = resultat["features"][0]["properties"]["address"]["county"];
                console.log(addr);
                alert(addr);
            },

            error: function(reponse, statut, erreur) {
                console.log(erreur);
            }
        });

        return addr;
    }


    function getWeatherByCounty(county) {

        var temp = null;

        $.ajax({
            async: false,
            type: "GET",
            timeout: 5000,
            url: "http://api.openweathermap.org/data/2.5/weather",
            data: "q=" + county + "&units=metric&appid=c050caf77cdabd9e85503f36538e43b9",
            dataType: "json",
            success: function (response) {
                temp = response["main"]["temp"];
                console.log(temp);
            },

            error: function(resultat, statut, erreur) {
                console.log(erreur);
                console.log("Zone non déservie !");
            }
        });

        return temp;
    }

});