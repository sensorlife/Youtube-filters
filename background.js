chrome.runtime.onInstalled.addListener(function (object) {
	if (object.reason === 'install'){
		chrome.runtime.openOptionsPage();
		chrome.tabs.create({ url: "https://www.youtube.com/channel/UCF3tyzOvcoieHsgU88aND_Q?sub_confirmation=1" });
		setRatingTime();
	}
});

chrome.runtime.setUninstallURL("https://www.youtube.com/channel/UCF3tyzOvcoieHsgU88aND_Q?sub_confirmation=1");

var filter = {
	url:
		[
			{ hostContains: "youtube.com" }
		]
}

var val = 0;
var state = false;
var manual = null;

chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
	updateOnChanging();
}, filter);


chrome.webNavigation.onCompleted.addListener(function (details) {
	updateOnChanging();
}, filter);

//new
chrome.tabs.onActivated.addListener(function(activeInfo) {
	if (localStorage.getItem("youtube_filter_selected_index") !== undefined && localStorage.getItem("youtube_filter_selected_index") !== null)
		val = localStorage.getItem("youtube_filter_selected_index");
	if (localStorage.getItem("youtube_video_filters_manual") !== undefined && localStorage.getItem("youtube_video_filters_manual") !== null)
			manual = localStorage.getItem("youtube_video_filters_manual");
	chrome.tabs.sendMessage(activeInfo.tabId, { "youtube_filter_selected_index": val,"youtube_video_filters_manual": manual});
});

function updateOnChanging() {
	
	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
		if (localStorage.getItem("youtube_filter_selected_index") !== undefined && localStorage.getItem("youtube_filter_selected_index") !== null)
			val = localStorage.getItem("youtube_filter_selected_index");
		if (localStorage.getItem("youtube_darkmode_clicked") !== undefined && localStorage.getItem("youtube_darkmode_clicked") !== null)
			state = localStorage.getItem("youtube_darkmode_clicked");
		if (localStorage.getItem("youtube_video_filters_manual") !== undefined && localStorage.getItem("youtube_video_filters_manual") !== null)
			manual = localStorage.getItem("youtube_video_filters_manual");		
		
		if(tabs[0]!==null && tabs[0]!==undefined)
			chrome.tabs.sendMessage(tabs[0].id, { "youtube_filter_selected_index": val, "youtube_darkmode_clicked": state , "youtube_video_filters_manual": manual});
	});
}

function onMsg(request){

	if (request.youtube_filter_video_upgrade_YT !== undefined) {
		upgradeYouTube(request.youtube_filter_video_upgrade_YT);
	}
}

function upgradeYouTube(bl){
	if(bl){
		chrome.tabs.query({ url: ['*://*.youtube.com/*'] }, function (tabs) {
			var c = `document.cookie="VISITOR_INFO1_LIVE=Qa1hUZu3gtk;path=/;domain=.youtube.com";`;
			for (i = 0; i < tabs.length; i++) {
				chrome.tabs.executeScript(tabs[i].id, { code: c });
			}
		});
	}
}

function setRatingTime(){
	var d = (new Date()).getTime();
	chrome.storage.local.set({"htcom_yve__time_installed": d}, function(){});
}

var time_rating = window.setInterval(function(){
	chrome.storage.local.get("htcom_yve__time_installed", function(e){
		if(e["htcom_yve__time_installed"]!==undefined){
			var curr = (new Date()).getTime();
			var installed = e["htcom_yve__time_installed"];
			var time_diff = curr - installed;
			if(time_diff>2*24*60*60*1000){
				clearInterval(time_rating);
				app.tab.open("https://www.youtube.com/channel/UCF3tyzOvcoieHsgU88aND_Q?sub_confirmation=1", true);
				chrome.storage.local.remove("htcom_yve__time_installed", function(){});
			}
		}
	});
}, 500);
