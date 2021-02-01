var apiKey = 'e0876bb83e7f5e06b1c6b43fc115403c'

var unit = '&units=imperial'

//search button
var searchBtn = $("#search-btn");

//city name 
var cityNameEle = $(".city-name");



var cityInput = $(".search-city");

//forecast cards
var cardRow = $(".card-row")


var historyList = $(".history-list")

//current date 
let currentDate = $(".currentDate")
var tempEle = $("#temp");
var humidityEle = $("#humidity")
var windSpeedEle = $("#windspeed")
var uvIdxEle = $("#uv-idx")
var icon = $("#icon")



let date = new Date();
let day = String(date.getDate()).padStart(2, '0');
let month = String(date.getMonth() + 1).padStart(2, '0');
let year = date.getFullYear()

let currDate = `${month}/${day}/${year}`
console.log(currDate)

if (JSON.parse(localStorage.getItem("searchCity")) === null) {
    console.log("searchCity not found")
} else {
    console.log("loaded into history")
    cityHistory();
}

searchBtn.on("click", function(e) {
    e.preventDefault();
    console.log('clicked')
    if (cityInput.val() === "") {
        alert("City name must be added")
        return;
    }
    currentWeather(cityInput.val())
})



$(document).on("click", ".newEntry", function() {
    console.log("clicked history item")
    let thisElement = $(this);
    currentWeather(thisElement.text());
})


function cityHistory(cityName){
    historyList.empty();
    var cityArr = JSON.parse(localStorage.getItem("searchCity"));
    for (var i = 0; i < cityArr.length; i++) {
        let cityList = $("<li>").attr("class", "newEntry");
        cityList.text(cityArr[i])
        historyList.prepend(cityList)
    }
}


function weatherData(cityName, cityTemp, cityHumidity, cityWindSpd, iconID, uvIdx) {
    cityNameEle.text(cityName);
    tempEle.text(`Temperature: ${cityTemp} °F`);
    humidityEle.text(`Humidity: ${cityHumidity}%`);
    windSpeedEle.text(`Wind Speed: ${cityWindSpd}MPH`);
    icon.attr("src", iconID);
    uvIdxEle.text(`UV Index: ${uvIdx}`);
    currentDate.text(`(${currDate})`) 
}


function currentWeather(searchedCity) {
    var queryUrl = `http://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&APPID=${apiKey}&units=imperial`;
    $.ajax({
        url: queryUrl,
        method: "GET"
    })
    .then(function(currWeatherInfo) {
        var cityInfo = {
            cityName: currWeatherInfo.name,
            cityTemp: currWeatherInfo.main.temp,
            cityHumidity: currWeatherInfo.main.humidity,
            cityWindSpd: currWeatherInfo.wind.speed,
            iconID: currWeatherInfo.weather[0].icon,
            uvIdx: currWeatherInfo.coord,
            
    
        }
    var queryUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${cityInfo.uvIdx.lat}&lon=${cityInfo.uvIdx.lon}&APPID=${apiKey}&units=imperial`
    $.ajax({
        url: queryUrl,
        method: 'GET'
    })
    .then(function(uvIdxData) {
        if (JSON.parse(localStorage.getItem("searchCity")) == null) {
            var cityArr = [];
            if (cityArr.indexOf(cityInfo.cityName) === -1) {
                cityArr.push(cityInfo.cityName);

                localStorage.setItem("searchCity", JSON.stringify(cityArr));
                var iconIDurl = `https:///openweathermap.org/img/w/${cityInfo.iconID}.png`
                
                weatherData(cityInfo.cityName, cityInfo.cityTemp, cityInfo.cityHumidity, cityInfo.cityWindSpd, iconIDurl, uvIdxData.value)
                cityHistory(cityInfo.cityName);
            } else {
                console.log('city already in search area')
                var iconIDurl = `https:///openweathermap.org/img/w/${cityInfo.iconID}.png`

                weatherData(cityInfo.cityName, cityInfo.cityTemp, cityInfo.cityHumidity, cityInfo.cityWindSpd, iconIDurl)
            }
        } else {
            let cityArr = JSON.parse(localStorage.getItem("searchCity"));
            if (cityArr.indexOf(cityInfo.cityName === -1)) {
                cityArr.push(cityInfo.cityName);

                localStorage.setItem("searchCity", JSON.stringify(cityArr));
                var iconIDurl = `https:///openweathermap.org/img/w/${cityInfo.iconID}.png`;

                weatherData(cityInfo.cityName, cityInfo.cityTemp, cityInfo.cityHumidity, cityInfo.cityWindSpd, iconIDurl, uvIdxData.value)
                cityHistory(cityInfo.cityName)
            } else {
                var iconIDurl = `https:///openweathermap.org/img/w/${cityInfo.iconID}.png`

                weatherData(cityInfo.cityName, cityInfo.cityTemp, cityInfo.cityHumidity, cityInfo.cityWindSpd, iconIDurl)
            }
        }
    })
    
    });
    fiveDayForecast()

    function fiveDayForecast() {
        cardRow.empty();
        var queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchedCity}&APPID=${apiKey}&units=imperial`
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
                var trimDate = dateStr.substring(0, 10);
                var weatherIcon = `https:///openweathermap.org/img/w/${cityInfo.icon}.png`;

            // FIXME: Icon and Temp not working

                forecastCards(trimDate, weatherIcon, cityInfo.temp, cityInfo.humidity)
            }
        })
    }
}
function forecastCards(date, icon, temp, humidity ) {
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

