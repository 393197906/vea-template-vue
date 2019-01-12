import {vue as Vue,vueRouter as Router} from "vea"
import * as ACCESS from '../util/access'
import * as util from '@/util/util'

Vue.use(Router)
const routerConfig = [{
  path: '/',
  name: 'layout',
  redirect: '/home',
  component: () =>
    import('../page/layout/BaseLayout'),
  children: [
    // 登录
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录'
      },
      component: () =>
        import('../page/login/Login')
    },
    { // 首页
      path: '/home',
      name: 'home',
      meta: {
        title: '首页',
        nav: 1,
        access: ACCESS.INDEX,
        icon: 'fa fa-home'
      },
      redirect: '/home/welcome',
      component: () =>
        import('../page/layout/Layout'),
      children: [{ // 首页
        path: '/home/welcome',
        name: 'welcome',
        meta: {
          title: '欢迎页',
          nav: 2,
          access: ACCESS.INDEX,
          icon: 'fa fa-area-chart'
        },
        component: () =>
          import('../page/home/Welcome')
      }]
    },
    { // 商品
      path: '/goods',
      name: 'goods',
      meta: {
        title: '商品',
        nav: 1,
        icon: 'fa fa-cubes',
        access: ACCESS.GOODS
        // group: {
        //   test: "测试商品",
        //   test1: "测试"
        // }
      },
      redirect: '/goods/list',
      component: () =>
        import('../page/layout/Layout'),
      children: [{ // 商品列表
        path: '/goods/list',
        name: 'list',
        meta: {
          title: '商品列表',
          nav: 2,
          icon: 'fa fa-list',
          access: ACCESS.GOODS_LIST,
          keep: true
          // groupBy: "test"
        },
        component: () =>
          import('../page/goods/list')
      },
      { // 商品发布
        path: '/goods/add',
        name: 'add',
        meta: {
          title: '商品发布',
          nav: 2,
          icon: 'fa fa-plus',
          access: ACCESS.GOODS_ADD
        },
        component: () =>
            import('../page/goods/add')
      },
        // 商品编辑(商品列表)
      {
        path: '/goods/goodsskuedit/:id',
        meta: {
          title: '编辑商品',
          access: ACCESS.GOODS_EDIT
        },
        name: 'goods_sku_edit',
        component: () =>
            import('../page/goods/add')
      },
        /** ------------ Ayan --------------- */
      { // 价格表
        path: '/goods/price_form',
        name: 'price_form',
        meta: {
          title: '价格表',
          nav: 2,
          icon: 'fa fa-list',
          access: ACCESS.PRICE_FORM_LIST
          // groupBy: "test1"
        },
        component: () =>
            import('../page/goods/price_form/price_form')
      },
        /** ------------ Ayan End--------------- */
        //  价格体系
      {
        path: '/goods/pricing',
        name: 'pricing',
        meta: {
          title: '价格体系',
          nav: 2,
          icon: 'fa fa-money',
          access: ACCESS.PRICE_SYSTEM_LIST
        },
        component: () =>
            import('../page/goods/pricing')

      },
        //  添加价格体系
      {
        path: '/goods/pricing/add',
        name: 'add_pricing',
        meta: {
          title: '添加价格体系',
          access: ACCESS.PRICE_SYSTEM_ADD
        },
        component: () =>
            import('../page/goods/add_pricing')
      },
      {
        path: '/goods/pricing/edit/:id',
        name: 'edit_pricing',
        meta: {
          title: '编辑价格体系',
          access: ACCESS.PRICE_SYSTEM_EDIT
        },
        component: () =>
            import('../page/goods/add_pricing')
      },
      { // 商品规格
        path: '/goods/sku',
        name: 'sku',
        meta: {
          title: '商品规格',
          nav: 2,
          icon: 'fa fa-dedent',
          access: ACCESS.SKU_LIST
        },
        component: () =>
            import('../page/goods/sku')

      },
        // 商品规格添加
      {
        path: '/goods/sku/skuadd',
        meta: {
          title: '添加商品规格',
          access: ACCESS.SKU_ADD
        },
        name: 'skuadd',
        component: () =>
            import('../page/goods/skuadd')

      },
        // 商品规格修改
      {
        path: '/goods/sku/skuedit/:id',
        meta: {
          title: '修改商品规格',
          access: ACCESS.SKU_EDIT
        },
        name: 'skuedit',
        component: () =>
            import('../page/goods/skuedit')
      },
      { // 商品评价
        path: '/goods/comment',
        name: 'comment',
        meta: {
          title: '商品评价',
          nav: 2,
          icon: 'fa fa-commenting',
          access: ACCESS.GOODS_COMMENT_LIST,
          keep: true
        },
        component: () =>
            import('../page/goods/comment')
      }
      ]
    },
    { // 采购（进销存）
      path: '/purchase',
      name: 'purchase',
      meta: {
        title: '采购',
        nav: 1,
        icon: 'fa el-icon-sort',
        group: {
          purchaseManagement: '采购管理'
          // storePurchaseManagement: '要货管理'
        }
      },
      redirect: '/purchase/warehousing',
      component: () =>
        import('../page/layout/Layout'),
      children: [{
        path: '/purchase/warehousing',
        name: 'warehousing',
        meta: {
          title: '采购入库',
          nav: 2,
          icon: 'fa el-icon-sort-down',
          access: ACCESS.PURCHASE_BILL_LIST,
          keep: true,
          groupBy: 'purchaseManagement'
        },
        component: () =>
          import('../page/purchase/warehousing')
      },
      {
        path: '/purchase/warehousing/newWarehousing',
        name: 'newWarehousing',
        meta: {
          title: '新建采购入库',
          icon: 'fa el-icon-search',
          access: ACCESS.PURCHASE_BILL_ADD
        },
        component: () =>
            import('../page/purchase/newWarehousing')
      },
      {
        path: '/purchase/warehousing/warehousingSingleDetails/:id',
        name: 'warehousingSingleDetails',
        meta: {
          title: '入库单详情',
          icon: 'fa el-icon-search',
          access: ACCESS.PURCHASE_BILL_DETAIL
        },
        component: () =>
            import('../page/purchase/warehousingSingleDetails')
      },
      {
        path: '/purchase/returnGoodsOutgoing/returnGoodsOutgoingDetails/:id',
        name: 'returnGoodsOutgoingDetails',
        meta: {
          title: '采退出库单详情',
          icon: 'fa el-icon-search',
          access: ACCESS.PURCHASE_RETURN_BILL_DETAIL
        },
        component: () =>
            import('../page/purchase/warehousingSingleDetails')
      },
      {
        path: '/purchase/returnGoodsOutgoing',
        name: 'returnGoodsOutgoing',
        meta: {
          title: '采退出库',
          nav: 2,
          icon: 'fa el-icon-sort-up',
          access: ACCESS.PURCHASE_RETURN_BILL_LIST,
          groupBy: 'purchaseManagement'
        },
        component: () =>
            import('../page/purchase/returnGoodsOutgoing')
      },
      {
        path: '/purchase/returnGoodsOutgoing/newReturnGoodsOutgoing',
        name: 'newReturnGoodsOutgoing',
        meta: {
          title: '新建采退出库',
          icon: 'fa el-icon-search',
          access: ACCESS.PURCHASE_RETURN_BILL_ADD
        },
        component: () =>
            import('../page/purchase/newReturnGoodsOutgoing')
      },
      {
        path: '/purchase/supplierManagement',
        name: 'supplierManagement',
        meta: {
          title: '供应商管理',
          nav: 2,
          icon: 'fa el-icon-share',
          access: ACCESS.SUPPLIER_LIST,
          groupBy: 'purchaseManagement'
        },
        component: () =>
            import('../page/purchase/supplierManagement')
      },
      {
        path: '/purchase/supplierManagement/customerflow/:id',
        name: 'supplierManagementCustomerflow',
        meta: {
          title: '财务流水', // 供应商
          access: ACCESS.SUPPLIER_FINANCIAL,
          icon: 'fa el-icon-date'
        },
        component: () =>
            import('../page/purchase/customerflow.vue')
      },
      {
        path: '/purchase/supplierManagement/newSupplierManagement',
        name: 'newSupplierManagement',
        meta: {
          title: '添加供应商',
          access: ACCESS.SUPPLIER_ADD
        },
        component: () =>
            import('../page/purchase/newSupplierManagement')
      },
      {
        path: '/purchase/supplierManagement/editSupplierManagement/:id',
        name: 'editSupplierManagement',
        meta: {
          title: '编辑供应商',
          access: ACCESS.SUPPLIER_EDIT
        },
        component: () =>
            import('../page/purchase/newSupplierManagement')
      }
      ]
    },
    { // 订单
      path: '/order',
      name: 'order',
      meta: {
        title: '订单',
        nav: 1,
        icon: 'fa fa-file-text'
      },
      redirect: '/order/list',
      component: () =>
        import('../page/layout/Layout'),
      children: [{ // 订单列表
        path: '/order/list',
        name: 'list',
        meta: {
          title: '订单列表',
          nav: 2,
          icon: 'fa fa-list',
          access: ACCESS.ORDER_LIST,
          keep: true
        },
        component: () =>
          import('../page/order/list')
      },
      {
        path: '/order/Checkstand',
        name: 'Checkstand',
        meta: {
          title: '收银台',
          access: ACCESS.ORDERDESK,
          nav: 2,
          icon: 'fa fa-cart-plus'
        },
        component: () =>
            import('../page/sale/Checkstand')
      },
      { // 订单详情
        path: '/order/list/detail/:id',
        name: 'detail',
        meta: {
          title: '订单详情',
          access: ACCESS.ORDER_DETAIL
        },
        component: () =>
            import('../page/order/Detail')
      }
      ]
    },
    { // 库存（进销存）
      path: '/stock',
      name: 'stock',
      meta: {
        title: '库存',
        nav: 1,
        icon: 'fa el-icon-menu'
      },
      redirect: '/stock/query',
      component: () =>
        import('../page/layout/Layout'),
      children: [{
        path: '/stock/query',
        name: 'query',
        meta: {
          title: '库存查询',
          nav: 2,
          icon: 'fa el-icon-search',
          access: ACCESS.STOCK_INVENTORY_LIST,
          keep: true
        },
        component: () =>
          import('../page/stock/query')
      },
      {
        path: '/stock/flowing',
        name: 'flowing',
        meta: {
          title: '库存流水',
          nav: 2,
          icon: 'fa el-icon-tickets',
          access: ACCESS.STOCK_INVENTORY_DETAIL_LIST
        },
        component: () =>
            import('../page/stock/flowing')
      },
      {
        path: '/stock/storage',
        name: 'storage',
        meta: {
          title: '退货入库',
          nav: 2,
          icon: 'fa el-icon-sort-down',
          access: ACCESS.SELL_RETURN_LIST,
          keep: true
        },
        component: () =>
            import('../page/stock/storage')
      },
      {
        path: '/stock/storage/newStorage',
        name: 'newStorage',
        meta: {
          access: ACCESS.SELL_RETURN_ADD,
          title: '新建退货入库'
        },
        component: () =>
            import('../page/stock/newStorage')
      },
      {
        path: '/stock/storage/storageInfo/:id',
        name: 'storageInfo',
        meta: {
          access: ACCESS.SELL_RETURN_DETAIL,
          title: '退货单详情'
        },
        component: () =>
            import('../page/stock/storageInfo')
      },
      {
        path: '/stock/outgoing',
        name: 'outgoing',
        meta: {
          title: '销售出库',
          access: ACCESS.SELL_LIST,
          nav: 2,
          icon: 'fa el-icon-sort-up',
          keep: true
        },
        component: () =>
            import('../page/stock/outgoing')
      },
      {
        path: '/stock/outgoing/newOutgoing',
        name: 'newOutgoing',
        meta: {
          title: '新建出库'
        },
        component: () =>
            import('../page/stock/newOutgoing')
      },
      {
        path: '/stock/outgoing/outgoingInfo/:id/:status?',
        name: 'outgoingInfo',
        meta: {
          title: '出库单详情',
          access: ACCESS.SELL_DETAIL
        },
        component: () =>
            import('../page/stock/outgoingInfo')
      },
        // {
        //   path: '/stock/inventory',
        //   name: 'inventory',
        //   meta: {title: '库存盘点', nav: 2, icon: 'fa el-icon-tickets'},
        //   component: () => import('../page/stock/inventory'),
        // },
        // {
        //   path: '/stock/inventory/newInventory',
        //   name: 'newInventory',
        //   meta: {title: '新建盘点'},
        //   component: () => import('../page/stock/newInventory'),
        // },
        // {
        //   path: '/stock/inventory/inventoryInfo',
        //   name: 'inventoryInfo',
        //   meta: {title:  '盘点详情'},
        //   component: () => import('../page/stock/inventoryInfo'),
        // },
        // {
        //   path: '/stock/allocation',
        //   name: 'allocation',
        //   meta: {title: '库存调拨', nav: 2, icon: 'fa el-icon-sort'},
        //   component: () => import('../page/stock/allocation'),
        // },
        // {
        //   path: '/stock/allocation/newAllocation',
        //   name: 'newAllocation',
        //   meta: {title: '新建库存调拨'},
        //   component: () => import('../page/stock/newAllocation'),
        // },
        // {
        //   path: '/stock/allocation/allocationInfo',
        //   name: 'allocationInfo',
        //   meta: {title: '新建库存调拨'},
        //   component: () => import('../page/stock/allocationInfo'),
        // },
        // {
        //   path: '/stock/warning',
        //   name: 'warning',
        //   meta: {title: '库存预警', nav: 2, icon: 'fa el-icon-circle-close-outline'},
        //   component: () => import('../page/stock/warning'),
        // },
        // {
        //   path: '/stock/pricing',
        //   name: 'stockPricing',
        //   meta: {title: '成本调价', nav: 2, icon: 'fa fa-vine'},
        //   component: () => import('../page/stock/pricing'),
        // },
        // {
        //   path: '/stock/pricing/newPricing',
        //   name: 'newPricing',
        //   meta: {title: '新建成本调价'},
        //   component: () => import('../page/stock/newPricing'),
        // },
        // {
        //   path: '/stock/pricing/pricingInfo',
        //   name: 'newPricing',
        //   meta: {title: '成本调价详情'},//不确定
        //   component: () => import('../page/stock/pricingInfo'),
        // },
      {
        path: '/stock/management',
        name: 'management',
        meta: {
          title: '仓库管理',
          nav: 2,
          icon: 'fa el-icon-setting',
          access: ACCESS.WAREHOUSEA_LIST,
          keep: true
        },
        component: () =>
            import('../page/stock/management')
      },
      {
        path: '/stock/management/newWarehouse',
        name: 'newWarehouse',
        meta: {
          title: '新建仓库',
          access: ACCESS.WAREHOUSEA_ADD
        },
        component: () =>
            import('../page/stock/newWarehouse')
      },
      {
        path: '/stock/management/eitWarehouse',
        name: 'eitWarehouse',
        meta: {
          title: '编辑仓库',
          access: ACCESS.WAREHOUSEA_EDIT
        },
        component: () =>
            import('../page/stock/newWarehouse')
      },
      {
        path: '/stock/start',
        name: 'start',
        meta: {
          title: '期初库存',
          nav: 2,
          access: ACCESS.INITIAL_STOCK_LIST,
          icon: 'fa el-icon-rank',
          keep: true
        },
        component: () =>
            import('../page/stock/start')
      },
      {
        path: '/stock/start/startInfo',
        name: 'startInfo',
        meta: {
          access: ACCESS.INITIAL_STOCK_DETAIL,
          title: '期初库存单详情'
        },
        component: () =>
            import('../page/stock/startInfo')
      },
      {
        path: '/stock/start/newStart',
        name: 'newStart',
        meta: {
          title: '新建期初库存',
          icon: 'fa fa-line-chart',
          access: ACCESS.INITIAL_STOCK_ADD
        },
        component: () =>
            import('../page/stock/newStart')
      }
      ]
    },
    { // 用户
      path: '/user',
      name: 'user',
      meta: {
        title: '用户',
        nav: 1,
        icon: 'fa fa-users'
      },
      redirect: '/user/store',
      component: () =>
        import('../page/layout/Layout'),
      children: [{
        path: '/user/store',
        name: 'store',
        meta: {
          title: '用户列表',
          nav: 2,
          icon: 'fa fa-columns',
          access: ACCESS.USER_LIST,
          keep: true
        },
        component: () =>
          import('../page/user/store')
      },
      {
        path: '/user/store/detail/:id',
        name: 'store_detail',
        meta: {
          title: '用户详情',
          keep: true
        },
        component: () =>
            import('../page/user/store_detail')
      },
        // {
        //   path: '/user/list',
        //   name: 'list',
        //   meta: {
        //     title: '会员列表',
        //     nav: 2,
        //     icon: 'fa fa-user',
        //     access: ACCESS.USER_LIST
        //   },
        //   component: () =>
        //       import('../page/user/List')
        // },
      {
        path: '/user/member',
        name: 'member',
        meta: {
          title: '员工列表',
          nav: 2,
          icon: 'fa fa-vcard-o',
          access: ACCESS.MEMBER_LIST
        },
        component: () =>
            import('../page/user/Member')
      },
      {
        path: '/user/member/:id',
        name: 'member_detail',
        meta: {
          title: '员工管理',
          access: ACCESS.MEMBER_EDIT
        },
        component: () =>
            import('../page/user/user_detail')
      },
      {
        path: '/user/role',
        name: 'role',
        meta: {
          title: '角色列表',
          nav: 2,
          icon: 'fa fa-user-circle-o',
          access: ACCESS.ROLE_LIST
        },
        component: () =>
            import('../page/user/role')

      },
      {
        path: '/user/role/role_detail/:id',
        name: 'role_detail',
        meta: {
          title: '角色详情',
          access: ACCESS.ROLE_EDIT
        },
        component: () =>
            import('../page/user/role_detail')
      },
      {
        path: '/user/role/role_add',
        name: 'role_add',
        meta: {
          title: '角色添加',
          access: ACCESS.ROLE_ADD
        },
        component: () =>
            import('../page/user/role_add')
      }
        // {
        //   path: '/user/recommend',
        //   name: 'recommend',
        //   meta: {title: '用户推荐', nav: 2, icon: 'fa fa-share-alt'},
        //   component: () => import('../page/user/recommend'),
        // },
      ]
    },
    { // 营销
      path: '/sale',
      name: 'sale',
      meta: {
        title: '营销',
        nav: 1,
        icon: 'fa fa-cart-arrow-down',
        access: ACCESS.SALE
      },
      redirect: '/sale/mansong',
      component: () =>
        import('../page/layout/Layout'),
      children: [{
        path: '/sale/mansong',
        name: 'mansong',
        meta: {
          title: '满减送',
          nav: 2,
          icon: 'fa fa-pie-chart',
          access: ACCESS.SALE_MJS_LIST
        },
        component: () =>
          import('../page/sale/Mansong')
      },
      {
        path: '/sale/discount',
        name: 'discount',
        meta: {
          title: '限时折扣',
          nav: 2,
          icon: 'fa fa-cny',
          access: ACCESS.SALE_XSZK_LIST
        },
        component: () =>
            import('../page/sale/Discount')
      },
      {
        path: '/sale/colligate',
        name: 'colligate',
        meta: {
          title: '综合批发价',
          nav: 2,
          icon: 'fa fa-cny',
          access: ACCESS.SALE_ZHPFJ_LIST
        },
        component: () =>
            import('../page/sale/Colligate')
      },
      {
        path: '/sale/seckill',
        name: 'seckill',
        meta: {
          title: '限时秒杀',
          nav: 2,
          icon: 'fa fa-flash',
          access: ACCESS.SALE_XSMS_LIST
        },
        component: () =>
            import('../page/sale/Seckill')
      },
        // {
        //   path: '/sale/clientAnalyze',
        //   name: 'clientAnalyze',
        //   meta: {title: '客户分析', nav: 2, icon: 'fa fa-cny', access: ACCESS.SALE_KHFX_LIST},
        //   component: r => require.ensure([], () => r(require('../page/sale/ClientAnalyze')), 'ClientAnalyze')
        // },
      {
        path: '/sale/clientAnalyze/operate',
        meta: {
          title: '定向运营'
        },
        name: 'clientAnalyze',
        component: () =>
            import('../page/sale/operate')
      },
      {
        path: '/sale/packet',
        name: 'packet',
        meta: {
          title: '优惠券',
          access: ACCESS.COUPON_LIST,
          nav: 2,
          icon: 'fa fa-heart'
        },
        component: () =>
            import('../page/sale/Packet')
      },
      {
        path: '/sale/packet/saveupdate',
        meta: {
          title: '优惠劵发布',
          access: ACCESS.COUPON_ADD
        },
        name: 'packetsaveupdate',
        component: () =>
            import('../page/sale/PacketAddUpdate')
      },
      {
        path: '/sale/mansong/mansongsave',
        meta: {
          title: '新增满减送活动',
          access: ACCESS.SALE_MJS_ADD
        },
        name: 'mansongsave',
        component: () =>
            import('../page/sale/Mansongsave')
      },
      {
        path: '/sale/mansong/mansongedit/:id',
        name: 'mansongedit',
        meta: {
          title: '编辑满减送活动'
        },
        component: () =>
            import('../page/sale/Mansongedit')
      },
      {
        path: '/sale/discount/discountsave',
        meta: {
          title: '新增限时折扣活动',
          access: ACCESS.SALE_XSZK_ADD
        },
        name: 'discountsave',
        component: () =>
            import('../page/sale/discountsave')
      },
      {
        path: '/sale/discount/discountedit/:id',
        meta: {
          title: '编辑限时折扣活动'
        },
        name: 'discountedit',
        component: () =>
            import('../page/sale/discountedit')
      },
        // --
      {
        path: '/sale/seckill/seckillsave',
        meta: {
          title: '新增限时秒杀活动',
          access: ACCESS.SALE_XSMS_ADD
        },
        name: 'seckillsave',
        component: () =>
            import('../page/sale/seckillsave')
      },
      {
        path: '/sale/seckill/seckilledit/:id',
        meta: {
          title: '编辑限时秒杀活动'
        },
        name: 'seckilledit',
        component: () =>
            import('../page/sale/seckilledit')
      },
        // --
      {
        path: '/sale/colligate/colligatesave',
        name: 'colligatesave',
        meta: {
          title: '新增综合批发价活动',
          access: ACCESS.SALE_ZHPFJ_ADD
        },
        component: () =>
            import('../page/sale/colligatesave')
      },
      {
        path: '/sale/colligate/colligateedit/:id',
        name: 'colligateedit',
        meta: {
          title: '编辑综合批发价活动'
        },
        component: () =>
            import('../page/sale/colligateedit')
      }
      ]
    },
    { // 店铺
      path: '/shop',
      name: 'shop',
      meta: {
        title: '店铺',
        nav: 1,
        icon: 'fa fa-institution',
        access: ACCESS.SHOPDETAIL
      },
      redirect: '/shop/index',
      component: () =>
        import('../page/layout/Layout'),
      children: [{
        path: '/shop/index',
        name: 'index',
        meta: {
          title: '店铺设置',
          nav: 2,
          icon: 'fa fa-pencil-square-o',
          access: ACCESS.SHOP_EDIT
        },
        component: () =>
          import('../page/shop/Index')
      },
      {
        path: '/shop/contactWay',
        name: 'contactWay',
        meta: {
          title: '联系方式',
          nav: 2,
          icon: 'fa fa-phone',
          access: ACCESS.CONTACT_LIST
        },
        component: () => import('../page/shop/ContactWay')
      },
      {
        path: '/shop/contactWay/contactAdd',
        name: 'contactAdd',
        meta: {
          title: '添加联系方式',
          icon: 'fa fa-plus',
          access: ACCESS.CONTACT_ADD
        },
        component: () => import('../page/shop/contactAdd')
      },
        // {
        //   path: '/shop/address',
        //   name: 'address',
        //   meta: {title: '店铺地址', nav: 2, icon: 'fa fa-map-marker'},
        //   component: r => require.ensure([], () => r(require('../page/shop/Address')), 'ShopAddress')
        // },
      {
        path: '/shop/contactWay/contactEdit/:id',
        name: 'contactEdit',
        meta: {
          title: '编辑联系方式',
          access: ACCESS.CONTACT_EDIT
        },
        component: () =>
            import('../page/shop/contactEdit')
      }
      ]
    },
    { // 财务管理
      path: '/finance',
      name: 'finance',
      meta: {
        title: '财务',
        nav: 1,
        icon: 'fa fa-cny'
      },
      redirect: '/finance/receives',
      component: () =>
        import('../page/layout/Layout'),
      children: [
        {
          path: '/finance/receives',
          name: 'receives',
          meta: {
            title: '待收款订单',
            nav: 2,
            access: ACCESS.FINANCIAL_COLLECTION_BILL_LIST,
            icon: 'fa fa-list',
            keep: true
          },
          component: () =>
            import('../page/finance/receives')
        },
        {
          path: '/finance/arrears',
          name: 'arrears',
          meta: {
            title: '应收款管理',
            nav: 2,
            icon: 'fa el-icon-tickets',
            access: ACCESS.FINANCIAL_YSK_LIST,
            keep: true
          },
          component: () =>
            import('../page/finance/arrears.vue')
        },
        {
          path: '/finance/customerflow',
          name: 'customerflow',
          meta: {
            title: '财务流水',
            nav: 2,
            icon: 'fa el-icon-date',
            access: ACCESS.FINANCIAL_CWLS
          },
          component: () =>
            import('../page/finance/customerflow.vue')
        },
        {
          path: '/finance/transflow',
          name: 'transflow',
          meta: {
            title: '平台对账',
            nav: 2,
            icon: 'fa el-icon-date',
            access: ACCESS.PTDZ_LIST
          },
          component: () =>
            import('../page/finance/transflow.vue')
        },
        {
          path: '/finance/paymeny',
          name: 'paymeny',
          meta: {
            title: '店铺收款',
            nav: 2,
            icon: 'fa el-icon-edit',
            access: ACCESS.DPSK_LIST
          },
          component: () =>
            import('../page/finance/payment')
        },
        {
          path: '/finance/income',
          name: 'income',
          meta: {
            title: '平台提现',
            nav: 2,
            icon: 'fa fa-cny',
            access: ACCESS.PTTX
          },
          component: () =>
            import('../page/finance/income')
        },
        {
          path: '/finance/capitalWater',
          name: 'capitalWater',
          meta: {
            title: '资金流水',
            nav: 2,
            icon: 'fa fa-cny',
            access: ACCESS.ZJLS_LIST
          },
          component: () =>
            import('../page/finance/capitalWater')
        },
        // 提现
        {
          path: '/finance/income/withdraw',
          meta: {
            title: '提现',
            access: ACCESS.PTTX
          },
          name: 'withdraw',
          component: () =>
            import('../page/assets/withdraw')
        },
        {
          path: '/finance/income/account-list',
          meta: {
            title: '账户列表',
            access: ACCESS.PTTX_GLYHZH
          },
          name: 'account-list',
          component: () =>
            import('../page/assets/account-list')
        },
        {
          path: '/finance/income/withdrawals-save',
          meta: {
            title: '添加提现账户'
          },
          name: 'withdrawals-save',
          component: () =>
            import('../page/assets/withdrawals-save')
        },
        {
          path: '/finance/income/withdrawals-edit/:id',
          meta: {
            title: '修改提现账户'
          },
          name: 'withdrawals-edit',
          component: () =>
            import('../page/assets/withdrawals-edit')
        }
      ]
    },
    { // 报表
      path: '/assets',
      name: 'assets',
      meta: {
        title: '报表',
        nav: 1,
        icon: 'fa fa-server',
        group: {default: '常规报表', sales: '销售报表'}
      },
      redirect: '/assets/ranking',
      component: () =>
        import('../page/layout/Layout'),
      children: [
        {
          path: '/assets/ranking',
          name: 'ranking',
          meta: {
            title: '销售排行',
            nav: 2,
            icon: 'fa fa-list-ol',
            access: ACCESS.XSPH,
            groupBy: 'sales'
          },
          component: () =>
            import('../page/assets/ranking')
        },
        {
          path: '/assets/profile',
          name: 'profile',
          meta: {
            title: '数据概况',
            nav: 2,
            icon: 'fa el-icon-date',
            access: ACCESS.SJGK,
            groupBy: 'default'
          },
          component: () =>
            import('../page/profile/profile')
        },
        {
          path: '/assets/business',
          name: 'business',
          meta: {
            title: '营业统计',
            nav: 2,
            icon: 'fa el-icon-time',
            access: ACCESS.YYTJ,
            groupBy: 'default'
          },
          component: () =>
            import('../page/profile/business')
        },
        {
          path: '/assets/commodity',
          name: 'commodity',
          meta: {
            title: '商品统计',
            nav: 2,
            icon: 'fa el-icon-circle-plus-outline',
            access: ACCESS.SPTJ,
            groupBy: 'default'
          },
          component: () =>
            import('../page/profile/commodity')
        },
        {
          path: '/assets/deal',
          name: 'deal',
          meta: {
            title: '交易分析',
            nav: 2,
            icon: 'fa el-icon-star-off',
            access: ACCESS.JYFX,
            groupBy: 'default'
          },
          component: () =>
            import('../page/profile/deal')
        },
        {
          path: '/assets/member',
          name: 'member',
          meta: {
            title: '会员统计',
            nav: 2,
            icon: 'fa fa-vine',
            access: ACCESS.HYTJ,
            groupBy: 'default'
          },
          component: () =>
            import('../page/profile/member')
        },
        {
          path: '/assets/active',
          name: 'active',
          meta: {
            title: '活跃统计',
            nav: 2,
            icon: 'fa fa-line-chart',
            access: ACCESS.HYTJJ,
            groupBy: 'default'
          },
          component: () =>
            import('../page/profile/active')
        },
        {
          path: '/assets/active-order-info',
          name: 'active-order-info',
          meta: {
            title: '活动订单统计',
            nav: 2,
            // icon: 'fa fa-line-chart',
            access: ACCESS.HDDDTJ,
            groupBy: 'default'
          },
          component: () =>
            import('../page/profile/active-order-info')
        },
        {
          path: '/assets/logistics-dispatching',
          name: 'logistics-dispatching',
          meta: {
            title: '物流配送统计',
            nav: 2,
            groupBy: 'default',
            access: ACCESS.WLPSTJ
          },
          component: () =>
            import('../page/profile/logistics-dispatching')
        },
        {
          path: '/assets/sales-count',
          name: 'sales-count',
          meta: {
            title: '销售汇总',
            nav: 2,
            icon: 'fa fa-align-justify',
            access: ACCESS.XSHZ,
            groupBy: 'sales'
          },
          component: () =>
            import('../page/assets/SalesCount.vue')
        },
        {
          path: '/assets/sales-detail',
          name: 'sales-detail',
          meta: {
            title: '销售明细',
            nav: 2,
            icon: 'fa fa-list-alt',
            access: ACCESS.XSMX,
            groupBy: 'sales'
          },
          component: () =>
            import('../page/assets/SalesDetail.vue')
        },

        {
          path: '/assets/income/account-list',
          meta: {
            title: '账户列表'
          },
          name: 'account-list',
          component: () =>
            import('../page/assets/account-list')
        },
        {
          path: '/assets/income/withdrawals-save',
          meta: {
            title: '添加提现账户'
          },
          name: 'withdrawals-save',
          component: () =>
            import('../page/assets/withdrawals-save')
        },
        {
          path: '/assets/income/withdrawals-edit/:id',
          meta: {
            title: '修改提现账户'
          },
          name: 'withdrawals-edit',
          component: () =>
            import('../page/assets/withdrawals-edit')
        }
      ]
    }

  ]
},
{
  path: '/error',
  name: 'error',
  component: () =>
      import('../page/error/error'),
  children: [{
    name: '403',
    path: '/error/403',
    component: () =>
        import('../page/error/403')
  },
  {
    path: '/error/404',
    component: () =>
          import('../page/error/404')
  },
  {
    path: '/error/500',
    component: () =>
          import('../page/error/500')
  }
  ]
},
{
  path: '*',
  redirect: '/error/404'
}
]

