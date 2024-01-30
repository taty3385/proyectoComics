// // 1) url base 
// // 2) TS(time start)
// // 3) public key 
// // 4) hash -MD5( se hace x el generador)
// // http://gateway.marvel.com/v1/public/comics?ts=1&apikey=1234&hash=ffd275c5130566a2916217b101f26150
// //  ->         URL BASE            <- RECURSO- TS - APY PUBLICA- HASH  


// const $ = (selector) => document.querySelector(selector);

// const urlBase = "https://gateway.marvel.com/v1/public/";
// const ts = "ts=1";
// const keyPublic = "&apikey=550c8159913c619584d39b76b50c69f6";
// const hash = "&hash=241d1f4c5068b3fc5cf2eb46db150f01";
// const limit = 20;

// const offset = 0
// let currentPage = 0;
// let currentOrder = "asc";



// const getMarvelData = async (resource, title, offset) => {
//     let validationTitle = title ? `&${resource === "characters" ? "name" : "title"}=${title}` : "";
//     let sortOrder = currentOrder === "asc" ? "" : "-";
//     let orderField;

//     if (currentOrder === "newest" || currentOrder === "oldest") {
//         sortOrder = currentOrder === "newest" ? "-" : "";
//         orderField = "modified";
//     } else {
//         orderField = resource === "characters" ? "name" : "title";
//     }

//     const url = `${urlBase}${resource}?${ts}${keyPublic}${validationTitle}${hash}&offset=${offset}&limit=${limit}&orderBy=${sortOrder}${orderField}`;
//     const response = await fetch(url);
//     const data = await response.json();

//     if (data && data.data && data.data.results) {
//         const totalElements = data.data.total || 0;
//         const totalPages = Math.ceil(totalElements / limit);

//         return {
//             results: data.data.results,
//             totalElements: totalElements,
//             totalPages: totalPages
//         };
//     } else {

//         return {
//             results: [],
//             totalElements: 0,
//             totalPages: 0
//         };
//     }

// };



// const getComicId = async (comicId) => {
//     const endpoint = `comics/${comicId}`;
//     const url = `${urlBase}${endpoint}?${ts}${keyPublic}${hash}`;

//     try {
//         const response = await fetch(url);
//         const data = await response.json();
//         return data.data.results[0];
//     } catch (error) {
//         console.error(`Error al obtener la información del cómic con comicId ${comicId}:`, error);
//         throw error;
//     }
// };


// const getCharacterId = async (characterId) => {
//     const endpoint = `characters/${characterId}`;
//     const url = `${urlBase}${endpoint}?${ts}${keyPublic}${hash}`;

//     try {
//         const response = await fetch(url);
//         const data = await response.json();
//         return data.data.results[0];
//     } catch (error) {
//         console.error(`Error al obtener la información del personaje con characterId ${characterId}:`, error);
//         throw error;
//     }
// };



// const printContent = async (resource, title, offset) => {
//     const contentData = await getMarvelData(resource, title, offset);
//         if (resource === 'comics') {
//             printComic(contentData.results);
//         } else if (resource === 'characters') {
//             printCharacter(contentData.results);
//         }
//     };

// const formatFecha = (fecha) => {
//     const fechas = new Date(fecha);
//     const dia = fechas.getDate();
//     const mes = fechas.getMonth() + 1;
//     const año = fechas.getFullYear();

//     return `${dia}/${mes}/${año}`;
// };

// const Writer = (comic) => {
//     if (comic && comic.creators && comic.creators.items && comic.creators.items.length > 0) {
//         const writer = comic.creators.items.find((creator) => creator.role.toLowerCase() === 'writer');
//         return writer ? writer.name : ' ';
//     } else {
//         return '';
//     }
// };
// const InfoContainer = (data) => {
//     const infoContainer = $("#infoContainer");
//     infoContainer.innerHTML = "";

//     const fechaPublicacion = data.dates?.find(date => date.type === 'onsaleDate')?.date || '';
//     const escritor = Writer(data) || '';

//     infoContainer.innerHTML = "";
//     infoContainer.innerHTML += `
//         <img  class="w-[40%] mr-[2rem]"src="${data.thumbnail.path}.${data.thumbnail.extension}" alt="${data.title || data.name}">

//         <div class="w-[50%]">
//             <p class="font-bold  my-8 text-2xl">${data.title || data.name}</p>
//             <p class="my-8">${fechaPublicacion ? `<span class="font-bold">Fecha de publicación:</span> ${formatFecha(fechaPublicacion)}` : ''}</p>
//             <p class="my-8">${escritor ? `<span class="font-bold ]">Escritor:</span> ${escritor}` : ''}</p>
//             <p class="my-8">${data.description ? `<span class="font-bold">Descripción:</span> ${data.description}` : ' '}</p>
//         </div>
//     `;

