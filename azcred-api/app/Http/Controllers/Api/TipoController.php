<?php

namespace App\Http\Controllers\Api;

use App\Models\Tipo;
use App\Traits\ApiResponser;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\TipoSistema;
use Validator;
use DB;

class TipoController extends Controller
{
    use ApiResponser;

    public function index(Request $request)
    {
        $nome = $request->all()['nome'] ?? null;

        $tipo = Tipo::where('nome', 'LIKE', "%{$nome}%")->orderBy('nome')->paginate(10);

        return response()->json($tipo);
    }

    public function store(Request $request)
    {
        $this->authorize('CADASTRAR_TIPO_CONTRATO');

        $dados = $request->all()['tipo'];

        $tiposSistemas = $request->all()['tiposSistemas'] ?? null;

        $validator = Validator::make($dados, Tipo::$rules, Tipo::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }

        DB::beginTransaction();
        try {
            $tipo = Tipo::create($dados);

            foreach ($tiposSistemas as $tipoSistema) {
                $novaconta = new TipoSistema;
                $novaconta->tipo_id = $tipo->id;
                $novaconta->sistema_id = $tipoSistema['sistema_id']['id'];
                $novaconta->liquido = $tipoSistema['liquido'];
                $novaconta->save();
            }

            DB::commit();

            return response()->json($tipo, 201);
        } catch (\Exception $e) {
            if (strripos($e->getMessage(), '1451')) {
                DB::rollback();
                return response()->json("Existe um relacionamento com esse tipo", 422);
            }
        }
    }

    public function show($id)
    {
        $tipo = Tipo::findOrFail($id);
        return response()->json($tipo, 200);
    }

    public function update(Request $request, $id)
    {
        $this->authorize('CADASTRAR_TIPO_CONTRATO');

        $dados = $request->all()['tipo'];

        unset($dados['tiposSistemas']);

        $tiposSistemas = $request->all()['tiposSistemas'] ?? null;

        $rulesEdit = ['nome' => "required|min:3|max:50|unique:tipo,nome,{$id}"];
        $validator = Validator::make($dados, $rulesEdit, Tipo::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }

        DB::beginTransaction();
        try {

            $tipo = Tipo::findOrFail($id);

            $tipo->update($dados);

            DB::table('tipo_sistema')->where('tipo_id', '=', $id)->delete();

            foreach ($tiposSistemas as $tipoSistema) {
                $novaconta = new TipoSistema;
                $novaconta->tipo_id = $id;
                $novaconta->sistema_id = $tipoSistema['sistema_id']['id'];
                $novaconta->liquido = $tipoSistema['liquido'];
                $novaconta->save();
            }

            DB::commit();

            return $this->showOne($tipo);
        } catch (\Exception $e) {
            if (strripos($e->getMessage(), '1451')) {
                DB::rollback();
                return response()->json("Existe um relacionamento com esse tipo", 422);
            }
        }
    }

    public function destroy($id)
    {
        $this->authorize('EXCLUIR_TIPO_CONTRATO');

        DB::beginTransaction();
        try {
            $tipo = Tipo::findOrFail($id);
            $tipo->delete();
            DB::table('tipo_sistema')->where('tipo_id', '=', $id)->delete();

            DB::commit();

            return $this->showOne($tipo);
        } catch (\Exception $e) {
            if (strripos($e->getMessage(), '1451')) {
                DB::rollback();
                return response()->json("Existe um relacionamento com esse tipo", 422);
            }
        }
    }

    public function listarAll()
    {
        return response()->json(Tipo::orderBy('nome')->get());
    }

    public function sistemas($id)
    {
        $tipos = Tipo::with(['sistemas.tipo_id', 'sistemas.sistema_id'])->findOrFail($id);

        $tiposSistemas = $tipos->sistemas;

        return $tiposSistemas;
    }
}
