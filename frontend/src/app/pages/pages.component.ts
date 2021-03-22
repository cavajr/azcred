import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { ErrorHandlerService } from "./../core/error-handler.service";
import { LogoutService } from "./../seguranca/logout.service";
import { AuthService } from "./../seguranca/auth.service";

@Component({
  selector: "app-pages",
  templateUrl: "./pages.component.html",
  styles: []
})
export class PagesComponent implements OnInit {
  menuCover = [
    {
      name: "Início",
      url: "/dashboard",
      icon: "icon-home",
      attributes: {
        permissions: true
      }
    },
    {
      title: true,
      name: "Menu do Usuário",
      attributes: {
        permissions: this.auth.temQualquerPermissao([
          "VISUALIZAR_CONFIG",
          "VISUALIZAR_COMISSAO",
          "VISUALIZAR_BANCOPG",
          "VISUALIZAR_TIPO_CONTRATO",
          "VISUALIZAR_CONTA",
          "VISUALIZAR_CONVENIO",
          "VISUALIZAR_BANCO",
          "VISUALIZAR_TABELA",
          "IMPORTAR_COMISSAO",
          "VISUALIZAR_PRODUCAO",
          "IMPORTAR_PRODUCAO",
          "VISUALIZAR_CORRETOR",
          "VISUALIZAR_LANCAMENTO",
          "IMPRIMIR_FINANCEIRO",
          "RELATORIO_COMISSAO"
        ])
      }
    },
    {
      name: "Configurações",
      url: "/pages",
      icon: "fa fa-gears",
      attributes: {
        permissions: this.auth.temQualquerPermissao([
          "VISUALIZAR_COMISSAO",
          "VISUALIZAR_CONFIG"
        ])
      },
      children: [
        {
          name: "Sistema",
          url: "/config",
          icon: "fa fa-angle-right",
          attributes: {
            permissions: this.auth.temPermissao("VISUALIZAR_CONFIG")
          }
        },
        {
          name: "Comissão",
          url: "/perfils",
          icon: "fa fa-angle-right",
          attributes: {
            permissions: this.auth.temPermissao("VISUALIZAR_COMISSAO")
          }
        }
      ]
    },
    {
      name: "Tabelas Auxiliares",
      url: "/pages",
      icon: "fa fa-calendar-plus-o",
      attributes: {
        permissions: this.auth.temQualquerPermissao([
          "VISUALIZAR_BANCOPG",
          "VISUALIZAR_TIPO_CONTRATO",
          "VISUALIZAR_CONTA",
          "VISUALIZAR_CONVENIO",
          "VISUALIZAR_BANCO"
        ])
      },
      children: [
        {
          name: "Tipos de Conta",
          url: "/contas",
          icon: "fa fa-angle-right",
          attributes: {
            permissions: this.auth.temPermissao("VISUALIZAR_CONTA")
          }
        },
        {
          name: "Tipos de Contrato",
          url: "/tipos",
          icon: "fa fa-angle-right",
          attributes: {
            permissions: this.auth.temPermissao("VISUALIZAR_TIPO_CONTRATO")
          }
        },
        {
          name: "Bancos Pagamentos",
          url: "/bancospg",
          icon: "fa fa-angle-right",
          attributes: {
            permissions: this.auth.temPermissao("VISUALIZAR_BANCOPG")
          }
        },
        {
          name: "Bancos Contratos",
          url: "/bancos",
          icon: "fa fa-angle-right",
          attributes: {
            permissions: this.auth.temPermissao("VISUALIZAR_BANCO")
          }
        },
        {
          name: "Convênios",
          url: "/convenios",
          icon: "fa fa-angle-right",
          attributes: {
            permissions: this.auth.temPermissao("VISUALIZAR_CONVENIO")
          }
        }
      ]
    },
    {
      name: "Comissão",
      url: "/pages",
      icon: "fa fa-cloud-upload",
      attributes: {
        permissions: this.auth.temQualquerPermissao([
          "VISUALIZAR_TABELA",
          "IMPORTAR_COMISSAO"
        ])
      },
      children: [
        {
          name: "Visualizar",
          url: "/tabelas",
          icon: "fa fa-angle-right",
          attributes: {
            permissions: this.auth.temPermissao("VISUALIZAR_TABELA")
          }
        },
        {
          name: "Importar",
          url: "/comissoes",
          icon: "fa fa-angle-right",
          attributes: {
            permissions: this.auth.temPermissao("IMPORTAR_COMISSAO")
          }
        }
      ]
    },
    {
      name: "Produção",
      url: "/pages",
      icon: "fa fa-percent",
      attributes: {
        permissions: this.auth.temQualquerPermissao([
          "VISUALIZAR_PRODUCAO",
          "IMPORTAR_PRODUCAO",
          "VISUALIZAR_PAGAMENTO"
        ])
      },
      children: [
        {
          name: "Visualizar",
          url: "/producoes",
          icon: "fa fa-angle-right",
          attributes: {
            permissions: this.auth.temPermissao("VISUALIZAR_PRODUCAO")
          }
        },
        {
          name: 'Créditos/Débitos',
          url: '/producoes/operacoes',
          icon: 'fa fa-angle-right',
          attributes: {
            permissions: this.auth.temPermissao('VISUALIZAR_PRODUCAO')
          }
        },
        {
          name: "Pagamentos",
          url: "/pagamentos",
          icon: "fa fa-angle-right",
          attributes: {
            permissions: this.auth.temPermissao("VISUALIZAR_PAGAMENTO")
          }
        },
        {
          name: "Resumo",
          url: "/producoes/resumo",
          icon: "fa fa-angle-right",
          attributes: {
            permissions: this.auth.temPermissao("VISUALIZAR_PRODUCAO")
          }
        },
        {
          name: "Importar",
          url: "/producao",
          icon: "fa fa-angle-right",
          attributes: {
            permissions: this.auth.temPermissao("IMPORTAR_PRODUCAO")
          }
        }
      ]
    },
    {
      name: "Protocolos",
      url: "/remessas",
      icon: "fa fa-exchange",
      attributes: { permissions: this.auth.temPermissao("VISUALIZAR_REMESSA") }
    },
    {
      name: "Corretores",
      url: "/corretores",
      icon: "fa fa-street-view",
      attributes: { permissions: this.auth.temPermissao("VISUALIZAR_CORRETOR") }
    },
    {
      name: "Financeiro",
      url: "/pages",
      icon: "fa fa-money",
      attributes: {
        permissions: this.auth.temQualquerPermissao([
          "VISUALIZAR_LANCAMENTO",
          "IMPRIMIR_FINANCEIRO"
        ])
      },
      children: [
        {
          name: "Lançamentos",
          url: "/financeiro",
          icon: "fa fa-angle-right",
          attributes: {
            permissions: this.auth.temPermissao("VISUALIZAR_LANCAMENTO")
          }
        },
        {
          name: "Relatório",
          url: "/relatorios/controle-financeiro",
          icon: "fa fa-angle-right",
          attributes: {
            permissions: this.auth.temPermissao("IMPRIMIR_FINANCEIRO")
          }
        }
      ]
    },
    {
      name: "Relatórios",
      url: "/pages",
      icon: "fa fa-file-pdf-o",
      attributes: {
        permissions: this.auth.temQualquerPermissao([
          "RELATORIO_COMISSAO",
          "IMPRIMIR_FISICO_PENDENTE",
          "IMPRIMIR_PAGAMENTO"
        ])
      },
      children: [
        {
          name: "Comissão",
          url: "/relatorios/comissao",
          icon: "fa fa-angle-right",
          attributes: {
            permissions: this.auth.temPermissao("RELATORIO_COMISSAO")
          }
        },
        {
          name: "Pagamentos p/Corretor",
          url: "/relatorios/pagamentos",
          icon: "fa fa-angle-right",
          attributes: {
            permissions: this.auth.temPermissao("IMPRIMIR_PAGAMENTO")
          }
        },
        {
          name: "Físico Pendente",
          url: "/relatorios/fisico-pendente",
          icon: "fa fa-angle-right",
          attributes: {
            permissions: this.auth.temPermissao("IMPRIMIR_FISICO_PENDENTE")
          }
        }
      ]
    },
    {
      title: true,
      name: "SENHAS DOS CONVÊNIOS",
      attributes: {
        permissions: true
      }
    },
    {
      name: "Pesquisa",
      url: "/acessos",
      icon: "fa fa-group",
      attributes: {
        permissions: true
      }
    },
    {
      title: true,
      name: "CORRETORES",
      attributes: {
        permissions: this.auth.temQualquerPermissao(["ACESSO_CORRETOR"])
      }
    },
    {
      name: "Códigos de Acesso",
      url: "/corretores/acessos",
      icon: "fa fa-group",
      attributes: {
        permissions: this.auth.temPermissao("ACESSO_CORRETOR")
      }
    },
    {
      name: "Protocolos",
      url: "/corretores/remessas",
      icon: "fa fa-exchange",
      attributes: {
        permissions: this.auth.temPermissao("ACESSO_CORRETOR")
      }
    },
    {
      name: "Comissão",
      url: "/pages",
      icon: "fa fa-cloud-upload",
      attributes: {
        permissions: this.auth.temQualquerPermissao(["ACESSO_CORRETOR"])
      },
      children: [
        {
          name: "Visualizar",
          url: "/corretores/tabelas",
          icon: "fa fa-angle-right",
          attributes: {
            permissions: this.auth.temPermissao("ACESSO_CORRETOR")
          }
        }
      ]
    },
    {
      name: "Produção",
      url: "/pages",
      icon: "fa fa-percent",
      attributes: {
        permissions: this.auth.temQualquerPermissao(["ACESSO_CORRETOR"])
      },
      children: [
        {
          name: "Visualizar",
          url: "/corretores/producoes",
          icon: "fa fa-angle-right",
          attributes: {
            permissions: this.auth.temPermissao("ACESSO_CORRETOR")
          }
        }
      ]
    },
    {
      name: "Relatórios",
      url: "/pages",
      icon: "fa fa-file-pdf-o",
      attributes: {
        permissions: this.auth.temQualquerPermissao(["ACESSO_CORRETOR"])
      },
      children: [
        {
          name: "Comissão",
          url: "/corretores/relatorios/comissao",
          icon: "fa fa-angle-right",
          attributes: {
            permissions: this.auth.temPermissao("ACESSO_CORRETOR")
          }
        }
      ]
    },
    {
      title: true,
      name: "ADMINISTRAÇÃO",
      attributes: {
        permissions: this.auth.temQualquerPermissao([
          "VISUALIZAR_USUARIO",
          "VISUALIZAR_GRUPO",
          "VISUALIZAR_PERMISSAO",
          "VISUALIZAR_SISTEMA"
        ])
      }
    },
    {
      name: "Usuários",
      url: "/usuarios",
      icon: "fa fa-user",
      attributes: {
        permissions: this.auth.temPermissao("VISUALIZAR_USUARIO")
      }
    },
    {
      name: "Grupos",
      url: "/grupos",
      icon: "fa fa-group",
      attributes: {
        permissions: this.auth.temPermissao("VISUALIZAR_GRUPO")
      }
    },
    {
      name: "Permissões",
      url: "/permissoes",
      icon: "fa fa-user-secret",
      attributes: {
        permissions: this.auth.temPermissao("VISUALIZAR_PERMISSAO")
      }
    },
    {
      name: "Sistemas",
      url: "/sistemas",
      icon: "fa fa-user-secret",
      attributes: {
        permissions: this.auth.temPermissao("VISUALIZAR_SISTEMA")
      }
    }
  ];

  public navItems: any;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;

  constructor(
    private router: Router,
    public auth: AuthService,
    private logoutService: LogoutService,
    private errorHandler: ErrorHandlerService
  ) {
    this.changes = new MutationObserver(mutations => {
      this.sidebarMinimized = document.body.classList.contains(
        "sidebar-minimized"
      );
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
  }

  ngOnInit() {
    this.montaMenu();
  }

  montaMenu() {
    let pais = this.menuCover.filter(menu => {
      return menu.attributes.permissions === true;
    });

    pais.forEach(menu => {
      if (menu.attributes.permissions === true) {
        let pai = menu;
        if (menu.children && menu.children.length > 0) {
          let filhos = menu.children.filter(filho => {
            return filho.attributes.permissions === true;
          });
          pai.children = filhos;
        }
      }
    });

    this.navItems = pais;
  }

  logout() {
    this.logoutService.logout();
  }
}
