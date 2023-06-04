var url = "http://localhost:8080/";

$(() => {

    if (localStorage.getItem('user_type') == "Admin") {

        $("header").load("header.html");

        $.ajax({
            type: 'GET',
            url: url + 'sale',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            success: function (jsonResult) {

                var html = `<table id='tabela' class='table table-carrinho align-middle text-center table-hover'>
            <thead>
            <th>#</th>
            <th>Id do usuário</th>
            <th>Valor total</th>
            <th>Data da compra</th>
            <tbody>`;

                jsonResult.map(log => {
                    html += `<tr>
                    <td>${log.id}</td>
                    <td>${typeof log.user === 'object' ? log.user.id : log.user}</td>
                    <td>${log.totalValue}</td>
                    <td>${log.saleDate}</td>
                </tr>`;
                });

                html += '</tbody></table>';

                $("#lista").html(html);

            },
            error: function (http, textStatus) {

                if (http.status == 401) {
                    window.location.href = "login.html?expired=1";
                }
            }
        })

    } else window.location.href = "home.html";
});