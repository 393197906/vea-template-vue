<template>
    <div>
        <detailsFrame>
            <!-- 基本信息 slot="basicInfo" -->
            <el-form ref="form" slot="basicInfo" label-width="130px" size="small" inline>
                <el-form-item label="仓库：">
                    <el-select v-model="value" placeholder="请选择">
                        <el-option label="报损" value="0"></el-option>
                        <el-option label="领用" value="1"></el-option>
                        <el-option label="其他" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作人：">
                    <el-input :disabled="true"></el-input>
                </el-form-item>
                <div>
                    <el-form-item label="备注：">
                        <el-input
                                type="textarea"
                                :rows="3"
                                style="width: 300px"
                                placeholder="请输入内容"
                                v-model="textarea">
                        </el-input>
                    </el-form-item>
                </div>
            </el-form>
            <!-- // 基本信息 slot="basicInfo" -->

            <!--选择商品-->
            <div slot="selectGoods">
                <el-form ref="form" label-width="10px" size="small" inline>
                    <el-form-item label=" ">
                        <el-button type="primary" size="small" @click="centerDialogVisible = true">添加商品</el-button>
                    </el-form-item>
                    <!--<el-form-item label=" ">-->
                        <!--<el-button size="small">批量导入</el-button>-->
                    <!--</el-form-item>-->
                </el-form>
                <p class="table-info">共要盘点 0 种商品</p>
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
                    <el-table-column prop="date" align="center" label="单位" width="200"></el-table-column>
                    <el-table-column prop="date" align="center" label="库存数量" width="200"></el-table-column>
                    <el-table-column prop="date" align="center" label="盘点后数量" width="200">
                        <template slot-scope="scope">
                            <el-input size="small" style="width: 100px"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="date" align="center" label="盈亏数量" width="200"></el-table-column>
                    <el-table-column prop="date" align="center" label="操作">
                        <template slot-scope>
                            <el-button type="danger" size="mini">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- // 表格 -->
            </div>
            <!-- // 选择商品 -->

            <!-- 底部操作按钮 slot="footerButton" -->
                <div slot="footerButton">
                    <el-button type="primary" size="small">完成盘点</el-button>
                    <el-button size="small">暂停并保存</el-button>
                </div>
            <!-- // 底部操作按钮 slot="footerButton" -->
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
  name: 'new-inventory',
  data () {
    return {
      value: '',
      textarea: '',
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
    .table-info {
        color: #333;
        font-size: 12px;
        line-height: 2;
        font-weight: 700;
    }
</style>
