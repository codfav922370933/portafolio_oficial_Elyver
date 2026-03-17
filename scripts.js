/* ================================================================
   PORTAFOLIO — ELYVER
   Archivo: scripts.js
   Descripción: Toda la lógica e interactividad del portafolio.
   Estructura:
     1. Estado global (datos y configuración)
     2. Funciones de renderizado (dibujan el contenido en pantalla)
     3. Sistema de administrador (login y sesión)
     4. Helpers de modales (abrir y cerrar ventanas)
     5. CRUD de proyectos (crear, leer, actualizar, eliminar)
     6. Edición de contacto y redes sociales
     7. Edición de información personal
     8. Notificaciones toast
     9. Navegación activa (resalta el menú al hacer scroll)
    10. Acceso secreto al admin (3 clics en el logo)
    11. Inicialización (ejecuta todo al cargar la página)
   ================================================================ */


/* ================================================================
   1. ESTADO GLOBAL
   Objeto central que almacena todos los datos del portafolio.
   Cualquier cambio en el admin modifica este objeto y luego
   se vuelve a renderizar la sección correspondiente.
   ================================================================ */
let state = {

  /* Indica si el modo administrador está activo */
  isAdmin: false,

  /* Contraseña del panel de administrador */
  adminPass: 'Ef@73887067',

  /* Datos de contacto y redes sociales */
  contact: {
    whatsapp:    '+51 XXX XXX XXX',  /* Número visible en pantalla */
    whatsappUrl: '#',                 /* URL para abrir WhatsApp (wa.me/...) */
    email:       'tu@email.com',
    linkedin:    'linkedin.com/in/elyver',  /* Texto visible */
    linkedinUrl: '#',                        /* URL completa */
    github:      'github.com/elyver',
    githubUrl:   '#',
    instagram:   '#'                  /* URL completa de Instagram */
  },

  /* Lista de proyectos mostrados en la sección "Proyectos" */
  proyectos: [
    {
      titulo: 'Portal de Salud',
      desc:   'Tu fuente de información médica. Síntomas, tratamientos y consejos.',
      img:    '1Salud.png',
      tags:   ['Salud', 'Web', 'UI/UX']
    },
    {
      titulo: 'Aventura Épica',
      desc:   'Juego web RPG. Elige tu misión, lucha y gana recompensas.',
      img:    '2Juego_web.png',
      tags:   ['Game', 'JavaScript', 'Canvas']
    },
    {
      titulo: 'Sistema de Base de Datos',
      desc:   'Gestión y análisis de datos. Administra y visualiza tu información.',
      img:    '3Base_de_Datos.png',
      tags:   ['SQL', 'Backend', 'Data']
    },
    {
      titulo: 'Calculadora Científica',
      desc:   'Herramienta avanzada de cálculo con funciones científicas y gráficas.',
      img:    '4Calculadora_web.png',
      tags:   ['Web', 'Math', 'JavaScript']
    },
    {
      titulo: 'Diseños Web Modernos',
      desc:   'Soluciones creativas para tu sitio. Elegantes y funcionales.',
      img:    '5Web_Modernas.png',
      tags:   ['CSS', 'Diseño', 'Responsive']
    },
    {
      titulo: 'App Móvil',
      desc:   'Todo en tu mano. Accede a tus funciones favoritas desde cualquier dispositivo.',
      img:    '6App_Móvil.png',
      tags:   ['Flutter', 'Móvil', 'UX']
    }
  ],

  /* Lista de servicios mostrados en la sección "Servicios" */
  servicios: [
    { emoji: '🌐', titulo: 'Desarrollo Web y Móvil',    desc: 'Aplicaciones web y móviles modernas, rápidas y responsivas.' },
    { emoji: '🎨', titulo: 'Diseño UI/UX',              desc: 'Interfaces intuitivas y atractivas centradas en el usuario.' },
    { emoji: '🗄️', titulo: 'Sistemas y Bases de Datos', desc: 'Sistemas personalizados con bases de datos eficientes y seguras.' },
    { emoji: '⚡', titulo: 'Optimización de Software',  desc: 'Mejora y optimización de aplicaciones y sistemas existentes.' },
    { emoji: '💡', titulo: 'Asesoría Tecnológica',      desc: 'Planificación y consultoría para proyectos digitales.' },
    { emoji: '🖥️', titulo: 'Páginas Web Responsivas',   desc: 'Sitios web modernos, elegantes y adaptables a cualquier dispositivo.' }
  ]
};


