var url = "http://localhost:8080/"

function inserir(data) {

    var json = JSON.stringify(data);
    $.ajax({
        type: 'POST',
        url: url + 'city',
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        contentType: "application/json; charset=utf-8",
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

function alterar(data) {

    var json = JSON.stringify(data);
    $.ajax({
        type: 'PUT',
        url: url + 'city/' + data.id,
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        contentType: "application/json; charset=utf-8",
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
            Swal.fire({
                icon: 'error',
                title: 'Ocorreu um erro ao inserir os dados... Por favor verifique os campos.',
                text: `${response.responseJSON.message}`,

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
                url: url + 'city/' + id,
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
                        title: 'Não é possível deletar o registro. Ele pode estar sendo referenciado em algum outro registro.',

                    });
                }

            });

        }

    })
}

function retornaDados(id) {

    $.ajax({
        type: 'GET',
        url: url + 'city/' + id,
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (jsonResult) {

            $("#id").val(jsonResult.id);
            $("#description").val(jsonResult.description);
            $("#state").val(jsonResult.state);

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
        url: url + 'city',
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        dataType: "json",
        success: function (jsonResult) {

            var html = "<table id='tabela' class='table table-carrinho align-middle text-center table-hover'><thead>";

            html += `
                    <tr>
                        <td>Descrição</td>
                        <td>Estado</td>
                        <td>Alterar</td>
                        <td>Excluir</td>
                    </tr>
                    </thead>
                    <tbody>
                    `;

            jsonResult.map(cidade => {
                html += `<tr>
                            <td>${cidade.description}</td>
                            <td>${cidade.state}</td>
                            <td><button onclick="retornaDados(${cidade.id})" class="button-confirm"><h4><i class="bi bi-pen"></i></h4></button></td>
                            <td><button onclick="deletar(${cidade.id})" class="button-cancel"><h4><i class="bi bi-trash"></i></h4></button></td>
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
                        action: function (e, dt, node, config) {
                            $("#cidades").trigger("reset");
                            $("#id").val("0");
                            $("#modal").modal("show");
                        }
                    }
                ]

            });

        },
        error: function (http, textStatus) {

            if (http.status == 401) {
                window.location.href = "login.html?expired=1";
            }
        }

    })
}

$(function () {

    if (localStorage.getItem('user_type') == "Admin") {

        $("header").load("header.html");

        carregarTabela();

        $("#cidades").on('submit', function (e) {
            e.preventDefault();

            var obj = {

                description: $("#description").val(),
                state: $("#state").val(),

            };

            if ($("#id").val() == "0") {
                inserir(obj);
            } else {
                obj.id = parseInt($("#id").val()),
                    alterar(obj);
            }

        });

        $("#inserirDados").on("click", function (e) {
            $("#id").val("0");
            $("#modal").modal("show");
        })
    } else window.location.href = "home.html";
})
