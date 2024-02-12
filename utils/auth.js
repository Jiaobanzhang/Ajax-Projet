// 权限插件（引入到了除登录页面，以外的其他所有页面）
/**
 * 目标1：访问权限控制
 * 1.1 判断无 token 令牌字符串，则强制跳转到登录页
 * 1.2 登录成功后，保存 token 令牌字符串到本地，并跳转到内容列表页面
 */

// 1.1 判断无 token 令牌字符串，则强制跳转到登录页
// localStorage 是指本地
const token = localStorage.getItem('token')
if (!token) {
    location.href = '../login/index.html'
}

// 1.2 登录成功后，保存 token 令牌字符串到本地，并跳转到内容列表页面 这个写在 login 中的 index.js 代码中




/**
 * 目标2：设置个人信息
 * 2.1 在 utils/request.js 设置请求拦截器(这个请求拦截器放在了 request.js 中，request.js 这个文件是用来存放公共请求的代码的)，统一携带 token
 * 2.2 请求个人信息并设置到页面
 */
// 2.2 请求个人信息并设置到页面
axios({
    // 请求的网址是：/v1_0/user/profile
    // 请求的方法默认是 get
    url: '/v1_0/user/profile'
}).then(result => {
    const username = result.data.mobile
    // console.log(result)
    // 获取右上角的昵称标签，并且把用户的值赋值给右上角的昵称标签
    document.querySelector('.nick-name').innerHTML = username
})






/**
 * 目标3：退出登录
 *  3.1 绑定点击事件
 *  3.2 清空本地缓存，跳转到登录页面
 */
