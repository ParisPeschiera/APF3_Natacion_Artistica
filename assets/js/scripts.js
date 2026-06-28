
// 1. MENÚ HAMBURGUESA
// Cuando la pantalla es pequeña (≤768px), el menú se oculta y aparece el botón de tres rayitas. Al hacer clic, el menú
// se muestra o se oculta alternando la clase "activo".

const botonMenu   = document.querySelector(".menu-toggle");
const navPrincipal = document.querySelector(".nav-principal");

// Solo hacemos algo si los dos elementos existen en la página
if (botonMenu && navPrincipal) {

    botonMenu.addEventListener("click", function () {
        // Alternamos la clase "activo" en el menú para mostrarlo u ocultarlo
        navPrincipal.classList.toggle("activo");

        // También alternamos la clase en el botón para poder animar las rayitas
        botonMenu.classList.toggle("activo");

        // Actualizamos el atributo de accesibilidad para lectores de pantalla
        const estaAbierto = navPrincipal.classList.contains("activo");
        botonMenu.setAttribute("aria-expanded", estaAbierto);
    });

    // Si el usuario hace clic en un enlace del menú, lo cerramos automáticamente
    // Esto es útil en móvil para que el menú no quede abierto después de navegar
    const enlacesMenu = navPrincipal.querySelectorAll("a");
    enlacesMenu.forEach(function (enlace) {
        enlace.addEventListener("click", function () {
            navPrincipal.classList.remove("activo");
            botonMenu.classList.remove("activo");
            botonMenu.setAttribute("aria-expanded", false);
        });
    });
}



// 2. BOTÓN SCROLL-UP (Volver arriba)
// El botón flota en la esquina inferior derecha y solo aparece cuando el usuario ha bajado más de 300px. Al hacer clic,
// la página sube suavemente al inicio.

const botonScrollUp = document.querySelector(".scroll-up");

