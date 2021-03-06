/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'
import config from '../config'

let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  // 这里的方法才是真正用来收集依赖的方法 收集到的观察者都会被添加到subs数组中存起来
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  // removeSub (sub: Watcher) {
  //   remove(this.subs, sub)
  // }

  // 收集依赖
  depend () {
    // 为什么这里还要做一次判断呢？
    // 因为depend 方法还在其他地方被调用。
    if (Dep.target) {
      // 通过Watcher的实例的方法来收集依赖
      Dep.target.addDep(this)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null
const targetStack = []

export function pushTarget (_target: ?Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  // Dep.target 是 watcher
  Dep.target = _target
}

export function popTarget () {
  Dep.target = targetStack.pop()
}
