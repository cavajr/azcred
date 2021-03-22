<?php

namespace App\Http\Controllers\Api;

use App\Models\Bancopg;
use App\Traits\ApiResponser;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;

class BancopgController extends Controller
{
    use ApiResponser;

    public function index(Request $request)
    {
        $this->authorize('VISUALIZAR_BANCOPG');
        $nome = $request->all()['nome'] ?? null;

        $bancopg = Bancopg::where('nome', 'LIKE', "%{$nome}%")->orderBy('nome')->paginate(10);

        return response()->json($bancopg);
    }

    public function store(Request $request)
    {
        $this->authorize('CADASTRAR_BANCOPG');
        $validator = Validator::make($request->all(), Bancopg::$rules, Bancopg::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }

        $bancopg = Bancopg::create($request->all());
        return response()->json($bancopg, 201);
    }

    public function show($id)
    {
        $this->authorize('CADASTRAR_BANCOPG');
        $bancopg = Bancopg::findOrFail($id);
        return response()->json($bancopg, 200);
    }

    public function update(Request $request, $id)
    {
        $this->authorize('CADASTRAR_BANCOPG');
        $rulesEdit = ['nome' => "required|min:3|max:35|unique:bancopg,nome,{$id}"];
        $validator = Validator::make($request->all(), $rulesEdit, Bancopg::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }

        $bancopg = Bancopg::findOrFail($id);
        $bancopg->update($request->all());
        return $this->showOne($bancopg);
    }

    public function listarAll()
    {
        return response()->json(Bancopg::orderBy('nome')->get());
    }
}
