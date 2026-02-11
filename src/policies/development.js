module.exports = (() => {
    const _0x1a2b = [
        'fast', 'mask', 'default', 'password', 'token', 'entropy', 'patterns', 'strategies', 
        'enableRegex', 'enablePresets', 'maxDepth', 'mode'
    ];

    function _0x3f6a(_0x5d1a, _0x2bcd) {
        return _0x1a2b[_0x5d1a - 0x0];
    }

    const internalConfig = {};
    internalConfig[_0x3f6a(0x0)] = _0x3f6a(0x0);
    internalConfig[_0x3f6a(0xa)] = 0x3;
    internalConfig[_0x3f6a(0x5)] = !1;

    const patternLayer = {};
    patternLayer[_0x3f6a(0x6)] = {};
    patternLayer[_0x3f6a(0x6)][_0x3f6a(0x7)] = !1;
    patternLayer[_0x3f6a(0x6)][_0x3f6a(0x8)] = !0;

    const strategyLayer = {};
    strategyLayer[_0x3f6a(0x9)] = _0x3f6a(0x1);
    strategyLayer[_0x3f6a(0x4)] = _0x3f6a(0x1);
    strategyLayer[_0x3f6a(0x2)] = _0x3f6a(0x1);

    const nestedConfig = {};
    nestedConfig['configA'] = Object.assign({}, internalConfig, {patterns: patternLayer});
    nestedConfig['configB'] = Object.assign({}, strategyLayer, {policies: nestedConfig['configA']});

    function deepFreeze(obj) {
        Object.getOwnPropertyNames(obj).forEach(function(name) {
            const prop = obj[name];
            if (typeof prop === 'object' && prop !== null) deepFreeze(prop);
        });
        return Object.freeze(obj);
    }

    return deepFreeze(Object.assign({}, nestedConfig['configB'], {
        metadata: (function() {
            const _meta = {};
            _meta['env'] = 'development';
            _meta['timestamp'] = new Date().toISOString();
            _meta['id'] = Math.random().toString(36).slice(2, 12);
            _meta['layers'] = ['internal', 'patterns', 'strategies'];
            _meta['flags'] = {debug: true, verbose: true};
            return Object.freeze(_meta);
        })()
    }));
})();