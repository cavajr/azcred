<?php

namespace App\Http\Controllers\Api\Relatorios\Implementacoes;

use App\Http\Controllers\Api\Relatorios\Config\TPDFDesigner;

class TReciboContrato extends TPDFDesigner
{
    private $periodo;

    public function Dados_Header($periodo)
    {
        $this->periodo = $periodo;
    }

    public function Header()
    {
        $this->AliasNbPages();
        $this->SetTextColor(0, 0, 0);
        $this->Rect(15, 28, 60, 58);
        $this->Image(storage_path('app/public/empresa/logo.jpeg'), 16, 29, 58, 56);
        $this->Rect(75, 28, 750, 58);
        $this->SetFont('Arial', 'B', 20);
        $this->SetXY(44, 38);
        $this->Cell('', 25, utf8_decode('RELATÓRIO DE PAGAMENTO DE COMISSÃO'), 0, 1, 'C');
        $this->SetFont('Arial', 'B', 14);
        $this->SetXY(44, 63);
        $this->Cell('', 15, utf8_decode($this->periodo), 0, 1, 'C');
        $this->ln();
    }

    public function Footer()
    {
        $this->SetY(-15);
        $this->Line(10, 560, 822, 560);
        $this->SetFont('Arial', '', 7);
        $this->SetY(565);
        $this->Cell(161, 10, utf8_decode('ToolConsig - Sistema de Gestão de Contratos'), 0, 0, true);
        $this->SetX(745);
        $this->Cell('', 10, utf8_decode("Página ") . $this->PageNo() . " de {nb}", 0, 1);
    }
}