/* ================================================================
   2. FUNCIONES DE RENDERIZADO
   Generan el HTML de cada sección a partir del estado (state).
   Se llaman al iniciar la página y cada vez que hay un cambio.
   ================================================================ */

/**
 * renderProyectos()
 * Dibuja las tarjetas de proyectos en la cuadrícula.
 * Incluye botones de editar/eliminar (visibles solo en modo admin).
 */
function renderProyectos() {
  /* Obtiene el contenedor de la cuadrícula */
  const grid = document.getElementById('proyectos-grid');

  /* Genera el HTML de cada tarjeta usando map() y los une con join('') */
  grid.innerHTML = state.proyectos.map((proyecto, indice) => `
    <div class="proyecto-card">

      <!-- Imagen con overlay que aparece al hacer hover -->
      <div class="proyecto-img-wrap">
        <img
          src="${proyecto.img}"
          alt="${proyecto.titulo}"
          onerror="this.src=''; this.style.display='none'"
        >
        <!-- Overlay oscuro con el título del proyecto -->
        <div class="proyecto-overlay">
          <div style="font-family:var(--font-title); letter-spacing:0.08em;">
            ${proyecto.titulo}
          </div>
        </div>
      </div>

      <!-- Información del proyecto -->
      <div class="proyecto-info">
        <div class="proyecto-title">${proyecto.titulo}</div>
        <div class="proyecto-desc">${proyecto.desc}</div>
        <!-- Chips de tecnologías usadas -->
        <div class="proyecto-tags">
          ${proyecto.tags.map(tag => `<span class="proyecto-tag">${tag}</span>`).join('')}
        </div>
      </div>

      <!-- Botones admin (ocultos hasta activar modo admin) -->
      <div class="admin-card-actions">
        <button class="btn-edit"   onclick="openEditProject(${indice})">✏ Editar</button>
        <button class="btn-delete" onclick="deleteProject(${indice})">✕ Eliminar</button>
      </div>

    </div>
  `).join('');
}


/**
 * renderServicios()
 * Dibuja las tarjetas de servicios en la cuadrícula.
 */
function renderServicios() {
  document.getElementById('servicios-grid').innerHTML = state.servicios.map(servicio => `
    <div class="servicio-card">
      <span class="srv-emoji">${servicio.emoji}</span>
      <p class="srv-titulo">${servicio.titulo}</p>
      <p class="srv-desc">${servicio.desc}</p>
    </div>
  `).join('');
}


/**
 * renderContact()
 * Actualiza los textos y enlaces de la sección de contacto,
 * la barra flotante lateral y los íconos del footer.
 */
function renderContact() {
  const c = state.contact;

  /* Actualiza los textos visibles */
  document.getElementById('val-whatsapp').textContent = c.whatsapp;
  document.getElementById('val-email').textContent    = c.email;
  document.getElementById('val-linkedin').textContent = c.linkedin;
  document.getElementById('val-github').textContent   = c.github;

  /* Actualiza los href de los links de la sección contacto */
  /* Si hay número de WhatsApp, genera el link wa.me/NUMERO */
  document.getElementById('link-whatsapp').href =
    c.whatsappUrl !== '#'
      ? `https://wa.me/${c.whatsappUrl.replace(/\D/g, '')}` /* Elimina caracteres no numéricos */
      : '#';
  document.getElementById('link-email').href    = `mailto:${c.email}`;
  document.getElementById('link-linkedin').href = c.linkedinUrl;
  document.getElementById('link-github').href   = c.githubUrl;

  /* Actualiza los links de la barra social flotante Y del footer
     Los prefijos 'sf' = social float, 'fs' = footer social */
  ['sf', 'fs'].forEach(function(prefijo) {
    const whatsapp  = document.getElementById(`${prefijo}-whatsapp`);
    const linkedin  = document.getElementById(`${prefijo}-linkedin`);
    const github    = document.getElementById(`${prefijo}-github`);
    const instagram = document.getElementById(`${prefijo}-instagram`);

    if (whatsapp)  whatsapp.href  = c.whatsappUrl !== '#' ? `https://wa.me/${c.whatsappUrl.replace(/\D/g, '')}` : '#';
    if (linkedin)  linkedin.href  = c.linkedinUrl;
    if (github)    github.href    = c.githubUrl;
    if (instagram) instagram.href = c.instagram;
  });
}


