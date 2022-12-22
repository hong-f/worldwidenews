var submit_button = $("#submit");
var search_history_elem = $("#history");
var search_term = "";
var search_history = JSON.parse(localStorage.getItem("search_history")) || [];

<<<<<<< HEAD
submit_button.on('click', function(){
    
})

// API Key GNews 
let key = "07b59a9aedbbd0a2b026ebdac3b01f7b";

let city = "New York";

// Current Time and Date
let date = dayjs().format("dddd, MMMM DD YYYY");
let dateTime = dayjs().format("dddd, MMMM DD YYYY, hh:mm.ss");

// City history from search
let citySearch = [];

// Save text value of search via storage/array
$(".search").on("click", function(event){
  event.preventDefault();
  city = $(this).parent(".btnPar").siblings(".textVal").val().trim();
  if (city === "") {
    return;
  };
  citySearch.push(city);

	// set local storage for city's that were searched
  localStorage.setItem("city", JSON.stringify(citySearch));
  getFiveDayForecastEl.empty();
	getHistory();
	getCurrentWeather();
});

// buttons created based on search history
let constHistEl = $(".citySearch");
function getHistory() {
	constHistEl.empty();

	for (let i = 0; i < citySearch.length; i++) {

		// creates a row and button list for the past searched cities
		let rowEl = $("<row>");
		let btnEl = $("<button>").text(`${citySearch[i]}`);

		rowEl.addClass("row histBtnRow");
		btnEl.addClass("btn btn-outline-secondary histBtn");
		btnEl.attr("type", "button");


		constHistEl.prepend(rowEl);
		rowEl.append(btnEl);
	} if (!city) {
		return;
	}

	//allow buttons to start a search
	$(".histBtn").on("click", function(event) {
		event.preventDefault();
		city = $(this).text();
		getFiveDayForecastEl.empty();
		getCurrentWeather();
	});
};

let cardContent = $(".cardContent");

//weather data to today's card & 5 day forecast
function getCurrentWeather() {

  // API for weather data
  let getUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;
  
  $(cardContent).empty();

	$.ajax({
		url: getUrlCurrent,
		method: "GET",
  }).then(function (response) {
    $(".cardCurrentCityName").text(response.name);
    $(".cardCurrentDate").text(date);

    //icons from openweathermap.org/weather-conditions
		$(".icons").attr("src", `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
	// temp
		let pEl = $("<p>").text(`Temperature: ${response.main.temp} °F`);
		cardContent.append(pEl);
	// wind
		let pElWind = $("<p>").text(`Wind Speed: ${response.wind.speed} Mph`);
		cardContent.append(pElWind);
    // humidity
		let pElHumid = $("<p>").text(`Humidity: ${response.main.humidity} %`);
		cardContent.append(pElHumid);
	// lat & long of city searches
    let cityLat = response.coord.lat;
		let cityLon = response.coord.lon;
    
		});
	getFiveDayForecast();
};

let getFiveDayForecastEl = $(".fiveForecast");

// 5 day: openweathermap.org/forecast5
function getFiveDayForecast() {
	let getUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;

  $.ajax({
		url: getUrlFiveDay,
		method: "GET",
	}).then(function (response) {
		let fiveDayArray = response.list;
		let weatherCards = [];

  //create array to show data on cards 
  $.each(fiveDayArray, function (index, value) {
		testObj = {
			date: value.dt_txt.split(" ")[0],
			time: value.dt_txt.split(" ")[1],
			temp: value.main.temp,
      speed: value.wind.speed,
			icon: value.weather[0].icon,
			humidity: value.main.humidity
		};

	
		if (value.dt_txt.split(" ")[1] === "12:00:00") {
			weatherCards.push(testObj);
		}
		});  
	
//cards to display on screen
		for (let i = 0; i < weatherCards.length; i++) {

			let divElCard = $("<div>");
			divElCard.attr("class", "card text-white bg-secondary mb-3 cardOne");
			divElCard.attr("style", "max-width: 250px;");
			getFiveDayForecastEl.append(divElCard);

			let divElHeader = $("<div>");
			divElHeader.attr("class", "card-header");
			let m = dayjs(`${weatherCards[i].date}`).format("MM-DD-YYYY");
			divElHeader.text(m);
			divElCard.append(divElHeader);

			let divElBody = $("<div>");
			divElBody.attr("class", "card-body");
			divElCard.append(divElBody);

// pull right image icons from source
			let divElIcon = $("<img>");
			divElIcon.attr("class", "icons");
			divElIcon.attr("src", `https://openweathermap.org/img/wn/${weatherCards[i].icon}@2x.png`);
			divElBody.append(divElIcon);

			// display temp, wind speed and humidity on cards
			let pElTemp = $("<p>").text(`Temperature: ${weatherCards[i].temp} °F`);
			divElBody.append(pElTemp);
      let pElWind = $("<p>").text(`Wind Speed: ${weatherCards[i].speed} Mph`);
      divElBody.append(pElWind);
			let pElHumid = $("<p>").text(`Humidity: ${weatherCards[i].humidity} %`);
			divElBody.append(pElHumid);
		}
	});
};

