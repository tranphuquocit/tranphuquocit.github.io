document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const originalWidthDisplay = document.getElementById('original-width-display');
  const originalHeightDisplay = document.getElementById('original-height-display');
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
  const loadingIndicator = document.querySelector('.loading');
  const resetButton = document.getElementById('reset-button');
  const removeButton = document.getElementById('remove-button');

  // State variables
  let action = null;
  let startX, startY;
  let startCropBox;
  const borderWidth = 4;
  let scaleX = 1;
  let scaleY = 1;
  let isFirstLoad = true;
  let currentRotation = 0;

  // Hàm cuộn lên đầu trang
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function handleLargeImage(img, maxDimension = 2000) {
    return new Promise((resolve) => {
      if (img.naturalWidth <= maxDimension && img.naturalHeight <= maxDimension) {
        resolve(img.src);
        return;
      }

      const canvas = document.createElement('canvas');
      let width = img.naturalWidth;
      let height = img.naturalHeight;

      // Scale down while maintaining aspect ratio
      if (width > height) {
        if (width > maxDimension) {
          height = Math.round(height * maxDimension / width);
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = Math.round(width * maxDimension / height);
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    });
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  imageLoader.addEventListener('change', (e) => {
    downloadButton.classList.add('disabled');
    downloadButton.removeAttribute('href');
    const ctx = resultCanvas.getContext('2d');
    ctx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
    const file = e.target.files[0];
    if (!file) return;

    loadingIndicator.style.display = 'block';
    uploadButtonPlaceholder.style.display = 'none';

    const reader = new FileReader();
    reader.onload = (event) => {
      const tempImg = new Image();
      tempImg.onload = async () => {
        // Xử lý ảnh lớn trước khi hiển thị
        const resizedDataUrl = await handleLargeImage(tempImg, 2000);
        imageToCrop.src = resizedDataUrl;
        imageToCrop.onload = () => {
          imageContainer.style.display = 'flex';
          cropBox.style.display = 'block';
          isFirstLoad = true;
          currentRotation = 0;
          loadingIndicator.style.display = 'none';
          recalculateAndSync(true);
        };
      };
      tempImg.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  function recalculateAndSync(isFirstLoadCall = false) {
    if (!imageToCrop.src || !imageToCrop.complete) return;

    const imgRect = imageToCrop.getBoundingClientRect();
    scaleX = imageToCrop.naturalWidth / imgRect.width;
    scaleY = imageToCrop.naturalHeight / imgRect.height;

    // CHỈ thiết lập crop box mặc định khi là lần đầu tải ảnh
    if (isFirstLoadCall && isFirstLoad) {
      originalWidthDisplay.textContent = imageToCrop.naturalWidth;
      originalHeightDisplay.textContent = imageToCrop.naturalHeight;

      const displayWidth = imgRect.width;
      const displayHeight = imgRect.height;
      const shorterDim = Math.min(displayWidth, displayHeight);
      const defaultSize = shorterDim * 0.6;

      const offset = getImageOffset();

      // Đặt crop box ở GIỮA ảnh (tính cả offset)
      const centerX = offset.x + (displayWidth - defaultSize) / 2;
      const centerY = offset.y + (displayHeight - defaultSize) / 2;

      cropBox.style.width = `${defaultSize - 2 * borderWidth}px`;
      cropBox.style.height = `${defaultSize - 2 * borderWidth}px`;
      cropBox.style.left = `${centerX}px`;
      cropBox.style.top = `${centerY}px`;

      updateInputsFromCropBox();
      isFirstLoad = false;
    } else {
      updateInputsFromCropBox();
    }
  }

  function updateInputsFromCropBox() {
    const offset = getImageOffset();

    // Tính toán position CHÍNH XÁC: trừ đi offset của ảnh
    const actualX = cropBox.offsetLeft - offset.x;
    const actualY = cropBox.offsetTop - offset.y;

    // Đảm bảo không âm
    const validX = Math.max(0, actualX);
    const validY = Math.max(0, actualY);

    widthInput.value = Math.round(cropBox.offsetWidth * scaleX);
    heightInput.value = Math.round(cropBox.offsetHeight * scaleY);
    xInput.value = Math.round(validX * scaleX);
    yInput.value = Math.round(validY * scaleY);
  }

  function updateCropBoxFromInputs() {
    if (!imageToCrop.src) return;

    const offset = getImageOffset();
    let w = parseInt(widthInput.value) || 0;
    let h = parseInt(heightInput.value) || 0;
    let x = parseInt(xInput.value) || 0;
    let y = parseInt(yInput.value) || 0;

    // Giới hạn giá trị nhập vào không vượt quá kích thước ảnh
    w = Math.max(0, Math.min(w, imageToCrop.naturalWidth));
    h = Math.max(0, Math.min(h, imageToCrop.naturalHeight));
    x = Math.max(0, Math.min(x, imageToCrop.naturalWidth - w));
    y = Math.max(0, Math.min(y, imageToCrop.naturalHeight - h));

    // Cập nhật giá trị input với giá trị đã được điều chỉnh
    widthInput.value = w;
    heightInput.value = h;
    xInput.value = x;
    yInput.value = y;

    // Chuyển đổi sang tọa độ hiển thị (cộng thêm offset)
    const displayX = (x / scaleX) + offset.x;
    const displayY = (y / scaleY) + offset.y;
    const displayW = w / scaleX;
    const displayH = h / scaleY;

    cropBox.style.left = `${displayX}px`;
    cropBox.style.top = `${displayY}px`;
    cropBox.style.width = `${displayW - 2 * borderWidth}px`;
    cropBox.style.height = `${displayH - 2 * borderWidth}px`;
  }

  [widthInput, heightInput, xInput, yInput].forEach(input => {
    input.addEventListener('change', updateCropBoxFromInputs);
    input.addEventListener('input', debounce(updateCropBoxFromInputs, 300));
  });

  function getEventCoords(e) { return e.touches ? e.touches[0] : e; }

  function handleStart(e) {
    e.preventDefault();
    const coords = getEventCoords(e);
    startX = coords.clientX;
    startY = coords.clientY;
    startCropBox = {
      x: cropBox.offsetLeft, y: cropBox.offsetTop,
      w: cropBox.offsetWidth, h: cropBox.offsetHeight
    };
    const target = e.target;
    if (target.classList.contains('handle')) { action = `resize-${target.id.split('-')[1]}`; }
    else if (target === cropBox) { action = 'move'; }
  }

  function getImageOffset() {
    const imgRect = imageToCrop.getBoundingClientRect();
    const containerRect = imageContainer.getBoundingClientRect();

    // Tính offset thực tế của ảnh trong container
    return {
      x: (containerRect.width - imgRect.width) / 2,
      y: (containerRect.height - imgRect.height) / 2
    };
  }

  function handleMove(e) {
    if (!action) return;
    e.preventDefault();
    const coords = getEventCoords(e);
    const dx = coords.clientX - startX;
    const dy = coords.clientY - startY;

    const offset = getImageOffset();
    const imgRect = imageToCrop.getBoundingClientRect();

    if (action === 'move') {
      let newX = startCropBox.x + dx;
      let newY = startCropBox.y + dy;

      // Ràng buộc trong phạm vi ẢNH (tính cả offset)
      newX = Math.max(offset.x, Math.min(newX, offset.x + imgRect.width - startCropBox.w));
      newY = Math.max(offset.y, Math.min(newY, offset.y + imgRect.height - startCropBox.h));

      cropBox.style.left = `${newX}px`;
      cropBox.style.top = `${newY}px`;
    } else {
      // Logic resize với ràng buộc mới
      let newLeft = startCropBox.x;
      let newTop = startCropBox.y;
      let newWidth = startCropBox.w;
      let newHeight = startCropBox.h;

      if (action.includes('e')) {
        newWidth = startCropBox.w + dx;
        if (newLeft + newWidth > offset.x + imgRect.width) {
          newWidth = offset.x + imgRect.width - newLeft;
        }
      }
      if (action.includes('s')) {
        newHeight = startCropBox.h + dy;
        if (newTop + newHeight > offset.y + imgRect.height) {
          newHeight = offset.y + imgRect.height - newTop;
        }
      }
      if (action.includes('w')) {
        newWidth = startCropBox.w - dx;
        newLeft = startCropBox.x + dx;
        if (newLeft < offset.x) {
          newWidth += newLeft - offset.x;
          newLeft = offset.x;
        }
      }
      if (action.includes('n')) {
        newHeight = startCropBox.h - dy;
        newTop = startCropBox.y + dy;
        if (newTop < offset.y) {
          newHeight += newTop - offset.y;
          newTop = offset.y;
        }
      }

      const minSize = 20;
      if (newWidth < minSize) newWidth = minSize;
      if (newHeight < minSize) newHeight = minSize;

      cropBox.style.left = `${newLeft}px`;
      cropBox.style.top = `${newTop}px`;
      cropBox.style.width = `${newWidth - (2 * borderWidth)}px`;
      cropBox.style.height = `${newHeight - (2 * borderWidth)}px`;
    }
    updateInputsFromCropBox();
  }

  function handleEnd() { action = null; }

  imageContainer.addEventListener('mousedown', handleStart);
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseup', handleEnd);
  imageContainer.addEventListener('touchstart', handleStart, { passive: false });
  document.addEventListener('touchmove', handleMove, { passive: false });
  document.addEventListener('touchend', handleEnd);
  document.addEventListener('touchcancel', handleEnd);

  cropButton.addEventListener('click', () => {
    if (!imageToCrop.src || !imageToCrop.complete) { alert('Vui lòng tải ảnh lên trước!'); return; }
    const ctx = resultCanvas.getContext('2d');
    const cropParams = {
      width: parseInt(widthInput.value),
      height: parseInt(heightInput.value),
      x: parseInt(xInput.value),
      y: parseInt(yInput.value)
    };
    resultCanvas.width = cropParams.width;
    resultCanvas.height = cropParams.height;
    ctx.drawImage(
      imageToCrop,
      cropParams.x, cropParams.y, cropParams.width, cropParams.height,
      0, 0, cropParams.width, cropParams.height
    );
    const dataUrl = resultCanvas.toDataURL('image/jpeg', 0.9);
    downloadButton.href = dataUrl;
    downloadButton.download = 'cropped-image.jpg';
    downloadButton.classList.remove('disabled');
  });

  // Reset button functionality
  resetButton.addEventListener('click', () => {
    if (!imageToCrop.src) return;

    // Cuộn lên đầu trang
    scrollToTop();

    // Reset crop box
    isFirstLoad = true;
    recalculateAndSync(true);
  });

  // Remove button functionality - XÓA ẢNH
  removeButton.addEventListener('click', () => {

    // Xóa ảnh và reset mọi thứ
    imageToCrop.src = '';
    imageContainer.style.display = 'none';
    cropBox.style.display = 'none';
    uploadButtonPlaceholder.style.display = 'block';

    // Reset các input
    widthInput.value = '802';
    heightInput.value = '802';
    xInput.value = '0';
    yInput.value = '0';

    // Reset thông tin kích thước
    originalWidthDisplay.textContent = '0';
    originalHeightDisplay.textContent = '0';

    // Reset canvas
    const ctx = resultCanvas.getContext('2d');
    ctx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);

    // Vô hiệu hóa nút download
    downloadButton.classList.add('disabled');
    downloadButton.removeAttribute('href');

    // Reset file input
    imageLoader.value = '';
    // Cuộn lên đầu trang
    scrollToTop();
  });

  window.addEventListener('resize', debounce(() => recalculateAndSync(false), 100));
});