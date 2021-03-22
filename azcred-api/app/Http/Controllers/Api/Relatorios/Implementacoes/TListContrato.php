<?php

namespace App\Http\Controllers\Api\Relatorios\Implementacoes;

use App\Http\Controllers\Api\Relatorios\Config\TPDFDesigner;

class TListContrato extends TPDFDesigner
{
    public function Footer()
    {
        $this->SetY(-15);
        $this->Line(17, 560, 820, 560);
        $this->SetFont('Arial', '', 7);
        $this->SetY(565);
        $this->Cell(168, 10, utf8_decode('ToolConsig - Sistema de Gestão de Contratos'), 0, 0, true);
        $this->SetX(745);
        $this->Cell('', 10, utf8_decode("Página ") . $this->PageNo() . " de {nb}", 0, 1);
    }
}