//    ;
// };

// const printComic = async (comics) => {
//     const container = $(".containerResult");
//      container.innerHTML = "";

//             // Itera sobre los cómics y agrega la información al contenedor
//             for (const comic of comics) {
//                 const comicElement = document.createElement("div");
//                 comicElement.style.width="17%"
//                comicElement.style.marginLeft = "1rem"
//                 comicElement.innerHTML =`<div class="hoverComic h-[80%] w-[100%]">
//                 <img  src="${comic.thumbnail.path}.${comic.thumbnail.extension}" alt="${comic.title}"class="comic-image" data-id="${comic.id}">

//                 </div>`;
//                 comicElement.innerHTML += `<p class="hoverText">${comic.title}</p>`;
//                 container.appendChild(comicElement);

//                 // Agregar eventos de clic a las imágenes de cómics
//                 comicElement.addEventListener("click", async () => {
//                     const container = $(".containerResult")
//                     container.classList.add("hidden")
//                     const comicId = comic.id;
//                     const comicInfo = await getComicId(comicId);
//                     InfoContainer(comicInfo, "infoContainer");
//                     mostrarPersonajesDeComic(comicId, "infoContainer2");
//                 });
//             }

//         }

//         const printCharacter = async (characters) => {

//             const container = $(".containerResult");
//              container.innerHTML = "";

//             // Itera sobre los personajes y agrega la información al contenedor
//             for (const character of characters) {
//                 const characterElement = document.createElement("div");
//                 characterElement.innerHTML = `<div class="hoverImg h-[80%] w-[100%]"><img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}"class="character-image h-[100%] w-[100%]" data-id="${character.id}"></div>`;
//                 characterElement.innerHTML += `<p class="h-[20%] bg-black text-white text-center flex flex-col justify-center border-solid border border-t-red-800 mb-[1rem] hover"> ${character.name}</p>`;
//                 container.appendChild(characterElement);

//                 // Agregar eventos de clic a las imágenes de personajes
//                 characterElement.addEventListener("click", async () => {
//                     const container = $(".containerResult")
//                     container.classList.add("hidden")
//                     const characterId = character.id;
//                     const characterInfo = await getCharacterId(characterId);
//                     InfoContainer(characterInfo, "infoContainer");
//                     mostrarComicsDePersonaje(characterId, "infoContainer2");
//                 });
//             }

//         }


//         const printInfoComics = async (comics) => {
//             const container = $("#infoContainer2");

//             // Limpia el contenido previo
//             container.innerHTML = "";

//             // Itera sobre los cómics y agrega la información al contenedor
//             for (const comic of comics) {
//                 const comicElement = document.createElement("div");
//                 comicElement.innerHTML = `<div class="hoverComic h-[80%] w-[100%]">   
//                 <img class="h-[80%] w-[100%]" src="${comic.thumbnail.path}.${comic.thumbnail.extension}" alt="${comic.title}" class="comic-image" data-id="${comic.id}">
//                 </div>`;
//                 comicElement.innerHTML += `<p>Nombre del cómic: ${comic.title}</p>`;
//                 container.appendChild(comicElement);

//                 // Agregar eventos de clic a las imágenes de cómics
//                 comicElement.addEventListener("click", async () => {

//                     const comicId = comic.id;
//                     const comicInfo = await getComicId(comicId);
//                     InfoContainer(comicInfo, "infoContainer");
//                     mostrarPersonajesDeComic(comicId, "infoContainer2");

//                 });
//             }

//         }



//         const printInfoCharacters = (characters) => {
//             const container = $("#infoContainer2");
//             container.innerHTML = "";

//             // Itera sobre los personajes y agrega la información al contenedor
//             characters.forEach((character) => {
//                 const characterElement = document.createElement("div");
//                 characterElement.innerHTML = `<div class="hoverImg h-[90%] w-[100%]">
//                 <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}"class="character-image h-[100%]" data-id="${character.id}"> </div>`;
//                 characterElement.innerHTML += `<p class="h-[20%] bg-black text-white text-center flex flex-col justify-center border-solid  border-t-red-600 hover">${character.name}</p>`;
//                 container.appendChild(characterElement);
//             });

//             // Agregar eventos de clic a las imágenes de personajes
//             document.querySelectorAll(".character-image").forEach((image) => {
//                 image.addEventListener("click", async () => {

//                     const characterId = image.dataset.id;
//                     const character = await getCharacterId(characterId);
//                     InfoContainer(character, "infoContainer");
//                     mostrarComicsDePersonaje(characterId, "infoContainer2");
//                 });
//             });
//         };


