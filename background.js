chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.cmd == "download"){
    const { url } = request; 
    const filename = decodeURIComponent(url.match(/(?!\/)[^\/]+$/).shift());
    const extension = filename.replace(/.*\.(?=[^.]+$)/, "");
    const mime = EXTENSION_TO_MIME[extension] || `text/${extension}`;

    fetch(request.url, {
      mode: "cors",
      credentials: "include"
    }).then(response => response.blob())
      .then(blob => {
        return blob.slice(0, blob.size, mime);
      }).then((blob) => {
        chrome.downloads.download({ url: URL.createObjectURL(blob), filename });
      });
  }
});

chrome.downloads.onChanged.addListener((changes) => {
  if (changes && changes.state && changes.state.current === "complete") {
    chrome.downloads.search({
      id: changes.id
    }, (results) => {
      results.forEach((downloadItem) => {
        if (downloadItem.byExtensionId === chrome.runtime.id && downloadItem.url.startsWith("blob:")) {
          URL.revokeObjectURL(downloadItem.url);
        }
      });
    });
  }
});
