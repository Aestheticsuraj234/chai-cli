const KEY = 'todos.v1';

let todos = JSON.parse(localStorage.getItem(KEY) || '[]');
let filter = 'all';

const $list = document.getElementById('list');
const $form = document.getElementById('form');
const $input = document.getElementById('input');
const $count = document.getElementById('count');

const save = () => localStorage.setItem(KEY, JSON.stringify(todos));

function visible() {
  if (filter === 'active') return todos.filter(t => !t.done);
  if (filter === 'done') return todos.filter(t => t.done);
  return todos;
}

function render() {
  const items = visible();
  $list.innerHTML = '';

  if (!items.length) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = filter === 'all' ? 'Your list is clear.' : `No ${filter} items.`;
    $list.append(li);
  }

  for (const t of items) {
    const li = document.createElement('li');
    li.className = 'item' + (t.done ? ' done' : '');

    const box = document.createElement('span');
    box.className = 'box';
    box.setAttribute('role', 'checkbox');
    box.setAttribute('aria-checked', String(t.done));
    box.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
    box.onclick = () => { t.done = !t.done; save(); render(); };

    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = t.text;

    const del = document.createElement('button');
    del.className = 'del';
    del.textContent = '×';
    del.setAttribute('aria-label', 'Delete');
    del.onclick = () => { todos = todos.filter(x => x.id !== t.id); save(); render(); };

    li.append(box, label, del);
    $list.append(li);
  }

  const left = todos.filter(t => !t.done).length;
  $count.textContent = !todos.length ? 'Nothing yet'
    : left ? `${left} item${left > 1 ? 's' : ''} left`
    : 'All done ✦';
}

$form.onsubmit = e => {
  e.preventDefault();
  const text = $input.value.trim();
  if (!text) return;
  todos.unshift({ id: Date.now(), text, done: false });
  $input.value = '';
  save();
  render();
};

document.getElementById('filters').onclick = e => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  filter = btn.dataset.filter;
  document.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-active', c === btn));
  render();
};

document.getElementById('clear').onclick = () => {
  todos = todos.filter(t => !t.done);
  save();
  render();
};

render();
