export default {
  data () {
    return {
      page: 1,
      page_size: 10,
      page_total: 100,
      goodsTypeOptions: [
        {
          value: 0,
          label: '鸡产品',
          children: [
            {value: 3, label: '琵琶腿'},
            {value: 4, label: '鸡边腿'}
          ]
        },
        {
          value: 1,
          label: '鸭产品',
          children: [
            {value: 5, label: '白条鸭'},
            {value: 6, label: '鸭边腿'}
          ]
        }
      ],
      SMToptions: [
        {value: 0, label: '上架'},
        {value: 1, label: '下架'}
      ]
    }
  },
  methods: {

    // 前往商品发布
    goToGoodAdd () {
      this.$router.push('/goods/add')
    }
  }
}
