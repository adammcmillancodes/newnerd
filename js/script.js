var heroApp = {}
heroApp.key = "d300d27b03fd9998d8c45aa8884f17e6c6b7f6ec"

heroApp.init = function(){
	//code that kicks off the app
	heroApp.events();
}
heroApp.getHeroes = function(name){
	$.ajax ({
			url: "http://proxy.hackeryou.com",
			method: "GET",
			dataType: "json",
			data: {
				reqUrl: "http://comicvine.gamespot.com/api/characters",
				params: {
					format: 'json',
					api_key: heroApp.key,
					filter: "name:" + name,
					limit: 1
				},
				xmlToJSON: false
			}
		}).then(function(res){
			var results = res.results;


			//i want my results to be filtered before display
			//and then display
			//  /^Thor$/i
			var regex = new RegExp("^"+name+"$","i");
			
			results  = results.filter(function(hero) {
				return hero.name.match(regex);
			});

			heroApp.displayHero(results);


			if (results[0] == null) {
				var noResult = $("<h2>").text("Uh-Oh, looks like something went wrong!");
				var noResultSub = $("<p>").text("These things happen. Just check your spelling, or try entering their real name.");
				var noResultWrap = $("<div>").addClass("results").append(noResult, noResultSub);
				$(".heroDisplay").append(noResultWrap);

			};
		})
}



//to get data from http://comicvine.gamespot.com/api/origin/4030-3/ a new ajax request must be made to that specific url

// ****************************************
// BEGIN SEARCH FUNCTION
// ****************************************

heroApp.events = function(){
	//listen to changes on our select element


	$(".submitButton").on('click', function(event){
		event.preventDefault();
		
		//get the value of the users choice
	
		var usersChoice = $(".heroSearch").val();

		$(".heroSearch").val("");
		// console.log(usersChoice);
		heroApp.getHeroes(usersChoice);
		// heroApp.updateTitle();
	})



}
// ****************************************
// END SEARCH FUNCTION
// ****************************************


heroApp.displayHero = function(heros){
	$(".heroDisplay").empty();
	heros.forEach(function(hero){

		if(hero.publisher.name === "Marvel" || hero.publisher.name === "DC Comics"){

			heroName = {};
			if (hero.name === null || hero.name === undefined || hero.name === "" || hero.name.length === 0 ) {
				console.log("please try again")

			}else {
				heroName = hero.name;
			}

			var heroImg = {};
			 if (hero.image === null ) {
				console.log('nothing to see here');
			} else {
				heroImg = hero.image.medium_url || hero.image.small_url;
			}

			var publisher = hero.publisher.name;
			var heroDescription = hero.deck;
			var firstAppearance = hero.first_appeared_in_issue.name +" issue number " + hero.first_appeared_in_issue.issue_number;

			var heroNameEl = $("<h2>").text(heroName);
			var heroImgEl = $("<img>").attr("src", heroImg);
			var publisherEl = $("<p>").text(publisher);

			var heroDescriptionEl = $("<h3>").text(heroDescription);

			var firstAppearanceEl = $("<p>").text("First Appearance: " + firstAppearance);

			//imageCapt hold the image of the hero and
			//the publisher of the hero

			var imageCapt = $("<div>").addClass('imageCapt').append(heroImgEl, publisherEl);

			//deckAppearance holds the description and 
			//first appearance

			var deckAppearance = $("<div>").addClass('deckAppear').append(firstAppearanceEl, heroDescriptionEl);

			//heroCont holds both imageCapt and deckAppearance

			var heroContent = $("<div>").addClass('heroCont').append(imageCapt, deckAppearance)


			//heroWrap holds her name, and heroCont which
			var heroWrap = $("<div>").addClass("results").append(heroNameEl, heroContent);


			$(".heroDisplay").append(heroWrap);

			//need this to smoothscroll
			$(".heroDisplay").load(function(){

				$(".heroDisplay").animate({scrollBottom: $(".herDisplay").prop("scrollHeight")}, 500);
				
			});

			console.log(heroWrap);

		} else {
			console.log('not marvel or DC');
			var noResult = $("<h2>").text("Uh-Oh, looks like something went wrong!");
			var noResultSub = $("<p>").text("It looks like the character you're searching for isn't from Marvel or DC Comics.");
			var noResultWrap = $("<div>").addClass("results").append(noResult, noResultSub);
			$(".heroDisplay").append(noResultWrap);

		}

	});



	//hero name will appear in h2
	//image of hero will appear in img element
	//appearances will populate li's in the ul
}


$(function(){
	heroApp.init();
});

//user should search for character by name
//character to be displayed on screen with image
//and list of first appearance, publisher name
//any aliases(not all characters have aliases)