var url = "http://localhost:8080/"

function inserir(data) {

    var json = JSON.stringify(data);
    $.ajax({
        type: 'POST',
        url: url + 'category',
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
        url: url + 'category/' + data.id,
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
                url: url + 'category/' + id,
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
        url: url + 'category/' + id,
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (jsonResult) {

            $("#id").val(jsonResult.id);
            $("#description").val(jsonResult.description);

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
        url: url + 'category',
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
                        <td>Alterar</td>
                        <td>Excluir</td>
                    </tr>
                    </thead>
                    <tbody>
                    `;

            jsonResult.map(tipo_usuario => {
                html += `<tr>
                            <td>${tipo_usuario.description}</td>
                            <td><button onclick="retornaDados(${tipo_usuario.id})" class="button-confirm"><h4><i class="bi bi-pen"></i></h4></button></td>
                            <td><button onclick="deletar(${tipo_usuario.id})" class="button-cancel"><h4><i class="bi bi-trash"></i></h4></button></td>
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
                            $("#categorias").trigger("reset");
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
    carregarTabela();

    $("#categorias").on('submit', function (e) {
        e.preventDefault();

        var obj = {

            description: $("#description").val(),

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
})