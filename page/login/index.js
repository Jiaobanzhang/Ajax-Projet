/**
 * 目标1：验证码登录
 * 1.1 在 utils/request.js 配置 axios 请求基地址
 * 1.2 收集手机号和验证码数据
 * 1.3 基于 axios 调用验证码登录接口
 * 1.4 使用 Bootstrap 的 Alert 警告框反馈结果给用户
 */


// 1.2 收集手机号和验证码数据
// (1)先绑定点击事件
document.querySelector('.btn').addEventListener
    ('click', () => {
        const form = document.querySelector('.login-form')
        // 第一个参数传递的是 想要获取的表单元素对象, 第二个参数是常用的配置对象
        const data = serialize(form, { hash: true, empty: true })
        console.log(data)

        //1.3 基于 axios 调用验证码登录接口,定义要提交到哪一个地址
        axios({
            // 去接口文档去查看后端提供的地址栏
            url: '/v1_0/authorizations',
            method: 'POST',
            // 请求体：data 其实可以省略，因为 key 和 value 重名了
            data: data
        }).then(result => {
            // 1.4 使用 Bootstrap 的 Alert 警告框反馈结果给用户
            // 处理成功的结果，调用在 utils 中的函数，并且传递参数
            myAlert(true, '登陆成功')
            console.log(result)
            // 1.2 进入 then 就表示登录成功，保存 token 令牌字符串到本地，并跳转到内容列表页面
            // 在本地保存 token
            localStorage.setItem('token', result.data.token)
            // 使用定时器，延迟 1.5 秒后，再让这个页面发生跳转，让 Alert 警告框停留一会
            setTimeout(() => {
                // 并且跳转到 content 的 index 页面
                location.href = '../content/index.html'
            }, 1500)


        }).catch(error => {
            // 处理错误结果
            myAlert(false, error.response.data.message)
            console.dir(error.response.data.message)
        })
    })