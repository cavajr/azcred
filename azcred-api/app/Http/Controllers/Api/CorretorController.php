<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comissao;
use App\Models\Corretor;
use App\Models\CorretorAcesso;
use App\Models\Remessa;
use App\Models\RemessaItem;
use App\Models\Tabela;
use App\Traits\ApiResponser;
use App\User;
use Carbon\Carbon;
use Excel;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;

class CorretorController extends Controller
{
    use ApiResponser;

    public function index(Request $request)
    {
        $this->authorize('VISUALIZAR_CORRETOR');

        $nome = $request->all()['nome'] ?? null;
        $corretor = Corretor::where('nome', 'LIKE', "%{$nome}%")->orderBy('nome')->paginate(10);

        return response()->json($corretor);
    }

    public function store(Request $request)
    {
        $this->authorize('CADASTRAR_CORRETOR');

        $dados = $request->all();

        $acessos = $dados['acessos'];

        unset($dados['acessos']);

        $validator = \Validator::make($dados, Corretor::$rules, Corretor::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(':message') as $error) {
                $displayErrors .= $error;
                break;
            }

            return response()->json($displayErrors, 422);
        }

        if ($request->has('data_adm')) {
            if (strlen($dados['data_adm']) > 0) {
                $dados['data_adm'] = Carbon::parse($dados['data_adm'])->format('Y-m-d');
            } else {
                $dados['data_adm'] = null;
            }
        }

        if ($request->has('data_nasc')) {
            if (strlen($dados['data_nasc']) > 0) {
                $dados['data_nasc'] = Carbon::parse($dados['data_nasc'])->format('Y-m-d');
            } else {
                $dados['data_nasc'] = null;
            }
        }

