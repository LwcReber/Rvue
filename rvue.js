class Rvue {
  constructor (options) {
    this.$data = options.data
    this.vm = this
    new Watcher()
    this.initData(this.$data)
  }
  initData (value) {
    var keys = Object.keys(value)
    for (var i = 0; i < keys.length; i++) {
      // 将data转化为this.xx方式进行访问或者赋值
      this.proxyData(this.vm, '$data', keys[i])
    }
    new Observer(value)
  }
  // 添加代理
  proxyData (obj, source, key) {
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
    this.initData(data)
  }
  
  initData (data) {
    if (!data || typeof data !== 'object') {
      return
    }
    var keys = Object.keys(data)
    for (var i = 0; i < keys.length; i++) {
      this.defineReactive(data, keys[i], data[keys[i]])
    }
  }

  // 定义数据响应式
  defineReactive (data, key, val) { 
    let dep = new Dep()   
    Object.defineProperty(data, key, {
      get: function () {        
        // 进行依赖收集        
        Dep.target && dep.addDep(Dep.target)
        return val
      },
      set: function (newVal) {
        val = newVal
        // 数据更新时，对依赖收集进行更新
        dep.notify()
      }
    })
    // 递归处理，嵌套对象
    this.initData(data[key])
  }
}

// 定义依赖收集， 只要有get的地方都需要添加dep
class Dep {
  constructor () {
    this.deps = []
  }
  // 添加dep
  addDep (dep) {
    this.deps.push(dep)
  }
  removeDep (dep) {
    const index = this.deps.findIndex(dep)
    if (index > -1) {
      this.deps.splice(index, 1)
    }
  }
  // 通知相关依赖的watcher 更新页面
  notify () {    
    this.deps.map((dep) => {
      dep.update()
    })
  }
}


class Watcher {
  constructor () {
    Dep.target = this
  }
  update () {
    console.log('属性更新')
  }
}
