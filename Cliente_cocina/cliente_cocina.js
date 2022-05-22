var conexion = "";

// Para cambiar las interfaces en el cliente.
var seccionActual = "login";
function cambiarSeccion(seccion) {
    document.getElementById(seccionActual).classList.remove("activa");
    document.getElementById(seccion).classList.add("activa");
    seccionActual = seccion;
}

conexion = new WebSocket("ws://localhost:4444", "clientes");
    conexion.addEventListener('open', function (event) {
        conexion.send(JSON.stringify({origen: "cocina"}));
    })

    conexion.addEventListener('message', function(event){
        console.log("Mensaje del servidor: ", event.data);
        var msg = JSON.parse(event.data);
        if(msg.origen == "cliente" && msg.operacion == 'darListaPedidos'){
            var listaP = document.getElementById("listaPedidos");
            for(var i = 0; i < msg.listaPedidos.length; i++){
                listaP.innerHTML += "<li>Plato número: "+msg.listaPedidos[i].plato+"</br>Cantidad: "+msg.listaPedidos[i].cantidad+"</li>"
            }
        }
    })