import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-pagamento-individual",
  templateUrl: "./pagamento-individual.component.html",
  styleUrls: ["./pagamento-individual.component.scss"]
})
export class PagamentoIndividualComponent {
  @Output() rowSelect = new EventEmitter();
  @Output() rowUnselect = new EventEmitter();
  @Output() rowsSelectAll = new EventEmitter();

  selecionados = [];

  totaliza = 0;
  totalComissao = 0;
  totalTarifa = 0;

  @Input() corretor;

  constructor() {}

  onRowSelect(event) {
    this.totalComissao =
      this.totalComissao + event.data.corretor_valor_comissao;
    if (this.selecionados.length > 0) {
      this.totalTarifa = this.corretor.tarifa;
    } else {
      this.totalTarifa = 0;
    }
    this.totaliza = this.totalComissao - this.totalTarifa;
    if (this.totaliza < 0) {
      this.totaliza = 0;
    }
    let contratos = event.data;
    let dados = {
      contratos: contratos,
      corretor: event.data.corretor_id,
      tarifa: this.corretor.tarifa
    };
    this.rowSelect.emit(dados);
  }

  onRowUnselect(event) {
    this.totalComissao =
      this.totalComissao - event.data.corretor_valor_comissao;

    this.totalTarifa = this.corretor.tarifa;

    if (this.totalComissao > 0) {
      this.totaliza = this.totalComissao - this.totalTarifa;
    } else {
      this.totaliza = this.totalComissao;
    }
    let contratos = event.data;
    let dados = {
      contratos: contratos,
      corretor: event.data.corretor_id,
      tarifa: this.corretor.tarifa
    };
    this.rowUnselect.emit(dados);
  }

  selectAll(event) {
    let dados = [];
    if (event.checked) {
      this.totaliza = 0;
      this.totalTarifa = this.corretor.tarifa;
      let contrato = {};
      this.corretor.contratos.forEach(element => {
        this.totalComissao =
          this.totalComissao + element.corretor_valor_comissao;
        contrato = {
          event: event.checked,
          corretor: this.corretor.id,
          tarifa: this.corretor.tarifa,
          contratos: element
        };
        dados.push(contrato);
      });
    } else {
      let contrato = {};
      this.totalComissao = 0;
      this.totaliza = 0;
      this.totalTarifa = 0;
      this.corretor.contratos.forEach(element => {
        contrato = {
          event: event.checked,
          corretor: this.corretor.id,
          tarifa: this.corretor.tarifa,
          contratos: element
        };
        dados.push(contrato);
      });
    }
    this.totaliza = this.totalComissao - this.totalTarifa;
    this.rowsSelectAll.emit(dados);
  }
}
