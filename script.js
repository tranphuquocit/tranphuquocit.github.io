document.addEventListener('DOMContentLoaded', () => {
    // Các biến và hàm khác giữ nguyên...
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
    
    let action = null;
    let startX, startY;
    let startCropBox;
    const borderWidth = 4;
    let scaleX = 1;
    let scaleY = 1;

    // --- CẬP NHẬT LOGIC TẢI ẢNH ---
    imageLoader.addEventListener('change', (e) => {
        // Reset state
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

                scaleX = imageToCrop.naturalWidth / imageToCrop.width;
                scaleY = imageToCrop.naturalHeight / imageToCrop.height;

                originalWidthDisplay.textContent = imageToCrop.naturalWidth;
                originalHeightDisplay.textContent = imageToCrop.naturalHeight;
                
                // --- LOGIC MỚI CHO CROP-BOX MẶC ĐỊNH ---
                const imgWidth = imageToCrop.width;
                const imgHeight = imageToCrop.height;

                // 1. Tìm chiều ngắn hơn của ảnh hiển thị
                const shorterDim = Math.min(imgWidth, imgHeight);

                // 2. Lấy 60% của chiều ngắn hơn đó làm kích thước mặc định
                const defaultSize = shorterDim * 0.6;
                
                // 3. Đặt kích thước và vị trí cho crop-box
                cropBox.style.width = `${defaultSize - 2 * borderWidth}px`;
                cropBox.style.height = `${defaultSize - 2 * borderWidth}px`;
                cropBox.style.left = `${(imgWidth - defaultSize) / 2}px`;
                cropBox.style.top = `${(imgHeight - defaultSize) / 2}px`;
                
                updateInputsFromCropBox();
            };
        };
        reader.readAsDataURL(file);
    });

    // Các hàm còn lại giữ nguyên, không cần thay đổi
    function updateInputsFromCropBox() {
        widthInput.value = Math.round(cropBox.offsetWidth * scaleX);
        heightInput.value = Math.round(cropBox.offsetHeight * scaleY);
        xInput.value = Math.round(cropBox.offsetLeft * scaleX);
        yInput.value = Math.round(cropBox.offsetTop * scaleY);
    }
    
    function updateCropBoxFromInputs() {
        if (!imageToCrop.src) return;
        let w = parseInt(widthInput.value) || 10;
        let h = parseInt(heightInput.value) || 10;
        let x = parseInt(xInput.value) || 0;
        let y = parseInt(yInput.value) || 0;
        w = Math.max(10, Math.min(w, imageToCrop.naturalWidth));
        h = Math.max(10, Math.min(h, imageToCrop.naturalHeight));
        x = Math.max(0, Math.min(x, imageToCrop.naturalWidth - w));
        y = Math.max(0, Math.min(y, imageToCrop.naturalHeight - h));
        const displayX = x / scaleX;
        const displayY = y / scaleY;
        const displayW = w / scaleX;
        const displayH = h / scaleY;
        cropBox.style.left = `${displayX}px`;
        cropBox.style.top = `${displayY}px`;
        cropBox.style.width = `${displayW - 2 * borderWidth}px`;
        cropBox.style.height = `${displayH - 2 * borderWidth}px`;
        updateInputsFromCropBox();
    }
    [widthInput, heightInput, xInput, yInput].forEach(input => {
        input.addEventListener('change', updateCropBoxFromInputs);
    });
    function getEventCoords(e) { return e.touches ? e.touches[0] : e; }
    function handleStart(e) {
        e.preventDefault();
        const coords = getEventCoords(e);
        startX = coords.clientX;
        startY = coords.clientY;
        startCropBox = {
            x: cropBox.offsetLeft, y: cropBox.offsetTop,
            w: cropBox.offsetWidth, h: cropBox.offsetHeight,
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
            newX = Math.max(0, Math.min(newX, imgWidth - startCropBox.w));
            newY = Math.max(0, Math.min(newY, imgHeight - startCropBox.h));
            cropBox.style.left = `${newX}px`;
            cropBox.style.top = `${newY}px`;
        } else {
            let { x, y, w, h } = startCropBox;
            if (action.includes('e')) w = Math.min(startCropBox.w + dx, imgWidth - x);
            if (action.includes('s')) h = Math.min(startCropBox.h + dy, imgHeight - y);
            if (action.includes('w')) {
                let newX = Math.max(0, startCropBox.x + dx);
                w = startCropBox.right - newX; x = newX;
            }
            if (action.includes('n')) {
                let newY = Math.max(0, startCropBox.y + dy);
                h = startCropBox.bottom - newY; y = newY;
            }
            const minSize = 20;
            if (w < minSize) w = minSize;
            if (h < minSize) h = minSize;
            cropBox.style.left = `${x}px`;
            cropBox.style.top = `${y}px`;
            cropBox.style.width = `${w - (2 * borderWidth)}px`;
            cropBox.style.height = `${h - (2 * borderWidth)}px`;
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
});