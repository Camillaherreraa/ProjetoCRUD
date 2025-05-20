const API_KEY = 'fc1fef96';
const movieSearchBox = document.getElementById('movie-search-box');
const resultGrid = document.getElementById('result-grid');

function loadProfile() {
  const email = localStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.email === email);
  if (!user) return location.href = "login.html";

  document.getElementById("user-name").innerText = user.name;
  document.getElementById("user-email").innerText = user.email;

  updateFavorites(email);
}

function editName() {
  const email = localStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1) return;

  const newName = prompt("Digite seu novo nome:", users[userIndex].name);
  if (newName && newName.trim() !== "") {
    users[userIndex].name = newName.trim();
    localStorage.setItem("users", JSON.stringify(users));
    document.getElementById("user-name").innerText = newName.trim();
    alert("Nome atualizado com sucesso!");
  }
}



function updateFavorites(email) {
  const favs = JSON.parse(localStorage.getItem("favs") || "{}");
  const ratings = JSON.parse(localStorage.getItem("ratings") || "{}");
  const list = favs[email] || [];
  const container = document.getElementById("favorites");
  container.innerHTML = "";

  const selectedGenre = document.getElementById("genre-filter")?.value || "";
  const genreSet = new Set(); // coletar todos os gêneros únicos

  list.forEach(title => {
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(title)}`)
      .then(res => res.json())
      .then(details => {
        if (!details.Genre) return;

        const genres = details.Genre.split(",").map(g => g.trim());
        genres.forEach(g => genreSet.add(g));

        if (selectedGenre && !genres.includes(selectedGenre)) return;

        // cálculo da média de avaliações de todos os usuários
        let allRatings = [];
        for (const user in ratings) {
          if (ratings[user][title]?.stars) {
            allRatings.push(ratings[user][title].stars);
          }
        }
        const averageRating = allRatings.length
          ? (allRatings.reduce((a, b) => a + b) / allRatings.length).toFixed(1)
          : "N/A";

        const userRatings = ratings[email]?.[title] || { stars: 0, comment: "" };

        const item = document.createElement("div");
        item.style.marginBottom = "20px";
        item.style.border = "1px solid #ccc";
        item.style.padding = "10px";
        item.style.borderRadius = "8px";

        item.innerHTML = `
          <img src="${details.Poster !== 'N/A' ? details.Poster : ''}" style="height:100px;"><br>
          <strong>${details.Title}</strong> (${details.Year})<br>
          <p>⭐ ${averageRating} (usuários) | 🎬 IMDb: ${details.imdbRating}</p>
          <button onclick="removeFavorite('${details.Title}')">Remover</button><br><br>

          <label>Avaliação:</label><br>
          ${[1,2,3,4,5].map(i =>
            `<input type="radio" name="stars-${title}" value="${i}" ${userRatings.stars === i ? 'checked' : ''} onclick="rateMovie('${title}', ${i})"> ${i}`
          ).join(' ')}
          <br><br>

          <label>Comentário:</label><br>
          <textarea rows="3" cols="40" onchange="commentMovie('${title}', this.value)">${userRatings.comment || ''}</textarea>
        `;

        container.appendChild(item);
      })
      .finally(() => {
        const genreSelect = document.getElementById("genre-filter");
        if (genreSelect && genreSelect.options.length <= 1) {
          [...genreSet].sort().forEach(g => {
            const option = document.createElement("option");
            option.value = g;
            option.textContent = g;
            genreSelect.appendChild(option);
          });
        }
      });
  });
}


function rateMovie(title, stars) {
  const email = localStorage.getItem("currentUser");
  const ratings = JSON.parse(localStorage.getItem("ratings") || "{}");

  if (!ratings[email]) ratings[email] = {};
  if (!ratings[email][title]) ratings[email][title] = {};

  ratings[email][title].stars = stars;
  localStorage.setItem("ratings", JSON.stringify(ratings));
}

function commentMovie(title, comment) {
  const email = localStorage.getItem("currentUser");
  const ratings = JSON.parse(localStorage.getItem("ratings") || "{}");

  if (!ratings[email]) ratings[email] = {};
  if (!ratings[email][title]) ratings[email][title] = {};

  ratings[email][title].comment = comment;
  localStorage.setItem("ratings", JSON.stringify(ratings));
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

function toggleFavorites() {
  const section = document.getElementById("favorites-section");
  const btn = document.querySelector("button[onclick='toggleFavorites()']");

  if (section.style.display === "none") {
    section.style.display = "block";
    btn.innerText = "Ocultar Favoritos";
  } else {
    section.style.display = "none";
    btn.innerText = "Mostrar Favoritos";
  }
}
