var url = "http://localhost:8080/"

function carregaCategorias() {

    $.ajax({
        type: 'GET',
        url: url + 'category',
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        dataType: "json",
        success: function (jsonResult) {

            var html = "";

            jsonResult.map(categoria => {
                html += `<option value="${categoria.id}">${categoria.description}</option>`;
            });

            $("#category").html(html);

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

function carregaFornecedores() {

    $.ajax({
        type: 'GET',
        url: url + 'provider',
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        dataType: "json",
        success: function (jsonResult) {

            var html = "";

            jsonResult.map(fornecedor => {
                html += `<option value="${fornecedor.id}">${fornecedor.name}</option>`;
            });

            $("#provider").html(html);

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

    $.ajax({
        type: 'POST',
        url: url + 'product',
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        data: data,
        contentType: false,
        processData: false,
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

function alterar(data, id) {

    $.ajax({
        type: 'PUT',
        url: url + 'product/' + id,
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        data: data,
        contentType: false,
        processData: false,
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
                url: url + 'product/' + id,
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
        url: url + 'product/' + id,
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
            $("#user").val(jsonResult.user);
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
        url: url + 'product',
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        dataType: "json",
        success: function (jsonResult) {

            var html = "<table id='tabela' class='table table-carrinho align-middle text-center table-hover'><thead>";

            html += `
                    <tr>
                        <td>Imagem</td>
                        <td>Nome</td>
                        <td>Quantidade</td>
                        <td>Preço unitário</td>
                        <td>Alterar</td>
                        <td>Excluir</td>
                    </tr>
                    </thead>
                    <tbody>
                    `;

            jsonResult.map(produto => {
                html += `<tr>
                            <td><img class="img-thumbnail" src="http://localhost:8080/product/image/${produto.image}"/></td>
                            <td>${produto.name}</td>
                            <td>${produto.quantity}</td>
                            <td>${produto.unitaryPrice}</td>
                            <td><button onclick="retornaDados(${produto.id})" class="button-confirm"><h4><i class="bi bi-pen"></i></h4></button></td>
                            <td><button onclick="deletar(${produto.id})" class="button-cancel"><h4><i class="bi bi-trash"></i></h4></button></td>
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
                            $("#produtos").trigger("reset");
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
    carregaCategorias();
    carregaFornecedores();

    carregarTabela();

    $("#produtos").on('submit', function (e) {
        e.preventDefault();

        var data = new FormData();

        data.append('file',  $('#imagem')[0].files[0]);

        var obj = {

            name: $("#name").val(),
            quantity: parseInt($("#quantity").val()),
            unitaryPrice: parseFloat($("#unitaryPrice").val()),

            provider: {
                id: parseInt($("#provider option:selected").val())
            },
            category: {
                id: parseInt($("#category option:selected").val())
            }

        };


        if ($("#id").val() == "0") {

            var json = JSON.stringify(obj);
            data.append("body", new Blob([json], {type:"application/json"}));
            inserir(data);

        } else {

            var json = JSON.stringify(obj);
            obj.id = parseInt($("#id").val());
            data.append("body", new Blob([json], {type:"application/json"}));
            alterar(data, obj.id);
        }

    });

    $("#inserirDados").on("click", function (e) {
        $("#id").val("0");
        $("#modal").modal("show");
    })
})
