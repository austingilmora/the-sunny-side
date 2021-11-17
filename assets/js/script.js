var cityChoiceEl = document.querySelector("#city");
var cityFormEl = document.querySelector("#city-form");
var currentWeatherContainer = document.querySelector("#current-weather")
var d = new Date();
var day = d.getDate();
var m = new Date();
var month = m.getMonth() + 1;
var y = new Date();
var year = y.getFullYear();
var coord = [];


var formSubmitHandler = function(event) {
    event.preventDefault();
    //get city
    var city = cityChoiceEl.value.trim();

    if(city) {
        findCity(city);
        
        cityChoiceEl.value = "";
    } else {
        ("Please enter a city name");
    }
}

var findCity = function(city) {
    //format the api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=d7a0faeb8198c98603a340291c097390&units=imperial";

    //make a request to the url 
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var lon = data.coord.lon;
                var lat = data.coord.lat;
                coord.push(lat);
                coord.push(lon);
            
                displayCurrentWeather(data);
                
            })
        } else {
            alert("Error: City not found. Check the spelling of the city.");
        }
        
    })
    
};


var displayForecast = function(coord) {
    var apiUrl2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coord.lat + "&lon=" + coord.lon + "&appid=d7a0faeb8198c98603a340291c097390&units=imperial";

    //make a request to the url 
    fetch(apiUrl2).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                
                displayUV(data);
                console.log(data);
                 for (let i = 1; i < data.daily.length - 2; i++) {
                   console.log(data.daily[i]);
                  document.querySelector(".card-deck").innerHTML += ` 
                  <div class="card">

                 
                  <div class="card-body">
                    <h5 class="card-title">${moment(data.daily[i].dt, "X").format("MM/DD/YYYY")}</h5>
                    <img src='http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png'>
                    <p class="card-text">Temp: ${data.daily[i].temp.day} \u00B0 F</p>
                    <p class="card-text">Wind: ${data.daily[i].wind_speed} MPH</p>
                    <p class="card-text">Humidity: ${data.daily[i].humidity}%</p>
                  </div>
                </div>`   
                 }
            })
        } else {
            alert("Error: City not found. Check the spelling of the city.");
        }
    });
};

var displayCurrentWeather = function(city) {
    console.log(city);
    var title = document.createElement("h1");
    title.innerHTML = city.name + "(" + month + "/" + day + "/" + year + ")" + `<img src='http://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png'>` ;
    currentWeatherContainer.appendChild(title);

    var temp = document.createElement("p");
    temp.innerHTML = "Temp: " + Math.round(city.main.temp * 10) / 10 + "\u00B0 F"
    currentWeatherContainer.appendChild(temp);

    var wind = document.createElement("p");
    wind.innerHTML = "Wind Speed: " + city.wind.speed + " MPH";
    currentWeatherContainer.appendChild(wind);

    var humidity = document.createElement("p");
    humidity.innerHTML = "Humidity: " + city.main.humidity + "%";
    currentWeatherContainer.appendChild(humidity);

    displayForecast(city.coord);
};

var displayUV = function(city) {
    var UVindex = document.createElement("p");
    UVindex.innerHTML = "UV index: " + city.current.uvi
    currentWeatherContainer.appendChild(UVindex);
}

cityFormEl.addEventListener("submit", formSubmitHandler);