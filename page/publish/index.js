/**
 * 目标1：设置频道下拉菜单
 *  1.1 获取频道列表数据
 *  1.2 展示到下拉菜单中
 */
// 1.1 获取频道列表数据，并且展示，这个逻辑要进行复用，所以要进行封装
// 使用 async + await 来处理请求结果
async function setChannleList() {
    const res = await axios({
        url: '/v1_0/channels'
    })
    console.log(res)
    // 使用 map 映射每一个频道对象,映射成这样的结构, join 的作用是把这些字符串拼接在一起
    const htmlStr = `<option value="" selected="">请选择文章频道</option>` + res.data.channels.map(item => `<option value="${item.id}">${item.name}</option>`).join('')
    console.log(htmlStr)
    document.querySelector('.form-select').innerHTML = htmlStr
}
// 网页运行后，默认调用一次这个函数，获得频道列表数据
setChannleList()



/**
 * 目标2：文章封面设置
 *  2.1 准备标签结构和样式
 *  2.2 选择文件并保存在 FormData
 *  2.3 单独上传图片并得到图片 URL 网址
 *  2.4 回显并切换 img 标签展示（隐藏 + 号上传标签）
 */
// 2.2 选择文件并保存在 FormData,先获得这个标签，然后监听这个标签的 change 事件, 拿到事件对象 e
document.querySelector('.img-file').addEventListener('change', async e => {
    // 拿到用户选择的图片文件，files 属性的 第0个文件就是用户选择的对象
    const file = e.target.files[0]
    // 因为这里要传递的数据是 formdata, 所以在这里先新建一个 formdata 对象
    const fd = new FormData()
    // 'image' 是参数名 file 是文件对象
    fd.append('image', file)
    // 2.3 单独上传图片并得到图片 URL 网址
    // 注意：这里的 async 根据就近原则修饰的是 e 事件
    const res = await axios({
        url: '/v1_0/upload',
        method: 'POST',
        // 请求的位置是 body, 所以是data
        data: fd
    })
    console.log(res)
    // 2.4 回显并切换 img 标签展示（隐藏 + 号上传标签）
    // 从 服务器中拿到对应的图片地址
    const imgUrl = res.data.url
    // 将这个图片地址赋与这个 .rounded 这个图片的地址
    document.querySelector('.rounded').src = imgUrl
    // 添加显示标签，让 img 这个标签显示出来
    document.querySelector('.rounded').classList.add('show')
    document.querySelector('.place').classList.add('hide')
})

// 优化：点击 img 可以重新切换封面
// 思路：点击 img => 用 JS 方式触发 文件选择元素的 click 事件方法
document.querySelector('.rounded').addEventListener('click', () => {
    // 获取到文件选择的 input 表单元素的标签对象,并触发 click 事件，同时上面 document.querySelector('.img-file') 这个事件又重新调用了一下
    document.querySelector('.img-file').click()
})


/**
 * 目标3：发布文章保存
 *  3.1 基于 form-serialize 插件收集表单数据对象
 *  3.2 基于 axios 提交到服务器保存
 *  3.3 调用 Alert 警告框反馈结果给用户
 *  3.4 重置表单并跳转到列表页
 */
// 3.1 基于 form-serialize 插件收集表单数据对象
// 获取 send 标签
document.querySelector('.send').addEventListener('click', async e => {
    // 要获取 form 这个表单中的数据
    const form = document.querySelector('.art-form')
    const data = serialize(form, { hash: true, empty: true })
    console.log(data)
    // 发布文章的时候，不需要 id 属性，所以可以删除掉 (id 是为了后续做编辑使用)
    delete data.id
    console.log(data)
    // 因为 img 标签不是表单元素，所以没有办法被 form-serialize 收集，所以自己写代码将这个 封面图片加进去
    // 自己收集封面图片的地址并保存到 data 对象中去
    data.cover = {
        type: 1, // 封面类型
        images: [document.querySelector('.rounded').src] // 封面图片 URL 网址
    }

    // 3.2 基于 axios 提交到服务器保存
    // try-catch 用来捕获 axios 返回的错误信息
    try {
        const res = await axios({
            url: '/v1_0/mp/articles',
            method: 'POST',
            data: data
        })
        // 3.3 调用 Alert 警告框反馈结果给用户
        myAlert(true, '发布成功')
        // 3.4 重置表单并跳转到列表页, form.reset 只能清空表单元素，那么封面和内容应该怎么清空呢？
        form.reset()
        // 封面需要手动重置
        document.querySelector('.rounded').src = ''
        document.querySelector('.rounded').classList.remove('show')
        document.querySelector('.place').classList.remove('hide')
        // 富文本编辑器也要重置：
        editor.setHtml('')

        setTimeout(() => {
            location.href = '../content/index.html'
        }, 1500)

    } catch (error) {
        // 用来处理错误的情况，Alert 错误的信息
        // console.dir(error)
        myAlert(false, error.response.data.message)
    }
})


/**
 * 目标4：编辑-回显文章
 *  4.1 页面跳转传参（URL 查询参数方式）
 *  4.2 发布文章页面接收参数判断（共用同一套表单）
 *  4.3 修改标题和按钮文字
 *  4.4 获取文章详情数据并回显表单
 */

/**
 * 目标5：编辑-保存文章
 *  5.1 判断按钮文字，区分业务（因为共用一套表单）
 *  5.2 调用编辑文章接口，保存信息到服务器
 *  5.3 基于 Alert 反馈结果消息给用户
 */