$(document).ready(function () {

    var myWeatherMap = L.map("mapDiv").setView([46.7111, 1.7191], 6);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        minZoom: 4,
    }).addTo(myWeatherMap);

    var marker;

    // Méthode avec event click pour la carte
    myWeatherMap.on('click', function (e) {
        if (marker) {
            myWeatherMap.removeLayer(marker);
        }

        marker = new L.Marker(e.latlng).addTo(myWeatherMap);
        var lat = marker._latlng.lat;
        var lng = marker._latlng.lng;

        var loc = getAddr(lat, lng)

        if (!loc) {
            // si l'utilisateur choisi un endroit sur la carte qui ne renvoie pas de data en JSON par Nominatim on renvoie une erreure
            console.log('ERREUR : Mauvais choix.');
            marker.bindPopup("<b>ERREUR</b><br>Vous avez choisi un mauvais endroit !").openPopup();
        } else {
            if (!getTempZip(loc)) {
                //change de fonction si l'endroit choisit ne renvoie pas les bons paramètres en JSON
                if (loc["state"] == null) {
                    //change de fonction dans le cas si state est vide pour éviter que OpenWeatherMap renvoie la température d'un endroit avec un state vide
                    getTempCountry(loc);
                    console.log("ERREUR : State n'est pas défini.")
                } else {
                    if (!getTemp(loc)) {
                        //change de fonction si l'endroit choisit ne renvoie pas les bons paramètres en JSON
                        getTempCountry(loc);
                    }
                }
            }
        }


    });


    // Méthode avec event click pour les routes
    $("#routingButton").click(function () {

        L.Routing.control({
            serviceURL: 'http://my-osrm/route/v1',
            waypoints: [
                L.latLng(48.866667, 2.333333),
                L.latLng(51.509865, -0.118092)
            ]
        }).addTo(myWeatherMap);

        $("#routingButton").html('<span><a>Je vais rester chez moi au final...</a></span>');

        $("#routingButton").click(function () {
            location.reload();
        })
    });



    //fonction qui récupère l'adresse en JSON par rapport l'endroit cliqué sur la carte grâce à l'API Nominatim
    function getAddr(lat, lng) {

        var addr = null;

        $.ajax({
            async: false,
            type: "GET",
            url: "https://nominatim.openstreetmap.org/reverse",
            timeout: 5000,
            data: "zoom=10&lang=fr&format=geojson&lat=" + lat + "&lon=" + lng,
            success: function (resultat) {
                addr = resultat["features"][0]["properties"]["address"];
                console.log("RESULTAT : Requête AJAX réussie (Nominatim/getAddr).");
                console.log(resultat);
            },

            error: function (reponse, statut, erreur) {
                console.log(erreur);
            }
        });

        return addr;
    }

    //fonction qui récupére la température via l'API OpenWeatherMap grâce aux paramètres : state & countryCode
    function getTemp(loc) {

        var temp = null;
        var state = loc["city"];
        if (state == null) {
            state = loc["county"];
            if (state == null) {
                state = loc["state"];
            }
        }
        var countryCode = loc["country_code"];

        $.ajax({
            async: false,
            type: "GET",
            timeout: 5000,
            url: "http://api.openweathermap.org/data/2.5/weather",
            data: "q=" + state + ", " + countryCode + "&units=metric&lang=fr&appid=c050caf77cdabd9e85503f36538e43b9",
            dataType: "json",
            success: function (response) {
                console.log("RESULTAT : Requête AJAX réussie (OpenWeatherMap/getTemp).");
                temp = response["main"]["temp"];
                description = response['weather'][0]['description'];
                nameByAPI = response['name'];
                console.log(response);

                marker.bindPopup("<b>MyWeather</b><br>" + loc["country"] + ", " + nameByAPI + " : " + temp + "°C, " + description).openPopup();

            },

            error: function (resultat, statut, erreur) {
                console.log(erreur);
            }
        });

        return temp;
    }

    //fonction qui récupére la température via l'API OpenWeatherMap grâce aux paramètres : postcode & countryCode
    function getTempZip(loc) {

        var temp = null;
        var postcode = loc["postcode"];
        var countryCode = loc["country_code"];

        $.ajax({
            async: false,
            type: "GET",
            timeout: 5000,
            url: "http://api.openweathermap.org/data/2.5/weather",
            data: "zip=" + postcode + "," + countryCode + "&units=metric&lang=fr&appid=c050caf77cdabd9e85503f36538e43b9",
            dataType: "json",
            success: function (response) {
                console.log("RESULTAT : Requête AJAX réussie (OpenWeatherMap/getTempZip).");
                temp = response["main"]["temp"];
                description = response['weather'][0]['description'];
                nameByAPI = response['name'];

                marker.bindPopup("<b>MyWeather</b><br>" + loc["country"] + ", " + nameByAPI + " : " + temp + "°C, " + description).openPopup();
            },

            error: function (resultat, statut, erreur) {
                console.log(erreur);
            }
        });

        return temp;
    }

    //fonction qui récupére la température via l'API OpenWeatherMap grâce au paramètre : country
    function getTempCountry(loc) {

        var temp = null;
        var country = loc["country"];

        $.ajax({
            async: false,
            type: "GET",
            timeout: 5000,
            url: "http://api.openweathermap.org/data/2.5/weather",
            data: "q=" + country + "&units=metric&lang=fr&appid=c050caf77cdabd9e85503f36538e43b9",
            dataType: "json",
            success: function (response) {
                console.log("RESULTAT : Requête AJAX réussie (OpenWeatherMap/getCountry).");
                temp = response["main"]["temp"];
                description = response['weather'][0]['description'];
                nameByAPI = response['name'];

                marker.bindPopup("<b>MyWeather</b><br>" + loc["country"] + ", " + nameByAPI + " : " + temp + "°C, " + description).openPopup();
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