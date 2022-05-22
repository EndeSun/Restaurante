var express = require("express");
var app = express();

app.set('json spaces',1);
app.use("/cliente", express.static("../Cliente_cliente"));
app.use("/camarero", express.static("../Cliente_camarero"));
app.use("/cocina", express.static("../Cliente_cocina"));

app.use(express.json());
app.listen(8080);


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

wsServer.on('request', (request)=>{
    var connection = request.accept("clientes", request.origin);
    var cliente = {connection:connection};

    clientes.push(cliente);

    console.log("Cliente conectado. Ahroa hay", clientes.length);

    connection.on("message", (message)=>{
        if(message.type == "utf8"){
            console.log("Mensaje del cliente: "+ message.utf8Data);
            var msg = JSON.parse(message.utf8Data);

            if(msg.origen == "cliente" && msg.operacion == "entrada"){
                cliente.mesa = msg.mesa;
                cliente.categoria = "cliente";
            }

            if(msg.origen == "cocina" && msg.operacion == "verListaPedidos"){
                cliente.categoria = "cocina";
            }

            else if(msg.origen == "cliente" && msg.operacion == "pedido"){
                var ped = [];
                var pedido = {plato: msg.comida, cantidad: msg.cantidad};
                ped.push(pedido);
            
                for(var j = 0 ; j < clientes.length; j++){
                    clientes[j].connection.sendUTF(JSON.stringify({origen: "cliente", operacion:"darListaPedidos", listaPedidos: ped}))
                }
                connection.sendUTF(JSON.stringify({mensaje: "Mensaje enviado, preparando tú plato"}));
            }

        }
    })

    connection.on('close', (reasonCode,description)=>{
        for(var i = 0; i < clientes.length; i++){
            if(clientes[i] == cliente){
                clientes.splice(i,1);
            }
        }
        console.log("Cliente desconectado. Ahora hay", clientes.length);
    })
})