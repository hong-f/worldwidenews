var submit_button = $("#submit");
var search_history_elem = $("#history");
var search_term = "";
var search_history = JSON.parse(localStorage.getItem("search_history")) || [];
var title_1 = $(".card-title1");
var title_2 = $(".card-title2");

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
    $("#top_stories").append(title_1);
    $("#top_stories").append("<h5 id='top_headline' class='headline card-title'>"+data.articles[0].title+"</h5>");
    $("#top_stories").append("<img id='top_image' src='"+data.articles[0].image+"'>");
    $("#top_stories").append("<p  class='card-content' id='top_desc'>"+data.articles[0].description+"</p>");
    $("#top_stories").append("<a class='card-action' target='blank' id='top_link' href='"+data.articles[0].url+"'>Read more</a>");
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
        $("#current_events").append("<a class='card-action' target='blank' id='current_link"+i+"' href='"+data.news[i].url+"'>Read more</a>");
        
    }
   
})

}