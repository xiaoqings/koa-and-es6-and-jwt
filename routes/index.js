import routers from 'koa-router'
import { DataCommand, WhereMaker, PagingInfo } from "../api/dataService";
const api = routers();

const appID = "wx9c731e5a492c8790";
const appsecret = "126d2f2eed2cd2233f6a64de496c393b";

api.get('/', async (ctx, next) => {
    ctx.body={code:0,data:"请求成功"}
});

api.get('/json', async (ctx, next) => {
    let com = new DataCommand();
    try {
        let list = await com.query('select * from users');
        console.log(list);
        ctx.body={code:0,data:"请求成功",list}
    } finally {
        com.end();
    }
});

module.exports = api;