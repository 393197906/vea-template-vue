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
      <Editor :content="goods.description"/>
    </el-form-item>
  </el-form>
</template>

<script>

import { Editor } from '../add/edit'

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
        description: '1111', // 商品描述，
        picture: 0,
        imageArray: ''
      },
      rules: {},
      service: {}
    }
  },
  async created () {

  },
  methods: {
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    pre () {
      this.$emit('pre')
    },
    next () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('next', this.goods)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  @import '../add.css';
</style>
