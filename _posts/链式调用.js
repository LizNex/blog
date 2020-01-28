class LazyManClass {
  constructor (name) {
    this.taskList = []
    this.name = name
    console.log(`Hi I am ${name}`)
    setTimeout(() => {
      this.start()
    }, 0)
  }

  eat (sth) {
    this.taskList.push(function () {
      console.log(`I am eating ${sth}`)
    })
    return this
  }
  sleep (s) {
    this.taskList.push(this.delay(s))
    return this
  }
  delay (s) {
    return () => {
      return new Promise((resolve, reject) => {
        console.log(`等待了${s}秒...`)
        resolve()
      }, s * 1000)
    }
  }
  sleepFirst (s) {
    this.taskList.unshift(this.delay(s))
    return this
  }
  async start () {
    for (let task of this.taskList) {
      await task()
    }
  }
}

function LazyMan (name) {
  return new LazyManClass(name).eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food')
}
LazyMan('Tony')
