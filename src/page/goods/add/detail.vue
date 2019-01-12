<template>
  <el-form :model="goods" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
    <el-form-item label="商品图片">
      <GoodPicList :file_list.sync="file_list"></GoodPicList>
    </el-form-item>
    <el-form-item label="商品描述">
      <Editor :content="goods.description" @change="editorChange"/>
    </el-form-item>
    <div class="active-container">
    </div>
  </el-form>
</template>

<script>
import {Editor} from './edit'
import GoodPicList from '@/components/goods/goodsList/GoodPicList'

export default {
  name: 'detail',
  components: {
    Editor,
    GoodPicList
  },
  props: ['editData'],
  watch: {
    editData (data) {
      this.goods.description = data.description
      this.goods.picture = data.picture
      const img_id_array = data.img_id_array.split(',')
      this.file_list = img_id_array.map(item => {
        return {
          id: item, name: item, url: data.picture_array[item]
        }
      })
    }
  },
  data () {
    return {
      file_list: [],
      editorOption: {},
      goods: {
        description: '', // 商品描述，
        picture: 0,
        imageArray: ''
      },
      rules: {},
      service: {}
    }
  },
  methods: {
    editorChange (content) {
      this.goods.description = content
    },
    next () {
      let result = false
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.file_list.length) {
            this.$message({
              type: 'error',
              message: '请上传图片'
            })
            return
          }
          this.goods.picture = this.file_list[0].id
          // this.goods.imageArray = JSON.stringify(this.file_list.map(item => item.id))
          this.goods.imageArray = this.file_list.map(item => item.id).join(',')
          // console.log("array",this.goods.imageArray);
          result = this.goods
        }
      })
      return result
    }
  }
}
</script>

<style scoped>
  @import '../add.css';
</style>
