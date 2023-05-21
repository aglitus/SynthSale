var url = "http://localhost:8080/"

function carregaCidade() {

    $.ajax({
        type: 'GET',
        url: url + 'city',
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
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

function inserir(data) {

    var json = JSON.stringify(data);
    $.ajax({
        type: 'POST',
        url: url + 'user',
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        dataType: "json",
        data: json,
        success: function (jsonResult) {

            console.log('metodo post: ', jsonResult);

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Seu registro foi inserido',
                showConfirmButton: false,
                timer: 1500
            })

            carregarTabela();
            $("#modal").hide();
            $("#modal").modal('hide');



        },
        error: function (response) {
            Swal.fire({
                icon: 'error',
                title: 'Ocorreu um erro ao inserir os dados... Por favor verifique os campos.',
                text: `${response.responseJSON.message}`,

              });
        }

    });

}

function alterar(data) {

    var json = JSON.stringify(data);
    $.ajax({
        type: 'PUT',
        url: url + 'user/' + data.id,
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        dataType: "json",
        data: json,
        success: function (jsonResult) {

            console.log('metodo post: ', jsonResult);

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Seu registro foi alterado',
                showConfirmButton: false,
                timer: 1500
            })

            carregarTabela();
            $("#modal").modal('hide');

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

function deletar(id) {

    Swal.fire({
        title: 'Tem certeza?',
        text: "Você não pode desfazer isso!!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, deletar'
    }).then((result) => {
        if (result.isConfirmed) {

            $.ajax({
                type: 'DELETE',
                url: url + 'user/' + id,
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                success: function (jsonResult) {

                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Seu registro foi deletado',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    carregarTabela();
                },
                error: function (response) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Ocorreu um erro ao inserir os dados... Por favor verifique os campos.',
                        text: `${response.responseJSON.message}`,
        
                      });
                }

            });

        }

    })
}

function retornaDados(id) {

    $.ajax({
        type: 'GET',
        url: url + 'user/' + id,
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (jsonResult) {

            $("#id").val(jsonResult.id);
            $("#name").val(jsonResult.name);
            $("#surname").val(jsonResult.surname);
            $("#document").val(jsonResult.document);
            $("#birthDate").val(jsonResult.birthDate);
            $("#address").val(jsonResult.address);
            $("#user").val(jsonResult.username);
            $("#password").val(jsonResult.name);
            $("#phoneNumber").val(jsonResult.phoneNumber);

            $("#modal").modal("show");

        },
        error: function (response) {
            Swal.fire({
                icon: 'error',
                title: 'Ocorreu um erro ao inserir os dados... Por favor verifique os campos.',
                text: `${response.responseJSON.message}`,

              });
        }

    });

}

function carregarTabela() {

    $.ajax({
        type: 'GET',
        url: url + 'user',
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (jsonResult) {

            var html = "<table class='table table-carrinho align-middle text-center table-hover' id='tabela'><thead>";

            html += `
                    <tr>
                        <td>Nome completo</td>
                        <td>Usuário</td>
                        <td>Celular</td>
                        <td>CPF</td>
                        <td>Endereço</td>
                        <td>Data de nascimento</td>
                        <td>Alterar</td>
                        <td>Excluir</td>
                    </tr>
                    </thead>
                    <tbody>
                    `;

            jsonResult.map(usuario => {
                html += `<tr>
                            <td>${usuario.name} ${usuario.surname}</td>
                            <td>${usuario.username}</td>
                            <td>${usuario.phoneNumber}</td>
                            <td>${usuario.document}</td>
                            <td>${usuario.address}</td>
                            <td>${usuario.birthDate}</td>
                            <td><button onclick="retornaDados(${usuario.id})" class="button-confirm"><h4><i class="bi bi-pen"></i></h4></button></td>
                            <td><button onclick="deletar(${usuario.id})" class="button-cancel"><h4><i class="bi bi-trash"></i></h4></button></td>
                        </tr>`;

            });

            html += "</tbody></table>";

            $("#lista").html(html);

            $("#tabela").DataTable({
                dom: 'Brti',
                responsive: true,
                language: {
                    search: "Pesquisar:",
                    paginate: {
                        "first": "Primeiro",
                        "last": "Último",
                        "next": "Próximo",
                        "previous": "Anterior"
                    },
                    lengthMenu: "Mostrar _MENU_ registros",
                    ZeroRecords: "Sem registros para mostrar",
                    info: "Mostrando _START_ até _END_ registros, de um total de _TOTAL_",
                    "infoEmpty": "Nenhum retorno, ",
                    infoFiltered: "filtrado de _MAX_ alunos",
                    searchPanes: {
                        title: {
                            _: 'Filtros selecionados - %d',
                            0: 'Ou selecione um filtro pré-estabelecido:',
                        }
                    }
                },
                buttons: [
                    {
                        text: '<span><i class="bi bi-person-plus"></i> Novo registro</span>',
                        className: "button-new",
                        action: function ( e, dt, node, config ) {
                            $("#usuarios").trigger("reset");
                            $("#id").val("0");
                            $("#modal").modal("show");
                        }
                    }
                ]

            });

        },
        error: function (http, textStatus) {
            
            if (http.status == 401){
                window.location.href = "login.html?expired=1";
            }
        }

    })
}

$(function () {

    $("header").load("header.html");
    carregaCidade();

    carregarTabela();

    $("#usuarios").on('submit', function (e) {
        e.preventDefault();

        var obj = {

            name: $("#name").val(),
            surname: $("#surname").val(),
            document: $("#document").val(),
            birthDate: $("#birthDate").val(),
            address: $("#address").val(),
            username: $("#user").val(),
            password: $("#password").val(),
            phoneNumber: $("#phoneNumber").val(),
            city: {
                id: parseInt($("#city option:selected").val())
            },
            userType: {
                id: 1
            }

        };

        if ($("#id").val() == "0") {
            inserir(obj);
        } else {
            obj.id = parseInt($("#id").val()),
                alterar(obj);
        }

    });


})
