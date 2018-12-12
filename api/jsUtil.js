export function jPromise(callback) {
    return new Promise((s, e) => {
        callback((err, ret) => {
            if (err) e(err);
            else s(ret);
        });
    });
}