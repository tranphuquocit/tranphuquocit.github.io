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
    
    // State variables
    let action = null;
    let startX, startY;
    let startCropBox;
    const borderWidth = 4;

    // THAY ĐỔI QUAN TRỌNG: Biến lưu trữ tỷ lệ
    let scaleX = 1;
    let scaleY = 1;

    // --- Tải ảnh và thiết lập ban đầu ---
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

                // THAY ĐỔI QUAN TRỌNG: Tính toán và lưu trữ tỷ lệ
                scaleX = imageToCrop.naturalWidth / imageToCrop.width;
                scaleY = imageToCrop.naturalHeight / imageToCrop.height;

                // Hiển thị kích thước gốc
                originalWidthDisplay.textContent = imageToCrop.naturalWidth;
                originalHeightDisplay.textContent = imageToCrop.naturalHeight;
                
                // Đặt crop box mặc định (vẫn tính theo kích thước hiển thị)
                const imgWidth = imageToCrop.width;
                const imgHeight = imageToCrop.height;
                const defaultWidth = imgWidth * 0.6;
                const defaultHeight = imgHeight * 0.6;
                
                cropBox.style.width = `${defaultWidth - 2 * borderWidth}px`;
                cropBox.style.height = `${defaultHeight - 2 * borderWidth}px`;
                cropBox.style.left = `${(imgWidth - defaultWidth) / 2}px`;
                cropBox.style.top = `${(imgHeight - defaultHeight) / 2}px`;
                
                // Cập nhật input lần đầu (sẽ tự động scale lên kích thước gốc)
                updateInputsFromCropBox();
            };
        };
        reader.readAsDataURL(file);
    });

    // --- Các hàm chuyển đổi và cập nhật ---

    // THAY ĐỔI QUAN TRỌNG: Cập nhật input bằng cách scale-up từ crop-box
    function updateInputsFromCropBox() {
        widthInput.value = Math.round(cropBox.offsetWidth * scaleX);
        heightInput.value = Math.round(cropBox.offsetHeight * scaleY);
        xInput.value = Math.round(cropBox.offsetLeft * scaleX);
        yInput.value = Math.round(cropBox.offsetTop * scaleY);
    }
    
    // THAY ĐỔI QUAN TRỌNG: Cập nhật crop-box bằng cách scale-down từ input
    function updateCropBoxFromInputs() {
        if (!imageToCrop.src) return;
        
        // Lấy giá trị theo tọa độ gốc
        let w = parseInt(widthInput.value) || 10;
        let h = parseInt(heightInput.value) || 10;
        let x = parseInt(xInput.value) || 0;
        let y = parseInt(yInput.value) || 0;
        
        // Ràng buộc giá trị trên tọa độ gốc
        w = Math.max(10, Math.min(w, imageToCrop.naturalWidth));
        h = Math.max(10, Math.min(h, imageToCrop.naturalHeight));
        x = Math.max(0, Math.min(x, imageToCrop.naturalWidth - w));
        y = Math.max(0, Math.min(y, imageToCrop.naturalHeight - h));

        // Chuyển đổi về tọa độ hiển thị để cập nhật CSS
        const displayX = x / scaleX;
        const displayY = y / scaleY;
        const displayW = w / scaleX;
        const displayH = h / scaleY;

        cropBox.style.left = `${displayX}px`;
        cropBox.style.top = `${displayY}px`;
        cropBox.style.width = `${displayW - 2 * borderWidth}px`;
        cropBox.style.height = `${displayH - 2 * borderWidth}px`;

        // Đồng bộ lại input sau khi ràng buộc
        updateInputsFromCropBox();
    }
    [widthInput, heightInput, xInput, yInput].forEach(input => {
        input.addEventListener('change', updateCropBoxFromInputs);
    });
    
    // --- Logic kéo thả (vẫn hoạt động trên tọa độ hiển thị cho mượt mà) ---
    
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
        const imgWidth = imageToCrop.width; // Kích thước hiển thị
        const imgHeight = imageToCrop.height; // Kích thước hiển thị

        if (action === 'move') {
            let newX = startCropBox.x + dx;
            let newY = startCropBox.y + dy;
            newX = Math.max(0, Math.min(newX, imgWidth - startCropBox.w));
            newY = Math.max(0, Math.min(newY, imgHeight - startCropBox.h));
            cropBox.style.left = `${newX}px`;
            cropBox.style.top = `${newY}px`;
        } else { // Logic resize
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
        // Sau mỗi lần di chuyển, cập nhật input với giá trị đã scale
        updateInputsFromCropBox();
    }
    
    function handleEnd() { action = null; }

    // Gán sự kiện
    imageContainer.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    imageContainer.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    document.addEventListener('touchcancel', handleEnd);

    // --- Nút Crop (logic này đã đúng từ đầu vì nó đã dùng scale) ---
    cropButton.addEventListener('click', () => {
        if (!imageToCrop.src || !imageToCrop.complete) { alert('Vui lòng tải ảnh lên trước!'); return; }
        
        const ctx = resultCanvas.getContext('2d');
        // Lấy giá trị đã scale từ input để đảm bảo chính xác nhất
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
        const dataUrl = resultCanvas.toDataURL('image/jpeg', 0.9); // Lưu dưới dạng JPEG chất lượng 90%
        downloadButton.href = dataUrl;
        downloadButton.download = 'cropped-image.jpg';
        downloadButton.classList.remove('disabled');
    });
});