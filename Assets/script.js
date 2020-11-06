var APIkey = '&APPID=e0876bb83e7f5e06b1c6b43fc115403c'
// var apiForecast = 'https://api.openweathermap.org/data/2.5/forecast?q='
// var currentWeatherApi = 'http://api.openweathermap.org/data/2.5/weather?q='
var unit = '&units=imperial'

var searchBtn = $("#search-btn");
var cityInput = $("#search-city");

var cityName = $(".cityName");
var historyList = $(".list-group")

var tempEle = $("#temp");
var humidityEle = $("#humidity")
var windSpeedEle = $("#windspeed")
var uvIdxEle = $("#uv-idx")


searchBtn.on("click", function(e) {
    e.preventDefault();
    // FIXME: not operating right, may delete 
    if (cityInput.val() === undefined) {
        alert("City name not found");
        return;
    }
    // checking to see if button operating correctly
    console.log('clicked')
    currentWeather(cityInput.val())


})

function weatherData(name, temp, humidity, windSpd) {
    cityName.text(name);
    tempEle.text(" " + temp);
    humidityEle.text(" " + humidity + "%");
    windSpeedEle.text(" " + windSpd + "MPH")
}
console.log(weatherData)

function currentWeather(searchedCity) {
    var weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&APPID=e0876bb83e7f5e06b1c6b43fc115403c&units=imperial`;
    $.ajax({
        url: weatherUrl,
        method: "GET"
    })
    .then(function(currWeatherInfo) {
        var cityInfo = {
            name: currWeatherInfo.name,
            temp: currWeatherInfo.main.temp,
            humidity: currWeatherInfo.main.humidity,
            windSpd: currWeatherInfo.wind.speed,
        }
        
        weatherData(
        cityInfo.name,cityInfo.temp,cityInfo.humidity, cityInfo.windSpd)
    })
    
}
