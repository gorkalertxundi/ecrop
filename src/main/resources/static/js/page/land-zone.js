var current_page = 0;
loadLands();

async function loadLands(page = 0) {
    console.log('loadLands', page);
    await apiRequest(`land/current/all?page=${page}&size=4`, 'GET', showLands, null);
}

function showLands(response) {
    const landList = document.querySelector('#land-list');
    landList.innerHTML = '';
    response.content.forEach(land => {
        console.log(land)
        landList.appendChild(createLandItem(land));
    });
    showPagination(response);
}

function createLandItem(land) {
    const landElement = document.createElement('div');
    landElement.dataset.landId = land.id;
    landElement.classList.add('land');

    landElement.appendChild(createTitleBar(land));
    landElement.appendChild(createData(land));
    landElement.appendChild(createActionButtons(land));


    return landElement;
}

function createTitleBar(land) {
    const titleBar = document.createElement('div');
    titleBar.classList.add('title');

    const name = document.createElement('h2');
    name.innerHTML = land.name;
    titleBar.appendChild(name);
    return titleBar;
}

function createData(land) {
    const data = document.createElement('div');
    data.classList.add('data');

    const nutrients = document.createElement('div');
    nutrients.classList.add('nutrients', 'data-container');
    data.appendChild(nutrients);

    const nutrientsTitle = document.createElement('h3');
    nutrientsTitle.innerHTML = 'Nutrients';
    nutrients.appendChild(nutrientsTitle);
    nutrients.appendChild(createNutrientList(land));

    const recommendation = document.createElement('div');
    recommendation.classList.add('recommendation', 'data-container');
    data.appendChild(recommendation);

    const recommendationTitle = document.createElement('h3');
    recommendationTitle.innerHTML = 'Recommended Crop';
    recommendation.appendChild(recommendationTitle);
    recommendation.appendChild(createRecommendation(land));

    return data;
}

function createActionButtons(land) {
    const buttons = document.createElement('div');
    buttons.classList.add('action-buttons');
    buttons.appendChild(createDeleteButton());
    buttons.appendChild(createDownloadButton(land));
    buttons.appendChild(createUpdateButton());
    return buttons;
}

function createUpdateButton() {
    const button = document.createElement('a');
    button.classList.add('edit-land', 'btn');
    button.innerHTML = 'Update nutrients';
    button.addEventListener('click', openLandEditor);
    return button;
}

function createDownloadButton(land) {
    const button = document.createElement('a');
    button.classList.add('download-land', 'btn');
    button.innerHTML = 'Download';
    delete land.id;
    button.addEventListener('click', () => {
        console.log(land);
        const a = document.createElement("a");
        const file = new Blob([JSON.stringify(land)], { type: 'text/plain' });
        a.href = URL.createObjectURL(file);
        a.download = `${land.name}.json`;
        a.click();
    });

    return button;
}

function createDeleteButton() {
    const button = document.createElement('a');
    button.classList.add('delete-land', 'btn');
    button.innerHTML = 'Delete';
    button.addEventListener('click', deleteLand);
    return button;
}

function createNutrientList(land) {
    const list = document.createElement('ul');

    list.appendChild(createNutrient('N:', land.nitrogen));
    list.appendChild(createNutrient('P:', land.phosphorus));
    list.appendChild(createNutrient('K:', land.potassium));
    list.appendChild(createNutrient('pH:', land.ph));
    list.appendChild(createNutrient('T:', land.temperature));
    list.appendChild(createNutrient('H:', land.humidity));
    list.appendChild(createNutrient('R:', land.rainfall));

    return list;
}

function createNutrient(title, value) {
    const nutrient = document.createElement('li');
    const nutrientTitle = document.createElement('span');
    nutrientTitle.innerHTML = title;
    nutrientTitle.classList.add('tag');
    nutrient.appendChild(nutrientTitle);
    nutrient.innerHTML += ` ${value ? value : '-'}`;
    return nutrient;
}

function createRecommendation(land) {
    const recommendation = document.createElement('span');
    recommendation.classList.add('recommendation');
    recommendation.innerHTML = `${land.recommendation ? land.recommendation : '-'}`;
    return recommendation;
}

async function deleteLand(e) {
    if (!e) return;
    e.preventDefault();

    const id = e.target.parentElement.parentElement.dataset.landId;
    await apiRequest(`land/delete?id=${id}`, 'DELETE', deleteSuccessfull, deleteError);
}

function showPagination(response) {
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';
    console.log(response);

    if (response.totalPages > 1) {
        if (!response.first) {
            const previous = document.createElement('a');
            previous.innerHTML = '<';
            previous.classList.add('page');
            previous.addEventListener('click', () => {
                loadLands(0);
            });
            pagination.appendChild(previous);
        }

        for (let i = 0; i < response.totalPages; i++) {
            const page = document.createElement('a');
            page.innerHTML = i + 1;
            page.classList.add('page', 'page-numeric');
            if (i === response.pageable.pageNumber)
                page.classList.add('active');
            else page.addEventListener('click', () => {
                loadLands(page.dataset.page);
                current_page = page.dataset.page;
            });
            page.dataset.page = i;
            pagination.appendChild(page);
        }

        if (!response.last) {
            const next = document.createElement('a');
            next.innerHTML = '>';
            next.classList.add('page');
            next.addEventListener('click', () => {
                loadLands(response.totalPages - 1);
            });
            pagination.appendChild(next);
        }
    }
}

function deleteSuccessfull(response) {
    loadLands(current_page);
    createAlert({ type: 'success', title: 'Land deleted successfully!', message: 'The land has been deleted' });
}

function deleteError(response) {
    createAlert({ type: 'error', title: 'Error deleting land!', message: 'There was an error deleting the land' });
}