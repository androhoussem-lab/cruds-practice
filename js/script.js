const title = document.getElementById("title");
const price = document.getElementById("price");
const taxes = document.getElementById("taxes");
const ads = document.getElementById("ads");
const discount = document.getElementById("discount");
const total = document.getElementById("total");
const count = document.getElementById("count");
const category = document.getElementById("category");
const submit = document.getElementById("submit");
const tableBody = document.getElementById("table-body");


let products;
let mode = "create";
let index = 0;
let searchMode = "title";


//get total
function getTotal() {
    if (price.value != "") {
        let result = ((castStringToNumber(price.value) + castStringToNumber(taxes.value) + castStringToNumber(ads.value))) - ((castStringToNumber(price.value) + castStringToNumber(taxes.value) + castStringToNumber(ads.value)) * castStringToNumber(discount.value)) / 100;
        total.innerText = result;
        total.style.backgroundColor = "green";
    } else {
        total.style.backgroundColor = "purple";
        price.value = "";
    }
}


if (localStorage.getItem("products") != null) {
    products = JSON.parse(localStorage.getItem("products"));
} else {
    products = [];
}


//create new product

submit.onclick = function createProduct() {
    let product = {
        title: title.value,
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerText, //not input
        count: count.value,
        category: category.value,
    }
    if (title.value != "" 
    && price.value != "" 
    && taxes.value != "" 
    && ads.value != "" 
    && discount.value != "" 
    && count.value < 100
    && category.value != "") {
        if (mode === "create") {
            if (product.count > 1) {
                for (let i = 0; i < product.count; i++) {
                    products.push(product);
                }
            } else {
                products.push(product);
            }
        } else {
            products[index] = product;
            mode = "create";
            submit.innerText = "Create";
            count.style.display = 'inline-block'
        }



        localStorage.setItem("products", JSON.stringify(products));
        clearInputs();
        showProducts();
    }



};

//show (read) products
function showProducts() {
    let table = '';
    getTotal();
    for (let i = 0; i < products.length; i++) {
        table += `
                <tr>
                        <td>${i+1}</td>
                        <td>${products[i].title}</td>
                        <td>${products[i].price}</td>
                        <td>${products[i].taxes}</td>
                        <td>${products[i].ads}</td>
                        <td>${products[i].discount}</td>
                        <td>${products[i].total}</td>
                        <td>${products[i].category}</td>
                        <td><button onclick="updateProduct(${i})" id="update">Update</button></td>
                        <td><button onClick="deleteProduct(${i})" id="delete">Delete</button></td>
                </tr>
                `;
    }



    tableBody.innerHTML = table;
    let deleteAll = document.getElementById("delete-all");
    if (products.length > 0) {
        deleteAll.innerHTML = `
            <button onclick="deleteAll()">Clean (${products.length})</button>
        `;
    } else {
        deleteAll.innerHTML = "";
    }

}

showProducts();


//delete product
function deleteProduct(id) {
    products.splice(id, 1);
    localStorage.setItem("products", JSON.stringify(products));
    showProducts();
}


//delete all
function deleteAll() {
    products.splice(0);
    localStorage.clear();
    showProducts();
}


//update product
function updateProduct(item) {
    title.value = products[item].title;
    price.value = products[item].price;
    taxes.value = products[item].taxes;
    ads.value = products[item].ads;
    discount.value = products[item].discount;
    category.value = products[item].category;
    getTotal();
    count.style.display = "none";
    submit.innerText = "Update";
    mode = "update";
    index = item;
    scroll({
        top: 0,
        behavior: "smooth"
    })
}



//search
function getSearchMode(id) {
    let search = document.getElementById("search");
    search.focus();

    if (id == "searchName") {
        searchMode = "title"
    } else {
        searchMode = "category";
    }
    search.placeholder = "Search by " + searchMode;

    search.value = "";
    showProducts();
}

//search
function search(value) {
    let table = "";

    for (let i = 0; i < products.length; i++) {
        if (searchMode === "title") {
            if (products[i].title.toLowerCase().includes(value.toLowerCase())) {
                table += `
                    <tr>
                            <td>${i+1}</td>
                            <td>${products[i].title}</td>
                            <td>${products[i].price}</td>
                            <td>${products[i].taxes}</td>
                            <td>${products[i].ads}</td>
                            <td>${products[i].discount}</td>
                            <td>${products[i].total}</td>
                            <td>${products[i].category}</td>
                            <td><button onclick="updateProduct(${i})" id="update">Update</button></td>
                            <td><button onClick="deleteProduct(${i})" id="delete">Delete</button></td>
                    </tr>
                    `;

            }
        } else {
            if (products[i].category.toLowerCase().includes(value.toLowerCase())) {
                table += `
                    <tr>
                            <td>${i+1}</td>
                            <td>${products[i].title}</td>
                            <td>${products[i].price}</td>
                            <td>${products[i].taxes}</td>
                            <td>${products[i].ads}</td>
                            <td>${products[i].discount}</td>
                            <td>${products[i].total}</td>
                            <td>${products[i].category}</td>
                            <td><button onclick="updateProduct(${i})" id="update">Update</button></td>
                            <td><button onClick="deleteProduct(${i})" id="delete">Delete</button></td>
                    </tr>
                    `;
            }
        }
    }
    tableBody.innerHTML = table;

}

//clear inputs
function clearInputs() {
    title.value = "";
    price.value = "";
    taxes.value = "";
    ads.value = "";
    discount.value = "0";
    total.innerText = "";
    count.value = "1";
    category.value = ""
}

function castStringToNumber(value) {
    return Number(value);
}