var cityChoiceEl = document.querySelector("#city");
var cityFormEl = document.querySelector("#city-form");
var cityList = document.querySelector(".city-list");
var currentWeatherContainer = document.querySelector("#current-weather");
var forecastContainer = document.querySelector(".card-deck");
var cityBtn = document.querySelectorAll(".cityBtn");
var coord = [];
var favCities = [];

var formSubmitHandler = function(event) {
    event.preventDefault();
    //get city
    var city = cityChoiceEl.value.trim();

    //if there is an input
    if(city) {
        // get long and lat, and current weather
        findCity(city);
        
        
        // clear search container
        cityChoiceEl.value = "";
    } else {
        alert("Please enter a city name");
    }
}

var clearChildren = function(parent) {
    // kill all the children 
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

var addCityToFav = function(city) {
    // if there aren't any instances of the city searched for
    if (favCities.indexOf(city) === -1) {
        //put the city into array of cities
        favCities.push(city);
        //save list to local storage
        localStorage.setItem("cities", JSON.stringify(favCities));
        //make a button for the city
        var cityButton = document.createElement("button");
        cityButton.innerHTML = "<h2>" + city + "</h2>"
        cityButton.classList = "btn cityBtn"
        //add button to the city list
        cityButton.addEventListener("click", function(event) {findCity(event.target.textContent)});
        cityList.appendChild(cityButton);
    }
};

var findCity = function(city) {
    
    //clear old search
    clearChildren(currentWeatherContainer);
    clearChildren(forecastContainer);
    //format the api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=d7a0faeb8198c98603a340291c097390&units=imperial";

    //make a request to the url 
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // get the lat and long of city
                var lon = data.coord.lon;
                var lat = data.coord.lat;
                coord.push(lat);
                coord.push(lon);
                // show current weather from this api
                displayCurrentWeather(data);
                //add that city to fav list
                addCityToFav(city);
            })
        } else {
            alert("Error: City not found. Check the spelling of the city.");
        }
        
    })
    
};


var displayForecast = function(coord) {
    var apiUrl2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coord.lat + "&lon=" + coord.lon + "&appid=d7a0faeb8198c98603a340291c097390&units=imperial";

    //make a request to the url using the lat and long from previous
    fetch(apiUrl2).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                
                // input UV index
                displayUV(data);
                //console.log(data);
                // for each day starting tomorrow, going for 5 days
                for (let i = 1; i < data.daily.length - 2; i++) {
                    //console.log(data.daily[i]);
                    document.querySelector(".card-deck").innerHTML += 
                    // add a card with date, weather icon, temp, wind speed, and humidity of the day
                    `<div class="card">

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
    //console.log(city);
    // add city name and current date along with weather icon
    var title = document.createElement("h1");
    title.innerHTML = city.name + " " + moment(city.dt, "X").format("MM/DD/YYYY") + `<img src='http://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png'>` ;
    currentWeatherContainer.appendChild(title);
    
    //add temp
    var temp = document.createElement("p");
    temp.innerHTML = "Temp: " + Math.round(city.main.temp * 10) / 10 + "\u00B0 F"
    currentWeatherContainer.appendChild(temp);

    //add wind speed
    var wind = document.createElement("p");
    wind.innerHTML = "Wind Speed: " + city.wind.speed + " MPH";
    currentWeatherContainer.appendChild(wind);

    //add humidity
    var humidity = document.createElement("p");
    humidity.innerHTML = "Humidity: " + city.main.humidity + "%";
    currentWeatherContainer.appendChild(humidity);

    // show 5 day forecast
    displayForecast(city.coord);
};


var displayUV = function(city) {
    var UVindex = document.createElement("p");
    UVindex.innerHTML = "UV index: " + city.current.uvi
    currentWeatherContainer.appendChild(UVindex);
}

var loadCities = function() {
    //get stored cities
    var savedCities = localStorage.getItem("cities");
    
    //if no cities, do nothing
    if (!savedCities) {
        return false;
    }
    // if there are cities, make a new button for each
    else {
        favCities = JSON.parse(savedCities);
        
        for (var i = 0; i < favCities.length; i++) {
            
            var cityButton = document.createElement("button");
            cityButton.innerHTML = "<h2>" + favCities[i] + "</h2>"
            cityButton.classList = "btn cityBtn"
            cityButton.addEventListener("click", function(event) {findCity(event.target.textContent)});
            cityList.appendChild(cityButton);
            
        } 
    }
}

loadCities();

cityFormEl.addEventListener("submit", formSubmitHandler);