<template>
  <div class="shop">
    <el-form :label-position="labelPosition" label-width="120px" :model="formData" ref="formData" :rules="rules">
      <el-form-item label="图片:">
        <el-upload
          class="avatar-uploader"
          :action="up_action"
          :headers="up_headers"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="formData.img" :src="formData.img" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <!--<el-form-item label="链接地址 :" prop="url">-->
      <!--<el-input v-model="formData.url" style="width: 400px" placeholder="请输入图片url路径"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="类型 :" prop="type">
        <el-select style="width: 400px" v-model="formData.type" placeholder="请选择轮播图类型">
          <el-option
            label="手机"
            value="mobile"/>
        </el-select>
      </el-form-item>
      <el-form-item label="跳转类型 :" prop="go_type">
        <el-select style="width: 400px" v-model="formData.go_type" placeholder="请选择跳转类型"
                   @change="formData.go='';formData.go_name=''">
          <el-option
            label="分类"
            value="1"
          />
          <el-option
            label="商品"
            value="2"
          />
          <!--<el-option-->
          <!--label="链接"-->
          <!--value="3"-->
          <!--/>-->
        </el-select>
      </el-form-item>
      <el-form-item label="跳转指向 :" prop="go">
        <el-cascader
          style="width: 400px"
          v-if="formData.go_type==='1'"
          placeholder="请选择跳转分类"
          :options="service.category_list"
          :props="service.category_props"
          v-model="formData.go"
          change-on-select
        >
        </el-cascader>
        <el-input style="width: 400px" v-model="formData.go_name" v-if="formData.go_type==='2'" readonly
                  placeholder="请选择跳转商品"
                  @focus="goods.visible= true"/>
        <!--<el-select v-model="formData.go" placeholder="请选择跳转指向">-->
        <!--<el-option-->
        <!--label="test"-->
        <!--value="test">-->
        <!--</el-option>-->
        <!--</el-select>-->

      </el-form-item>
      <el-form-item label="背景色 :" prop="b_color">
        <el-color-picker v-model="formData.b_color"></el-color-picker>
      </el-form-item>
      <el-form-item label="排序 :" prop="order">
        <el-input-number v-model="formData.order" :controls="false" style="width: 400px" placeholder="请输入排序"/>
      </el-form-item>
      <div class="weight">
        <el-button type="primary" @click="onSubmit('formData')">提交</el-button>
      </div>
    </el-form>

    <!--选择商品-->
    <el-dialog title="选择商品" :visible.sync="goods.visible" width="35%">
      <el-tag type="success" v-show="formData.go_name">{{formData.go_name}}</el-tag>
      <!--<el-input size="small" placeholder="搜索品牌" v-model="goods.name" @change="goodsSearch"/>-->
      <el-table :data="service.goods_list" @cell-click="selectGoods">
        <el-table-column prop="goods_name" label="商品名"/>
      </el-table>
      <el-pagination
        small
        style="text-align: center;margin-top: 10px"
        layout="prev, pager, next"
        @current-change="changeGoodsPage"
        :page-size="goods.pre_page"
        :total="goods.total_count">
      </el-pagination>
    </el-dialog>
    <!--选择商品结束-->

  </div>
</template>

<script>
import { getBaseUrlForDefault } from '@/service/service'
import { mapState } from 'vea'

