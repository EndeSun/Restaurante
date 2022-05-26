var conexion = "";


// número de mesa del cliente.
var mesa = "";

// Platos que hay en la carta
var platos = [];

// // Los pedidos en sí.
// var comanda = null;

// Los platos de los pedidos del cliente.
// var todosLosPedidos = [];


// Para ir cambiando las interfaces en el cliente. Para definir la sección ver en index.html (que se define con la clase e id en el div)
var seccionActual = "login";
function cambiarSeccion(seccion) {
    document.getElementById(seccionActual).classList.remove("activa");
    document.getElementById(seccion).classList.add("activa");
    seccionActual = seccion;
}


// Función al entrar en la interfaz
function entrar() {

// Que al entrar se muestre los pedidos que lleva ya y no solo al añadir o quitar
    
    // Parte de websockets
    conexion = new WebSocket("ws://localhost:4444", "clientes");

    // Donde se conecta el cliente
    conexion.addEventListener('open', function (event) {


        // Que al entrar se obtenga la lista de todos los platos

        // Esta función devuelve todos los platos de la carta del restaurante
        rest.get("/api/platos", (estado, respuesta) => {
            if (estado == 200) {
                platos = respuesta;
            }

            // El número de la mesa del cliente.
            mesa = document.getElementById("tableNumber").value;

            // Pintamos llos pedidos de esta mesa
            pintarComanda();
            // Cambiamos a la interfaz de los pedidos = donde van a realizar los pedidos los clientes.

            cambiarSeccion("pedidos");
            var numeroMesa = document.getElementById("numeroMesa");
            numeroMesa.innerHTML = "";
            numeroMesa.innerHTML += "Bienvenidos/as, sois la mesa número: " + mesa;
            // console.log("Bienvenido mesa número: ", mesa);

            // Se obtiene la referencia a donde se van a imprimir todos los platos de la carta
            var platosCarta = document.getElementById("platosDeLaCarta");
            // Lo vacíamos antes de nada para que no se dupliquen
            platosCarta.innerHTML = "";

            // console.log(platos);
            // Recorremos la lista de los platos para imprimirlos en la pantalla.
            for (i in platos) {
                platosCarta.innerHTML += "<dt>" + platos[i].nombre + "</dt><dd><img src=" + platos[i].imagen + " alt=" + platos[i].nombre + " width = '150' height = '150' ></dd><dd><button onclick=restarPlato(" + platos[i].id + ")>Quitar</button><button onclick=sumarPlato(" + platos[i].id + ")>Añadir</button></dd>"
            }

            // Se envía al servidor el mensaje de que soy el cliente y qué número de mesa soy
            conexion.send(JSON.stringify({ origen: "cliente", operacion: "entrada", mesa: mesa }));
        })
    })


    // Aquí es donde voy a recibir todos los mensajes.
    conexion.addEventListener('message', function (event) {
        console.log("Mensaje del servidor: ", event.data);
        var msg = JSON.parse(event.data);

    })
}


// Función de ir añadiendo platos a la lista de pedidos

function sumarPlato(idPlato) {
    for (i in platos) {
        if (platos[i].id == idPlato) {
            var plato = platos[i];
        }
    }
    rest.post("/api/sumarPlato/" + mesa, plato, (estado, respuesta) => {
        if (estado == 201) {
            // console.log(respuesta)
            pintarComanda();
        }
    })
}

// Función que nos pinte los pedidos de ese cliente.
function pintarComanda() {
    rest.get("/api/comandaCliente/" + mesa, (estado, respuesta) => {
        if (estado == 200) {
            var comanda = document.getElementById("listaComanda");
            comanda.innerHTML = "";
            for (i in respuesta) {
                comanda.innerHTML += "<li>Plato: " + respuesta[i].nombre + " Cantidad: "+ respuesta[i].cantidad +"</li>"
            }
        }
    })
}

// Función de eliminar los platos
function restarPlato(idPlato) {
    for (i in platos) {
        if (platos[i].id == idPlato) {
            var plato = platos[i];
        }
    }
    // Recordamos que el método delete tiene solo dos parámetros, la url y el callback.
    rest.delete("/api/eliminarPlato/" + plato.id + "/" +mesa, (estado, respuesta) => {
        if (estado == 201) {
            // console.log(respuesta);
            pintarComanda();
        }
    })

}

function salir() {
    cambiarSeccion("login");
    // Para vaciar la mesa cuando se salga de la interfaz
    var mesa = document.getElementById("tableNumber");
    mesa.value = "";

    var comanda = document.getElementById("listaComanda");
    comanda.innerHTML = "";

    conexion.close();
}
