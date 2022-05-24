/**
 * @param {*} startLine - Место откуда взяли носимый узел
 */
let startLine = null;
/**
  * @param {*} gl Цель. Снизу которого узла положить носимый узел.
  * @param {*} flag В целевом узле есть еще задачи или нет
  */
function entranceDestination(gl, flag) {
  const goal = gl;
  const half = 25;
  const fantom = document.createElement('div');
  fantom.className = 'fantom';
  fantom.style.width = `${goal.clientWidth}px`;
  fantom.style.height = `${goal.clientHeight + half}px`;
  fantom.style.background = '#a6f5c6';
  fantom.style.margin = '3px auto';
  if (document.querySelector('.fantom')) { document.querySelector('.fantom').remove(); }
  if (flag === 1) {
    goal.style.background = 'pink';
    goal.after(fantom);
  }
  if (flag === 0) { goal.append(fantom); }
}

function existDestination() {
  const cont = document.querySelectorAll('.task');
  // eslint-disable-next-line no-param-reassign
  cont.forEach((item) => { item.style.background = ''; });
}
/**
  *
  * @param {*} drg Узел который таскаем
  * @param {*} drp Цель. Снизу которого узла положить носимый узел.
  * @param {*} flag В целевом узле есть еще задачи или нет
  */
function droppTask(drg, drp, flag) {
  const dragg = drg;
  const dropp = drp;
  dragg.style.position = '';
  dragg.style.zIndex = '';
  dragg.style.width = '';
  dragg.style.cursor = '';
  dragg.style.left = '';
  dragg.style.top = '';
  if (flag === 1) {
    dropp.style.background = '';
    document.querySelector('.fantom').remove();
    dropp.after(dragg);
    return;
  }
  if (flag === 0) {
    document.querySelector('.fantom').remove();
    dropp.append(dragg);
    return;
  }
  startLine.append(dragg);
}

export default function dragging(event) {
  let destination = null;
  const draggable = event.target.closest('.task');
  const placeGoal = draggable.getBoundingClientRect();
  startLine = event.target.closest('.cont');
  const goalW = getComputedStyle(startLine).width;
  const goalWidth = Number(goalW.slice(0, goalW.length - 2)) * 0.95;
  const shiftX = event.clientX - placeGoal.left;
  const shiftY = event.clientY - placeGoal.top;
  draggable.style.cursor = 'grabbing';
  draggable.style.position = 'absolute';
  draggable.style.zIndex = 200;
  draggable.style.width = `${goalWidth}px`;
  document.body.append(draggable);
  // eslint-disable-next-line no-use-before-define
  moveTask(event.pageX, event.pageY);

  function moveTask(X, Y) {
    draggable.style.left = `${X - shiftX}px`;
    draggable.style.top = `${Y - shiftY}px`;
  }

  /**
    * @param {*} droppBott  - Цель. Снизу которого узла положить носимый узел.
    * @param {*} flag - В родителе целевого узла есть еще узлы или нет
    */
  let droppBott = null; let flag = null;
  // eslint-disable-next-line no-shadow
  function onMouseMove(event) {
    moveTask(event.pageX, event.pageY);
    draggable.hidden = true;
    const goal = document.elementFromPoint(event.clientX, event.clientY);
    draggable.hidden = false;
    if (!goal) return;
    const mbCont = goal.closest('.cont');
    if (goal.closest('.task')) {
      droppBott = goal.closest('.task'); // Если в контейнере cont еще есть задачи....
      flag = 1;
    }
    if (mbCont && mbCont !== startLine && !mbCont.hasChildNodes()) {
      droppBott = mbCont; // Если в контейнере cont задач нет
      flag = 0;
    }

    if (destination !== droppBott) {
      if (destination) { existDestination(); }
      destination = droppBott;
      if (destination) {
        entranceDestination(droppBott, flag);
      }
    }
  }
  document.addEventListener('mousemove', onMouseMove);
  draggable.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.onmouseup = null;
    droppTask(draggable, droppBott, flag);
  }, { once: true });
  draggable.ondragstart = function del() {
    return false;
  };
}
