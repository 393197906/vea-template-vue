import {
  get,
  post,
  del,
  put,
  upload
} from '@/util/fetch'

const getBaseUrlForlogin = () => _BASE_URL_FOR_LOGIN_
export const getBaseUrlForDefault = () => _BASE_URL_FOR_DEFAULT_
const getBaseUrlForShop = () => _BASE_URL_FOR_SHOP_
const getBaseUrlForStock = () => _BASE_URL_FOR_STOCK_
const getBaseUrlForFinance = () => _BASE_URL_FOR_FINANCE_

export default {
  /**
   * 首页数据
   * @param params
   * @returns {*}
   */
  getWelcomeData (params) {
    return get(`${getBaseUrlForDefault()}/shopmanager/home/data/list`, params)
  },
  // 首页报表数据
  getWelcomeStatistics (params) {
    return get(`${getBaseUrlForDefault()}/shopmanager/home/data/statistics`, params)
  },
  // 首页交易提示数据
  getWelcomeTrading (params) {
    return get(`${getBaseUrlForDefault()}/shopmanager/home/data/trading/tips`, params)
  },
  // 首页订单导出
  getWelcomeOrderExport (params) {
    return get(`${getBaseUrlForDefault()}/shopmanager/home/data/order`, params)
  },
  // 获取地区列表接口
  zone: {
    // 获取省份列表
    // options_province() {
    //   return get(`${getBaseUrlForShop()}/baseinfo/area/province`)
    // },
    // // 通过省份id 获取其下城市列表
    // options_city(province_id) {
    //   return get(`${getBaseUrlForShop()}/baseinfo/area/city/` + province_id)
    // },
    // // 通过城市id 获取其下区域列表
    // options_district(city_id) {
    //   return get(`${getBaseUrlForShop()}/baseinfo/area/district/` + city_id)
    // },
    // 获取省份列表
    options_province () {
      return get(`${getBaseUrlForShop()}/baseinfo/area/newprovince`)
    },
    // 通过省份id 获取其下城市列表
    options_city (province_id) {
      return get(`${getBaseUrlForShop()}/baseinfo/area/newcity/` + province_id)
    },
    // 通过城市id 获取其下区域列表
    options_district (city_id) {
      return get(`${getBaseUrlForShop()}/baseinfo/area/newdistrict/` + city_id)
    }
  },
  //  ~(=^.^=)~ 门店
  store: {
    // 门店订单列表
    store_info_list (id, params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/store/info/list/` + id, params)
    },
    // 门店员工列表
    store_person_list (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/store/person/list`, params)
    },

    //  门店列表
    store_list (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/store/manage/list`, params)
    },
    //  门店详情
    store_detail (id) {
      return get(`${getBaseUrlForDefault()}/shopmanager/store/manage/detail/` + id)
    },
    //  添加门店
    store_add () {
      return post(`${getBaseUrlForDefault()}/shopmanger/store/price/add`)
    },
    // 门店添加价格类型
    add_store (params) {
      return post(`${getBaseUrlForDefault()}/shopmanager/store/price/store`, params)
    },
    // 价格体系列表
    list (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/store/list`, params)
    }
  },

  // 会员与员工
  member: {
    // 客户列表接口
    attention (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/shop/member`, params)
    },
    // 员工列表接口
    staff_list (params) {
      return get(`${getBaseUrlForShop()}/baseinfo/staff/list`, params)
    },
    //  员工修改
    staffEdit (id, params) {
      return put(`${getBaseUrlForDefault()}/shopmanager/user/change/name/${id}`, params)
    },
    // 管理员详情
    user_detail (id) {
      return get(`${getBaseUrlForShop()}/baseinfo/users/shop/detail/` + id)
    },
    // 管理绑定角色
    user_bind (params) {
      return post(`${getBaseUrlForShop()}/baseinfo/users/shop/store`, params)
    },
    // 禁用启用员工
    dis_en_staff (id, params) {
      return put(`${getBaseUrlForShop()}/baseinfo/staff/${id}`, params)
    },
    // 店铺员工添解除绑定
    remove_staff (id) {
      return del(`${getBaseUrlForShop()}/baseinfo/staff/${id}`)
    },
    // 店铺员工添加并绑定
    add_staff (params) {
      return post(`${getBaseUrlForShop()}/baseinfo/staff/store`, params)
    },
    // 店铺查询会员接口
    search (phone) {
      return get(`${getBaseUrlForShop()}/baseinfo/user/search/${phone}`)
    },
    // 角色列表
    roleList (params) {
      return get(`${getBaseUrlForShop()}/baseinfo/shop/role/list`, params)
    },
    // 角色添加
    roleAdd (params) {
      return post(`${getBaseUrlForShop()}/baseinfo/shop/role/store`, params)
    },
    // 角色编辑
    roleEdit (params) {
      return put(`${getBaseUrlForShop()}/baseinfo/shop/role/` + params.id, params)
    },
    // 角色详情
    roleDetail (params) {
      return get(`${getBaseUrlForShop()}/baseinfo/shop/role/` + params.id, params)
    },
    // 角色删除
    roleDelete (params) {
      return del(`${getBaseUrlForShop()}/baseinfo/shop/role/` + params.id, params)
    },
    // 角色选择节点列表
    roleNode (params) {
      return get(`${getBaseUrlForShop()}/baseinfo/node`, params)
    }
  },
  // 用户推荐
  user_recommend: {
    // 客户列表接口
    list (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/referrer/list`, params)
    }
  },
  // 库存
  stock: {
    // 库存查询标题数据
    stockTitleData () {
      return post(`${getBaseUrlForStock()}/Purchase/Inventory/getTotalCostMoney`)
    },
    // 销售报表
    orderGoodsStatistics (params) {
      return post(`${getBaseUrlForStock()}/Statistics/Statistics/orderGoodsStatistics`, params)
    },
    // 新增仓库
    addWarehouse (params) {
      return post(`${getBaseUrlForStock()}/Purchase/StockManage/addWarehouse`, params)
    },
    // 编辑仓库
    editWarehouse (params) {
      return post(`${getBaseUrlForStock()}/Purchase/StockManage/editWarehouse`, params)
    },
    // 仓库列表
    getAllWarehouse (params) {
      return post(`${getBaseUrlForStock()}/Purchase/StockManage/getAllWarehouse`, params)
    },
    // 仓库详情
    getWarehouseInfo (params) {
      return post(`${getBaseUrlForStock()}/Purchase/StockManage/getWarehouseInfo`, params)
    },
    // 仓库启用或禁用
    updateWarehouseStatus (params) {
      return post(`${getBaseUrlForStock()}/Purchase/StockManage/updateWarehouseStatus`, params)
    },
    // 获取所有仓库
    getAllWarehouseName (params) {
      return post(`${getBaseUrlForStock()}/Purchase/StockManage/getAllWarehouseName`, params)
    }
  },
  /** 期初库存 */
  beginStock: {
    // 添加初期库存
    addBeginStock (params) {
      return post(`${getBaseUrlForStock()}/BeginStock/BeginStock/addBeginStock`, params)
    },
    // 修改初期库存
    editBeginStock (params) {
      return post(`${getBaseUrlForStock()}/BeginStock/BeginStock/editBeginStock`, params)
    },
    // 获取初期库存详情
    getBeginStock (params) {
      return post(`${getBaseUrlForStock()}/BeginStock/BeginStock/getBeginStock`, params)
    },
    // 获取初期库存列表
    getAllBeginStock (params) {
      return post(`${getBaseUrlForStock()}/BeginStock/BeginStock/getAllBeginStock`, params)
    },
    // 删除初期库存
    delBeginStock (params) {
      return post(`${getBaseUrlForStock()}/BeginStock/BeginStock/delBeginStock`, params)
    }
  },
  /** 库存查询 */
  searchStock: {
    getAllInventory (params) {
      return post(`${getBaseUrlForStock()}/Purchase/Inventory/getAllInventory`, params)
    }
  },

  /** 文件导出 */
  exportFile: {
    export (params) {
      return post(`${getBaseUrlForStock()}/Purchase/Export/export`, params)
    }
  },

  /** 新商品列表 */
  newGoods: {
    // 获取商品列表
    getAllGoods (params) {
      return post(`${getBaseUrlForStock()}/Goods/Goods/getAllGoods`, params)
    }
  },
  // 销售出库
  outgoing: {
    // 新建销售出库单
    addSell (params) {
      return post(`${getBaseUrlForStock()}/Sell/SellManage/addSell`, params)
    },
    // 获取销售出库单列表
    getAllSell (params) {
      return post(`${getBaseUrlForStock()}/Sell/SellManage/searchSheet`, params)
    },
    // 获取销售出库单详情
    getSell (params) {
      return post(`${getBaseUrlForStock()}/Sell/SellManage/getSell`, params)
    },
    // 商品出库(未出库更改为已出库)
    editSellStatus (params) {
      return post(`${getBaseUrlForStock()}/Sell/SellManage/editSellStatus`, params)
    }
  },
  // 采购
  purchase: {
    // 获取所有操作人列表
    getAllOperator (params) {
      return post(`${getBaseUrlForStock()}/common/common/getAllOperator`, params)
    },
    // 添加供应商
    addSupplier (params) {
      return post(`${getBaseUrlForStock()}/Supplier/SupplierManage/addSupplier`, params)
    },
    // 获取供应商列表
    getAllSupplier (params) {
      return post(`${getBaseUrlForStock()}/Supplier/SupplierManage/getAllSupplier`, params)
    },
    // 获取供应商详情
    getSupplier (params) {
      return post(`${getBaseUrlForStock()}/Supplier/SupplierManage/getSupplier`, params)
    },
    // 获取供应商详情
    editSupplier (params) {
      return post(`${getBaseUrlForStock()}/Supplier/SupplierManage/editSupplier`, params)
    },
    // 删除供应商
    delSupplier (params) {
      return post(`${getBaseUrlForStock()}/Supplier/SupplierManage/delSupplier`, params)
    },
    // 获取所有供应商
    getAllSupplierData (params) {
      return post(`${getBaseUrlForStock()}/Supplier/SupplierManage/getAllSupplierData`, params)
    },
    // 新增采购入库
    addPurchaseSheet (params) {
      return post(`${getBaseUrlForStock()}/Purchase/PurchaseSheet/addPurchaseSheet`, params)
    },
    // 获取采购入库单详情
    getPurchaseSheetInfo (params) {
      return post(`${getBaseUrlForStock()}/Purchase/PurchaseSheet/getPurchaseSheetInfo`, params)
    },
    // 采退出库单详情
    getPurchaseReturnInfo (params) {
      return post(`${getBaseUrlForStock()}/Purchase/PurchaseReturn/getPurchaseReturnInfo`, params)
    },
    // 新增采购退货出库单
    addPurchaseReturn (params) {
      return post(`${getBaseUrlForStock()}/Purchase/PurchaseReturn/addPurchaseReturn`, params)
    },
    // 获取采购退货出库单列表
    getAllPurchaseReturn (params) {
      return post(`${getBaseUrlForStock()}/Purchase/PurchaseReturn/searchSheet`, params)
    },
    // 获取退货出库单列表
    getAllPurchaseSheet (params) {
      return post(`${getBaseUrlForStock()}/Purchase/PurchaseSheet/searchSheet`, params)
    },
    // 新怎退货入库单
    getAddSellReturn (params) {
      return post(`${getBaseUrlForStock()}/SellReturn/SellReturn/addSellReturn`, params)
    },
    // 获取退货列表
    getAllReturn (params) {
      return post(`${getBaseUrlForStock()}/SellReturn/SellReturn/searchSheet`, params)
    },
    // 获取退货详情
    getSellReturn (params) {
      return post(`${getBaseUrlForStock()}/SellReturn/SellReturn/getSellReturn`, params)
    }

  },
  sheetDetail: {
    // 库存流水
    getAllSheetDetail (params) {
      return post(`${getBaseUrlForStock()}/Purchase/SheetDetail/getAllSheetDetail`, params)
    },
    // 库存流水检索
    searchSheet (params) {
      return post(`${getBaseUrlForStock()}/Purchase/SheetDetail/searchSheet`, params)
    }
  },
  // 登录
  login (params) {
    return post(`${getBaseUrlForlogin()}/login`, {
      ...params,
      sys_mark: 'bbc'
    })
  },
  // 修改密码
  changePassWord (params) {
    return post(`${getBaseUrlForlogin()}/user/change/password`, params)
  },
  // 图片上传
  upload_img (params) {
    return upload(`${getBaseUrlForDefault()}/shopmanager/upload_cos`, params)
  },
  // 图片上传(商品)
  upload_img_goods (params) {
    return upload(`${getBaseUrlForDefault()}/shopmanager/upload_cos/goods`, params)
  },
  // 最新订单时间
  orderNewTime () {
    return get(`${getBaseUrlForDefault()}/shopmanager/stores/ordernewtime`, {}, false)
  },
  // 获取省列表
  getProvince (params) {
    return get(`${getBaseUrlForShop()}/baseinfo/area/newprovince`, params)
  },
  // 获取市列表
  getCity (params) {
    return get(`${getBaseUrlForShop()}/baseinfo/area/newcity/` + params.id, params)
  },
  // 获取区列表
  getDistrict (params) {
    return get(`${getBaseUrlForShop()}/baseinfo/area/newdistrict/` + params.id, params)
  },

  // 获取个人信息
  getSideInfo () {
    return get(`${getBaseUrlForDefault()}/shopmanager/stores/sideInfo`)
  },

  // 商城订单接口
  shopOrder: {
    // 订单管理接口
    ordermanager: {
      // 订单列表
      list (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/order/list`, params)
      },
      // 订单新增商品
      orderAddGoods (params) {
        return post(`${getBaseUrlForDefault()}/shopmanager/order/update_order`, params)
      },
      // 订单编辑商品
      orderUpdateGoods (id, params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/order/update_order/` + id, params)
      },
      // 订单移除商品
      orderRemoveGoods (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/order/remove/goodsOrder`, params)
      },
      //  订单打印
      orderPrint (id) {
        return put(`${getBaseUrlForDefault()}/shopmanager/order/print/` + id)
      },

      // 删除订单
      orderDelete (params) {
        return del(`${getBaseUrlForDefault()}/shopmanager/order/delete/` + params.id, {
          ...params,
          info: false
        })
      },

      // 订单详情
      orderDetail (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/order/detail/` + params.id, params)
      },
      // 修改订单价格
      orderPriceChange (id, params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/order/money/` + id, params)
      },
      // 订单操作日志
      orderLog (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/order/recording/1`, params)
      },

      // 订单备注更新
      orderNoteUpdate (params) {
        return post(`${getBaseUrlForDefault()}/shopmanager/order/remark/` + params.id, params)
      },

      // 修改订单收货和收款状态
      orderConfirmRecipe (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/order/change_status/` + params.id, params)
      },

      // 更新用户收货地址

      orderReciverAddress (id, params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/order/address/` + id, params)
      },

      // 获取用户收获地址列表
      getUserAddressList (id) {
        return get(`${getBaseUrlForDefault()}/shopmanager/order/address/list/` + id)
      },

      // 发货清单详情
      orderShipDetail (id) {
        return get(`${getBaseUrlForDefault()}/shopmanager/order/ship/` + id)
      },

      // 提交发货信息
      orderShipSure (params) {
        return post(`${getBaseUrlForDefault()}/shopmanager/order/ship/` + params.id, params)
      },

      // 物流完成 确认订单信息
      orderShipDone (params) {
        return post(`${getBaseUrlForDefault()}/shopmanager/order/change/status` + params.id, params)
      },

      // 商城售后订单列表
      returnList (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/return/list`, params)
      },

      // 商家拒绝退款
      refuseRefund (params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/return/refuserefund/` + params.id, params)
      },

      // 商家确认退款
      comfirmRefund (params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/return/confirmrefund/` + params.id, params)
      },

      // 商家拒绝收货
      confirmrefuse (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/return/confirmrefuse/` + params.id, params)
      },

      // 商家取消订单
      cancelOrder (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/order/cancel/` + params.id, params)
      },

      // 商家确认收货
      confirmreceipt (params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/return/confirmreceipt/` + params.id, params)
      },

      // 审核状态变更
      checkstatus (params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/return/checkstatus/` + params.id, params)
      },

      // 更新备注信息
      remark (params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/return/remark/` + params.id, params)
      },

      // 售后订单详情id获取
      returnDetail (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/return/refund/detail/` + params.id, params)
      }
    }
  },

  // 营销接口
  shopmanager: {
    // 限时折扣
    discount: {
      list (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/discount/list`, params)
      },
      discountAdd (params) {
        return post(`${getBaseUrlForDefault()}/shopmanager/discount/store`, params)
      },
      discountDetail (id) {
        return get(`${getBaseUrlForDefault()}/shopmanager/discount/detail/` + id)
      },
      discountDel (id) {
        return del(`${getBaseUrlForDefault()}/shopmanager/discount/` + id)
      },
      discountStatus (id, params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/discount/statusmanager/` + id, params)
      },
      discountEdit (id, params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/discount/update/` + id, params)
      }
    },
    // 限时折扣
    seckill: {
      list (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/seckill/list`, params)
      },
      discountAdd (params) {
        return post(`${getBaseUrlForDefault()}/shopmanager/seckill/store`, params)
      },
      discountDetail (id) {
        return get(`${getBaseUrlForDefault()}/shopmanager/seckill/detail/` + id)
      },
      discountDel (id) {
        return del(`${getBaseUrlForDefault()}/shopmanager/seckill/` + id)
      },
      discountStatus (id, params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/seckill/statusmanager/` + id, params)
      },
      discountEdit (id, params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/seckill/update/` + id, params)
      }
    },
    // 满减管理接口
    fullReduction: {
      // 满减列表
      list (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/fullreduction/list`, params)
      },

      // 满减删除
      fullreductionDelete (params) {
        return del(`${getBaseUrlForDefault()}/shopmanager/fullreduction/` + params.id)
      },
      // 满减状态修改
      fullreductionStatus (id, params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/fullreduction/statusmanager/` + id, params)
      },
      // 满减活动修改
      fullreductionEdit (id, params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/fullreduction/update/` + id, params)
      },
      /// 满减活动添加
      fullreductionAdd (params) {
        return post(`${getBaseUrlForDefault()}/shopmanager/fullreduction/store`, params)
      },

      // 满减详情
      fullreductionDetail (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/fullreduction/detail/` + params.id)
      }
    },
    colligate: {
      // 综合列表
      list (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/wholesaleprice/list`, params)
      },
      // 综合删除
      colligateDelete (params) {
        return del(`${getBaseUrlForDefault()}/shopmanager/wholesaleprice/` + params.id)
      },
      // 综合详情
      colligateDetail (id) {
        return get(`${getBaseUrlForDefault()}/shopmanager/wholesaleprice/detail/` + id)
      },
      // 综合添加
      colligateAdd (params) {
        return post(`${getBaseUrlForDefault()}/shopmanager/wholesaleprice/store`, params)
      },
      // 综合状态修改
      colligateStatus (id, params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/wholesaleprice/statusmanager/` + id, params)
      },
      // 综合修改
      colligateEdit (id, params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/wholesaleprice/update/` + id, params)
      }

    },
    // 轮播
    carousel: {
      list () {
        return get(`${getBaseUrlForDefault()}/shopmanager/carousel/list`)
      },
      detail (id) {
        return get(`${getBaseUrlForDefault()}/shopmanager/carousel/detail/` + id)
      },
      update (id, params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/carousel/update/` + id, params)
      },
      del (id) {
        return del(`${getBaseUrlForDefault()}/shopmanager/carousel/` + id)
      },
      store (params) { // 新增
        return post(`${getBaseUrlForDefault()}/shopmanager/carousel/store`, params)
      }
    },
    // 优惠劵
    packet: {
      // 优惠劵列表
      list (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/coupons/list`, params)
      },
      // 优惠劵详情
      detail (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/coupons/detail/` + params.id)
      },
      // 优惠劵添加
      add (params) {
        return post(`${getBaseUrlForDefault()}/shopmanager/coupons/add`, params)
      },
      // 作废选中的优惠劵
      cancle (params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/coupons/update/` + params.id, params.data)
      },
      // 删除选中的优惠劵
      delete (id) {
        return del(`${getBaseUrlForDefault()}/shopmanager/coupons/delete/` + id)
      },
      // 查看已发放的优惠劵
      send (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/coupons/users`, params)
      },
      // 一键清空
      clear (params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/coupons/clean`, params)
      },
      // 派发优惠劵
      distribute (params) {
        return post(`${getBaseUrlForDefault()}/shopmanager/coupons/distribute/` + params.id, {})
      }
    },
    // 收银台
    checkstand: {
      // 待选商品列表
      goodlist (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/goods/list`, params)
      },

      // 商品详细sku信息
      goodsku (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/goods/item/detail/` + params.id, params)
      },

      // 创建订单
      createorder (params) {
        return post(`${getBaseUrlForDefault()}/shopmanager/order/create`, params)
      },

      // 验证商品数量
      checkgoodnum (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/goods/check`, params)
      },
      // 获取客户地址选项
      getAddress (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/order/adrList`, params)
      }
    }
  },

  //  商城接口
  shop: {
    index: {
      info () {
        return get(`${getBaseUrlForDefault()}/shopmanager/stores/index`)
      },
      pointInfo (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/stores/indexinfoorder`, params)
      },
      // 店铺经营区域
      region (params) {
        return get(`${getBaseUrlForShop()}/baseinfo/shop/region`, params)
      }
    },
    StoresManager: {
      detail () {
        return get(`${getBaseUrlForDefault()}/shopmanager/stores/manager`)
      },
      update (params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/stores/manager`, params)
      }
    },
    // 店铺
    point: {
      list () {
        return get(`${getBaseUrlForShop()}/baseinfo/point/list`)
      },
      detail (id) {
        return get(`${getBaseUrlForShop()}/baseinfo/point/detail/` + id)
      },
      update (id, params) {
        return put(`${getBaseUrlForShop()}/baseinfo/point/` + id, params)
      },
      del (id) {
        return del(`${getBaseUrlForShop()}/baseinfo/point/` + id)
      },
      store (params) {
        return post(`${getBaseUrlForShop()}/baseinfo/point/store`, params)
      },
      // 店铺默认地址设置
      defaultAddress (id, params) {
        return put(`${getBaseUrlForShop()}/baseinfo/point/default/address/` + id, params)
      }
    }
  },

  // 资产接口
  assets: {
    // 店铺账户查询接口
    detail () {
      return get(`${getBaseUrlForShop()}/baseinfo/funds/detail`)
    },
    // 提现申请接口
    drawapply (params) {
      return post(`${getBaseUrlForShop()}/baseinfo/funds/drawapply`, params)
    },
    // 店铺提现记录列表接口
    drawlist (params) {
      return get(`${getBaseUrlForShop()}/baseinfo/funds/drawlist`, params)
    },
    // 银行账户列表
    accountlist (params) {
      return get(`${getBaseUrlForShop()}/baseinfo/bank/account/list`, params)
    },
    // 添加提现账户
    accountsave (params) {
      return post(`${getBaseUrlForShop()}/baseinfo/bank/account/store`, params)
    },
    // 获取银行账户详情
    accountdetail (id) {
      return get(`${getBaseUrlForShop()}/baseinfo/bank/account/detail/` + id)
    },
    // 修改银行账户
    accountupdata (id, params) {
      return put(`${getBaseUrlForShop()}/baseinfo/bank/account/` + id, params)
    },
    // 删除银行账户信息
    accountdel (id) {
      return del(`${getBaseUrlForShop()}/baseinfo/bank/account/` + id)
    },

    // 销售排行
    rankinglist (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/goods/sales/list`, params)
    }
  },

  // 商品接口
  goods: {
    add (params) {
      return post(`${getBaseUrlForDefault()}/shopmanager/goods/item/store`, params)
    },
    /** 商品公共使用接口 */
    goods_common_api: {
      /** 商品修改页面（针对单个规格编辑） */
      goodsEditSku (id, params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/goods/item/` + id, params)
      },
      /** 商品类型 */
      attribute () {
        return get(`${getBaseUrlForDefault()}/shopmanager/goods/attribute/list`)
      },
      /** 商品分类 */
      category () {
        return get(`${getBaseUrlForDefault()}/shopmanager/goods/category/list`)
      },
      /** 商品删除 */

      goodDel (id) {
        return del(`${getBaseUrlForDefault()}/shopmanager/goods/item/` + id)
      },
      /** 商品上下架 */
      goodState (params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/goods/tag/` + params.statu, params)
      },
      // 调用平台商品分类接口（与平台接口使用一个参数）
      category_list () {
        return get(`${getBaseUrlForDefault()}/shopmanager/goods/category/list`)
      },
      // 品牌列表
      brand_list (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/brand/list`, params)
      },
      // 商品类型列表接口
      attr_list () {
        return get(`${getBaseUrlForDefault()}/shopmanager/goods/attribute/list`)
      },
      /** 商品列表 */
      goodsList (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/goods/item/list`, params)
      },
      /** spu商品列表 */
      skugoodsList (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/goods/item/list`, params)
      },
      /** sku商品列表 */
      skusgoodsList (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/goods/activity/list`, params)
      },
      // erp商品编码列表调用
      erp_goods_list (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/goods/sku/list`, params)
      },
      // 商品编码选中后页面中调用的单条数据
      get_erp_goods (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/goods/skuerp/list`, params)
      },
      // 商品类型调用标准商品规格接口
      get_default_attr_detail_list (id) {
        return get(`${getBaseUrlForDefault()}/shopmanager/goods/attribute/detail/` + id)
      },

      // 商品编辑页面
      goods_edit_detail (id) {
        return get(`${getBaseUrlForDefault()}/shopmanager/goods/item/` + id)
      }

    },

    /** 价格体系 */
    pricing: {
      pricing_list (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/pricing/list`, params)
      },
      // 价格体系 for add goods
      pricing_list_for_goods (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/pricing/check`, params)
      },
      pricing_add (params) {
        return post(`${getBaseUrlForDefault()}/shopmanager/pricing/add`, params)
      },
      pricing_edit (id, params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/pricing/update/${id}`, params)
      },
      pricing_detail (id = 0) {
        return get(`${getBaseUrlForDefault()}/shopmanager/pricing/detail/${id}`)
      },
      setDefault (id = 0) {
        return get(`${getBaseUrlForDefault()}/shopmanager/pricing/default/${id}`)
      },
      canUseStoreList (params) { // 可用门店列表
        return get(`${getBaseUrlForDefault()}/shopmanager/store/list`, params)
      }
    },

    /** 商品规格 */
    goods_sku: {
      item_list (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/goods/item/list`, params)
      },
      list (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/goods/spec/list`, params)
      },
      sku_add (params) {
        return post(`${getBaseUrlForDefault()}/shopmanager/goods/spec/store`, params)
      },
      sku_edit (id, params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/goods/spec/` + id, params)
      },
      sku_detail (id) {
        return get(`${getBaseUrlForDefault()}/shopmanager/goods/spec/detail/` + id)
      },
      sku_del (id) {
        return del(`${getBaseUrlForDefault()}/shopmanager/goods/spec/` + id)
      }
    },
    /** 商品评价 */
    goods_comment: {
      list (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/goods/comment/list`, params)
      },
      comment_del (id) {
        return del(`${getBaseUrlForDefault()}/shopmanager/goods/comment/detail/` + id)
      }
    },
    /** 价格表 */
    price_form: {
      list (params) {
        return get(`${getBaseUrlForDefault()}/shopmanager/goods/price/list`, params)
      },
      update (params) {
        return put(`${getBaseUrlForDefault()}/shopmanager/goods/price/edit`, params)
      }
    }

  },
  // 渠道接口
  channel: {
    // 门店价格添加类型
    // 获取可用渠道列表
    canUseChannelList (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/pricing/channel`, params)
    },
    list (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/channeltype/list`, params)
    }
  },

  /** 财务报表 */
  report: {
    // 物流订单统计
    activeLogistics (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/order/active/logistics`, params)
    },
    //  活动订单统计
    activeOrderInfo (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/order/active/statistics`, params)
    },
    // 月活日活统计
    active (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/data/monitoring/list`, params)
    },
    // 交易分析概况
    analysis (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/stat/deal/analysis`, params)
    },
    // 交易概况趋势图
    analysis_trend (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/stat/deal/analysis/trend`, params)
    },
    // 交易分析销售统计
    analysis_sales (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/stat/deal/sales`, params)
    },
    // 交易分析销售统计下单量
    analysis_order (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/stat/deal/order/num`, params)
    },
    // 交易分析销售统计下单金额
    analysis_money (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/stat/deal/order/money`, params)
    },
    //  数据概况概况
    list (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/stat/data/profile`, params)
    },
    //  数据趋势图
    general_tendency (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/stat/data/profile/trend`, params)
    },
    //  商品统计概况
    commodity_list (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/stat/goods/profile`, params)
    },
    //  商品趋势图
    commodity_trend (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/stat/goods/profile/trend`, params)
    },
    //  商品销量排行
    commodity_sales (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/stat/goods/sale/rank`, params)
    },
    //  类目分析下单金额排行
    commodity_category (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/stat/goods/category/histogram`, params)
    },
    //  营业统计
    business_data (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/stat/bussiness`, params)
    },
    // 会员统计
    user_analysis (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/stat/user/analysis`, params)
    },
    // 会员统计 - 柱状图信息分析
    user_trend (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/stat/user/trend`, params)
    },
    // 会员销售排行
    user_rank (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/stat/user/sales/rank`, params)
    },

    // 打款记录
    gather_list (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/shop/gather/list`, params)
    },
    // 打款记录
    gather_list_export (params) {
      return get(`${getBaseUrlForDefault()}/shopmanager/shop/gather/list/export`, params)
    },
    //  资金流水
    getCapitalWater (params) {
      return get(`${getBaseUrlForFinance()}/capital/shop/offline/capitalFlow`, params)
    }
  },

  // 财务管理
  financemanager: {
    // 供应商管理财务转账
    financial_pay (params) {
      return post(`${getBaseUrlForFinance()}/capital/shop/purchase/evidence/diff`, params)
    },
    // 采购退货资金流水
    purchaseEvidenceList (params) {
      return get(`${getBaseUrlForFinance()}/capital/shop/purchase/evidence/list`, params)
    },
    // 财务流水
    flowList (params) {
      return get(`${getBaseUrlForFinance()}/capital/shop/offline/evidence/list`, params)
    },
    // 平台流水
    transList (params) {
      return get(`${getBaseUrlForFinance()}/capital/shop/evidence/shop/list`, params)
    },
    // 待收款
    receiveList (params) {
      return get(`${getBaseUrlForFinance()}/capital/shop/offline/penddingCollection`, params)
    },
    // 确认收款
    comReceive (params) {
      return post(`${getBaseUrlForFinance()}/capital/shop/offline/collection`, params)
    },
    // 转入欠款
    intoArrear (id) {
      return get(`${getBaseUrlForFinance()}/capital/shop/offline/arrear/` + id)
    },
    // 欠款
    arrearList (params) {
      return get(`${getBaseUrlForFinance()}/capital/shop/offline/arrear/list`, params)
    },
    // 确认收款
    comArrear (params) {
      return post(`${getBaseUrlForFinance()}/capital/shop/offline/arrear/gathering`, params)
    }

  }

}
