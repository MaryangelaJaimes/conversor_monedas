const button = document.querySelector("#button");
let myChart;

button.addEventListener("click", convertirMoneda);

async function getMonedas(moneda) {
  const endpoint = `https://mindicador.cl/api/${moneda}`;
  const res = await fetch(endpoint);
  const monedas = await res.json();
  return monedas;
}

async function convertirMoneda() {
  const monto = document.querySelector("#monto").value;
  const cantidad = parseFloat(monto);
  const moneda = document.getElementById("monedaSelected").value;
  if (isNaN(cantidad) || cantidad <= 0) {
    alert("Por favor, ingresa una cantidad válida.");
    return;
  }

  try {
    const data = await getMonedas(moneda);
    const exchangeRate = data.serie[0].valor;
    const convertedAmount = cantidad / exchangeRate;
    const resultado = document.querySelector("#resultado");
    resultado.textContent = `Resultado: ${cantidad} CLP = ${convertedAmount.toFixed(
      2
    )} ${moneda.toUpperCase()}`;
    await renderGrafica(data);
  } catch (error) {
    console.error("Error al obtener los datos de la API:", error);
    resultado.textContent = "Error al obtener los datos de la API.";
  }
}

function configGrafica(data) {
  const conversiones = data.serie;
  const tipoDeGrafica = "line";
  const fechaConversiones = conversiones.map((conversion) =>
    new Date(conversion.fecha).toLocaleDateString("es-CL")
  );
  const titulo = "Historial conversiones";
  const colorDeLinea = "red";
  const valores = conversiones.map((conversion) => {
    const valor = conversion.valor;
    return Number(valor);
  });
  // Creamos el objeto de configuración usando las variables anteriores
  const config = {
    type: tipoDeGrafica,
    data: {
      labels: fechaConversiones,
      datasets: [
        {
          label: titulo,
          backgroundColor: colorDeLinea,
          data: valores,
        },
      ],
    },
  };
  return config;
}

async function renderGrafica(data) {
  const config = configGrafica(data);
  const chartDOM = document.getElementById("myChart");
  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(chartDOM, config);
}
