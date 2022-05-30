var current_page = 0;
loadLands();

async function loadLands(page = 0) {
    console.log('loadLands');
    await apiRequest(`/land/current/all?page=${page}`, 'GET', showLands, null);
}

function showLands(response) {
    const landList = document.querySelector('#land-list');
    response.content.forEach(land => {
        console.log(land)
        landList.appendChild(createLandItem(land));
    });
}

function createLandItem(land) {
    const landElement = document.createElement('div');
    landElement.dataset.landId = land.id;
    landElement.classList.add('land');

    const titleBar = document.createElement('div');
    titleBar.classList.add('title');
    landElement.appendChild(titleBar);

    const name = document.createElement('h2');
    name.innerHTML = land.name;
    titleBar.appendChild(name);


    const data = document.createElement('div');
    data.classList.add('data');
    landElement.appendChild(data);

    const nutrients = document.createElement('div');
    nutrients.classList.add('nutrients');
    data.appendChild(nutrients);


    const nutrientsTitle = document.createElement('h3');
    nutrientsTitle.innerHTML = 'Nutrients';
    nutrients.appendChild(nutrientsTitle);
    nutrients.appendChild(createNutrientList(land));

    const recommendations = document.createElement('div');
    recommendations.classList.add('recommendations');
    recommendations.innerHTML = '';
    data.appendChild(recommendations);

    return landElement;
}

function createNutrientList(land) {
    const list = document.createElement('ul');

    list.appendChild(createNutrient('N', land.nitrogen));
    list.appendChild(createNutrient('P', land.phosphorus));
    list.appendChild(createNutrient('K', land.potassium));
    list.appendChild(createNutrient('pH', land.ph));
    list.appendChild(createNutrient('T', land.temperature));
    list.appendChild(createNutrient('H', land.humidity));

    return list;
}

function createNutrient(title, value) {
    const nutrient = document.createElement('li');
    const nutrientTitle = document.createElement('span');
    nutrientTitle.innerHTML = title;
    nutrientTitle.classList.add('tag');
    nutrient.appendChild(nutrientTitle);
    nutrient.innerHTML += `: ${value}`;
    return nutrient;
}

function showPagination() {
    
}