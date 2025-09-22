const fileInput = document.getElementById('fileInput');
const chooseBtn = document.getElementById('chooseBtn');
const stage = document.getElementById('stage');
const cropBox = document.getElementById('cropBox');
const boxLabel = document.getElementById('boxLabel');
const inputW = document.getElementById('inputW');
const inputH = document.getElementById('inputH');
const inputX = document.getElementById('inputX');
const inputY = document.getElementById('inputY');
const getValueBtn = document.getElementById('getValueBtn');
const resetBtn = document.getElementById('resetBtn');
const clearBtn = document.getElementById('clearBtn');
const origSizeEl = document.getElementById('origSize');
const mediaContainer = document.getElementById('mediaContainer');
const displayedVideo = document.getElementById('displayedVideo');

const overlayTop = document.getElementById('overlayTop');
const overlayLeft = document.getElementById('overlayLeft');
const overlayRight = document.getElementById('overlayRight');
const overlayBottom = document.getElementById('overlayBottom');

let mediaLoaded = false;
let origWidth = 0, origHeight = 0;
let mediaWidth = 0, mediaHeight = 0;
let mediaOffsetX = 0, mediaOffsetY = 0;

let box = { x: 0, y: 0, w: 150, h: 150, visible: false };

let action = null;
let pointerStart = { x: 0, y: 0 };
let boxStart = null;

function fitMediaToContainer() {
  const stageRect = stage.getBoundingClientRect();
  const containerW = stageRect.width;
  const containerH = stageRect.height;

  const scale = Math.min(containerW / origWidth, containerH / origHeight);

  mediaWidth = Math.round(origWidth * scale);
  mediaHeight = Math.round(origHeight * scale);

  displayedVideo.style.width = mediaWidth + 'px';
  displayedVideo.style.height = mediaHeight + 'px';

  const mediaLeft = (containerW - mediaWidth) / 2;
  const mediaTop = (containerH - mediaHeight) / 2;
  mediaOffsetX = mediaLeft;
  mediaOffsetY = mediaTop;
  mediaContainer.style.left = mediaLeft + 'px';
  mediaContainer.style.top = mediaTop + 'px';

  // Cập nhật kích thước box mặc định
  const initialW = Math.round(mediaWidth * 0.5);
  const initialH = Math.round(mediaHeight * 0.5);
  box.w = initialW;
  box.h = initialH;
  box.x = Math.round((mediaWidth - box.w) / 2);
  box.y = Math.round((mediaHeight - box.h) / 2);
  box.visible = true;
  updateCropBoxUI();
}

function showChoose() {
  document.getElementById('chooseWrapper').style.display = 'block';
  cropBox.style.display = 'none';
  mediaContainer.style.display = 'none';
  [overlayTop, overlayLeft, overlayRight, overlayBottom].forEach(o => o.style.display = 'none');
}

function showEditorAfterLoad() {
  document.getElementById('chooseWrapper').style.display = 'none';
  cropBox.style.display = 'block';
  mediaContainer.style.display = 'block';
  [overlayTop, overlayLeft, overlayRight, overlayBottom].forEach(o => o.style.display = 'block');
}

chooseBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  const url = URL.createObjectURL(f);
  
  // Đặt sự kiện khi video đã tải xong metadata
  displayedVideo.onloadedmetadata = () => {
    mediaLoaded = true;
    origWidth = displayedVideo.videoWidth;
    origHeight = displayedVideo.videoHeight;
    origSizeEl.textContent = `Kích thước gốc: ${origWidth} x ${origHeight} px`;
    
    fitMediaToContainer();
    showEditorAfterLoad();
  };
  
  displayedVideo.onerror = () => alert('Không thể đọc file video.');
  displayedVideo.src = url;
  displayedVideo.load();
});

