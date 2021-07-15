const container = document.querySelector(".container ");
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");

window.addEventListener("load", () => {
  formulario.addEventListener("submit", buscarClima);
});

function buscarClima(e) {
  e.preventDefault();

  const ciudad = document.queryCommandIndeterm("#ciudad").value;
  const pais = document.querySelector("#pais").value;

  if (ciudad === "" || pais === "") {
    mostrarError("Ambos campos son obligatorios");

    return;
  }

  //  Consultar API

  consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
  const alerta = document.querySelector(".bg-red-100");
  if (!alerta) {
    const alerta = document.createElement("div");

    alerta.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounder",
      "max-w-md",
      "mx-auto",
      "mt-6",
      "text-center"
    );

    alerta.innerHTML = `
  <strong class="font-bold">Error!</strong>
  <span class="block">${mensaje}</span>
  `;

    container.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

function consultarAPI(ciudad, pais) {
  const appID = "2b86773594a6c75ec4d3c579d59e296c";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;

  Spinner();
  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      limpiarHTML();
      if (datos.cod === "404") {
        mostrarError("Ciudad no encontrada");

        return;
      }

      mostrarClima(datos);
    });
}

function mostrarClima(datos) {
  const {
    name,
    main: { temp, temp_max, temp_min },
  } = datos;

  const centigrados = kelvinACentigrados(temp);
  const max = kelvinACentigrados(temp_max);
  const min = kelvinACentigrados(temp_min);

  const nombreCiudad = document.createElement("p");
  nombreCiudad.textContent = `Clima en ${name}`;
  nombreCiudad.classList.add("font-bold", "text-2xl");

  const tempActual = document.createElement("p");
  tempActual.innerHTML = `${centigrados} &#8451;`;
  tempActual.classList.add("font-bold", "text-6xl");

  const tempMaxima = document.createElement("p");
  tempMaxima.innerHTML = `Max:${max} &#8451;`;
  tempMaxima.classList.add("text-xl");

  const tempMinima = document.createElement("p");
  tempMinima.innerHTML = `Min:${min} &#8451;`;
  tempMinima.classList.add("text-xl");

  const resultadoDiv = document.createElement("div");
  resultadoDiv.classList.add("text-center", "text-white");

  resultadoDiv.appendChild(nombreCiudad);
  resultadoDiv.appendChild(tempActual);
  resultadoDiv.appendChild(tempMaxima);
  resultadoDiv.appendChild(tempMinima);

  resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = (grados) => parseInt(grados - 273.15);

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function Spinner() {
  limpiarHTML();
  const divSpinner = document.createElement("div");
  divSpinner.classList.add("spinner");

  divSpinner.innerHTML = `

  <div class="double-bounce1"></div>
  <div class="double-bounce2"></div>

    `;

  resultado.appendChild(divSpinner);
}
