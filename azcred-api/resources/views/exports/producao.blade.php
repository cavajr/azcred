<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<table>
    <thead>
    <tr>
        <th>cpf</th>
        <th>cliente</th>
        <th>banco</th>
        <th>proposta</th>
        <th>contrato</th>
        <th>prazo</th>
        <th>produto</th>
        <th>tabela</th>
        <th>perc_comissao</th>
        <th>valor_contrato</th>
        <th>valor_comissao</th>
        <th>data_operacao</th>
        <th>data_credito_cliente</th>
        <th>data_ncr</th>
        <th>usuario</th>
        <th>fisicopendente</th>
        <th>data_fisico</th>
    </tr>
    </thead>
    <tbody>
    @foreach($producoes as $prod)
        <tr>
            <td>{{ $prod->cpf }}</td>
            <td>{{ $prod->cliente }}</td>
            <td>{{ $prod->banco }}</td>
            <td>{{ $prod->proposta }}</td>
            <td>{{ $prod->contrato }}</td>
            <td>{{ $prod->prazo }}</td>
            <td>{{ $prod->produto }}</td>
            <td>{{ $prod->tabela }}</td>
            <td>{{ $prod->corretor_perc_comissao }}</td>
            <td>{{ $prod->valor_contrato }}</td>
            <td>{{ $prod->corretor_valor_comissao }}</td>
            <td>{{ $prod->data_operacao}}</td>
            <td>{{ $prod->data_credito_cliente }}</td>
            <td>{{ $prod->data_ncr }}</td>
            <td>{{ $prod->usuario }}</td>
            <td>{{ $prod->fisicopendente }}</td>
            <td>{{ $prod->data_fisico }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
