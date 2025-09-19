document.addEventListener('DOMContentLoaded', () => {
    // Thêm biến cho nút download
    const downloadButton = document.getElementById('download-button');
    // Các biến khác giữ nguyên
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

    imageLoader.addEventListener('change', (e) => {
        // Vô hiệu hóa nút tải xuống khi có ảnh mới
        downloadButton.classList.add('disabled');
        downloadButton.removeAttribute('href');
        // Xóa canvas cũ
        const ctx = resultCanvas.getContext('2d');
        ctx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);

        // Logic tải ảnh lên như cũ
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

    // Các hàm update, mousedown, mousemove, mouseup giữ nguyên như phiên bản trước
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

    imageContainer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startX = e.clientX;
        startY = e.clientY;
        startCropBox = {
            x: cropBox.offsetLeft,
            y: cropBox.offsetTop,
            width: cropBox.offsetWidth,
            height: cropBox.offsetHeight,
            right: cropBox.offsetLeft + cropBox.offsetWidth,
            bottom: cropBox.offsetTop + cropBox.offsetHeight
        };
        if (e.target.classList.contains('handle')) {
            action = `resize-${e.target.id.split('-')[1]}`;
        } else if (e.target === cropBox) {
            action = 'move';
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!action) return;
        e.preventDefault();
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const imgWidth = imageToCrop.width;
        const imgHeight = imageToCrop.height;

        if (action === 'move') {
            let newX = startCropBox.x + dx;
            let newY = startCropBox.y + dy;
            newX = Math.max(0, Math.min(newX, imgWidth - startCropBox.width));
            newY = Math.max(0, Math.min(newY, imgHeight - startCropBox.height));
            cropBox.style.left = `${newX}px`;
            cropBox.style.top = `${newY}px`;
        } else {
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
    });

    document.addEventListener('mouseup', () => { action = null; });

    // --- SỬA LỖI VÀ THÊM LOGIC TẢI XUỐNG TẠI ĐÂY ---
    cropButton.addEventListener('click', () => {
        if (!imageToCrop.src || !imageToCrop.complete) {
            alert('Vui lòng tải ảnh lên trước!');
            return;
        }
        const ctx = resultCanvas.getContext('2d');
        const scaleX = imageToCrop.naturalWidth / imageToCrop.width;
        // SỬA LỖI Ở ĐÂY: imageToDToCrop -> imageToCrop
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

        // --- LOGIC MỚI: Kích hoạt nút tải xuống ---
        // Chuyển nội dung canvas thành một đường dẫn ảnh dạng base64
        const dataUrl = resultCanvas.toDataURL('image/png');

        // Gán đường dẫn cho nút và đề xuất tên tệp
        downloadButton.href = dataUrl;
        downloadButton.download = 'cropped-image.png';

        // Kích hoạt nút bằng cách xóa class 'disabled'
        downloadButton.classList.remove('disabled');
    });
});