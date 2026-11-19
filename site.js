const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    primaryNav.classList.toggle("is-open", !expanded);
  });
}

document.querySelectorAll("[data-year]").forEach((year) => {
  year.textContent = new Date().getFullYear();
});

const photoGrid = document.querySelector("#photo-grid");
if (photoGrid) {
  const allowedLayouts = ["tall", "wide", "square"];
  (window.photoGallery || []).forEach((photo, index) => {
    const layout = allowedLayouts.includes(photo.layout) ? photo.layout : "square";
    const tile = makeElement("button", `photo-tile tile-${layout}`);
    tile.type = "button";
    tile.dataset.photo = photo.src;
    tile.dataset.caption = photo.caption || "";
    const image = makeElement("img");
    image.src = photo.src;
    image.alt = photo.alt || photo.caption || "Photograph by Alex";
    image.loading = index < 2 ? "eager" : "lazy";
    if (photo.objectPosition) image.style.objectPosition = photo.objectPosition;
    const caption = makeElement("span", "photo-caption", photo.caption || "");
    tile.append(image, caption);
    photoGrid.append(tile);
  });
}

const lightbox = document.querySelector(".lightbox");
if (lightbox) {
  const lightboxImage = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector("p");

  document.querySelectorAll(".photo-tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      lightboxImage.src = tile.dataset.photo;
      lightboxImage.alt = tile.querySelector("img").alt;
      lightboxCaption.textContent = tile.dataset.caption;
      lightbox.showModal();
    });
  });

  lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
}

const recipeSearch = document.querySelector("#recipe-search");
if (recipeSearch) {
  const recipes = document.querySelectorAll(".recipe-card");
  recipeSearch.addEventListener("input", () => {
    const query = recipeSearch.value.trim().toLowerCase();
    recipes.forEach((recipe) => {
      const searchableText = `${recipe.textContent} ${recipe.dataset.search}`.toLowerCase();
      recipe.hidden = !searchableText.includes(query);
    });
  });
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

const journalContent = window.journalContent || { books: [], finds: [], toRead: [] };
const bookList = document.querySelector("#book-list");
if (bookList) {
  const books = journalContent.books || [];
  bookList.replaceChildren();
  document.querySelector("#book-empty").hidden = books.length > 0;
  books.forEach((book) => {
    const card = makeElement("article", "journal-entry");
    card.append(makeElement("h3", "", book.title));
    if (book.author) card.append(makeElement("p", "entry-byline", book.author));
    if (book.liked) card.append(makeElement("p", "entry-note", `What I liked: ${book.liked}`));
    if (book.learned) card.append(makeElement("p", "entry-note", `What I learned: ${book.learned}`));
    bookList.append(card);
  });
}

const toReadList = document.querySelector("#to-read-list");
if (toReadList) {
  const booksToRead = journalContent.toRead || [];
  toReadList.replaceChildren();
  document.querySelector("#to-read-empty").hidden = booksToRead.length > 0;
  booksToRead.forEach((book) => {
    const entry = makeElement("article", "reading-queue-entry");
    entry.append(makeElement("h3", "", book.title));
    if (book.author) entry.append(makeElement("p", "entry-byline", book.author));
    toReadList.append(entry);
  });
}

const findList = document.querySelector("#find-list");
if (findList) {
  const finds = journalContent.finds || [];
  findList.replaceChildren();
  document.querySelector("#find-empty").hidden = finds.length > 0;
  finds.forEach((find) => {
    const card = makeElement("article", "journal-entry");
    const title = makeElement("h3");
    let url;
    try {
      url = new URL(find.url);
    } catch (error) {
      url = null;
    }
    if (url && (url.protocol === "https:" || url.protocol === "http:")) {
      const link = makeElement("a", "", find.title);
      link.href = url.href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      title.append(link);
    } else {
      title.textContent = find.title;
    }
    card.append(title);
    if (find.creator) card.append(makeElement("p", "entry-byline", find.creator));
    if (find.note) card.append(makeElement("p", "entry-note", find.note));
    findList.append(card);
  });
}

function renderStaticPins(mapId, pinsId, locationsId, emptyId, tripListId, locations, kind) {
  const map = document.querySelector(mapId);
  if (!map) return;

  const pins = document.querySelector(pinsId);
  const locationList = document.querySelector(locationsId);
  const displayLocations = kind === "snowboarding"
    ? [...locations].sort((a, b) => b.days - a.days || a.name.localeCompare(b.name))
    : locations;
  displayLocations.forEach((location, index) => {
    const markerText = kind === "snowboarding"
      ? Number.isInteger(location.days) ? String(location.days) : "?"
      : String(index + 1);
    const pin = makeElement("span", "map-pin-static", markerText);
    pin.style.left = `${location.x}%`;
    pin.style.top = `${location.y}%`;
    pin.setAttribute("aria-hidden", "true");
    pins.append(pin);

    if (kind === "snowboarding" && location.level === "state") {
      const daysText = Number.isInteger(location.days) ? `${location.days} ${location.days === 1 ? "day" : "days"}` : "? days";
      const label = makeElement("span", "location-tag", `${location.name} · ${daysText}`);
      label.prepend(makeElement("span", "location-number", markerText));
      locationList.append(label);
      return;
    }

    const card = makeElement("article", "adventure-entry");
    card.append(makeElement("h3", "", location.name));
    if (location.state) card.append(makeElement("p", "entry-byline", location.state));
    if (kind === "snowboarding") {
      const daysText = `${location.days} ${location.days === 1 ? "day" : "days"}`;
      card.append(makeElement("p", "entry-meta", daysText));
      if (location.dates && location.dates.length) {
        const dateDetails = document.createElement("details");
        const summary = makeElement("summary", "", `Visit dates (${location.dates.length})`);
        const dateList = document.createElement("ul");
        dateList.className = "visit-date-list";
        const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
        location.dates.forEach((date) => {
          const item = document.createElement("li");
          item.textContent = dateFormat.format(new Date(`${date}T00:00:00Z`));
          dateList.append(item);
        });
        dateDetails.append(summary, dateList);
        card.append(dateDetails);
      }
    }
    if (location.runs) card.append(makeElement("p", "entry-note", `Favorite runs: ${location.runs}`));
    if (location.notes) card.append(makeElement("p", "entry-note", location.notes));
    const photos = location.photos || (location.photo ? [location.photo] : []);
    if (photos.length) {
      const gallery = makeElement("div", "adventure-photo-grid");
      photos.forEach((photo, photoIndex) => {
        const image = makeElement("img", "adventure-entry-photo");
        image.src = photo;
        image.alt = `${location.name} memory ${photoIndex + 1}`;
        image.loading = "lazy";
        gallery.append(image);
      });
      card.append(gallery);
    }
    (tripListId ? document.querySelector(tripListId) : locationList).append(card);
  });

  if (emptyId && locations.length === 0) {
    document.querySelector(emptyId).hidden = false;
  }
}

const adventureData = window.adventureData || { biking: [], snowboarding: [] };
renderStaticPins("#bike-map", "#bike-pins", "#bike-locations", "#bike-empty", null, adventureData.biking, "biking");
renderStaticPins("#snow-map", "#snow-pins", "#snow-locations", null, "#snow-trip-list", adventureData.snowboarding, "snowboarding");