//     // TRAIGO LA INFORMACION DE PERSONAJES  Y COMICS
//     const getCharactersComic = async (comicId) => {
//         const endpoint = `comics/${comicId}/characters`;
//         const url = `${urlBase}${endpoint}?${ts}${keyPublic}${hash}`;
//         const response = await fetch(url);
//         const data = await response.json();
//         return data.data.results;


//     }

//     const getComicsCharacters = async (characterId) => {
//         const endpoint = `characters/${characterId}/comics`;
//         const url = `${urlBase}${endpoint}?${ts}${keyPublic}${hash}`;
//         const response = await fetch(url);
//         const data = await response.json();
//         return data.data.results;



//     };
//     const mostrarResultados = async (totalResults) => {
//         const resultsElement = $("#conteo");

//         if (totalResults > 0) {
//             resultsElement.innerHTML = `<h3 class="my-4 text-3xl result font-bold">Personajes</h3>
//             <p class="text-slate-500 mb-[2rem]">Resultados: ${totalResults}</p>`;
//         } else {
//             resultsElement.innerHTML = ` <h3 class="my-4 text-3xl result font-bold">Personajes</h3>
//             <p class="text-slate-500 mb-[2rem]">Resultados: ${totalResults}</p>
//             <p class="my-4 text-3xl result font-bold">No hay resultados</p>`;
//         }
//     };


//     const mostrarComicsDePersonaje = async (characterId, containerId) => {
//         const { comics, totalResults } = await getComicsCharacters(characterId);
//         printInfoComics(comics, containerId);
//         mostrarResultados(totalResults);
//     };


//     const mostrarPersonajesDeComic = async (comicId, containerId) => {
//         const { characters, totalResults } = await getCharactersComic(comicId);
//         printInfoCharacters(characters, containerId);
//         showresults(totalResults);




// }


//     const navigatePage = async (resource, title, offset) => {

//         if (offset === 'last') {
//             const { totalPages } = await getMarvelData(resource, title, 0);
//             currentPage = totalPages - 1;
//         } else {
//             if (offset === 1) {
//                 const { totalPages } = await getMarvelData(resource, title, currentPage * limit);

//                 if (currentPage + 1 >= totalPages) {
//                     return;
//                 }
//             }

//             if (offset === -1) {
//                 if (currentPage === 0) {
//                     return;
//                 }
//             }

//             currentPage += offset;
//         }

//         updatePageNumber();
//         await printContent(resource, title, currentPage * limit);

//     };

//     const updatePageNumber = () => {
//         $("#currentPage").textContent = currentPage + 1;
//     };





//     $("#tilteSearch").addEventListener("input", () => {
//         currentPage = 0;
//         updatePageNumber();

//     });

//     $("#optionPersonajes").addEventListener("change", () => {
//         currentPage = 0;
//         updatePageNumber();

//     });

//     $("#sortOrder").addEventListener("change", () => {
//         currentOrder = $("#sortOrder").value;
//         currentPage = 0;
//         updatePageNumber();

//     });
//     $("#buttonSearch").addEventListener("click", () => {
//         const resource = $("#optionPersonajes").value;
//         const title = $("#tilteSearch").value;
//         currentPage = 0;
//         updatePageNumber();
//         navigatePage(resource, title, 0);
//     });
//     $("#prev").addEventListener("click", () => navigatePage($("#optionPersonajes").value, $("#tilteSearch").value, -1));
//     $("#next").addEventListener("click", () => navigatePage($("#optionPersonajes").value, $("#tilteSearch").value, 1));
//     $("#first").addEventListener("click", () => navigatePage($("#optionPersonajes").value, $("#tilteSearch").value, -currentPage));
//     $("#last").addEventListener("click", () => {
//         const resource = $("#optionPersonajes").value;
//         const title = $("#tilteSearch").value;
//         navigatePage(resource, title, 'last');
//     });


//     navigatePage("comics", "", 0);

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
    console.log(data.data.total);

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
    const contentData = await getMarvelData(resource, title, offset);
    if (resource === 'comics') {
        printComic(contentData.results);
    } else if (resource === 'characters') {
        printCharacter(contentData.results);
    }
};



const printComic = async (comics) => {
    const containerComics = $(".containerResult");
    containerComics.innerHTML = "";


    for (const comic of comics) {
        const comicElement = document.createElement("div");
        comicElement.style.width = "17%"
        comicElement.style.marginLeft = "1rem"
        comicElement.innerHTML = `<div class="hoverComic h-[80%] w-[100%]">
            <img  src="${comic.thumbnail.path}.${comic.thumbnail.extension}" alt="${comic.title}"class="comic-image" data-id="${comic.id}">
            
            </div>`;
        comicElement.innerHTML += `<p class="hoverText">${comic.title}</p>`;
        containerComics.appendChild(comicElement);


        comicElement.addEventListener("click", async () => {
            const containerComics = $(".containerResult")
            containerComics.classList.add("hidden")
            const comicId = comic.id;
            const comicInfo = await getComicId(comicId);
            InfoContainer(comicInfo, "infoContainer");
            showCharacterComics(comicId, "infoContainer2");
        });
    }

}

