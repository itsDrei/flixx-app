//get current page - set global variable
const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    api_key: "7fa1ee5d4a7e9878b703ebe67b8afcc6",
    api_url: "https://api.themoviedb.org/3/",
  },
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

const displaySlider = async () => {
  const { results } = await fetchApi("movie/now_playing");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
      ${
        movie.poster_path
          ? `<img
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
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
                1
              )} / 10
            </h4>
      `;
    document.querySelector(".swiper-wrapper").appendChild(div);

    initSwiper();
  });
};

async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");

  if (global.search.term !== "" && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchApiData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert("No Results Found");
      return;
    }

    displaySearchResults(results);

    document.querySelector("#search-term").value = "";
  } else {
    showAlert("Please Enter Something to Search");
  }
}

function displaySearchResults(results) {
  //clear prev rsults
document.querySelector('#search-results').innerHTML = '';
document.querySelector('#search-results-heading').innerHTML = '';
document.querySelector('#pagination').innerHTML = '';


  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
       <a href="${global.search.type}-details.html?id=${result.id}">
        ${
          result.poster_path
            ? `<img
            src="https://image.tmdb.org/t/p/w500${result.poster_path}"
            class="card-img-top" 
            alt="${global.search.type === "movie" ? result.title : result.name}"
          />`
            : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${global.search.type === "movie" ? result.title : result.name}"
          />`
        }
        </a>
        <div class="card-body">
          <h5 class="card-title">${
            global.search.type === "movie" ? result.title : result.name
          }</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${
              global.search.type === "movie"
                ? result.release_date
                : result.first_air_date
            }</small>
          </p>
        </div>
      `;
    document.querySelector("#search-results-heading").innerHTML = `
      <div style="margin: 3em 0;">
      <h5><span style="color: #f1c40f;">${results.length}</span> of ${
      global.search.totalResults
    } Results for "<strong style="color: #f1c40f;;">${global.search.term.toUpperCase()}</strong>"</h5>
      </div>
      `;

    document.querySelector("#search-results").appendChild(div);
    
  });

  displayPagination();
}

function displayPagination() {
  const pagination = document.createElement("div");
  pagination.classList.add("pagination");
  pagination.innerHTML = `
          <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `;
  document.querySelector('#pagination').appendChild(pagination);

  //disabled buttons
if(global.search.page === 1) {
  document.querySelector('#prev').disabled = true;
}
if(global.search.page === global.search.totalPages) {
  document.querySelector('#next').disabled = true;
}


//next page


document.querySelector('#next').addEventListener('click', async () => {
  global.search.page++;

  const { results, total_pages } = await searchApiData()

  displaySearchResults(results)
})

document.querySelector('#prev').addEventListener('click', async () => {
  global.search.page--;

  const { results, total_pages } = await searchApiData()

  displaySearchResults(results)
})
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoPlay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

//fetch api data movies
const fetchApi = async (endpoint) => {
  const API_KEY = global.api.api_key;
  const API_URL = global.api.api_url;

  const responce = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  showSpinner();
  const data = await responce.json();
  hideSpinner();
  return data;
};

//fetch search api data movies
const searchApiData = async (endpoint) => {
  const API_KEY = global.api.api_key;
  const API_URL = global.api.api_url;

  const responce = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );
  showSpinner();
  const data = await responce.json();
  hideSpinner();
  return data;
};

// Highlight active link
function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

function showAlert(message, className = "error") {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEl);

  setTimeout(() => {
    alertEl.remove();
  }, 3000);
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displaySlider();
      displayPopularMovies();

      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/search.html":
      search();
      break;
    case "/shows.html":
    case "/shows":
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
