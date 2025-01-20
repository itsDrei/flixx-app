//get current page - set global variable
const global = {
  currentPage: window.location.pathname,
};

//display popular movies
const displayPopularMovies = async () => {
  const { results } = await fetchApi("movie/popular");
  results.forEach((movies) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `  
          <a href="movie-details.html?id=${movies.id}">
        ${
          movies.poster_path
            ? `<img
            src="https://image.tmdb.org/t/p/w500${movies.poster_path}"
            class="card-img-top"
            alt="${movies.title}"
          />`
            : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${movies.title}"
          />`
        }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movies.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movies.release_date}</small>
            </p>
          </div>
        `;
    document.querySelector("#popular-movies").appendChild(div);
  });
};

//display popular tv shows
const displayPopularTvShow = async () => {
  const { results } = await fetchApi("tv/popular");
  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `  
          <a href="tv-details.html?id=${show.id}">
        ${
          show.poster_path
            ? `<img
            src="https://image.tmdb.org/t/p/w500${show.poster_path}"
            class="card-img-top"
            alt="${show.name}"
          />`
            : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${show.name}"
          />`
        }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${show.first_air_date}</small>
            </p>
          </div>
        `;
    document.querySelector("#popular-shows").appendChild(div);
  });
};

//display movie details

const displayMovieDetails = async () => {
  const movieId = window.location.search.split("=")[1];
  showSpinner();
  const movie = await fetchApi(`movie/${movieId}`);
  hideSpinner();
  //overlay backdrop
  displayBackgroundImage("movie", movie.backdrop_path);
  const div = document.createElement("div");
  div.classList.add("details-top");
  div.innerHTML = `
          <div class='details-toptop'>
          <div class = 'image-toptop'>
               ${
                 movie.poster_path
                   ? `<img style="margin: 0;"
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
          />`
                   : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
          />`
               }
          </div>
          <div>
            <h2 class='movie-title'>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
             ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
             ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
            </ul>
            <a href="${
              movie.homepage
            }" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> ${numberWithCommas(
              movie.budget
            )}</li>
            <li><span class="text-secondary">Revenue:</span> ${numberWithCommas(
              movie.revenue
            )}</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movie.runtime
            }  minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies
            .map((company) => `<span>${company.name}</span>`)
            .join("")}</div>
    `;

  document.querySelector("#movie-details").appendChild(div);
};

// Display Show Details
async function displayShowDetails() {
  const showId = window.location.search.split("=")[1];
  const show = await fetchApi(`tv/${showId}`);

  // Overlay for background image
  displayBackgroundImage("tv", show.backdrop_path);

  const div = document.createElement("div");

  div.innerHTML = `
   <div class='details-toptop'>
          <div class = 'image-toptop'>
  ${
    show.poster_path
      ? `<img
    src="https://image.tmdb.org/t/p/w500${show.poster_path}"
    class="card-img-top"
    alt="${show.name}"
  />`
      : `<img
  src="../images/no-image.jpg"
  class="card-img-top"
  alt="${show.name}"
/>`
  }
  </div>
  <div class="tv-det">
    <h2 class='movie-title'>${show.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
    <p>
      ${show.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
    </ul>
    <div>
    <a href="${
      show.homepage
    }" target="_blank" class="btn">Visit show Homepage</a>
    </div>
  </div>
</div>
<div class="details-bottom">
  <h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">Number of Episodes:</span> ${
      show.number_of_episodes
    }</li>
    <li><span class="text-secondary">Last Episode To Air:</span> ${
      show.last_episode_to_air.name
    }</li>
    <li><span class="text-secondary">Status:</span> ${show.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
    ${show.production_companies
      .map((company) => `<span>${company.name}</span>`)
      .join(", ")}
  </div>
</div>
  `;

  document.querySelector("#show-details").appendChild(div);
}

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}
function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

const displayBackgroundImage = (type, backgroundPath) => {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.1";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
};

//fetch api data movies
const fetchApi = async (endpoint) => {
  const API_KEY = "7fa1ee5d4a7e9878b703ebe67b8afcc6";
  const API_URL = "https://api.themoviedb.org/3/";

  const responce = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  showSpinner();
  const data = await responce.json();
  hideSpinner();
  return data;
};

function highlightActiveLink() {
  const link = document.querySelectorAll(".nav-link");
  link.forEach((links) => {
    if (links.getAttribute("href") === global.currentPage) {
      links.classList.add("active");
    }
  });
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displayPopularMovies();

      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/search.html":
      console.log("Search");
      break;
    case "/shows.html":
      displayPopularTvShow();
      break;
    case "/tv-details.html":
      displayShowDetails();
      break;

    default:
      break;
  }
  highlightActiveLink();
}

init();
