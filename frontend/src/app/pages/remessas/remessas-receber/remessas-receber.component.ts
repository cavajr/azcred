import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl } from "@angular/forms";

import { RemessasService } from "./../remessas.service";
import { AuthService } from './../../../seguranca/auth.service';
import { ErrorHandlerService } from './../../../core/error-handler.service';

import { Remessa } from './../../../core/model';

import { ToastrService } from "ngx-toastr";

import swal from "sweetalert";

@Component({
  selector: "app-remessas-receber",
  templateUrl: "./remessas-receber.component.html",
  styleUrls: ["./remessas-receber.component.css"]
})
export class RemessasReceberComponent implements OnInit {
  blocked = false;
  promotor: string;
  loading: boolean;
  remessa = new Remessa();
  lote = null;

  selecionados: any[];
  contratos: any = [];

  constructor(
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    private toastr: ToastrService,
    private remessaService: RemessasService,
  ) {}

  ngOnInit() {
    this.loading = true;
    this.lote = this.route.snapshot.params["id"];
    if (this.lote) {
      this.carregarRemessa(this.lote);
    }
  }

  carregarRemessa(id: number) {
    this.remessaService
      .buscarPorCodigo(id)
      .then(resultado => {
        this.contratos = resultado.remessa_item;
        this.promotor = resultado.remessa.corretor;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: FormControl) {
    let filtro = this.selecionados.filter(x => x.recebido === 0);
    if (filtro) {
      this.remessaService
        .receber(this.route.snapshot.params["id"], filtro)
        .then(relatorio => {
          if (relatorio.status === true) {
            const selected = filtro.filter(x => x.lote).map(x => x.lote);
            this.selecionados = null;
            this.router.navigate(["/remessas", this.lote]);
            this.carregarRemessa(this.lote);
            this.toastr.success("Registros recebidos com sucesso!", "Sucesso");
            swal({
              title: "Deseja imprimir?",
              text: "Você não poderá reverter essa ação!",
              icon: "warning",
              buttons: ["Não", "Sim"],
              dangerMode: true
            }).then(result => {
              if (result) {
                this.gerar(selected);
              }
            });
          }

          if (relatorio.status === false) {
            swal(
              "Erro",
              "Erro ao receber - Tente novamente mais tarde!",
              "error"
            );
          }
        })
        .catch(erro => {
          this.errorHandler.handle(erro);
        });
    }
  }

  gerar(selecionados) {
    this.blocked = true;
    this.remessaService
      .relatorioRemessaSelecionado({
        lote: this.lote,
        promotor: this.promotor,
        selecionados: selecionados
      })
      .subscribe(
        relatorio => {
          this.blocked = false;
          let file = new Blob([relatorio], { type: "application/pdf" });
          const url = window.URL.createObjectURL(file);
          window.open(url);
        },
        error => {
          this.blocked = false;
          if (error.status === 422) {
            swal("Erro", "Nenhum dado foi encontrado para a pesquisa", "error");
          }
        }
      );
  }
}
