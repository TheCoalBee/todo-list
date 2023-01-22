import {lists} from './list';
import {List, ListItem, setCurrentList, getCurrentList} from './list';
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'

// Return DOM element
function createDOM(type, id, classList, value, content) {
    const element = document.createElement(type);
    (id !== undefined) && (element.id = id);
    (classList !== undefined) && (element.classList = classList);
    (value !== undefined) && (element.value = value);
    (content !== undefined) && (element.innerHTML = content);

    return element;
}

// Return form DOM element
function createFormDOM(parent) {
    const container = createDOM('div', 'form', 'form-container');
        container.addEventListener('click', () => {
            deleteDOM(container);
        });

        const form = createDOM('form', undefined, 'form');

            const label = createDOM('h1', undefined, 'form-label');
            (parent.type == "list") ? (label.innerHTML = "Create new list item") : (label.innerHTML = "Create new list");

            const title = createDOM('input', 'form-title', 'form-title');
                title.type = 'text';
                title.placeholder = "Name";
                title.required = true;

            const desc = createDOM('input', undefined, 'form-desc');
                desc.type = 'text';
                desc.placeholder = "Description";

            const dueDate = createDOM('input', undefined, 'form-due-date');
                dueDate.type = 'date';
    
            const btnContainer = createDOM('div', undefined, 'form-btn-container');
                const submit = createDOM('input', undefined, 'form-submit', "Submit");
                    submit.type = "submit";

                const cancel = createDOM('input', undefined, 'form-cancel', "Cancel");
                    cancel.type = "button";
                    cancel.addEventListener('click', deleteForm);

                btnContainer.append(submit, cancel);

            (parent.type == "list") ? (form.append(label, title, dueDate, btnContainer)) : (form.append(label, title, desc, btnContainer));

            form.addEventListener('click', (event) => {event.stopPropagation()});
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                if (parent.type == "list") {
                    createListItem(title.value, dueDate.value, parent);
                } else {
                    createList(title.value, desc.value);
                }
                deleteForm();
            }, false);

        container.append(form);

    return container;
}

// Return list DOM element
function createListDOM(list) {
    const container = createDOM('div', list.id, "list");
        const header = createDOM('div', undefined, 'list-header');
            const title = createDOM('input', undefined, 'list-title', list.title);
                title.type = "text";
                title.addEventListener('focusout', () => {
                    if (title.value.length > 0) {
                        list.title = title.value;
                        updateNavDOM();
                    } else {
                        title.value = list.title;
                    }
                });
                title.spellcheck = false;

            const desc = createDOM('p', undefined, 'list-desc', undefined, list.desc);

            const completed = createDOM('p', undefined, 'list-completed', undefined, generateItemsCompletedDOM(list));

            const btnContainer = createDOM('div', undefined, "list-btn-container");
                const createListItemBtn = createDOM('button', undefined, "add-list-item", undefined, '<i class="fa-solid fa-fw fa-plus"></i>')
                createListItemBtn.addEventListener('click', () => {
                    document.body.append(createFormDOM(list))
                    document.querySelector('.form-title').focus();
                });

                const editListBtn = createDOM('button', undefined, "edit-list-btn", )

                const deleteListBtn = createDOM('button', undefined, "delete-list-btn", undefined, '<i class="fa-solid fa-fw fa-trash"></i>')
                deleteListBtn.addEventListener('click', () => {deleteList(list)});
            btnContainer.append(createListItemBtn, deleteListBtn);

            header.append(title, desc, completed, btnContainer);
   
        container.append(header);
    
    return container;
}

// Return list item DOM element
function createListItemDOM(listItem) {
    const container = createDOM('div', `${listItem.list.id}-${listItem.id}`, 'list-item');
    
        let checked;
        if (listItem.completed) {
            checked = createDOM('i', undefined, "fa-solid fa-square fa-fw");
        } else {
            checked = createDOM('i', undefined, "fa-regular fa-square fa-fw");
        }
    
        const title = createDOM('input', undefined, 'list-item-title', `${listItem.title}`, undefined);
            title.type = "text";
            title.addEventListener('click', (event) => {
                event.stopPropagation();
            })
            title.addEventListener('input', () => {
                if (title.value.length < 100) {
                    console.log(title.value.length);
                    listItem.title = title.value; 
                } else {
                    title.value = listItem.title;
                }
            })
            title.spellcheck = false;
        
        const dueDate = createDOM('p', undefined, 'list-item-due-date', undefined, listItem.dueDate);
        if (dueDate !== undefined) {
            dueDate.innerHTML = "No date set";
        } else {
            dueDate.innerHTML = listItem.dueDate;
        }

        const deleteBtnContainer = createDOM('div', 'list-item-delete-container');
        const deleteBtn = createDOM('i', undefined, 'list-item-delete fa-solid fa-xmark');
        deleteBtnContainer.append(deleteBtn);
        deleteBtnContainer.addEventListener('click', () => {
            deleteListItem(listItem);
        })

        container.addEventListener('click', () => {
            container.querySelector('svg').remove();

            if (!listItem.completed) {
                container.prepend(createDOM('i', undefined, "fa-solid fa-square fa-fw"));
            } else {
                container.prepend(createDOM('i', undefined, "fa-regular fa-square fa-fw"));
            }
            listItem.completed = !listItem.completed;

            console.log(document.querySelector('.list-completed'));

            document.querySelector('.list-completed').innerHTML = generateItemsCompletedDOM(listItem.list);
        });

        container.append(checked, title, dueDate, deleteBtnContainer);

        
    return container;
}

