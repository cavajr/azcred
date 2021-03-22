<?php

namespace App\Http\Controllers\Api;

use App\Permissao;
use App\Traits\ApiResponser;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;

class PermissoesController extends Controller
{
    use ApiResponser;

    public function index(Request $request)
    {
        $this->authorize('VISUALIZAR_PERMISSAO');

        $nome = $request->all()['nome'] ?? null;

        $permissao = Permissao::where('nome', 'LIKE', "%{$nome}%")->orderBy('nome')->paginate(10);

        return response()->json($permissao);
    }

    public function listarAll()
    {
        return response()->json(Permissao::orderBy('nome')->get());
    }


    public function store(Request $request)
    {
        $this->authorize('CADASTRAR_PERMISSAO');

        $rules = [
            'nome' => 'required|min:3|max:30|unique:permissoes',
        ];

        $messages = [
            'nome.required' => 'A permissão deve ser preenchida.',
            'nome.unique' => 'Já existe uma permissão com esse nome.',
            'nome.min' => 'O tamanho mínimo da permissão é :min caracteres.',
            'nome.max' => 'O tamanho máximo da permissão é :max caracteres.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }
        $permissao = Permissao::create($request->all());
        return response()->json($permissao, 201);
    }

    public function show($id)
    {
        $this->authorize('CADASTRAR_PERMISSAO');

        $permissao = Permissao::findOrFail($id);

        return response()->json($permissao, 200);
    }

    public function update(Request $request, $id)
    {
        $this->authorize('CADASTRAR_PERMISSAO');

        $rulesEdit = ['nome' => "required|min:3|max:35|unique:permissoes,nome,{$id}"];
        $messages = [
            'nome.required' => 'A permissão deve ser preenchida.',
            'nome.unique' => 'Já existe uma permissão com esse nome.',
            'nome.min' => 'O tamanho mínimo da permissão é :min caracteres.',
            'nome.max' => 'O tamanho máximo da permissão é :max caracteres.',
        ];

        $validator = Validator::make($request->all(), $rulesEdit, $messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }
        $permissao = Permissao::findOrFail($id);
        $permissao->update($request->all());
        return $this->showOne($permissao);
    }

    public function destroy($id)
    {
        $this->authorize('EXCLUIR_PERMISSAO');

        $permissao = Permissao::findOrFail($id);
        $permissao->delete();
        return $this->showOne($permissao);
    }
}
