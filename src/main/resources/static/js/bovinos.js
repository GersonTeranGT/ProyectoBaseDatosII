$(document).ready(function() {
    // Cargar datos iniciales al abrir la página
    cargarDatosIniciales();

    // Variables para manejar el timeout de la búsqueda
    var searchTimeout;

    // Aplicar filtros cuando cambien los campos
    $('#searchInput').on('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function() {
            aplicarFiltros();
        }, 300);
    });

    $('#sexoFilter, #saludFilter').on('change', function() {
        aplicarFiltros();
    });

    // Botón para limpiar filtros
    $('#clearFilters').on('click', function() {
        $('#searchInput').val('');
        $('#sexoFilter').val('');
        $('#saludFilter').val('');
        aplicarFiltros();
        showNotification('Filtros limpiados', 'success');
    });

    // Función para cargar datos iniciales
    function cargarDatosIniciales() {
        $('#bovinosTableBody').html('<tr><td colspan="8" class="text-center py-8"><i class="fas fa-spinner fa-spin fa-3x text-gray-300"></i><p class="text-gray-500 mt-2">Cargando...</p></td></tr>');

        $.ajax({
            url: '/bovinos/filtrar',
            method: 'GET',
            data: {
                search: '',
                sexo: '',
                estadoSalud: ''
            },
            success: function(data) {
                if (Array.isArray(data)) {
                    actualizarTabla(data);
                    actualizarEstadisticas();
                } else {
                    $('#bovinosTableBody').html('<tr><td colspan="8" class="text-center py-8 text-red-500"><i class="fas fa-exclamation-circle fa-3x mb-3"></i><p>Error: Formato de datos incorrecto</p></td></tr>');
                }
            },
            error: function() {
                $('#bovinosTableBody').html('<tr><td colspan="8" class="text-center py-8 text-red-500"><i class="fas fa-exclamation-circle fa-3x mb-3"></i><p>Error al cargar los datos</p><button onclick="cargarDatosIniciales()" class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"><i class="fas fa-sync-alt mr-2"></i>Reintentar</button></td></tr>');
            }
        });
    }

    // Función para aplicar filtros vía AJAX
    function aplicarFiltros() {
        var search = $('#searchInput').val();
        var sexo = $('#sexoFilter').val();
        var estadoSalud = $('#saludFilter').val();

        $('#bovinosTableBody').html('<tr><td colspan="8" class="text-center py-8"><i class="fas fa-spinner fa-spin fa-3x text-gray-300"></i><p class="text-gray-500 mt-2">Cargando...</p></td></tr>');

        $.ajax({
            url: '/bovinos/filtrar',
            method: 'GET',
            data: {
                search: search,
                sexo: sexo,
                estadoSalud: estadoSalud
            },
            success: function(data) {
                actualizarTabla(data);
                actualizarEstadisticas();
            },
            error: function() {
                $('#bovinosTableBody').html('<tr><td colspan="8" class="text-center py-8 text-red-500"><i class="fas fa-exclamation-circle fa-3x mb-3"></i><p>Error al cargar los datos</p></td></tr>');
            }
        });
    }

    // Función para actualizar la tabla con los resultados
    function actualizarTabla(bovinos) {
        var tbody = $('#bovinosTableBody');
        tbody.empty();

        if (bovinos && bovinos.length > 0) {
            $.each(bovinos, function(index, bovino) {
                var fila = crearFilaBovino(bovino, index);
                tbody.append(fila);
            });

            $('.bovino-row').each(function(index) {
                $(this).css('animation', `fadeIn 0.5s ease forwards ${index * 0.1}s`);
            });

            $('#totalRegistros').text(bovinos.length + ' registros mostrados');
        } else {
            var noResultsRow = `
                <tr class="no-results-row">
                    <td colspan="8" class="text-center py-8">
                        <i class="fas fa-search fa-3x text-gray-300 mb-3"></i>
                        <p class="text-gray-500 text-lg">No se encontraron resultados</p>
                        <button onclick="$('#clearFilters').click()" class="mt-3 text-green-600 hover:text-green-800">
                            <i class="fas fa-undo mr-1"></i>Limpiar filtros
                        </button>
                    </td>
                </tr>
            `;
            tbody.append(noResultsRow);
            $('#totalRegistros').text('0 registros mostrados');
        }
    }

    // Función para crear una fila de la tabla - CORREGIDA CON ID
    function crearFilaBovino(bovino, index) {
        // Determinar clase para el badge de sexo
        var sexoClass = bovino.sexo === 'Macho' ? 'macho' : 'hembra';
        var sexoIcon = bovino.sexo === 'Macho' ? 'fa-mars' : 'fa-venus';

        // Determinar clase para el badge de estado
        var estadoClass = '';
        var estadoIcon = '';
        var estadoSalud = bovino.estadoSalud || '';

        switch(estadoSalud) {
            case 'Saludable':
                estadoClass = 'saludable';
                estadoIcon = 'fa-check-circle';
                break;
            case 'En tratamiento':
                estadoClass = 'tratamiento';
                estadoIcon = 'fa-medkit';
                break;
            case 'En observación':
                estadoClass = 'observacion';
                estadoIcon = 'fa-eye';
                break;
            case 'Crítico':
                estadoClass = 'critico';
                estadoIcon = 'fa-exclamation-triangle';
                break;
            default:
                estadoClass = 'default';
                estadoIcon = 'fa-question-circle';
        }

        // Formatear fecha de nacimiento
        var fechaNacimiento = '';
        if (bovino.fechaNacimiento) {
            try {
                var fechaStr = bovino.fechaNacimiento.toString();
                fechaStr = fechaStr.replace(/\//g, '-');
                var fecha = new Date(fechaStr + 'T00:00:00');

                if (!isNaN(fecha.getTime())) {
                    var dia = fecha.getDate().toString().padStart(2, '0');
                    var mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                    var anio = fecha.getFullYear();
                    fechaNacimiento = dia + '/' + mes + '/' + anio;
                } else {
                    fechaNacimiento = fechaStr.substring(0, 10);
                }
            } catch(e) {
                fechaNacimiento = bovino.fechaNacimiento.toString().substring(0, 10);
            }
        } else {
            fechaNacimiento = '<span class="text-gray-400">—</span>';
        }

        // CORRECCIÓN: El ID viene como 'id' desde el backend con @JsonIgnoreProperties
        var id = bovino.id || '';

        // Construir la fila
        return '<tr class="bovino-row ' + (index % 2 === 0 ? '' : 'bg-gray-50') + ' hover:bg-gray-100">' +
               '<td class="font-medium text-gray-900">' + id + '</td>' +
               '<td>' + (bovino.codigoArete || '') + '</td>' +
               '<td class="font-semibold">' + (bovino.nombreBovino || '') + '</td>' +
               '<td><span class="sexo-badge ' + sexoClass + '">' +
               '<i class="fas ' + sexoIcon + ' mr-1"></i>' + (bovino.sexo || '') + '</span></td>' +
               '<td class="font-medium">' + (bovino.peso ? parseFloat(bovino.peso).toFixed(1) : '0') + ' kg</td>' +
               '<td class="text-gray-600">' + fechaNacimiento + '</td>' +
               '<td><span class="estado-badge">' +
               '<span class="' + estadoClass + '">' +
               '<i class="fas ' + estadoIcon + ' mr-1"></i>' + estadoSalud + '</span>' +
               '</span></td>' +
               '<td><div class="acciones-container">' +
               '<a href="/bovinos/editar/' + id + '" class="btn-editar" title="Editar"><i class="fas fa-edit"></i></a>' +
               '<a href="/bovinos/eliminar/' + id + '" class="btn-eliminar" title="Eliminar" onclick="return confirm(\'¿Estás seguro de eliminar este bovino?\')"><i class="fas fa-trash-alt"></i></a>' +
               '</div></td></tr>';
    }

    // Función para actualizar estadísticas
    function actualizarEstadisticas() {
        $.ajax({
            url: '/bovinos/estadisticas',
            method: 'GET',
            success: function(data) {
                $('#totalBovinos').text(data.totalBovinos || 0);
                $('#totalMachos').text(data.totalMachos || 0);
                $('#totalHembras').text(data.totalHembras || 0);
                $('#totalSaludables').text(data.totalSaludables || 0);
                $('#pesoPromedio').text((data.pesoPromedio || '0') + ' kg');
            }
        });
    }

    // Función para mostrar notificaciones
    window.showNotification = function(message, type) {
        if ($('#notification-container').length === 0) {
            $('body').append('<div id="notification-container" style="position: fixed; top: 20px; right: 20px; z-index: 9999;"></div>');
        }

        var borderColor = type === 'success' ? '#10b981' : '#ef4444';
        var iconColor = type === 'success' ? 'text-green-500' : 'text-red-500';
        var icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';

        var notification = $(`
            <div class="notification ${type}" style="background: white; border-left: 4px solid ${borderColor}; box-shadow: 0 4px 6px rgba(0,0,0,0.1); padding: 1rem; margin-bottom: 0.5rem; border-radius: 0.375rem; animation: slideInRight 0.3s ease; display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas ${icon} ${iconColor}"></i>
                <span>${message}</span>
            </div>
        `);

        $('#notification-container').append(notification);

        setTimeout(function() {
            notification.fadeOut(300, function() {
                $(this).remove();
            });
        }, 3000);
    };
});

// Estilo adicional para animaciones
$('<style>')
    .prop('type', 'text/css')
    .html(`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `)
    .appendTo('head');