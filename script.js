const fileInput = document.getElementById('fileInput');
const chooseBtn = document.getElementById('chooseBtn');
const displayCanvas = document.getElementById('displayCanvas');
const stage = document.getElementById('stage');
const cropBox = document.getElementById('cropBox');
const boxLabel = document.getElementById('boxLabel');
const inputW = document.getElementById('inputW');
const inputH = document.getElementById('inputH');
const inputX = document.getElementById('inputX');
const inputY = document.getElementById('inputY');
const cropBtn = document.getElementById('cropBtn');
const previewThumb = document.getElementById('previewThumb');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const clearBtn = document.getElementById('clearBtn');
const origSizeEl = document.getElementById('origSize');

const overlayTop = document.getElementById('overlayTop');
const overlayLeft = document.getElementById('overlayLeft');
const overlayRight = document.getElementById('overlayRight');
const overlayBottom = document.getElementById('overlayBottom');

let img = new Image();
let imgLoaded = false;
let origWidth = 0, origHeight = 0;

let dispWidth = 0, dispHeight = 0;
let dispOffsetX = 0, dispOffsetY = 0;
let scale = 1;

let box = { x: 0, y: 0, w: 150, h: 150, visible: false };

let action = null;
let pointerStart = { x: 0, y: 0 };
let boxStart = null;

const ctx = displayCanvas.getContext('2d');

function fitImageToCanvas() {
  const stageRect = stage.getBoundingClientRect();
  const containerW = stageRect.width;
  const containerH = stageRect.height;

  scale = Math.min(containerW / origWidth, containerH / origHeight);

  dispWidth = Math.round(origWidth * scale);
  dispHeight = Math.round(origHeight * scale);

  displayCanvas.width = dispWidth;
  displayCanvas.height = dispHeight;
  displayCanvas.style.width = dispWidth + 'px';
  displayCanvas.style.height = dispHeight + 'px';
  displayCanvas.style.position = 'absolute';

  const canvasLeft = (containerW - dispWidth) / 2;
  const canvasTop = (containerH - dispHeight) / 2;
  dispOffsetX = canvasLeft;
  dispOffsetY = canvasTop;
  displayCanvas.style.left = canvasLeft + 'px';
  displayCanvas.style.top = canvasTop + 'px';

  ctx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
  ctx.drawImage(img, 0, 0, origWidth, origHeight, 0, 0, dispWidth, dispHeight);
}

function showChoose() {
  document.getElementById('chooseWrapper').style.display = 'block';
  cropBox.style.display = 'none';
  [overlayTop, overlayLeft, overlayRight, overlayBottom].forEach(o => o.style.display = 'none');
}
function showEditorAfterLoad() {
  document.getElementById('chooseWrapper').style.display = 'none';
  cropBox.style.display = 'block';
}

chooseBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  const url = URL.createObjectURL(f);
  img = new Image();
  img.onload = () => {
    imgLoaded = true;
    origWidth = img.naturalWidth;
    origHeight = img.naturalHeight;
    origSizeEl.textContent = `Kích thước gốc: ${origWidth} x ${origHeight} px`;
    fitImageToCanvas();

    const initialW = Math.round(dispWidth * 0.5);
    const initialH = Math.round(dispHeight * 0.5);
    box.w = initialW;
    box.h = initialH;
    box.x = Math.round((dispWidth - box.w) / 2);
    box.y = Math.round((dispHeight - box.h) / 2);
    box.visible = true;
    updateCropBoxUI();
    showEditorAfterLoad();
    previewThumb.innerHTML = '';
    downloadBtn.disabled = true;
    [overlayTop, overlayLeft, overlayRight, overlayBottom].forEach(o => o.style.display = 'block');
  };
  img.onerror = () => alert('Không thể đọc file ảnh.');
  img.src = url;
});

