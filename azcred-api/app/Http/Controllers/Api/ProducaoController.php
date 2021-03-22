<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producao;
use App\Traits\ApiResponser;
use Carbon\Carbon;
use DateTime;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;

class ProducaoController extends Controller
{
    use ApiResponser;

    public function index(Request $request)
    {
        $this->authorize('VISUALIZAR_PRODUCAO');

        $com_corretor = $request->input('com_corretor') ?? null;
        $cpf = $request->all()['cpf'] ?? null;
        $cliente = $request->all()['cliente'] ?? null;
        $corretor = $request->all()['corretor'] ?? null;
        $pago = $request->all()['pago'] ?? null;
        $fisico_pendente = $request->all()['fisico_pendente'] ?? null;
        $ncr = null;

        if (isset($request->all()['ncr'])) {
            $ncr = Carbon::parse($request->all()['ncr'])->format('Y-m-d');
        }

        if ($com_corretor === 'N') {
            $contrato = DB::table('tabela_producao')
                ->select(
                    'tabela_producao.*'
                )
                ->where('tabela_producao.tipo', '=', 'I')
                ->whereNull('tabela_producao.corretor_id')
                ->when($ncr, function ($query, $ncr) {
                    $query->whereDate('tabela_producao.data_ncr', $ncr);
                })
                ->when($cliente, function ($query, $cliente) {
                    $query->where('tabela_producao.cliente', 'LIKE', "%{$cliente}%");
                })
                ->when($cpf, function ($query, $cpf) {
                    $query->where('tabela_producao.cpf', $cpf);
                })
                ->when($pago, function ($query, $pago) {
                    $query->where('tabela_producao.pago', $pago);
                })
                ->when($fisico_pendente, function ($query, $fisico_pendente) {
                    $query->where('tabela_producao.fisicopendente', $fisico_pendente);
                })
                ->orderBy('tabela_producao.id', 'DESC')
                ->paginate(10);
        } else {
            $contrato = DB::table('tabela_producao')
                ->join('corretor', 'tabela_producao.corretor_id', '=', 'corretor.id')
                ->select(
                    'tabela_producao.*',
                    'corretor.nome as corretor'
                )
                ->where('tabela_producao.tipo', '=', 'I')
                ->when($ncr, function ($query, $ncr) {
                    $query->whereDate('tabela_producao.data_ncr', $ncr);
                })
                ->when($pago, function ($query, $pago) {
                    $query->where('tabela_producao.pago', $pago);
                })
                ->when($cliente, function ($query, $cliente) {
                    $query->where('tabela_producao.cliente', 'LIKE', "%{$cliente}%");
                })
                ->when($cpf, function ($query, $cpf) {
                    $query->where('tabela_producao.cpf', $cpf);
                })
                ->when($corretor, function ($query, $corretor) {
                    $query->where('tabela_producao.corretor_id', $corretor);
                })
                ->when($fisico_pendente, function ($query, $fisico_pendente) {
                    $query->where('tabela_producao.fisicopendente', $fisico_pendente);
                })
                ->orderBy('tabela_producao.id', 'DESC')
                ->paginate(10);
        }

        return response()->json($contrato);
    }

