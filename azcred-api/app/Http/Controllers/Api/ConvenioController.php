<?php

namespace App\Http\Controllers\Api;

use App\Models\Convenio;
use App\Traits\ApiResponser;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;

class ConvenioController extends Controller
{
    use ApiResponser;

    public function index(Request $request)
    {
        $this->authorize('VISUALIZAR_CONVENIO');

        $nome = $request->all()['nome'] ?? null;

        $convenio = Convenio::where('nome', 'LIKE', "%{$nome}%")->orderBy('nome')->paginate(10);

        return response()->json($convenio);
    }

    public function store(Request $request)
    {
        $this->authorize('CADASTRAR_CONVENIO');

        $validator = Validator::make($request->all(), Convenio::$rules, Convenio::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }
        $convenio = Convenio::create($request->all());
        return response()->json($convenio, 201);
    }

    public function show($id)
    {
        $this->authorize('CADASTRAR_CONVENIO');

        $convenio = Convenio::findOrFail($id);
        return response()->json($convenio, 200);
    }

    public function update(Request $request, $id)
    {
        $this->authorize('CADASTRAR_CONVENIO');

        $rulesEdit = ['nome' => "required|min:3|max:100|unique:convenio,nome,{$id}"];
        $validator = Validator::make($request->all(), $rulesEdit, Convenio::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }
        $convenio = Convenio::findOrFail($id);
        $convenio->update($request->all());
        return $this->showOne($convenio);
    }

    public function listarAll()
    {
        return response()->json(Convenio::orderBy('nome')->get());
    }
}
