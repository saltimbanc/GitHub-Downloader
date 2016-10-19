chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.cmd == "download"){
		$.get(request.url, function(v){
			download(request.url.match(/(?!\/)[^\/]+$/)[0],v);
		});
	}
});
function download(filename, text) {
	$("<a>").attr("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text)).attr("download", filename).css("display", "none")[0].click();
}