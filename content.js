function addDownloadBtn() {
  const rawUrlElm = document.querySelector("#raw-url");
  if (rawUrlElm && rawUrlElm.parentElement && rawUrlElm.parentElement.insertBefore) {
    const donwloadBtnElm = document.querySelector("#download-raw-url");
    if (!donwloadBtnElm) {
      const anchor = document.createElement("a");
      anchor.id = "download-raw-url";
      anchor.classList.add("btn", "btn-sm", "BtnGroup-item");
      anchor.innerText = "Download";
      anchor.addEventListener("click", download.bind(this, rawUrlElm.href));
      rawUrlElm.parentElement.insertBefore(anchor, rawUrlElm);
    }
  }
}

function download(url){
	chrome.runtime.sendMessage({
    cmd : "download", url: url
  });
}

addDownloadBtn();

document.addEventListener("click", event => {
  if (event.target && event.target.matches && event.target.matches("td, path, svg")) {
    const cell = event.target.closest && event.target.closest("td");
    if (cell && cell.matches && cell.matches('td.icon')
      && cell.querySelector('svg.octicon-file')) {
      const { parentElement: parent } = cell;
      const a = parent && parent.querySelector("td.content a");
      const { href } = (a || {});
      if (href) {
        download(href.replace("/blob/","/raw/"));
      }
    }
  }
});

document.addEventListener('pjax:end', addDownloadBtn);