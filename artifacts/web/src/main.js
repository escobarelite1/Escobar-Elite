import './style.css';
import { productos } from './productos.js';


// ======================================
// CONTENEDOR DE PRODUCTOS
// ======================================

const contenedorProductos = document.querySelector('.productos');
const botonesFiltro = document.querySelectorAll('.filtro');
const buscador = document.querySelector('.buscador input');
let terminoBusqueda = '';


// ======================================
// MOSTRAR PRODUCTOS
// ======================================

if (contenedorProductos) {

    const pagina = window.location.pathname;

    let categoriaActual = '';
    let subcategoriaActual = '';


    // ==================================
    // DETECTAR CATEGORÍA
    // ==================================


    if (pagina.includes('camisetas')) {
        categoriaActual = 'camisetas';
    }

    else if (pagina.includes('calzado')) {
        categoriaActual = 'calzado';
    }

    else if (pagina.includes('ropa')) {
        categoriaActual = 'ropa';
    }

    else if (pagina.includes('accesorios')) {
        categoriaActual = 'accesorios';
    }



    // ==================================
    // OBTENER PRODUCTOS FILTRADOS
    // ==================================

    function obtenerProductosFiltrados() {

        return productos.filter(producto => {

            if (producto.categoria !== categoriaActual) {
                return false;
            }

            if (
                terminoBusqueda !== '' &&
                !producto.nombre.toLowerCase().includes(terminoBusqueda)
            ) {
                return false;
            }

            if (subcategoriaActual === '') {
                return true;
            }

            return producto.subcategoria === subcategoriaActual;

        });

    }


    // ==================================
    // CREAR TARJETAS
    // ==================================

    function mostrarProductos() {

        contenedorProductos.innerHTML = '';
        
        const productosFiltrados = obtenerProductosFiltrados();

        
if (productosFiltrados.length === 0) {
    const mensaje = {
        camisetas: 'No hay camisetas que coincidan con tu búsqueda.',
        calzado: 'No hay productos de calzado que coincidan con tu búsqueda.',
        ropa: 'No hay prendas que coincidan con tu búsqueda.',
        accesorios: 'No hay accesorios que coincidan con tu búsqueda.'
    };

    contenedorProductos.innerHTML = `
        <div class="sin-resultados">
            <h3>No encontramos productos</h3>
            <p>${mensaje[categoriaActual] || 'Prueba con otra búsqueda.'}</p>
        </div>
    `;
    return;
}


        productosFiltrados.forEach(producto => {

            const tarjeta = document.createElement('article');

            tarjeta.className = 'producto';


            tarjeta.innerHTML = `

                <div class="imagen-producto">

                    <img
                        src="${producto.imagen}"
                        alt="${producto.nombre}"
                    >

                </div>

                <div class="producto-info">

                    <span class="categoria-producto">
                        ${categoriaActual === 'camisetas'
                            ? 'Camisetas de fútbol'
                            : categoriaActual === 'calzado'
                            ? 'Calzado'
                            : categoriaActual === 'ropa'
                            ? 'Ropa deportiva'
                            : 'Accesorios'}
                    </span>

                    <h3>
                        ${producto.nombre}
                    </h3>

                    <a
                       href="https://wa.me/573018864753?text=${encodeURIComponent(
    `Hola 👋, estoy interesado/a en: ${producto.nombre}. ¿Me podrían confirmar disponibilidad?`
)}"
                        class="boton boton-producto"
                        target="_blank"
                    >
                        Consultar disponibilidad
                    </a>

                </div>

            `;

            contenedorProductos.appendChild(tarjeta);

        });

    }

    // ======================================
    // BÚSQUEDA
    // ======================================

    if (buscador) {

        buscador.addEventListener('input', () => {

            terminoBusqueda = buscador.value.trim().toLowerCase();

            mostrarProductos();

        });

    }

    // ==================================
    // FILTROS
    // ==================================

    botonesFiltro.forEach(boton => {

        boton.addEventListener('click', () => {

            botonesFiltro.forEach(b => {
                b.classList.remove('activo');
            });

            boton.classList.add('activo');


            const filtro = boton.textContent.trim().toLowerCase();

            if (filtro === 'todas' || filtro === 'todos') {
                subcategoriaActual = '';
            } else if (filtro === 'fútbol') {
                subcategoriaActual = 'futbol';
            } else {
                subcategoriaActual = filtro;
            }


            mostrarProductos();

        });

    });


    // ==================================
    // MOSTRAR PRODUCTOS AL CARGAR
    // ==================================

    mostrarProductos();

}

// ======================================
// BÚSQUEDA GLOBAL - PÁGINA DE INICIO
// ======================================

const buscadorInicio = document.querySelector('.buscador-inicio .buscador input');
const resultadosInicio = document.querySelector('.resultados-inicio');

if (buscadorInicio && resultadosInicio) {

    buscadorInicio.addEventListener('input', () => {

        const termino = buscadorInicio.value.trim().toLowerCase();

        resultadosInicio.innerHTML = '';

        if (termino === '') {
            return;
        }

        const productosEncontrados = productos.filter(producto =>
            producto.nombre.toLowerCase().includes(termino)
        );

        if (productosEncontrados.length === 0) {

            resultadosInicio.innerHTML = `
                <div class="sin-resultados">
                    <h3>No encontramos productos</h3>
                    <p>Prueba con otro nombre o término de búsqueda.</p>
                </div>
            `;

            return;
        }

        productosEncontrados.forEach(producto => {

            const tarjeta = document.createElement('article');

            tarjeta.className = 'producto';

            tarjeta.innerHTML = `

                <div class="imagen-producto">

                    <img
                        src="${producto.imagen}"
                        alt="${producto.nombre}"
                    >

                </div>

                <div class="producto-info">

                    <span class="categoria-producto">
                        ${producto.categoria === 'camisetas'
                            ? 'Camisetas de fútbol'
                            : producto.categoria === 'calzado'
                            ? 'Calzado'
                            : producto.categoria === 'ropa'
                            ? 'Ropa deportiva'
                            : 'Accesorios deportivos'}
                    </span>

                    <h3>
                        ${producto.nombre}
                    </h3>

                    <a
                        href="https://wa.me/573018864753?text=${encodeURIComponent(
    `Hola 👋, estoy interesado/a en: ${producto.nombre}. ¿Me podrían confirmar disponibilidad?`
)}"
                        class="boton boton-producto"
                        target="_blank"
                    >
                        Consultar disponibilidad
                    </a>

                </div>

            `;

            resultadosInicio.appendChild(tarjeta);

        });

    });

}
