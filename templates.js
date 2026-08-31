// @ts-nocheck
document.addEventListener('DOMContentLoaded', () => {
    const learnToReadContainer = document.getElementById('rhyming-books-container');
    const blendsAndSegmentsContainer = document.getElementById('blends-and-segments-books-container');
    const findItDrawItContainer = document.getElementById('find-it-draw-it-books-container');

    // PDF Generation Function
    async function downloadPDF(book, bookKey, bookType) {
        try {
            const { PDFDocument, rgb, StandardFonts, degrees } = PDFLib;

            const pdfDoc = await PDFDocument.create();
            // Standard US Letter Landscape: 11" x 8.5" (792pt x 612pt)
            const pageWidth = 11 * 72;
            const pageHeight = 8.5 * 72;
            const page = pdfDoc.addPage([pageWidth, pageHeight]);

            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

            // Imposition layout:
            // Top Row (180° rotation): Page 4, Page 5, Page 6, Page 7
            // Bottom Row (0° rotation): Page 3, Page 2, Page 1 (Front Cover), Back Cover (Page 8)
            const pageLayout = ['Page 4', 'Page 5', 'Page 6', 'Page 7', 'Page 3', 'Page 2', 'Page 1', 'Back Cover'];

            const cellWidth = pageWidth / 4;   // 198 pt
            const cellHeight = pageHeight / 2; // 306 pt
            const margin = 22; // 0.3in margin away from folds/edges
            const maxStoryTextWidth = cellWidth - (margin * 2); // 154 pt

            // Draw fold and cut guidelines
            const guideColor = rgb(0.82, 0.82, 0.82);
            const cutColor = rgb(0.25, 0.25, 0.25);

            // Vertical fold lines
            for (let c = 1; c < 4; c++) {
                page.drawLine({
                    start: { x: c * cellWidth, y: 0 },
                    end: { x: c * cellWidth, y: pageHeight },
                    thickness: 0.5,
                    color: guideColor,
                    dashArray: [2, 3]
                });
            }

            // Outer horizontal fold lines (not cut)
            page.drawLine({
                start: { x: 0, y: cellHeight },
                end: { x: cellWidth, y: cellHeight },
                thickness: 0.5,
                color: guideColor,
                dashArray: [2, 3]
            });
            page.drawLine({
                start: { x: 3 * cellWidth, y: cellHeight },
                end: { x: 4 * cellWidth, y: cellHeight },
                thickness: 0.5,
                color: guideColor,
                dashArray: [2, 3]
            });

            // Center horizontal CUT slit (between columns 1 and 3 along the center fold)
            page.drawLine({
                start: { x: cellWidth, y: cellHeight },
                end: { x: 3 * cellWidth, y: cellHeight },
                thickness: 1.2,
                color: cutColor,
                dashArray: [4, 4]
            });

            // Helper function to draw multiline centered text horizontally and vertically in a cell
            function drawCenteredInCell(text, font, size, cellX, cellY, cellW, cellH, rotateDeg = 0) {
                const words = text.split(' ');
                const maxLineW = cellW - (margin * 2);
                let lines = [];
                let currentLine = '';

                for (const word of words) {
                    const testLine = currentLine ? `${currentLine} ${word}` : word;
                    const testWidth = font.widthOfTextAtSize(testLine, size);
                    if (testWidth <= maxLineW) {
                        currentLine = testLine;
                    } else {
                        if (currentLine) lines.push(currentLine);
                        currentLine = word;
                    }
                }
                if (currentLine) lines.push(currentLine);

                const lineHeight = size * 1.35;
                const totalTextHeight = lines.length * lineHeight;

                if (rotateDeg === 0) {
                    // Start Y for top line to vertically center the entire block
                    const startY = cellY + (cellH / 2) + (totalTextHeight / 2) - (size * 0.85);

                    lines.forEach((line, idx) => {
                        const lineWidth = font.widthOfTextAtSize(line, size);
                        const lineX = cellX + (cellW - lineWidth) / 2;
                        const lineY = startY - (idx * lineHeight);

                        page.drawText(line, {
                            x: lineX,
                            y: lineY,
                            font: font,
                            size: size,
                            color: rgb(0, 0, 0),
                            rotate: degrees(0)
                        });
                    });
                } else if (rotateDeg === 180) {
                    // For 180 degree rotation around center
                    const startY = cellY + (cellH / 2) - (totalTextHeight / 2) + (size * 0.85);

                    lines.forEach((line, idx) => {
                        const lineWidth = font.widthOfTextAtSize(line, size);
                        const lineX = cellX + cellW - (cellW - lineWidth) / 2;
                        const lineY = startY + (idx * lineHeight);

                        page.drawText(line, {
                            x: lineX,
                            y: lineY,
                            font: font,
                            size: size,
                            color: rgb(0, 0, 0),
                            rotate: degrees(180)
                        });
                    });
                }
            }

            // Draw each page cell
            for (let i = 0; i < pageLayout.length; i++) {
                const pageName = pageLayout[i];
                const col = i % 4;
                const row = Math.floor(i / 4); // 0 = top row, 1 = bottom row

                const x = col * cellWidth;
                const y = (1 - row) * cellHeight; // row 0: y=306, row 1: y=0

                let text = '';
                let isCover = false;
                let isBackCover = false;
                let pageNumberLabel = '';

                if (pageName === 'Page 1') {
                    text = book.Cover || 'Title Page';
                    isCover = true;
                } else if (pageName === 'Back Cover') {
                    text = book.TheEnd || 'The End';
                    isBackCover = true;
                } else if (pageName === 'Page 2') {
                    text = book.Story1 || '';
                    pageNumberLabel = '2';
                } else if (pageName === 'Page 3') {
                    text = book.Story2 || '';
                    pageNumberLabel = '3';
                } else if (pageName === 'Page 4') {
                    text = book.Story3 || '';
                    pageNumberLabel = '4';
                } else if (pageName === 'Page 5') {
                    text = book.Story4 || '';
                    pageNumberLabel = '5';
                } else if (pageName === 'Page 6') {
                    text = book.Story5 || '';
                    pageNumberLabel = '6';
                } else if (pageName === 'Page 7') {
                    text = book.Story6 || '';
                    pageNumberLabel = '7';
                }

                if (isCover) {
                    // Page 1 is on bottom row (row 1, rotation 0°): Title is centered horizontally and vertically
                    drawCenteredInCell(text, timesRomanBoldFont, 18, x, y, cellWidth, cellHeight, 0);
                } else if (isBackCover) {
                    // Page 8 (Back Cover) is on bottom row (row 1, rotation 0°): "The End" is centered horizontally and vertically
                    drawCenteredInCell(text, timesRomanBoldFont, 20, x, y, cellWidth, cellHeight, 0);
                } else {
                    // Story pages: Left-justified text positioned towards the BOTTOM of the folded page
                    const font = helveticaFont;
                    const size = 13;
                    const lineHeight = 18;

                    if (row === 0) {
                        // Top Row (Pages 4, 5, 6, 7): Rotated 180°.
                        // To position text towards the bottom of the folded page (away from center fold, near sheet top edge):
                        // Sheet Y is near top edge (y + cellHeight - margin - 45 = 545pt).
                        page.drawText(text, {
                            x: x + cellWidth - margin,
                            y: y + cellHeight - margin - 45,
                            font: font,
                            size: size,
                            lineHeight: lineHeight,
                            maxWidth: maxStoryTextWidth,
                            color: rgb(0, 0, 0),
                            rotate: degrees(180)
                        });

                        // Page number placed in bottom-right of the folded page (top-left of sheet cell)
                        if (pageNumberLabel) {
                            page.drawText(pageNumberLabel, {
                                x: x + margin + 10,
                                y: y + cellHeight - margin - 15,
                                font: helveticaBoldFont,
                                size: 9,
                                color: rgb(0.4, 0.4, 0.4),
                                rotate: degrees(180)
                            });
                        }
                    } else {
                        // Bottom Row (Pages 2, 3): Rotated 0°.
                        // Positioned towards the bottom of the folded page (near sheet bottom edge: y + margin + 45 = 67pt).
                        page.drawText(text, {
                            x: x + margin,
                            y: y + margin + 45,
                            font: font,
                            size: size,
                            lineHeight: lineHeight,
                            maxWidth: maxStoryTextWidth,
                            color: rgb(0, 0, 0),
                            rotate: degrees(0)
                        });

                        // Page number in bottom-right of the folded page (bottom-right of sheet cell)
                        if (pageNumberLabel) {
                            page.drawText(pageNumberLabel, {
                                x: x + cellWidth - margin - 10,
                                y: y + margin,
                                font: helveticaBoldFont,
                                size: 9,
                                color: rgb(0.4, 0.4, 0.4),
                                rotate: degrees(0)
                            });
                        }
                    }
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${bookKey}.pdf`;
            link.click();
        } catch (error) {
            console.error("Error generating or downloading PDF:", error);
            alert("Failed to generate PDF. Please check the console for details.");
        }
    }

    function createBookCard(book, bookKey, bookType) {
        const card = document.createElement('div');
        card.className = 'card';
        card.classList.add(`${bookType}-book-card`);

        // Badge pill for category
        const badge = document.createElement('div');
        badge.className = 'card-badge';
        if (bookType === 'rhyming') {
            badge.textContent = 'Learn to Read';
        } else if (bookType === 'blends') {
            badge.textContent = 'Blends & Digraphs';
        } else {
            badge.textContent = 'Find & Draw';
        }
        card.appendChild(badge);

        const title = document.createElement('h3');
        title.textContent = book.Cover;
        card.appendChild(title);

        const previewSnippet = document.createElement('p');
        previewSnippet.className = 'card-snippet';
        previewSnippet.textContent = book.Story1 ? `"${book.Story1}"` : '';
        card.appendChild(previewSnippet);

        const fullText = document.createElement('div');
        fullText.style.display = 'none';
        fullText.className = 'book-full-text-preview';

        for (const page in book) {
            const pageText = document.createElement('p');
            pageText.innerHTML = `<strong>${page}:</strong> ${book[page]}`;
            fullText.appendChild(pageText);
        }
        card.appendChild(fullText);

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'card-actions';

        // Toggle Preview button
        const toggleButton = document.createElement('button');
        toggleButton.innerHTML = '📖 Preview';
        toggleButton.title = 'Toggle Full Text Preview';
        toggleButton.className = 'info-button';
        toggleButton.addEventListener('click', () => {
            const isHidden = fullText.style.display === 'none';
            fullText.style.display = isHidden ? 'block' : 'none';
            toggleButton.innerHTML = isHidden ? '📕 Hide' : '📖 Preview';
        });
        buttonGroup.appendChild(toggleButton);

        // Download PDF button
        const pdfButton = document.createElement('button');
        pdfButton.className = 'cta-button';
        pdfButton.textContent = 'Download PDF';
        pdfButton.addEventListener('click', (event) => {
            event.preventDefault();
            downloadPDF(book, bookKey, bookType);
        });
        buttonGroup.appendChild(pdfButton);

        // Customize in Editor button
        const editButton = document.createElement('a');
        editButton.href = `editor.html?book=${encodeURIComponent(bookKey)}`;
        editButton.className = 'cta-button secondary-button';
        editButton.textContent = 'Customize';
        buttonGroup.appendChild(editButton);

        card.appendChild(buttonGroup);
        return card;
    }

    function populateBooks(books, container, bookType) {
        const bookKeys = Object.keys(books);
        const totalBooks = bookKeys.length;
        const batchSize = 6;
        let currentCount = 0;

        const booksWrapper = document.createElement('div');
        booksWrapper.className = 'books-wrapper';
        container.appendChild(booksWrapper);

        const gridContainer = document.createElement('div');
        gridContainer.className = 'visible-books';
        booksWrapper.appendChild(gridContainer);

        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'pagination-controls';

        const counterLabel = document.createElement('span');
        counterLabel.className = 'books-counter';

        const actionButton = document.createElement('button');
        actionButton.className = 'cta-button secondary-button pagination-button';

        controlsContainer.appendChild(counterLabel);
        controlsContainer.appendChild(actionButton);
        booksWrapper.appendChild(controlsContainer);

        function updateDisplay() {
            counterLabel.textContent = `Showing ${Math.min(currentCount, totalBooks)} of ${totalBooks} books`;

            if (currentCount >= totalBooks) {
                actionButton.textContent = 'Collapse';
            } else {
                const remaining = totalBooks - currentCount;
                const nextBatch = Math.min(batchSize, remaining);
                actionButton.textContent = `Show More (+${nextBatch})`;
            }
        }

        function loadNextBatch() {
            const nextLimit = Math.min(currentCount + batchSize, totalBooks);
            for (let i = currentCount; i < nextLimit; i++) {
                const key = bookKeys[i];
                const card = createBookCard(books[key], key, bookType);
                gridContainer.appendChild(card);
            }
            currentCount = nextLimit;
            updateDisplay();
        }

        function collapseView() {
            while (gridContainer.children.length > batchSize) {
                gridContainer.removeChild(gridContainer.lastChild);
            }
            currentCount = batchSize;
            updateDisplay();

            const section = container.closest('section');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        // Initial load
        loadNextBatch();

        if (totalBooks <= batchSize) {
            controlsContainer.style.display = 'none';
        } else {
            actionButton.addEventListener('click', () => {
                if (currentCount >= totalBooks) {
                    collapseView();
                } else {
                    loadNextBatch();
                }
            });
        }
    }

    // Initialize Collections
    if (learnToReadContainer && typeof learnToReadBooks !== 'undefined') {
        populateBooks(learnToReadBooks, learnToReadContainer, 'rhyming');
    }
    if (blendsAndSegmentsContainer && typeof blendsAndSegmentsBooks !== 'undefined') {
        populateBooks(blendsAndSegmentsBooks, blendsAndSegmentsContainer, 'blends');
    }
    if (findItDrawItContainer && typeof findItDrawItBooks !== 'undefined') {
        populateBooks(findItDrawItBooks, findItDrawItContainer, 'findIt');
    }

    // Horizontal Tab Navigation Filter
    const tabButtons = document.querySelectorAll('.category-tab-btn');
    const sections = {
        'all': document.querySelectorAll('.book-collection-section'),
        'learn-to-read': [document.getElementById('rhyming-books')],
        'blends': [document.getElementById('blends-and-segments-books')],
        'find-it': [document.getElementById('find-it-draw-it-books')]
    };

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active-tab'));
            btn.classList.add('active-tab');

            const categoryKey = btn.dataset.category;

            document.querySelectorAll('.book-collection-section').forEach(sec => {
                sec.style.display = 'none';
            });

            if (categoryKey === 'all') {
                document.querySelectorAll('.book-collection-section').forEach(sec => {
                    sec.style.display = 'block';
                });
            } else {
                const targetSec = sections[categoryKey];
                if (targetSec && targetSec[0]) {
                    targetSec[0].style.display = 'block';
                }
            }
        });
    });
});
