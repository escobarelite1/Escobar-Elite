
import './style.css';
import { productos } from './productos.js';

// =============================================
// 1. CONFIGURACIÓN Y FUNCIONES GENERALES
// =============================================

const NUMERO_WHATSAPP = '573018864753';

function normalizarTexto(texto = '') {
    return String(texto)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

// Busca por nombre y palabras clave.
// Permite escribir, por ejemplo, "balón de fútbol".
function coincideBusqueda(producto, termino) {
    const textoProducto = normalizarTexto([
        producto.nombre || '',
        producto.palabrasClave || ''
    ].join(' '));

    const busqueda = normalizarTexto(termino);

    if (!busqueda) return true;

    if (textoProducto.includes(busqueda)) {
        return true;
    }

    const palabrasIgnoradas = [
        'de', 'del', 'la', 'el', 'los', 'las',
        'un', 'una', 'unos', 'unas', 'para', 'con', 'y'
    ];

    const palabras = busqueda
        .split(/\s+/)
        .filter(palabra =>
            palabra && !palabrasIgnoradas.includes(palabra)
        );

    return palabras.length > 0 && palabras.every(palabra =>
        textoProducto.split(/\s+/).some(p =>
            p.includes(palabra)
        )
    );
}

// Genera el enlace de consulta para cada producto.
function crearEnlaceWhatsApp(nombreProducto) {
    const mensaje = `Hola 👋, estoy interesado/a en: ${nombreProducto}. ¿Me podrían confirmar disponibilidad?`;

    return `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}

// Crea una tarjeta reutilizable para todas las categorías.
function crearTarjetaProducto(producto, mostrarCategoria = true) {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'producto';

    const nombresCategorias = {
        camisetas: 'Camisetas de fútbol',
        calzado: 'Calzado',
        ropa: 'Ropa deportiva',
        accesorios: 'Accesorios deportivos'
    };

    tarjeta.innerHTML = `
        <div class="imagen-producto">
            <img
                src="${producto.imagen}"
                alt="${producto.nombre}"
                loading="lazy"
            >
        </div>

        <div class="producto-info">
            ${mostrarCategoria ? `
                <span class="categoria-producto">
                    ${nombresCategorias[producto.categoria] || 'Productos deportivos'}
                </span>
            ` : ''}

            <h3>${producto.nombre}</h3>

            <a
                href="${crearEnlaceWhatsApp(producto.nombre)}"
                class="boton boton-producto"
                target="_blank"
                rel="noopener noreferrer"
            >
                Consultar disponibilidad
            </a>
        </div>
    `;

    return tarjeta;
}

// Muestra un mensaje cuando no hay coincidencias.
function mostrarMensajeSinResultados(contenedor, mensaje) {
    contenedor.innerHTML = `
        <div class="sin-resultados">
            <h3>No encontramos productos</h3>
            <p>${mensaje}</p>
        </div>
    `;
}

// Añade el botón X a un buscador.
function activarBotonLimpiar(input, alLimpiar = null) {
    if (!input) return;

    const contenedor = input.closest('.buscador');
    if (!contenedor) return;

    // Evita crear dos botones en el mismo buscador.
    if (contenedor.querySelector('.boton-limpiar-busqueda')) {
        return;
    }

    contenedor.classList.add('buscador-con-limpiar');

    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'boton-limpiar-busqueda';
    boton.textContent = '×';
    boton.setAttribute('aria-label', 'Limpiar búsqueda');
    boton.title = 'Limpiar búsqueda';
    boton.hidden = true;

    contenedor.appendChild(boton);

    function actualizarBoton() {
        boton.hidden = input.value.length === 0;
    }

    input.addEventListener('input', actualizarBoton);

    boton.addEventListener('click', () => {
        input.value = '';

        // Actualiza los resultados mediante el evento existente.
        input.dispatchEvent(new Event('input', { bubbles: true }));

        if (alLimpiar) {
            alLimpiar();
        }

        input.focus();
        actualizarBoton();
    });

    actualizarBoton();
}


// =============================================
// 2. CATÁLOGO Y FILTROS DE CATEGORÍAS
// =============================================

const contenedorProductos = document.querySelector('.productos');
const botonesFiltro = document.querySelectorAll('.filtro');
const buscador = document.querySelector('.buscador input');

let terminoBusqueda = '';

if (contenedorProductos) {
    const pagina = window.location.pathname.toLowerCase();

    let categoriaActual = '';
    let subcategoriaActual = '';

    // Detecta la categoría según la dirección de la página.
    if (pagina.includes('camisetas')) {
        categoriaActual = 'camisetas';
    } else if (pagina.includes('calzado')) {
        categoriaActual = 'calzado';
    } else if (pagina.includes('ropa')) {
        categoriaActual = 'ropa';
    } else if (pagina.includes('accesorios')) {
        categoriaActual = 'accesorios';
    }

    const mensajesSinResultados = {
        camisetas: 'No hay camisetas que coincidan con tu búsqueda.',
        calzado: 'No hay productos de calzado que coincidan con tu búsqueda.',
        ropa: 'No hay prendas que coincidan con tu búsqueda.',
        accesorios: 'No hay accesorios que coincidan con tu búsqueda.'
    };

    // Aplica categoría, búsqueda y subcategoría.
    function obtenerProductosFiltrados() {
        return productos.filter(producto => {
            if (producto.categoria !== categoriaActual) {
                return false;
            }

            if (!coincideBusqueda(producto, terminoBusqueda)) {
                return false;
            }

            if (
                subcategoriaActual &&
                producto.subcategoria !== subcategoriaActual
            ) {
                return false;
            }

            return true;
        });
    }

    // Dibuja los productos filtrados.
    function mostrarProductos() {
        contenedorProductos.innerHTML = '';

        const productosFiltrados = obtenerProductosFiltrados();

        if (productosFiltrados.length === 0) {
            mostrarMensajeSinResultados(
                contenedorProductos,
                mensajesSinResultados[categoriaActual] ||
                'Prueba con otra búsqueda.'
            );
            return;
        }

        productosFiltrados.forEach(producto => {
            contenedorProductos.appendChild(
                crearTarjetaProducto(producto)
            );
        });
    }

    // Buscador de la categoría.
    if (buscador) {
        activarBotonLimpiar(buscador);

        buscador.addEventListener('input', () => {
            terminoBusqueda = normalizarTexto(buscador.value);
            mostrarProductos();
        });
    }

    // Filtros de las categorías.
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', () => {
            botonesFiltro.forEach(b => {
                b.classList.remove('activo');
            });

            boton.classList.add('activo');

            const filtro = normalizarTexto(boton.textContent);

            if (filtro === 'todas' || filtro === 'todos') {
                subcategoriaActual = '';
            } else if (filtro === 'futbol') {
                subcategoriaActual = 'futbol';
            } else if (
                filtro === 'tenis casuales' ||
                filtro === 'tenis casual' ||
                filtro === 'casual'
            ) {
                subcategoriaActual = 'casual';
            } else {
                subcategoriaActual = filtro;
            }

            mostrarProductos();
        });
    });

    // Muestra los productos al entrar en la página.
    mostrarProductos();
}


// =============================================
// 3. BÚSQUEDA GLOBAL EN LA PÁGINA DE INICIO
// =============================================

const buscadorInicio = document.querySelector(
    '.buscador-inicio .buscador input'
);

const resultadosInicio = document.querySelector('.resultados-inicio');

if (buscadorInicio && resultadosInicio) {
    // La X funciona también en Inicio.
    activarBotonLimpiar(buscadorInicio);

    buscadorInicio.addEventListener('input', () => {
        const termino = normalizarTexto(buscadorInicio.value);

        resultadosInicio.innerHTML = '';

        // No muestra resultados si el campo está vacío.
        if (!termino) {
            return;
        }

        const productosEncontrados = productos.filter(producto =>
            coincideBusqueda(producto, termino)
        );

        if (productosEncontrados.length === 0) {
            mostrarMensajeSinResultados(
                resultadosInicio,
                'Prueba con otro nombre o término de búsqueda.'
            );
            return;
        }

        productosEncontrados.forEach(producto => {
            resultadosInicio.appendChild(
                crearTarjetaProducto(producto)
            );
        });
    });
}