const router = new Router({
  routes: routerConfig
})

router.beforeEach((to, from, next) => {
  if (!util.isLogin()) {
    if (to.path === '/login') {
      next()
    } else {
      next({
        path: '/login',
        replace: true
      })
    }
  } else {
    if (to.path === '/login') {
      next({
        path: '/',
        replace: true
      })
    } else {
      // 判断权限
      if (util.checkRouterAccess(to)) {
        next()
      } else {
        if (from.name === 'login' || from.name === '403') {
          const canUseNavs = routerConfig[0].children.filter(item => {
            const {children = []} = item
            if (item.meta.nav && util.checkRouterAccess(item)) {
              return children.filter(ii => ii.meta.nav && util.checkRouterAccess(ii)).length
            }
          })
          const nav = canUseNavs[0] || {}
          next({
            path: nav.path,
            replace: true
          })
          return
        }
        // 处理第一个没权限 可以成功跳转第二个
        const redirectedFrom = to.redirectedFrom
        console.log(redirectedFrom)
        const oneNav = routerConfig[0].children.find(item => item.path === redirectedFrom)
        if (oneNav) {
          const children = oneNav.children.filter(item => item.meta.nav == 2)
          const goNav = children.find(item => util.checkRouterAccess(item))
          if (goNav) {
            return next({
              path: goNav.path,
              replace: true
            })
          }
        }
        next({
          path: '/error/403',
          replace: true
        })
      }
    }
  }
})

export {
  routerConfig
}

export default router
