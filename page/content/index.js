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

async function setArtileList() {
    // 1.2 获取文章列表数据
    const res = await axios({
        url: '/v1_0/mp/articles',
        // 这里的参数是放在 header 中的，是由请求拦截器进行携带的，所以这里不用写
        // 这里携带的是查询参数，所以使用params
        params: queryObj
    })
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
    <td>
      <i class="bi bi-pencil-square edit"></i>
      <i class="bi bi-trash3 del"></i>
    </td>
  </tr>`).join('')
  console.log(htmlStr)
//   将连接好的字符串嵌入到 页面中
  document.querySelector('.art-list').innerHTML = htmlStr
}
setArtileList()




/**
 * 目标2：筛选文章列表
 *  2.1 设置频道列表数据
 *  2.2 监听筛选条件改变，保存查询信息到查询参数对象
 *  2.3 点击筛选时，传递查询参数对象到服务器
 *  2.4 获取匹配数据，覆盖到页面展示
 */

/**
 * 目标3：分页功能
 *  3.1 保存并设置文章总条数
 *  3.2 点击下一页，做临界值判断，并切换页码参数并请求最新数据
 *  3.3 点击上一页，做临界值判断，并切换页码参数并请求最新数据
 */

/**
 * 目标4：删除功能
 *  4.1 关联文章 id 到删除图标
 *  4.2 点击删除时，获取文章 id
 *  4.3 调用删除接口，传递文章 id 到服务器
 *  4.4 重新获取文章列表，并覆盖展示
 *  4.5 删除最后一页的最后一条，需要自动向前翻页
 */

// 点击编辑时，获取文章 id，跳转到发布文章页面传递文章 id 过去

