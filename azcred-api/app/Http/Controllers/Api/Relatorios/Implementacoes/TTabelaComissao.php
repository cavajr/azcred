<?php

namespace App\Http\Controllers\Api\Relatorios\Implementacoes;

use App\Http\Controllers\Api\Relatorios\Config\TPDFDesigner;

class TTabelaComissao extends TPDFDesigner
{
    private $titulo;
    private $cabecalho;

    public function Dados_Header($titulo, $cabecalho)
    {
        $this->titulo    = $titulo;
        $this->cabecalho = $cabecalho;
    }

    public function Header()
    {
        $this->AliasNbPages();
        $this->SetTextColor(0, 0, 0);
        $this->Rect(36, 28, 774, 66);
        $this->SetFont('Arial', 'B', 20);
        $this->SetXY(44, 38);
        $this->Cell('', 25, utf8_decode($this->titulo), 0, 1, 'L');
        $this->SetFont('Arial', 'B', 14);
        $this->SetXY(44, 63);
        $this->Cell('', 18, utf8_decode($this->cabecalho), 0, 1, 'L');
        $this->ln();
    }

    public function Footer()
    {
        $this->SetY(-15);
        $this->Line(36, 560, 810, 560);
        $this->SetFont('Arial', '', 7);
        $this->SetY(565);
        $this->SetTextColor(0, 0, 0);
        $this->Cell(187, 10, utf8_decode('ToolConsig - Sistema de Gestão de Contratos'), 0, 0, true);
        $this->SetX(745);
        $this->Cell('', 10, utf8_decode("Página ") . $this->PageNo() . " de {nb}", 0, 1);
    }
}
