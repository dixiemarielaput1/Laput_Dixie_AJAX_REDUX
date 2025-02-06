(() => {
  const baseURL = "https://swapi.dev/api/";
  const showInfoCon = document.querySelector("#showinfo-con");
  const itemCon = document.querySelector("#item-con");
  const spinningIndicator = document.querySelector("#spinning-indicator");

  const characterImages = {
    "Luke Skywalker": "images/lukeskywalker.jpeg",
    "C-3PO": "images/C-3PO.jpg",
    "R2-D2": "images/R2-D2.jpg",
    "Darth Vader": "images/darth.webp",
    "Leia Organa": "images/leaia.jpg",
    "Owen Lars": "images/owen.jpg",
    "Beru Whitesun lars": "images/beru.jpg",
    "R5-D4": "images/R5-D4.jpg",
    "Biggs Darklighter": "images/biggs.jpeg",
    "Obi-Wan Kenobi": "images/obi.jpeg",
  };

  const filmPosters = {
    "A New Hope": "images/newhope.jpg",
    "The Empire Strikes Back": "images/empirestrikes.jpg",
    "Return of the Jedi": "images/returnofjedi.jpg",
    "The Phantom Menace": "images/phantommenace.jpg",
    "Attack of the Clones": "images/attackofclone.jpg",
    "Revenge of the Sith": "images/revengeof.jpg",
  };

  const categoryEffect = gsap.timeline({ paused: true });
  categoryEffect.from(".category-box", { x: 300, opacity: 0, ease: "power3.out", duration: 1, stagger: 0.5 });
  categoryEffect.play();
  
  ScrollTrigger.create({ trigger: ".category-box", start: "top top", onEnter: () => categoryEffect.restart(), onLeaveBack: () => categoryEffect.restart() });

  function toggleSpinner(show) {
    spinningIndicator.style.display = show ? 'block' : 'none';
  }

  function handleSuccess(response) {
    return response.json();
  }

  function handleError(err) {
    console.error("Data Fetch Error: ", err);
    itemCon.innerHTML = "<p>Could not fetch data.</p>";
  }

  function fetchPeople() {
    toggleSpinner(true);
    fetch(`${baseURL}people/?format=json`)
      .then(handleSuccess)
      .then(response => {
        itemCon.innerHTML = "";
        if (response.results.length > 0) {
          response.results.forEach(person => {
            const template = document.querySelector("#character-card-template");
            const card = template.content.cloneNode(true);
            const img = card.querySelector("img");
            const name = card.querySelector(".character-name");
            const characterImageUrl = characterImages[person.name];
            if (characterImageUrl) {
              img.src = characterImageUrl;
              img.alt = person.name;
            }
            name.textContent = person.name;
            card.querySelector(".character-card").dataset.characterUrl = person.url;
            card.querySelector(".character-card").addEventListener("click", () => {
              showCharacterDetails(person.url);
              showInfoCon.scrollIntoView({ behavior: 'smooth', block: 'end' });
            });
            itemCon.appendChild(card);
          });
        } else {
          itemCon.innerHTML = "<p>No items available for this category.</p>";
        }
      })
      .catch(handleError)
      .finally(() => toggleSpinner(false));
  }

  function showCharacterDetails(url) {
    toggleSpinner(true);
    fetch(url)
      .then(handleSuccess)
      .then(character => {
        let characterDetailsSection = document.querySelector(".character-details");
        if (!characterDetailsSection) {
          characterDetailsSection = document.createElement("div");
          characterDetailsSection.classList.add("character-details");
          showInfoCon.appendChild(characterDetailsSection);
        }
        characterDetailsSection.innerHTML = '';
        const characterInfo = document.createElement("div");
        characterInfo.classList.add("character-info");
        const filmsSlider = document.createElement("div");
        filmsSlider.classList.add("films-slider");
        filmsSlider.id = "films-slider";

        let filmFetchCount = 0;
        character.films.forEach(filmUrl => {
          fetch(filmUrl)
            .then(handleSuccess)
            .then(film => {
              const filmTemplate = document.querySelector("#film-card-template");
              const filmCard = filmTemplate.content.cloneNode(true);
              const movieTitle = filmCard.querySelector(".film-title");
              const openingCrawl = filmCard.querySelector(".opening-crawl");
              const filmPosterImage = filmCard.querySelector(".film-poster");
              movieTitle.textContent = film.title;
              openingCrawl.textContent = film.opening_crawl;
              const filmPosterImageUrl = filmPosters[film.title];
              if (filmPosterImageUrl) {
                filmPosterImage.src = filmPosterImageUrl;
                filmPosterImage.alt = `${film.title} poster`;
              }
              filmsSlider.appendChild(filmCard);
              filmFetchCount++;
              if (filmFetchCount === character.films.length) {
                characterInfo.appendChild(filmsSlider);
                characterDetailsSection.appendChild(characterInfo);
                showInfoCon.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            })
            .catch(handleError);
        });
      })
      .catch(handleError)
      .finally(() => toggleSpinner(false));
  }

  const categoryMap = {
    people: fetchPeople,
    planets: () => { itemCon.innerHTML = '<p>Under Construction</p>'; },
    films: () => { itemCon.innerHTML = '<p>Under Construction</p>'; },
    species: () => { itemCon.innerHTML = '<p>Under Construction</p>'; },
    vehicles: () => { itemCon.innerHTML = '<p>Under Construction</p>'; },
    starships: () => { itemCon.innerHTML = '<p>Under Construction</p>'; },
  };

  document.querySelectorAll('.category-box a').forEach(link => {
    link.addEventListener('click', function(event) {
      const category = event.currentTarget.dataset.category;
      if (categoryMap[category]) {categoryMap[category]();} else {itemCon.innerHTML = '<p>No Category</p>';}});});

  fetchPeople();
})();

