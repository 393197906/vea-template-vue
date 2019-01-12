import tans from './tans'
import lodash from 'lodash'

const doAreaPrice = (area_price, open_price) => {
  let commonObject = {
    is_price: !!open_price,
    price: 0,
    market_price: 0,
    stock: 0,
    is_ladder: false,
    ladder: [
      {
        from: 0,
        to: 0,
        price: 0
      }
    ]
  }
  if (!area_price) {
    return commonObject
  }
  const {sales_price = 0, market_price = 0, stock = 0, ladder_price, is_price, is_ladder} = area_price
  return {
    price: sales_price,
    market_price,
    stock,
    // is_price: !!(sales_price || market_price || stock),
    // is_ladder: !!ladder_price,
    is_price: !!is_price,
    is_ladder: !!is_ladder,
    ladder: ladder_price || [
      {
        from: 0,
        to: 0,
        price: 0
      }
    ]
  }
}
// 处理编辑区域价数据与新销售区域不匹配的问题
export const matchRegionChange = (newArea, oldArea) => {
  try {
    return tans(lodash.cloneDeepWith(newArea), oldArea)
  } catch (e) {
    console.log('匹配价格出错了')
    console.error('匹配价格出错了')
    return oldArea
  }
}

export const treeToList = (data) => {
  const result = []
  for (let item of data) {
    const {link_id, province_id, province_name, children: children1 = [], area_price} = item
    // if (children1.length > 1) {
    result.push({
      link_id,
      level: [link_id],
      id: province_id,
      name: province_name,
      open: false,
      ...doAreaPrice(area_price, true)
    })
    // }
    for (let cityItem of children1) {
      const {city_id, city_name, link_id: link_id2, children: children2 = [], area_price} = cityItem
      // if (children2.length > 1 || children1.length > 1) {
      result.push({
        link_id: link_id2,
        level: [link_id, link_id2],
        id: city_id,
        name: `${city_name}`,
        open: false,
        ...doAreaPrice(area_price)
      })
      // console.log("item", cityItem);
      // }

      for (let areaItem of children2) {
        const {area_id, area_name, link_id: link_id3, area_price} = areaItem
        result.push({
          link_id: link_id3,
          level: [link_id, link_id2, link_id3],
          id: area_id,
          name: `${area_name}`,
          ...doAreaPrice(area_price)
        })
      }
    }
  }
  return result
}
