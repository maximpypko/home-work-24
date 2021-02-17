const num = 0;
const num1 = 1;

const getShips = async function (email, acc = []) {
    await fetch(email)
        .then(response => {
            const successfulRequestNumber = 200;
            if (response.status !== successfulRequestNumber) {
                return Promise.reject(new Error(response.status));
            }
            return Promise.resolve(response);
        })
        .then(response => response.json())
        .then(data => {
            for (const iterator of data.results) {
                acc.push(iterator);
            }
            return data;
        })
        .then(data => {
            if (data.next) {
                return getShips(data.next, acc);
            }
        });
    return acc;
};

const getFilms = async function (elem) {
    const res = [];
    elem.map((el) => {
        res.push([el.title, el.starships]);
    });
    return await res;
};

const getArrUrl = async function (target, arrFilms) {
    const res = [];
    arrFilms.map((el) => {
        if (el[num] === target.innerText) {
            res.push(el[num1]);
        }
    });
    return await res;
};

const matching = async function (arrShips, arrUrl) {
    let res = [];
    arrUrl.reduce((acc, el) => {
        for (const iterator of el) {
            for (const iterator2 of arrShips) {
                if (iterator2.url === iterator) {
                    acc.push(iterator2.name);
                }
            }
        }
        res = acc;
    }, []);
    return await res;
};

const result = async function (arrShips, arrFilms) {
    const $Ul = document.createElement('UL');

    for (const iterator of arrFilms) {
        const $Li = document.createElement('LI');
        $Li.append(iterator[num]);
        $Ul.append($Li);
    }
    document.body.appendChild($Ul);

    await $Ul.addEventListener('click', (e) => {
        const arrUrl = getArrUrl(e.target, arrFilms);
        arrUrl
            .then(data => {
                const resultMatching = matching(arrShips, data);
                resultMatching
                    .then(data2 => {
                        const $starshipContainer = document.createElement('UL');
                        $starshipContainer.className = 'starships';
                        data2.forEach(el => {
                            const $starship = document.createElement('LI');
                            $starship.append(el);
                            $starshipContainer.appendChild($starship);
                        });
                        if (e.target.children.length === num) {
                            e.target.appendChild($starshipContainer);
                        } else {
                            e.target.children[num].remove();
                        }
                    });
            });
    });
};

fetch('https://swapi.dev/api/films/')
    .then(data => data.json())
    .then(data => {
        const arrShips = [];
        let arrFilms = [];
        const ships = getShips('https://swapi.dev/api/starships/');
        const films = getFilms(data.results);
        films
            .then(data2 => arrFilms = data2)
            .catch(error => document.body.append(`Ooops... ошибка ${error.message}`));
        ships
            .then(nameShips => {
                for (const iterator of nameShips) {
                    arrShips.push({
                        name: iterator.name,
                        url: iterator.url,
                    });
                }
                result(arrShips, arrFilms);
            })
            .catch(error => document.body.append(`Ooops... ошибка ${error.message}`));
    });