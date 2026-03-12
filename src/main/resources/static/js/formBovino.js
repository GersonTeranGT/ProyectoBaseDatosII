document.addEventListener('DOMContentLoaded', function() {
    console.log('Formulario de bovinos cargado');

    // Elementos del formulario
    const form = document.getElementById('bovinoForm');
    const btnGuardar = document.getElementById('btnGuardar');
    const codigoArete = document.getElementById('codigoArete');
    const nombre = document.getElementById('nombreBovino');
    const peso = document.getElementById('peso');
    const fechaNacimiento = document.getElementById('fechaNacimiento'); // NUEVO
    const estadoSalud = document.getElementById('estadoSalud');
    const radiosSexo = document.querySelectorAll('input[name="sexo"]');

    // Crear elementos de error para fecha si no existen
    if (fechaNacimiento && !document.getElementById('errorFechaNacimiento')) {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'errorFechaNacimiento';
        errorDiv.className = 'form-error';
        fechaNacimiento.parentElement.parentElement.appendChild(errorDiv);
    }

    // Validación en tiempo real
    if (codigoArete) {
        codigoArete.addEventListener('input', function() {
            validarCodigoArete(this.value);
        });
    }

    if (nombre) {
        nombre.addEventListener('input', function() {
            validarNombre(this.value);
        });
    }

    if (peso) {
        peso.addEventListener('input', function() {
            validarPeso(this.value);
        });
    }

    // NUEVO: Validación de fecha
    if (fechaNacimiento) {
        fechaNacimiento.addEventListener('change', function() {
            validarFechaNacimiento(this.value);
        });

        // Validar también al perder el foco
        fechaNacimiento.addEventListener('blur', function() {
            validarFechaNacimiento(this.value);
        });
    }

    if (estadoSalud) {
        estadoSalud.addEventListener('change', function() {
            validarEstadoSalud(this.value);
        });
    }

    // Función para guardar (simulada)
    window.guardarBovino = function(event) {
        event.preventDefault();

        // Validar todo antes de enviar
        if (!validarFormulario()) {
            mostrarMensaje('Por favor corrige los errores en el formulario', 'error');
            return false;
        }

        // Deshabilitar botón mientras se procesa
        btnGuardar.disabled = true;
        btnGuardar.innerHTML = '<span class="spinner"></span> Guardando...';

        // Recoger datos del formulario
        const formData = {
            codigoArete: document.getElementById('codigoArete').value,
            nombreBovino: document.getElementById('nombreBovino').value,
            sexo: document.querySelector('input[name="sexo"]:checked')?.value,
            peso: parseFloat(document.getElementById('peso').value),
            fechaNacimiento: document.getElementById('fechaNacimiento')?.value || '', // NUEVO
            estadoSalud: document.getElementById('estadoSalud').value,
            raza: document.getElementById('raza')?.value || '',
            color: document.getElementById('color')?.value || '',
            observaciones: document.getElementById('observaciones')?.value || ''
        };

        console.log('Datos del formulario:', formData);
        console.log('Fecha de nacimiento (formato PostgreSQL):', formData.fechaNacimiento);

        // Simular envío (aquí iría la petición al servidor)
        setTimeout(function() {
            // Mostrar mensaje de éxito
            mostrarMensaje('¡Bovino registrado exitosamente!', 'success');

            // Restaurar botón
            btnGuardar.disabled = false;
            btnGuardar.innerHTML = '<i class="fas fa-save mr-2"></i> Guardar Bovino';

            // Redirigir después de 2 segundos
            setTimeout(function() {
                window.location.href = '/bovinos';
            }, 2000);

        }, 1500);

        return false;
    };

    // Validaciones
    function validarCodigoArete(valor) {
        const errorDiv = document.getElementById('errorCodigoArete');
        valor = valor.trim();

        if (!valor) {
            mostrarError('codigoArete', 'El código de arete es obligatorio', errorDiv);
            return false;
        }

        if (valor.length < 5 || valor.length > 15) {
            mostrarError('codigoArete', 'El código debe tener entre 5 y 15 caracteres', errorDiv);
            return false;
        }

        // Validar formato: LETRAS-NUMEROS (ej: HOL-001)
        const formatoValido = /^[A-Za-z]{3,4}-\d{3,4}$/.test(valor);
        if (!formatoValido) {
            mostrarError('codigoArete', 'Formato sugerido: RAZA-001 (Ej: HOL-001)', errorDiv);
            return false;
        }

        ocultarError('codigoArete', errorDiv);
        return true;
    }

    function validarNombre(valor) {
        const errorDiv = document.getElementById('errorNombre');
        valor = valor.trim();

        if (!valor) {
            mostrarError('nombreBovino', 'El nombre es obligatorio', errorDiv);
            return false;
        }

        if (valor.length < 2 || valor.length > 50) {
            mostrarError('nombreBovino', 'El nombre debe tener entre 2 y 50 caracteres', errorDiv);
            return false;
        }

        ocultarError('nombreBovino', errorDiv);
        return true;
    }

    function validarSexo() {
        const errorDiv = document.getElementById('errorSexo');
        const seleccionado = document.querySelector('input[name="sexo"]:checked');

        if (!seleccionado) {
            errorDiv.textContent = 'Debes seleccionar un sexo';
            errorDiv.classList.add('visible');
            return false;
        }

        errorDiv.classList.remove('visible');
        return true;
    }

    function validarPeso(valor) {
        const errorDiv = document.getElementById('errorPeso');
        const pesoNum = parseFloat(valor);

        if (!valor || isNaN(pesoNum)) {
            mostrarError('peso', 'El peso es obligatorio', errorDiv);
            return false;
        }

        if (pesoNum <= 0) {
            mostrarError('peso', 'El peso debe ser mayor a 0 kg', errorDiv);
            return false;
        }

        if (pesoNum > 2000) {
            mostrarError('peso', 'El peso no puede exceder 2000 kg', errorDiv);
            return false;
        }

        ocultarError('peso', errorDiv);
        return true;
    }

    // NUEVA FUNCIÓN: Validar fecha de nacimiento
    function validarFechaNacimiento(valor) {
        const errorDiv = document.getElementById('errorFechaNacimiento');

        if (!valor) {
            mostrarError('fechaNacimiento', 'La fecha de nacimiento es obligatoria', errorDiv);
            return false;
        }

        // Validar formato YYYY-MM-DD
        const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!fechaRegex.test(valor)) {
            mostrarError('fechaNacimiento', 'Formato inválido. Use YYYY-MM-DD (Ej: 2024-05-15)', errorDiv);
            return false;
        }

        // Validar que sea una fecha real
        const fecha = new Date(valor + 'T00:00:00');
        if (isNaN(fecha.getTime())) {
            mostrarError('fechaNacimiento', 'La fecha no es válida', errorDiv);
            return false;
        }

        // Validar que no sea una fecha futura
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (fecha > hoy) {
            mostrarError('fechaNacimiento', 'La fecha de nacimiento no puede ser futura', errorDiv);
            return false;
        }

        // Validar que no sea demasiado antigua (más de 20 años)
        const hace20Anios = new Date();
        hace20Anios.setFullYear(hace20Anios.getFullYear() - 20);
        if (fecha < hace20Anios) {
            mostrarError('fechaNacimiento', 'La fecha parece demasiado antigua (más de 20 años)', errorDiv);
            return false;
        }

        ocultarError('fechaNacimiento', errorDiv);
        return true;
    }

    function validarEstadoSalud(valor) {
        const errorDiv = document.getElementById('errorEstadoSalud');

        if (!valor) {
            mostrarError('estadoSalud', 'Debes seleccionar un estado de salud', errorDiv);
            return false;
        }

        ocultarError('estadoSalud', errorDiv);
        return true;
    }

    function mostrarError(campoId, mensaje, errorDiv) {
        const campo = document.getElementById(campoId);
        if (campo) campo.classList.add('error');
        if (errorDiv) {
            errorDiv.textContent = mensaje;
            errorDiv.classList.add('visible');
        }
    }

    function ocultarError(campoId, errorDiv) {
        const campo = document.getElementById(campoId);
        if (campo) campo.classList.remove('error');
        if (errorDiv) {
            errorDiv.classList.remove('visible');
        }
    }

    function validarFormulario() {
        const codigoValido = validarCodigoArete(codigoArete.value);
        const nombreValido = validarNombre(nombre.value);
        const sexoValido = validarSexo();
        const pesoValido = validarPeso(peso.value);
        const fechaValida = validarFechaNacimiento(fechaNacimiento.value); // NUEVO
        const estadoValido = validarEstadoSalud(estadoSalud.value);

        return codigoValido && nombreValido && sexoValido && pesoValido && fechaValida && estadoValido;
    }

    function mostrarMensaje(mensaje, tipo) {
        // Crear elemento de mensaje si no existe
        let msgDiv = document.getElementById('mensajeConfirmacion');
        if (!msgDiv) {
            msgDiv = document.createElement('div');
            msgDiv.id = 'mensajeConfirmacion';
            document.querySelector('.form-actions').after(msgDiv);
        }

        msgDiv.textContent = mensaje;
        msgDiv.className = tipo; // 'success' o 'error'
        msgDiv.classList.remove('hidden');

        // Ocultar después de 5 segundos si es de error
        if (tipo === 'error') {
            setTimeout(function() {
                msgDiv.classList.add('hidden');
            }, 5000);
        }
    }

    // Tooltips personalizados
    const labels = document.querySelectorAll('.form-label');
    labels.forEach(label => {
        label.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        label.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Si es edición, validar la fecha inicial
    if (fechaNacimiento && fechaNacimiento.value) {
        validarFechaNacimiento(fechaNacimiento.value);
    }
});