if (botonScrollUp) {

    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            // Si bajamos más de 300px, se muestra el botón
            botonScrollUp.classList.add("visible");
        } else {
            // Si volvemos arriba, se oculta
            botonScrollUp.classList.remove("visible");
        }
    });

    // Al hacer clic, subimos suavemente al tope de la página
    botonScrollUp.addEventListener("click", function (evento) {
        evento.preventDefault(); // Evitamos que el enlace salte bruscamente
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// 3. CALCULADORA DE CATEGORÍA DEPORTIVA
// El usuario ingresa su nombre, edad y género.
// La calculadora determina a qué categoría de natación artística pertenece, siguiendo el reglamento oficial de la FDNDA.


// Tabla de categorías según el reglamento oficial
const CATEGORIAS = [
    { nombre: "Infantil D",       minMujer: 0,  maxMujer: 8,  minHombre: 0,  maxHombre: 8  },
    { nombre: "Infantil A",       minMujer: 9,  maxMujer: 10, minHombre: 9,  maxHombre: 10 },
    { nombre: "Infantil B",       minMujer: 11, maxMujer: 12, minHombre: 11, maxHombre: 12 },
    { nombre: "Juvenil",          minMujer: 13, maxMujer: 15, minHombre: 13, maxHombre: 16 },
    { nombre: "Junior",           minMujer: 15, maxMujer: 19, minHombre: 15, maxHombre: 20 },
    { nombre: "Senior / Absoluta",minMujer: 15, maxMujer: 99, minHombre: 15, maxHombre: 99 },
    { nombre: "Master",           minMujer: 25, maxMujer: 99, minHombre: 25, maxHombre: 99 }
];

// Esta función recibe los datos de la edad y el género y devuelve todas las categorías a las que pertenece
// (un deportista puede pertenecer a más de una categoría al mismo tiempo, como Junior y Senior)
function obtenerCategorias(edad, genero) {
    let resultados = [];

    CATEGORIAS.forEach(function (cat) {
        let min = (genero === "mujer") ? cat.minMujer : cat.minHombre;
        let max = (genero === "mujer") ? cat.maxMujer : cat.maxHombre;

        if (edad >= min && edad <= max) {
            resultados.push(cat.nombre);
        }
    });

    return resultados;
}

// Esta función valida que el campo de nombre no esté vacío
function validarNombre(valor) {
    let texto = valor.trim();
    if (texto === "" || texto === null) {
        return "El nombre no puede estar vacío.";
    }
    if (texto.length < 2) {
        return "El nombre debe tener al menos 2 caracteres.";
    }
    return ""; // Sin errores
}

// Esta función valida que la edad sea un número entero entre 1 y 99
function validarEdad(valor) {
    let texto = valor.trim();

    if (texto === "") {
        return "La edad no puede estar vacía.";
    }

    // Verifiacion de que el numero ingresado es un entero
    if (!/^\d+$/.test(texto)) {
        return "Ingresa solo números enteros positivos.";
    }

    let edad = parseInt(texto, 10);

    if (edad < 1 || edad > 99) {
        return "La edad debe estar entre 1 y 99 años.";
    }

    return ""; // Sin errores
}

// Esta función limpia todos los mensajes de error y el resultado anterior
function limpiarCalculadora() {
    let ids = ["error-nombre", "error-edad", "error-genero", "error-general", "resultado-categoria"];
    ids.forEach(function (id) {
        let elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = "";
            elemento.className = elemento.className.replace(/\bresultado-\S+/g, "").trim();
        }
    });
}

// Función principal que se ejecuta cuando el usuario hace clic en "Calcular Categoria"
function calcularCategoria() {

    // Limpiamos resultados y errores anteriores antes de empezar
    limpiarCalculadora();

    // Leer los datos ingresados en el formulario
    let nombreTexto = document.getElementById("calc-nombre").value;
    let edadTexto   = document.getElementById("calc-edad").value;
    let generoValor = document.getElementById("calc-genero").value;

    // Validar que cada campo no tenga errores
    let errorNombre = validarNombre(nombreTexto);
    let errorEdad   = validarEdad(edadTexto);
    let errorGenero = (generoValor === "") ? "Selecciona un género." : "";

    let hayError = false;

    if (errorNombre !== "") {
        document.getElementById("error-nombre").textContent = errorNombre;
        hayError = true;
    }
    if (errorEdad !== "") {
        document.getElementById("error-edad").textContent = errorEdad;
        hayError = true;
    }
    if (errorGenero !== "") {
        document.getElementById("error-genero").textContent = errorGenero;
        hayError = true;
    }

    // Si hay algún error, mostramos el mensaje general y paramos aquí
    if (hayError) {
        document.getElementById("error-general").textContent =
            "Corrige los errores antes de calcular.";
        return;
    }

    // Calculamos la edad como número entero y el género como texto
    let edad     = parseInt(edadTexto, 10);
    let genero   = generoValor; // "mujer" o "hombre"
    let nombre   = nombreTexto.trim();

    let categorias = obtenerCategorias(edad, genero);

    // Mostramos el resultado
    let divResultado = document.getElementById("resultado-categoria");

    // Construimos el HTML del resultado con toda la información
    let generoTexto = (genero === "mujer") ? "Mujer" : "Hombre";
    let categoriasHTML = categorias.map(function (c) {
        return "<span class=\"badge-categoria\">" + c + "</span>";
    }).join(" ");

    divResultado.innerHTML =
        "<p class=\"resultado-atleta\"><i class=\"fa-solid fa-user\"></i> " + nombre + "</p>" +
        "<p class=\"resultado-datos\">" +
            "<span><i class=\"fa-solid fa-venus-mars\"></i> " + generoTexto + "</span>" +
            "<span><i class=\"fa-solid fa-cake-candles\"></i> " + edad + " años</span>" +
        "</p>" +
        "<p class=\"resultado-etiqueta\">Categorías asignadas:</p>" +
        "<div class=\"resultado-badges\">" + categoriasHTML + "</div>" +
        (categorias.length > 1
            ? "<p class=\"resultado-nota\">Este atleta puede competir en más de una categoría según el reglamento vigente.</p>"
            : "");

    divResultado.className = "calculadora-resultado resultado-exito";

    // Log de depuración en consola
    console.log("Nombre: " + nombre);
    console.log("Edad: " + edad);
    console.log("Género: " + genero);
    console.log("Categorías: " + categorias.join(", "));
}
