<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Relatorios\Implementacoes\TListContrato;
use App\Http\Controllers\Controller;
use App\Models\Producao;
use App\Models\Remessa;
use App\Models\RemessaItem;
use App\Traits\ApiResponser;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;

class RemessaController extends Controller
{
    use ApiResponser;

    public function index(Request $request)
    {
        $this->authorize('VISUALIZAR_REMESSA');

        $corretor = $request->all()['corretor'] ?? null;
        $status = $request->all()['status'] ?? null;

        $remessa = DB::table('remessa')
            ->select(
                'remessa.id as id',
                'corretor.nome as corretor',
                'remessa.data_remessa as data_remessa',
                'remessa.status_id as status_id',
                'remessa.data_recebido as data_recebido',
                'status.nome as status'
            )
            ->leftJoin('corretor', 'remessa.corretor_id', '=', 'corretor.id')
            ->leftJoin('status', 'remessa.status_id', '=', 'status.id')
            ->when($corretor, function ($query, $corretor) {
                $query->where('corretor_id', $corretor);
            })
            ->when($status, function ($query, $status) {
                $query->where('status_id', $status);
            })
            ->orderBy('data_remessa', 'DESC')
            ->paginate(10);

        return response()->json($remessa);
    }

    public function show($id)
    {
        $this->authorize('RECEBER_REMESSA');

        $remessa = DB::table('remessa')
            ->select(
                'remessa.id as id',
                'corretor.nome as corretor',
                'remessa.data_remessa as data_remessa',
                'remessa.data_recebido as data_recebido',
                'status.nome as status'
            )
            ->leftJoin('corretor', 'remessa.corretor_id', '=', 'corretor.id')
            ->leftJoin('status', 'remessa.status_id', '=', 'status.id')
            ->where('remessa.id', '=', $id)
            ->first();

        $remessa_item = DB::table('remessa')
            ->join('remessa_item', 'remessa.id', '=', 'remessa_item.remessa_id')
            ->join('tabela_producao', 'remessa_item.contrato_id', '=', 'tabela_producao.id')
            ->select(
                'remessa_item.id as lote',
                'remessa_item.recebido as recebido',
                'tabela_producao.*'
            )
            ->where('remessa.id', '=', $id)
            ->get();

        return response()->json(['remessa' => $remessa, 'remessa_item' => $remessa_item], 200);
    }

    public function destroy($id)
    {
        $this->authorize('EXCLUIR_REMESSA');
        $remessa = Remessa::findOrFail($id);

        $remessa->delete();

        return $this->showOne($remessa);
    }

    public function listarAll()
    {
        return response()->json(Remessa::orderBy('data_remessa', 'DESC')->get());
    }

    public function receberRemessa(Request $request, $id)
    {
        $this->authorize('RECEBER_REMESSA');

        $contador = RemessaItem::where('remessa_id', '=', $id)->where('recebido', '=', 0)->count();

        $selecionados = $request->input('selecionados');

        if ($contador > 0) {
            DB::beginTransaction();
            try {
                $remessa = Remessa::find($id);
                if ($contador === count($selecionados)) {
                    $remessa->status_id = 2;
                } else {
                    $remessa->status_id = 3;
                }
                $remessa->data_recebido = date('Y-m-d');
                $remessa->save();

                foreach ($selecionados as $selecionado) {
                    if ($selecionado['recebido'] === 0) {
                        $item = RemessaItem::find($selecionado['lote']);
                        $item->data_recebido = date('Y-m-d');
                        $item->recebido = 1;
                        $item->save();

                        $contrato = Producao::find($selecionado['id']);
                        $contrato->fisicopendente = 'N';
                        $contrato->data_fisico = date('Y-m-d');
                        $contrato->save();
                    }
                }

                DB::commit();

                return response()->json(['status' => true]);
            } catch (\Exception $e) {
                return response()->json(['status' => false]);
            }
        } else {
            return response()->json('Todos os registros do lote já foram recebidos', 422);
        }
    }

