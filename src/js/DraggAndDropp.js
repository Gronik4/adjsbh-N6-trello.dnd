/**
 * @param {*} startLine - Место откуда взяли носимый узел
 * @param {*} droppBott  - Цель. Снизу которого узла положить носимый узел.
 * @param {*} flag - В родителе целевого узла есть еще узлы или нет
*/

export default class DraggAndDropp {
  constructor() {
    this.destination = null;
  }

  static startLine = null;

  dragging(event) {
    this.destination = null;
    const draggabl = event.target.closest('.task');
    const placeGoal = draggabl.getBoundingClientRect();
    DraggAndDropp.startLine = event.target.closest('.cont');
    const goalW = getComputedStyle(DraggAndDropp.startLine).width;
    const goalWidth = Number(goalW.slice(0, goalW.length - 2)) * 0.95;
    const shiftX = event.clientX - placeGoal.left;
    const shiftY = event.clientY - placeGoal.top;
    draggabl.style.cursor = 'grabbing';
    draggabl.style.position = 'absolute';
    draggabl.style.zIndex = 200;
    draggabl.style.width = `${goalWidth}px`;
    document.body.append(draggabl);
    // eslint-disable-next-line no-use-before-define
    moveTask(event.pageX, event.pageY);

    function moveTask(X, Y) {
      draggabl.style.left = `${X - shiftX}px`;
      draggabl.style.top = `${Y - shiftY}px`;
    }

    let droppBott = null;
    let flag = null;
    function onMouseMove(e) {
      moveTask(e.pageX, e.pageY);
      draggabl.hidden = true;
      const goal = document.elementFromPoint(e.clientX, e.clientY);
      draggabl.hidden = false;
      if (!goal) return;
      const mbCont = goal.closest('.cont');
      if (goal.closest('.task')) {
        droppBott = goal.closest('.task'); // Если в контейнере cont еще есть задачи....
        flag = 1;
      }
      if (mbCont && mbCont !== this.startLine && !mbCont.hasChildNodes()) {
        droppBott = mbCont; // Если в контейнере cont задач нет
        flag = 0;
      }

      if (this.destination !== droppBott) {
        if (this.destination) { DraggAndDropp.existDestination(); }
        this.destination = droppBott;
        if (this.destination) {
          DraggAndDropp.entranceDestination(droppBott, flag);
        }
      }
    }

    document.addEventListener('mousemove', onMouseMove);
    draggabl.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.onmouseup = null;
      DraggAndDropp.droppTask(draggabl, droppBott, flag);
    }, { once: true });
    draggabl.ondragstart = function del() {
      return false;
    };
  }

  /**
   *
   * @param {*} gl Цель. Снизу которого узла положить носимый узел.
   * @param {*} flag В целевом узле есть еще задачи или нет
   */
  static entranceDestination(gl, flag) {
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

  static existDestination() {
    const cont = document.querySelectorAll('.task');
    cont.forEach((i) => { i.style.background = ''; });
  }

  /**
 *
 * @param {*} dragg Узел который таскаем
 * @param {*} dropp Цель. Снизу которого узла положить носимый узел.
 * @param {*} flag В целевом узле есть еще задачи или нет
 */
  static droppTask(drg, drp, flag) {
    const dragg = drg;
    const dropp = drp;
    dragg.style.position = '';
    dragg.style.zIndex = '';
    dragg.style.width = '';
    dragg.style.cursor = '';
    dragg.style.left = '';
    dragg.style.top = '';
    if (document.querySelector('.fantom')) { document.querySelector('.fantom').remove(); }
    if (flag === 1) {
      dropp.style.background = '';
      dropp.after(dragg);
      return;
    }
    if (flag === 0) {
      dropp.append(dragg);
      return;
    }
    DraggAndDropp.startLine.append(dragg);
  }
}
