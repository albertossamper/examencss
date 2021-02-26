navigator.geolocation.getCurrentPosition(function(location) {
    var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);
    var mymap = L.map('mapid').setView(latlng, 13);
    var url1 = "http://api.openweathermap.org/data/2.5/weather?lat="+parseFloat(location.coords.latitude)+"&lon="+parseFloat(location.coords.longitude)+"&units=metrics&appid=250f57bf583e6f47ddee0d90c40f95e8"; 
    var urlg1 = "https://api.openweathermap.org/data/2.5/forecast?lat="+parseFloat(location.coords.latitude)+"&lon="+parseFloat(location.coords.longitude)+"&units=metrics&appid=250f57bf583e6f47ddee0d90c40f95e8"
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/streets-v11',
                accessToken: 'pk.eyJ1IjoidG90aTY5byIsImEiOiJjazVubTdhMmwwZDNjM2Zuc2lpeTE0ejc4In0.qWZmqPn8dcyIrHYm6EsM1Q'
                })
        .addTo(mymap);
        var myMarker = L.marker(latlng, {title: "Tu ubicación", alt: "The Big I", draggable: true})
		.addTo(mymap)
		.on('dragend', function() {
			    var coord = String(myMarker.getLatLng()).split(',');
			    var lat = parseFloat(coord[0].split('(').toString().substring(7,15));
                var lng = parseFloat(coord[1].split(')'));
                var url = "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lng+"&units=metrics&appid=250f57bf583e6f47ddee0d90c40f95e8";
                var urlg = "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lng+"&units=metrics&appid=250f57bf583e6f47ddee0d90c40f95e8";
                mostrar(url);
                dibujar(urlg);
            });
            flotante(myMarker, location.coords.latitude, location.coords.longitude);
            mostrar(url1);
            dibujar(urlg1);
});
function unixanormal(horarara) {
    var date = new Date(horarara * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var formattedTime = hours + ':' + minutes.substr(-2);
    return formattedTime;
}
function mostrar(url) {
    $.getJSON(url, function (data){
        var temperatura = (data["main"]["temp"]-273.15).toFixed(2);
        $("#temperatura").html(temperatura);
        var temperaturasen = (data["main"]["feels_like"]-273.15).toFixed(2);
        $("#temperaturasens").html(temperaturasen);
        var temperaturamax = (data["main"]["temp_max"]-273.15).toFixed(2);
        $("#temperaturamaxima").html(temperaturamax);
        var temperaturamin = (data["main"]["temp_min"]-273.15).toFixed(2);
        $("#temperaturaminima").html(temperaturamin);
        var lugar = data["name"];
        $("#lugar").html(lugar);
        var icono = data["weather"][0]["icon"];
        $("#icono").html(icono);
        var amanecer = unixanormal(data["sys"]["sunrise"]);
        $("#amanecer").html(amanecer);
        var atardecer = unixanormal(data["sys"]["sunset"]);
        $("#atardecer").html(atardecer);
        var nubosidad = data["weather"][0]["description"];
        $("#nubes").html(nubosidad);
        var humedad = data["main"]["humidity"];
        $("#humedad").html(humedad+"%");
        var presion = data["main"]["pressure"];
        $("#presion").html(presion+" hPa");
        var viento = data["wind"]["speed"];
        if (data["wind"]["deg"]) {
            var vientog= data["wind"]["deg"];
            $("#viento").html(viento+" m/s &nbsp&nbsp"+vientog+"º");
        }else{
            $("#viento").html(viento+" m/s");
        }
    });
}
function flotante(myMarker, lat, lng) {
    $("body").on('DOMSubtreeModified', "#viento", function() {
        myMarker.bindPopup("<p style='font-size:60px; display: block !important; justify-content=center;'><strong>"+document.getElementById("lugar").innerHTML+"</strong></p><img style='height: 80px; text-align=center;' src='http://openweathermap.org/img/wn/"+document.getElementById("icono").innerHTML+"@2x.png'>"+"<p style='font-size:20px; display: inline-flex !important;'><strong>"+document.getElementById("temperatura").innerHTML+" ºC </strong></p> <br> <p style='font-size: 8px; display: inline !important;'> Temp. Sens: "+document.getElementById("temperaturasens").innerHTML+" ºC<span style='color: red;'> Temp. Max: "+document.getElementById("temperaturamaxima").innerHTML+" ºC</span><span style='color: blue;'> Temp. Min: "+document.getElementById("temperaturaminima").innerHTML+" ºC</span><br><span style='color:grey;'> Loc: [ "+lat+", "+lng+" ] <span></p>").openPopup();
    });
}
function dibujar(urlg) {
    $.getJSON(urlg, function (data){
        var temperaturas = Array();
        var horas = Array();
        var lluvia = Array();
        var nieve = Array();
        var n = 0;
        do {
            temperaturas.push((data["list"][n]["main"]["temp"]-273.15).toFixed(2));
            horas.push(data["list"][n]["dt_txt"].substring(10, 16));
            if (typeof data["list"][n]["rain"] !='undefined') {
                lluvia.push((data["list"][n]["rain"]["3h"]*10).toFixed(2));
            }else{
                lluvia.push(0);
            }
            if (typeof data["list"][n]["snow"] !='undefined') {
                nieve.push((data["list"][n]["snow"]["3h"]*10).toFixed(2));
            }else{
                nieve.push(0);
            }
            n++;
        } while (n<9);
        $("#temperatura").html(temperatura);
        var ctx = document.getElementById('myChart').getContext('2d');
        if (window.grafica) {
            window.grafica.clear();
            window.grafica.destroy();
        }
        console.log(data);
        window.grafica = new Chart(document.getElementById("myChart"), {
            type: 'bar',
            data: {
                labels: horas,
                datasets: [{
                    label: "Temperatura ºC",
                    type: "line",
                    borderColor: "blue",
                    data: temperaturas,
                    fill: false
                }, {
                    label: "Precipitaciones dL/m2",
                    type: "line",
                    borderColor: "pink",
                    data: lluvia,
                    fill: false
                }, {
                    label: "Nieve dL/m2",
                    type: "line",
                    borderColor: "black",
                    data: nieve,
                    fill: false
                }]
                },
                options: {
                  title: {
                    display: true,
                    text: 'Previsión tiempo (24 horas)'
                  }
                }
            });
        });
}