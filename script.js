// Função para salvar um novo usuário no localStorage
const saveUser = (user) => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
};

// Função para obter todos os usuários
const getUsers = () => JSON.parse(localStorage.getItem("users") || "[]");

// Função para encontrar usuário (para login)
const findUser = (email, password) => 
  getUsers().find(u => u.email === email && u.password === password);

// Função de registro com validação completa
function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const msgErro = document.getElementById('msgErro');
  msgErro.textContent = '';

  if (!name || !email || !password) {
    msgErro.textContent = 'Por favor, preencha todos os campos.';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    msgErro.textContent = 'Por favor, informe um e-mail válido.';
    return;
  }

  const users = getUsers();
  const existe = users.some(user => user.email === email);
  if (existe) {
    msgErro.textContent = 'Este e-mail já está cadastrado.';
    return;
  }

  saveUser({ name, email, password });
  alert("Cadastrado com sucesso!");
  location.href = "login.html";
}

// Função de login com verificação de administrador
function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  const msgErro = document.getElementById('msgErro');
  if (msgErro) msgErro.textContent = '';

  // Login exclusivo para admin
  if (email === "adm@email.com" && password === "12345") {
    localStorage.setItem("currentUser", email);
    location.href = "admin.html";
    return;
  }

  const user = findUser(email, password);
  if (user) {
    localStorage.setItem("currentUser", email);
    location.href = "perfil.html";
  } else {
    if (msgErro) {
      msgErro.textContent = "Login inválido. Verifique o e-mail e a senha.";
    } else {
      alert("Login inválido. Verifique o e-mail e a senha.");
    }
  }
}