window.addEventListener('resize', () => {
  if (!mediaLoaded) return;
  const prevW = mediaWidth || 1, prevH = mediaHeight || 1;
  const rel = {
    x: box.x / prevW,
    y: box.y / prevH,
    w: box.w / prevW,
    h: box.h / prevH,
  };
  fitMediaToContainer();
  box.x = Math.round(rel.x * mediaWidth);
  box.y = Math.round(rel.y * mediaHeight);
  box.w = Math.round(rel.w * mediaWidth);
  box.h = Math.round(rel.h * mediaHeight);
  constrainBox();
  updateCropBoxUI();
});

function updateCropBoxUI() {
  if (!box.visible) { cropBox.style.display = 'none'; return; }
  cropBox.style.display = 'block';
  cropBox.style.width = box.w + 'px';
  cropBox.style.height = box.h + 'px';
  cropBox.style.left = (mediaOffsetX + box.x) + 'px';
  cropBox.style.top = (mediaOffsetY + box.y) + 'px';
  
  const origW = Math.max(1, Math.round(box.w / (mediaWidth / origWidth)));
  const origH = Math.max(1, Math.round(box.h / (mediaHeight / origHeight)));
  boxLabel.textContent = `${origW} × ${origH} px`;

  inputW.value = origW;
  inputH.value = origH;
  inputX.value = Math.max(0, Math.round(box.x / (mediaWidth / origWidth)));
  inputY.value = Math.max(0, Math.round(box.y / (mediaHeight / origHeight)));

  updateOverlays();
}

function constrainBox() {
  if (box.w > mediaWidth) box.w = mediaWidth;
  if (box.h > mediaHeight) box.h = mediaHeight;
  if (box.w < 10) box.w = 10;
  if (box.h < 10) box.h = 10;
  if (box.x < 0) box.x = 0;
  if (box.y < 0) box.y = 0;
  if (box.x + box.w > mediaWidth) box.x = Math.max(0, mediaWidth - box.w);
  if (box.y + box.h > mediaHeight) box.y = Math.max(0, mediaHeight - box.h);
}

function updateOverlays() {
  const stageRect = stage.getBoundingClientRect();
  const stageW = stageRect.width;
  const stageH = stageRect.height;
  const cropTop = mediaOffsetY + box.y;
  const cropLeft = mediaOffsetX + box.x;
  const cropRight = cropLeft + box.w;
  const cropBottom = cropTop + box.h;

  overlayTop.style.left = '0px';
  overlayTop.style.top = '0px';
  overlayTop.style.width = stageW + 'px';
  overlayTop.style.height = Math.max(0, cropTop) + 'px';

  overlayBottom.style.left = '0px';
  overlayBottom.style.top = Math.max(0, cropBottom) + 'px';
  overlayBottom.style.width = stageW + 'px';
  overlayBottom.style.height = Math.max(0, stageH - cropBottom) + 'px';

  overlayLeft.style.left = '0px';
  overlayLeft.style.top = Math.max(0, cropTop) + 'px';
  overlayLeft.style.width = Math.max(0, cropLeft) + 'px';
  overlayLeft.style.height = Math.max(0, box.h) + 'px';

  overlayRight.style.left = Math.max(0, cropRight) + 'px';
  overlayRight.style.top = Math.max(0, cropTop) + 'px';
  overlayRight.style.width = Math.max(0, stageW - cropRight) + 'px';
  overlayRight.style.height = Math.max(0, box.h) + 'px';

  const show = box.visible && mediaLoaded;
  [overlayTop, overlayLeft, overlayRight, overlayBottom].forEach(o => {
    o.style.display = show ? 'block' : 'none';
  });
}

cropBox.addEventListener('pointerdown', (ev) => {
  ev.preventDefault();
  const handle = ev.target.dataset.handle;
  pointerStart = { x: ev.clientX, y: ev.clientY };
  boxStart = { x: box.x, y: box.y, w: box.w, h: box.h };
  if (handle) { action = 'resize-' + handle; }
  else { action = 'move'; }
  ev.target.setPointerCapture(ev.pointerId);
});

