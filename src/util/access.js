// 首页
export const INDEX = 'index'

// 订单
export const ORDER_LIST = 'orderlist' // 订单列表
export const ORDER_OUT_BILL = 'orderoutbill' // 生成出库单
export const ORDER_DETAIL = 'orderdetail' // 订单详情
export const ORDER_NOTE_ADD = 'ordernoteadd' // 添加备注
export const ORDER_ADDRESS_CHANGE = 'orderdresschange' // 修改地址
export const ORDER_PRICE_CHANGE = 'orderpricechange' // 修改价格
export const ORDER_PRINT = 'orderprint' // 打印订单
export const ORDER_CANCEL = 'ordercancel' // 取消订单
export const ORDER_GOODS_ADD = 'ordergoodsadd' // 添加商品
export const ORDER_GOODS_EDIT = 'ordergoodsedit' // 编辑商品
export const ORDER_GOODS_REMOVE = 'ordergoodsdelete' // 删除商品
export const ORDER_COMMIT = 'ordercommit' // 确认收货

export const ORDER_EDIT = 'orderedit' // ？？
export const ORDER_DELETE = undefined // ？？

// 收银台
export const ORDERDESK = 'orderdesk' // 收银台
export const ORDERDESK_CREATE = 'ordercreate' // 收银台结算

// 商品
export const GOODS = 'goods'
export const GOODS_LIST = 'goodslist'
export const GOODS_ADD = 'goodsadd'
export const GOODS_EDIT = 'ordergoodsedit'
export const GOODS_DELETE = 'goodsdelete'
export const GOODS_SHELF = 'goodsshelf' // 上下架
export const GOODS_RECOMMEND = 'goodsrecommend' // 推荐

// 商品规格
export const SKU_EDIT = 'specificationedit'
export const SKU_ADD = 'specificationadd'
export const SKU_LIST = 'specificationlist'

// 商品评价
export const GOODS_COMMENT_DELETE = 'evaluationdelete'
export const GOODS_COMMENT_LIST = 'evaluationlist' // 商品评价列表
// 价格体系
export const PRICE_SYSTEM_LIST = 'pricesystemlist' // 价格体系列表
export const PRICE_SYSTEM_EDIT = 'pricesystemedit' // 价格体系编辑
export const PRICE_SYSTEM_SET_DEFAULT = 'pricesystemdefault' // 设为默认"
export const PRICE_SYSTEM_ADD = 'pricesystemadd' // 添加价格体系"

// 价格表
export const PRICE_FORM_LIST = 'pricesystemlist' // 价格表列表"
export const PRICE_FORM_EDIT = 'pricesystemedit' // 价格表baocun"

// 营销
export const SALE = 'marketing'
// 满减送
export const SALE_MJS_DELETE = 'mansongdelete'
export const SALE_MJS_ADD = 'mansongadd'
export const SALE_MJS_LIST = 'mansonglist'
export const SALE_MJS_CLOSE = 'mansongclose'

// 限时折扣
export const SALE_XSZK = 'discount'
export const SALE_XSZK_DELETE = 'discountdelete'
export const SALE_XSZK_ADD = 'discountadd'
export const SALE_XSZK_CLOSE = 'discountclose'
export const SALE_XSZK_LIST = 'discountlist'

// 综合批发价
export const SALE_ZHPFJ_CLOSE = 'salezhpfjclose'
export const SALE_ZHPFJ_DELETE = 'salezhpfjdelete'
export const SALE_ZHPFJ_ADD = 'salezhpfjadd'
export const SALE_ZHPFJ_DETAIL = 'salezhpfjdetail'
export const SALE_ZHPFJ_LIST = 'salezhpfjlist'

// //限时秒杀
export const SALE_XSMS_CLOSE = 'salexsmsclose'
export const SALE_XSMS_DELETE = 'salexsmsdelete'
export const SALE_XSMS_ADD = 'salexsmsadd'
export const SALE_XSMS_DETAIL = 'salexsmsdetail'
export const SALE_XSMS_LIST = 'salexsmslist'
// 优惠券
export const COUPON_ADD = 'couponadd'
export const COUPON_LIST = 'couponlist'
export const COUPON_STORE_ADD = 'couponstorelist' // 已发放门店优惠券列表

// //店铺
export const SHOPDETAIL = 'shopdetail'
export const SHOP_EDIT = 'shopedit'
export const SHOP_DETAIL = 'shopdetail'

// //联系方式
export const CONTACT_SET_DEFAULT = 'contactdefault' // 设置默认
export const CONTACT_ADD = 'contactadd'
export const CONTACT_EDIT = 'contactedit'
export const CONTACT_DELETE = 'contactdelete'
export const CONTACT_LIST = 'contactlist'

// //用户
export const USER_LIST = 'storeslist'
export const USER_ALLOT_PRICE = 'allotpricing' // 分配价格体系
export const USER_EXPORT = 'storesexport'

// //员工
export const MEMBER_EDIT = 'staffedit'
export const MEMBER_DELETE = 'staffdelete'
export const MEMBER_ADD = 'staffadd'
export const MEMBER_LIST = 'stafflist'
export const MEMBER_PERMISSION = 'permissionallot' // 权限管理
export const MEMBER_FORBIDDEN = 'forbidden' // 禁用启用

