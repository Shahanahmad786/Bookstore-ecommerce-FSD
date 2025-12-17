const apiBase = '/api/books';

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

async function fetchBooks(){
  const res = await fetch(`${apiBase}/allBooks`);
  if (!res.ok) throw new Error('Failed to load books');
  return res.json();
}

function setMessage(msg, isError){
  const m = $('#message');
  m.textContent = msg || '';
  m.style.color = isError ? '#b00020' : '#064e3b';
  if (msg) setTimeout(()=>{ m.textContent = ''; }, 4000);
}

function renderBooks(list){
  const ul = $('#books');
  ul.innerHTML = '';
  if (!list || list.length === 0) {
    ul.innerHTML = '<li class="small">No books yet.</li>';
    return;
  }
  list.forEach(b => {
    const li = document.createElement('li');
    li.dataset.id = b._id;
    const meta = document.createElement('div');
    meta.className = 'book-meta';
    meta.innerHTML = `<strong>${escapeHtml(b.title)}</strong> <div class="small">${escapeHtml(b.author)} • ${b.publicationYear || b.publishedYear || ''} • ${escapeHtml(b.genre || '')}</div>`;

    const actions = document.createElement('div');
    actions.className = 'book-actions';

    const viewBtn = document.createElement('button');
    viewBtn.textContent = 'View';
    viewBtn.addEventListener('click', ()=> viewBook(b));

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', ()=> startEdit(b));

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', ()=> deleteBook(b._id));

    actions.appendChild(viewBtn);
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(meta);
    li.appendChild(actions);
    ul.appendChild(li);
  });
}

function escapeHtml(s){
  if (!s) return '';
  return s.replace(/[&<>"']/g, (c)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

async function load(){
  try{
    const books = await fetchBooks();
    renderBooks(books);
  }catch(err){
    console.error(err);
    setMessage(err.message, true);
  }
}

async function addBook(data){
  // send both keys to match backend expectations
  const body = Object.assign({}, data, { publishedYear: data.publicationYear });
  const res = await fetch(`${apiBase}/add`,{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Failed to add book');
  }
  return res.json();
}

async function updateBook(id, data){
  const body = Object.assign({}, data, { publishedYear: data.publicationYear });
  const res = await fetch(`${apiBase}/edit/${id}`,{
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Failed to update');
  }
  return res.json();
}

async function deleteBook(id){
  if (!confirm('Delete this book?')) return;
  try{
    const res = await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
    setMessage('Book deleted');
    await load();
  }catch(err){
    setMessage(err.message || 'Delete failed', true);
  }
}

function viewBook(book){
  const details = `Title: ${book.title}\nAuthor: ${book.author}\nYear: ${book.publicationYear || book.publishedYear || ''}\nGenre: ${book.genre || ''}`;
  alert(details);
}

function startEdit(book){
  $('#form-title').textContent = 'Edit Book';
  $('#bookId').value = book._id;
  $('#title').value = book.title || '';
  $('#author').value = book.author || '';
  $('#publicationYear').value = book.publicationYear || book.publishedYear || '';
  $('#genre').value = book.genre || '';
  $('#submitBtn').textContent = 'Save';
  $('#cancelEdit').style.display = 'inline-block';
}

function resetForm(){
  $('#form-title').textContent = 'Add Book';
  $('#bookId').value = '';
  $('#title').value = '';
  $('#author').value = '';
  $('#publicationYear').value = '';
  $('#genre').value = '';
  $('#submitBtn').textContent = 'Add Book';
  $('#cancelEdit').style.display = 'none';
}

document.getElementById('bookForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const id = $('#bookId').value;
  const data = {
    title: $('#title').value.trim(),
    author: $('#author').value.trim(),
    publicationYear: Number($('#publicationYear').value) || undefined,
    genre: $('#genre').value.trim() || undefined
  };

  if (!data.title || !data.author || !data.publicationYear){
    setMessage('Please fill title, author and publication year', true);
    return;
  }

  try{
    if (id){
      await updateBook(id, data);
      setMessage('Book updated');
    } else {
      await addBook(data);
      setMessage('Book added');
    }
    resetForm();
    await load();
  }catch(err){
    console.error(err);
    setMessage(err.message || 'Save failed', true);
  }
});

$('#cancelEdit').addEventListener('click', ()=> resetForm());

// initial load
load();