function generateItemsCompletedDOM(list) {
    let complete = 0;
    const total = list.items.length;
    if (total == 0) return "";

    for (let i = 0; i < total; i++) {
        if (list.items[i].completed == true) complete++;
    }

    if (complete == total) return "All items completed";
    return `${complete}/${total} items completed`;
}


function addItemToList(listItem, list) {
    list.items.push(listItem);
}

function addListToArray(list) {
    lists.push(list);
    setCurrentList(list);
}

// Create list item and add to array
export function createListItem(title, dueDate, list) {
    const newListItem = new ListItem(title, dueDate, list);

    addItemToList(newListItem, list);

    updateListItemsDOM(list);

    return newListItem;
}

export function createList(title, desc) {
    const newList = new List(title, desc);

    addListToArray(newList);

    generateListDOM(newList);

    updateNavDOM();

    return newList;
}

function removeItemFromList(listItem) {
    const index = listItem.list.items.indexOf(listItem);
    listItem.list.items.splice(index, 1);
    updateIndex(listItem.list.items);
}
function removeListFromArray(list) {
    const index = lists.indexOf(list);
    lists.splice(index, 1);
    updateIndex(lists);
    setCurrentList(null);
}

// Delete list item and corresponding DOM element
function deleteList(list) {
    removeListFromArray(list);

    deleteDOM(document.getElementById(list.id));

    updateNavDOM();
}

function deleteListItem(listItem) {
    removeItemFromList(listItem);

    deleteDOM(document.getElementById(`${listItem.list.id}-${listItem.index}`));

    updateListItemsDOM(listItem.list);
}

// Create fixed new list btn
export function createNewListBtn() {
    const newListBtn = createDOM('button', undefined, "add-list-btn", undefined, '<i class="fa-solid fa-fw fa-plus"></i>')
    document.body.append(newListBtn);
    newListBtn.addEventListener('click', () => {
        document.body.append(createFormDOM(document.body));
        document.getElementById('form-title').focus();
    });
}

function deleteDOM(element) {
    if (element !== null) element.remove();
}

function updateIndex(array) {
    for (let i = 0; i < array.length; i++) {
        array[i].index = i;
    }
}

export function generateLayoutDOM() {
    const header = createDOM('header', 'header', 'header');
        const title = createDOM('h1', 'head-title', 'header-title', undefined, "To-Do List");

        header.append(title);

    const container = createDOM('div', 'container', 'container');
        const nav = createDOM('nav', 'nav-bar', 'nav-bar');

        const listContainer = createDOM('div', 'list-container', 'list-container');

        container.append(nav, listContainer);

    document.body.append(header, container);
}

function updateNavDOM() {
    const nav = document.getElementById('nav-bar');
    nav.innerHTML = "";
    for (let i = 0; i < lists.length; i++) {
        const list = createDOM('li', `${lists[i].id}-nav-link`, "nav-link", undefined, lists[i].title);
        list.addEventListener('click', () => {
            generateListDOM(lists[i]);
            setCurrentList(lists[i]);
            navActiveDOM();
        })
        nav.append(list);
    }
    navActiveDOM();
}

function updateListItemsDOM(list) {
    const listDOM = document.getElementById(list.id);

    const items = document.getElementsByClassName('list-item');
    while (items[0]) {
        items[0].parentNode.removeChild(items[0])
    }

    for (let i = 0; i < list.items.length; i++) {
        listDOM.append(createListItemDOM(list.items[i]));
    }

    document.querySelector('.list-completed').innerHTML = generateItemsCompletedDOM(list);
}

function navActiveDOM() {
    const links = document.getElementsByClassName('nav-link');
    for (let i = 0; i < links.length; i++) {
        links[i].classList.remove('nav-link-active');
    }
    if (getCurrentList() !== null) document.getElementById(`${getCurrentList().id}-nav-link`).classList.add('nav-link-active');
}

function generateListDOM(list) {
    const listContainer = document.getElementById('list-container');
    deleteDOM(listContainer.querySelector('.list'));

    listContainer.append(createListDOM(list));

    updateListItemsDOM(list);
}

function deleteForm() {
    deleteDOM(document.getElementById('form'));
}
