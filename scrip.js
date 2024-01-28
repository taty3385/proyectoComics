// 1) url base 
// 2) TS(time start)
// 3) public key 
// 4) hash -MD5( se hace x el generador)
// http://gateway.marvel.com/v1/public/comics?ts=1&apikey=1234&hash=ffd275c5130566a2916217b101f26150
//  ->         URL BASE            <- RECURSO- TS - APY PUBLICA- HASH  


const $ = (selector) => document.querySelector(selector);

const urlBase = "http://gateway.marvel.com/v1/public/";
const ts = "ts=1";
const keyPublic = "&apikey=550c8159913c619584d39b76b50c69f6";
const hash = "&hash=241d1f4c5068b3fc5cf2eb46db150f01";
const limit = 20;
const offset = 0
let currentPage = 0;
let currentOrder = "asc"; 



const getMarvelData = async (resource, title, offset) => {
    let validationTitle = title ? `&${resource === "characters" ? "name" : "title"}=${title}` : "";
    let sortOrder = currentOrder === "asc" ? "" : "-";
    let orderField;

    if (currentOrder === "newest" || currentOrder === "oldest") {
        sortOrder = currentOrder === "newest" ? "-" : "";
        orderField = "modified";
    } else {
        orderField = resource === "characters" ? "name" : "title";
    }

    const url = `${urlBase}${resource}?${ts}${keyPublic}${validationTitle}${hash}&offset=${offset}&limit=${limit}&orderBy=${sortOrder}${orderField}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.data && data.data.results) {
        const totalElements = data.data.total || 0;
        const totalPages = Math.ceil(totalElements / limit);

        return {
            results: data.data.results,
            totalElements: totalElements,
            totalPages: totalPages
        };
    } else {

        return {
            results: [],
            totalElements: 0,
            totalPages: 0
        };
    }

};



const getComicId = async (comicId) => {
    const endpoint = `comics/${comicId}`;
    const url = `${urlBase}${endpoint}?${ts}${keyPublic}${hash}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.data.results[0];
    } catch (error) {
        console.error(`Error al obtener la información del cómic con comicId ${comicId}:`, error);
        throw error;
    }
};


const getCharacterId = async (characterId) => {
    const endpoint = `characters/${characterId}`;
    const url = `${urlBase}${endpoint}?${ts}${keyPublic}${hash}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.data.results[0];
    } catch (error) {
        console.error(`Error al obtener la información del personaje con characterId ${characterId}:`, error);
        throw error;
    }
};



const printContent = async (resource, title, offset) => {

    const contentData = await getMarvelData(resource, title, offset);
    console.log(contentData);

    if (resource === 'comics') {
        printComic(contentData.results);
    } else if (resource === 'characters') {
        printCharacter(contentData.results);
    }
};

const formatFecha = (fecha) => {
    const fechas = new Date(fecha);
    const dia = fechas.getDate();
    const mes = fechas.getMonth() + 1;
    const año = fechas.getFullYear();

    return `${dia}/${mes}/${año}`;
};

const Writer = (comic) => {
    if (comic && comic.creators && comic.creators.items && comic.creators.items.length > 0) {
        const writer = comic.creators.items.find((creator) => creator.role.toLowerCase() === 'writer');
        return writer ? writer.name : ' ';
    } else {
        return '';
    }
};


const printComic = (comicsData) => {
    $(".containerResult").innerHTML = "";

    if (comicsData.length > 0) {
        for (let comic of comicsData) {
            const thumbnail = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
            const title = comic.title;
            const description = comic.description
            const published = formatFecha(comic.dates[0].date);
            const writer = Writer(comic)
            $(".containerResult").innerHTML += `<div>
                <img  class="h-[80%] w-[100%]" src="${thumbnail}" alt="${title}">
                <p>${title}</p>
                <p class="hidden">ESCRITOR: ${writer}</p>
                <p class="hidden">PUBLICADO:${published}</p>
                <p class="hidden">DESCRIPCION:${description}</p>
                
            </div>`;
        }
    }
};




const printCharacter = (charactersData) => {

    $(".containerResult").innerHTML = "";

    if (charactersData.length > 0) {
        for (let character of charactersData) {
            const thumbnail = `${character.thumbnail.path}.${character.thumbnail.extension}`;
            const name = character.name;
            $(".containerResult").innerHTML += `<div>
                <img class="h-[80%] w-[100%] " src="${thumbnail}" alt="${name}">
                <p class="h-[20%] bg-black text-white text-center flex flex-col justify-center border-solid border-4 border-t-red-600 hover">${name}</p>
                
            </div>`;
        }
    }
};



const navigatePage = async (resource, title, offset) => {

    if (offset === 'last') {
        const { totalPages } = await getMarvelData(resource, title, 0);
        currentPage = totalPages - 1;
    } else {
        if (offset === 1) {
            const { totalPages } = await getMarvelData(resource, title, currentPage * limit);

            if (currentPage + 1 >= totalPages) {
                return;
            }
        }

        if (offset === -1) {
            if (currentPage === 0) {
                return;
            }
        }

        currentPage += offset;
    }

    updatePageNumber();
    await printContent(resource, title, currentPage * limit);

};

const updatePageNumber = () => {
    $("#currentPage").textContent = currentPage + 1;
};





$("#tilteSearch").addEventListener("input", () => {
    currentPage = 0;
    updatePageNumber();

});

$("#optionPersonajes").addEventListener("change", () => {
    currentPage = 0;
    updatePageNumber();

});

$("#sortOrder").addEventListener("change", () => {
    currentOrder = $("#sortOrder").value;
    currentPage = 0;
    updatePageNumber();

});
$("#buttonSearch").addEventListener("click", () => {
    const resource = $("#optionPersonajes").value;
    const title = $("#tilteSearch").value;
    currentPage = 0;
    updatePageNumber();
    navigatePage(resource, title, 0);
});
$("#prev").addEventListener("click", () => navigatePage($("#optionPersonajes").value, $("#tilteSearch").value, -1));
$("#next").addEventListener("click", () => navigatePage($("#optionPersonajes").value, $("#tilteSearch").value, 1));
$("#first").addEventListener("click", () => navigatePage($("#optionPersonajes").value, $("#tilteSearch").value, -currentPage));
$("#last").addEventListener("click", () => {
    const resource = $("#optionPersonajes").value;
    const title = $("#tilteSearch").value;
    navigatePage(resource, title, 'last');
});


navigatePage("comics", "", 0);
