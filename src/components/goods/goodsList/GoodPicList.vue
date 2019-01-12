<template>
  <ul class="img_list clearfix">
    <li
      v-for="(file, index) in file_list"
      :key="index"
      :class="['img_list_item', index == 0 ? 'item_list_first_li' : '']"
      v-dragging="{item:file,list:file_list,group:'file'}"
    >
      <img
        class="img_list_item_img"
        :src="file.url"
        alt=""
      >
      <label class="img_upload_statu_label">
        <i class="el-icon-upload-success el-icon-check"></i>
      </label>
      <span class="img_upload-list__item_actions">
                <span
                  class="img_upload-list__item_delete"
                  @click="removeImg(file)"
                >
                    <i class="el-icon-delete"></i>
                </span>
            </span>
    </li>
    <li style="position:absolute;top:0;left:0">
      <el-upload
        action=" "
        :file-list="file_list"
        list-type="picture-card"
        :http-request="beforeUpload"
        :on-remove="removeImg"
        accept=".jpg,.png"
        :before-upload="beforeAvatarUpload"
        multiple
        :limit="9"
        :on-exceed="handleExceed"
        :show-file-list="false"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    file_list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    removeImg (file) {
      const index = this.file_list.findIndex(item => item.id == file.id)
      this.file_list.splice(index, 1)
    },
    async beforeUpload ({file}) {
      let fd = new FormData()
      fd.append('file', file, Date.now().toString())
      const {err, data} = await this.$service.upload_img_goods(fd)
      if (err) return
      const {pic_cover, shop_id, pic_name, pic_id} = data.result
      this.file_list.push({id: pic_id, name: pic_name, url: pic_cover})
      this.$message({
        message: '上传成功!',
        type: 'success'
      })
    },
    handleExceed () {
      this.$message.error('最多上传九张图片!')
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      const isJPG = file.type === 'image/jpeg'
      const isGIF = file.type === 'image/gif'
      const isPNG = file.type === 'image/png'
      const isBMP = file.type === 'image/bmp'
      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message.error('请选择图片')
      }

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }

      return (isJPG || isBMP || isGIF || isPNG) && isLt2M
    }

  }
}
</script>
<style scoped>
  .img_list {
    margin: 0;
    padding: 0;
    list-style: none;
    vertical-align: top;
    min-height: 171px;
  }

  .img_list_item {
    overflow: hidden;
    background: #FFF;
    border: 1px solid #c0ccda;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    width: 148px;
    height: 148px;
    margin: 0 8px 8px 0;
    display: inline-block;
    position: relative;
    border-radius: 6px;
  }

  .img_list_item_img {
    width: 100%;
    height: 100%;
  }

  .img_upload-list__item_actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, .5);
    transition: opacity .3s;
    -webkit-transition: opacity .3s;
  }

  .img_upload-list__item_actions:after {
    display: inline-block;
    content: "";
    height: 100%;
    vertical-align: middle;
  }

  .img_upload-list__item_actions:hover {
    opacity: 1;
  }

  .img_upload-list__item_delete {
    position: static;
    font-size: inherit;
    color: inherit;
    cursor: pointer;
  }

  .img_upload_statu_label {
    position: absolute;
    right: -15px;
    top: -6px;
    width: 40px;
    height: 24px;
    background: #13ce66;
    text-align: center;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    box-shadow: 0 0 1pc 1px rgba(0, 0, 0, .2);
    -webkit-box-shadow: 0 0 1pc 1px rgba(0, 0, 0, .2);
    line-height: inherit;
    font-size: 14px;
    display: block;
  }

  .img_upload_statu_label i {
    font-size: 12px;
    margin-top: 11px;
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
    color: #FFF;
    display: block;
  }

  .item_list_first_li {
    margin-left: 156px;
  }

  .clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
  }
</style>
