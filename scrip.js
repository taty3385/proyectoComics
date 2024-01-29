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


const printComic = async (comics) => {
    const container = $(".containerResult");
     container.innerHTML = "";
    
            // Itera sobre los cómics y agrega la información al contenedor
            for (const comic of comics) {
                const comicElement = document.createElement("div");
    
                comicElement.innerHTML =`<div class="hoverComic h-[80%] w-[100%]">
                <img  src="${comic.thumbnail.path}.${comic.thumbnail.extension}" alt="${comic.title}"class="comic-image" data-id="${comic.id}"></div>`;
               
                comicElement.innerHTML += `<p class="hoverText">${comic.title}</p>`;
                container.appendChild(comicElement);
    
           
                comicElement.addEventListener("click", async () => {
                    const container = $(".containerResult")
                    container.classList.add("hidden")
                    const comicId = comic.id;
                    const comicInfo = await getComicId(comicId);
                    InfoContainer(comicInfo, "infoContainer");
                   
                });
            }
       
        }

const printCharacter = async (characters) => {
    
    const container = $(".containerResult");
     container.innerHTML = "";

  
    for (const character of characters) {
        const characterElement = document.createElement("div");
        characterElement.innerHTML = `<div class="hoverImg h-[80%] w-[100%]"><img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}"class="character-image h-[100%] w-[100%]" data-id="${character.id}"></div>`;
        characterElement.innerHTML += `<p class="h-[20%] bg-black text-white text-center flex flex-col justify-center border-solid border border-t-red-800 mb-[1rem] hover"> ${character.name}</p>`;
        container.appendChild(characterElement);

     
        characterElement.addEventListener("click", async () => {
            const container = $(".containerResult")
            container.classList.add("hidden")
            const characterId = character.id;
            const characterInfo = await getCharacterId(characterId);
            InfoContainer(characterInfo, "infoContainer");
         
        });
    }

}
    // TRAIGO LA INFORMACION DE PERSONAJES  Y COMICS
    const getCharactersComic = async (comicId) => {
        const endpoint = `comics/${comicId}/characters`;
        const url = `${urlBase}${endpoint}?${ts}${keyPublic}${hash}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.data.results;


    }

    const getComicsCharacters = async (characterId) => {
        const endpoint = `characters/${characterId}/comics`;
        const url = `${urlBase}${endpoint}?${ts}${keyPublic}${hash}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.data.results;

    };

    const InfoContainer = (data) => {
        const infoContainer = $("#infoContainer");
        infoContainer.innerHTML = "";
    
        const fechaPublicacion = data.dates?.find(date => date.type === 'onsaleDate')?.date || '';
        const escritor = Writer(data) || '';
    
        infoContainer.innerHTML = "";
        infoContainer.innerHTML += `
            <img  class="w-[40%] mr-[2rem]"src="${data.thumbnail.path}.${data.thumbnail.extension}" alt="${data.title || data.name}">
            
            <div class="w-[50%]">
                <p class="font-bold">${data.title || data.name}</p>
                <p>${fechaPublicacion ? `<span class="font-bold">Fecha de publicación:</span> ${formatFecha(fechaPublicacion)}` : ''}</p>
                <p>${escritor ? `<span class="font-bold">Escritor:</span> ${escritor}` : ''}</p>
                <p>${data.description ? ` <span class="font-bold">Descripción:</span> ${data.description}` : ' '}</p>
            </div>
        `;
    
       ;
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
