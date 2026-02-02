let readyToAssign = parseFloat(localStorage.getItem('readyMoney')) || 0;
let categories = JSON.parse(localStorage.getItem('categories')) || [];

updateUI();

function addInflow() {
    const amount = parseFloat(document.getElementById('income-amount').value);
    if (isNaN(amount) || amount <= 0) return;
    readyToAssign += amount;
    saveAndRender();
}

function addNewCategory() {
    const nameInput = document.getElementById('new-cat-name');
    if (nameInput.value === "") return;

    const newCategory = {
        id: Date.now(), // Unique ID for each category
        name: nameInput.value,
        balance: 0
    };

    categories.push(newCategory);
    nameInput.value = ""; // Clear the input
    saveAndRender();
}

function assignMoney(id) {
    const input = document.getElementById(`assign-${id}`);
    const amount = parseFloat(input.value);
    
    if (isNaN(amount) || amount > readyToAssign) {
        alert("Not enough money!");
        return;
    }

    const cat = categories.find(c => c.id === id);
    readyToAssign -= amount;
    cat.balance += amount;
    saveAndRender();
}

function spendMoney(id) {
    const input = document.getElementById(`spend-${id}`);
    const amount = parseFloat(input.value);
    const cat = categories.find(c => c.id === id);

    if (isNaN(amount) || amount > cat.balance) {
        alert("Not enough in category!");
        return;
    }

    cat.balance -= amount;
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('readyMoney', readyToAssign);
    localStorage.setItem('categories', JSON.stringify(categories));
    updateUI();
}

function updateUI() {
    document.getElementById('ready-to-assign').innerText = readyToAssign.toFixed(2);
    
    const list = document.getElementById('categories-list');
    list.innerHTML = ""; 

    categories.forEach(cat => {
        list.innerHTML += `
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3>${cat.name}</h3>
                    <button onclick="deleteCategory(${cat.id})" class="btn-delete">×</button>
                </div>
                <p class="balance">$${cat.balance.toFixed(2)}</p>
                <div class="card-actions">
                    <input type="number" id="assign-${cat.id}" placeholder="Assign">
                    <button onclick="assignMoney(${cat.id})">Assign</button>
                </div>
                <div class="card-actions">
                    <input type="number" id="spend-${cat.id}" placeholder="Spend">
                    <button onclick="spendMoney(${cat.id})" class="btn-spend">Spend</button>
                </div>
            </div>
        `;
    });
}


function deleteCategory(id) {
    // Confirm with the user first so they don't accidentally delete a category
    if (confirm("Are you sure you want to delete this category? Any money assigned to it will be lost.")) {
        // We "filter" the list: keep everything where the id is NOT the one we clicked
        categories = categories.filter(cat => cat.id !== id);
        saveAndRender();
    }
}