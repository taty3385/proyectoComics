
// 1) url base 
// 2) TS(time start)
// 3) public key 
// 4) hash -MD5( se hace x el generador)
// http://gateway.marvel.com/v1/public/comics?ts=1&apikey=1234&hash=ffd275c5130566a2916217b101f26150
//  ->         URL BASE            <- RECURSO- TS - APY PUBLICA- HASH  


const $ = (selector) => document.querySelector(selector);

const urlBase = "https://gateway.marvel.com/v1/public/";
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
    console.log(data.data);

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
    const response = await fetch(url);
    const data = await response.json();
    return data.data.results[0];

};


const getCharacterId = async (characterId) => {
    const endpoint = `characters/${characterId}`;
    const url = `${urlBase}${endpoint}?${ts}${keyPublic}${hash}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.data.results[0];


}



const printContent = async (resource, title, offset) => {
    const loadingIndicator = $("#loadingIndicator");
    const loadingBackground = $("#loadingBackground");


    loadingBackground.classList.remove("hidden");
    loadingIndicator.classList.remove("hidden");

    const contentData = await getMarvelData(resource, title, offset);
    let totalResults = 0;

    if (resource === 'comics') {
        totalResults = contentData.totalElements;
        printComic(contentData.results);
        $(".results").innerHTML = ` ${totalResults} Resultados`;
    } else if (resource === 'characters') {
        totalResults = contentData.totalElements;
        printCharacter(contentData.results);
        $(".results").innerHTML = ` ${totalResults} Resultados`;
    }


    loadingBackground.classList.add("hidden");
    loadingIndicator.classList.add("hidden");
};


const printComic = async (comics) => {
    const container = $(".containerResult");
    container.innerHTML = "";


    for (const comic of comics) {
        const comicElement = document.createElement("div");
        comicElement.classList.add("containerComic")
        comicElement.style.width = "17%"
        comicElement.style.marginLeft = "1rem"

        comicElement.innerHTML = `<div class="hoverComic h-[75%] w-[100%]">
        <img  src="${comic.thumbnail.path}.${comic.thumbnail.extension}" alt="${comic.title}" class="comic-image" data-id="${comic.id}">
        
        </div>`;
        comicElement.innerHTML += `<p class="hoverText h-[10%]">${comic.title}</p>`;
        container.appendChild(comicElement);
        comicElement.addEventListener("click", async () => {

            $(".containerResult").classList.add("hidden");
            $("#infoContainer").classList.remove("hidden");
            $("#infoContainer2").classList.remove("hidden");
            $(".results").classList.add("hidden");
            $(".result").classList.add("hidden");
            $("#conteo").classList.remove("hidden");


            const container = $(".containerResult")
            container.classList.add("hidden")
            const comicId = comic.id;
            const comicInfo = await getComicId(comicId);
            InfoContainer(comicInfo, "infoContainer");
            showCharacterComics(comicId, "infoContainer2");
        });
    }
}




const printCharacter = async (characters) => {
    const container = $(".containerResult");
    container.innerHTML = "";


    for (const character of characters) {
        const characterElement = document.createElement("div");
        characterElement.classList.add("containerCharacter")
        characterElement.style.width = "17%"
        characterElement.style.marginLeft = "1rem"
        characterElement.style.marginBottom = "7px"
        characterElement.innerHTML = `<div class="hoverImg h-[80%] w-[100%]">
            <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}" class="character-image h-[100%]" data-id="${character.id}">
        </div>`;
        characterElement.innerHTML += `<p class=" marginTop h-[20%] bg-black text-white text-center flex flex-col justify-center  mb-[2rem] hover"> ${character.name}</p>`;
        container.appendChild(characterElement);

        characterElement.addEventListener("click", async () => {

            $(".containerResult").classList.add("hidden");
            $("#infoContainer").classList.remove("hidden");
            $("#infoContainer2").classList.remove("hidden");
            $(".results").classList.add("hidden");
            $(".result").classList.add("hidden");
            $("#conteo").classList.remove("hidden");


            const container = $(".containerResult");
            container.classList.add("hidden");

            const characterId = character.id;
            const characterInfo = await getCharacterId(characterId);
            InfoContainer(characterInfo, "infoContainer");
            showComicsCharacter(characterId, "infoContainer2");
        });
    }
}


const printInfoComics = async (comics) => {
    const container = $("#infoContainer2");
    container.innerHTML = "";
    for (const comic of comics) {
        const comicElement = document.createElement("div");
        comicElement.classList.add("containerinfoComics")
        comicElement.style.width = "20%"
        comicElement.style.marginLeft = "1rem"
        comicElement.style.marginBottom = "7px"
        comicElement.innerHTML = `<div class="hoverComic h-[70%] ">   
            <img class="h-[100%] w-[100%]" src="${comic.thumbnail.path}.${comic.thumbnail.extension}" alt="${comic.title}" class="comic-image" data-id="${comic.id}">
            </div>`;
        comicElement.innerHTML += `<p class="">${comic.title}</p>`;
        container.appendChild(comicElement);
        comicElement.addEventListener("click", async () => {

            const comicId = comic.id;
            const comicInfo = await getComicId(comicId);
            InfoContainer(comicInfo, "infoContainer");
            showCharacterComics(comicId, "infoContainer2");
            scrollToInfoContainer("infoContainer");

        });
    }

}


const printInfoCharacters = (characters) => {
    const container = $("#infoContainer2");
    container.innerHTML = "";
    characters.forEach((character) => {
        const characterElement = document.createElement("div");
        characterElement.style.marginRight = "5px"
        characterElement.style.width= "20%"
        characterElement.style.marginLeft = "1rem"
        characterElement.style.marginBottom = "7px"
        characterElement.innerHTML = `<div class="hoverImg h-[90%] w-[100%]">
            <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}"class="character-image h-[100%]" data-id="${character.id}"> </div>`;
        characterElement.innerHTML += `<p class=" bg-black text-white text-center flex flex-col justify-center border-solid  border-t-red-600 hover">${character.name}</p>`;
        container.appendChild(characterElement);
    });

    document.querySelectorAll(".character-image").forEach((image) => {
        image.addEventListener("click", async () => {

            const characterId = image.dataset.id;
            const character = await getCharacterId(characterId);
            InfoContainer(character, "infoContainer");
            showComicsCharacter(characterId, "infoContainer2");
            scrollToInfoContainer("infoContainer");
        });
    });
};



