let maxPage;
let page = 1;
let infiniteScroll;

let historyPages = [] // creo mi array aquí guardo mi historial de búsquedas


let valueToShow = searchFormInput.value;
searchFormBtn.addEventListener('click', () => {
    location.hash = `#search=${searchFormInput.value}`;
    const [_, query] = location.hash.split('=');
    const queryFixed = decodeURI(query); // para que se pueda ver en el input sin el %20
    historyPages.push(queryFixed);
    location.hash = `#search=${queryFixed}`;
    
});

trendingBtn.addEventListener('click', () => {
    location.hash = '#trends';
});

arrowBtn.addEventListener('click', () => {
    // guardar historial de mis búsquedas:
    // history.back(); // no funciona puesto que el back es otra página web me devuelve a esa página web y esa no es la idea
    if (location.hash.startsWith('#search=')) {
        historyPages.pop() // cada vez que presione la flecha me elimina entonces el último que se agregó
        valueToShow = historyPages[historyPages.length-1]
        searchFormInput.value = valueToShow;
        if (historyPages.length>0) {
            location.hash = '#search=' + historyPages[historyPages.length-1];
        } else {
            location.hash = '#home'
            searchFormInput.value = '';
        };
    } else {
        history.back();
    }

    // location.hash = '#home'; // esto me devuelve de una al home
});



window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, false); // para hacer scroll infinito

function navigator() {
    console.log({location});

    if (infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, {passive: false});
        infiniteScroll = undefined;
    }

    if (location.hash.startsWith('#trends')) {
        trendsPage()
    } else if (location.hash.startsWith('#search=')) {
        searchPage()
    } else if (location.hash.startsWith('#movie=')) {
        movieDetailsPage();
    } else if (location.hash.startsWith('#category=')) {
        categoriesPage();
    } else {
        homePage();
    }
    // window.scrollTo(0, 0); // este también funciona
    // o este para que cuando vayamos a una categoría o sección de nuestra página haga scroll hasta arriba automáticamente
    // document.body.scrollTop = 0
    document.documentElement.scrollTop = 0; // este es el que me funcionó mejor
    if (infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, {passive: false});
    }
}


function homePage() {
    console.log('Home');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
    movieFooter.classList.remove('inactive');
    

    getTrendingMoviesPreview();
    getCategoriesPreview();
}

function categoriesPage() {
    console.log('Categories');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    movieFooter.classList.add('inactive');

    const [_, categoryData] = location.hash.split('=') // => ['#category', 'id-name'] así es como lo separaría gracias al split
    const [categoryId, categoryName] = categoryData.split('-');

    const categoryNameFixed = decodeURI(categoryName);
    headerCategoryTitle.innerHTML = categoryNameFixed;
    getMoviesByCategory(categoryId);

    infiniteScroll = getPaginatedMoviesByCategory(categoryId);
    
}

function movieDetailsPage() {
    console.log('Movie');

    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');
    movieFooter.classList.add('inactive');

    // => ['#movie', 'idDelMovie'] así es como lo separaría gracias al split
    const [_, movieId] = location.hash.split('=') 
    getMovieById(movieId);
    

}

function searchPage() {
    console.log('Search');
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    movieFooter.classList.add('inactive');

    // => ['#search', 'nameDeLoQueBusco'] así es como lo separaría gracias al split
    const [_, query] = location.hash.split('=') 
    getMoviesBySearch(query);

    infiniteScroll = getPaginatedMoviesBySearch(query);
}

function trendsPage() {
    console.log('Trends');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    movieFooter.classList.add('inactive');

    headerCategoryTitle.innerHTML = 'Trends';

    getTrendingMovies();

    infiniteScroll = getPaginatedTrendingMovies; // es un atajo de esta función
    
}

