// bovinos.js - Versión con AJAX manteniendo estilos originales

$(document).ready(function() {

    // Variables para manejar el timeout de la búsqueda
    var searchTimeout;

    // Aplicar filtros cuando cambien los campos
    $('#searchInput').on('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function() {
            aplicarFiltros();
        }, 300); // Espera 300ms después de que el usuario deje de escribir
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

    // Función para aplicar filtros vía AJAX
    function aplicarFiltros() {
        var search = $('#searchInput').val();
        var sexo = $('#sexoFilter').val();
        var estadoSalud = $('#saludFilter').val();

        // Mostrar indicador de carga
        $('#bovinosTableBody').html('<tr><td colspan="7" class="text-center py-8"><i class="fas fa-spinner fa-spin fa-3x text-gray-300"></i><p class="text-gray-500 mt-2">Cargando...</p></td></tr>');

        // Realizar petición AJAX
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
            error: function(error) {
                console.error("Error al filtrar:", error);
                $('#bovinosTableBody').html('<tr><td colspan="7" class="text-center py-8 text-red-500"><i class="fas fa-exclamation-circle fa-3x mb-3"></i><p>Error al cargar los datos</p></td></tr>');
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

            // Aplicar animaciones a las nuevas filas
            $('.bovino-row').each(function(index) {
                $(this).css('animation', `fadeIn 0.5s ease forwards ${index * 0.1}s`);
            });

            // Actualizar contador de registros
            $('#totalRegistros').text(bovinos.length + ' registros mostrados');
        } else {
            // Mostrar mensaje de sin resultados con el mismo estilo del JS original
            var noResultsRow = `
                <tr class="no-results-row">
                    <td colspan="7" class="text-center py-8">
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

    // Función para crear una fila de la tabla - EXACTAMENTE con los estilos originales
    function crearFilaBovino(bovino, index) {
        // Determinar clase para el badge de sexo
        var sexoClass = bovino.sexo === 'Macho' ? 'macho' : 'hembra';
        var sexoIcon = bovino.sexo === 'Macho' ? 'fa-mars' : 'fa-venus';

        // Determinar clase para el badge de estado
        var estadoClass = '';
        var estadoIcon = '';

        switch(bovino.estadoSalud) {
            case 'Saludable':
                estadoClass = 'saludable';
                estadoIcon = 'fa-check-circle';
                break;
            case 'En tratamiento':
                estadoClass = 'tratamiento';
                estadoIcon = 'fa-medkit';
                break;
            case 'Observación':
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

        // Construir la fila con la misma estructura HTML del JS original
        return '<tr class="bovino-row ' + (index % 2 === 0 ? '' : 'bg-gray-50') + ' hover:bg-gray-100">' +
               '<td class="font-medium text-gray-900">' + (bovino.id || '') + '</td>' +
               '<td>' + (bovino.codigoArete || '') + '</td>' +
               '<td class="font-semibold">' + (bovino.nombreBovino || '') + '</td>' +
               '<td><span class="sexo-badge ' + sexoClass + '">' +
               '<i class="fas ' + sexoIcon + ' mr-1"></i>' + (bovino.sexo || '') + '</span></td>' +
               '<td class="font-medium">' + (bovino.peso ? bovino.peso.toFixed(1) : '0') + ' kg</td>' +
               '<td><span class="estado-badge">' +
               '<span class="' + estadoClass + '">' +
               '<i class="fas ' + estadoIcon + ' mr-1"></i>' + (bovino.estadoSalud || '') + '</span>' +
               '</span></td>' +
               '<td><div class="acciones-container">' +
               '<a href="/bovinos/editar/' + bovino.id + '" class="btn-editar" title="Editar"><i class="fas fa-edit"></i></a>' +
               '<a href="/bovinos/ver/' + bovino.id + '" class="btn-ver" title="Ver detalles"><i class="fas fa-eye"></i></a>' +
               '<a href="/bovinos/eliminar/' + bovino.id + '" class="btn-eliminar" title="Eliminar" onclick="return confirm(\'¿Estás seguro de eliminar este bovino?\')"><i class="fas fa-trash-alt"></i></a>' +
               '</div></td></tr>';
    }

    // Función para actualizar estadísticas
    function actualizarEstadisticas() {
        $.ajax({
            url: '/bovinos/estadisticas',
            method: 'GET',
            success: function(data) {
                $('#totalBovinos').text(data.totalBovinos);
                $('#totalMachos').text(data.totalMachos);
                $('#totalHembras').text(data.totalHembras);
                $('#totalSaludables').text(data.totalSaludables);
                $('#pesoPromedio').text(data.pesoPromedio + ' kg');
            },
            error: function(error) {
                console.error("Error al actualizar estadísticas:", error);
            }
        });
    }

    // Función para mostrar notificaciones (del JS original)
    window.showNotification = function(message, type) {
        // Crear elemento de notificación si no existe
        if ($('#notification-container').length === 0) {
            $('body').append('<div id="notification-container" style="position: fixed; top: 20px; right: 20px; z-index: 9999;"></div>');
        }

        let notification = $(`
            <div class="notification ${type}" style="
                background: white;
                border-left: 4px solid ${type === 'success' ? '#10b981' : '#ef4444'};
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                padding: 1rem;
                margin-bottom: 0.5rem;
                border-radius: 0.375rem;
                animation: slideInRight 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            ">
                <i class="fas ${type === 'success' ? 'fa-check-circle text-green-500' : 'fa-exclamation-circle text-red-500'}"></i>
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

// Función global para confirmar eliminación (del JS original)
function confirmarEliminacion(nombre) {
    return confirm('¿Estás seguro de que deseas eliminar a ' + nombre + '? Esta acción no se puede deshacer.');
}

// Estilo adicional para animaciones (del JS original)
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