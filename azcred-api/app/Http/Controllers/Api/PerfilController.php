<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comissao;
use App\Models\Perfil;
use App\Traits\ApiResponser;
use DB;
use Illuminate\Http\Request;
use Validator;

class PerfilController extends Controller
{
    use ApiResponser;

    public function index(Request $request)
    {
        $this->authorize('VISUALIZAR_COMISSAO');

        $nome = $request->all()['nome'] ?? null;

        $perfil = Perfil::where('nome', 'LIKE', "%{$nome}%")->orderBy('nome')->paginate(10);

        return response()->json($perfil);
    }

    public function store(Request $request)
    {
        $this->authorize('CADASTRAR_COMISSAO');

        $validator = Validator::make($request->all(), Perfil::$rules, Perfil::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
            }
            return response()->json($displayErrors, 422);
        }
        $perfil = Perfil::create($request->all());
        return response()->json($perfil, 201);
    }

    public function show($id)
    {
        $this->authorize('CADASTRAR_COMISSAO');

        $perfil = Perfil::findOrFail($id);

        return response()->json($perfil, 200);
    }

    public function update(Request $request, $id)
    {
        $this->authorize('CADASTRAR_COMISSAO');

        $dados = $request->all()['perfil'];

        unset($dados['comissoes']);

        $perfilComissoes = $request->all()['comissoes'] ?? null;

        $rulesEdit = ['nome' => "required|min:3|max:100|unique:perfil,nome,{$id}"];
        $validator = Validator::make($dados, $rulesEdit, Perfil::$messages);
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

            $perfil = Perfil::findOrFail($id);
            $perfil->update($dados);

            DB::table('configuracao_comissao')->where('perfil_id', '=', $id)->delete();

            foreach ($perfilComissoes as $comissao) {
                $newComissao = new Comissao;
                $newComissao->real_percentual = $comissao['real_percentual'];
                $newComissao->perc_pago_inicio = $comissao['perc_pago_inicio'];
                $newComissao->perc_pago_fim = $comissao['perc_pago_fim'];
                $newComissao->comissao = $comissao['comissao'];
                $newComissao->perfil_id = $perfil->id;
                $newComissao->save();
            }

            DB::commit();

            return $this->showOne($perfil);
        } catch (\Exception $e) {
            DB::rollback();
            if (strripos($e->getMessage(), '1451')) {
                return response()->json("Existe um relacionamento com esse Perfil", 422);
            } else {
                return response()->json("Erro ao tentar gravar Perfil", 422);
            }
        }

    }

    public function listarAll()
    {
        return response()->json(Perfil::orderBy('nome')->get());
    }

    public function comissoes($id)
    {
        $perfilsComissoes = Comissao::where('perfil_id', '=', $id)
            ->orderBy('real_percentual')
            ->orderBy('perc_pago_inicio')
            ->get();

        $media = Comissao::where('perfil_id', '=', $id)
            ->orderBy('real_percentual')
            ->avg('comissao');

        return response()->json(['perfilsComissoes' => $perfilsComissoes, 'media' => $media]);
    }
}
