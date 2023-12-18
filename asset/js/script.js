const resultadoValores = document.getElementById("buscarValores");
const datosMonedas = async (moneda) => {
  try {
    const valorMoneda = await fetch(`https://mindicador.cl/api/${moneda}`);
    //utilice el modo offline porque me fallaba mucho por internet por el area del trabajo
    //aunque no importa mucho porque se debia al internet, porque al principio respondia
    //asi que no era una falla de la estructura del codigo
    if (!valorMoneda.ok) {
      throw new Error(`error en seleccion de api ${valorMoneda.status}`);
    }
    const resultados = await valorMoneda.json();
    console.log(resultados);
    return resultados.serie;
  } catch (error) {
    alert(error.message || "ocurrio un error");
  }
};

datosMonedas("dolar");

async function buscarDatos() {
  const monedaSeleccionada = document.getElementById("selectorMoneda").value;
  const valorIngresado = parseFloat(
    document.getElementById("valorInput").value
  );

  if (isNaN(valorIngresado)) {
    alert("Ingresa un valor numérico válido.");
    return;
  }

  const serie = await datosMonedas(monedaSeleccionada);
  mostrarGrafico(serie);
  const resultado = valorIngresado / serie[0].valor;
  //muy comicamente di por accidente con la accion de dividir a pesar de ser demasiado obvia.
  document.getElementById(
    "totalValor"
  ).textContent = `Resultado: ${resultado.toFixed(2)}`;
}

resultadoValores.addEventListener("click", () => {
  buscarDatos();
  //reciclando codigo de la clase anterior para aprender la funcion flecha :)
});

function mostrarGrafico(serie) {
  const labels = serie.map((data) => {
    return data.valor;
  });

  const valores = serie.map((data) => data.valor);
  //tuve muchos problemas para utilizar toLocaleDateString, por mas que lo colocara no reaccionaba la grafica
  //en el label

  const grafica = document.getElementById("myChart");
  const myChart = new Chart(grafica, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: `Valor de ${document.getElementById("selectorMoneda").value}`,
          borderColor: "red",
          data: valores,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
        },
      },
    },
  });
}
//no me dan las ideas para hacer que la grafica tenga diferentes curvas con la poca informacion que tengo en el json
//queria hacerlo por fechas pero he intentado introducirlo y no lo logre, supuse que fue porque las fechas estan en string

//tambien tuve problemas para aplicar el destroy chart