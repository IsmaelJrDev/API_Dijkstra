// Función para agregar nuevas aristas
let aristas = [];
function agregarArista() {
    const fromInput = document.createElement('input');
    fromInput.type = 'text';
    fromInput.name = 'from[]';
    fromInput.placeholder = 'Desde';

    const toInput = document.createElement('input');
    toInput.type = 'text';
    toInput.name = 'to[]';
    toInput.placeholder = 'Hacia';

    const weightInput = document.createElement('input');
    weightInput.type = 'number';
    weightInput.name = 'weight[]';
    weightInput.placeholder = 'Peso';

    const aristasContainer = document.getElementById('aristas-container');
    const aristaGroup = document.createElement('div');
    aristaGroup.classList.add('arista-group');
    aristaGroup.appendChild(fromInput);
    aristaGroup.appendChild(toInput);
    aristaGroup.appendChild(weightInput);
    aristasContainer.appendChild(aristaGroup);
}

// Lógica de Dijkstra (simplificada)
function calcularDijkstra(nodos, aristas, inicio, fin) {
    let distancias = {};
    let previos = {};
    let unvisitedNodes = [];

    // Inicializar nodos
    nodos.forEach((nodo) => {
        distancias[nodo] = Infinity;
        previos[nodo] = null;
        unvisitedNodes.push(nodo);
    });
    distancias[inicio] = 0;

    while (unvisitedNodes.length > 0) {
        // Obtener el nodo con la menor distancia
        let nodoActual = unvisitedNodes.reduce((prev, curr) => distancias[prev] < distancias[curr] ? prev : curr);

        // Si el nodo actual es el destino, se ha encontrado el camino
        if (nodoActual === fin) break;

        // Eliminar nodoActual de los nodos no visitados
        unvisitedNodes = unvisitedNodes.filter(n => n !== nodoActual);

        // Verificar las conexiones desde el nodo actual
        let aristasDesdeNodo = aristas.filter(a => a.from === nodoActual);
        aristasDesdeNodo.forEach(arista => {
            const nuevaDistancia = distancias[nodoActual] + arista.weight;
            if (nuevaDistancia < distancias[arista.to]) {
                distancias[arista.to] = nuevaDistancia;
                previos[arista.to] = nodoActual;
            }
        });
    }

    // Reconstruir el camino
    let camino = [];
    let nodo = fin;
    while (nodo) {
        camino.unshift(nodo);
        nodo = previos[nodo];
    }

    return { distancia: distancias[fin], camino: camino };
}

// Manejar el envío del formulario
document.getElementById('dijkstraForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Evitar que el formulario se envíe de forma tradicional

    // Obtener los datos del formulario
    const nodos = document.getElementById('nodos').value.split(',').map(nodo => nodo.trim());
    const inicio = document.getElementById('inicio').value;
    const fin = document.getElementById('fin').value;

    // Recopilar las aristas
    aristas = [];
    const fromInputs = document.getElementsByName('from[]');
    const toInputs = document.getElementsByName('to[]');
    const weightInputs = document.getElementsByName('weight[]');

    for (let i = 0; i < fromInputs.length; i++) {
        aristas.push({
            from: fromInputs[i].value,
            to: toInputs[i].value,
            weight: Number(weightInputs[i].value)
        });
    }

    // Calcular el algoritmo de Dijkstra
    const resultado = calcularDijkstra(nodos, aristas, inicio, fin);

    // Verificar si hay solución o no
    if (resultado.distancia === Infinity) {
        alert('No hay camino entre los nodos indicados.');
        return;
    }

    // Dibujar el grafo con el camino más corto
    drawGraph(nodos, aristas, resultado.camino, resultado.distancia);
});

// Función para dibujar el grafo
function drawGraph(nodos, aristas, camino, distancia) {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpiar el canvas

    // Coordenadas de los nodos (esto puede ser dinámico dependiendo de cuántos nodos haya)
    const nodeCoords = generateNodePositions(nodos);

    // Dibujar los nodos
    nodos.forEach(node => {
        ctx.beginPath();
        ctx.arc(nodeCoords[node].x, nodeCoords[node].y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#000';
        ctx.fillText(node, nodeCoords[node].x - 5, nodeCoords[node].y + 5);
    });

    // Dibujar las aristas
    aristas.forEach(arista => {
        const from = nodeCoords[arista.from];
        const to = nodeCoords[arista.to];

        // Dibujar las líneas
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = '#aaa';
        ctx.stroke();

        // Mostrar el peso
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        ctx.fillStyle = '#aaa';
        ctx.fillText(arista.weight, midX, midY);
    });

    // Resaltar el camino
    if (camino) {
        for (let i = 0; i < camino.length - 1; i++) {
            const from = nodeCoords[camino[i]];
            const to = nodeCoords[camino[i + 1]];

            // Dibujar el camino con otro color
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.strokeStyle = 'red';  // Color del camino más corto
            ctx.lineWidth = 4;
            ctx.stroke();
        }
    }

    // Mostrar la distancia total
    alert("Distancia total: " + distancia);
}

// Función para generar posiciones dinámicas para los nodos
function generateNodePositions(nodos) {
    const positions = {};
    const angleIncrement = (2 * Math.PI) / nodos.length;
    const radius = 200;

    nodos.forEach((nodo, index) => {
        const angle = angleIncrement * index;
        positions[nodo] = {
            x: 300 + radius * Math.cos(angle),
            y: 300 + radius * Math.sin(angle)
        };
    });

    return positions;
}