//Default data
function initLoad() {

	let citySearchStore = JSON.parse(localStorage.getItem("city"));

	if (citySearchStore !== null) {
		citySearch = citySearchStore;
	}
	getHistory();
	getCurrentWeather();
};

initLoad();
=======

function renderHistory() {
    //create search history buttons
	for (let i = 0; i < search_history.length; i++) {
        let history_button = $("<button>");
        history_button.attr("id",search_history[i]);
        history_button.text(search_history[i].toUpperCase())
        history_button.click(function (event){
            console.log(event.target.innerHTML);
            search_term = event.target.innerHTML;
            handleEvent();
        })
        $("#history").append(history_button);
	} if (!search_term) {
		return;
	}
};

submit_button.on('click', function(event){
    event.preventDefault();
    search_term = $('input[id="searchbar"]').val().trim();
    if (!search_history.includes(search_term)){
        search_history.push(search_term);
        localStorage.setItem("search_history", JSON.stringify(search_history));
    }
    handleEvent();
    renderHistory();
})
function handleEvent(){
    $("#current_events").empty();
    $("#top_stories").empty();
  
fetch('https://gnews.io/api/v4/search?q='+search_term+'&token=437a0f75f8fcd5bea6ffe790f53596f5&lang=en&country=us&max=1', {
    method: "GET",
    credentials:"same-origin",
    cache: "reload"
})
.then(function (response){
    if (response.status !== 200) {
        return;
      }
    return response.json();
})
.then(function (data){
    console.log(data);
    $("#top_stories").append("<h5 id='top_headline' class='headline card-title'>"+data.articles[0].title+"</h5>");
    $("#top_stories").append("<img id='top_image' src='"+data.articles[0].image+"'>");
    $("#top_stories").append("<p  class='card-content' id='top_desc'>"+data.articles[0].description+"</p>");
    $("#current_events").append("<a class='card-action' target='blank' id='top_link' href='"+data.articles[0].url+"'>Read more</a>");
})
fetch('https://api.currentsapi.services/v1/search?keywords='+search_term+'&language=en&apiKey=XzqeSfMWEQK7BqkJoQDQEDAHiQPeTIGxBbBaOzzVvTabs5Qd&page_size=3', {
    method: "GET", 
    credentials:"same-origin",
    cache: "reload"
})
.then(function (response){
    if (response.status !== 200) {
        return;
      }
    return response.json();
})
.then(function (data){
    console.log(data);
    for (let i = 0; i <data.news.length; i++) {
        $("#current_events").append("<h5 id='current_headline"+i+"' class='headline card-title'>"+data.news[i].title+"</h5>");
        if (data.news[i].image != "None"){
        $("#current_events").append("<img class='card-image' id='current_image"+i+"' src='"+data.news[i].image+"'>");
        }
        $("#current_events").append("<p class='card-content'id='current_desc"+i+"'>"+data.news[i].description+"</p>");
        $("#current_events").append("<a class='card-action' target='blank' id='current_link"+i+"' href='"+data.news[i].link+"'>Read more</a>");
        
    }
   
})

}
>>>>>>> main