/* ================================================================
   3. SISTEMA DE ADMINISTRADOR
   Maneja el login, activación y salida del modo admin.
   ================================================================ */

/**
 * openLogin()
 * Abre el modal de login del administrador.
 * Si ya está en modo admin, llama a exitAdmin() para cerrar sesión.
 */
function openLogin() {
  if (state.isAdmin) {
    /* Si ya es admin, hace logout directamente */
    exitAdmin();
    return;
  }
  /* Limpia el campo de contraseña antes de abrir */
  document.getElementById('admin-pass').value = '';
  openModal('modal-login');

  /* Pone el cursor en el campo de contraseña automáticamente */
  setTimeout(function() {
    document.getElementById('admin-pass').focus();
  }, 100);
}


/**
 * tryLogin()
 * Verifica la contraseña ingresada.
 * Si es correcta activa el modo admin; si no, muestra error.
 */
function tryLogin() {
  const contrasenaIngresada = document.getElementById('admin-pass').value;

  if (contrasenaIngresada === state.adminPass) {
    /* Contraseña correcta: activa modo admin */
    state.isAdmin = true;

    /* Agrega la clase "admin-mode" al body para mostrar elementos admin (CSS) */
    document.body.classList.add('admin-mode');

    /* Muestra el botón "Agregar Proyecto" en la sección de proyectos */
    document.getElementById('btn-add-project').style.display = 'inline-block';

    closeModal('modal-login');
    showToast('Bienvenido al panel de administrador ✓', 'success');

  } else {
    /* Contraseña incorrecta: muestra error y limpia el campo */
    showToast('Contraseña incorrecta', 'error');
    document.getElementById('admin-pass').value = '';
    document.getElementById('admin-pass').focus();
  }
}


/**
 * exitAdmin()
 * Desactiva el modo administrador y oculta los controles de edición.
 */
function exitAdmin() {
  state.isAdmin = false;

  /* Quita la clase "admin-mode" del body (CSS oculta los controles) */
  document.body.classList.remove('admin-mode');

  /* Oculta el botón "Agregar Proyecto" */
  document.getElementById('btn-add-project').style.display = 'none';

  showToast('Modo administrador desactivado');
}


/* ================================================================
   4. HELPERS DE MODALES
   Funciones simples para abrir y cerrar las ventanas emergentes.
   ================================================================ */

/**
 * openModal(id)
 * Agrega la clase "open" al overlay del modal para mostrarlo.
 * @param {string} id - El id del elemento modal-overlay en el HTML.
 */
function openModal(id) {
  document.getElementById(id).classList.add('open');
}


/**
 * closeModal(id)
 * Quita la clase "open" para ocultar el modal.
 * @param {string} id - El id del elemento modal-overlay en el HTML.
 */
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}


/* Cierra cualquier modal al hacer clic en el fondo oscuro (fuera de la ventana) */
document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
  overlay.addEventListener('click', function(evento) {
    /* Solo cierra si el clic fue directamente en el overlay, no en la ventana */
    if (evento.target === overlay) {
      overlay.classList.remove('open');
    }
  });
});


/* ================================================================
   5. CRUD DE PROYECTOS
   Funciones para Crear, Leer, Actualizar y Eliminar proyectos.
   ================================================================ */

/**
 * openAddProject()
 * Abre el modal de proyecto en modo "Agregar" (campos vacíos).
 */
function openAddProject() {
  /* Cambia el título del modal a "Agregar Proyecto" */
  document.getElementById('modal-proyecto-title').textContent = 'Agregar Proyecto';

  /* El índice -1 indica que es un proyecto nuevo (no edición) */
  document.getElementById('edit-proyecto-idx').value = -1;

  /* Limpia todos los campos del formulario */
  document.getElementById('p-titulo').value = '';
  document.getElementById('p-desc').value   = '';
  document.getElementById('p-img').value    = '';
  document.getElementById('p-tags').value   = '';

  openModal('modal-proyecto');
}


