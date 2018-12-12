import bodyParser from 'koa-bodyparser';
import jwt from 'jsonwebtoken';
import jwtKoa from 'koa-json';
import util from 'util';
import { dataConnection } from "./../webConfig";
const verify = util.promisify(jwt.verify) // 解密
const secret= dataConnection.secret;
const publicPath = ["/users"]; // 这里路由不用验证
/**
 * 判断token是否可用
 */
exports.token=function () {
    return async function (ctx, next) {
        let payload = "";
        const token = ctx.header.authorization; // 请求头uploads
        let url = ctx.request.url; //访问url
        if(!token && !publicPath.includes(url)){return ctx.body={code:401,data:{msg:"未授权访问",errcode:401}}}
        // 判断token 验证 逻辑下面
        // payload = await verify(token.split(' ')[1], secret);   // 获取token里面的信息
        await next();
    }
}
