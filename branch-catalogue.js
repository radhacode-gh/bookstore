// ====== BOOK IMAGE SIZE (change these two numbers to resize all book covers) ======
const COVER_WIDTH  = 120;   // px
const COVER_HEIGHT = 170;   // px (keep about 1.4 x the width)
// ==================================================================================

// Change this number (e.g. "v3") any time you want browsers to forget saved covers
const CACHE_VERSION = "v2";

const branchBooks = {
    cse: {
        title: "Computer Science & Engineering",
        books: [
            { id: "cse1", name: "Introduction to Algorithms",
              author: "Thomas H. Cormen", price: 850 },
            { id: "cse2", name: "Operating System Concepts",
              author: "Silberschatz", price: 720 },
            { id: "cse3", name: "Computer Networks",
              author: "Andrew S. Tanenbaum", price: 650 },
            { id: "cse4", name: "Artificial Intelligence",
              author: "Stuart Russell", price: 630 },
            { id: "cse5", name: "Database System Concepts",
              author: "Silberschatz", price: 780 },
            { id: "cse6", name: "Java: The Complete Reference",
              author: "Herbert Schildt", price: 550 }
        ]
    },

    ece: {
        title: "Electronics & Communication Engineering",
        books: [
            { id: "ece1", name: "Electronic Devices and Circuit Theory",
              author: "Boylestad", price: 680 },
            { id: "ece2", name: "Microelectronic Circuits",
              author: "Sedra and Smith", price: 850 },
            { id: "ece3", name: "Digital Electronics",
              author: "Morris Mano", price: 520 },
            { id: "ece4", name: "Signals and Systems",
              author: "Oppenheim", price: 700 },
            { id: "ece5", name: "Communication Systems",
              author: "Simon Haykin", price: 750 },
            { id: "ece6", name: "Engineering Electromagnetics",
              author: "William H. Hayt", price: 620 }
        ]
    },

    eee: {
        title: "Electrical & Electronics Engineering",
        books: [
            { id: "eee1", name: "Electrical Machines",
              author: "P. S. Bimbhra", price: 680 },
            { id: "eee2", name: "Power System Engineering",
              author: "Nagrath and Kothari", price: 750 },
            { id: "eee3", name: "Basic Electrical Engineering",
              author: "V. K. Mehta", price: 480 },
            { id: "eee5", name: "Power Electronics",
              author: "P. S. Bimbhra", price: 700 },
            { id: "eee6", name: "Electrical Measurements",
              author: "A. K. Sawhney", price: 590 }
        ]
    },

    civil: {
        title: "Civil Engineering",
        books: [
            { id: "civil1", name: "Building Materials",
              author: "S. K. Duggal", price: 550 },
            { id: "civil2", name: "Strength of Materials",
              author: "R. K. Bansal", price: 620 },
            { id: "civil3", name: "Surveying",
              author: "B. C. Punmia", price: 750 },
            { id: "civil4", name: "Design of Concrete Structures",
              author: "N. Krishna Raju", price: 680 },
            { id: "civil5", name: "Soil Mechanics",
              author: "B. C. Punmia", price: 640 },
            { id: "civil6", name: "Fluid Mechanics",
              author: "R. K. Bansal", price: 580 }
        ]
    }
};

// To force a specific cover for any book, add:  image: "images/eee1.jpg"
// (or a full web link) to that book. It is used before anything else.
// You can also add  isbn: "xxxxxxxxxxxxx"  to look up a cover by ISBN.

const formatINR = amount =>
    amount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR"
    });

/* ---------- BOOK COVERS ---------- */

const COVER_COLORS = [
    "#7f1d1d", "#14532d", "#78350f", "#581c87",
    "#134e4a", "#831843", "#3f3f46", "#9a3412"
];

function escapeXml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wrapText(text, maxChars) {
    const lines = [];
    let line = "";
    text.split(" ").forEach(w => {
        if ((line + " " + w).trim().length > maxChars && line) {
            lines.push(line.trim());
            line = w;
        } else {
            line += " " + w;
        }
    });
    if (line.trim()) lines.push(line.trim());
    return lines;
}

