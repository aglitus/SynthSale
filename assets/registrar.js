var url = "http://localhost:8080/"

function inserir(data) {

    var json = JSON.stringify(data);
    $.ajax({
        type: 'POST',
        url: url + 'user',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: json,
        success: function (jsonResult) {

            console.log('metodo post: ', jsonResult);

            Swal.fire({
                position: 'top-end',
                html: 'Registrado com sucesso.',
                timer: 500,
                width: 300,
                timerProgressBar: true,
                showConfirmButton: false 
              }).then((result) => {
                window.location.href = "login.html";
              });

        },
        error: function (response) {
            var mensagem = "";

            response.responseJSON.errors.forEach((erro) => {
                mensagem += `${erro.defaultMessage}<br>`;
            });

            Swal.fire({
                icon: 'error',
                title: 'Ocorreu um erro ao inserir os dados... Por favor verifique os campos.',
                html: `${mensagem}`,

            });
        }

    });

}

function carregaCidade() {

    $.ajax({
        type: 'GET',
        url: url + 'city',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (jsonResult) {

            var html = "";

            jsonResult.map(cidade => {
                html += `<option value="${cidade.id}">${cidade.description}</option>`;
            });

            $("#city").html(html);

        },
        error: function (response) {
            Swal.fire({
                icon: 'error',
                title: 'Ocorreu um erro ao inserir os dados... Por favor verifique os campos.',
                text: `${response.responseJSON.message}`,

            });
        }
    })
}

$(function () {

    carregaCidade();

    $("#registrar").on('click', function (e) {
        e.preventDefault();

        var obj = {

            name: $("#name").val(),
            surname: $("#surname").val(),
            document: $("#document").val(),
            birthDate: $("#birthDate").val(),
            address: $("#address").val(),
            username: $("#username").val(),
            password: $("#password").val(),
            phoneNumber: $("#phoneNumber").val(),
            city: {
                id: parseInt($("#city option:selected").val())
            },
            userType: {
                id: 2
            }

        };


        inserir(obj);


    });
});


