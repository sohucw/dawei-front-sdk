import {
    subscribeEvent,
    notify,
    transportData,
    breadcrumb,
    options,
    handleOptions,
    log,
    setupReplace,
    HandleEvents
} from './core/index';

import {_global, getFlag, setFlag, nativeTryCatch} from '@dawei-front/utils';
import {SDK_VERSION, SDK_NAME, EVENTTYPES} from '@dawei-front/common';
import {InitOptions, VueInstance, ViewModel} from '@dawei-front/types';

function init(options: InitOptions) {
    if (!options.url || !options.apikey) {
        return console.error(`缺少必须配置项：${!options.url ? 'url' : 'apikey'} `);
    }
    if (!('fetch' in _global)) return;
    // 初始化配置和参数格式校验
    handleOptions(options);
    // 初始化各个方法
    setupReplace();
}

function install(Vue: VueInstance, options: InitOptions) {
    if (getFlag(EVENTTYPES.VUE)) return;
    setFlag(EVENTTYPES.VUE, true);
    const handler = Vue.config.errorHandler;
    // vue项目在Vue.config.errorHandler中上报错误
    Vue.config.errorHandler = function (err: Error, vm: ViewModel, info: string): void {
        console.log(err);
        HandleEvents.handleError(err);
        if (handler) handler.apply(null, [err, vm, info]);
    };
    init(options);
}

// react项目在ErrorBoundary中上报错误
function errorBoundary(err: Error): void {
    if (getFlag(EVENTTYPES.REACT)) return;
    setFlag(EVENTTYPES.REACT, true);
    HandleEvents.handleError(err);
}

function use(plugin: any, option: any) {
    const instance = new plugin(option);
    if (
        !subscribeEvent({
            callback: (data) => {
                instance.transform(data);
            },
            type: instance.type
        })
    )
        return;
    nativeTryCatch(
        () => {
            // 数据上报， 用户行为， 配置信息， 发布消息
            instance.core({transportData, breadcrumb, options, notify});
        },
        // 可以忽略
        (error: any) => {
            console.error(error);
        }
    );
}

export default {
    SDK_VERSION,
    SDK_NAME,
    init,
    install,
    errorBoundary,
    use,
    log
};
