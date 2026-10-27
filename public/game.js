const pokemonNames = [
  'Bulbasaur', 'Ivysaur', 'Venusaur', 'Charmander', 'Charmeleon', 'Charizard',
  'Squirtle', 'Wartortle', 'Blastoise', 'Caterpie', 'Metapod', 'Butterfree',
  'Weedle', 'Kakuna', 'Beedrill', 'Pidgey', 'Pidgeotto', 'Pidgeot', 'Rattata',
  'Raticate', 'Spearow', 'Fearow', 'Ekans', 'Arbok', 'Pikachu', 'Raichu',
  'Sandshrew', 'Sandslash', 'Nidoran♀', 'Nidorina', 'Nidoqueen', 'Nidoran♂',
  'Nidorino', 'Nidoking', 'Clefairy', 'Clefable', 'Vulpix', 'Ninetales',
  'Jigglypuff', 'Wigglytuff', 'Zubat', 'Golbat', 'Oddish', 'Gloom', 'Vileplume',
  'Paras', 'Parasect', 'Venonat', 'Venomoth', 'Diglett', 'Dugtrio', 'Meowth',
  'Persian', 'Psyduck', 'Golduck', 'Mankey', 'Primeape', 'Growlithe', 'Arcanine',
  'Poliwag', 'Poliwhirl', 'Poliwrath', 'Abra', 'Kadabra', 'Alakazam', 'Machop',
  'Machoke', 'Machamp', 'Bellsprout', 'Weepinbell', 'Victreebel', 'Tentacool',
  'Tentacruel', 'Geodude', 'Graveler', 'Golem', 'Ponyta', 'Rapidash', 'Slowpoke',
  'Slowbro', 'Magnemite', 'Magneton', 'Farfetch’d', 'Doduo', 'Dodrio', 'Seel',
  'Dewgong', 'Grimer', 'Muk', 'Shellder', 'Cloyster', 'Gastly', 'Haunter',
  'Gengar', 'Onix', 'Drowzee', 'Hypno', 'Krabby', 'Kingler', 'Voltorb', 'Electrode',
  'Exeggcute', 'Exeggutor', 'Cubone', 'Marowak', 'Hitmonlee', 'Hitmonchan',
  'Lickitung', 'Koffing', 'Weezing', 'Rhyhorn', 'Rhydon', 'Chansey', 'Tangela',
  'Kangaskhan', 'Horsea', 'Seadra', 'Goldeen', 'Seaking', 'Staryu', 'Starmie',
  'Mr. Mime', 'Scyther', 'Jynx', 'Electabuzz', 'Magmar', 'Pinsir', 'Tauros',
  'Magikarp', 'Gyarados', 'Lapras', 'Ditto', 'Eevee', 'Vaporeon', 'Jolteon',
  'Flareon', 'Porygon', 'Omanyte', 'Omastar', 'Kabuto', 'Kabutops', 'Aerodactyl',
  'Snorlax', 'Articuno', 'Zapdos', 'Moltres', 'Dratini', 'Dragonair', 'Dragonite', 'Mewtwo', 'Mew'
];

const storageKey = 'kanto151-found-v1';
const grid = document.querySelector('#pokemon-grid');
const input = document.querySelector('#guess-input');
const feedback = document.querySelector('#guess-feedback');
const foundCount = document.querySelector('#found-count');
const progressPercent = document.querySelector('#progress-percent');
const progressBar = document.querySelector('#progress-bar');
const progressFill = document.querySelector('#progress-fill');
const remainingCount = document.querySelector('#remaining-count');
let found = loadProgress();

function normalizeName(value) {
  return value
    .replace(/♀/g, 'female')
    .replace(/♂/g, 'male')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return new Set(saved.filter((id) => Number.isInteger(id) && id >= 1 && id <= pokemonNames.length));
  } catch {
    return new Set();
  }
}

function saveProgress() {
  try {
    localStorage.setItem(storageKey, JSON.stringify([...found]));
  } catch {
    // The game still works if this browser blocks local storage.
  }
}

function renderGrid() {
  grid.innerHTML = pokemonNames.map((name, index) => {
    const id = index + 1;
    const isFound = found.has(id);
    return `<div class="pokemon-card${isFound ? ' is-found' : ''}"${isFound ? ' aria-label="' + String(id).padStart(3, '0') + ' ' + name + '"' : ' aria-label="' + String(id).padStart(3, '0') + ', sin descubrir"'}>
      <span class="pokemon-number">${String(id).padStart(3, '0')}</span>
      <span class="pokemon-mark" aria-hidden="true">${isFound ? '✓' : '?'}</span>
      <span class="pokemon-name">${isFound ? name : '???'}</span>
    </div>`;
  }).join('');
  updateProgress();
}

function updateProgress() {
  const count = found.size;
  const percent = Math.round((count / pokemonNames.length) * 100);
  foundCount.textContent = count;
  progressPercent.textContent = `${percent}%`;
  progressBar.setAttribute('aria-valuenow', String(count));
  progressFill.style.width = `${percent}%`;
  remainingCount.textContent = `${pokemonNames.length - count} restantes`;
}

function setFeedback(message, type = '') {
  feedback.textContent = message;
  feedback.className = `feedback${type ? ` is-${type}` : ''}`;
}

function submitGuess(event) {
  event.preventDefault();
  const guess = normalizeName(input.value.trim());
  if (!guess) {
    setFeedback('Escribe el nombre de un Pokémon para empezar.', 'error');
    input.focus();
    return;
  }

  const matchIndex = pokemonNames.findIndex((name) => normalizeName(name) === guess);

  if (matchIndex < 0) {
    setFeedback('No encontramos ese nombre. ¡Prueba con otro!', 'error');
  } else if (found.has(matchIndex + 1)) {
    setFeedback(`${pokemonNames[matchIndex]} ya está en tu Pokédex.`, 'error');
  } else {
    found.add(matchIndex + 1);
    saveProgress();
    renderGrid();
    setFeedback(`¡Bien! ${pokemonNames[matchIndex]} descubierto.`, 'success');
    if (found.size === pokemonNames.length) {
      setFeedback('¡Completaste la Pokédex de Kanto! Eres un maestro Pokémon.', 'success');
    }
  }

  input.value = '';
  input.focus();
}

document.querySelector('#guess-form').addEventListener('submit', submitGuess);
document.querySelector('#reset-button').addEventListener('click', () => {
  found.clear();
  saveProgress();
  renderGrid();
  setFeedback('Pokédex reiniciada. ¿Cuántos recuerdas?', 'success');
  input.value = '';
  input.focus();
});

renderGrid();
