<template>
    <div class="module-box">
        <div class="search-box dis-flex">
            <div>
                <el-form ref="form" inline size="small">
                    <el-form-item label=" ">
                        <el-select v-model="value" filterable placeholder="请选择">
                            <el-option value="1" label="商品名称"></el-option>
                            <el-option value="0" label="商品条码"></el-option>
                        </el-select>
                    </el-form-item>
                    <div v-if="value2">
                        <el-form-item label=" 设置默认库存预警值：">
                            <el-input></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary">保存</el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <div class="switch-box">
                <el-switch
                        v-model="value2"
                        active-text="打开预警"
                        inactive-text="关闭预警"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                </el-switch>
            </div>
        </div>
        <div class="search-box" v-if="value2">
            <el-form ref="form" inline size="small">
                <!--<el-form-item label-width="100px" label="商品筛选：">-->
                    <!--<el-select v-model="value" placeholder="请选择" class="form-item-input-w">-->
                        <!--<el-option value="1" label="商品名称"></el-option>-->
                        <!--<el-option value="0" label="商品条码"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item label-width="100px" label="商品名称：">
                    <el-input placeholder="请输入商品名称"></el-input>
                </el-form-item>
                <div>
                    <el-form-item label-width="100px" label="预警状态：">
                        <el-select v-model="value" placeholder="请选择">
                            <el-option value="1" label="全部"></el-option>
                            <el-option value="0" label="正常"></el-option>
                          <el-option value="0" label="低库存"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品分类：">
                        <el-cascader
                                :options="options"
                                v-model="selectedOptions"
                                @change="handleChange">
                        </el-cascader>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label-width="100px" label=" ">
                        <el-button type="primary">筛选</el-button>
                        <span class="clear-search">清空筛选条件</span>
                    </el-form-item>
                </div>
            </el-form>
        </div>

        <!-- 表格 -->
        <el-table style="width: 100%" :data="queryData">
            <el-table-column prop="date" align="center" label="商品名称" width="250">
                <template slot-scope="scope">
                    <div class="table-list-box">
                        <div style="width: 60px; height: 60px">
                            <img src="//img.yzcdn.cn/upload_files/2017/11/22/c201e229fb76e3282c90f01d09e0e144.jpg?imageView2/2/w/120/h/120/q/100/format/jpg"
                                 alt=""
                                 style="max-width: 100%; max-height: 100%">
                        </div>
                        <div class="goods-info-box">
                            <p class="goods-title">农夫山泉 饮用天然水550ml(f) </p>
                            <p class="goods-no">P180809445864878</p>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="date" align="center" label="单位" width="200">
                <template slot-scope="scope">
                    <p>袋</p>
                </template>
            </el-table-column>
            <el-table-column prop="date" align="center" label="实时库存" width="200">
                <template slot-scope="scope">
                    <p>123</p>
                </template>
            </el-table-column>
            <el-table-column prop="date" align="center" label="库存预警最低值" width="200">
                <template slot-scope="scope">
                    <p>12</p>
                </template>
            </el-table-column>
            <el-table-column prop="date" align="center" label="预警状态" width="200">
                <template slot-scope="scope">
                    <p>正常</p>
                </template>
            </el-table-column>
            <el-table-column prop="date" align="center" label="操作">
                <template slot-scope="scope">
                    <el-popover ref="popover1"
                            placement="left-start"
                            :offset="15"
                            width="275"
                            @show="_elPopoverShow(scope.$index)"
                            v-model="scope.row.status"
                            trigger="click">
                        <div style="display: flex">
                            <el-input-number v-model="aaa" controls-position="right" :min="1" size="small" :controls="false" :max="10"></el-input-number>
                            <el-button size="mini" type="primary" style="margin-left: 10px">确定</el-button>
                            <el-button size="mini" @click="scope.row.status = false">取消</el-button>
                        </div>
                    </el-popover>
                    <el-button size="mini" v-popover:popover1>自定义预警库存</el-button>
                    <el-button size="mini" type="warning">使用默认值</el-button>
                    <el-button size="mini" :type="1 === 2 ? 'danger' : 'success'">{{1 === 2 ? '关闭预警' : '开启预警'}}</el-button>
                </template>
            </el-table-column>
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
export default {
  name: 'warning',
  data () {
    return {
      visible2: false,
      value2: false,
      value: '',
      aaa: 123,
      queryData: [
        {status: false},
        {status: false},
        {status: false}
      ],
      selectedOptions: [],
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
    _elPopoverShow (e) {
      console.log(e)
      this.aaa = e
    },
    handleChange (value) {
      console.log(value)
    }
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
        padding: 15px 15px 0 15px;
        margin-bottom: 15px;
    }
    .form-item-input-w {
        width: 100px;
    }
    .dis-flex {
        display: flex;
        justify-content: space-between;
    }
    .switch-box {
        display: flex;
        padding-bottom: 15px;
        justify-content: center;
        flex-direction: column;
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
    .table-list-box {
        display: flex;
        font-size: 12px;
    }
    .goods-title {
        color: #666666;
        text-align: left;
    }
    .goods-no {
        color: rgb(153, 153, 153);
        text-align: left;
    }
    .table-list-box .goods-info-box{
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
</style>
