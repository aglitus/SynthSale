
var url = "http://localhost:8080/"

function carregaCidade() {

    $.ajax({
        type: 'GET',
        url: url + 'city',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
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
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        type: 'POST',
        url: url + 'provider',
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
        url: url + 'provider/' + data.id,
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
                url: url + 'provider/' + id,
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
        url: url + 'provider/' + id,
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (jsonResult) {

            $("#id").val(jsonResult.id);
            $("#name").val(jsonResult.name);
            $("#document").val(jsonResult.document);
            $("#address").val(jsonResult.address);
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
        url: url + 'provider',
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        dataType: "json",
        success: function (jsonResult) {

            var html = "<table id='tabela' class='table table-carrinho align-middle text-center table-hover'><thead>";

            html += `
                    <tr>
                        <td>Nome</td>
                        <td>CNPJ</td>
                        <td>Endereço</td>
                        <td>Alterar</td>
                        <td>Excluir</td>
                    </tr>
                    </thead>
                    <tbody>
                    `;

            jsonResult.map(fornecedor => {
                html += `<tr>
                            <td>${fornecedor.name}</td>
                            <td>${fornecedor.document}</td>
                            <td>${fornecedor.address}</td>
                            <td><button onclick="retornaDados(${fornecedor.id})" class="button-confirm"><h4><i class="bi bi-pen"></i></h4></button></td>
                            <td><button onclick="deletar(${fornecedor.id})" class="button-cancel"><h4><i class="bi bi-trash"></i></h4></button></td>
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
                            $("#fornecedores").trigger("reset");
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

    $("#fornecedores").on('submit', function (e) {
        e.preventDefault();

        var obj = {

            name: $("#name").val(),
            document: $("#document").val(),
            address: $("#address").val(),
            city: {
                id: parseInt($("#city option:selected").val())
            },

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