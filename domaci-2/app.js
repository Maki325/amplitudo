const filmovi = [
  {
    odgledan: false,
    naziv: 'Love, Death & Robots',
    godina: 2019,
    drzava: 'Sjedinjene Američke Države',
    napomena: 'Svako ko pogleda seriju je gleda u personalnom redosledu',
    glumci: ['Fred Tatasciore', 'Fred Tatasciore']
  },
  {
    odgledan: true,
    naziv: 'Avatar: The Way of Water',
    godina: 2022,
    drzava: 'Sjedinjene Američke Države',
    napomena: '',
    glumci: ['Sam Worthington', 'Zoe Saldana']
  },
  {
    odgledan: true,
    naziv: 'M3GAN',
    godina: 2022,
    drzava: 'Sjedinjene Američke Države',
    napomena: '',
    glumci: ['Allison Williams', 'Violet McGraw', 'Ronny Chieng']
  },
];

const tableBody = document.getElementById('table-body');

const generateCell = (row, value) => {
  const cell = document.createElement('td');
  cell.innerText = value;

  row.append(cell);
}
const generateCheckbox = (row, film) => {
  const cell = document.createElement('td');

  const updateBackground = (checked) => {
    film.odgledan = checked;
    row.style.backgroundColor = checked ? '#D1E7DD' : '#F8D7DA';
  }

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.value = '';
  checkbox.classList.add('form-check-input');
  checkbox.onchange = e => updateBackground(e.target.checked);
  updateBackground(checkbox.checked = film.odgledan);

  cell.append(checkbox);

  row.append(cell);
}
const generateMovieHTML = (film) => {
  const row = document.createElement('tr');

  generateCheckbox(row, film);
  generateCell(row, film.naziv);
  generateCell(row, film.godina);
  generateCell(row, film.drzava);
  generateCell(row, film.napomena);
  generateCell(row, film.glumci.join(', '));

  tableBody.append(row);
}

for(const film of filmovi) {
  generateMovieHTML(film);
}

const addNewMovieForm = document.getElementById('novi-film');

const getValue = (id) => {
  const el = document.getElementById(id);
  return [el.value, el];
}

/**
 * 
 * @param {string} id id of the element
 * @param {function(any):boolean} fn function that checks the validity
 * @returns {any | null} Value if it's valid, otherwise null
 */
const checkField = (id, fn) => {
  let [value, el] = getValue(id);

  const val = fn(value);
  if(val === false) {
    el.classList.add('is-invalid');
    el.setCustomValidity('invalid');
    return null;
  }
  if(typeof val !== 'boolean') value = val;

  return value;
}

const getRadioValue = (name) => {
  const element = document.querySelector(`input[name="${name}"]:checked`);
  if(!element) {
    document.getElementsByName(name).forEach(el => {
      el.classList.add('is-invalid');
      el.setCustomValidity('invalid');
    });
    return null;
  }
  return element.value;
}

const addNewMovie = () => {
  const naziv = checkField('naziv', (naziv) => naziv && typeof naziv === 'string' && naziv.length > 0);
  const godina = checkField('godina', (godina) => {
    if(!godina) return false;
    if(isNaN(godina = parseInt(godina, 10))) return false;
    if(godina < 1930 || godina > 2021) return false;

    return godina;
  });
  const drzava = checkField('drzava', (drzava) => !drzava ? '' : typeof drzava === 'string' && drzava.length > 0);
  const glumci = checkField('glumci', (glumci) => glumci && typeof glumci === 'string' && glumci.length > 0);
  const odgledan = getRadioValue('odgledan');
  const napomena = checkField('napomena', (napomena) => !napomena ? '' : typeof napomena === 'string' && napomena.length > 0);

  if([naziv, godina, drzava, glumci, odgledan, napomena].some(value => value === null)) return;

  const movie = {
    naziv,
    godina,
    drzava,
    glumci: glumci.split(',').map(glumac => glumac.trim()),
    odgledan: odgledan === 'da' ? true : false,
    napomena,
  };
  filmovi.push(movie);
  generateMovieHTML(movie)

  bootstrap.Modal.getInstance(document.getElementById('staticBackdrop')).hide();
  addNewMovieForm.classList.remove('was-validated')
  addNewMovieForm.reset();
}

addNewMovieForm.addEventListener('submit', event => {
  event.preventDefault()
  event.stopPropagation()

  addNewMovieForm.classList.add('was-validated')
  if (addNewMovieForm.checkValidity()) {
    addNewMovie();
  }

}, false)
