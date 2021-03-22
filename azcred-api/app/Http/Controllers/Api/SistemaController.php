<?php

namespace App\Http\Controllers\Api;

use App\Models\Sistema;
use App\Traits\ApiResponser;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;

class SistemaController extends Controller
{
    use ApiResponser;

    public function index(Request $request)
    {
        $this->authorize('VISUALIZAR_SISTEMA');

        $nome = $request->all()['nome'] ?? null;

        $sistema = Sistema::where('nome', 'LIKE', "%{$nome}%")->orderBy('nome')->paginate(10);

        return response()->json($sistema);
    }

    public function store(Request $request)
    {
        $this->authorize('CADASTRAR_SISTEMA');

        $validator = Validator::make($request->all(), Sistema::$rules, Sistema::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }
        $sistema = Sistema::create($request->all());
        return response()->json($sistema, 201);
    }

    public function show($id)
    {
        $this->authorize('CADASTRAR_SISTEMA');

        $sistema = Sistema::findOrFail($id);

        return response()->json($sistema, 200);
    }

    public function update(Request $request, $id)
    {
        $this->authorize('CADASTRAR_SISTEMA');

        $rulesEdit = ['nome' => "required|min:3|max:50|unique:sistema,nome,{$id}"];
        $validator = Validator::make($request->all(), $rulesEdit, Sistema::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }

        $sistema = Sistema::findOrFail($id);
        $sistema->update($request->all());
        return $this->showOne($sistema);
    }

    public function listarAll()
    {
        return response()->json(Sistema::orderBy('nome')->get());
    }
}
