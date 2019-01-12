<template>
    <div class="module-box">
        <div class="header-operation">
            <el-button
              v-if="$checkActionAccess($ACCESS.SUPPLIER_ADD)"
                    type="primary"
                    @click="$router.push({path: '/purchase/supplierManagement/newSupplierManagement'})"
                    size="small">新增供应商
            </el-button>
            <div>
                <el-form inline>
                    <el-form-item>
                        <el-input
                                size="small"
                                v-model="searchData.supplierName"
                                @keyup.enter.native="pageChange(1)"
                                style="width: 150px"
                                placeholder="请输入名称">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input
                                size="small"
                                v-model="searchData.phone"
                                style="width: 150px"
                                @keyup.enter.native="pageChange(1)"
                                placeholder="请输入手机号码">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="pageChange(1)">搜索</el-button>
                    </el-form-item>
                </el-form>

            </div>
        </div>
        <el-table style="width: 100%" :data="queryData">
            <el-table-column prop="supplierName" align="center" label="供应商名称" ></el-table-column>
          <el-table-column prop="supplierNum" align="center" label="编号" ></el-table-column>
            <el-table-column prop="contact" align="center" label="联系人" ></el-table-column>
            <el-table-column prop="phone" align="center" label="手机号码" ></el-table-column>
            <el-table-column prop="date" align="center" label="状态" >
                <template slot-scope="scope">
                    <p>{{scope.row.status === 5 ? '启用' : '禁用'}}</p>
                </template>
            </el-table-column>
          <el-table-column prop="balance" align="center" label="期末余额">
            <template slot-scope="scope">
              <span>{{ Math.floor(scope.row.balance * 10000) / 10000  }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="date" align="center" label="操作" min-width="200">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="showArrearDialog(scope.row.id)"  v-if="$checkActionAccess($ACCESS.SUPPLIER_FINANCIAL_TRANSFERS)">财务转账</el-button>
                    <el-button type="primary" size="mini" @click="$router.push('/purchase/supplierManagement/customerflow/' + scope.row.id)" v-if="$checkActionAccess($ACCESS.SUPPLIER_FINANCIAL)">财务流水</el-button>
                    <el-button type="warning" size="mini"
                               @click="$router.push({path: '/purchase/supplierManagement/editSupplierManagement/' + scope.row.id})" v-if="$checkActionAccess($ACCESS.SUPPLIER_EDIT)">
                        修改
                    </el-button>
                    <!--<el-button type="danger" size="mini" @click="deleteSupplier(scope.row.id)">删除</el-button>-->
                    <el-button type="primary" size="mini" @click="getSupplierInfo(scope.row.id)" v-if="$checkActionAccess($ACCESS.SUPPLIER_DETAIL)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- // 表格 -->
        <div class="page" v-if="queryData.length > 0">
            <!--分页-->
            <el-pagination
                    background
                    :page-size.sync="searchData.pageSize"
                    layout="prev, pager, next"
                    @current-change="pageChange"
                    :total="searchData.total||1">
            </el-pagination>
            <!-- // 分页 -->
        </div>
        <el-dialog
          title="财务付款"
          :visible.sync="sc_show"
          width="25%"
        >
          <el-form ref="form1" :rules="formrules" :model="supplierData" label-width="100px">
            <el-form-item label="供应商编号:">{{supplierData.supplierNum}}</el-form-item>
            <el-form-item label="供应商名称:">{{supplierData.supplierName}}</el-form-item>
            <el-form-item label="期末余额:">{{supplierData.balance}}</el-form-item>
            <el-form-item label="实付金额:" prop="actual">
              <el-input v-model="supplierData.actual" type="number" @change="inActual" placeholder="请输入实付金额"></el-input>
            </el-form-item>
            <el-form-item label="备注:">
              <el-input type="textarea" v-model="supplierData.mark" placeholder="请输入备注"></el-input>
            </el-form-item>
            <el-form-item style="margin-top:20px">
              <el-button type="primary" @click="submitForm('form1')" :loading="sc_sure_loading">确 定</el-button>
              <el-button @click="sc_show=false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog
                title="供应商详情"
                :visible.sync="dialogVisible"
                width="30%">
            <el-form ref="form" label-width="200px" class="el-form-line">
                <el-form-item label="供应商名称：">
                    <p>{{supplierData.supplierName}}</p>
                </el-form-item>
                <el-form-item label="供应商编码：">
                    <p>{{supplierData.supplierNum}}</p>
                </el-form-item>
                <el-form-item label="联系人：">
                    <p>{{supplierData.contact}}</p>
                </el-form-item>
                <el-form-item label="手机号码：">
                    <p>{{supplierData.phone}}</p>
                </el-form-item>
                <!--<el-form-item label="公司电话：">-->
                <!--<p>{{supplierData.phone}}</p>-->
                <!--</el-form-item>-->
                <el-form-item label="地址：">
                    <p>{{supplierData.address}}</p>
                </el-form-item>
                <el-form-item label="微信：">
                    <p>{{supplierData.wechat}}</p>
                </el-form-item>
                <el-form-item label="QQ：">
                    <p>{{supplierData.qq}}</p>
                </el-form-item>
                <el-form-item label="Email：">
                    <p>{{supplierData.email}}</p>
                </el-form-item>
                <el-form-item label="传真：">
                    <p>{{supplierData.fax}}</p>
                </el-form-item>
                <el-form-item label="备注：">
                    <p>{{supplierData.mark}}</p>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import receiptForm from './../finance/components/arrearReceipt.vue'
export default {
  name: 'supplier-management',
  components: {receiptForm},
  data () {
    return {
      supplier_id: '',
      sc_sure_loading: false,
      sc_show: false,
      dialogVisible: false,
      tmpForm: {},
      queryData: [],
      formrules: {
        actual: [
          {required: true, trigger: 'blur', message: '实付金额不能为空'}
        ]
      },
      searchData: {
        page: 1,
        pageSize: 10,
        total: 0,
        supplierName: '', // 供应商名称
        phone: '' // 手机号
      },
      supplierData: { // 提交信息
        supplierName: '', // 供应商名称
        supplierNum: '', // 供应商编码
        contact: '', // 联系人
        phone: '', // 手机号
        address: '', // 地址
        status: false, // 是否启用
        wechat: '', // 微信
        qq: '', // qq
        email: '', // 邮箱
        fax: '', // 传真
        selectCityArr: [], // 选中地区
        mark: '', // 备注,
        balance: '', // 余额,
        actual: '' // 实付金额
      } // 供应商信息
    }
  },
  methods: {
    // 打开添加付款单
    async showArrearDialog (id) {
      this.supplier_id = id
      let That = this
      const {err, data: {data}} = await this.$service.purchase.getSupplier({id: id})
      if (err) return
      That.supplierData.supplierName = data.supplierName
      That.supplierData.supplierNum = data.supplierNum
      That.supplierData.balance = Math.floor(data.balance * 10000) / 10000
      That.sc_show = true
    },
    // 财务转账确认
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.sc_sure_loading = true
          const tempobj = {
            supplier_id: this.supplier_id,
            note: this.supplierData.mark,
            real_money: this.supplierData.actual * -1,
            operation_type: 3,
            type: 2
          }
          const {err, data} = await this.$service.financemanager.financial_pay(tempobj)
          this.sc_sure_loading = false
          if (err) {
            this.$message({
              type: 'error',
              message: '操作失败!'
            })
          } else {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.supplierData.mark = ''
            this.supplierData.actual = ''
          }
          this.sc_show = false
          this.getSupplierList()
        }
      })
    },
    // 获取供应商列表
    async getSupplierList () {
      const {err, data: {data: {data, total}}} = await this.$service.purchase.getAllSupplier(this.searchData)
      if (err) return
      this.searchData.total = total
      this.queryData = data
    },
    // 查看供应商详情
    async getSupplierInfo (id) {
      let That = this
      const {err, data: {data}} = await this.$service.purchase.getSupplier({id: id})
      if (err) return
      That.supplierData.supplierName = data.supplierName
      That.supplierData.supplierNum = data.supplierNum
      That.supplierData.contact = data.contact
      That.supplierData.phone = data.phone
      That.supplierData.address = data.address
      That.supplierData.status = data.status === 5
      That.supplierData.wechat = data.wechat
      That.supplierData.qq = data.qq
      That.supplierData.email = data.email
      That.supplierData.fax = data.fax
      That.supplierData.selectCityArr = [data.provinceId, data.cityId, data.districtId]
      That.supplierData.mark = data.mark
      That.dialogVisible = true
    },
    pageChange (val) {
      // 页码变化
      this.searchData.page = val
      this.getSupplierList()
    },
    // 删除供应商
    deleteSupplier (id) {
      this.$confirm('确定删除该供应商吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {err, data: {data, message}} = await this.$service.purchase.delSupplier({id: id})
        if (err) return
        this.$message({
          type: 'success',
          message: message
        })
        this.getSupplierList()
      }).catch(() => {
      })
    }
  },
  created () {
    this.getSupplierList()
  }
}
</script>

<style scoped>
    .module-box {
        padding: 15px;
        background-color: #ffffff;
    }

    .header-operation {
        height: 33px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
        padding-bottom: 22px;
    }

    .page {
        text-align: center;
        padding: 10px;
    }

    /*.return-goods-btn {*/
    /*margin-bottom: 20px;*/
    /*}*/
</style>
<style>
    .el-form-line .el-form-item {
        margin-bottom: 0 !important;
    }
</style>
