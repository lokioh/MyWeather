$(document).ready(function () {
    var map = L.map('mapDiv').setView([48.84172, 2.26824], 18);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
    var tabCOORD = [
        [
            48.84197804895268, 2.267719848410252
        ],
        [
            48.84174503359729, 2.267988069311741
        ],
        [
            48.841540261632446, 2.2689000203768046
        ],
        [
            48.8419427436655, 2.2693291738191874
        ],
        [
            48.84254999113797, 2.2687820031801493
        ],
        [
            48.84197804895268, 2.267719848410252
        ]
    ];
    var polygone = L.polygon(tabCOORD, { color: 'red', weight: 2, fillColor: 'yellow', fillOpacity: 0.5 }).addTo(map);
});