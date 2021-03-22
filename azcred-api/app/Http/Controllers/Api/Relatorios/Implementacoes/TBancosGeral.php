<?php

namespace App\Http\Controllers\Api\Relatorios\Implementacoes;

use App\Http\Controllers\Api\Relatorios\Config\TPDFDesigner;

class TBancosGeral extends TPDFDesigner
{

    public function Footer()
    {
        $this->SetY(-15);
        $this->SetLineWidth(.4);
        $this->Line(30, 560, 808, 560);
        $this->SetFont('Arial', '', 7);
        $this->SetY(565);
        $this->SetTextColor(0, 0, 0);
        $this->Cell(191, 10, utf8_decode('SisEstoqueWEB - Sistema de Controle de Estoque'), 0, 0, true);
        $this->SetX(745);
        $this->Cell('', 10, utf8_decode("Página ") . $this->PageNo() . " de {nb}", 0, 1);
    }
}
