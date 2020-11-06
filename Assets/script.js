var APIkey = '&APPID=e0876bb83e7f5e06b1c6b43fc115403c'
var apiForecast = 'http://api.openweathermap.org/data/2.5/forecast?q='
var unit = '&units=imperial'

var searchBtn = $("#search-btn");
var cityInput = $("#search-city");

var cityName = $(".cityName");
var historyList = $(".list-group")


searchBtn.on("click", function(e) {
    e.preventDefault();
    // FIXME: not operating right, may delete 
    if (cityInput.val() === undefined) {
        alert("City name not found");
        return;
    }
    // checking to see if button operating correctly
    console.log('clicked')


})