const apiBase = '/api/books';

async function fetchBooks() {
  const res = await fetch(`${apiBase}/allBooks`);
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
}

function renderBooks(list){
  const ul = document.getElementById('books');
  ul.innerHTML = '';
  list.forEach(b => {
    const li = document.createElement('li');
    li.dataset.id = b._id;
    li.innerHTML = `<div><strong>${b.title}</strong> — ${b.author} (${b.publicationYear || b.publicationYear})<br><small>${b.genre || ''}</small></div><div><button data-action="delete">Delete</button></div>`;
    ul.appendChild(li);
  });
}

function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(()=>{ t.style.display='none'; }, 3000);
}

async function load(){
  try{
    const books = await fetchBooks();
    renderBooks(books);
  }catch(e){
    console.error(e);
    showToast(e.message);
  }
}

document.getElementById('bookForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = {
    title: fd.get('title'),
    author: fd.get('author'),
    publicationYear: Number(fd.get('publicationYear')),
    publishedYear: Number(fd.get('publicationYear')),
    genre: fd.get('genre')
  };

  // Optimistic UI: add immediately
  const tempId = 'temp-' + Date.now();
  const ul = document.getElementById('books');
  const li = document.createElement('li');
  li.dataset.id = tempId;
  li.classList.add('pending');
  li.innerHTML = `<div><strong>${body.title}</strong> — ${body.author} (${body.publicationYear})<br><small>${body.genre}</small></div><div><button data-action="delete">Delete</button></div>`;
  ul.prepend(li);
  e.target.reset();

  try{
    const res = await fetch(`${apiBase}/add`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Failed to add book');
    const created = await res.json();
    // replace temp item id and class
    li.dataset.id = created._id;
    li.classList.remove('pending');
  }catch(err){
    // revert UI
    li.remove();
    showToast('Failed to add book — reverted');
  }
});

document.getElementById('books').addEventListener('click', async (e) => {
  if (e.target.dataset.action === 'delete'){
    const li = e.target.closest('li');
    const id = li.dataset.id;
    // Optimistic remove
    const placeholder = li.cloneNode(true);
    const parent = li.parentElement;
    li.remove();

    try{
      const res = await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
    }catch(err){
      // revert: add placeholder back
      parent.prepend(placeholder);
      showToast('Delete failed — restored');
    }
  }
});

load();
