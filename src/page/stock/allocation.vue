<template>
    <div class="module-box">
        <el-button
                type="primary"
                size="small"
                @click="$router.push({path: '/stock/allocation/newAllocation'})"
                class="return-goods-btn">新建调拨单</el-button>
        <!-- 搜索 -->
        <div class="search-box">
            <el-form ref="form" inline size="small">
                <!--<el-form-item label-width="100px" label="商品筛选：">-->
                    <!--<el-select v-model="value" placeholder="请选择" class="form-item-input-w">-->
                        <!--<el-option value="1" label="商品名称"></el-option>-->
                        <!--<el-option value="0" label="商品条码"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item label-width="100px" label="商品名称：">
                    <el-input placeholder="商品名称"></el-input>
                </el-form-item>
                <div>
                    <searchTime
                            label="制单时间"
                            @searchTimeChange="searchTimeChange">
                    </searchTime>
                </div>
                <div>
                    <el-form-item label-width="100px" label="单据号：">
                        <el-input></el-input>
                    </el-form-item>
                    <el-form-item label-width="100px" label="调出方：">
                        <el-select v-model="value" filterable placeholder="请选择">
                            <el-option value="1" label="仓库1"></el-option>
                            <el-option value="0" label="仓库2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="调入方：" label-width="100px">
                        <el-select v-model="value" filterable placeholder="请选择">
                            <el-option value="1" label="仓库1"></el-option>
                            <el-option value="0" label="仓库2"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="制单人：" label-width="100px">
                        <el-select v-model="value" filterable placeholder="请选择">
                            <el-option value="1" label="仓库1"></el-option>
                            <el-option value="0" label="仓库2"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label-width="100px" label=" ">
                        <el-button type="primary">筛选</el-button>
                        <el-button>导出</el-button>
                        <el-button>查看导出报表</el-button>
                        <span class="clear-search">清空筛选条件</span>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <!-- // 搜索 -->
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="全部" name="0"></el-tab-pane>
            <el-tab-pane label="待审核" name="1"></el-tab-pane>
            <el-tab-pane label="待调出" name="2"></el-tab-pane>
            <el-tab-pane label="待调入" name="3"></el-tab-pane>
            <el-tab-pane label="已驳回" name="4"></el-tab-pane>
            <el-tab-pane label="已关闭" name="5"></el-tab-pane>
            <el-tab-pane label="已完成" name="6"></el-tab-pane>
        </el-tabs>
        <!-- 表格 -->
        <!-- 不包含全选 -->
        <el-table style="width: 100%" :data="queryData" v-show="activeName !== '1'">
            <el-table-column prop="date" align="center" label="单据号" width="250">
                <template slot-scope="scope">
                    <p>SQC180813151616406778</p>
                </template>
            </el-table-column>
            <el-table-column prop="date" align="center" label="调出方" width="200">
                <template slot-scope="scope">
                    <p>15554109021</p>
                </template>
            </el-table-column>
            <el-table-column prop="date" align="center" label="调入方" width="200">
                <template slot-scope="scope">
                    <p>顶顶顶180817</p>
                </template>
            </el-table-column>
            <el-table-column prop="date" align="center" label="单据状态" width="200">
                <template slot-scope="scope">
                    <p>已完成</p>
                </template>
            </el-table-column>
            <el-table-column prop="date" align="center" label="制单人" width="200">
                <template slot-scope="scope">
                    <p>ldjbenben</p>
                    <p>(测试品牌名称180816)</p>
                </template>
            </el-table-column>
            <el-table-column prop="date" align="center" label="制单时间" width="200">
                <template slot-scope="scope">
                    <p>2018-08-10 14:00:21</p>
                </template>
            </el-table-column>
            <el-table-column prop="date" align="center" label="备注" width="200">
                <template slot-scope="scope">
                    <p>-</p>
                </template>
            </el-table-column>
            <el-table-column prop="date" align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="warning">再次调拨</el-button>
                    <el-button size="mini" type="primary" @click="$router.push({path: '/stock/allocation/allocationInfo'})">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--包含全选-->
        <el-table style="width: 100%" :data="queryData" v-show="activeName === '1'" @selection-change="handleSelectionChange">
            <el-table-column
                    style="display: none"
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column prop="date" align="center" label="单据编号" width="250">
                <template slot-scope="scope">
                    <p>SQC180813151616406778</p>
                </template>
            </el-table-column>
            <el-table-column prop="date" align="center" label="仓库" width="200"></el-table-column>
            <el-table-column prop="date" align="center" label="出库类型" width="200"></el-table-column>
            <el-table-column prop="date" align="center" label="制单时间" width="200"></el-table-column>
            <el-table-column prop="date" align="center" label="操作人" width="200"></el-table-column>
            <el-table-column prop="date" align="center" label="备注" width="200"></el-table-column>
            <el-table-column prop="date" align="center" label="操作"></el-table-column>
        </el-table>
        <!-- // 表格 -->
        <div class="page">
            <!--分页-->
            <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="1000">
            </el-pagination>
            <!-- // 分页 -->
        </div>
    </div>
