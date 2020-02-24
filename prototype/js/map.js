var mymap = L.map('mapid').setView([54.28, -1.5147], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'sk.eyJ1IjoibWlqYW1rYSIsImEiOiJjazZ6djRiMGswczY4M2dta2gzZWNpdGc0In0.ntk0RexZw85rMtlaxpkVnQ'
}).addTo(mymap);

//adding markers
var marker = L.marker([51.5, -0.09]).addTo(mymap);