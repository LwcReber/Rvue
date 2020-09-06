// return html
// new Compile('#app', vm)

class Compile {
  constructor(el, vm) {
    this.$vm = vm // data中的值
    this.$el = document.querySelector(el)// 模版根元素
    // 拿出根元素里面所有的元素
    if (this.$el) {
      this.$fragement = this.getFragement(this.$el)
      // 对元素进行编译
      
      // this.compile(this.$fragement)
      console.log(this.$el);
      
      // 拿到编译后的结果，重新绑定到根元素
      this.$el.appendChild(this.$fragement)
    }
  }

  getFragement (el) {    
    let fragments = document.createDocumentFragment()
    
    let child
    while (child = el.firstChild) {      
      
      fragments.appendChild(child)
    }
    
    return fragments
  }

  compile (node, vm) {   
    const childNodes = node.childNodes
    console.log(childNodes);
    
    Array.from(childNodes).forEach(node => {
      // 判断是节点还是有特定写法的节点
      console.log(node);
      // 元素
      if (node.nodeType === 1) {
        this.compileElm()
        // text类型是 {{}} 类型的表达式
      } else if (this.isExpress(node)) {
        console.log('表达式');
        // 开始查找在data中的数据，进行更新处理
        this.compileText(node)
      }
      // 递归子元素
      if (node.childNodes && node.childNodes.length) {
        this.compile(node, vm)
      }
    })
  }
  isExpress (node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }

  compileElm (el) {

  }

  compileText (node, reg, vm) {
    console.log(this.$vm);
    
    console.log(node.textContent);
    this.update(node, this.$vm, RegExp.$1, 'text')
  }

  update (node, vm, exp, dir) {
    let updatrFn = this[dir + 'Updator']
    updatrFn && updatrFn(node, vm[exp])
    // 做依赖收集, 关键
    new Watcher(vm, exp, function (val) {
      updatrFn && updatrFn(node, val)
    })
  }

  textUpdator (node, val) {
    node.textContent = val
  }
}
