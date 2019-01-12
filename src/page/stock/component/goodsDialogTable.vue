<template>
    <!--
        :dialogVisible 传入控制dialog 显示控制字段
        :disableGoodsId 传入父组件已选商品id [1,2,3,4]
        @dialogClose  dialog关闭导出方法  控制 diaLog 显示字段
        @dialogSure  dialog 确定 导出选中商品数据方法，默认传递已选择商品数据数组
    -->
    <el-dialog
            top="20px"
            title="选择商品"
            :visible.sync="dialogVisible"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="dialogClose"
            width="850px">
        <div style="display: flex; justify-content: space-between">
            <el-form ref="form" inline size="small">
                <el-form-item label=" ">
                    <!--<el-button type="primary" plain size="small">新建商品</el-button>-->
                    <el-button type="text" size="small" @click="getAllGoods">刷新</el-button>
                </el-form-item>
            </el-form>
            <el-form ref="form" inline size="small">
                <el-form-item>
                    <el-cascader
                            change-on-select
                            @change="pageChange(1)"
                            id="goods-type"
                            placeholder="请选择商品分类"
                            :options="category_list"
                            :props="category_props"
                            v-model="getGoodsSearch.category_id"
                            size="small"
                            clearable
                    >
                    </el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-input style="width: 150px" placeholder="搜索商品名称" v-model="getGoodsSearch.goods_name" @keyup.enter.native="pageChange(1)">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="pageChange(1)">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 表格 -->
        <el-table style="width: 100%" :data="goodsListData" @selection-change="goodsTabChange" ref="goodsTab">
            <el-table-column
                    type="selection"
                    :selectable="goodsSelTable"
                    width="55">
            </el-table-column>
            <el-table-column prop="date" align="center" label="商品" width="250">
                <template slot-scope="scope">
                    <div class="table-list-box">
                        <div style="width: 60px; height: 60px;">
                            <img :src="scope.row.image.pic_cover_small"
                                 alt=""
                                 style="max-width: 100%; max-height: 100%">
                        </div>
                        <div class="goods-info-box">
                            <p class="goods-title">{{scope.row.goods_name}}</p>
                            <p class="goods-no">{{scope.row.goods_id}}</p>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="weight" align="center" label="单位" width="100"></el-table-column>
            <!--<el-table-column prop="date" align="center" label="分类" width="200"></el-table-column>-->
            <el-table-column prop="create_time" align="center" label="	创建时间">
                <template slot-scope="scope">
                    {{formatTime(scope.row.create_time)}}
                </template>
            </el-table-column>
        </el-table>
        <!-- // 表格 -->
        <div class="page" v-if="goodsListData.length > 0">
            <!--分页-->
            <el-pagination
                    background
                    :page-size.sync="getGoodsSearch.pageSize"
                    layout="prev, pager, next"
                    @current-change="pageChange"
                    :total="getGoodsSearch.total">
            </el-pagination>
            <!-- // 分页 -->
        </div>
        <div  class="dialog-footer">
            <el-button type="danger" size="small" @click="dialogClose">取 消</el-button>
            <el-button type="primary" size="small" @click="dialogSure">确 定（{{bindGoodsArr.length}}）</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {formatTime} from '@/util/util.js'
export default {
  name: 'goods-dialog-table',
  data () {
    return {
      category_list: [], // 商品分类
      category_props: {
        value: 'category_id',
        label: 'category_name',
        children: 'children'
      },
      getGoodsSearch: { // 搜索商品条件
        goods_name: '', // 商品名称
        category_id: [], // 分类id [1,2,3]
        page: 1,
        pageSize: 5,
        total: 0
      },
      goodsListData: [], // 商品数据
      bindGoodsList: {}, // 已选中商品数据
      bindGoodsArr: [] // 已选中的全部商品数组数据
    }
  },
  methods: {
    formatTime: formatTime,
    // 商品dialog 关闭弹窗
    dialogClose () {
      this.bindGoodsList = {}
      this.bindGoodsArr = []
      this.$refs.goodsTab.clearSelection()
      this.$emit('dialogClose')
    },
    // 商品dialog 确定时
    dialogSure () {
      this.$emit('dialogSure', this.bindGoodsArr)
      this.bindGoodsList = {}
      this.bindGoodsArr = []
      this.$refs.goodsTab.clearSelection()
    },
    // 获取商品接口数据
    async getAllGoods () {
      let category_id = this.getGoodsSearch.category_id
      let params = Object.assign({}, this.getGoodsSearch, {category_id: category_id[category_id.length - 1]})
      const {err, data: {data: {data, total}}} = await this.$service.newGoods.getAllGoods(params)
      if (err) return
      var bindGoods = this.bindGoodsList[this.getGoodsSearch.page.toString()]
      this.goodsListData = data
      this.getGoodsSearch.total = total
      this.$nextTick(() => {
        if (bindGoods) {
          for (let i_ in bindGoods) {
            for (let i in data) {
              if (data[i].goods_id === bindGoods[i_].goods_id) {
                this.$refs.goodsTab.toggleRowSelection(data[i])
              }
            }
          }
        }
      })
    },
    // 选择商品分页
    pageChange (val) {
      this.getGoodsSearch.page = val
      this.getAllGoods()
    },
    // 商品单独选择触发
    goodsTabChange (val) {
      this.bindGoodsArr = []
      var page = this.getGoodsSearch.page.toString()
      this.bindGoodsList[page] = val
      let bindGoodsList = this.bindGoodsList
      for (let i in bindGoodsList) {
        bindGoodsList[i].map(item => {
          // console.log(item)
          this.bindGoodsArr.push(item)
        })
      }
    },
    // 获取商品分类
    async getCategory () {
      const {err, data} = await this.$service.goods.goods_common_api.category()
      if (err) return
      this.category_list = data.result
    },
    // 是否禁用表格多选
    goodsSelTable (val) {
      if (this.disableGoodsId.indexOf(val.goods_id) > -1) {
        return false
      } else {
        return true
      }
    }
  },
  props: {
    dialogVisible: { // 弹出窗口状态
      type: Boolean,
      required: true
    },
    disableGoodsId: { // 禁用商品选择 传入父组件已选商品id [1,2,3,4]
      type: Array,
      required: true
    }
  },
  created () {
    this.getAllGoods() // 获取商品数据接口
    this.getCategory() // 获取商品分类
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
        margin-left: 10px;
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
</style>
