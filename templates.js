// @ts-nocheck
document.addEventListener('DOMContentLoaded', () => {
    const rhymingBooksContainer = document.getElementById('rhyming-books-container');
    const blendsAndSegmentsBooksContainer = document.getElementById('blends-and-segments-books-container');
    const findItDrawItBooksContainer = document.getElementById('find-it-draw-it-books-container');

    async function downloadPDF(book, bookKey, bookType) {
        try {
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

                let text = '';
                if (pageName === 'Cover') { // This is the logical Cover page
                    text = book.Cover || 'Title Page';
                } else if (pageName === 'Back Cover') { // This is the logical End page
                    text = book.TheEnd || 'The End!';
                } else if (pageName === 'Page 1') { // Physical page 1, which is the front cover
                    text = book.Cover || 'Title Page';
                } else if (pageName === 'Page 2') {
                    text = book.Story1 || 'Story Page 1';
                } else if (pageName === 'Page 3') {
                    text = book.Story2 || 'Story Page 2';
                } else if (pageName === 'Page 4') {
                    text = book.Story3 || 'Story Page 3';
                } else if (pageName === 'Page 5') {
                    text = book.Story4 || 'Story Page 4';
                } else if (pageName === 'Page 6') {
                    text = book.Story5 || 'Story Page 5';
                } else if (pageName === 'Page 7') {
                    text = book.Story6 || 'Story Page 6';
                } else {
                    text = pageName; // Fallback for any other unexpected pageName
                }
                let font = helveticaFont;
                let size = 12;
                let rotation = 0;

                let centerX = x + cellWidth / 2;
                let centerY = y + cellHeight / 2;

                let drawX;
                let drawY;

                if (pageName === 'Cover' || pageName === 'Page 1') { // Title page
                    font = timesRomanBoldFont;
                    size = 24;
                    const textWidth = font.widthOfTextAtSize(text, size);
                    const textHeight = font.heightAtSize(size);

                    if (row === 0) { // Top row of cells (rotated 180 degrees)
                        rotation = 180;
                        drawX = centerX + textWidth / 2;
                        drawY = centerY + textHeight / 2;
                    } else {
                        drawX = centerX - textWidth / 2;
                        drawY = centerY - textHeight / 2;
                    }
                } else if (pageName === 'Back Cover') { // The End page
                    font = timesRomanBoldFont;
                    size = 24;
                    const textWidth = font.widthOfTextAtSize(text, size);
                    const textHeight = font.heightAtSize(size);

                    if (row === 0) { // Top row of cells (rotated 180 degrees)
                        rotation = 180;
                        drawX = centerX + textWidth / 2;
                        drawY = centerY + textHeight / 2;
                    }

                    page.drawText(text, {
                        x: drawX,
                        y: drawY,
                        font: font,
                        size: size,
                        color: rgb(0, 0, 0),
                        rotate: PDFLib.degrees(rotation),
                    });
                } else { // Story pages (Page 2 to Page 7)
                    const textWidth = font.widthOfTextAtSize(text, size);
                    const textHeight = font.heightAtSize(size);
                    let bottomMargin = 20;

                    if (row === 0) { // Top row of cells (rotated 180 degrees)
                        rotation = 180;
                        // For rotated text, "bottom" means the top of the cell after rotation
                        let unrotatedY = y + cellHeight - bottomMargin - textHeight;
                        drawX = centerX + textWidth / 2; // Adjusted for 180-degree rotation
                        drawY = unrotatedY + textHeight; // Adjusted for 180-degree rotation
                    } else {
                        drawX = centerX - textWidth / 2;
                        drawY = y + bottomMargin; // Position at the bottom
                    }
                }

                page.drawText(text, {
                    x: drawX,
                    y: drawY,
                    font: font,
                    size: size,
                    color: rgb(0, 0, 0),
                    rotate: PDFLib.degrees(rotation),
                    lineHeight: 15, // Keep for story pages
                    maxWidth: cellWidth - 40 // Keep for story pages
                });
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

    function populateBooks(books, container, bookType) {
        const bookKeys = Object.keys(books);
        const initialDisplayCount = 3;
        let displayedCount = 0;

        // Create a wrapper for all book cards within this category
        const booksWrapper = document.createElement('div');
        booksWrapper.className = 'books-wrapper'; // A new class for styling
        container.appendChild(booksWrapper); // Append the wrapper to the main container

        const visibleBooksContainer = document.createElement('div');
        visibleBooksContainer.className = 'visible-books';
        booksWrapper.appendChild(visibleBooksContainer); // Append to the wrapper

        const hiddenBooksContainer = document.createElement('div');
        hiddenBooksContainer.className = 'hidden-books';
        hiddenBooksContainer.style.display = 'none'; // Initially hidden
        booksWrapper.appendChild(hiddenBooksContainer); // Append to the wrapper

        for (const bookKey of bookKeys) {
            if (books.hasOwnProperty(bookKey)) {
                const book = books[bookKey];
                const card = document.createElement('div');
                card.className = 'card';
                card.classList.add(`${bookType}-book-card`);

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

                if (displayedCount < initialDisplayCount) {
                    visibleBooksContainer.appendChild(card);
                    displayedCount++;
                } else {
                    hiddenBooksContainer.appendChild(card);
                }
            }
        }

        if (bookKeys.length > initialDisplayCount) {
            const expandButton = document.createElement('button');
            expandButton.textContent = 'More Books';
            expandButton.className = 'expand-button cta-button'; // Reusing cta-button style
            expandButton.addEventListener('click', () => {
                const isHidden = hiddenBooksContainer.style.display === 'none';
                hiddenBooksContainer.style.display = isHidden ? 'block' : 'none';
                expandButton.textContent = isHidden ? 'Collapse' : 'More Books';
            });
            booksWrapper.appendChild(expandButton); // Append to booksWrapper instead of container
        }
    }

    populateBooks(rhymingBooks, rhymingBooksContainer, 'rhyming');
    populateBooks(blendsAndSegmentsBooks, blendsAndSegmentsBooksContainer, 'blends');
    populateBooks(findItDrawItBooks, findItDrawItBooksContainer, 'findIt');
});
