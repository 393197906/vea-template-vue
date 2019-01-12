<template>
    <div>
        <detailsFrame>

            <el-form ref="form" slot="basicInfo" label-width="130px" size="small" inline>
                <el-form-item label="调拨类型：">
                    <el-radio v-model="radio" label="1">店间调拨</el-radio>
                    <p class="radio-info">需要物流，会产生在途库存，需要双方确认调拨出入库</p>
                    <el-radio v-model="radio" label="2">店内调拨</el-radio>
                    <p class="radio-info">无需物流，不产生在途库存，系统自动完成调拨出入库</p>
                </el-form-item>
                <div>
                    <el-form-item label="选择仓库：">
                        从
                        <el-select v-model="value" placeholder="请选择" style="width: 150px">
                            <el-option
                                    label="ceshi"
                                    value="1">
                            </el-option>
                            <el-option
                                    label="ceshi"
                                    value="1">
                            </el-option>
                        </el-select>
                        调拨到
                        <el-select v-model="value" placeholder="请选择" style="width: 150px">
                            <el-option
                                    label="ceshi"
                                    value="1">
                            </el-option>
                            <el-option
                                    label="ceshi"
                                    value="1">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="备注：">
                        <el-input
                                type="textarea"
                                :rows="3"
                                style="width: 369px"
                                placeholder="请输入内容"
                                v-model="textarea">
                        </el-input>
                    </el-form-item>
                </div>
            </el-form>

            <div slot="selectGoods">
                <el-form ref="form" label-width="10px" size="small" inline>
                    <el-form-item label=" ">
                        <el-button type="primary" size="small" @click="centerDialogVisible = true">选择商品</el-button>
                    </el-form-item>
                    <!--<el-form-item label=" ">-->
                        <!--<el-button size="small">批量导入</el-button>-->
                    <!--</el-form-item>-->
                </el-form>
                <!-- 表格 -->
                <el-table style="width: 100%" :data="queryData">
                    <el-table-column prop="date" align="center" label="商品名称" width="250">
                        <template slot-scope="scope">
                            <p>SQC180813151616406778</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="date" align="center" label="单位" width="200"></el-table-column>
                    <el-table-column prop="date" align="center" label="调出方剩余库存" width="200"></el-table-column>
                    <el-table-column prop="date" align="center" label="调入方剩余库存" width="200"></el-table-column>
                    <el-table-column prop="date" align="center" label="调入方日均销量" width="200"></el-table-column>
                    <el-table-column prop="date" align="center" label="调拨数量" width="200">
                        <template slot-scope="scope">
                            <el-input-number
                                    :min="1"
                                    size="small"
                                    :max="10">
                            </el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column prop="date" align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini">移除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- // 表格 -->
            </div>

            <div slot="footerButton">
                <el-button type="primary" size="small">提交</el-button>
            </div>
        </detailsFrame>

        <el-dialog
                title="选择商品"
                :visible.sync="centerDialogVisible"
                width="850px">
            <div style="display: flex; justify-content: space-between">
                <el-form ref="form" inline size="small">
                    <el-form-item label=" ">
                        <el-button type="primary" plain size="small">新建商品</el-button>
                        <el-button type="text" size="small">刷新</el-button>
                    </el-form-item>
                </el-form>
                <el-form ref="form" inline size="small">
                    <el-form-item label=" ">
                        <el-cascader
                                :options="options">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-input style="width: 150px" placeholder="搜索商品编码"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 表格 -->
            <el-table style="width: 100%" :data="queryData">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column prop="date" align="center" label="退货单号" width="250">
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
                <el-table-column prop="date" align="center" label="规格" width="100"></el-table-column>
                <el-table-column prop="date" align="center" label="单位" width="100"></el-table-column>
                <el-table-column prop="date" align="center" label="退货数量" width="100"></el-table-column>
                <el-table-column prop="date" align="center" label="制单时间" width="100"></el-table-column>
                <el-table-column prop="date" align="center" label="操作人" width="100"></el-table-column>
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
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="centerDialogVisible = false">确 定（0）</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import detailsFrame from './component/detailsFrame'
export default {
  name: 'new-allocation',
  data () {
    return {
      value: '',
      textarea: '',
      radio: '',
      centerDialogVisible: false,
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
        }]
      }]
    }
  },
  components: {
    detailsFrame
  }
}
</script>

<style scoped>
    .page {
        text-align: center;
        padding: 10px;
    }
    .dialog-footer {
        text-align: center;
    }
    /* 表格内商品信息 */
    .table-list-box {
        display: flex;
        font-size: 12px;
    }
    .table-list-box .goods-info-box{
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .table-list-box .goods-title {
        color: #666666;
        text-align: left;
    }
    .table-list-box .goods-no {
        color: rgb(153, 153, 153);
        text-align: left;
    }

    .radio-info {
        font-size: 12px;
        color: #999;
    }
</style>
