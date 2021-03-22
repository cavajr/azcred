import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ErrorHandlerService } from '../../../core/error-handler.service';
import { AuthService } from '../../../seguranca/auth.service';
import { CorretoresService } from './../../corretores/corretores.service';
import { OperacoesService, OperacaoFiltro } from './../operacoes.service';
import { Producao } from '../../../core/model';

import { LazyLoadEvent } from 'primeng/api';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
ptBrLocale.invalidDate = 'Data inválida';
defineLocale('pt-br', ptBrLocale);

import { ToastrService } from 'ngx-toastr';

import swal from 'sweetalert';

@Component({
  selector: 'app-operacao-producao',
  templateUrl: './operacao-producao.component.html',
  styleUrls: ['./operacao-producao.component.css']
})
export class OperacaoProducaoComponent implements OnInit {
  oculto = 'oculto';

  bsConfig: Partial<BsDatepickerConfig>;

  producao: Producao;

  filtro: OperacaoFiltro = new OperacaoFiltro();
  totalRegistros = 0;
  producoes = [];
  @ViewChild('tabela')
  grid;

  loading: boolean;

  listaCorretores = [];

  corretores = [];

  operacoes = [
    { label: 'Crédito', value: 'C' },
    { label: 'Débito', value: 'D' }
  ];

  pagos = [
    { label: "Sim", value: "S" },
    { label: "Não", value: "N" }
  ];

  constructor(
    private operacaoService: OperacoesService,
    private errorHandler: ErrorHandlerService,
    private localeService: BsLocaleService,
    private corretorService: CorretoresService,
    private toastr: ToastrService,
    public auth: AuthService
  ) {
    // Datapicker Configuração
    this.localeService.use('pt-br');
    this.bsConfig = Object.assign(
      {},
      {
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
        showWeekNumbers: false
      }
    );
  }

  ngOnInit() {
    this.loading = true;
    this.preencheCorretores();
  }

  pesquisar(pagina = 0): void {
    this.loading = true;
    this.filtro.pagina = pagina + 1;
    this.operacaoService
      .pesquisar(this.filtro)
      .then(resultado => {
        this.loading = false;
        this.totalRegistros = resultado.total;
        this.producoes = resultado.producoes;
      })
      .catch(erro => {
        this.loading = false;
        this.errorHandler.handle(erro);
      });
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  novo(event: any) {
    event.preventDefault();
    this.oculto = '';
    this.producao = new Producao();
  }

  adicionar(form: FormControl) {
    this.operacaoService
      .adicionar(this.producao)
      .then(producaoNova => {
        this.toastr.success('Registro adicionado com sucesso!', 'Sucesso');
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  confirmar(frm: FormControl) {
    this.adicionar(frm);
    this.oculto = 'oculto';
    frm.reset();
    this.grid.first = 0;
    this.pesquisar(0);
  }

  preencheCorretores() {
    this.corretorService
      .listarCorretores()
      .then(corretores => {
        this.corretores = corretores;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  confirmarExclusao(usuario: any) {
    swal({
      title: 'Tem certeza que deseja excluir?',
      text: 'Você não poderá reverter essa ação!',
      icon: 'warning',
      buttons: ['Não', 'Sim'],
      dangerMode: true
    }).then(result => {
      if (result) {
        this.excluir(usuario);
      }
    });
  }

  excluir(operacao: any) {
    this.operacaoService
      .excluir(operacao.id)
      .then(() => {
        this.grid.first = 0;
        this.pesquisar(0);
        this.toastr.success('Registro excluído com sucesso!', 'Sucesso');
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
}
