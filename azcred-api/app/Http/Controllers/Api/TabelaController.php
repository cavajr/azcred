<?php

namespace App\Http\Controllers\Api;

use App\Exports\ComissaoExport;
use App\Http\Controllers\Controller;
use App\Models\Comissao;
use App\Models\Tabela;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class TabelaController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('VISUALIZAR_TABELA');

        $banco = $request->all()['banco'] ?? null;
        $convenio = $request->all()['convenio'] ?? null;
        $tipo = $request->all()['tipo'] ?? null;
        $perfil = $request->all()['perfil'] ?? null;
        $tabela = $request->all()['tabela'] ?? null;
        $prazo = $request->all()['prazo'] ?? null;

        // Cria tabela temporária para cálculo
        $file = time() . '_temp';

        Schema::create($file, function (Blueprint $table) {
            $table->integer('id');
            $table->string('banco');
            $table->string('convenio');
            $table->string('tipo');
            $table->string('tabela');
            $table->date('vigencia')->nullable(true);
            $table->string('prazo')->nullable(true);
            $table->integer('sistema_id');
            $table->float('comissao_geral_sistema', 9, 2);
            $table->float('comissao_liquido_sistema', 9, 2);
            $table->float('comissao_bruto_sistema', 9, 2);
            $table->float('comissao_liquido_agente', 9, 2);
            $table->float('comissao_liquido_correspondente', 9, 2);
            $table->float('comissao_bruto_agente', 9, 2);
            $table->float('comissao_bruto_correspondente', 9, 2);
            $table->string('codigo_mg')->nullable(true);
        });
        // Fim da criação

        $tabelas = Tabela::join('banco', 'tabela_comissao.banco_id', '=', 'banco.id')
            ->join('convenio', 'tabela_comissao.convenio_id', '=', 'convenio.id')
            ->join('tipo', 'tabela_comissao.tipo_id', '=', 'tipo.id')
            ->select(
                'banco.nome AS banco',
                'convenio.nome AS convenio',
                'tipo.nome AS tipo',
                'tabela_comissao.*'
            )
            ->where('tabela_comissao.banco_id', '=', $banco)
            ->where('tabela_comissao.convenio_id', '=', $convenio)
            ->where('tabela_comissao.tipo_id', '=', $tipo)
            ->when($tabela, function ($query, $tabela) {
                $query->where('tabela_comissao.tabela', 'LIKE', "%{$tabela}%");
            })
            ->when($prazo, function ($query, $prazo) {
                $query->where('tabela_comissao.prazo', 'LIKE', "%{$prazo}%");
            })
            ->orderBy('tabela_comissao.banco_id')
            ->orderBy('tabela_comissao.convenio_id')
            ->orderBy('tabela_comissao.tipo_id')
            ->orderBy('tabela_comissao.comissao_geral_sistema', 'desc')
            ->get();

        foreach ($tabelas as $tabela) {
            $comissao_liquido_agente = 0.00;
            $comissao_liquido_correspondente = 0.00;
            $comissao_bruto_agente = 0.00;
            $comissao_bruto_correspondente = 0.00;
            $valor_comissao = 0.00;

            if (($tabela->comissao_liquido_sistema === 0) && ($tabela->comissao_bruto_sistema === 0)) {
                $comissao_liquido_agente = 0.00;
                $comissao_liquido_correspondente = 0.00;
                $comissao_bruto_agente = 0.00;
                $comissao_bruto_correspondente = 0.00;
            } else {
                if ($tabela->comissao_liquido_sistema > 0) {
                    $comissao = Comissao::select('comissao')
                        ->where('real_percentual', '=', $tabela->em_real)
                        ->where('perfil_id', '=', $perfil)
                        ->whereRaw('perc_pago_inicio <= ' . $tabela->comissao_liquido_sistema)
                        ->orderBy('real_percentual')
                        ->orderBy('perc_pago_inicio', 'desc')
                        ->first();
                    if ($comissao) {
                        $valor_comissao = $comissao->comissao;
                    } else {
                        $valor_comissao = 0;
                    }
                    $resultado = $tabela->comissao_liquido_sistema - $valor_comissao;
                    if ($valor_comissao >= $tabela->comissao_liquido_sistema) {
                        $comissao_liquido_correspondente = $tabela->comissao_liquido_sistema;
                        $comissao_liquido_agente = 0.00;
                    } else {
                        if ($valor_comissao === 0) {
                            $comissao_liquido_correspondente = $tabela->comissao_liquido_sistema;
                            $comissao_liquido_agente = 0.00;
                        } else {
                            $comissao_liquido_agente = $resultado;
                            $comissao_liquido_correspondente = $valor_comissao;
                        }
                    }
                }
                if ($tabela->comissao_bruto_sistema > 0) {
                    $comissao = Comissao::select('comissao')
                        ->where('real_percentual', '=', $tabela->em_real)
                        ->where('perfil_id', '=', $perfil)
                        ->whereRaw('perc_pago_inicio <= ' . $tabela->comissao_bruto_sistema)
                        ->orderBy('real_percentual')
                        ->orderBy('perc_pago_inicio', 'desc')
                        ->first();
                    if ($comissao) {
                        $valor_comissao = $comissao->comissao;
                    } else {
                        $valor_comissao = 0;
                    }
                    $resultado = $tabela->comissao_bruto_sistema - $valor_comissao;
                    if ($valor_comissao >= $tabela->comissao_bruto_sistema) {
                        $comissao_bruto_correspondente = $tabela->comissao_bruto_sistema;
                        $comissao_bruto_agente = 0.00;
                    } else {
                        if ($valor_comissao === 0) {
                            $comissao_bruto_correspondente = $tabela->comissao_bruto_sistema;
                            $comissao_bruto_agente = 0.00;
                        } else {
                            $comissao_bruto_agente = $resultado;
                            $comissao_bruto_correspondente = $valor_comissao;
                        }
                    }
                }
            }

            DB::table($file)->insert(
                [
                    'id' => $tabela->id,
                    'banco' => $tabela->banco,
                    'convenio' => $tabela->convenio,
                    'tipo' => $tabela->tipo,
                    'tabela' => $tabela->tabela,
                    'vigencia' => $tabela->vigencia,
                    'prazo' => $tabela->prazo,
                    'sistema_id' => $tabela->sistema_id,
                    'comissao_geral_sistema' => $tabela->comissao_geral_sistema,
                    'comissao_liquido_sistema' => $tabela->comissao_liquido_sistema,
                    'comissao_bruto_sistema' => $tabela->comissao_bruto_sistema,
                    'comissao_liquido_agente' => $comissao_liquido_agente,
                    'comissao_liquido_correspondente' => $comissao_liquido_correspondente,
                    'comissao_bruto_agente' => $comissao_bruto_agente,
                    'comissao_bruto_correspondente' => $comissao_bruto_correspondente,
                    'codigo_mg' => $tabela->codigo_mg,
                ]
            );
        }

        $comissoes = DB::table($file)->get();

        Schema::dropIfExists($file);

        return response()->json($comissoes);
    }

    public function exportar(Request $request)
    {
        $banco = $request->all()['banco'] ?? null;
        $convenio = $request->all()['convenio'] ?? null;
        $tipo = $request->all()['tipo'] ?? null;

        $tabela = DB::table('tabela_comissao as tx')
            ->join('banco', 'tx.banco_id', '=', 'banco.id')
            ->join('convenio', 'tx.convenio_id', '=', 'convenio.id')
            ->join('tipo', 'tx.tipo_id', '=', 'tipo.id')
            ->select(
                'banco.id AS banco',
                'convenio.id AS convenio',
                'tipo.id AS tipo',
                'tx.*'
            )
            ->where('tx.banco_id', '=', $banco)
            ->where('tx.convenio_id', '=', $convenio)
            ->where('tx.tipo_id', '=', $tipo)
            ->orderBy('tx.banco_id')
            ->orderBy('tx.convenio_id')
            ->orderBy('tx.tipo_id')
            ->orderBy('tx.comissao_geral_sistema', 'desc')
            ->get();

        return (new ComissaoExport())->getFiltros($tabela)->download('tabela_comissao.xlsx');
    }
}
