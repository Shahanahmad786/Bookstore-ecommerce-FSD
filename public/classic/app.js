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

async function load(){
  try{
    const books = await fetchBooks();
    renderBooks(books);
  }catch(e){
    console.error(e);
    document.getElementById('books').innerHTML = `<li class="error">${e.message}</li>`;
  }
}

document.getElementById('bookForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = {
    title: fd.get('title'),
    author: fd.get('author'),
    publicationYear: Number(fd.get('publicationYear')),
    publishedYear: Number(fd.get('publicationYear')), // controller expects this key
    genre: fd.get('genre')
  };

  try{
    const res = await fetch(`${apiBase}/add`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Failed to add book');
    const created = await res.json();
    await load();
    e.target.reset();
  }catch(err){
    alert(err.message);
  }
});

document.getElementById('books').addEventListener('click', async (e) => {
  if (e.target.dataset.action === 'delete'){
    const li = e.target.closest('li');
    const id = li.dataset.id;
    if (!confirm('Delete this book?')) return;
    try{
      const res = await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await load();
    }catch(err){
      alert(err.message);
    }
  }
});

load();
