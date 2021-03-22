<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Papel;
use App\Traits\ApiResponser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use Validator;

class PapeisController extends Controller
{
    use ApiResponser;

    public function index(Request $request)
    {
        $this->authorize('VISUALIZAR_GRUPO');

        $nome = $request->all()['nome'] ?? null;

        $papel = Papel::where('nome', 'LIKE', "%{$nome}%")->orderBy('nome')->paginate(10);

        return response()->json($papel);
    }

    public function store(Request $request)
    {
        $this->authorize('CADASTRAR_GRUPO');

        $rules = [
            'nome' => 'required|min:3|max:30|unique:papeis',
        ];

        $messages = [
            'nome.required' => 'O perfil deve ser preenchido.',
            'nome.unique' => 'Já existe um perfil com esse nome.',
            'nome.min' => 'O tamanho mínimo do perfil é :min caracteres.',
            'nome.max' => 'O tamanho máximo do perfil é :max caracteres.',
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

        $papel = new Papel;
        $papel->nome = Input::get('nome');
        $papel->descricao = Input::get('descricao');
        $papel->save();

        $permissoes = Input::get('permissoes');

        $papel->permissoes()->detach();

        foreach ($permissoes as $permissao) {
            $papel->adicionaPermissao($permissao);
        }

        return response()->json($papel, 201);
    }

    public function show($id)
    {
        $this->authorize('CADASTRAR_GRUPO');

        $grupo = Papel::findOrFail($id);
        $permissoes = $grupo->permissoes;
        unset($grupo->permissoes);
        return response()->json(['grupo' => $grupo, 'permissoes' => $permissoes], 200);
    }


    public function update(Request $request, $id)
    {
        $this->authorize('CADASTRAR_GRUPO');

        $rulesEdit = ['nome' => "required|min:3|max:35|unique:papeis,nome,{$id}"];
        $messages = [
            'nome.required' => 'O perfil deve ser preenchido.',
            'nome.unique' => 'Já existe um perfil com esse nome.',
            'nome.min' => 'O tamanho mínimo do perfil é :min caracteres.',
            'nome.max' => 'O tamanho máximo do perfil é :max caracteres.',
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
        $papel = Papel::findOrFail($id);
        $papel->nome = Input::get('nome');
        $papel->descricao = Input::get('descricao');
        $papel->save();

        $permissoes = Input::get('permissoes');

        $papel->permissoes()->detach();

        foreach ($permissoes as $permissao) {
            $papel->adicionaPermissao($permissao);
        }

        return $this->showOne($papel);
    }

    public function destroy($id)
    {
        $this->authorize('EXCLUIR_GRUPO');

        $papel = Papel::findOrFail($id);
        $papel->delete();
        return $this->showOne($papel);
    }

    public function listarAll()
    {
        return response()->json(
            Papel::orderBy('nome')
                ->where('nome', '<>', 'CORRETORES')
                ->get()
        );
    }
}
