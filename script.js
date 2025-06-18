// ========== SIMULADOR DE CRÉDITO ==========
let resumenSimulacion = "";
let monto = 0;
let tipo = "";
let cuotas = 0;
let cuotaValor = 0;
let montoTotal = 0;

const simuladorForm = document.getElementById('simuladorForm');
if (simuladorForm) {
  simuladorForm.addEventListener('submit', function(e) {
    e.preventDefault();

    monto = parseFloat(document.getElementById('monto').value.replace(/\./g, '').replace(',', '.'));
    tipo = document.getElementById('tipo').value;
    cuotas = parseInt(document.getElementById('cuotas').value);

    if (isNaN(monto) || monto <= 0) {
      alert('Por favor, ingresa un monto válido.');
      return;
    }
    if (isNaN(cuotas) || cuotas <= 0) {
      alert('Por favor, ingresa una cantidad válida de cuotas.');
      return;
    }

    let tasaInteres = 0;

    if (tipo === 'semana') {
      if (cuotas <= 4) tasaInteres = 60;
      else if (cuotas <= 10) tasaInteres = 85;
      else if (cuotas <= 15) tasaInteres = 115;
      else {
        alert('Cantidad de semanas no válida.');
        return;
      }
    } else if (tipo === 'quincena') {
      if (cuotas <= 4) tasaInteres = 125;
      else if (cuotas <= 6) tasaInteres = 155;
      else if (cuotas <= 8) tasaInteres = 176;
      else if (cuotas <= 12) tasaInteres = 195;
      else {
        alert('Cantidad de quincenas no válida.');
        return;
      }
    } else if (tipo === 'mes') {
      if (cuotas <= 12) tasaInteres = 205;
      else if (cuotas <= 24) tasaInteres = 255;
      else if (cuotas <= 36) tasaInteres = 295;
      else {
        alert('Cantidad de meses no válida.');
        return;
      }
    }

    const interesTotal = monto * (tasaInteres / 100);
    montoTotal = monto + interesTotal;
    cuotaValor = montoTotal / cuotas;

    resumenSimulacion = 
      `📊 *Resultado de la simulación:*\n` +
      `*Crédito solicitado:* $${monto.toLocaleString("es-AR")}\n` +
      `*Tipo:* ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}\n` +
      `*Cuotas:* ${cuotas} de $${cuotaValor.toLocaleString("es-AR")}\n` +
      `*Total a pagar:* $${montoTotal.toLocaleString("es-AR")}`;

    localStorage.setItem("resumenSimulacion", resumenSimulacion);

    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
      <p><strong>Crédito solicitado:</strong> $${monto.toLocaleString("es-AR")}</p>
      <p><strong>Tasa de interés aplicada:</strong> ${tasaInteres}%</p>
      <p><strong>Total a pagar:</strong> $${montoTotal.toLocaleString("es-AR")}</p>
      <p><strong>Cuotas:</strong> ${cuotas} de $${cuotaValor.toLocaleString("es-AR")}</p>
    `;
  });

  const campoMonto = document.getElementById('monto');
  if (campoMonto) {
    campoMonto.addEventListener('input', function (e) {
      let valor = e.target.value.replace(/\D/g, '');
      if (valor) {
        e.target.value = Number(valor).toLocaleString('es-AR');
      } else {
        e.target.value = '';
      }
    });
  }
}

// ========== MOSTRAR RESULTADO EN FORMULARIO ==========
window.addEventListener("load", function () {
  const resumen = localStorage.getItem("resumenSimulacion");
  const resumenDiv = document.getElementById("resumen-simulacion");
  if (resumen && resumenDiv) {
    resumenDiv.innerText = resumen;
  }
});

// ========== ENVÍO DE DATOS A WHATSAPP ==========
const whatsappForm = document.getElementById("whatsappForm");
if (whatsappForm) {
  whatsappForm.addEventListener("submit", function(e) {
    e.preventDefault();

    resumenSimulacion = localStorage.getItem("resumenSimulacion") || "";
    if (!resumenSimulacion) {
      alert("Primero completá la simulación del crédito en la página anterior.");
      return;
    }

    const nombre = document.getElementById("nombre").value;
    const dni = document.getElementById("dni").value;
    const fecha = document.getElementById("fecha-nacimiento").value;
    const telefono = document.getElementById("telefono").value;
    const email = document.getElementById("email").value;
    const ocupacion = document.getElementById("ocupacion").value;
    const ingresos = document.getElementById("ingresos").value;
    const tipoEmpleo = document.getElementById("tipo-empleo").value;
    const comentarios = document.getElementById("comentarios").value;

    const mensaje =
  `📝 *Solicitud de Crédito:*\n\n` +
  `👤 *Datos Personales:*\n` +
  `📛 *Nombre:* ${nombre}\n` +
  `🆔 *DNI:* ${dni}\n` +
  `🎂 *Fecha de nacimiento:* ${fecha}\n` +
  `📞 *Teléfono:* ${telefono}\n` +
  `📧 *Email:* ${email}\n\n` +
  `💼 *Datos Laborales:*\n` +
  `🛠️ *Ocupación:* ${ocupacion}\n` +
  `💰 *Ingresos:* $${parseFloat(ingresos.replace(/\./g, '').replace(',', '.')).toLocaleString("es-AR")}\n` +
  `📂 *Tipo de empleo:* ${tipoEmpleo}\n` +
  `🗒️ *Comentarios:* ${comentarios}\n\n` +
  `${resumenSimulacion}`;

    const url = `https://wa.me/5491122696510?text=${encodeURIComponent(mensaje)}`;
    const win = window.open(url, "_blank");
    if (win) {
      setTimeout(() => window.location.href = "gracias.html", 1500);
    } else {
      alert("Permití que se abra la ventana de WhatsApp para continuar.");
    }
  });
}

