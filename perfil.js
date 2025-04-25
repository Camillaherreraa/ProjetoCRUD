const API_KEY = 'fc1fef96';
const movieSearchBox = document.getElementById('movie-search-box');
const resultGrid = document.getElementById('result-grid');

function loadProfile() {
  const email = localStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.email === email);
  if (!user) return location.href = "login.html";
  document.getElementById("profile-welcome").innerText = `Bem-vindo, ${user.name}`;
  updateFavorites(email);
}

function updateFavorites(email) {
  const favs = JSON.parse(localStorage.getItem("favs") || "{}");
  const list = favs[email] || [];
  const container = document.getElementById("favorites");
  container.innerHTML = "";

  list.forEach(title => {
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(title)}`)
      .then(res => res.json())
      .then(details => {
        const item = document.createElement("div");
        item.style.marginBottom = "20px";

        item.innerHTML = `
          <img src="${details.Poster !== 'N/A' ? details.Poster : ''}" style="height:100px;"><br>
          <strong>${details.Title}</strong> (${details.Year})<br>
          <button onclick="removeFavorite('${details.Title}')">Remover</button>
        `;

        container.appendChild(item);
      });
  });
}

function removeFavorite(title) {
  const userEmail = localStorage.getItem("currentUser");
  const favs = JSON.parse(localStorage.getItem("favs") || "{}");

  favs[userEmail] = favs[userEmail].filter(f => f !== title);
  localStorage.setItem("favs", JSON.stringify(favs));

  updateFavorites(userEmail);
}

function searchFromButton() {
  const query = movieSearchBox.value.trim();
  if (query.length === 0) return;

  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      if (data.Response === "True") {
        displayMovieList(data.Search);
      } else {
        resultGrid.innerHTML = "<p>Nenhum filme encontrado.</p>";
      }
    })
    .catch(error => {
      console.error("Erro ao buscar filmes:", error);
      resultGrid.innerHTML = "<p>Erro ao buscar filmes. Verifique a conexão.</p>";
    });
}

function displayMovieList(movies) {
  resultGrid.innerHTML = "";
  movies.forEach(movie => {
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`)
      .then(res => res.json())
      .then(details => showMovieDetails(details))
      .catch(error => console.error("Erro ao buscar detalhes:", error));
  });
}

function showMovieDetails(details) {
  const userEmail = localStorage.getItem("currentUser");
  const favs = JSON.parse(localStorage.getItem("favs") || "{}");
  const userFavs = favs[userEmail] || [];

  const movieCard = document.createElement('div');
  movieCard.innerHTML = `
    <img class="movie-poster" src="${details.Poster !== 'N/A' ? details.Poster : ''}" alt="Poster">
    <h3>${details.Title}</h3>
    <p><strong>Ano:</strong> ${details.Year}</p>
    <p><strong>Gênero:</strong> ${details.Genre}</p>
    <p><strong>Enredo:</strong> ${details.Plot}</p>
    <button onclick='addFavorite("${details.Title}")' ${userFavs.includes(details.Title) || userFavs.length >= 3 ? "disabled" : ""}>
      Favoritar
    </button>
    <hr>
  `;
  resultGrid.appendChild(movieCard);
}

function addFavorite(title) {
  const userEmail = localStorage.getItem("currentUser");
  const favs = JSON.parse(localStorage.getItem("favs") || "{}");
  favs[userEmail] = favs[userEmail] || [];

  if (favs[userEmail].length >= 3 || favs[userEmail].includes(title)) return;

  favs[userEmail].push(title);
  localStorage.setItem("favs", JSON.stringify(favs));
  updateFavorites(userEmail);
}

function logout() {
  localStorage.removeItem("currentUser");
  location.href = "login.html";
}
