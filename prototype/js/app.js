// Icons created by Ashley Jager, https://github.com/manifestinteractive/weather-underground-icons
// api key : bba7e5b7d4db7564662712e34db2cb37

// Selecting DOM elements to display weather
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".weather-location p");
const notificationElement = document.querySelector(".notification");

// Storing weather object data
const weather = {};

weather.temperature = {
    unit : "celsius"
}

// constants and variables
const KELVIN = 273;
// API key for making api calls
const key = "bba7e5b7d4db7564662712e34db2cb37";


// Check if Geolocation services are avialable in the browser
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);   // Get longitude and latitude properties 
}else{                                                                  // of user's location from position object
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";      // Display error notification
}


// Get user's location for requesting weather forecast
function setPosition(position){
    let latitude = position.coords.latitude;       
    let longitude = position.coords.longitude;
    
    console.log("lat: "+latitude);
    console.log("lon: "+longitude);
    
    getWeather(latitude, longitude);        
}

// Display an error if there is a problem with geolocation service
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// Make an API call with api key to get a weather forecast
function getWeather(latitude, longitude){
    let apiCall = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(apiCall)  
        .then(function(response){
            let data = response.json();     
            return data;            // Return JSON response object
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);    // Convert Fahrenheit to Celcius unit
            weather.description = data.weather[0].description;              // Set weather description
            weather.iconId = data.weather[0].icon;                          // Set weather icon
            weather.city = data.name;                                       // Set weather cit
            weather.country = data.sys.country;                             // Set weather country
        })
        .then(function(){
            displayWeather();                                // when Promise resolve, call displayWeather() to update UI 
        });
}

// Updates innerHTML and displays weather forecast
function displayWeather(){
    iconElement.innerHTML = `<img src="img/weather-icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

