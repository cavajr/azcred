<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banco;
use App\Models\Cliente;
use App\Models\Contrato;
use App\Models\Corretor;
use App\Models\ViewGraficoSituacao;
use App\Models\ViewGraficoSituacaoUltimoMes;
use App\Models\ViewContratosPagosAno;
use App\Traits\ApiResponser;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    use ApiResponser;

    public function index(Request $request)
    {
        $this->authorize('VISUALIZAR_DASHBOARD');

        $bancos = Banco::count();
        $contratos = Contrato::count();
        $clientes = Cliente::count();
        $corretores = Corretor::count();

        $atual = ViewGraficoSituacao::get();
        $anterior = ViewGraficoSituacaoUltimoMes::get();

        $pagos = ViewContratosPagosAno::get();

        return response()->json(['bancos' => $bancos, 'contratos' => $contratos, 'clientes' => $clientes, 'corretores' => $corretores, 'atual' => $atual, 'anterior' => $anterior, 'pagos' => $pagos]);
    }


}
