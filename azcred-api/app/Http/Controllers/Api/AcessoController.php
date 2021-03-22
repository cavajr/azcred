<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Acesso;
use App\Traits\ApiResponser;
use Illuminate\Http\Request;
use Validator;

class AcessoController extends Controller
{
    use ApiResponser;

    public function index(Request $request)
    {
        $banco = $request->all()['banco'] ?? null;

        $acesso = Acesso::where('banco', 'LIKE', "%{$banco}%")->orderBy('banco')->paginate(10);

        return response()->json($acesso);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), Acesso::$rules, Acesso::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }
        $acesso = Acesso::create($request->all());
        return response()->json($acesso, 201);
    }

    public function show($id)
    {
        $acesso = Acesso::findOrFail($id);

        return response()->json($acesso, 200);
    }

    public function update(Request $request, $id)
    {
        $rulesEdit = [
            'banco' => "required|min:3|max:200,banco,{$id}",
            'emprestimo' => "required|min:3|max:200,emprestimo,{$id}",
            'login' => "required|min:3|max:200,login,{$id}",
            'senha' => "required|min:3|max:200,senha,{$id}",
            'link' => "required|min:3|max:200,link,{$id}",
        ];
        $validator = Validator::make($request->all(), $rulesEdit, Acesso::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }

        $acesso = Acesso::findOrFail($id);
        $acesso->update($request->all());
        return $this->showOne($acesso);
    }

    public function destroy($id)
    {
        $acesso = Acesso::findOrFail($id);
        $acesso->delete();
        return $this->showOne($acesso);
    }

    public function listarAll()
    {
        return response()->json(Acesso::orderBy('nome')->get());
    }
}
