// --- DATOS INICIALES ---
// Lista completa de jugadores disponibles. Puedes añadir, quitar o modificar jugadores aquí.
const todosLosJugadores = [
    { nombre: "Chalu", edad: 46 },
    { nombre: "Chus", edad: 54 },
    { nombre: "David", edad: 49 },
    { nombre: "Javier", edad: 53 },
    { nombre: "Josito", edad: 42 },
    { nombre: "Magin", edad: 54 },
    { nombre: "Mateo", edad: 45 },
    { nombre: "More", edad: 44 },
    { nombre: "Nano", edad: 40 },
    { nombre: "Nico", edad: 50 },
    { nombre: "Toño", edad: 56 }
];

// Estado inicial: formamos las 5 primeras parejas con los 10 primeros jugadores.
let parejas = [
    { jugador1: todosLosJugadores[0], jugador2: todosLosJugadores[1], sumaEdades: 0 },
    { jugador1: todosLosJugadores[2], jugador2: todosLosJugadores[3], sumaEdades: 0 },
    { jugador1: todosLosJugadores[4], jugador2: todosLosJugadores[5], sumaEdades: 0 },
    { jugador1: todosLosJugadores[6], jugador2: todosLosJugadores[7], sumaEdades: 0 },
    { jugador1: todosLosJugadores[8], jugador2: todosLosJugadores[9], sumaEdades: 0 },
];

// --- FUNCIONES PRINCIPALES ---

/**
 * Función que se ejecuta cada vez que se actualiza la página o se cambia un jugador.
 */
function renderizarTabla() {
    // 1. Calcular la suma de edades para cada pareja
    parejas.forEach(p => {
        p.sumaEdades = p.jugador1.edad + p.jugador2.edad;
    });

    // 2. Ordenar las parejas de mayor a menor por la suma de edades
    parejas.sort((a, b) => b.sumaEdades - a.sumaEdades);

    // 3. Obtener el contenedor HTML y limpiarlo
    const contenedor = document.getElementById('contenedor-parejas');
    contenedor.innerHTML = '';

    // 4. Crear la tabla y su estructura
    const tabla = document.createElement('table');
    tabla.innerHTML = `
        <thead>
            <tr>
                <th>Jugador 1</th>
                <th>Jugador 2</th>
                <th>Edades</th>
            </tr>
        </thead>
    `;
    const tbody = document.createElement('tbody');

    // 5. Llenar la tabla con las parejas
    parejas.forEach((pareja, indexPareja) => {
        const fila = document.createElement('tr');
        const celda1 = document.createElement('td');
        celda1.appendChild(crearSelectorJugador(pareja.jugador1, indexPareja, 1));
        
        const celda2 = document.createElement('td');
        celda2.appendChild(crearSelectorJugador(pareja.jugador2, indexPareja, 2));

        const celdaSuma = document.createElement('td');
        celdaSuma.textContent = pareja.sumaEdades;
        
        fila.appendChild(celda1);
        fila.appendChild(celda2);
        fila.appendChild(celdaSuma);
        tbody.appendChild(fila);
    });

    tabla.appendChild(tbody);
    contenedor.appendChild(tabla);

    // 6. NOVEDAD: Llamamos a la función para que compruebe y resalte duplicados
    resaltarDuplicados();
}

/**
 * Crea un menú desplegable <select> para un jugador específico.
 * @param {object} jugadorActual - El jugador que está seleccionado actualmente.
 * @param {number} indexPareja - El índice de la pareja (0 a 4).
 * @param {number} posicionEnPareja - Si es el jugador 1 o 2.
 * @returns {HTMLElement} - El elemento <select> creado.
 */
function crearSelectorJugador(jugadorActual, indexPareja, posicionEnPareja) {
    const selector = document.createElement('select');
    
    // MODIFICADO: Ahora siempre recorremos la lista completa de jugadores, sin filtros.
    todosLosJugadores.forEach(jugador => {
        const opcion = document.createElement('option');
        opcion.value = jugador.nombre;
        opcion.textContent = `${jugador.nombre} (${jugador.edad})`;
        if (jugador.nombre === jugadorActual.nombre) {
            opcion.selected = true;
        }
        selector.appendChild(opcion);
    });

    // El evento 'change' se mantiene igual
    selector.addEventListener('change', (evento) => {
        const nuevoNombreJugador = evento.target.value;
        const nuevoJugador = todosLosJugadores.find(j => j.nombre === nuevoNombreJugador);

        if (posicionEnPareja === 1) {
            parejas[indexPareja].jugador1 = nuevoJugador;
        } else {
            parejas[indexPareja].jugador2 = nuevoJugador;
        }

        renderizarTabla();
    });

    return selector;
}

/**
 * NOVEDAD: Nueva función para encontrar y resaltar jugadores duplicados.
 */
function resaltarDuplicados() {
    // 1. Obtenemos una lista con los nombres de todos los jugadores seleccionados
    const nombresSeleccionados = parejas.flatMap(p => [p.jugador1.nombre, p.jugador2.nombre]);

    // 2. Encontramos cuáles de esos nombres están repetidos
    const conteoNombres = {};
    nombresSeleccionados.forEach(nombre => {
        conteoNombres[nombre] = (conteoNombres[nombre] || 0) + 1;
    });

    const nombresDuplicados = Object.keys(conteoNombres).filter(nombre => conteoNombres[nombre] > 1);

    // 3. Recorremos todos los <select> de la página
    document.querySelectorAll('select').forEach(selector => {
        // Si el jugador seleccionado en este <select> está en nuestra lista de duplicados...
        if (nombresDuplicados.includes(selector.value)) {
            selector.classList.add('error-duplicado'); // ...le añadimos la clase de error.
        } else {
            selector.classList.remove('error-duplicado'); // ...en caso contrario, se la quitamos.
        }
    });
}


// --- INICIO DE LA APLICACIÓN ---
// Llamamos a la función por primera vez para que dibuje la tabla inicial.
renderizarTabla();
