//{
var filters = new Array("rgba(0,0,0,0)"	
);
var svgfilter = new Array(
	`<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><filter id="myfilter"><feGaussianBlur stdDeviation="1" /><feConvolveMatrix preserveAlpha="true" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" /></filter></defs></svg>`,/*Color Normal*/	
	`<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><filter id="myfilter"><feGaussianBlur stdDeviation="1" /><feColorMatrix type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0"/><feConvolveMatrix preserveAlpha="true" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" /></filter></defs></svg>`/*Green Normal--*/,
	`<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><filter id="myfilter"><feGaussianBlur stdDeviation="1" /><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0"/><feConvolveMatrix preserveAlpha="true" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" /></filter></defs></svg>`/*Yellow Normal--*/,
	`<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><filter id="myfilter"><feGaussianBlur stdDeviation="1" /><feColorMatrix type="matrix" values="1 0 0 0 0 0 0.5 0 0 0 0 0 0 0 0 0 0 0 1 0"/><feConvolveMatrix preserveAlpha="true" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" /></filter></defs></svg>`/*Orange Normal--*/,
	`<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><filter id="myfilter"><feGaussianBlur stdDeviation="1" /><feColorMatrix type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/><feConvolveMatrix preserveAlpha="true" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" /></filter></defs></svg>`/*Red Normal--*/,
	`<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><filter id="myfilter"><feGaussianBlur stdDeviation="1" /><feColorMatrix values="1 1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1" style="color-interpolation-filters:sRGB"/><feConvolveMatrix filterRes="100 100" style="color-interpolation-filters:sRGB" order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true"/></filter></defs></svg>`,/*Orange-Green Normal--*/
	`<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><filter id="myfilter"><feGaussianBlur stdDeviation="1" /><feColorMatrix type="saturate" values="0.10"/><feConvolveMatrix preserveAlpha="true" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" /></filter></defs></svg>`/*Black-White Normal--*/
);
//}

var selected = 0;
var state = null;

var _thread_mask = setInterval(function(){
	var video = document.getElementsByTagName("video");
	if(video.length>0){
		clearInterval(_thread_mask);
		addMask();
	}
}, 50);

window.addEventListener('keydown', function(kevent){
	if(kevent.keyCode==120){//F9
		P2P();
	}
});

function addMask(){
	if(location.href.indexOf("youtube.com")>0 || location.href.indexOf("youtube-nocookie.com")>0)
		if (document.getElementById('ytp-video-filters-htcom') == null) {
			var video = document.getElementsByTagName("video");
			if (video.length > 0) {
				var holder = video[0].parentElement.parentElement;
				var filter = document.createElement("div");

				filter.setAttribute("id", "ytp-video-filters-htcom");
				filter.style.position = "absolute";
				filter.style.width = "100%";
				filter.style.height = "100%";
				filter.style.top = 0;
				filter.style.left = 0;
				filter.style.zIndex = "10";
				filter.style.pointerEvents = "none";
				filter.style.background = filters[selected];
				holder.appendChild(filter);
			}
		}
}

function applyFilter(index, manual) {
	var videos = document.getElementsByTagName("video");
	if (videos.length > 0) {
		var video = videos[0];
		var y = videos[0].parentElement;
		var filter = document.getElementById("ytp-video-filters-htcom");
		var len = filters.length;
		var lenSvg = svgfilter.length;

		if (filter != null && filter != undefined) {
			if (index < lenSvg) {
                                filter.innerHTML = svgfilter[index];
				video.style.filter = "url(#myfilter)";
				filter.style.background = "";
				filter.style.backgroundSize = 'unset';
				y.style.filter = '';
				
			} else {
				video.style.filter = "";
				filter.style.background = filters[index - lenSvg];
				y.style.filter = '';
				filter.style.backgroundSize = 'cover';								
			}
		}
	}
}

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.youtube_filter_selected_index !== undefined) {
			selected = request.youtube_filter_selected_index;
			var manual = null;
			if(request.youtube_video_filters_manual!==undefined)
				manual = request.youtube_video_filters_manual; 
			var _thread_apply_filter = setInterval(function(){
				if (document.getElementById('ytp-video-filters-htcom') != null){
					clearInterval(_thread_apply_filter);
					applyFilter(selected, manual);
				}
			}, 50);
		}
		if (request.youtube_darkmode_clicked !== undefined) {
			state = ((request.youtube_darkmode_clicked === "true") || (request.youtube_darkmode_clicked === true) ? true : false);
			if(window.self == window.top && window.location.hostname.indexOf(".youtube.com")>=0){//not in iframe
				toggleDarkMode(state);
			}
		}
	}
);

