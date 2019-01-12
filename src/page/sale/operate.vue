<template>
  <div id="center">
    <div class="center">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

        <!-- 营销策略 -->
        <el-form-item label="营销策略:" prop="resource">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="红包关怀"></el-radio>
            <el-radio label="千人千面"></el-radio>
            <el-radio label="短信推送"></el-radio>
            <el-radio label="邮件推送"></el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 选择人群 -->
        <el-form-item label="选择人群" prop="randomly">
          <div class="randomly">
            <div class="randomly_right">
              <el-button type="text" size="mini" @click="dialogTableVisible = true"
                         style="color: #fff;width: 100%;padding:0;">
                <i class="jia">+</i>
                <span style="line-height: 25px;float:left;">选择人群</span>
                <div class="interest">兴趣人群</div>
              </el-button>
              <div class="new_vip">
                <router-link to="/sale/Packet/Addenvelope">
                  <a class="group-region-btn" href="javascript:void(0);" data-type="1">新建会员送红包</a>
                </router-link>

              </div>
            </div>
            <el-dialog :visible.sync="dialogTableVisible">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <!--自定义人群-->
                <el-tab-pane label="自定义人群" name="first">
                  <div class="people_search">
                    <el-input size="small" placeholder="请输入内容" v-model="search_ipt" clearable></el-input>
                    <button size="small" type="button" class="el-button el-button--primary el-button--small">
                      <i class="el-icon-search"></i>
                      <span>搜索</span>
                    </button>
                  </div>
                  <el-table border height="400" :model="submitForm" ref="multipleTable" :data="tableData"
                            tooltip-effect="dark">
                    <el-table-column type="selection" align="center"></el-table-column>
                    <el-table-column label="人群名称" align="center">
                      <template slot-scope="scope">{{ scope.row.crowd }}</template>
                    </el-table-column>
                    <el-table-column prop="definition" label="人群定义" align="center"></el-table-column>
                    <el-table-column prop="establish" label="创建时间" align="center"></el-table-column>
                    <el-table-column prop="count" label="人群数量" show-overflow-tooltip align="center"></el-table-column>
                  </el-table>
                  <el-pagination background layout="prev, pager, next" :total="100"></el-pagination>
                </el-tab-pane>
                <!--系统预制人群-->
                <el-tab-pane label="系统预制人群" name="second">
                  <div class="people_search">
                    <el-input size="small" placeholder="请输入内容" v-model="search_ipt" clearable></el-input>
                    <button size="small" type="button" class="el-button el-button--primary el-button--small">
                      <i class="el-icon-search"></i>
                      <span>搜索</span>
                    </button>
                  </div>
                  <el-table border height="400" ref="multipleTable" :data="tableData" tooltip-effect="dark">
                    <el-table-column type="selection" align="center"></el-table-column>
                    <el-table-column label="人群名称" align="center">
                      <template slot-scope="scope">{{ scope.row.crowd }}</template>
                    </el-table-column>
                    <el-table-column prop="definition" label="人群定义" align="center"></el-table-column>
                    <el-table-column prop="establish" label="创建时间" align="center"></el-table-column>
                    <el-table-column prop="count" label="人群数量" show-overflow-tooltip align="center"></el-table-column>
                  </el-table>
                  <el-pagination background layout="prev, pager, next" :total="100"></el-pagination>
                </el-tab-pane>
              </el-tabs>
              <div class="activity_btn">
                <el-form-item>
                  <el-button size="small" type="primary" @click="submitFormsmall('submitForm')">确认</el-button>
                  <el-button size="small" @click="dialogTableVisible = false">取 消</el-button>
                </el-form-item>
              </div>
            </el-dialog>

          </div>
        </el-form-item>

        <!-- 选择红包 -->
        <div class="money">
          <el-form-item label="选择红包" prop="region" style="width:100%">
            <el-select clearable v-model="ruleForm.region">
              <el-option label="红包" value="shanghai"></el-option>
              <el-option label="红包包" value="beijing"></el-option>
            </el-select>
            <div class="packet">展示会员送红包的所有未失效的红包</div>
          </el-form-item>
        </div>

        <!-- 计划内容 -->
        <div class="activity_name">
          <el-form-item label="计划内容" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
        </div>

        <!-- 提交 -->
        <div class="activity_buttom">
          <el-form-item>
            <el-button size="small" type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button size="small" @click="goBack">返回</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'first',
      ruleForm: {
        name: '',
        randomly: '',
        region: '--请选择--',
        delivery: false,
        resource: '红包关怀',
        search_ipt: ''
      },
      rules: {
        resource: [
          {required: true, message: '请选择营销策略', trigger: 'change'}
        ],
        region: [
          {required: true, message: '请选择红包', trigger: 'change'}
        ],
        name: [
          {required: true, message: '请输入计划内容', trigger: 'blur'}
        ]
      },
      tableData: [
        {
          crowd: '我走路带风~',
          definition: 'VIP',
          establish: '2018-6-6',
          count: '666'
        },
        {
          crowd: '我走路带风~',
          definition: 'VIP',
          establish: '2018-6-6',
          count: '666'
        },
        {
          crowd: '我走路带风~',
          definition: 'VIP',
          establish: '2018-6-6',
          count: '666'
        },
        {
          crowd: '我走路带风~',
          definition: 'VIP',
          establish: '2018-6-6',
          count: '666'
        },
        {
          crowd: '我走路带风~',
          definition: 'VIP',
          establish: '2018-6-6',
          count: '666'
        },
        {
          crowd: '我走路带风~',
          definition: 'VIP',
          establish: '2018-6-6',
          count: '666'
        },
        {
          crowd: '我走路带风~',
          definition: 'VIP',
          establish: '2018-6-6',
          count: '666'
        },
        {
          crowd: '我走路带风~',
          definition: 'VIP',
          establish: '2018-6-6',
          count: '666'
        },
        {
          crowd: '我走路带风~',
          definition: 'VIP',
          establish: '2018-6-6',
          count: '666'
        }
      ],
      dialogTableVisible: false,
      multipleSelection: []
    }
  },
  methods: {
    //  提交
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //  重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    //  返回
    goBack () {
      this.$router.push({path: '/sale/ClientAnalyze'})
    },
    //  确认
    submitFormsmall (submitForm) {
      alert('不要~')
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 新建会员送红包
    newRed () {

    }
  }
}
</script>

