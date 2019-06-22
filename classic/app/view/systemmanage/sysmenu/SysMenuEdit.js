Ext.define("App.view.systemmanage.sysmenu.SysMenuEdit", {
    alias: "widget.sysmenuedit",
    extend: "Ext.window.Window",
    maximizable: true,
    autoShow: true,
    modal: true,
    width: 450,
    height: 550,
    layout: {
        type: 'vbox',
        align: "stretch",
    },
    items: [
        {
            xtype: "form",
            reference: "form",
            trackResetOnLoad: true,
            layout: "form",
            items: [
                {
                    xtype: "combobox",
                    reference: "comboType",
                    fieldLabel: "类型",
                    displayField: 'name',
                    valueField: 'id',
                    editable: false,
                    bind: {
                        value: "{typeValue}",
                        store: "{typeStore}"
                    },
                    listeners: {
                        change: "onComboTypeChange"
                    }
                },
                {
                    xtype: "combobox",
                    fieldLabel: "视图类型",
                    reference: "PageType",
                    displayField: 'name',
                    valueField: 'id',
                    editable: false,
                    value: "tab",
                    bind: {
                        store: "{pageTypeStore}",
                        value: "{model.PageType}"
                    }
                },
                {
                    xtype: "textfield",
                    fieldLabel: '页面类型',
                    allowBlank: false,
                    reference: "ViewType",
                    afterLabelTextTpl: config.AfterLabelTextRequired,
                    bind: "{model.ViewType}"
                },
                {
                    xtype: "textfield",
                    fieldLabel: '按钮编码',
                    reference: "Code",
                    bind: "{model.MenuCode}",
                    allowBlank: false,
                    afterLabelTextTpl: config.AfterLabelTextRequired
                },
                {
                    xtype: "textfield",
                    reference: "IconCls",
                    fieldLabel: "图标",
                    bind: "{model.IconCls}"
                },
                {
                    xtype: "textfield",
                    reference: "Name",
                    bind: {
                        value: "{model.MenuName}",
                        fieldLabel: '{fieldlabelName}'
                    },
                    allowBlank: false,
                    afterLabelTextTpl: config.AfterLabelTextRequired
                },
                {
                    xtype: "numberfield",
                    fieldLabel: '排序',
                    allowBlank: false,
                    reference: "Order",
                    bind: "{model.Order}",
                    afterLabelTextTpl: config.AfterLabelTextRequired
                },
                {
                    xtype: 'radiogroup',
                    fieldLabel: '是否启用',
                    bind: "{model.IsEnable}",
                    simpleValue: true,
                    items: [
                        { boxLabel: '启用', name: 'IsEnable', inputValue: 1, margin: "0 0 0 70", checked: true },
                        { boxLabel: '禁用', name: 'IsEnable', inputValue: 0, margin: "0 0 0 30" }
                    ]
                },
                {
                    xtype: 'textareafield',
                    fieldLabel: '描述',
                    bind: "{model.Description}"
                }
            ]

        }
    ],
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'bottom',
            ui: "footer",
            layout: {
                type: "hbox",
                align: "center",
                pack: "center"
            },
            items: [
                {
                    text: '保存',
                    iconCls: "x-fa fa-floppy-o",
                    handler: "onSave"
                },
                {
                    text: '重置',
                    iconCls: "x-fa fa-refresh",
                    handler: "onReset"
                }
            ]
        }
    ],
    listeners: {
        render: "onRender"
    },
    controller: {
        //保存
        onSave: function () {
            var me = this,
                view = me.getView(),
                refs = me.getReferences(),
                vm = me.getViewModel(),
                model = vm.get("model"),
                url,
                selNode = vm.get("selNode"),
                newNode,
                data={};
            if (refs.comboType.getValue() == 0) {
                data.SysMenuId = model.get("SysMenuId");
                data.ParentId = model.get("ParentId");
                data.MenuName = model.get("MenuName");
                data.IconCls = model.get("IconCls");
                data.Order = model.get("Order");
                data.ViewType = model.get("ViewType");
                data.PageType = model.get("PageType");
                data.IsEnable = model.get("IsEnable");
                data.Description = model.get("Description");
                url = view.status == "add" ? "/api/SystemManage/SysMenu/AddSysMenu" : "/api/SystemManage/SysMenu/EditSysMenu";
            } else {
                data.SysMenuButtonId = model.get("SysMenuId");
                data.MenuId = model.get("ParentId");
                data.BtnCode = model.get("MenuCode");
                data.BtnName = model.get("MenuName");
                data.Order = model.get("Order");
                data.IsEnable = model.get("IsEnable");
                data.Description = model.get("Description");
                url = view.status == "add" ? "/api/SystemManage/SysMenuButton/AddSysMenuButton" : url = "/api/SystemManage/SysMenuButton/EditSysMenuButton";
            }
            if (refs.comboType.getValue() == 0 && refs.Name.validate() && refs.Order.validate() && refs.ViewType.validate() && refs.PageType.validate() ||
                refs.comboType.getValue() == 1 && refs.Name.validate() && refs.Code.validate() && refs.Order.validate()) {
                App.Ajax.request({
                    url: url,
                    method:  (view.status == "add" ? "POST" : "PUT"),
                    nosim: false,
                    type: "JSON",
                    showmask: true,
                    maskmsg: "正在保存...",
                    params: data,
                    success: function (data) {
                        if (!Ext.isEmpty(data.Data)) {
                            if (view.status == "add") {
                                newNode = Ext.create("App.model.systemmanage.SysMenuButtonDetail",data.Data);
                                App.TreeNode.appendNode(selNode, newNode);
                            } else {
                                App.TreeNode.updateNode(selNode,data.Data);
                            }
                            App.Msg.Info("保存成功");
                            view.close();
                        } else {
                            App.Msg.Info("保存失败");
                        }
                    },
                    error: function (msg) {
                        App.Msg.Error(msg);
                    }
                })
            }
        },

        //重置
        onReset: function () {
            var me = this; me.getViewModel().get("model").reject();
        },

        //切换表单
        onComboTypeChange: function () {
            var me = this, refs = me.getReferences(), vm = me.getViewModel();
            if (refs.comboType.getValue() == 0) {
                refs.Code.hide();
                refs.ViewType.show();
                refs.PageType.show();
                refs.IconCls.show();
                vm.set("fieldlabelName", "菜单名称");
            } else {
                refs.Code.show();
                refs.ViewType.hide();
                refs.PageType.hide();
                refs.IconCls.hide();
                vm.set("fieldlabelName", "按钮名称");
            }
        },

        //呈现组件后触发
        onRender: function () {
            var me = this, refs = me.getReferences();
            if (me.getView().status == "edit") {
                refs.comboType.setDisabled(true);
            }
        }
    }
})