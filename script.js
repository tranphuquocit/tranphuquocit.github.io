const canvas = new fabric.Canvas("mockupCanvas", { preserveObjectStacking: true });
let designImage = null, curvedText = null, uploadedImg = null, imgGroup = null;
let cropMode = false, cropCircle = null, isEditingCrop = false;
let thumbActive = false;

const thumb = document.getElementById('thumb');
const cropModeBtn = document.getElementById('cropModeBtn');
const applyCropBtn = document.getElementById('applyCropBtn');
const editCropBtn = document.getElementById('editCropBtn');
const uncropBtn = document.getElementById('uncropBtn');
const cancelCropBtn = document.getElementById('cancelCropBtn');

fabric.Image.fromURL("canvas-mockup.webp", img => canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
  scaleX: canvas.width / img.width, scaleY: canvas.height / img.height
}));
const clipRect = new fabric.Rect({ left: 320, top: 120, width: 830, height: 1270, fill: 'transparent', selectable: false, evented: false });

/* ---------- CROP LOGIC (Final Stable Version) ---------- */

cropModeBtn.onclick = () => {
  if (!uploadedImg && !imgGroup) { alert('Hãy upload ảnh trước!'); return; }
  const target = imgGroup || uploadedImg;
  const center = target.getCenterPoint();
  const radius = Math.min(target.getScaledWidth(), target.getScaledHeight()) / 4;

  if (cropCircle) canvas.remove(cropCircle);

  cropCircle = new fabric.Circle({
    left: center.x, top: center.y, radius: radius, originX: 'center', originY: 'center',
    stroke: 'dodgerblue', strokeWidth: 2, fill: 'rgba(0,0,0,0.0)',
    selectable: true, hasControls: true
  });
  canvas.add(cropCircle);
  canvas.setActiveObject(cropCircle);

  cropMode = true;
  updateCropButtonsVisibility();
};

applyCropBtn.onclick = () => {
  if (!cropCircle) { alert('Chưa có vùng crop.'); return; }
  const sourceImage = imgGroup ? imgGroup.item(0) : uploadedImg;
  if (!sourceImage) { alert('Không tìm thấy ảnh để crop.'); return; }

  sourceImage.clone((clonedImg) => {
    const cropCenter = cropCircle.getCenterPoint();
    const cropRadius = cropCircle.radius * cropCircle.scaleX;

    const newGroup = new fabric.Group([clonedImg], {
      left: cropCenter.x,
      top: cropCenter.y,
      originX: 'center',
      originY: 'center',
    });

    newGroup.clipPath = new fabric.Circle({
      radius: cropRadius,
      originX: 'center',
      originY: 'center',
      left: 0,
      top: 0
    });

    canvas.remove(sourceImage);
    if (imgGroup) canvas.remove(imgGroup);
    canvas.remove(cropCircle);

    imgGroup = newGroup;
    uploadedImg = clonedImg;
    cropCircle = null;
    cropMode = false;

    canvas.add(imgGroup);
    canvas.setActiveObject(imgGroup);
    updateCropButtonsVisibility();
    canvas.requestRenderAll();
  });
};

