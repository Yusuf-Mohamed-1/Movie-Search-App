let keyApi = "b128a397f83af2560a8289a3f6d2fbf8";
let input = document.querySelector(".input");
let submitBtn = document.querySelector(".submit");
let moviesSection = document.querySelector(".movies .box");
let moviesInfo = document.querySelector(".box .info");
let moviesRate = document.querySelector(".box .rate");
let movieRelease = document.querySelector(".box .movie-info");
let moreDetails = document.querySelector(".more-details");
let detailsBox = document.querySelector(".details-box");
let overLay = document.querySelector(".overlay");
let genres = document.querySelector(".genres");
let overview = document.querySelector(".overview");
let errorHandling = document.querySelector(".error-handling");
let errorButton = document.querySelector(".error-handling button");
let noResult = document.querySelector(".no-rsult");
let noResultButton = document.querySelector(".no-rsult button");

document.onkeyup = function (e) {
  if (e.key === "Enter") {
    submitBtn.click();
  }
};

submitBtn.onclick = function () {
  if (input.value !== "") {
    resetAll();

    moviesSection.style.display = "flex";
    moviesSection.classList.add("loading");

    getData();
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.disabled = false;
    }, 3000);
  }
};

function resetAll() {
  moviesRate.innerHTML = "";
  genres.innerHTML = "";
  movieRelease.innerHTML = "";
  overview.innerHTML = "";
  moreDetails.innerHTML = "";
  document.querySelector(".image").src = "";
  document.querySelector(".mainTitle").innerHTML = "";
}

async function getData() {
  // Movie API
  const searchMovie = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${input.value}&api_key=${keyApi}`,
  );
  try {
    const allData = await searchMovie.json();

    if (allData.results.length === 0) {
      showNoResults();
      return;
    }

    const movieData = allData.results[0];

    // ID API
    const movieId = movieData.id;
    const movieDataId = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${keyApi}`,
    );
    const getDataMovieById = await movieDataId.json();

    // Credit API
    const creditApi = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${keyApi}`,
    );
    const movieCredits = await creditApi.json();
    const movieCast = movieCredits.cast;
    const movieCrew = movieCredits.crew;

    // Videos Api
    const videosApi = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${keyApi}`,
    );
    const trailerMovie = await videosApi.json();
    let findTrailer = trailerMovie.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube",
    );

    // Add Movie To Page
    addMovieToPage(
      movieData,
      getDataMovieById,
      movieCast,
      movieCrew,
      findTrailer,
    );
  } catch (error) {
    showError();
  }
}

function showNoResults() {
  noResult.style.display = "block";
  moviesSection.style.display = "none";
  document.querySelector(".content").style.display = "none";
}

noResultButton.addEventListener("click", function () {
  noResult.style.display = "none";
  input.value = "";
  document.querySelector(".content").style.display = "block";
});

function showError() {
  errorHandling.style.display = "block";
  moviesSection.style.display = "none";
  document.querySelector(".content").style.display = "none";
}

errorButton.addEventListener("click", function () {
  errorHandling.style.display = "none";
  input.value = "";
  document.querySelector(".content").style.display = "block";
});

