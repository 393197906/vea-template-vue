<template>
  <div class="center">
    <el-tabs type="border-card">
      <!--  用户管理  -->
      <el-tab-pane label="客户分析">
        <el-alert title="客户分群" type="info" :closable="false"></el-alert>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <div class="group-region">
                <div class="group-region-brief">
                  <div class="icon icon-taste"></div>
                  <p class="name">兴趣人群</p>
                  <p class="desc">近3-10天有收藏行为，且近期没有购买收藏商品的客户。</p>
                </div>
                <div class="group-region-subtotal">
                  <dl>
                    <dt class="group-label">人群总数</dt>
                    <dd class="num interested">
                      <template>888</template>
                    </dd>
                  </dl>
                  <dl>
                    <dt class="group-label">昨日访客</dt>
                    <dd class="num">
                      <template>666</template>
                    </dd>
                  </dl>
                  <dl>
                    <dt class="group-label">昨日成交</dt>
                    <dd class="num interested-deal">
                      <template>999</template>
                    </dd>
                  </dl>
                </div>
                <router-link to="/sale/ClientAnalyze/operate">
                  <el-button size="mini" class="group-region-btn">定向运营</el-button>
                </router-link>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <div class="group-region">
                <div class="group-region-brief">
                  <div class="icon icon-new"></div>
                  <p class="name">新客户人群</p>
                  <p class="desc">近30天内只交易成功过一次。</p>
                </div>
                <div class="group-region-subtotal">
                  <dl>
                    <dt class="group-label">人群总数</dt>
                    <dd class="num new-customer">
                      <template>999</template>
                    </dd>
                  </dl>
                  <dl>
                    <dt class="group-label">昨日访客</dt>
                    <dd class="num">
                      <template>666</template>
                    </dd>
                  </dl>
                  <dl>
                    <dt class="group-label">昨日成交</dt>
                    <dd class="num new-customer-deal">
                      <template>888</template>
                    </dd>
                  </dl>
                </div>
                <router-link to="/sale/ClientAnalyze/operate">
                  <el-button size="mini" class="group-region-btn">定向运营</el-button>
                </router-link>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <div class="group-region">
                <div class="group-region-brief">
                  <div class="icon icon-old"></div>
                  <p class="name">复购人群</p>
                  <p class="desc">近90天内成交超过三次，且在近30天内有过成交。</p>
                </div>
                <div class="group-region-subtotal">
                  <dl>
                    <dt class="group-label">人群总数</dt>
                    <dd class="num repeat">
                      <template>999</template>
                    </dd>
                  </dl>
                  <dl>
                    <dt class="group-label">昨日访客</dt>
                    <dd class="num">
                      <template>888</template>
                    </dd>
                  </dl>
                  <dl>
                    <dt class="group-label">昨日成交</dt>
                    <dd class="num repeat-deal">
                      <template>666</template>
                    </dd>
                  </dl>
                </div>
                <router-link to="/sale/ClientAnalyze/operate">
                  <el-button size="mini" class="group-region-btn">定向运营</el-button>
                </router-link>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-alert title="我的人群库" type="info" :closable="false"></el-alert>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="自定义人群" name="first">
            <div class="issuedData">
              <el-table :data="tableData" style="width: 100%;border: 1px solid #e6e6e6;border-bottom: 0;">
                <el-table-column prop="number" label="编号" align="center"></el-table-column>
                <el-table-column prop="name" label="人群名称" align="center"></el-table-column>
                <el-table-column prop="define" label="人群定义" align="center"></el-table-column>
                <el-table-column prop="time" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="count" label="人群数量" align="center"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-pagination background layout="prev, pager, next" :total="100"></el-pagination>
          </el-tab-pane>
          <el-tab-pane label="系统预制人群" name="second">
            <div class="issuedData">
              <el-table id="top" :data="tableData" style="width: 100%;border: 1px solid #e6e6e6;border-bottom: 0;">
                <el-table-column prop="number" label="编号" align="center"></el-table-column>
                <el-table-column prop="name" label="人群名称" align="center"></el-table-column>
                <el-table-column prop="define" label="人群定义" align="center"></el-table-column>
                <el-table-column prop="time" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="count" label="人群数量" align="center"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-pagination background layout="prev, pager, next" :total="100"></el-pagination>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>

      <!--  智能营销 -->
      <el-tab-pane label="智能营销">
        <el-alert title="智能营销" type="info" :closable="false"></el-alert>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <div class="group-region group-region-small">
                <div class="group-region-brief">
                  <div class="icon icon-bonus"></div>
                  <p class="name">红包关怀</p>
                  <p class="desc">对兴趣客户和老客户的一键式红包投放</p>
                </div>
                <router-link to="/sale/ClientAnalyze/operate">
                  <a class="group-region-btn" href="javascript:void(0);" data-type="1">立即创建</a>
                </router-link>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <div class="group-region group-region-small">
                <div class="group-region-brief">
                  <div class="icon icon-index"></div>
                  <p class="name">千人千面</p>
                  <p class="desc">不同的人群在店铺首页展示不同的内容，提升访客的成交转化率</p>
                </div>
                <router-link to="/sale/ClientAnalyze/operate">
                  <a class="group-region-btn" href="javascript:void(0);" data-type="1">立即创建</a>
                </router-link>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <div class="group-region group-region-small">
                <div class="group-region-brief">
                  <div class="icon icon-sms"></div>
                  <p class="name">短信推送</p>
                  <p class="desc">不同的人群定向信息推送</p>
                </div>
                <router-link to="/sale/ClientAnalyze/operate">
                  <a class="group-region-btn" href="javascript:void(0);" data-type="1">立即创建</a>
                </router-link>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <div class="group-region group-region-small">
                <div class="group-region-brief">
                  <div class="icon icon-mail"></div>
                  <p class="name">邮件推送</p>
                  <p class="desc">不同的人群定向信息推送</p>
                </div>
                <router-link to="/sale/ClientAnalyze/operate">
                  <a class="group-region-btn" href="javascript:void(0);" data-type="1">立即创建</a>
                </router-link>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-alert title="运营计划列表" type="info" :closable="false"></el-alert>
        <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="红包关心" name="first">
            <div class="issuedData">
              <el-table :data="tableData" style="width: 100%;border: 1px solid #e6e6e6;border-bottom: 0;">
                <el-table-column prop="number" label="编号" align="center"></el-table-column>
                <el-table-column prop="name" label="人群名称" align="center"></el-table-column>
                <el-table-column prop="define" label="人群定义" align="center"></el-table-column>
                <el-table-column prop="time" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="count" label="人群数量" align="center"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">查看红包使用情况</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-pagination background layout="prev, pager, next" :total="100"></el-pagination>
          </el-tab-pane>

          <el-tab-pane label="千人千面" name="second">
            <div class="issuedData">
              <el-table :data="tableData" style="width: 100%;border: 1px solid #e6e6e6;border-bottom: 0;">
                <el-table-column prop="number" label="编号" align="center"></el-table-column>
                <el-table-column prop="name" label="人群名称" align="center"></el-table-column>
                <el-table-column prop="define" label="人群定义" align="center"></el-table-column>
                <el-table-column prop="time" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="count" label="人群数量" align="center"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">作废</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-pagination background layout="prev, pager, next" :total="100"></el-pagination>
          </el-tab-pane>

          <el-tab-pane label="短信推送" name="third">
            <div class="issuedData">
              <el-table :data="tableData" style="width: 100%;border: 1px solid #e6e6e6;border-bottom: 0;">
                <el-table-column prop="number" label="编号" align="center"></el-table-column>
                <el-table-column prop="name" label="人群名称" align="center"></el-table-column>
                <el-table-column prop="define" label="人群定义" align="center"></el-table-column>
                <el-table-column prop="time" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="count" label="人群数量" align="center"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">查看红包使用情况</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-pagination background layout="prev, pager, next" :total="100"></el-pagination>
          </el-tab-pane>
          <el-tab-pane label="邮件推送" name="fourth">
            <div class="issuedData">
              <el-table :data="tableData" style="width: 100%;border: 1px solid #e6e6e6;border-bottom: 0;">
                <el-table-column prop="number" label="编号" align="center"></el-table-column>
                <el-table-column prop="name" label="人群名称" align="center"></el-table-column>
                <el-table-column prop="define" label="人群定义" align="center"></el-table-column>
                <el-table-column prop="time" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="count" label="人群数量" align="center"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">查看红包使用情况</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-pagination background layout="prev, pager, next" :total="100"></el-pagination>
          </el-tab-pane>
        </el-tabs>

      </el-tab-pane>

      <!-- 添加人群 -->
      <el-tab-pane label="添加人群">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="人群名称" prop="name">
            <div class="el-input-warp">
              <el-input v-model="ruleForm.name"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="店铺会员等级:" prop="type" id="ip">
            <el-checkbox-group v-model="ruleForm.type">
              <el-checkbox label="特殊会员" name="type"></el-checkbox>
              <el-checkbox label="二批" name="type"></el-checkbox>
              <el-checkbox label="普通会员（VIP8）" name="type"></el-checkbox>
              <el-checkbox label="钻石会员" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="会员性别：" prop="resource">
            <el-radio-group v-model="ruleForm.resource">
              <el-radio label="男"></el-radio>
              <el-radio label="女"></el-radio>
              <el-radio label="不限"></el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="会员生日：" required>
            <div class="block">
              <el-date-picker size="small"
                              unlink-panels="true"
                              type="daterange" v-model="time" value-format="timestamp"
                              start-placeholder="请选择开始日期"
                              end-placeholder="请选择结束日期">
              </el-date-picker>
            </div>
          </el-form-item>
          <!-- 成功交易次数 -->
          <el-form-item label="成功交易次数:" prop="region">
            <div class="region_select">
              <el-select v-model="change_hands" @change="showToggle">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </div>
            <div class="money_warp" v-model="input" v-if="change_hands == 'qujian'">
              <div class="input_inner">
                <el-input></el-input>
              </div>
              <div class="most">至</div>
            </div>
            <div class="input_right">
              <el-input v-model="input" placeholder="请输入内容"></el-input>
            </div>
            <div class="most">次</div>
          </el-form-item>
          <!-- 成功付款金额 -->
          <el-form-item label="成功付款金额:" prop="region">
            <div class="region_select">
              <el-select v-model="change_payment" placeholder="" @change="showToggle">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </div>
            <div class="money_warp" v-model="input" v-if="change_payment == 'qujian'">
              <div class="input_inner">
                <el-input></el-input>
              </div>
              <div class="most">至</div>
            </div>
            <div class="input_right">
              <el-input v-model="input" placeholder="请输入内容"></el-input>
            </div>
            <div class="most">元</div>
          </el-form-item>
          <!-- 店铺有购买 -->
          <el-form-item label="店铺有购买:" prop="region">
            <div class="block initial">
              <el-slider v-model="initial" show-input></el-slider>
            </div>
          </el-form-item>
          <!-- 店铺无购买 -->
          <el-form-item label="店铺无购买:" prop="region">
            <div class="block initial">
              <el-slider v-model="have" show-input></el-slider>
            </div>
          </el-form-item>
          <!-- 付款次数 -->
          <el-form-item label="付款次数:" prop="region">
            <div class="region_select">
              <el-select v-model="degree_num" placeholder="" @change="showToggle">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </div>
            <div class="money_warp" v-model="input" v-if="degree_num == 'qujian'">
              <div class="input_inner">
                <el-input></el-input>
              </div>
              <div class="most">至</div>
            </div>
            <div class="input_right">
              <el-input v-model="input" placeholder="请输入内容"></el-input>
            </div>
            <div class="most">元</div>
          </el-form-item>
          <!-- 付款金额 -->
          <el-form-item label="付款金额:" prop="region">
            <div class="region_select">
              <el-select v-model="payment_amoun" placeholder="" @change="showToggle">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </div>
            <div class="money_warp" v-model="input" v-if="payment_amoun == 'qujian'">
              <div class="input_inner">
                <el-input></el-input>
              </div>
              <div class="most">至</div>
            </div>
            <div class="input_right">
              <el-input v-model="input" placeholder="请输入内容"></el-input>
            </div>
            <div class="most">元</div>
          </el-form-item>
          <!-- 客单价 -->
          <el-form-item label="客单价:" prop="region">
            <div class="region_select">
              <el-select v-model="pay_num" placeholder="" @change="showToggle">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </div>
            <div class="money_warp" v-model="input" v-if="pay_num == 'qujian'">
              <div class="input_inner">
                <el-input></el-input>
              </div>
              <div class="most">至</div>
            </div>
            <div class="input_right">
              <el-input placeholder="请输入内容"></el-input>
            </div>
            <div class="most">元</div>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="submitForm('ruleForm2')">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      change_hands: 'qujian',
      change_payment: 'qujian',
      degree_num: 'qujian',
      payment_amoun: 'qujian',
      pay_num: 'qujian',
      input: '',
      activeName: 'first',
      time: '',
      resource: '男',
      initial: 0,
      have: 0,
      payment: '',
      isShow: true,
      tableData: [
        {
          number: '6',
          name: '我走路带风~',
          define: '2018-6-5',
          count: '6'
        },
        {
          number: '6',
          name: '我走路带风~',
          define: '2018-6-5',
          count: '6'
        },
        {
          number: '6',
          name: '我走路带风~',
          define: '2018-6-5',
          count: '6'
        },
        {
          number: '6',
          name: '我走路带风~',
          define: '2018-6-5',
          count: '6'
        },
        {
          number: '6',
          name: '我走路带风~',
          define: '2018-6-5',
          count: '6'
        },
        {
          number: '6',
          name: '我走路带风~',
          define: '2018-6-5',
          count: '6'
        }
      ],
      options: [
        {
          value: 'qujian',
          label: '区间'
        },
        {
          value: 'dayu',
          label: '大于'
        },
        {
          value: 'xiaoyu',
          label: '小于'
        }
      ],
      ruleForm: {
        name: '',
        type: []
      },
      rules: {
        name: [
          {required: true, message: '人群名称不能为空', trigger: 'blur'}
        ],
        type: [
          {type: 'array', message: '请至少选择一个活动性质', trigger: 'change'}
        ],
        resource: [
          {required: true, message: '请选择活动资源', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    showToggle (value) {
      console.log(value)
      this.this.pay_num = value
      this.change_hands = value
      this.change_payment = value
      this.degree_num = value
      this.payment_amoun = value
    },
    handleClick (tab, event) {
    },
    handleEdit (index, row) {
      alert('休息中~')
    },
    handleDelete (index, row) {
      alert('不要!!!')
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .center {
    background: #fff;
  }

  .el-alert--info {
    color: #303133;
    margin-bottom: 10px;
    background: #FAFAFA;
    border: 1px solid #e6e6e6;
  }

  .group-region {
    margin-bottom: 10px;
  }

  .group-region {
    width: 100%;
    float: left;
    display: inline-block;
    border: 1px solid #e9e9e9;
    font-size: 12px;
  }

  .group-region .group-region-brief {
    padding: 15px 10px 10px;
    position: relative;
  }

  .group-region .group-region-brief .icon.icon-taste {
    background-position: -347px -222px;
  }

  .group-region .group-region-brief .icon {
    width: 60px;
    height: 60px;
    background: url("../../images/icon_small.png") no-repeat -347px -290px;
    position: absolute;
    top: 15px;
    left: 20px;
    display: block;
  }

  .group-region .group-region-brief p.name {
    font-size: 14px;
    color: #333;
    margin-bottom: 5px;
  }

  .group-region .group-region-brief p {
    padding-left: 85px;
    font-size: 12px;
    color: #999;
  }

  .group-region .group-region-brief p.name {
    font-size: 14px;
    color: #333;
    margin-bottom: 5px;
  }

  .group-region .group-region-brief p {
    padding-left: 85px;
    font-size: 12px;
    color: #999;
  }

  .group-region .group-region-subtotal {
    overflow: hidden;
    padding: 20px 0;
  }

  .group-region .group-region-subtotal dl {
    width: 33%;
    float: left;
    display: inline-block;
    text-align: center;
    border-right: 1px dashed #ddd;
  }

  .group-region .group-region-subtotal dl dt.group-label {
    margin-bottom: 5px;
    font-weight: 200;
  }

  .group-region .group-region-subtotal dl {
    width: 33%;
    float: left;
    display: inline-block;
    text-align: center;
    border-right: 1px dashed #ddd;
  }

  .group-region .group-region-subtotal dl:last-child {
    border-right: none;
  }

  .group-region .group-region-subtotal dl dd.num {
    color: #333;
    font-size: 14px;
  }

  .group-region .group-region-brief p.desc {
    height: 34px;
  }

  .group-region:hover {
    border-color: #418fe2;
  }

  .group-region .group-region-brief .icon.icon-old {
    background-position: -347px -357px;
  }

  .group-region .group-region-btn {
    color: #fff;
    display: block;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    background: #418fe2;
    line-height: 34px;
    width: 100%;
    border: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .el-pagination {
    float: right !important;
    margin-top: 10px;
  }

  /* 智能营销 */
  .group-region-small .group-region-brief {
    height: 80px;
    padding-top: 25px;
  }

  .group-region .group-region-brief .icon.icon-bonus {
    background-position: -273px -446px;
  }

  .group-region .group-region-brief .icon.icon-index {
    background-position: -217px -446px;
  }

  .group-region .group-region-brief .icon.icon-index {
    background-position: -217px -446px;
  }

  .group-region .group-region-brief .icon.icon-sms {
    background-position: -50px -446px;
  }

  .group-region .group-region-brief .icon.icon-mail {
    background-position: -105px -446px;
  }

  /* 添加人群 */
  .el-form-item {
    margin-top: 40px;
  }

  .el-input-warp {
    width: 20%;
  }

  .region_select {
    float: left;
  }

  .money_warp {
    width: 200px;
    float: left;
  }

  .input_inner {
    width: 80%;
    float: left;
    margin-left: 15px;
  }

  .input_right {
    width: 20%;
    float: left;
    margin-left: 10px;
  }

  .initial {
    width: 30%;
    margin-left: 10px;
  }

  .most {
    float: right;
    padding-left: 10px;
  }

  .issuedData {
  }
</style>

<style>
  .issuedData .el-table th {
    background: #f9fafa;
  }
</style>