const unchangedFunctions = {
  updateCropButtons: function () { const hasImage = uploadedImg || imgGroup; const isCropped = imgGroup && imgGroup.clipPath; cropModeBtn.style.display = hasImage && !isCropped && !cropMode ? 'flex' : 'none'; applyCropBtn.style.display = cropMode || isEditingCrop ? 'flex' : 'none'; editCropBtn.style.display = isCropped && !isEditingCrop ? 'flex' : 'none'; uncropBtn.style.display = isCropped && !isEditingCrop ? 'flex' : 'none'; cancelCropBtn.style.display = cropMode ? 'flex' : 'none'; applyCropBtn.innerHTML = isEditingCrop ? '✅ Hoàn tất chỉnh sửa' : '✔️ Áp dụng Crop'; },
  thumbClick: function () { if (!thumbActive) { fabric.Image.fromURL("design-test.jpg", function (img) { const designClipRect = new fabric.Rect({ left: clipRect.left, top: clipRect.top, width: clipRect.width, height: clipRect.height, absolutePositioned: true }); img.scaleToWidth(clipRect.width); img.set({ left: clipRect.left, top: clipRect.top }); designImage = new fabric.Group([img], { selectable: false, evented: false, clipPath: designClipRect }); canvas.add(designImage); canvas.sendToBack(designImage); canvas.renderAll(); thumb.classList.add("active"); thumbActive = true; }); } else { if (designImage) canvas.remove(designImage); designImage = null; thumb.classList.remove("active"); thumbActive = false; } },
  uploadChange: function (e) { const reader = new FileReader(); reader.onload = function (f) { fabric.Image.fromURL(f.target.result, function (img) { const centerX = clipRect.left + clipRect.width / 2; const centerY = clipRect.top + clipRect.height / 2; const maxW = Math.min(clipRect.width * 0.7, 700); if (img.width > maxW) img.scaleToWidth(maxW); img.set({ left: centerX, top: centerY, originX: 'center', originY: 'center' }); if (uploadedImg && !imgGroup) canvas.remove(uploadedImg); if (imgGroup) canvas.remove(imgGroup); imgGroup = null; isEditingCrop = false; uploadedImg = img; canvas.add(uploadedImg); canvas.setActiveObject(uploadedImg); unchangedFunctions.updateCropButtons(); canvas.requestRenderAll(); }); }; reader.readAsDataURL(e.target.files[0]); },
  editCropClick: function () { if (!imgGroup || !imgGroup.clipPath) return; isEditingCrop = true; const groupCenter = imgGroup.getCenterPoint(); const radius = imgGroup.clipPath.radius * imgGroup.scaleX; cropCircle = new fabric.Circle({ left: groupCenter.x, top: groupCenter.y, radius: radius, originX: 'center', originY: 'center', stroke: 'rgba(0, 191, 255, 0.8)', strokeWidth: 3, fill: 'transparent', selectable: false, evented: false }); canvas.add(cropCircle); imgGroup.set({ selectable: false, evented: false }); unchangedFunctions.updateCropButtons(); alert("Chế độ chỉnh sửa đã bật. Dùng các nút điều khiển để di chuyển/phóng to ảnh bên trong khung crop."); },
  uncropClick: function () { if (!imgGroup || !imgGroup.clipPath) { alert("Không có ảnh nào đang được crop."); return; } const image = imgGroup.item(0); const matrix = imgGroup.calcTransformMatrix(); const newPoint = fabric.util.transformPoint({ y: image.top, x: image.left }, matrix); canvas.remove(imgGroup); image.set({ left: newPoint.x, top: newPoint.y, scaleX: image.scaleX * imgGroup.scaleX, scaleY: image.scaleY * imgGroup.scaleY, angle: image.angle + imgGroup.angle, originX: 'center', originY: 'center', clipPath: null }); imgGroup = null; uploadedImg = image; canvas.add(uploadedImg); canvas.setActiveObject(uploadedImg); unchangedFunctions.updateCropButtons(); canvas.requestRenderAll(); },
  cancelCropClick: function () { if (cropCircle) canvas.remove(cropCircle); cropCircle = null; cropMode = false; unchangedFunctions.updateCropButtons(); canvas.requestRenderAll(); },
  transformObject: function (action) { let targetObj = isEditingCrop && imgGroup ? imgGroup.item(0) : canvas.getActiveObject(); if (!targetObj) return; switch (action) { case 'zoomIn': targetObj.scaleX *= 1.1; targetObj.scaleY *= 1.1; break; case 'zoomOut': targetObj.scaleX /= 1.1; targetObj.scaleY /= 1.1; break; case 'rotateLeft': targetObj.angle -= 10; break; case 'rotateRight': targetObj.angle += 10; break; case 'moveUp': targetObj.top -= 10; break; case 'moveDown': targetObj.top += 10; break; case 'moveLeft': targetObj.left -= 10; break; case 'moveRight': targetObj.left += 10; break; } targetObj.setCoords(); canvas.renderAll(); },
  setupSliderSync: function (rangeId, numberId) { const rangeInput = document.getElementById(rangeId); const numberInput = document.getElementById(numberId); rangeInput.addEventListener('input', () => { numberInput.value = rangeInput.value; this.updateCurvedText(); }); numberInput.addEventListener('input', () => { rangeInput.value = numberInput.value; this.updateCurvedText(); }); },

  // ----- MODIFIED FUNCTION START -----
  buildCurvedText: function (txt, options) {
    const chars = txt.split('');
    const items = [];
    const angleStep = options.span / Math.max(chars.length - 1, 1);
    const startAngle = options.offset - options.span / 2;

    for (let i = 0; i < chars.length; i++) {
      const angDeg = startAngle + i * angleStep;

      // Rotate the coordinate system by -90 degrees so 0 is at the top
      const angRad = (angDeg - 90) * Math.PI / 180;

      const x = options.radius * Math.cos(angRad);
      const y = options.radius * Math.sin(angRad);

      items.push(new fabric.Text(chars[i], {
        left: x,
        top: y,
        fontSize: options.fontSize,
        fill: options.color,
        // The character's angle is tangent to the curve
        angle: angDeg,
        originX: 'center',
        originY: 'center'
      }));
    }
    return new fabric.Group(items, { originX: 'center', originY: 'center' });
  },
  // ----- MODIFIED FUNCTION END -----

  updateCurvedText: function () {
    let prevState = null;
    if (curvedText) {
      prevState = {
        left: curvedText.left, top: curvedText.top,
        scaleX: curvedText.scaleX, scaleY: curvedText.scaleY,
        angle: curvedText.angle
      };
      canvas.remove(curvedText);
    }

    const options = {
      radius: parseInt(document.getElementById("radiusInput").value, 10) || 0,
      span: parseInt(document.getElementById("spanInput").value, 10) || 0,
      offset: parseInt(document.getElementById("offsetInput").value, 10) || 0,
      fontSize: parseInt(document.getElementById("fontSize").value, 10) || 60,
      color: document.getElementById("colorInput").value
    };

    const textValue = document.getElementById("textInput").value || "";
    if (textValue === "") {
      curvedText = null;
      canvas.renderAll();
      return;
    }

    curvedText = this.buildCurvedText(textValue, options);

    if (prevState) {
      curvedText.set(prevState);
    } else {
      curvedText.set({
        left: canvas.width / 2,
        top: canvas.height / 2
      });
    }

    canvas.add(curvedText);
    canvas.setActiveObject(curvedText);
    canvas.renderAll();
  }
};

