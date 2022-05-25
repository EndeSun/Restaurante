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

        var platos = [];
        rest.get("/api/platos", (estado, respuesta) => {
            if (estado == 200) {
                platos = respuesta;
            }
            var mesa = document.getElementById("tableNumber").value;
        cambiarSeccion("pedidos");
        console.log("Bienvenido mesa número: ", mesa);
        var platosCarta = document.getElementById("platosDeLaCarta");
        platosCarta.innerHTML = "";
        console.log(platos);
        for(i in platos){
            platosCarta.innerHTML += "<dt>"+platos[i].nombre+"</dt><dd><img src="+platos[i].imagen+"></dd><dd><button onclick=restarPlato("+platos[i].id+")>-</button></dd><dd><button onclick=sumarPlato("+platos[i].id+")>+</button></dd>"
        }
        conexion.send(JSON.stringify({ origen: "cliente", operacion: "entrada", mesa: mesa }));
    })
        })

        

    conexion.addEventListener('message', function (event) {
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
    pedidosss.innerHTML += "<li>Comida: " + comida.value + " Cantidad: " + cantidad.value + "</li>"

    comida.value = "";
    cantidad.value = "";
}

function enviarPedidos() {

    // for(var i = 0 ; i < )
}