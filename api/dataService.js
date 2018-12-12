import { dataConnection } from "../webConfig";
import mysql from 'mysql';

export class PagingInfo {
     _pageIndex = 0;

    /// <summary>
    /// 当前页码
    /// </summary>
    get pageIndex() {
        return this._pageIndex;
    }
    set pageIndex(value) {
        this._pageIndex = value;
        if (this._pageIndex < 0) this._pageIndex = 0;
    }

    _pageSize = 25;

    /// <summary>
    /// 每页大小
    /// </summary>
    get pageSize() {
        return this._pageSize;
    }
    set pageSize(value) {
        this._pageSize = value;
        if (this._pageSize < 0) this._pageSize = 0;
    }

    /// <summary>
    /// 页面总数
    /// </summary>
    get pageCount() {
        if (this.pageSize <= 0) return 1;
        return Math.ceil(this.itemCount / this.pageSize);
    }

    _itemCount = 0;

    /// <summary>
    /// 数据总数
    /// </summary>
    get itemCount() {
        return this._itemCount;
    }
    set itemCount(value) {
        this._itemCount = value;
        if (this._itemCount < 0) this._itemCount = 0;


        if (this.pageIndex < 0) this.pageIndex = 0;
        else if (this.pageIndex >= this.pageCount) this.pageIndex = this.pageCount - 1;
    }
    toJson() {
        return {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            pageCount: this.pageCount,
            itemCount: this.itemCount
        };
    }
}

export function jPromise(callback) {
    return new Promise((ps, pe) => {
        callback((e, d) => {
            if (e) pe(e);
            else ps(d);
        });
    });
}


export class DataCommand {
    connection;
    query(sql, params) {
        if (!this.connection) {
            this.connection = mysql.createConnection(dataConnection);
            this.connection.connect();
        }
        return jPromise(callback => this.connection.query(sql, params, callback));
    }

   beginTransaction (arr) {
        return new Promise((ps,pe)=>{
            this.connection.beginTransaction(async(err)=>{
                if(err) { throw err; }
                arr.map(async(v,index)=>{
                    this.connection.query(v.sql,v.params,async (e)=>{
                        if(e){
                            ps("error")
                            this.rollback();
                            throw new Error(e)
                        }
                        if(arr.length==index+1){
                            ps("ok")
                        }
                    })
                });
            });
        })
   }

   commit () {
    return new Promise((ps,pe)=>{
        this.connection.commit(async(errs)=>{
            if(errs){
                return connection.rollback(function() {
                    pe(e);
                    throw errs;
                });
            }
            ps("SUCCESS");
        });
    })
   }

   rollback () {
    return this.connection.rollback(function(errs) {
        if(errs){
            throw errs;
        }
    });
   }

    async pageQuery(sql, paging, params) {
        var cnt = await this.query(`select count(*) as cnt from (${sql}) as temp`, params);
        paging.itemCount = cnt[0].cnt;
        var start = paging.pageIndex * paging.pageSize;
        var rows = paging.pageSize;
        return await this.query(`${sql} limit ${start},${rows}`, params);
    }
    end() {
        this.connection && this.connection.end();
    }
}

export class WhereMaker {
    constructor(word) {
        this.defaultWord = word || "and";
    }
    wheres = [];
    values = [];
    defaultWord;
    add(key, ...args) {
        this.wheres.push(key);
        for (let arg of args) this.values.push(arg);
    }
    addValues(...args) {
        for (let arg of args) this.values.push(arg);
    }
    addWhere(where, link) {
        if (!where.wheres.length) return;
        this.wheres.push("(" + where.toSql(link) + ")");
        for (let arg of where.values) this.values.push(arg);
    }
    toSql(link) {
        if (!this.wheres.length) return "";
        if (!link) link = this.defaultWord;
        link = " " + link + " ";
        return this.wheres.join(link);
    }
    toWhere(link) {
        var sql = this.toSql(link);
        if (sql) sql = " where " + sql;
        return sql;
    }
}