/**
 * openEditProject(indice)
 * Abre el modal de proyecto en modo "Editar" con los datos existentes.
 * @param {number} indice - Posición del proyecto en state.proyectos[].
 */
function openEditProject(indice) {
  const proyecto = state.proyectos[indice];

  /* Cambia el título del modal a "Editar Proyecto" */
  document.getElementById('modal-proyecto-title').textContent = 'Editar Proyecto';

  /* Guarda el índice para saber cuál proyecto actualizar al guardar */
  document.getElementById('edit-proyecto-idx').value = indice;

  /* Rellena los campos con los datos actuales del proyecto */
  document.getElementById('p-titulo').value = proyecto.titulo;
  document.getElementById('p-desc').value   = proyecto.desc;
  document.getElementById('p-img').value    = proyecto.img;
  document.getElementById('p-tags').value   = proyecto.tags.join(', '); /* Array → "tag1, tag2" */

  openModal('modal-proyecto');
}


/**
 * saveProject()
 * Guarda un proyecto nuevo o actualiza uno existente.
 * Lee los valores del formulario del modal y actualiza state.proyectos[].
 */
function saveProject() {
  /* Lee el índice: -1 = nuevo proyecto, otro número = edición */
  const indice = parseInt(document.getElementById('edit-proyecto-idx').value);

  /* Construye el objeto proyecto con los datos del formulario */
  const proyecto = {
    titulo: document.getElementById('p-titulo').value.trim(),
    desc:   document.getElementById('p-desc').value.trim(),
    img:    document.getElementById('p-img').value.trim(),
    /* Convierte "tag1, tag2, tag3" en el array ["tag1", "tag2", "tag3"] */
    tags: document.getElementById('p-tags').value
      .split(',')
      .map(function(t) { return t.trim(); })
      .filter(Boolean) /* Elimina strings vacíos */
  };

  /* Validación: el título es obligatorio */
  if (!proyecto.titulo) {
    showToast('El título es requerido', 'error');
    return;
  }

  if (indice === -1) {
    /* Proyecto nuevo: agrega al final del array */
    state.proyectos.push(proyecto);
  } else {
    /* Edición: reemplaza el proyecto en la posición dada */
    state.proyectos[indice] = proyecto;
  }

  /* Vuelve a dibujar la cuadrícula de proyectos */
  renderProyectos();
  closeModal('modal-proyecto');
  showToast('Proyecto guardado ✓', 'success');
}


/**
 * deleteProject(indice)
 * Elimina un proyecto del array después de confirmación del usuario.
 * @param {number} indice - Posición del proyecto en state.proyectos[].
 */
function deleteProject(indice) {
  /* Pide confirmación antes de eliminar */
  const confirmado = confirm(`¿Eliminar "${state.proyectos[indice].titulo}"?`);
  if (!confirmado) return;

  /* splice(indice, 1) elimina 1 elemento en la posición dada */
  state.proyectos.splice(indice, 1);

  /* Vuelve a dibujar la cuadrícula sin el proyecto eliminado */
  renderProyectos();
  showToast('Proyecto eliminado');
}


/* ================================================================
   6. EDICIÓN DE CONTACTO Y REDES SOCIALES
   ================================================================ */

/**
 * openEditContact()
 * Abre el modal de contacto con los valores actuales prellenados.
 */
function openEditContact() {
  const c = state.contact;

  /* Rellena cada campo con el valor actual del state */
  document.getElementById('c-whatsapp').value  = c.whatsapp;
  document.getElementById('c-email').value     = c.email;
  /* Para URL solo muestra si no es el placeholder '#' */
  document.getElementById('c-linkedin').value  = c.linkedinUrl  !== '#' ? c.linkedinUrl  : '';
  document.getElementById('c-github').value    = c.githubUrl    !== '#' ? c.githubUrl    : '';
  document.getElementById('c-instagram').value = c.instagram    !== '#' ? c.instagram    : '';

  openModal('modal-contact');
}


/**
 * saveContact()
 * Guarda los nuevos datos de contacto en el state y actualiza la vista.
 */
