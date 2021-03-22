<?php

namespace App\Http\Controllers\Api\Relatorios;

use App\Http\Controllers\Api\Relatorios\Implementacoes\TFisico;
use App\Http\Controllers\Api\Relatorios\Implementacoes\TPagamentos;
use App\Http\Controllers\Api\Relatorios\Implementacoes\TReciboContrato;
use App\Http\Controllers\Api\Relatorios\Implementacoes\TTabelaFinanceiro;
use App\Http\Controllers\Controller;
use App\Models\Financeiro;
use App\Models\Pagamento;
use App\Models\ViewComissao;
use Carbon\Carbon;
use Illuminate\Http\Request;

class RelatoriosController extends Controller
{
    public function Comissao(Request $request)
    {
        $this->authorize('RELATORIO_COMISSAO');

        $promotor = $request->all()['promotor'] ?? null;

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

    public function controleFinanceiro(Request $request)
    {
        $this->authorize('IMPRIMIR_FINANCEIRO');

        $tipo = $request->all()['tipo'] ?? null;

        $inicio = null;
        $fim = null;

        $cabecalho = '';
        $periodo = '';

        if (isset($request->all()['inicio'])) {
            $inicio = Carbon::parse($request->all()['inicio'])->format('Y-m-d');
        }

        if (isset($request->all()['fim'])) {
            $fim = Carbon::parse($request->all()['fim'])->format('Y-m-d');
        }

        if (!empty($tipo)) {
            if ($tipo == 1) {
                $cabecalho = 'POR TIPO: RECEITAS';
            } else {
                $cabecalho = 'POR TIPO: DESPESAS';
            }
        } else {
            $cabecalho = 'TODOS OS LANÇAMENTOS';
        }

        $lancamentos = Financeiro::whereBetween('data_mov', [$inicio, $fim])
            ->when($tipo, function ($query, $tipo) {
                $query->where('tipo', $tipo);
            })
            ->orderBy('data_mov')
            ->get();

        $periodo = 'PERÍODO: ' . Carbon::parse($request->all()['inicio'])->format('d/m/Y') . ' à ' . Carbon::parse($request->all()['fim'])->format('d/m/Y');

        if ($lancamentos) {
            $designer = new TTabelaFinanceiro();
            $designer->SetTitle('Extrato Financeiro');
            $designer->fromXml(app_path('Http/Controllers/Api/Relatorios/Formularios/extratoFinanceiro.pdf.xml'));
            $designer->replace('{cabecalho}', utf8_decode($cabecalho));
            $designer->replace('{periodo}', utf8_decode($periodo));
            $designer->generate();

            $designer->gotoAnchorXY('detalhes');
            $designer->SetFont('Arial', '', 10);

            $cont = 0;
            $total = 0;

            foreach ($lancamentos as $lanc) {
                if ($cont == 41) {
                    $designer->generate();
                    $designer->gotoAnchorXY('detalhes');
                    $designer->SetFont('Arial', '', 10);
                    $designer->setFillColorRGB('#F9F9FF');
                    $cont = 0;
                }

                $total += $lanc->valor;

                $designer->gotoAnchorX('detalhes');
                if ($lanc->tipo == 1) {
                    $designer->Cell(52, 20, 'RECEITA', 0, 0, 'C');
                } else {
                    $designer->Cell(52, 20, 'DESPESA', 0, 0, 'C');
                }

                $designer->Cell(52, 20, Carbon::parse($lanc->data_mov)->format('d/m/Y'), 0, 0, 'C');
                $designer->Cell(350, 20, utf8_decode($lanc->nome), 0, 0, 'L');
                $designer->Cell(90, 20, number_format($lanc->valor, 2, ',', '.'), 0, 0, 'R');

                $designer->SetTextColor(0, 0, 0);
                $designer->ln();
                ++$cont;
            }

            $designer->SetFillColor(117, 117, 117);
            $designer->SetX(24);
            $designer->SetFont('Arial', 'B', 10);
            $designer->Cell(454, 22, utf8_decode('TOTAL DOS LANÇAMENTOS'), 1, 0, 'L', true);
            $designer->Cell(90, 22, number_format($total, 2, ',', '.'), 1, 0, 'R', true);

            $file = time() . 'extratoFinanceiro.pdf';

            if (!file_exists($file) or is_writable($file)) {
                header('Access-Control-Allow-Headers: Origin, Content-Type');
                header('Content-Type: application/pdf');
                $designer->output('I', $file);
            } else {
                return response()->json(['erro' => 'Problemas ao criar arquivo'], 404);
            }
        } else {
            return response()->json(['erro' => 'Dados não encontrados'], 404);
        }
    }

    public function fisicoPendente(Request $request)
    {
        $this->authorize('IMPRIMIR_FISICO_PENDENTE');

        $promotor = $request->all()['promotor'] ?? null;

        $inicio = null;
        $fim = null;

        $cabecalho = '';
        $periodo = '';

        if (isset($request->all()['inicio'])) {
            $inicio = Carbon::parse($request->all()['inicio'])->format('Y-m-d');
        }

        if (isset($request->all()['fim'])) {
            $fim = Carbon::parse($request->all()['fim'])->format('Y-m-d');
        }

        $contratos = ViewComissao::whereBetween('data_fisico', [$inicio, $fim])
            ->where('fisicopendente', '=', 'S')
            ->when($promotor, function ($query, $promotor) {
                $query->where('corretor_id', $promotor);
            })
            ->get();

        if (!empty($promotor)) {
            $cabecalho = 'POR CORRETOR';
        } else {
            $cabecalho = 'TODOS OS CORRETORES';
        }

        $periodo = 'PERÍODO: ' . Carbon::parse($request->all()['inicio'])->format('d/m/Y') . ' à ' . Carbon::parse($request->all()['fim'])->format('d/m/Y');

        if ($contratos) {
            $designer = new TFisico();
            $designer->SetTitle(utf8_decode('Relatório de Físico Pendente'));
            $designer->fromXml(app_path('Http/Controllers/Api/Relatorios/Formularios/extratoCorretor.pdf.xml'));
            $designer->Dados_Header('RELATÓRIO DE FÍSICO PENDENTE', $cabecalho, $periodo);

            $designer->SetAutoPageBreak(true, 60);
            $designer->generate();

            $total_comissao = 0;
            $total_comissao_quebra = 0;
            $controle_quebra = null;

            $designer->SetLineWidth(.4);
            $designer->SetX(36);

            foreach ($contratos as $contrato) {
                if (!isset($controle_quebra) or $controle_quebra !== $contrato->corretor_id) {
                    if (isset($controle_quebra)) {
                        // Totaliza os contratos do corretor
                        $designer->SetFillColor(200, 200, 200);
                        $designer->SetFont('Arial', 'B', 10);
                        $designer->SetX(36);
                        $designer->Cell(676, 22, utf8_decode('TOTAL PENDENTE'), 1, 0, 'L', true);
                        $designer->Cell(98, 22, number_format($total_comissao_quebra, 2, ',', '.'), 1, 1, 'R', true);

                        $total_comissao_quebra = 0;
                    }

                    // CABEÇALHO CORRETOR
                    $designer->SetFillColor(225, 210, 210);
                    $designer->SetX(36);
                    $designer->SetFont('Arial', 'B', 12);
                    $designer->Cell(774, 24, 'CORRETOR:', 1, 0, 'L', true);
                    $designer->SetFont('Arial', '', 12);
                    $designer->SetX(117);
                    $designer->Cell(659, 24, utf8_decode($contrato->corretor), 0, 1, 'L');

                    //CABEÇALHO DETALHES
                    $designer->SetFont('Arial', 'B', 10);
                    $designer->SetX(36);
                    $designer->SetFillColor(200, 200, 200);
                    $designer->Cell(30, 22, 'DIAS', 1, 0, 'C', true);
                    $designer->Cell(60, 22, 'CPF', 1, 0, 'C', true);
                    $designer->Cell(202, 22, 'CLIENTE', 1, 0, 'L', true);
                    $designer->Cell(80, 22, utf8_decode('DT OPERAÇÃO'), 1, 0, 'C', true);
                    $designer->Cell(62, 22, 'PROPOSTA', 1, 0, 'L', true);
                    $designer->Cell(62, 22, 'CONTRATO', 1, 0, 'L', true);
                    $designer->Cell(180, 22, 'BANCO', 1, 0, 'L', true);
                    $designer->Cell(98, 22, 'VALOR', 1, 1, 'C', true);

                    $controle_quebra = $contrato->corretor_id;
                }

                // Calcula comissão
                $comissao = ($contrato->valor_contrato);

                // acumula total comissao (geral)
                $total_comissao += $comissao;

                // acumula comissao (quebra)
                $total_comissao_quebra += $comissao;

                // DETALHES
                $designer->SetFont('Arial', '', 8);
                $designer->SetX(36);

                if ($contrato->atraso > 5) {
                    $designer->SetTextColor(247, 8, 8);
                    $designer->Cell(30, 22, $contrato->atraso, 1, 0, 'C');
                } else {
                    $designer->SetTextColor(0, 0, 0);
                    $designer->Cell(30, 22, $contrato->atraso, 1, 0, 'C');
                }

                $designer->SetTextColor(0, 0, 0);

                $designer->Cell(60, 22, $contrato->cpf, 1, 0, 'C');
                $designer->Cell(202, 22, utf8_decode($contrato->cliente), 1, 0, 'L');
                $designer->Cell(80, 22, Carbon::parse($contrato->data_operacao)->format('d/m/Y'), 1, 0, 'C');
                $designer->Cell(62, 22, utf8_decode($contrato->proposta), 1, 0, 'L');
                $designer->Cell(62, 22, utf8_decode($contrato->contrato), 1, 0, 'L');
                $designer->Cell(180, 22, utf8_decode($contrato->banco), 1, 0, 'L');
                $designer->Cell(98, 22, number_format($contrato->valor_contrato, 2, ',', '.'), 1, 1, 'R');
            }

            // Totaliza última quebra
            $designer->SetFillColor(200, 200, 200);
            $designer->SetFont('Arial', 'B', 10);
            $designer->SetX(36);
            $designer->Cell(676, 22, utf8_decode('TOTAL PENDENTE'), 1, 0, 'L', true);
            $designer->Cell(98, 22, number_format($total_comissao_quebra, 2, ',', '.'), 1, 1, 'R', true);

            // TOTAL GERAL
            $designer->SetFillColor(200, 200, 200);
            $designer->SetFont('Arial', 'B', 10);
            $designer->SetX(36);
            $designer->Cell(676, 22, utf8_decode('VALOR TOTAL DAS PENDÊNCIAS'), 1, 0, 'L', true);
            $designer->Cell(98, 22, number_format($total_comissao, 2, ',', '.'), 1, 0, 'R', true);

            $file = time() . 'fisicoPendente.pdf';

            if (!file_exists($file) or is_writable($file)) {
                header('Access-Control-Allow-Headers: Origin, Content-Type');
                header('Content-Type: application/pdf');
                $designer->output('I', $file);
            } else {
                return response()->json(['erro' => 'Problemas ao criar arquivo'], 404);
            }
        } else {
            return response()->json(['erro' => 'Dados não encontrados'], 404);
        }
    }

    public function Pagamentos(Request $request)
    {
        $this->authorize('IMPRIMIR_PAGAMENTO');

        $promotor = $request->all()['promotor'] ?? null;

        $inicio = null;
        $fim = null;

        $periodo = '';

        if (isset($request->all()['inicio'])) {
            $inicio = Carbon::parse($request->all()['inicio'])->format('Y-m-d');
        }

        if (isset($request->all()['fim'])) {
            $fim = Carbon::parse($request->all()['fim'])->format('Y-m-d');
        }

        $pagamentos = Pagamento::whereBetween('data_pagamento', [$inicio, $fim])
            ->when($promotor, function ($query, $promotor) {
                $query->where('corretor_id', $promotor);
            })
            ->get();

        $periodo = 'PERÍODO: ' . Carbon::parse($request->all()['inicio'])->format('d/m/Y') . ' à ' . Carbon::parse($request->all()['fim'])->format('d/m/Y');

        $designer = new TPagamentos();
        $designer->SetTitle(utf8_decode('Relatório Sintético de Pagamentos por Corretor'));
        $designer->fromXml(app_path('Http/Controllers/Api/Relatorios/Formularios/extratoCorretor.pdf.xml'));
        $designer->Dados_Header($periodo, 'Relatório Sintético de Pagamentos por Corretor');

        $designer->SetAutoPageBreak(true, 45);
        $designer->generate();

        $total_em_contratos = 0;
        $total_banco = 0;
        $total_empresa = 0;
        $total_tarifa = 0;
        $total_bruto_agente = 0;
        $total_pago = 0;

        $controle_quebra = null;

        $designer->SetLineWidth(.4);
        $designer->SetX(15);

        foreach ($pagamentos as $pagamento) {
            if (!isset($controle_quebra) or $controle_quebra !== $pagamento->corretor_id) {
                if (isset($controle_quebra)) {
                    // Totaliza os pagamentos do corretor
                    $designer->SetFillColor(117, 117, 117);
                    $designer->SetX(15);
                    $designer->Cell(100, 22, 'TOTAL GERAL', 1, 0, 'L', true);
                    $designer->Cell(125, 22, number_format($total_em_contratos, 2, ',', '.'), 1, 0, 'R');
                    $designer->Cell(100, 22, number_format($total_banco, 2, ',', '.'), 1, 0, 'R');
                    $designer->Cell(160, 22, number_format($total_empresa, 2, ',', '.'), 1, 0, 'R');
                    $designer->Cell(143, 22, number_format($total_bruto_agente, 2, ',', '.'), 1, 0, 'R');
                    $designer->Cell(60, 22, number_format($total_tarifa, 2, ',', '.'), 1, 0, 'R');
                    $designer->Cell(122, 22, number_format($total_pago, 2, ',', '.'), 1, 1, 'R');
                    $designer->generate();
                    $designer->SetFont('Arial', '', 12);

                    $total_em_contratos = 0;
                    $total_banco = 0;
                    $total_empresa = 0;
                    $total_tarifa = 0;
                    $total_bruto_agente = 0;
                    $total_pago = 0;
                }

                // CABEÇALHO CORRETOR
                $designer->SetFillColor(225, 210, 210);
                $designer->SetX(15);
                $designer->SetFont('Arial', 'B', 12);
                $designer->Cell(810, 24, 'CORRETOR:', 1, 0, 'L', true);
                $designer->SetFont('Arial', '', 12);
                $designer->SetX(100);
                $designer->Cell(659, 24, utf8_decode($pagamento->corretor->nome), 0, 1, 'L');

                //CABEÇALHO DETALHES
                $designer->SetFont('Arial', 'B', 10);
                $designer->SetX(15);
                $designer->SetFillColor(200, 200, 200);
                $designer->Cell(100, 22, 'DATA PAGAMENTO', 1, 0, 'C', true);
                $designer->Cell(125, 22, 'VALOR EM CONTRATOS', 1, 0, 'C', true);
                $designer->Cell(100, 22, utf8_decode('COMISSÃO BANCO'), 1, 0, 'C', true);
                $designer->Cell(160, 22, utf8_decode('COMISSÃO CORRESPONDENTE'), 1, 0, 'C', true);
                $designer->Cell(143, 22, utf8_decode('COMISSÃO BRUTO AGENTE'), 1, 0, 'C', true);
                $designer->Cell(60, 22, utf8_decode('TARIFA'), 1, 0, 'C', true);
                $designer->Cell(122, 22, utf8_decode('VALOR PAGO'), 1, 1, 'C', true);
                $controle_quebra = $pagamento->corretor_id;
            }

            $designer->SetFont('Arial', '', 10);
            $designer->SetX(15);
            $designer->Cell(100, 14, Carbon::parse($pagamento->data_pagamento)->format('d/m/Y'), 1, 0, 'C');
            $designer->Cell(125, 14, number_format($pagamento->total_valor_contratos, 2, ',', '.'), 1, 0, 'R');
            $designer->Cell(100, 14, number_format($pagamento->total_corrrespondente + $pagamento->valor_bruto, 2, ',', '.'), 1, 0, 'R');
            $designer->Cell(160, 14, number_format($pagamento->total_corrrespondente, 2, ',', '.'), 1, 0, 'R');
            $designer->Cell(143, 14, number_format($pagamento->valor_bruto, 2, ',', '.'), 1, 0, 'R');
            $designer->Cell(60, 14, number_format($pagamento->valor_tarifa, 2, ',', '.'), 1, 0, 'R');
            $designer->Cell(122, 14, number_format($pagamento->valor_pagamento, 2, ',', '.'), 1, 1, 'R');

            $total_em_contratos += $pagamento->total_valor_contratos;
            $total_banco += $pagamento->total_corrrespondente + $pagamento->valor_bruto;
            $total_empresa += $pagamento->total_corrrespondente;
            $total_tarifa += $pagamento->valor_tarifa;
            $total_bruto_agente += $pagamento->valor_bruto;
            $total_pago += $pagamento->valor_pagamento;
        }

        $designer->SetFillColor(117, 117, 117);
        $designer->SetX(15);
        $designer->SetFont('Arial', 'B', 10);
        $designer->Cell(100, 22, 'TOTAL GERAL', 1, 0, 'L', true);
        $designer->Cell(125, 22, number_format($total_em_contratos, 2, ',', '.'), 1, 0, 'R');
        $designer->Cell(100, 22, number_format($total_banco, 2, ',', '.'), 1, 0, 'R');
        $designer->Cell(160, 22, number_format($total_empresa, 2, ',', '.'), 1, 0, 'R');
        $designer->Cell(143, 22, number_format($total_bruto_agente, 2, ',', '.'), 1, 0, 'R');
        $designer->Cell(60, 22, number_format($total_tarifa, 2, ',', '.'), 1, 0, 'R');
        $designer->Cell(122, 22, number_format($total_pago, 2, ',', '.'), 1, 1, 'R');

        $file = time() . '_pagamento_sintetico.pdf';
        if (!file_exists($file) or is_writable($file)) {
            header('Access-Control-Allow-Headers: Origin, Content-Type');
            header('Content-Type: application/pdf');
            $designer->output('I', $file);
        } else {
            return response()->json(['erro' => 'Problemas ao criar arquivo'], 404);
        }
    }
}
