document.addEventListener('DOMContentLoaded', () => {
    // Lấy các phần tử DOM
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

    // Các phần 1, 2, 3 (tải ảnh, cập nhật input, kéo thả) giữ nguyên như trước...
    // 1. Tải ảnh lên
    imageLoader.addEventListener('change', (e) => {
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

                cropBox.style.width = `${defaultWidth}px`;
                cropBox.style.height = `${defaultHeight}px`;
                cropBox.style.left = `${(imgWidth - defaultWidth) / 2}px`;
                cropBox.style.top = `${(imgHeight - defaultHeight) / 2}px`;

                updateInputs();
            };
        };
        reader.readAsDataURL(file);
    });

    // 2. Cập nhật input
    function updateInputs() {
        widthInput.value = Math.round(cropBox.clientWidth);
        heightInput.value = Math.round(cropBox.clientHeight);
        xInput.value = Math.round(parseFloat(cropBox.style.left));
        yInput.value = Math.round(parseFloat(cropBox.style.top));
    }

    function updateCropBoxFromInputs() {
        if (!imageToCrop.src) return;
        const imgWidth = imageToCrop.width;
        const imgHeight = imageToCrop.height;
        const borderWidth = 4; // Định nghĩa độ dày border
        let newX = parseInt(xInput.value) || 0;
        let newY = parseInt(yInput.value) || 0;
        let newWidth = parseInt(widthInput.value) || 10;
        let newHeight = parseInt(heightInput.value) || 10;

        const totalWidth = newWidth + 2 * borderWidth;
        const totalHeight = newHeight + 2 * borderWidth;

        newX = Math.max(0, Math.min(newX, imgWidth - totalWidth));
        newY = Math.max(0, Math.min(newY, imgHeight - totalHeight));
        newWidth = Math.max(10, Math.min(newWidth, imgWidth - newX - 2 * borderWidth));
        newHeight = Math.max(10, Math.min(newHeight, imgHeight - newY - 2 * borderWidth));

        cropBox.style.left = `${newX}px`;
        cropBox.style.top = `${newY}px`;
        cropBox.style.width = `${newWidth}px`;
        cropBox.style.height = `${newHeight}px`;
        updateInputs();
    }
    [widthInput, heightInput, xInput, yInput].forEach(input => {
        input.addEventListener('change', updateCropBoxFromInputs);
    });

    // 3. Logic kéo/thả và thay đổi kích thước
    imageContainer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startX = e.clientX;
        startY = e.clientY;
        startCropBox = {
            x: cropBox.offsetLeft,
            y: cropBox.offsetTop,
            width: cropBox.offsetWidth,
            height: cropBox.offsetHeight
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
            const borderWidth = 4;
            let newLeft = startCropBox.x;
            let newTop = startCropBox.y;
            let newWidth = startCropBox.width;
            let newHeight = startCropBox.height;

            if (action.includes('e')) newWidth += dx;
            if (action.includes('s')) newHeight += dy;
            if (action.includes('w')) { newWidth -= dx; newLeft += dx; }
            if (action.includes('n')) { newHeight -= dy; newTop += dy; }

            newWidth = Math.max(20 + 2 * borderWidth, newWidth);
            newHeight = Math.max(20 + 2 * borderWidth, newHeight);

            if (newLeft < 0) { newWidth += newLeft; newLeft = 0; }
            if (newTop < 0) { newHeight += newTop; newTop = 0; }
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

    // --- PHẦN SỬA LỖI QUAN TRỌNG NHẤT ---
    // 4. Logic cắt ảnh
    cropButton.addEventListener('click', () => {
        if (!imageToCrop.src || !imageToCrop.complete) {
            alert('Vui lòng tải ảnh lên trước!');
            return;
        }

        const ctx = resultCanvas.getContext('2d');
        const scaleX = imageToCrop.naturalWidth / imageToCrop.width;
        const scaleY = imageToCrop.naturalHeight / imageToCrop.height;
        const borderWidth = 4; // Phải khai báo độ dày border ở đây

        // Tính toán tọa độ và kích thước bên trong border
        const cropParams = {
            // Tọa độ bắt đầu = tọa độ ngoài + độ dày border
            x: (cropBox.offsetLeft + borderWidth) * scaleX,
            y: (cropBox.offsetTop + borderWidth) * scaleY,
            // Kích thước = kích thước vùng content (clientWidth/clientHeight)
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
    });
});