function saveContact() {
  const c = state.contact;

  /* Lee los valores del formulario */
  const nuevoWhatsapp   = document.getElementById('c-whatsapp').value.trim();
  const nuevoEmail      = document.getElementById('c-email').value.trim();
  const nuevoLinkedin   = document.getElementById('c-linkedin').value.trim();
  const nuevoGithub     = document.getElementById('c-github').value.trim();
  const nuevoInstagram  = document.getElementById('c-instagram').value.trim();

  /* Actualiza el state solo si el campo no está vacío (conserva el valor anterior) */
  c.whatsapp    = nuevoWhatsapp  || c.whatsapp;
  c.whatsappUrl = nuevoWhatsapp;
  c.email       = nuevoEmail     || c.email;

  /* Para LinkedIn y GitHub guarda la URL completa y también el texto corto para mostrar */
  c.linkedin    = nuevoLinkedin
    ? nuevoLinkedin.replace('https://', '').replace('http://', '') /* Elimina el protocolo para mostrar */
    : c.linkedin;
  c.linkedinUrl = nuevoLinkedin || '#';

  c.github      = nuevoGithub
    ? nuevoGithub.replace('https://', '').replace('http://', '')
    : c.github;
  c.githubUrl   = nuevoGithub || '#';

  c.instagram   = nuevoInstagram || '#';

  /* Actualiza todos los links y textos en pantalla */
  renderContact();
  closeModal('modal-contact');
  showToast('Contacto actualizado ✓', 'success');
}


/* ================================================================
   7. EDICIÓN DE INFORMACIÓN PERSONAL
   Permite editar la bio, habilidades y estadísticas desde el admin.
   ================================================================ */

/**
 * openEditAbout()
 * Abre el modal de info personal con los valores actuales del DOM.
 */
function openEditAbout() {
  /* Lee el texto actual directamente de los elementos del DOM */
  document.getElementById('a-herodesc').value  = document.getElementById('hero-desc').textContent.trim();
  document.getElementById('a-about').value     = document.getElementById('about-text').innerText.trim();
  document.getElementById('a-ubicacion').value = document.getElementById('about-ubicacion').textContent.trim();

  /* Convierte los chips de habilidades en texto separado por comas */
  const chips = Array.from(document.querySelectorAll('#skills-list .skill-tag'));
  document.getElementById('a-skills').value = chips.map(function(chip) {
    return chip.textContent;
  }).join(', ');

  /* Lee las estadísticas actuales */
  document.getElementById('a-stat-p').value = document.getElementById('stat-proyectos').textContent;
  document.getElementById('a-stat-e').value = document.getElementById('stat-exp').textContent;
  document.getElementById('a-stat-c').value = document.getElementById('stat-clientes').textContent;
  document.getElementById('a-stat-t').value = document.getElementById('stat-tech').textContent;

  openModal('modal-about');
}


/**
 * saveAbout()
 * Guarda los cambios de información personal directamente en el DOM.
 */
function saveAbout() {
  const nuevaDescHero   = document.getElementById('a-herodesc').value.trim();
  const nuevaUbicacion  = document.getElementById('a-ubicacion').value.trim();
  const nuevasSkills    = document.getElementById('a-skills').value;
  const nuevaStatP      = document.getElementById('a-stat-p').value;
  const nuevaStatE      = document.getElementById('a-stat-e').value;
  const nuevaStatC      = document.getElementById('a-stat-c').value;
  const nuevaStatT      = document.getElementById('a-stat-t').value;

  /* Solo actualiza si el campo tiene contenido */
  if (nuevaDescHero)  document.getElementById('hero-desc').textContent        = nuevaDescHero;
  if (nuevaUbicacion) document.getElementById('about-ubicacion').textContent  = nuevaUbicacion;

  /* Regenera los chips de habilidades a partir del texto separado por comas */
  if (nuevasSkills) {
    document.getElementById('skills-list').innerHTML = nuevasSkills
      .split(',')
      .map(function(skill) {
        return `<span class="skill-tag">${skill.trim()}</span>`;
      })
      .join('');
  }

  /* Actualiza las estadísticas (si el campo está vacío conserva el valor anterior) */
  if (nuevaStatP) document.getElementById('stat-proyectos').textContent = nuevaStatP;
  if (nuevaStatE) document.getElementById('stat-exp').textContent       = nuevaStatE;
  if (nuevaStatC) document.getElementById('stat-clientes').textContent  = nuevaStatC;
  if (nuevaStatT) document.getElementById('stat-tech').textContent      = nuevaStatT;

  closeModal('modal-about');
  showToast('Información actualizada ✓', 'success');
}


