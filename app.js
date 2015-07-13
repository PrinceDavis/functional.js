var beerData = JSON.parse(document.getElementById("beerData").textContent);
var allBeers = beerData.beers;
var beerTemplate = document.getElementById("tmpl-beer").textContent;
var beerList = document.getElementById("beerList");
var averageAbv = document.getElementById("averageAbv");
var filters = document.getElementById("filters");
var filterLinks = filters.querySelectorAll("a");
var fp = {};

fp.filter = function filter(collection, callBack) {
  var filtered = [];
  for (i=0; i<collection.length; i++) {
    if (callBack(collection[i])) {
      filtered.push(collection[i]);
    }
  }
  return filtered;
}

fp.map = function map (collection, callBack) {
  var mapped = [];
  for (var i = 0; i < collection.length; i++) {
    mapped.push(callBack(collection[i]));
  };

  return mapped;
}
fp.reduce = function reduce (collection, callBack, initial) {
  var last = initial;
  for (var i = 0; i < collection.length; i++) {
    last = callBack(last, collection[i]);
  };
  return last;
}

fp.add = function add (a, b) {
  return a + b;
}

function loadBeers (beers) {
  beerList.innerHTML = _.template(beerTemplate)({ beers: beers });
  averageAbv.innerHTML = 'Average ABV: ' + getAverageAbv(beers) + '%';
}

function setActiveFilter (active) {
  for (i=0; i<filterLinks.length; i++) {
    filterLinks[i].classList.remove('btn-active');
  }
  active.classList.add('btn-active');
}


function makeFilter (collection, property) {
  return function (value) {
    return fp.filter(collection, function(item) {
      return item[property] === value;
    });
  }
}

function getAverageAbv (beers) {
  var abvs = fp.map(beers function (beer) {
    return beers.abv;
  });

  var total = fp.reduce(abvs, fp.add, 0);

  return Math.round( (total / beers.length) * 10 ) / 10 ;
}
var filterByLocale = makeFilter(allBeers, 'locale');
var filterByType = makeFilter(allBeers, 'type');

loadBeers(allBeers);

filters.addEventListener('click', function (e) {
  e.preventDefault();
  var clicked = e.target;
  var filterName = clicked.dataset.filter;
  var filteredBeers = [];
  var i;

  setActiveFilter(clicked);
      
  switch (filterName) {
    case 'all':
      filteredBeers = allBeers;
      break;
    case 'domestic':
      filteredBeers = filterByLocale('domestic');
      break;
    case 'imports':
      filteredBeers = filterByLocale('import');
      break;
    case 'ale':
      filteredBeers = fp.filter(allBeers, function (beer) {
        return beer.type === 'ale' || beer.type === 'ipa';
      })
      break;
    case 'lager':
      filteredBeers = filterByType('lager');
      break;
    case 'stout':
      filteredBeers = filterByType('stout');
      break;
  }
  
  loadBeers(filteredBeers);
});