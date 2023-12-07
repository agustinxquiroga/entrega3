document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("formulario");
    const partesContainer = document.getElementById("partesContainer");
    const resultadoDiv = document.getElementById("resultado");
    const cuentasAnterioresBtn = document.getElementById("cuentasAnterioresBtn");

    // Cargar datos desde localStorage al iniciar la aplicación
    let partesInvolucradas = cargarDatosDesdeLocalStorage();

    formulario.addEventListener("submit", function (event) {
        event.preventDefault();

        const cantidadPartes = parseInt(document.getElementById("cantidadPartes").value);

        partesContainer.innerHTML = "";

        for (let i = 0; i < cantidadPartes; i++) {
            const divParte = document.createElement("div");
            divParte.innerHTML = `
                <label for="nombreParte${i}">Nombre de la persona ${i + 1}:</label>
                <input type="text" id="nombreParte${i}" required>

                <label for="dineroParte${i}">Dinero invertido por ${i + 1}:</label>
                <input type="number" id="dineroParte${i}" step="0.01" required>
            `;
            partesContainer.appendChild(divParte);
        }

        // Después de ingresar la información, mostramos el formulario para calcular deudas
        const botonCalcular = document.createElement("button");
        botonCalcular.textContent = "Calcular Deudas";
        botonCalcular.addEventListener("click", function () {
            const partes = [];

            for (let i = 0; i < cantidadPartes; i++) {
                const nombre = document.getElementById(`nombreParte${i}`).value;
                const dineroInvertido = parseFloat(document.getElementById(`dineroParte${i}`).value);

                partes.push({ nombre, dineroInvertido });
            }

            const totalAPagar = partes.reduce(function (total, parte) {
                return total + parte.dineroInvertido;
            }, 0);

            // Guardar datos en localStorage
            guardarDatosEnLocalStorage(partes);

            mostrarResumen(totalAPagar, partes);
        });

        resultadoDiv.innerHTML = "";
        resultadoDiv.appendChild(botonCalcular);
    });

    // Agregar evento al botón de "Cuentas Anteriores"
    cuentasAnterioresBtn.addEventListener("click", function () {
        mostrarCuentasAnteriores();
    });

    function cargarDatosDesdeLocalStorage() {
        const datosGuardados = localStorage.getItem("partesInvolucradas");
        return datosGuardados ? JSON.parse(datosGuardados) : [];
    }

    function guardarDatosEnLocalStorage(partes) {
        localStorage.setItem("partesInvolucradas", JSON.stringify(partes));
    }

    function mostrarCuentasAnteriores() {
        const cuentasAnteriores = cargarDatosDesdeLocalStorage();

        if (cuentasAnteriores.length > 0) {
            // Limpiamos el contenido anterior
            resultadoDiv.innerHTML = "";

            // Mostramos las cuentas anteriores
            cuentasAnteriores.forEach(function (cuenta, index) {
                resultadoDiv.innerHTML += `<p>Cuenta anterior ${index + 1}:</p>`;
                resultadoDiv.innerHTML += `<p>Total de la cuenta a pagar: $${cuenta.total.toFixed(2)}</p>`;

                cuenta.partes.forEach(function (parte) {
                    resultadoDiv.innerHTML += `<p>${parte.nombre} invirtió $${parte.dineroInvertido.toFixed(2)}</p>`;
                });

                resultadoDiv.innerHTML += "<hr>";
            });
        } else {
            alert("No hay cuentas anteriores almacenadas.");
        }
    }

    function mostrarResumen(total, partes) {
        // Ocultamos el formulario y resultados anteriores
        formulario.style.display = "none";
        partesContainer.style.display = "none";
        resultadoDiv.innerHTML = ""; // Limpiamos el contenido anterior

        // Mostramos el total de la cuenta
        resultadoDiv.innerHTML += `<p>Total de la cuenta a pagar: $${total.toFixed(2)}</p>`;

        const montoPorParte = total / partes.length;

        partes.forEach(function (deudor) {
            const deuda = montoPorParte - deudor.dineroInvertido;

            if (deuda > 0) {
                const acreedores = partes.filter(function (acreedor) {
                    return acreedor !== deudor && acreedor.dineroInvertido >= montoPorParte;
                });

                acreedores.forEach(function (acreedor) {
                    resultadoDiv.innerHTML += `<p>${deudor.nombre} debe $${deuda.toFixed(2)} a ${acreedor.nombre}</p>`;
                });
            }
        });

        // Agregamos el botón para finalizar el programa
        const botonFinalizar = document.createElement("button");
        botonFinalizar.textContent = "Finalizar Programa";
        botonFinalizar.addEventListener("click", function () {
            // Ocultamos el contenido de los resultados
            resultadoDiv.innerHTML = "";

            // Mostramos el mensaje de salida y botón para volver a la página principal
            const mensajeSalida = document.createElement("p");
            mensajeSalida.textContent = "Muchas gracias por usar el simulador.";
            resultadoDiv.appendChild(mensajeSalida);

            const botonVolver = document.createElement("button");
            botonVolver.textContent = "Volver a la Página Principal";
            botonVolver.addEventListener("click", function () {
                location.reload(); // Recargar la página para reiniciar
            });

            resultadoDiv.appendChild(botonVolver);
        });

        resultadoDiv.appendChild(botonFinalizar);
    }
});
