import VueHtml5Editor from 'vue-html5-editor'
import { getToken } from '@/util/fetch'
import { getBaseUrlForDefault } from '@/service/service'
import { Message } from 'element-ui'

export const Editor = new VueHtml5Editor({
  language: 'zh-cn',
  hiddenModules: ['info'],
  image: {
    // 文件最大体积，单位字节  max file size
    sizeLimit: 2048 * 2048,
    // 上传参数,默认把图片转为base64而不上传
    // upload config,default null and convert image to base64
    upload: {
      url: `${getBaseUrlForDefault()}/shopmanager/upload_cos`,
      headers: {
        // 'Content-Type': 'multipart/form-data',
        'Authorization': getToken()
      },
      params: {},
      fieldName: 'file'
    },
    // 压缩参数,默认使用localResizeIMG进行压缩,设置为null禁止压缩
    // compression config,default resize image by localResizeIMG (https://github.com/think2011/localResizeIMG)
    // set null to disable compression
    compress: {
      width: 1600,
      height: 1600,
      quality: 80
    },
    // 响应数据处理,最终返回图片链接
    // handle response data，return image url
    uploadHandler (responseText) {
      const json = JSON.parse(responseText)
      if (json.status !== 200) {
        Message.error('图片上传失败')
      } else {
        return json.result.pic_cover
      }
    }
  }
})
