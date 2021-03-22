<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tabela;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Rap2hpoutre\FastExcel\FastExcel;

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

            $arquivo = $request->file('arquivo')->store('uploads', 'public');

            $path = storage_path('app/public/' . $arquivo);

            $data = (new FastExcel())->import($path, function ($line) use ($dados) {
                $data_vigencia = DateTime::createFromFormat('d/m/Y', trim(explode(' ', $line['VIGÊNCIA'])[0]));
                $vigencia = $data_vigencia->format('Y-m-d');

                $comissao_geral_sistema = 0.00;
                $comissao_liquido_sistema = 0.00;
                $comissao_bruto_sistema = 0.00;

                $comissao_cms_base = 0.00;
                $comissao_bonus = 0.00;
                $comissao_ad_dif = 0.00;
                $comissao_seguro = 0.00;
                $comissao_seguro_cartao = 0.00;
                $comissao_antecipacao = 0.00;
                $comissao_c_app = 0.00;

                $valor_comissao = 0.00;

                if (is_object($line['PRAZO'])) {
                    $prazo = $line['PRAZO']->format('y');
                } else {
                    $prazo = (string) $line['PRAZO'];
                }

                if (!empty($line['CMS / BASE'])) {
                    $cms = (float) explode(' ', $line['CMS / BASE'])[1];
                    $tipo = explode(' ', $line['CMS / BASE'])[3];
                    $comissao_cms_base = $cms;
                    if (trim($tipo) === 'BRUTO') {
                        $comissao_bruto_sistema = $comissao_bruto_sistema + $comissao_cms_base;
                    }
                    if (trim($tipo) === 'LÍQUIDO') {
                        $comissao_liquido_sistema = $comissao_liquido_sistema + $comissao_cms_base;
                    }
                }
                if (isset($line['Bônus'])) {
                    if (!empty($line['Bônus'])) {
                        $comissao_bonus = (float) explode(' ', $line['Bônus'])[1];
                        $tipo = explode(' ', $line['Bônus'])[3];
                        if ($comissao_bonus > 0) {
                            if ((trim($tipo) === 'BRUTO')) {
                                $comissao_bruto_sistema = $comissao_bruto_sistema + $comissao_bonus;
                            }
                            if ((trim($tipo) === 'LÍQUIDO')) {
                                $comissao_liquido_sistema = $comissao_liquido_sistema + $comissao_bonus;
                            }
                        }
                    }
                }

                if (isset($line['Ad. Dif.'])) {
                    if (!empty($line['Ad. Dif.'])) {
                        $comissao_ad_dif = (float) explode(' ', $line['Ad. Dif.'])[1];
                        $tipo = explode(' ', $line['Ad. Dif.'])[3];
                        if ($comissao_ad_dif > 0) {
                            if ((trim($tipo) === 'BRUTO')) {
                                $comissao_bruto_sistema = $comissao_bruto_sistema + $comissao_ad_dif;
                            }
                            if ((trim($tipo) === 'LÍQUIDO')) {
                                $comissao_liquido_sistema = $comissao_liquido_sistema + $comissao_ad_dif;
                            }
                        }
                    }
                }

                if (isset($line['Seguro'])) {
                    if (!empty($line['Seguro'])) {
                        $comissao_seguro = (float) explode(' ', $line['Seguro'])[1];
                        $tipo = explode(' ', $line['Seguro'])[3];
                        if ($comissao_seguro > 0) {
                            if ((trim($tipo) === 'BRUTO')) {
                                $comissao_bruto_sistema = $comissao_bruto_sistema + $comissao_seguro;
                            }
                            if ((trim($tipo) === 'LÍQUIDO')) {
                                $comissao_liquido_sistema = $comissao_liquido_sistema + $comissao_seguro;
                            }
                        }
                    }
                }

                if (isset($line['Seguro Cartão'])) {
                    if (!empty($line['Seguro Cartão'])) {
                        $comissao_seguro_cartao = (float) explode(' ', $line['Seguro Cartão'])[1];
                        $tipo = explode(' ', $line['Seguro Cartão'])[3];
                        if ($comissao_seguro_cartao > 0) {
                            if ((trim($tipo) === 'BRUTO')) {
                                $comissao_bruto_sistema = $comissao_bruto_sistema + $comissao_seguro_cartao;
                            }
                            if ((trim($tipo) === 'LÍQUIDO')) {
                                $comissao_liquido_sistema = $comissao_liquido_sistema + $comissao_seguro_cartao;
                            }
                        }
                    }
                }

                if (isset($line['Antecipacao'])) {
                    if (!empty($line['Antecipacao'])) {
                        $comissao_antecipacao = (float) explode(' ', $line['Antecipacao'])[1];
                        $tipo = explode(' ', $line['Antecipacao'])[3];
                        if ($comissao_antecipacao > 0) {
                            if ((trim($tipo) === 'BRUTO')) {
                                $comissao_bruto_sistema = $comissao_bruto_sistema + $comissao_antecipacao;
                            }
                            if ((trim($tipo) === 'LÍQUIDO')) {
                                $comissao_liquido_sistema = $comissao_liquido_sistema + $comissao_antecipacao;
                            }
                        }
                    }
                }

                if (isset($line['C/ App'])) {
                    if (!empty($line['C/ App'])) {
                        $comissao_c_app = (float) explode(' ', $line['C/ App'])[1];
                        $tipo = explode(' ', $line['C/ App'])[3];
                        if ($comissao_c_app > 0) {
                            if ((trim($tipo) === 'BRUTO')) {
                                $comissao_bruto_sistema = $comissao_bruto_sistema + $comissao_c_app;
                            }
                            if ((trim($tipo) === 'LÍQUIDO')) {
                                $comissao_liquido_sistema = $comissao_liquido_sistema + $comissao_c_app;
                            }
                        }
                    }
                }

                $comissao_geral_sistema = $comissao_cms_base + $comissao_bonus + $comissao_antecipacao + $comissao_ad_dif + $comissao_seguro + $comissao_c_app + $comissao_seguro_cartao;

                $newTabela = new Tabela();
                $newTabela->banco_id = $dados['banco'];
                $newTabela->convenio_id = $dados['convenio'];
                $newTabela->tipo_id = $dados['tipo'];
                $newTabela->tabela = $line['CONVÊNIO'];
                $newTabela->vigencia = $vigencia;
                $newTabela->prazo = $prazo;
                $newTabela->comissao_geral_sistema = $comissao_geral_sistema;
                $newTabela->comissao_liquido_sistema = $comissao_liquido_sistema;
                $newTabela->comissao_bruto_sistema = $comissao_bruto_sistema;
                $newTabela->codigo_mg = $line['ID'];
                $newTabela->sistema_id = 4;
                $newTabela->save();
            });
            DB::commit();
            unlink($path);

            return response()->json(['status' => 'OK']);
        } catch (\Exception $e) {
            DB::rollback();
            unlink($path);

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