    public function resumo(Request $request)
    {
        $this->authorize('VISUALIZAR_PRODUCAO');

        $inicio = null;
        $fim = null;

        if (isset($request->all()['inicio'])) {
            $inicio = Carbon::parse($request->all()['inicio'])->format('Y-m-d');
        }

        if (isset($request->all()['fim'])) {
            $fim = Carbon::parse($request->all()['fim'])->format('Y-m-d');
        }

        $cpf = $request->all()['cpf'] ?? null;
        $cliente = $request->all()['cliente'] ?? null;
        $corretor = $request->all()['corretor'] ?? null;
        $banco = $request->all()['banco'] ?? null;
        $tabela = $request->all()['tabela'] ?? null;

        // Total Importado
        $query = DB::table('tabela_producao')
            ->join('corretor', 'tabela_producao.corretor_id', '=', 'corretor.id')
            ->where('tabela_producao.tipo', '=', 'I')
            ->where('tabela_producao.pago', '=', 'S')
            ->whereBetween('tabela_producao.data_ncr', [$inicio, $fim])
            ->when($cliente, function ($query, $cliente) {
                $query->where('tabela_producao.cliente', 'LIKE', "%{$cliente}%");
            })
            ->when($cpf, function ($query, $cpf) {
                $query->where('tabela_producao.cpf', $cpf);
            })
            ->when($banco, function ($query, $banco) {
                $query->where('tabela_producao.banco', 'LIKE', "%{$banco}%");
            })
            ->when($tabela, function ($query, $tabela) {
                $query->where('tabela_producao.tabela', 'LIKE', "%{$tabela}%");
            })
            ->when($corretor, function ($query, $corretor) {
                $query->where('tabela_producao.corretor_id', $corretor);
            });

        $total_contratos = $query->sum('tabela_producao.valor_contrato');
        $total_valor_comissao = $query->sum('tabela_producao.valor_comissao');
        $total_valor_agenteI = $query->sum('tabela_producao.corretor_valor_comissao');
        $total_valor_empresa = $query->sum('tabela_producao.correspondente_valor_comissao');
        // Fim Importado

        // Total Manual
        $query1 = DB::table('tabela_producao')
            ->join('corretor', 'tabela_producao.corretor_id', '=', 'corretor.id')
            ->where('tabela_producao.tipo', '=', 'M')
            ->where('tabela_producao.pago', '=', 'S')
            ->whereBetween('tabela_producao.data_ncr', [$inicio, $fim])
            ->when($cliente, function ($query, $cliente) {
                $query->where('tabela_producao.cliente', 'LIKE', "%{$cliente}%");
            })
            ->when($cpf, function ($query, $cpf) {
                $query->where('tabela_producao.cpf', $cpf);
            })
            ->when($banco, function ($query, $banco) {
                $query->where('tabela_producao.banco', 'LIKE', "%{$banco}%");
            })
            ->when($tabela, function ($query, $tabela) {
                $query->where('tabela_producao.tabela', 'LIKE', "%{$tabela}%");
            })
            ->when($corretor, function ($query, $corretor) {
                $query->where('tabela_producao.corretor_id', $corretor);
            });

        $total_valor_agenteM = $query1->sum('tabela_producao.corretor_valor_comissao');
        // Fim Manual

        // Total Geral Agente
        $total_valor_agente = $total_valor_agenteI + $total_valor_agenteM;

        $contrato = DB::table('tabela_producao')
            ->join('corretor', 'tabela_producao.corretor_id', '=', 'corretor.id')
            ->select(
                'tabela_producao.*',
                'corretor.nome as corretor'
            )
            ->where('tabela_producao.pago', '=', 'S')
            ->whereBetween('tabela_producao.data_ncr', [$inicio, $fim])
            ->when($cliente, function ($query, $cliente) {
                $query->where('tabela_producao.cliente', 'LIKE', "%{$cliente}%");
            })
            ->when($cpf, function ($query, $cpf) {
                $query->where('tabela_producao.cpf', $cpf);
            })
            ->when($banco, function ($query, $banco) {
                $query->where('tabela_producao.banco', 'LIKE', "%{$banco}%");
            })
            ->when($tabela, function ($query, $tabela) {
                $query->where('tabela_producao.tabela', 'LIKE', "%{$tabela}%");
            })
            ->when($corretor, function ($query, $corretor) {
                $query->where('tabela_producao.corretor_id', $corretor);
            })
            ->orderBy('tabela_producao.id', 'DESC')
            ->paginate(15);

        return response()->json([
            'contrato' => $contrato,
            'total_contratos' => $total_contratos,
            'total_valor_comissao' => $total_valor_comissao,
            'total_valor_agente' => $total_valor_agente,
            'total_valor_empresa' => $total_valor_empresa
        ]);
    }

    public function show($id)
    {
        $this->authorize('VISUALIZAR_PRODUCAO');
        $contrato = Producao::findOrFail($id);
        return response()->json($contrato, 200);
    }

    public function destroy($id)
    {
        $this->authorize('VISUALIZAR_PRODUCAO');
        $producao = Producao::findOrFail($id);
        $producao->delete();
        return $this->showOne($producao);
    }

    public function comissao($idContrato, $id)
    {
        $this->authorize('VISUALIZAR_PRODUCAO');

        $contrato = Producao::findOrFail($idContrato);

        $comissao = DB::table('perfil')->select("configuracao_comissao.comissao as comissao")
            ->join('configuracao_comissao', 'perfil.id', '=', 'configuracao_comissao.perfil_id')
            ->join('corretor', 'perfil.id', '=', 'corretor.perfil_id')
            ->where('corretor.id', '=', $id)
            ->where('configuracao_comissao.real_percentual', '=', 1)
            ->whereRaw('configuracao_comissao.perc_pago_inicio <= ' . $contrato->perc_comissao)
            ->orderBy('configuracao_comissao.real_percentual')
            ->orderBy('configuracao_comissao.perc_pago_inicio', 'desc')
            ->first();
        if ($comissao) {
            $valor_comissao = $contrato->perc_comissao - $comissao->comissao;
        } else {
            $valor_comissao = 0;
        }
        return response()->json($valor_comissao);
    }

