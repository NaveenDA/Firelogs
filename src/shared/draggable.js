/* eslint-disable no-param-reassign */
/**
 * A simple method is used make Element draggable
 * @param {HTMLElement} element
 * @param {Function} onDrop
 * @returns {Object} position - The position of the element.
 * @returns {number} position.left - The x coordinate.
 * @returns {number} position.top - The y coordinate
 */
const draggable = (element, onDrop) => {
  let pos1 = 0;
  let pos2 = 0;
  let pos3 = 0;
  let pos4 = 0;

  const elementDrag = (e) => {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    element.style.top = `${element.offsetTop - pos2}px`;
    element.style.left = `${element.offsetLeft - pos1}px`;
  };

  const closedraggable = () => {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    // return object
    onDrop({
      left: element.style.left,
      top: element.style.top
    });
  };

  const dragMouseDown = (e) => {
    // eslint-disable-next-line no-param-reassign
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closedraggable;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  };

  element.onmousedown = dragMouseDown;
};

export default draggable;
