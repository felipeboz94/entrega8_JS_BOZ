//declaración de variables y constantes globales
// array de usuarios auxiliar usados para el contraste


//declaración de botones para eventos
const PATH_USUARIOS_REGISTRADOS = "../json/usuariosRegistrados.json"
let botGuardar = document.getElementById('botGuardar')
botGuardar.addEventListener('click',submit)
let botCancelar = document.getElementById('botCancelar')
botCancelar.addEventListener('click',cancelar)


//--------FUNCIONES NAVEGACIÓN---------------



function guardaUsuarioJson(){
/*     fetch("http://127.0.0.1:5500/json/usuariosRegistrados1 ", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            title: 'Coderhouse',
            body: 'Post de prueba',
            userId: 1,
        })
    })
    .then((response) => response.json())
    .then((data) => console.log("Se agregó al JSON el usuario "+ data)) */

    let user = {
        nombre: 'Juan',
        apellido: 'Perez'
      };
      
      fetch('../json/usuariosRegistrados1.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
      })
     .then((response) => console.log(response)) 
//      let result = response.json();
   //   alert(result.message);

}

function aLogin(){
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Usuario guardado con éxito',
        showConfirmButton: true,
        timer: 50000
      })
      .then((result) => {
        window.location.href='../login.html'
    } )
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

function cancelar(){
    limpiaCajas()
    aLogin()
}

//constructor de objeto USUARIO
function Usuario(nombre, apellido, mail, usuario, pass, estado, intentos){
    this.nombre = nombre
    this.apellido = apellido
    this.mail = mail
    this.usuario = usuario
    this.pass = pass
    this.estado = estado
    this.intentos = intentos
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


function validacion(usuarioIngresado,auxiliarArrayUsuarios){

    let indiceUsuario = determinaIndice('usuario', usuarioIngresado.usuario,auxiliarArrayUsuarios)
    const aux = indiceUsuario > -1 ? 1 : 0// el usuario existe
    return aux
    
}

function registraUsuario(usuarioIngresado,auxiliarArrayUsuarios){
    const usuarioNuevo =  [{     
        nombre: usuarioIngresado.nombre,
        apellido: usuarioIngresado.apellido,
        mail: usuarioIngresado.mail,
        usuario:usuarioIngresado.usuario,
        pass:usuarioIngresado.pass,
        estado:usuarioIngresado.estado,
        intentos:usuarioIngresado.intentos
}]
    //const enJson = JSON.parse(usuarioNuevo)
    //auxiliarArrayUsuarios.push(usuarioNuevo)    
    let listaAuxiliar = [...auxiliarArrayUsuarios, ...usuarioNuevo] //SPREAD
    console.log("listaAuxiliar "+listaAuxiliar)
    guardaUsuarioJson(usuarioNuevo[0])
    localStorage.setItem('usuariosRegistrados',JSON.stringify(listaAuxiliar))

    return 1 
}

function submit(){
    let inputNombre = document.getElementById('inputNombre')
    let inputApellido = document.getElementById('inputApellido')
    let inputMail = document.getElementById('inputMail')
    let inputUser = document.getElementById('inputUser')
    let inputPass = document.getElementById('inputPass')
    let bloqueado = 0
    let intentos = 0
    let reg = 0
    let usuarioIngresado = new Usuario(inputNombre.value,
        inputApellido.value,
        inputMail.value,
        inputUser.value,
        inputPass.value,
        bloqueado,
        intentos)
    let auxiliarArrayUsuarios = JSON.parse(localStorage.getItem('usuariosRegistrados'))
    let validado = validacion(usuarioIngresado,auxiliarArrayUsuarios)
    validado == 0 ? reg = registraUsuario(usuarioIngresado,auxiliarArrayUsuarios) : console.log("El usuario ingresado ya existe")
    reg == 1 && aLogin()

}