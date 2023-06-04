var url = "http://localhost:8080/";

function removerItem(id) {

    var items = JSON.parse(localStorage.getItem('carrinho'));

    var filtrado = items.filter((item) => item.id !== id);

    localStorage.setItem('carrinho', JSON.stringify(filtrado));

    carregaCarrinho();

}

function carregaCarrinho() {

    if (localStorage.getItem("carrinho") != "" && localStorage.getItem("carrinho") != "[]" && localStorage.getItem("carrinho") != null) {

        var items = JSON.parse(localStorage.getItem('carrinho'));

        var html = `<table id="tabela" class="table table-hover table-carrinho align-middle text-center">
        <thead>
            <th>Imagem</th>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Valor</th>
            <th>Remover</th>
        </thead>
        <tbody>`;

        var valorDaCompra = 0;

        items.map(el => {

            html += `<tr>
            <td><img width="100" class="img-fluid" src="${el.imagem}"</td>
            <td>${el.nome}</td>
            <td>${el.qtde}</td>
            <td>R$${el.valorTotal}</td>
            <td><button class="button-cancel" onclick=removerItem(${el.id})>X</button></td>
        </tr>`;

            valorDaCompra += el.valorTotal;

        });

        html += `</tbody></table>`;

        $("#vlr").text(valorDaCompra);

        $("#produtos").html(html);

        $("#linha_compra").removeClass("d-none");

    } else {
        $("#produtos").html("<table class='table-carrinho' id='tabela'><th class='text-center'>Sem itens no carrinho.</th></table>");
        $("#linha_compra").addClass("d-none");
        $("#qtde").text("");

    };


}

$(function () {

    $('header').load('header.html');

    carregaCarrinho();

    $("#salvar").on('click', function (e) {

        var obj = {
            user: {
                id: parseInt(localStorage.getItem('user_id'))
            },
            totalValue: parseFloat($("#vlr").text()),
            saleDate: new Date().toJSON().slice(0, 10)
        }

        $.ajax({
            type: "POST",
            url: url + 'sale',
            contentType: "application/json; charset=utf-8",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            data: JSON.stringify(obj),
            dataType: "json",
            success: function (data) {
                var produtos = JSON.parse(localStorage.getItem('carrinho'));

                produtos.forEach(el => {

                    var obj_produtoVenda = {
                        sale: {
                            id: data.id,
                        },
                        product: {
                            id: el.id
                        }
                    };

                    $.ajax({
                        type: "POST",
                        url: url + 'productSale',
                        contentType: "application/json; charset=utf-8",
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem("token")
                        },
                        data: JSON.stringify(obj_produtoVenda),
                        dataType: "json",
                        async: false,
                        success: function (data) {

                        }
                    });

                    $.ajax({
                        type: 'GET',
                        url: url + `product/removeStock/${el.id}/${el.qtde}`,
                        contentType: "application/json; charset=utf-8",
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem("token")
                        },
                        dataType: "json",
                        async: false,
                        success: function (json) {
                
                            console.log(json)
                        }
                    });

                });

                Swal.fire({
                    icon: 'success',
                    html: 'Venda realizada com sucesso!',
                });

                localStorage.setItem("carrinho", "");
                carregaCarrinho();

            }
        })
    });

})