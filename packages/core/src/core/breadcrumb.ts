import {EVENTTYPES, USERWAYTYPES} from '@dawei-front/common';
import {validateOption, getTimestamp, _support} from '@dawei-front/utils';
import {UserWayData, InitOptions} from '@dawei-front/types';

export class Breadcrumb {
    maxBreadcrumbs = 20; // 用户行为存放的最大长度
    beforePushUserWay: unknown = null;
    stack: UserWayData[];
    constructor() {
        this.stack = [];
    }
    /**
     * 添加用户行为栈
     */
    push(data: UserWayData): void {
        if (typeof this.beforePushUserWay === 'function') {
            // 执行用户自定义的hook
            const result = this.beforePushUserWay(data) as UserWayData;
            if (!result) return;
            this.immediatePush(result);
            return;
        }
        this.immediatePush(data);
    }
    immediatePush(data: UserWayData): void {
        data.time || (data.time = getTimestamp());
        if (this.stack.length >= this.maxBreadcrumbs) {
            this.shift();
        }
        this.stack.push(data);
        this.stack.sort((a, b) => a.time - b.time);
    }
    shift(): boolean {
        return this.stack.shift() !== undefined;
    }
    clear(): void {
        this.stack = [];
    }
    getStack(): UserWayData[] {
        return this.stack;
    }
    getCategory(type: EVENTTYPES): USERWAYTYPES {
        switch (type) {
            // 接口请求
            case EVENTTYPES.XHR:
            case EVENTTYPES.FETCH:
                return USERWAYTYPES.HTTP;

            // 用户点击
            case EVENTTYPES.CLICK:
                return USERWAYTYPES.CLICK;

            // 路由变化
            case EVENTTYPES.HISTORY:
            case EVENTTYPES.HASHCHANGE:
                return USERWAYTYPES.ROUTE;

            // 加载资源
            case EVENTTYPES.RESOURCE:
                return USERWAYTYPES.RESOURCE;

            // Js代码报错
            case EVENTTYPES.UNHANDLEDREJECTION:
            case EVENTTYPES.ERROR:
                return USERWAYTYPES.CODEERROR;

            // 用户自定义
            default:
                return USERWAYTYPES.CUSTOM;
        }
    }
    bindOptions(options: InitOptions): void {
        // maxBreadcrumbs 用户行为存放的最大容量
        // beforePushUserWay 添加用户行为前的处理函数
        const {maxBreadcrumbs, beforePushUserWay} = options;
        validateOption(maxBreadcrumbs, 'maxBreadcrumbs', 'number') && (this.maxBreadcrumbs = maxBreadcrumbs || 20);
        validateOption(beforePushUserWay, 'beforePushUserWay', 'function') &&
            (this.beforePushUserWay = beforePushUserWay);
    }
}
const breadcrumb = _support.breadcrumb || (_support.breadcrumb = new Breadcrumb());
export {breadcrumb};
