﻿const uriCategories = 'api/categories';
const uriTransactions = 'api/transactions';

function addCategory() {
    let categoryName = document.querySelector('#addCategoryName').value.trim();
    categoryName = categoryName.toString()[0].toUpperCase() + categoryName.slice(1).toLowerCase();

    const category = {
        name: categoryName
    }

    fetch(uriCategories, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    })
        .then(res => res.json())
        .then(() => {
            categoryName.value = '';
        })
        .catch(err => console.error('Unable to add a category.', err));
}

function getCategories() {
    return fetch(uriCategories)
        .then(res => res.json())
        .then(data => data)
        .catch(err => console.error('Unable to get categories.', err));
}

async function displayCategories() {
    const showCategoriesBtn = document.querySelector('#showCategoriesBtn');
    if (showCategoriesBtn.textContent === 'Show Categories') {
        const categoriesDiv = document.querySelector('#categoriesDiv');
        categoriesDiv.textContent = '';
        categoriesDiv.removeAttribute('hidden');

        let categories = await getCategories();

        categories.forEach(category => {
            let categoryDiv = document.createElement('div');
            categoryDiv.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'gap-2', 'm-2');
            categoriesDiv.appendChild(categoryDiv);

            let name = document.createElement('div');
            name.textContent = category.name;
            name.id = `categoryName${category.id}`;
            name.classList.add('lead', 'fw-bold');
            categoryDiv.appendChild(name);

            let editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.id = `editCategoryBtn${category.id}`;
            editBtn.classList.add('btn', 'btn-warning');
            editBtn.addEventListener('click', () => updateCategory(category.id));
            categoryDiv.appendChild(editBtn);

            let deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('btn', 'btn-danger');
            deleteBtn.addEventListener('click', () => deleteCategory(category.id));
            categoryDiv.appendChild(deleteBtn);
        });
        showCategoriesBtn.textContent = 'Hide Categories';
    } else {
        showCategoriesBtn.textContent = 'Show Categories';
        document.querySelector('#categoriesDiv').setAttribute('hidden', '');
    }
}

