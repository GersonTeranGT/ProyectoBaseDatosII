$(document).ready(function() {

    // Búsqueda en tiempo real
    $('#searchInput').on('keyup', function() {
        filterTable();
    });

    // Filtros por sexo y estado de salud
    $('#sexoFilter, #saludFilter').on('change', function() {
        filterTable();
    });

    // Botón limpiar filtros
    $('#clearFilters').on('click', function() {
        $('#searchInput').val('');
        $('#sexoFilter').val('');
        $('#saludFilter').val('');
        filterTable();
        showNotification('Filtros limpiados', 'success');
    });

    // Función para filtrar la tabla
    function filterTable() {
        let searchText = $('#searchInput').val().toLowerCase();
        let sexoFilter = $('#sexoFilter').val();
        let saludFilter = $('#saludFilter').val();
        let visibleCount = 0;

        $('.bovino-row').each(function() {
            let row = $(this);
            let nombre = row.find('td:eq(2)').text().toLowerCase();
            let arete = row.find('td:eq(1)').text().toLowerCase();
            let sexo = row.find('.sexo-badge').text().trim();
            let salud = row.find('.estado-badge span').text().trim();

            let matchesSearch = searchText === '' ||
                nombre.includes(searchText) ||
                arete.includes(searchText);

            let matchesSexo = sexoFilter === '' ||
                sexo.includes(sexoFilter);

            let matchesSalud = saludFilter === '' ||
                salud.includes(saludFilter);

            if (matchesSearch && matchesSexo && matchesSalud) {
                row.show();
                visibleCount++;
                // Animación sutil al mostrar
                row.css('animation', 'fadeIn 0.5s');
            } else {
                row.hide();
            }
        });

        // Actualizar contador de registros visibles
        let totalRegistros = $('.bovino-row').length;
        $('#totalRegistros').text(visibleCount + ' de ' + totalRegistros + ' registros mostrados');

        // Mostrar mensaje si no hay resultados
        if (visibleCount === 0) {
            if ($('.no-results-row').length === 0) {
                let noResultsRow = `
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
                $('#bovinosTableBody').append(noResultsRow);
            }
        } else {
            $('.no-results-row').remove();
        }
    }

    // Ordenamiento de columnas
    $('.bovinos-table th').each(function(index) {
        if (index < 6) { // No ordenar la columna de acciones
            $(this).css('cursor', 'pointer').append(' <i class="fas fa-sort text-gray-400 ml-1"></i>');
            $(this).on('click', function() {
                sortTable(index);
            });
        }
    });

    function sortTable(columnIndex) {
        let rows = $('.bovino-row').get();
        let isAscending = $(`.bovinos-table th:eq(${columnIndex}) i.fa-sort`).hasClass('fa-sort-up');

        // Resetear iconos
        $('.bovinos-table th i').removeClass('fa-sort-up fa-sort-down').addClass('fa-sort');

        rows.sort(function(a, b) {
            let aValue = $(a).find('td:eq(' + columnIndex + ')').text().trim();
            let bValue = $(b).find('td:eq(' + columnIndex + ')').text().trim();

            // Manejar valores numéricos
            if (columnIndex === 4) { // Columna de peso
                aValue = parseFloat(aValue) || 0;
                bValue = parseFloat(bValue) || 0;
            } else {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return isAscending ? -1 : 1;
            if (aValue > bValue) return isAscending ? 1 : -1;
            return 0;
        });

        // Actualizar icono
        if (isAscending) {
            $(`.bovinos-table th:eq(${columnIndex}) i`).removeClass('fa-sort').addClass('fa-sort-down');
        } else {
            $(`.bovinos-table th:eq(${columnIndex}) i`).removeClass('fa-sort').addClass('fa-sort-up');
        }

        // Reordenar filas
        $.each(rows, function(index, row) {
            $('#bovinosTableBody').append(row);
        });
    }

    // Animación de entrada para las filas
    $('.bovino-row').each(function(index) {
        $(this).css('animation', `fadeIn 0.5s ease forwards ${index * 0.1}s`);
    });

    // Tooltips mejorados
    $('[title]').tooltip({
        position: {
            my: "center bottom-20",
            at: "center top",
            using: function(position, feedback) {
                $(this).css(position);
                $("<div>")
                    .addClass("tooltip-arrow")
                    .appendTo(this);
            }
        }
    });

    // Exportar a CSV
    $('#exportCSV').on('click', function() {
        let csv = [];
        let rows = $('.bovinos-table tr');

        rows.each(function() {
            let row = [];
            $(this).find('td:not(:last-child)').each(function() {
                row.push('"' + $(this).text().trim() + '"');
            });
            csv.push(row.join(','));
        });

        // Descargar archivo
        let csvContent = csv.join('\n');
        let blob = new Blob([csvContent], { type: 'text/csv' });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'bovinos.csv';
        a.click();

        showNotification('Archivo exportado exitosamente', 'success');
    });

    // Función para mostrar notificaciones
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

// Función global para confirmar eliminación
function confirmarEliminacion(nombre) {
    return confirm('¿Estás seguro de que deseas eliminar a ' + nombre + '? Esta acción no se puede deshacer.');
}

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