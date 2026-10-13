
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
        row.append(name, author, price, action);
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