// ========== TESTIMONIOS CON FORMULARIO ==========
document.addEventListener("DOMContentLoaded", () => {
  const opinionesForm = document.getElementById("opinionesForm");
  const testimoniosList = document.getElementById("testimoniosList");
  const opinionesGuardadas = JSON.parse(localStorage.getItem("opiniones")) || [];

  opinionesGuardadas.forEach(op => {
    const div = document.createElement("div");
    div.classList.add("testimonio");
    div.innerHTML = `
      ${op.estrellas ? `<div class="estrellas">${op.estrellas}</div>` : ""}
      <p>"${op.opinion}"</p>
      <p class="nombre">– ${op.nombre}</p>`;
    testimoniosList.appendChild(div);
  });

  if (opinionesForm) {
    opinionesForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = document.getElementById("nombre").value.trim();
      const opinion = document.getElementById("opinion").value.trim();
      const estrellas = document.getElementById("estrellas")?.value || "";

      if (!nombre || !opinion) {
        alert("Por favor, completá todos los campos.");
        return;
      }

      const estrellasTexto = estrellas ? '⭐'.repeat(estrellas) : "";
      const nuevaOpinion = { nombre, opinion, estrellas: estrellasTexto };

      opinionesGuardadas.push(nuevaOpinion);
      localStorage.setItem("opiniones", JSON.stringify(opinionesGuardadas));

      const div = document.createElement("div");
      div.classList.add("testimonio");
      div.innerHTML = `
        ${estrellasTexto ? `<div class="estrellas">${estrellasTexto}</div>` : ""}
        <p>"${opinion}"</p>
        <p class="nombre">– ${nombre}</p>`;
      testimoniosList.appendChild(div);

      opinionesForm.reset();
    });
  }
});

// ========== GALERÍA CON SLIDER ==========
const galeria = document.querySelector('.galeria');
if (galeria) {
  const imagenesSrc = [
    "./Imagenes/Finance oficina 1.jpeg",
    "./Imagenes/Clientes felices.jpeg",
    "./Imagenes/Asesoramiento financiero.jpeg"
  ];

  let currentIndex = 0;

  galeria.innerHTML = '';
  galeria.classList.add('galeria-slider');

  const sliderWrapper = document.createElement('div');
  sliderWrapper.classList.add('slider-wrapper');

  const imgElement = document.createElement('img');
  imgElement.classList.add('slider-img');
  imgElement.src = imagenesSrc[currentIndex];
  sliderWrapper.appendChild(imgElement);

  const prevBtn = document.createElement('button');
  prevBtn.className = 'slider-btn prev';
  prevBtn.innerHTML = '<span style="font-size: 2rem;">◀</span>';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'slider-btn next';
  nextBtn.innerHTML = '<span style="font-size: 2rem;">▶</span>';

  const controls = document.createElement('div');
  controls.classList.add('slider-controls');
  controls.appendChild(prevBtn);
  controls.appendChild(nextBtn);

  galeria.appendChild(sliderWrapper);
  galeria.appendChild(controls);

  const showImage = (index) => {
    if (index < 0) index = imagenesSrc.length - 1;
    if (index >= imagenesSrc.length) index = 0;
    imgElement.classList.add('fade');
    setTimeout(() => {
      imgElement.src = imagenesSrc[index];
      currentIndex = index;
      imgElement.classList.remove('fade');
    }, 150);
  };

  prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
}

// Ocultar header al hacer scroll hacia abajo, mostrar al subir
let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    // Bajando
    header.classList.add('oculto');
  } else {
    // Subiendo
    header.classList.remove('oculto');
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ========== FORMATEO DE INGRESOS EN FORMULARIO ==========
document.addEventListener("DOMContentLoaded", function () {
  const ingresosInput = document.getElementById("ingresos");

  if (ingresosInput) {
    ingresosInput.addEventListener("input", function () {
      let valor = this.value.replace(/\./g, "").replace(/\D/g, "");
      if (valor) {
        this.value = Number(valor).toLocaleString("es-AR");
      } else {
        this.value = "";
      }
    });
  }
});

// ✅ MENÚ HAMBURGUESA EN CELULAR
document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.querySelector(".menu-toggle");
  const navList = document.getElementById("nav-list");
  const body = document.body;

  if (toggleBtn && navList) {
    toggleBtn.addEventListener("click", function () {
      navList.classList.toggle("activo");
      body.classList.toggle("menu-abierto");
    });

    // 👇 Esto cierra el menú cuando hacés clic en un link
    document.querySelectorAll("#nav-list a").forEach(link => {
      link.addEventListener("click", () => {
        navList.classList.remove("activo");
        body.classList.remove("menu-abierto");
      });
    });
  }
});