    public function imprimirRemessa(Request $request)
    {
        $this->authorize('IMPRIMIR_REMESSA');

        $promotor = $request->all()['promotor'] ?? null;
        $lote = $request->all()['lote'] ?? null;

        $remessas = DB::table('remessa_item')
            ->join('tabela_producao', 'remessa_item.contrato_id', '=', 'tabela_producao.id')
            ->select(
                'remessa_item.id as lote',
                'remessa_item.remessa_id',
                'remessa_item.recebido as recebido',
                'remessa_item.data_recebido as data_recebido',
                'tabela_producao.*'
            )
            ->where('remessa_item.remessa_id', '=', $lote)
            ->where('remessa_item.recebido', '=', 1)
            ->get();

        $titulo = 'RELATÓRIO DE RECEBIMENTO DE PROTOCOLO - LOTE: '.$lote;

        $designer = new TListContrato();
        $designer->SetTitle(utf8_decode('Recebimento de Protocolo'));
        $designer->fromXml(app_path('Http/Controllers/Api/Relatorios/Formularios/extratoCorretor.pdf.xml'));
        $designer->Dados_Header($titulo, utf8_decode($promotor));
        $designer->SetAutoPageBreak(true, 45);
        $designer->generate();

        $designer->SetLineWidth(.1);
        $designer->SetX(15);

        $controle_quebra = null;

        $cont = 0;

        foreach ($remessas as $contrato) {
            if (!isset($controle_quebra) or $controle_quebra !== $contrato->remessa_id) {
                $designer->SetFont('Arial', 'B', 6);
                $designer->SetX(36);
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
                $designer->Cell(186, 20, 'TABELA', 1, 0, 'L', true);
                $designer->Cell(68, 20, 'R$ CONTRATO', 1, 1, 'C', true);

                $controle_quebra = $contrato->remessa_id;
            }

            $designer->SetFont('Arial', '', 6);
            $designer->SetX(36);
            $designer->SetTextColor(0, 0, 0);
            $designer->Cell(40, 20, $contrato->cpf, 1, 0, 'C');
            $designer->Cell(171, 20, utf8_decode(substr($contrato->cliente, 0, 100)), 1, 0, 'L');
            $designer->Cell(50, 20, Carbon::parse($contrato->data_operacao)->format('d/m/Y'), 1, 0, 'C');
            $designer->Cell(50, 20, Carbon::parse($contrato->data_credito_cliente)->format('d/m/Y'), 1, 0, 'C');
            $designer->Cell(35, 20, Carbon::parse($contrato->data_ncr)->format('d/m/Y'), 1, 0, 'C');
            $designer->Cell(40, 20, $contrato->contrato, 1, 0, 'L');
            $designer->Cell(40, 20, $contrato->proposta, 1, 0, 'L');
            $designer->Cell(26, 20, $contrato->prazo, 1, 0, 'C');
            $designer->Cell(68, 20, utf8_decode(substr($contrato->produto, 0, 18)), 1, 0, 'L');
            $designer->Cell(186, 20, utf8_decode(substr($contrato->tabela, 0, 30)), 1, 0, 'L');
            $designer->Cell(68, 20, number_format($contrato->valor_contrato, 2, ',', '.'), 1, 1, 'R');
            ++$cont;
        }

        $designer->SetFillColor(117, 117, 117);
        $designer->SetX(36);
        $designer->SetFont('Arial', 'B', 10);
        $designer->Cell(700, 14, utf8_decode('NÚMERO DE CONTRATOS:'), 1, 0, 'L', true);
        $designer->Cell(74, 14, number_format($cont, 0, ',', '.'), 1, 1, 'R', true);

        // IMPRESSAO EM EXTENSO
        $designer->ln(15);
        $designer->SetX(100);
        $designer->Cell(269, 12, utf8_decode('Entregue por:'), 'T', 0, 'C');
        $designer->SetX(450);
        $designer->Cell(269, 12, utf8_decode('Recebido por:'), 'T', 1, 'C');

        $file = time().'Remessa.pdf';
        if (!file_exists($file) or is_writable($file)) {
            header('Access-Control-Allow-Headers: Origin, Content-Type');
            header('Content-Type: application/pdf');
            $designer->output('I', $file);
        } else {
            return response()->json(['erro' => 'Problemas ao criar arquivo'], 404);
        }
    }

