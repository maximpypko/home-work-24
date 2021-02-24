class StarWars {
    static STARSHIPS_URL = 'https://swapi.dev/api/starships';

    state = {
        starships: [],
        next: StarWars.STARSHIPS_URL,
        films: new Map(),
    }

    constructor(loadButton, listParent) {
        this.loadButton = loadButton;
        this.listParent = listParent;
        this.initLoadEvent();
        this.initItemEvent();
    }

    getData = async function(url){
        const response = await fetch(url);
        const data = await response.json();

        return data;
    }

    initLoadEvent() {
        this.loadButton.addEventListener('click', async () => {
            const data = await this.getData(this.state.next);

            const { results: newStarships, next } = data;
            this.state.starships = [...this.state.starships, ...newStarships];
            this.state.next = next;

            if (!next) {
                this.loadButton.setAttribute('disabled', 'disabled');
            }
            this.renderListItems();
        });
    }

    initItemEvent() {
        this.listParent.addEventListener('click', async ({ target }) => {
            if (target.hasAttribute('data') && !target.children.length) {
                const shipName = target.innerText;
                const { films: filmLinks } = this.state.starships.find(x => x.name === shipName);
                const films = await this.getFilms(filmLinks);
                this.renderFilms(films, target);
            } else {
                this.deleteData(target);
            }
        });
    }

    deleteData = target => {
        if (target.closest('.films__item')) {
            target.parentNode.remove();
        } else if (target.closest('.films-list')) {
            target.remove();
        } else if (target.hasAttribute('data') && target.children.length) {
            target.firstElementChild.remove();
        }
    }

    async getFilms(links) {

        const diff = [...new Set(links.filter(link => !this.state.films.has(link)))];
        const films = await Promise.all(diff.map(this.getData));
        this.setFilmsCache(links, films);

        const cachedFilmsLinks = links.filter(x => !diff.includes(x));
        const cachedFilms = cachedFilmsLinks.map(link => this.state.films.get(link));

        return [...films, ...cachedFilms];
    }

    setFilmsCache(links, filmsData) {

        links.forEach(link => {
            if (!this.state.films.has(link)) {
                this.state.films.set(link, filmsData.find(x => x.url === link));
            }
        });
    }

    renderFilms = (films, target) => {
        if (!target.children.length) {
            const titleFilms = films.map(filmsItem => filmsItem.title);
            const ul = document.createElement('ul');
            ul.classList.add('films-list');

            titleFilms.forEach(title => {
                const li = document.createElement('li');
                li.classList.add('films__item');
                li.textContent = title;
                ul.appendChild(li);
            });
            target.appendChild(ul);
        }
    }

    renderListItems() {
        const fragment = document.createDocumentFragment();

        this.state.starships.forEach(ship => {
            const li = document.createElement('li');
            li.setAttribute('data', 'list__item');
            li.classList.add('list__item');
            li.textContent = ship.name;
            fragment.appendChild(li);
        });

        this.listParent.innerHTML = '';
        this.listParent.prepend(fragment);
    }
}


// eslint-disable-next-line no-unused-vars
const starWars = new StarWars(
    document.querySelector('.load-ships'),
    document.querySelector('.starships-list')
);