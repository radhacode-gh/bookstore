const branchBooks = {
    cse: {
        title: "Computer Science & Engineering",
        books: [
            { id: "cse1", name: "Introduction to Algorithms",
              author: "Thomas H. Cormen", price: 850, isbn: "9780262033848" },
            { id: "cse2", name: "Operating System Concepts",
              author: "Silberschatz", price: 720, isbn: "9781118063330" },
            { id: "cse3", name: "Computer Networks",
              author: "Andrew S. Tanenbaum", price: 650, isbn: "9780132126953" },
            { id: "cse4", name: "Artificial Intelligence",
              author: "Stuart Russell", price: 630, isbn: "9780136042594" },
            { id: "cse5", name: "Database System Concepts",
              author: "Silberschatz", price: 780, isbn: "9780073523323" },
            { id: "cse6", name: "Java: The Complete Reference",
              author: "Herbert Schildt", price: 550, isbn: "9781260440232" }
        ]
    },

    ece: {
        title: "Electronics & Communication Engineering",
        books: [
            { id: "ece1", name: "Electronic Devices and Circuit Theory",
              author: "Boylestad", price: 680, isbn: "9780132622264" },
            { id: "ece2", name: "Microelectronic Circuits",
              author: "Sedra and Smith", price: 850, isbn: "9780199339136" },
            { id: "ece3", name: "Digital Electronics",
              author: "Morris Mano", price: 520, isbn: "9780132774208" },
            { id: "ece4", name: "Signals and Systems",
              author: "Oppenheim", price: 700, isbn: "9780138147570" },
            { id: "ece5", name: "Communication Systems",
              author: "Simon Haykin", price: 750, isbn: "9780471697909" },
            { id: "ece6", name: "Engineering Electromagnetics",
              author: "William H. Hayt", price: 620, isbn: "9780073380667" }
        ]
    },

    // For EEE and Civil: add  image: "images/eee1.jpg"  (or an isbn) to show a real cover.
    // Until then, a neat placeholder with the book title is shown.
    eee: {
        title: "Electrical & Electronics Engineering",
        books: [
            { id: "eee1", name: "Electrical Machines",
              author: "P. S. Bimbhra", price: 680 },
            { id: "eee2", name: "Power System Engineering",
              author: "Nagrath and Kothari", price: 750 },
            { id: "eee3", name: "Basic Electrical Engineering",
              author: "V. K. Mehta", price: 480 },
            { id: "eee4", name: "Control Systems Engineering",
              author: "I. J. Nagrath", price: 650 },
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

const formatINR = amount =>
    amount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR"
    });

// Placeholder cover (shows the book title) used when no image is available
function placeholderCover(title) {
    const words = title.split(" ");
    const lines = [];
    let line = "";
    words.forEach(w => {
        if ((line + " " + w).trim().length > 13) {
            lines.push(line.trim());
            line = w;
        } else {
            line += " " + w;
        }
    });
    if (line.trim()) lines.push(line.trim());

    const text = lines.slice(0, 6).map((l, i) =>
        `<text x="50%" y="${30 + i * 16}" font-size="11" text-anchor="middle"
          fill="#1e40af" font-family="Arial">${l.replace(/&/g, "&amp;")}</text>`
    ).join("");

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="85" height="115">
        <rect width="100%" height="100%" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
        ${text}</svg>`;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// Builds the <img> for a book: own image > ISBN cover > placeholder
function makeCover(book) {
    const img = document.createElement("img");
    img.alt = book.name;
    img.loading = "lazy";
    img.style.cssText =
        "width:85px;height:115px;object-fit:contain;display:block;margin:auto;";

    const placeholder = placeholderCover(book.name);
    if (book.image) {
        img.src = book.image;
    } else if (book.isbn) {
        img.src = "https://covers.openlibrary.org/b/isbn/" + book.isbn + "-M.jpg";
    } else {
        img.src = placeholder;
    }
    img.onerror = () => {
        img.onerror = null;
        img.src = placeholder;
    };
    return img;
}

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

// ---- Branch pages (cse.html, ece.html, eee.html, civil.html) ----
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
