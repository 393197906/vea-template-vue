<template>
  <div class="Chartposition" v-loading="loading">
    <!--<div class="positionHidden">-->
    <!--<p></p>商品销售排行榜-->
    <!--</div>-->
      <div class="rankingList" v-for="(item,index) in ranking_list" :key="index">
        <div class="numberOne">
          <div v-if="index+1===1" class="numberOne_left ranking_num">{{index+1}}</div>
          <div v-else-if="index+1===2" class="numberTwo_left ranking_num">{{index+1}}</div>
          <div v-else-if="index+1===3" class="numberThree_left ranking_num">{{index+1}}</div>
          <div v-else class="ranking_num">{{index+1}}</div>

          <div class="numberOne_center">
            <div class="CenterLeft">{{item.goods_name}}</div>
            <div class="CenterRight">
              <img v-if="index+1===1" src="@/assets/images/firat_sale.png" alt="">
              <img v-else-if="index+1===2" src="@/assets/images/second_sale.png" alt="">
              <img v-else-if="index+1===3" src="@/assets/images/third_sale.png" alt="">
            </div>
          </div>
          <div class="numberOne_right">
            <span v-if="index+1===1" class="numberOne_left">{{item.real_sales}}</span>
            <span v-else-if="index+1===2" class="numberTwo_left">{{item.real_sales}}</span>
            <span v-else-if="index+1===3" class="numberThree_left">{{item.real_sales}}</span>
            <span v-else>{{item.real_sales}}</span>

          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'ranking',
  data () {
    return {
      loading: false,
      shop_id: 1,
      ranking_list: [],
      page: 1,
      pre_page: 10
    }
  },
  created () {
    this.saleRanking()
  },
  methods: {
    // 请求销售排行列表
    async saleRanking () {
      this.loading = true
      const {err, data} = await this.$service.assets.rankinglist({
        page: this.page,
        pre_page: this.pre_page
      })
      this.loading = false
      if (err) return
      this.ranking_list = data.result
    }
  }
}
</script>

<style scoped>
  .goods_tag {
    width: 98%;
    min-width: 1075px;
    padding: 10px;
    background: #f1f1f1;
    font-size: 14px;
  }

  .Chartposition {
    font-size: 14px;
    background: #fff;
    margin-top: 10px;
  }

  .positionHidden {
    height: 50px;
    font-size: 18px;
    font-weight: 600;
    line-height: 50px;
    color: #0072d2;
  }

  .positionHidden p {
    height: 30px;
    width: 4px;
    background: #0072d2;
    margin-right: 15px;
    float: left;
    margin-top: 10px;
  }

  /*排行榜*/
  .rankingList {
    height: 70px;
    border-bottom: 1px solid #eee;
  }

  .numberOne {
    height: 50px;
    padding: 10px;
    /*background:#ccc;*/
  }

  .ranking_num {
    float: left;
    height: 50px;
    width: 3.1%;
    text-align: center;
    line-height: 50px;
    border-right: 2px solid #eee;
  }

  .numberOne_left {
    font-size: 26px;
    font-weight: 600;
    color: #f44336;
  }

  .numberTwo_left {
    font-size: 22px;
    font-weight: 600;
    color: #ff9800;
  }

  .numberThree_left {
    font-size: 18px;
    font-weight: 600;
    color: #03a9f4;
  }

  .numberOne_center {
    width: 45%;
    float: left;
  }

  .numberOne_center .CenterLeft {
    float: left;
    margin-left: 15px;
    line-height: 50px;
    color: #126ae4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 40%;
  }

  .numberOne_center .CenterRight {
    float: right;
    margin-right: 20%;
    margin-top: 7px;

  }

  .numberOne_center .CenterRight img {
    width: 50px;
    border-radius: 100%;
  }

  .numberOne_right {
    float: left;
    margin-left: 10px;
    line-height: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 14%;
  }
</style>
