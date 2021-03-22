<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponser;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Validator;

class ProfileController extends Controller
{
    use ApiResponser;

    public function show($id)
    {
        $usuario = User::findOrFail($id);
        return response()->json($usuario, 200);
    }

    public function subir(Request $request, $id)
    {
        $rules = [
            'arquivo' => 'required|image',
        ];

        $messages = [
            'arquivo.required' => 'Favor selecionar um arquivo',
            'arquivo.image' => 'Favor selecionar uma imagem válida'
        ];

        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
                break;
            }
            return response()->json($displayErrors, 422);
        }

        $usuario = User::findOrFail($id);

        if ($usuario->arquivo && $usuario->arquivo !== "imagens/default.png") {
            Storage::disk('public')->delete($usuario->arquivo);
        }
        if ($request->hasFile('arquivo')) {
            $usuario->arquivo = $request->file('arquivo')->store('imagens', 'public');
        }

        $usuario->save();

        return $this->showOne($usuario);
    }
}
