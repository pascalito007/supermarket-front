export class MenuConfig {
  public defaults: any = {
    header: {
      self: {},
      items: [
        {
          title: 'Tableau de bord',
          root: true,
          alignment: 'left',
          page: '/dashboard',
          translate: 'MENU.DASHBOARD',
        },
        {
          title: 'Administration',
          root: true,
          alignment: 'left',
          toggle: 'click',
          submenu: [
            {
              title: 'Produit & Clients',
              bullet: 'dot',
              icon: 'flaticon-business',
              permission: 'accessToECommerceModule',
              submenu: [
                {
                  title: 'Clients',
                  page: '/ecommerce/customers'
                },
                {
                  title: 'Produits',
                  page: '/ecommerce/products'
                },
              ]
            },
            {
              title: 'Gestion des Utilisateurs',
              bullet: 'dot',
              icon: 'flaticon-user',
              submenu: [
                {
                  title: 'Utilisateurs',
                  page: '/user-management/users'
                },
                {
                  title: 'Roles',
                  page: '/user-management/roles'
                }
              ]
            },
          ]
        },
      ]
    },
    aside: {
      self: {},
      items: [
        {
          title: 'Tableau de bord',
          root: true,
          icon: 'flaticon2-architecture-and-city',
          page: '/dashboard',
          translate: 'MENU.DASHBOARD',
          bullet: 'dot',
        },
        {
          title: 'Layout Builder',
          root: true,
          icon: 'flaticon2-expand',
          page: '/builder'
        },
        {section: 'Administration'},
        {
          title: 'Produits & Clients',
          bullet: 'dot',
          icon: 'flaticon2-list-2',
          root: true,
          permission: 'accessToECommerceModule',
          submenu: [
            {
              title: 'Clients',
              page: '/ecommerce/customers'
            },
            {
              title: 'Produits',
              page: '/ecommerce/products'
            },
          ]
        },
        {
          title: 'Gestion des Utilisateurs',
          root: true,
          bullet: 'dot',
          icon: 'flaticon2-user-outline-symbol',
          submenu: [
            {
              title: 'Utilisateurs',
              page: '/user-management/users'
            },
            {
              title: 'Roles',
              page: '/user-management/roles'
            }
          ]
        },
      ]
    },
  };

  public get configs(): any {
    return this.defaults;
  }
}
