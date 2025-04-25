const saveUser = (user) => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
};

// colocar os usuarios no localStorage (funcionando com um banco de dados)
const getUsers = () => JSON.parse(localStorage.getItem("users") || "[]");

//validar né, pra ver se ta cadastrado no sistema
const findUser = (email, password) => getUsers().find(u => u.email === email && u.password === password);

function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  
  const user = findUser(email, password);
  if (user) {
    localStorage.setItem("currentUser", email);
    location.href = "perfil.html";
  } else {
    alert("Login inválido");
  }
}

function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  if (!name || !email || !password) return;
  
  saveUser({ name, email, password });
  alert("Cadastrado com sucesso!");
  location.href = "login.html";
}

// Logiin exclusivo que abre a parte apenas para adms e mostra os dados 
function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

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
    alert("Login inválido");
  }
}