// //角色
export const ROLE_EDIT = 'roleedit'
export const ROLE_DELETE = 'roledelete'
export const ROLE_ADD = 'roleadd'
export const ROLE_LIST = 'rolelist'
// 采购入库
export const PURCHASE_BILL_LIST = 'purchasebilllist' // 采购入库单列表
export const PURCHASE_BILL_EXPORT = 'purchasebillexport'
export const PURCHASE_BILL_DETAIL = 'purchasebilldetail'
export const PURCHASE_BILL_ADD = 'purchasebilladd'
// 采退出库
export const PURCHASE_RETURN_BILL_LIST = 'purchasereturnbilllist' // 采退出库单列表
export const PURCHASE_RETURN_BILL_DETAIL = 'purchasereturnbilldetail'
export const PURCHASE_RETURN_BILL_ADD = 'purchasereturnbilladd'
// 供应商管理
export const SUPPLIER_LIST = 'purchasesupplierlist'
export const SUPPLIER_DETAIL = 'supplierdetail'
export const SUPPLIER_EDIT = 'supplieredit'
export const SUPPLIER_FINANCIAL = 'supplierfinancialdetail' // 财务流水
export const SUPPLIER_FINANCIAL_TRANSFERS = 'supplierfinancialtransfers' // 财务转账
export const SUPPLIER_ADD = 'supplieradd'
// 库存查询
export const STOCK_INVENTORY_LIST = 'inventory'
export const STOCK_INVENTORY_EXPORT = 'inventoryexport'
export const STOCK_INVENTORY_DETAIL = 'inventoryinventorydetail' // 库存流水？
// 库存流水
export const STOCK_INVENTORY_DETAIL_DETAIL = 'inventorydetaildetail' // 详情
export const STOCK_INVENTORY_DETAIL_EXPORT = 'inventorydetailexport' // 导出
export const STOCK_INVENTORY_DETAIL_LIST = 'inventorydetai' // 列表
// 退货入库
export const SELL_RETURN_LIST = 'sellreturnlist'
export const SELL_RETURN_ADD = 'sellreturnadd'
export const SELL_RETURN_DETAIL = 'sellreturndetail'
// 销售出库
export const SELL_LIST = 'selllist'
export const SELL_DETAIL = 'selldetail'
export const SELL_OUT = 'sellbillout' // 提交出库
// 仓库管理
export const WAREHOUSEA_ADD = 'warehouseadd' // 添加仓库
export const WAREHOUSEA_EDIT = 'warehouseedit'
export const WAREHOUSEA_CLOSE = 'warehouseclose'
export const WAREHOUSEA_LIST = 'warehouse'
// 期初库存
export const INITIAL_STOCK_ADD = 'initstockadd' // 设置期初库存
export const INITIAL_STOCK_DETAIL = 'initstockdetail'
export const INITIAL_STOCK_LIST = 'initialstock'

// 财务
// 待收款订单列表
export const FINANCIAL_COLLECTION_BILL_LIST = 'financialcollectionbilllist'
export const FINANCIAL_COLLECTION_BILL_DETAIL = 'financialcollectionbilldetail'
export const FINANCIAL_COLLECTION_TO_DEBT = 'financialtodebt' // 转为欠款
export const FINANCIAL_COLLECTION = 'financialcollectionbill' // 收款单
// 应收款管理
export const FINANCIAL_YSK_LIST = 'financialaccountdue'
export const FINANCIAL_YSK_CWLL = 'financialdetail'
export const FINANCIAL_YSK_CWSK = 'financialcaiwucollection'
// 财务流水
export const FINANCIAL_CWLS = 'financialdetail'
// 平台对账
export const PTDZ_LIST = 'financialaccountchecking'
export const PTDZ_EXPORT = 'financialaccountcheckingexport'
// 店铺收款
export const DPSK_LIST = 'financialshopaccount'
export const DPSK_EXPORT = 'financialshopaccountexport'
// 平台提现
export const PTTX = 'financialwithdraw'
export const PTTX_GLYHZH = 'financialwithdrawmanageaccount' // 管理银行账户
// 资金流水
export const ZJLS_LIST = 'financialcapitaldetail'
export const ZJLS_EXPORT = 'financialcapitaldetailexport'

// 报表
// 数据概况
export const SJGK = 'reportformsdata'
// 营业统计
export const YYTJ = 'reportformsbusiness'
// 商品统计
export const SPTJ = 'reportformsgoods'
// 交易分析
export const JYFX = 'reportformsdeal'
// 会员统计
export const HYTJ = 'reportformsusers'
// 活跃统计
export const HYTJJ = 'reportformsactive'
// 活动订单统计
export const HDDDTJ = 'reportformspromotionorder'
// "物流配送统计
export const WLPSTJ = 'reportformssms'
// 销售排行
export const XSPH = 'reportformssales'
// 销售汇总
export const XSHZ = 'reportformsgather'
// 销售明细
export const XSMX = 'reportformssalesdetail'
