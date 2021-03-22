<?php

namespace App\Http\Controllers\Api\Relatorios;

use App\Http\Controllers\Api\Relatorios\Implementacoes\TReciboContrato;
use App\Http\Controllers\Controller;
use App\Models\Corretor;
use App\Models\Tarifa;
use App\Models\ViewComissao;
use Carbon\Carbon;
use Illuminate\Http\Request;

class RelatoriosCorretorController extends Controller
{
    public function ContaComissao(Request $request)
    {
        $promotor = $request->all()['promotor'];

        $inicio = null;
        $fim = null;

        if (isset($request->all()['inicio'])) {
            $inicio = Carbon::parse($request->all()['inicio'])->format('Y-m-d');
        }

        if (isset($request->all()['fim'])) {
            $fim = Carbon::parse($request->all()['fim'])->format('Y-m-d');
        }

        $contratos = ViewComissao::whereBetween('data_ncr', [$inicio, $fim])
            ->where('corretor_id', $promotor)
            ->groupBy('corretor_id')
            ->count();

        return response()->json($contratos);
    }

    public function Comissao(Request $request)
    {
        $this->authorize('ACESSO_CORRETOR');

        $promotor = $request->all()['promotor'];

        $inicio = null;
        $fim = null;

        $periodo = '';

        if (isset($request->all()['inicio'])) {
            $inicio = Carbon::parse($request->all()['inicio'])->format('Y-m-d');
        }

        if (isset($request->all()['fim'])) {
            $fim = Carbon::parse($request->all()['fim'])->format('Y-m-d');
        }

        $contratos = ViewComissao::whereBetween('data_ncr', [$inicio, $fim])
            ->where('pago', '=', 'S')
            ->when($promotor, function ($query, $promotor) {
                $query->where('corretor_id', $promotor);
            })
            ->get();

        $periodo = 'PERÍODO: ' . Carbon::parse($request->all()['inicio'])->format('d/m/Y') . ' à ' . Carbon::parse($request->all()['fim'])->format('d/m/Y');

        $designer = new TReciboContrato();
        $designer->SetTitle(utf8_decode('Comissão'));
        $designer->fromXml(app_path('Http/Controllers/Api/Relatorios/Formularios/extratoCorretor.pdf.xml'));
        $designer->Dados_Header($periodo);

        $designer->SetAutoPageBreak(true, 45);
        $designer->generate();

        $total_comissao = 0;
        $total_comissao_quebra = 0;
        $totalTarifa = 0;
        $controle_quebra = null;
        $controle_quebra1 = null;
        $corretor = '';

        $total = 0;

        $designer->SetLineWidth(.1);
        $designer->SetX(15);

        if (count($contratos)) {
            foreach ($contratos as $contrato) {
                if (!isset($controle_quebra) or $controle_quebra !== $contrato->corretor_id) {
                    if (isset($controle_quebra)) {
                        // Total bruto
                        $designer->SetFillColor(200, 200, 200);
                        $designer->SetFont('Arial', 'B', 7);
                        $designer->SetX(15);
                        $designer->Cell(677, 20, utf8_decode('SUBTOTAL'), 1, 0, 'L', true);
                        $designer->Cell(68, 20, number_format($total, 2, ',', '.'), 1, 0, 'R', true);
                        $designer->Cell(65, 20, number_format($total_comissao_quebra, 2, ',', '.'), 1, 1, 'R', true);

                        // Cobranca de Tarifas
                        $designer->SetFillColor(200, 200, 200);
                        $designer->SetFont('Arial', 'B', 7);
                        $designer->SetX(15);
                        $designer->Cell(745, 20, utf8_decode('TARIFA'), 1, 0, 'L', true);
                        $designer->Cell(65, 20, number_format($totalTarifa, 2, ',', '.'), 1, 1, 'R', true);
                        $designer->SetTextColor(0, 0, 0);

                        // Totaliza última quebra
                        $designer->SetFillColor(200, 200, 200);
                        $designer->SetFont('Arial', 'B', 7);
                        $designer->SetX(15);
                        $designer->Cell(745, 20, utf8_decode('TOTAL PAGO'), 1, 0, 'L', true);
                        $designer->Cell(65, 20, number_format($total_comissao_quebra + $totalTarifa, 2, ',', '.'), 1, 1, 'R', true);

                        // IMPRESSAO EM EXTENSO
                        $designer->SetFillColor(255, 255, 255);
                        $designer->SetFont('Arial', '', 8);
                        $designer->SetX(34);
                        $mensagem = "Recebi da AZCred, a importância de R$ ";
                        $mensagem .= number_format($total_comissao_quebra + $totalTarifa, 2, ',', '.') . ' ( ' . Monetary::numberToExt($total_comissao_quebra + $totalTarifa) . ' ), referente ao pagamento de prestação de serviço de vendas. ';
                        $mensagem .= 'Declaro ainda que não trabalho com exclusividade pessoal para esta empresa e que não tenho vínculo empregatício com a mesma, ';
                        $mensagem .= 'estando eu livre, na condição de vendedor autônomo, avulso ou freelance, para continuar vendendo, ao mesmo tempo, produtos de outras empresas, ';
                        $mensagem .= 'até mesmo concorrentes. Pelo qual dou plena, total e geral quitação.';

                        $designer->SetX(15);
                        $designer->MultiCell(810, 12, utf8_decode($mensagem), 0, 'J');

                        $designer->ln(15);
                        $designer->SetX(270);
                        $designer->Cell(269, 12, utf8_decode($corretor), 'T', 1, 'C');

                        $total = 0;
                        $total_comissao_quebra = 0;
                        $totalTarifa = 0;
                        $controle_quebra1 = null;

                        // Cria a nova página
                        $designer->generate();
                        $designer->SetLineWidth(.4);
                        $designer->SetX(15);
                    }

                    // CABEÇALHO CORRETOR
                    $designer->SetFillColor(225, 210, 210);
                    $designer->SetX(15);
                    $designer->SetFont('Arial', 'B', 9);
                    $designer->Cell(810, 20, 'PARCEIRO (A):', 1, 0, 'L', true);
                    $designer->SetFont('Arial', '', 9);
                    $designer->SetX(85);
                    $designer->Cell(500, 20, utf8_decode($contrato->corretor) . ' - ' . $contrato->cpf_corretor, 0, 1, 'L');
                    $designer->SetX(15);
                    $designer->Cell(810, 20, utf8_decode('DADOS BANCÁRIOS: ' . $contrato->banco_corretor . ' AGÊNCIA: ' . $contrato->agencia
                        . ' CONTA: ' . $contrato->conta_numero . ' - ' . $contrato->conta_nome . ' | CHAVE PIX: ' . $contrato->pix), 1, 1, 'L', true);

                    $controle_quebra = $contrato->corretor_id;
                }

                if ($contrato->tipo === 'M') {
                    $designer->SetFont('Arial', 'B', 8);
                    $designer->SetX(15);
                    $designer->SetFillColor(200, 200, 200);
                    $designer->Cell(710, 20, utf8_decode('CRÉDITOS / DÉBITOS'), 1, 0, 'L', true);
                    $designer->Cell(35, 20, 'DATA', 1, 0, 'C', true);
                    $designer->Cell(65, 20, utf8_decode('VALOR R$'), 1, 1, 'C', true);
                }

                if ($controle_quebra1 !== $contrato->banco) {
                    //CABEÇALHO BANCO
                    $designer->SetFont('Arial', 'B', 8);
                    $designer->SetX(15);
                    if ($contrato->tipo === 'I') {
                        $designer->SetFillColor(200, 200, 200);
                        $designer->Cell(810, 20, 'BANCO: ' . utf8_decode($contrato->banco), 1, 1, 'L', true);
                        $controle_quebra1 = $contrato->banco;
                        //CABEÇALHO DETALHES
                        $designer->SetFont('Arial', 'B', 6);
                        $designer->SetX(15);
                        $designer->SetFillColor(200, 200, 200);
                        $designer->Cell(40, 20, 'CPF', 1, 0, 'C', true);
                        $designer->Cell(171, 20, 'CLIENTE', 1, 0, 'L', true);
                        $designer->Cell(50, 20, utf8_decode('DT.OPERAÇÃO'), 1, 0, 'C', true);
                        $designer->Cell(50, 20, 'CRD.CLIENTE', 1, 0, 'C', true);
                        $designer->Cell(35, 20, 'NCR', 1, 0, 'C', true);
                        $designer->Cell(40, 20, 'CONTRATO', 1, 0, 'C', true);
                        $designer->Cell(40, 20, 'PROPOSTA', 1, 0, 'C', true);
                        $designer->Cell(26, 20, 'PRAZO', 1, 0, 'C', true);
                        $designer->Cell(68, 20, 'PRODUTO', 1, 0, 'L', true);
                        $designer->Cell(110, 20, 'TABELA', 1, 0, 'L', true);
                        $designer->Cell(47, 20, utf8_decode('% COMISSÃO'), 1, 0, 'C', true);
                        $designer->Cell(68, 20, 'R$ CONTRATO', 1, 0, 'C', true);
                        $designer->Cell(65, 20, utf8_decode('R$ COMISSÃO'), 1, 1, 'C', true);
                    }
                }

                // Calcula comissão
                $comissao = $contrato->corretor_valor_comissao;

                // acumula total comissao (geral)
                $total_comissao += $comissao;

                // acumula comissao (quebra)
                $total_comissao_quebra += $comissao;

                $totalTarifa = $contrato->tarifa * (-1);

                if ($contrato->tipo === 'I') {
                    $total += $contrato->valor_contrato;
                }

                $corretor = $contrato->corretor;

                // DETALHES
                $designer->SetFont('Arial', '', 6);
                $designer->SetX(15);
                $designer->SetTextColor(0, 0, 0);
                if ($contrato->tipo === 'I') {
                    $designer->Cell(40, 20, $contrato->cpf, 1, 0, 'C');
                    $designer->Cell(171, 20, utf8_decode(substr($contrato->cliente, 0, 100)), 1, 0, 'L');
                    $designer->Cell(50, 20, Carbon::parse($contrato->data_operacao)->format('d/m/Y'), 1, 0, 'C');
                    $designer->Cell(50, 20, Carbon::parse($contrato->data_credito_cliente)->format('d/m/Y'), 1, 0, 'C');
                    $designer->Cell(35, 20, Carbon::parse($contrato->data_ncr)->format('d/m/Y'), 1, 0, 'C');
                    $designer->Cell(40, 20, $contrato->contrato, 1, 0, 'L');
                    $designer->Cell(40, 20, $contrato->proposta, 1, 0, 'L');
                    $designer->Cell(26, 20, $contrato->prazo, 1, 0, 'C');
                    $designer->Cell(68, 20, utf8_decode(substr($contrato->produto, 0, 18)), 1, 0, 'L');
                    $designer->Cell(110, 20, utf8_decode(substr($contrato->tabela, 0, 30)), 1, 0, 'L');
                    $designer->Cell(47, 20, number_format($contrato->corretor_perc_comissao, 2, ',', '.'), 1, 0, 'R');
                    $designer->Cell(68, 20, number_format($contrato->valor_contrato, 2, ',', '.'), 1, 0, 'R');
                } elseif ($contrato->tipo === 'M') {
                    $x = $designer->GetX() + 710;
                    $y = $designer->GetY();
                    $designer->MultiCell(710, 20, utf8_decode($contrato->cliente), 1, 'J');
                    $designer->SetXY($x, $y);
                    $designer->Cell(35, 20, Carbon::parse($contrato->data_importacao)->format('d/m/Y'), 1, 0, 'C');
                }
                $designer->Cell(65, 20, number_format($contrato->corretor_valor_comissao, 2, ',', '.'), 1, 1, 'R');

                $designer->SetTextColor(0, 0, 0);
            }
            $totalTarifa = 0;
            // Total bruto
            $designer->SetFillColor(200, 200, 200);
            $designer->SetFont('Arial', 'B', 7);
            $designer->SetX(15);
            $designer->Cell(677, 20, utf8_decode('SUBTOTAL'), 1, 0, 'L', true);
            $designer->Cell(68, 20, number_format($total, 2, ',', '.'), 1, 0, 'R', true);
            $designer->Cell(65, 20, number_format($total_comissao_quebra, 2, ',', '.'), 1, 1, 'R', true);

            // Cobranca de Tarifas
            $totalTarifa = $contrato->tarifa * (-1);
            $designer->SetFillColor(200, 200, 200);
            $designer->SetFont('Arial', 'B', 7);
            $designer->SetX(15);
            $designer->Cell(745, 20, utf8_decode('TARIFA'), 1, 0, 'L', true);
            $designer->Cell(65, 20, number_format($totalTarifa, 2, ',', '.'), 1, 1, 'R', true);
            $designer->SetTextColor(0, 0, 0);

            // Totaliza última quebra
            $designer->SetFillColor(200, 200, 200);
            $designer->SetFont('Arial', 'B', 7);
            $designer->SetX(15);
            $designer->Cell(745, 20, utf8_decode('TOTAL PAGO'), 1, 0, 'L', true);
            $designer->Cell(65, 20, number_format($total_comissao_quebra + $totalTarifa, 2, ',', '.'), 1, 1, 'R', true);

            // IMPRESSAO EM EXTENSO
            $designer->SetFillColor(255, 255, 255);
            $designer->SetFont('Arial', '', 8);
            $designer->SetX(34);
            $mensagem = "Recebi da AZCred, a importância de R$ ";
            $mensagem .= number_format($total_comissao_quebra + $totalTarifa, 2, ',', '.') . ' ( ' . Monetary::numberToExt($total_comissao_quebra + $totalTarifa) . ' ), referente ao pagamento de prestação de serviço de vendas. ';
            $mensagem .= 'Declaro ainda que não trabalho com exclusividade pessoal para esta empresa e que não tenho vínculo empregatício com a mesma, ';
            $mensagem .= 'estando eu livre, na condição de vendedor autônomo, avulso ou freelance, para continuar vendendo, ao mesmo tempo, produtos de outras empresas, ';
            $mensagem .= 'até mesmo concorrentes. Pelo qual dou plena, total e geral quitação.';

            $designer->SetX(15);
            $designer->MultiCell(810, 12, utf8_decode($mensagem), 0, 'J');

            $designer->ln(15);
            $designer->SetX(270);
            $designer->Cell(269, 12, utf8_decode($contrato->corretor), 'T', 1, 'C');
        }

        $file = time() . '_pagamento.pdf';
        if (!file_exists($file) or is_writable($file)) {
            header('Access-Control-Allow-Headers: Origin, Content-Type');
            header('Content-Type: application/pdf');
            $designer->output('I', $file);
        } else {
            return response()->json(['erro' => 'Problemas ao criar arquivo'], 404);
        }
    }
}
