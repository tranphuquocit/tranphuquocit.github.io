document.addEventListener('DOMContentLoaded', () => {
  // Các biến DOM giữ nguyên
  const downloadButton = document.getElementById('download-button');
  const imageLoader = document.getElementById('image-loader');
  const uploadButtonPlaceholder = document.querySelector('.upload-button-placeholder');
  const imageContainer = document.getElementById('image-container');
  const imageToCrop = document.getElementById('image-to-crop');
  const cropBox = document.getElementById('crop-box');
  const widthInput = document.getElementById('width-input');
  const heightInput = document.getElementById('height-input');
  const xInput = document.getElementById('x-input');
  const yInput = document.getElementById('y-input');
  const cropButton = document.getElementById('crop-button');
  const resultCanvas = document.getElementById('result-canvas');

  let action = null;
  let startX, startY;
  let startCropBox;
  const borderWidth = 4;

  // Các hàm tải ảnh và update input không đổi
  imageLoader.addEventListener('change', (e) => {
    downloadButton.classList.add('disabled');
    downloadButton.removeAttribute('href');
    const ctx = resultCanvas.getContext('2d');
    ctx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);

    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      imageToCrop.src = event.target.result;
      imageToCrop.onload = () => {
        imageContainer.style.display = 'block';
        cropBox.style.display = 'block';
        uploadButtonPlaceholder.style.display = 'none';
        const imgWidth = imageToCrop.width;
        const imgHeight = imageToCrop.height;
        const defaultWidth = imgWidth * 0.5;
        const defaultHeight = imgHeight * 0.5;
        cropBox.style.width = `${defaultWidth - 2 * borderWidth}px`;
        cropBox.style.height = `${defaultHeight - 2 * borderWidth}px`;
        cropBox.style.left = `${(imgWidth - defaultWidth) / 2}px`;
        cropBox.style.top = `${(imgHeight - defaultHeight) / 2}px`;
        updateInputs();
      };
    };
    reader.readAsDataURL(file);
  });

  function updateInputs() {
    widthInput.value = Math.round(cropBox.clientWidth);
    heightInput.value = Math.round(cropBox.clientHeight);
    xInput.value = Math.round(cropBox.offsetLeft);
    yInput.value = Math.round(cropBox.offsetTop);
  }

  [widthInput, heightInput, xInput, yInput].forEach(input => {
    input.addEventListener('change', () => {
      if (!imageToCrop.src) return;
      const imgWidth = imageToCrop.width;
      const imgHeight = imageToCrop.height;
      let newX = parseInt(xInput.value) || 0;
      let newY = parseInt(yInput.value) || 0;
      let newWidth = parseInt(widthInput.value) || 10;
      let newHeight = parseInt(heightInput.value) || 10;
      const totalWidth = newWidth + 2 * borderWidth;
      const totalHeight = newHeight + 2 * borderWidth;
      newX = Math.max(0, Math.min(newX, imgWidth - totalWidth));
      newY = Math.max(0, Math.min(newY, imgHeight - totalHeight));
      cropBox.style.left = `${newX}px`;
      cropBox.style.top = `${newY}px`;
      cropBox.style.width = `${newWidth}px`;
      cropBox.style.height = `${newHeight}px`;
      updateInputs();
    });
  });


  // --- LOGIC MỚI: Hỗ trợ cả Chuột và Chạm ---

  // Hàm trợ giúp để lấy tọa độ từ cả hai loại sự kiện
  function getEventCoords(e) {
    return e.touches ? e.touches[0] : e;
  }

  function handleStart(e) {
    e.preventDefault();
    const coords = getEventCoords(e);
    startX = coords.clientX;
    startY = coords.clientY;
    startCropBox = {
      x: cropBox.offsetLeft,
      y: cropBox.offsetTop,
      width: cropBox.offsetWidth,
      height: cropBox.offsetHeight,
      right: cropBox.offsetLeft + cropBox.offsetWidth,
      bottom: cropBox.offsetTop + cropBox.offsetHeight
    };
    const target = e.target;
    if (target.classList.contains('handle')) {
      action = `resize-${target.id.split('-')[1]}`;
    } else if (target === cropBox) {
      action = 'move';
    }
  }

  function handleMove(e) {
    if (!action) return;
    e.preventDefault();
    const coords = getEventCoords(e);
    const dx = coords.clientX - startX;
    const dy = coords.clientY - startY;
    const imgWidth = imageToCrop.width;
    const imgHeight = imageToCrop.height;

    if (action === 'move') {
      let newX = startCropBox.x + dx;
      let newY = startCropBox.y + dy;
      newX = Math.max(0, Math.min(newX, imgWidth - startCropBox.width));
      newY = Math.max(0, Math.min(newY, imgHeight - startCropBox.height));
      cropBox.style.left = `${newX}px`;
      cropBox.style.top = `${newY}px`;
    } else { // Logic resize
      let newLeft = startCropBox.x;
      let newTop = startCropBox.y;
      let newWidth = startCropBox.width;
      let newHeight = startCropBox.height;

      if (action.includes('e')) newWidth = startCropBox.width + dx;
      if (action.includes('s')) newHeight = startCropBox.height + dy;
      if (action.includes('w')) { newWidth = startCropBox.width - dx; newLeft = startCropBox.x + dx; }
      if (action.includes('n')) { newHeight = startCropBox.height - dy; newTop = startCropBox.y + dy; }
      const minContentSize = 20;
      const minTotalSize = minContentSize + 2 * borderWidth;
      if (newWidth < minTotalSize) {
        newWidth = minTotalSize;
        if (action.includes('w')) newLeft = startCropBox.right - minTotalSize;
      }
      if (newHeight < minTotalSize) {
        newHeight = minTotalSize;
        if (action.includes('n')) newTop = startCropBox.bottom - minTotalSize;
      }
      if (newLeft < 0) {
        if (action.includes('w')) newWidth = startCropBox.right;
        newLeft = 0;
      }
      if (newTop < 0) {
        if (action.includes('n')) newHeight = startCropBox.bottom;
        newTop = 0;
      }
      if (newLeft + newWidth > imgWidth) newWidth = imgWidth - newLeft;
      if (newTop + newHeight > imgHeight) newHeight = imgHeight - newTop;

      cropBox.style.left = `${newLeft}px`;
      cropBox.style.top = `${newTop}px`;
      cropBox.style.width = `${newWidth - 2 * borderWidth}px`;
      cropBox.style.height = `${newHeight - 2 * borderWidth}px`;
    }
    updateInputs();
  }

  function handleEnd() {
    action = null;
  }

  // Gán sự kiện cho cả chuột và chạm
  imageContainer.addEventListener('mousedown', handleStart);
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseup', handleEnd);

  imageContainer.addEventListener('touchstart', handleStart, { passive: false });
  document.addEventListener('touchmove', handleMove, { passive: false });
  document.addEventListener('touchend', handleEnd);
  document.addEventListener('touchcancel', handleEnd);


  // Logic nút Crop và Tải xuống không đổi
  cropButton.addEventListener('click', () => {
    if (!imageToCrop.src || !imageToCrop.complete) {
      alert('Vui lòng tải ảnh lên trước!');
      return;
    }
    const ctx = resultCanvas.getContext('2d');
    const scaleX = imageToCrop.naturalWidth / imageToCrop.width;
    const scaleY = imageToCrop.naturalHeight / imageToCrop.height;
    const cropParams = {
      x: (cropBox.offsetLeft + borderWidth) * scaleX,
      y: (cropBox.offsetTop + borderWidth) * scaleY,
      width: cropBox.clientWidth * scaleX,
      height: cropBox.clientHeight * scaleY
    };
    resultCanvas.width = cropParams.width;
    resultCanvas.height = cropParams.height;
    ctx.drawImage(
      imageToCrop,
      cropParams.x, cropParams.y, cropParams.width, cropParams.height,
      0, 0, cropParams.width, cropParams.height
    );
    const dataUrl = resultCanvas.toDataURL('image/png');
    downloadButton.href = dataUrl;
    downloadButton.download = 'cropped-image.png';
    downloadButton.classList.remove('disabled');
  });
});