// Add Movie To Page
function addMovieToPage(movieData, movieId, movieCast, movieCrew, findTrailer) {
  moviesSection.classList.remove("loading");
  moviesSection.style.display = "flex";

  // Add Poster
  let posterPath = `https://image.tmdb.org/t/p/w500/${movieData.poster_path}`;
  let img = document.querySelector(".image");
  img.setAttribute("src", posterPath);
  moviesSection.prepend(img);

  //   Add Title
  let movieTitle = document.querySelector(".mainTitle");
  movieTitle.appendChild(document.createTextNode(movieData.title));
  moviesInfo.prepend(movieTitle);

  //   Add Rate
  let rateStar = document.createElement("i");
  rateStar.className = "fa-solid fa-star";

  let ratePar = document.createElement("p");
  let rateSpan = document.createElement("span");
  rateSpan.appendChild(
    document.createTextNode(movieData.vote_average.toFixed(1)),
  );
  ratePar.appendChild(rateSpan);
  ratePar.appendChild(document.createTextNode(" / 10"));

  let rateSource = document.createElement("div");
  rateSource.className = "source";
  let sourcePar = document.createElement("p");
  sourcePar.appendChild(document.createTextNode("TMDb"));
  rateSource.appendChild(sourcePar);

  moviesRate.appendChild(rateStar);
  moviesRate.appendChild(ratePar);
  moviesRate.appendChild(rateSource);

  // Add Genres

  for (let i = 0; i < movieId.genres.length; i++) {
    let spanGenres = document.createElement("span");
    let spanGenresText = document.createTextNode(movieId.genres[i].name);
    spanGenres.appendChild(spanGenresText);
    genres.appendChild(spanGenres);
  }

  //   Add Releases
  movieRelease.classList.add("break");

  let releaseDiv = document.createElement("div");
  releaseDiv.className = "released";
  let releaseIcon = document.createElement("i");
  releaseIcon.className = "fa-regular fa-calendar";
  let spanReleased = document.createElement("span");
  let spanRelText = document.createTextNode(movieData.release_date);
  spanReleased.appendChild(spanRelText);

  releaseDiv.appendChild(releaseIcon);
  releaseDiv.appendChild(
    document.createTextNode(`Released: ${spanReleased.innerHTML}`),
  );

  //   Add RunTime

  let timeDiv = document.createElement("div");
  timeDiv.className = "time";
  let timeIcon = document.createElement("i");
  timeIcon.className = "fa-regular fa-clock";
  let spanTime = document.createElement("span");
  let spanTimeText = document.createTextNode(`${movieId.runtime} mins`);
  spanTime.appendChild(spanTimeText);

  timeDiv.appendChild(timeIcon);
  timeDiv.appendChild(
    document.createTextNode(`RunTime: ${spanTime.innerHTML}`),
  );

  movieRelease.appendChild(releaseDiv);
  movieRelease.appendChild(timeDiv);

  // Add Overview Text
  let overviewPar = document.createElement("p");
  let overviewText = document.createTextNode(movieId.overview);
  overviewPar.appendChild(overviewText);

  overview.appendChild(overviewPar);

  // Add More Details
  addMoreDetails(movieId, movieCast, movieCrew, findTrailer);
}

