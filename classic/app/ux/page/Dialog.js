//视图
//弹窗基础类
Ext.define('App.ux.page.Dialog', {
    extend: 'Ext.window.Window',
    //引入类
    //同一项目中只需引入一次即可
    //requires: ['Ext.toolbar.Spacer', 'Ext.form.Label'],
    cls: 'ux-page-dialog-container',
    //自动显示
    autoShow: true,
    //cls
    //最大化显示
    maximized: true,
    //标题
    title: '提示',
    //标题居中显示
    titleAlign: 'center',
    //布局
    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },
    listeners: {
        show: function (obj, eOpts) {
            for (var i = 0; i < obj.tools.length; i++) {
                obj.tools[i].setHidden(true);
            }
        }
    }
});