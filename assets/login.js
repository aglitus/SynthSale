var url = "http://localhost:8080/"

function logar(){
    var obj = {
        username: $("#user").val(),
        password: $("#password").val()
    };

    $.ajax({
        type: "POST",
        url: url + 'user/login',
        headers: {
            'Authorization': 'Basic ' + btoa(obj.username + ":" + obj.password) 
        },
        success: function(data){
            localStorage.setItem('token', data.token);
            localStorage.setItem('user_id', data.details.id);
            localStorage.setItem('username', data.details.username);
            localStorage.setItem('user_type', data.details.userType.description);
            Swal.fire({
                position: 'top-end',
                html: 'Logado com sucesso.',
                timer: 1000,
                width: 300,
                timerProgressBar: true,
                showConfirmButton: false 
              }).then((result) => {
                window.location.href = 'home.html';
              });
        },
        error: function (htmlobj){
            if (htmlobj.status == 401){
                Swal.fire({text: "Credencias incorretas, tente novamente.", icon: "error"});
            }
        }
    })
}

$(function(){

    var url = new URL(window.location.href);
    var valida = url.searchParams.get("expired");

    if (valida){
        
        Swal.fire({
            position: 'top-end',
            html: 'Sua sessão expirou. Logue novamente',
            timer: 1500,
            width: 300,
            timerProgressBar: true,
            showConfirmButton: false 
          });
    }

    $("#login").on('click', function(e){
        e.preventDefault();
        logar();
    })
});