document.addEventListener('pointermove', (ev) => {
  if (!action) return;
  const dx = ev.clientX - pointerStart.x;
  const dy = ev.clientY - pointerStart.y;

  if (action === 'move') {
    box.x = boxStart.x + dx;
    box.y = boxStart.y + dy;
    constrainBox();
    updateCropBoxUI();
  } else if (action.startsWith('resize-')) {
    const corner = action.split('-')[1];
    if (corner === 'tl') {
      box.x = boxStart.x + dx;
      box.y = boxStart.y + dy;
      box.w = boxStart.w - dx;
      box.h = boxStart.h - dy;
    } else if (corner === 'tr') {
      box.y = boxStart.y + dy;
      box.w = boxStart.w + dx;
      box.h = boxStart.h - dy;
    } else if (corner === 'bl') {
      box.x = boxStart.x + dx;
      box.w = boxStart.w - dx;
      box.h = boxStart.h + dy;
    } else if (corner === 'br') {
      box.w = boxStart.w + dx;
      box.h = boxStart.h + dy;
    } else if (corner === 't') {
      box.y = boxStart.y + dy;
      box.h = boxStart.h - dy;
    } else if (corner === 'b') {
      box.h = boxStart.h + dy;
    } else if (corner === 'l') {
      box.x = boxStart.x + dx;
      box.w = boxStart.w - dx;
    } else if (corner === 'r') {
      box.w = boxStart.w + dx;
    }
    constrainBox();
    updateCropBoxUI();
  }
});

document.addEventListener('pointerup', (ev) => {
  action = null;
});

[inputW, inputH, inputX, inputY].forEach(inp => {
  inp.addEventListener('blur', () => {
    if (!mediaLoaded) return;
    let val = parseInt(inp.value, 10);
    const MIN_VAL = 10;

    let maxVal = (inp === inputW) ? origWidth :
      (inp === inputH) ? origHeight :
        (inp === inputX) ? origWidth - MIN_VAL :
          origHeight - MIN_VAL;

    if (!val || val < MIN_VAL) {
      val = MIN_VAL;
    } else if (val > maxVal) {
      val = maxVal;
    }
    inp.value = val;

    let w = parseInt(inputW.value);
    let h = parseInt(inputH.value);
    let x = parseInt(inputX.value);
    let y = parseInt(inputY.value);

    const scaleX = mediaWidth / origWidth;
    const scaleY = mediaHeight / origHeight;
    
    box.w = Math.round(w * scaleX);
    box.h = Math.round(h * scaleY);
    box.x = Math.round(x * scaleX);
    box.y = Math.round(y * scaleY);

    constrainBox();
    updateCropBoxUI();
  });
});

getValueBtn.addEventListener('click', () => {
  if (!mediaLoaded) { 
    alert('Chưa có video để lấy thông số.'); 
    return; 
  }

  const w = parseInt(inputW.value);
  const h = parseInt(inputH.value);
  const x = parseInt(inputX.value);
  const y = parseInt(inputY.value);

  alert(`Thông số vùng chọn:\nChiều rộng: ${w}px\nChiều cao: ${h}px\nVị trí X: ${x}px\nVị trí Y: ${y}px`);
});

resetBtn.addEventListener('click', () => {
  if (!mediaLoaded) return;
  box.w = Math.round(mediaWidth * 0.5);
  box.h = Math.round(mediaHeight * 0.5);
  box.x = Math.round((mediaWidth - box.w) / 2);
  box.y = Math.round((mediaHeight - box.h) / 2);
  updateCropBoxUI();
  if (window.innerWidth <= 768) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

clearBtn.addEventListener('click', () => {
  mediaLoaded = false;
  origWidth = origHeight = 0;
  displayedVideo.src = '';
  origSizeEl.textContent = 'Kích thước gốc: —';
  showChoose();
  fileInput.value = '';
  if (window.innerWidth <= 768) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// Init UI
showChoose();
updateCropBoxUI();