updateCropButtonsVisibility = unchangedFunctions.updateCropButtons;
thumb.onclick = unchangedFunctions.thumbClick;
document.getElementById("uploadImg").onchange = unchangedFunctions.uploadChange;
editCropBtn.onclick = unchangedFunctions.editCropClick;
uncropBtn.onclick = unchangedFunctions.uncropClick;
cancelCropBtn.onclick = unchangedFunctions.cancelCropClick;
unchangedFunctions.setupSliderSync('radiusInput', 'radiusValue');
unchangedFunctions.setupSliderSync('spanInput', 'spanValue');
unchangedFunctions.setupSliderSync('offsetInput', 'offsetValue');
document.getElementById('fontSize').addEventListener('input', () => unchangedFunctions.updateCurvedText());
document.getElementById('textInput').addEventListener('input', () => unchangedFunctions.updateCurvedText());
document.getElementById('colorInput').addEventListener('input', () => unchangedFunctions.updateCurvedText());
const transformControlMap = { zoomIn: 'zoomIn', zoomOut: 'zoomOut', rotateLeft: 'rotateLeft', rotateRight: 'rotateRight', moveUp: 'moveUp', moveDown: 'moveDown', moveLeft: 'moveLeft', moveRight: 'moveRight' };
for (const id in transformControlMap) { document.getElementById(id).onclick = () => unchangedFunctions.transformObject(transformControlMap[id]); }

// Initial call to set up empty state
unchangedFunctions.updateCurvedText();
updateCropButtonsVisibility();