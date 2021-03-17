$(document).ready(function () {

    var map = L.map('mapDiv').setView([46.7111, 1.7191], 6);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

    var marker;
    var popup = L.popup();

    map.on('click', function (e) {
        if (marker) {
            map.removeLayer(marker);
        }

        marker = new L.Marker(e.latlng).addTo(map);
        var lat = marker._latlng.lat;
        var lng = marker._latlng.lng;

        var loc = getAddr(lat, lng)

        if (!loc) {
            console.log('ERREUR : Mauvais choix.');
            marker.bindPopup("<b>ERREUR</b><br>Vous avez choisi un mauvais endroit !").openPopup();
        } else {
            if (!getTempZip(loc)) {
                if (loc["state"] == null) {
                    getTempCountry(loc);
                    console.log("ERREUR : State n'est pas défini.")
                } else {
                    if (!getTemp(loc)) {
                        getTempCountry(loc);
                    }
                }
            }
        }


    });



    function getAddr(lat, lng) {

        var addr = null;

        $.ajax({
            async: false,
            type: "GET",
            url: "https://nominatim.openstreetmap.org/reverse",
            timeout: 5000,
            data: "format=geojson&lat=" + lat + "&lon=" + lng,
            success: function (resultat) {
                addr = resultat["features"][0]["properties"]["address"];
                console.log("RESULTAT : Requête AJAX réussie (Nominatim).");
                console.log(addr);
            },

            error: function (reponse, statut, erreur) {
                console.log(erreur);

            }
        });

        return addr;
    }


    function getTemp(loc) {

        var temp = null;
        var state = loc["state"];
        var countryCode = loc["country_code"];

        $.ajax({
            async: false,
            type: "GET",
            timeout: 5000,
            url: "http://api.openweathermap.org/data/2.5/weather",
            data: "q=" + state + ", " + countryCode + "&units=metric&appid=c050caf77cdabd9e85503f36538e43b9",
            dataType: "json",
            success: function (response) {
                console.log("RESULTAT : Requête AJAX réussie (OpenWeatherMap/getTemp).");
                temp = response["main"]["temp"];
                marker.bindPopup("<b>MyWeather</b><br>" + loc["country"] + ", " + state + " : " + temp + "°C").openPopup();

            },

            error: function (resultat, statut, erreur) {
                console.log(erreur);
            }
        });

        return temp;
    }

    function getTempZip(loc) {

        var temp = null;
        var postcode = loc["postcode"];
        var countryCode = loc["country_code"];

        $.ajax({
            async: false,
            type: "GET",
            timeout: 5000,
            url: "http://api.openweathermap.org/data/2.5/weather",
            data: "zip=" + postcode + "," + countryCode + "&units=metric&appid=c050caf77cdabd9e85503f36538e43b9",
            dataType: "json",
            success: function (response) {
                console.log("RESULTAT : Requête AJAX réussie (OpenWeatherMap/getTempZip).");
                temp = response["main"]["temp"];
                marker.bindPopup("<b>MyWeather</b><br>" + loc["country"] + ", " + loc["county"] + " : " + temp + "°C").openPopup();
            },

            error: function (resultat, statut, erreur) {
                console.log(erreur);
            }
        });

        return temp;
    }

    function getTempCountry(loc) {

        var temp = null;
        var country = loc["country"];

        $.ajax({
            async: false,
            type: "GET",
            timeout: 5000,
            url: "http://api.openweathermap.org/data/2.5/weather",
            data: "q=" + country + "&units=metric&appid=c050caf77cdabd9e85503f36538e43b9",
            dataType: "json",
            success: function (response) {
                console.log("RESULTAT : Requête AJAX réussie (OpenWeatherMap/getCountry).");
                temp = response["main"]["temp"];
                marker.bindPopup("<b>MyWeather</b><br>" + loc["country"] + " : " + temp + "°C").openPopup();
            },

            error: function (resultat, statut, erreur) {
                console.log(erreur);
                marker.bindPopup("<b>ERREUR</b><br>La zone choisie n'est pas déservie par MyWeather !").openPopup();
                console.log("ERREUR : Zone non déservie.");
            }
        });

        return temp;
    }

});