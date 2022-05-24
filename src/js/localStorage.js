export default class Storage {
  constructor(dnd) {
    this.dnd = dnd;
    this.elemCt = document.querySelectorAll('.cont');
  }

  static taskRemove(event) {
    event.stopPropagation();
    event.target.closest('.task').remove();
  }

  loading() {
    localStorage.clear();
    for (let i = 0; i < this.elemCt.length; i += 1) {
      localStorage.setItem(`${this.elemCt[i].dataset.inf}`, JSON.stringify(this.elemCt[i].innerHTML));
    }
  }

  unloading() {
    for (let i = 0; i < this.elemCt.length; i += 1) {
      const a = localStorage.getItem(`${this.elemCt[i].dataset.inf}`);
      this.elemCt[i].innerHTML = JSON.parse(a);
    }
    document.querySelectorAll('.task').forEach((item) => {
      item.querySelector('.delT').addEventListener('mousedown', Storage.taskRemove);
      item.addEventListener('mousedown', this.dnd.dragging);
    });
  }
}
