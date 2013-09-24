/* code.js
 * JS/jQuery for the PagePlatter Chrome extension.
 * by Julian Borrey
 * 22/09/2013 - For M-Hacks
 */

//essentially the main function
$(document).ready(function(){
	var p = new Platter();
   
   //checks for a presence of a db and renders pages
	p.initialize_();
	
   //listen for the main buttons
	$('#save-page').on('click', function(){
		p.save_page_();
	});
	
	$('#clear-all').on('click', function(){
		p.clear_all_();
	});
	
});

//the overall object, contains all methods
function Platter() {
	var NUM_ROWS; //used when doing the layout to keep track of where we are

   //loaded for a default window
	var DEFAULT_PAGE = "chrome-extension://adfijokpjofbjlnpggebaeoephdnfnhf/default.html";
	
	//intialization - check the user has a db and renders the pages
	this.initialize_ = function(){
		chrome.storage.sync.get('urls', function(data){
			if(typeof(data.urls) == 'undefined'){ //if no urls db, make one (db in json format)
				var arr = DEFAULT_PAGE;
				chrome.storage.sync.set({'urls': [{'url':arr, 'xpos':0, 'ypos':0}]}, function(){
					new Platter().load_();
				});
			} else { //otherwise this is just a usual render
				new Platter().load_();
			}
		});
	},

	//display all pages from the db
	this.load_ = function(){
		chrome.storage.sync.get('urls', function(data){
			for(var i = 0; i < data.urls.length; i++){ //do each url in db
				var str = new Platter().make_frame_block_(data.urls[i].url, i); //make display block
				$('#frames-block').append(str);                     //append it to the list
				$("#frame-num-" + i).scrollTop(data.urls[i].ypos);  //go to pre-set scroll positions
				$("#frame-num-" + i).scrollLeft(data.urls[i].xpos);
			}
			NUM_ROWS = i; //set the number of rows total
		});
	},
	
	//function to remove all pages from list
	this.clear_all_ = function(){
		chrome.storage.sync.clear(function(){
			var arr = DEFAULT_PAGE;
			chrome.storage.sync.set({'urls': [{'url':arr, 'xpos':0, 'ypos':0}]}, function(){
				$("#clear-all-note").append("All sites cleared."); //notify user
				new Platter().removeAllBlocks_();
			});
		});
	},

	//inserting a url in the db
	this.addURL_ = function(urlToAdd){
		//get the array of urls 
		chrome.storage.sync.get('urls', function(data){
			data.urls.push({'url':urlToAdd, 'xpos':0, 'ypos':0}); //push the next url
			chrome.storage.sync.set({'urls': data.urls}, function(){
					$('.note').append("Saved page."); //notify user
					new Platter().removeAllBlocks_(); //this will remove all
			});                                     //and show all + new block(s)
		});
	},
	
	//clears all table rows
	this.removeAllBlocks_ = function(){
		$(".page-window").remove();
		new Platter().load_(); //re-load
	},

	//this is for saving a URL to the db for framing
	this.save_page_ = function(){
		//get the value of the tab's url
		chrome.tabs.query({'active': true}, function(tabs){
			new Platter().addURL_(tabs[0].url);
		});
	},
	
	//make the large html block to add a whole page to the platter
	this.make_frame_block_ = function(htmlMeat, rowNum){
      //block for iframe and buttons
		var blockStr =  "<tr class=\"page-window frame-box row-" + rowNum + "\">" +
							"<td style=\"width:600px\">" +
								"<div class='frame-div frame-num-" + rowNum + "' id='frame-num-" + rowNum + "'>" + 
									"<iframe src='" + htmlMeat + 
									"' sandbox=\"allow-same-origin allow-top-navigation allow-forms allow-scripts\"\"></iframe>" +
								"</div>" +
							"</td>" +
			
							"<td class='btn-col' style=\"width:100px\">" +
								"<button id=\"set-pos-" + rowNum + "\" class=\"btn btn-small btn-info\">Set Position</button><br><br>" +
								"<button id=\"remove-clip-" + rowNum + "\" class=\"btn btn-small btn-warning\">Remove Clip</button>" +
							"</td>" +
						"</tr>" +
						
						"<script>" + 
							//listener for button for removing this frame
							"$('#remove-clip-" + rowNum + "').on('click', function(){" +
								"$('.row-" + rowNum + "').remove();" +
								"chrome.storage.sync.get('urls', function(data){" +
									"data.urls.splice(" + rowNum + ", 1);" +
									"chrome.storage.sync.set({'urls': data.urls});" +
								"});" +
							"});" +
							
							//listener for button for pre-set positioning
							"$('#set-pos-" + rowNum + "').on('click', function(){" +
								"chrome.storage.sync.get('urls', function(data){" +
									"var currY = $('.frame-num-" + rowNum + "').scrollTop();" +
									"var currX = $('.frame-num-" + rowNum + "').scrollLeft();" +
									"console.log(currY);" +
									"data.urls[" + rowNum + "].xpos = currX;" +
									"data.urls[" + rowNum + "].ypos = currY;" +
									"chrome.storage.sync.set({'urls': data.urls});" +
									"console.log('here');"+
								"});" +
							"});" +
						"</script>";
		return blockStr;
	}
	
}
