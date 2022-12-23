var submit_button = $("#submit");
var search_history_elem = $("#history");
var search_term = "";
var search_history = JSON.parse(localStorage.getItem("search_history")) || [];
var blankCity = "New York";


var title_1 = $(".card-title1");
var title_2 = $(".card-title2");
const loader = document.querySelector("#loading");
var top_stories = JSON.parse(localStorage.getItem("top_stories")) || [];
var current_events = JSON.parse(localStorage.getItem("current_events")) || [];
console.log(top_stories);
console.log(current_events);
function renderHistory() {
    //create search history buttons
    $("#history").empty();
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
$("#clear_history").click(function(){
    localStorage.clear();
    $("#history").empty();
})
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
    console.log(search_term);
    showLoader();
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
        $("#current_events").append(title_2);
        $("#current_events").append("<h5 id='current_headline"+i+"' class='headline card-title'>"+data.news[i].title+"</h5>");
        if (data.news[i].image != "None"){
        $("#current_events").append("<img class='card-image' id='current_image"+i+"' src='"+data.news[i].image+"'>");
        }
        $("#current_events").append("<p class='card-content'id='current_desc"+i+"'>"+data.news[i].description+"</p>");
        $("#current_events").append("<a class='card-action' target='blank' id='current_link"+i+"' href='"+data.news[i].link+"'>Read more</a>");
        
    }
   
})

}


// landing
function landing() {

	var blankCity = JSON.parse(localStorage.getItem("search_history"));

	if (blankCity !== null) {
		search_term = 'New York';
	}
    else{
        search_term = blankCity;
    }

	handleEvent();
    renderHistory();
};

landing();
function showLoader(){
    $("#loader").removeClass("hidden");
    $("#loader").addClass("visible");
}
function hideLoader(){
    $("#loader").removeClass("visible");
    $("#loader").addClass("hidden");
}

async function getCurrentEvent(search_term){
    let response = await fetch('https://api.currentsapi.services/v1/search?keywords='+search_term+'&language=en&apiKey=6rg2mgxMthotf5_hoj_nx0tlTR4Z5wsedO1OIc99r9kX0AxG&page_size=3', {
        method: "GET", 
        credentials:"same-origin",
        cache: "reload" 
    })
    let data = await response.json();
    console.log(data);
    localStorage.setItem("current_events", JSON.stringify(data.news));
    current_events = JSON.parse(localStorage.getItem("current_events"))
}
function render_current_events(current_events){
        for (let i = 0; i < current_events.length; i++) {
            var parent_div = $("<div>");
            parent_div.addClass("col s12 m6 l4");
            var card = $("<div>");
            card.addClass("card medium");
            // if (current_events[i].image != "None"){
            var card_image = $("<div>");
            card_image.addClass("card-image");
            var image = $("<img>");
            image.attr("src",current_events[i].image);
            card_image.append(image);
            card.append(card_image);
            // }
            var span = $("<span>");
            span.addClass("card-title");
            span.text(current_events[i].title);
            card_image.append(span);
            var card_content = $("<div>");
            card_content.addClass("card-content");
            var p = $("<p>");
            p.text(current_events[i].description);
            card_content.append(p);
            card.append(card_content);
            var card_action = $("<div>")
            card_action.addClass("card-action");
            var a = $("<a>");
            a.attr("href",current_events[i].url);
            a.text("Read More");
            card_action.append(a);
            card.append(card_action);
            parent_div.append(card);
            $("#current_events").append(parent_div);
        }
        hideLoader();

    }


async function getTopStories(search_term){
let response = await fetch('https://gnews.io/api/v4/search?q='+search_term+'&token=07b59a9aedbbd0a2b026ebdac3b01f7b&lang=en&country=us&max=2', {
    method: "GET",
    credentials:"same-origin",
    cache: "reload"
});
let data = await response.json();
console.log(data);
localStorage.setItem("top_stories", JSON.stringify(data.articles));
top_stories = JSON.parse(localStorage.getItem("top_stories"));
}

function render_top_stories(top_stories){
for (let i = 0; i < top_stories.length; i++) {
            var parent_div = $("<div>");
            parent_div.addClass("col s12 m12 l6");
            var card = $("<div>");
            card.addClass("card medium");
            var card_image = $("<div>");
            card_image.addClass("card-image");
            var image = $("<img>");
            image.attr("src",top_stories[i].image);
            var span = $("<span>");
            span.addClass("card-title");
            span.text(top_stories[i].title);
            card_image.append(image);
            card_image.append(span);
            card.append(card_image);
            var card_content = $("<div>");
            card_content.addClass("card-content");
            var p = $("<p>");
            p.text(top_stories[i].description);
            card_content.append(p);
            card.append(card_content);
            var card_action = $("<div>")
            card_action.addClass("card-action");
            var a = $("<a>");
            a.attr("href",top_stories[i].url);
            a.text("Read More");
            card_action.append(a);
            card.append(card_action);
            parent_div.append(card);
            $("#top_stories").append(parent_div);
        }
    }
