$(document).ready(function () {

    var map = L.map('mapDiv').setView([46.7111, 1.7191], 6);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

    var marker;


        map.on('click', function (e) {
            if (marker) {
                map.removeLayer(marker);
            }
            
            marker = new L.Marker(e.latlng).addTo(map);
            console.log(marker._latlng);
            coord(marker._latlng.lat, marker._latlng.lng);
        });


        


    // function city() {

    //     $.ajax({

    //         type: "GET",
    //         url: "https://nominatim.openstreetmap.org/reverse",
    //         data: "format=jsonv2&lat=" + marker._latlng.lat + "&lon=" + marker._latlng.lng,
    //         success: function (resultat) {
    //             var r = resultat.address;
    //             var popUp = L.popup();
    //             popUp.setLatLng([marker._latlng.lat, marker._latlng.lng]).setContent(r).openOn(map);
    //         },

    //         error: function (reponse, statut, erreur) { // callback, fonction appelée lorsque la requête échoue 
    //             $("#mapDIV").html("<span id=\"reponse\">Erreur ===> </span>" + statut);
    //         },

    //         complete: function (resultat, statut) {
    //             // A faire après un succès OU un échec (donc tous les cas de figure...)
    //         }

    //     });

    // }



    function coord(lat, lng) {

        $.ajax({

            type: "GET",
            url: "https://nominatim.openstreetmap.org/reverse",
            data: "format=geojson&lat=" + lat + "&lon=" + lng,
            success: function (resultat) {

                var addr = resultat["features"][0]["properties"]["address"];

                console.log(addr.state);

            },

            error: function(reponse, statut, erreur) {

                console.log(erreur);

            }
        });
        
    }












});