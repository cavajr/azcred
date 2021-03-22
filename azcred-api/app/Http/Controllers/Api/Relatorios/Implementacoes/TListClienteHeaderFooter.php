<?php

namespace App\Http\Controllers\Api\Relatorios\Implementacoes;

use App\Http\Controllers\Api\Relatorios\Config\TPDFDesigner;

class TListClienteHeaderFooter extends TPDFDesigner
{

    public function Header()
    {
        $this->AliasNbPages();
        $this->SetFont('Arial', 'B', 20);
        $this->SetX(9);
        $this->Cell(0, 10, utf8_decode('LISTAGEM DE CLIENTES'), 0, 1, 'L', '');

        $this->Line(10, 20, 285, 20);

        $this->SetLineWidth(.4);
        $this->SetDrawColor(131, 131, 131);

        $this->Line(10, 26, 285, 26);

        $this->SetFont('Arial', 'B', 12);
        $this->SetX(10);
        $this->Cell(80, 20, utf8_decode('CLIENTES'), 0, 0, 'L');
        $this->Cell(30, 20, utf8_decode('CPF'), 0, 0, 'L');
        $this->Cell(49, 20, utf8_decode('TELEFONES'), 0, 0, 'L');
        $this->Cell(116, 20, utf8_decode('OBSERVAÇÕES'), 0, 0, 'L');
        $this->Line(10, 33, 285, 33);
    }

    public function Footer()
    {
        $this->SetY(-15);
        $this->Line(10, 200, 285, 200);
        $this->SetFont('Arial', '', 7);
        $this->SetX(9);
        $this->Cell(0, 15, utf8_decode('ToolConsig - Sistema de Gestão de Contratos'), 0, 0);
        $this->SetX(260);
        $this->Cell(0, 15, utf8_decode("Página ") . $this->PageNo() . " de {nb}", 0, 1);
    }
}
