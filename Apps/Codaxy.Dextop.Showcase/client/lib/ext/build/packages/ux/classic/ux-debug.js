/*
 Ext JS Library
 Copyright(c) 2006-2014 Sencha Inc.
 licensing@sencha.com
 http://www.sencha.com/license
 Ext JS Library
 Copyright(c) 2006-2015 Sencha Inc.
 licensing@sencha.com
 http://www.sencha.com/license
*/
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.defineProperty = typeof Object.defineProperties == 'function' ? Object.defineProperty : function(target, property, descriptor) {
  descriptor = (descriptor);
  if (target == Array.prototype || target == Object.prototype) {
    return;
  }
  target[property] = descriptor.value;
};
$jscomp.getGlobal = function(maybeGlobal) {
  return typeof window != 'undefined' && window === maybeGlobal ? maybeGlobal : typeof global != 'undefined' && global != null ? global : maybeGlobal;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(target, polyfill, fromLang, toLang) {
  if (!polyfill) {
    return;
  }
  var obj = $jscomp.global;
  var split = target.split('.');
  for (var i = 0; i < split.length - 1; i++) {
    var key = split[i];
    if (!(key in obj)) {
      obj[key] = {};
    }
    obj = obj[key];
  }
  var property = split[split.length - 1];
  var orig = obj[property];
  var impl = polyfill(orig);
  if (impl == orig || impl == null) {
    return;
  }
  $jscomp.defineProperty(obj, property, {configurable:true, writable:true, value:impl});
};
$jscomp.polyfill('Array.prototype.copyWithin', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, start, opt_end) {
    var len = this.length;
    target = Number(target);
    start = Number(start);
    opt_end = Number(opt_end != null ? opt_end : len);
    if (target < start) {
      opt_end = Math.min(opt_end, len);
      while (start < opt_end) {
        if (start in this) {
          this[target++] = this[start++];
        } else {
          delete this[target++];
          start++;
        }
      }
    } else {
      opt_end = Math.min(opt_end, len + start - target);
      target += opt_end - start;
      while (opt_end > start) {
        if (--opt_end in this) {
          this[--target] = this[opt_end];
        } else {
          delete this[target];
        }
      }
    }
    return this;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.SYMBOL_PREFIX = 'jscomp_symbol_';
$jscomp.initSymbol = function() {
  $jscomp.initSymbol = function() {
  };
  if (!$jscomp.global['Symbol']) {
    $jscomp.global['Symbol'] = $jscomp.Symbol;
  }
};
$jscomp.symbolCounter_ = 0;
$jscomp.Symbol = function(opt_description) {
  return ($jscomp.SYMBOL_PREFIX + (opt_description || '') + $jscomp.symbolCounter_++);
};
$jscomp.initSymbolIterator = function() {
  $jscomp.initSymbol();
  var symbolIterator = $jscomp.global['Symbol'].iterator;
  if (!symbolIterator) {
    symbolIterator = $jscomp.global['Symbol'].iterator = $jscomp.global['Symbol']('iterator');
  }
  if (typeof Array.prototype[symbolIterator] != 'function') {
    $jscomp.defineProperty(Array.prototype, symbolIterator, {configurable:true, writable:true, value:function() {
      return $jscomp.arrayIterator(this);
    }});
  }
  $jscomp.initSymbolIterator = function() {
  };
};
$jscomp.arrayIterator = function(array) {
  var index = 0;
  return $jscomp.iteratorPrototype(function() {
    if (index < array.length) {
      return {done:false, value:array[index++]};
    } else {
      return {done:true};
    }
  });
};
$jscomp.iteratorPrototype = function(next) {
  $jscomp.initSymbolIterator();
  var iterator = {next:next};
  iterator[$jscomp.global['Symbol'].iterator] = function() {
    return this;
  };
  return (iterator);
};
$jscomp.iteratorFromArray = function(array, transform) {
  $jscomp.initSymbolIterator();
  if (array instanceof String) {
    array = array + '';
  }
  var i = 0;
  var iter = {next:function() {
    if (i < array.length) {
      var index = i++;
      return {value:transform(index, array[index]), done:false};
    }
    iter.next = function() {
      return {done:true, value:void 0};
    };
    return iter.next();
  }};
  iter[Symbol.iterator] = function() {
    return iter;
  };
  return iter;
};
$jscomp.polyfill('Array.prototype.entries', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function() {
    return $jscomp.iteratorFromArray(this, function(i, v) {
      return [i, v];
    });
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Array.prototype.fill', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(value, opt_start, opt_end) {
    var length = this.length || 0;
    if (opt_start < 0) {
      opt_start = Math.max(0, length + (opt_start));
    }
    if (opt_end == null || opt_end > length) {
      opt_end = length;
    }
    opt_end = Number(opt_end);
    if (opt_end < 0) {
      opt_end = Math.max(0, length + opt_end);
    }
    for (var i = Number(opt_start || 0); i < opt_end; i++) {
      this[i] = value;
    }
    return this;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.findInternal = function(array, callback, thisArg) {
  if (array instanceof String) {
    array = (String(array));
  }
  var len = array.length;
  for (var i = 0; i < len; i++) {
    var value = array[i];
    if (callback.call(thisArg, value, i, array)) {
      return {i:i, v:value};
    }
  }
  return {i:-1, v:void 0};
};
$jscomp.polyfill('Array.prototype.find', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(callback, opt_thisArg) {
    return $jscomp.findInternal(this, callback, opt_thisArg).v;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Array.prototype.findIndex', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(callback, opt_thisArg) {
    return $jscomp.findInternal(this, callback, opt_thisArg).i;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Array.from', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(arrayLike, opt_mapFn, opt_thisArg) {
    $jscomp.initSymbolIterator();
    opt_mapFn = opt_mapFn != null ? opt_mapFn : function(x) {
      return x;
    };
    var result = [];
    var iteratorFunction = (arrayLike)[Symbol.iterator];
    if (typeof iteratorFunction == 'function') {
      arrayLike = iteratorFunction.call(arrayLike);
      var next;
      while (!(next = arrayLike.next()).done) {
        result.push(opt_mapFn.call((opt_thisArg), next.value));
      }
    } else {
      var len = arrayLike.length;
      for (var i = 0; i < len; i++) {
        result.push(opt_mapFn.call((opt_thisArg), arrayLike[i]));
      }
    }
    return result;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Object.is', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(left, right) {
    if (left === right) {
      return left !== 0 || 1 / left === 1 / (right);
    } else {
      return left !== left && right !== right;
    }
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Array.prototype.includes', function(orig) {
  if (orig) {
    return orig;
  }
  var includes = function(searchElement, opt_fromIndex) {
    var array = this;
    if (array instanceof String) {
      array = (String(array));
    }
    var len = array.length;
    for (var i = opt_fromIndex || 0; i < len; i++) {
      if (array[i] == searchElement || Object.is(array[i], searchElement)) {
        return true;
      }
    }
    return false;
  };
  return includes;
}, 'es7', 'es3');
$jscomp.polyfill('Array.prototype.keys', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function() {
    return $jscomp.iteratorFromArray(this, function(i) {
      return i;
    });
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Array.of', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(var_args) {
    return Array.from(arguments);
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Array.prototype.values', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function() {
    return $jscomp.iteratorFromArray(this, function(k, v) {
      return v;
    });
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.makeIterator = function(iterable) {
  $jscomp.initSymbolIterator();
  var iteratorFunction = (iterable)[Symbol.iterator];
  return iteratorFunction ? iteratorFunction.call(iterable) : $jscomp.arrayIterator((iterable));
};
$jscomp.EXPOSE_ASYNC_EXECUTOR = true;
$jscomp.FORCE_POLYFILL_PROMISE = false;
$jscomp.polyfill('Promise', function(NativePromise) {
  if (NativePromise && !$jscomp.FORCE_POLYFILL_PROMISE) {
    return NativePromise;
  }
  function AsyncExecutor() {
    this.batch_ = null;
  }
  AsyncExecutor.prototype.asyncExecute = function(f) {
    if (this.batch_ == null) {
      this.batch_ = [];
      this.asyncExecuteBatch_();
    }
    this.batch_.push(f);
    return this;
  };
  AsyncExecutor.prototype.asyncExecuteBatch_ = function() {
    var self = this;
    this.asyncExecuteFunction(function() {
      self.executeBatch_();
    });
  };
  var nativeSetTimeout = $jscomp.global['setTimeout'];
  AsyncExecutor.prototype.asyncExecuteFunction = function(f) {
    nativeSetTimeout(f, 0);
  };
  AsyncExecutor.prototype.executeBatch_ = function() {
    while (this.batch_ && this.batch_.length) {
      var executingBatch = this.batch_;
      this.batch_ = [];
      for (var i = 0; i < executingBatch.length; ++i) {
        var f = executingBatch[i];
        delete executingBatch[i];
        try {
          f();
        } catch (error) {
          this.asyncThrow_(error);
        }
      }
    }
    this.batch_ = null;
  };
  AsyncExecutor.prototype.asyncThrow_ = function(exception) {
    this.asyncExecuteFunction(function() {
      throw exception;
    });
  };
  var PromiseState = {PENDING:0, FULFILLED:1, REJECTED:2};
  var PolyfillPromise = function(executor) {
    this.state_ = PromiseState.PENDING;
    this.result_ = undefined;
    this.onSettledCallbacks_ = [];
    var resolveAndReject = this.createResolveAndReject_();
    try {
      executor(resolveAndReject.resolve, resolveAndReject.reject);
    } catch (e) {
      resolveAndReject.reject(e);
    }
  };
  PolyfillPromise.prototype.createResolveAndReject_ = function() {
    var thisPromise = this;
    var alreadyCalled = false;
    function firstCallWins(method) {
      return function(x) {
        if (!alreadyCalled) {
          alreadyCalled = true;
          method.call(thisPromise, x);
        }
      };
    }
    return {resolve:firstCallWins(this.resolveTo_), reject:firstCallWins(this.reject_)};
  };
  PolyfillPromise.prototype.resolveTo_ = function(value) {
    if (value === this) {
      this.reject_(new TypeError('A Promise cannot resolve to itself'));
    } else {
      if (value instanceof PolyfillPromise) {
        this.settleSameAsPromise_((value));
      } else {
        if (isObject(value)) {
          this.resolveToNonPromiseObj_((value));
        } else {
          this.fulfill_(value);
        }
      }
    }
  };
  PolyfillPromise.prototype.resolveToNonPromiseObj_ = function(obj) {
    var thenMethod = undefined;
    try {
      thenMethod = obj.then;
    } catch (error) {
      this.reject_(error);
      return;
    }
    if (typeof thenMethod == 'function') {
      this.settleSameAsThenable_(thenMethod, (obj));
    } else {
      this.fulfill_(obj);
    }
  };
  function isObject(value) {
    switch(typeof value) {
      case 'object':
        return value != null;
      case 'function':
        return true;
      default:
        return false;
    }
  }
  PolyfillPromise.prototype.reject_ = function(reason) {
    this.settle_(PromiseState.REJECTED, reason);
  };
  PolyfillPromise.prototype.fulfill_ = function(value) {
    this.settle_(PromiseState.FULFILLED, value);
  };
  PolyfillPromise.prototype.settle_ = function(settledState, valueOrReason) {
    if (this.state_ != PromiseState.PENDING) {
      throw new Error('Cannot settle(' + settledState + ', ' + valueOrReason | '): Promise already settled in state' + this.state_);
    }
    this.state_ = settledState;
    this.result_ = valueOrReason;
    this.executeOnSettledCallbacks_();
  };
  PolyfillPromise.prototype.executeOnSettledCallbacks_ = function() {
    if (this.onSettledCallbacks_ != null) {
      var callbacks = this.onSettledCallbacks_;
      for (var i = 0; i < callbacks.length; ++i) {
        (callbacks[i]).call();
        callbacks[i] = null;
      }
      this.onSettledCallbacks_ = null;
    }
  };
  var asyncExecutor = new AsyncExecutor;
  PolyfillPromise.prototype.settleSameAsPromise_ = function(promise) {
    var methods = this.createResolveAndReject_();
    promise.callWhenSettled_(methods.resolve, methods.reject);
  };
  PolyfillPromise.prototype.settleSameAsThenable_ = function(thenMethod, thenable) {
    var methods = this.createResolveAndReject_();
    try {
      thenMethod.call(thenable, methods.resolve, methods.reject);
    } catch (error) {
      methods.reject(error);
    }
  };
  PolyfillPromise.prototype.then = function(onFulfilled, onRejected) {
    var resolveChild;
    var rejectChild;
    var childPromise = new PolyfillPromise(function(resolve, reject) {
      resolveChild = resolve;
      rejectChild = reject;
    });
    function createCallback(paramF, defaultF) {
      if (typeof paramF == 'function') {
        return function(x) {
          try {
            resolveChild(paramF(x));
          } catch (error) {
            rejectChild(error);
          }
        };
      } else {
        return defaultF;
      }
    }
    this.callWhenSettled_(createCallback(onFulfilled, resolveChild), createCallback(onRejected, rejectChild));
    return childPromise;
  };
  PolyfillPromise.prototype['catch'] = function(onRejected) {
    return this.then(undefined, onRejected);
  };
  PolyfillPromise.prototype.callWhenSettled_ = function(onFulfilled, onRejected) {
    var thisPromise = this;
    function callback() {
      switch(thisPromise.state_) {
        case PromiseState.FULFILLED:
          onFulfilled(thisPromise.result_);
          break;
        case PromiseState.REJECTED:
          onRejected(thisPromise.result_);
          break;
        default:
          throw new Error('Unexpected state: ' + thisPromise.state_);
      }
    }
    if (this.onSettledCallbacks_ == null) {
      asyncExecutor.asyncExecute(callback);
    } else {
      this.onSettledCallbacks_.push(function() {
        asyncExecutor.asyncExecute(callback);
      });
    }
  };
  PolyfillPromise.resolve = function(opt_value) {
    if (opt_value instanceof PolyfillPromise) {
      return opt_value;
    } else {
      return new PolyfillPromise(function(resolve, reject) {
        resolve(opt_value);
      });
    }
  };
  PolyfillPromise.reject = function(opt_reason) {
    return new PolyfillPromise(function(resolve, reject) {
      reject(opt_reason);
    });
  };
  PolyfillPromise.race = function(thenablesOrValues) {
    return new PolyfillPromise(function(resolve, reject) {
      var iterator = $jscomp.makeIterator(thenablesOrValues);
      for (var iterRec = iterator.next(); !iterRec.done; iterRec = iterator.next()) {
        PolyfillPromise.resolve(iterRec.value).callWhenSettled_(resolve, reject);
      }
    });
  };
  PolyfillPromise.all = function(thenablesOrValues) {
    var iterator = $jscomp.makeIterator(thenablesOrValues);
    var iterRec = iterator.next();
    if (iterRec.done) {
      return PolyfillPromise.resolve([]);
    } else {
      return new PolyfillPromise(function(resolveAll, rejectAll) {
        var resultsArray = [];
        var unresolvedCount = 0;
        function onFulfilled(i) {
          return function(ithResult) {
            resultsArray[i] = ithResult;
            unresolvedCount--;
            if (unresolvedCount == 0) {
              resolveAll(resultsArray);
            }
          };
        }
        do {
          resultsArray.push(undefined);
          unresolvedCount++;
          PolyfillPromise.resolve(iterRec.value).callWhenSettled_(onFulfilled(resultsArray.length - 1), rejectAll);
          iterRec = iterator.next();
        } while (!iterRec.done);
      });
    }
  };
  if ($jscomp.EXPOSE_ASYNC_EXECUTOR) {
    PolyfillPromise['$jscomp$new$AsyncExecutor'] = function() {
      return new AsyncExecutor;
    };
  }
  return PolyfillPromise;
}, 'es6-impl', 'es3');
$jscomp.executeAsyncGenerator = function(generator) {
  function passValueToGenerator(value) {
    return generator.next(value);
  }
  function passErrorToGenerator(error) {
    return generator['throw'](error);
  }
  return new Promise(function(resolve, reject) {
    function handleGeneratorRecord(genRec) {
      if (genRec.done) {
        resolve(genRec.value);
      } else {
        Promise.resolve(genRec.value).then(passValueToGenerator, passErrorToGenerator).then(handleGeneratorRecord, reject);
      }
    }
    handleGeneratorRecord(generator.next());
  });
};
$jscomp.owns = function(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};
$jscomp.polyfill('WeakMap', function(NativeWeakMap) {
  function isConformant() {
    if (!NativeWeakMap || !Object.seal) {
      return false;
    }
    try {
      var x = Object.seal({});
      var y = Object.seal({});
      var map = new (NativeWeakMap)([[x, 2], [y, 3]]);
      if (map.get(x) != 2 || map.get(y) != 3) {
        return false;
      }
      map['delete'](x);
      map.set(y, 4);
      return !map.has(x) && map.get(y) == 4;
    } catch (err) {
      return false;
    }
  }
  if (isConformant()) {
    return NativeWeakMap;
  }
  var prop = '$jscomp_hidden_' + Math.random().toString().substring(2);
  function insert(target) {
    if (!$jscomp.owns(target, prop)) {
      var obj = {};
      $jscomp.defineProperty(target, prop, {value:obj});
    }
  }
  function patch(name) {
    var prev = Object[name];
    if (prev) {
      Object[name] = function(target) {
        insert(target);
        return prev(target);
      };
    }
  }
  patch('freeze');
  patch('preventExtensions');
  patch('seal');
  var index = 0;
  var PolyfillWeakMap = function(opt_iterable) {
    this.id_ = (index += Math.random() + 1).toString();
    if (opt_iterable) {
      $jscomp.initSymbol();
      $jscomp.initSymbolIterator();
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.set((item[0]), (item[1]));
      }
    }
  };
  PolyfillWeakMap.prototype.set = function(key, value) {
    insert(key);
    if (!$jscomp.owns(key, prop)) {
      throw new Error('WeakMap key fail: ' + key);
    }
    key[prop][this.id_] = value;
    return this;
  };
  PolyfillWeakMap.prototype.get = function(key) {
    return $jscomp.owns(key, prop) ? key[prop][this.id_] : undefined;
  };
  PolyfillWeakMap.prototype.has = function(key) {
    return $jscomp.owns(key, prop) && $jscomp.owns(key[prop], this.id_);
  };
  PolyfillWeakMap.prototype['delete'] = function(key) {
    if (!$jscomp.owns(key, prop) || !$jscomp.owns(key[prop], this.id_)) {
      return false;
    }
    return delete key[prop][this.id_];
  };
  return PolyfillWeakMap;
}, 'es6-impl', 'es3');
$jscomp.MapEntry = function() {
  this.previous;
  this.next;
  this.head;
  this.key;
  this.value;
};
$jscomp.ASSUME_NO_NATIVE_MAP = false;
$jscomp.polyfill('Map', function(NativeMap) {
  var isConformant = !$jscomp.ASSUME_NO_NATIVE_MAP && function() {
    if (!NativeMap || !NativeMap.prototype.entries || typeof Object.seal != 'function') {
      return false;
    }
    try {
      NativeMap = (NativeMap);
      var key = Object.seal({x:4});
      var map = new NativeMap($jscomp.makeIterator([[key, 's']]));
      if (map.get(key) != 's' || map.size != 1 || map.get({x:4}) || map.set({x:4}, 't') != map || map.size != 2) {
        return false;
      }
      var iter = map.entries();
      var item = iter.next();
      if (item.done || item.value[0] != key || item.value[1] != 's') {
        return false;
      }
      item = iter.next();
      if (item.done || item.value[0].x != 4 || item.value[1] != 't' || !iter.next().done) {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }();
  if (isConformant) {
    return NativeMap;
  }
  $jscomp.initSymbol();
  $jscomp.initSymbolIterator();
  var idMap = new WeakMap;
  var PolyfillMap = function(opt_iterable) {
    this.data_ = {};
    this.head_ = createHead();
    this.size = 0;
    if (opt_iterable) {
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = (entry).value;
        this.set((item[0]), (item[1]));
      }
    }
  };
  PolyfillMap.prototype.set = function(key, value) {
    var r = maybeGetEntry(this, key);
    if (!r.list) {
      r.list = this.data_[r.id] = [];
    }
    if (!r.entry) {
      r.entry = {next:this.head_, previous:this.head_.previous, head:this.head_, key:key, value:value};
      r.list.push(r.entry);
      this.head_.previous.next = r.entry;
      this.head_.previous = r.entry;
      this.size++;
    } else {
      r.entry.value = value;
    }
    return this;
  };
  PolyfillMap.prototype['delete'] = function(key) {
    var r = maybeGetEntry(this, key);
    if (r.entry && r.list) {
      r.list.splice(r.index, 1);
      if (!r.list.length) {
        delete this.data_[r.id];
      }
      r.entry.previous.next = r.entry.next;
      r.entry.next.previous = r.entry.previous;
      r.entry.head = null;
      this.size--;
      return true;
    }
    return false;
  };
  PolyfillMap.prototype.clear = function() {
    this.data_ = {};
    this.head_ = this.head_.previous = createHead();
    this.size = 0;
  };
  PolyfillMap.prototype.has = function(key) {
    return !!maybeGetEntry(this, key).entry;
  };
  PolyfillMap.prototype.get = function(key) {
    var entry = maybeGetEntry(this, key).entry;
    return (entry && (entry.value));
  };
  PolyfillMap.prototype.entries = function() {
    return makeIterator(this, function(entry) {
      return [entry.key, entry.value];
    });
  };
  PolyfillMap.prototype.keys = function() {
    return makeIterator(this, function(entry) {
      return entry.key;
    });
  };
  PolyfillMap.prototype.values = function() {
    return makeIterator(this, function(entry) {
      return entry.value;
    });
  };
  PolyfillMap.prototype.forEach = function(callback, opt_thisArg) {
    var iter = this.entries();
    var item;
    while (!(item = iter.next()).done) {
      var entry = item.value;
      callback.call((opt_thisArg), (entry[1]), (entry[0]), this);
    }
  };
  (PolyfillMap.prototype)[Symbol.iterator] = PolyfillMap.prototype.entries;
  var maybeGetEntry = function(map, key) {
    var id = getId(key);
    var list = map.data_[id];
    if (list && $jscomp.owns(map.data_, id)) {
      for (var index = 0; index < list.length; index++) {
        var entry = list[index];
        if (key !== key && entry.key !== entry.key || key === entry.key) {
          return {id:id, list:list, index:index, entry:entry};
        }
      }
    }
    return {id:id, list:list, index:-1, entry:undefined};
  };
  var makeIterator = function(map, func) {
    var entry = map.head_;
    return $jscomp.iteratorPrototype(function() {
      if (entry) {
        while (entry.head != map.head_) {
          entry = entry.previous;
        }
        while (entry.next != entry.head) {
          entry = entry.next;
          return {done:false, value:func(entry)};
        }
        entry = null;
      }
      return {done:true, value:void 0};
    });
  };
  var createHead = function() {
    var head = {};
    head.previous = head.next = head.head = head;
    return head;
  };
  var mapIndex = 0;
  var getId = function(obj) {
    var type = obj && typeof obj;
    if (type == 'object' || type == 'function') {
      obj = (obj);
      if (!idMap.has(obj)) {
        var id = '' + ++mapIndex;
        idMap.set(obj, id);
        return id;
      }
      return idMap.get(obj);
    }
    return 'p_' + obj;
  };
  return PolyfillMap;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.acosh', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    return Math.log(x + Math.sqrt(x * x - 1));
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.asinh', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x === 0) {
      return x;
    }
    var y = Math.log(Math.abs(x) + Math.sqrt(x * x + 1));
    return x < 0 ? -y : y;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.log1p', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x < 0.25 && x > -0.25) {
      var y = x;
      var d = 1;
      var z = x;
      var zPrev = 0;
      var s = 1;
      while (zPrev != z) {
        y *= x;
        s *= -1;
        z = (zPrev = z) + s * y / ++d;
      }
      return z;
    }
    return Math.log(1 + x);
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.atanh', function(orig) {
  if (orig) {
    return orig;
  }
  var log1p = Math.log1p;
  var polyfill = function(x) {
    x = Number(x);
    return (log1p(x) - log1p(-x)) / 2;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.cbrt', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    if (x === 0) {
      return x;
    }
    x = Number(x);
    var y = Math.pow(Math.abs(x), 1 / 3);
    return x < 0 ? -y : y;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.clz32', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x) >>> 0;
    if (x === 0) {
      return 32;
    }
    var result = 0;
    if ((x & 4294901760) === 0) {
      x <<= 16;
      result += 16;
    }
    if ((x & 4278190080) === 0) {
      x <<= 8;
      result += 8;
    }
    if ((x & 4026531840) === 0) {
      x <<= 4;
      result += 4;
    }
    if ((x & 3221225472) === 0) {
      x <<= 2;
      result += 2;
    }
    if ((x & 2147483648) === 0) {
      result++;
    }
    return result;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.cosh', function(orig) {
  if (orig) {
    return orig;
  }
  var exp = Math.exp;
  var polyfill = function(x) {
    x = Number(x);
    return (exp(x) + exp(-x)) / 2;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.expm1', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x < .25 && x > -.25) {
      var y = x;
      var d = 1;
      var z = x;
      var zPrev = 0;
      while (zPrev != z) {
        y *= x / ++d;
        z = (zPrev = z) + y;
      }
      return z;
    }
    return Math.exp(x) - 1;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.hypot', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x, y, var_args) {
    x = Number(x);
    y = Number(y);
    var i, z, sum;
    var max = Math.max(Math.abs(x), Math.abs(y));
    for (i = 2; i < arguments.length; i++) {
      max = Math.max(max, Math.abs(arguments[i]));
    }
    if (max > 1e100 || max < 1e-100) {
      x = x / max;
      y = y / max;
      sum = x * x + y * y;
      for (i = 2; i < arguments.length; i++) {
        z = Number(arguments[i]) / max;
        sum += z * z;
      }
      return Math.sqrt(sum) * max;
    } else {
      sum = x * x + y * y;
      for (i = 2; i < arguments.length; i++) {
        z = Number(arguments[i]);
        sum += z * z;
      }
      return Math.sqrt(sum);
    }
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.imul', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(a, b) {
    a = Number(a);
    b = Number(b);
    var ah = a >>> 16 & 65535;
    var al = a & 65535;
    var bh = b >>> 16 & 65535;
    var bl = b & 65535;
    var lh = ah * bl + al * bh << 16 >>> 0;
    return al * bl + lh | 0;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.log10', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return Math.log(x) / Math.LN10;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.log2', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return Math.log(x) / Math.LN2;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.sign', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    return x === 0 || isNaN(x) ? x : x > 0 ? 1 : -1;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.sinh', function(orig) {
  if (orig) {
    return orig;
  }
  var exp = Math.exp;
  var polyfill = function(x) {
    x = Number(x);
    if (x === 0) {
      return x;
    }
    return (exp(x) - exp(-x)) / 2;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.tanh', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x === 0) {
      return x;
    }
    var y = Math.exp(-2 * Math.abs(x));
    var z = (1 - y) / (1 + y);
    return x < 0 ? -z : z;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Math.trunc', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (isNaN(x) || x === Infinity || x === -Infinity || x === 0) {
      return x;
    }
    var y = Math.floor(Math.abs(x));
    return x < 0 ? -y : y;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Number.EPSILON', function(orig) {
  return Math.pow(2, -52);
}, 'es6-impl', 'es3');
$jscomp.polyfill('Number.MAX_SAFE_INTEGER', function() {
  return 9007199254740991;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Number.MIN_SAFE_INTEGER', function() {
  return -9007199254740991;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Number.isFinite', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    if (typeof x !== 'number') {
      return false;
    }
    return !isNaN(x) && x !== Infinity && x !== -Infinity;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Number.isInteger', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    if (!Number.isFinite(x)) {
      return false;
    }
    return x === Math.floor(x);
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Number.isNaN', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return typeof x === 'number' && isNaN(x);
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Number.isSafeInteger', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return Number.isInteger(x) && Math.abs(x) <= Number.MAX_SAFE_INTEGER;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Object.assign', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, var_args) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      if (!source) {
        continue;
      }
      for (var key in source) {
        if ($jscomp.owns(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('Object.entries', function(orig) {
  if (orig) {
    return orig;
  }
  var entries = function(obj) {
    var result = [];
    for (var key in obj) {
      if ($jscomp.owns(obj, key)) {
        result.push([key, obj[key]]);
      }
    }
    return result;
  };
  return entries;
}, 'es8', 'es3');
$jscomp.polyfill('Object.getOwnPropertySymbols', function(orig) {
  if (orig) {
    return orig;
  }
  return function() {
    return [];
  };
}, 'es6-impl', 'es5');
$jscomp.polyfill('Reflect.ownKeys', function(orig) {
  if (orig) {
    return orig;
  }
  var symbolPrefix = 'jscomp_symbol_';
  function isSymbol(key) {
    return key.substring(0, symbolPrefix.length) == symbolPrefix;
  }
  var polyfill = function(target) {
    var keys = [];
    var names = Object.getOwnPropertyNames(target);
    var symbols = Object.getOwnPropertySymbols(target);
    for (var i = 0; i < names.length; i++) {
      (isSymbol(names[i]) ? symbols : keys).push(names[i]);
    }
    return keys.concat(symbols);
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Object.getOwnPropertyDescriptors', function(orig) {
  if (orig) {
    return orig;
  }
  var getOwnPropertyDescriptors = function(obj) {
    var result = {};
    var keys = Reflect.ownKeys(obj);
    for (var i = 0; i < keys.length; i++) {
      result[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return result;
  };
  return getOwnPropertyDescriptors;
}, 'es8', 'es5');
$jscomp.polyfill('Object.setPrototypeOf', function(orig) {
  if (orig) {
    return orig;
  }
  if (typeof ''.__proto__ != 'object') {
    return null;
  }
  var polyfill = function(target, proto) {
    target.__proto__ = proto;
    if (target.__proto__ !== proto) {
      throw new TypeError(target + ' is not extensible');
    }
    return target;
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Object.values', function(orig) {
  if (orig) {
    return orig;
  }
  var values = function(obj) {
    var result = [];
    for (var key in obj) {
      if ($jscomp.owns(obj, key)) {
        result.push(obj[key]);
      }
    }
    return result;
  };
  return values;
}, 'es8', 'es3');
$jscomp.polyfill('Reflect.apply', function(orig) {
  if (orig) {
    return orig;
  }
  var apply = Function.prototype.apply;
  var polyfill = function(target, thisArg, argList) {
    return apply.call(target, thisArg, argList);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.construct', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, argList, opt_newTarget) {
    if (opt_newTarget === undefined) {
      opt_newTarget = target;
    }
    var proto = opt_newTarget.prototype || Object.prototype;
    var obj = Object.create(proto);
    var out = Reflect.apply(target, obj, argList);
    return out || obj;
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.defineProperty', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey, attributes) {
    try {
      Object.defineProperty(target, propertyKey, attributes);
      var desc = Object.getOwnPropertyDescriptor(target, propertyKey);
      if (!desc) {
        return false;
      }
      return desc.configurable === (attributes.configurable || false) && desc.enumerable === (attributes.enumerable || false) && ('value' in desc ? desc.value === attributes.value && desc.writable === (attributes.writable || false) : desc.get === attributes.get && desc.set === attributes.set);
    } catch (err) {
      return false;
    }
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.deleteProperty', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey) {
    if (!$jscomp.owns(target, propertyKey)) {
      return true;
    }
    try {
      return delete target[propertyKey];
    } catch (err) {
      return false;
    }
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.getOwnPropertyDescriptor', function(orig) {
  return orig || Object.getOwnPropertyDescriptor;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.getPrototypeOf', function(orig) {
  return orig || Object.getPrototypeOf;
}, 'es6', 'es5');
$jscomp.findDescriptor = function(target, propertyKey) {
  var obj = target;
  while (obj) {
    var property = Reflect.getOwnPropertyDescriptor(obj, propertyKey);
    if (property) {
      return property;
    }
    obj = Reflect.getPrototypeOf(obj);
  }
  return undefined;
};
$jscomp.polyfill('Reflect.get', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey, opt_receiver) {
    if (arguments.length <= 2) {
      return target[propertyKey];
    }
    var property = $jscomp.findDescriptor(target, propertyKey);
    if (property) {
      return property.get ? property.get.call(opt_receiver) : property.value;
    }
    return undefined;
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.has', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey) {
    return propertyKey in target;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.isExtensible', function(orig) {
  if (orig) {
    return orig;
  }
  if (typeof Object.isExtensible == 'function') {
    return Object.isExtensible;
  }
  return function() {
    return true;
  };
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.preventExtensions', function(orig) {
  if (orig) {
    return orig;
  }
  if (typeof Object.preventExtensions != 'function') {
    return function() {
      return false;
    };
  }
  var polyfill = function(target) {
    Object.preventExtensions(target);
    return !Object.isExtensible(target);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.set', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey, value, opt_receiver) {
    var property = $jscomp.findDescriptor(target, propertyKey);
    if (!property) {
      if (Reflect.isExtensible(target)) {
        target[propertyKey] = value;
        return true;
      }
      return false;
    }
    if (property.set) {
      property.set.call(arguments.length > 3 ? opt_receiver : target, value);
      return true;
    } else {
      if (property.writable && !Object.isFrozen(target)) {
        target[propertyKey] = value;
        return true;
      }
    }
    return false;
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.setPrototypeOf', function(orig) {
  if (orig) {
    return orig;
  }
  if (typeof ''.__proto__ != 'object') {
    return null;
  }
  var polyfill = function(target, proto) {
    try {
      target.__proto__ = proto;
      return target.__proto__ === proto;
    } catch (err) {
      return false;
    }
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.ASSUME_NO_NATIVE_SET = false;
$jscomp.polyfill('Set', function(NativeSet) {
  var isConformant = !$jscomp.ASSUME_NO_NATIVE_SET && function() {
    if (!NativeSet || !NativeSet.prototype.entries || typeof Object.seal != 'function') {
      return false;
    }
    try {
      NativeSet = (NativeSet);
      var value = Object.seal({x:4});
      var set = new NativeSet($jscomp.makeIterator([value]));
      if (!set.has(value) || set.size != 1 || set.add(value) != set || set.size != 1 || set.add({x:4}) != set || set.size != 2) {
        return false;
      }
      var iter = set.entries();
      var item = iter.next();
      if (item.done || item.value[0] != value || item.value[1] != value) {
        return false;
      }
      item = iter.next();
      if (item.done || item.value[0] == value || item.value[0].x != 4 || item.value[1] != item.value[0]) {
        return false;
      }
      return iter.next().done;
    } catch (err) {
      return false;
    }
  }();
  if (isConformant) {
    return NativeSet;
  }
  $jscomp.initSymbol();
  $jscomp.initSymbolIterator();
  var PolyfillSet = function(opt_iterable) {
    this.map_ = new Map;
    if (opt_iterable) {
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = (entry).value;
        this.add(item);
      }
    }
    this.size = this.map_.size;
  };
  PolyfillSet.prototype.add = function(value) {
    this.map_.set(value, value);
    this.size = this.map_.size;
    return this;
  };
  PolyfillSet.prototype['delete'] = function(value) {
    var result = this.map_['delete'](value);
    this.size = this.map_.size;
    return result;
  };
  PolyfillSet.prototype.clear = function() {
    this.map_.clear();
    this.size = 0;
  };
  PolyfillSet.prototype.has = function(value) {
    return this.map_.has(value);
  };
  PolyfillSet.prototype.entries = function() {
    return this.map_.entries();
  };
  PolyfillSet.prototype.values = function() {
    return this.map_.values();
  };
  PolyfillSet.prototype.keys = PolyfillSet.prototype.values;
  (PolyfillSet.prototype)[Symbol.iterator] = PolyfillSet.prototype.values;
  PolyfillSet.prototype.forEach = function(callback, opt_thisArg) {
    var set = this;
    this.map_.forEach(function(value) {
      return callback.call((opt_thisArg), value, value, set);
    });
  };
  return PolyfillSet;
}, 'es6-impl', 'es3');
$jscomp.checkStringArgs = function(thisArg, arg, func) {
  if (thisArg == null) {
    throw new TypeError("The 'this' value for String.prototype." + func + ' must not be null or undefined');
  }
  if (arg instanceof RegExp) {
    throw new TypeError('First argument to String.prototype.' + func + ' must not be a regular expression');
  }
  return thisArg + '';
};
$jscomp.polyfill('String.prototype.codePointAt', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(position) {
    var string = $jscomp.checkStringArgs(this, null, 'codePointAt');
    var size = string.length;
    position = Number(position) || 0;
    if (!(position >= 0 && position < size)) {
      return void 0;
    }
    position = position | 0;
    var first = string.charCodeAt(position);
    if (first < 55296 || first > 56319 || position + 1 === size) {
      return first;
    }
    var second = string.charCodeAt(position + 1);
    if (second < 56320 || second > 57343) {
      return first;
    }
    return (first - 55296) * 1024 + second + 9216;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('String.prototype.endsWith', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, 'endsWith');
    searchString = searchString + '';
    if (opt_position === void 0) {
      opt_position = string.length;
    }
    var i = Math.max(0, Math.min(opt_position | 0, string.length));
    var j = searchString.length;
    while (j > 0 && i > 0) {
      if (string[--i] != searchString[--j]) {
        return false;
      }
    }
    return j <= 0;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('String.fromCodePoint', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(var_args) {
    var result = '';
    for (var i = 0; i < arguments.length; i++) {
      var code = Number(arguments[i]);
      if (code < 0 || code > 1114111 || code !== Math.floor(code)) {
        throw new RangeError('invalid_code_point ' + code);
      }
      if (code <= 65535) {
        result += String.fromCharCode(code);
      } else {
        code -= 65536;
        result += String.fromCharCode(code >>> 10 & 1023 | 55296);
        result += String.fromCharCode(code & 1023 | 56320);
      }
    }
    return result;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('String.prototype.includes', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, 'includes');
    return string.indexOf(searchString, opt_position || 0) !== -1;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.polyfill('String.prototype.repeat', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(copies) {
    var string = $jscomp.checkStringArgs(this, null, 'repeat');
    if (copies < 0 || copies > 1342177279) {
      throw new RangeError('Invalid count value');
    }
    copies = copies | 0;
    var result = '';
    while (copies) {
      if (copies & 1) {
        result += string;
      }
      if (copies >>>= 1) {
        string += string;
      }
    }
    return result;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.stringPadding = function(padString, padLength) {
  var padding = padString !== undefined ? String(padString) : ' ';
  if (!(padLength > 0) || !padding) {
    return '';
  }
  var repeats = Math.ceil(padLength / padding.length);
  return padding.repeat(repeats).substring(0, padLength);
};
$jscomp.polyfill('String.prototype.padEnd', function(orig) {
  if (orig) {
    return orig;
  }
  var padEnd = function(targetLength, opt_padString) {
    var string = $jscomp.checkStringArgs(this, null, 'padStart');
    var padLength = targetLength - string.length;
    return string + $jscomp.stringPadding(opt_padString, padLength);
  };
  return padEnd;
}, 'es8', 'es3');
$jscomp.polyfill('String.prototype.padStart', function(orig) {
  if (orig) {
    return orig;
  }
  var padStart = function(targetLength, opt_padString) {
    var string = $jscomp.checkStringArgs(this, null, 'padStart');
    var padLength = targetLength - string.length;
    return $jscomp.stringPadding(opt_padString, padLength) + string;
  };
  return padStart;
}, 'es8', 'es3');
$jscomp.polyfill('String.prototype.startsWith', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, 'startsWith');
    searchString = searchString + '';
    var strLen = string.length;
    var searchLen = searchString.length;
    var i = Math.max(0, Math.min((opt_position) | 0, string.length));
    var j = 0;
    while (j < searchLen && i < strLen) {
      if (string[i++] != searchString[j++]) {
        return false;
      }
    }
    return j >= searchLen;
  };
  return polyfill;
}, 'es6-impl', 'es3');
$jscomp.arrayFromIterator = function(iterator) {
  var i;
  var arr = [];
  while (!(i = iterator.next()).done) {
    arr.push(i.value);
  }
  return arr;
};
$jscomp.arrayFromIterable = function(iterable) {
  if (iterable instanceof Array) {
    return iterable;
  } else {
    return $jscomp.arrayFromIterator($jscomp.makeIterator(iterable));
  }
};
$jscomp.inherits = function(childCtor, parentCtor) {
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor;
  childCtor.prototype.constructor = childCtor;
  for (var p in parentCtor) {
    if (Object.defineProperties) {
      var descriptor = Object.getOwnPropertyDescriptor(parentCtor, p);
      if (descriptor) {
        Object.defineProperty(childCtor, p, descriptor);
      }
    } else {
      childCtor[p] = parentCtor[p];
    }
  }
};
$jscomp.polyfill('WeakSet', function(NativeWeakSet) {
  function isConformant() {
    if (!NativeWeakSet || !Object.seal) {
      return false;
    }
    try {
      var x = Object.seal({});
      var y = Object.seal({});
      var set = new (NativeWeakSet)([x]);
      if (!set.has(x) || set.has(y)) {
        return false;
      }
      set['delete'](x);
      set.add(y);
      return !set.has(x) && set.has(y);
    } catch (err) {
      return false;
    }
  }
  if (isConformant()) {
    return NativeWeakSet;
  }
  var PolyfillWeakSet = function(opt_iterable) {
    this.map_ = new WeakMap;
    if (opt_iterable) {
      $jscomp.initSymbol();
      $jscomp.initSymbolIterator();
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.add(item);
      }
    }
  };
  PolyfillWeakSet.prototype.add = function(elem) {
    this.map_.set(elem, true);
    return this;
  };
  PolyfillWeakSet.prototype.has = function(elem) {
    return this.map_.has(elem);
  };
  PolyfillWeakSet.prototype['delete'] = function(elem) {
    return this.map_['delete'](elem);
  };
  return PolyfillWeakSet;
}, 'es6-impl', 'es3');
try {
  if (Array.prototype.values.toString().indexOf('[native code]') == -1) {
    delete Array.prototype.values;
  }
} catch (e) {
}
Ext.define('Ext.ux.Gauge', {extend:'Ext.Gadget', xtype:'gauge', requires:['Ext.util.Region'], config:{padding:10, trackStart:135, trackLength:270, angleOffset:0, minValue:0, maxValue:100, value:50, clockwise:true, textTpl:['\x3ctpl\x3e{value:number("0.00")}%\x3c/tpl\x3e'], textAlign:'c-c', trackStyle:{outerRadius:'100%', innerRadius:'100% - 20', round:false}, valueStyle:{outerRadius:'100% - 2', innerRadius:'100% - 18', round:false}, animation:true}, baseCls:Ext.baseCSSPrefix + 'gauge', template:[{reference:'bodyElement', 
children:[{reference:'textElement', cls:Ext.baseCSSPrefix + 'gauge-text'}]}], defaultBindProperty:'value', pathAttributes:{fill:true, fillOpacity:true, stroke:true, strokeOpacity:true, strokeWidth:true}, easings:{linear:Ext.identityFn, 'in':function(t) {
  return t * t * t;
}, out:function(t) {
  return --t * t * t + 1;
}, inOut:function(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}}, resizeDelay:0, resizeTimerId:0, size:null, svgNS:'http://www.w3.org/2000/svg', svg:null, defs:null, trackArc:null, valueArc:null, trackGradient:null, valueGradient:null, fx:null, fxValue:0, fxAngleOffset:0, constructor:function(config) {
  var me = this;
  me.fitSectorInRectCache = {startAngle:null, lengthAngle:null, minX:null, maxX:null, minY:null, maxY:null};
  me.interpolator = me.createInterpolator();
  me.callParent([config]);
  me.el.on('resize', 'onElementResize', me);
}, doDestroy:function() {
  var me = this;
  Ext.undefer(me.resizeTimerId);
  me.el.un('resize', 'onElementResize', me);
  me.stopAnimation();
  me.svg = Ext.destroy(me.svg);
  me.callParent();
}, afterComponentLayout:function(width, height, oldWidth, oldHeight) {
  this.callParent([width, height, oldWidth, oldHeight]);
  if (Ext.isIE9) {
    this.handleResize();
  }
}, onElementResize:function(element, size) {
  this.handleResize(size);
}, handleResize:function(size, instantly) {
  var me = this, el = me.element;
  if (!(el && (size = size || el.getSize()) && size.width && size.height)) {
    return;
  }
  me.resizeTimerId = Ext.undefer(me.resizeTimerId);
  if (!instantly && me.resizeDelay) {
    me.resizeTimerId = Ext.defer(me.handleResize, me.resizeDelay, me, [size, true]);
    return;
  }
  me.size = size;
  me.resizeHandler(size);
}, updateMinValue:function(minValue) {
  var me = this;
  me.interpolator.setDomain(minValue, me.getMaxValue());
  if (!me.isConfiguring) {
    me.render();
  }
}, updateMaxValue:function(maxValue) {
  var me = this;
  me.interpolator.setDomain(me.getMinValue(), maxValue);
  if (!me.isConfiguring) {
    me.render();
  }
}, updateAngleOffset:function(angleOffset, oldAngleOffset) {
  var me = this, animation = me.getAnimation();
  me.fxAngleOffset = angleOffset;
  if (!me.isConfiguring) {
    if (animation.duration) {
      me.animate(oldAngleOffset, angleOffset, animation.duration, me.easings[animation.easing], function(angleOffset) {
        me.fxAngleOffset = angleOffset;
        me.render();
      });
    } else {
      me.render();
    }
  }
}, applyTrackStart:function(trackStart) {
  if (trackStart < 0 || trackStart >= 360) {
    Ext.raise("'trackStart' should be within [0, 360).");
  }
  return trackStart;
}, applyTrackLength:function(trackLength) {
  if (trackLength <= 0 || trackLength > 360) {
    Ext.raise("'trackLength' should be within (0, 360].");
  }
  return trackLength;
}, updateTrackStart:function(trackStart) {
  var me = this;
  if (!me.isConfiguring) {
    me.render();
  }
}, updateTrackLength:function(trackLength) {
  var me = this;
  me.interpolator.setRange(0, trackLength);
  if (!me.isConfiguring) {
    me.render();
  }
}, applyPadding:function(padding) {
  if (typeof padding === 'string') {
    var ratio = parseFloat(padding) / 100;
    return function(x) {
      return x * ratio;
    };
  }
  return function() {
    return padding;
  };
}, updatePadding:function() {
  if (!this.isConfiguring) {
    this.render();
  }
}, applyValue:function(value) {
  var minValue = this.getMinValue(), maxValue = this.getMaxValue();
  return Math.min(Math.max(value, minValue), maxValue);
}, updateValue:function(value, oldValue) {
  var me = this, animation = me.getAnimation();
  me.fxValue = value;
  if (!me.isConfiguring) {
    me.writeText();
    if (animation.duration) {
      me.animate(oldValue, value, animation.duration, me.easings[animation.easing], function(value) {
        me.fxValue = value;
        me.render();
      });
    } else {
      me.render();
    }
  }
}, applyTextTpl:function(textTpl) {
  if (textTpl && !textTpl.isTemplate) {
    textTpl = new Ext.XTemplate(textTpl);
  }
  return textTpl;
}, updateTextTpl:function() {
  this.writeText();
  if (!this.isConfiguring) {
    this.centerText();
  }
}, writeText:function(options) {
  var me = this, value = me.getValue(), minValue = me.getMinValue(), maxValue = me.getMaxValue(), delta = maxValue - minValue, textTpl = me.getTextTpl();
  textTpl.overwrite(me.textElement, {value:value, percent:(value - minValue) / delta * 100, minValue:minValue, maxValue:maxValue, delta:delta});
}, centerText:function(cx, cy, sectorRegion, innerRadius, outerRadius) {
  var textElement = this.textElement, textAlign = this.getTextAlign(), alignedRegion, textBox;
  if (Ext.Number.isEqual(innerRadius, 0, 0.1) || sectorRegion.isOutOfBound({x:cx, y:cy})) {
    alignedRegion = textElement.getRegion().alignTo({align:textAlign, target:sectorRegion});
    textElement.setLeft(alignedRegion.left);
    textElement.setTop(alignedRegion.top);
  } else {
    textBox = textElement.getBox();
    textElement.setLeft(cx - textBox.width / 2);
    textElement.setTop(cy - textBox.height / 2);
  }
}, camelCaseRe:/([a-z])([A-Z])/g, camelToHyphen:function(name) {
  return name.replace(this.camelCaseRe, '$1-$2').toLowerCase();
}, applyTrackStyle:function(trackStyle) {
  var me = this, trackGradient;
  trackStyle.innerRadius = me.getRadiusFn(trackStyle.innerRadius);
  trackStyle.outerRadius = me.getRadiusFn(trackStyle.outerRadius);
  if (Ext.isArray(trackStyle.fill)) {
    trackGradient = me.getTrackGradient();
    me.setGradientStops(trackGradient, trackStyle.fill);
    trackStyle.fill = 'url(#' + trackGradient.getAttribute('id') + ')';
  }
  return trackStyle;
}, updateTrackStyle:function(trackStyle) {
  var me = this, trackArc = Ext.fly(me.getTrackArc()), name;
  for (name in trackStyle) {
    if (name in me.pathAttributes) {
      trackArc.setStyle(me.camelToHyphen(name), trackStyle[name]);
    }
  }
}, applyValueStyle:function(valueStyle) {
  var me = this, valueGradient;
  valueStyle.innerRadius = me.getRadiusFn(valueStyle.innerRadius);
  valueStyle.outerRadius = me.getRadiusFn(valueStyle.outerRadius);
  if (Ext.isArray(valueStyle.fill)) {
    valueGradient = me.getValueGradient();
    me.setGradientStops(valueGradient, valueStyle.fill);
    valueStyle.fill = 'url(#' + valueGradient.getAttribute('id') + ')';
  }
  return valueStyle;
}, updateValueStyle:function(valueStyle) {
  var me = this, valueArc = Ext.fly(me.getValueArc()), name;
  for (name in valueStyle) {
    if (name in me.pathAttributes) {
      valueArc.setStyle(me.camelToHyphen(name), valueStyle[name]);
    }
  }
}, getRadiusFn:function(radius) {
  var result, pos, ratio, increment = 0;
  if (Ext.isNumber(radius)) {
    result = function() {
      return radius;
    };
  } else {
    if (Ext.isString(radius)) {
      radius = radius.replace(/ /g, '');
      ratio = parseFloat(radius) / 100;
      pos = radius.search('%');
      if (pos < radius.length - 1) {
        increment = parseFloat(radius.substr(pos + 1));
      }
      result = function(radius) {
        return radius * ratio + increment;
      };
      result.ratio = ratio;
    }
  }
  return result;
}, getSvg:function() {
  var me = this, svg = me.svg;
  if (!svg) {
    svg = me.svg = Ext.get(document.createElementNS(me.svgNS, 'svg'));
    me.bodyElement.append(svg);
  }
  return svg;
}, getTrackArc:function() {
  var me = this, trackArc = me.trackArc;
  if (!trackArc) {
    trackArc = me.trackArc = document.createElementNS(me.svgNS, 'path');
    me.getSvg().append(trackArc, true);
    trackArc.setAttribute('class', Ext.baseCSSPrefix + 'gauge-track');
  }
  return trackArc;
}, getValueArc:function() {
  var me = this, valueArc = me.valueArc;
  me.getTrackArc();
  if (!valueArc) {
    valueArc = me.valueArc = document.createElementNS(me.svgNS, 'path');
    me.getSvg().append(valueArc, true);
    valueArc.setAttribute('class', Ext.baseCSSPrefix + 'gauge-value');
  }
  return valueArc;
}, getDefs:function() {
  var me = this, defs = me.defs;
  if (!defs) {
    defs = me.defs = document.createElementNS(me.svgNS, 'defs');
    me.getSvg().append(defs);
  }
  return defs;
}, setGradientSize:function(gradient, x1, y1, x2, y2) {
  gradient.setAttribute('x1', x1);
  gradient.setAttribute('y1', y1);
  gradient.setAttribute('x2', x2);
  gradient.setAttribute('y2', y2);
}, resizeGradients:function(size) {
  var me = this, trackGradient = me.getTrackGradient(), valueGradient = me.getValueGradient(), x1 = 0, y1 = size.height / 2, x2 = size.width, y2 = size.height / 2;
  me.setGradientSize(trackGradient, x1, y1, x2, y2);
  me.setGradientSize(valueGradient, x1, y1, x2, y2);
}, setGradientStops:function(gradient, stops) {
  var ln = stops.length, i, stopCfg, stopEl;
  while (gradient.firstChild) {
    gradient.removeChild(gradient.firstChild);
  }
  for (i = 0; i < ln; i++) {
    stopCfg = stops[i];
    stopEl = document.createElementNS(this.svgNS, 'stop');
    gradient.appendChild(stopEl);
    stopEl.setAttribute('offset', stopCfg.offset);
    stopEl.setAttribute('stop-color', stopCfg.color);
    'opacity' in stopCfg && stopEl.setAttribute('stop-opacity', stopCfg.opacity);
  }
}, getTrackGradient:function() {
  var me = this, trackGradient = me.trackGradient;
  if (!trackGradient) {
    trackGradient = me.trackGradient = document.createElementNS(me.svgNS, 'linearGradient');
    trackGradient.setAttribute('gradientUnits', 'userSpaceOnUse');
    me.getDefs().appendChild(trackGradient);
    Ext.get(trackGradient);
  }
  return trackGradient;
}, getValueGradient:function() {
  var me = this, valueGradient = me.valueGradient;
  if (!valueGradient) {
    valueGradient = me.valueGradient = document.createElementNS(me.svgNS, 'linearGradient');
    valueGradient.setAttribute('gradientUnits', 'userSpaceOnUse');
    me.getDefs().appendChild(valueGradient);
    Ext.get(valueGradient);
  }
  return valueGradient;
}, getArcPoint:function(centerX, centerY, radius, degrees) {
  var radians = degrees / 180 * Math.PI;
  return [centerX + radius * Math.cos(radians), centerY + radius * Math.sin(radians)];
}, isCircle:function(startAngle, endAngle) {
  return Ext.Number.isEqual(Math.abs(endAngle - startAngle), 360, 0.001);
}, getArcPath:function(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, round) {
  var me = this, isCircle = me.isCircle(startAngle, endAngle), endAngle = endAngle - 0.01, innerStartPoint = me.getArcPoint(centerX, centerY, innerRadius, startAngle), innerEndPoint = me.getArcPoint(centerX, centerY, innerRadius, endAngle), outerStartPoint = me.getArcPoint(centerX, centerY, outerRadius, startAngle), outerEndPoint = me.getArcPoint(centerX, centerY, outerRadius, endAngle), large = endAngle - startAngle <= 180 ? 0 : 1, path = ['M', innerStartPoint[0], innerStartPoint[1], 'A', innerRadius, 
  innerRadius, 0, large, 1, innerEndPoint[0], innerEndPoint[1]], capRadius = (outerRadius - innerRadius) / 2;
  if (isCircle) {
    path.push('M', outerEndPoint[0], outerEndPoint[1]);
  } else {
    if (round) {
      path.push('A', capRadius, capRadius, 0, 0, 0, outerEndPoint[0], outerEndPoint[1]);
    } else {
      path.push('L', outerEndPoint[0], outerEndPoint[1]);
    }
  }
  path.push('A', outerRadius, outerRadius, 0, large, 0, outerStartPoint[0], outerStartPoint[1]);
  if (round && !isCircle) {
    path.push('A', capRadius, capRadius, 0, 0, 0, innerStartPoint[0], innerStartPoint[1]);
  }
  path.push('Z');
  return path.join(' ');
}, resizeHandler:function(size) {
  var me = this, svg = me.getSvg();
  svg.setSize(size);
  me.resizeGradients(size);
  me.render();
}, createInterpolator:function(rangeCheck) {
  var domainStart = 0, domainDelta = 1, rangeStart = 0, rangeEnd = 1;
  var interpolator = function(x, invert) {
    var t = 0;
    if (domainDelta) {
      t = (x - domainStart) / domainDelta;
      if (rangeCheck) {
        t = Math.max(0, t);
        t = Math.min(1, t);
      }
      if (invert) {
        t = 1 - t;
      }
    }
    return (1 - t) * rangeStart + t * rangeEnd;
  };
  interpolator.setDomain = function(a, b) {
    domainStart = a;
    domainDelta = b - a;
    return this;
  };
  interpolator.setRange = function(a, b) {
    rangeStart = a;
    rangeEnd = b;
    return this;
  };
  interpolator.getDomain = function() {
    return [domainStart, domainStart + domainDelta];
  };
  interpolator.getRange = function() {
    return [rangeStart, rangeEnd];
  };
  return interpolator;
}, applyAnimation:function(animation) {
  if (true === animation) {
    animation = {};
  } else {
    if (false === animation) {
      animation = {duration:0};
    }
  }
  if (!('duration' in animation)) {
    animation.duration = 1000;
  }
  if (!(animation.easing in this.easings)) {
    animation.easing = 'out';
  }
  return animation;
}, updateAnimation:function() {
  this.stopAnimation();
}, animate:function(from, to, duration, easing, fn, scope) {
  var me = this, start = Ext.now(), interpolator = me.createInterpolator().setRange(from, to);
  function frame() {
    var now = Ext.AnimationQueue.frameStartTime, t = Math.min(now - start, duration) / duration, value = interpolator(easing(t));
    if (scope) {
      if (typeof fn === 'string') {
        scope[fn].call(scope, value);
      } else {
        fn.call(scope, value);
      }
    } else {
      fn(value);
    }
    if (t >= 1) {
      Ext.AnimationQueue.stop(frame, scope);
      me.fx = null;
    }
  }
  me.stopAnimation();
  Ext.AnimationQueue.start(frame, scope);
  me.fx = {frame:frame, scope:scope};
}, stopAnimation:function() {
  var me = this;
  if (me.fx) {
    Ext.AnimationQueue.stop(me.fx.frame, me.fx.scope);
    me.fx = null;
  }
}, unitCircleExtrema:{0:[1, 0], 90:[0, 1], 180:[-1, 0], 270:[0, -1], 360:[1, 0], 450:[0, 1], 540:[-1, 0], 630:[0, -1]}, getUnitSectorExtrema:function(startAngle, lengthAngle) {
  var extrema = this.unitCircleExtrema, points = [], angle;
  for (angle in extrema) {
    if (angle > startAngle && angle < startAngle + lengthAngle) {
      points.push(extrema[angle]);
    }
  }
  return points;
}, fitSectorInRect:function(width, height, startAngle, lengthAngle, ratio) {
  if (Ext.Number.isEqual(lengthAngle, 360, 0.001)) {
    return {cx:width / 2, cy:height / 2, radius:Math.min(width, height) / 2, region:new Ext.util.Region(0, width, height, 0)};
  }
  var me = this, points, xx, yy, minX, maxX, minY, maxY, cache = me.fitSectorInRectCache, sameAngles = cache.startAngle === startAngle && cache.lengthAngle === lengthAngle;
  if (sameAngles) {
    minX = cache.minX;
    maxX = cache.maxX;
    minY = cache.minY;
    maxY = cache.maxY;
  } else {
    points = me.getUnitSectorExtrema(startAngle, lengthAngle).concat([me.getArcPoint(0, 0, 1, startAngle), me.getArcPoint(0, 0, ratio, startAngle), me.getArcPoint(0, 0, 1, startAngle + lengthAngle), me.getArcPoint(0, 0, ratio, startAngle + lengthAngle)]);
    xx = points.map(function(point) {
      return point[0];
    });
    yy = points.map(function(point) {
      return point[1];
    });
    minX = Math.min.apply(null, xx);
    maxX = Math.max.apply(null, xx);
    minY = Math.min.apply(null, yy);
    maxY = Math.max.apply(null, yy);
    cache.startAngle = startAngle;
    cache.lengthAngle = lengthAngle;
    cache.minX = minX;
    cache.maxX = maxX;
    cache.minY = minY;
    cache.maxY = maxY;
  }
  var sectorWidth = maxX - minX, sectorHeight = maxY - minY, scaleX = width / sectorWidth, scaleY = height / sectorHeight, scale = Math.min(scaleX, scaleY), sectorRegion = new Ext.util.Region(minY * scale, maxX * scale, maxY * scale, minX * scale), rectRegion = new Ext.util.Region(0, width, height, 0), alignedRegion = sectorRegion.alignTo({align:'c-c', target:rectRegion}), dx = alignedRegion.left - minX * scale, dy = alignedRegion.top - minY * scale;
  return {cx:dx, cy:dy, radius:scale, region:alignedRegion};
}, fitSectorInPaddedRect:function(width, height, padding, startAngle, lengthAngle, ratio) {
  var result = this.fitSectorInRect(width - padding * 2, height - padding * 2, startAngle, lengthAngle, ratio);
  result.cx += padding;
  result.cy += padding;
  result.region.translateBy(padding, padding);
  return result;
}, normalizeAngle:function(angle) {
  return (angle % 360 + 360) % 360;
}, render:function() {
  if (!this.size) {
    return;
  }
  var me = this, trackArc = me.getTrackArc(), valueArc = me.getValueArc(), clockwise = me.getClockwise(), value = me.fxValue, angleOffset = me.fxAngleOffset, trackLength = me.getTrackLength(), width = me.size.width, height = me.size.height, paddingFn = me.getPadding(), padding = paddingFn(Math.min(width, height)), trackStart = me.normalizeAngle(me.getTrackStart() + angleOffset), trackEnd = trackStart + trackLength, valueLength = me.interpolator(value), trackStyle = me.getTrackStyle(), valueStyle = 
  me.getValueStyle(), sector = me.fitSectorInPaddedRect(width, height, padding, trackStart, trackLength, trackStyle.innerRadius.ratio), cx = sector.cx, cy = sector.cy, radius = sector.radius, trackInnerRadius = Math.max(0, trackStyle.innerRadius(radius)), trackOuterRadius = Math.max(0, trackStyle.outerRadius(radius)), valueInnerRadius = Math.max(0, valueStyle.innerRadius(radius)), valueOuterRadius = Math.max(0, valueStyle.outerRadius(radius)), trackPath = me.getArcPath(cx, cy, trackInnerRadius, trackOuterRadius, 
  trackStart, trackEnd, trackStyle.round), valuePath = me.getArcPath(cx, cy, valueInnerRadius, valueOuterRadius, clockwise ? trackStart : trackEnd - valueLength, clockwise ? trackStart + valueLength : trackEnd, valueStyle.round);
  me.centerText(cx, cy, sector.region, trackInnerRadius, trackOuterRadius);
  trackArc.setAttribute('d', trackPath);
  valueArc.setAttribute('d', valuePath);
}});
Ext.define('Ext.ux.ajax.Simlet', function() {
  var urlRegex = /([^?#]*)(#.*)?$/, dateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/, intRegex = /^[+-]?\d+$/, floatRegex = /^[+-]?\d+\.\d+$/;
  function parseParamValue(value) {
    var m;
    if (Ext.isDefined(value)) {
      value = decodeURIComponent(value);
      if (intRegex.test(value)) {
        value = parseInt(value, 10);
      } else {
        if (floatRegex.test(value)) {
          value = parseFloat(value);
        } else {
          if (!!(m = dateRegex.exec(value))) {
            value = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]));
          }
        }
      }
    }
    return value;
  }
  return {alias:'simlet.basic', isSimlet:true, responseProps:['responseText', 'responseXML', 'status', 'statusText', 'responseHeaders'], status:200, statusText:'OK', constructor:function(config) {
    Ext.apply(this, config);
  }, doGet:function(ctx) {
    return this.handleRequest(ctx);
  }, doPost:function(ctx) {
    return this.handleRequest(ctx);
  }, doRedirect:function(ctx) {
    return false;
  }, doDelete:function(ctx) {
    var me = this, xhr = ctx.xhr, records = xhr.options.records;
    me.removeFromData(ctx, records);
  }, exec:function(xhr) {
    var me = this, ret = {}, method = 'do' + Ext.String.capitalize(xhr.method.toLowerCase()), fn = me[method];
    if (fn) {
      ret = fn.call(me, me.getCtx(xhr.method, xhr.url, xhr));
    } else {
      ret = {status:405, statusText:'Method Not Allowed'};
    }
    return ret;
  }, getCtx:function(method, url, xhr) {
    return {method:method, params:this.parseQueryString(url), url:url, xhr:xhr};
  }, handleRequest:function(ctx) {
    var me = this, ret = {}, val;
    Ext.Array.forEach(me.responseProps, function(prop) {
      if (prop in me) {
        val = me[prop];
        if (Ext.isFunction(val)) {
          val = val.call(me, ctx);
        }
        ret[prop] = val;
      }
    });
    return ret;
  }, openRequest:function(method, url, options, async) {
    var ctx = this.getCtx(method, url), redirect = this.doRedirect(ctx), xhr;
    if (options.action === 'destroy') {
      method = 'delete';
    }
    if (redirect) {
      xhr = redirect;
    } else {
      xhr = new Ext.ux.ajax.SimXhr({mgr:this.manager, simlet:this, options:options});
      xhr.open(method, url, async);
    }
    return xhr;
  }, parseQueryString:function(str) {
    var m = urlRegex.exec(str), ret = {}, key, value, i, n;
    if (m && m[1]) {
      var pair, parts = m[1].split('\x26');
      for (i = 0, n = parts.length; i < n; ++i) {
        if ((pair = parts[i].split('\x3d'))[0]) {
          key = decodeURIComponent(pair.shift());
          value = parseParamValue(pair.length > 1 ? pair.join('\x3d') : pair[0]);
          if (!(key in ret)) {
            ret[key] = value;
          } else {
            if (Ext.isArray(ret[key])) {
              ret[key].push(value);
            } else {
              ret[key] = [ret[key], value];
            }
          }
        }
      }
    }
    return ret;
  }, redirect:function(method, url, params) {
    switch(arguments.length) {
      case 2:
        if (typeof url == 'string') {
          break;
        }
        params = url;
      case 1:
        url = method;
        method = 'GET';
        break;
    }
    if (params) {
      url = Ext.urlAppend(url, Ext.Object.toQueryString(params));
    }
    return this.manager.openRequest(method, url);
  }, removeFromData:function(ctx, records) {
    var me = this, data = me.getData(ctx), model = ctx.xhr.options.proxy && ctx.xhr.options.proxy.getModel() || {}, idProperty = model.idProperty || 'id';
    Ext.each(records, function(record) {
      var id = record.get(idProperty);
      for (var i = data.length; i-- > 0;) {
        if (data[i][idProperty] === id) {
          me.deleteRecord(i);
          break;
        }
      }
    });
  }};
}());
Ext.define('Ext.ux.ajax.DataSimlet', function() {
  function makeSortFn(def, cmp) {
    var order = def.direction, sign = order && order.toUpperCase() === 'DESC' ? -1 : 1;
    return function(leftRec, rightRec) {
      var lhs = leftRec[def.property], rhs = rightRec[def.property], c = lhs < rhs ? -1 : rhs < lhs ? 1 : 0;
      if (c || !cmp) {
        return c * sign;
      }
      return cmp(leftRec, rightRec);
    };
  }
  function makeSortFns(defs, cmp) {
    for (var sortFn = cmp, i = defs && defs.length; i;) {
      sortFn = makeSortFn(defs[--i], sortFn);
    }
    return sortFn;
  }
  return {extend:'Ext.ux.ajax.Simlet', buildNodes:function(node, path) {
    var me = this, nodeData = {data:[]}, len = node.length, children, i, child, name;
    me.nodes[path] = nodeData;
    for (i = 0; i < len; ++i) {
      nodeData.data.push(child = node[i]);
      name = child.text || child.title;
      child.id = path ? path + '/' + name : name;
      children = child.children;
      if (!(child.leaf = !children)) {
        delete child.children;
        me.buildNodes(children, child.id);
      }
    }
  }, deleteRecord:function(pos) {
    if (this.data && typeof this.data !== 'function') {
      Ext.Array.removeAt(this.data, pos);
    }
  }, fixTree:function(ctx, tree) {
    var me = this, node = ctx.params.node, nodes;
    if (!(nodes = me.nodes)) {
      me.nodes = nodes = {};
      me.buildNodes(tree, '');
    }
    node = nodes[node];
    if (node) {
      if (me.node) {
        me.node.sortedData = me.sortedData;
        me.node.currentOrder = me.currentOrder;
      }
      me.node = node;
      me.data = node.data;
      me.sortedData = node.sortedData;
      me.currentOrder = node.currentOrder;
    } else {
      me.data = null;
    }
  }, getData:function(ctx) {
    var me = this, params = ctx.params, order = (params.filter || '') + (params.group || '') + '-' + (params.sort || '') + '-' + (params.dir || ''), tree = me.tree, dynamicData, data, fields, sortFn;
    if (tree) {
      me.fixTree(ctx, tree);
    }
    data = me.data;
    if (typeof data === 'function') {
      dynamicData = true;
      data = data.call(this, ctx);
    }
    if (!data || order === '--') {
      return data || [];
    }
    if (!dynamicData && order == me.currentOrder) {
      return me.sortedData;
    }
    ctx.filterSpec = params.filter && Ext.decode(params.filter);
    ctx.groupSpec = params.group && Ext.decode(params.group);
    fields = params.sort;
    if (params.dir) {
      fields = [{direction:params.dir, property:fields}];
    } else {
      fields = Ext.decode(params.sort);
    }
    if (ctx.filterSpec) {
      var filters = new Ext.util.FilterCollection;
      filters.add(this.processFilters(ctx.filterSpec));
      data = Ext.Array.filter(data, filters.getFilterFn());
    }
    sortFn = makeSortFns(ctx.sortSpec = fields);
    if (ctx.groupSpec) {
      sortFn = makeSortFns([ctx.groupSpec], sortFn);
    }
    data = Ext.isArray(data) ? data.slice(0) : data;
    if (sortFn) {
      Ext.Array.sort(data, sortFn);
    }
    me.sortedData = data;
    me.currentOrder = order;
    return data;
  }, processFilters:Ext.identityFn, getPage:function(ctx, data) {
    var ret = data, length = data.length, start = ctx.params.start || 0, end = ctx.params.limit ? Math.min(length, start + ctx.params.limit) : length;
    if (start || end < length) {
      ret = ret.slice(start, end);
    }
    return ret;
  }, getGroupSummary:function(groupField, rows, ctx) {
    return rows[0];
  }, getSummary:function(ctx, data, page) {
    var me = this, groupField = ctx.groupSpec.property, accum, todo = {}, summary = [], fieldValue, lastFieldValue;
    Ext.each(page, function(rec) {
      fieldValue = rec[groupField];
      todo[fieldValue] = true;
    });
    function flush() {
      if (accum) {
        summary.push(me.getGroupSummary(groupField, accum, ctx));
        accum = null;
      }
    }
    Ext.each(data, function(rec) {
      fieldValue = rec[groupField];
      if (lastFieldValue !== fieldValue) {
        flush();
        lastFieldValue = fieldValue;
      }
      if (!todo[fieldValue]) {
        return !summary.length;
      }
      if (accum) {
        accum.push(rec);
      } else {
        accum = [rec];
      }
      return true;
    });
    flush();
    return summary;
  }};
}());
Ext.define('Ext.ux.ajax.JsonSimlet', {extend:'Ext.ux.ajax.DataSimlet', alias:'simlet.json', doGet:function(ctx) {
  var me = this, data = me.getData(ctx), page = me.getPage(ctx, data), reader = ctx.xhr.options.proxy && ctx.xhr.options.proxy.getReader(), root = reader && reader.getRootProperty(), ret = me.callParent(arguments), response = {};
  if (root && Ext.isArray(page)) {
    response[root] = page;
    response[reader.getTotalProperty()] = data.length;
  } else {
    response = page;
  }
  if (ctx.groupSpec) {
    response.summaryData = me.getSummary(ctx, data, page);
  }
  ret.responseText = Ext.encode(response);
  return ret;
}, doPost:function(ctx) {
  return this.doGet(ctx);
}});
Ext.define('Ext.ux.ajax.PivotSimlet', {extend:'Ext.ux.ajax.JsonSimlet', alias:'simlet.pivot', lastPost:null, lastResponse:null, keysSeparator:'', grandTotalKey:'', doPost:function(ctx) {
  var me = this, ret = me.callParent(arguments);
  me.lastResponse = me.processData(me.getData(ctx), Ext.decode(ctx.xhr.body));
  ret.responseText = Ext.encode(me.lastResponse);
  return ret;
}, processData:function(data, params) {
  var me = this, len = data.length, response = {success:true, leftAxis:[], topAxis:[], results:[]}, leftAxis = new Ext.util.MixedCollection, topAxis = new Ext.util.MixedCollection, results = new Ext.util.MixedCollection, i, j, k, leftKeys, topKeys, item, agg;
  me.lastPost = params;
  me.keysSeparator = params.keysSeparator;
  me.grandTotalKey = params.grandTotalKey;
  for (i = 0; i < len; i++) {
    leftKeys = me.extractValues(data[i], params.leftAxis, leftAxis);
    topKeys = me.extractValues(data[i], params.topAxis, topAxis);
    me.addResult(data[i], me.grandTotalKey, me.grandTotalKey, results);
    for (j = 0; j < leftKeys.length; j++) {
      me.addResult(data[i], leftKeys[j], me.grandTotalKey, results);
      for (k = 0; k < topKeys.length; k++) {
        me.addResult(data[i], leftKeys[j], topKeys[k], results);
      }
    }
    for (j = 0; j < topKeys.length; j++) {
      me.addResult(data[i], me.grandTotalKey, topKeys[j], results);
    }
  }
  response.leftAxis = leftAxis.getRange();
  response.topAxis = topAxis.getRange();
  len = results.getCount();
  for (i = 0; i < len; i++) {
    item = results.getAt(i);
    item.values = {};
    for (j = 0; j < params.aggregate.length; j++) {
      agg = params.aggregate[j];
      item.values[agg.id] = me[agg.aggregator](item.records, agg.dataIndex, item.leftKey, item.topKey);
    }
    delete item.records;
    response.results.push(item);
  }
  leftAxis.clear();
  topAxis.clear();
  results.clear();
  return response;
}, getKey:function(value) {
  var me = this;
  me.keysMap = me.keysMap || {};
  if (!Ext.isDefined(me.keysMap[value])) {
    me.keysMap[value] = Ext.id();
  }
  return me.keysMap[value];
}, extractValues:function(record, dimensions, col) {
  var len = dimensions.length, keys = [], i, j, key, item, dim;
  key = '';
  for (j = 0; j < len; j++) {
    dim = dimensions[j];
    key += (j > 0 ? this.keysSeparator : '') + this.getKey(record[dim.dataIndex]);
    item = col.getByKey(key);
    if (!item) {
      item = col.add(key, {key:key, value:record[dim.dataIndex], dimensionId:dim.id});
    }
    keys.push(key);
  }
  return keys;
}, addResult:function(record, leftKey, topKey, results) {
  var item = results.getByKey(leftKey + '/' + topKey);
  if (!item) {
    item = results.add(leftKey + '/' + topKey, {leftKey:leftKey, topKey:topKey, records:[]});
  }
  item.records.push(record);
}, sum:function(records, measure, rowGroupKey, colGroupKey) {
  var length = records.length, total = 0, i;
  for (i = 0; i < length; i++) {
    total += Ext.Number.from(records[i][measure], 0);
  }
  return total;
}, avg:function(records, measure, rowGroupKey, colGroupKey) {
  var length = records.length, total = 0, i;
  for (i = 0; i < length; i++) {
    total += Ext.Number.from(records[i][measure], 0);
  }
  return length > 0 ? total / length : 0;
}, min:function(records, measure, rowGroupKey, colGroupKey) {
  var data = [], length = records.length, i, v;
  for (i = 0; i < length; i++) {
    data.push(records[i][measure]);
  }
  v = Ext.Array.min(data);
  return v;
}, max:function(records, measure, rowGroupKey, colGroupKey) {
  var data = [], length = records.length, i;
  for (i = 0; i < length; i++) {
    data.push(records[i][measure]);
  }
  v = Ext.Array.max(data);
  return v;
}, count:function(records, measure, rowGroupKey, colGroupKey) {
  return records.length;
}, variance:function(records, measure, rowGroupKey, colGroupKey) {
  var me = Ext.pivot.Aggregators, length = records.length, avg = me.avg.apply(me, arguments), total = 0, i;
  if (avg > 0) {
    for (i = 0; i < length; i++) {
      total += Math.pow(Ext.Number.from(records[i][measure], 0) - avg, 2);
    }
  }
  return total > 0 && length > 1 ? total / (length - 1) : 0;
}, varianceP:function(records, measure, rowGroupKey, colGroupKey) {
  var me = Ext.pivot.Aggregators, length = records.length, avg = me.avg.apply(me, arguments), total = 0, i;
  if (avg > 0) {
    for (i = 0; i < length; i++) {
      total += Math.pow(Ext.Number.from(records[i][measure], 0) - avg, 2);
    }
  }
  return total > 0 && length > 0 ? total / length : 0;
}, stdDev:function(records, measure, rowGroupKey, colGroupKey) {
  var me = Ext.pivot.Aggregators, v = me.variance.apply(me, arguments);
  return v > 0 ? Math.sqrt(v) : 0;
}, stdDevP:function(records, measure, rowGroupKey, colGroupKey) {
  var me = Ext.pivot.Aggregators, v = me.varianceP.apply(me, arguments);
  return v > 0 ? Math.sqrt(v) : 0;
}});
Ext.define('Ext.ux.ajax.SimXhr', {readyState:0, mgr:null, simlet:null, constructor:function(config) {
  var me = this;
  Ext.apply(me, config);
  me.requestHeaders = {};
}, abort:function() {
  var me = this;
  if (me.timer) {
    Ext.undefer(me.timer);
    me.timer = null;
  }
  me.aborted = true;
}, getAllResponseHeaders:function() {
  var headers = [];
  if (Ext.isObject(this.responseHeaders)) {
    Ext.Object.each(this.responseHeaders, function(name, value) {
      headers.push(name + ': ' + value);
    });
  }
  return headers.join('\r\n');
}, getResponseHeader:function(header) {
  var headers = this.responseHeaders;
  return headers && headers[header] || null;
}, open:function(method, url, async, user, password) {
  var me = this;
  me.method = method;
  me.url = url;
  me.async = async !== false;
  me.user = user;
  me.password = password;
  me.setReadyState(1);
}, overrideMimeType:function(mimeType) {
  this.mimeType = mimeType;
}, schedule:function() {
  var me = this, delay = me.simlet.delay || me.mgr.delay;
  if (delay) {
    me.timer = Ext.defer(function() {
      me.onTick();
    }, delay);
  } else {
    me.onTick();
  }
}, send:function(body) {
  var me = this;
  me.body = body;
  if (me.async) {
    me.schedule();
  } else {
    me.onComplete();
  }
}, setReadyState:function(state) {
  var me = this;
  if (me.readyState != state) {
    me.readyState = state;
    me.onreadystatechange();
  }
}, setRequestHeader:function(header, value) {
  this.requestHeaders[header] = value;
}, onreadystatechange:Ext.emptyFn, onComplete:function() {
  var me = this, callback;
  me.readyState = 4;
  Ext.apply(me, me.simlet.exec(me));
  callback = me.jsonpCallback;
  if (callback) {
    var text = callback + '(' + me.responseText + ')';
    eval(text);
  }
}, onTick:function() {
  var me = this;
  me.timer = null;
  me.onComplete();
  me.onreadystatechange && me.onreadystatechange();
}});
Ext.define('Ext.ux.ajax.SimManager', {singleton:true, requires:['Ext.data.Connection', 'Ext.ux.ajax.SimXhr', 'Ext.ux.ajax.Simlet', 'Ext.ux.ajax.JsonSimlet'], defaultType:'basic', delay:150, ready:false, constructor:function() {
  this.simlets = [];
}, getSimlet:function(url) {
  var me = this, index = url.indexOf('?'), simlets = me.simlets, len = simlets.length, i, simlet, simUrl, match;
  if (index < 0) {
    index = url.indexOf('#');
  }
  if (index > 0) {
    url = url.substring(0, index);
  }
  for (i = 0; i < len; ++i) {
    simlet = simlets[i];
    simUrl = simlet.url;
    if (simUrl instanceof RegExp) {
      match = simUrl.test(url);
    } else {
      match = simUrl === url;
    }
    if (match) {
      return simlet;
    }
  }
  return me.defaultSimlet;
}, getXhr:function(method, url, options, async) {
  var simlet = this.getSimlet(url);
  if (simlet) {
    return simlet.openRequest(method, url, options, async);
  }
  return null;
}, init:function(config) {
  var me = this;
  Ext.apply(me, config);
  if (!me.ready) {
    me.ready = true;
    if (!('defaultSimlet' in me)) {
      me.defaultSimlet = new Ext.ux.ajax.Simlet({status:404, statusText:'Not Found'});
    }
    me._openRequest = Ext.data.Connection.prototype.openRequest;
    Ext.data.request.Ajax.override({openRequest:function(options, requestOptions, async) {
      var xhr = !options.nosim && me.getXhr(requestOptions.method, requestOptions.url, options, async);
      if (!xhr) {
        xhr = this.callParent(arguments);
      }
      return xhr;
    }});
    if (Ext.data.JsonP) {
      Ext.data.JsonP.self.override({createScript:function(url, params, options) {
        var fullUrl = Ext.urlAppend(url, Ext.Object.toQueryString(params)), script = !options.nosim && me.getXhr('GET', fullUrl, options, true);
        if (!script) {
          script = this.callParent(arguments);
        }
        return script;
      }, loadScript:function(request) {
        var script = request.script;
        if (script.simlet) {
          script.jsonpCallback = request.params[request.callbackKey];
          script.send(null);
          request.script = document.createElement('script');
        } else {
          this.callParent(arguments);
        }
      }});
    }
  }
  return me;
}, openRequest:function(method, url, async) {
  var opt = {method:method, url:url};
  return this._openRequest.call(Ext.data.Connection.prototype, {}, opt, async);
}, register:function(simlet) {
  var me = this;
  me.init();
  function reg(one) {
    var simlet = one;
    if (!simlet.isSimlet) {
      simlet = Ext.create('simlet.' + (simlet.type || simlet.stype || me.defaultType), one);
    }
    me.simlets.push(simlet);
    simlet.manager = me;
  }
  if (Ext.isArray(simlet)) {
    Ext.each(simlet, reg);
  } else {
    if (simlet.isSimlet || simlet.url) {
      reg(simlet);
    } else {
      Ext.Object.each(simlet, function(url, s) {
        s.url = url;
        reg(s);
      });
    }
  }
  return me;
}});
Ext.define('Ext.ux.ajax.XmlSimlet', {extend:'Ext.ux.ajax.DataSimlet', alias:'simlet.xml', xmlTpl:['\x3c{root}\x3e\n', '\x3ctpl for\x3d"data"\x3e', '    \x3c{parent.record}\x3e\n', '\x3ctpl for\x3d"parent.fields"\x3e', '        \x3c{name}\x3e{[parent[values.name]]}\x3c/{name}\x3e\n', '\x3c/tpl\x3e', '    \x3c/{parent.record}\x3e\n', '\x3c/tpl\x3e', '\x3c/{root}\x3e'], doGet:function(ctx) {
  var me = this, data = me.getData(ctx), page = me.getPage(ctx, data), proxy = ctx.xhr.options.operation.getProxy(), reader = proxy && proxy.getReader(), model = reader && reader.getModel(), ret = me.callParent(arguments), response = {data:page, reader:reader, fields:model && model.fields, root:reader && reader.getRootProperty(), record:reader && reader.record}, tpl, xml, doc;
  if (ctx.groupSpec) {
    response.summaryData = me.getSummary(ctx, data, page);
  }
  if (me.xmlTpl) {
    tpl = Ext.XTemplate.getTpl(me, 'xmlTpl');
    xml = tpl.apply(response);
  } else {
    xml = data;
  }
  if (typeof DOMParser != 'undefined') {
    doc = (new DOMParser).parseFromString(xml, 'text/xml');
  } else {
    doc = new ActiveXObject('Microsoft.XMLDOM');
    doc.async = false;
    doc.loadXML(xml);
  }
  ret.responseText = xml;
  ret.responseXML = doc;
  return ret;
}, fixTree:function() {
  this.callParent(arguments);
  var buffer = [];
  this.buildTreeXml(this.data, buffer);
  this.data = buffer.join('');
}, buildTreeXml:function(nodes, buffer) {
  var rootProperty = this.rootProperty, recordProperty = this.recordProperty;
  buffer.push('\x3c', rootProperty, '\x3e');
  Ext.Array.forEach(nodes, function(node) {
    buffer.push('\x3c', recordProperty, '\x3e');
    for (var key in node) {
      if (key == 'children') {
        this.buildTreeXml(node.children, buffer);
      } else {
        buffer.push('\x3c', key, '\x3e', node[key], '\x3c/', key, '\x3e');
      }
    }
    buffer.push('\x3c/', recordProperty, '\x3e');
  });
  buffer.push('\x3c/', rootProperty, '\x3e');
}});
Ext.define('Ext.ux.event.Driver', {extend:'Ext.util.Observable', active:null, specialKeysByName:{PGUP:33, PGDN:34, END:35, HOME:36, LEFT:37, UP:38, RIGHT:39, DOWN:40}, specialKeysByCode:{}, getTextSelection:function(el) {
  var doc = el.ownerDocument, range, range2, start, end;
  if (typeof el.selectionStart === 'number') {
    start = el.selectionStart;
    end = el.selectionEnd;
  } else {
    if (doc.selection) {
      range = doc.selection.createRange();
      range2 = el.createTextRange();
      range2.setEndPoint('EndToStart', range);
      start = range2.text.length;
      end = start + range.text.length;
    }
  }
  return [start, end];
}, getTime:function() {
  return (new Date).getTime();
}, getTimestamp:function() {
  var d = this.getTime();
  return d - this.startTime;
}, onStart:function() {
}, onStop:function() {
}, start:function() {
  var me = this;
  if (!me.active) {
    me.active = new Date;
    me.startTime = me.getTime();
    me.onStart();
    me.fireEvent('start', me);
  }
}, stop:function() {
  var me = this;
  if (me.active) {
    me.active = null;
    me.onStop();
    me.fireEvent('stop', me);
  }
}}, function() {
  var proto = this.prototype;
  Ext.Object.each(proto.specialKeysByName, function(name, value) {
    proto.specialKeysByCode[value] = name;
  });
});
Ext.define('Ext.ux.event.Maker', {eventQueue:[], startAfter:500, timerIncrement:500, currentTiming:0, constructor:function(config) {
  var me = this;
  me.currentTiming = me.startAfter;
  if (!Ext.isArray(config)) {
    config = [config];
  }
  Ext.Array.each(config, function(item) {
    item.el = item.el || 'el';
    Ext.Array.each(Ext.ComponentQuery.query(item.cmpQuery), function(cmp) {
      var event = {}, x, y, el;
      if (!item.domQuery) {
        el = cmp[item.el];
      } else {
        el = cmp.el.down(item.domQuery);
      }
      event.target = '#' + el.dom.id;
      event.type = item.type;
      event.button = config.button || 0;
      x = el.getX() + el.getWidth() / 2;
      y = el.getY() + el.getHeight() / 2;
      event.xy = [x, y];
      event.ts = me.currentTiming;
      me.currentTiming += me.timerIncrement;
      me.eventQueue.push(event);
    });
    if (item.screenshot) {
      me.eventQueue[me.eventQueue.length - 1].screenshot = true;
    }
  });
  return me.eventQueue;
}});
Ext.define('Ext.ux.event.Player', function(Player) {
  var defaults = {}, mouseEvents = {}, keyEvents = {}, doc, uiEvents = {}, bubbleEvents = {resize:1, reset:1, submit:1, change:1, select:1, error:1, abort:1};
  Ext.each(['click', 'dblclick', 'mouseover', 'mouseout', 'mousedown', 'mouseup', 'mousemove'], function(type) {
    bubbleEvents[type] = defaults[type] = mouseEvents[type] = {bubbles:true, cancelable:type != 'mousemove', detail:1, screenX:0, screenY:0, clientX:0, clientY:0, ctrlKey:false, altKey:false, shiftKey:false, metaKey:false, button:0};
  });
  Ext.each(['keydown', 'keyup', 'keypress'], function(type) {
    bubbleEvents[type] = defaults[type] = keyEvents[type] = {bubbles:true, cancelable:true, ctrlKey:false, altKey:false, shiftKey:false, metaKey:false, keyCode:0, charCode:0};
  });
  Ext.each(['blur', 'change', 'focus', 'resize', 'scroll', 'select'], function(type) {
    defaults[type] = uiEvents[type] = {bubbles:type in bubbleEvents, cancelable:false, detail:1};
  });
  var inputSpecialKeys = {8:function(target, start, end) {
    if (start < end) {
      target.value = target.value.substring(0, start) + target.value.substring(end);
    } else {
      if (start > 0) {
        target.value = target.value.substring(0, --start) + target.value.substring(end);
      }
    }
    this.setTextSelection(target, start, start);
  }, 46:function(target, start, end) {
    if (start < end) {
      target.value = target.value.substring(0, start) + target.value.substring(end);
    } else {
      if (start < target.value.length - 1) {
        target.value = target.value.substring(0, start) + target.value.substring(start + 1);
      }
    }
    this.setTextSelection(target, start, start);
  }};
  return {extend:'Ext.ux.event.Driver', keyFrameEvents:{click:true}, pauseForAnimations:true, speed:1, stallTime:0, _inputSpecialKeys:{INPUT:inputSpecialKeys, TEXTAREA:Ext.apply({}, inputSpecialKeys)}, tagPathRegEx:/(\w+)(?:\[(\d+)\])?/, constructor:function(config) {
    var me = this;
    me.callParent(arguments);
    me.timerFn = function() {
      me.onTick();
    };
    me.attachTo = me.attachTo || window;
    doc = me.attachTo.document;
  }, getElementFromXPath:function(xpath) {
    var me = this, parts = xpath.split('/'), regex = me.tagPathRegEx, i, n, m, count, tag, child, el = me.attachTo.document;
    el = parts[0] == '~' ? el.body : el.getElementById(parts[0].substring(1));
    for (i = 1, n = parts.length; el && i < n; ++i) {
      m = regex.exec(parts[i]);
      count = m[2] ? parseInt(m[2], 10) : 1;
      tag = m[1].toUpperCase();
      for (child = el.firstChild; child; child = child.nextSibling) {
        if (child.tagName == tag) {
          if (count == 1) {
            break;
          }
          --count;
        }
      }
      el = child;
    }
    return el;
  }, offsetToRangeCharacterMove:function(el, offset) {
    return offset - (el.value.slice(0, offset).split('\r\n').length - 1);
  }, setTextSelection:function(el, startOffset, endOffset) {
    if (startOffset < 0) {
      startOffset += el.value.length;
    }
    if (endOffset == null) {
      endOffset = startOffset;
    }
    if (endOffset < 0) {
      endOffset += el.value.length;
    }
    if (typeof el.selectionStart === 'number') {
      el.selectionStart = startOffset;
      el.selectionEnd = endOffset;
    } else {
      var range = el.createTextRange();
      var startCharMove = this.offsetToRangeCharacterMove(el, startOffset);
      range.collapse(true);
      if (startOffset == endOffset) {
        range.move('character', startCharMove);
      } else {
        range.moveEnd('character', this.offsetToRangeCharacterMove(el, endOffset));
        range.moveStart('character', startCharMove);
      }
      range.select();
    }
  }, getTimeIndex:function() {
    var t = this.getTimestamp() - this.stallTime;
    return t * this.speed;
  }, makeToken:function(eventDescriptor, signal) {
    var me = this, t0;
    eventDescriptor[signal] = true;
    eventDescriptor.defer = function() {
      eventDescriptor[signal] = false;
      t0 = me.getTime();
    };
    eventDescriptor.finish = function() {
      eventDescriptor[signal] = true;
      me.stallTime += me.getTime() - t0;
      me.schedule();
    };
  }, nextEvent:function(eventDescriptor) {
    var me = this, index = ++me.queueIndex;
    if (me.keyFrameEvents[eventDescriptor.type]) {
      Ext.Array.insert(me.eventQueue, index, [{keyframe:true, ts:eventDescriptor.ts}]);
    }
  }, peekEvent:function() {
    return this.eventQueue[this.queueIndex] || null;
  }, replaceEvent:function(index, events) {
    for (var t, i = 0, n = events.length; i < n; ++i) {
      if (i) {
        t = events[i - 1];
        delete t.afterplay;
        delete t.screenshot;
        delete events[i].beforeplay;
      }
    }
    Ext.Array.replace(this.eventQueue, index == null ? this.queueIndex : index, 1, events);
  }, processEvents:function() {
    var me = this, animations = me.pauseForAnimations && me.attachTo.Ext.fx.Manager.items, eventDescriptor;
    while ((eventDescriptor = me.peekEvent()) !== null) {
      if (animations && animations.getCount()) {
        return true;
      }
      if (eventDescriptor.keyframe) {
        if (!me.processKeyFrame(eventDescriptor)) {
          return false;
        }
        me.nextEvent(eventDescriptor);
      } else {
        if (eventDescriptor.ts <= me.getTimeIndex() && me.fireEvent('beforeplay', me, eventDescriptor) !== false && me.playEvent(eventDescriptor)) {
          me.nextEvent(eventDescriptor);
        } else {
          return true;
        }
      }
    }
    me.stop();
    return false;
  }, processKeyFrame:function(eventDescriptor) {
    var me = this;
    if (!eventDescriptor.defer) {
      me.makeToken(eventDescriptor, 'done');
      me.fireEvent('keyframe', me, eventDescriptor);
    }
    return eventDescriptor.done;
  }, injectEvent:function(target, event) {
    var me = this, type = event.type, options = Ext.apply({}, event, defaults[type]), handler;
    if (type === 'type') {
      handler = me._inputSpecialKeys[target.tagName];
      if (handler) {
        return me.injectTypeInputEvent(target, event, handler);
      }
      return me.injectTypeEvent(target, event);
    }
    if (type === 'focus' && target.focus) {
      target.focus();
      return true;
    }
    if (type === 'blur' && target.blur) {
      target.blur();
      return true;
    }
    if (type === 'scroll') {
      target.scrollLeft = event.pos[0];
      target.scrollTop = event.pos[1];
      return true;
    }
    if (type === 'mduclick') {
      return me.injectEvent(target, Ext.applyIf({type:'mousedown'}, event)) && me.injectEvent(target, Ext.applyIf({type:'mouseup'}, event)) && me.injectEvent(target, Ext.applyIf({type:'click'}, event));
    }
    if (mouseEvents[type]) {
      return Player.injectMouseEvent(target, options, me.attachTo);
    }
    if (keyEvents[type]) {
      return Player.injectKeyEvent(target, options, me.attachTo);
    }
    if (uiEvents[type]) {
      return Player.injectUIEvent(target, type, options.bubbles, options.cancelable, options.view || me.attachTo, options.detail);
    }
    return false;
  }, injectTypeEvent:function(target, event) {
    var me = this, text = event.text, xlat = [], ch, chUp, i, n, sel, upper, isInput;
    if (text) {
      delete event.text;
      upper = text.toUpperCase();
      for (i = 0, n = text.length; i < n; ++i) {
        ch = text.charCodeAt(i);
        chUp = upper.charCodeAt(i);
        xlat.push(Ext.applyIf({type:'keydown', charCode:chUp, keyCode:chUp}, event), Ext.applyIf({type:'keypress', charCode:ch, keyCode:ch}, event), Ext.applyIf({type:'keyup', charCode:chUp, keyCode:chUp}, event));
      }
    } else {
      xlat.push(Ext.applyIf({type:'keydown', charCode:event.keyCode}, event), Ext.applyIf({type:'keyup', charCode:event.keyCode}, event));
    }
    for (i = 0, n = xlat.length; i < n; ++i) {
      me.injectEvent(target, xlat[i]);
    }
    return true;
  }, injectTypeInputEvent:function(target, event, handler) {
    var me = this, text = event.text, sel, n;
    if (handler) {
      sel = me.getTextSelection(target);
      if (text) {
        n = sel[0];
        target.value = target.value.substring(0, n) + text + target.value.substring(sel[1]);
        n += text.length;
        me.setTextSelection(target, n, n);
      } else {
        if (!(handler = handler[event.keyCode])) {
          if ('caret' in event) {
            me.setTextSelection(target, event.caret, event.caret);
          } else {
            if (event.selection) {
              me.setTextSelection(target, event.selection[0], event.selection[1]);
            }
          }
          return me.injectTypeEvent(target, event);
        }
        handler.call(this, target, sel[0], sel[1]);
        return true;
      }
    }
    return true;
  }, playEvent:function(eventDescriptor) {
    var me = this, target = me.getElementFromXPath(eventDescriptor.target), event;
    if (!target) {
      return false;
    }
    if (!me.playEventHook(eventDescriptor, 'beforeplay')) {
      return false;
    }
    if (!eventDescriptor.injected) {
      eventDescriptor.injected = true;
      event = me.translateEvent(eventDescriptor, target);
      me.injectEvent(target, event);
    }
    return me.playEventHook(eventDescriptor, 'afterplay');
  }, playEventHook:function(eventDescriptor, hookName) {
    var me = this, doneName = hookName + '.done', firedName = hookName + '.fired', hook = eventDescriptor[hookName];
    if (hook && !eventDescriptor[doneName]) {
      if (!eventDescriptor[firedName]) {
        eventDescriptor[firedName] = true;
        me.makeToken(eventDescriptor, doneName);
        if (me.eventScope && Ext.isString(hook)) {
          hook = me.eventScope[hook];
        }
        if (hook) {
          hook.call(me.eventScope || me, eventDescriptor);
        }
      }
      return false;
    }
    return true;
  }, schedule:function() {
    var me = this;
    if (!me.timer) {
      me.timer = Ext.defer(me.timerFn, 10);
    }
  }, _translateAcross:['type', 'button', 'charCode', 'keyCode', 'caret', 'pos', 'text', 'selection'], translateEvent:function(eventDescriptor, target) {
    var me = this, event = {}, modKeys = eventDescriptor.modKeys || '', names = me._translateAcross, i = names.length, name, xy;
    while (i--) {
      name = names[i];
      if (name in eventDescriptor) {
        event[name] = eventDescriptor[name];
      }
    }
    event.altKey = modKeys.indexOf('A') > 0;
    event.ctrlKey = modKeys.indexOf('C') > 0;
    event.metaKey = modKeys.indexOf('M') > 0;
    event.shiftKey = modKeys.indexOf('S') > 0;
    if (target && 'x' in eventDescriptor) {
      xy = Ext.fly(target).getXY();
      xy[0] += eventDescriptor.x;
      xy[1] += eventDescriptor.y;
    } else {
      if ('x' in eventDescriptor) {
        xy = [eventDescriptor.x, eventDescriptor.y];
      } else {
        if ('px' in eventDescriptor) {
          xy = [eventDescriptor.px, eventDescriptor.py];
        }
      }
    }
    if (xy) {
      event.clientX = event.screenX = xy[0];
      event.clientY = event.screenY = xy[1];
    }
    if (eventDescriptor.key) {
      event.keyCode = me.specialKeysByName[eventDescriptor.key];
    }
    if (eventDescriptor.type === 'wheel') {
      if ('onwheel' in me.attachTo.document) {
        event.wheelX = eventDescriptor.dx;
        event.wheelY = eventDescriptor.dy;
      } else {
        event.type = 'mousewheel';
        event.wheelDeltaX = -40 * eventDescriptor.dx;
        event.wheelDeltaY = event.wheelDelta = -40 * eventDescriptor.dy;
      }
    }
    return event;
  }, onStart:function() {
    var me = this;
    me.queueIndex = 0;
    me.schedule();
  }, onStop:function() {
    var me = this;
    if (me.timer) {
      Ext.undefer(me.timer);
      me.timer = null;
    }
  }, onTick:function() {
    var me = this;
    me.timer = null;
    if (me.processEvents()) {
      me.schedule();
    }
  }, statics:{ieButtonCodeMap:{0:1, 1:4, 2:2}, injectKeyEvent:function(target, options, view) {
    var type = options.type, customEvent = null;
    if (type === 'textevent') {
      type = 'keypress';
    }
    view = view || window;
    if (doc.createEvent) {
      try {
        customEvent = doc.createEvent('KeyEvents');
        customEvent.initKeyEvent(type, options.bubbles, options.cancelable, view, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.keyCode, options.charCode);
      } catch (ex) {
        try {
          customEvent = doc.createEvent('Events');
        } catch (uierror) {
          customEvent = doc.createEvent('UIEvents');
        } finally {
          customEvent.initEvent(type, options.bubbles, options.cancelable);
          customEvent.view = view;
          customEvent.altKey = options.altKey;
          customEvent.ctrlKey = options.ctrlKey;
          customEvent.shiftKey = options.shiftKey;
          customEvent.metaKey = options.metaKey;
          customEvent.keyCode = options.keyCode;
          customEvent.charCode = options.charCode;
        }
      }
      target.dispatchEvent(customEvent);
    } else {
      if (doc.createEventObject) {
        customEvent = doc.createEventObject();
        customEvent.bubbles = options.bubbles;
        customEvent.cancelable = options.cancelable;
        customEvent.view = view;
        customEvent.ctrlKey = options.ctrlKey;
        customEvent.altKey = options.altKey;
        customEvent.shiftKey = options.shiftKey;
        customEvent.metaKey = options.metaKey;
        customEvent.keyCode = options.charCode > 0 ? options.charCode : options.keyCode;
        target.fireEvent('on' + type, customEvent);
      } else {
        return false;
      }
    }
    return true;
  }, injectMouseEvent:function(target, options, view) {
    var type = options.type, customEvent = null;
    view = view || window;
    if (doc.createEvent) {
      customEvent = doc.createEvent('MouseEvents');
      if (customEvent.initMouseEvent) {
        customEvent.initMouseEvent(type, options.bubbles, options.cancelable, view, options.detail, options.screenX, options.screenY, options.clientX, options.clientY, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, options.relatedTarget);
      } else {
        customEvent = doc.createEvent('UIEvents');
        customEvent.initEvent(type, options.bubbles, options.cancelable);
        customEvent.view = view;
        customEvent.detail = options.detail;
        customEvent.screenX = options.screenX;
        customEvent.screenY = options.screenY;
        customEvent.clientX = options.clientX;
        customEvent.clientY = options.clientY;
        customEvent.ctrlKey = options.ctrlKey;
        customEvent.altKey = options.altKey;
        customEvent.metaKey = options.metaKey;
        customEvent.shiftKey = options.shiftKey;
        customEvent.button = options.button;
        customEvent.relatedTarget = options.relatedTarget;
      }
      if (options.relatedTarget && !customEvent.relatedTarget) {
        if (type == 'mouseout') {
          customEvent.toElement = options.relatedTarget;
        } else {
          if (type == 'mouseover') {
            customEvent.fromElement = options.relatedTarget;
          }
        }
      }
      target.dispatchEvent(customEvent);
    } else {
      if (doc.createEventObject) {
        customEvent = doc.createEventObject();
        customEvent.bubbles = options.bubbles;
        customEvent.cancelable = options.cancelable;
        customEvent.view = view;
        customEvent.detail = options.detail;
        customEvent.screenX = options.screenX;
        customEvent.screenY = options.screenY;
        customEvent.clientX = options.clientX;
        customEvent.clientY = options.clientY;
        customEvent.ctrlKey = options.ctrlKey;
        customEvent.altKey = options.altKey;
        customEvent.metaKey = options.metaKey;
        customEvent.shiftKey = options.shiftKey;
        customEvent.button = Player.ieButtonCodeMap[options.button] || 0;
        customEvent.relatedTarget = options.relatedTarget;
        target.fireEvent('on' + type, customEvent);
      } else {
        return false;
      }
    }
    return true;
  }, injectUIEvent:function(target, options, view) {
    var customEvent = null;
    view = view || window;
    if (doc.createEvent) {
      customEvent = doc.createEvent('UIEvents');
      customEvent.initUIEvent(options.type, options.bubbles, options.cancelable, view, options.detail);
      target.dispatchEvent(customEvent);
    } else {
      if (doc.createEventObject) {
        customEvent = doc.createEventObject();
        customEvent.bubbles = options.bubbles;
        customEvent.cancelable = options.cancelable;
        customEvent.view = view;
        customEvent.detail = options.detail;
        target.fireEvent('on' + options.type, customEvent);
      } else {
        return false;
      }
    }
    return true;
  }}};
});
Ext.define('Ext.ux.event.Recorder', function(Recorder) {
  function apply() {
    var a = arguments, n = a.length, obj = {kind:'other'}, i;
    for (i = 0; i < n; ++i) {
      Ext.apply(obj, arguments[i]);
    }
    if (obj.alt && !obj.event) {
      obj.event = obj.alt;
    }
    return obj;
  }
  function key(extra) {
    return apply({kind:'keyboard', modKeys:true, key:true}, extra);
  }
  function mouse(extra) {
    return apply({kind:'mouse', button:true, modKeys:true, xy:true}, extra);
  }
  var eventsToRecord = {keydown:key(), keypress:key(), keyup:key(), dragmove:mouse({alt:'mousemove', pageCoords:true, whileDrag:true}), mousemove:mouse({pageCoords:true}), mouseover:mouse(), mouseout:mouse(), click:mouse(), wheel:mouse({wheel:true}), mousedown:mouse({press:true}), mouseup:mouse({release:true}), scroll:apply({listen:false}), focus:apply(), blur:apply()};
  for (var key in eventsToRecord) {
    if (!eventsToRecord[key].event) {
      eventsToRecord[key].event = key;
    }
  }
  eventsToRecord.wheel.event = null;
  return {extend:'Ext.ux.event.Driver', eventsToRecord:eventsToRecord, ignoreIdRegEx:/ext-gen(?:\d+)/, inputRe:/^(input|textarea)$/i, constructor:function(config) {
    var me = this, events = config && config.eventsToRecord;
    if (events) {
      me.eventsToRecord = Ext.apply(Ext.apply({}, me.eventsToRecord), events);
      delete config.eventsToRecord;
    }
    me.callParent(arguments);
    me.clear();
    me.modKeys = [];
    me.attachTo = me.attachTo || window;
  }, clear:function() {
    this.eventsRecorded = [];
  }, listenToEvent:function(event) {
    var me = this, el = me.attachTo.document.body, fn = function() {
      return me.onEvent.apply(me, arguments);
    }, cleaner = {};
    if (el.attachEvent && el.ownerDocument.documentMode < 10) {
      event = 'on' + event;
      el.attachEvent(event, fn);
      cleaner.destroy = function() {
        if (fn) {
          el.detachEvent(event, fn);
          fn = null;
        }
      };
    } else {
      el.addEventListener(event, fn, true);
      cleaner.destroy = function() {
        if (fn) {
          el.removeEventListener(event, fn, true);
          fn = null;
        }
      };
    }
    return cleaner;
  }, coalesce:function(rec, ev) {
    var me = this, events = me.eventsRecorded, length = events.length, tail = length && events[length - 1], tail2 = length > 1 && events[length - 2], tail3 = length > 2 && events[length - 3];
    if (!tail) {
      return false;
    }
    if (rec.type === 'mousemove') {
      if (tail.type === 'mousemove' && rec.ts - tail.ts < 200) {
        rec.ts = tail.ts;
        events[length - 1] = rec;
        return true;
      }
    } else {
      if (rec.type === 'click') {
        if (tail2 && tail.type === 'mouseup' && tail2.type === 'mousedown') {
          if (rec.button == tail.button && rec.button == tail2.button && rec.target == tail.target && rec.target == tail2.target && me.samePt(rec, tail) && me.samePt(rec, tail2)) {
            events.pop();
            tail2.type = 'mduclick';
            return true;
          }
        }
      } else {
        if (rec.type === 'keyup') {
          if (tail2 && tail.type === 'keypress' && tail2.type === 'keydown') {
            if (rec.target === tail.target && rec.target === tail2.target) {
              events.pop();
              tail2.type = 'type';
              tail2.text = String.fromCharCode(tail.charCode);
              delete tail2.charCode;
              delete tail2.keyCode;
              if (tail3 && tail3.type === 'type') {
                if (tail3.text && tail3.target === tail2.target) {
                  tail3.text += tail2.text;
                  events.pop();
                }
              }
              return true;
            }
          } else {
            if (me.completeKeyStroke(tail, rec)) {
              tail.type = 'type';
              me.completeSpecialKeyStroke(ev.target, tail, rec);
              return true;
            } else {
              if (tail.type === 'scroll' && me.completeKeyStroke(tail2, rec)) {
                tail2.type = 'type';
                me.completeSpecialKeyStroke(ev.target, tail2, rec);
                events.pop();
                events.pop();
                events.push(tail, tail2);
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }, completeKeyStroke:function(down, up) {
    if (down && down.type === 'keydown' && down.keyCode === up.keyCode) {
      delete down.charCode;
      return true;
    }
    return false;
  }, completeSpecialKeyStroke:function(target, down, up) {
    var key = this.specialKeysByCode[up.keyCode];
    if (key && this.inputRe.test(target.tagName)) {
      delete down.keyCode;
      down.key = key;
      down.selection = this.getTextSelection(target);
      if (down.selection[0] === down.selection[1]) {
        down.caret = down.selection[0];
        delete down.selection;
      }
      return true;
    }
    return false;
  }, getElementXPath:function(el) {
    var me = this, good = false, xpath = [], count, sibling, t, tag;
    for (t = el; t; t = t.parentNode) {
      if (t == me.attachTo.document.body) {
        xpath.unshift('~');
        good = true;
        break;
      }
      if (t.id && !me.ignoreIdRegEx.test(t.id)) {
        xpath.unshift('#' + t.id);
        good = true;
        break;
      }
      for (count = 1, sibling = t; !!(sibling = sibling.previousSibling);) {
        if (sibling.tagName == t.tagName) {
          ++count;
        }
      }
      tag = t.tagName.toLowerCase();
      if (count < 2) {
        xpath.unshift(tag);
      } else {
        xpath.unshift(tag + '[' + count + ']');
      }
    }
    return good ? xpath.join('/') : null;
  }, getRecordedEvents:function() {
    return this.eventsRecorded;
  }, onEvent:function(ev) {
    var me = this, e = new Ext.event.Event(ev), info = me.eventsToRecord[e.type], root, modKeys, elXY, rec = {type:e.type, ts:me.getTimestamp(), target:me.getElementXPath(e.target)}, xy;
    if (!info || !rec.target) {
      return;
    }
    root = e.target.ownerDocument;
    root = root.defaultView || root.parentWindow;
    if (root !== me.attachTo) {
      return;
    }
    if (me.eventsToRecord.scroll) {
      me.syncScroll(e.target);
    }
    if (info.xy) {
      xy = e.getXY();
      if (info.pageCoords || !rec.target) {
        rec.px = xy[0];
        rec.py = xy[1];
      } else {
        elXY = Ext.fly(e.getTarget()).getXY();
        xy[0] -= elXY[0];
        xy[1] -= elXY[1];
        rec.x = xy[0];
        rec.y = xy[1];
      }
    }
    if (info.button) {
      if ('buttons' in ev) {
        rec.button = ev.buttons;
      } else {
        rec.button = ev.button;
      }
      if (!rec.button && info.whileDrag) {
        return;
      }
    }
    if (info.wheel) {
      rec.type = 'wheel';
      if (info.event === 'wheel') {
        rec.dx = ev.deltaX;
        rec.dy = ev.deltaY;
      } else {
        if (typeof ev.wheelDeltaX === 'number') {
          rec.dx = -1 / 40 * ev.wheelDeltaX;
          rec.dy = -1 / 40 * ev.wheelDeltaY;
        } else {
          if (ev.wheelDelta) {
            rec.dy = -1 / 40 * ev.wheelDelta;
          } else {
            if (ev.detail) {
              rec.dy = ev.detail;
            }
          }
        }
      }
    }
    if (info.modKeys) {
      me.modKeys[0] = e.altKey ? 'A' : '';
      me.modKeys[1] = e.ctrlKey ? 'C' : '';
      me.modKeys[2] = e.metaKey ? 'M' : '';
      me.modKeys[3] = e.shiftKey ? 'S' : '';
      modKeys = me.modKeys.join('');
      if (modKeys) {
        rec.modKeys = modKeys;
      }
    }
    if (info.key) {
      rec.charCode = e.getCharCode();
      rec.keyCode = e.getKey();
    }
    if (me.coalesce(rec, e)) {
      me.fireEvent('coalesce', me, rec);
    } else {
      me.eventsRecorded.push(rec);
      me.fireEvent('add', me, rec);
    }
  }, onStart:function() {
    var me = this, ddm = me.attachTo.Ext.dd.DragDropManager, evproto = me.attachTo.Ext.EventObjectImpl.prototype, special = [];
    Recorder.prototype.eventsToRecord.wheel.event = 'onwheel' in me.attachTo.document ? 'wheel' : 'mousewheel';
    me.listeners = [];
    Ext.Object.each(me.eventsToRecord, function(name, value) {
      if (value && value.listen !== false) {
        if (!value.event) {
          value.event = name;
        }
        if (value.alt && value.alt !== name) {
          if (!me.eventsToRecord[value.alt]) {
            special.push(value);
          }
        } else {
          me.listeners.push(me.listenToEvent(value.event));
        }
      }
    });
    Ext.each(special, function(info) {
      me.eventsToRecord[info.alt] = info;
      me.listeners.push(me.listenToEvent(info.alt));
    });
    me.ddmStopEvent = ddm.stopEvent;
    ddm.stopEvent = Ext.Function.createSequence(ddm.stopEvent, function(e) {
      me.onEvent(e);
    });
    me.evStopEvent = evproto.stopEvent;
    evproto.stopEvent = Ext.Function.createSequence(evproto.stopEvent, function() {
      me.onEvent(this);
    });
  }, onStop:function() {
    var me = this;
    Ext.destroy(me.listeners);
    me.listeners = null;
    me.attachTo.Ext.dd.DragDropManager.stopEvent = me.ddmStopEvent;
    me.attachTo.Ext.EventObjectImpl.prototype.stopEvent = me.evStopEvent;
  }, samePt:function(pt1, pt2) {
    return pt1.x == pt2.x && pt1.y == pt2.y;
  }, syncScroll:function(el) {
    var me = this, ts = me.getTimestamp(), oldX, oldY, x, y, scrolled, rec;
    for (var p = el; p; p = p.parentNode) {
      oldX = p.$lastScrollLeft;
      oldY = p.$lastScrollTop;
      x = p.scrollLeft;
      y = p.scrollTop;
      scrolled = false;
      if (oldX !== x) {
        if (x) {
          scrolled = true;
        }
        p.$lastScrollLeft = x;
      }
      if (oldY !== y) {
        if (y) {
          scrolled = true;
        }
        p.$lastScrollTop = y;
      }
      if (scrolled) {
        me.eventsRecorded.push(rec = {type:'scroll', target:me.getElementXPath(p), ts:ts, pos:[x, y]});
        me.fireEvent('add', me, rec);
      }
      if (p.tagName === 'BODY') {
        break;
      }
    }
  }};
});
Ext.define('Ext.ux.rating.Picker', {extend:'Ext.Gadget', xtype:'rating', focusable:true, cachedConfig:{family:'monospace', glyphs:'☆★', minimum:1, limit:5, overStyle:null, rounding:1, scale:'125%', selectedStyle:null, tip:null, trackOver:true, value:null, tooltipText:null, trackingValue:null}, config:{animate:null}, element:{cls:'u' + Ext.baseCSSPrefix + 'rating-picker', reference:'element', children:[{reference:'innerEl', cls:'u' + Ext.baseCSSPrefix + 'rating-picker-inner', listeners:{click:'onClick', 
mousemove:'onMouseMove', mouseenter:'onMouseEnter', mouseleave:'onMouseLeave'}, children:[{reference:'valueEl', cls:'u' + Ext.baseCSSPrefix + 'rating-picker-value'}, {reference:'trackerEl', cls:'u' + Ext.baseCSSPrefix + 'rating-picker-tracker'}]}]}, defaultBindProperty:'value', twoWayBindable:'value', overCls:'u' + Ext.baseCSSPrefix + 'rating-picker-over', trackOverCls:'u' + Ext.baseCSSPrefix + 'rating-picker-track-over', applyGlyphs:function(value) {
  if (typeof value === 'string') {
    if (value.length !== 2) {
      Ext.raise('Expected 2 characters for "glyphs" not "' + value + '".');
    }
    value = [value.charAt(0), value.charAt(1)];
  } else {
    if (typeof value[0] === 'number') {
      value = [String.fromCharCode(value[0]), String.fromCharCode(value[1])];
    }
  }
  return value;
}, applyOverStyle:function(style) {
  this.trackerEl.applyStyles(style);
}, applySelectedStyle:function(style) {
  this.valueEl.applyStyles(style);
}, applyTip:function(tip) {
  if (tip && typeof tip !== 'function') {
    if (!tip.isTemplate) {
      tip = new Ext.XTemplate(tip);
    }
    tip = tip.apply.bind(tip);
  }
  return tip;
}, applyTrackingValue:function(value) {
  return this.applyValue(value);
}, applyValue:function(v) {
  if (v !== null) {
    var rounding = this.getRounding(), limit = this.getLimit(), min = this.getMinimum();
    v = Math.round(Math.round(v / rounding) * rounding * 1000) / 1000;
    v = v < min ? min : v > limit ? limit : v;
  }
  return v;
}, onClick:function(event) {
  var value = this.valueFromEvent(event);
  this.setValue(value);
}, onMouseEnter:function() {
  this.element.addCls(this.overCls);
}, onMouseLeave:function() {
  this.element.removeCls(this.overCls);
}, onMouseMove:function(event) {
  var value = this.valueFromEvent(event);
  this.setTrackingValue(value);
}, updateFamily:function(family) {
  this.element.setStyle('fontFamily', "'" + family + "'");
}, updateGlyphs:function() {
  this.refreshGlyphs();
}, updateLimit:function() {
  this.refreshGlyphs();
}, updateScale:function(size) {
  this.element.setStyle('fontSize', size);
}, updateTip:function() {
  this.refreshTip();
}, updateTooltipText:function(text) {
  this.setTooltip(text);
}, updateTrackingValue:function(value) {
  var me = this, trackerEl = me.trackerEl, newWidth = me.valueToPercent(value);
  trackerEl.setStyle('width', newWidth);
  me.refreshTip();
}, updateTrackOver:function(trackOver) {
  this.element.toggleCls(this.trackOverCls, trackOver);
}, updateValue:function(value, oldValue) {
  var me = this, animate = me.getAnimate(), valueEl = me.valueEl, newWidth = me.valueToPercent(value), column, record;
  if (me.isConfiguring || !animate) {
    valueEl.setStyle('width', newWidth);
  } else {
    valueEl.stopAnimation();
    valueEl.animate(Ext.merge({from:{width:me.valueToPercent(oldValue)}, to:{width:newWidth}}, animate));
  }
  me.refreshTip();
  if (!me.isConfiguring) {
    if (me.hasListeners.change) {
      me.fireEvent('change', me, value, oldValue);
    }
    column = me.getWidgetColumn && me.getWidgetColumn();
    record = column && me.getWidgetRecord && me.getWidgetRecord();
    if (record && column.dataIndex) {
      record.set(column.dataIndex, value);
    }
  }
}, afterCachedConfig:function() {
  this.refresh();
  return this.callParent(arguments);
}, initConfig:function(instanceConfig) {
  this.isConfiguring = true;
  this.callParent([instanceConfig]);
  this.refresh();
}, setConfig:function() {
  var me = this;
  me.isReconfiguring = true;
  me.callParent(arguments);
  me.isReconfiguring = false;
  me.refresh();
  return me;
}, privates:{getGlyphTextNode:function(dom) {
  var node = dom.lastChild;
  if (!node || node.nodeType !== 3) {
    node = dom.ownerDocument.createTextNode('');
    dom.appendChild(node);
  }
  return node;
}, getTooltipData:function() {
  var me = this;
  return {component:me, tracking:me.getTrackingValue(), trackOver:me.getTrackOver(), value:me.getValue()};
}, refresh:function() {
  var me = this;
  if (me.invalidGlyphs) {
    me.refreshGlyphs(true);
  }
  if (me.invalidTip) {
    me.refreshTip(true);
  }
}, refreshGlyphs:function(now) {
  var me = this, later = !now && (me.isConfiguring || me.isReconfiguring), el, glyphs, limit, on, off, trackerEl, valueEl;
  if (!later) {
    el = me.getGlyphTextNode(me.innerEl.dom);
    valueEl = me.getGlyphTextNode(me.valueEl.dom);
    trackerEl = me.getGlyphTextNode(me.trackerEl.dom);
    glyphs = me.getGlyphs();
    limit = me.getLimit();
    for (on = off = ''; limit--;) {
      off += glyphs[0];
      on += glyphs[1];
    }
    el.nodeValue = off;
    valueEl.nodeValue = on;
    trackerEl.nodeValue = on;
  }
  me.invalidGlyphs = later;
}, refreshTip:function(now) {
  var me = this, later = !now && (me.isConfiguring || me.isReconfiguring), data, text, tooltip;
  if (!later) {
    tooltip = me.getTip();
    if (tooltip) {
      data = me.getTooltipData();
      text = tooltip(data);
      me.setTooltipText(text);
    }
  }
  me.invalidTip = later;
}, valueFromEvent:function(event) {
  var me = this, el = me.innerEl, ex = event.getX(), rounding = me.getRounding(), cx = el.getX(), x = ex - cx, w = el.getWidth(), limit = me.getLimit(), v;
  if (me.getInherited().rtl) {
    x = w - x;
  }
  v = x / w * limit;
  v = Math.ceil(v / rounding) * rounding;
  return v;
}, valueToPercent:function(value) {
  value = value / this.getLimit() * 100;
  return value + '%';
}}});
Ext.define('Ext.ux.overrides.rating.Picker', {override:'Ext.ux.rating.Picker', initConfig:function(config) {
  if (config && config.tooltip) {
    config.tip = config.tooltip;
    Ext.log.warn('[Ext.ux.rating.Picker] The "tooltip" config was replaced by "tip"');
  }
  this.callParent([config]);
}, updateTooltipText:function(text) {
  var innerEl = this.innerEl, QuickTips = Ext.tip && Ext.tip.QuickTipManager, tip = QuickTips && QuickTips.tip, target;
  if (QuickTips) {
    innerEl.dom.setAttribute('data-qtip', text);
    this.trackerEl.dom.setAttribute('data-qtip', text);
    target = tip && tip.activeTarget;
    target = target && target.el;
    if (target && innerEl.contains(target)) {
      tip.update(text);
    }
  }
}});
Ext.define('Ext.ux.BoxReorderer', {extend:'Ext.plugin.Abstract', alias:'plugin.boxreorderer', requires:['Ext.dd.DD'], mixins:{observable:'Ext.util.Observable'}, itemSelector:'.x-box-item', animate:100, constructor:function() {
  this.callParent(arguments);
  this.mixins.observable.constructor.call(this);
}, init:function(container) {
  var me = this, layout = container.getLayout();
  me.container = container;
  me.names = layout._props[layout.type].names;
  me.animatePolicy = {};
  me.animatePolicy[me.names.x] = true;
  me.container.on({scope:me, boxready:me.onBoxReady, beforedestroy:me.onContainerDestroy});
}, onContainerDestroy:function() {
  var dd = this.dd;
  if (dd) {
    dd.unreg();
    this.dd = null;
  }
}, onBoxReady:function() {
  var me = this, layout = me.container.getLayout(), names = me.names, dd;
  dd = me.dd = new Ext.dd.DD(layout.innerCt, me.container.id + '-reorderer');
  Ext.apply(dd, {animate:me.animate, reorderer:me, container:me.container, getDragCmp:me.getDragCmp, clickValidator:Ext.Function.createInterceptor(dd.clickValidator, me.clickValidator, me, false), onMouseDown:me.onMouseDown, startDrag:me.startDrag, onDrag:me.onDrag, endDrag:me.endDrag, getNewIndex:me.getNewIndex, doSwap:me.doSwap, findReorderable:me.findReorderable, names:names});
  dd.dim = names.width;
  dd.startAttr = names.beforeX;
  dd.endAttr = names.afterX;
}, getDragCmp:function(e) {
  return this.container.getChildByElement(e.getTarget(this.itemSelector, 10));
}, clickValidator:function(e) {
  var cmp = this.getDragCmp(e);
  return !!(cmp && cmp.reorderable !== false);
}, onMouseDown:function(e) {
  var me = this, container = me.container, containerBox, cmpEl, cmpBox;
  me.dragCmp = me.getDragCmp(e);
  if (me.dragCmp) {
    cmpEl = me.dragCmp.getEl();
    me.startIndex = me.curIndex = container.items.indexOf(me.dragCmp);
    cmpBox = cmpEl.getBox();
    me.lastPos = cmpBox[me.startAttr];
    containerBox = container.el.getBox();
    if (me.dim === 'width') {
      me.minX = containerBox.left;
      me.maxX = containerBox.right - cmpBox.width;
      me.minY = me.maxY = cmpBox.top;
      me.deltaX = e.getX() - cmpBox.left;
    } else {
      me.minY = containerBox.top;
      me.maxY = containerBox.bottom - cmpBox.height;
      me.minX = me.maxX = cmpBox.left;
      me.deltaY = e.getY() - cmpBox.top;
    }
    me.constrainY = me.constrainX = true;
  }
}, startDrag:function() {
  var me = this, dragCmp = me.dragCmp;
  if (dragCmp) {
    dragCmp.setPosition = Ext.emptyFn;
    dragCmp.animate = false;
    if (me.animate) {
      me.container.getLayout().animatePolicy = me.reorderer.animatePolicy;
    }
    me.dragElId = dragCmp.getEl().id;
    me.reorderer.fireEvent('StartDrag', me, me.container, dragCmp, me.curIndex);
    dragCmp.suspendEvents();
    dragCmp.disabled = true;
    dragCmp.el.setStyle('zIndex', 100);
  } else {
    me.dragElId = null;
  }
}, findReorderable:function(newIndex) {
  var me = this, items = me.container.items, newItem;
  if (items.getAt(newIndex).reorderable === false) {
    newItem = items.getAt(newIndex);
    if (newIndex > me.startIndex) {
      while (newItem && newItem.reorderable === false) {
        newIndex++;
        newItem = items.getAt(newIndex);
      }
    } else {
      while (newItem && newItem.reorderable === false) {
        newIndex--;
        newItem = items.getAt(newIndex);
      }
    }
  }
  newIndex = Math.min(Math.max(newIndex, 0), items.getCount() - 1);
  if (items.getAt(newIndex).reorderable === false) {
    return -1;
  }
  return newIndex;
}, doSwap:function(newIndex) {
  var me = this, items = me.container.items, container = me.container, orig, dest, tmpIndex;
  newIndex = me.findReorderable(newIndex);
  if (newIndex === -1 || newIndex === me.curIndex) {
    return;
  }
  me.reorderer.fireEvent('ChangeIndex', me, container, me.dragCmp, me.startIndex, newIndex);
  orig = items.getAt(me.curIndex);
  dest = items.getAt(newIndex);
  items.remove(orig);
  tmpIndex = Math.min(Math.max(newIndex, 0), items.getCount() - 1);
  items.insert(tmpIndex, orig);
  items.remove(dest);
  items.insert(me.curIndex, dest);
  container.updateLayout({isRoot:true});
  me.curIndex = newIndex;
}, onDrag:function(e) {
  var me = this, newIndex;
  newIndex = me.getNewIndex(e.getPoint());
  if (newIndex !== undefined) {
    me.reorderer.fireEvent('Drag', me, me.container, me.dragCmp, me.startIndex, me.curIndex);
    me.doSwap(newIndex);
  }
}, endDrag:function(e) {
  if (e) {
    e.stopEvent();
  }
  var me = this, layout = me.container.getLayout(), temp;
  if (me.dragCmp) {
    delete me.dragElId;
    delete me.dragCmp.setPosition;
    me.dragCmp.animate = true;
    me.dragCmp.lastBox[me.names.x] = me.dragCmp.getPosition(true)[me.names.widthIndex];
    me.container.updateLayout({isRoot:true});
    temp = Ext.fx.Manager.getFxQueue(me.dragCmp.el.id)[0];
    if (temp) {
      temp.on({afteranimate:me.reorderer.afterBoxReflow, scope:me});
    } else {
      Ext.asap(me.reorderer.afterBoxReflow, me);
    }
    if (me.animate) {
      delete layout.animatePolicy;
    }
    me.reorderer.fireEvent('drop', me, me.container, me.dragCmp, me.startIndex, me.curIndex);
  }
}, afterBoxReflow:function() {
  var me = this;
  me.dragCmp.el.setStyle('zIndex', '');
  me.dragCmp.disabled = false;
  me.dragCmp.resumeEvents();
}, getNewIndex:function(pointerPos) {
  var me = this, dragEl = me.getDragEl(), dragBox = Ext.fly(dragEl).getBox(), targetEl, targetBox, targetMidpoint, i = 0, it = me.container.items.items, ln = it.length, lastPos = me.lastPos;
  me.lastPos = dragBox[me.startAttr];
  for (; i < ln; i++) {
    targetEl = it[i].getEl();
    if (targetEl.dom !== dragEl && targetEl.is(me.reorderer.itemSelector)) {
      targetBox = targetEl.getBox();
      targetMidpoint = targetBox[me.startAttr] + (targetBox[me.dim] >> 1);
      if (i < me.curIndex) {
        if (dragBox[me.startAttr] < lastPos && dragBox[me.startAttr] < targetMidpoint - 5) {
          return i;
        }
      } else {
        if (i > me.curIndex) {
          if (dragBox[me.startAttr] > lastPos && dragBox[me.endAttr] > targetMidpoint + 5) {
            return i;
          }
        }
      }
    }
  }
}});
Ext.define('Ext.ux.CellDragDrop', {extend:'Ext.plugin.Abstract', alias:'plugin.celldragdrop', uses:['Ext.view.DragZone'], enforceType:false, applyEmptyText:false, emptyText:'', dropBackgroundColor:'green', noDropBackgroundColor:'red', dragText:'{0} selected row{1}', ddGroup:'GridDD', enableDrop:true, enableDrag:true, containerScroll:false, init:function(view) {
  var me = this;
  view.on('render', me.onViewRender, me, {single:true});
}, destroy:function() {
  var me = this;
  me.dragZone = me.dropZone = Ext.destroy(me.dragZone, me.dropZone);
  me.callParent();
}, enable:function() {
  var me = this;
  if (me.dragZone) {
    me.dragZone.unlock();
  }
  if (me.dropZone) {
    me.dropZone.unlock();
  }
  me.callParent();
}, disable:function() {
  var me = this;
  if (me.dragZone) {
    me.dragZone.lock();
  }
  if (me.dropZone) {
    me.dropZone.lock();
  }
  me.callParent();
}, onViewRender:function(view) {
  var me = this, scrollEl;
  if (me.enableDrag) {
    if (me.containerScroll) {
      scrollEl = view.getEl();
    }
    me.dragZone = new Ext.view.DragZone({view:view, ddGroup:me.dragGroup || me.ddGroup, dragText:me.dragText, containerScroll:me.containerScroll, scrollEl:scrollEl, getDragData:function(e) {
      var view = this.view, item = e.getTarget(view.getItemSelector()), record = view.getRecord(item), cell = e.getTarget(view.getCellSelector()), dragEl, header;
      if (item) {
        dragEl = document.createElement('div');
        dragEl.className = 'x-form-text';
        dragEl.appendChild(document.createTextNode(cell.textContent || cell.innerText));
        header = view.getHeaderByCell(cell);
        return {event:new Ext.EventObjectImpl(e), ddel:dragEl, item:e.target, columnName:header.dataIndex, record:record};
      }
    }, onInitDrag:function(x, y) {
      var self = this, data = self.dragData, view = self.view, selectionModel = view.getSelectionModel(), record = data.record, el = data.ddel;
      if (!selectionModel.isSelected(record)) {
        selectionModel.select(record, true);
      }
      Ext.fly(self.ddel).update(el.textContent || el.innerText);
      self.proxy.update(self.ddel);
      self.onStartDrag(x, y);
      return true;
    }});
  }
  if (me.enableDrop) {
    me.dropZone = new Ext.dd.DropZone(view.el, {view:view, ddGroup:me.dropGroup || me.ddGroup, containerScroll:true, getTargetFromEvent:function(e) {
      var self = this, view = self.view, cell = e.getTarget(view.cellSelector), row, header;
      if (cell) {
        row = view.findItemByChild(cell);
        header = view.getHeaderByCell(cell);
        if (row && header) {
          return {node:cell, record:view.getRecord(row), columnName:header.dataIndex};
        }
      }
    }, onNodeEnter:function(target, dd, e, dragData) {
      var self = this, destType = target.record.getField(target.columnName).type.toUpperCase(), sourceType = dragData.record.getField(dragData.columnName).type.toUpperCase();
      delete self.dropOK;
      if (!target || target.node === dragData.item.parentNode) {
        return;
      }
      if (me.enforceType && destType !== sourceType) {
        self.dropOK = false;
        if (me.noDropCls) {
          Ext.fly(target.node).addCls(me.noDropCls);
        } else {
          Ext.fly(target.node).applyStyles({backgroundColor:me.noDropBackgroundColor});
        }
        return false;
      }
      self.dropOK = true;
      if (me.dropCls) {
        Ext.fly(target.node).addCls(me.dropCls);
      } else {
        Ext.fly(target.node).applyStyles({backgroundColor:me.dropBackgroundColor});
      }
    }, onNodeOver:function(target, dd, e, dragData) {
      return this.dropOK ? this.dropAllowed : this.dropNotAllowed;
    }, onNodeOut:function(target, dd, e, dragData) {
      var cls = this.dropOK ? me.dropCls : me.noDropCls;
      if (cls) {
        Ext.fly(target.node).removeCls(cls);
      } else {
        Ext.fly(target.node).applyStyles({backgroundColor:''});
      }
    }, onNodeDrop:function(target, dd, e, dragData) {
      if (this.dropOK) {
        target.record.set(target.columnName, dragData.record.get(dragData.columnName));
        if (me.applyEmptyText) {
          dragData.record.set(dragData.columnName, me.emptyText);
        }
        return true;
      }
    }, onCellDrop:Ext.emptyFn});
  }
}});
Ext.define('Ext.ux.DataTip', function(DataTip) {
  function onHostRender() {
    var e = this.isXType('panel') ? this.body : this.el;
    if (this.dataTip.renderToTarget) {
      this.dataTip.render(e);
    }
    this.dataTip.setTarget(e);
  }
  function updateTip(tip, data) {
    if (tip.rendered) {
      if (tip.host.fireEvent('beforeshowtip', tip.eventHost, tip, data) === false) {
        return false;
      }
      tip.update(data);
    } else {
      if (Ext.isString(data)) {
        tip.html = data;
      } else {
        tip.data = data;
      }
    }
  }
  function beforeViewTipShow(tip) {
    var rec = this.view.getRecord(tip.triggerElement), data;
    if (rec) {
      data = tip.initialConfig.data ? Ext.apply(tip.initialConfig.data, rec.data) : rec.data;
      return updateTip(tip, data);
    } else {
      return false;
    }
  }
  function beforeFormTipShow(tip) {
    var field = Ext.getCmp(tip.triggerElement.id);
    if (field && (field.tooltip || tip.tpl)) {
      return updateTip(tip, field.tooltip || field);
    } else {
      return false;
    }
  }
  return {extend:'Ext.tip.ToolTip', mixins:{plugin:'Ext.plugin.Abstract'}, alias:'plugin.datatip', lockableScope:'both', constructor:function(config) {
    var me = this;
    me.callParent([config]);
    me.mixins.plugin.constructor.call(me, config);
  }, init:function(host) {
    var me = this;
    me.mixins.plugin.init.call(me, host);
    host.dataTip = me;
    me.host = host;
    if (host.isXType('tablepanel')) {
      me.view = host.getView();
      if (host.ownerLockable) {
        me.host = host.ownerLockable;
      }
      me.delegate = me.delegate || me.view.rowSelector;
      me.on('beforeshow', beforeViewTipShow);
    } else {
      if (host.isXType('dataview')) {
        me.view = me.host;
        me.delegate = me.delegate || host.itemSelector;
        me.on('beforeshow', beforeViewTipShow);
      } else {
        if (host.isXType('form')) {
          me.delegate = '.' + Ext.form.Labelable.prototype.formItemCls;
          me.on('beforeshow', beforeFormTipShow);
        } else {
          if (host.isXType('combobox')) {
            me.view = host.getPicker();
            me.delegate = me.delegate || me.view.getItemSelector();
            me.on('beforeshow', beforeViewTipShow);
          }
        }
      }
    }
    if (host.rendered) {
      onHostRender.call(host);
    } else {
      host.onRender = Ext.Function.createSequence(host.onRender, onHostRender);
    }
  }};
});
Ext.define('Ext.ux.DataView.Animated', {alias:'plugin.ux-animated-dataview', defaults:{duration:750, idProperty:'id'}, constructor:function(config) {
  Ext.apply(this, config || {}, this.defaults);
}, init:function(dataview) {
  var me = this, store = dataview.store, items = dataview.all, task = {interval:20}, duration = me.duration;
  me.dataview = dataview;
  dataview.blockRefresh = true;
  dataview.updateIndexes = Ext.Function.createSequence(dataview.updateIndexes, function() {
    this.getTargetEl().select(this.itemSelector).each(function(element, composite, index) {
      element.dom.id = Ext.util.Format.format('{0}-{1}', dataview.id, store.getAt(index).internalId);
    }, this);
  }, dataview);
  me.dataviewID = dataview.id;
  me.cachedStoreData = {};
  me.cacheStoreData(store.data || store.snapshot);
  dataview.on('resize', function() {
    var store = dataview.store;
    if (store.getCount() > 0) {
    }
  }, this);
  dataview.store.on({datachanged:reDraw, scope:this, buffer:50});
  function reDraw() {
    var parentEl = dataview.getTargetEl(), parentElY = parentEl.getY(), parentElPaddingTop = parentEl.getPadding('t'), added = me.getAdded(store), removed = me.getRemoved(store), remaining = me.getRemaining(store), itemArray, i, id, itemFly = new Ext.dom.Fly, rtl = me.dataview.getInherited().rtl, oldPos, newPos, styleSide = rtl ? 'right' : 'left', newStyle = {};
    if (!parentEl) {
      return;
    }
    Ext.iterate(removed, function(recId, item) {
      id = me.dataviewID + '-' + recId;
      Ext.fx.Manager.stopAnimation(id);
      item.dom = Ext.getDom(id);
      if (!item.dom) {
        delete removed[recId];
      }
    });
    me.cacheStoreData(store);
    var oldPositions = {}, newPositions = {};
    Ext.iterate(remaining, function(id, item) {
      if (itemFly.attach(Ext.getDom(me.dataviewID + '-' + id))) {
        oldPos = oldPositions[id] = {top:itemFly.getY() - parentElY - itemFly.getMargin('t') - parentElPaddingTop};
        oldPos[styleSide] = me.getItemX(itemFly);
      } else {
        delete remaining[id];
      }
    });
    dataview.refresh();
    Ext.iterate(removed, function(id, item) {
      parentEl.dom.appendChild(item.dom);
      itemFly.attach(item.dom).animate({duration:duration, opacity:0, callback:function(anim) {
        var el = Ext.get(anim.target.id);
        if (el) {
          el.destroy();
        }
      }});
      delete item.dom;
    });
    if (!store.getCount()) {
      return;
    }
    itemArray = items.slice();
    for (i = itemArray.length - 1; i >= 0; i--) {
      id = store.getAt(i).internalId;
      itemFly.attach(itemArray[i]);
      newPositions[id] = {dom:itemFly.dom, top:itemFly.getY() - parentElY - itemFly.getMargin('t') - parentElPaddingTop};
      newPositions[id][styleSide] = me.getItemX(itemFly);
      newPos = oldPositions[id] || newPositions[id];
      newStyle.position = 'absolute';
      newStyle.top = newPos.top + 'px';
      newStyle[styleSide] = newPos.left + 'px';
      itemFly.applyStyles(newStyle);
    }
    var doAnimate = function() {
      var elapsed = new Date - task.taskStartTime, fraction = elapsed / duration;
      if (fraction >= 1) {
        newStyle.position = newStyle.top = newStyle[styleSide] = '';
        for (id in newPositions) {
          itemFly.attach(newPositions[id].dom).applyStyles(newStyle);
        }
        Ext.TaskManager.stop(task);
      } else {
        for (id in remaining) {
          var oldPos = oldPositions[id], newPos = newPositions[id], oldTop = oldPos.top, newTop = newPos.top, oldLeft = oldPos[styleSide], newLeft = newPos[styleSide], diffTop = fraction * Math.abs(oldTop - newTop), diffLeft = fraction * Math.abs(oldLeft - newLeft), midTop = oldTop > newTop ? oldTop - diffTop : oldTop + diffTop, midLeft = oldLeft > newLeft ? oldLeft - diffLeft : oldLeft + diffLeft;
          newStyle.top = midTop + 'px';
          newStyle[styleSide] = midLeft + 'px';
          itemFly.attach(newPos.dom).applyStyles(newStyle);
        }
      }
    };
    Ext.iterate(added, function(id, item) {
      if (itemFly.attach(Ext.getDom(me.dataviewID + '-' + id))) {
        itemFly.setOpacity(0);
        itemFly.animate({duration:duration, opacity:1});
      }
    });
    Ext.TaskManager.stop(task);
    task.run = doAnimate;
    Ext.TaskManager.start(task);
    me.cacheStoreData(store);
  }
}, getItemX:function(el) {
  var rtl = this.dataview.getInherited().rtl, parentEl = el.up('');
  if (rtl) {
    return parentEl.getViewRegion().right - el.getRegion().right + el.getMargin('r');
  } else {
    return el.getX() - parentEl.getX() - el.getMargin('l') - parentEl.getPadding('l');
  }
}, cacheStoreData:function(store) {
  var cachedStoreData = this.cachedStoreData = {};
  store.each(function(record) {
    cachedStoreData[record.internalId] = record;
  });
}, getExisting:function() {
  return this.cachedStoreData;
}, getExistingCount:function() {
  var count = 0, items = this.getExisting();
  for (var k in items) {
    count++;
  }
  return count;
}, getAdded:function(store) {
  var cachedStoreData = this.cachedStoreData, added = {};
  store.each(function(record) {
    if (cachedStoreData[record.internalId] == null) {
      added[record.internalId] = record;
    }
  });
  return added;
}, getRemoved:function(store) {
  var cachedStoreData = this.cachedStoreData, removed = {}, id;
  for (id in cachedStoreData) {
    if (store.findBy(function(record) {
      return record.internalId == id;
    }) == -1) {
      removed[id] = cachedStoreData[id];
    }
  }
  return removed;
}, getRemaining:function(store) {
  var cachedStoreData = this.cachedStoreData, remaining = {};
  store.each(function(record) {
    if (cachedStoreData[record.internalId] != null) {
      remaining[record.internalId] = record;
    }
  });
  return remaining;
}});
Ext.define('Ext.ux.DataView.DragSelector', {requires:['Ext.dd.DragTracker', 'Ext.util.Region'], alias:'plugin.dataviewdragselector', init:function(dataview) {
  var scroller = dataview.getScrollable();
  if (scroller && (scroller.getX() || scroller.getY()) && (Ext.supports.PointerEvents || Ext.supports.MSPointerEvents)) {
    Ext.log.warn('DragSelector not available on PointerEvent devices');
    return;
  }
  this.dataview = dataview;
  dataview.mon(dataview, {beforecontainerclick:this.cancelClick, scope:this, render:{fn:this.onRender, scope:this, single:true}});
}, onRender:function() {
  this.tracker = Ext.create('Ext.dd.DragTracker', {dataview:this.dataview, el:this.dataview.el, onBeforeStart:this.onBeforeStart, onStart:this.onStart.bind(this), onDrag:this.onDrag.bind(this), onEnd:Ext.Function.createDelayed(this.onEnd, 100, this)});
  this.dragRegion = Ext.create('Ext.util.Region');
}, onBeforeStart:function(e) {
  return e.target === this.dataview.getEl().dom;
}, onStart:function(e) {
  var dataview = this.dataview;
  this.dragging = true;
  this.fillRegions();
  this.getProxy().show();
  dataview.getSelectionModel().deselectAll();
}, cancelClick:function() {
  return !this.dragging;
}, onDrag:function(e) {
  var selModel = this.dataview.getSelectionModel(), dragRegion = this.dragRegion, bodyRegion = this.bodyRegion, proxy = this.getProxy(), regions = this.regions, length = regions.length, startXY = this.tracker.startXY, currentXY = this.tracker.getXY(), minX = Math.min(startXY[0], currentXY[0]), minY = Math.min(startXY[1], currentXY[1]), width = Math.abs(startXY[0] - currentXY[0]), height = Math.abs(startXY[1] - currentXY[1]), region, selected, i;
  Ext.apply(dragRegion, {top:minY, left:minX, right:minX + width, bottom:minY + height});
  dragRegion.constrainTo(bodyRegion);
  proxy.setBox(dragRegion);
  for (i = 0; i < length; i++) {
    region = regions[i];
    selected = dragRegion.intersect(region);
    if (selected) {
      selModel.select(i, true);
    } else {
      selModel.deselect(i);
    }
  }
}, onEnd:function(e) {
  var dataview = this.dataview, selModel = dataview.getSelectionModel();
  this.dragging = false;
  this.getProxy().hide();
}, getProxy:function() {
  if (!this.proxy) {
    this.proxy = this.dataview.getEl().createChild({tag:'div', cls:'x-view-selector'});
  }
  return this.proxy;
}, fillRegions:function() {
  var dataview = this.dataview, regions = this.regions = [];
  dataview.all.each(function(node) {
    regions.push(node.getRegion());
  });
  this.bodyRegion = dataview.getEl().getRegion();
}});
Ext.define('Ext.ux.DataView.Draggable', {requires:'Ext.dd.DragZone', ghostCls:'x-dataview-draggable-ghost', ghostTpl:['\x3ctpl for\x3d"."\x3e', '{title}', '\x3c/tpl\x3e'], init:function(dataview, config) {
  this.dataview = dataview;
  dataview.on('render', this.onRender, this);
  Ext.apply(this, {itemSelector:dataview.itemSelector, ghostConfig:{}}, config || {});
  Ext.applyIf(this.ghostConfig, {itemSelector:'img', cls:this.ghostCls, tpl:this.ghostTpl});
}, onRender:function() {
  var me = this, config = Ext.apply({}, me.ddConfig || {}, {dvDraggable:me, dataview:me.dataview, getDragData:me.getDragData, getTreeNode:me.getTreeNode, afterRepair:me.afterRepair, getRepairXY:me.getRepairXY});
  me.dragZone = Ext.create('Ext.dd.DragZone', me.dataview.getEl(), config);
  me.dataview.setItemsDraggable(true);
}, getDragData:function(e) {
  var draggable = this.dvDraggable, dataview = this.dataview, selModel = dataview.getSelectionModel(), target = e.getTarget(draggable.itemSelector), selected, dragData;
  if (target) {
    e.preventDefault();
    if (!dataview.isSelected(target)) {
      selModel.select(dataview.getRecord(target));
    }
    selected = dataview.getSelectedNodes();
    dragData = {copy:true, nodes:selected, records:selModel.getSelection(), item:true};
    if (selected.length === 1) {
      dragData.single = true;
      dragData.ddel = target;
    } else {
      dragData.multi = true;
      dragData.ddel = draggable.prepareGhost(selModel.getSelection());
    }
    return dragData;
  }
  return false;
}, getTreeNode:function() {
}, afterRepair:function() {
  this.dragging = false;
  var nodes = this.dragData.nodes, length = nodes.length, i;
  for (i = 0; i < length; i++) {
    Ext.get(nodes[i]).frame('#8db2e3', 1);
  }
}, getRepairXY:function(e) {
  if (this.dragData.multi) {
    return false;
  } else {
    var repairEl = Ext.get(this.dragData.ddel), repairXY = repairEl.getXY();
    repairXY[0] += repairEl.getPadding('t') + repairEl.getMargin('t');
    repairXY[1] += repairEl.getPadding('l') + repairEl.getMargin('l');
    return repairXY;
  }
}, prepareGhost:function(records) {
  return this.createGhost(records).getEl().dom;
}, createGhost:function(records) {
  var me = this, store;
  if (me.ghost) {
    (store = me.ghost.store).loadRecords(records);
  } else {
    store = Ext.create('Ext.data.Store', {model:records[0].self});
    store.loadRecords(records);
    me.ghost = Ext.create('Ext.view.View', Ext.apply({renderTo:document.createElement('div'), store:store}, me.ghostConfig));
    me.ghost.container.skipGarbageCollection = me.ghost.el.skipGarbageCollection = true;
  }
  store.clearData();
  return me.ghost;
}, destroy:function() {
  var ghost = this.ghost;
  if (ghost) {
    ghost.container.destroy();
    ghost.destroy();
  }
  this.callParent();
}});
Ext.define('Ext.ux.DataView.LabelEditor', {extend:'Ext.Editor', alias:'plugin.dataviewlabeleditor', alignment:'tl-tl', completeOnEnter:true, cancelOnEsc:true, shim:false, autoSize:{width:'boundEl', height:'field'}, labelSelector:'x-editable', requires:['Ext.form.field.Text'], constructor:function(config) {
  config.field = config.field || Ext.create('Ext.form.field.Text', {allowOnlyWhitespace:false, selectOnFocus:true});
  this.callParent([config]);
}, init:function(view) {
  this.view = view;
  this.mon(view, 'afterrender', this.bindEvents, this);
  this.on('complete', this.onSave, this);
}, bindEvents:function() {
  this.mon(this.view.getEl(), {click:{fn:this.onClick, scope:this}});
}, onClick:function(e, target) {
  var me = this, item, record;
  if (Ext.fly(target).hasCls(me.labelSelector) && !me.editing && !e.ctrlKey && !e.shiftKey) {
    e.stopEvent();
    item = me.view.findItemByChild(target);
    record = me.view.store.getAt(me.view.indexOf(item));
    me.startEdit(target, record.data[me.dataIndex]);
    me.activeRecord = record;
  } else {
    if (me.editing) {
      me.field.blur();
      e.preventDefault();
    }
  }
}, onSave:function(ed, value) {
  this.activeRecord.set(this.dataIndex, value);
}});
Ext.ux.DataViewTransition = Ext.extend(Object, {defaults:{duration:750, idProperty:'id'}, constructor:function(config) {
  Ext.apply(this, config || {}, this.defaults);
}, init:function(dataview) {
  this.dataview = dataview;
  var idProperty = this.idProperty;
  dataview.blockRefresh = true;
  dataview.updateIndexes = Ext.Function.createSequence(dataview.updateIndexes, function() {
    this.getTargetEl().select(this.itemSelector).each(function(element, composite, index) {
      element.id = element.dom.id = Ext.util.Format.format('{0}-{1}', dataview.id, dataview.store.getAt(index).get(idProperty));
    }, this);
  }, dataview);
  this.dataviewID = dataview.id;
  this.cachedStoreData = {};
  this.cacheStoreData(dataview.store.snapshot);
  dataview.store.on('datachanged', function(store) {
    var parentEl = dataview.getTargetEl(), calcItem = store.getAt(0), added = this.getAdded(store), removed = this.getRemoved(store), previous = this.getRemaining(store), existing = Ext.apply({}, previous, added);
    Ext.each(removed, function(item) {
      Ext.fly(this.dataviewID + '-' + item.get(this.idProperty)).animate({remove:false, duration:duration, opacity:0, useDisplay:true});
    }, this);
    if (calcItem == undefined) {
      this.cacheStoreData(store);
      return;
    }
    var el = Ext.get(this.dataviewID + '-' + calcItem.get(this.idProperty));
    var itemCount = store.getCount(), itemWidth = el.getMargin('lr') + el.getWidth(), itemHeight = el.getMargin('bt') + el.getHeight(), dvWidth = parentEl.getWidth(), columns = Math.floor(dvWidth / itemWidth), rows = Math.ceil(itemCount / columns), currentRows = Math.ceil(this.getExistingCount() / columns);
    parentEl.applyStyles({display:'block', position:'relative'});
    var oldPositions = {}, newPositions = {}, elCache = {};
    Ext.iterate(previous, function(id, item) {
      var id = item.get(this.idProperty), el = elCache[id] = Ext.get(this.dataviewID + '-' + id);
      oldPositions[id] = {top:el.getY() - parentEl.getY() - el.getMargin('t') - parentEl.getPadding('t'), left:el.getX() - parentEl.getX() - el.getMargin('l') - parentEl.getPadding('l')};
    }, this);
    Ext.iterate(previous, function(id, item) {
      var oldPos = oldPositions[id], el = elCache[id];
      if (el.getStyle('position') != 'absolute') {
        elCache[id].applyStyles({position:'absolute', left:oldPos.left + 'px', top:oldPos.top + 'px', width:el.getWidth(!Ext.isIE || Ext.isStrict), height:el.getHeight(!Ext.isIE || Ext.isStrict)});
      }
    });
    var index = 0;
    Ext.iterate(store.data.items, function(item) {
      var id = item.get(idProperty), el = elCache[id];
      var column = index % columns, row = Math.floor(index / columns), top = row * itemHeight, left = column * itemWidth;
      newPositions[id] = {top:top, left:left};
      index++;
    }, this);
    var startTime = new Date, duration = this.duration, dataviewID = this.dataviewID;
    var doAnimate = function() {
      var elapsed = new Date - startTime, fraction = elapsed / duration;
      if (fraction >= 1) {
        for (var id in newPositions) {
          Ext.fly(dataviewID + '-' + id).applyStyles({top:newPositions[id].top + 'px', left:newPositions[id].left + 'px'});
        }
        Ext.TaskManager.stop(task);
      } else {
        for (var id in newPositions) {
          if (!previous[id]) {
            continue;
          }
          var oldPos = oldPositions[id], newPos = newPositions[id], oldTop = oldPos.top, newTop = newPos.top, oldLeft = oldPos.left, newLeft = newPos.left, diffTop = fraction * Math.abs(oldTop - newTop), diffLeft = fraction * Math.abs(oldLeft - newLeft), midTop = oldTop > newTop ? oldTop - diffTop : oldTop + diffTop, midLeft = oldLeft > newLeft ? oldLeft - diffLeft : oldLeft + diffLeft;
          Ext.fly(dataviewID + '-' + id).applyStyles({top:midTop + 'px', left:midLeft + 'px'});
        }
      }
    };
    var task = {run:doAnimate, interval:20, scope:this};
    Ext.TaskManager.start(task);
    var count = 0;
    for (var k in added) {
      count++;
    }
    if (Ext.global.console && Ext.global.console.log) {
      Ext.global.console.log('added:', count);
    }
    Ext.iterate(added, function(id, item) {
      Ext.fly(this.dataviewID + '-' + item.get(this.idProperty)).applyStyles({top:newPositions[item.get(this.idProperty)].top + 'px', left:newPositions[item.get(this.idProperty)].left + 'px'});
      Ext.fly(this.dataviewID + '-' + item.get(this.idProperty)).animate({remove:false, duration:duration, opacity:1});
    }, this);
    this.cacheStoreData(store);
  }, this);
}, cacheStoreData:function(store) {
  this.cachedStoreData = {};
  store.each(function(record) {
    this.cachedStoreData[record.get(this.idProperty)] = record;
  }, this);
}, getExisting:function() {
  return this.cachedStoreData;
}, getExistingCount:function() {
  var count = 0, items = this.getExisting();
  for (var k in items) {
    count++;
  }
  return count;
}, getAdded:function(store) {
  var added = {};
  store.each(function(record) {
    if (this.cachedStoreData[record.get(this.idProperty)] == undefined) {
      added[record.get(this.idProperty)] = record;
    }
  }, this);
  return added;
}, getRemoved:function(store) {
  var removed = [];
  for (var id in this.cachedStoreData) {
    if (store.findExact(this.idProperty, Number(id)) == -1) {
      removed.push(this.cachedStoreData[id]);
    }
  }
  return removed;
}, getRemaining:function(store) {
  var remaining = {};
  store.each(function(record) {
    if (this.cachedStoreData[record.get(this.idProperty)] != undefined) {
      remaining[record.get(this.idProperty)] = record;
    }
  }, this);
  return remaining;
}});
Ext.define('Ext.ux.Explorer', {extend:'Ext.panel.Panel', xtype:'explorer', requires:['Ext.layout.container.Border', 'Ext.toolbar.Breadcrumb', 'Ext.tree.Panel'], config:{breadcrumb:{dock:'top', xtype:'breadcrumb', reference:'breadcrumb'}, contentView:{xtype:'dataview', reference:'contentView', region:'center', cls:Ext.baseCSSPrefix + 'explorer-view', itemSelector:'.' + Ext.baseCSSPrefix + 'explorer-item', tpl:'\x3ctpl for\x3d"."\x3e' + '\x3cdiv class\x3d"' + Ext.baseCSSPrefix + 'explorer-item"\x3e' + 
'\x3cdiv class\x3d"{iconCls}"\x3e' + '\x3cdiv class\x3d"' + Ext.baseCSSPrefix + 'explorer-node-icon' + '{[values.leaf ? " ' + Ext.baseCSSPrefix + 'explorer-leaf-icon' + '" : ""]}' + '"\x3e' + '\x3c/div\x3e' + '\x3cdiv class\x3d"' + Ext.baseCSSPrefix + 'explorer-item-text"\x3e{text}\x3c/div\x3e' + '\x3c/div\x3e' + '\x3c/div\x3e' + '\x3c/tpl\x3e'}, store:null, tree:{xtype:'treepanel', reference:'tree', region:'west', width:200}}, renderConfig:{selection:null}, layout:'border', referenceHolder:true, 
defaultListenerScope:true, cls:Ext.baseCSSPrefix + 'explorer', initComponent:function() {
  var me = this, store = me.getStore();
  if (!store) {
    Ext.raise('Ext.ux.Explorer requires a store.');
  }
  me.dockedItems = [me.getBreadcrumb()];
  me.items = [me.getTree(), me.getContentView()];
  me.callParent();
}, applyBreadcrumb:function(breadcrumb) {
  var store = this.getStore();
  breadcrumb = Ext.create(Ext.apply({store:store, selection:store.getRoot()}, breadcrumb));
  breadcrumb.on('selectionchange', '_onBreadcrumbSelectionChange', this);
  return breadcrumb;
}, applyContentView:function(contentView) {
  var contentStore = this.contentStore = new Ext.data.Store({model:this.getStore().model});
  contentView = Ext.create(Ext.apply({store:contentStore}, contentView));
  return contentView;
}, applyTree:function(tree) {
  tree = Ext.create(Ext.apply({store:this.getStore()}, tree));
  tree.on('selectionchange', '_onTreeSelectionChange', this);
  return tree;
}, updateSelection:function(node) {
  var me = this, refs = me.getReferences(), breadcrumb = refs.breadcrumb, tree = refs.tree, treeSelectionModel = tree.getSelectionModel(), contentStore = me.contentStore, parentNode, treeView;
  if (breadcrumb.getSelection() !== node) {
    breadcrumb.setSelection(node);
  }
  if (treeSelectionModel.getSelection()[0] !== node) {
    treeSelectionModel.select([node]);
    parentNode = node.parentNode;
    if (parentNode) {
      parentNode.expand();
    }
    treeView = tree.getView();
    treeView.scrollRowIntoView(treeView.getRow(node));
  }
  contentStore.removeAll();
  contentStore.add(node.hasChildNodes() ? node.childNodes : [node]);
}, updateStore:function(store) {
  this.getBreadcrumb().setStore(store);
}, privates:{_onTreeSelectionChange:function(tree, selection) {
  this.setSelection(selection[0]);
}, _onBreadcrumbSelectionChange:function(breadcrumb, selection) {
  this.setSelection(selection);
}}});
Ext.define('Ext.ux.FieldReplicator', {alias:'plugin.fieldreplicator', init:function(field) {
  if (!field.replicatorId) {
    field.replicatorId = Ext.id();
  }
  field.on('blur', this.onBlur, this);
}, onBlur:function(field) {
  var ownerCt = field.ownerCt, replicatorId = field.replicatorId, isEmpty = Ext.isEmpty(field.getRawValue()), siblings = ownerCt.query('[replicatorId\x3d' + replicatorId + ']'), isLastInGroup = siblings[siblings.length - 1] === field, clone, idx;
  if (isEmpty && !isLastInGroup) {
    Ext.defer(field.destroy, 10, field);
  } else {
    if (!isEmpty && isLastInGroup) {
      if (field.onReplicate) {
        field.onReplicate();
      }
      clone = field.cloneConfig({replicatorId:replicatorId});
      idx = ownerCt.items.indexOf(field);
      ownerCt.add(idx + 1, clone);
    }
  }
}});
Ext.define('Ext.ux.GMapPanel', {extend:'Ext.panel.Panel', alias:'widget.gmappanel', requires:['Ext.window.MessageBox'], initComponent:function() {
  Ext.applyIf(this, {plain:true, gmapType:'map', border:false});
  this.callParent();
}, onBoxReady:function() {
  var center = this.center;
  this.callParent(arguments);
  if (center) {
    if (center.geoCodeAddr) {
      this.lookupCode(center.geoCodeAddr, center.marker);
    } else {
      this.createMap(center);
    }
  } else {
    Ext.raise('center is required');
  }
}, createMap:function(center, marker) {
  var options = Ext.apply({}, this.mapOptions);
  options = Ext.applyIf(options, {zoom:14, center:center, mapTypeId:google.maps.MapTypeId.HYBRID});
  this.gmap = new google.maps.Map(this.body.dom, options);
  if (marker) {
    this.addMarker(Ext.applyIf(marker, {position:center}));
  }
  Ext.each(this.markers, this.addMarker, this);
  this.fireEvent('mapready', this, this.gmap);
}, addMarker:function(marker) {
  marker = Ext.apply({map:this.gmap}, marker);
  if (!marker.position) {
    marker.position = new google.maps.LatLng(marker.lat, marker.lng);
  }
  var o = new google.maps.Marker(marker);
  Ext.Object.each(marker.listeners, function(name, fn) {
    google.maps.event.addListener(o, name, fn);
  });
  return o;
}, lookupCode:function(addr, marker) {
  this.geocoder = new google.maps.Geocoder;
  this.geocoder.geocode({address:addr}, Ext.Function.bind(this.onLookupComplete, this, [marker], true));
}, onLookupComplete:function(data, response, marker) {
  if (response != 'OK') {
    Ext.MessageBox.alert('Error', 'An error occured: "' + response + '"');
    return;
  }
  this.createMap(data[0].geometry.location, marker);
}, afterComponentLayout:function(w, h) {
  this.callParent(arguments);
  this.redraw();
}, redraw:function() {
  var map = this.gmap;
  if (map) {
    google.maps.event.trigger(map, 'resize');
  }
}});
Ext.define('Ext.ux.IFrame', {extend:'Ext.Component', alias:'widget.uxiframe', loadMask:'Loading...', src:'about:blank', renderTpl:['\x3ciframe src\x3d"{src}" id\x3d"{id}-iframeEl" data-ref\x3d"iframeEl" name\x3d"{frameName}" width\x3d"100%" height\x3d"100%" frameborder\x3d"0"\x3e\x3c/iframe\x3e'], childEls:['iframeEl'], initComponent:function() {
  this.callParent();
  this.frameName = this.frameName || this.id + '-frame';
}, initEvents:function() {
  var me = this;
  me.callParent();
  me.iframeEl.on('load', me.onLoad, me);
}, initRenderData:function() {
  return Ext.apply(this.callParent(), {src:this.src, frameName:this.frameName});
}, getBody:function() {
  var doc = this.getDoc();
  return doc.body || doc.documentElement;
}, getDoc:function() {
  try {
    return this.getWin().document;
  } catch (ex) {
    return null;
  }
}, getWin:function() {
  var me = this, name = me.frameName, win = Ext.isIE ? me.iframeEl.dom.contentWindow : window.frames[name];
  return win;
}, getFrame:function() {
  var me = this;
  return me.iframeEl.dom;
}, onLoad:function() {
  var me = this, doc = me.getDoc();
  if (doc) {
    this.el.unmask();
    this.fireEvent('load', this);
  } else {
    if (me.src) {
      this.el.unmask();
      this.fireEvent('error', this);
    }
  }
}, load:function(src) {
  var me = this, text = me.loadMask, frame = me.getFrame();
  if (me.fireEvent('beforeload', me, src) !== false) {
    if (text && me.el) {
      me.el.mask(text);
    }
    frame.src = me.src = src || me.src;
  }
}});
Ext.define('Ext.ux.statusbar.StatusBar', {extend:'Ext.toolbar.Toolbar', xtype:'statusbar', alternateClassName:'Ext.ux.StatusBar', requires:['Ext.toolbar.TextItem'], cls:'x-statusbar', busyIconCls:'x-status-busy', busyText:'Loading...', autoClear:5000, emptyText:'\x26#160;', activeThreadId:0, initComponent:function() {
  var right = this.statusAlign === 'right';
  this.callParent(arguments);
  this.currIconCls = this.iconCls || this.defaultIconCls;
  this.statusEl = Ext.create('Ext.toolbar.TextItem', {cls:'x-status-text ' + (this.currIconCls || ''), text:this.text || this.defaultText || ''});
  if (right) {
    this.cls += ' x-status-right';
    this.add('-\x3e');
    this.add(this.statusEl);
  } else {
    this.insert(0, this.statusEl);
    this.insert(1, '-\x3e');
  }
}, setStatus:function(config) {
  var me = this;
  config = config || {};
  Ext.suspendLayouts();
  if (Ext.isString(config)) {
    config = {text:config};
  }
  if (config.text !== undefined) {
    me.setText(config.text);
  }
  if (config.iconCls !== undefined) {
    me.setIcon(config.iconCls);
  }
  if (config.clear) {
    var c = config.clear, wait = me.autoClear, defaults = {useDefaults:true, anim:true};
    if (Ext.isObject(c)) {
      c = Ext.applyIf(c, defaults);
      if (c.wait) {
        wait = c.wait;
      }
    } else {
      if (Ext.isNumber(c)) {
        wait = c;
        c = defaults;
      } else {
        if (Ext.isBoolean(c)) {
          c = defaults;
        }
      }
    }
    c.threadId = this.activeThreadId;
    Ext.defer(me.clearStatus, wait, me, [c]);
  }
  Ext.resumeLayouts(true);
  return me;
}, clearStatus:function(config) {
  config = config || {};
  var me = this, statusEl = me.statusEl;
  if (me.destroyed || config.threadId && config.threadId !== me.activeThreadId) {
    return me;
  }
  var text = config.useDefaults ? me.defaultText : me.emptyText, iconCls = config.useDefaults ? me.defaultIconCls ? me.defaultIconCls : '' : '';
  if (config.anim) {
    statusEl.el.puff({remove:false, useDisplay:true, callback:function() {
      statusEl.el.show();
      me.setStatus({text:text, iconCls:iconCls});
    }});
  } else {
    me.setStatus({text:text, iconCls:iconCls});
  }
  return me;
}, setText:function(text) {
  var me = this;
  me.activeThreadId++;
  me.text = text || '';
  if (me.rendered) {
    me.statusEl.setText(me.text);
  }
  return me;
}, getText:function() {
  return this.text;
}, setIcon:function(cls) {
  var me = this;
  me.activeThreadId++;
  cls = cls || '';
  if (me.rendered) {
    if (me.currIconCls) {
      me.statusEl.removeCls(me.currIconCls);
      me.currIconCls = null;
    }
    if (cls.length > 0) {
      me.statusEl.addCls(cls);
      me.currIconCls = cls;
    }
  } else {
    me.currIconCls = cls;
  }
  return me;
}, showBusy:function(config) {
  if (Ext.isString(config)) {
    config = {text:config};
  }
  config = Ext.applyIf(config || {}, {text:this.busyText, iconCls:this.busyIconCls});
  return this.setStatus(config);
}});
Ext.define('Ext.ux.LiveSearchGridPanel', {extend:'Ext.grid.Panel', requires:['Ext.toolbar.TextItem', 'Ext.form.field.Checkbox', 'Ext.form.field.Text', 'Ext.ux.statusbar.StatusBar'], searchValue:null, matches:[], currentIndex:null, searchRegExp:null, caseSensitive:false, regExpMode:false, matchCls:'x-livesearch-match', defaultStatusText:'Nothing Found', initComponent:function() {
  var me = this;
  me.tbar = ['Search', {xtype:'textfield', name:'searchField', hideLabel:true, width:200, listeners:{change:{fn:me.onTextFieldChange, scope:this, buffer:500}}}, {xtype:'button', text:'\x26lt;', tooltip:'Find Previous Row', handler:me.onPreviousClick, scope:me}, {xtype:'button', text:'\x26gt;', tooltip:'Find Next Row', handler:me.onNextClick, scope:me}, '-', {xtype:'checkbox', hideLabel:true, margin:'0 0 0 4px', handler:me.regExpToggle, scope:me}, 'Regular expression', {xtype:'checkbox', hideLabel:true, 
  margin:'0 0 0 4px', handler:me.caseSensitiveToggle, scope:me}, 'Case sensitive'];
  me.bbar = new Ext.ux.StatusBar({defaultText:me.defaultStatusText, name:'searchStatusBar'});
  me.callParent(arguments);
}, afterRender:function() {
  var me = this;
  me.callParent(arguments);
  me.textField = me.down('textfield[name\x3dsearchField]');
  me.statusBar = me.down('statusbar[name\x3dsearchStatusBar]');
  me.view.on('cellkeydown', me.focusTextField, me);
}, focusTextField:function(view, td, cellIndex, record, tr, rowIndex, e, eOpts) {
  if (e.getKey() === e.S) {
    e.preventDefault();
    this.textField.focus();
  }
}, tagsRe:/<[^>]*>/gm, tagsProtect:'', getSearchValue:function() {
  var me = this, value = me.textField.getValue();
  if (value === '') {
    return null;
  }
  if (!me.regExpMode) {
    value = Ext.String.escapeRegex(value);
  } else {
    try {
      new RegExp(value);
    } catch (error) {
      me.statusBar.setStatus({text:error.message, iconCls:'x-status-error'});
      return null;
    }
    if (value === '^' || value === '$') {
      return null;
    }
  }
  return value;
}, onTextFieldChange:function() {
  var me = this, count = 0, view = me.view, cellSelector = view.cellSelector, innerSelector = view.innerSelector, columns = me.visibleColumnManager.getColumns();
  view.refresh();
  me.statusBar.setStatus({text:me.defaultStatusText, iconCls:''});
  me.searchValue = me.getSearchValue();
  me.matches = [];
  me.currentIndex = null;
  if (me.searchValue !== null) {
    me.searchRegExp = new RegExp(me.getSearchValue(), 'g' + (me.caseSensitive ? '' : 'i'));
    me.store.each(function(record, idx) {
      var node = view.getNode(record);
      if (node) {
        Ext.Array.forEach(columns, function(column) {
          var cell = Ext.fly(node).down(column.getCellInnerSelector(), true), matches, cellHTML, seen;
          if (cell) {
            matches = cell.innerHTML.match(me.tagsRe);
            cellHTML = cell.innerHTML.replace(me.tagsRe, me.tagsProtect);
            cellHTML = cellHTML.replace(me.searchRegExp, function(m) {
              ++count;
              if (!seen) {
                me.matches.push({record:record, column:column});
                seen = true;
              }
              return '\x3cspan class\x3d"' + me.matchCls + '"\x3e' + m + '\x3c/span\x3e';
            }, me);
            Ext.each(matches, function(match) {
              cellHTML = cellHTML.replace(me.tagsProtect, match);
            });
            cell.innerHTML = cellHTML;
          }
        });
      }
    }, me);
    if (count) {
      me.currentIndex = 0;
      me.gotoCurrent();
      me.statusBar.setStatus({text:Ext.String.format('{0} match{1} found.', count, count === 1 ? 'es' : ''), iconCls:'x-status-valid'});
    }
  }
  if (me.currentIndex === null) {
    me.getSelectionModel().deselectAll();
    me.textField.focus();
  }
}, onPreviousClick:function() {
  var me = this, matches = me.matches, len = matches.length, idx = me.currentIndex;
  if (len) {
    me.currentIndex = idx === 0 ? len - 1 : idx - 1;
    me.gotoCurrent();
  }
}, onNextClick:function() {
  var me = this, matches = me.matches, len = matches.length, idx = me.currentIndex;
  if (len) {
    me.currentIndex = idx === len - 1 ? 0 : idx + 1;
    me.gotoCurrent();
  }
}, caseSensitiveToggle:function(checkbox, checked) {
  this.caseSensitive = checked;
  this.onTextFieldChange();
}, regExpToggle:function(checkbox, checked) {
  this.regExpMode = checked;
  this.onTextFieldChange();
}, privates:{gotoCurrent:function() {
  var pos = this.matches[this.currentIndex];
  this.getNavigationModel().setPosition(pos.record, pos.column);
  this.getSelectionModel().select(pos.record);
}}});
Ext.define('Ext.ux.PreviewPlugin', {extend:'Ext.plugin.Abstract', alias:'plugin.preview', requires:['Ext.grid.feature.RowBody'], hideBodyCls:'x-grid-row-body-hidden', bodyField:'', previewExpanded:true, setCmp:function(target) {
  this.callParent(arguments);
  var me = this, grid = me.cmp = target.isXType('gridview') ? target.grid : target, bodyField = me.bodyField, hideBodyCls = me.hideBodyCls, feature = Ext.create('Ext.grid.feature.RowBody', {grid:grid, getAdditionalData:function(data, idx, model, rowValues) {
    var getAdditionalData = Ext.grid.feature.RowBody.prototype.getAdditionalData, additionalData = {rowBody:data[bodyField], rowBodyCls:grid.getView().previewExpanded ? '' : hideBodyCls};
    if (Ext.isFunction(getAdditionalData)) {
      Ext.apply(additionalData, getAdditionalData.apply(this, arguments));
    }
    return additionalData;
  }}), initFeature = function(grid, view) {
    view.previewExpanded = me.previewExpanded;
    view.featuresMC.add(feature);
    feature.init(grid);
  };
  if (grid.view) {
    initFeature(grid, grid.view);
  } else {
    grid.on({viewcreated:initFeature, single:true});
  }
}, toggleExpanded:function(expanded) {
  var grid = this.getCmp(), view = grid && grid.getView(), bufferedRenderer = view.bufferedRenderer, scrollManager = view.scrollManager;
  if (grid && view && expanded !== view.previewExpanded) {
    this.previewExpanded = view.previewExpanded = !!expanded;
    view.refreshView();
    if (scrollManager) {
      if (bufferedRenderer) {
        bufferedRenderer.stretchView(view, bufferedRenderer.getScrollHeight(true));
      } else {
        scrollManager.refresh(true);
      }
    }
  }
}});
Ext.define('Ext.ux.ProgressBarPager', {alias:'plugin.ux-progressbarpager', requires:['Ext.ProgressBar'], width:225, defaultText:'Loading...', defaultAnimCfg:{duration:1000, easing:'bounceOut'}, constructor:function(config) {
  if (config) {
    Ext.apply(this, config);
  }
}, init:function(parent) {
  var displayItem;
  if (parent.displayInfo) {
    this.parent = parent;
    displayItem = parent.child('#displayItem');
    if (displayItem) {
      parent.remove(displayItem, true);
    }
    this.progressBar = Ext.create('Ext.ProgressBar', {text:this.defaultText, width:this.width, animate:this.defaultAnimCfg, style:{cursor:'pointer'}, listeners:{el:{scope:this, click:this.handleProgressBarClick}}});
    parent.displayItem = this.progressBar;
    parent.add(parent.displayItem);
    Ext.apply(parent, this.parentOverrides);
  }
}, handleProgressBarClick:function(e) {
  var parent = this.parent, displayItem = parent.displayItem, box = this.progressBar.getBox(), xy = e.getXY(), position = xy[0] - box.x, store = parent.store, pageSize = parent.pageSize || store.pageSize, pages = Math.ceil(store.getTotalCount() / pageSize), newPage = Math.max(Math.ceil(position / (displayItem.width / pages)), 1);
  store.loadPage(newPage);
}, parentOverrides:{updateInfo:function() {
  if (this.displayItem) {
    var count = this.store.getCount(), pageData = this.getPageData(), message = count === 0 ? this.emptyMsg : Ext.String.format(this.displayMsg, pageData.fromRecord, pageData.toRecord, this.store.getTotalCount()), percentage = pageData.pageCount > 0 ? pageData.currentPage / pageData.pageCount : 0;
    this.displayItem.updateProgress(percentage, message, this.animate || this.defaultAnimConfig);
  }
}}});
Ext.define('Ext.ux.RowExpander', {extend:'Ext.grid.plugin.RowExpander'});
Ext.define('Ext.ux.SlidingPager', {alias:'plugin.ux-slidingpager', requires:['Ext.slider.Single', 'Ext.slider.Tip'], constructor:function(config) {
  if (config) {
    Ext.apply(this, config);
  }
}, init:function(pbar) {
  var idx = pbar.items.indexOf(pbar.child('#inputItem')), slider;
  Ext.each(pbar.items.getRange(idx - 2, idx + 2), function(c) {
    c.hide();
  });
  slider = Ext.create('Ext.slider.Single', {width:114, minValue:1, maxValue:1, hideLabel:true, tipText:function(thumb) {
    return Ext.String.format('Page \x3cb\x3e{0}\x3c/b\x3e of \x3cb\x3e{1}\x3c/b\x3e', thumb.value, thumb.slider.maxValue);
  }, listeners:{changecomplete:function(s, v) {
    pbar.store.loadPage(v);
  }}});
  pbar.insert(idx + 1, slider);
  pbar.on({change:function(pb, data) {
    slider.setMaxValue(data.pageCount);
    slider.setValue(data.currentPage);
  }});
}});
Ext.define('Ext.ux.Spotlight', {baseCls:'x-spotlight', animate:true, duration:250, easing:null, active:false, constructor:function(config) {
  Ext.apply(this, config);
}, createElements:function() {
  var me = this, baseCls = me.baseCls, body = Ext.getBody();
  me.right = body.createChild({cls:baseCls});
  me.left = body.createChild({cls:baseCls});
  me.top = body.createChild({cls:baseCls});
  me.bottom = body.createChild({cls:baseCls});
  me.all = Ext.create('Ext.CompositeElement', [me.right, me.left, me.top, me.bottom]);
}, show:function(el, callback, scope) {
  var me = this;
  me.el = Ext.get(el);
  if (!me.right) {
    me.createElements();
  }
  if (!me.active) {
    me.all.setDisplayed('');
    me.active = true;
    Ext.on('resize', me.syncSize, me);
    me.applyBounds(me.animate, false);
  } else {
    me.applyBounds(false, false);
  }
}, hide:function(callback, scope) {
  var me = this;
  Ext.un('resize', me.syncSize, me);
  me.applyBounds(me.animate, true);
}, syncSize:function() {
  this.applyBounds(false, false);
}, applyBounds:function(animate, reverse) {
  var me = this, box = me.el.getBox(), viewWidth = Ext.Element.getViewportWidth(), viewHeight = Ext.Element.getViewportHeight(), i = 0, config = false, from, to, clone;
  from = {right:{x:box.right, y:viewHeight, width:viewWidth - box.right, height:0}, left:{x:0, y:0, width:box.x, height:0}, top:{x:viewWidth, y:0, width:0, height:box.y}, bottom:{x:0, y:box.y + box.height, width:0, height:viewHeight - (box.y + box.height) + 'px'}};
  to = {right:{x:box.right, y:box.y, width:viewWidth - box.right + 'px', height:viewHeight - box.y + 'px'}, left:{x:0, y:0, width:box.x + 'px', height:box.y + box.height + 'px'}, top:{x:box.x, y:0, width:viewWidth - box.x + 'px', height:box.y + 'px'}, bottom:{x:0, y:box.y + box.height, width:box.x + box.width + 'px', height:viewHeight - (box.y + box.height) + 'px'}};
  if (reverse) {
    clone = Ext.clone(from);
    from = to;
    to = clone;
  }
  if (animate) {
    Ext.Array.forEach(['right', 'left', 'top', 'bottom'], function(side) {
      me[side].setBox(from[side]);
      me[side].animate({duration:me.duration, easing:me.easing, to:to[side]});
    }, this);
  } else {
    Ext.Array.forEach(['right', 'left', 'top', 'bottom'], function(side) {
      me[side].setBox(Ext.apply(from[side], to[side]));
      me[side].repaint();
    }, this);
  }
}, destroy:function() {
  var me = this;
  Ext.destroy(me.right, me.left, me.top, me.bottom);
  delete me.el;
  delete me.all;
  me.callParent();
}});
Ext.define('Ext.ux.TabCloseMenu', {extend:'Ext.plugin.Abstract', alias:'plugin.tabclosemenu', mixins:{observable:'Ext.util.Observable'}, closeTabText:'Close Tab', showCloseOthers:true, closeOthersTabsText:'Close Other Tabs', showCloseAll:true, closeAllTabsText:'Close All Tabs', extraItemsHead:null, extraItemsTail:null, constructor:function(config) {
  this.callParent([config]);
  this.mixins.observable.constructor.call(this, config);
}, init:function(tabpanel) {
  this.tabPanel = tabpanel;
  this.tabBar = tabpanel.down('tabbar');
  this.mon(this.tabPanel, {scope:this, afterlayout:this.onAfterLayout, single:true});
}, onAfterLayout:function() {
  this.mon(this.tabBar.el, {scope:this, contextmenu:this.onContextMenu, delegate:'.x-tab'});
}, destroy:function() {
  Ext.destroy(this.menu);
  this.callParent();
}, onContextMenu:function(event, target) {
  var me = this, menu = me.createMenu(), disableAll = true, disableOthers = true, tab = me.tabBar.getChildByElement(target), index = me.tabBar.items.indexOf(tab);
  me.item = me.tabPanel.getComponent(index);
  menu.child('#close').setDisabled(!me.item.closable);
  if (me.showCloseAll || me.showCloseOthers) {
    me.tabPanel.items.each(function(item) {
      if (item.closable) {
        disableAll = false;
        if (item !== me.item) {
          disableOthers = false;
          return false;
        }
      }
      return true;
    });
    if (me.showCloseAll) {
      menu.child('#closeAll').setDisabled(disableAll);
    }
    if (me.showCloseOthers) {
      menu.child('#closeOthers').setDisabled(disableOthers);
    }
  }
  event.preventDefault();
  me.fireEvent('beforemenu', menu, me.item, me);
  menu.showAt(event.getXY());
}, createMenu:function() {
  var me = this;
  if (!me.menu) {
    var items = [{itemId:'close', text:me.closeTabText, scope:me, handler:me.onClose}];
    if (me.showCloseAll || me.showCloseOthers) {
      items.push('-');
    }
    if (me.showCloseOthers) {
      items.push({itemId:'closeOthers', text:me.closeOthersTabsText, scope:me, handler:me.onCloseOthers});
    }
    if (me.showCloseAll) {
      items.push({itemId:'closeAll', text:me.closeAllTabsText, scope:me, handler:me.onCloseAll});
    }
    if (me.extraItemsHead) {
      items = me.extraItemsHead.concat(items);
    }
    if (me.extraItemsTail) {
      items = items.concat(me.extraItemsTail);
    }
    me.menu = Ext.create('Ext.menu.Menu', {items:items, listeners:{hide:me.onHideMenu, scope:me}});
  }
  return me.menu;
}, onHideMenu:function() {
  var me = this;
  me.fireEvent('aftermenu', me.menu, me);
}, onClose:function() {
  this.tabPanel.remove(this.item);
}, onCloseOthers:function() {
  this.doClose(true);
}, onCloseAll:function() {
  this.doClose(false);
}, doClose:function(excludeActive) {
  var items = [];
  this.tabPanel.items.each(function(item) {
    if (item.closable) {
      if (!excludeActive || item !== this.item) {
        items.push(item);
      }
    }
  }, this);
  Ext.suspendLayouts();
  Ext.Array.forEach(items, function(item) {
    this.tabPanel.remove(item);
  }, this);
  Ext.resumeLayouts(true);
}});
Ext.define('Ext.ux.TabReorderer', {extend:'Ext.ux.BoxReorderer', alias:'plugin.tabreorderer', itemSelector:'.' + Ext.baseCSSPrefix + 'tab', init:function(tabPanel) {
  var me = this;
  me.callParent([tabPanel.getTabBar()]);
  tabPanel.onAdd = Ext.Function.createSequence(tabPanel.onAdd, me.onAdd);
}, onBoxReady:function() {
  var tabs, len, i = 0, tab;
  this.callParent(arguments);
  for (tabs = this.container.items.items, len = tabs.length; i < len; i++) {
    tab = tabs[i];
    if (tab.card) {
      tab.reorderable = tab.card.reorderable;
    }
  }
}, onAdd:function(card, index) {
  card.tab.reorderable = card.reorderable;
}, afterBoxReflow:function() {
  var me = this;
  Ext.ux.BoxReorderer.prototype.afterBoxReflow.apply(me, arguments);
  if (me.dragCmp) {
    me.container.tabPanel.setActiveTab(me.dragCmp.card);
    me.container.tabPanel.move(me.dragCmp.card, me.curIndex);
  }
}});
Ext.ns('Ext.ux');
Ext.define('Ext.ux.TabScrollerMenu', {alias:'plugin.tabscrollermenu', requires:['Ext.menu.Menu'], pageSize:10, maxText:15, menuPrefixText:'Items', constructor:function(config) {
  Ext.apply(this, config);
}, init:function(tabPanel) {
  var me = this;
  me.tabPanel = tabPanel;
  tabPanel.on({render:function() {
    me.tabBar = tabPanel.tabBar;
    me.layout = me.tabBar.layout;
    me.layout.overflowHandler.handleOverflow = me.showButton.bind(me);
    me.layout.overflowHandler.clearOverflow = Ext.Function.createSequence(me.layout.overflowHandler.clearOverflow, me.hideButton, me);
  }, destroy:me.destroy, scope:me, single:true});
}, showButton:function() {
  var me = this, result = Ext.getClass(me.layout.overflowHandler).prototype.handleOverflow.apply(me.layout.overflowHandler, arguments), button = me.menuButton;
  if (me.tabPanel.items.getCount() > 1) {
    if (!button) {
      button = me.menuButton = me.tabBar.body.createChild({cls:Ext.baseCSSPrefix + 'tab-tabmenu-right'}, me.tabBar.body.child('.' + Ext.baseCSSPrefix + 'box-scroller-right'));
      button.addClsOnOver(Ext.baseCSSPrefix + 'tab-tabmenu-over');
      button.on('click', me.showTabsMenu, me);
    }
    button.setVisibilityMode(Ext.dom.Element.DISPLAY);
    button.show();
    result.reservedSpace += button.getWidth();
  } else {
    me.hideButton();
  }
  return result;
}, hideButton:function() {
  var me = this;
  if (me.menuButton) {
    me.menuButton.hide();
  }
}, getPageSize:function() {
  return this.pageSize;
}, setPageSize:function(pageSize) {
  this.pageSize = pageSize;
}, getMaxText:function() {
  return this.maxText;
}, setMaxText:function(t) {
  this.maxText = t;
}, getMenuPrefixText:function() {
  return this.menuPrefixText;
}, setMenuPrefixText:function(t) {
  this.menuPrefixText = t;
}, showTabsMenu:function(e) {
  var me = this;
  if (me.tabsMenu) {
    me.tabsMenu.removeAll();
  } else {
    me.tabsMenu = new Ext.menu.Menu;
  }
  me.generateTabMenuItems();
  var target = Ext.get(e.getTarget()), xy = target.getXY();
  xy[1] += 24;
  me.tabsMenu.showAt(xy);
}, generateTabMenuItems:function() {
  var me = this, tabPanel = me.tabPanel, curActive = tabPanel.getActiveTab(), allItems = tabPanel.items.getRange(), pageSize = me.getPageSize(), tabsMenu = me.tabsMenu, totalItems, numSubMenus, remainder, i, curPage, menuItems, x, item, start, index;
  tabsMenu.suspendLayouts();
  allItems = Ext.Array.filter(allItems, function(item) {
    if (item.id == curActive.id) {
      return false;
    }
    return item.hidden ? !!item.hiddenByLayout : true;
  });
  totalItems = allItems.length;
  numSubMenus = Math.floor(totalItems / pageSize);
  remainder = totalItems % pageSize;
  if (totalItems > pageSize) {
    for (i = 0; i < numSubMenus; i++) {
      curPage = (i + 1) * pageSize;
      menuItems = [];
      for (x = 0; x < pageSize; x++) {
        index = x + curPage - pageSize;
        item = allItems[index];
        menuItems.push(me.autoGenMenuItem(item));
      }
      tabsMenu.add({text:me.getMenuPrefixText() + ' ' + (curPage - pageSize + 1) + ' - ' + curPage, menu:menuItems});
    }
    if (remainder > 0) {
      start = numSubMenus * pageSize;
      menuItems = [];
      for (i = start; i < totalItems; i++) {
        item = allItems[i];
        menuItems.push(me.autoGenMenuItem(item));
      }
      me.tabsMenu.add({text:me.menuPrefixText + ' ' + (start + 1) + ' - ' + (start + menuItems.length), menu:menuItems});
    }
  } else {
    for (i = 0; i < totalItems; ++i) {
      tabsMenu.add(me.autoGenMenuItem(allItems[i]));
    }
  }
  tabsMenu.resumeLayouts(true);
}, autoGenMenuItem:function(item) {
  var maxText = this.getMaxText(), text = Ext.util.Format.ellipsis(item.title, maxText);
  return {text:text, handler:this.showTabFromMenu, scope:this, disabled:item.disabled, tabToShow:item, iconCls:item.iconCls};
}, showTabFromMenu:function(menuItem) {
  this.tabPanel.setActiveTab(menuItem.tabToShow);
}, destroy:function() {
  Ext.destroy(this.tabsMenu, this.menuButton);
  this.callParent();
}});
Ext.define('Ext.ux.ToolbarDroppable', {constructor:function(config) {
  Ext.apply(this, config);
}, init:function(toolbar) {
  this.toolbar = toolbar;
  this.toolbar.on({scope:this, render:this.createDropTarget});
}, createDropTarget:function() {
  this.dropTarget = Ext.create('Ext.dd.DropTarget', this.toolbar.getEl(), {notifyOver:this.notifyOver.bind(this), notifyDrop:this.notifyDrop.bind(this)});
}, addDDGroup:function(ddGroup) {
  this.dropTarget.addToGroup(ddGroup);
}, calculateEntryIndex:function(e) {
  var entryIndex = 0, toolbar = this.toolbar, items = toolbar.items.items, count = items.length, xHover = e.getXY()[0], index = 0, el, xTotal, width, midpoint;
  for (; index < count; index++) {
    el = items[index].getEl();
    xTotal = el.getXY()[0];
    width = el.getWidth();
    midpoint = xTotal + width / 2;
    if (xHover < midpoint) {
      entryIndex = index;
      break;
    } else {
      entryIndex = index + 1;
    }
  }
  return entryIndex;
}, canDrop:function(data) {
  return true;
}, notifyOver:function(dragSource, event, data) {
  return this.canDrop.apply(this, arguments) ? this.dropTarget.dropAllowed : this.dropTarget.dropNotAllowed;
}, notifyDrop:function(dragSource, event, data) {
  var canAdd = this.canDrop(dragSource, event, data), tbar = this.toolbar;
  if (canAdd) {
    var entryIndex = this.calculateEntryIndex(event);
    tbar.insert(entryIndex, this.createItem(data));
    this.afterLayout();
  }
  return canAdd;
}, createItem:function(data) {
  Ext.raise('The createItem method must be implemented in the ToolbarDroppable plugin');
}, afterLayout:Ext.emptyFn});
Ext.define('Ext.ux.TreePicker', {extend:'Ext.form.field.Picker', xtype:'treepicker', uses:['Ext.tree.Panel'], triggerCls:Ext.baseCSSPrefix + 'form-arrow-trigger', config:{store:null, displayField:null, columns:null, selectOnTab:true, maxPickerHeight:300, minPickerHeight:100}, editable:false, initComponent:function() {
  var me = this;
  me.callParent(arguments);
  me.mon(me.store, {scope:me, load:me.onLoad, update:me.onUpdate});
}, createPicker:function() {
  var me = this, picker = new Ext.tree.Panel({baseCls:Ext.baseCSSPrefix + 'boundlist', shrinkWrapDock:2, store:me.store, floating:true, displayField:me.displayField, columns:me.columns, minHeight:me.minPickerHeight, maxHeight:me.maxPickerHeight, manageHeight:false, shadow:false, listeners:{scope:me, itemclick:me.onItemClick, itemkeydown:me.onPickerKeyDown}}), view = picker.getView();
  if (Ext.isIE9 && Ext.isStrict) {
    view.on({scope:me, highlightitem:me.repaintPickerView, unhighlightitem:me.repaintPickerView, afteritemexpand:me.repaintPickerView, afteritemcollapse:me.repaintPickerView});
  }
  return picker;
}, repaintPickerView:function() {
  var style = this.picker.getView().getEl().dom.style;
  style.display = style.display;
}, onItemClick:function(view, record, node, rowIndex, e) {
  this.selectItem(record);
}, onPickerKeyDown:function(treeView, record, item, index, e) {
  var key = e.getKey();
  if (key === e.ENTER || key === e.TAB && this.selectOnTab) {
    this.selectItem(record);
  }
}, selectItem:function(record) {
  var me = this;
  me.setValue(record.getId());
  me.fireEvent('select', me, record);
  me.collapse();
}, onExpand:function() {
  var picker = this.picker, store = picker.store, value = this.value, node;
  if (value) {
    node = store.getNodeById(value);
  }
  if (!node) {
    node = store.getRoot();
  }
  picker.ensureVisible(node, {select:true, focus:true});
}, setValue:function(value) {
  var me = this, record;
  me.value = value;
  if (me.store.loading) {
    return me;
  }
  record = value ? me.store.getNodeById(value) : me.store.getRoot();
  if (value === undefined) {
    record = me.store.getRoot();
    me.value = record.getId();
  } else {
    record = me.store.getNodeById(value);
  }
  me.setRawValue(record ? record.get(me.displayField) : '');
  return me;
}, getSubmitValue:function() {
  return this.value;
}, getValue:function() {
  return this.value;
}, onLoad:function() {
  var value = this.value;
  if (value) {
    this.setValue(value);
  }
}, onUpdate:function(store, rec, type, modifiedFieldNames) {
  var display = this.displayField;
  if (type === 'edit' && modifiedFieldNames && Ext.Array.contains(modifiedFieldNames, display) && this.value === rec.getId()) {
    this.setRawValue(rec.get(display));
  }
}});
Ext.define('Ext.ux.colorpick.Selection', {mixinId:'colorselection', config:{format:'hex6', value:'FF0000', color:null, previousColor:null}, applyColor:function(color) {
  var c = color;
  if (Ext.isString(c)) {
    c = Ext.ux.colorpick.ColorUtils.parseColor(color);
  }
  return c;
}, applyValue:function(color) {
  var c = Ext.ux.colorpick.ColorUtils.parseColor(color || '#000000');
  return this.formatColor(c);
}, formatColor:function(color) {
  return Ext.ux.colorpick.ColorUtils.formats[this.getFormat()](color);
}, updateColor:function(color) {
  var me = this;
  if (!me.syncing) {
    me.syncing = true;
    me.setValue(me.formatColor(color));
    me.syncing = false;
  }
}, updateValue:function(value, oldValue) {
  var me = this;
  if (!me.syncing) {
    me.syncing = true;
    me.setColor(value);
    me.syncing = false;
  }
  this.fireEvent('change', me, value, oldValue);
}});
Ext.define('Ext.ux.colorpick.ColorUtils', function(ColorUtils) {
  var oldIE = Ext.isIE && Ext.ieVersion < 10;
  return {singleton:true, constructor:function() {
    ColorUtils = this;
  }, backgroundTpl:oldIE ? 'filter: progid:DXImageTransform.Microsoft.gradient(GradientType\x3d0, ' + "startColorstr\x3d'#{alpha}{hex}', endColorstr\x3d'#{alpha}{hex}');" : 'background: {rgba};', setBackground:oldIE ? function(el, color) {
    if (el) {
      var tpl = Ext.XTemplate.getTpl(ColorUtils, 'backgroundTpl'), data = {hex:ColorUtils.rgb2hex(color.r, color.g, color.b), alpha:Math.floor(color.a * 255).toString(16)}, bgStyle = tpl.apply(data);
      el.applyStyles(bgStyle);
    }
  } : function(el, color) {
    if (el) {
      var tpl = Ext.XTemplate.getTpl(ColorUtils, 'backgroundTpl'), data = {rgba:ColorUtils.getRGBAString(color)}, bgStyle = tpl.apply(data);
      el.applyStyles(bgStyle);
    }
  }, formats:{HEX6:function(colorO) {
    return ColorUtils.rgb2hex(colorO.r, colorO.g, colorO.b);
  }, HEX8:function(colorO) {
    var hex = ColorUtils.rgb2hex(colorO.r, colorO.g, colorO.b), opacityHex = Math.round(colorO.a * 255).toString(16);
    if (opacityHex.length < 2) {
      hex += '0';
    }
    hex += opacityHex.toUpperCase();
    return hex;
  }}, hexRe:/#?([0-9a-f]{3,8})/i, rgbaAltRe:/rgba\(\s*([\w#\d]+)\s*,\s*([\d\.]+)\s*\)/, rgbaRe:/rgba\(\s*([\d\.]+)\s*,\s*([\d\.]+)\s*,\s*([\d\.]+)\s*,\s*([\d\.]+)\s*\)/, rgbRe:/rgb\(\s*([\d\.]+)\s*,\s*([\d\.]+)\s*,\s*([\d\.]+)\s*\)/, parseColor:function(color) {
    if (!color) {
      return null;
    }
    var me = this, rgb = me.colorMap[color], match, ret, hsv;
    if (rgb) {
      ret = {r:rgb[0], g:rgb[1], b:rgb[2], a:1};
    } else {
      if (color === 'transparent') {
        ret = {r:0, g:0, b:0, a:0};
      } else {
        match = me.hexRe.exec(color);
        if (match) {
          match = match[1];
          switch(match.length) {
            default:
              return null;
            case 3:
              ret = {r:parseInt(match[0] + match[0], 16), g:parseInt(match[1] + match[1], 16), b:parseInt(match[2] + match[2], 16), a:1};
              break;
            case 6:
            case 8:
              ret = {r:parseInt(match.substr(0, 2), 16), g:parseInt(match.substr(2, 2), 16), b:parseInt(match.substr(4, 2), 16), a:parseInt(match.substr(6, 2) || 'ff', 16) / 255};
              break;
          }
        } else {
          match = me.rgbaRe.exec(color);
          if (match) {
            ret = {r:parseFloat(match[1]), g:parseFloat(match[2]), b:parseFloat(match[3]), a:parseFloat(match[4])};
          } else {
            match = me.rgbaAltRe.exec(color);
            if (match) {
              ret = me.parseColor(match[1]);
              ret.a = parseFloat(match[2]);
              return ret;
            }
            match = me.rgbRe.exec(color);
            if (match) {
              ret = {r:parseFloat(match[1]), g:parseFloat(match[2]), b:parseFloat(match[3]), a:1};
            } else {
              return null;
            }
          }
        }
      }
    }
    hsv = this.rgb2hsv(ret.r, ret.g, ret.b);
    return Ext.apply(ret, hsv);
  }, getRGBAString:function(rgba) {
    return 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a + ')';
  }, getRGBString:function(rgb) {
    return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
  }, hsv2rgb:function(h, s, v) {
    h = h * 360;
    if (h === 360) {
      h = 0;
    }
    var c = v * s;
    var hprime = h / 60;
    var x = c * (1 - Math.abs(hprime % 2 - 1));
    var rgb = [0, 0, 0];
    switch(Math.floor(hprime)) {
      case 0:
        rgb = [c, x, 0];
        break;
      case 1:
        rgb = [x, c, 0];
        break;
      case 2:
        rgb = [0, c, x];
        break;
      case 3:
        rgb = [0, x, c];
        break;
      case 4:
        rgb = [x, 0, c];
        break;
      case 5:
        rgb = [c, 0, x];
        break;
      default:
        console.error('unknown color ' + h + ' ' + s + ' ' + v);
        break;
    }
    var m = v - c;
    rgb[0] += m;
    rgb[1] += m;
    rgb[2] += m;
    rgb[0] = Math.round(rgb[0] * 255);
    rgb[1] = Math.round(rgb[1] * 255);
    rgb[2] = Math.round(rgb[2] * 255);
    return {r:rgb[0], g:rgb[1], b:rgb[2]};
  }, rgb2hsv:function(r, g, b) {
    r = r / 255;
    g = g / 255;
    b = b / 255;
    var M = Math.max(r, g, b);
    var m = Math.min(r, g, b);
    var c = M - m;
    var hprime = 0;
    if (c !== 0) {
      if (M === r) {
        hprime = (g - b) / c % 6;
      } else {
        if (M === g) {
          hprime = (b - r) / c + 2;
        } else {
          if (M === b) {
            hprime = (r - g) / c + 4;
          }
        }
      }
    }
    var h = hprime * 60;
    if (h === 360) {
      h = 0;
    }
    var v = M;
    var s = 0;
    if (c !== 0) {
      s = c / v;
    }
    h = h / 360;
    if (h < 0) {
      h = h + 1;
    }
    return {h:h, s:s, v:v};
  }, rgb2hex:function(r, g, b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
    if (r.length < 2) {
      r = '0' + r;
    }
    if (g.length < 2) {
      g = '0' + g;
    }
    if (b.length < 2) {
      b = '0' + b;
    }
    return (r + g + b).toUpperCase();
  }, colorMap:{aliceblue:[240, 248, 255], antiquewhite:[250, 235, 215], aqua:[0, 255, 255], aquamarine:[127, 255, 212], azure:[240, 255, 255], beige:[245, 245, 220], bisque:[255, 228, 196], black:[0, 0, 0], blanchedalmond:[255, 235, 205], blue:[0, 0, 255], blueviolet:[138, 43, 226], brown:[165, 42, 42], burlywood:[222, 184, 135], cadetblue:[95, 158, 160], chartreuse:[127, 255, 0], chocolate:[210, 105, 30], coral:[255, 127, 80], cornflowerblue:[100, 149, 237], cornsilk:[255, 248, 220], crimson:[220, 
  20, 60], cyan:[0, 255, 255], darkblue:[0, 0, 139], darkcyan:[0, 139, 139], darkgoldenrod:[184, 132, 11], darkgray:[169, 169, 169], darkgreen:[0, 100, 0], darkgrey:[169, 169, 169], darkkhaki:[189, 183, 107], darkmagenta:[139, 0, 139], darkolivegreen:[85, 107, 47], darkorange:[255, 140, 0], darkorchid:[153, 50, 204], darkred:[139, 0, 0], darksalmon:[233, 150, 122], darkseagreen:[143, 188, 143], darkslateblue:[72, 61, 139], darkslategray:[47, 79, 79], darkslategrey:[47, 79, 79], darkturquoise:[0, 
  206, 209], darkviolet:[148, 0, 211], deeppink:[255, 20, 147], deepskyblue:[0, 191, 255], dimgray:[105, 105, 105], dimgrey:[105, 105, 105], dodgerblue:[30, 144, 255], firebrick:[178, 34, 34], floralwhite:[255, 255, 240], forestgreen:[34, 139, 34], fuchsia:[255, 0, 255], gainsboro:[220, 220, 220], ghostwhite:[248, 248, 255], gold:[255, 215, 0], goldenrod:[218, 165, 32], gray:[128, 128, 128], green:[0, 128, 0], greenyellow:[173, 255, 47], grey:[128, 128, 128], honeydew:[240, 255, 240], hotpink:[255, 
  105, 180], indianred:[205, 92, 92], indigo:[75, 0, 130], ivory:[255, 255, 240], khaki:[240, 230, 140], lavender:[230, 230, 250], lavenderblush:[255, 240, 245], lawngreen:[124, 252, 0], lemonchiffon:[255, 250, 205], lightblue:[173, 216, 230], lightcoral:[240, 128, 128], lightcyan:[224, 255, 255], lightgoldenrodyellow:[250, 250, 210], lightgray:[211, 211, 211], lightgreen:[144, 238, 144], lightgrey:[211, 211, 211], lightpink:[255, 182, 193], lightsalmon:[255, 160, 122], lightseagreen:[32, 178, 170], 
  lightskyblue:[135, 206, 250], lightslategray:[119, 136, 153], lightslategrey:[119, 136, 153], lightsteelblue:[176, 196, 222], lightyellow:[255, 255, 224], lime:[0, 255, 0], limegreen:[50, 205, 50], linen:[250, 240, 230], magenta:[255, 0, 255], maroon:[128, 0, 0], mediumaquamarine:[102, 205, 170], mediumblue:[0, 0, 205], mediumorchid:[186, 85, 211], mediumpurple:[147, 112, 219], mediumseagreen:[60, 179, 113], mediumslateblue:[123, 104, 238], mediumspringgreen:[0, 250, 154], mediumturquoise:[72, 
  209, 204], mediumvioletred:[199, 21, 133], midnightblue:[25, 25, 112], mintcream:[245, 255, 250], mistyrose:[255, 228, 225], moccasin:[255, 228, 181], navajowhite:[255, 222, 173], navy:[0, 0, 128], oldlace:[253, 245, 230], olive:[128, 128, 0], olivedrab:[107, 142, 35], orange:[255, 165, 0], orangered:[255, 69, 0], orchid:[218, 112, 214], palegoldenrod:[238, 232, 170], palegreen:[152, 251, 152], paleturquoise:[175, 238, 238], palevioletred:[219, 112, 147], papayawhip:[255, 239, 213], peachpuff:[255, 
  218, 185], peru:[205, 133, 63], pink:[255, 192, 203], plum:[221, 160, 203], powderblue:[176, 224, 230], purple:[128, 0, 128], red:[255, 0, 0], rosybrown:[188, 143, 143], royalblue:[65, 105, 225], saddlebrown:[139, 69, 19], salmon:[250, 128, 114], sandybrown:[244, 164, 96], seagreen:[46, 139, 87], seashell:[255, 245, 238], sienna:[160, 82, 45], silver:[192, 192, 192], skyblue:[135, 206, 235], slateblue:[106, 90, 205], slategray:[119, 128, 144], slategrey:[119, 128, 144], snow:[255, 255, 250], springgreen:[0, 
  255, 127], steelblue:[70, 130, 180], tan:[210, 180, 140], teal:[0, 128, 128], thistle:[216, 191, 216], tomato:[255, 99, 71], turquoise:[64, 224, 208], violet:[238, 130, 238], wheat:[245, 222, 179], white:[255, 255, 255], whitesmoke:[245, 245, 245], yellow:[255, 255, 0], yellowgreen:[154, 205, 5]}};
}, function(ColorUtils) {
  var formats = ColorUtils.formats, lowerized = {};
  formats['#HEX6'] = function(color) {
    return '#' + formats.HEX6(color);
  };
  formats['#HEX8'] = function(color) {
    return '#' + formats.HEX8(color);
  };
  Ext.Object.each(formats, function(name, fn) {
    lowerized[name.toLowerCase()] = function(color) {
      var ret = fn(color);
      return ret.toLowerCase();
    };
  });
  Ext.apply(formats, lowerized);
});
Ext.define('Ext.ux.colorpick.ColorMapController', {extend:'Ext.app.ViewController', alias:'controller.colorpickercolormapcontroller', requires:['Ext.ux.colorpick.ColorUtils'], onFirstBoxReady:function() {
  var me = this, colorMap = me.getView(), dragHandle = colorMap.down('#dragHandle'), dd = dragHandle.dd;
  dd.constrain = true;
  dd.constrainTo = colorMap.getEl();
  dd.initialConstrainTo = dd.constrainTo;
  dd.on('drag', Ext.bind(me.onHandleDrag, me));
  me.mon(colorMap.getEl(), {mousedown:me.onMouseDown, dragstart:me.onDragStart, scope:me});
}, onHandleDrag:function(componentDragger, e) {
  var me = this, container = me.getView(), dragHandle = container.down('#dragHandle'), x = dragHandle.getX() - container.getX(), y = dragHandle.getY() - container.getY(), containerEl = container.getEl(), containerWidth = containerEl.getWidth(), containerHeight = containerEl.getHeight(), xRatio = x / containerWidth, yRatio = y / containerHeight;
  if (xRatio > 0.99) {
    xRatio = 1;
  }
  if (yRatio > 0.99) {
    yRatio = 1;
  }
  container.fireEvent('handledrag', xRatio, yRatio);
}, onMouseDown:function(e) {
  var me = this, container = me.getView(), dragHandle = container.down('#dragHandle');
  dragHandle.setY(e.getY());
  dragHandle.setX(e.getX());
  me.onHandleDrag();
  dragHandle.dd.onMouseDown(e, dragHandle.dd.el);
}, onDragStart:function(e) {
  var me = this, container = me.getView(), dragHandle = container.down('#dragHandle');
  dragHandle.dd.onDragStart(e, dragHandle.dd.el);
}, onMapClick:function(e) {
  var me = this, container = me.getView(), dragHandle = container.down('#dragHandle'), cXY = container.getXY(), eXY = e.getXY(), left, top;
  left = eXY[0] - cXY[0];
  top = eXY[1] - cXY[1];
  dragHandle.getEl().setStyle({left:left + 'px', top:top + 'px'});
  me.onHandleDrag();
}, onColorBindingChanged:function(selectedColor) {
  var me = this, vm = me.getViewModel(), rgba = vm.get('selectedColor'), hsv, container = me.getView(), dragHandle = container.down('#dragHandle'), containerEl = container.getEl(), containerWidth = containerEl.getWidth(), containerHeight = containerEl.getHeight(), xRatio, yRatio, left, top;
  hsv = Ext.ux.colorpick.ColorUtils.rgb2hsv(rgba.r, rgba.g, rgba.b);
  xRatio = hsv.s;
  left = containerWidth * xRatio;
  yRatio = 1 - hsv.v;
  top = containerHeight * yRatio;
  dragHandle.getEl().setStyle({left:left + 'px', top:top + 'px'});
}, onHueBindingChanged:function(hue) {
  var me = this, vm = me.getViewModel(), fullColorRGB, hex;
  fullColorRGB = Ext.ux.colorpick.ColorUtils.hsv2rgb(hue, 1, 1);
  hex = Ext.ux.colorpick.ColorUtils.rgb2hex(fullColorRGB.r, fullColorRGB.g, fullColorRGB.b);
  me.getView().getEl().applyStyles({'background-color':'#' + hex});
}});
Ext.define('Ext.ux.colorpick.ColorMap', {extend:'Ext.container.Container', alias:'widget.colorpickercolormap', controller:'colorpickercolormapcontroller', requires:['Ext.ux.colorpick.ColorMapController'], cls:Ext.baseCSSPrefix + 'colorpicker-colormap', items:[{xtype:'component', cls:Ext.baseCSSPrefix + 'colorpicker-colormap-draghandle-container', itemId:'dragHandle', width:1, height:1, draggable:true, html:'\x3cdiv class\x3d"' + Ext.baseCSSPrefix + 'colorpicker-colormap-draghandle"\x3e\x3c/div\x3e'}], 
listeners:{boxready:{single:true, fn:'onFirstBoxReady', scope:'controller'}, colorbindingchanged:{fn:'onColorBindingChanged', scope:'controller'}, huebindingchanged:{fn:'onHueBindingChanged', scope:'controller'}}, afterRender:function() {
  var me = this, src = me.mapGradientUrl, el = me.el;
  me.callParent();
  if (!src) {
    src = el.getStyle('background-image');
    src = src.substring(4, src.length - 1);
    if (src.indexOf('"') === 0) {
      src = src.substring(1, src.length - 1);
    }
    Ext.ux.colorpick.ColorMap.prototype.mapGradientUrl = src;
  }
  el.setStyle('background-image', 'none');
  el = me.layout.getElementTarget();
  el.createChild({tag:'img', cls:Ext.baseCSSPrefix + 'colorpicker-colormap-blender', src:src});
}, setPosition:function(data) {
  var me = this, dragHandle = me.down('#dragHandle');
  if (!dragHandle.dd || !dragHandle.dd.constrain) {
    return;
  }
  if (typeof dragHandle.dd.dragEnded !== 'undefined' && !dragHandle.dd.dragEnded) {
    return;
  }
  me.fireEvent('colorbindingchanged', data);
}, setHue:function(hue) {
  var me = this;
  if (!me.getEl()) {
    return;
  }
  me.fireEvent('huebindingchanged', hue);
}});
Ext.define('Ext.ux.colorpick.SelectorModel', {extend:'Ext.app.ViewModel', alias:'viewmodel.colorpick-selectormodel', requires:['Ext.ux.colorpick.ColorUtils'], data:{selectedColor:{r:255, g:255, b:255, h:0, s:1, v:1, a:1}, previousColor:{r:0, g:0, b:0, h:0, s:1, v:1, a:1}}, formulas:{hex:{get:function(get) {
  var r = get('selectedColor.r').toString(16), g = get('selectedColor.g').toString(16), b = get('selectedColor.b').toString(16), result;
  result = Ext.ux.colorpick.ColorUtils.rgb2hex(r, g, b);
  return '#' + result;
}, set:function(hex) {
  var rgb = Ext.ux.colorpick.ColorUtils.hex2rgb(hex);
  this.changeRGB(rgb);
}}, red:{get:function(get) {
  return get('selectedColor.r');
}, set:function(r) {
  this.changeRGB({r:r});
}}, green:{get:function(get) {
  return get('selectedColor.g');
}, set:function(g) {
  this.changeRGB({g:g});
}}, blue:{get:function(get) {
  return get('selectedColor.b');
}, set:function(b) {
  this.changeRGB({b:b});
}}, hue:{get:function(get) {
  return get('selectedColor.h') * 360;
}, set:function(hue) {
  this.changeHSV({h:hue / 360});
}}, saturation:{get:function(get) {
  return get('selectedColor.s') * 100;
}, set:function(saturation) {
  this.changeHSV({s:saturation / 100});
}}, value:{get:function(get) {
  var v = get('selectedColor.v');
  return v * 100;
}, set:function(value) {
  this.changeHSV({v:value / 100});
}}, alpha:{get:function(data) {
  var a = data('selectedColor.a');
  return a * 100;
}, set:function(alpha) {
  this.set('selectedColor', Ext.applyIf({a:alpha / 100}, this.data.selectedColor));
}}}, changeHSV:function(hsv) {
  Ext.applyIf(hsv, this.data.selectedColor);
  var rgb = Ext.ux.colorpick.ColorUtils.hsv2rgb(hsv.h, hsv.s, hsv.v);
  hsv.r = rgb.r;
  hsv.g = rgb.g;
  hsv.b = rgb.b;
  this.set('selectedColor', hsv);
}, changeRGB:function(rgb) {
  Ext.applyIf(rgb, this.data.selectedColor);
  var hsv = Ext.ux.colorpick.ColorUtils.rgb2hsv(rgb.r, rgb.g, rgb.b);
  rgb.h = hsv.h;
  rgb.s = hsv.s;
  rgb.v = hsv.v;
  this.set('selectedColor', rgb);
}});
Ext.define('Ext.ux.colorpick.SelectorController', {extend:'Ext.app.ViewController', alias:'controller.colorpick-selectorcontroller', requires:['Ext.ux.colorpick.ColorUtils'], destroy:function() {
  var me = this, view = me.getView(), childViewModel = view.childViewModel;
  if (childViewModel) {
    childViewModel.destroy();
    view.childViewModel = null;
  }
  me.callParent();
}, changeHSV:function(hsv) {
  var view = this.getView(), color = view.getColor(), rgb;
  Ext.applyIf(hsv, color);
  rgb = Ext.ux.colorpick.ColorUtils.hsv2rgb(hsv.h, hsv.s, hsv.v);
  Ext.apply(hsv, rgb);
  view.setColor(hsv);
}, onColorMapHandleDrag:function(xPercent, yPercent) {
  this.changeHSV({s:xPercent, v:1 - yPercent});
}, onValueSliderHandleDrag:function(yPercent) {
  this.changeHSV({v:1 - yPercent});
}, onSaturationSliderHandleDrag:function(yPercent) {
  this.changeHSV({s:1 - yPercent});
}, onHueSliderHandleDrag:function(yPercent) {
  this.changeHSV({h:1 - yPercent});
}, onAlphaSliderHandleDrag:function(yPercent) {
  var view = this.getView(), color = view.getColor(), newColor = Ext.applyIf({a:1 - yPercent}, color);
  view.setColor(newColor);
  view.el.repaint();
}, onPreviousColorSelected:function(comp, color) {
  var view = this.getView();
  view.setColor(color);
}, onOK:function() {
  var me = this, view = me.getView();
  view.fireEvent('ok', view, view.getValue());
}, onCancel:function() {
  this.fireViewEvent('cancel', this.getView());
}, onResize:function() {
  var me = this, view = me.getView(), vm = view.childViewModel, refs = me.getReferences(), h, s, v, a;
  if (!me.hasResizedOnce) {
    me.hasResizedOnce = true;
    return;
  }
  h = vm.get('hue');
  s = vm.get('saturation');
  v = vm.get('value');
  a = vm.get('alpha');
  refs.colorMap.setPosition(vm.getData());
  refs.hueSlider.setHue(h);
  refs.satSlider.setSaturation(s);
  refs.valueSlider.setValue(v);
  refs.alphaSlider.setAlpha(a);
}});
Ext.define('Ext.ux.colorpick.ColorPreview', {extend:'Ext.Component', alias:'widget.colorpickercolorpreview', requires:['Ext.util.Format'], style:'position: relative', html:'\x3cdiv class\x3d"' + Ext.baseCSSPrefix + 'colorpreview-filter" style\x3d"height:100%; width:100%; position: absolute;"\x3e\x3c/div\x3e' + '\x3ca class\x3d"btn" style\x3d"height:100%; width:100%; position: absolute;"\x3e\x3c/a\x3e', cls:Ext.baseCSSPrefix + 'colorpreview', height:256, onRender:function() {
  var me = this;
  me.callParent(arguments);
  me.mon(me.el.down('.btn'), 'click', me.onClick, me);
}, onClick:function() {
  this.fireEvent('click', this, this.color);
}, setColor:function(color) {
  var me = this, el = me.getEl();
  if (!el) {
    return;
  }
  me.color = color;
  me.applyBgStyle(color);
}, bgStyleTpl:Ext.create('Ext.XTemplate', Ext.isIE && Ext.ieVersion < 10 ? "filter: progid:DXImageTransform.Microsoft.gradient(GradientType\x3d0, startColorstr\x3d'#{hexAlpha}{hex}', endColorstr\x3d'#{hexAlpha}{hex}');" : 'background: {rgba};'), applyBgStyle:function(color) {
  var me = this, colorUtils = Ext.ux.colorpick.ColorUtils, filterSelector = '.' + Ext.baseCSSPrefix + 'colorpreview-filter', el = me.getEl().down(filterSelector), hex, alpha, rgba, bgStyle;
  hex = colorUtils.rgb2hex(color.r, color.g, color.b);
  alpha = Ext.util.Format.hex(Math.floor(color.a * 255), 2);
  rgba = colorUtils.getRGBAString(color);
  bgStyle = this.bgStyleTpl.apply({hex:hex, hexAlpha:alpha, rgba:rgba});
  el.applyStyles(bgStyle);
}});
Ext.define('Ext.ux.colorpick.SliderController', {extend:'Ext.app.ViewController', alias:'controller.colorpick-slidercontroller', boxReady:function(view) {
  var me = this, container = me.getDragContainer(), dragHandle = me.getDragHandle(), dd = dragHandle.dd;
  dd.constrain = true;
  dd.constrainTo = container.getEl();
  dd.initialConstrainTo = dd.constrainTo;
  dd.on('drag', me.onHandleDrag, me);
}, getDragHandle:function() {
  return this.view.lookupReference('dragHandle');
}, getDragContainer:function() {
  return this.view.lookupReference('dragHandleContainer');
}, onHandleDrag:function(e) {
  var me = this, view = me.getView(), container = me.getDragContainer(), dragHandle = me.getDragHandle(), y = dragHandle.getY() - container.getY(), containerEl = container.getEl(), containerHeight = containerEl.getHeight(), yRatio = y / containerHeight;
  if (yRatio > 0.99) {
    yRatio = 1;
  }
  view.fireEvent('handledrag', yRatio);
}, onMouseDown:function(e) {
  var me = this, dragHandle = me.getDragHandle(), y = e.getY();
  dragHandle.setY(y);
  me.onHandleDrag();
  dragHandle.el.repaint();
  dragHandle.dd.onMouseDown(e, dragHandle.dd.el);
}, onDragStart:function(e) {
  var me = this, dragHandle = me.getDragHandle();
  dragHandle.dd.onDragStart(e, dragHandle.dd.el);
}, onMouseUp:function() {
  var dragHandle = this.getDragHandle();
  dragHandle.dd.dragEnded = true;
}});
Ext.define('Ext.ux.colorpick.Slider', {extend:'Ext.container.Container', xtype:'colorpickerslider', controller:'colorpick-slidercontroller', afterRender:function() {
  this.callParent(arguments);
  var width = this.width, dragCt = this.lookupReference('dragHandleContainer'), dragWidth = dragCt.getWidth();
  dragCt.el.setStyle('left', (width - dragWidth) / 2 + 'px');
}, baseCls:Ext.baseCSSPrefix + 'colorpicker-slider', requires:['Ext.ux.colorpick.SliderController'], referenceHolder:true, listeners:{element:'el', mousedown:'onMouseDown', mouseup:'onMouseUp', dragstart:'onDragStart'}, items:{xtype:'container', cls:Ext.baseCSSPrefix + 'colorpicker-draghandle-container', reference:'dragHandleContainer', height:'100%', items:{xtype:'component', cls:Ext.baseCSSPrefix + 'colorpicker-draghandle-outer', reference:'dragHandle', width:'100%', height:1, draggable:true, html:'\x3cdiv class\x3d"' + 
Ext.baseCSSPrefix + 'colorpicker-draghandle"\x3e\x3c/div\x3e'}}, setHue:function() {
  Ext.raise('Must implement setHue() in a child class!');
}, getDragHandle:function() {
  return this.lookupReference('dragHandle');
}, getDragContainer:function() {
  return this.lookupReference('dragHandleContainer');
}});
Ext.define('Ext.ux.colorpick.SliderAlpha', {extend:'Ext.ux.colorpick.Slider', alias:'widget.colorpickerslideralpha', cls:Ext.baseCSSPrefix + 'colorpicker-alpha', requires:['Ext.XTemplate'], gradientStyleTpl:Ext.create('Ext.XTemplate', Ext.isIE && Ext.ieVersion < 10 ? "filter: progid:DXImageTransform.Microsoft.gradient(GradientType\x3d0, startColorstr\x3d'#FF{hex}', endColorstr\x3d'#00{hex}');" : 'background: -moz-linear-gradient(top, rgba({r}, {g}, {b}, 1) 0%, rgba({r}, {g}, {b}, 0) 100%);' + 'background: -webkit-linear-gradient(top,rgba({r}, {g}, {b}, 1) 0%, rgba({r}, {g}, {b}, 0) 100%);' + 
'background: -o-linear-gradient(top, rgba({r}, {g}, {b}, 1) 0%, rgba({r}, {g}, {b}, 0) 100%);' + 'background: -ms-linear-gradient(top, rgba({r}, {g}, {b}, 1) 0%, rgba({r}, {g}, {b}, 0) 100%);' + 'background: linear-gradient(to bottom, rgba({r}, {g}, {b}, 1) 0%, rgba({r}, {g}, {b}, 0) 100%);'), setAlpha:function(value) {
  var me = this, container = me.getDragContainer(), dragHandle = me.getDragHandle(), containerEl = container.getEl(), containerHeight = containerEl.getHeight(), el, top;
  if (!dragHandle.dd || !dragHandle.dd.constrain) {
    return;
  }
  if (typeof dragHandle.dd.dragEnded !== 'undefined' && !dragHandle.dd.dragEnded) {
    return;
  }
  top = containerHeight * (1 - value / 100);
  el = dragHandle.getEl();
  el.setStyle({top:top + 'px'});
}, setColor:function(color) {
  var me = this, container = me.getDragContainer(), hex, el;
  if (!me.getEl()) {
    return;
  }
  hex = Ext.ux.colorpick.ColorUtils.rgb2hex(color.r, color.g, color.b);
  el = container.getEl().first();
  el.applyStyles(me.gradientStyleTpl.apply({hex:hex, r:color.r, g:color.g, b:color.b}));
}});
Ext.define('Ext.ux.colorpick.SliderSaturation', {extend:'Ext.ux.colorpick.Slider', alias:'widget.colorpickerslidersaturation', cls:Ext.baseCSSPrefix + 'colorpicker-saturation', gradientStyleTpl:Ext.create('Ext.XTemplate', Ext.isIE && Ext.ieVersion < 10 ? "filter: progid:DXImageTransform.Microsoft.gradient(GradientType\x3d0, startColorstr\x3d'#{hex}', endColorstr\x3d'#ffffff');" : 'background: -mox-linear-gradient(top, #{hex} 0%, #ffffff 100%);' + 'background: -webkit-linear-gradient(top, #{hex} 0%,#ffffff 100%);' + 
'background: -o-linear-gradient(top, #{hex} 0%,#ffffff 100%);' + 'background: -ms-linear-gradient(top, #{hex} 0%,#ffffff 100%);' + 'background: linear-gradient(to bottom, #{hex} 0%,#ffffff 100%);'), setSaturation:function(saturation) {
  var me = this, container = me.getDragContainer(), dragHandle = me.getDragHandle(), containerEl = container.getEl(), containerHeight = containerEl.getHeight(), yRatio, top;
  if (!dragHandle.dd || !dragHandle.dd.constrain) {
    return;
  }
  if (typeof dragHandle.dd.dragEnded !== 'undefined' && !dragHandle.dd.dragEnded) {
    return;
  }
  yRatio = 1 - saturation / 100;
  top = containerHeight * yRatio;
  dragHandle.getEl().setStyle({top:top + 'px'});
}, setHue:function(hue) {
  var me = this, container = me.getDragContainer(), rgb, hex;
  if (!me.getEl()) {
    return;
  }
  rgb = Ext.ux.colorpick.ColorUtils.hsv2rgb(hue, 1, 1);
  hex = Ext.ux.colorpick.ColorUtils.rgb2hex(rgb.r, rgb.g, rgb.b);
  container.getEl().applyStyles(me.gradientStyleTpl.apply({hex:hex}));
}});
Ext.define('Ext.ux.colorpick.SliderValue', {extend:'Ext.ux.colorpick.Slider', alias:'widget.colorpickerslidervalue', cls:Ext.baseCSSPrefix + 'colorpicker-value', requires:['Ext.XTemplate'], gradientStyleTpl:Ext.create('Ext.XTemplate', Ext.isIE && Ext.ieVersion < 10 ? "filter: progid:DXImageTransform.Microsoft.gradient(GradientType\x3d0, startColorstr\x3d'#{hex}', endColorstr\x3d'#000000');" : 'background: -mox-linear-gradient(top, #{hex} 0%, #000000 100%);' + 'background: -webkit-linear-gradient(top, #{hex} 0%,#000000 100%);' + 
'background: -o-linear-gradient(top, #{hex} 0%,#000000 100%);' + 'background: -ms-linear-gradient(top, #{hex} 0%,#000000 100%);' + 'background: linear-gradient(to bottom, #{hex} 0%,#000000 100%);'), setValue:function(value) {
  var me = this, container = me.getDragContainer(), dragHandle = me.getDragHandle(), containerEl = container.getEl(), containerHeight = containerEl.getHeight(), yRatio, top;
  if (!dragHandle.dd || !dragHandle.dd.constrain) {
    return;
  }
  if (typeof dragHandle.dd.dragEnded !== 'undefined' && !dragHandle.dd.dragEnded) {
    return;
  }
  yRatio = 1 - value / 100;
  top = containerHeight * yRatio;
  dragHandle.getEl().setStyle({top:top + 'px'});
}, setHue:function(hue) {
  var me = this, container = me.getDragContainer(), rgb, hex;
  if (!me.getEl()) {
    return;
  }
  rgb = Ext.ux.colorpick.ColorUtils.hsv2rgb(hue, 1, 1);
  hex = Ext.ux.colorpick.ColorUtils.rgb2hex(rgb.r, rgb.g, rgb.b);
  container.getEl().applyStyles(me.gradientStyleTpl.apply({hex:hex}));
}});
Ext.define('Ext.ux.colorpick.SliderHue', {extend:'Ext.ux.colorpick.Slider', alias:'widget.colorpickersliderhue', cls:Ext.baseCSSPrefix + 'colorpicker-hue', afterRender:function() {
  var me = this, src = me.gradientUrl, el = me.el;
  me.callParent();
  if (!src) {
    src = el.getStyle('background-image');
    src = src.substring(4, src.length - 1);
    if (src.indexOf('"') === 0) {
      src = src.substring(1, src.length - 1);
    }
    Ext.ux.colorpick.SliderHue.prototype.gradientUrl = src;
  }
  el.setStyle('background-image', 'none');
  el = me.getDragContainer().layout.getElementTarget();
  el.createChild({tag:'img', cls:Ext.baseCSSPrefix + 'colorpicker-hue-gradient', src:src});
}, setHue:function(hue) {
  var me = this, container = me.getDragContainer(), dragHandle = me.getDragHandle(), containerEl = container.getEl(), containerHeight = containerEl.getHeight(), el, top;
  if (!dragHandle.dd || !dragHandle.dd.constrain) {
    return;
  }
  if (typeof dragHandle.dd.dragEnded !== 'undefined' && !dragHandle.dd.dragEnded) {
    return;
  }
  top = containerHeight * (1 - hue);
  el = dragHandle.getEl();
  el.setStyle({top:top + 'px'});
}});
Ext.define('Ext.ux.colorpick.Selector', {extend:'Ext.container.Container', xtype:'colorselector', mixins:['Ext.ux.colorpick.Selection'], controller:'colorpick-selectorcontroller', requires:['Ext.layout.container.HBox', 'Ext.form.field.Text', 'Ext.form.field.Number', 'Ext.ux.colorpick.ColorMap', 'Ext.ux.colorpick.SelectorModel', 'Ext.ux.colorpick.SelectorController', 'Ext.ux.colorpick.ColorPreview', 'Ext.ux.colorpick.Slider', 'Ext.ux.colorpick.SliderAlpha', 'Ext.ux.colorpick.SliderSaturation', 'Ext.ux.colorpick.SliderValue', 
'Ext.ux.colorpick.SliderHue'], width:580, height:337, cls:Ext.baseCSSPrefix + 'colorpicker', padding:10, layout:{type:'hbox', align:'stretch'}, defaultBindProperty:'value', twoWayBindable:['value'], fieldWidth:50, fieldPad:5, showPreviousColor:false, showOkCancelButtons:false, listeners:{resize:'onResize'}, constructor:function(config) {
  var me = this, childViewModel = Ext.Factory.viewModel('colorpick-selectormodel');
  me.childViewModel = childViewModel;
  me.items = [me.getMapAndHexRGBFields(childViewModel), me.getSliderAndHField(childViewModel), me.getSliderAndSField(childViewModel), me.getSliderAndVField(childViewModel), me.getSliderAndAField(childViewModel), me.getPreviewAndButtons(childViewModel, config)];
  me.childViewModel.bind('{selectedColor}', function(color) {
    me.setColor(color);
  });
  me.callParent(arguments);
}, updateColor:function(color) {
  var me = this;
  me.mixins.colorselection.updateColor.call(me, color);
  me.childViewModel.set('selectedColor', color);
}, updatePreviousColor:function(color) {
  this.childViewModel.set('previousColor', color);
}, getMapAndHexRGBFields:function(childViewModel) {
  var me = this, fieldMargin = {top:0, right:me.fieldPad, bottom:0, left:0}, fieldWidth = me.fieldWidth;
  return {xtype:'container', viewModel:childViewModel, cls:Ext.baseCSSPrefix + 'colorpicker-escape-overflow', flex:1, layout:{type:'vbox', align:'stretch'}, margin:'0 10 0 0', items:[{xtype:'colorpickercolormap', reference:'colorMap', flex:1, bind:{position:{bindTo:'{selectedColor}', deep:true}, hue:'{selectedColor.h}'}, listeners:{handledrag:'onColorMapHandleDrag'}}, {xtype:'container', layout:'hbox', defaults:{labelAlign:'top', labelSeparator:'', allowBlank:false, onChange:function() {
    if (this.isValid()) {
      Ext.form.field.Base.prototype.onChange.apply(this, arguments);
    }
  }}, items:[{xtype:'textfield', fieldLabel:'HEX', flex:1, bind:'{hex}', margin:fieldMargin, readOnly:true}, {xtype:'numberfield', fieldLabel:'R', bind:'{red}', width:fieldWidth, hideTrigger:true, maxValue:255, minValue:0, margin:fieldMargin}, {xtype:'numberfield', fieldLabel:'G', bind:'{green}', width:fieldWidth, hideTrigger:true, maxValue:255, minValue:0, margin:fieldMargin}, {xtype:'numberfield', fieldLabel:'B', bind:'{blue}', width:fieldWidth, hideTrigger:true, maxValue:255, minValue:0, margin:0}]}]};
}, getSliderAndHField:function(childViewModel) {
  var me = this, fieldWidth = me.fieldWidth;
  return {xtype:'container', viewModel:childViewModel, cls:Ext.baseCSSPrefix + 'colorpicker-escape-overflow', width:fieldWidth, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'colorpickersliderhue', reference:'hueSlider', flex:1, bind:{hue:'{selectedColor.h}'}, width:fieldWidth, listeners:{handledrag:'onHueSliderHandleDrag'}}, {xtype:'numberfield', fieldLabel:'H', labelAlign:'top', labelSeparator:'', bind:'{hue}', hideTrigger:true, maxValue:360, minValue:0, allowBlank:false, margin:0}]};
}, getSliderAndSField:function(childViewModel) {
  var me = this, fieldWidth = me.fieldWidth;
  return {xtype:'container', viewModel:childViewModel, cls:Ext.baseCSSPrefix + 'colorpicker-escape-overflow', width:fieldWidth, layout:{type:'vbox', align:'stretch'}, margin:{right:me.fieldPad, left:me.fieldPad}, items:[{xtype:'colorpickerslidersaturation', reference:'satSlider', flex:1, bind:{saturation:'{saturation}', hue:'{selectedColor.h}'}, width:fieldWidth, listeners:{handledrag:'onSaturationSliderHandleDrag'}}, {xtype:'numberfield', fieldLabel:'S', labelAlign:'top', labelSeparator:'', bind:'{saturation}', 
  hideTrigger:true, maxValue:100, minValue:0, allowBlank:false, margin:0}]};
}, getSliderAndVField:function(childViewModel) {
  var me = this, fieldWidth = me.fieldWidth;
  return {xtype:'container', viewModel:childViewModel, cls:Ext.baseCSSPrefix + 'colorpicker-escape-overflow', width:fieldWidth, layout:{type:'vbox', align:'stretch'}, items:[{xtype:'colorpickerslidervalue', reference:'valueSlider', flex:1, bind:{value:'{value}', hue:'{selectedColor.h}'}, width:fieldWidth, listeners:{handledrag:'onValueSliderHandleDrag'}}, {xtype:'numberfield', fieldLabel:'V', labelAlign:'top', labelSeparator:'', bind:'{value}', hideTrigger:true, maxValue:100, minValue:0, allowBlank:false, 
  margin:0}]};
}, getSliderAndAField:function(childViewModel) {
  var me = this, fieldWidth = me.fieldWidth;
  return {xtype:'container', viewModel:childViewModel, cls:Ext.baseCSSPrefix + 'colorpicker-escape-overflow', width:fieldWidth, layout:{type:'vbox', align:'stretch'}, margin:{left:me.fieldPad}, items:[{xtype:'colorpickerslideralpha', reference:'alphaSlider', flex:1, bind:{alpha:'{alpha}', color:{bindTo:'{selectedColor}', deep:true}}, width:fieldWidth, listeners:{handledrag:'onAlphaSliderHandleDrag'}}, {xtype:'numberfield', fieldLabel:'A', labelAlign:'top', labelSeparator:'', bind:'{alpha}', hideTrigger:true, 
  maxValue:100, minValue:0, allowBlank:false, margin:0}]};
}, getPreviewAndButtons:function(childViewModel, config) {
  var items = [{xtype:'colorpickercolorpreview', flex:1, bind:{color:{bindTo:'{selectedColor}', deep:true}}}];
  if (config.showPreviousColor) {
    items.push({xtype:'colorpickercolorpreview', flex:1, bind:{color:{bindTo:'{previousColor}', deep:true}}, listeners:{click:'onPreviousColorSelected'}});
  }
  if (config.showOkCancelButtons) {
    items.push({xtype:'button', text:'OK', margin:'10 0 0 0', handler:'onOK'}, {xtype:'button', text:'Cancel', margin:'10 0 0 0', handler:'onCancel'});
  }
  return {xtype:'container', viewModel:childViewModel, width:70, margin:'0 0 0 10', items:items, layout:{type:'vbox', align:'stretch'}};
}});
Ext.define('Ext.ux.colorpick.ButtonController', {extend:'Ext.app.ViewController', alias:'controller.colorpick-buttoncontroller', requires:['Ext.window.Window', 'Ext.layout.container.Fit', 'Ext.ux.colorpick.Selector', 'Ext.ux.colorpick.ColorUtils'], afterRender:function(view) {
  view.updateColor(view.getColor());
}, destroy:function() {
  var view = this.getView(), colorPickerWindow = view.colorPickerWindow;
  if (colorPickerWindow) {
    colorPickerWindow.destroy();
    view.colorPickerWindow = view.colorPicker = null;
  }
  this.callParent();
}, getPopup:function() {
  var view = this.getView(), popup = view.colorPickerWindow, selector;
  if (!popup) {
    popup = Ext.create(view.getPopup());
    view.colorPickerWindow = popup;
    popup.colorPicker = view.colorPicker = selector = popup.lookupReference('selector');
    selector.setFormat(view.getFormat());
    selector.on({ok:'onColorPickerOK', cancel:'onColorPickerCancel', scope:this});
    popup.on({close:'onColorPickerCancel', scope:this});
  }
  return popup;
}, onClick:function() {
  var me = this, view = me.getView(), color = view.getColor(), popup = me.getPopup(), colorPicker = popup.colorPicker;
  colorPicker.setColor(color);
  colorPicker.setPreviousColor(color);
  popup.showBy(view, 'tl-br?');
}, onColorPickerOK:function(picker) {
  var view = this.getView(), color = picker.getColor(), cpWin = view.colorPickerWindow;
  cpWin.hide();
  view.setColor(color);
}, onColorPickerCancel:function() {
  var view = this.getView(), cpWin = view.colorPickerWindow;
  cpWin.hide();
}, syncColor:function(color) {
  var view = this.getView();
  Ext.ux.colorpick.ColorUtils.setBackground(view.filterEl, color);
}});
Ext.define('Ext.ux.colorpick.Button', {extend:'Ext.Component', xtype:'colorbutton', controller:'colorpick-buttoncontroller', mixins:['Ext.ux.colorpick.Selection'], requires:['Ext.ux.colorpick.ButtonController'], baseCls:Ext.baseCSSPrefix + 'colorpicker-button', width:20, height:20, childEls:['btnEl', 'filterEl'], config:{popup:{lazy:true, $value:{xtype:'window', closeAction:'hide', referenceHolder:true, minWidth:540, minHeight:200, layout:'fit', header:false, resizable:true, items:{xtype:'colorselector', 
reference:'selector', showPreviousColor:true, showOkCancelButtons:true}}}}, defaultBindProperty:'value', twoWayBindable:'value', renderTpl:'\x3cdiv id\x3d"{id}-filterEl" data-ref\x3d"filterEl" style\x3d"height:100%; width:100%; position: absolute;"\x3e\x3c/div\x3e' + '\x3ca id\x3d"{id}-btnEl" data-ref\x3d"btnEl" style\x3d"height:100%; width:100%; position: absolute;"\x3e\x3c/a\x3e', listeners:{click:'onClick', element:'btnEl'}, updateColor:function(color) {
  var me = this, cp = me.colorPicker;
  me.mixins.colorselection.updateColor.call(me, color);
  Ext.ux.colorpick.ColorUtils.setBackground(me.filterEl, color);
  if (cp) {
    cp.setColor(color);
  }
}, updateFormat:function(format) {
  var cp = this.colorPicker;
  if (cp) {
    cp.setFormat(format);
  }
}});
Ext.define('Ext.ux.colorpick.Field', {extend:'Ext.form.field.Picker', xtype:'colorfield', mixins:['Ext.ux.colorpick.Selection'], requires:['Ext.window.Window', 'Ext.ux.colorpick.Selector', 'Ext.ux.colorpick.ColorUtils', 'Ext.layout.container.Fit'], editable:false, matchFieldWidth:false, beforeBodyEl:['\x3cdiv class\x3d"' + Ext.baseCSSPrefix + 'colorpicker-field-swatch"\x3e' + '\x3cdiv id\x3d"{id}-swatchEl" data-ref\x3d"swatchEl" class\x3d"' + Ext.baseCSSPrefix + 'colorpicker-field-swatch-inner"\x3e\x3c/div\x3e' + 
'\x3c/div\x3e'], cls:Ext.baseCSSPrefix + 'colorpicker-field', childEls:['swatchEl'], config:{popup:{lazy:true, $value:{xtype:'window', closeAction:'hide', referenceHolder:true, minWidth:540, minHeight:200, layout:'fit', header:false, resizable:true, items:{xtype:'colorselector', reference:'selector', showPreviousColor:true, showOkCancelButtons:true}}}}, afterRender:function() {
  this.callParent();
  this.updateValue(this.value);
}, createPicker:function() {
  var me = this, popup = me.getPopup(), picker;
  me.colorPickerWindow = popup = Ext.create(popup);
  me.colorPicker = picker = popup.lookupReference('selector');
  picker.setFormat(me.getFormat());
  picker.setColor(me.getColor());
  picker.on({ok:'onColorPickerOK', cancel:'onColorPickerCancel', scope:me});
  popup.on({close:'onColorPickerCancel', scope:me});
  return me.colorPickerWindow;
}, onColorPickerOK:function(colorPicker) {
  this.setColor(colorPicker.getColor());
  this.collapse();
}, onColorPickerCancel:function() {
  this.collapse();
}, onExpand:function() {
  var color = this.getColor();
  this.colorPicker.setPreviousColor(color);
}, setValue:function(color) {
  var me = this, c = me.applyValue(color);
  me.callParent([c]);
  me.updateValue(c);
}, updateFormat:function(format) {
  var cp = this.colorPicker;
  if (cp) {
    cp.setFormat(format);
  }
}, updateValue:function(color) {
  var me = this, c;
  if (!me.syncing) {
    me.syncing = true;
    me.setColor(color);
    me.syncing = false;
  }
  c = me.getColor();
  Ext.ux.colorpick.ColorUtils.setBackground(me.swatchEl, c);
  if (me.colorPicker) {
    me.colorPicker.setColor(c);
  }
}});
Ext.define('Ext.ux.data.PagingMemoryProxy', {extend:'Ext.data.proxy.Memory', alias:'proxy.pagingmemory', alternateClassName:'Ext.data.PagingMemoryProxy', constructor:function() {
  Ext.log.warn('Ext.ux.data.PagingMemoryProxy functionality has been merged into Ext.data.proxy.Memory by using the enablePaging flag.');
  this.callParent(arguments);
}, read:function(operation, callback, scope) {
  var reader = this.getReader(), result = reader.read(this.data), sorters, filters, sorterFn, records;
  scope = scope || this;
  filters = operation.filters;
  if (filters.length > 0) {
    records = [];
    Ext.each(result.records, function(record) {
      var isMatch = true, length = filters.length, i;
      for (i = 0; i < length; i++) {
        var filter = filters[i], fn = filter.filterFn, scope = filter.scope;
        isMatch = isMatch && fn.call(scope, record);
      }
      if (isMatch) {
        records.push(record);
      }
    }, this);
    result.records = records;
    result.totalRecords = result.total = records.length;
  }
  sorters = operation.sorters;
  if (sorters.length > 0) {
    sorterFn = function(r1, r2) {
      var result = sorters[0].sort(r1, r2), length = sorters.length, i;
      for (i = 1; i < length; i++) {
        result = result || sorters[i].sort.call(this, r1, r2);
      }
      return result;
    };
    result.records.sort(sorterFn);
  }
  if (operation.start !== undefined && operation.limit !== undefined) {
    result.records = result.records.slice(operation.start, operation.start + operation.limit);
    result.count = result.records.length;
  }
  Ext.apply(operation, {resultSet:result});
  operation.setCompleted();
  operation.setSuccessful();
  Ext.defer(function() {
    Ext.callback(callback, scope, [operation]);
  }, 10);
}});
Ext.define('Ext.ux.dd.CellFieldDropZone', {extend:'Ext.dd.DropZone', alias:'plugin.ux-cellfielddropzone', containerScroll:true, onCellDrop:Ext.emptyFn, constructor:function(cfg) {
  if (cfg) {
    var me = this, ddGroup = cfg.ddGroup, onCellDrop = cfg.onCellDrop;
    if (onCellDrop) {
      if (typeof onCellDrop === 'string') {
        me.onCellDropFn = onCellDrop;
        me.onCellDrop = me.callCellDrop;
      } else {
        me.onCellDrop = onCellDrop;
      }
    }
    if (ddGroup) {
      me.ddGroup = ddGroup;
    }
  }
}, init:function(grid) {
  var me = this;
  if (grid.rendered) {
    me.grid = grid;
    grid.getView().on({render:function(v) {
      me.view = v;
      Ext.ux.dd.CellFieldDropZone.superclass.constructor.call(me, me.view.el);
    }, single:true});
  } else {
    grid.on('render', me.init, me, {single:true});
  }
}, getTargetFromEvent:function(e) {
  var me = this, v = me.view;
  var cell = e.getTarget(v.getCellSelector());
  if (cell) {
    var row = v.findItemByChild(cell), columnIndex = cell.cellIndex;
    if (row && Ext.isDefined(columnIndex)) {
      return {node:cell, record:v.getRecord(row), fieldName:me.grid.getVisibleColumnManager().getColumns()[columnIndex].dataIndex};
    }
  }
}, onNodeEnter:function(target, dd, e, dragData) {
  delete this.dropOK;
  if (!target) {
    return;
  }
  var f = dragData.field;
  if (!f) {
    return;
  }
  var field = target.record.fieldsMap[target.fieldName];
  if (field.isNumeric) {
    if (!f.isXType('numberfield')) {
      return;
    }
  } else {
    if (field.isDateField) {
      if (!f.isXType('datefield')) {
        return;
      }
    } else {
      if (field.isBooleanField) {
        if (!f.isXType('checkbox')) {
          return;
        }
      }
    }
  }
  this.dropOK = true;
  Ext.fly(target.node).addCls('x-drop-target-active');
}, onNodeOver:function(target, dd, e, dragData) {
  return this.dropOK ? this.dropAllowed : this.dropNotAllowed;
}, onNodeOut:function(target, dd, e, dragData) {
  Ext.fly(target.node).removeCls('x-drop-target-active');
}, onNodeDrop:function(target, dd, e, dragData) {
  if (this.dropOK) {
    var value = dragData.field.getValue();
    target.record.set(target.fieldName, value);
    this.onCellDrop(target.fieldName, value);
    return true;
  }
}, callCellDrop:function(fieldName, value) {
  Ext.callback(this.onCellDropFn, null, [fieldName, value], 0, this.grid);
}});
Ext.define('Ext.ux.dd.PanelFieldDragZone', {extend:'Ext.dd.DragZone', alias:'plugin.ux-panelfielddragzone', scroll:false, constructor:function(cfg) {
  if (cfg) {
    if (cfg.ddGroup) {
      this.ddGroup = cfg.ddGroup;
    }
  }
}, init:function(panel) {
  var el;
  if (panel.nodeType) {
    Ext.ux.dd.PanelFieldDragZone.superclass.init.apply(this, arguments);
  } else {
    if (panel.rendered) {
      el = panel.getEl();
      el.unselectable();
      Ext.ux.dd.PanelFieldDragZone.superclass.constructor.call(this, el);
    } else {
      panel.on('afterrender', this.init, this, {single:true});
    }
  }
}, getDragData:function(e) {
  var targetLabel = e.getTarget('label', null, true), text, oldMark, field, dragEl;
  if (targetLabel) {
    field = Ext.getCmp(targetLabel.up('.' + Ext.form.Labelable.prototype.formItemCls).id);
    oldMark = field.preventMark;
    field.preventMark = true;
    if (field.isValid()) {
      field.preventMark = oldMark;
      dragEl = document.createElement('div');
      dragEl.className = Ext.baseCSSPrefix + 'form-text';
      text = field.getRawValue();
      dragEl.innerHTML = Ext.isEmpty(text) ? '\x26#160;' : text;
      Ext.fly(dragEl).setWidth(field.getEl().getWidth());
      return {field:field, ddel:dragEl};
    }
    e.stopEvent();
    field.preventMark = oldMark;
  }
}, getRepairXY:function() {
  return this.dragData.field.getEl().getXY();
}});
Ext.define('Ext.ux.desktop.Desktop', {extend:'Ext.panel.Panel', alias:'widget.desktop', uses:['Ext.util.MixedCollection', 'Ext.menu.Menu', 'Ext.view.View', 'Ext.window.Window', 'Ext.ux.desktop.TaskBar', 'Ext.ux.desktop.Wallpaper'], activeWindowCls:'ux-desktop-active-win', inactiveWindowCls:'ux-desktop-inactive-win', lastActiveWindow:null, border:false, html:'\x26#160;', layout:'fit', xTickSize:1, yTickSize:1, app:null, shortcuts:null, shortcutItemSelector:'div.ux-desktop-shortcut', shortcutTpl:['\x3ctpl for\x3d"."\x3e', 
'\x3cdiv class\x3d"ux-desktop-shortcut" id\x3d"{name}-shortcut"\x3e', '\x3cdiv class\x3d"ux-desktop-shortcut-icon {iconCls}"\x3e', '\x3cimg src\x3d"', Ext.BLANK_IMAGE_URL, '" title\x3d"{name}"\x3e', '\x3c/div\x3e', '\x3cspan class\x3d"ux-desktop-shortcut-text"\x3e{name}\x3c/span\x3e', '\x3c/div\x3e', '\x3c/tpl\x3e', '\x3cdiv class\x3d"x-clear"\x3e\x3c/div\x3e'], taskbarConfig:null, windowMenu:null, initComponent:function() {
  var me = this;
  me.windowMenu = new Ext.menu.Menu(me.createWindowMenu());
  me.bbar = me.taskbar = new Ext.ux.desktop.TaskBar(me.taskbarConfig);
  me.taskbar.windowMenu = me.windowMenu;
  me.windows = new Ext.util.MixedCollection;
  me.contextMenu = new Ext.menu.Menu(me.createDesktopMenu());
  me.items = [{xtype:'wallpaper', id:me.id + '_wallpaper'}, me.createDataView()];
  me.callParent();
  me.shortcutsView = me.items.getAt(1);
  me.shortcutsView.on('itemclick', me.onShortcutItemClick, me);
  var wallpaper = me.wallpaper;
  me.wallpaper = me.items.getAt(0);
  if (wallpaper) {
    me.setWallpaper(wallpaper, me.wallpaperStretch);
  }
}, afterRender:function() {
  var me = this;
  me.callParent();
  me.el.on('contextmenu', me.onDesktopMenu, me);
}, createDataView:function() {
  var me = this;
  return {xtype:'dataview', overItemCls:'x-view-over', trackOver:true, itemSelector:me.shortcutItemSelector, store:me.shortcuts, style:{position:'absolute'}, x:0, y:0, tpl:new Ext.XTemplate(me.shortcutTpl)};
}, createDesktopMenu:function() {
  var me = this, ret = {items:me.contextMenuItems || []};
  if (ret.items.length) {
    ret.items.push('-');
  }
  ret.items.push({text:'Tile', handler:me.tileWindows, scope:me, minWindows:1}, {text:'Cascade', handler:me.cascadeWindows, scope:me, minWindows:1});
  return ret;
}, createWindowMenu:function() {
  var me = this;
  return {defaultAlign:'br-tr', items:[{text:'Restore', handler:me.onWindowMenuRestore, scope:me}, {text:'Minimize', handler:me.onWindowMenuMinimize, scope:me}, {text:'Maximize', handler:me.onWindowMenuMaximize, scope:me}, '-', {text:'Close', handler:me.onWindowMenuClose, scope:me}], listeners:{beforeshow:me.onWindowMenuBeforeShow, hide:me.onWindowMenuHide, scope:me}};
}, onDesktopMenu:function(e) {
  var me = this, menu = me.contextMenu;
  e.stopEvent();
  if (!menu.rendered) {
    menu.on('beforeshow', me.onDesktopMenuBeforeShow, me);
  }
  menu.showAt(e.getXY());
  menu.doConstrain();
}, onDesktopMenuBeforeShow:function(menu) {
  var me = this, count = me.windows.getCount();
  menu.items.each(function(item) {
    var min = item.minWindows || 0;
    item.setDisabled(count < min);
  });
}, onShortcutItemClick:function(dataView, record) {
  var me = this, module = me.app.getModule(record.data.module), win = module && module.createWindow();
  if (win) {
    me.restoreWindow(win);
  }
}, onWindowClose:function(win) {
  var me = this;
  me.windows.remove(win);
  me.taskbar.removeTaskButton(win.taskButton);
  me.updateActiveWindow();
}, onWindowMenuBeforeShow:function(menu) {
  var items = menu.items.items, win = menu.theWin;
  items[0].setDisabled(win.maximized !== true && win.hidden !== true);
  items[1].setDisabled(win.minimized === true);
  items[2].setDisabled(win.maximized === true || win.hidden === true);
}, onWindowMenuClose:function() {
  var me = this, win = me.windowMenu.theWin;
  win.close();
}, onWindowMenuHide:function(menu) {
  Ext.defer(function() {
    menu.theWin = null;
  }, 1);
}, onWindowMenuMaximize:function() {
  var me = this, win = me.windowMenu.theWin;
  win.maximize();
  win.toFront();
}, onWindowMenuMinimize:function() {
  var me = this, win = me.windowMenu.theWin;
  win.minimize();
}, onWindowMenuRestore:function() {
  var me = this, win = me.windowMenu.theWin;
  me.restoreWindow(win);
}, getWallpaper:function() {
  return this.wallpaper.wallpaper;
}, setTickSize:function(xTickSize, yTickSize) {
  var me = this, xt = me.xTickSize = xTickSize, yt = me.yTickSize = arguments.length > 1 ? yTickSize : xt;
  me.windows.each(function(win) {
    var dd = win.dd, resizer = win.resizer;
    dd.xTickSize = xt;
    dd.yTickSize = yt;
    resizer.widthIncrement = xt;
    resizer.heightIncrement = yt;
  });
}, setWallpaper:function(wallpaper, stretch) {
  this.wallpaper.setWallpaper(wallpaper, stretch);
  return this;
}, cascadeWindows:function() {
  var x = 0, y = 0, zmgr = this.getDesktopZIndexManager();
  zmgr.eachBottomUp(function(win) {
    if (win.isWindow && win.isVisible() && !win.maximized) {
      win.setPosition(x, y);
      x += 20;
      y += 20;
    }
  });
}, createWindow:function(config, cls) {
  var me = this, win, cfg = Ext.applyIf(config || {}, {stateful:false, isWindow:true, constrainHeader:true, minimizable:true, maximizable:true});
  cls = cls || Ext.window.Window;
  win = me.add(new cls(cfg));
  me.windows.add(win);
  win.taskButton = me.taskbar.addTaskButton(win);
  win.animateTarget = win.taskButton.el;
  win.on({activate:me.updateActiveWindow, beforeshow:me.updateActiveWindow, deactivate:me.updateActiveWindow, minimize:me.minimizeWindow, destroy:me.onWindowClose, scope:me});
  win.on({boxready:function() {
    win.dd.xTickSize = me.xTickSize;
    win.dd.yTickSize = me.yTickSize;
    if (win.resizer) {
      win.resizer.widthIncrement = me.xTickSize;
      win.resizer.heightIncrement = me.yTickSize;
    }
  }, single:true});
  win.doClose = function() {
    win.doClose = Ext.emptyFn;
    win.el.disableShadow();
    win.el.fadeOut({listeners:{afteranimate:function() {
      win.destroy();
    }}});
  };
  return win;
}, getActiveWindow:function() {
  var win = null, zmgr = this.getDesktopZIndexManager();
  if (zmgr) {
    zmgr.eachTopDown(function(comp) {
      if (comp.isWindow && !comp.hidden) {
        win = comp;
        return false;
      }
      return true;
    });
  }
  return win;
}, getDesktopZIndexManager:function() {
  var windows = this.windows;
  return windows.getCount() && windows.getAt(0).zIndexManager || null;
}, getWindow:function(id) {
  return this.windows.get(id);
}, minimizeWindow:function(win) {
  win.minimized = true;
  win.hide();
}, restoreWindow:function(win) {
  if (win.isVisible()) {
    win.restore();
    win.toFront();
  } else {
    win.show();
  }
  return win;
}, tileWindows:function() {
  var me = this, availWidth = me.body.getWidth(true);
  var x = me.xTickSize, y = me.yTickSize, nextY = y;
  me.windows.each(function(win) {
    if (win.isVisible() && !win.maximized) {
      var w = win.el.getWidth();
      if (x > me.xTickSize && x + w > availWidth) {
        x = me.xTickSize;
        y = nextY;
      }
      win.setPosition(x, y);
      x += w + me.xTickSize;
      nextY = Math.max(nextY, y + win.el.getHeight() + me.yTickSize);
    }
  });
}, updateActiveWindow:function() {
  var me = this, activeWindow = me.getActiveWindow(), last = me.lastActiveWindow;
  if (last && last.destroyed) {
    me.lastActiveWindow = null;
    return;
  }
  if (activeWindow === last) {
    return;
  }
  if (last) {
    if (last.el.dom) {
      last.addCls(me.inactiveWindowCls);
      last.removeCls(me.activeWindowCls);
    }
    last.active = false;
  }
  me.lastActiveWindow = activeWindow;
  if (activeWindow) {
    activeWindow.addCls(me.activeWindowCls);
    activeWindow.removeCls(me.inactiveWindowCls);
    activeWindow.minimized = false;
    activeWindow.active = true;
  }
  me.taskbar.setActiveButton(activeWindow && activeWindow.taskButton);
}});
Ext.define('Ext.ux.desktop.App', {mixins:{observable:'Ext.util.Observable'}, requires:['Ext.container.Viewport', 'Ext.ux.desktop.Desktop'], isReady:false, modules:null, useQuickTips:true, constructor:function(config) {
  var me = this;
  me.mixins.observable.constructor.call(this, config);
  if (Ext.isReady) {
    Ext.defer(me.init, 10, me);
  } else {
    Ext.onReady(me.init, me);
  }
}, init:function() {
  var me = this, desktopCfg;
  if (me.useQuickTips) {
    Ext.QuickTips.init();
  }
  me.modules = me.getModules();
  if (me.modules) {
    me.initModules(me.modules);
  }
  desktopCfg = me.getDesktopConfig();
  me.desktop = new Ext.ux.desktop.Desktop(desktopCfg);
  me.viewport = new Ext.container.Viewport({layout:'fit', items:[me.desktop]});
  Ext.getWin().on('beforeunload', me.onUnload, me);
  me.isReady = true;
  me.fireEvent('ready', me);
}, getDesktopConfig:function() {
  var me = this, cfg = {app:me, taskbarConfig:me.getTaskbarConfig()};
  Ext.apply(cfg, me.desktopConfig);
  return cfg;
}, getModules:Ext.emptyFn, getStartConfig:function() {
  var me = this, cfg = {app:me, menu:[]}, launcher;
  Ext.apply(cfg, me.startConfig);
  Ext.each(me.modules, function(module) {
    launcher = module.launcher;
    if (launcher) {
      launcher.handler = launcher.handler || Ext.bind(me.createWindow, me, [module]);
      cfg.menu.push(module.launcher);
    }
  });
  return cfg;
}, createWindow:function(module) {
  var window = module.createWindow();
  window.show();
}, getTaskbarConfig:function() {
  var me = this, cfg = {app:me, startConfig:me.getStartConfig()};
  Ext.apply(cfg, me.taskbarConfig);
  return cfg;
}, initModules:function(modules) {
  var me = this;
  Ext.each(modules, function(module) {
    module.app = me;
  });
}, getModule:function(name) {
  var ms = this.modules;
  for (var i = 0, len = ms.length; i < len; i++) {
    var m = ms[i];
    if (m.id == name || m.appType == name) {
      return m;
    }
  }
  return null;
}, onReady:function(fn, scope) {
  if (this.isReady) {
    fn.call(scope, this);
  } else {
    this.on({ready:fn, scope:scope, single:true});
  }
}, getDesktop:function() {
  return this.desktop;
}, onUnload:function(e) {
  if (this.fireEvent('beforeunload', this) === false) {
    e.stopEvent();
  }
}});
Ext.define('Ext.ux.desktop.Module', {mixins:{observable:'Ext.util.Observable'}, constructor:function(config) {
  this.mixins.observable.constructor.call(this, config);
  this.init();
}, init:Ext.emptyFn});
Ext.define('Ext.ux.desktop.ShortcutModel', {extend:'Ext.data.Model', fields:[{name:'name', convert:Ext.String.createVarName}, {name:'iconCls'}, {name:'module'}]});
Ext.define('Ext.ux.desktop.StartMenu', {extend:'Ext.menu.Menu', baseCls:Ext.baseCSSPrefix + 'panel', cls:'x-menu ux-start-menu', bodyCls:'ux-start-menu-body', defaultAlign:'bl-tl', iconCls:'user', bodyBorder:true, width:300, initComponent:function() {
  var me = this;
  me.layout.align = 'stretch';
  me.items = me.menu;
  me.callParent();
  me.toolbar = new Ext.toolbar.Toolbar(Ext.apply({dock:'right', cls:'ux-start-menu-toolbar', vertical:true, width:100, layout:{align:'stretch'}}, me.toolConfig));
  me.addDocked(me.toolbar);
  delete me.toolItems;
}, addMenuItem:function() {
  var cmp = this.menu;
  cmp.add.apply(cmp, arguments);
}, addToolItem:function() {
  var cmp = this.toolbar;
  cmp.add.apply(cmp, arguments);
}});
Ext.define('Ext.ux.desktop.TaskBar', {extend:'Ext.toolbar.Toolbar', requires:['Ext.button.Button', 'Ext.resizer.Splitter', 'Ext.menu.Menu', 'Ext.ux.desktop.StartMenu'], alias:'widget.taskbar', cls:'ux-taskbar', startBtnText:'Start', initComponent:function() {
  var me = this;
  me.startMenu = new Ext.ux.desktop.StartMenu(me.startConfig);
  me.quickStart = new Ext.toolbar.Toolbar(me.getQuickStart());
  me.windowBar = new Ext.toolbar.Toolbar(me.getWindowBarConfig());
  me.tray = new Ext.toolbar.Toolbar(me.getTrayConfig());
  me.items = [{xtype:'button', cls:'ux-start-button', iconCls:'ux-start-button-icon', menu:me.startMenu, menuAlign:'bl-tl', text:me.startBtnText}, me.quickStart, {xtype:'splitter', html:'\x26#160;', height:14, width:2, cls:'x-toolbar-separator x-toolbar-separator-horizontal'}, me.windowBar, '-', me.tray];
  me.callParent();
}, afterLayout:function() {
  var me = this;
  me.callParent();
  me.windowBar.el.on('contextmenu', me.onButtonContextMenu, me);
}, getQuickStart:function() {
  var me = this, ret = {minWidth:20, width:Ext.themeName === 'neptune' ? 70 : 60, items:[], enableOverflow:true};
  Ext.each(this.quickStart, function(item) {
    ret.items.push({tooltip:{text:item.name, align:'bl-tl'}, overflowText:item.name, iconCls:item.iconCls, module:item.module, handler:me.onQuickStartClick, scope:me});
  });
  return ret;
}, getTrayConfig:function() {
  var ret = {items:this.trayItems};
  delete this.trayItems;
  return ret;
}, getWindowBarConfig:function() {
  return {flex:1, cls:'ux-desktop-windowbar', items:['\x26#160;'], layout:{overflowHandler:'Scroller'}};
}, getWindowBtnFromEl:function(el) {
  var c = this.windowBar.getChildByElement(el);
  return c || null;
}, onQuickStartClick:function(btn) {
  var module = this.app.getModule(btn.module), window;
  if (module) {
    window = module.createWindow();
    window.show();
  }
}, onButtonContextMenu:function(e) {
  var me = this, t = e.getTarget(), btn = me.getWindowBtnFromEl(t);
  if (btn) {
    e.stopEvent();
    me.windowMenu.theWin = btn.win;
    me.windowMenu.showBy(t);
  }
}, onWindowBtnClick:function(btn) {
  var win = btn.win;
  if (win.minimized || win.hidden) {
    btn.disable();
    win.show(null, function() {
      btn.enable();
    });
  } else {
    if (win.active) {
      btn.disable();
      win.on('hide', function() {
        btn.enable();
      }, null, {single:true});
      win.minimize();
    } else {
      win.toFront();
    }
  }
}, addTaskButton:function(win) {
  var config = {iconCls:win.iconCls, enableToggle:true, toggleGroup:'all', width:140, margin:'0 2 0 3', text:Ext.util.Format.ellipsis(win.title, 20), listeners:{click:this.onWindowBtnClick, scope:this}, win:win};
  var cmp = this.windowBar.add(config);
  cmp.toggle(true);
  return cmp;
}, removeTaskButton:function(btn) {
  var found, me = this;
  me.windowBar.items.each(function(item) {
    if (item === btn) {
      found = item;
    }
    return !found;
  });
  if (found) {
    me.windowBar.remove(found);
  }
  return found;
}, setActiveButton:function(btn) {
  if (btn) {
    btn.toggle(true);
  } else {
    this.windowBar.items.each(function(item) {
      if (item.isButton) {
        item.toggle(false);
      }
    });
  }
}});
Ext.define('Ext.ux.desktop.TrayClock', {extend:'Ext.toolbar.TextItem', alias:'widget.trayclock', cls:'ux-desktop-trayclock', html:'\x26#160;', timeFormat:'g:i A', tpl:'{time}', initComponent:function() {
  var me = this;
  me.callParent();
  if (typeof me.tpl == 'string') {
    me.tpl = new Ext.XTemplate(me.tpl);
  }
}, afterRender:function() {
  var me = this;
  Ext.defer(me.updateTime, 100, me);
  me.callParent();
}, doDestroy:function() {
  var me = this;
  if (me.timer) {
    window.clearTimeout(me.timer);
    me.timer = null;
  }
  me.callParent();
}, updateTime:function() {
  var me = this, time = Ext.Date.format(new Date, me.timeFormat), text = me.tpl.apply({time:time});
  if (me.lastText != text) {
    me.setText(text);
    me.lastText = text;
  }
  me.timer = Ext.defer(me.updateTime, 10000, me);
}});
Ext.define('Ext.ux.desktop.Video', {extend:'Ext.panel.Panel', alias:'widget.video', layout:'fit', autoplay:false, controls:true, bodyStyle:'background-color:#000;color:#fff', html:'', tpl:['\x3cvideo id\x3d"{id}-video" autoPlay\x3d"{autoplay}" controls\x3d"{controls}" poster\x3d"{poster}" start\x3d"{start}" loopstart\x3d"{loopstart}" loopend\x3d"{loopend}" autobuffer\x3d"{autobuffer}" loop\x3d"{loop}" style\x3d"width:100%;height:100%"\x3e', '\x3ctpl for\x3d"src"\x3e', '\x3csource src\x3d"{src}" type\x3d"{type}"/\x3e', 
'\x3c/tpl\x3e', '{html}', '\x3c/video\x3e'], initComponent:function() {
  var me = this, fallback, size, cfg, el;
  if (me.fallbackHTML) {
    fallback = me.fallbackHTML;
  } else {
    fallback = 'Your browser does not support HTML5 Video. ';
    if (Ext.isChrome) {
      fallback += 'Upgrade Chrome.';
    } else {
      if (Ext.isGecko) {
        fallback += 'Upgrade to Firefox 3.5 or newer.';
      } else {
        var chrome = '\x3ca href\x3d"http://www.google.com/chrome"\x3eChrome\x3c/a\x3e';
        fallback += 'Please try \x3ca href\x3d"http://www.mozilla.com"\x3eFirefox\x3c/a\x3e';
        if (Ext.isIE) {
          fallback += ', ' + chrome + ' or \x3ca href\x3d"http://www.apple.com/safari/"\x3eSafari\x3c/a\x3e.';
        } else {
          fallback += ' or ' + chrome + '.';
        }
      }
    }
  }
  me.fallbackHTML = fallback;
  cfg = me.data = Ext.copyTo({tag:'video', html:fallback}, me, 'id,poster,start,loopstart,loopend,playcount,autobuffer,loop');
  if (me.autoplay) {
    cfg.autoplay = 1;
  }
  if (me.controls) {
    cfg.controls = 1;
  }
  if (Ext.isArray(me.src)) {
    cfg.src = me.src;
  } else {
    cfg.src = [{src:me.src}];
  }
  me.callParent();
}, afterRender:function() {
  var me = this;
  me.callParent();
  me.video = me.body.getById(me.id + '-video');
  el = me.video.dom;
  me.supported = el && el.tagName.toLowerCase() == 'video';
  if (me.supported) {
    me.video.on('error', me.onVideoError, me);
  }
}, getFallback:function() {
  return '\x3ch1 style\x3d"background-color:#ff4f4f;padding: 10px;"\x3e' + this.fallbackHTML + '\x3c/h1\x3e';
}, onVideoError:function() {
  var me = this;
  me.video.remove();
  me.supported = false;
  me.body.createChild(me.getFallback());
}, doDestroy:function() {
  var me = this;
  var video = me.video;
  if (me.supported && video) {
    var videoDom = video.dom;
    if (videoDom && videoDom.pause) {
      videoDom.pause();
    }
    video.remove();
    me.video = null;
  }
  me.callParent();
}});
Ext.define('Ext.ux.desktop.Wallpaper', {extend:'Ext.Component', alias:'widget.wallpaper', cls:'ux-wallpaper', html:'\x3cimg src\x3d"' + Ext.BLANK_IMAGE_URL + '"\x3e', stretch:false, wallpaper:null, stateful:true, stateId:'desk-wallpaper', afterRender:function() {
  var me = this;
  me.callParent();
  me.setWallpaper(me.wallpaper, me.stretch);
}, applyState:function() {
  var me = this, old = me.wallpaper;
  me.callParent(arguments);
  if (old != me.wallpaper) {
    me.setWallpaper(me.wallpaper);
  }
}, getState:function() {
  return this.wallpaper && {wallpaper:this.wallpaper};
}, setWallpaper:function(wallpaper, stretch) {
  var me = this, imgEl, bkgnd;
  me.stretch = stretch !== false;
  me.wallpaper = wallpaper;
  if (me.rendered) {
    imgEl = me.el.dom.firstChild;
    if (!wallpaper || wallpaper == Ext.BLANK_IMAGE_URL) {
      Ext.fly(imgEl).hide();
    } else {
      if (me.stretch) {
        imgEl.src = wallpaper;
        me.el.removeCls('ux-wallpaper-tiled');
        Ext.fly(imgEl).setStyle({width:'100%', height:'100%'}).show();
      } else {
        Ext.fly(imgEl).hide();
        bkgnd = 'url(' + wallpaper + ')';
        me.el.addCls('ux-wallpaper-tiled');
      }
    }
    me.el.setStyle({backgroundImage:bkgnd || ''});
    if (me.stateful) {
      me.saveState();
    }
  }
  return me;
}});
Ext.define('Ext.ux.event.RecorderManager', {extend:'Ext.panel.Panel', alias:'widget.eventrecordermanager', uses:['Ext.ux.event.Recorder', 'Ext.ux.event.Player'], layout:'fit', buttonAlign:'left', eventsToIgnore:{mousemove:1, mouseover:1, mouseout:1}, bodyBorder:false, playSpeed:1, initComponent:function() {
  var me = this;
  me.recorder = new Ext.ux.event.Recorder({attachTo:me.attachTo, listeners:{add:me.updateEvents, coalesce:me.updateEvents, buffer:200, scope:me}});
  me.recorder.eventsToRecord = Ext.apply({}, me.recorder.eventsToRecord);
  function speed(text, value) {
    return {text:text, speed:value, group:'speed', checked:value == me.playSpeed, handler:me.onPlaySpeed, scope:me};
  }
  me.tbar = [{text:'Record', xtype:'splitbutton', whenIdle:true, handler:me.onRecord, scope:me, menu:me.makeRecordButtonMenu()}, {text:'Play', xtype:'splitbutton', whenIdle:true, handler:me.onPlay, scope:me, menu:[speed('Qarter Speed (0.25x)', 0.25), speed('Half Speed (0.5x)', 0.5), speed('3/4 Speed (0.75x)', 0.75), '-', speed('Recorded Speed (1x)', 1), speed('Double Speed (2x)', 2), speed('Quad Speed (4x)', 4), '-', speed('Full Speed', 1000)]}, {text:'Clear', whenIdle:true, handler:me.onClear, scope:me}, 
  '-\x3e', {text:'Stop', whenActive:true, disabled:true, handler:me.onStop, scope:me}];
  var events = me.attachTo && me.attachTo.testEvents;
  me.items = [{xtype:'textarea', itemId:'eventView', fieldStyle:'font-family: monospace', selectOnFocus:true, emptyText:'Events go here!', value:events ? me.stringifyEvents(events) : '', scrollToBottom:function() {
    var inputEl = this.inputEl.dom;
    inputEl.scrollTop = inputEl.scrollHeight;
  }}];
  me.fbar = [{xtype:'tbtext', text:'Attached To: ' + (me.attachTo && me.attachTo.location.href)}];
  me.callParent();
}, makeRecordButtonMenu:function() {
  var ret = [], subs = {}, eventsToRec = this.recorder.eventsToRecord, ignoredEvents = this.eventsToIgnore;
  Ext.Object.each(eventsToRec, function(name, value) {
    var sub = subs[value.kind];
    if (!sub) {
      subs[value.kind] = sub = [];
      ret.push({text:value.kind, menu:sub});
    }
    sub.push({text:name, checked:true, handler:function(menuItem) {
      if (menuItem.checked) {
        eventsToRec[name] = value;
      } else {
        delete eventsToRec[name];
      }
    }});
    if (ignoredEvents[name]) {
      sub[sub.length - 1].checked = false;
      Ext.defer(function() {
        delete eventsToRec[name];
      }, 1);
    }
  });
  function less(lhs, rhs) {
    return lhs.text < rhs.text ? -1 : rhs.text < lhs.text ? 1 : 0;
  }
  ret.sort(less);
  Ext.Array.each(ret, function(sub) {
    sub.menu.sort(less);
  });
  return ret;
}, getEventView:function() {
  return this.down('#eventView');
}, onClear:function() {
  var view = this.getEventView();
  view.setValue('');
}, onPlay:function() {
  var me = this, view = me.getEventView(), events = view.getValue();
  if (events) {
    events = Ext.decode(events);
    if (events.length) {
      me.player = Ext.create('Ext.ux.event.Player', {attachTo:window.opener, eventQueue:events, speed:me.playSpeed, listeners:{stop:me.onPlayStop, scope:me}});
      me.player.start();
      me.syncBtnUI();
    }
  }
}, onPlayStop:function() {
  this.player = null;
  this.syncBtnUI();
}, onPlaySpeed:function(menuitem) {
  this.playSpeed = menuitem.speed;
}, onRecord:function() {
  this.recorder.start();
  this.syncBtnUI();
}, onStop:function() {
  var me = this;
  if (me.player) {
    me.player.stop();
    me.player = null;
  } else {
    me.recorder.stop();
  }
  me.syncBtnUI();
  me.updateEvents();
}, syncBtnUI:function() {
  var me = this, idle = !me.player && !me.recorder.active;
  Ext.each(me.query('[whenIdle]'), function(btn) {
    btn.setDisabled(!idle);
  });
  Ext.each(me.query('[whenActive]'), function(btn) {
    btn.setDisabled(idle);
  });
  var view = me.getEventView();
  view.setReadOnly(!idle);
}, stringifyEvents:function(events) {
  var line, lines = [];
  Ext.each(events, function(ev) {
    line = [];
    Ext.Object.each(ev, function(name, value) {
      if (line.length) {
        line.push(', ');
      } else {
        line.push('  { ');
      }
      line.push(name, ': ');
      line.push(Ext.encode(value));
    });
    line.push(' }');
    lines.push(line.join(''));
  });
  return '[\n' + lines.join(',\n') + '\n]';
}, updateEvents:function() {
  var me = this, text = me.stringifyEvents(me.recorder.getRecordedEvents()), view = me.getEventView();
  view.setValue(text);
  view.scrollToBottom();
}});
Ext.define('Ext.ux.form.MultiSelect', {extend:'Ext.form.FieldContainer', mixins:['Ext.util.StoreHolder', 'Ext.form.field.Field'], alternateClassName:'Ext.ux.Multiselect', alias:['widget.multiselectfield', 'widget.multiselect'], requires:['Ext.panel.Panel', 'Ext.view.BoundList', 'Ext.layout.container.Fit'], uses:['Ext.view.DragZone', 'Ext.view.DropZone'], layout:'anchor', ddReorder:false, appendOnly:false, displayField:'text', allowBlank:true, minSelections:0, maxSelections:Number.MAX_VALUE, blankText:'This field is required', 
minSelectionsText:'Minimum {0} item(s) required', maxSelectionsText:'Maximum {0} item(s) required', delimiter:',', dragText:'{0} Item{1}', ignoreSelectChange:0, pageSize:10, initComponent:function() {
  var me = this;
  me.items = me.setupItems();
  me.bindStore(me.store, true);
  me.callParent();
  me.initField();
}, setupItems:function() {
  var me = this;
  me.boundList = new Ext.view.BoundList(Ext.apply({anchor:'none 100%', border:1, multiSelect:true, store:me.store, displayField:me.displayField, disabled:me.disabled, tabIndex:0, navigationModel:{type:'default'}}, me.listConfig));
  me.boundList.getNavigationModel().addKeyBindings({pageUp:me.onKeyPageUp, pageDown:me.onKeyPageDown, scope:me});
  me.boundList.getSelectionModel().on('selectionchange', me.onSelectChange, me);
  me.boundList.pickerField = me;
  if (!me.title) {
    return me.boundList;
  }
  me.boundList.border = false;
  return {xtype:'panel', isAriaRegion:false, border:true, anchor:'none 100%', layout:'anchor', title:me.title, tbar:me.tbar, items:me.boundList};
}, onSelectChange:function(selModel, selections) {
  if (!this.ignoreSelectChange) {
    this.setValue(selections);
  }
}, getSelected:function() {
  return this.boundList.getSelectionModel().getSelection();
}, isEqual:function(v1, v2) {
  var fromArray = Ext.Array.from, i = 0, len;
  v1 = fromArray(v1);
  v2 = fromArray(v2);
  len = v1.length;
  if (len !== v2.length) {
    return false;
  }
  for (; i < len; i++) {
    if (v2[i] !== v1[i]) {
      return false;
    }
  }
  return true;
}, afterRender:function() {
  var me = this, boundList, scrollable, records, panel;
  me.callParent();
  boundList = me.boundList;
  scrollable = boundList && boundList.getScrollable();
  if (me.selectOnRender) {
    records = me.getRecordsForValue(me.value);
    if (records.length) {
      ++me.ignoreSelectChange;
      boundList.getSelectionModel().select(records);
      --me.ignoreSelectChange;
    }
    delete me.toSelect;
  }
  if (me.ddReorder && !me.dragGroup && !me.dropGroup) {
    me.dragGroup = me.dropGroup = 'MultiselectDD-' + Ext.id();
  }
  if (me.draggable || me.dragGroup) {
    me.dragZone = Ext.create('Ext.view.DragZone', {view:boundList, ddGroup:me.dragGroup, dragText:me.dragText, containerScroll:!!scrollable, scrollEl:scrollable && scrollable.getElement()});
  }
  if (me.droppable || me.dropGroup) {
    me.dropZone = Ext.create('Ext.view.DropZone', {view:boundList, ddGroup:me.dropGroup, handleNodeDrop:function(data, dropRecord, position) {
      var view = this.view, store = view.getStore(), records = data.records, index;
      data.view.store.remove(records);
      index = store.indexOf(dropRecord);
      if (position === 'after') {
        index++;
      }
      store.insert(index, records);
      view.getSelectionModel().select(records);
      me.fireEvent('drop', me, records);
    }});
  }
  panel = me.down('panel');
  if (panel && boundList) {
    boundList.ariaEl.dom.setAttribute('aria-labelledby', panel.header.id + '-title-textEl');
  }
}, onKeyPageUp:function(e) {
  var me = this, pageSize = me.pageSize, boundList = me.boundList, nm = boundList.getNavigationModel(), oldIdx, newIdx;
  oldIdx = nm.recordIndex;
  newIdx = oldIdx > pageSize ? oldIdx - pageSize : 0;
  nm.setPosition(newIdx, e);
}, onKeyPageDown:function(e) {
  var me = this, pageSize = me.pageSize, boundList = me.boundList, nm = boundList.getNavigationModel(), count, oldIdx, newIdx;
  count = boundList.getStore().getCount();
  oldIdx = nm.recordIndex;
  newIdx = oldIdx < count - pageSize ? oldIdx + pageSize : count - 1;
  nm.setPosition(newIdx, e);
}, isValid:function() {
  var me = this, disabled = me.disabled, validate = me.forceValidation || !disabled;
  return validate ? me.validateValue(me.value) : disabled;
}, validateValue:function(value) {
  var me = this, errors = me.getErrors(value), isValid = Ext.isEmpty(errors);
  if (!me.preventMark) {
    if (isValid) {
      me.clearInvalid();
    } else {
      me.markInvalid(errors);
    }
  }
  return isValid;
}, markInvalid:function(errors) {
  var me = this, oldMsg = me.getActiveError();
  me.setActiveErrors(Ext.Array.from(errors));
  if (oldMsg !== me.getActiveError()) {
    me.updateLayout();
  }
}, clearInvalid:function() {
  var me = this, hadError = me.hasActiveError();
  me.unsetActiveError();
  if (hadError) {
    me.updateLayout();
  }
}, getSubmitData:function() {
  var me = this, data = null, val;
  if (!me.disabled && me.submitValue && !me.isFileUpload()) {
    val = me.getSubmitValue();
    if (val !== null) {
      data = {};
      data[me.getName()] = val;
    }
  }
  return data;
}, getSubmitValue:function() {
  var me = this, delimiter = me.delimiter, val = me.getValue();
  return Ext.isString(delimiter) ? val.join(delimiter) : val;
}, getValue:function() {
  return this.value || [];
}, getRecordsForValue:function(value) {
  var me = this, records = [], all = me.store.getRange(), valueField = me.valueField, i = 0, allLen = all.length, rec, j, valueLen;
  for (valueLen = value.length; i < valueLen; ++i) {
    for (j = 0; j < allLen; ++j) {
      rec = all[j];
      if (rec.get(valueField) == value[i]) {
        records.push(rec);
      }
    }
  }
  return records;
}, setupValue:function(value) {
  var delimiter = this.delimiter, valueField = this.valueField, i = 0, out, len, item;
  if (Ext.isDefined(value)) {
    if (delimiter && Ext.isString(value)) {
      value = value.split(delimiter);
    } else {
      if (!Ext.isArray(value)) {
        value = [value];
      }
    }
    for (len = value.length; i < len; ++i) {
      item = value[i];
      if (item && item.isModel) {
        value[i] = item.get(valueField);
      }
    }
    out = Ext.Array.unique(value);
  } else {
    out = [];
  }
  return out;
}, setValue:function(value) {
  var me = this, selModel = me.boundList.getSelectionModel(), store = me.store;
  if (!store.getCount()) {
    store.on({load:Ext.Function.bind(me.setValue, me, [value]), single:true});
    return;
  }
  value = me.setupValue(value);
  me.mixins.field.setValue.call(me, value);
  if (me.rendered) {
    ++me.ignoreSelectChange;
    selModel.deselectAll();
    if (value.length) {
      selModel.select(me.getRecordsForValue(value));
    }
    --me.ignoreSelectChange;
  } else {
    me.selectOnRender = true;
  }
}, clearValue:function() {
  this.setValue([]);
}, onEnable:function() {
  var list = this.boundList;
  this.callParent();
  if (list) {
    list.enable();
  }
}, onDisable:function() {
  var list = this.boundList;
  this.callParent();
  if (list) {
    list.disable();
  }
}, getErrors:function(value) {
  var me = this, format = Ext.String.format, errors = [], numSelected;
  value = Ext.Array.from(value || me.getValue());
  numSelected = value.length;
  if (!me.allowBlank && numSelected < 1) {
    errors.push(me.blankText);
  }
  if (numSelected < me.minSelections) {
    errors.push(format(me.minSelectionsText, me.minSelections));
  }
  if (numSelected > me.maxSelections) {
    errors.push(format(me.maxSelectionsText, me.maxSelections));
  }
  return errors;
}, doDestroy:function() {
  var me = this;
  me.bindStore(null);
  Ext.destroy(me.dragZone, me.dropZone, me.keyNav);
  me.callParent();
}, onBindStore:function(store) {
  var me = this, boundList = this.boundList;
  if (store.autoCreated) {
    me.resolveDisplayField();
  }
  if (!Ext.isDefined(me.valueField)) {
    me.valueField = me.displayField;
  }
  if (boundList) {
    boundList.bindStore(store);
  }
}, resolveDisplayField:function() {
  var me = this, boundList = me.boundList, store = me.getStore();
  me.valueField = me.displayField = 'field1';
  if (!store.expanded) {
    me.displayField = 'field2';
  }
  if (boundList) {
    boundList.setDisplayField(me.displayField);
  }
}});
Ext.define('Ext.ux.form.ItemSelector', {extend:'Ext.ux.form.MultiSelect', alias:['widget.itemselectorfield', 'widget.itemselector'], alternateClassName:['Ext.ux.ItemSelector'], requires:['Ext.button.Button', 'Ext.ux.form.MultiSelect'], hideNavIcons:false, buttons:['top', 'up', 'add', 'remove', 'down', 'bottom'], buttonsText:{top:'Move to Top', up:'Move Up', add:'Add to Selected', remove:'Remove from Selected', down:'Move Down', bottom:'Move to Bottom'}, layout:{type:'hbox', align:'stretch'}, ariaRole:'group', 
initComponent:function() {
  var me = this;
  me.ddGroup = me.id + '-dd';
  me.ariaRenderAttributes = me.ariaRenderAttributes || {};
  me.ariaRenderAttributes['aria-labelledby'] = me.id + '-labelEl';
  me.callParent();
  me.bindStore(me.store);
}, createList:function(title) {
  var me = this;
  return Ext.create('Ext.ux.form.MultiSelect', {submitValue:false, getSubmitData:function() {
    return null;
  }, getModelData:function() {
    return null;
  }, flex:1, dragGroup:me.ddGroup, dropGroup:me.ddGroup, title:title, store:{model:me.store.model, data:[]}, displayField:me.displayField, valueField:me.valueField, disabled:me.disabled, listeners:{boundList:{scope:me, itemdblclick:me.onItemDblClick, drop:me.syncValue}}});
}, setupItems:function() {
  var me = this;
  me.fromField = me.createList(me.fromTitle);
  me.toField = me.createList(me.toTitle);
  return [me.fromField, {xtype:'toolbar', margin:'0 4', padding:0, layout:{type:'vbox', pack:'center'}, items:me.createButtons()}, me.toField];
}, createButtons:function() {
  var me = this, buttons = [];
  if (!me.hideNavIcons) {
    Ext.Array.forEach(me.buttons, function(name) {
      buttons.push({xtype:'button', ui:'default', tooltip:me.buttonsText[name], ariaLabel:me.buttonsText[name], handler:me['on' + Ext.String.capitalize(name) + 'BtnClick'], cls:Ext.baseCSSPrefix + 'form-itemselector-btn', iconCls:Ext.baseCSSPrefix + 'form-itemselector-' + name, navBtn:true, scope:me, margin:'4 0 0 0'});
    });
  }
  return buttons;
}, getSelections:function(list) {
  var store = list.getStore();
  return Ext.Array.sort(list.getSelectionModel().getSelection(), function(a, b) {
    a = store.indexOf(a);
    b = store.indexOf(b);
    if (a < b) {
      return -1;
    } else {
      if (a > b) {
        return 1;
      }
    }
    return 0;
  });
}, onTopBtnClick:function() {
  var list = this.toField.boundList, store = list.getStore(), selected = this.getSelections(list);
  store.suspendEvents();
  store.remove(selected, true);
  store.insert(0, selected);
  store.resumeEvents();
  list.refresh();
  this.syncValue();
  list.getSelectionModel().select(selected);
}, onBottomBtnClick:function() {
  var list = this.toField.boundList, store = list.getStore(), selected = this.getSelections(list);
  store.suspendEvents();
  store.remove(selected, true);
  store.add(selected);
  store.resumeEvents();
  list.refresh();
  this.syncValue();
  list.getSelectionModel().select(selected);
}, onUpBtnClick:function() {
  var list = this.toField.boundList, store = list.getStore(), selected = this.getSelections(list), rec, i = 0, len = selected.length, index = 0;
  store.suspendEvents();
  for (; i < len; ++i, index++) {
    rec = selected[i];
    index = Math.max(index, store.indexOf(rec) - 1);
    store.remove(rec, true);
    store.insert(index, rec);
  }
  store.resumeEvents();
  list.refresh();
  this.syncValue();
  list.getSelectionModel().select(selected);
}, onDownBtnClick:function() {
  var list = this.toField.boundList, store = list.getStore(), selected = this.getSelections(list), rec, i = selected.length - 1, index = store.getCount() - 1;
  store.suspendEvents();
  for (; i > -1; --i, index--) {
    rec = selected[i];
    index = Math.min(index, store.indexOf(rec) + 1);
    store.remove(rec, true);
    store.insert(index, rec);
  }
  store.resumeEvents();
  list.refresh();
  this.syncValue();
  list.getSelectionModel().select(selected);
}, onAddBtnClick:function() {
  var me = this, selected = me.getSelections(me.fromField.boundList);
  me.moveRec(true, selected);
  me.toField.boundList.getSelectionModel().select(selected);
}, onRemoveBtnClick:function() {
  var me = this, selected = me.getSelections(me.toField.boundList);
  me.moveRec(false, selected);
  me.fromField.boundList.getSelectionModel().select(selected);
}, moveRec:function(add, recs) {
  var me = this, fromField = me.fromField, toField = me.toField, fromStore = add ? fromField.store : toField.store, toStore = add ? toField.store : fromField.store;
  fromStore.suspendEvents();
  toStore.suspendEvents();
  fromStore.remove(recs);
  toStore.add(recs);
  fromStore.resumeEvents();
  toStore.resumeEvents();
  if (fromField.boundList.containsFocus) {
    fromField.boundList.focus();
  }
  fromField.boundList.refresh();
  toField.boundList.refresh();
  me.syncValue();
}, syncValue:function() {
  var me = this;
  me.mixins.field.setValue.call(me, me.setupValue(me.toField.store.getRange()));
}, onItemDblClick:function(view, rec) {
  this.moveRec(view === this.fromField.boundList, rec);
}, setValue:function(value) {
  var me = this, fromField = me.fromField, toField = me.toField, fromStore = fromField.store, toStore = toField.store, selected;
  if (!me.fromStorePopulated) {
    me.fromField.store.on({load:Ext.Function.bind(me.setValue, me, [value]), single:true});
    return;
  }
  value = me.setupValue(value);
  me.mixins.field.setValue.call(me, value);
  selected = me.getRecordsForValue(value);
  fromStore.suspendEvents();
  toStore.suspendEvents();
  fromStore.removeAll();
  toStore.removeAll();
  me.populateFromStore(me.store);
  Ext.Array.forEach(selected, function(rec) {
    if (fromStore.indexOf(rec) > -1) {
      fromStore.remove(rec);
    }
    toStore.add(rec);
  });
  fromStore.resumeEvents();
  toStore.resumeEvents();
  Ext.suspendLayouts();
  fromField.boundList.refresh();
  toField.boundList.refresh();
  Ext.resumeLayouts(true);
}, onBindStore:function(store, initial) {
  var me = this, fromField = me.fromField, toField = me.toField;
  if (fromField) {
    fromField.store.removeAll();
    toField.store.removeAll();
    if (store.autoCreated) {
      fromField.resolveDisplayField();
      toField.resolveDisplayField();
      me.resolveDisplayField();
    }
    if (!Ext.isDefined(me.valueField)) {
      me.valueField = me.displayField;
    }
    if (store.getCount()) {
      me.populateFromStore(store);
    } else {
      me.store.on('load', me.populateFromStore, me);
    }
  }
}, populateFromStore:function(store) {
  var fromStore = this.fromField.store;
  this.fromStorePopulated = true;
  fromStore.add(store.getRange());
  fromStore.fireEvent('load', fromStore);
}, onEnable:function() {
  var me = this;
  me.callParent();
  me.fromField.enable();
  me.toField.enable();
  Ext.Array.forEach(me.query('[navBtn]'), function(btn) {
    btn.enable();
  });
}, onDisable:function() {
  var me = this;
  me.callParent();
  me.fromField.disable();
  me.toField.disable();
  Ext.Array.forEach(me.query('[navBtn]'), function(btn) {
    btn.disable();
  });
}, doDestroy:function() {
  this.bindStore(null);
  this.callParent();
}});
Ext.define('Ext.ux.form.SearchField', {extend:'Ext.form.field.Text', alias:'widget.searchfield', triggers:{clear:{weight:0, cls:Ext.baseCSSPrefix + 'form-clear-trigger', hidden:true, handler:'onClearClick', scope:'this'}, search:{weight:1, cls:Ext.baseCSSPrefix + 'form-search-trigger', handler:'onSearchClick', scope:'this'}}, hasSearch:false, paramName:'query', initComponent:function() {
  var me = this, store = me.store, proxy;
  me.callParent(arguments);
  me.on('specialkey', function(f, e) {
    if (e.getKey() == e.ENTER) {
      me.onSearchClick();
    }
  });
  if (!store || !store.isStore) {
    store = me.store = Ext.data.StoreManager.lookup(store);
  }
  store.setRemoteFilter(true);
  proxy = me.store.getProxy();
  proxy.setFilterParam(me.paramName);
  proxy.encodeFilters = function(filters) {
    return filters[0].getValue();
  };
}, onClearClick:function() {
  var me = this, activeFilter = me.activeFilter;
  if (activeFilter) {
    me.setValue('');
    me.store.getFilters().remove(activeFilter);
    me.activeFilter = null;
    me.getTrigger('clear').hide();
    me.updateLayout();
  }
}, onSearchClick:function() {
  var me = this, value = me.getValue();
  if (value.length > 0) {
    me.activeFilter = new Ext.util.Filter({property:me.paramName, value:value});
    me.store.getFilters().add(me.activeFilter);
    me.getTrigger('clear').show();
    me.updateLayout();
  }
}});
Ext.define('Ext.ux.grid.SubTable', {extend:'Ext.grid.plugin.RowExpander', alias:'plugin.subtable', rowBodyTpl:['\x3ctable class\x3d"' + Ext.baseCSSPrefix + 'grid-subtable"\x3e', '{%', 'this.owner.renderTable(out, values);', '%}', '\x3c/table\x3e'], init:function(grid) {
  var me = this, columns = me.columns, len, i, columnCfg;
  me.callParent(arguments);
  me.columns = [];
  if (columns) {
    for (i = 0, len = columns.length; i < len; ++i) {
      columnCfg = Ext.apply({preventRegister:true}, columns[i]);
      columnCfg.xtype = columnCfg.xtype || 'gridcolumn';
      me.columns.push(Ext.widget(columnCfg));
    }
  }
}, destroy:function() {
  var columns = this.columns, len, i;
  if (columns) {
    for (i = 0, len = columns.length; i < len; ++i) {
      columns[i].destroy();
    }
  }
  this.columns = null;
  this.callParent();
}, getRowBodyFeatureData:function(record, idx, rowValues) {
  this.callParent(arguments);
  rowValues.rowBodyCls += ' ' + Ext.baseCSSPrefix + 'grid-subtable-row';
}, renderTable:function(out, rowValues) {
  var me = this, columns = me.columns, numColumns = columns.length, associatedRecords = me.getAssociatedRecords(rowValues.record), recCount = associatedRecords.length, rec, column, i, j, value;
  out.push('\x3cthead\x3e');
  for (j = 0; j < numColumns; j++) {
    out.push('\x3cth class\x3d"' + Ext.baseCSSPrefix + 'grid-subtable-header"\x3e', columns[j].text, '\x3c/th\x3e');
  }
  out.push('\x3c/thead\x3e\x3ctbody\x3e');
  for (i = 0; i < recCount; i++) {
    rec = associatedRecords[i];
    out.push('\x3ctr\x3e');
    for (j = 0; j < numColumns; j++) {
      column = columns[j];
      value = rec.get(column.dataIndex);
      if (column.renderer && column.renderer.call) {
        value = column.renderer.call(column.scope || me, value, {}, rec);
      }
      out.push('\x3ctd class\x3d"' + Ext.baseCSSPrefix + 'grid-subtable-cell"');
      if (column.width != null) {
        out.push(' style\x3d"width:' + column.width + 'px"');
      }
      out.push('\x3e\x3cdiv class\x3d"' + Ext.baseCSSPrefix + 'grid-cell-inner"\x3e', value, '\x3c/div\x3e\x3c/td\x3e');
    }
    out.push('\x3c/tr\x3e');
  }
  out.push('\x3c/tbody\x3e');
}, getRowBodyContentsFn:function(rowBodyTpl) {
  var me = this;
  return function(rowValues) {
    rowBodyTpl.owner = me;
    return rowBodyTpl.applyTemplate(rowValues);
  };
}, getAssociatedRecords:function(record) {
  return record[this.association]().getRange();
}});
Ext.define('Ext.ux.grid.TransformGrid', {extend:'Ext.grid.Panel', constructor:function(table, config) {
  config = Ext.apply({}, config);
  table = this.table = Ext.get(table);
  var configFields = config.fields || [], configColumns = config.columns || [], fields = [], cols = [], headers = table.query('thead th'), i = 0, len = headers.length, data = table.dom, width, height, store, col, text, name;
  for (; i < len; ++i) {
    col = headers[i];
    text = col.innerHTML;
    name = 'tcol-' + i;
    fields.push(Ext.applyIf(configFields[i] || {}, {name:name, mapping:'td:nth(' + (i + 1) + ')/@innerHTML'}));
    cols.push(Ext.applyIf(configColumns[i] || {}, {text:text, dataIndex:name, width:col.offsetWidth, tooltip:col.title, sortable:true}));
  }
  if (config.width) {
    width = config.width;
  } else {
    width = table.getWidth() + 1;
  }
  if (config.height) {
    height = config.height;
  }
  Ext.applyIf(config, {store:{data:data, fields:fields, proxy:{type:'memory', reader:{record:'tbody tr', type:'xml'}}}, columns:cols, width:width, height:height});
  this.callParent([config]);
  if (config.remove !== false) {
    data.parentNode.removeChild(data);
  }
}, doDestroy:function() {
  this.table.remove();
  this.tabl = null;
  this.callParent();
}});
Ext.define('Ext.ux.grid.plugin.AutoSelector', {extend:'Ext.plugin.Abstract', alias:'plugin.gridautoselector', config:{store:null}, init:function(grid) {
  if (!grid.isXType('tablepanel')) {
    Ext.raise('The gridautoselector plugin is designed only for grids and trees');
  }
  var me = this;
  me.grid = grid;
  me.watchGrid();
  grid.on({reconfigure:me.watchGrid, scope:me});
}, destroy:function() {
  this.setStore(null);
  this.grid = null;
  this.callParent();
}, ensureSelection:function() {
  var grid = this.grid, store = grid.getStore(), selection;
  if (store.getCount()) {
    selection = grid.getSelection();
    if (!selection || !selection.length) {
      grid.getSelectionModel().select(0);
    }
  }
}, watchGrid:function() {
  this.setStore(this.grid.getStore());
  this.ensureSelection();
}, updateStore:function(store) {
  var me = this;
  Ext.destroy(me.storeListeners);
  me.storeListeners = store && store.on({add:me.ensureSelection, remove:me.ensureSelection, destroyable:true, scope:me});
}});
Ext.define('Ext.ux.layout.ResponsiveColumn', {extend:'Ext.layout.container.Auto', alias:'layout.responsivecolumn', states:{small:1000, large:0}, _responsiveCls:Ext.baseCSSPrefix + 'responsivecolumn', initLayout:function() {
  this.innerCtCls += ' ' + this._responsiveCls;
  this.callParent();
}, beginLayout:function(ownerContext) {
  var me = this, viewportWidth = Ext.Element.getViewportWidth(), states = me.states, activeThreshold = Infinity, innerCt = me.innerCt, currentState = me._currentState, name, threshold, newState;
  for (name in states) {
    threshold = states[name] || Infinity;
    if (viewportWidth <= threshold && threshold <= activeThreshold) {
      activeThreshold = threshold;
      newState = name;
    }
  }
  if (newState !== currentState) {
    innerCt.replaceCls(currentState, newState, me._responsiveCls);
    me._currentState = newState;
  }
  me.callParent(arguments);
}, onAdd:function(item) {
  this.callParent([item]);
  var responsiveCls = item.responsiveCls;
  if (responsiveCls) {
    item.addCls(responsiveCls);
  }
}}, function(Responsive) {
  if (Ext.isIE8) {
    Responsive.override({responsiveSizePolicy:{readsWidth:0, readsHeight:0, setsWidth:1, setsHeight:0}, setsItemSize:true, calculateItems:function(ownerContext, containerSize) {
      var me = this, targetContext = ownerContext.targetContext, items = ownerContext.childItems, len = items.length, gotWidth = containerSize.gotWidth, contentWidth = containerSize.width, blocked, availableWidth, i, itemContext, itemMarginWidth, itemWidth;
      if (gotWidth === false) {
        targetContext.domBlock(me, 'width');
        return false;
      }
      if (!gotWidth) {
        return true;
      }
      for (i = 0; i < len; ++i) {
        itemContext = items[i];
        itemWidth = parseInt(itemContext.el.getStyle('background-position-x'), 10);
        itemMarginWidth = parseInt(itemContext.el.getStyle('background-position-y'), 10);
        itemContext.setWidth(itemWidth / 100 * (contentWidth - itemMarginWidth) - itemMarginWidth);
      }
      ownerContext.setContentWidth(contentWidth + ownerContext.paddingContext.getPaddingInfo().width);
      return true;
    }, getItemSizePolicy:function() {
      return this.responsiveSizePolicy;
    }});
  }
});
Ext.define('Ext.ux.statusbar.ValidationStatus', {extend:'Ext.Component', alias:'plugin.validationstatus', requires:['Ext.util.MixedCollection'], errorIconCls:'x-status-error', errorListCls:'x-status-error-list', validIconCls:'x-status-valid', showText:'The form has errors (click for details...)', hideText:'Click again to hide the error list', submitText:'Saving...', init:function(sb) {
  var me = this;
  me.statusBar = sb;
  sb.on({single:true, scope:me, render:me.onStatusbarRender});
  sb.on({click:{element:'el', fn:me.onStatusClick, scope:me, buffer:200}});
}, onStatusbarRender:function(sb) {
  var me = this, startMonitor = function() {
    me.monitor = true;
  };
  me.monitor = true;
  me.errors = Ext.create('Ext.util.MixedCollection');
  me.listAlign = sb.statusAlign === 'right' ? 'br-tr?' : 'bl-tl?';
  if (me.form) {
    me.formPanel = Ext.getCmp(me.form) || me.statusBar.lookupController().lookupReference(me.form);
    me.basicForm = me.formPanel.getForm();
    me.startMonitoring();
    me.basicForm.on({beforeaction:function(f, action) {
      if (action.type === 'submit') {
        me.monitor = false;
      }
    }});
    me.formPanel.on({beforedestroy:me.destroy, scope:me});
    me.basicForm.on('actioncomplete', startMonitor);
    me.basicForm.on('actionfailed', startMonitor);
  }
}, startMonitoring:function() {
  this.basicForm.getFields().each(function(f) {
    f.on('validitychange', this.onFieldValidation, this);
  }, this);
}, stopMonitoring:function() {
  var form = this.basicForm;
  if (!form.destroyed) {
    form.getFields().each(function(f) {
      f.un('validitychange', this.onFieldValidation, this);
    }, this);
  }
}, doDestroy:function() {
  Ext.destroy(this.msgEl);
  this.stopMonitoring();
  this.statusBar.statusEl.un('click', this.onStatusClick, this);
  this.callParent();
}, onFieldValidation:function(f, isValid) {
  var me = this, msg;
  if (!me.monitor) {
    return false;
  }
  msg = f.getErrors()[0];
  if (msg) {
    me.errors.add(f.id, {field:f, msg:msg});
  } else {
    me.errors.removeAtKey(f.id);
  }
  this.updateErrorList();
  if (me.errors.getCount() > 0) {
    if (me.statusBar.getText() !== me.showText) {
      me.statusBar.setStatus({text:me.showText, iconCls:me.errorIconCls});
    }
  } else {
    me.statusBar.clearStatus().setIcon(me.validIconCls);
  }
}, updateErrorList:function() {
  var me = this, msg, msgEl = me.getMsgEl();
  if (me.errors.getCount() > 0) {
    msg = ['\x3cul\x3e'];
    this.errors.each(function(err) {
      msg.push('\x3cli id\x3d"x-err-', err.field.id, '"\x3e\x3ca href\x3d"#"\x3e', err.msg, '\x3c/a\x3e\x3c/li\x3e');
    });
    msg.push('\x3c/ul\x3e');
    msgEl.update(msg.join(''));
  } else {
    msgEl.update('');
  }
  msgEl.setSize('auto', 'auto');
}, getMsgEl:function() {
  var me = this, msgEl = me.msgEl, t;
  if (!msgEl) {
    msgEl = me.msgEl = Ext.DomHelper.append(Ext.getBody(), {cls:me.errorListCls}, true);
    msgEl.hide();
    msgEl.on('click', function(e) {
      t = e.getTarget('li', 10, true);
      if (t) {
        Ext.getCmp(t.id.split('x-err-')[1]).focus();
        me.hideErrors();
      }
    }, null, {stopEvent:true});
  }
  return msgEl;
}, showErrors:function() {
  var me = this;
  me.updateErrorList();
  me.getMsgEl().alignTo(me.statusBar.getEl(), me.listAlign).slideIn('b', {duration:300, easing:'easeOut'});
  me.statusBar.setText(me.hideText);
  me.formPanel.body.on('click', me.hideErrors, me, {single:true});
}, hideErrors:function() {
  var el = this.getMsgEl();
  if (el.isVisible()) {
    el.slideOut('b', {duration:300, easing:'easeIn'});
    this.statusBar.setText(this.showText);
  }
  this.formPanel.body.un('click', this.hideErrors, this);
}, onStatusClick:function() {
  if (this.getMsgEl().isVisible()) {
    this.hideErrors();
  } else {
    if (this.errors.getCount() > 0) {
      this.showErrors();
    }
  }
}});