        DB::beginTransaction();
        try {
            $corretor = Corretor::create($dados);
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

            return response()->json($corretor, 201);
        } catch (\Exception $e) {
            DB::rollback();

            return response()->json('Erro ao tentar cadastrar o corretor', 422);
        }
    }

    public function show($id)
    {
        $corretor = Corretor::with('acessos')->findOrFail($id);

        return response()->json($corretor, 200);
    }

    public function update(Request $request, $id)
    {
        $this->authorize('CADASTRAR_CORRETOR');

        $dados = $request->all();

        $acessos = $dados['acessos'];

        unset($dados['acessos']);

        $rulesEdit = [
            'nome' => "required|min:3|max:100|unique:corretor,nome,{$id}",
            'perfil_id' => 'required',
            'pessoa' => 'required',
            'cpf' => 'required',
            'data_adm' => 'date',
        ];
        $validator = \Validator::make($dados, $rulesEdit, Corretor::$messages);
        if ($validator->fails()) {
            $messages = $validator->messages();

            $displayErrors = '';

            foreach ($messages->all(':message') as $error) {
                $displayErrors .= $error;
                break;
            }

            return response()->json($displayErrors, 422);
        }

        if ($request->has('data_adm')) {
            if (strlen($dados['data_adm']) > 0) {
                $dados['data_adm'] = Carbon::parse($dados['data_adm'])->format('Y-m-d');
            } else {
                $dados['data_adm'] = null;
            }
        }

        if ($request->has('data_nasc')) {
            if (strlen($dados['data_nasc']) > 0) {
                $dados['data_nasc'] = Carbon::parse($dados['data_nasc'])->format('Y-m-d');
            } else {
                $dados['data_nasc'] = null;
            }
        }

        DB::beginTransaction();
        try {
            $corretor = Corretor::findOrFail($id);
            $corretor->update($dados);

            if ($corretor->ativo === 'N') {
                $usuario = User::where('corretor_id', '=', $corretor->id)->first();
                if ($usuario) {
                    $usuario->ativo = 0;
                    $usuario->save();
                }
            }

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

            return response()->json('Erro ao tentar alterar o corretor', 422);
        }
    }

    public function listarAll()
    {
        return response()->json(Corretor::orderBy('nome')->get());
    }

    public function tabelas(Request $request)
    {
        $this->authorize('ACESSO_CORRETOR');

        $corretor = Corretor::find(Auth::user()->corretor_id);

        $perfil = $corretor->perfil_id;

        $banco = $request->all()['banco'] ?? null;
        $convenio = $request->all()['convenio'] ?? null;
        $tipo = $request->all()['tipo'] ?? null;
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
            $table->float('comissao_geral_sistema_moeda', 9, 2);
            $table->float('comissao_agente_moeda', 9, 2);
            $table->float('comissao_correspondente_moeda', 9, 2);
            $table->float('comissao_geral_sistema_percentual', 9, 2);
            $table->float('comissao_liquido_sistema_percentual', 9, 2);
            $table->float('comissao_bruto_sistema_percentual', 9, 2);
            $table->float('comissao_liquido_agente_percentual', 9, 2);
            $table->float('comissao_liquido_correspondente_percentual', 9, 2);
            $table->float('comissao_bruto_agente_percentual', 9, 2);
            $table->float('comissao_bruto_correspondente_percentual', 9, 2);
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
            ->orderBy('tabela_comissao.comissao_geral_sistema_moeda', 'desc')
            ->orderBy('tabela_comissao.comissao_geral_sistema_percentual', 'desc')
            ->get();

        foreach ($tabelas as $tabela) {
            $comissao_agente_moeda = 0;
            $comissao_correspondente_moeda = 0;
            $comissao_liquido_agente_percentual = 0.00;
            $comissao_liquido_correspondente_percentual = 0.00;
            $comissao_bruto_agente_percentual = 0.00;
            $comissao_bruto_correspondente_percentual = 0.00;
            $valor_comissao = 0.00;

            if ($tabela->comissao_geral_sistema_moeda > 0) {
                $comissao = Comissao::select('comissao')
                    ->where('real_percentual', '=', 0)
                    ->where('perfil_id', '=', $perfil)
                    ->whereRaw('perc_pago_inicio <= ' . $tabela->comissao_geral_sistema_moeda)
                    ->orderBy('real_percentual')
                    ->orderBy('perc_pago_inicio', 'desc')
                    ->first();
                if ($comissao) {
                    $valor_comissao = $comissao->comissao;
                } else {
                    $valor_comissao = 0;
                }
                $resultado = $tabela->comissao_geral_sistema_moeda - $valor_comissao;
                if ($valor_comissao >= $tabela->comissao_geral_sistema_moeda) {
                    $comissao_correspondente_moeda = $tabela->comissao_geral_sistema_moeda;
                    $comissao_agente_moeda = 0.00;
                } else {
                    if ($valor_comissao === 0) {
                        $comissao_correspondente_moeda = $tabela->comissao_geral_sistema_moeda;
                        $comissao_agente_moeda = 0.00;
                    } else {
                        $comissao_agente_moeda = $resultado;
                        $comissao_correspondente_moeda = $valor_comissao;
                    }
                }
            }

            if ($tabela->comissao_geral_sistema_percentual > 0) {
                if ($tabela->comissao_liquido_sistema_percentual > 0) {
                    $comissao = Comissao::select('comissao')
                        ->where('real_percentual', '=', 1)
                        ->where('perfil_id', '=', $perfil)
                        ->whereRaw('perc_pago_inicio <= ' . $tabela->comissao_liquido_sistema_percentual)
                        ->orderBy('real_percentual')
                        ->orderBy('perc_pago_inicio', 'desc')
                        ->first();
                    if ($comissao) {
                        $valor_comissao = $comissao->comissao;
                    } else {
                        $valor_comissao = 0;
                    }
                    $resultado = $tabela->comissao_liquido_sistema_percentual - $valor_comissao;
                    if ($valor_comissao >= $tabela->comissao_liquido_sistema_percentual) {
                        $comissao_liquido_correspondente_percentual = $tabela->comissao_liquido_sistema_percentual;
                        $comissao_liquido_agente_percentual = 0.00;
                    } else {
                        if ($valor_comissao === 0) {
                            $comissao_liquido_correspondente_percentual = $tabela->comissao_liquido_sistema_percentual;
                            $comissao_liquido_agente_percentual = 0.00;
                        } else {
                            $comissao_liquido_agente_percentual = $resultado;
                            $comissao_liquido_correspondente_percentual = $valor_comissao;
                        }
                    }
                }
                if ($tabela->comissao_bruto_sistema_percentual > 0) {
                    $comissao = Comissao::select('comissao')
                        ->where('real_percentual', '=', 1)
                        ->where('perfil_id', '=', $perfil)
                        ->whereRaw('perc_pago_inicio <= ' . $tabela->comissao_bruto_sistema_percentual)
                        ->orderBy('real_percentual')
                        ->orderBy('perc_pago_inicio', 'desc')
                        ->first();
                    if ($comissao) {
                        $valor_comissao = $comissao->comissao;
                    } else {
                        $valor_comissao = 0;
                    }
                    $resultado = $tabela->comissao_bruto_sistema_percentual - $valor_comissao;
                    if ($valor_comissao >= $tabela->comissao_bruto_sistema_percentual) {
                        $comissao_bruto_correspondente_percentual = $tabela->comissao_bruto_sistema_percentual;
                        $comissao_bruto_agente_percentual = 0.00;
                    } else {
                        if ($valor_comissao === 0) {
                            $comissao_bruto_correspondente_percentual = $tabela->comissao_bruto_sistema_percentual;
                            $comissao_bruto_agente_percentual = 0.00;
                        } else {
                            $comissao_bruto_agente_percentual = $resultado;
                            $comissao_bruto_correspondente_percentual = $valor_comissao;
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
                    'comissao_geral_sistema_moeda' => $tabela->comissao_geral_sistema_moeda,
                    'comissao_agente_moeda' => $comissao_agente_moeda,
                    'comissao_correspondente_moeda' => $comissao_correspondente_moeda,
                    'comissao_geral_sistema_percentual' => $tabela->comissao_geral_sistema_percentual,
                    'comissao_liquido_sistema_percentual' => $tabela->comissao_liquido_sistema_percentual,
                    'comissao_bruto_sistema_percentual' => $tabela->comissao_bruto_sistema_percentual,
                    'comissao_liquido_agente_percentual' => $comissao_liquido_agente_percentual,
                    'comissao_liquido_correspondente_percentual' => $comissao_liquido_correspondente_percentual,
                    'comissao_bruto_agente_percentual' => $comissao_bruto_agente_percentual,
                    'comissao_bruto_correspondente_percentual' => $comissao_bruto_correspondente_percentual,
                    'codigo_mg' => $tabela->codigo_mg
                ]
            );
        }

        $comissoes = DB::table($file)->get();

        Schema::dropIfExists($file);

        return response()->json($comissoes);
    }

    public function producoes(Request $request)
    {
        $this->authorize('ACESSO_CORRETOR');

        if (isset($request->all()['inicio'])) {
            $inicio = Carbon::parse($request->all()['inicio'])->format('Y-m-d');
        }

        if (isset($request->all()['fim'])) {
            $fim = Carbon::parse($request->all()['fim'])->format('Y-m-d');
        }

        $cpf = $request->all()['cpf'] ?? null;
        $cliente = $request->all()['cliente'] ?? null;
        $corretor = $request->all()['corretor'] ?? null;
        $fisico_pendente = $request->all()['fisico_pendente'] ?? null;

        $contrato = DB::table('tabela_producao')
            ->whereBetween('data_ncr', [$inicio, $fim])
            ->where('pago', '=', 'S')
            ->join('corretor', 'tabela_producao.corretor_id', '=', 'corretor.id')
            ->select(
                'tabela_producao.*',
                'corretor.nome as corretor'
            )
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

        return response()->json($contrato);
    }

    public function exportarTabela(Request $request)
    {
        $this->authorize('ACESSO_CORRETOR');

        $corretor = Corretor::find(Auth::user()->corretor_id);

        $perfil = $corretor->perfil_id;

        $banco = $request->all()['banco'] ?? null;
        $convenio = $request->all()['convenio'] ?? null;
        $tipo = $request->all()['tipo'] ?? null;

        // Cria tabela temporária para cálculo
        $file = time() . '_temp';

        Schema::create($file, function (Blueprint $table) {
            $table->integer('id');
            $table->bigInteger('banco');
            $table->bigInteger('convenio');
            $table->bigInteger('tipo');
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
                'banco.id AS banco',
                'convenio.id AS convenio',
                'tipo.id AS tipo',
                'tabela_comissao.*'
            )
            ->where('tabela_comissao.banco_id', '=', $banco)
            ->where('tabela_comissao.convenio_id', '=', $convenio)
            ->where('tabela_comissao.tipo_id', '=', $tipo)
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
                    $valor_comissao = Comissao::select('comissao')
                        ->where('real_percentual', '=', 1)
                        ->where('perfil_id', '=', $perfil)
                        ->whereRaw('perc_pago_inicio <= ' . $tabela->comissao_liquido_sistema)
                        ->orderBy('real_percentual')
                        ->orderBy('perc_pago_inicio', 'desc')
                        ->first();
                    $comissao_liquido_correspondente = $valor_comissao->comissao;
                    $comissao_liquido_agente = $tabela->comissao_liquido_sistema - $valor_comissao->comissao;
                }
                if ($tabela->comissao_bruto_sistema > 0) {
                    $valor_comissao = Comissao::select('comissao')
                        ->where('real_percentual', '=', 1)
                        ->where('perfil_id', '=', $perfil)
                        ->whereRaw('perc_pago_inicio <= ' . $tabela->comissao_bruto_sistema)
                        ->orderBy('real_percentual')
                        ->orderBy('perc_pago_inicio', 'desc')
                        ->first();
                    $comissao_bruto_correspondente = $valor_comissao->comissao;
                    $comissao_bruto_agente = $tabela->comissao_bruto_sistema - $valor_comissao->comissao;
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

        $comissoes = DB::table($file)
            ->select('banco', 'convenio', 'tipo', 'tabela', 'vigencia', 'prazo', 'comissao_liquido_agente', 'comissao_bruto_agente', 'codigo_mg')
            ->get();

        Schema::dropIfExists($file);

        try {
            //code...
            return Excel::create('tabela_comissao', function ($excel) use ($comissoes) {
                $excel->sheet('Tabela de Comissao', function ($sheet) use ($comissoes) {
                    $sheet->setColumnFormat([
                        'A' => '0',
                        'B' => '0',
                        'C' => '0',
                        'D' => 'General',
                        'E' => 'yyyy-mm-dd',
                        'F' => 'General',
                        'H' => '0.00',
                        'I' => '0.00',
                        'J' => 'General',
                    ]);

                    $sheet->loadView('exports.comissao', ['tabelas' => $comissoes]);
                })->download('xlsx');
            });
        } catch (\Exception $th) {
            return response()->json($th);
        }
    }

    public function exportarProducao(Request $request)
    {
        $this->authorize('ACESSO_CORRETOR');

        if (isset($request->all()['inicio'])) {
            $inicio = Carbon::parse($request->all()['inicio'])->format('Y-m-d');
        }

        if (isset($request->all()['fim'])) {
            $fim = Carbon::parse($request->all()['fim'])->format('Y-m-d');
        }

        $cpf = $request->all()['cpf'] ?? null;
        $cliente = $request->all()['cliente'] ?? null;
        $corretor = $request->all()['corretor'] ?? null;
        $fisico_pendente = $request->all()['fisico_pendente'] ?? null;

        $tabela = DB::table('tabela_producao')
            ->whereBetween('data_ncr', [$inicio, $fim])
            ->where('pago', '=', 'S')
            ->select(
                'tabela_producao.*'
            )
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
            ->get();

        return Excel::create('tabela_producao', function ($excel) use ($tabela) {
            $excel->sheet('Tabela de Producao', function ($sheet) use ($tabela) {
                $sheet->setColumnFormat([
                    'A' => 'General',
                    'B' => 'General',
                    'C' => 'General',
                    'D' => 'General',
                    'E' => 'General',
                    'F' => 'General',
                    'G' => 'General',
                    'H' => 'General',
                    'I' => '0.00',
                    'J' => '0.00',
                    'K' => '0.00',
                    'L' => 'yyyy-mm-dd',
                    'M' => 'yyyy-mm-dd',
                    'N' => 'yyyy-mm-dd',
                    'O' => 'General',
                    'P' => 'General',
                    'Q' => 'yyyy-mm-dd',
                ]);

                $sheet->loadView('exports.producao', ['producoes' => $tabela]);
            })->download('xlsx');
        });
    }

    public function remessaEnviar(Request $request)
    {
        $this->authorize('ACESSO_CORRETOR');

        $remessas = $request->all()['remessa'];

        DB::beginTransaction();
        try {
            $remessa = new Remessa();
            $remessa->status_id = 1;
            $remessa->data_remessa = date('Y-m-d');
            $remessa->corretor_id = auth()->user()->corretor_id;
            $remessa->save();

            foreach ($remessas as $selecionado) {
                $item = new RemessaItem();
                $item->remessa_id = $remessa->id;
                $item->contrato_id = $selecionado['id'];
                $item->recebido = 0;
                $item->save();
            }

            DB::commit();

            return response()->json(['status' => true]);
        } catch (\Exception $e) {
            return response()->json(['status' => false]);
        }
    }

    public function contratos(Request $request)
    {
        $this->authorize('ACESSO_CORRETOR');

        $cpf = $request->input('cpf') ?? null;
        $cliente = $request->input('cliente') ?? null;
        $banco = $request->input('banco') ?? null;
        $proposta = $request->input('proposta') ?? null;
        $corretor = Auth::user()->corretor_id;

        $contrato = DB::table('tabela_producao')
            ->join('corretor', 'tabela_producao.corretor_id', '=', 'corretor.id')
            ->select(
                'tabela_producao.*',
                'corretor.nome as corretor'
            )
            ->where('tabela_producao.fisicopendente', '=', 'S')
            ->where('tabela_producao.corretor_id', $corretor)
            ->when($cliente, function ($query, $cliente) {
                $query->where('tabela_producao.cliente', 'LIKE', "%{$cliente}%");
            })
            ->when($cpf, function ($query, $cpf) {
                $query->where('tabela_producao.cpf', 'LIKE', "%{$cpf}%");
            })
            ->when($banco, function ($query, $banco) {
                $query->where('tabela_producao.banco', 'LIKE', "%{$banco}%");
            })
            ->when($proposta, function ($query, $proposta) {
                $query->where('tabela_producao.proposta', 'LIKE', "%{$proposta}%");
            })
            ->orderBy('tabela_producao.id', 'DESC')
            ->paginate(8);

        return response()->json($contrato);
    }
}
