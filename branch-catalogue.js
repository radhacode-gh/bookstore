
const branchBooks = {
    cse: {
        title: "Computer Science & Engineering",
        books: [
            { id: "cse1", name: "Introduction to Algorithms",
              author: "Thomas H. Cormen", price: 850, image: "images/cse1.jpg"},
            { id: "cse2", name: "Operating System Concepts",
              author: "Silberschatz", price: 720, image: "images/cse2.jpg"},
            { id: "cse3", name: "Computer Networks",
              author: "Andrew S. Tanenbaum", price: 650, image: "images/cse3.jpg" },
            { id: "cse4", name: "Artificial Intelligence",
              author: "Stuart Russell", price: 630, image: "images/cse4.jpg" },
            { id: "cse5", name: "Database System Concepts",
              author: "Silberschatz", price: 780, image: "images/cse5.jpg"},
            { id: "cse6", name: "Java: The Complete Reference",
              author: "Herbert Schildt", price: 550, image: "images/cse6.jpg" }
        ]
    },

    ece: {
        title: "Electronics & Communication Engineering",
        books: [
            { id: "ece1", name: "Electronic Devices and Circuit Theory",
              author: "Boylestad", price: 680, image: "images/ece1.jpg" },
            { id: "ece2", name: "Microelectronic Circuits",
              author: "Sedra and Smith", price: 850, image: "images/ece2.jpg" },
            { id: "ece3", name: "Digital Electronics",
              author: "Morris Mano", price: 520, image: "images/ece3.jpg" },
            { id: "ece4", name: "Signals and Systems",
              author: "Oppenheim", price: 700, image: "images/ece4.jpg" },
            { id: "ece5", name: "Communication Systems",
              author: "Simon Haykin", price: 750, image: "images/ece5.jpg" },
            { id: "ece6", name: "Engineering Electromagnetics",
              author: "William H. Hayt", price: 620, image: "images/ece6.jpg" }
        ]
    },

    eee: {
        title: "Electrical & Electronics Engineering",
        books: [
            { id: "eee1", name: "Electrical Machines",
              author: "P. S. Bimbhra", price: 680, image: "images/eee1.jpg" },
            { id: "eee2", name: "Power System Engineering",
              author: "Nagrath and Kothari", price: 750, image: "images/eee2.jpg" },
            { id: "eee3", name: "Basic Electrical Engineering",
              author: "V. K. Mehta", price: 480, image: "images/eee3.jpg"},
            { id: "eee4", name: "Control Systems Engineering",
              author: "I. J. Nagrath", price: 650, image: "images/eee4.jpg" },
            { id: "eee5", name: "Power Electronics",
              author: "P. S. Bimbhra", price: 700, image: "images/eee5.jpg" },
            { id: "eee6", name: "Electrical Measurements",
              author: "A. K. Sawhney", price: 590, image: "images/eee6.jpg" }
        ]
    },

    civil: {
        title: "Civil Engineering",
        books: [
            { id: "civil1", name: "Building Materials",
              author: "S. K. Duggal", price: 550, image: "images/civil1.jpg" },
            { id: "civil2", name: "Strength of Materials",
              author: "R. K. Bansal", price: 620, image: "images/civil2.jpg" },
            { id: "civil3", name: "Surveying",
              author: "B. C. Punmia", price: 750, image: "images/civil3.jpg" },
            { id: "civil4", name: "Design of Concrete Structures",
              author: "N. Krishna Raju", price: 680, image: "images/civil4.jpg"},
            { id: "civil5", name: "Soil Mechanics",
              author: "B. C. Punmia", price: 640, image: "images/civil5.jpg"},
            { id: "civil6", name: "Fluid Mechanics",
              author: "R. K. Bansal", price: 580, image: "images/civil6.jpg" }
        ]
    }
};

const page = document.body.dataset.branch;
const branch = branchBooks[page];

const formatINR = amount =>
    amount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR"
    });

if (branch) {
    document.getElementById("branchTitle").textContent = branch.title;

    const tbody = document.getElementById("bookRows");

    branch.books.forEach(book => {
        const row = document.createElement("tr");

        
        const imageCell = document.createElement("td");

        const cover = document.createElement("img");
        cover.src = book.image;
        cover.alt = book.name + " book cover";
        cover.className = "book-cover";

        cover.onerror = function () {
            this.alt = "Cover unavailable: " + book.name;
        };

        imageCell.appendChild(cover);

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
        row.append(imageCell, name, author, price, action);
        tbody.appendChild(row);
    });
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
