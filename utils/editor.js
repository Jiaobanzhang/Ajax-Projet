// 富文本编辑器
// 创建编辑器函数，创建工具栏函数
// 这个插件引入后，在全局暴露了一个 wangEditor 的属性
// 创建编辑器的函数，创建工具栏的函数
const { createEditor, createToolbar } = window.wangEditor

// 编辑器的配置对象
const editorConfig = {
    // 占位符提示文字
    placeholder: '发布文章内容...',
    // 当编辑器发生变化时，回调用这个 onChange 函数执行
    onChange(editor) {
        // 获得富文本内容对应的内容字符串
        const html = editor.getHtml()
        console.log('editor content', html)
        // 也可以同步到 <textarea>，原来的<p>标签中的信息不会被 form-serialize 收集
        // 为了后续能够快速搜集整个表单内容，要先做一个转换
        document.querySelector('.publish-content').value = html
    }
}

const editor = createEditor({
    // 我们这个富文本编辑器创建在具体哪个位置
    selector: '#editor-container',
    // 设置编辑器的默认内容
    html: '<p><br></p>',
    // 这里正式开始创建 editor,先传入 editor 的配置对象 editorConfig
    config: editorConfig,
    // 配置集成的模式
    mode: 'default', // or 'simple'
})

// 对工具栏进行配置
const toolbarConfig = {}

// 创建工具栏
const toolbar = createToolbar({
    // 为指定的编辑器创建工具栏
    editor,
    // 工具栏创建的位置
    selector: '#toolbar-container',
    // 工具栏配置对象
    config: toolbarConfig,
    // 配置集成模式
    mode: 'default', // or 'simple'
})