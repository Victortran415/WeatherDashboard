var APIkey = '&APPID=e0876bb83e7f5e06b1c6b43fc115403c'

var unit = '&units=imperial'

var searchBtn = $("#search-btn");
var clearBtn = $("#clear-list")
var cityInput = $("#search-city");
var cardRow = $(".card-row")

var cityName = $(".cityName");
var historyList = $(".history-list")


var tempEle = $("#temp");
var humidityEle = $("#humidity")
var windSpeedEle = $("#windspeed")
var uvIdxEle = $("#uv-idx")
var icon = $("#icon")

if (JSON.parse(localStorage.getItem("searchCity")) === null) {
    console.log("searchCity not found")
} else {
    console.log("loaded into history")
    cityHistory();
}

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
    var queryUrl = `http://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&APPID=e0876bb83e7f5e06b1c6b43fc115403c&units=imperial`;
    $.ajax({
        url: queryUrl,
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
    var queryUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${cityInfo.uvIdx.lat}&lon=${cityInfo.uvIdx.lon}&APPID=e0876bb83e7f5e06b1c6b43fc115403c&units=imperial`
    $.ajax({
        url: queryUrl,
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
    
    });
    fiveDayForecast()

    function fiveDayForecast() {
        cardRow.empty();
        var queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchedCity}&APPID=e0876bb83e7f5e06b1c6b43fc115403c&units=imperial`
        $.ajax({
            url: queryUrl,
            method: "GET"
        })
        .then(function(nextFiveDays) {
            for (var i = 0 ; i != nextFiveDays.list.length; i += 8) {
                var cityInfo = {
                    date: nextFiveDays.list[i].dt_txt,
                    icon: nextFiveDays.list[i].weather[0].icon,
                    temp: nextFiveDays.list[i].main.temp,
                    humidity: nextFiveDays.list[i].main.humidity
                }
                var dateStr = cityInfo.date;
                var trimDate = dateStr.substring (0, 10);
                var weatherIcon = `https:///openweathermap.org/img/w/${cityInfo.iconID}.png`;

            // FIXME: Icon and Temp not working

                forecastCards(trimDate, weatherIcon, cityInfo.temp, cityInfo.humidity)
            }
        })
    }
}
function forecastCards(date, temp, humidity, icon) {
    let fiveDayCardEl = $("<div>").attr("class", "five-day-card");
    let cardDate = $("<h4>").attr("class", "card-text");
    let cardIcon = $("<img>").attr("class", "weatherIcon");
    let cardTemp = $("<p>").attr("class", "card-text");
    let cardHumidity = $("<p>").attr("class", "card-text");

    cardRow.append(fiveDayCardEl);
    cardDate.text(date);
    cardIcon.attr("src", icon);
    cardTemp.text(`Temp: ${temp} °F`);
    cardHumidity.text(`Humidity: ${humidity}%`);
    fiveDayCardEl.append(cardDate, cardIcon, cardTemp, cardHumidity);
}

