<template>
  <el-form :model="goods" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
    <el-form-item label="商品图片" prop="img_list">
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-form-item>
    <el-form-item label="商品描述" prop="img_list">
      <Editor/>
    </el-form-item>
  </el-form>
</template>

<script>

import {Editor} from './edit'

export default {
  name: 'img',
  components: {
    Editor
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      editorOption: {},
      goods: {
        goods_type: ''
      },
      rules: {},
      service: {
        attr_list: []
      }
    }
  },
  async created () {
    const {err, data} = await this.$service.goods.goods_common_api.attr_list()
    if (err) return
    this.service.attr_list = data.result
    this.service.attr_list.unshift({attr_id: 0, attr_name: '请选择商品类型'})
    console.log(data.result)
  },
  methods: {
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>
  .extend-p {
    margin-bottom: 10px;
  }
</style>
