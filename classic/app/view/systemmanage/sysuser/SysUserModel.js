Ext.define("App.view.systemmanage.sysuser.SysUserModel", {
    extend: 'Ext.app.ViewModel',
    alias: "viewmodel.sysuser",
    stores: {
        gridstore: {
            type: "systemmanage.sysuser.gridstore"
        },

        isenablestore: {
            type: "comm.isenablestore"
        }
    }
})