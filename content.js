function addDownloadBtn() {
  const rawUrlElm = document.querySelector('#raw-url');
  const hasDownloadBtn = hasText(rawUrlElm, 'download') || document.querySelector('#download-raw-url');
  if (!hasDownloadBtn && rawUrlElm && rawUrlElm.parentElement && rawUrlElm.parentElement.insertBefore) {
    const anchor = document.createElement('a');
    anchor.id = 'download-raw-url';
    anchor.classList.add('btn', 'btn-sm', 'BtnGroup-item');
    anchor.innerText = 'Download';
    anchor.addEventListener('click', download.bind(this, rawUrlElm.href));
    rawUrlElm.parentElement.insertBefore(anchor, rawUrlElm);
}
}

function download(url) {
  chrome.runtime.sendMessage({
    cmd : 'download', url
  });
}

const processAnchorAndDownload = (anchor) => {
  if (anchor && anchor.href && anchor.href.split && anchor.href.split('/').some((e) => (e === 'blob' || e === 'raw'))) {
    download(anchor.href.replace('/blob/','/raw/'));
  }
};

const elementMatches = (e, s) => {
  return e && e.matches && e.matches(s);
};

const isFindPage = () => {
  return location.pathname.split('/').some((e) => (e === 'find'))
};

const hasText = (e, txt) => {
  return e && e.textContent && e.textContent.trim && e.textContent.trim().toLowerCase() === txt;
}

const selector = '[role=row] [role=gridcell].mr-3.flex-shrink-0, [role=row] [role=gridcell].mr-3.flex-shrink-0 svg, [role=row] [role=gridcell].mr-3.flex-shrink-0 svg path';
const secondSelector = 'svg.octicon.octicon-file.gitHubDownloaderHovered, svg.octicon.octicon-file.gitHubDownloaderHovered path';

document.addEventListener("click", (event) => {
  if (isFindPage() && elementMatches(event.target, secondSelector)) {
    processAnchorAndDownload(event.target.closest('a'));
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  if (elementMatches(event.target, 'a#raw-url') && hasText(event.target, 'download')) {
    processAnchorAndDownload(event.target);
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  if (elementMatches(event.target, selector)) {
    const row = event.target.closest('[role=row]');
    if (row) {
      processAnchorAndDownload(row.querySelector('[role=rowheader] a'));
    }
  }
}, true);

const hover = (e) => {
  if (e && e.target && e.target.matches && e.target.matches('svg.octicon-file')) {
    e.target.classList.add('gitHubDownloaderHovered');
    e.target.style.opacity = 0;
    e.target.style.cursor = 'pointer';
    e.target.parentElement.style.backgroundImage = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAyElEQVQ4jeXSO2rDQBSF4S/CGBUpgxeRIhhDusSNC5NdzbZSBGFsd2msZYRAGi8gha7kiUBScOsDw8Dc85+582BMyU6yG7PMRgNYT9QVU4YbCPh7icke99hKvnq1Bd5xlrwOdVBiiSqAHK6iVuZAP+ANNR4DaFXFWh2eTndSt0s7P+ADT73wGhvJd+4vcMRJim4awyaAIbjACccCq9htnp25DfmMcYEbzYNZDX/lBngerIfygLK7h2l1L5EH/Pwb73VwwMs1MA6/vwUpZJgDfxwAAAAASUVORK5CYII=")';
    e.target.parentElement.style.backgroundSize = '16px 16px';
    e.target.parentElement.style.backgroundRepeat = 'no-repeat';
    if (isFindPage()) {
      e.target.parentElement.style.backgroundPosition = 'top 10px left 38px';
      e.target.parentElement.style.backgroundBlendMode = 'hue';
    }
    e.target.addEventListener('mouseleave', e => {
      e.target.classList.remove('gitHubDownloaderHovered');
      e.target.style.opacity = 1;
      e.target.parentElement.style.backgroundImage = 'none';
      e.target.parentElement.style.backgroundSize = 'initial';
      e.target.parentElement.style.backgroundPosition = 'initial';
      e.target.parentElement.style.backgroundBlendMode = 'unset';
    }, { once: true });
  }
}

document.addEventListener('mouseover', hover);
document.addEventListener('pjax:end', addDownloadBtn);
addDownloadBtn();
