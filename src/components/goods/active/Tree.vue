<template>
  <el-table
    border
    :row-style="rowStyle"
    :data="tableData">
    <el-table-column
      align="center"
      width="200"
      label="销售区域">
      <template slot-scope="scope">
        <span class="name" v-if="scope.row.level.length===1" @click="changeOpen(scope.$index)"><i
          :class="scope.row.open?'el-icon-arrow-down':'el-icon-arrow-right'"/> {{scope.row.name}}</span>
        <span class="name" v-if="scope.row.level.length===2" @click="changeOpen(scope.$index)"
              style="padding-left: 50px"><i
          :class="scope.row.open?'el-icon-arrow-down':'el-icon-arrow-right'"/> {{scope.row.name}}</span>
        <span class="name" v-if="scope.row.level.length===3" style="padding-left: 100px">{{scope.row.name}}</span>
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      width="100"
      label="启用价格">
      <template slot-scope="scope">
        <el-switch v-model="scope.row.is_price"/>
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      width="100"
      label="区域价格">
      <template slot-scope="scope">
        <el-input-number v-if="scope.row.is_price" class="input" size="mini" :controls="false"
                         v-model="scope.row.price"/>
        <span v-if="!scope.row.is_price">{{"没有开启该区域价格"}}</span>
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      width="100"
      label="区域市场价">
      <template slot-scope="scope">
        <el-input-number v-if="scope.row.is_price" class="input" size="mini" :controls="false"
                         v-model="scope.row.market_price"/>
        <span v-if="!scope.row.is_price">{{"没有开启该区域价格"}}</span>
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      width="100"
      label="区域库存">
      <template slot-scope="scope">
        <el-input-number v-if="scope.row.is_price" class="input" size="mini" :controls="false"
                         v-model="scope.row.stock"/>
        <span v-if="!scope.row.is_price">{{"没有开启该区域价格"}}</span>
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      width="100"
      label="启用阶梯价">
      <template slot-scope="scope">
        <el-switch v-model="scope.row.is_ladder"/>
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      label="区域阶梯价格">
      <template slot-scope="scope">
        <div v-if="scope.row.is_ladder">
          <el-table
            border
            :data="scope.row.ladder">
            <el-table-column
              align="center"
              label="启始门槛(单位)">
              <template slot-scope="ladder_scope">
                <el-input-number class="input" size="mini" :controls="false" v-model="ladder_scope.row.from"/>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="结束门槛(单位)">
              <template slot-scope="ladder_scope">
                <el-input-number class="input" size="mini" :controls="false" v-model="ladder_scope.row.to"/>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="优惠价格">
              <template slot-scope="ladder_scope">
                <el-input-number class="input" size="mini" :controls="false" v-model="ladder_scope.row.price"/>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="100"
              label="操作">
              <template slot-scope="ladder_scope">
                <el-button size="mini" icon="el-icon-delete" @click="deleteLadder(scope.$index,ladder_scope.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="text-align: left;margin-top: 10px">
            <el-button size="mini" icon="el-icon-plus" @click="addLadder(scope.$index)">添加阶梯价</el-button>
            <span style="color: rgb(183,163,163)">最多只能添加三级阶梯价</span>
          </div>
        </div>
        <span v-if="!scope.row.is_ladder">{{"没有开启该区域阶梯价"}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  created () {
    const tableData = [
      {
        level: [1],
        open: false,
        id: '1',
        name: '山东省',
        is_price: false,
        price: 100,
        market_price: 0,
        stock: 0,
        is_ladder: false,
        ladder: [
          {
            from: 100,
            to: 200,
            price: 111
          }
        ]
      }
    ]
    this.tableData = tableData
  },
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    deleteLadder (parentIndex, index) {
      this.tableData[parentIndex].ladder = this.tableData[parentIndex].ladder.filter((item, i) => i !== index)
    },
    addLadder (index) {
      if (this.tableData[index].ladder.length < 3) {
        this.tableData[index].ladder.push({
          from: 0,
          to: 0,
          price: 0
        })
      }
    },
    changeOpen (rowIndex) {
      this.tableData[rowIndex].open = !this.tableData[rowIndex].open
    },
    rowStyle ({row, rowIndex}) {
      console.log('index', row)
      const close = {display: 'none'}
      return close
      // const {level} = row
      // if (level.length >= 2) {
      //   const i = level.length === 2 ? 0 : 1
      //   const parent = this.tableData.find(item => item.level[i] === level[i]) || {}
      //   const {open} = parent
      //   if (!open) {
      //     return close
      //   }
      //   if (i === 1) {
      //     const parent = this.tableData.find(item => item.level[0] === level[0]) || {}
      //     const {open} = parent
      //     if (!open) {
      //       return close
      //     }
      //   }
      // }
    }
  }
}
</script>
<style scoped>
  .input {
    width: 100%;
  }

  .name {
    cursor: pointer;
  }
</style>
