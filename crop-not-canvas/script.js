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
const imageContainer = document.getElementById('imageContainer');
const displayedImage = document.getElementById('displayedImage');

const overlayTop = document.getElementById('overlayTop');
const overlayLeft = document.getElementById('overlayLeft');
const overlayRight = document.getElementById('overlayRight');
const overlayBottom = document.getElementById('overlayBottom');

let imgLoaded = false;
let origWidth = 0, origHeight = 0;
let imgWidth = 0, imgHeight = 0;
let imgOffsetX = 0, imgOffsetY = 0;

let box = { x: 0, y: 0, w: 150, h: 150, visible: false };

let action = null;
let pointerStart = { x: 0, y: 0 };
let boxStart = null;

function fitImageToContainer() {
  const stageRect = stage.getBoundingClientRect();
  const containerW = stageRect.width;
  const containerH = stageRect.height;

  const scale = Math.min(containerW / origWidth, containerH / origHeight);

  imgWidth = Math.round(origWidth * scale);
  imgHeight = Math.round(origHeight * scale);

  displayedImage.style.width = imgWidth + 'px';
  displayedImage.style.height = imgHeight + 'px';

  const imgLeft = (containerW - imgWidth) / 2;
  const imgTop = (containerH - imgHeight) / 2;
  imgOffsetX = imgLeft;
  imgOffsetY = imgTop;
  imageContainer.style.left = imgLeft + 'px';
  imageContainer.style.top = imgTop + 'px';

  // Cập nhật kích thước box mặc định
  const initialW = Math.round(imgWidth * 0.5);
  const initialH = Math.round(imgHeight * 0.5);
  box.w = initialW;
  box.h = initialH;
  box.x = Math.round((imgWidth - box.w) / 2);
  box.y = Math.round((imgHeight - box.h) / 2);
  box.visible = true;
  updateCropBoxUI();
}

function showChoose() {
  document.getElementById('chooseWrapper').style.display = 'block';
  cropBox.style.display = 'none';
  imageContainer.style.display = 'none';
  [overlayTop, overlayLeft, overlayRight, overlayBottom].forEach(o => o.style.display = 'none');
}

function showEditorAfterLoad() {
  document.getElementById('chooseWrapper').style.display = 'none';
  cropBox.style.display = 'block';
  imageContainer.style.display = 'block';
  [overlayTop, overlayLeft, overlayRight, overlayBottom].forEach(o => o.style.display = 'block');
}

chooseBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  const url = URL.createObjectURL(f);
  displayedImage.onload = () => {
    imgLoaded = true;
    origWidth = displayedImage.naturalWidth;
    origHeight = displayedImage.naturalHeight;
    origSizeEl.textContent = `Kích thước gốc: ${origWidth} x ${origHeight} px`;
    
    fitImageToContainer();
    showEditorAfterLoad();
  };
  displayedImage.onerror = () => alert('Không thể đọc file ảnh.');
  displayedImage.src = url;
});

window.addEventListener('resize', () => {
  if (!imgLoaded) return;
  const prevW = imgWidth || 1, prevH = imgHeight || 1;
  const rel = {
    x: box.x / prevW,
    y: box.y / prevH,
    w: box.w / prevW,
    h: box.h / prevH,
  };
  fitImageToContainer();
  box.x = Math.round(rel.x * imgWidth);
  box.y = Math.round(rel.y * imgHeight);
  box.w = Math.round(rel.w * imgWidth);
  box.h = Math.round(rel.h * imgHeight);
  constrainBox();
  updateCropBoxUI();
});

function updateCropBoxUI() {
  if (!box.visible) { cropBox.style.display = 'none'; return; }
  cropBox.style.display = 'block';
  cropBox.style.width = box.w + 'px';
  cropBox.style.height = box.h + 'px';
  cropBox.style.left = (imgOffsetX + box.x) + 'px';
  cropBox.style.top = (imgOffsetY + box.y) + 'px';
  
  const origW = Math.max(1, Math.round(box.w / (imgWidth / origWidth)));
  const origH = Math.max(1, Math.round(box.h / (imgHeight / origHeight)));
  boxLabel.textContent = `${origW} × ${origH} px`;

  inputW.value = origW;
  inputH.value = origH;
  inputX.value = Math.max(0, Math.round(box.x / (imgWidth / origWidth)));
  inputY.value = Math.max(0, Math.round(box.y / (imgHeight / origHeight)));

  updateOverlays();
}

function constrainBox() {
  if (box.w > imgWidth) box.w = imgWidth;
  if (box.h > imgHeight) box.h = imgHeight;
  if (box.w < 10) box.w = 10;
  if (box.h < 10) box.h = 10;
  if (box.x < 0) box.x = 0;
  if (box.y < 0) box.y = 0;
  if (box.x + box.w > imgWidth) box.x = Math.max(0, imgWidth - box.w);
  if (box.y + box.h > imgHeight) box.y = Math.max(0, imgHeight - box.h);
}

function updateOverlays() {
  const stageRect = stage.getBoundingClientRect();
  const stageW = stageRect.width;
  const stageH = stageRect.height;
  const cropTop = imgOffsetY + box.y;
  const cropLeft = imgOffsetX + box.x;
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

  const show = box.visible && imgLoaded;
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
    if (!imgLoaded) return;
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

    const scaleX = imgWidth / origWidth;
    const scaleY = imgHeight / origHeight;
    
    box.w = Math.round(w * scaleX);
    box.h = Math.round(h * scaleY);
    box.x = Math.round(x * scaleX);
    box.y = Math.round(y * scaleY);

    constrainBox();
    updateCropBoxUI();
  });
});

getValueBtn.addEventListener('click', () => {
  if (!imgLoaded) { 
    alert('Chưa có ảnh để lấy thông số.'); 
    return; 
  }

  const w = parseInt(inputW.value);
  const h = parseInt(inputH.value);
  const x = parseInt(inputX.value);
  const y = parseInt(inputY.value);

  alert(`Thông số vùng chọn:\nChiều rộng: ${w}px\nChiều cao: ${h}px\nVị trí X: ${x}px\nVị trí Y: ${y}px`);
});

resetBtn.addEventListener('click', () => {
  if (!imgLoaded) return;
  box.w = Math.round(imgWidth * 0.5);
  box.h = Math.round(imgHeight * 0.5);
  box.x = Math.round((imgWidth - box.w) / 2);
  box.y = Math.round((imgHeight - box.h) / 2);
  updateCropBoxUI();
  if (window.innerWidth <= 768) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

clearBtn.addEventListener('click', () => {
  imgLoaded = false;
  origWidth = origHeight = 0;
  displayedImage.src = '';
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