// const { id } = require("date-fns/locale");

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});

// helpers/Utils

const lazyLoader = new IntersectionObserver((entries) => {
    // por cada una que aparezca va tener los datos
    entries.forEach((entry) => {
        // console.log({entry});
        if (entry.isIntersecting) {

            const url = entry.target.getAttribute('data-img');

            entry.target.setAttribute('src', url);
        }
    });
});

function createMovies(
    movies, 
    container, 
    {
        lazyLoad = false, 
        clean = true, 
    } = {}, 
) {
    if(clean) {
        container.innerHTML = ''; // limpiar el html;
    }

    movies.forEach((movie) => {

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = `#movie=${movie.id}`;
        });

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-img' : 'src', // atributo para implementar el lazyLoading
            `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
        );
            
        // seleccionar que imagen mostrar cuando no cargue correctamente. "https://i.ibb.co/dKGRLmx/fposter-small-wall-texture-product-750x1000.jpg"
        movieImg.addEventListener('error', () => {
            movieImg.setAttribute('src',
            `https://i.ibb.co/dKGRLmx/fposter-small-wall-texture-product-750x1000.jpg`);
        });
        
        if (lazyLoad) {
            lazyLoader.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer); // de cada iteración de nuestras películas vamos a estar agregando una nueva película dentro de nuestro contenedor
    });
}

function createCategories(categories, container) {
    container.innerHTML = ""; // esto para que no halla duplicados
    categories.forEach((category) => {

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`;
        });
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
}

// llamados a la API
async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    console.log(movies);
    createMovies(movies, trendingMoviesPreviewList, {lazyLoad: true});
};

async function getCategoriesPreview() {
    const { data } = await api('genre/movie/list');

    const categories = data.genres; // es genres ya que así es como muestra la estructura la documentación
    createCategories(categories, categoriesPreviewList);
};

async function getMoviesByCategory(id) {
    const { data } = await api('discover/movie', {
        params: { // gracias a axios podemos hacer esto
            with_genres: id, 
        },
    });
    const movies = data.results;
    maxPage = data.total_pages;
    createMovies(movies, genericSection, {lazyLoad: true});
};

function getPaginatedMoviesByCategory(id) {
    return async function () {
        const { 
            scrollTop, 
            scrollHeight, 
            clientHeight 
        } = document.documentElement;
            
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 10)
        const pageIsNotMax = page < maxPage;
    
        if (scrollIsBottom && pageIsNotMax) {
            page++; // cada vez que se de al botón de cargar más, se sume una página adicional.
            const { data } = await api('discover/movie', {
                params: {
                    with_genres: id,
                    page,
                },
            });
            const movies = data.results;
            
            createMovies(
                movies, 
                genericSection, 
                {lazyLoad: true, clean: false},
            );
        }
    }
}

async function getMoviesBySearch(query) {
    const { data } = await api('search/movie', {
        params: { // gracias a axios podemos hacer esto
            query, 
        },
    });
    const movies = data.results;
    maxPage = data.total_pages;
    createMovies(movies, genericSection, {lazyLoad: true, clean: true});
};

function getPaginatedMoviesBySearch(query) {
    return async function () {
        const { 
            scrollTop, 
            scrollHeight, 
            clientHeight 
        } = document.documentElement;
            
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 10)
        const pageIsNotMax = page < maxPage;
    
        if (scrollIsBottom && pageIsNotMax) {
            page++; // cada vez que se de al botón de cargar más, se sume una página adicional.
            const { data } = await api('search/movie', {
                params: {
                    query,
                    page,
                },
            });
            const movies = data.results;
            
            createMovies(
                movies, 
                genericSection, 
                {lazyLoad: true, clean: false},
            );
        }
    }
}

async function getTrendingMovies() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    maxPage = data.total_pages;

    createMovies(movies, genericSection, {lazyLoad:true});

    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerText = 'Load more';
    // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
    // genericSection.appendChild(btnLoadMore);
    // btnLoadMore.addEventListener('click', () => {
    //     genericSection.removeChild(btnLoadMore);
    // });
    
};
async function getPaginatedTrendingMovies() {
    const { 
        scrollTop, 
        scrollHeight, 
        clientHeight 
    } = document.documentElement;
        
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 10)
    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
        page++; // cada vez que se de al botón de cargar más, se sume una página adicional.
        const { data } = await api('trending/movie/day', {
            params: {
                page,
            },
        });
        const movies = data.results;
        
        
        createMovies(
            movies, 
            genericSection, 
            {lazyLoad: true, clean: false},
        );
    }
        // aquí la idea es usar el scroll infinito en vez de botón
        // const btnLoadMore = document.createElement('button');
        // btnLoadMore.innerText = 'Load more';
        // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
        // genericSection.appendChild(btnLoadMore);
        // btnLoadMore.addEventListener('click', () => {
        //     genericSection.removeChild(btnLoadMore);
        // });
}

async function getMovieById(id) {
    const { data: movie } = await api(`movie/${id}`); // tiene que ser data: movie ya que así funciona axios recibe un objeto data y quiero renombrarlo a movie pues tiene información de nuestra película
    
    const movieImgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    headerSection.style.background = `
        linear-gradient(
            180deg, 
            rgba(0, 0, 0, 0.35) 19.27%, 
            rgba(0, 0, 0, 0) 29.17% 
        ),
        url(${movieImgUrl})`;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList);
    getRelatedMoviesId(id);
};

async function getRelatedMoviesId(id) {
    const { data } = await api(`movie/${id}/recommendations`);
    const relatedMovies = data.results;

    createMovies(relatedMovies, relatedMoviesContainer);
}








