<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tarifa;
use App\Traits\ApiResponser;
use Illuminate\Http\Request;
use Validator;

class TarifaController extends Controller
{
    use ApiResponser;

    public function index(Request $request)
    {
        $this->authorize('VISUALIZAR_TARIFA');

        $nome = $request->all()['nome'] ?? null;

        $tarifa = Tarifa::where('nome', 'LIKE', "%{$nome}%")->orderBy('nome')->paginate(10);

        return response()->json($tarifa);
    }

    public function store(Request $request)
    {
        $this->authorize('CADASTRAR_TARIFA');

        $dados = $request->all();

        $validator = Validator::make($dados, Tarifa::$rules, Tarifa::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }
        $tarifa = new Tarifa;
        $tarifa->nome = $dados['nome'];
        $tarifa->valor = $dados['valor'];
        $tarifa->save();
        
        return response()->json($tarifa, 201);
    }

    public function show($id)
    {
        $this->authorize('CADASTRAR_TARIFA');

        $tarifa = Tarifa::findOrFail($id);

        return response()->json($tarifa, 200);
    }

    public function update(Request $request, $id)
    {
        $this->authorize('CADASTRAR_TARIFA');

        $dados = $request->all();

        $rulesEdit = ['nome' => "required|min:3|max:200|unique:tarifa,nome,{$id}"];
        $validator = Validator::make($dados, $rulesEdit, Tarifa::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }

        $tarifa = Tarifa::findOrFail($id);
        $tarifa->nome = $dados['nome'];
        $tarifa->valor = $dados['valor'];
        $tarifa->save();

        return $this->showOne($tarifa);
    }

    public function destroy($id)
    {
        $this->authorize('EXCLUIR_TARIFA');
        $tarifa = Tarifa::findOrFail($id);
        $tarifa->delete();
        return $this->showOne($tarifa);
    }
}
