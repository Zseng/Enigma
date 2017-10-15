'use strict';
/**
 * 反射板
*/
class Reflector {
  constructor () {
    // 反射板字母反射关系
    this.mapping = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'
      , 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  }
  // 随机设置反射板映射关系  (两两交换)
  shuffle (arr) {
    let copyArr = arr.slice()
    let map = {}
    let resultList = []
    let count = 0
    while (copyArr.length > 0) {
      if (map[arr[count]]) {
        count++
        continue
      }
      // 记录处理过的字母
      map[arr[count]] = true
      copyArr.splice(copyArr.indexOf(arr[count]), 1)       
      let randSeq = Math.round(Math.random() * (copyArr.length - 1))
      if (!map[copyArr[randSeq]]) {
        // 随机一个字母的位置
        let index = arr.indexOf(copyArr[randSeq])
        // 交换位置后放在对应位置上
        resultList[count] = copyArr[randSeq]
        resultList[index] = arr[count]
        // 已换的位置作标记
        map[copyArr[randSeq]] = true
        // 删除已经交换的字母
        copyArr.splice(randSeq, 1)
        count++
      }
    }
    this.mapping = resultList
  }
  getInfo () {
    return this
  }
  init () {
    // 打乱字母 生成随机的映射关系
    this.shuffle(this.mapping)
  }
}

/**
 * 转子  转子指标组默认为数组第一个位置
*/
class Roter extends Reflector {
  constructor () {
    super()
    // 用于表示该转子转动到哪儿了
    this.index = 0
    // 进位 该转子进位点
    this.carry = 0
  }
  // 顺时针旋
  cwRote (distance) {
    this.mapping = this.mapping.concat(this.mapping.splice(0, distance))
    this.index += distance
    while (this.index > 25) {
      this.index -= 26
    }
  }
  // 逆时针旋转
  acwRote (distance) {
    let len = this.mapping.length
    this.mapping = this.mapping.splice(len - distance, distance).concat(this.mapping)
    this.index -= distance
    while (this.index < 0) {
      this.index = 26 + this.index
    }
  }
  // 字母乱序 完全随机
  shuffle (arr) {
    let len = arr.length;
    for (let i = 0; i < len - 1; i++) {
      let idx = Math.floor(Math.random() * (len - i))
      let temp = arr[idx]
      arr[idx] = arr[len - i - 1]
      arr[len - i - 1] = temp
    }
    return arr
  }
  init () {
    // 打乱字母 生成随机的映射关系
    this.shuffle(this.mapping)
    // 生成 随机进位点
    this.carry = Math.round(Math.random() * 25)
  }
}

/**
 * 接线板
*/
class Plug {
  constructor() {
    this.mapping = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'
      , 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  }
  /**
   * 设置接线板 字母交换情况
   * 交换的数组 [['A', 'B'], ['C', 'D']]
  */
  init (changeArr) {
    changeArr.map(item => {
      if (item[0] === item[1]) {
        return
      }
      let frontIdx = this.mapping.indexOf(item[0])
      let nextIdx = this.mapping.indexOf(item[1])
      let middle = this.mapping[nextIdx]
      this.mapping[nextIdx] = this.mapping[frontIdx]
      this.mapping[frontIdx] = middle
    })
  }
}

/**
 * 英格玛机抽象类
*/
class Enigma {
  constructor () {
    this.reflector = new Reflector()
    this.plug = new Plug()
    this.roterArr = [new Roter(), new Roter(), new Roter()]
  }
  getInfo () {
    return this
  }
  /**
   * 设置接线板 字母交换情况
   * @changeArr  [['A', 'C']]  接线板转换情况
  */
  init (changeArr) {
    if (Object.prototype.toString.call(changeArr) !== '[object Array]') {
      return
    }
    this.reflector.init()
    this.plug.init(changeArr)
    this.roterArr.map(item => {
      item.init()
    })
  }
  /**
   * 设置转子排列顺序
   * @sort [0, 1, 2]   [2, 0, 1] 转子排列
  */
  sortRoter (sort) {
    let first = this.roterArr[sort[0]]
    let second = this.roterArr[sort[1]]
    let third = this.roterArr[sort[2]]
    this.roterArr = [first, second, third]
  }
  /**
   * 设置转子 指标 转子指标组当前转到哪个位置
   * @arr ['A', 'B', 'C']
   * */ 
  setRoterIndex (arr) {
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
      return
    }
    // 转动转子到指标所在位置
    let first = Math.abs(this.roterArr[0].mapping.indexOf(arr[0]))
    this.roterArr[0].cwRote(first)
    
    let second = Math.abs(this.roterArr[1].mapping.indexOf(arr[1]))
    this.roterArr[1].cwRote(second)
    
    let third = Math.abs(this.roterArr[2].mapping.indexOf(arr[2]))
    this.roterArr[2].cwRote(third)
  }
  inputChar (char) {
    let startArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'
    , 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    let input = char
    let output
    // 当前电流位置
    let current = startArr.indexOf(input)
    
    // 经过接线板
    output =  this.plug.mapping[current]
    input = output
    current = startArr.indexOf(input)

    // 经过第一个转轮
    output = this.roterArr[0].mapping[current]
    input = output
    current = startArr.indexOf(input)
    
    // 经过第二个转轮
    output = this.roterArr[1].mapping[current]
    input = output
    current = startArr.indexOf(input)
    
    // 经过第三个转轮
    output = this.roterArr[2].mapping[current]
    
    
    // 此时倒推回去    
    // 经过反射器
    input = output
    current = this.reflector.mapping.indexOf(input)
    output = startArr[current]

    // 经过第三个转轮
    input = output
    current = this.roterArr[2].mapping.indexOf(input)
    output = startArr[current]
    
    // 经过第二个转轮
    input = output
    current = this.roterArr[1].mapping.indexOf(input)
    output = startArr[current]

    // 经过第一个转轮
    input = output
    current = this.roterArr[0].mapping.indexOf(input)
    output = startArr[current]

    // 经过接线板
    input = output
    current = this.plug.mapping.indexOf(input)
    output = startArr[current]

    // 第一个转子顺时针转动1格
    this.roterArr[0].cwRote(1)
    // 第一个转子转到进位点
    if (this.roterArr[0].index == this.roterArr[0].carry) {
      // 第二个转子逆时针转动1格
      this.roterArr[1].acwRote(1)
    }
    // 第二个转子转到进位点
    if (this.roterArr[1].index == this.roterArr[1].carry) {
      // 第三个转子顺时针转动1格
      this.roterArr[2].cwRote(1)
    }
    
    return output 
  }
}

let enigma = new Enigma()
enigma.init([['A', 'C'], ['B', 'Z'], ['T', 'F'], ['O', 'E']])
enigma.sortRoter([2, 1, 0])
enigma.setRoterIndex(['A', 'B', 'C'])

let out = enigma.inputChar('H')
let out_2 = enigma.inputChar('E')
let out_3 = enigma.inputChar('L')
let out_4 = enigma.inputChar('L')
let out_5 = enigma.inputChar('O')
console.log(out)
console.log(out_2)
console.log(out_3)
console.log(out_4)
console.log(out_5)

console.log('====华丽分界线=====')

enigma.setRoterIndex(['A', 'B', 'C'])
console.log(enigma.inputChar(out))
console.log(enigma.inputChar(out_2))
console.log(enigma.inputChar(out_3))
console.log(enigma.inputChar(out_4))
console.log(enigma.inputChar(out_5))


