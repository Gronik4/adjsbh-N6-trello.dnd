import Storage from './localStorage';
import DraggAndDropp from './DraggAndDropp';

const dnd = new DraggAndDropp();
window.onload = new Storage(dnd).unloading();
window.addEventListener('unload', () => new Storage().loading());

function ExampleTask() {
  const cont = document.querySelectorAll('.cont');
  cont.forEach((item) => {
    const nameCol = item.previousElementSibling.firstElementChild.textContent;
    for (let i = 1; i < 3; i += 1) {
      const task = document.createElement('div');
      task.className = 'task';
      task.innerHTML = `
        <div class="head_task">
        <h4>Задача№${i} в ${nameCol}</h4>
        <h4 class = "delT">X</h4>
        </div>
        <p class="txt_task">Сделать что-то по задаче${i}</p>`;
      task.querySelector('.delT').addEventListener('mousedown', Storage.taskRemove);
      task.addEventListener('mousedown', dnd.dragging);
      item.append(task);
    }
  });
}
document.getElementById('aet').addEventListener('click', ExampleTask);

function writeTask(head, text, field) {
  const task = document.createElement('div');
  task.className = 'task';
  task.innerHTML = `
    <div class="head_task">
    <h4>${head}</h4>
    <h4 class = "delT">X</h4>
    </div>
    <p class="txt_task">${text}</p>`;
  const edit = document.querySelector(`.${field}`);
  task.querySelector('.delT').addEventListener('mousedown', () => task.remove());
  task.addEventListener('mousedown', dnd.dragging);
  edit.append(task);
}

function hiddForm() {
  const formD = document.querySelector('.form');
  document.getElementById('h').value = '';
  document.getElementById('t').value = '';
  formD.style.display = 'none';
}

function addTask(event) {
  const formD = document.querySelector('.form');
  const form = new FormData(formD);
  const head = form.get('task_head');
  const text = form.get('task_cont');
  if (!head || !text) {
    alert('Поля не заполнены.'); // eslint-disable-line no-alert
    hiddForm();
    return;
  }
  const field = event.target.closest('.form').dataset.num;
  writeTask(head, text, field);
  hiddForm();
}

function addForm(event) {
  const form = document.querySelector('.form');
  if (form.style.display === 'block') {
    form.style.display = 'none';
    hiddForm();
  } else {
    form.style.display = 'block';
    document.getElementById('writ').addEventListener('click', addTask, { once: true });
    document.getElementById('res').addEventListener('click', hiddForm);
  }
  const numbColumn = event.target.closest('p').previousElementSibling.dataset.inf;
  form.dataset.num = `${numbColumn}`;
}
const arrAddCard = document.querySelectorAll('.foo');
arrAddCard.forEach((i) => i.addEventListener('click', addForm));
