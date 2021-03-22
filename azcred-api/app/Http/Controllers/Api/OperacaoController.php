<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producao;
use App\Traits\ApiResponser;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use Validator;

class OperacaoController extends Controller
{
    use ApiResponser;

    public function index(Request $request)
    {
        $this->authorize('VISUALIZAR_PRODUCAO');

        $operacao = $request->input('operacao') ?? null;
        $cliente = $request->all()['cliente'] ?? null;
        $pago = $request->all()['pago'] ?? null;
        $corretor = $request->all()['corretor'] ?? null;

        $ncr = null;

        if (isset($request->all()['ncr'])) {
            $ncr = Carbon::parse($request->all()['ncr'])->format('Y-m-d');
        }

        $contrato = DB::table('tabela_producao')
            ->join('corretor', 'tabela_producao.corretor_id', '=', 'corretor.id')
            ->select(
                'tabela_producao.*',
                'corretor.nome as corretor'
            )
            ->where('tabela_producao.tipo', '=', 'M')
            ->when($operacao, function ($query, $operacao) {
                $query->where('tabela_producao.operacao', '=', $operacao);
            })
            ->when($pago, function ($query, $pago) {
                $query->where('tabela_producao.pago', '=', $pago);
            })
            ->when($ncr, function ($query, $ncr) {
                $query->whereDate('tabela_producao.data_importacao', $ncr);
            })
            ->when($cliente, function ($query, $cliente) {
                $query->where('tabela_producao.cliente', 'LIKE', "%{$cliente}%");
            })
            ->when($corretor, function ($query, $corretor) {
                $query->where('tabela_producao.corretor_id', $corretor);
            })
            ->orderBy('tabela_producao.id', 'DESC')
            ->paginate(10);

        return response()->json($contrato);
    }

    public function store(Request $request)
    {
        $this->authorize('VISUALIZAR_PRODUCAO');

        $dados = $request->all();

        $rules = [
            'data_ncr' => 'required',
            'cliente' => 'required',
            'corretor_id' => 'required',
            'corretor_valor_comissao' => 'required',
        ];

        $messages = [
            'corretor_id.required' => 'O corretor deve ser preenchido.',
            'cliente.required' => 'A descrição é obrigatória.',
            'data_ncr.date' => 'Data inválida.',
            'corretor_valor_comissao' => 'O valor é obrigatório.',
        ];

        $validator = Validator::make($dados, $rules, $messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(':message') as $error) {
                $displayErrors .= $error;
            }

            return response()->json($displayErrors, 422);
        }

        $producao = new Producao();
        $producao->cpf = '********';
        $producao->contrato = '********';
        $producao->cliente = $dados['cliente'];
        $producao->fisicopendente = null;
        $producao->data_fisico = null;
        $producao->perc_comissao = 0.00;
        $producao->valor_contrato = 0.00;
        $producao->data_operacao = null;
        $producao->data_credito_cliente = null;
        $producao->data_importacao = Carbon::parse($dados['data_ncr'])->format('Y-m-d');
        $producao->usuario = null;
        $producao->corretor_perc_comissao = 0.00;
        if ($dados['operacao'] == 'D') {
            $producao->corretor_valor_comissao = $dados['corretor_valor_comissao'] * (-1);
        }
        if ($dados['operacao'] == 'C') {
            $producao->corretor_valor_comissao = $dados['corretor_valor_comissao'];
        }
        $producao->corretor_id = $dados['corretor_id'];
        $producao->tipo = 'M';
        $producao->operacao = $dados['operacao'];
        $producao->save();
        return response()->json($producao, 201);
    }

    public function show($id)
    {
        $this->authorize('VISUALIZAR_PRODUCAO');
        $contrato = Producao::findOrFail($id);

        return response()->json($contrato, 200);
    }

    public function destroy($id)
    {
        $this->authorize('VISUALIZAR_PRODUCAO');

        $producao = Producao::findOrFail($id);
        $producao->delete();

        return $this->showOne($producao);
    }
}
