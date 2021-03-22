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
        <th>banco</th>
        <th>convenio</th>
        <th>tipo</th>
        <th>tabela</th>
        <th>vigencia</th>
        <th>prazo</th>
        <th>comissao_liquido_agente</th>
        <th>comissao_bruto_agente</th>
        <th>codigo_mg</th>
    </tr>
    </thead>
    <tbody>
    @foreach($tabelas as $tabela)
        <tr>
            <td>{{ $tabela->banco }}</td>
            <td>{{ $tabela->convenio }}</td>
            <td>{{ $tabela->tipo }}</td>
            <td>{{ $tabela->tabela }}</td>
            <td>{{ $tabela->vigencia }}</td>
            <td>{{ $tabela->prazo }}</td>
            <td>{{ $tabela->comissao_liquido_agente }}</td>
            <td>{{ $tabela->comissao_bruto_agente }}</td>
            <td>{{ $tabela->codigo_mg }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
