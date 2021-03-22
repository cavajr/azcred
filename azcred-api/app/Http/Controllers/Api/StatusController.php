<?php

namespace App\Http\Controllers\Api;

use App\Models\Status;
use App\Traits\ApiResponser;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Validator;

class StatusController extends Controller
{
    use ApiResponser;

    public function index(Request $request)
    {
        $this->authorize('VISUALIZAR_STATUS');

        $nome = $request->all()['nome'] ?? null;

        $status = Status::where('nome', 'LIKE', "%{$nome}%")->orderBy('nome')->paginate(10);

        return response()->json($status);
    }

    public function store(Request $request)
    {
        $this->authorize('CADASTRAR_STATUS');

        $validator = Validator::make($request->all(), Status::$rules, Status::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }
        $status = Status::create($request->all());
        return response()->json($status, 201);
    }

    public function show($id)
    {
        $this->authorize('CADASTRAR_STATUS');

        $status = Status::findOrFail($id);

        return response()->json($status, 200);
    }

    public function update(Request $request, $id)
    {
        $this->authorize('CADASTRAR_STATUS');

        $rulesEdit = ['nome' => "required|min:3|max:20|unique:status,nome,{$id}"];
        $validator = Validator::make($request->all(), $rulesEdit, Status::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }

        $status = Status::findOrFail($id);
        $status->update($request->all());
        return $this->showOne($status);
    }

    public function destroy($id)
    {
        $this->authorize('EXCLUIR_STATUS');
        $status = Status::findOrFail($id);

        $status->delete();
        return $this->showOne($status);
    }

    public function listarAll()
    {
        return response()->json(Status::orderBy('nome')->get());
    }
}
