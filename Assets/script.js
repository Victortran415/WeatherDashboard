var APIkey = '&APPID=e0876bb83e7f5e06b1c6b43fc115403c'
// var apiForecast = 'https://api.openweathermap.org/data/2.5/forecast?q='
// var currentWeatherApi = 'http://api.openweathermap.org/data/2.5/weather?q='
var unit = '&units=imperial'

var searchBtn = $("#search-btn");
var clearBtn = $("#clear-list")
var cityInput = $("#search-city");

var cityName = $(".cityName");
var historyList = $(".history-list")


var tempEle = $("#temp");
var humidityEle = $("#humidity")
var windSpeedEle = $("#windspeed")
var uvIdxEle = $("#uv-idx")
var icon = $("#icon")



searchBtn.on("click", function(e) {
    e.preventDefault();
    console.log('clicked')
    currentWeather(cityInput.val())
})

if (JSON.parse(localStorage.getItem("searchCity")) === null) {
}else{
    cityHistory();
}

$(document).on("click", ".newEntry", function() {
    console.log("clicked history item")
    let thisElement = $(this);
    currentWeather(thisElement.text());
})


function cityHistory(name){
    historyList.empty();
    var cityArr = JSON.parse(localStorage.getItem("searchCity"));
    for (var i = 0; i < cityArr.length; i++) {
        let cityList = $("<li>").attr("class", "newEntry");
        cityList.text(cityArr[i])
        historyList.prepend(cityList)
    }
}


function weatherData(name, temp, humidity, windSpd, iconID, uvIdx) {
    cityName.text(name);
    tempEle.text(" " + temp + "°F");
    humidityEle.text(" " + humidity + "%");
    windSpeedEle.text(" " + windSpd + " MPH")
    icon.attr("src", iconID)
    uvIdxEle.text(" " + uvIdx)
}


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
            iconID: currWeatherInfo.weather[0].icon,
            uvIdx: currWeatherInfo.coord
    
        }
    var uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${cityInfo.uvIdx.lat}&lon=${cityInfo.uvIdx.lon}&APPID=e0876bb83e7f5e06b1c6b43fc115403c&units=imperial`
    $.ajax({
        url: uvUrl,
        method: 'GET'
    })
    .then(function(uvIdxData) {
        if (JSON.parse(localStorage.getItem("searchCity")) == null) {
            var cityArr = [];
            if (cityArr.indexOf(cityInfo.name) === -1) {
                cityArr.push(cityInfo.name);

                localStorage.setItem("searchCity", JSON.stringify(cityArr));
                var iconIDurl = `https:///openweathermap.org/img/w/${cityInfo.iconID}.png`
                
                weatherData(cityInfo.name, cityInfo.temp, cityInfo.humidity, cityInfo.windSpd, iconIDurl, uvIdxData.value)
                cityHistory(cityInfo.name);
            } else {
                var iconIDurl = `https:///openweathermap.org/img/w/${cityInfo.iconID}.png`
                weatherData(cityInfo.name, cityInfo.temp, cityInfo.humidity, cityInfo.windSpd, iconIDurl, uvIdxData.value)
            }
        } else {
            var cityArr = JSON.parse(localStorage.getItem("searchCity"));
            if (cityArr.indexOf(cityInfo.name) === -1) {
                cityArr.push(cityArr.name);

                localStorage.setItem("searchCity", JSON.stringify(cityArr));
                var iconIDurl = `https:///openweathermap.org/img/w/${cityInfo.iconID}.png`
                
                weatherData(cityInfo.name, cityInfo.temp, cityInfo.humidity, cityInfo.windSpd, iconIDurl)
                cityHistory(cityInfo.name);
            }
            else {
                var iconIDurl = `https:///openweathermap.org/img/w/${cityInfo.iconID}.png`
                weatherData(cityInfo.name, cityInfo.temp, cityInfo.humidity, cityInfo.windSpd, iconIDurl)

                // FIXME: historyList is not updating, UV Index not working
            }
        }

    })
    
    })
}
