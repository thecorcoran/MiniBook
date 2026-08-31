# Mini-Book Maker

A web application for creating, customizing, and printing 8-page foldable mini-books (zines) for early readers on a single sheet of standard US Letter paper.

---

## 8-Page Sheet Layout & Imposition Grid

Each book is printed in **Landscape orientation (11" × 8.5")** on a single sheet of standard US Letter paper, divided into 8 panels (4 columns × 2 rows):

```
+--------------------+--------------------+--------------------+--------------------+
|  Top Row (180°)    |  Top Row (180°)    |  Top Row (180°)    |  Top Row (180°)    |
|       Page 4       |       Page 5       |       Page 6       |       Page 7       |
|     (Story 3)      |     (Story 4)      |     (Story 5)      |     (Story 6)      |
+ - - - - - - - - - -+====================+====================+- - - - - - - - - - +
|  Bottom Row (0°)   |  Bottom Row (0°)   |  Bottom Row (0°)   |  Bottom Row (0°)   |
|       Page 3       |       Page 2       |    Front Cover     |     Back Cover     |
|     (Story 2)      |     (Story 1)      |      (Page 1)      |      (Page 8)      |
+--------------------+--------------------+--------------------+--------------------+
                     |<======== Center Cut Slit ========>|
```

* **Top Row (Rotated 180°)**: `Page 4`, `Page 5`, `Page 6`, `Page 7`
* **Bottom Row (Rotated 0°)**: `Page 3`, `Page 2`, `Page 1 (Front Cover)`, `Back Cover (Page 8)`
* **Typography**: Text is left-aligned on each page with generous 0.3" margins to ensure clear reading without fold interference.

---

## Folding & Cutting Instructions

1. **Fold Lengthwise ("Hot Dog Fold")**: Fold the paper in half lengthwise (bringing the top edge to the bottom edge). Crease sharply and unfold.
2. **Fold Widthwise into Quarters**: Fold the paper in half widthwise ("hamburger style"), then fold each half in half again to form 4 equal columns. Crease well and unfold flat.
3. **Cut the Center Slit**: Fold the paper in half widthwise ("hamburger style"). Starting from the folded center crease, cut along the middle horizontal fold line through the two inner columns only (between Pages 5/6 & 2/1 and Pages 4/5 & 3/2). Stop at the outer fold lines.
4. **Pop Open the Diamond**: Unfold flat, then fold lengthwise along the horizontal crease. Holding both outer ends, push inwards toward the center. The center slit pops open into a 4-leaf plus sign (`+`).
5. **Flatten into Booklet**: Collapse the leaves together and fold the Front Cover (Page 1) over to the front. Your 8-page mini-book is assembled and ready to read!

---

## How to Use

1. **Browse Catalog**: Open `templates.html` to explore the 64 included mini-book titles across three collections:
   * **Printable Rhyming Books**: Short stories focusing on rhyme and word families.
   * **Blends & Segments Books**: Phonics-based stories reinforcing consonant clusters and digraphs.
   * **Find It, Draw It Books**: Interactive observational prompts with dedicated drawing space.
2. **Preview Story Text**: Click **Preview** on any book card to inspect the full 8-page text.
3. **Download PDF**: Click **Download PDF** for a print-ready vector PDF with built-in cut lines and fold guides.
4. **Customize in Editor**: Click **Customize** on any book (or open `editor.html`) to modify story text, add images, or compose a new book from scratch.

---

## Printing Guidelines

* **Paper Size**: US Letter (8.5" × 11")
* **Orientation**: **Landscape** (11" width × 8.5" height)
* **Margins**: Set to *None* or *Default* in your browser's print dialog.
* **Scale**: Set to *Actual Size* (100%) to ensure fold and cut guides align accurately.
