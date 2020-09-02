class Rvue {
  constructor (options) {
    this.$data = options.data
    this.vm = this
    this.initData(this.$data)
  }
  initData (value) {
    var keys = Object.keys(value)
    for (var i = 0; i < keys.length; i++) {
      // 将data转化为this.xx方式进行访问或者赋值
      this.proxy(this.vm, '$data', keys[i])
    }
    new Observer(value)
  }
  proxy (obj, source, key) {
    Object.defineProperty(obj, key, {
      get: function () {
        return obj[source][key]
      },
      set: function (val) {
        obj[source][key] = val
      }
    })
  }

}


class Observer {
  constructor (data) {
    var keys = Object.keys(data)
    for (var i = 0; i < keys.length; i++) {
      this.defineReactive(data, keys[i], data[keys[i]])
    }
  }

  // 定义数据响应式
  defineReactive (data, key, val) {    
    Object.defineProperty(data, key, {
      get: function () {
        return val
      },
      set: function (newVal) {
        val = newVal
        
      }
    })
  }
}

// 定义依赖收集， 只要有get的地方都需要添加dep
class Dep {

}