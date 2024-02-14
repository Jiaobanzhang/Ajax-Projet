/**
 * 目标1：获取文章列表并展示
 *  1.1 准备查询参数对象
 *  1.2 获取文章列表数据
 *  1.3 展示到指定的标签结构中
 */
// 1.1 准备查询参数对象
const queryObj = {
    status: '', // 文章状态(1-待审核 2-审核通过) 空字符串 - 全部
    channel_id: '', // 文章频道 .id 空字符串-全部
    page: 1, // 当前页码
    per_page: 2 // 当前页面的条数
}
let totalCount = 0 // 保存文章总的条数

async function setArtileList() {
    // 1.2 获取文章列表数据
    const res = await axios({
        url: '/v1_0/mp/articles',
        // 这里的参数是放在 header 中的，是由请求拦截器进行携带的，所以这里不用写
        // 这里携带的是查询参数，所以使用params
        params: queryObj
    })

    // 1.3 展示到指定的标签结构中
    // 先判断一下这个有没有图片，没有的话就用默认图片，有点的话才用 数据中得到的 image[0 ]
    const htmlStr = res.data.results.map(item => `<tr>
    <td>
      <img src="${item.cover.type === 0 ? `https://img2.baidu.com/it/u=2640406343,1419332367&amp;fm=253&amp;fmt=auto&amp;app=138&amp;f=JPEG?w=708&amp;h=500` : item.cover.images[0]}" alt="">
    </td>
    <td>${item.title}</td>
    <td>
        ${item.status === 1 ? `<span class="badge text-bg-primary">待审核</span>` : `<span class="badge text-bg-success">审核通过</span>`}
    </td>
    <td>
      <span>${item.pubdate}</span>
    </td>
    <td>
      <span>${item.read_count}</span>
    </td>
    <td>
      <span>${item.comment_count}</span>
    </td>
    <td>
      <span>${item.like_count}</span>
    </td>
    <td data-id = "${item.id}">
      <i class="bi bi-pencil-square edit"></i>
      <i class="bi bi-trash3 del"></i>
    </td>
  </tr>`).join('')
    console.log(htmlStr)
    //   将连接好的字符串嵌入到 页面中
    document.querySelector('.art-list').innerHTML = htmlStr

    // 3.1 保存并设置文章总条数
    totalCount = res.data.total_count
    document.querySelector('.total-count').innerHTML = `共 ${totalCount} 条`
}
setArtileList()




/**
 * 目标2：筛选文章列表
 *  2.1 设置频道列表数据
 *  2.2 监听筛选条件改变，保存查询信息到查询参数对象
 *  2.3 点击筛选时，传递查询参数对象到服务器
 *  2.4 获取匹配数据，覆盖到页面展示
 */
// 2.1 设置频道列表数据
// 使用 async + await 来处理请求结果
async function setChannleList() {
    const res = await axios({
        url: '/v1_0/channels'
    })
    // console.log(res)
    // 使用 map 映射每一个频道对象,映射成这样的结构, join 的作用是把这些字符串拼接在一起
    const htmlStr = `<option value="" selected="">请选择文章频道</option>` + res.data.channels.map(item => `<option value="${item.id}">${item.name}</option>`).join('')
    console.log(htmlStr)
    document.querySelector('.form-select').innerHTML = htmlStr
}
// 网页运行后，默认调用一次这个函数，获得频道列表数据
setChannleList()

// 2.2 监听筛选条件改变，保存查询信息到查询参数对象
// 筛选过程中选定的数值 要绑定在 queryObj 这个统一的查询对象中，之所以这么做，不论是筛选操作还是分页操作，都把这些查询条件集中在一个查询对象中
// 这样的话，查询条件改变之后，影响查询对象里这些属性的值，之后调用 setArtileList 函数，就会带着最新的 查询条件到达服务器那边 获取符合条件的数据
// 筛选状态标记数字 -> change 事件 -> 绑定到查询参数对象上
// 遍历每一个单选框
document.querySelectorAll('.form-check-input').forEach(radio => {
    // 绑定改变事件
    radio.addEventListener('change', e => {
        // console.log(e.target.value)
        // 将这个状态数字绑定在唯一的查询对象中
        queryObj.status = e.target.value
    })
})
// 筛选频道 id -> change 事件中 -> 绑定到查询参数对象中
document.querySelector('.form-select').addEventListener('change', e => {
    // console.log(e.target.value)
    queryObj.channel_id = e.target.value
})

// 2.3 点击筛选时，传递查询参数对象到服务器
document.querySelector('.sel-btn').addEventListener('click', () => {
    // 2.4 获取匹配数据，覆盖到页面展示
    setArtileList()
})




/**
 * 目标3：分页功能
 *  3.1 保存并设置文章总条数 (在上面的setArtileList函数中)
 *  3.2 点击下一页，做临界值判断，并切换页码参数并请求最新数据
 *  3.3 点击上一页，做临界值判断，并切换页码参数并请求最新数据
 */
// 3.2 点击下一页，做临界值判断，并切换页码参数并请求最新数据
document.querySelector('.next').addEventListener('click', e => {
    // 当我们的当前页码小于 这个 totalCount / queryObj.per_page 的时候 最大的页码数时，点击按钮可以让这个页码增加
    if (queryObj.page < Math.ceil(totalCount / queryObj.per_page)) {
        queryObj.page++
        document.querySelector('.page-now').innerHTML = `第 ${queryObj.page} 页`
        setArtileList()
    }
})
// 3.3 点击上一页，做临界值判断，并切换页码参数并请求最新数据
document.querySelector('.last').addEventListener('click', e => {
    // 当我们的当前页码小于 这个 totalCount / queryObj.per_page 的时候 最大的页码数时，点击按钮可以让这个页码增加
    if (queryObj.page > 1) {
        queryObj.page--
        document.querySelector('.page-now').innerHTML = `第 ${queryObj.page} 页`
        setArtileList()
    }
})




/**
 * 目标4：删除功能
 *  4.1 关联文章 id 到删除图标 在上面的 setArtileList 函数中实现的
 *  4.2 点击删除时，获取文章 id
 *  4.3 调用删除接口，传递文章 id 到服务器
 *  4.4 重新获取文章列表，并覆盖展示
 *  4.5 删除最后一页的最后一条，需要自动向前翻页
 */
// 4.2 点击删除时，获取文章 id
document.querySelector('.art-list').addEventListener('click', async e => {
    // 判断点击的是删除元素
    if (e.target.classList.contains('del')) {
        // 定义要删除的 目标 Id
        const delId = e.target.parentNode.dataset.id
        // console.log(delId)
        // 4.3 调用删除接口，传递文章 id 到服务器
        const res = await axios({
            url: `/v1_0/mp/articles/${delId}`,
            method: 'DELETE'
        })
        console.log(res)
        // 4.4 重新获取文章列表，并覆盖展示
        setArtileList()
    }
})