// Realistic-looking book cover (used only if no real cover is found)
function fallbackCover(book) {
    let hash = 0;
    for (const ch of book.name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
    const color = COVER_COLORS[hash % COVER_COLORS.length];

    const titleLines = wrapText(book.name, 12).slice(0, 5);
    const titleSvg = titleLines.map((l, i) =>
        `<text x="52" y="${34 + i * 15}" font-size="12" font-weight="bold"
          text-anchor="middle" fill="#ffffff" font-family="Georgia,serif">${escapeXml(l)}</text>`
    ).join("");

    const authorLines = wrapText(book.author, 16).slice(0, 2);
    const authorSvg = authorLines.map((l, i) =>
        `<text x="52" y="${128 + i * 11}" font-size="9" text-anchor="middle"
          fill="#fde68a" font-family="Arial">${escapeXml(l)}</text>`
    ).join("");

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="104" height="150">
        <rect width="104" height="150" rx="3" fill="${color}"/>
        <rect width="9" height="150" rx="3" fill="rgba(0,0,0,0.35)"/>
        <rect x="14" y="8" width="82" height="2" fill="#fde68a"/>
        <rect x="14" y="108" width="82" height="2" fill="#fde68a"/>
        ${titleSvg}
        ${authorSvg}
        </svg>`;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// Checks that an image URL really loads and is big enough to be a real cover
function imageWorks(url) {
    return new Promise(resolve => {
        const t = new Image();
        t.onload = () => resolve(t.naturalWidth > 80 && t.naturalHeight > 100);
        t.onerror = () => resolve(false);
        t.src = url;
    });
}

// Looks up a real cover online: ISBN first (if given), then title + author
// (Google Books, then Open Library)
async function findCoverUrl(book) {
    const cacheKey = "cover:" + CACHE_VERSION + ":" + book.id + ":" + book.name;
    try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) return cached;
    } catch (e) {}

    let url = null;

    // If the book has an ISBN, try that cover first
    if (book.isbn) {
        const byIsbn = "https://covers.openlibrary.org/b/isbn/" +
                       book.isbn + "-L.jpg?default=false";
        if (await imageWorks(byIsbn)) {
            try { localStorage.setItem(cacheKey, byIsbn); } catch (e) {}
            return byIsbn;
        }
    }

    // Google Books search by title + author
    try {
        const q = encodeURIComponent("intitle:" + book.name + " inauthor:" + book.author);
        const res = await fetch(
            "https://www.googleapis.com/books/v1/volumes?q=" + q +
            "&maxResults=8&printType=books"
        );
        const data = await res.json();
        const candidates = (data.items || [])
            .filter(i => i.volumeInfo && i.volumeInfo.imageLinks &&
                         i.volumeInfo.imageLinks.thumbnail)
            .map(i => i.volumeInfo.imageLinks.thumbnail
                .replace("http://", "https://")
                .replace("&edge=curl", ""));
        for (const c of candidates) {
            if (await imageWorks(c)) { url = c; break; }
        }
    } catch (e) {}

    // Open Library search by title + author
    if (!url) {
        try {
            const res = await fetch(
                "https://openlibrary.org/search.json?title=" +
                encodeURIComponent(book.name) +
                "&author=" + encodeURIComponent(book.author) +
                "&limit=1&fields=cover_i"
            );
            const data = await res.json();
            if (data.docs && data.docs[0] && data.docs[0].cover_i) {
                const c = "https://covers.openlibrary.org/b/id/" +
                          data.docs[0].cover_i + "-M.jpg";
                if (await imageWorks(c)) url = c;
            }
        } catch (e) {}
    }

    if (url) {
        try { localStorage.setItem(cacheKey, url); } catch (e) {}
    }
    return url;
}

// Builds the <img> for a book: own image > real cover found online > book-style cover
function makeCover(book) {
    const img = document.createElement("img");
    img.alt = book.name;
    img.style.cssText =
        "width:" + COVER_WIDTH + "px;height:" + COVER_HEIGHT +
        "px;object-fit:contain;display:block;margin:auto;";

    const fallback = fallbackCover(book);

    if (book.image) {
        img.src = book.image;
        img.onerror = () => { img.onerror = null; img.src = fallback; };
        return img;
    }

    img.src = fallback;
    findCoverUrl(book).then(url => {
        if (url) img.src = url;
    });
    return img;
}

/* ---------- CART ---------- */

function addBranchBook(book) {
    const cart = JSON.parse(
        localStorage.getItem("bookstoreCart") || "{}"
    );

    if (cart[book.id]) {
        cart[book.id].quantity += 1;
    } else {
        cart[book.id] = {
            id: book.id,
            name: book.name,
            price: book.price,
            quantity: 1
        };
    }

    localStorage.setItem("bookstoreCart", JSON.stringify(cart));
    alert(book.name + " added to your cart!");
}

/* ---------- BRANCH PAGES (cse.html, ece.html, eee.html, civil.html) ---------- */

const currentBranchKey = document.body.dataset.branch;
const currentBranch = branchBooks[currentBranchKey];

if (currentBranch) {
    document.getElementById("branchTitle").textContent = currentBranch.title;

    // Make sure the table has a "Book Cover" column header
    const headRow = document.querySelector("thead tr");
    if (headRow && !/cover/i.test(headRow.firstElementChild.textContent)) {
        const th = document.createElement("th");
        th.textContent = "Book Cover";
        headRow.prepend(th);
    }

    const tbody = document.getElementById("bookRows");

    currentBranch.books.forEach(book => {
        const row = document.createElement("tr");

        const cover = document.createElement("td");
        cover.appendChild(makeCover(book));

        const name = document.createElement("td");
        name.textContent = book.name;

        const author = document.createElement("td");
        author.textContent = book.author;

        const price = document.createElement("td");
        price.textContent = formatINR(book.price);

        const action = document.createElement("td");
        const button = document.createElement("button");

        button.className = "cart-btn";
        button.textContent = "Add to Cart";
        button.onclick = () => addBranchBook(book);

        action.appendChild(button);
        row.append(cover, name, author, price, action);
        tbody.appendChild(row);
    });
}