function toggleDarkMode(s) {
	if (s == true) {
		document.documentElement.removeAttribute("style");
		document.documentElement.setAttribute("style", "font-size: 10px; font-family: Roboto, Arial, sans-serif; background-color: rgb(19, 19, 19);");
		document.documentElement.setAttribute("dark", "true");

		var masthead = document.getElementById('masthead');
		if(masthead!=null&&masthead!=undefined){
			masthead.setAttribute("style", "--yt-swatch-primary:rgb(35,35,35); --yt-swatch-primary-darker:rgb(32,32,32); --yt-swatch-text:rgb(255,255,255); --yt-swatch-important-text:rgb(255,255,255); --yt-swatch-input-text:rgba(255,255,255,1); --yt-swatch-textbox-bg:rgba(19,19,19,1); --yt-swatch-logo-override:rgb(255,255,255); --yt-swatch-icon-color:rgba(136,136,136,1);");
			masthead.setAttribute("dark", "");
		}
	} else {
		document.documentElement.removeAttribute("style");
		document.documentElement.setAttribute("style", "font-size: 10px; font-family: Roboto, Arial, sans-serif; background-color: rgb(255, 255, 255);");
		document.documentElement.removeAttribute("dark");

		var masthead = document.getElementById('masthead');
		if(masthead!=null&&masthead!=undefined){
			masthead.setAttribute("style", "--yt-swatch-primary:rgb(255,255,255); --yt-swatch-primary-darker:rgb(230,230,230); --yt-swatch-text:rgba(17,17,17,0.4); --yt-swatch-input-text:rgba(17,17,17,1); --yt-swatch-textbox-bg:rgba(255,255,255,1); --yt-swatch-icon-color:rgba(136,136,136,1)");
			masthead.removeAttribute("dark");
		}
	}
	forceMasthead2Dark(state);
}

function forceMasthead2Dark(s){
	var _mh = document.getElementById('forceMasthead2Dark');
	if(_mh!=null){
		_mh.remove();
	}
	var style = document.createElement('style');
	style.setAttribute('id', 'forceMasthead2Dark');
	style.type = "text/css";
	if(s==true){
		var css = `
			ytd-masthead#masthead{
				--yt-swatch-primary:rgb(35,35,35) !important; 
				--yt-swatch-primary-darker:rgb(32,32,32) !important; 
				--yt-swatch-text:rgb(255,255,255) !important; 
				--yt-swatch-important-text:rgb(255,255,255) !important; 
				--yt-swatch-input-text:rgba(255,255,255,1) !important; 
				--yt-swatch-textbox-bg:rgba(19,19,19,1) !important; 
				--yt-swatch-logo-override:rgb(255,255,255) !important; 
				--yt-swatch-icon-color:rgba(136,136,136,1) !important;
			}
			paper-button, ytd-guide-entry-renderer[active], ytd-topbar-logo-renderer#logo{filter:hue-rotate(45deg) !important;}
		`;
		style.appendChild(document.createTextNode(css));
	}else{
		var css = `
			ytd-masthead#masthead{
				--yt-swatch-primary:rgb(255,255,255) !important; 
				--yt-swatch-primary-darker:rgb(230,230,230) !important; 
				--yt-swatch-text:rgba(17,17,17,0.4) !important; 
				--yt-swatch-input-text:rgba(17,17,17,1) !important; 
				--yt-swatch-textbox-bg:rgba(255,255,255,1) !important; 
				--yt-swatch-icon-color:rgba(136,136,136,1) !important;
			}
		`;
		style.appendChild(document.createTextNode(css));
	}
	document.body.appendChild(style);
}

function P2P(){//F9
	//if(document.pictureInPictureEnabled){	
		video = document.querySelector('video');	
		video.requestPictureInPicture();
	//}
}

