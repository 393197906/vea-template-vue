<template>
    <div class="module-box">
        <p class="title">基本信息</p>

        <!-- 基本信息 -->
        <slot name="basicInfo"> </slot>
        <!-- // 基本信息 -->

        <p class="title">选择商品</p>

        <!-- 选择商品 -->
        <slot name="selectGoods"> </slot>
        <!-- // 选择商品 -->

        <!-- 底部确认出库按钮 -->
        <div class="confirm-outgoing" v-if="$slots.footerButton">
            <slot name="footerButton" > </slot>
        </div>
        <!-- // 底部确认出库按钮 -->

        <!--<detailsFrame>-->
            <!--&lt;!&ndash; 基本信息 slot="basicInfo"&ndash;&gt;-->

            <!--&lt;!&ndash; 商品信息 slot="selectGoods" &ndash;&gt;-->

            <!--&lt;!&ndash; 底部按钮 slot="footerButton" &ndash;&gt;-->
        <!--</detailsFrame>-->
    </div>
</template>

<script>
export default {
  name: 'details-frame',
  data () {
    return {
    }
  },
  created () {
    console.log(this.$slots)
    console.log(this.$slots.footerButton)
  }
}
</script>

<style scoped>
    .module-box {
        padding: 15px;
        background-color: #ffffff;
        padding-bottom: 65px;
    }
    .module-box .title {
        color: #333;
        font-size: 12px;
        line-height: 2;
        font-weight: 700;
        margin-bottom: 20px;
        border-bottom: 1px solid #e5e5e5;
    }

    /* 底部确认出库按钮 */
    .confirm-outgoing {
        width: calc(100% - 210px);
        height: 60px;
        line-height: 60px;
        text-align: center;
        background-color: #f9faff;
        position: fixed;
        z-index: 1999;
        bottom: 0;
        right: 0;
    }
</style>