export default {
  data () {
    const token = JSON.parse(sessionStorage.getItem('user_info')).token
    return {
      goods: {
        visible: false,
        page: 1,
        pre_page: 5,
        total_count: 0,
        name: ''
      },
      service: {
        goods_list: [],
        category_list: [],
        category_props: {
          value: 'category_id',
          label: 'category_name',
          children: 'children'
        }
      },
      up_action: `${getBaseUrlForDefault()}/shopmanager/upload_cos`,
      up_headers: {Authorization: token},
      labelPosition: 'right',
      formData: {
        img: '', // 图片
        url: '', /// 链接地址
        type: 'mobile', // 类型
        go_type: '1', // 跳转类型
        go: '', // 跳转指向
        go_name: '',
        b_color: '', // 背景色
        order: '', // 排序
        ids: '' // 跳转指向详细
      },
      imageUrl: '',

      rules: {
        img: [
          {required: true, message: '请上传图片', trigger: 'change'}
        ], // 图片
        url: [
          // {required: true, message: '请输入图片url', trigger: 'change'},
        ], /// 链接地址
        type: [
          {required: true, message: '请选择类型', trigger: 'blur'}
        ], // 类型
        go_type: [
          {required: true, message: '请选择跳转类型', trigger: 'blur'}
        ], // 跳转类型
        go: [
          {required: true, message: '请选择跳转指向', trigger: 'blur'}
        ], // 跳转指向
        go_name: [
          {required: true, message: '请选择跳转指向', trigger: 'blur'}
        ], // 跳转指向,
        b_color: [
          {required: true, message: '请选择背景颜色', trigger: 'blur'}
        ], // 背景色
        order: [
          {required: true, message: '请输入排序', trigger: 'change'}
        ]// 排序
      }
    }
  },

  async created () {
    // 获取分类
    const {err, data} = await this.$service.goods.goods_common_api.category_list()
    if (err) return
    this.service.category_list = data.result
    // 获取商品
    this.getGoodsList()
    // 获取编辑数据
    const id = this.$router.history.current.params.id
    if (id) {
      this._getEditData(id)
    }
  },
  methods: {
    goodsSearch () {
      this.goods.page = 1
      this.getGoodsList()
    },
    selectGoods (row, column, cell, event) {
      const {goods_id, goods_name} = row
      this.formData.go = goods_id
      this.formData.go_name = goods_name
      this.goods.visible = false
    },
    changeGoodsPage (page) {
      this.goods.page = page
      this.getGoodsList()
    },
    async getGoodsList () {
      // 商品
      const {err, data} = await this.$service.goods.goods_common_api.goodsList({
        page: this.goods.page,
        pre_page: this.goods.pre_page,
        goods_name: this.goods.name,
        state: 1
      })
      if (err) return
      this.service.goods_list = data.result
      this.goods.total_count = data.total_count
    },
    async _getEditData (id) {
      const {err, data} = await this.$service.shopmanager.carousel.detail(id)
      if (err) return
      const {ad_image, background, join_id_name, id: ID, join_id, join_type, link_url, sort, type, id_line} = data.data
      this.formData.id = ID
      this.formData.img = ad_image
      // this.formData.type = type;
      this.formData.url = link_url
      this.formData.go_type = `${join_type}`
      this.formData.go = JSON.parse(id_line)
      this.formData.go_name = join_id_name
      this.formData.order = sort
      this.formData.b_color = background
    },
    // --上传--
    handleAvatarSuccess (res, file) {
      if (res.status === 200) {
        this.formData.img = res.result.pic_cover
      } else {
        return false
      }
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    // ==上传==
    async onSubmit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const upData = {...this.formData}
          upData.go = Array.isArray(upData.go) ? upData.go[upData.go.length - 1] : upData.go
          const params = {
            ad_image: upData.img,
            link_url: upData.img,
            sort: upData.order,
            type: 1,
            background: upData.b_color,
            join_type: upData.go_type,
            join_id: upData.go,
            id_line: JSON.stringify(this.formData.go)
          }
          if (upData.id) {
            const {err} = await this.$service.shopmanager.carousel.update(upData.id, params)
            if (err) return
            this.$message.success('编辑成功')
          } else {
            const {err} = await this.$service.shopmanager.carousel.store(params)
            if (err) return
            this.$message.success('新增成功')
          }

          this.$router.back()
        }
      })
    }
  }
}
</script>

<style scoped>
  .shop {
    background-color: #fff;
  }

  .el-form-item {
    padding-bottom: 20px;
    padding-top: 15px;
    margin-bottom: 10px;
    border-bottom: dotted 1px #e5e5e5;
  }

  .el-button {
    margin-left: 120px;
  }

  .avatar-uploader .el-icon-plus {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-icon-plus:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .weight {
    height: 50px;
  }
</style>
