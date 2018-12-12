import { DataCommand, jAsync, PagingInfo } from "./dataService";

export async function dbUpdate(name, id, fields, idcol) {
    let map = new Map();
    for (var key in fields) {
        let val = fields[key];
        if (val === null || val === undefined) continue;
        map.set(key, val);
    }
    if (!map.size) return;

    let names = [], values = [];
    for (let o of map.keys()) {
        names.push('`' + o + "`=?");
        values.push(map.get(o));
    }
    values.push(id);

    let com = new DataCommand();
    try {
        return await com.query("update `" + name + "` set " + names.join(',') + " where " + (idcol || "id") + "=?", values);
    }
    finally {
        com.end();
    }
}

export async function doInsert(name, fields) {
    let map = new Map();
    for (var key in fields) {
        let val = fields[key];
        if (val === null || val === undefined) continue;
        map.set(key, val);
    }

    let names = [], values = [], querys = [];
    for (let o of map.keys()) {
        names.push('`' + o + "`");
        querys.push("?");
        values.push(map.get(o));
    }

    let com = new DataCommand();
    try {
        return await com.query("insert into `" + name + "` (" + names.join(',') + ") values (" + querys.join(',') + ")", values);
    }
    finally {
        com.end();
    }
}