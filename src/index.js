import './style.css';
import {generateLayoutDOM, createNewListBtn, createList, createListItem} from './createDOM';
import {lists} from './list';

createNewListBtn();
generateLayoutDOM();


const list = createList("title ", "desc");

createListItem('list item', '', list);
createListItem('list item', '', list);
createListItem('list item', '', list);
createListItem('list item', '', list);
createListItem('list item', '', list);