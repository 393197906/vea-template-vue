import {vue as Vue,vuex as Vuex} from "vea"
import service from '@/service/service'
import headPortraitDefault from '@/assets/images/meinv.jpg'

Vue.use(Vuex)
const state = {
  shopInfo: {
    avatar: '',
    shop_name: ''
  }
};

const mutations = {
  saveShopInfo (state, info) {
    state.shopInfo.avatar = info.avatar
    state.shopInfo.shop_name = info.shop_name
  }
}

const actions = {
  async getShopInfo ({commit}) {
    const res = await service.getSideInfo()
    commit('saveShopInfo', res.data.data)
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
