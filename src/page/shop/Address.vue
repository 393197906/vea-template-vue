<template>
  <div class="shop">
    <slot name="breadcrumb"></slot>
    <div class="shopmain"></div>
    <el-form :label-position="labelPosition" label-width="120px" :model="formLabelAlign">
      <el-form-item label="联系人 :">
        <el-input v-model="formLabelAlign.tel" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="电话 :">
        <el-input v-model="formLabelAlign.detail" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="邮编 :">
        <el-input v-model="formLabelAlign.detail" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="商家地址 :">
        <el-input v-model="formLabelAlign.qq" style="width: 500px"></el-input>
      </el-form-item>
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </el-form>
  </div>

</template>

<script>
export default {
  data () {
    return {
      labelPosition: 'right',
      formLabelAlign: {
        qq: '',
        tel: '',
        detail: ''
      },
      imageUrl: ''
    }
  },
  methods: {
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    onSubmit () {

    }
  }
}
</script>

<style scoped>
  .shop{
    background-color: #fff;
  }
  .shopmain{
    margin-top: 20px;
  }
  .el-form-item{
    padding-bottom: 20px;
    padding-top: 15px;
    margin-bottom: 10px;
    border-bottom: dotted 1px #e5e5e5;
  }

  .el-button{
    margin-left: 120px;
  }
  .avatar-uploader .el-icon-plus{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

</style>
