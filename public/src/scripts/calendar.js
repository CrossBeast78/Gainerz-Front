document.addEventListener('DOMContentLoaded', () => {
    const abrirBtn = document.getElementById('abrir-modal');
    const contentDiv = document.querySelector('.content');
    const originalContent = contentDiv.innerHTML;

    let ejerciciosCargados = [];

    const crearRutinaHTML = `
        <div class="crear-rutina content2" id="crear-rutina">
            <div class="new-rt">
                <div style="display: flex; flex-direction: row;">
                    <div style="display: flex; flex-direction: column; width: 70%;">
                        <input class="title-input squada-one-regular" id="title-input" type="text" placeholder="Agrega un título a tu rutina">
                        <textarea class="desc-input ubuntu-condensed-regular" id="desc-input" placeholder="Agrega una descripción breve"></textarea>
                    </div>
                    <div class="dropdown ubuntu-condensed-regular">
                        <button class="btn btn-secondary dropdown-toggle menu" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            Elige la sección muscular
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li><a class="dropdown-item" id="ejs-pierna" href="#">Pierna</a></li>
                            <li><a class="dropdown-item" id="ejs-pecho" href="#">Pecho</a></li>
                            <li><a class="dropdown-item" id="ejs-espalda" href="#">Espalda</a></li>
                        </ul>
                        <div class="create">
                            <i class="fa-solid fa-circle-plus add-rt"></i>
                        </div>
                    </div>
                </div>           
            </div>
            <div style="width: 100%">
                <div class="add-ejercicios armar">
                    <h1 class="squada-one-regular">Ejercicios</h1>
                    <div id="rutina">
                        <!-- Aquí se agregarán bloques de ejercicios -->
                    </div>
                </div>
            </div>
            <div class="botones squada-one-regular">
                <button class="btn-rtns btn-crear" id="btn-crear">CREAR</button>
                <button class="btn-rtns btn-cancelar" id="btn-cancelar">CANCELAR</button>
            </div>
        </div>
        <div id="modal-ejercicio" class="modal-overlay" style="display: none;">
            <div class="modal-content">
                <h1 class="squada-one-regular">New Block</h1>
                <h2 class="squada-one-regular">Agregar Ejercicios:</h2>
                <div class="botones squada-one-regular">
                <input class="form-control ubuntu-condensed-regular" list="datalistOptions" id="exampleDataList" placeholder="Type to search...">
                <datalist id="datalistOptions"></datalist>
                <span id="cerrar-modal-ej" class="cerrar-x">&times;</span>
                </div>
            </div>
        </div>
    `;

    abrirBtn.addEventListener('click', () => {
        contentDiv.innerHTML = crearRutinaHTML;

        const cancelarBtn = document.getElementById('btn-cancelar');
        cancelarBtn.addEventListener('click', () => {
            contentDiv.innerHTML = originalContent;
            location.reload();
        });

        const botonAgregar = document.querySelector('.add-rt');
        const modal = document.getElementById('modal-ejercicio');
        const cerrarModal = () => modal.style.display = 'none';

        // Abrir modal
        botonAgregar.addEventListener('click', () => {
            modal.style.display = 'flex';

            const inputBusqueda = document.getElementById('exampleDataList');
            const datalist = document.getElementById('datalistOptions');

            inputBusqueda.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    const query = this.value.trim();
                    if (query.length < 1) return;
            
                    fetch(`http://192.168.1.128:8082/exercise/${encodeURIComponent(query)}`, {
                        method: 'GET',
                        headers: {
                            'token': AppStorage.getToken(),
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                        if (!response.ok) throw new Error(`Error: ${response.status}`);
                        return response.json();
                    })
                    .then(data => {
                        if (!data || data.length === 0) {
                            const option = document.createElement('option');
                            option.value = 'No se encontraron ejercicios';
                            datalist.appendChild(option);
                            return;
                        }
                    
                        datalist.innerHTML = '';
                        ejerciciosCargados = data;
                    
                        data.forEach(ej => {
                            const option = document.createElement('option');
                            option.value = ej.Name;
                            datalist.appendChild(option);
                        });
                    
                        const nombreSeleccionado = query;
                        const ejercicio = data.find(ej => 
                            typeof ej.Name === 'string' &&
                            ej.Name.toLowerCase() === nombreSeleccionado.toLowerCase()
                        );
                    
                        if (ejercicio) {
                            const rutinaDiv = document.getElementById('rutina');
                            const bloque = document.createElement('div');
                            bloque.className = 'ejercicio-agregado';
                    
                            bloque.innerHTML = `
                                <div class="series-ej">
                                    <p class="ej ubuntu-condensed-regular">${ejercicio.name}</p>
                                    <div class="datos-serie ubuntu-condensed-regular">
                                        <h2 class="squada-one-regular">Serie 1</h2>
                                        <p>Músculo: ${ejercicio.PrincipalMuscle}</p>
                                        <p style="padding-left: 20px;">Reps: --</p>
                                        <p style="padding-left: 20px;">Peso: --</p>
                                    </div>
                                </div>
                                <div class="crear-series">
                                    <p class="ubuntu-condensed-regular">Agregar serie</p>
                                    <i class="fa-solid fa-circle-plus add-ej"></i>
                                </div>
                            `;
                    
                            rutinaDiv.appendChild(bloque);
                            inputBusqueda.value = '';
                            datalist.innerHTML = '';
                        } else {
                            console.warn("Ejercicio no encontrado en el listado.");
                        }
                    })
                    .catch(err => {
                        console.error('Error en búsqueda:', err.message);
                    });
                }
            });
        });

        // Cerrar modal
        document.getElementById('cerrar-modal-ej').addEventListener('click', cerrarModal);
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'modal-ejercicio') cerrarModal();
        });
    });
});