var express = require("express");
var app = express();

var datos = require("./datos.js");

var platos = datos.platos;
var comandaCliente = datos.comandaCliente;

app.set('json spaces', 1);
app.use("/cliente", express.static("../Cliente_cliente"));
app.use("/camarero", express.static("../Cliente_camarero"));
app.use("/cocina", express.static("../Cliente_cocina"));

app.use(express.json());

app.set('json spaces', 1);
// Parte de REST

// Para obtener la información de los platos
app.get("/api/platos", (req, res) => {
    res.status(200).json(platos);
})

// Crear una función para obtener todos los pedidos del cliente
app.get("/api/comandaCliente/:mesa", (req, res) => {
    var mesa = req.params.mesa;
    var comandaClienteDeEsaMesa = [];


    for (i in comandaCliente) {
        if (comandaCliente[i].mesa == mesa) {
            comandaClienteDeEsaMesa.push(comandaCliente[i]);
        }
    }
    res.status(200).json(comandaClienteDeEsaMesa);
})

// Para ir sumando platos a la mesa seleccionada.
app.post("/api/sumarPlato/:mesa", (req, res) => {
    var plato = {
        id: req.body.id,
        nombre: req.body.nombre,
        mesa: req.params.mesa,
        // imagen: req.params.imagen,
        cantidad: 1
    };

    var check = false;

    for (i in comandaCliente) {

        if (plato.id == comandaCliente[i].id && plato.mesa == comandaCliente[i].mesa) {
            comandaCliente[i].cantidad += 1;
            check = true;
        }
    }

    if (check == false) {
        comandaCliente.push(plato);
    }

    // console.log(comandaCliente)
    res.status(201).json(plato);
})

// Función para eliminar los platos de la mesa seleccionada
app.delete("/api/eliminarPlato/:id/:mesa", (req, res) => {

    var plato = {
        id: req.params.id,
        nombre: req.body.nombre,
        mesa: req.params.mesa,
        cantidad: 1
    }

    // Los nuevos platos, sin el que queremos eliminar
    comandaClienteNuevo = [];

    var check = false;

    // Si existe este plato ya en la comanda o 
    for (i in comandaCliente) {
        if (comandaCliente[i].id == plato.id && comandaCliente[i].mesa == plato.mesa && comandaCliente[i].cantidad > 1) {
            comandaCliente[i].cantidad -= 1;
            check = true;
        }
    }

    // Si no existe ningún plato, que se elimine ese plato de la lista de pedidos.
    if (check == false) {
        for (j in comandaCliente) {
            if (comandaCliente[j].id != plato.id || comandaCliente[j].mesa != plato.mesa) {
                comandaClienteNuevo.push(comandaCliente[j])
            }
        }
        comandaCliente = comandaClienteNuevo;
    }
    res.status(201).json(plato);
})

app.delete("/api/eliminarTodoElPedido/:mesa", (req,res)=>{
    mesa = req.params.mesa;
    var comandaClienteNuevo = [];
    for(i in comandaCliente){
        if(comandaCliente[i].mesa != mesa){
            comandaClienteNuevo.push(comandaCliente[i]);
        }
    }
    comandaCliente = comandaClienteNuevo;
    res.status(201).json(comandaClienteNuevo);
})


// El servidor escucha en el puerto 8080.
app.listen(8080);




























// La parte de websockets
// Crear un servidor web HTTP
var http = require("http"); //Este viene con node, ya está instalado
var httpServer = http.createServer();
// Crear servidor WS
var WebSocketServer = require("websocket").server; // instalar previamente: npm install websocket
var wsServer = new WebSocketServer({
    httpServer: httpServer
});


// Iniciar el servidor HTTP en un puerto
var puerto = 4444;

// Lo ponemos es un puerto y lo iniciamos
httpServer.listen(puerto, function () {
    // console.log("Servidor de WebSocket iniciado en el puerto:", puerto);
});


var clientes = [];

wsServer.on('request', (request) => {
    var connection = request.accept("clientes", request.origin);
    var cliente = { connection: connection };

    clientes.push(cliente);

    console.log("Cliente conectado. Ahora hay", clientes.length);

    connection.on("message", (message) => {
        if (message.type == "utf8") {
            console.log("Mensaje del cliente: " + message.utf8Data);
            var msg = JSON.parse(message.utf8Data);

            if (msg.origen == "cliente" && msg.operacion == "entrada") {
                cliente.mesa = msg.mesa;
                cliente.categoria = "cliente";
            }

            if (msg.origen == "cocina" && msg.operacion == "verListaPedidos") {
                cliente.categoria = "cocina";
            }

            else if (msg.origen == "cliente" && msg.operacion == "pedido") {
                var ped = [];
                var pedido = { plato: msg.comida, cantidad: msg.cantidad };
                ped.push(pedido);

                for (var j = 0; j < clientes.length; j++) {
                    clientes[j].connection.sendUTF(JSON.stringify({ origen: "cliente", operacion: "darListaPedidos", listaPedidos: ped }))
                }
                connection.sendUTF(JSON.stringify({ mensaje: "Mensaje enviado, preparando tú plato" }));
            }

        }
    })

    connection.on('close', (reasonCode, description) => {
        for (var i = 0; i < clientes.length; i++) {
            if (clientes[i] == cliente) {
                clientes.splice(i, 1);
            }
        }
        console.log("Cliente desconectado. Ahora hay", clientes.length);
    })
})