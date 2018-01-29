chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.cmd == "download"){
		chrome.downloads.download({url: request.url, filename: decodeURIComponent(request.url.match(/(?!\/)[^\/]+$/)[0])});
	}
});