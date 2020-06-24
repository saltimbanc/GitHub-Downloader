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

const parentMatches = (e, s) => {
  return e && e.parentElement && e.parentElement.matches(s);
};

const selector = '[role=row] [role=gridcell].mr-3.flex-shrink-0';

document.addEventListener("click", event => {
  if (event.target && (event.target.matches(selector) || parentMatches(event.target, selector) || parentMatches(event.target.parentElement, selector))) {
    const row = event.target.closest('[role=row]');
    if (row) {
      const anchor = row.querySelector('[role=rowheader] a');
      const { href } = (anchor || {});
      if (href) {
        download(href.replace("/blob/","/raw/"));
      }
    }
  }
});

document.addEventListener('pjax:end', addDownloadBtn);