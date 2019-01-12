// 递归增加区域价
const recursion = function (data_old, data_new) {
  return data_new.map(item => {
    const index = data_old.findIndex(obj => obj.link_id === item.link_id)
    if (item.children && item.children.length > 0 && index !== -1) {
      item.children = recursion(data_old[index].children, item.children)
    }
    if (index !== -1) {
      return {
        'area_price': data_old[index].area_price,
        ...item
      }
    } else if (index == -1) {
      return item
    }
  })
}

let commonObject = {
  is_price: false,
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
// 继承区域价
const inherit = function (newData) {
  return newData.map(item => {
    const {children: itemChildren = []} = item
    const children = itemChildren.map(i => {
      const {children: iChildren = []} = i
      const children = iChildren.map(area => {
        if (!area.area_price) {
          return {...area, 'area_price': i.area_price || item.area_price || commonObject}
        }
        return area
      })
      if (!i.area_price) {
        return {...i, children, 'area_price': item.area_price || commonObject}
      }
      return {...i, children}
    })
    if (!item.area_price) {
      return {...item, children, 'area_price': {...commonObject, is_price: true}}
    }
    return {...item, children}
  })
}

export default (newData, oldData) => {
  const result = recursion(oldData, newData)
  const tine = Date.now()
  const data = inherit(result)
  return data
}
