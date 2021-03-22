<?php

namespace App\Http\Controllers\Api;

use App\Models\Config;
use App\Traits\ApiResponser;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;

class ConfigController extends Controller
{
    use ApiResponser;

    public function show($id)
    {
        $this->authorize('VISUALIZAR_CONFIG');
        $config = Config::findOrFail($id);
        return response()->json($config, 200);
    }

    public function showLogo($id)
    {
        $config = Config::findOrFail($id);
        return response()->json($config, 200);
    }

    public function update(Request $request, $id)
    {
        $this->authorize('VISUALIZAR_CONFIG');

        $validator = Validator::make($request->all(), Config::$rules, Config::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }

        $config = Config::findOrFail($id);
        $config->update($request->all());
        return $this->showOne($config);
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

        $config = Config::findOrFail($id);

        if ($config->logo && $config->logo !== "logo.png") {
            \Storage::disk('public')->delete($config->logo);
        }

        if ($request->hasFile('arquivo')) {
            $config->logo = $request->file('arquivo')->store('empresa', 'public');
        }

        $config->save();

        return $this->showOne($config);
    }
}
