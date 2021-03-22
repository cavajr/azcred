<?php

namespace App\Http\Controllers\Api\Relatorios\Implementacoes;

use App\Http\Controllers\Api\Relatorios\Config\TPDFDesigner;

class TTabelaFinanceiro extends TPDFDesigner
{
    public function Footer()
    {
        $this->SetY(-15);
        $this->Line(24, 810, 568, 810);
        $this->SetFont('Arial', '', 7);
        $this->SetY(815);
        $this->Cell(187, 10, utf8_decode('ToolConsig - Sistema de Gestão de Contratos'), 0, 0, true);
        $this->SetX(490);
        $this->Cell('', 10, utf8_decode("Página ") . $this->PageNo() . " de {nb}", 0, 1);
    }
}