<style scoped>
  #center {
    background: #FFF;
  }

  .center {
    width: 100%;
    height: 100%;
    padding-top: 20px;
    padding-left: 20px;
  }

  .activity_name {
    width: 20%;
  }

  .activity_buttom {
    margin-top: 60px;
  }

  .randomly {
    width: 6%;
    height: 25px;
    line-height: 25px;
    background: #409EFF;
    color: #fff;
    border: 1px solid #0680ff;
    border-radius: 5px;
    margin-top: 8px;
  }

  .randomly_right {
    float: left;
  }

  .jia {
    font-size: 18px;
    margin-right: 5px;
    line-height: 25px;
    float: left;
    padding-left: 12px;
  }

  .interest {
    color: #909399;
    float: left;
    width: 80%;
    line-height: 20px;
  }

  .packet {
    color: #909399;
  }

  .money {
    width: 20%;
  }

  .el-pagination {
    float: right !important;
    margin-top: 10px;
  }

  .people_search {
    width: 30%;
    float: right;
    padding-bottom: 10px;
  }

  .money .el-select {
    width: 100%;
  }

  .people_search .el-input--small {
    width: 70%;
  }

  .new_vip{
    margin: 0;
    width: 120px;
    text-align: center;
    background: #FF9F24;
    border-color: #FF920B;
    margin-bottom: 5px;
    border-radius: 5px;
  }

  .new_vip a {
    color: #fff !important;
  }
</style>