    public function update(Request $request, $id)
    {
        $this->authorize('VISUALIZAR_PRODUCAO');

        $dados = $request->all();

        $rulesEdit = [
            'fisicopendente' => 'required',
            'data_fisico' => 'date|sometimes|nullable',
            'corretor_id' => 'required',
            'corretor_perc_comissao' => 'required',
        ];

        if (isset($dados['data_fisico']) && strlen($dados['data_fisico']) > 0) {
            $dados['data_fisico'] = Carbon::parse($dados['data_fisico'])->format('Y-m-d');
        } else {
            $dados['data_fisico'] = null;
        }

        $validator = Validator::make($dados, $rulesEdit, Producao::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(":message") as $error) {
                $displayErrors .= $error;
                break;
            }
            return response()->json($displayErrors, 422);
        }

        $contrato = Producao::findOrFail($id);
        $contrato->fisicopendente = $dados['fisicopendente'];
        $contrato->data_fisico = $dados['data_fisico'];
        $contrato->corretor_id = $dados['corretor_id'];
        $contrato->corretor_perc_comissao = $dados['corretor_perc_comissao'];
        $contrato->corretor_valor_comissao = ($contrato->valor_contrato * $dados['corretor_perc_comissao']) / 100;
        $contrato->correspondente_perc_comissao = $dados['correspondente_perc_comissao'];
        $contrato->correspondente_valor_comissao = ($contrato->valor_contrato * $dados['correspondente_perc_comissao']) / 100;
        $contrato->save();
        return $this->showOne($contrato);
    }

    public function importaAmx(Request $request)
    {
        $this->authorize('IMPORTAR_PRODUCAO');

        $dados = $request->only(['sistema', 'arquivo']);

        $rules = [
            'sistema' => 'required',
            'arquivo' => 'required|mimes:xls,xlsx',
        ];

        $messages = [
            'arquivo.required' => 'Favor selecionar um arquivo',
            'sistema.required' => 'Favor selecionar o sistema',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(':message') as $error) {
                $displayErrors .= $error;
                break;
            }

            return response()->json($displayErrors, 422);
        }

        $file = time() . '_temp';

        Schema::create($file, function (Blueprint $table) {
            $table->increments('id');
            $table->string('cpf');
            $table->string('cliente');
            $table->string('banco');
            $table->string('proposta')->nullable(true);
            $table->string('contrato')->nullable(true);
            $table->string('prazo');
            $table->string('produto');
            $table->string('tabela');
            $table->float('perc_comissao', 9, 2);
            $table->float('valor_contrato', 9, 2);
            $table->float('valor_comissao', 9, 2);
            $table->date('data_operacao');
            $table->date('data_credito_cliente');
            $table->date('data_ncr')->nullable(true);
            $table->date('data_importacao');
            $table->string('usuario');
            $table->float('corretor_perc_comissao', 9, 2)->default(0.00);
            $table->float('corretor_valor_comissao', 9, 2)->default(0.00);
            $table->integer('corretor_id')->nullable(true);
            $table->char('fisicopendente', 1);
            $table->date('data_fisico');
        });

        DB::beginTransaction();
        try {
            $path = $request->file('arquivo')->getRealPath();

            $data = $data = Excel::load($path)->get();

            if ($data->count() > 0) {

                foreach ($data as $key => $value) {
                    if (is_object($value['dat_emprestimo'])) {
                        $data_operacao = Carbon::parse($value['dat_emprestimo'])->format('Y-m-d');
                    } else {
                        $data = DateTime::createFromFormat('d/m/Y', trim(explode(' ', $value['dat_emprestimo'])[0]));
                        $data_operacao = $data->format('Y-m-d');
                    }

                    if (is_object($value['dat_confirmacao'])) {
                        $data_credito_cliente = Carbon::parse($value['dat_confirmacao'])->format('Y-m-d');
                    } else {
                        $data = DateTime::createFromFormat('d/m/Y', trim(explode(' ', $value['dat_confirmacao'])[0]));
                        $data_credito_cliente = $data->format('Y-m-d');
                    }

                    $corretor = DB::table('acesso_corretor')->whereRaw('LOWER(usuario) = ? OR LOWER(operador) = ?', [strtolower(trim($value->nic_ctr_usuario)), strtolower(trim($value->nic_ctr_usuario))])->first();

                    if (!$corretor) {
                        $corretor_id = null;
                    } else {
                        if ($corretor->corretor_id === 1) {
                            $corretor_id = null;
                        } else {
                            $corretor_id = $corretor->corretor_id;
                        }
                    }

                    $proposta = DB::table($file)->where('proposta', '=', $value->num_proposta)->first();
                    if ($proposta === null) {
                        $arr = [
                            'cpf' => $value->cod_cpf_cliente,
                            'cliente' => $value->nom_cliente,
                            'banco' => $value->nom_banco,
                            'proposta' => $value->num_proposta,
                            'contrato' => $value->num_contrato,
                            'prazo' => $value->qtd_parcela,
                            'produto' => $value->dsc_tipo_proposta_emprestimo,
                            'tabela' => $value->dsc_produto,
                            'fisicopendente' => 'S',
                            'data_fisico' => date('Y-m-d'),
                            'perc_comissao' => $value->pcl_comissao,
                            'valor_contrato' => $value->val_base_comissao,
                            'valor_comissao' => $value->val_comissao,
                            'data_operacao' => $data_operacao,
                            'data_credito_cliente' => $data_credito_cliente,
                            'data_ncr' => null,
                            'data_importacao' => date('Y-m-d'),
                            'usuario' => trim($value->nic_ctr_usuario),
                            'corretor_perc_comissao' => 0.00,
                            'corretor_valor_comissao' => 0.00,
                            'corretor_id' => $corretor_id,
                        ];

                        $inserido = DB::table($file)->insert(
                            $arr
                        );
                    } else {
                        $perc_comissao = $proposta->perc_comissao + $value->pcl_comissao;
                        $valor_comissao = $proposta->valor_comissao + $value->val_comissao;
                        DB::table($file)->where('proposta', '=', $value->num_proposta)
                            ->update(
                                [
                                    'perc_comissao' => $perc_comissao,
                                    'valor_comissao' => $valor_comissao,
                                ]
                            );
                    }
                }

                $propostas = DB::table($file)->get();

                foreach ($propostas as $prop) {
                    $comissao = DB::table('perfil')->select('configuracao_comissao.comissao as comissao')
                        ->join('configuracao_comissao', 'perfil.id', '=', 'configuracao_comissao.perfil_id')
                        ->join('corretor', 'perfil.id', '=', 'corretor.perfil_id')
                        ->where('corretor.id', '=', $prop->corretor_id)
                        ->where('real_percentual', '=', 1)
                        ->whereRaw('perc_pago_inicio <= ' . $prop->perc_comissao)
                        ->orderBy('real_percentual')
                        ->orderBy('perc_pago_inicio', 'desc')
                        ->first();
                    if ($comissao) {
                        $valor_comissao = $comissao->comissao;
                        if ($prop->perc_comissao - $valor_comissao > 0) {
                            $corretor_perc_comissao = $prop->perc_comissao - $valor_comissao;
                            $corretor_valor_comissao = ($prop->valor_contrato * $corretor_perc_comissao) / 100;
                        } else {
                            $corretor_perc_comissao = 0;
                            $corretor_valor_comissao = 0;
                        }
                    } else {
                        $valor_comissao = 0;
                        $corretor_perc_comissao = 0;
                        $corretor_valor_comissao = 0;
                    }

                    $producao = new Producao();
                    $producao->cpf = $prop->cpf;
                    $producao->cliente = $prop->cliente;
                    $producao->banco = $prop->banco;
                    $producao->proposta = $prop->proposta;
                    $producao->contrato = $prop->contrato;
                    $producao->prazo = $prop->prazo;
                    $producao->produto = $prop->produto;
                    $producao->tabela = $prop->tabela;
                    $producao->fisicopendente = 'S';
                    $producao->data_fisico = $prop->data_fisico;
                    $producao->perc_comissao = $prop->perc_comissao;
                    $producao->valor_contrato = $prop->valor_contrato;
                    $producao->valor_comissao = $prop->valor_comissao;
                    $producao->data_operacao = $prop->data_operacao;
                    $producao->data_credito_cliente = $prop->data_credito_cliente;
                    $producao->data_ncr = null;
                    $producao->data_importacao = $prop->data_importacao;
                    $producao->pago = 'N';
                    $producao->usuario = $prop->usuario;
                    $producao->corretor_perc_comissao = $corretor_perc_comissao;
                    $producao->corretor_valor_comissao = $corretor_valor_comissao;
                    $producao->correspondente_perc_comissao = $prop->perc_comissao - $corretor_perc_comissao;
                    $producao->correspondente_valor_comissao = $prop->valor_comissao - $corretor_valor_comissao;
                    $producao->corretor_id = $prop->corretor_id;
                    $producao->tipo = 'I';
                    $producao->save();
                }

                DB::commit();

                Schema::dropIfExists($file);

                return response()->json(['status' => 'OK']);
            } else {
                return response()->json('Arquivo vazio ou inválido !', 422);
            }
        } catch (\Exception $e) {
            DB::rollback();
            Schema::dropIfExists($file);

            return response()->json('Erro ao importar o arquivo', 422);
        }
    }
}
