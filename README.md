# Mini-Book Maker

A structured literacy web application for creating, customizing, and printing 8-page foldable decodable mini-books aligned with the **Orton-Gillingham (OG)** approach and the **Science of Reading (SoR)**.

Each book prints on a single sheet of standard US Letter paper (landscape), requiring only one cut and a simple series of folds to create an instant 8-page booklet.

---

## 🗺️ Orton-Gillingham Scope & Sequence Ladder

The library is organized into a systematic, cumulative phonics ladder:

| Tier | Focus Stage | Target Phonograms & Concepts | Included Decodable Titles |
| :--- | :--- | :--- | :--- |
| **Tier 1** | **Foundations** | High-frequency letter-sound order (`m, s, a, t, b, c, i, f, n, o, h, d, g, l, e, p, r, u, j, k, w, y, x, q, z, v`) & oral blending/segmenting | *Letter Sounds Groups 1–6* (6 books) |
| **Tier 2** | **CVC & Closed Syllables** | Short vowels (`-at, -an, -am, -ap, -en, -ed, -et, -ig, -in, -ip, -og, -op, -ug, -un`) & word families | *Learn to Read Kits, Levels 1–6* (24 books) |
| **Tier 3** | **Blends & Digraphs** | Initial L-blends, R-blends, S-blends, and consonant digraphs (`sh, ch, th, wh, -ck`) | *Blends & Digraphs Collection* (24 books) |
| **Tier 4** | **Advanced Phonics** | Silent E / VCe (`a_e, i_e, o_e, u_e`), Vowel Teams (`ai/ay, ee/ea, oa/oe, igh/ie`), Bossy R (`ar, er, ir, or, ur`), and Diphthongs (`oi/oy, ou/ow, au/aw, oo/ew`) | *Advanced Phonics Collection* (20 books) |
| **Tier 5** | **Syllables & Morphology** | 6 Syllable Types (Closed, Open, VCe, Vowel Team, R-Controlled, -C-le) & Affixes (`-s, -ed, -ing, un-, re-, -ful`) | *Morphology Decodables & Custom Builder* |
| **Supplement** | **Fine Motor & Vocabulary** | Cross-cutting real-world observation and drawing prompts tagged to phonics tiers | *Find It, Draw It Collection* (20 books) |

---

## 📊 Diagnostic Checklist & Skills Mastery Tracker (`tracker.html`)

The application includes an interactive and printable **Diagnostic Mastery Tracker** designed for reading specialists, tutors, and homeschool portfolios:
* **Dual Read (Decode) & Spell (Encode) Verification**: Honors the reciprocal nature of reading and spelling in Orton-Gillingham instruction.
* **Date Milestone Tracking**: Track dates for *Introduced*, *Practiced*, and *Mastered*.
* **Book Cross-Referencing**: Every skill row links directly to the specific mini-book titles in the library that target that skill.
* **Student Portfolio Logging**: Built-in browser persistence (`localStorage`) and a dedicated print stylesheet (`@media print`) for clean binder logs.

---

## 🖨️ 8-Page Landscape Imposition Layout

Each book is printed in **Landscape orientation (11" × 8.5")** on a single sheet of US Letter paper:

```
+--------------------+--------------------+--------------------+--------------------+
|  Top Row (180°)    |  Top Row (180°)    |  Top Row (180°)    |  Top Row (180°)    |
|       Page 4       |       Page 5       |       Page 6       |       Page 7       |
|     (Story 3)      |     (Story 4)      |     (Story 5)      |     (Story 6)      |
+ - - - - - - - - - -+====================+====================+- - - - - - - - - - +
|  Bottom Row (0°)   |  Bottom Row (0°)   |  Bottom Row (0°)   |  Bottom Row (0°)   |
|       Page 3       |       Page 2       |     Back Cover     |    Front Cover     |
|     (Story 2)      |     (Story 1)      |      (Page 8)      |      (Page 1)      |
+--------------------+--------------------+--------------------+--------------------+
                     |<======== Center Cut Slit ========>|
```

* **Top Row (180°)**: `Page 4` \| `Page 5` \| `Page 6` \| `Page 7` (Story text positioned towards bottom of page)
* **Bottom Row (0°)**: `Page 3` \| `Page 2` \| `Back Cover (Page 8 - Centered)` \| `Page 1 (Front Cover - Centered)`
* **Typography**: Story text is left-justified with a `0.3 in` margin to prevent fold interference. Front Cover and Back Cover are centered.

---

## ✂️ Folding & Cutting Instructions

1. **Fold Lengthwise ("Hot Dog")**: Fold the sheet in half lengthwise (top edge meets bottom edge). Crease sharply and unfold.
2. **Fold Widthwise into Quarters**: Fold in half widthwise ("hamburger"), then fold each side in half again to form 4 equal columns. Crease well and unfold flat.
3. **Cut the Center Slit**: Fold the sheet in half widthwise. Starting from the folded center spine, cut along the middle horizontal fold line through the two inner columns only (between Pages 5/6 & 2/8 and Pages 4/5 & 3/2). Stop at the outer fold lines.
4. **Pop Open**: Unfold flat, then fold lengthwise along the horizontal crease. Push the outer left and right ends inward to pop open the center into a 4-leaf plus sign (`+`).
5. **Flatten into Booklet**: Collapse the leaves together and fold the Front Cover (Page 1) over to the front. The book will open properly from right to left with Page 2 as the first inside page.

---

## 🚀 Getting Started

1. **Browse Catalog**: Open `templates.html` to explore the 74 decodable titles across all phonics tiers.
2. **View Curriculum Map**: Open `scope-sequence.html` to see the full Orton-Gillingham roadmap.
3. **Track Student Progress**: Open `tracker.html` to monitor reading/spelling mastery and print student portfolio records.
4. **Customize in Editor**: Open `editor.html` to write custom decodable stories or add custom illustrations.
