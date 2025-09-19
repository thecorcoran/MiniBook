document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const addTextButton = document.getElementById('add-text-button');
    const addImageButton = document.getElementById('add-image-button');
    const printButton = document.getElementById('print-button');
    const imageUploadInput = document.getElementById('image-upload-input');

    // Get template type and book from URL
    const urlParams = new URLSearchParams(window.location.search);
    const template = urlParams.get('template') || '8-page';
    const book = urlParams.get('book');

    // Page rotation mapping for 8-page book
    const pageRotations8Page = {
        'Page 5': 'rotate(180deg)', 'Page 6': 'rotate(180deg)', 'Page 7': 'rotate(180deg)', 'Back Cover': 'rotate(180deg)',
        'Page 4': 'rotate(0deg)', 'Page 3': 'rotate(0deg)', 'Page 2': 'rotate(0deg)', 'Page 1': 'rotate(0deg)',
    };

    // Page rotation mapping for 4-page book
    const pageRotations4Page = {
        'Page 4': 'rotate(180deg)', 'Cover': 'rotate(0deg)', 'Page 2': 'rotate(0deg)', 'Page 3': 'rotate(0deg)',
    };

    // Draw the template on the canvas
    drawTemplate(template);

    function drawTemplate(templateType) {
        canvas.innerHTML = '';
        const pageGrid = document.createElement('div');
        pageGrid.className = 'page-grid';

        let pageLayout = [];
        let pageRotations = {};
        let customBookData = {};

        if (templateType === '8-page') {
            pageLayout = ['Page 5', 'Page 6', 'Page 7', 'Back Cover', 'Page 4', 'Page 3', 'Page 2', 'Page 1'];
            pageRotations = pageRotations8Page;
            pageGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
            pageGrid.style.gridTemplateRows = 'repeat(2, 1fr)';
            for (let i = 1; i <= 8; i++) {
                const text = urlParams.get(`text${i}`);
                if (text) {
                    if (i === 1) customBookData['Cover'] = text;
                    else if (i === 8) customBookData['Back Cover'] = text;
                    else customBookData[`Page ${i-1}`] = text;
                }
            }
        } else if (templateType === '4-page') {
            pageLayout = ['Page 4', 'Cover', 'Page 2', 'Page 3'];
            pageRotations = pageRotations4Page;
            pageGrid.classList.add('four-page');
            pageGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            pageGrid.style.gridTemplateRows = 'repeat(2, 1fr)';
            for (let i = 1; i <= 4; i++) {
                const text = urlParams.get(`text${i}`);
                if (text) {
                    if (i === 1) customBookData['Cover'] = text;
                    else customBookData[`Page ${i}`] = text;
                }
            }
        }

        const bookData = book ? rhymingBooks[book] : customBookData;
        const isRhymingBook = !!book;

        pageLayout.forEach((pageName, index) => {
            const pageCell = document.createElement('div');
            pageCell.className = 'page-cell';
            pageCell.dataset.pageName = pageName;

            if (bookData && bookData[pageName]) {
                const textBox = document.createElement('div');
                textBox.className = 'text-box';
                textBox.textContent = bookData[pageName];
                textBox.setAttribute('contenteditable', true);
                textBox.style.width = '90%';
                textBox.style.textAlign = 'center';
                
                pageCell.appendChild(textBox);
                const container = makeResizableAndDraggable(textBox);
                
                const rotation = pageRotations[pageName] || 'rotate(0deg)';
                container.style.transform = `translate(-50%, -50%) ${rotation}`;
                container.style.transformOrigin = 'center center';

            } else {
                pageCell.innerHTML = `<span class="page-number">${pageName}</span>`;
            }

            if (index === 0) pageCell.classList.add('active-page');
            
            pageCell.addEventListener('click', () => {
                canvas.querySelectorAll('.page-cell').forEach(cell => cell.classList.remove('active-page'));
                pageCell.classList.add('active-page');
            });

            pageGrid.appendChild(pageCell);
        });

        canvas.appendChild(pageGrid);
    }

    addTextButton.addEventListener('click', () => {
        let activePage = canvas.querySelector('.active-page') || canvas.querySelector('.page-cell');
        if (!activePage) return;
        activePage.classList.add('active-page');

        const textBox = document.createElement('div');
        textBox.className = 'text-box';
        textBox.setAttribute('contenteditable', 'true');
        textBox.textContent = 'Edit me...';
        textBox.style.width = '80%';
        
        activePage.appendChild(textBox);
        const container = makeResizableAndDraggable(textBox);
        container.style.transform = 'translate(-50%, -50%)';

        textBox.focus();
        document.execCommand('selectAll', false, null);
    });

    addImageButton.addEventListener('click', () => {
        imageUploadInput.click();
    });

    imageUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                let activePage = canvas.querySelector('.active-page') || canvas.querySelector('.page-cell');
                if (!activePage) return;

                const imgElement = document.createElement('img');
                imgElement.src = e.target.result;
                imgElement.className = 'draggable-image';
                imgElement.style.width = '100px';

                activePage.appendChild(imgElement);
                const container = makeResizableAndDraggable(imgElement);
                container.style.transform = 'translate(-50%, -50%)';
            };
            reader.readAsDataURL(file);
        }
        event.target.value = '';
    });

    printButton.addEventListener('click', () => {
        window.print();
    });

    function makeResizableAndDraggable(element) {
        const container = document.createElement('div');
        container.className = 'resizable-container';
        
        container.style.position = 'absolute';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.width = element.style.width || '150px';
        container.style.height = element.style.height || 'auto';

        element.style.position = 'relative';
        element.style.top = '0';
        element.style.left = '0';
        element.style.width = '100%';
        element.style.height = '100%';
        element.style.transform = '';

        const parent = element.parentNode;
        if (parent) {
            parent.replaceChild(container, element);
        }
        container.appendChild(element);

        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle se';
        container.appendChild(resizeHandle);

        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            if (e.target.isContentEditable) return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            container.style.top = (container.offsetTop - pos2) + "px";
            container.style.left = (container.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }

        resizeHandle.onmousedown = function(e) {
            e.stopPropagation();
            e.preventDefault();
            let startX = e.clientX, startY = e.clientY;
            let startWidth = parseInt(document.defaultView.getComputedStyle(container).width, 10);
            let startHeight = parseInt(document.defaultView.getComputedStyle(container).height, 10);
            document.onmousemove = doResize;
            document.onmouseup = stopResize;
            function doResize(e) {
                container.style.width = (startWidth + e.clientX - startX) + 'px';
                container.style.height = (startHeight + e.clientY - startY) + 'px';
            }
            function stopResize() {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        };

        container.onmousedown = function(e) {
            if (e.target === container) {
                dragMouseDown(e);
            }
        };

        return container;
    }
});
