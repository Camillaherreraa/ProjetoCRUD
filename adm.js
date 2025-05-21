const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('#admin-users');
const sNome = document.querySelector('#m-nome');
const sEmail = document.querySelector('#m-email');
const sSenha = document.querySelector('#m-senha');
const searchInput = document.querySelector('#search-user');

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
  if (!filteredList) {
    usuarios = JSON.parse(localStorage.getItem("users") || "[]");
  }
  const listToRender = filteredList || usuarios;
  tbody.innerHTML = "";
  listToRender.forEach((user, index) => insertItem(user, index));
}

function insertItem(user, index) {
  let tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${user.name}</td>
    <td>${user.email}</td>
    <td>
      <span class="senha-oculta" id="senha-${index}">••••••••</span>
      <button onclick="toggleSenha(${index}, '${user.password}')" id="btn-senha-${index}" title="Mostrar senha">
        <i class='bx bx-show'></i>
      </button>
    </td>
    <td class="acao">
      <button onclick="openModal(true, ${index})" title="Editar"><i class='bx bx-edit'></i></button>
      <button onclick="deleteUser(${index})" title="Excluir"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}

function toggleSenha(index, senhaReal) {
  const span = document.getElementById(`senha-${index}`);
  const btn = document.getElementById(`btn-senha-${index}`);

  const icon = btn.querySelector('i');

  if (span.textContent === '••••••••') {
    span.textContent = senhaReal;
    icon.className = 'bx bx-hide';
    btn.title = "Ocultar senha";
  } else {
    span.textContent = '••••••••';
    icon.className = 'bx bx-show';
    btn.title = "Mostrar senha";
  }
}


function saveNewUser(event) {
  event.preventDefault();

  if (sNome.value.trim() === '' || sEmail.value.trim() === '' || sSenha.value.trim() === '') return;

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
  renderAdmin(); // recarrega com lista completa
  id = undefined;
}

function deleteUser(index) {
  const confirmar = confirm("Tem certeza que deseja excluir este usuário?");
  if (confirmar) {
    usuarios.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(usuarios));
    renderAdmin();
  }
}

function logout() {
  location.href = "login.html";
}

function renderAdmin() {
  usuarios = JSON.parse(localStorage.getItem("users") || "[]");
  loadUsuarios();
}

function filterUsuarios() {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = usuarios.filter(user => user.name.toLowerCase().includes(term));
  loadUsuarios(filtered);
}
const searchIcon = document.querySelector('#search-icon');

searchIcon.addEventListener('click', () => {
  searchInput.focus();
  filterUsuarios();
});
searchInput.addEventListener('input', filterUsuarios);