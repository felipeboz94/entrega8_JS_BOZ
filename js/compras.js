 
const PATH_PRODUCTOS = "../json/productos.json"
let botCerrarSesion= document.getElementById('botCerrarSesion')
botCerrarSesion.addEventListener('click',cerrarSesion)
const {nombre, apellido, mail, usuario, pass, estado, intentos} = constructorUsuarioLoginExitoso()
let div = document.getElementById('infUsuario')
div.innerHTML = `<p><strong> Usuario: ${usuario}</strong></p>
`    
let bienvenida = document.getElementById('bienvenida')
bienvenida.innerText = ` ¡Tu compra (${itemsCarrito()}), ${nombre}!`
//botAgregarCarrito.addEventListener('click',agregarCarrito)
function constructorUsuarioLoginExitoso(){
  let usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'))

  return usuarioLogueado
}

leeJsonProductos()
setInterval(() => {
  //declaración de botones para eventos
  const DateTime = luxon.DateTime
  const Duration = luxon.Duration
  const ahora = DateTime.now()
  const x = DateTime.fromISO(sessionStorage.getItem('fechaLogin'))
  const fechaLogueo = Duration.fromObject({years : x.year, months : x.month, days: x.day, hours: x.hour,minutes:  x.minute, seconds : x.second })
  let resta = ahora.minus(fechaLogueo)
  let div = document.getElementById('duracionLogin')
  div.innerText=`Tiempo desde login: ${resta.hour}:${resta.minute}:${resta.second}`
  
  }, 1000) 

function aLogin(){
  window.location.href='../login.html'
}
  function cerrarSesion(){
    Swal.fire({
        title: 'Aviso',
        text: "Seguro que quiere cerrar sesión?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si'
      }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('usuarioLogueado')
            localStorage.removeItem('carrito')
            sessionStorage.removeItem('fechaLogin')
            aLogin()
        }
      })

}  

function msgToastify(id){
  let texto = "Se agregó al carrito "
  fetch(PATH_PRODUCTOS)
  .then((respuesta) => respuesta.json())
  .then((respuesta) => {
    for (let i = 0; i < respuesta.length; i++) {
      if (respuesta[i].id == id) {  
        texto = texto + respuesta[i].tipo + " " +respuesta[i].modelo + " " +respuesta[i].detalle 
      }}
      Toastify({
        text :  texto,
        duration : 3000,
        position: 'right'
      }).showToast()     
    
    })


}
function itemsCarrito(){
    let carritoAlmacenado = JSON.parse(localStorage.getItem('carrito'))
    let total = 0
    if (carritoAlmacenado != null){
    for(const productos of carritoAlmacenado){
      total += productos.cantidad
    }
  }
    return total
}

function escribeTitulo(){
  let total = itemsCarrito()
  if(total != 0){
    menuCarrito.innerText = 'Tu compra ('+total + ')'
  }
}

function agregarAlCarrito(id){
  msgToastify(id)
  let carritoAlmacenado = []
  let nuevoProducto = []
  carritoAlmacenado = JSON.parse(localStorage.getItem('carrito'))
  let existe = 0
  if (carritoAlmacenado != null){
    
  for (let i = 0; i < carritoAlmacenado.length; i++) {
    if (carritoAlmacenado[i].idProducto == id) {
      carritoAlmacenado[i].cantidad = carritoAlmacenado[i].cantidad + 1
      localStorage.setItem('carrito',JSON.stringify(carritoAlmacenado))
      existe = 1
      break;
    }
  }
}
  if (existe == 0){
    let producto = {"idProducto" : id , "cantidad" : 1}
    if (carritoAlmacenado != null){  
      carritoAlmacenado.push(producto)
      localStorage.setItem('carrito',JSON.stringify(carritoAlmacenado))
    }
    else{
      nuevoProducto.push(producto)
      localStorage.setItem('carrito',JSON.stringify(nuevoProducto))
    }
  }
  escribeTitulo()
  }

function creaTablaProductos(productos){

    let divTabla = document.getElementById('divTablas')
    let texto 
    let li
    //Array con la información a agregar
    let carritoAlmacenado = JSON.parse(localStorage.getItem('carrito'))
    let parcial = 0
    let total = 0
    console.log(productos)
    console.log(carritoAlmacenado)
    if (carritoAlmacenado != null){
    for (const producto of productos){
        for (const productoCarrito of carritoAlmacenado){
            if (producto.id == productoCarrito.idProducto){
                parcial = producto.precio * productoCarrito.cantidad
                total += parcial 
                texto = `${producto.tipo} ${producto.marca} ${producto.modelo} ${producto.detalle}--> $${producto.precio}x${productoCarrito.cantidad} u= $ ${parcial}
                `             
                li = document.createElement("li")
                li.innerHTML = texto
                divTabla.appendChild(li)
            }

        }
    }
    li = document.createElement("li")
    li.innerHTML = `El valor final (con IVA: 21%) es : `+total*1,21
    
    divTabla.appendChild(li)

}


}





function leeJsonProductos(){
    fetch(PATH_PRODUCTOS)
    .then((respuesta) => respuesta.json())
    .then((respuesta) => {
        creaTablaProductos(respuesta)
    })
}