const printCharacter = async (characters) => {

    const containerCharacter = $(".containerResult");
    containerCharacter.innerHTML = "";


    for (const character of characters) {
        const characterElement = document.createElement("div");
        characterElement.style.width = "17%"
        characterElement.style.marginLeft = "1rem"
        characterElement.innerHTML = `<div class="hoverImg h-[80%] w-[100%]"><img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}"class="character-image h-[100%] w-[100%]" data-id="${character.id}"></div>`;
        characterElement.innerHTML += `<p class="h-[20%] bg-black text-white text-center flex flex-col justify-center border-solid border border-t-red-800 mb-[1rem] hover"> ${character.name}</p>`;
        containerCharacter.appendChild(characterElement);

  
        characterElement.addEventListener("click", async () => {
            const containerCharacter = $(".containerResult")
            containerCharacter.classList.add("hidden")
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
        comicElement.innerHTML = `<div class="hoverComic h-[80%] w-[100%]">   
            <img class="h-[80%] w-[100%]" src="${comic.thumbnail.path}.${comic.thumbnail.extension}" alt="${comic.title}" class="comic-image" data-id="${comic.id}">
            </div>`;
        comicElement.innerHTML += `<p>Nombre del cómic: ${comic.title}</p>`;
        container.appendChild(comicElement);


        comicElement.addEventListener("click", async () => {

            const comicId = comic.id;
            const comicInfo = await getComicId(comicId);
            InfoContainer(comicInfo, "infoContainer");
            showCharacterComics(comicId, "infoContainer2");

        });
    }

}


const printInfoCharacters = (characters) => {
    const container = $("#infoContainer2");
    container.innerHTML = "";
    characters.forEach((character) => {
        const characterElement = document.createElement("div");
        characterElement.innerHTML = `<div class="hoverImg h-[90%] w-[100%]">
            <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}"class="character-image h-[100%]" data-id="${character.id}"> </div>`;
        characterElement.innerHTML += `<p class="h-[20%] bg-black text-white text-center flex flex-col justify-center border-solid  border-t-red-600 hover">${character.name}</p>`;
        container.appendChild(characterElement);
    });

    document.querySelectorAll(".character-image").forEach((image) => {
        image.addEventListener("click", async () => {

            const characterId = image.dataset.id;
            const character = await getCharacterId(characterId);
            InfoContainer(character, "infoContainer");
            showComicsCharacter(characterId, "infoContainer2");
        });
    });
};




const getCharacterComics = async (comicId) => {
    const endpoint = `comics/${comicId}/characters`;
    const url = `${urlBase}${endpoint}?${ts}${keyPublic}${hash}`;


    const response = await fetch(url);
    const data = await response.json();

    const characters = data.data.results;
    const totalResults = data.data.total;

    // Agregar información adicional sobre el número de cómics
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




const InfoContainer = (data) => {
    const infoContainer = $("#infoContainer");
    infoContainer.innerHTML = "";

    const fechaPublicacion = data.dates?.find(date => date.type === 'onsaleDate')?.date || '';
    const escritor = Writer(data) || '';

    infoContainer.innerHTML = "";
    infoContainer.innerHTML += `
        <img  class="w-[40%] mr-[2rem]"src="${data.thumbnail.path}.${data.thumbnail.extension}" alt="${data.title || data.name}">
        
        <div class="w-[50%]">
            <p class="font-bold  my-8 text-2xl">${data.title || data.name}</p>
            <p class="my-8">${fechaPublicacion ? `<span class="font-bold">Fecha de publicación:</span> ${formatFecha(fechaPublicacion)}` : ''}</p>
            <p class="my-8">${escritor ? `<span class="font-bold ]">Escritor:</span> ${escritor}` : ''}</p>
            <p class="my-8">${data.description ? `<span class="font-bold">Descripción:</span> ${data.description}` : ' '}</p>
        </div>
    `;

    ;
};






const navigatePage = async (resource, title, offset) => {
    let totalPages; // Define la variable totalPages aquí para que esté disponible en todo el ámbito de la función navigatePage

    if (offset === 'last') {
        const { totalPages: total } = await getMarvelData(resource, title, 0);
        currentPage = total - 1;
    } else {
        if (offset === 1) {
            const { totalPages: total } = await getMarvelData(resource, title, currentPage * limit);
            totalPages = total; // Asigna el valor de total a totalPages
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