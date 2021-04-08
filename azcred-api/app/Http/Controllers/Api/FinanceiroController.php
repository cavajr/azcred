<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Financeiro;
use App\Models\Movimento;
use App\Traits\ApiResponser;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class FinanceiroController extends Controller
{
    use ApiResponser;

    public function index(Request $request)
    {
        $this->authorize('VISUALIZAR_LANCAMENTO');

        $tipo           = $request->all()['tipo'] ?? null;
        $data_mov         = null;
        $nome = $request->all()['nome'] ?? null;

        if (isset($request->all()['data_mov'])) {

            $data_mov = Carbon::parse($request->all()['data_mov'])->format('Y-m-d');
        }

        $financeiro = Financeiro::when($data_mov, function ($query, $data_mov) {
            $query->where('data_mov', $data_mov);
        })
            ->when($nome, function ($query, $nome) {
                $query->where('nome', 'LIKE', "%{$nome}%");
            })
            ->when($tipo, function ($query, $tipo) {
                $query->where('tipo', $tipo);
            })
            ->orderBy('data_mov')
            ->paginate(10);

        return response()->json($financeiro);
    }

    public function store(Request $request)
    {
        $this->authorize('CADASTRAR_LANCAMENTO');

        $dados = $request->all();

        $validator = Validator::make($request->all(), Financeiro::$rules, Financeiro::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }

        if (strlen($dados['data_mov']) > 0) {
            $dados['data_mov'] = Carbon::parse($dados['data_mov'])->format('Y-m-d');
        }

        DB::beginTransaction();
        try {
            $financeiro = Financeiro::create($dados);
            $movimento = new Movimento;
            $movimento->data_mov = $financeiro->data_mov;
            if ($financeiro->tipo == 1) {
                $movimento->tipo = 'R';
            } else {
                $movimento->tipo = 'D';
            }
            $movimento->operacao = 'M';
            $movimento->descricao = $financeiro->nome;
            $movimento->valor = $financeiro->valor;
            $movimento->sistema_id = $financeiro->id;
            $movimento->tabela = 'F';
            $movimento->save();
            DB::commit();
            return response()->json($financeiro, 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json('Erro ao salvar, tente novamente depois', 422);
        }
    }

    public function show($id)
    {
        $this->authorize('CADASTRAR_LANCAMENTO');

        $financeiro = Financeiro::findOrFail($id);

        return response()->json($financeiro, 200);
    }

    public function update(Request $request, $id)
    {
        $this->authorize('CADASTRAR_LANCAMENTO');

        $dados = $request->all();

        $validator = Validator::make($request->all(), Financeiro::$rules, Financeiro::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }

        if (strlen($dados['data_mov']) > 0) {
            $dados['data_mov'] = Carbon::parse($dados['data_mov'])->format('Y-m-d');
        }

        DB::beginTransaction();
        try {
            $financeiro = Financeiro::findOrFail($id);
            $financeiro->update($dados);

            $movimento = Movimento::where('operacao', '=', 'M')->where('tabela', '=', 'F')->where('sistema_id', '=', $financeiro->id)->first();
            $movimento->data_mov = $financeiro->data_mov;
            if ($financeiro->tipo == 1) {
                $movimento->tipo = 'R';
            } else {
                $movimento->tipo = 'D';
            }
            $movimento->operacao = 'M';
            $movimento->descricao = $financeiro->nome;
            $movimento->valor = $financeiro->valor;
            $movimento->tabela = 'F';
            $movimento->sistema_id = $financeiro->id;
            $movimento->save();

            return $this->showOne($financeiro);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json('Erro ao salvar, tente novamente depois', 422);
        }
    }

    public function destroy($id)
    {
        $this->authorize('EXCLUIR_LANCAMENTO');
        DB::beginTransaction();
        try {
            $financeiro = Financeiro::findOrFail($id);
            $financeiro->delete();

            Movimento::where('operacao', '=', 'M')->where('tabela', '=', 'F')->where('sistema_id', '=', $financeiro->id)->delete();
            DB::commit();

            return $this->showOne($financeiro);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json('Erro ao salvar, tente novamente depois', 422);
        }
    }
}
