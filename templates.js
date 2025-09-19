document.addEventListener('DOMContentLoaded', () => {
    const rhymingBooksContainer = document.getElementById('rhyming-books-container');
    const blendsAndSegmentsBooksContainer = document.getElementById('blends-and-segments-books-container');
    const findItDrawItBooksContainer = document.getElementById('find-it-draw-it-books-container');

    async function downloadPDF(book, bookKey, bookType) {
        const { PDFDocument, rgb, StandardFonts } = PDFLib;

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([11 * 72, 8.5 * 72]); // Letter size, landscape

        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

        const pageLayout = ['Page 5', 'Page 6', 'Page 7', 'Back Cover', 'Page 4', 'Page 3', 'Page 2', 'Page 1'];

        const cellWidth = (11 * 72) / 4;
        const cellHeight = (8.5 * 72) / 2;

        for (let i = 0; i < pageLayout.length; i++) {
            const pageName = pageLayout[i];
            const col = i % 4;
            const row = Math.floor(i / 4);

            const x = col * cellWidth;
            const y = (1 - row) * cellHeight;

            let text = book[pageName] || pageName;
            let font = helveticaFont;
            let size = 12;
            let yPos;
            let rotation = 0;
            let align = 'center';

            if (pageName === 'Cover' || pageName === 'Back Cover') {
                if (pageName === 'Cover') {
                    font = timesRomanBoldFont;
                    size = 24; // Increased font size for cover
                } else {
                    text = 'The End!';
                    size = 24; // Increased font size for back cover
                }
                const textWidth = font.widthOfTextAtSize(text, size);
                const textHeight = font.heightAtSize(size);
                const centerX = x + cellWidth / 2;
                const centerY = y + cellHeight / 2;
                yPos = centerY - textHeight / 2; // Centered vertically
                if (row === 0) {
                    rotation = 180;
                }
                page.drawText(text, {
                    x: centerX - textWidth / 2,
                    y: yPos,
                    font: font,
                    size: size,
                    color: rgb(0, 0, 0),
                    rotate: PDFLib.degrees(rotation),
                });
            } else { // Pages 1-7
                // Position text at the bottom of the page, with a small margin
                const textHeight = font.heightAtSize(size);
                let bottomMargin = 20; // Margin from the bottom of the cell
                yPos = y + bottomMargin;
                if (row === 0) { // Top row of cells (rotated 180 degrees)
                    rotation = 180;
                    // For rotated pages, "bottom" is actually near the top of the cell in its unrotated state
                    // So, we need to calculate from the top of the cell and then apply rotation
                    yPos = y + cellHeight - bottomMargin - textHeight;
                }
                const centerX = x + cellWidth / 2;
                page.drawText(text, {
                    x: centerX - font.widthOfTextAtSize(text, size) / 2, // Center horizontally
                    y: yPos,
                    font: font,
                    size: size,
                    color: rgb(0, 0, 0),
                    rotate: PDFLib.degrees(rotation),
                    lineHeight: 15,
                    maxWidth: cellWidth - 40 // Added more padding for text
                });
            }
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${bookKey}.pdf`;
        link.click();
    }

    function populateBooks(books, container, bookType) {
        for (const bookKey in books) {
            if (books.hasOwnProperty(bookKey)) {
                const book = books[bookKey];
                const card = document.createElement('div');
                card.className = 'card';

                const title = document.createElement('h3');
                title.textContent = book.Cover;
                card.appendChild(title);

                // Full text container, initially hidden
                const fullText = document.createElement('div');
                fullText.style.display = 'none';
                fullText.style.textAlign = 'left'; // Align text left within the expanded view
                fullText.style.fontSize = '0.9rem';
                fullText.style.marginTop = '0.5rem';
                fullText.style.marginBottom = '0.5rem';
                fullText.style.padding = '0.5rem';
                fullText.style.backgroundColor = '#f9f9f9';
                fullText.style.borderRadius = '5px';
                fullText.style.maxHeight = '150px'; // Limit height
                fullText.style.overflowY = 'auto'; // Add scroll if content overflows

                for (const page in book) {
                    const pageText = document.createElement('p');
                    pageText.innerHTML = `<strong>${page}:</strong> ${book[page]}`;
                    pageText.style.marginBottom = '0.2rem';
                    fullText.appendChild(pageText);
                }
                card.appendChild(fullText);

                // Toggle button for showing/hiding full text
                const toggleButton = document.createElement('button');
                toggleButton.innerHTML = '📖'; // Book icon
                toggleButton.title = 'Toggle Full Text';
                toggleButton.className = 'info-button'; // Reusing info-button style
                toggleButton.style.width = 'fit-content'; // Adjust width to content
                toggleButton.style.padding = '0.3rem 0.6rem'; // Smaller padding
                toggleButton.style.marginBottom = '0.5rem';
                toggleButton.addEventListener('click', () => {
                    const isHidden = fullText.style.display === 'none';
                    fullText.style.display = isHidden ? 'block' : 'none';
                    toggleButton.innerHTML = isHidden ? '📕' : '📖'; // Change icon on toggle
                });
                card.appendChild(toggleButton);

                const button = document.createElement('a');
                button.href = '#';
                button.className = 'cta-button';
                button.textContent = 'Download PDF';
                button.style.display = 'block';
                button.style.textAlign = 'center';
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    downloadPDF(book, bookKey, bookType);
                });
                card.appendChild(button);

                container.appendChild(card);
            }
        }
    }

    populateBooks(rhymingBooks, rhymingBooksContainer, 'rhyming');
    populateBooks(blendsAndSegmentsBooks, blendsAndSegmentsBooksContainer, 'blends');
    populateBooks(findItDrawItBooks, findItDrawItBooksContainer, 'findIt');
});
