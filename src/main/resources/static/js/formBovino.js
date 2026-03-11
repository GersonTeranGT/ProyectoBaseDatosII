document.addEventListener('DOMContentLoaded', function() {
    console.log('Formulario de bovinos cargado');

    // Elementos del formulario
    const form = document.getElementById('bovinoForm');
    const btnGuardar = document.getElementById('btnGuardar');
    const codigoArete = document.getElementById('codigoArete');
    const nombre = document.getElementById('nombreBovino');
    const peso = document.getElementById('peso');
    const estadoSalud = document.getElementById('estadoSalud');
    const radiosSexo = document.querySelectorAll('input[name="sexo"]');

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
            estadoSalud: document.getElementById('estadoSalud').value,
            raza: document.getElementById('raza')?.value || '',
            fechaNacimiento: document.getElementById('fechaNacimiento')?.value || '',
            color: document.getElementById('color')?.value || '',
            observaciones: document.getElementById('observaciones')?.value || ''
        };

        console.log('Datos del formulario:', formData);

        // Simular envío (aquí iría la petición al servidor)
        setTimeout(function() {
            // Mostrar mensaje de éxito
            mostrarMensaje('¡Bovino registrado exitosamente!', 'success');

            // Restaurar botón
            btnGuardar.disabled = false;
            btnGuardar.innerHTML = '<i class="fas fa-save mr-2"></i> Guardar Bovino';

            // Opcional: limpiar formulario
            // form.reset();

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
        campo.classList.add('error');
        errorDiv.textContent = mensaje;
        errorDiv.classList.add('visible');
    }

    function ocultarError(campoId, errorDiv) {
        const campo = document.getElementById(campoId);
        campo.classList.remove('error');
        errorDiv.classList.remove('visible');
    }

    function validarFormulario() {
        const codigoValido = validarCodigoArete(codigoArete.value);
        const nombreValido = validarNombre(nombre.value);
        const sexoValido = validarSexo();
        const pesoValido = validarPeso(peso.value);
        const estadoValido = validarEstadoSalud(estadoSalud.value);

        return codigoValido && nombreValido && sexoValido && pesoValido && estadoValido;
    }

    function mostrarMensaje(mensaje, tipo) {
        const msgDiv = document.getElementById('mensajeConfirmacion');
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
});