window.addEventListener('resize', () => {
  if (!imgLoaded) return;
  const prevW = dispWidth || 1, prevH = dispHeight || 1;
  const rel = {
    x: box.x / prevW,
    y: box.y / prevH,
    w: box.w / prevW,
    h: box.h / prevH,
  };
  fitImageToCanvas();
  box.x = Math.round(rel.x * dispWidth);
  box.y = Math.round(rel.y * dispHeight);
  box.w = Math.round(rel.w * dispWidth);
  box.h = Math.round(rel.h * dispHeight);
  constrainBox();
  updateCropBoxUI();
});

function updateCropBoxUI() {
  if (!box.visible) { cropBox.style.display = 'none'; return; }
  cropBox.style.display = 'block';
  cropBox.style.width = box.w + 'px';
  cropBox.style.height = box.h + 'px';
  cropBox.style.left = (dispOffsetX + box.x) + 'px';
  cropBox.style.top = (dispOffsetY + box.y) + 'px';
  const origW = Math.max(1, Math.round(box.w / scale));
  const origH = Math.max(1, Math.round(box.h / scale));
  boxLabel.textContent = `${origW} × ${origH} px`;

  inputW.value = origW;
  inputH.value = origH;
  inputX.value = Math.max(0, Math.round(box.x / scale));
  inputY.value = Math.max(0, Math.round(box.y / scale));

  updateOverlays();
}

function constrainBox() {
  if (box.w > dispWidth) box.w = dispWidth;
  if (box.h > dispHeight) box.h = dispHeight;
  if (box.w < 0) box.w = 0;
  if (box.h < 0) box.h = 0;
  if (box.x < 0) box.x = 0;
  if (box.y < 0) box.y = 0;
  if (box.x + box.w > dispWidth) box.x = Math.max(0, dispWidth - box.w);
  if (box.y + box.h > dispHeight) box.y = Math.max(0, dispHeight - box.h);
}

function updateOverlays() {
  const stageRect = stage.getBoundingClientRect();
  const stageW = stageRect.width;
  const stageH = stageRect.height;
  const cropTop = dispOffsetY + box.y;
  const cropLeft = dispOffsetX + box.x;
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

    box.w = Math.round(w * scale);
    box.h = Math.round(h * scale);
    box.x = Math.round(x * scale);
    box.y = Math.round(y * scale);

    constrainBox();
    updateCropBoxUI();
  });
});

cropBtn.addEventListener('click', () => {
  if (!imgLoaded) { alert('Chưa có ảnh để cắt.'); return; }

  const sx = Math.round(box.x / scale);
  const sy = Math.round(box.y / scale);
  const sw = Math.round(box.w / scale);
  const sh = Math.round(box.h / scale);

  if (sw <= 0 || sh <= 0) { alert('Vùng cắt không hợp lệ'); return; }

  const outCanvas = document.createElement('canvas');
  outCanvas.width = sw;
  outCanvas.height = sh;
  const outCtx = outCanvas.getContext('2d');

  outCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

  const dataUrl = outCanvas.toDataURL('image/png');
  previewThumb.innerHTML = `<img src="${dataUrl}" alt="preview" />`;

  downloadBtn.disabled = false;
  downloadBtn.onclick = () => {
    outCanvas.toBlob(blob => {
      const a = document.createElement('a');
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = 'cropped.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };
});

resetBtn.addEventListener('click', () => {
  if (!imgLoaded) return;
  box.w = Math.round(dispWidth * 0.5);
  box.h = Math.round(dispHeight * 0.5);
  box.x = Math.round((dispWidth - box.w) / 2);
  box.y = Math.round((dispHeight - box.h) / 2);
  updateCropBoxUI();
  previewThumb.innerHTML = '';
  downloadBtn.disabled = true;
  if (window.innerWidth <= 768) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

clearBtn.addEventListener('click', () => {
  img = new Image();
  imgLoaded = false;
  origWidth = origHeight = 0;
  displayCanvas.width = displayCanvas.height = 0;
  previewThumb.innerHTML = '';
  origSizeEl.textContent = 'Kích thước gốc: —';
  showChoose();
  downloadBtn.disabled = true;
  fileInput.value = '';
  if (window.innerWidth <= 768) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// Init UI
showChoose();
updateCropBoxUI();