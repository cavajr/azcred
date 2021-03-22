<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Corretor;
use App\Models\CorretorAcesso;
use App\Traits\ApiResponser;
use Illuminate\Http\Request;
use DB;

class CorretorAcessoController extends Controller
{
    use ApiResponser;

    public function show($id)
    {
        $corretor = Corretor::with('acessos')->findOrFail($id);
        return response()->json($corretor, 200);
    }

    public function update(Request $request)
    {
        $this->authorize('ACESSO_CORRETOR');

        $dados = $request->all();

        $acessos = $dados['acessos'];

        unset($dados['acessos']);

        DB::beginTransaction();
        try {
            $corretor = Corretor::findOrFail($dados['id']);

            DB::table('acesso_corretor')->where('corretor_id', '=', $corretor->id)->delete();
            foreach ($acessos as $acesso) {
                $novoAcesso = new CorretorAcesso();
                $novoAcesso->corretor_id = $corretor->id;
                $novoAcesso->banco = $acesso['banco'];
                $novoAcesso->usuario = $acesso['usuario'];
                $novoAcesso->senha = $acesso['senha'];
                $novoAcesso->codigo_agente = $acesso['codigo_agente'];
                $novoAcesso->operador = $acesso['operador'];
                $novoAcesso->save();
            }
            DB::commit();
            return $this->showOne($corretor);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json("Erro ao tentar alterar o corretor", 422);
        }
    }
}