/* ================================================================
   8. NOTIFICACIONES TOAST
   Muestra mensajes temporales de confirmación o error.
   ================================================================ */

/**
 * showToast(mensaje, tipo)
 * Muestra una notificación flotante por 3 segundos.
 * @param {string} mensaje - Texto a mostrar.
 * @param {string} tipo    - 'success' (verde) | 'error' (rojo) | '' (azul).
 */
function showToast(mensaje, tipo) {
  tipo = tipo || ''; /* Valor por defecto si no se pasa tipo */

  const toast = document.getElementById('toast');
  toast.textContent = mensaje;

  /* Asigna las clases: "toast success show" o "toast error show" */
  toast.className = `toast ${tipo} show`;

  /* Oculta automáticamente después de 3 segundos */
  setTimeout(function() {
    toast.classList.remove('show');
  }, 3000);
}


/* ================================================================
   9. NAVEGACIÓN ACTIVA
   Resalta el enlace del menú correspondiente a la sección
   que está actualmente visible en pantalla al hacer scroll.
   ================================================================ */

/* Obtiene todas las secciones con id y todos los enlaces del menú */
const secciones  = document.querySelectorAll('section[id]');
const enlacesNav = document.querySelectorAll('nav a');

/* Escucha el evento scroll de la ventana */
window.addEventListener('scroll', function() {
  let seccionActual = '';

  /* Determina qué sección está visible según la posición del scroll */
  secciones.forEach(function(seccion) {
    /* Si el scroll supera el inicio de la sección (con margen de 100px) */
    if (window.scrollY >= seccion.offsetTop - 100) {
      seccionActual = seccion.id; /* Guarda el id de la sección (ej: "proyectos") */
    }
  });

  /* Actualiza la clase "active" en el menú */
  enlacesNav.forEach(function(enlace) {
    enlace.classList.remove('active'); /* Quita "active" de todos */

    /* Agrega "active" solo al enlace que coincide con la sección actual */
    if (enlace.getAttribute('href') === `#${seccionActual}`) {
      enlace.classList.add('active');
    }
  });
});


/* ================================================================
   10. ACCESO SECRETO AL ADMIN
   Activa el panel de administrador con 3 clics rápidos en el logo.
   No hay botón visible; el acceso es completamente oculto.
   ================================================================ */
(function() {
  let contadorClics = 0;   /* Cuenta los clics consecutivos */
  let temporizador  = null; /* Timer para resetear el contador */

  const logo = document.getElementById('logo-secret');

  logo.addEventListener('click', function(evento) {
    evento.preventDefault(); /* Evita que el clic navegue a #inicio */

    contadorClics++;

    /* Cancela el temporizador anterior si existe */
    if (temporizador) clearTimeout(temporizador);

    if (contadorClics >= 3) {
      /* 3 clics consecutivos → abre/cierra el panel admin */
      contadorClics = 0;

      if (state.isAdmin) {
        exitAdmin(); /* Si ya era admin, cierra la sesión */
      } else {
        openLogin(); /* Si no era admin, abre el login */
      }

    } else {
      /* Si no llegó a 3 clics en 500ms, resetea el contador
         y navega normalmente a la sección inicio */
      temporizador = setTimeout(function() {
        contadorClics = 0;
        window.location.hash = '#inicio';
      }, 500);
    }
  });
})();
/* El uso de IIFE (función auto-ejecutable) evita que las variables
   contadorClics y temporizador contaminen el scope global */


/* ================================================================
   11. INICIALIZACIÓN
   Se ejecuta automáticamente al cargar la página.
   Dibuja el contenido inicial en todas las secciones.
   ================================================================ */

/* Dibuja la cuadrícula de proyectos con los datos de state.proyectos */
renderProyectos();

/* Dibuja la cuadrícula de servicios con los datos de state.servicios */
renderServicios();

/* Actualiza los links y textos de contacto con los datos de state.contact */
renderContact();
