var conexion = "";

// Para cambiar las interfaces en el cliente.
var seccionActual = "login";
function cambiarSeccion(seccion) {
    document.getElementById(seccionActual).classList.remove("activa");
    document.getElementById(seccion).classList.add("activa");
    seccionActual = seccion;
}

function entrar() {
    conexion = new WebSocket("ws://localhost:4444", "clientes");
    conexion.addEventListener('open', function (event) {
        var mesa = document.getElementById("tableNumber").value;
        cambiarSeccion("pedidos");
        console.log("Bienvenido mesa número: ", mesa);
        conexion.send(JSON.stringify({origen: "cliente", operacion: "entrada", mesa: mesa}));
    })

    conexion.addEventListener('message', function(event){
        console.log("Mensaje del servidor: ", event.data);
        var msg = JSON.parse(event.data);

    })
}

function salir() {
    cambiarSeccion("login");
}

function anyadir() {
    var comida = document.getElementById("food");
    var cantidad = document.getElementById("howMany")
    // conexion.send(JSON.stringify({origen: "cliente", operacion: "pedido", comida: comida.value, cantidad: cantidad.value}));
    var pedidosss = document.getElementById("pedidosss");
    pedidosss.innerHTML += "<li>Comida: "+comida.value+" Cantidad: "+cantidad.value+"</li>"

    comida.value = "";
    cantidad.value = "";
}

function enviarPedidos(){

    // for(var i = 0 ; i < )
}