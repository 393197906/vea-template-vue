<template>
  <div class="card_view">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" style="width:800px">
      <el-form-item label="体系名称" prop="price_type_name" size="small" style="width: 300px;">
        <el-input v-model="form.price_type_name" placeholder="请输入体系名称"></el-input>
      </el-form-item>
      <el-form-item label="是否开启">
        <el-switch v-model="form.status"></el-switch>
      </el-form-item>
      <el-form-item label="体系机制" size="small">
        <el-radio-group v-model="form.type">
          <el-radio-button label="10">分配渠道</el-radio-button>
          <el-radio-button label="11">分配门店</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="渠道类型" prop="type" v-show="parseInt(form.type)===10">
        <el-tree
          :data="service.channelData"
          show-checkbox
          default-expand-all
          node-key="channel_id"
          ref="channelTree"
          highlight-current
          :props="channelTreeProps">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <!--<span style="color: #8c939d">{{ node.description || '暂无简介' }}</span>-->
          </span>
        </el-tree>
      </el-form-item>
      <el-form-item label="已选用户" prop="type" v-show="parseInt(form.type)===11">
        <el-tag v-for="item in form.checkedStore" :key="item.id" closable
                hit @close="form.checkedStore=form.checkedStore.filter(fitem=>fitem.id !==item.id)">{{item.store_name}}
        </el-tag>
        <span v-if="!form.checkedStore.length" style="color: #8c939d">请在下面的用户表内选择您想分配的用户</span>
      </el-form-item>
      <el-form-item label="选择用户" prop="type" v-show="parseInt(form.type)===11">
        <div class="searcher">
          <div class="type-class">
            <span style="float:left;line-height: 50px;">用户名称：</span>
            <div class="type-class" style="width: 175px;">
              <el-input size="mini" v-model="store.store_name" placeholder="请输入用户名称"/>
            </div>
          </div>
          <div class="type-class">
            <span style="float:left;letter-spacing: 4px;line-height: 50px;">负责人：</span>
            <div class="type-class" style="width: 255px;">
              <el-input size="mini" v-model="store.store_person" placeholder="请输入负责人"/>
            </div>
          </div>
          <div class="type-class">
            <span style="float:left;line-height: 50px;">渠道类型：</span>
            <div class="type-class">
              <el-cascader
                clearable
                :props="{value: 'channel_id', label: 'channel_name'}"
                :options="channelItems"
                change-on-select
                size="mini"
                v-model="store.channel_id">
              </el-cascader>
            </div>
          </div>
          <div class="type-class">
            <span style="float:left;line-height: 50px;">注册时间：</span>
            <div class="type-class">
              <el-date-picker size="mini"
                              unlink-panels="true"
                              type="daterange" v-model="stratEndtime" value-format="yyyy-MM-dd"
                              range-separator="至"
                              start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div>
          <el-button size="mini" type="primary" @click="goStore" style="margin-left: 4.5%;margin-top: 13px;">搜 索
          </el-button>
          <!--<el-button @click="showSearch = !showSearch" size=" mini" type="info" icon="el-icon-more">更多搜索-->
          <!--</el-button>-->
        </div>
        <el-table
          :data="service.storeList">
          <el-table-column
            prop="store_name"
            label="用户名称"
            width="150">
          </el-table-column>
          <el-table-column
            align="center"
            prop="store_person"
            label="用户负责人"
            width="130">
          </el-table-column>
          <el-table-column
            align="center"
            prop="phone"
            width="130"
            label="用户电话">
          </el-table-column>
          <el-table-column
            align="center"
            prop="store_address"
            label="用户地址">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary"
                         v-if="form.checkedStore.find(item=>item.id ==scope.row.id)"
                         @click="form.checkedStore =form.checkedStore.filter(item=>item.id !==scope.row.id) ">
                已选
              </el-button>
              <el-button size="mini" v-else @click="form.checkedStore.push(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          style="text-align: center"
          layout="total,prev, pager, next"
          @current-change="storePageChange"
          :current-page="store.page"
          :page-size="store.pre_page"
          :total="store.total">
        </el-pagination>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submitForm('form')" :loading="loading">保存</el-button>
        <el-button size="small" @click="$router.back()">返回</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
  /**
   * 过滤已选
   * @param items
   * @returns {*}
   */
  const filterCheckedChannelId = (
    items,
    checkNodes = [],
    checkHalfNodes = []
  ) => {
    return items
      .map(item => {
        const {children} = item
        if (children && children.length) {
          return {
            ...item,
            children: filterCheckedChannelId(children, checkNodes, checkHalfNodes)
          }
        }
        return item
      })
      .filter(item => {
        const {channel_id} = item
        return (
          !!checkNodes.find(fItem => fItem.channel_id === channel_id) ||
          !!checkHalfNodes.find(fItem => fItem.channel_id === channel_id)
        )
      })
  }
  export default {
    data () {
      return {
        editDataStore: [],
        loading: false,
        form: {
          price_type_name: '',
          type: '10',
          status: false,
          checkedStore: []
        },
        rules: {
          price_type_name: [
            {required: true, message: '请输入体系名称', trigger: 'blur'}
          ]
        },
        service: {
          channelData: [],
          storeList: []
        },
        channelItems: [],
        stratEndtime: [],
        store: {
          page: 1,
          pre_page: 10,
          total: 1,
          store_name: '',
          store_person: '',
          channel_id: [],
          strat_time: '',
          end_time: ''
        },
        channelTreeProps: {
          children: 'children',
          label: 'channel_name'
        }
      }
    },
    async mounted () {
      this.getStoreList()
      this.service.channelData =
        (await this.getCanUseChannelList()) || this.service.channelData
      const {id} = this.$route.params
      if (id) {
        this.getDetail(id) || {}
      }
      this.getChannel()
    },

    methods: {
      async getDetail (id = 0) {
        const {err, data} = await this.$service.goods.pricing.pricing_detail(
          id
        )
        if (err) return
        this.form.status = parseInt(data.result.status) === 10 ? false : true
        this.form.price_type_name = data.result.price_type_name
        this.form.type = String(data.result.type)
        this.editDataStore = data.result.store_info || []
        //  如果是用户模式
        if (this.form.type == '11') {
          this.form.checkedStore = data.result.store_info.map(item => ({
            id: item.store_id,
            store_name: item.store_name
          }))
          return
        }
        const checkedNodes = data.result.channel_list.reduce((nodes, item) => {
          const {children = []} = item
          return [
            ...nodes,
            ...children.reduce((cnodes, citem) => {
              const {is_display, channel_id} = citem
              if (is_display) {
                cnodes.push(channel_id)
              }
              return cnodes
            }, [])
          ]
        }, [])

        if (this.$refs.channelTree) {
          this.$nextTick(() => {
            this.$refs.channelTree.setCheckedKeys(checkedNodes)
          })
        }
        const filterChannelList = (function test (items = [], canUseItems = []) {
          const filterCanUse = (node, items) => {
            return !!items.find(item => {
              const {children = [], channel_id} = item
              return (
                channel_id == node.channel_id || filterCanUse(node, children)
              )
            })
          }
          return items.reduce((nodes, item) => {
            let {children, is_display} = item
            if (children && children.length) {
              children = test(children, canUseItems)
            }
            if (
              is_display ||
              (filterCanUse(item, canUseItems) &&
                ((children && children.length) || children === undefined))
            ) {
              nodes.push({...item, children})
            }
            return nodes
          }, [])
        })(data.result.channel_list, this.service.channelData)
        this.service.channelData = filterChannelList
      },
      storePageChange (page) {
        this.store.page = page
        this.getStoreList()
      },
      //  获取可用渠道列表
      async getCanUseChannelList () {
        const {err, data} = await this.$service.channel.canUseChannelList()
        if (err) return
        return data.result
      },
      //  获取用户
      async getStoreList (params) {
        params = params || this.store
        const {id} = this.$route.params
        if (id) {
          params = {...params, price_type_id: id}
        }
        const {err, data} = await this.$service.goods.pricing.canUseStoreList(
          params
        )
        if (err) return
        this.service.storeList = data.result
        this.store.total = parseInt(data.total_count) || 0
      },
      //  渠道
      async getChannel () {
        const {err, data} = await this.$service.channel.list()
        if (err) return
        this.channelItems = data.result
      },
      //  提交
      submitForm (formName) {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            let status = this.form.status ? '11' : '10'
            let {store_id, channel_id} = function () {
              let store_id, channel_id
              if (parseInt(this.form.type) == 10) {
                const checkNodes = this.$refs.channelTree.getCheckedNodes()
                const checkHalfNodes = this.$refs.channelTree.getHalfCheckedNodes()
                // 过滤已选渠道
                const channel_id_array = filterCheckedChannelId(
                  this.service.channelData,
                  checkNodes,
                  checkHalfNodes
                )
                channel_id = JSON.stringify(channel_id_array)
              } else {
                store_id = this.form.checkedStore.map(item => item.id).join(',')
              }
              return {store_id, channel_id}
            }.bind(this)()

            if (store_id !== undefined && !store_id) {
              this.$message.error('请选择需要分配的用户')
              return
            }
            if (channel_id !== undefined && channel_id === '[]') {
              this.$message.error('请选择需要分配的渠道')
              return
            }
            // 匹配删除的store
            // const delete_id = (function () {
            //   const {id} = this.$route.params;
            //   if (id) {
            //     if (parseInt(this.form.type) == 10) {
            //       return this.editDataStore.map(item => item.store_id).join(",")
            //     } else {
            //       const stores = store_id.split(",");
            //       return this.editDataStore.filter((item) => {
            //         return !stores.find(ii => ii == item.store_id)
            //       }).map(item => item.store_id).join(",")
            //     }
            //   }
            // }.bind(this))();
            // //old storeid
            // const old_id = (function () {
            //   const {id} = this.$route.params;
            //   if (id) {
            //     if (parseInt(this.form.type) == 11) {
            //       const stores = store_id.split(",");
            //       return this.editDataStore.filter((item) => {
            //         return !!stores.find(ii => ii == item.store_id)
            //       }).map(item => item.store_id).join(",")
            //     }
            //   }
            // }.bind(this))();
            //
            // store_id = (function () {
            //   const {id} = this.$route.params;
            //   if (id) {
            //     if (parseInt(this.form.type) == 11) {
            //       const stores = store_id.split(",");
            //       return stores.filter((item) => {
            //         return !this.editDataStore.find(ii => ii.store_id == item)
            //       }).join(",")
            //     }
            //   }
            //   return store_id;
            // }.bind(this))();
            // console.log({store_id, old_id, delete_id});
            // return
            this.loading = true
            const {id} = this.$route.params
            const fetch = id
              ? this.$service.goods.pricing.pricing_edit.bind(this, id)
              : this.$service.goods.pricing.pricing_add
            const {checkedStore, ...params} = this.form
            const {err, data} = await fetch({
              ...params,
              store_id,
              channel_id,
              status
            })
            this.loading = false
            if (err) return
            this.$message({
              type: 'success',
              message: data.msg
            })
            this.$router.push({path: '/goods/pricing'})
          } else {
            return false
          }
        })
      },
      //  搜索用户
      goStore () {
        this.store.page = 1
        this.stratEndtime = this.stratEndtime || []
        const params = {
          ...this.store,
          strat_time: this.stratEndtime[0] || '',
          end_time: this.stratEndtime[1] || '',
          channel_id:
            this.store.channel_id[this.store.channel_id.length - 1] || ''
        }
        this.getStoreList(params)
      }
    }
  }
</script>
<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  /*  搜索  */
  .searcher {
    width: 100%;
    float: left;
    border: 1px dashed #dcdfe6;
    border-radius: 10px;
  }

  .type-class {
    float: left;
    margin-left: 10px;
    margin-top: 3px;
  }
</style>