function updateCategory(id) {
    const categoryNameDiv = document.querySelector(`#categoryName${id}`);
    let categoryName = categoryNameDiv.textContent.trim().toString()[0].toUpperCase() + categoryNameDiv.textContent.trim().slice(1).toLowerCase();
    const editBtn = document.querySelector(`#editCategoryBtn${id}`);
    const category = {
        id: id,
        name: categoryName
    }

    if (editBtn.textContent === 'Edit') {
        editBtn.textContent = 'Save';
        categoryNameDiv.contentEditable = true;
        categoryNameDiv.focus();
    } else {
        editBtn.textContent = 'Edit';
        categoryNameDiv.contentEditable = false;

        fetch(`${uriCategories}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(category)
        })
            .then(() => displayCategories())
            .catch(err => console.error('Unable to update category.', err));
    }
}

function deleteCategory(id) {
    fetch(`${uriCategories}/${id}`, {
        method: 'DELETE'
    })
        .then(() => displayCategories())
        .catch(err => console.error('Unable to delete category.', err));
}

function showAddCategoryForm() {
    const addCategoriesBtn = document.querySelector('#addCategoriesBtn');
    const addCategoryDiv = document.querySelector('#addCategoryDiv');

    if (addCategoriesBtn.textContent === 'Add Category') {
        addCategoriesBtn.textContent = 'Hide Category Form';
        addCategoryDiv.removeAttribute('hidden');
    } else {
        addCategoriesBtn.textContent = 'Add Category';
        addCategoryDiv.setAttribute('hidden', '');
        document.querySelector('#addCategoryName').value = '';
    }
}

async function addTransaction() {
    let transactionName = document.querySelector('#addTransactionName').value.trim();
    transactionName = transactionName.toString()[0].toUpperCase() + transactionName.slice(1).toLowerCase();
    let transactionDate = document.querySelector('#addTransactionDate');
    if (Date.parse(transactionDate.value) > Date.now())
        transactionDate.value = '';
    const transactionAmount = document.querySelector('#addTransactionAmount');
    const categoriesSelect = document.querySelector('#categories');
    const selectedCategory = categoriesSelect.value;

    let categories = await getCategories();

    let category;
    categories.forEach(c => {
        if (c.name === selectedCategory)
            category = c;
    });

    const transaction = {
        name: transactionName,
        date: transactionDate.value,
        amount: parseInt(transactionAmount.value.trim(), 10),
        categoryId: category.id
    }

    fetch(uriTransactions, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transaction)
    })
        .then(res => res.json())
        .catch(err => console.error('Unable to add a transaction.', err));
}

function getTransactions() {
    return fetch(uriTransactions)
        .then(res => res.json())
        .then(data => data)
        .catch(err => console.error('Unable to get transactions.', err));
}

async function displayTransactions() {
    const showTransactionsBtn = document.querySelector('#showTransactionsBtn');
    const transactionsTable = document.querySelector('#transactionsTable');
    const searchTransactionsForm = document.querySelector('#searchTransactionsForm');

    if (showTransactionsBtn.textContent === 'Show Transactions') {
        showTransactionsBtn.textContent = 'Hide Transactions';
        transactionsTable.removeAttribute('hidden');
        let transactionsData = await getTransactions();

        fillTableWithData(transactionsData);

        document.querySelector('#dateth').addEventListener('click', () => sortTransactionsByDate(transactionsData));
        document.querySelector('#categoryth').addEventListener('click', () => sortTransactionsByCategory(transactionsData));
    } else {
        showTransactionsBtn.textContent = 'Show Transactions';
        transactionsTable.setAttribute('hidden', '');
        searchTransactionsForm.setAttribute('hidden', '');
        document.querySelector('#searchTransactionName').value = '';
    }
}

async function updateTransaction(id) {
    const editTransactionBtn = document.querySelector(`#editTransactionBtn${id}`);
    let transactionName = document.querySelector(`#transactionName${id}`);
    let transactionDate = document.querySelector(`#transactionDate${id}`);
    const transactionAmount = document.querySelector(`#transactionAmount${id}`);
    const transactionCategory = document.querySelector(`#transactionCategory${id}`);
    let categories = await getCategories();

    if (editTransactionBtn.textContent === 'Edit') {
        editTransactionBtn.textContent = 'Save';

        transactionName.contentEditable = true;
        transactionName.focus();
        transactionAmount.contentEditable = true;

        let date = document.createElement('input');
        date.type = 'date';
        date.id = `date${id}`;
        date.classList.add('form-control');
        date.value = transactionDate.textContent;
        transactionDate.textContent = '';
        transactionDate.appendChild(date);

        let select = document.createElement('select');
        select.id = `select${id}`;
        select.classList.add('form-select');

        categories.forEach(category => {
            let categoryOption = document.createElement('option');
            categoryOption.setAttribute('value', category.name);
            categoryOption.textContent = category.name;
            select.appendChild(categoryOption);
        });

        select.value = transactionCategory.textContent;
        transactionCategory.textContent = '';
        transactionCategory.appendChild(select);
    } else {
        editTransactionBtn.textContent = 'Edit';
        transactionName.contentEditable = false;
        transactionAmount.contentEditable = false;

        transactionName = transactionName.textContent.trim().toString()[0].toUpperCase() + transactionName.textContent.trim().slice(1).toLowerCase();

        const date = document.querySelector(`#date${id}`);
        transactionDate.textContent = date.value;
        date.remove();
        if (Date.parse(transactionDate.textContent) > Date.now())
            transactionDate.textContent = '';

        const select = document.querySelector(`#select${id}`);
        transactionCategory.textContent = select.value;
        select.remove();

        let category;
        categories.forEach(c => {
            if (c.name === transactionCategory.textContent)
                category = c;
        });

        const transaction = {
            id: id,
            name: transactionName,
            date: transactionDate.textContent,
            amount: parseInt(transactionAmount.textContent.trim(), 10),
            categoryId: category.id
        };

        fetch(`${uriTransactions}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
        })
            .then(() => displayTransactions())
            .catch(err => console.error('Unable to update transactions', err));
    }
}

function deleteTransaction(id) {
    fetch(`${uriTransactions}/${id}`, {
        method: 'DELETE'
    })
        .then(() => displayTransactions())
        .catch(err => console.error('Unable to delete a transaction', err));
}

async function showAddTransactionForm() {
    const addTransactionsBtn = document.querySelector('#addTransactionsBtn');
    const addTransactionDiv = document.querySelector('#addTransactionDiv');
    const categoriesSelect = document.querySelector('#categories');

    let categories = await getCategories();

    if (addTransactionsBtn.textContent === 'Add Transaction') {
        addTransactionsBtn.textContent = 'Hide Transaction Form';
        addTransactionDiv.removeAttribute('hidden');

        categories.forEach(category => {
            let categoryOption = document.createElement('option');
            categoryOption.setAttribute('value', category.name);
            categoryOption.textContent = category.name;
            categoriesSelect.appendChild(categoryOption);
        });
    } else {
        addTransactionsBtn.textContent = 'Add Transaction';
        addTransactionDiv.setAttribute('hidden', '');
        document.querySelector('#addTransactionName').value = '';
        document.querySelector('#addTransactionDate').value = '';
        document.querySelector('#addTransactionAmount').value = '';
        categories.forEach(() => {
            categoriesSelect.remove(document.querySelector('option'));
        });
    }
}

async function searchTransactionsByName() {
    const searchTransactionName = document.querySelector('#searchTransactionName');
    let transactions;
    if (searchTransactionName.value.trim() === '')
        transactions = await getTransactions();
    else
        transactions = await getTransactionByName(searchTransactionName.value.trim());

    fillTableWithData(transactions);
}

async function getTransactionByName(name) {
    let myTransactions = [];
    let transactions = await getTransactions();

    transactions.forEach(transaction => {
        if (transaction.name.toString().toLowerCase().includes(name.toString().toLowerCase()))
            myTransactions.push(transaction);

    });

    return myTransactions;
}

async function sortTransactionsByDate(transactions) {
    let categories = await Promise.all(transactions.map(transaction => getCategoryById(transaction.categoryId)));

    transactions.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

    fillTableWithData(transactions);
}

async function sortTransactionsByCategory(transactions) {
    let categories = await Promise.all(transactions.map(transaction => getCategoryById(transaction.categoryId)));

    transactions.sort((a, b) => {
        let categoryA = categories.find(category => category.id === a.categoryId);
        let categoryB = categories.find(category => category.id === b.categoryId);

        return categoryA.name.localeCompare(categoryB.name);
    });

    fillTableWithData(transactions);
}

function getCategoryById(id) {
    return fetch(`${uriCategories}/${id}`)
        .then(res => res.json())
        .then(data => data)
        .catch(err => console.error('Unable to get a category by id', err));
}

async function fillTableWithData(data) {
    const tBodyTransactions = document.querySelector('#transactions');
    tBodyTransactions.textContent = '';

    let categories = await getCategories();

    data.forEach(transaction => {
        let tr = tBodyTransactions.insertRow();
        tr.classList.add('align-middle');

        let td1 = tr.insertCell(0);
        let name = document.createElement('div');
        name.id = `transactionName${transaction.id}`;
        name.textContent = transaction.name;
        td1.appendChild(name);

        let td2 = tr.insertCell(1);
        let date = document.createElement('div');
        date.id = `transactionDate${transaction.id}`;
        date.textContent = formatDate(transaction.date);
        td2.appendChild(date);

        let td3 = tr.insertCell(2);
        let amount = document.createElement('div');
        amount.id = `transactionAmount${transaction.id}`;
        amount.textContent = transaction.amount;
        td3.appendChild(amount);

        let category;
        categories.forEach(c => {
            if (c.id === transaction.categoryId)
                category = c;
        });

        let td4 = tr.insertCell(3);
        let categoryDiv = document.createElement('div');
        categoryDiv.id = `transactionCategory${transaction.id}`;
        categoryDiv.textContent = category.name;
        td4.appendChild(categoryDiv);

        let td5 = tr.insertCell(4);
        let editBtn = document.createElement('button');
        editBtn.id = `editTransactionBtn${transaction.id}`;
        editBtn.textContent = 'Edit';
        editBtn.classList.add('btn', 'btn-warning');
        editBtn.addEventListener('click', () => updateTransaction(transaction.id));
        td5.appendChild(editBtn);

        let td6 = tr.insertCell(5);
        let deleteBtn = document.createElement('button');
        deleteBtn.id = `deleteTransactionBtn${transaction.id}`;
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('btn', 'btn-danger');
        deleteBtn.addEventListener('click', () => deleteTransaction(transaction.id));
        td6.appendChild(deleteBtn);

        searchTransactionsForm.removeAttribute('hidden');
    });
}

function formatDate(inputDate) {
    const dateParts = inputDate.split('-');
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[parseInt(month) - 1];

    return `${day}-${monthName}-${year}`;
}