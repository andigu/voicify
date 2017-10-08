export function encodeQueryData(base, obj) {
    let ret = [];
    for (let d in obj)
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(obj[d]));
    return base + "?" + ret.join('&');
}
