// 1) url base 
// 2) TS(time start)
// 3) public key 
// 4) hash -MD5( se hace x el generador)
// http://gateway.marvel.com/v1/public/comics?ts=1&apikey=1234&hash=ffd275c5130566a2916217b101f26150
//  ->         URL BASE            <- RECURSO- TS - APY PUBLICA- HASH  

// const $ = (selector) => document.querySelector(selector);

// const urlBase = "http://gateway.marvel.com/v1/public/";
// const ts = "ts=1";
// const keyPublic = "&apikey=550c8159913c619584d39b76b50c69f6";
// const hash = "&hash=241d1f4c5068b3fc5cf2eb46db150f01";

// const getMarvelData = async (resource) => {
//     const url = `${urlBase}${resource}?${ts}${keyPublic}${hash}`;
//     const response = await fetch(url);
//     const data = await response.json();
//     console.log(data);
// }
// getMarvelData("comics")



// const printComic = (comicsData) => {
//     $(".containerResult").innerHTML = "";

//     if (comicsData.length > 0) {
//         for (let comic of comicsData) {
//             const thumbnail = `${comic.thumbnail}.${comic.thumbnail.extension}`;
//             const title = comic.title;
//             $(".containerResult").innerHTML += `<div>
//                 <img src="${thumbnail}" alt="${title}">
//                 <p>${title}</p>
//             </div>`;
//         }
//     }
// };

// const printCharacter = (charactersData) => {
//     $(".containerResult").innerHTML = "";

//     if (charactersData.length > 0) {
//         for (let character of charactersData) {
//             const thumbnail = `${character.thumbnail}.${character.thumbnail.extension}`;
//             const name = character.name;
//             $(".containerResult").innerHTML += `<div>
//                 <img class="h-[80%] w-[100%] " src="${thumbnail}" alt="${name}">
//                 <p class="h-[20%] bg-black text-white text-center flex flex-col justify-center border-solid border-4 border-t-red-600 ">${name}</p>
//             </div>`;
//         }
//     }
// };

// const printContent = async (resource) => {

//     const contentData = await getMarvelData(resource);

//     if (resource === 'comics') {
//         printComic(contentData.results);
//     } else if (resource === 'characters') {
//         printCharacter(contentData.results);
//     }
// };



// inicializacion de aplicacion 

// printComic("comics")


// const $ = (selector) => document.querySelector(selector);

// const urlBase = "http://gateway.marvel.com/v1/public/";
// const ts = "ts=1";
// const keyPublic = "&apikey=550c8159913c619584d39b76b50c69f6";
// const hash = "&hash=241d1f4c5068b3fc5cf2eb46db150f01";

// const getMarvelData = async (resource) => {
//     const url = `${urlBase}${resource}?${ts}${keyPublic}${hash}`;

//     try {
//         const response = await fetch(url);

//         if (!response.ok) {
//             throw new Error(`Error al obtener datos. Código de estado: ${response.status}`);
//         }

//         const data = await response.json();

//         return data.data.results; // Asumiendo que los resultados están en la propiedad 'results'
//     } catch (error) {
//         console.error("Error:", error.message);
//         return [];
//     }
// };

// const printComic = async () => {
//     try {
//         const comicsData = await getMarvelData("comics");

//         $(".containerResult").innerHTML = "";

//         if (comicsData && comicsData.length > 0) {
//             for (let comic of comicsData) {
//                 const thumbnail = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
//                 const title = comic.title;

//                 $(".containerResult").innerHTML += `<div>
//                     <img class="h-[80%] w-[100%]" src="${thumbnail}" alt="${title}">
//                     <p>${title}</p>
//                 </div>`;
//             }
//         } else {
//             $(".containerResult").innerHTML = "No se encontraron cómics.";
//         }
//     } catch (error) {
//         console.error("Error al imprimir cómics:", error.message);
//     }
// };

// const printCharacter = async (charactersData) => {

//     const charactersData = await getMarvelData("character");
//     $(".containerResult").innerHTML = "";


//         for (let character of charactersData) {
//             const thumbnail = `${character.thumbnail}.${character.thumbnail.extension}`;
//             const name = character.name;
//             $(".containerResult").innerHTML += `<div>
//                 <img class="h-[80%] w-[100%] " src="${thumbnail}" alt="${name}">
//                 <p class="h-[20%] bg-black text-white text-center flex flex-col justify-center border-solid border-4 border-t-red-600 ">${name}</p>
//             </div>`;
//         }

// };

// const printContent = async (resource) => {
// const contentData = await getMarvelData(resource);

//     if (resource === 'comics') {
//         printComic(contentData.results);
//     } else if (resource === 'characters') {
//         printCharacter(contentData.results);
//     }
// };

// // Llamada a la función para imprimir cómics
// printComic();


// $("#optionPersonajes").addEventListener("change", () => {
//     const valueOption=$("#optionPersonajes").value
//     printContent(valueOption)
// })


const $ = (selector) => document.querySelector(selector);

const urlBase = "http://gateway.marvel.com/v1/public/";
const ts = "ts=1";
const keyPublic = "&apikey=550c8159913c619584d39b76b50c69f6";
const hash = "&hash=241d1f4c5068b3fc5cf2eb46db150f01";

const getMarvelData = async (resource) => {
    const url = `${urlBase}${resource}?${ts}${keyPublic}${hash}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error al obtener datos. Código de estado: ${response.status}`);
        }

        const data = await response.json();
        return data.data.results; // Asumiendo que los resultados están en la propiedad 'results'
    } catch (error) {
        console.error("Error:", error.message);
        return [];
    }
};

const printComic = async () => {
    const comicsData = await getMarvelData("comics");
        $(".containerResult").innerHTML = "";

        if (comicsData && comicsData.length > 0) {
            for (let comic of comicsData) {
                const thumbnail = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
                const title = comic.title;

                $(".containerResult").innerHTML += `<div>
                    <img class="h-[80%] w-[100%]" src="${thumbnail}" alt="${title}">
                    <p>${title}</p>
                </div>`;
            }
        } else {
            $(".containerResult").innerHTML = "No se encontraron cómics.";
        }
    
};

const printCharacter = async () => {
    const charactersData = await getMarvelData("characters");
    $(".containerResult").innerHTML = "";
    for (let character of charactersData) {
        const thumbnail = `${character.thumbnail.path}.${character.thumbnail.extension}`;
        const name = character.name;

        $(".containerResult").innerHTML += `<div>
                <img class="h-[80%] w-[100%]" src="${thumbnail}" alt="${name}">
                <p class="h-[20%] bg-black text-white text-center flex flex-col justify-center border-solid border-4 border-t-red-600">${name}</p>
            </div>`;
    }

};

const printContent = async (resource) => {
    if (resource === 'comics' || resource === 'characters') {
        const contentData = await getMarvelData(resource);

        if (resource === 'comics') {
            printComic(contentData);
        } else if (resource === 'characters') {
            printCharacter(contentData);
        }
    } else {
        console.error("Tipo de recurso no válido.");
    }
};

// Llamada a la función para imprimir cómics
printContent('comics');

$("#optionPersonajes").addEventListener("change", () => {
    const valueOption = $("#optionPersonajes").value;
    printContent(valueOption);
});

