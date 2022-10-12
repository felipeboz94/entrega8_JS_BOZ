//declaración de variables y constantes globales
// array de usuarios auxiliar usados para el contraste


//declaración de botones para eventos
const PATH_USUARIOS_REGISTRADOS = "json/usuariosRegistrados.json"
let usuarioIngresado = ''
let botEntrar = document.getElementById('botEntrar')
botEntrar.addEventListener('click',tieneUsuario)
let botCancelar = document.getElementById('botCancelar')
botCancelar.addEventListener('click',limpiaCajas)
inicializa()

//--------FUNCIONES INICIALIZACIÓN---------------
function inicializa(){
    let userRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados'))
    if (userRegistrados != null){
        cargaUsuariosRegistrados()
    }
    
}
// Cargo los usuarios desde JSON solo la primera vez que carga página.
function cargaUsuariosRegistrados() {
    console.log("Entra acá apenas actualiza")
    fetch(PATH_USUARIOS_REGISTRADOS)
    .then((respuesta) => respuesta.json())
    .then((respuesta) => {
        localStorage.setItem('usuariosRegistrados', JSON.stringify(respuesta))
        login2()
    })
}

function login2(){
    let usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'))
    console.log(usuarioLogueado)
    if (usuarioLogueado && usuarioLogueado.estado == 0) 
    {
        sessionStorage.setItem('fechaLogin',luxon.DateTime.now())
        aHome()
    }
    else{
        
        localStorage.removeItem('carrito')
    }
}

//--------FUNCIONES NAVEGACIÓN---------------
function aHome(){
    window.location.href='pages/home.html'
}

//--------FUNCIONES EN LOGIN---------------

//limpia cajas

function limpiaCajas(){
    let inputs = document.getElementsByClassName('input')
    if(inputs.length != 0){
        for (const input of inputs){
            input.value = ""
        }
    }    
}

//destructor de cajas
function destructorDivs(){
    let divs = document.getElementsByClassName('div')
    if(divs.length != 0){
        for (const div of divs){
            div.remove()
        }
    }
}

//constructor de div log
function modificadorMsj(mensaje){
    let div = document.getElementsByClassName('msj')
    console.log(div[0])
    div[0].innerText = mensaje
}

function constructorUsuarioLoginExitoso(usuario){
    let div = document.createElement('div')
    div.className = 'div'
    div.innerHTML = `
                    <p><strong> Nombre: ${usuario.nombre}</strong></p>
                    <p><strong> Apellido: ${usuario.apellido}</strong></p> 
                    <p><strong> Mail: ${usuario.mail}</strong></p> 
                    <p><strong> Usuario: ${usuario.usuario}</strong></p>  
    `
    document.body.append(div)
    
}

//determina indices

function determinaIndice(clave, valor, objeto){
    let indice = -1
    let aux = 0
    for(const row of objeto){
        aux ++
        if(valor == row[clave]){
            indice = aux
            break
        }  
    }
    return indice
}

//buscador de usuarios
function buscaUsuario(usuarioIngresado){
    let user
    let auxiliarArrayUsuarios = JSON.parse(localStorage.getItem('usuariosRegistrados'))
    let mensaje
    auxiliarArrayUsuarios.forEach((usuarioRegistrado) => {
        if (usuarioIngresado == usuarioRegistrado.usuario){
            user = usuarioRegistrado
            
        }
      
        })      
    user = user || "Nullish"
    user != "Nullish" ? mensaje = "Se encontró al usuario "+ user.usuario : mensaje = "No se encontró al usuario "+ usuarioIngresado
    console.log(mensaje)
    return user
}
//funcion de login
function login(){
    
    let inputUser = document.getElementById('inputUser')
    let inputPass = document.getElementById('inputPass')
    let passIngresada = ''
    let coincideUsuario = false
    let coincideContraseña = false
    let indiceUsuario = -1
    let indiceContrasenia = -1
    let auxiliarArrayUsuarios = JSON.parse(localStorage.getItem('usuariosRegistrados'))
    usuarioIngresado = inputUser.value
    passIngresada = inputPass.value
    let user = buscaUsuario(usuarioIngresado)
    if(usuarioIngresado == null || usuarioIngresado == ""){
        return 0
    }
    else if(user.estado == 1){
        return 100
    }
    else{
        if (user.usuario != usuarioIngresado){
                console.log('Usuario no coincide '+ user.usuario)                    
            }
            else{
                coincideUsuario = true
                console.log('Usuario coincide '+ user.usuario)
                indiceUsuario = determinaIndice('usuario',user.usuario,auxiliarArrayUsuarios)
                
            }
        }
    
    if(passIngresada == null || passIngresada == ""){
        return 0
    }
    else if (passIngresada != user.pass){
        console.log('La contraseña no coincide '+ user.pass)                    
    }
    else{
        coincideContraseña = true
        console.log('La contraseña coincide '+ user.pass)
    }
                        
    if(coincideUsuario == false){
        return 1    //el usuario ingresado no está en el array
    }

    if((coincideContraseña == false)){
        return 99   //contraseña incorrecta
    } 
    else{
        return 2    // ingreso exitoso
    }
    return -1
}

//función inicial que consulta si tiene un usuario. si tiene, logueás, sino, te creás uno y luego logueás
function tieneUsuario(){
    
        let retLogin = login()
        let mensaje = ''
        switch(retLogin){
            case -1:
                mensaje = 'No se hizo nada. ERROR' 
                modificadorMsj(mensaje)
                console.log(mensaje)
                break
            case 0:
                mensaje = 'ESC producido' 
                modificadorMsj(mensaje)
                console.log(mensaje)
                break
            case 1:
                mensaje = 'No se encuentra el usuario!'
                modificadorMsj(mensaje)
                console.log(mensaje)
                break
            case 2:
                mensaje = 'Login exitoso!'
                sessionStorage.setItem('fechaLogin',luxon.DateTime.now())
                let user = buscaUsuario(usuarioIngresado)
                localStorage.setItem('usuarioLogueado',JSON.stringify(user))
                destructorDivs()
                console.log(mensaje)
                aHome()
                break           
            case 99:
                mensaje = 'ATENCIÓN. Contraseña incorrecta, intentelo nuevamente'
                modificadorMsj(mensaje)
                console.log(mensaje)
                break
            case 100:
                mensaje = 'ATENCIÓN. El usuario está bloqueado'
                modificadorMsj(mensaje)
                console.log(mensaje)
                break
        }
    
}
