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

const hover = (e) => {
  if (e && e.target && e.target.matches && e.target.matches('svg.octicon-file')) {
    e.target.style.opacity = 0;
    e.target.style.cursor = 'pointer';
    e.target.parentElement.style.backgroundImage = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAyElEQVQ4jeXSO2rDQBSF4S/CGBUpgxeRIhhDusSNC5NdzbZSBGFsd2msZYRAGi8gha7kiUBScOsDw8Dc85+582BMyU6yG7PMRgNYT9QVU4YbCPh7icke99hKvnq1Bd5xlrwOdVBiiSqAHK6iVuZAP+ANNR4DaFXFWh2eTndSt0s7P+ADT73wGhvJd+4vcMRJim4awyaAIbjACccCq9htnp25DfmMcYEbzYNZDX/lBngerIfygLK7h2l1L5EH/Pwb73VwwMs1MA6/vwUpZJgDfxwAAAAASUVORK5CYII=")';
    e.target.parentElement.style.backgroundSize = '16px 16px';
    e.target.parentElement.style.backgroundRepeat = 'no-repeat';
    e.target.addEventListener('mouseleave', e => {
      e.target.style.opacity = 1;
      e.target.parentElement.style.backgroundImage = 'none';
      e.target.parentElement.style.backgroundSize = 'initial';
    }, { once: true });
  }
}

document.addEventListener('mouseover', hover);
