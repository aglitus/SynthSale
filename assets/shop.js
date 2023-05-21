var url = "http://localhost:8080/";

function carregaProdutos() {

  $.ajax({
    type: 'GET',
    url: url + 'product',
    contentType: "application/json; charset=utf-8",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
    dataType: "json",
    success: function (jsonResult) {

      var html = "";

      jsonResult.map(produto => {
        html += `<div class="card h-100 animate__animated animate__fadeInRight" style="border: 5px solid rgba(49, 28, 237, 0.34);background: linear-gradient(359deg, #d3d8f1a8 0%, #eaf7ff8a 51%, #5631a100 100%); box-shadow: rgba(65, 46, 240, 0.4) 5px 5px, rgba(63, 35, 242, 0.3) 10px 10px, rgba(76, 38, 249, 0.2) 15px 15px, rgba(69, 46, 240, 0.1) 20px 20px, rgba(240, 46, 170, 0.05) 25px 25px; width: 18rem;">
                
                <div class="card-body text-center">

                <div class="card-img-top">
                  <img class="rounded img-fluid crop pb-2" src="http://localhost:8080/product/image/${produto.image}" alt="Card image cap">
                    </div>
                  <h5 class="card-title">${produto.name}</h5>
                  <h4>R$${produto.unitaryPrice}</h4>
                  <p class="card-text">
                    
                    <div class="input-group">
                        <div class="input-group-prepend">
                          <span class="input-group-text desc" id="inputGroup-sizing-sm">Quantidade</span>
                        </div>
                        <input value="1" type="number" min="1" max="${produto.qtde}" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
                      </div>
                </p>
                  <button data-nome="${produto.name}" data-unitary="${produto.unitaryPrice}" data-idprod="${produto.id}" class="button-new"><h4><span><i class="bi bi-cart-plus"></i> Adicionar</span></h4></button>
                </div>
              </div>`;
      });

      $("#produtos").html(html);

    }
  })
}

function retornaCarrinho() {

  var carrinho = localStorage.getItem("carrinho");

  return carrinho != "" && carrinho !== null ? JSON.parse(carrinho) : [];

}

$(function () {

  $("header").load("header.html");

  carregaProdutos();

  $(document).on('click', '.button-new', function (e) {

    e.preventDefault();
    var produto = $(this).parent();

    var obj = {
      id: $(this).data("idprod"),
      nome: $(this).data("nome"),
      qtde: parseInt($(produto[0].children[4].children[1]).val()),
      imagem: $(produto[0].children[0].children[0]).attr('src'),
    };

    var valorTotal = obj.qtde * parseFloat($(this).data("unitary"));

    obj.valorTotal = valorTotal;

    let carrinho = retornaCarrinho();

    var repetido = false;

    var repetido = carrinho.some(el => {

      if (el.id == obj.id) {

        Swal.fire({
          icon: 'error',
          html: 'Item já inserido inserido no carrinho.',
        });

        return true;

      } else return false;

    });

    if (!repetido) {

      carrinho.push(obj);

      localStorage.setItem("carrinho", JSON.stringify(carrinho));

      var contador = 0;

      carrinho.forEach((el) => {
        contador++;
      });

      $("#qtde").text(contador);

      Swal.fire({
        position: 'top-end',
        html: 'Item inserido no carrinho.',
        timer: 1000,
        width: 300,
        backdrop: false,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }



  });

});