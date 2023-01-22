export let lists = [];
let currentList;


export function ListItem(title, dueDate, list) {
    this.title = title;
    this.dueDate = dueDate;
    this.completed = false;
    this.id = list.items.length + 1;
    this.index = list.items.length;
    this.list = list;
    this.type = "list-item";
}

export function List(title, desc) {
    this.title = title;
    this.desc = desc;
    this.id = ""+Math.floor(100000 + Math.random() * 900000);
    this.index = lists.length;
    this.items = [];
    this.type = "list";
}

export function setCurrentList(list) {
    currentList = list;
}

export function getCurrentList() {
    return currentList;
}