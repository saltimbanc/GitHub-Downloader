$("body").on("click","td.icon:has(svg.octicon-file)", function(){
	download($(this).parent().find("td.content a").prop("href").replace("/blob/","/raw/"));
});


$("*").on("pjax:end", function() {
	if($("#raw-url").length && !$("#download-raw-url").length){
		$("<a class='btn btn-sm BtnGroup-item' id='download-raw-url'>Download</a>").click(function(){
			download($("#raw-url").prop("href"));
		}).insertBefore($("#raw-url"));
	}
});

function download(url){
	chrome.runtime.sendMessage({cmd : "download", url: url});
}
