<?php

use Illuminate\Support\Facades\Route;

Route::post('auth/login', 'Api\AuthController@login');
Route::get('auth/refresh', 'Api\AuthController@refresh');
Route::get('auth/logout', 'Api\AuthController@logout');
Route::get('config/{id}/logo', "Api\ConfigController@showLogo");

Route::get('/atualiza-financeiro', 'Api\PagamentoController@atualizaFinanceiro');

Route::group(['middleware' => ['jwt.auth', 'cors'], 'namespace' => 'Api\\'], function () {
    Route::get('dashboard', 'DashboardController@index');

    // Profile
    Route::post('profile/{id}/upload', 'ProfileController@subir');
    Route::resource('profile', 'ProfileController', ['only' => ['update', 'show']]);

    Route::resource('financeiro', 'FinanceiroController');

    Route::get('usuarios/listarAll', 'UsuarioController@listarAll');
    Route::resource('usuarios', 'UsuarioController');

    Route::get('permissoes/listarPermissoes', 'PermissoesController@listarAll');
    Route::resource('permissoes', 'PermissoesController');

    Route::get('grupos/listarAll', 'PapeisController@listarAll');
    Route::resource('grupos', 'PapeisController');

    Route::get('acessos/listarAll', 'AcessoController@listarAll');
    Route::resource('acessos', 'AcessoController');

    Route::post('corretores/remessa-enviar', 'CorretorController@remessaEnviar');
    Route::get('corretores/contratos', 'CorretorController@contratos');
    Route::get('corretores/tabelas/exportar', 'CorretorController@exportarTabela');
    Route::get('corretores/tabelas', 'CorretorController@tabelas');
    Route::get('corretores/producoes/exportar', 'CorretorController@exportarProducao');
    Route::get('corretores/producoes', 'CorretorController@producoes');
    Route::get('corretores/listarAll', 'CorretorController@listarAll');
    Route::put('corretores/acessos', 'CorretorAcessoController@update');
    Route::resource('corretores', 'CorretorController');

    Route::get('convenios/listarAll', 'ConvenioController@listarAll');
    Route::resource('convenios', 'ConvenioController');

    Route::get('bancos/listarAll', 'BancoController@listarAll');
    Route::resource('bancos', 'BancoController');

    Route::get('contas/listarAll', 'ContaController@listarAll');
    Route::resource('contas', 'ContaController');

    Route::get('bancospg/listarAll', 'BancopgController@listarAll');
    Route::resource('bancospg', 'BancopgController');

    Route::resource('tarifas', 'TarifaController');

    Route::get('tipos/listarAll', 'TipoController@listarAll');
    Route::get('tipos/{id}/sistemas', 'TipoController@sistemas');
    Route::resource('tipos', 'TipoController');

    Route::get('tabelas/exportar', 'TabelaController@exportar');
    Route::resource('tabelas', 'TabelaController');

    Route::get('sistemas/listarAll', 'SistemaController@listarAll');
    Route::resource('sistemas', 'SistemaController');

    Route::get('perfil/{id}/comissoes', 'PerfilController@comissoes');
    Route::get('perfil/listarAll', 'PerfilController@listarAll');
    Route::resource('perfil', 'PerfilController');

    Route::post('comissao/upload-amx', 'ComissaoController@importaAmx');

    Route::post('producao/upload-amx', 'ProducaoController@importaAmx');

    // Estornos
    Route::get('producoes/estornos', 'ProducaoController@estornos');
    // Producao
    Route::get('producoes', 'ProducaoController@index');
    Route::get("producoes/resumo", "ProducaoController@resumo");
    Route::get("producoes/imprimir-resumo", "ProducaoController@imprimirResumo");
    Route::post('producoes', 'ProducaoController@store');
    Route::get('producoes/{id}', 'ProducaoController@show');
    Route::put('producoes/{id}', 'ProducaoController@update');
    Route::delete('producoes/{id}', 'ProducaoController@destroy');
    Route::get('producoes/{idContrato}/comissao/{id}', 'ProducaoController@comissao');

    Route::get('config/{id}', 'ConfigController@show');
    Route::put('config/{id}', 'ConfigController@update');
    Route::post('config/{id}/upload', 'ConfigController@subir');

    // Relatórios para Gerentes ou Administradores
    Route::get('relatorios/comissao', 'Relatorios\\RelatoriosController@comissao');
    Route::get('relatorios/pagamentos', 'Relatorios\\RelatoriosController@pagamentos');
    Route::get('relatorios/financeiro', 'Relatorios\\RelatoriosController@controleFinanceiro');
    Route::get('relatorios/fisico-pendente', 'Relatorios\\RelatoriosController@fisicoPendente');
    // Fim

    // Relatórios para Corretores
    Route::get('corretores/relatorios/conta-comissao', 'Relatorios\\RelatoriosCorretorController@ContaComissao');
    Route::get('corretores/relatorios/comissao', 'Relatorios\\RelatoriosCorretorController@comissao');
    // Fim

    //Remessas
    Route::get('remessas/imprimirRemessa', 'RemessaController@imprimirRemessa');
    Route::get('remessas/imprimirRemessaSelecionado', 'RemessaController@imprimirRemessaSelecionado');
    Route::put('remessas/{id}/receber', 'RemessaController@receberRemessa');
    Route::resource('remessas', 'RemessaController');

    //Status de Remessa
    Route::get('status/listarAll', 'StatusController@listarAll');
    Route::resource('status', 'StatusController');

    // Créditos / Débitos
    Route::resource('operacoes', 'OperacaoController');

    // Pagamentos
    Route::get('pagamentos/imprimirPagamentos', 'PagamentoController@imprimirPagamentos');
    Route::resource('pagamentos', 'PagamentoController');

    Route::get('/atualiza-sistema', 'PagamentoController@atualiza');
});
