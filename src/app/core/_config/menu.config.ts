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
              title: 'Catalogue produits',
              bullet: 'dot',
              icon: 'flaticon-business',
              page: '/ecommerce/products',
            },
            {
              title: 'Gestion des Utilisateurs',
              bullet: 'dot',
              icon: 'flaticon-user',
              page: '/user-management/users',
            },
          ]
        },
        {
          title: 'Commandes Clients',
          root: true,
          alignment: 'left',
          page: '/orders',
        }
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
          page: '/ecommerce/products'
        },
        {
          title: 'Gestion des Utilisateurs',
          root: true,
          bullet: 'dot',
          icon: 'flaticon2-user-outline-symbol',
          page: '/user-management/users',
        },
      ]
    },
  };

  public get configs(): any {
    return this.defaults;
  }
}