const scrollToInfoContainer = (elementId) => {
    const infoContainer = $("#" + elementId);
    if (infoContainer) {
        infoContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};


const getCharacterComics = async (comicId) => {
    const endpoint = `comics/${comicId}/characters`;
    const url = `${urlBase}${endpoint}?${ts}${keyPublic}${hash}`;


    const response = await fetch(url);
    const data = await response.json();

    const characters = data.data.results;
    const totalResults = data.data.total;


    characters.forEach((character) => {
        character.numComics = character.comics.items.length;
    });

    return {
        characters: characters,
        totalResults: totalResults
    };

};

const getComicsCharacter = async (characterId) => {
    const endpoint = `characters/${characterId}/comics`;
    const url = `${urlBase}${endpoint}?${ts}${keyPublic}${hash}`;


    const response = await fetch(url);
    const data = await response.json();

    const comics = data.data.results;
    const totalResults = data.data.total;

    comics.forEach((comic) => {
        comic.numCharacters = comic.characters.items.length;
    });

    return {
        comics: comics,
        totalResults: totalResults
    };

};

const showResults = async (totalResults) => {
    const resultsElement = $("#conteo");

    if (totalResults > 0) {
        resultsElement.innerHTML = `<h3 class="my-4 text-3xl result font-bold">Personajes</h3>
        <p class="text-slate-500 mb-[2rem]">Resultados: ${totalResults}</p>`;
    } else {
        resultsElement.innerHTML = ` <h3 class="my-4 text-3xl result font-bold">Personajes</h3>
        <p class="text-slate-500 mb-[2rem]">Resultados: ${totalResults}</p>
        <p class="my-4 text-3xl result font-bold">No hay resultados</p>`;
    }
};



const showCharacterComics = async (comicId, containerId) => {
    const { characters, totalResults } = await getCharacterComics(comicId);
    printInfoCharacters(characters, containerId);
    showResults(totalResults);
};


const showComicsCharacter = async (characterId, containerId) => {
    const { comics, totalResults } = await getComicsCharacter(characterId);
    printInfoComics(comics, containerId);
    showResults(totalResults);
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






const InfoContainer = async (data) => {
    const infoContainer = $("#infoContainer");
    const loadingIndicator = $("#loadingIndicator");
    const loadingBackground = $("#loadingBackground");


    loadingBackground.classList.remove("hidden");
    loadingIndicator.classList.remove("hidden");

    infoContainer.innerHTML = "";

    const fechaPublicacion = data.dates?.find(date => date.type === 'onsaleDate')?.date || '';
    const escritor = Writer(data) || '';

    infoContainer.innerHTML = "";
    infoContainer.innerHTML += `
        <img class="w-[40%] mr-[2rem]" src="${data.thumbnail.path}.${data.thumbnail.extension}" alt="${data.title || data.name}">
        
        <div class="w-[50%]">
            <p class="font-bold  my-8 text-2xl">${data.title || data.name}</p>
            <p class="my-8">${fechaPublicacion ? `<span class="font-bold">Fecha de publicación:</span> ${formatFecha(fechaPublicacion)}` : ''}</p>
            <p class="my-8">${escritor ? `<span class="font-bold ]">Escritor:</span> ${escritor}` : ''}</p>
            <p class="my-8">${data.description ? `<span class="font-bold">Descripción:</span> ${data.description}` : ' '}</p>
        </div>
    `;


    setTimeout(() => {

        loadingBackground.classList.add("hidden");
        loadingIndicator.classList.add("hidden");
    }, 1000);
};




const navigatePage = async (resource, title, offset) => {
    let totalPages;

    if (offset === 'last') {
        const { totalPages: total } = await getMarvelData(resource, title, 0);
        currentPage = total - 1;
    } else {
        if (offset === 1) {
            const { totalPages: total } = await getMarvelData(resource, title, currentPage * limit);
            totalPages = total;
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



// --------------------------------------------EVENTOS------------------------------------------------ 

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

$("#buttonSearch").addEventListener("click", async () => {
    const resource = $("#optionPersonajes").value;
    const title = $("#tilteSearch").value;

    $("#infoContainer").classList.add("hidden");
    $("#conteo").classList.add("hidden");
    $("#infoContainer2").classList.add("hidden");
    $(".containerResult").classList.remove("hidden");
    $(".results").classList.remove("hidden");
    $(".result").classList.remove("hidden");

    currentPage = 0;
    updatePageNumber();
    await printContent(resource, title, currentPage * limit);
    navigatePage(resource, title, 0);

})
$("#prev").addEventListener("click", () => navigatePage($("#optionPersonajes").value, $("#tilteSearch").value, -1));
$("#next").addEventListener("click", () => navigatePage($("#optionPersonajes").value, $("#tilteSearch").value, 1));
$("#first").addEventListener("click", () => navigatePage($("#optionPersonajes").value, $("#tilteSearch").value, -currentPage));
$("#last").addEventListener("click", () => {
    const resource = $("#optionPersonajes").value;
    const title = $("#tilteSearch").value;
    navigatePage(resource, title, 'last');
});




navigatePage("comics", "", 0);