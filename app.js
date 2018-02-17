'use strict';

//Array to store the objects
var allProducts = [];

//Arrays for current and next selections
var currProducts = [];
var newProducts = [];

//Misc working area fields
var maxArrayLimit = 3;
var numSelections = 0;
var maxSelections = 25;

//Constructor for products
function Product(name, filepath, numSelected, numViews) {
  this.name = name;
  this.filepath = filepath;
  this.numSelected = numSelected;
  this.numViews = numViews;
  allProducts.push(this);
}

//******* MAINLINE ********

//Restore from checkpoint if one exists, otherwise load new product array
(function getLocalStorage() {
  if (localStorage.products) {
    var strProducts = localStorage.getItem('products');
    var products = JSON.parse(strProducts);
    console.log('products: '+products);
    for (var prod of products) {
      console.log('prod: '+prod);
      var newProd = new Product(prod.name, prod.filepath, prod.numSelected, prod.numViews);
    }
    var strNumSelections = localStorage.getItem('numselections');
    numSelections = JSON.parse(strNumSelections);
    console.log('numSelections: '+numSelections);
  } else {
    instantiateProducts();
  }
})();


// declare listener
var imgEl0 = document.getElementById('product0');
var imgEl1 = document.getElementById('product1');
var imgEl2 = document.getElementById('product2');
imgEl0.addEventListener('click', SelectedZero);
imgEl1.addEventListener('click', SelectedOne);
imgEl2.addEventListener('click', SelectedTwo);

//Initialize working arrays with dummy Values
for (var i=0; i<maxArrayLimit; i++); {
  currProducts.push('dummy');
  newProducts.push('dummy');
}

//Post initial images for selection.
randomProducts();

//Create listener to clear local storage on command.
var clearLS = document.getElementById('clearStorage');
clearLS.addEventListener('click', function() {
  console.log('click it!');
  localStorage.clear();
});

//******** FUNCTIONS START HERE ********

//Build product objects
function instantiateProducts() {
  new Product('bag','bag.jpeg',0,0);
  new Product('banana','banana.jpeg',0,0);
  new Product('bathroom','bathroom.jpeg',0,0);
  new Product('boots','boots.jpeg',0,0);
  new Product('breakfast','breakfast.jpeg',0,0);
  new Product('bubblegum','bubblegum.jpeg',0,0);
  new Product('chair','chair.jpeg',0,0);
  new Product('cthulhu','cthulhu.jpeg',0,0);
  new Product('dog-duck','dog-duck.jpeg',0,0);
  new Product('dragon','dragon.jpeg',0,0);
  new Product('pen','pen.jpeg',0,0);
  new Product('pet-sweep','pet-sweep.jpeg',0,0);
  new Product('tauntaun','tauntaun.jpeg',0,0);
  new Product('unicorn','unicorn.jpeg',0,0);
  new Product('usb','usb.gif',0,0);
  new Product('water-can','water-can.jpeg',0,0);
  new Product('wine-glass','wine-glass.jpeg',0,0);
}

//Handle/Determine Different Selections
function SelectedZero() {
  userSelection(0);
}
function SelectedOne() {
  userSelection(1);
}
function SelectedTwo() {
  userSelection(2);
}

//Handle Selection
function userSelection(selection) {
  console.log('User selected ' + currProducts[selection].name);
  currProducts[selection].numSelected++;

  //Take Checkpoint:  Save results to local storage
  var strProducts = JSON.stringify(allProducts);
  localStorage.setItem('products', strProducts);
  var strNumSelections = JSON.stringify(numSelections);
  localStorage.setItem('numselections', strNumSelections);

  //If we are done, output the totals, otherwise post a new set
  if (numSelections < maxSelections) {
    randomProducts();
  } else{
    outputTotals();
  }
}

//Randomly display a selection of pictures (but with no duplicates)
function randomProducts() {
  for (var i=0; i<maxArrayLimit;i++) {
    var found = false;
    while (found === false) {
      var randomProduct = Math.floor(Math.random() * allProducts.length);
      if (checkDupe(randomProduct) === false) {
        found = true;
      }
    }
    newProducts[i] = allProducts[randomProduct];
    allProducts[randomProduct].numViews++;
  }

  //Replace current products array with the one.
  currProducts = newProducts;

  //Replace the images on the page
  for (var j=0; j<maxArrayLimit;j++) {
    var imgEl = document.getElementById('product'+j);
    imgEl.src = 'img/'+currProducts[j].filepath;
    imgEl.alt = currProducts[j].name;
  }
  console.log(numSelections);
  numSelections++;
}

//This function checks for duplicate occurances of the same product.
//We need to check both arrays to avoid contiguous occurances.
function checkDupe(randomProduct) {
  var dupFound = false;
  for (var i=0;i<maxArrayLimit;i++) {
    if (allProducts[randomProduct]===currProducts[i]) {
      dupFound = true;
    }
  }
  for (i=0;i<maxArrayLimit;i++) {
    if (allProducts[randomProduct]===newProducts[i]) {
      dupFound = true;
    }
  }
  return dupFound;
}

//This function outputs the final results of the survey.
function outputTotals() {
  //Turn listeners off
  document.getElementById('product0').removeEventListener('click', SelectedZero);
  document.getElementById('product1').removeEventListener('click', SelectedOne);
  document.getElementById('product2').removeEventListener('click', SelectedTwo);

  //Change sub-header
  var subheader = document.getElementById('subheader');
  subheader.textContent = 'Thank you for participating.';

  //Output Totals
  var listheader = document.getElementById('listheader');
  listheader.textContent = 'Survey Results';

  var resultsArea = document.getElementById('resultsarea');
  resultsArea.style.borderStyle = 'solid';
  resultsArea.style.borderColor = 'green';

  var resultsList = document.getElementById('resultsList');
  var liEl;

  var chartLabels = [];
  var chartNumVotes = [];
  var chartNumViews = [];

  //Spin Through the products to generate the results
  for (var i=0; i<allProducts.length;i++) {
    console.log(allProducts[i].name);
    console.log(allProducts[i].numSelected);

    //Build Chart Arrays
    chartLabels.push(allProducts[i].name);
    chartNumVotes.push(allProducts[i].numSelected);
    chartNumViews.push(allProducts[i].numViews);

    //Append each list line
    liEl = document.createElement('li');
    liEl.textContent = allProducts[i].numSelected + ' votes for the ' + allProducts[i].name + ' out of ' + allProducts[i].numViews + ' views.';
    resultsList.appendChild(liEl);
  }

  //Output the chart of the results.

  var ctx = document.getElementById('chartarea').getContext('2d');

  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartLabels,
      datasets: [{
        label: '# of Votes',
        data: chartNumVotes,
        backgroundColor: 'red'
      },
      {
        label: '# of Views',
        data: chartNumViews,
        backgroundColor: 'lightblue'
      }]
    },
    options: {
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true
          },
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          },
        }]
      }
    }
  });
}