</template>

<script>
import searchTime from './component/searchTime'
export default {
  name: 'allocation',
  data () {
    return {
      value: '',
      activeName: '',
      selectedOptions: [],
      queryData: [
        {}
      ],
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }, {
        value: 'zujian',
        label: '组件',
        children: [{
          value: 'basic',
          label: 'Basic',
          children: [{
            value: 'layout',
            label: 'Layout 布局'
          }, {
            value: 'color',
            label: 'Color 色彩'
          }, {
            value: 'typography',
            label: 'Typography 字体'
          }, {
            value: 'icon',
            label: 'Icon 图标'
          }, {
            value: 'button',
            label: 'Button 按钮'
          }]
        }, {
          value: 'form',
          label: 'Form',
          children: [{
            value: 'radio',
            label: 'Radio 单选框'
          }, {
            value: 'checkbox',
            label: 'Checkbox 多选框'
          }, {
            value: 'input',
            label: 'Input 输入框'
          }, {
            value: 'input-number',
            label: 'InputNumber 计数器'
          }, {
            value: 'select',
            label: 'Select 选择器'
          }, {
            value: 'cascader',
            label: 'Cascader 级联选择器'
          }, {
            value: 'switch',
            label: 'Switch 开关'
          }, {
            value: 'slider',
            label: 'Slider 滑块'
          }, {
            value: 'time-picker',
            label: 'TimePicker 时间选择器'
          }, {
            value: 'date-picker',
            label: 'DatePicker 日期选择器'
          }, {
            value: 'datetime-picker',
            label: 'DateTimePicker 日期时间选择器'
          }, {
            value: 'upload',
            label: 'Upload 上传'
          }, {
            value: 'rate',
            label: 'Rate 评分'
          }, {
            value: 'form',
            label: 'Form 表单'
          }]
        }, {
          value: 'data',
          label: 'Data',
          children: [{
            value: 'table',
            label: 'Table 表格'
          }, {
            value: 'tag',
            label: 'Tag 标签'
          }, {
            value: 'progress',
            label: 'Progress 进度条'
          }, {
            value: 'tree',
            label: 'Tree 树形控件'
          }, {
            value: 'pagination',
            label: 'Pagination 分页'
          }, {
            value: 'badge',
            label: 'Badge 标记'
          }]
        }, {
          value: 'notice',
          label: 'Notice',
          children: [{
            value: 'alert',
            label: 'Alert 警告'
          }, {
            value: 'loading',
            label: 'Loading 加载'
          }, {
            value: 'message',
            label: 'Message 消息提示'
          }, {
            value: 'message-box',
            label: 'MessageBox 弹框'
          }, {
            value: 'notification',
            label: 'Notification 通知'
          }]
        }, {
          value: 'navigation',
          label: 'Navigation',
          children: [{
            value: 'menu',
            label: 'NavMenu 导航菜单'
          }, {
            value: 'tabs',
            label: 'Tabs 标签页'
          }, {
            value: 'breadcrumb',
            label: 'Breadcrumb 面包屑'
          }, {
            value: 'dropdown',
            label: 'Dropdown 下拉菜单'
          }, {
            value: 'steps',
            label: 'Steps 步骤条'
          }]
        }, {
          value: 'others',
          label: 'Others',
          children: [{
            value: 'dialog',
            label: 'Dialog 对话框'
          }, {
            value: 'tooltip',
            label: 'Tooltip 文字提示'
          }, {
            value: 'popover',
            label: 'Popover 弹出框'
          }, {
            value: 'card',
            label: 'Card 卡片'
          }, {
            value: 'carousel',
            label: 'Carousel 走马灯'
          }, {
            value: 'collapse',
            label: 'Collapse 折叠面板'
          }]
        }]
      }, {
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'axure',
          label: 'Axure Components'
        }, {
          value: 'sketch',
          label: 'Sketch Templates'
        }, {
          value: 'jiaohu',
          label: '组件交互文档'
        }]
      }]
    }
  },
  methods: {
    handleSelectionChange () {

    },
    searchTimeChange (time) {
      // 时间组件导出数据
      console.log(time)
    }
  },
  components: {
    searchTime
  }
}
</script>

<style scoped>
    .module-box {
        padding: 15px;
        background-color: #ffffff;
    }
    .search-box {
        background-color: #f8f8f8;
        padding-top: 15px;
        margin-bottom: 15px;
    }
    .form-item-input-w {
        width: 100px;
    }
    .clear-search {
        color: #38f;
        cursor: pointer;
        margin-left: 10px;
    }
    .page {
        text-align: center;
        padding: 10px;
    }
    .return-goods-btn {
        margin-bottom: 20px;
    }
</style>
