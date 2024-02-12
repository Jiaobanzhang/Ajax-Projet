// axios 公共请求配置，请求的是同一个后台，一次配置，所有的页面都会生效
axios.defaults.baseURL = 'http://geek.itheima.net'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // 统一携带 token 令牌字符串在 请求头上
    const token = localStorage.getItem('token')
    // 表示要在 token 的 请求头上携带 token 的参数名
    // Authorization 是请求头的参数名，Bearer ${token} 是请求参数的格式
    token && (config.headers.Authorization = `Bearer ${token}`)
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    const result = response.data
    return result;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么 例如：统一对 401 身份验证失败情况做出处理
    // 使用 console.dir 可以看到详细的 error 错误信息
    console.dir(error)
    if (error?.response?.status === 401) {
        alert('身份验证失败，请重新登陆')
        // 既然这个 token 是错的，那么就把这个缓存清除一下
        localStorage.clear()
        location.href = '../login/index.html'
    }
    return Promise.reject(error);
});

// 基地址