<template>
    <div class="module-box">
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
                    <el-form-item label-width="100px" label="收货门店：">
                        <el-select v-model="value" filterable placeholder="请选择">
                            <el-option value="1" label="仓库1"></el-option>
                            <el-option value="0" label="仓库2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label-width="100px" label="单据号：">
                        <el-input></el-input>
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
            <el-tab-pane label="待配送" name="2"></el-tab-pane>
            <el-tab-pane label="待入库" name="3"></el-tab-pane>
            <el-tab-pane label="已驳回" name="4"></el-tab-pane>
            <el-tab-pane label="已关闭" name="5"></el-tab-pane>
            <el-tab-pane label="已完成" name="6"></el-tab-pane>
        </el-tabs>
        <!-- 表格 -->
        <el-table style="width: 100%" :data="queryData">
            <el-table-column prop="date" align="center" label="单据号" width="250">
                <template slot-scope="scope">
                    <p>SQC180813151616406778</p>
                </template>
            </el-table-column>
            <el-table-column prop="date" align="center" label="单据状态" width="200">
                <template slot-scope="scope">
                    <p>嗯</p>
                </template>
            </el-table-column>
            <el-table-column prop="date" align="center" label="申请门店" width="200">
                <template slot-scope="scope">
                    <p>舜奥华府店</p>
                </template>
            </el-table-column>
            <el-table-column prop="date" align="center" label="申请人" width="200">
                <template slot-scope="scope">
                    <p>张福君</p>
                </template>
            </el-table-column>
            <el-table-column prop="date" align="center" label="申请时间" width="200">
                <template slot-scope="scope">
                    <p>2015-03-31 15:30:30</p>
                </template>
            </el-table-column>
            <el-table-column prop="date" align="center" label="备注" width="200">
                <template slot-scope="scope">
                    <p>备注~</p>
                </template>
            </el-table-column>
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
  name: 'store-purchase',
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
