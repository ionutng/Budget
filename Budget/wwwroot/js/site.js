const uriCategories = 'api/categories';

function addCategory() {
    const categoryName = document.querySelector('#addCategoryName');

    const category = {
        name: categoryName.value.trim()
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

        let categories;
        await getCategories().then(data => categories = data);

        categories.forEach(category => {
            let categoryDiv = document.createElement('div');
            categoryDiv.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'gap-2', 'm-2');
            categoriesDiv.appendChild(categoryDiv);

            let name = document.createElement('div');
            name.textContent = category.name;
            name.id = `categoryName${category.id}`;
            categoryDiv.appendChild(name);

            let editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.id = `editCategoryBtn${category.id}`;
            editBtn.addEventListener('click', () => updateCategory(category.id));
            categoryDiv.appendChild(editBtn);

            let deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
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
    const editBtn = document.querySelector(`#editCategoryBtn${id}`);
    const category = {
        id: id,
        name: categoryNameDiv.textContent.trim()
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
