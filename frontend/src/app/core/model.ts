export class Bancopg {
  id: number;
  nome: string;
  ativo: string;

  constructor(id?: number, nome?: string, ativo?: string) {
    this.id = id;
    this.nome = nome;
    this.ativo = ativo;
  }
}

export class Banco {
  id: number;
  nome: string;
  ativo: string;

  constructor(id?: number, nome?: string, ativo?: string) {
    this.id = id;
    this.nome = nome;
    this.ativo = ativo;
  }
}

export class Acesso {
  id: number;
  banco: string;
  emprestimo: string;
  login: string;
  senha: string;
  link: string;

  constructor(
    id?: number,
    banco?: string,
    emprestimo?: string,
    login?: string,
    senha?: string,
    link?: string
  ) {
    this.id = id;
    this.banco = banco;
    this.emprestimo = emprestimo;
    this.login = login;
    this.senha = senha;
    this.link = link;
  }
}

export class Convenio {
  id: number;
  nome: string;
  ativo: string;

  constructor(id?: number, nome?: string, ativo?: string) {
    this.id = id;
    this.nome = nome;
    this.ativo = ativo;
  }
}

export class Sistema {
  id: number;
  nome: string;
  ativo: string;

  constructor(id?: number, nome?: string, ativo?: string) {
    this.id = id;
    this.nome = nome;
    this.ativo = ativo;
  }
}

export class Tipo {
  id: number;
  nome: string;
  ativo: string;
}

export class Perfil {
  id: number;
  nome: string;
  ativo: string;
}

export class PerfilComissao {
  id: number;
  real_percentual: number;
  perc_pago_inicio: number;
  perc_pago_fim: number;
  comissao: number;
  perfil_id: number;

  constructor(
    id?: number,
    real_percentual?: number,
    perc_pago_inicio?: number,
    perc_pago_fim?: number,
    comissao?: number,
    perfil_id?: number
  ) {
    this.id = id;
    this.real_percentual = real_percentual;
    this.perc_pago_inicio = perc_pago_inicio;
    this.perc_pago_fim = perc_pago_fim;
    this.comissao = comissao;
    this.perfil_id = perfil_id;
  }
}

export class TipoSistema {
  id: number;
  tipo_id: Tipo;
  sistema_id: Sistema;
  liquido: number;

  constructor(
    id?: number,
    tipo_id?: Tipo,
    sistema_id?: Sistema,
    liquido?: number
  ) {
    this.id = id;
    this.tipo_id = tipo_id;
    this.sistema_id = sistema_id;
    this.liquido = liquido;
  }
}

export class Conta {
  id: number;
  nome: string;
  ativo: string;

  constructor(id?: number, nome?: string, ativo?: string) {
    this.id = id;
    this.nome = nome;
    this.ativo = ativo;
  }
}

export class Comissao {
  id: number;
  real_percentual: number;
  perc_pago_inicio: number;
  perc_pago_fim: number;
  comissao: number;

  constructor(
    id?: number,
    real_percentual?: number,
    perc_pago_inicio?: number,
    perc_pago_fim?: number,
    comissao?: number
  ) {
    this.id = id;
    this.real_percentual = real_percentual;
    this.perc_pago_inicio = perc_pago_inicio;
    this.perc_pago_fim = perc_pago_fim;
    this.comissao = comissao;
  }
}

export class Permissao {
  id: number;
  nome: string;
  descricao: string;
}

export class Grupo {
  id: number;
  nome: string;
  descricao: string;
  permissoes = new Array<String>();
}

export class Usuario {
  id: number;
  name: string;
  email: string;
  password: string;
  acesso_externo: number;
  corretor_id: number;
  arquivo: string;
  ativo: number;
  papeis = new Array<String>();
}

export class CorretorAcesso {
  id: number;
  banco: string;
  usuario: string;
  senha: string;
  codigo_agente: string;
  operador: string;

  constructor(
    id?: number,
    banco?: string,
    usuario?: string,
    senha?: string,
    codigo_agente?: string,
    operador?: string
  ) {
    this.id = id;
    this.banco = banco;
    this.usuario = usuario;
    this.senha = senha;
    this.codigo_agente = codigo_agente;
    this.operador = operador;
  }
}

export class Corretor {
  id: number;
  ativo: string;
  perfil_id: number;
  nome: string;
  cpf: string;
  data_adm: Date;
  identidade: string;
  uf_ident: string;
  telefone: string;
  endereco: string;
  numero: string;
  complem: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  obs: string;
  bancopg_id: number;
  agencia: string;
  conta_numero: string;
  conta_id: number;
  titular_conta: string;
  cpf_titular: string;
  pessoa: string;
  acessos = new Array<CorretorAcesso>();
  email: string;
  data_nasc: Date;
  pix: String;
  tarifa: number;
}

export class Financeiro {
  id: number;
  tipo: number;
  nome: string;
  descricao: string;
  data_mov: Date;
  valor: number;
}

export class Tabela {
  id: number;
  codigo_mg: string;
  banco_id: number;
  convenio_id: number;
  tipo_id: number;
  tabela: string;
  vigencia: Date;
  prazo: string;
  comissao_sistema: number;
  comissao_correspondente: number;
  comissao_corretor: number;
}

export class Config {
  id: number;
  empresa: string;
  cidade: string;
  estado: string;
  logo: string;
}

export class Producao {
  id: number;
  cpf: string;
  cliente: string;
  banco: string;
  proposta: string;
  contrato: string;
  prazo: string;
  produto: string;
  tabela: string;
  usuario: string;
  corretor_id: number;
  fisicopendente: string;
  pago: string;
  data_ncr: Date;
  valor_comissao: number;
  perc_comissao: number;
  corretor_perc_comissao: number;
  corretor_valor_comissao: number;
  correspondente_valor_comissao: number;
  correspondente_perc_comissao: number;
  data_importacao: Date;
  operacao: string;
  pagamento_id: number;
  tipo: string;
  em_real: number;
}

export class Remessa {
  id: number;
  corretor_id: number;
  status_id: number;
  data_remessa: Date;
  data_recebido: Date;
  obs: string;
}

export class RemessaItem {
  id: number;
  remessa_id: number;
  contrato_id: number;
}
