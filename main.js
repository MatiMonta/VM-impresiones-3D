//OBJETO CONSTRUCTOR 
function Producto(nombre, precio, material, cantidad) {
    this.nombre = nombre;
    this.precio = precio;
    this.material = material;
    this.cantidad = cantidad;

    // Método dentro del objeto
    this.calcularSubtotal = function () {
        return this.precio * this.cantidad;
    };
}

//  ARRAY DE PRODUCTOS 
let carrito = [];

//  FUNCIÓN PRINCIPAL 
function iniciarPedido() {

    let continuar = true;

    while (continuar) {

        let nombre = prompt("Nombre del producto 3D:");
        let precio = parseFloat(prompt("Precio unitario:"));
        let material = prompt("Material (PLA, PETG, Resina, etc):");
        let cantidad = parseInt(prompt("Cantidad:"));

        // Validaciones con while
        while (isNaN(precio) || precio <= 0) {
            precio = parseFloat(prompt("Ingresá un precio válido:"));
        }

        while (isNaN(cantidad) || cantidad <= 0) {
            cantidad = parseInt(prompt("Ingresá una cantidad válida:"));
        }

        // Crear objeto
        let nuevoProducto = new Producto(nombre, precio, material, cantidad);

        // Guardar en array
        carrito.push(nuevoProducto);

        let respuesta = prompt("¿Querés agregar otro producto? (si/no)").toLowerCase();

        if (respuesta !== "si") {
            continuar = false;
        }
    }

    mostrarResumen();
}

//  FUNCIÓN PARA MOSTRAR RESUMEN 
function mostrarResumen() {

    let total = 0;

    console.log("====== RESUMEN DEL PEDIDO =");

    // Recorrer con for
    for (let i = 0; i < carrito.length; i++) {

        console.log("Producto: " + carrito[i].nombre);
        console.log("Material: " + carrito[i].material);
        console.log("Cantidad: " + carrito[i].cantidad);
        console.log("Subtotal: $" + carrito[i].calcularSubtotal());
        console.log("-----------------------------");

        total += carrito[i].calcularSubtotal();
    }

    console.log("TOTAL FINAL: $" + total);
}
