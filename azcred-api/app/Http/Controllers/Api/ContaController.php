<?php

namespace App\Http\Controllers\Api;

use App\Models\Conta;
use App\Traits\ApiResponser;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;

class ContaController extends Controller
{
    use ApiResponser;

    public function index(Request $request)
    {
        $this->authorize('VISUALIZAR_CONTA');

        $nome = $request->all()['nome'] ?? null;

        $conta = Conta::where('nome', 'LIKE', "%{$nome}%")->orderBy('nome')->paginate(10);

        return response()->json($conta);
    }

    public function store(Request $request)
    {
        $this->authorize('CADASTRAR_CONTA');

        $validator = Validator::make($request->all(), Conta::$rules, Conta::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }
        $conta = Conta::create($request->all());
        return response()->json($conta, 201);
    }

    public function show($id)
    {
        $this->authorize('CADASTRAR_CONTA');

        $conta = Conta::findOrFail($id);
        return response()->json($conta, 200);
    }

    public function update(Request $request, $id)
    {
        $this->authorize('CADASTRAR_CONTA');

        $rulesEdit = ['nome' => "required|min:3|max:35|unique:conta,nome,{$id}"];
        $validator = Validator::make($request->all(), $rulesEdit, Conta::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }
        $conta = Conta::findOrFail($id);
        $conta->update($request->all());
        return $this->showOne($conta);
    }

    public function listarAll()
    {
        return response()->json(Conta::orderBy('nome')->get());
    }
}
