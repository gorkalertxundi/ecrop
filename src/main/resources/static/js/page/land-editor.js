document.querySelector('#land-editor .land-editor-background').addEventListener('click', closeEditor);
document.querySelector('.land-zone .header .btn').addEventListener('click', openLandEditor);

function openLandEditor(e) {
    let id = null;
    if (e) {
        e.preventDefault();
        id = e.target.parentElement.parentElement.dataset.landId;
    }
    showLandEditor();
    if (id) loadLand(id);
    else createEditor();
}

function createEditor(land) {
    document.querySelector('#land-editor .land-editor-wrap').innerHTML = '';

    const editor = document.createElement('div');
    editor.classList.add('editor-container');
    editor.appendChild(createEditorHeader(land));
    editor.appendChild(createEditorBody(land));
    document.querySelector('#land-editor .land-editor-wrap').appendChild(editor);
}

function createEditorHeader(land) {
    const header = document.createElement('div');
    header.classList.add('header');
    header.appendChild(createEditorTitle(land));
    header.appendChild(createEditorCloseButton());
    return header;
}

function createEditorTitle(land) {
    const title = document.createElement('h2');
    title.innerHTML = land ? 'Edit Land' : 'New land';
    return title;
}

function createEditorCloseButton() {
    const button = document.createElement('a');
    button.classList.add('close-editor');
    button.innerHTML = '<svg viewPort="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg"><line x1="1" y1="11" x2="11" y2="1"/><line x1="1" y1="1" x2="11" y2="11"/></svg>';
    button.addEventListener('click', closeEditor);
    return button;
}

function createEditorBody(land) {
    const body = document.createElement('div');
    body.classList.add('form-wrap');

    const form = createForm(land);
    body.appendChild(form);

    return body;
}

function createForm(land) {
    const form = document.createElement('form');
    form.classList.add('form');
    form.dataset.method = land ? 'PUT' : 'POST';
    form.dataset.url = land ? `land/update` : 'land/create';
    form.addEventListener('submit', submitLand);
    form.appendChild(createFormHeader(land));
    form.appendChild(createFormBody(land));
    return form;
}

function createFormHeader(land) {
    const header = document.createElement('div');
    header.classList.add('form-upper');

    const id = document.createElement('input');
    id.setAttribute('name', 'id');
    id.setAttribute('type', 'hidden');
    id.setAttribute('value', land ? land.id : null);
    header.appendChild(id);

    const nameField = createFormField('name', 'Name', 'text', land ? land.name : null);
    header.appendChild(nameField);

    const submit = document.createElement('input');
    submit.classList.add('form-submit', 'btn');
    submit.setAttribute('type', 'submit');
    submit.setAttribute('value', land ? 'Update' : 'Add new land');
    header.appendChild(submit);

    return header;
}

function createFormBody(land) {
    const body = document.createElement('div');
    body.classList.add('form-lower');

    body.appendChild(createFormField('nitrogen', 'Nitrogen', 'number', land ? land.nitrogen : null));
    body.appendChild(createFormField('phosphorus', 'Phosphorus', 'number', land ? land.phosphorus : null));
    body.appendChild(createFormField('potassium', 'Potassium', 'number', land ? land.potassium : null));
    body.appendChild(createFormField('ph', 'pH', 'number', land ? land.ph : null, true));
    body.appendChild(createFormField('temperature', 'Temperature', 'number', land ? land.temperature : null, true));
    body.appendChild(createFormField('rainfall', 'Rainfall', 'number', land ? land.rainfall : null, true));
    body.appendChild(createFormField('humidity', 'Humidity', 'number', land ? land.humidity : null, true));

    return body;
}

function createFormField(name, label, type, value = null, float = false) {
    const field = document.createElement('div');
    field.classList.add('form-field');

    const labelTag = document.createElement('label');
    labelTag.innerHTML = label;
    field.appendChild(labelTag);

    const input = document.createElement('input');
    input.classList.add('form-input');
    input.setAttribute('name', name);
    input.setAttribute('type', type);
    input.setAttribute('placeholder', label);
    if (float) input.setAttribute('step', 0.01);
    if (value) input.setAttribute('value', value);
    field.appendChild(input);

    return field;
}

function showLandEditor() {
    const landEditor = document.querySelector('#land-editor');
    landEditor.classList.remove('hidden');
}

function hideLandEditor() {
    const landEditor = document.querySelector('#land-editor');
    landEditor.classList.add('hidden');
}

async function loadLand(id) {
    await apiRequest(`land/current?id=${id}`, 'GET', createEditor, null);
}

async function submitLand(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    hideFieldErrors();
    if (form.dataset.method === 'PUT')
        await apiRequest(form.dataset.url, form.dataset.method, landEditedSuccessfully, landEditedError, JSON.stringify(Object.fromEntries(data)));
    else await apiRequest(form.dataset.url, form.dataset.method, landCreatedSuccessfully, landCreatedError, JSON.stringify(Object.fromEntries(data)));
}

function landEditedSuccessfully() {
    closeEditor();
    loadLands(current_page);
    createAlert({ type: 'success', title: 'Land edited successfully!', message: 'The land has been edited successfully' });
}

function landEditedError(errors) {
    showFieldErrors(errors);
    createAlert({ type: 'error', title: 'Could not update land!', message: 'There was an error updating the land information.' });
}

function landCreatedSuccessfully() {
    closeEditor();
    loadLands(0);
    createAlert({ type: 'success', title: 'Land created successfully!', message: 'The land has been created successfully' });
}

function landCreatedError(errors) {
    showFieldErrors(errors);
    createAlert({ type: 'error', title: 'Could not create land!', message: 'Make sure all the required fields are filled in.' });
}

function showFieldErrors(errors) {
    errors.forEach(error => {
        const input = document.querySelector(`[name="${error.field}"]`);
        input.classList.add('error');
        input.parentElement.appendChild(createErrorLabel(error.defaultMessage));
    });
}

function hideFieldErrors() {
    document.querySelectorAll('.form-input.error').forEach(input => {
        input.classList.remove('error');
        const errorLabel = input.parentElement.querySelector('.field-error');
        if (errorLabel) errorLabel.remove();
    });
}

function createErrorLabel(message) {
    const label = document.createElement('span');
    label.classList.add('field-error');
    label.innerHTML = message;
    return label;
}

function closeEditor(e) {
    if (e) e.preventDefault();
    hideLandEditor();
}