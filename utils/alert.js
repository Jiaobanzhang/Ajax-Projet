// 弹窗插件
// 需要先准备 alert 样式相关的 DOM
/**
 * BS 的 Alert 警告框函数，2秒后自动消失
 * @param {*} isSuccess 成功 true，失败 false
 * @param {*} msg 提示消息
 */

// 定义了一个 myAlert 的函数
function myAlert(isSuccess, msg) {
  // 获取到了 Html 中准备的 Alert 盒子
  const myAlert = document.querySelector('.alert')
  // 根据这个函数中被传入的参数 isSuccess 来判断是否成功传入，来进行 show 类型的传递
  myAlert.classList.add(isSuccess ? 'alert-success' : 'alert-danger')
  myAlert.innerHTML = msg
  myAlert.classList.add('show')

  setTimeout(() => {
    myAlert.classList.remove(isSuccess ? 'alert-success' : 'alert-danger')
    myAlert.innerHTML = ''
    // 在两秒之后要移除 show 类型
    myAlert.classList.remove('show')
  }, 2000)
}