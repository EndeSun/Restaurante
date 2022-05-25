var conexion = "";








var mesa = "";
var platos = [];
var comanda = null;




// Para cambiar las interfaces en el cliente.
var seccionActual = "login";
function cambiarSeccion(seccion) {
    document.getElementById(seccionActual).classList.remove("activa");
    document.getElementById(seccion).classList.add("activa");
    seccionActual = seccion;
}

function entrar() {
    comanda = document.getElementById("listaComanda");
    comanda.innerHTML = "";
    conexion = new WebSocket("ws://localhost:4444", "clientes");
    conexion.addEventListener('open', function (event) {


        rest.get("/api/platos", (estado, respuesta) => {
            if (estado == 200) {
                platos = respuesta;
            }
            mesa = document.getElementById("tableNumber").value;
        cambiarSeccion("pedidos");
        console.log("Bienvenido mesa número: ", mesa);
        var platosCarta = document.getElementById("platosDeLaCarta");
        platosCarta.innerHTML = "";
        console.log(platos);
        for(i in platos){
            platosCarta.innerHTML += "<dt>"+platos[i].nombre+"</dt><dd><img src="+platos[i].imagen+"></dd><dd><button onclick=restarPlato("+platos[i].id+")>-</button><button onclick=sumarPlato("+platos[i].id+")>+</button></dd>"
        }
        conexion.send(JSON.stringify({ origen: "cliente", operacion: "entrada", mesa: mesa }));
    })
        })

        

    conexion.addEventListener('message', function (event) {
        console.log("Mensaje del servidor: ", event.data);
        var msg = JSON.parse(event.data);

    })
}

function sumarPlato(idPlato){
    for(i in platos){
        if(platos[i].id == idPlato){
            var plato = platos[i];
        }
    }
    rest.post("/api/sumarPlato/"+mesa, plato, (estado,respuesta) => {
        if (estado == 201){
            comanda.innerHTML += "<li>"+respuesta.nombre+"</li>"
            console.log(respuesta);
        }
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