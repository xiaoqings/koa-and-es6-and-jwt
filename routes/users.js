import routers from 'koa-router'
import { DataCommand, WhereMaker, PagingInfo } from "../api/dataService";
const api = routers();

api.prefix('/users')

api.get('/', function(ctx, next) {
    ctx.body = 'this is a users response!'
});

api.get('/bar', function(ctx, next) {
    ctx.body = 'this is a users/bar response'
});

// 用户登录 
api.post('/userLogin', async ctx => {
    let { name, pwd } = ctx.request.body;
    if (!name || !pwd) { return ctx.body = { code: 401, data: { msg: "账号或者密码不能为空", errcode: 401 } } }
    let com = new DataCommand();
    try {
        let info = await com.query('select * from admin where name=? and pwd=md5(?)', [name, pwd]);
        if (info.length == 0) { return ctx.body = { code: 0, data: { msg: "账号或者密码错误", errcode: 401 } } }
        ctx.body = { code: 0, data: { msg: "登录成功", errcode: 0, info: info[0] } }
    } finally {
        com.end();
    }
});

module.exports = api;
