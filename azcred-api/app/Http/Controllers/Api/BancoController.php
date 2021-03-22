<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banco;
use App\Traits\ApiResponser;
use Illuminate\Http\Request;
use Validator;

class BancoController extends Controller
{
    use ApiResponser;

    public function index(Request $request)
    {
        $this->authorize('VISUALIZAR_BANCO');

        $nome = $request->all()['nome'] ?? null;

        $banco = Banco::where('nome', 'LIKE', "%{$nome}%")->orderBy('nome')->paginate(10);

        return response()->json($banco);
    }

    public function store(Request $request)
    {
        $this->authorize('CADASTRAR_BANCO');

        $validator = Validator::make($request->all(), Banco::$rules, Banco::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }
        $banco = Banco::create($request->all());
        return response()->json($banco, 201);
    }

    public function show($id)
    {
        $this->authorize('CADASTRAR_BANCO');

        $banco = Banco::findOrFail($id);

        return response()->json($banco, 200);
    }

    public function update(Request $request, $id)
    {
        $this->authorize('CADASTRAR_BANCO');

        $rulesEdit = ['nome' => "required|min:3|max:35|unique:banco,nome,{$id}"];
        $validator = Validator::make($request->all(), $rulesEdit, Banco::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }

        $banco = Banco::findOrFail($id);
        $banco->update($request->all());
        return $this->showOne($banco);
    }

    public function listarAll()
    {
        return response()->json(Banco::orderBy('nome')->get());
    }
}
