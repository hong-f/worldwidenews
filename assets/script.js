var submit_button = $("#submit");
var search_term = "";
var search_history = JSON.parse(localStorage.getItem("search_history")) || [];
var title_1 = $(".card-title1");
var title_2 = $(".card-title2");
var top_stories = JSON.parse(localStorage.getItem("top_stories")) || [];
var current_events = JSON.parse(localStorage.getItem("current_events")) || [];
console.log(top_stories);
console.log(current_events);
// Rendering landing page
window.onload = () => {
    $('.sidenav').sidenav();
    landing();
    renderHistory();
}

// Modal
const closeModal = function () {
    $(".modal").addClass("hidden");
    $(".overlay").addClass("hidden");
  };
const openModal = function () {
    $(".modal").removeClass("hidden");
    $(".overlay").removeClass("hidden");
  }
  $(".btn-close").click(function(){
    closeModal();
  });
  $(".overlay").click(function(){
    closeModal();
  });

// Clear history button
$("#clear_history").click(function(){
    localStorage.clear();
    $("#history").empty();
    // landing();
})

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
        })
        $("#history").append(history_button);
	} if (!search_term) {
		return;
	}
};

// Submit button
submit_button.on('click', function(event){
    event.preventDefault();
    search_term = $('input[id="searchbar"]').val().trim();
    if(search_term === "" || search_term === null){
    openModal();
    landing();
    }
    else{
    handleEvent();
    renderHistory();
    }
})

async function handleEvent(){
    console.log(search_term);
    if (!search_history.includes(search_term)&& search_term != "" && search_term != null){
        search_history.push(search_term);
        localStorage.setItem("search_history", JSON.stringify(search_history));
    }
    showLoader();
    $("#current_events").empty();
    $("#top_stories").empty();
    await getTopStories(search_term);
    render_top_stories(top_stories);
    hideLoader("#loading_stories");
    await getCurrentEvent(search_term);
    render_current_events(current_events);
    if (!top_stories || !current_events){
        openModal();
        landing();
    }
    hideLoader("#loading_events");
}

// landing
function landing() {

	var blankCity = search_history[Math.floor(Math.random()*search_history.length)];
    console.log(blankCity);
	if (blankCity !== null) {
		search_term = 'New York';
	}
    else{
        search_term = blankCity;
    }

	handleEvent();
    renderHistory();
};
// Loader
function showLoader(){
    $(".loading").css({"display" : ""});
}
function hideLoader(value){
    $(value).css({"display" : "none"});
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
                span.addClass("card-title flow-text");
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
                a.attr("target","_blank");
                card.append(card_action);
                parent_div.append(a);
                a.append(card);
                $("#top_stories").append(parent_div);
            }
}
async function getCurrentEvent(search_term){
    let response = await fetch('https://api.currentsapi.services/v1/search?keywords='+search_term+'&language=en&apiKey=XzqeSfMWEQK7BqkJoQDQEDAHiQPeTIGxBbBaOzzVvTabs5Qd&page_size=3', {    
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
            var card_image = $("<div>");
            card_image.addClass("card-image");
            if (current_events[i].image != "None"){
            var image = $("<img>");
            image.attr("src",current_events[i].image);
            card_image.append(image);
            card.append(card_image);
            }
            else{

            }
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
            a.attr("target","_blank");
            card.append(card_action);
            parent_div.append(a);
            a.append(card);
            $("#current_events").append(parent_div);
        }

}

