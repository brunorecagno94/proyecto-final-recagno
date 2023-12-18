//Sweet Alert 2


const URL = "js/cotizacion.json";
const cotizacionDolar = [];

// Función para agregar un familiar al array
agregarFamiliar = (nombre, edad, empleado, arrayFamiliares) => {
  if (!nombre || !edad) {
    Swal.fire({
      icon: "error",
      title: "Por favor, complete todos los campos para continuar"
    });
  } else {
    const familiar = {
      "nombreCompleto": nombre,
      "edad": edad,
      "empleado": empleado
    };
    Swal.fire({
      icon: "success",
      title: "¡Familiar agregado!"
    });
    arrayFamiliares.push(familiar);
  }
}

// Función para guardar datos de los familiares individualmente en localStorage
guardarDatos = arrayFamiliares => {
  for (let i = 0; i < arrayFamiliares.length; i++) {
    localStorage.setItem(`familiar${i}`, JSON.stringify(arrayFamiliares[i]));
  }
}

// Función para habilitar la sección de cotización
habilitarCotizacion = (arrayFamiliares, formMiddleSection, URL) => {
  if (arrayFamiliares.length <= 0) {
    alert('Debe ingresar al menos un familiar para calcular la garantía');
  } else {
    //Esconde el contenido anterior para mostrar el nuevo
    document.getElementById('form-main').style.display = 'none';
    formMiddleSection.innerHTML = "";

    for (let i = 0; i < localStorage.length; i++) {
      const clave = localStorage.key(i);
      const valorGuardado = localStorage.getItem(clave);

      if (JSON.parse(valorGuardado).empleado == true) {
        formMiddleSection.innerHTML += `
          <div class="input-group">
            <label for="ingresos" class="input-label">¿Cuáles son los ingresos de ${JSON.parse(valorGuardado).nombreCompleto}?</label>
            <input type="number" id="ingresos" class="form-input">
          </div>`;
      }
    }

    formMiddleSection.innerHTML += `
      <div class="form-btn" id="calcular-cotizacion">Calcular cotización</div>
      <span class="form-description">Los ingresos totales deben ser como mínimo $50.000</span>`;
  }

  calcularCotizacion(formMiddleSection);
}

// Función para calcular la cotización
calcularCotizacion = async (formMiddleSection) => {
  document.getElementById('calcular-cotizacion').addEventListener('click', async () => {
    const inputsIngresos = document.querySelectorAll('#ingresos');
    let totalIngresos = 0;

    for (let ingreso of inputsIngresos) {
      totalIngresos += Number(ingreso.value);
    }

    // Limpiar el contenido previo para mostrar el cálculo
    formMiddleSection.innerHTML = "";

    if (totalIngresos < 50000) {
      document.getElementById('form-footer').innerHTML = `
        <p class='footer-alert'>Lo sentimos, sus ingresos no son suficientes como para solicitar una garantía.</p>`;
    } else {
      document.getElementById('form-footer').innerHTML = `
        <p class='footer-alert'>¡Felicidades! Sus ingresos son de <strong>$${totalIngresos}</strong>, suficientes para solicitar una garantía.</p>`;

      // Espera a que se obtenga la cotización del dólar antes de continuar
      await obtenerCotizacionDolar(URL);
      calcularDolares(totalIngresos);
    }
  });
}

//Trae el archivo json con las cotizaciones del dólar
obtenerCotizacionDolar = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  cotizacionDolar.push(data);
}

// Convierte los ingresos totales a dólares
calcularDolares = (totalIngresos) => {
  if (cotizacionDolar.length === 0) {
    console.error('No se han cargado las cotizaciones del dólar.');
    return;
  }

  const ingresosDolaresHTML = `
    <div id='ingresos-dolares'>
      <span id='ingresos-dolares' class='footer-alert'> Ingresos en dólares: </span>
      <div class='ingresos-dolares__group'>
        <span class='ingresos-dolares__title'>${cotizacionDolar[0][0].tipo}:</span>
        <span class='ingresos-dolares__item'>US$ ${Math.round(totalIngresos / cotizacionDolar[0][0].compra)}</span>
      </div>
      <div class='ingresos-dolares__group'>
        <span class='ingresos-dolares__title'>${cotizacionDolar[0][1].tipo}:</span>
        <span class='ingresos-dolares__item'>US$ ${Math.round(totalIngresos / cotizacionDolar[0][1].compra)}</span>
      </div>    
    </div>`;

  document.getElementById('form-footer').innerHTML += ingresosDolaresHTML;
}


/* Espera 3 segundos a que cargue el documento para detectar correctamente
  todos los elementos del DOM */
setTimeout(() => {
  localStorage.clear();
  const nombreCompleto = document.getElementById('nombre');
  const edad = document.getElementById('edad');
  const empleado = document.getElementById('empleado');
  const formMiddleSection = document.getElementById('form-middle');
  const familiares = [];

  // Funcionalidades de botones "Agregar familiar" y "Continuar"
  document.getElementById('agregar-familiar').addEventListener('click', () => {
    agregarFamiliar(nombreCompleto.value, edad.value, empleado.checked, familiares);
    nombreCompleto.value = "";
    edad.value = "";
  });

  document.getElementById('continuar').addEventListener('click', () => {
    guardarDatos(familiares);
    habilitarCotizacion(familiares, formMiddleSection);
  });
}, 3000);