    public function imprimirRemessaSelecionado(Request $request)
    {
        $this->authorize('IMPRIMIR_REMESSA');

        $promotor = $request->all()['promotor'] ?? null;
        $lote = $request->all()['lote'] ?? null;
        $selecionados = $request->all()['selecionados'] ?? null;

        $selecteds = explode(',', $selecionados);

        $remessas = DB::table('remessa_item')
            ->join('tabela_producao', 'remessa_item.contrato_id', '=', 'tabela_producao.id')
            ->select(
                'remessa_item.id as lote',
                'remessa_item.remessa_id',
                'remessa_item.recebido as recebido',
                'remessa_item.data_recebido as data_recebido',
                'tabela_producao.*'
            )
            ->whereIn('remessa_item.id', $selecteds)
            ->get();

        $titulo = 'RELATÓRIO DE RECEBIMENTO DE PROTOCOLO - LOTE: '.$lote;

        $designer = new TListContrato();
        $designer->SetTitle(utf8_decode('Recebimento de Protocolo'));
        $designer->fromXml(app_path('Http/Controllers/Api/Relatorios/Formularios/extratoCorretor.pdf.xml'));
        $designer->Dados_Header($titulo, utf8_decode($promotor));
        $designer->SetAutoPageBreak(true, 45);
        $designer->generate();

        $designer->SetLineWidth(.1);
        $designer->SetX(15);

        $controle_quebra = null;

        $cont = 0;

        foreach ($remessas as $contrato) {
            if (!isset($controle_quebra) or $controle_quebra !== $contrato->remessa_id) {
                $designer->SetFont('Arial', 'B', 6);
                $designer->SetX(36);
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
                $designer->Cell(186, 20, 'TABELA', 1, 0, 'L', true);
                $designer->Cell(68, 20, 'R$ CONTRATO', 1, 1, 'C', true);

                $controle_quebra = $contrato->remessa_id;
            }

            $designer->SetFont('Arial', '', 6);
            $designer->SetX(36);
            $designer->SetTextColor(0, 0, 0);
            $designer->Cell(40, 20, $contrato->cpf, 1, 0, 'C');
            $designer->Cell(171, 20, utf8_decode(substr($contrato->cliente, 0, 100)), 1, 0, 'L');
            $designer->Cell(50, 20, Carbon::parse($contrato->data_operacao)->format('d/m/Y'), 1, 0, 'C');
            $designer->Cell(50, 20, Carbon::parse($contrato->data_credito_cliente)->format('d/m/Y'), 1, 0, 'C');
            $designer->Cell(35, 20, Carbon::parse($contrato->data_ncr)->format('d/m/Y'), 1, 0, 'C');
            $designer->Cell(40, 20, $contrato->contrato, 1, 0, 'L');
            $designer->Cell(40, 20, $contrato->proposta, 1, 0, 'L');
            $designer->Cell(26, 20, $contrato->prazo, 1, 0, 'C');
            $designer->Cell(68, 20, utf8_decode(substr($contrato->produto, 0, 18)), 1, 0, 'L');
            $designer->Cell(186, 20, utf8_decode(substr($contrato->tabela, 0, 30)), 1, 0, 'L');
            $designer->Cell(68, 20, number_format($contrato->valor_contrato, 2, ',', '.'), 1, 1, 'R');
            ++$cont;
        }

        $designer->SetFillColor(117, 117, 117);
        $designer->SetX(36);
        $designer->SetFont('Arial', 'B', 10);
        $designer->Cell(700, 14, utf8_decode('NÚMERO DE CONTRATOS:'), 1, 0, 'L', true);
        $designer->Cell(74, 14, number_format($cont, 0, ',', '.'), 1, 1, 'R', true);

        // IMPRESSAO EM EXTENSO
        $designer->ln(15);
        $designer->SetX(100);
        $designer->Cell(269, 12, utf8_decode('Entregue por:'), 'T', 0, 'C');
        $designer->SetX(450);
        $designer->Cell(269, 12, utf8_decode('Recebido por:'), 'T', 1, 'C');

        $file = time().'Remessa.pdf';
        if (!file_exists($file) or is_writable($file)) {
            header('Access-Control-Allow-Headers: Origin, Content-Type');
            header('Content-Type: application/pdf');
            $designer->output('I', $file);
        } else {
            return response()->json(['erro' => 'Problemas ao criar arquivo'], 404);
        }
    }
}