function addMoreDetails(movieId, movieCast, movieCrew, findTrailer) {
  let icon = document.createElement("i");
  icon.className = "fa-solid fa-circle-info";

  let text = document.createElement("p");
  text.className = "text";
  text.appendChild(document.createTextNode("More Details"));

  moreDetails.appendChild(icon);
  moreDetails.appendChild(text);

  moreDetails.addEventListener("click", function () {
    overLay.style.display = "block";
    detailsBox.innerHTML = "";
    detailsBox.classList.add("open");

    // Add Details Head
    let detailsHead = document.createElement("div");
    detailsHead.className = "details-head";
    let header = document.createElement("h3");
    header.appendChild(document.createTextNode("More Details"));
    let closeSpan = document.createElement("span");
    closeSpan.appendChild(document.createTextNode("X"));
    detailsHead.appendChild(header);
    detailsHead.appendChild(closeSpan);

    closeSpan.addEventListener("click", function () {
      detailsBox.classList.remove("open");
      overLay.style.display = "none";
    });

    overLay.addEventListener("click", function () {
      this.style.display = "none";
      detailsBox.classList.remove("open");
    });

    // Add Details Content
    let detailsContent = document.createElement("div");
    detailsContent.className = "details-content";

    detailsContent.innerHTML = `
    <div class="details">
      <i class="fa-solid fa-sack-dollar" style="color: #f1b540"></i>
      <div class="text">
      <span>Budget</span>
      <p>$${movieId.budget > 0 ? movieId.budget.toLocaleString() : "Unknown"}</p>
      </div>
    </div>
    <div class="details">
      <i class="fa-solid fa-chart-line" style="color: #4bc434"></i>
      <div class="text">
      <span>Revenue</span>
      <p>$${movieId.revenue > 0 ? movieId.revenue.toLocaleString() : "Unknown"}</p>
      </div>
    </div>
    <div class="details">
      <i class="fa-solid fa-star" style="color: #f0ae3c"></i>
      <div class="text">
      <span>Votes</span>
      <p>${movieId.vote_count.toLocaleString()}</p>
      </div>
    </div>
    <div class="details">
      <i class="fa-solid fa-globe" style="color: #14a0fa"></i>
      <div class="text">
      <span>Country</span>
      <p>${movieId.origin_country}</p>
      </div>
    </div>`;

    // Add Direcots Content
    let direcotsDetails = document.createElement("div");
    direcotsDetails.className = "direcots-details";

    let mainDiv = document.createElement("div");
    mainDiv.className = "head";

    let iconDir = document.createElement("i");
    iconDir.className = "fa-solid fa-user";

    let directorHead = document.createElement("h4");
    directorHead.appendChild(document.createTextNode("Directors"));
    mainDiv.appendChild(iconDir);
    mainDiv.appendChild(directorHead);

    direcotsDetails.appendChild(mainDiv);

    // Add Crews To Page
    let crewContent = document.createElement("div");
    crewContent.className = "content";

    const alldirectors = movieCrew.filter(
      (director) => director.known_for_department === "Directing",
    );
    const uniqueDirectors = alldirectors.filter(
      (director, index, arr) =>
        arr.findIndex((p) => p.id === director.id) === index,
    );
    const top3Directors = uniqueDirectors.slice(0, 3);

    top3Directors.forEach((director) => {
      let directorDiv = document.createElement("div");
      directorDiv.className = "director";

      let directorImage = document.createElement("img");
      directorImage.setAttribute(
        "src",
        director.profile_path
          ? `https://image.tmdb.org/t/p/w500${director.profile_path}`
          : `https://placehold.co/185x278?text=No+Image`,
      );
      let directorName = document.createElement("p");
      directorName.appendChild(document.createTextNode(director.name));

      directorDiv.appendChild(directorImage);
      directorDiv.appendChild(directorName);

      crewContent.appendChild(directorDiv);
      direcotsDetails.appendChild(crewContent);
    });

    // Add Cast Content
    let castDetails = document.createElement("div");
    castDetails.className = "cast-details";

    let castDiv = document.createElement("div");
    castDiv.className = "head";

    let iconCast = document.createElement("i");
    iconCast.className = "fa-solid fa-user-group";

    let castHead = document.createElement("h4");
    castHead.appendChild(document.createTextNode("Cast"));
    castDiv.appendChild(iconCast);
    castDiv.appendChild(castHead);
    castDetails.appendChild(castDiv);

    // Add Crews To Page
    let castContent = document.createElement("div");
    castContent.className = "cast-content";

    for (let i = 0; i < 6; i++) {
      let mainCast = document.createElement("div");
      mainCast.className = "cast";

      let castImg = document.createElement("img");
      castImg.setAttribute(
        "src",
        movieCast[i].profile_path
          ? `https://image.tmdb.org/t/p/w500${movieCast[i].profile_path}`
          : `https://placehold.co/185x278?text=No+Image`,
      );

      let castName = document.createElement("p");
      castName.appendChild(document.createTextNode(movieCast[i].name));

      mainCast.appendChild(castImg);
      mainCast.appendChild(castName);

      castContent.appendChild(mainCast);
      castDetails.appendChild(castContent);
    }

    // Add Language

    let language = new Intl.DisplayNames(["en"], { type: "language" });
    let movieLanguage = language.of(movieId.original_language);

    let languageDatails = document.createElement("div");
    languageDatails.className = "language-datails";

    let languBox = document.createElement("div");
    languBox.className = "langu-box";
    let iconLan = document.createElement("i");
    iconLan.className = "fa-solid fa-globe";
    iconLan.style.color = "#14a0fa";
    let paraLan = document.createElement("p");
    paraLan.innerHTML = `Language: <span>${movieLanguage}</span>`;

    languBox.appendChild(iconLan);
    languBox.appendChild(paraLan);

    languageDatails.appendChild(languBox);

    // Add Trailer

    let trailerDetails = document.createElement("div");
    trailerDetails.className = "trailer-details";

    let trailerDiv = document.createElement("div");
    trailerDiv.className = "trailer";
    let iconTrailer = document.createElement("i");
    iconTrailer.className = "fa-brands fa-youtube";
    let paraTrailer = document.createElement("p");
    paraTrailer.appendChild(
      document.createTextNode("Watch Trailer on Youtube"),
    );

    let spanIcon = document.createElement("span");
    spanIcon.innerHTML = "<i class='fa-solid fa-up-right-from-square'></i>";

    trailerDiv.appendChild(iconTrailer);
    trailerDiv.appendChild(paraTrailer);

    trailerDetails.appendChild(trailerDiv);
    trailerDetails.appendChild(spanIcon);

    trailerDetails.addEventListener("click", function () {
      window.open(`https://www.youtube.com/watch?v=${findTrailer.key}`);
    });

    detailsBox.appendChild(detailsHead);
    detailsBox.appendChild(detailsContent);
    detailsBox.appendChild(direcotsDetails);
    detailsBox.appendChild(castDetails);
    detailsBox.appendChild(languageDatails);
    detailsBox.appendChild(trailerDetails);
  });
}
