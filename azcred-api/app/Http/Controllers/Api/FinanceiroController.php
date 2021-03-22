<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Financeiro;
use App\Traits\ApiResponser;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Validator;

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

            foreach($messages->all(":message") as $error){
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }

        if (strlen($dados['data_mov']) > 0) {
            $dados['data_mov'] = Carbon::parse($dados['data_mov'])->format('Y-m-d');
        }

        $financeiro = Financeiro::create($dados);
        return response()->json($financeiro, 201);
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

            foreach($messages->all(":message") as $error){
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }

        if (strlen($dados['data_mov']) > 0) {
            $dados['data_mov'] = Carbon::parse($dados['data_mov'])->format('Y-m-d');
        }

        $financeiro = Financeiro::findOrFail($id);
        $financeiro->update($dados);
        return $this->showOne($financeiro);
    }

    public function destroy($id)
    {
        $this->authorize('EXCLUIR_LANCAMENTO');
        $financeiro = Financeiro::findOrFail($id);

        $financeiro->delete();
        return $this->showOne($financeiro);
    }
    
}
