import {setFlag, _support} from './global';
import {EVENTTYPES} from '@dawei-front/common';

/**
 * 返回包含id、class、innerTextde字符串的标签
 * @param target html节点
 */
export function htmlElementAsString(target: HTMLElement): string {
    const tagName = target.tagName.toLowerCase();
    if (tagName === 'body') {
        return '';
    }
    let classNames = target.classList.value;

    classNames = classNames !== '' ? ` class='${classNames}'` : '';
    const id = target.id ? ` id="${target.id}"` : '';
    const innerText = target.innerText;
    return `<${tagName}${id}${classNames !== '' ? classNames : ''}>${innerText}</${tagName}>`;
}
/**
 * 将地址字符串转换成对象，
 * 输入：'https://www.baidu.com/test/dawei?age=19&name=dawei'
 * 输出：{
 *  "host": "www.baidu.com",
 *  "path": "/test/dawei",
 *  "protocol": "https",
 *  "relative": "test/dawei?age=19&name=dawei"
 * }
 */
export function parseUrlToObj(url: string) {
    if (!url) {
        return {};
    }
    const match = url.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
    if (!match) {
        return {};
    }
    const query = match[6] || '';
    const fragment = match[8] || '';
    return {
        host: match[4],
        path: match[5],
        protocol: match[2],
        relative: match[5] + query + fragment
    };
}
// 设置初始化时候的flag
export function setSilentFlag({
    silentXhr = true,
    silentFetch = true,
    silentClick = true,
    silentHistory = true,
    silentError = true,
    silentHashchange = true,
    silentUnhandledrejection = true,
    silentWhiteScreen = false
}): void {
    setFlag(EVENTTYPES.XHR, !silentXhr);
    setFlag(EVENTTYPES.FETCH, !silentFetch);
    setFlag(EVENTTYPES.CLICK, !silentClick);
    setFlag(EVENTTYPES.HISTORY, !silentHistory);
    setFlag(EVENTTYPES.ERROR, !silentError);
    setFlag(EVENTTYPES.HASHCHANGE, !silentHashchange);
    setFlag(EVENTTYPES.UNHANDLEDREJECTION, !silentUnhandledrejection);
    setFlag(EVENTTYPES.WHITESCREEN, !silentWhiteScreen);
}

// 对每一个错误详情，生成唯一的编码
export function getErrorUid(input: string): string {
    return window.btoa(encodeURIComponent(input));
}

export function hashMapExist(hash: string): boolean {
    const exist = _support.errorMap.has(hash);
    if (!exist) {
        _support.errorMap.set(hash, true);
    }
    return exist;
}
