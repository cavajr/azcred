<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tabela;
use Carbon\Carbon;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;
use Rap2hpoutre\FastExcel\FastExcel;
use CsvReader;

class ComissaoController extends Controller
{
     public function importaAmx(Request $request)
    {
        $this->authorize('IMPORTAR_COMISSAO');

        $dados = $request->only(['sistema', 'banco', 'convenio', 'tipo', 'arquivo']);

        $rules = [
            'sistema' => 'required',
            'arquivo' => 'required|mimes:xls,xlsx',
            'banco' => 'required',
            'convenio' => 'required',
            'tipo' => 'required',
        ];

        $messages = [
            'arquivo.required' => 'Favor selecionar um arquivo',
            'sistema.required' => 'Favor selecionar o sistema',
            'banco.required' => 'Favor selecionar um banco',
            'convenio.required' => 'Favor selecionar um convênio',
            'tipo.required' => 'Favor selecionar um tipo de contrato',
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

        $existeReg = Tabela::where('banco_id', '=', $dados['banco'])
            ->where('convenio_id', '=', $dados['convenio'])
            ->where('tipo_id', '=', $dados['tipo'])
            ->count();

        DB::beginTransaction();
        try {
            if ($existeReg > 0) {
                $apagado = Tabela::where('banco_id', '=', $dados['banco'])
                    ->where('convenio_id', '=', $dados['convenio'])
                    ->where('tipo_id', '=', $dados['tipo'])
                    ->delete();
            }

            $path = $request->file('arquivo')->getRealPath();

            $data = Excel::load($path)->get();

            if ($data->count() > 0) {
                foreach ($data as $key => $value) {
                    $data = DateTime::createFromFormat('d/m/Y', trim(explode(' ', $value->vigencia)[0]));
                    $vigencia = $data->format('Y-m-d');

                    if (is_object($value->prazo)) {
                        $prazo = $value->prazo->format('y');
                    } else {
                        $prazo = $value->prazo;
                    }

                    $comissao_geral_sistema_moeda = 0.00;
                    $comissao_geral_sistema_percentual = 0.00;
                    $comissao_liquido_sistema_percentual = 0.00;
                    $comissao_bruto_sistema_percentual = 0.00;

                    $comissao_cms_base = 0.00;
                    $comissao_bonus = 0.00;
                    $comissao_ad_dif = 0.00;
                    $comissao_ativacao = 0.00;
                    $comissao_pre_adesao = 0.00;
                    $comissao_seguro = 0.00;
                    $comissao_antecipacao = 0.00;

                    if (is_null($value->cms_base) === false) {
                        $tipo = explode(' ', $value->cms_base)[0];
                        $comissao_cms_base = $this->tofloat(trim(explode(' ', $value->cms_base)[1]));
                        if ($comissao_cms_base > 0) {
                            if ($tipo == '%') {
                                $comissao_geral_sistema_percentual = $comissao_geral_sistema_percentual + $comissao_cms_base;
                                if (trim(explode(' ', $value->cms_base)[3] === 'BRUTO')) {
                                    $comissao_bruto_sistema_percentual = $comissao_bruto_sistema_percentual + $comissao_cms_base;
                                }
                                if (trim(explode(' ', $value->cms_base)[3] === 'LÍQUIDO')) {
                                    $comissao_liquido_sistema_percentual = $comissao_liquido_sistema_percentual + $comissao_cms_base;
                                }
                            } else {
                                $comissao_geral_sistema_moeda = $comissao_geral_sistema_moeda + $comissao_cms_base;
                            }
                        }
                    }

                    if (isset($value->bonus)) {
                        if (is_null($value->bonus) === false) {
                            $tipo = explode(' ', $value->bonus)[0];
                            $comissao_bonus = $this->tofloat(trim(explode(' ', $value->bonus)[1]));
                            if ($comissao_bonus > 0) {
                                if ($tipo == '%') {
                                    $comissao_geral_sistema_percentual = $comissao_geral_sistema_percentual + $comissao_bonus;
                                    if (trim(explode(' ', $value->bonus)[3] === 'BRUTO')) {
                                        $comissao_bruto_sistema_percentual = $comissao_bruto_sistema_percentual + $comissao_bonus;
                                    }
                                    if (trim(explode(' ', $value->bonus)[3] === 'LÍQUIDO')) {
                                        $comissao_liquido_sistema_percentual = $comissao_liquido_sistema_percentual + $comissao_bonus;
                                    }
                                } else {
                                    $comissao_geral_sistema_moeda = $comissao_geral_sistema_moeda + $comissao_bonus;
                                }
                            }
                        }
                    }

                    if (isset($value['ad._dif.'])) {
                        if (is_null($value['ad._dif.']) === false) {
                            $tipo = explode(' ', $value['ad._dif.'])[0];
                            $comissao_ad_dif = $this->tofloat(trim(explode(' ', $value['ad._dif.'])[1]));
                            if ($comissao_ad_dif > 0) {
                                if ($tipo == '%') {
                                    $comissao_geral_sistema_percentual = $comissao_geral_sistema_percentual + $comissao_ad_dif;
                                    if (trim(explode(' ', $value['ad._dif.'])[3] === 'BRUTO')) {
                                        $comissao_bruto_sistema_percentual = $comissao_bruto_sistema_percentual + $comissao_ad_dif;
                                    }
                                    if (trim(explode(' ', $value['ad._dif.'])[3] === 'LÍQUIDO')) {
                                        $comissao_liquido_sistema_percentual = $comissao_liquido_sistema_percentual + $comissao_ad_dif;
                                    }
                                } else {
                                    $comissao_geral_sistema_moeda = $comissao_geral_sistema_moeda + $comissao_ad_dif;
                                }
                            }
                        }
                    }

                    if (isset($value->ativacao)) {
                        if (is_null($value->ativacao) === false) {
                            $tipo = explode(' ', $value->ativacao)[0];
                            $comissao_ativacao = $this->tofloat(trim(explode(' ', $value->ativacao)[1]));
                            if ($comissao_ativacao > 0) {
                                if ($tipo == '%') {
                                    $comissao_geral_sistema_percentual = $comissao_geral_sistema_percentual + $comissao_ativacao;
                                    if (trim(explode(' ', $value->ativacao)[3] === 'BRUTO')) {
                                        $comissao_bruto_sistema_percentual = $comissao_bruto_sistema_percentual + $comissao_ativacao;
                                    }
                                    if (trim(explode(' ', $value->ativacao)[3] === 'LÍQUIDO')) {
                                        $comissao_liquido_sistema_percentual = $comissao_liquido_sistema_percentual + $comissao_ativacao;
                                    }
                                } else {
                                    $comissao_geral_sistema_moeda = $comissao_geral_sistema_moeda + $comissao_ativacao;
                                }
                            }
                        }
                    }

                    if (isset($value->pre_adesao)) {
                        if (is_null($value->pre_adesao) === false) {
                            $tipo = explode(' ', $value->pre_adesao)[0];
                            $comissao_pre_adesao = $this->tofloat(trim(explode(' ', $value->pre_adesao)[1]));
                            if ($comissao_pre_adesao > 0) {
                                if ($tipo == '%') {
                                    $comissao_geral_sistema_percentual = $comissao_geral_sistema_percentual + $comissao_pre_adesao;
                                    if (trim(explode(' ', $value->pre_adesao)[3] === 'BRUTO')) {
                                        $comissao_bruto_sistema_percentual = $comissao_bruto_sistema_percentual + $comissao_pre_adesao;
                                    }
                                    if (trim(explode(' ', $value->pre_adesao)[3] === 'LÍQUIDO')) {
                                        $comissao_liquido_sistema_percentual = $comissao_liquido_sistema_percentual + $comissao_pre_adesao;
                                    }
                                } else {
                                    $comissao_geral_sistema_moeda = $comissao_geral_sistema_moeda + $comissao_pre_adesao;
                                }
                            }
                        }
                    }

                    if (isset($value->seguro)) {
                        if (is_null($value->seguro) === false) {
                            $tipo = explode(' ', $value->seguro)[0];
                            $comissao_seguro = $this->tofloat(trim(explode(' ', $value->seguro)[1]));
                            if ($comissao_seguro > 0) {
                                if ($tipo == '%') {
                                    $comissao_geral_sistema_percentual = $comissao_geral_sistema_percentual + $comissao_seguro;
                                    if (trim(explode(' ', $value->seguro)[3] === 'BRUTO')) {
                                        $comissao_bruto_sistema_percentual = $comissao_bruto_sistema_percentual + $comissao_seguro;
                                    }
                                    if (trim(explode(' ', $value->seguro)[3] === 'LÍQUIDO')) {
                                        $comissao_liquido_sistema_percentual = $comissao_liquido_sistema_percentual + $comissao_seguro;
                                    }
                                } else {
                                    $comissao_geral_sistema_moeda = $comissao_geral_sistema_moeda + $comissao_seguro;
                                }
                            }
                        }
                    }

                    if (isset($value->antecipacao)) {
                        if (is_null($value->antecipacao) === false) {
                            $tipo = explode(' ', $value->antecipacao)[0];
                            $comissao_antecipacao = $this->tofloat(trim(explode(' ', $value->antecipacao)[1]));
                            if ($comissao_antecipacao > 0) {
                                if ($tipo == '%') {
                                    $comissao_geral_sistema_percentual = $comissao_geral_sistema_percentual + $comissao_antecipacao;
                                    if (trim(explode(' ', $value->antecipacao)[3] === 'BRUTO')) {
                                        $comissao_bruto_sistema_percentual = $comissao_bruto_sistema_percentual + $comissao_antecipacao;
                                    }
                                    if (trim(explode(' ', $value->antecipacao)[3] === 'LÍQUIDO')) {
                                        $comissao_liquido_sistema_percentual = $comissao_liquido_sistema_percentual + $comissao_antecipacao;
                                    }
                                } else {
                                    $comissao_geral_sistema_moeda = $comissao_geral_sistema_moeda + $comissao_antecipacao;
                                }
                            }
                        }
                    }

                    $arr[] = [
                        'banco_id' => $dados['banco'],
                        'convenio_id' => $dados['convenio'],
                        'tipo_id' => $dados['tipo'],
                        'tabela' => $value->convenio,
                        'vigencia' => $vigencia,
                        'prazo' => $prazo,
                        'comissao_geral_sistema_moeda' => $comissao_geral_sistema_moeda,
                        'comissao_geral_sistema_percentual' => $comissao_geral_sistema_percentual,
                        'comissao_liquido_sistema_percentual' => $comissao_liquido_sistema_percentual,
                        'comissao_bruto_sistema_percentual' => $comissao_bruto_sistema_percentual,
                        'codigo_mg' => $value->id,
                        'sistema_id' => 4,
                    ];
                }

                Tabela::insert($arr);

                DB::commit();

                return response()->json(['status' => 'OK']);
            } else {
                return response()->json('Arquivo vazio ou inválido !', 422);
            }
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json('Erro ao importar o arquivo', 422);
        }
    }

    public function tofloat($num)
    {
        $dotPos = strrpos($num, '.');
        $commaPos = strrpos($num, ',');
        $sep = (($dotPos > $commaPos) && $dotPos) ? $dotPos : ((($commaPos > $dotPos) && $commaPos) ? $commaPos : false);

        if (!$sep) {
            return floatval(preg_replace('/[^0-9]/', '', $num));
        }

        return floatval(
            preg_replace('/[^0-9]/', '', substr($num, 0, $sep)) . '.' .
                preg_replace('/[^0-9]/', '', substr($num, $sep + 1, strlen($num)))
        );
    }

    public function dateEmMysql($dateSql)
    {
        $ano = substr($dateSql, 6);
        $mes = substr($dateSql, 3, -5);
        $dia = substr($dateSql, 0, -8);

        return $ano . '-' . $mes . '-' . $dia;
    }
}
