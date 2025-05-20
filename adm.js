const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('#admin-users');
const sNome = document.querySelector('#m-nome');
const sEmail = document.querySelector('#m-email');
const sSenha = document.querySelector('#m-senha');
const btnSalvar = document.querySelector('#btnSalvar');
const searchInput = document.querySelector('#search-user'); // Campo de busca

let usuarios = [];
let id = undefined;

function openModal(edit = false, index = 0) {
  modal.style.display = 'flex';

  modal.onclick = e => {
    if (e.target.classList.contains('modal-container')) {
      modal.style.display = 'none';
    }
  };

  if (edit) {
    sNome.value = usuarios[index].name;
    sEmail.value = usuarios[index].email;
    sSenha.value = usuarios[index].password;
    id = index;
  } else {
    sNome.value = '';
    sEmail.value = '';
    sSenha.value = '';
    id = undefined;
  }
}

function loadUsuarios(filteredList = null) {
  usuarios = JSON.parse(localStorage.getItem("users") || "[]");
  tbody.innerHTML = "";

  const listToRender = filteredList || usuarios;

  listToRender.forEach((user, index) => insertItem(user, index));
}

function insertItem(user, index) {
  let tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${user.name}</td>
    <td>${user.email}</td>
    <td>${user.password}</td>
    <td>
      <button onclick="openModal(true, ${index})">Editar</button>
      <button onclick="deleteUser(${index})">Excluir</button>
    </td>
  `;
  tbody.appendChild(tr);
}

function saveNewUser(event) {
  event.preventDefault();
  if (sNome.value === '' || sEmail.value === '' || sSenha.value === '') return;

  if (id !== undefined) {
    usuarios[id].name = sNome.value;
    usuarios[id].email = sEmail.value;
    usuarios[id].password = sSenha.value;
  } else {
    usuarios.push({
      name: sNome.value,
      email: sEmail.value,
      password: sSenha.value
    });
  }

  localStorage.setItem("users", JSON.stringify(usuarios));
  modal.style.display = "none";
  loadUsuarios();
  id = undefined;
}

function deleteUser(index) {
  usuarios.splice(index, 1);
  localStorage.setItem("users", JSON.stringify(usuarios));
  loadUsuarios();
}

function logout() {
  location.href = "login.html";
}

function renderAdmin() {
  loadUsuarios();
}

function filterUsuarios() {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = usuarios.filter(user => user.name.toLowerCase().includes(term));
  loadUsuarios(filtered);
}

searchInput.addEventListener('input', filterUsuarios);
