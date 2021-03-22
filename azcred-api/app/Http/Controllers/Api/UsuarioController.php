<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponser;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use Validator;

class UsuarioController extends Controller
{
    use ApiResponser;

    public function index(Request $request)
    {
        $this->authorize('VISUALIZAR_USUARIO');

        $nome = $request->all()['nome'] ?? null;

        $usuario = User::where('name', 'LIKE', "%{$nome}%")->orderBy('name')->paginate(10);

        return response()->json($usuario);
    }

    public function store(Request $request)
    {
        $this->authorize('CADASTRAR_USUARIO');

        $rules = [
            'name'  => 'required|string|max:255',
            'email' => 'required|string|email|min:3|max:255|unique:users',
        ];

        $validator = Validator::make($request->all(), $rules, User::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }

        $usuario = new User;
        $usuario->name = Input::get('name');
        $usuario->email = Input::get('email');
        $usuario->ativo = Input::get('ativo');

        if ($request->has('acesso_externo')) {
            $usuario->acesso_externo = Input::get('acesso_externo');
        }

        if ($request->has('corretor_id')) {
            $usuario->corretor_id = Input::get('corretor_id');
        }

        $usuario->password = bcrypt(Input::get('password'));

        if (Input::get('acesso_externo') == 0) {
            $usuario->corretor_id = null;
            $papeis = Input::get('papeis');
        } else {
            $usuario->corretor_id = Input::get('corretor_id');
            $papeis = ['CORRETORES'];
        }

        $usuario->save();

        $usuario->papeis()->detach();

        foreach ($papeis as $papel) {
            $usuario->adicionaPapel($papel);
        }

        return response()->json($usuario, 201);
    }

    public function show($id)
    {
        $usuario = User::findOrFail($id);
        $papeis = $usuario->papeis;
        unset($usuario->papeis);
        return response()->json(['usuario' => $usuario, 'papeis' => $papeis], 200);
    }

    public function update(Request $request, $id)
    {
        $this->authorize('CADASTRAR_USUARIO');

        $rules = [
            'name'  => 'required|string|max:255',
            'email' => "required|email|min:3|max:255|unique:users,email,{$id}",
        ];

        $validator = Validator::make($request->all(), $rules, User::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }

        $usuario = User::findOrFail($id);
        $usuario->name = Input::get('name');
        $usuario->email = Input::get('email');
        $usuario->ativo = Input::get('ativo');

        if ($request->filled('password')) {
            $usuario->password = bcrypt(Input::get('password'));
        }

        if ($request->has('acesso_externo')) {
            $usuario->acesso_externo = Input::get('acesso_externo');
        }

        if ($request->has('corretor_id')) {
            $usuario->corretor_id = Input::get('corretor_id');
        }

        if (Input::get('acesso_externo') == 0) {
            $usuario->corretor_id = null;
            $papeis = Input::get('papeis');
        } else {
            $usuario->corretor_id = Input::get('corretor_id');
            $papeis = ['CORRETORES'];
        }

        $usuario->save();

        $usuario->papeis()->detach();

        foreach ($papeis as $papel) {
            $usuario->adicionaPapel($papel);
        }

        return $this->showOne($usuario);
    }

    public function destroy($id)
    {
        $this->authorize('EXCLUIR_USUARIO');

        $usuario = User::findOrFail($id);
        $usuario->delete();
        return $this->showOne($usuario);
    }

    public function listarAll()
    {
        return response()->json(User::orderBy('name')->get());
    }
}
