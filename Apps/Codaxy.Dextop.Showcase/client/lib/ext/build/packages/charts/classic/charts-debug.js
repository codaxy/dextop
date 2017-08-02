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
Ext.define('Ext.draw.ContainerBase', {extend:'Ext.panel.Panel', requires:['Ext.window.Window'], previewTitleText:'Chart Preview', previewAltText:'Chart preview', layout:'container', addElementListener:function() {
  var me = this, args = arguments;
  if (me.rendered) {
    me.el.on.apply(me.el, args);
  } else {
    me.on('render', function() {
      me.el.on.apply(me.el, args);
    });
  }
}, removeElementListener:function() {
  var me = this, args = arguments;
  if (me.rendered) {
    me.el.un.apply(me.el, args);
  }
}, afterRender:function() {
  this.callParent(arguments);
  this.initAnimator();
}, getItems:function() {
  var me = this, items = me.items;
  if (!items || !items.isMixedCollection) {
    me.initItems();
  }
  return me.items;
}, onRender:function() {
  this.callParent(arguments);
  this.element = this.el;
  this.bodyElement = this.body;
}, setItems:function(items) {
  this.items = items;
  return items;
}, setSurfaceSize:function(width, height) {
  this.resizeHandler({width:width, height:height});
  this.renderFrame();
}, onResize:function(width, height, oldWidth, oldHeight) {
  this.handleResize({width:width, height:height}, !this.size);
}, preview:function(image) {
  var items;
  if (Ext.isIE8) {
    return false;
  }
  image = image || this.getImage();
  if (image.type === 'svg-markup') {
    items = {xtype:'container', html:image.data};
  } else {
    items = {xtype:'image', mode:'img', cls:Ext.baseCSSPrefix + 'chart-image', alt:this.previewAltText, src:image.data, listeners:{afterrender:function() {
      var me = this, img = me.imgEl.dom, ratio = image.type === 'svg' ? 1 : window['devicePixelRatio'] || 1, size;
      if (!img.naturalWidth || !img.naturalHeight) {
        img.onload = function() {
          var width = img.naturalWidth, height = img.naturalHeight;
          me.setWidth(Math.floor(width / ratio));
          me.setHeight(Math.floor(height / ratio));
        };
      } else {
        size = me.getSize();
        me.setWidth(Math.floor(size.width / ratio));
        me.setHeight(Math.floor(size.height / ratio));
      }
    }}};
  }
  new Ext.window.Window({title:this.previewTitleText, closable:true, renderTo:Ext.getBody(), autoShow:true, maximizeable:true, maximized:true, border:true, layout:{type:'hbox', pack:'center', align:'middle'}, items:{xtype:'container', items:items}});
}, privates:{getTargetEl:function() {
  return this.bodyElement;
}, reattachToBody:function() {
  var me = this;
  if (me.pendingDetachSize) {
    me.handleResize();
  }
  me.pendingDetachSize = false;
  me.callParent();
}}});
Ext.define('Ext.draw.SurfaceBase', {extend:'Ext.Widget', getOwnerBody:function() {
  return this.ownerCt.body;
}});
Ext.define('Ext.draw.sprite.AnimationParser', function() {
  function compute(from, to, delta) {
    return from + (to - from) * delta;
  }
  return {singleton:true, attributeRe:/^url\(#([a-zA-Z\-]+)\)$/, requires:['Ext.draw.Color'], color:{parseInitial:function(color1, color2) {
    if (Ext.isString(color1)) {
      color1 = Ext.util.Color.create(color1);
    }
    if (Ext.isString(color2)) {
      color2 = Ext.util.Color.create(color2);
    }
    if (color1 && color1.isColor && (color2 && color2.isColor)) {
      return [[color1.r, color1.g, color1.b, color1.a], [color2.r, color2.g, color2.b, color2.a]];
    } else {
      return [color1 || color2, color2 || color1];
    }
  }, compute:function(from, to, delta) {
    if (!Ext.isArray(from) || !Ext.isArray(to)) {
      return to || from;
    } else {
      return [compute(from[0], to[0], delta), compute(from[1], to[1], delta), compute(from[2], to[2], delta), compute(from[3], to[3], delta)];
    }
  }, serve:function(array) {
    var color = Ext.util.Color.fly(array[0], array[1], array[2], array[3]);
    return color.toString();
  }}, number:{parse:function(n) {
    return n === null ? null : +n;
  }, compute:function(from, to, delta) {
    if (!Ext.isNumber(from) || !Ext.isNumber(to)) {
      return to || from;
    } else {
      return compute(from, to, delta);
    }
  }}, angle:{parseInitial:function(from, to) {
    if (to - from > Math.PI) {
      to -= Math.PI * 2;
    } else {
      if (to - from < -Math.PI) {
        to += Math.PI * 2;
      }
    }
    return [from, to];
  }, compute:function(from, to, delta) {
    if (!Ext.isNumber(from) || !Ext.isNumber(to)) {
      return to || from;
    } else {
      return compute(from, to, delta);
    }
  }}, path:{parseInitial:function(from, to) {
    var fromStripes = from.toStripes(), toStripes = to.toStripes(), i, j, fromLength = fromStripes.length, toLength = toStripes.length, fromStripe, toStripe, length, lastStripe = toStripes[toLength - 1], endPoint = [lastStripe[lastStripe.length - 2], lastStripe[lastStripe.length - 1]];
    for (i = fromLength; i < toLength; i++) {
      fromStripes.push(fromStripes[fromLength - 1].slice(0));
    }
    for (i = toLength; i < fromLength; i++) {
      toStripes.push(endPoint.slice(0));
    }
    length = fromStripes.length;
    toStripes.path = to;
    toStripes.temp = new Ext.draw.Path;
    for (i = 0; i < length; i++) {
      fromStripe = fromStripes[i];
      toStripe = toStripes[i];
      fromLength = fromStripe.length;
      toLength = toStripe.length;
      toStripes.temp.commands.push('M');
      for (j = toLength; j < fromLength; j += 6) {
        toStripe.push(endPoint[0], endPoint[1], endPoint[0], endPoint[1], endPoint[0], endPoint[1]);
      }
      lastStripe = toStripes[toStripes.length - 1];
      endPoint = [lastStripe[lastStripe.length - 2], lastStripe[lastStripe.length - 1]];
      for (j = fromLength; j < toLength; j += 6) {
        fromStripe.push(endPoint[0], endPoint[1], endPoint[0], endPoint[1], endPoint[0], endPoint[1]);
      }
      for (i = 0; i < toStripe.length; i++) {
        toStripe[i] -= fromStripe[i];
      }
      for (i = 2; i < toStripe.length; i += 6) {
        toStripes.temp.commands.push('C');
      }
    }
    return [fromStripes, toStripes];
  }, compute:function(fromStripes, toStripes, delta) {
    if (delta >= 1) {
      return toStripes.path;
    }
    var i = 0, ln = fromStripes.length, j = 0, ln2, from, to, temp = toStripes.temp.params, pos = 0;
    for (; i < ln; i++) {
      from = fromStripes[i];
      to = toStripes[i];
      ln2 = from.length;
      for (j = 0; j < ln2; j++) {
        temp[pos++] = to[j] * delta + from[j];
      }
    }
    return toStripes.temp;
  }}, data:{compute:function(from, to, delta, target) {
    var iMaxFrom = from.length - 1, iMaxTo = to.length - 1, iMax = Math.max(iMaxFrom, iMaxTo), i, start, end;
    if (!target || target === from) {
      target = [];
    }
    target.length = iMax + 1;
    for (i = 0; i <= iMax; i++) {
      start = from[Math.min(i, iMaxFrom)];
      end = to[Math.min(i, iMaxTo)];
      if (Ext.isNumber(start)) {
        if (!Ext.isNumber(end)) {
          end = 0;
        }
        target[i] = start + (end - start) * delta;
      } else {
        target[i] = end;
      }
    }
    return target;
  }}, text:{compute:function(from, to, delta) {
    return from.substr(0, Math.round(from.length * (1 - delta))) + to.substr(Math.round(to.length * (1 - delta)));
  }}, limited:'number', limited01:'number'};
});
(function() {
  if (!Ext.global.Float32Array) {
    var Float32Array = function(array) {
      if (typeof array === 'number') {
        this.length = array;
      } else {
        if ('length' in array) {
          this.length = array.length;
          for (var i = 0, len = array.length; i < len; i++) {
            this[i] = +array[i];
          }
        }
      }
    };
    Float32Array.prototype = [];
    Ext.global.Float32Array = Float32Array;
  }
})();
Ext.define('Ext.draw.Draw', {singleton:true, radian:Math.PI / 180, pi2:Math.PI * 2, reflectFn:function(a) {
  return a;
}, rad:function(degrees) {
  return degrees % 360 * this.radian;
}, degrees:function(radian) {
  return radian / this.radian % 360;
}, isBBoxIntersect:function(bbox1, bbox2, padding) {
  padding = padding || 0;
  return Math.max(bbox1.x, bbox2.x) - padding > Math.min(bbox1.x + bbox1.width, bbox2.x + bbox2.width) || Math.max(bbox1.y, bbox2.y) - padding > Math.min(bbox1.y + bbox1.height, bbox2.y + bbox2.height);
}, isPointInBBox:function(x, y, bbox) {
  return !!bbox && x >= bbox.x && x <= bbox.x + bbox.width && y >= bbox.y && y <= bbox.y + bbox.height;
}, naturalSpline:function(points) {
  var i, j, ln = points.length, nd, d, y, ny, r = 0, zs = new Float32Array(points.length), result = new Float32Array(points.length * 3 - 2);
  zs[0] = 0;
  zs[ln - 1] = 0;
  for (i = 1; i < ln - 1; i++) {
    zs[i] = points[i + 1] + points[i - 1] - 2 * points[i] - zs[i - 1];
    r = 1 / (4 - r);
    zs[i] *= r;
  }
  for (i = ln - 2; i > 0; i--) {
    r = 3.732050807568877 + 48.248711305964385 / (-13.928203230275537 + Math.pow(0.07179676972449123, i));
    zs[i] -= zs[i + 1] * r;
  }
  ny = points[0];
  nd = ny - zs[0];
  for (i = 0, j = 0; i < ln - 1; j += 3) {
    y = ny;
    d = nd;
    i++;
    ny = points[i];
    nd = ny - zs[i];
    result[j] = y;
    result[j + 1] = (nd + 2 * d) / 3;
    result[j + 2] = (nd * 2 + d) / 3;
  }
  result[j] = ny;
  return result;
}, spline:function(points) {
  return this.naturalSpline(points);
}, cardinalToBezier:function(P1, P2, P3, P4, tension) {
  return [P2, P2 + (P3 - P1) / 6 * tension, P3 - (P4 - P2) / 6 * tension, P3];
}, cardinalSpline:function(P, tension) {
  var n = P.length, result = new Float32Array(n * 3 - 2), i, bezier;
  if (tension === undefined) {
    tension = 0.5;
  }
  bezier = this.cardinalToBezier(P[0], P[0], P[1], P[2], tension);
  result[0] = bezier[0];
  result[1] = bezier[1];
  result[2] = bezier[2];
  result[3] = bezier[3];
  for (i = 0; i < n - 3; i++) {
    bezier = this.cardinalToBezier(P[i], P[i + 1], P[i + 2], P[i + 3], tension);
    result[4 + i * 3] = bezier[1];
    result[4 + i * 3 + 1] = bezier[2];
    result[4 + i * 3 + 2] = bezier[3];
  }
  bezier = this.cardinalToBezier(P[n - 3], P[n - 2], P[n - 1], P[n - 1], tension);
  result[4 + i * 3] = bezier[1];
  result[4 + i * 3 + 1] = bezier[2];
  result[4 + i * 3 + 2] = bezier[3];
  return result;
}, getAnchors:function(prevX, prevY, curX, curY, nextX, nextY, value) {
  value = value || 4;
  var PI = Math.PI, halfPI = PI / 2, abs = Math.abs, sin = Math.sin, cos = Math.cos, atan = Math.atan, control1Length, control2Length, control1Angle, control2Angle, control1X, control1Y, control2X, control2Y, alpha;
  control1Length = (curX - prevX) / value;
  control2Length = (nextX - curX) / value;
  if (curY >= prevY && curY >= nextY || curY <= prevY && curY <= nextY) {
    control1Angle = control2Angle = halfPI;
  } else {
    control1Angle = atan((curX - prevX) / abs(curY - prevY));
    if (prevY < curY) {
      control1Angle = PI - control1Angle;
    }
    control2Angle = atan((nextX - curX) / abs(curY - nextY));
    if (nextY < curY) {
      control2Angle = PI - control2Angle;
    }
  }
  alpha = halfPI - (control1Angle + control2Angle) % (PI * 2) / 2;
  if (alpha > halfPI) {
    alpha -= PI;
  }
  control1Angle += alpha;
  control2Angle += alpha;
  control1X = curX - control1Length * sin(control1Angle);
  control1Y = curY + control1Length * cos(control1Angle);
  control2X = curX + control2Length * sin(control2Angle);
  control2Y = curY + control2Length * cos(control2Angle);
  if (curY > prevY && control1Y < prevY || curY < prevY && control1Y > prevY) {
    control1X += abs(prevY - control1Y) * (control1X - curX) / (control1Y - curY);
    control1Y = prevY;
  }
  if (curY > nextY && control2Y < nextY || curY < nextY && control2Y > nextY) {
    control2X -= abs(nextY - control2Y) * (control2X - curX) / (control2Y - curY);
    control2Y = nextY;
  }
  return {x1:control1X, y1:control1Y, x2:control2X, y2:control2Y};
}, smooth:function(dataX, dataY, value) {
  var ln = dataX.length, prevX, prevY, curX, curY, nextX, nextY, x, y, smoothX = [], smoothY = [], i, anchors;
  for (i = 0; i < ln - 1; i++) {
    prevX = dataX[i];
    prevY = dataY[i];
    if (i === 0) {
      x = prevX;
      y = prevY;
      smoothX.push(x);
      smoothY.push(y);
      if (ln === 1) {
        break;
      }
    }
    curX = dataX[i + 1];
    curY = dataY[i + 1];
    nextX = dataX[i + 2];
    nextY = dataY[i + 2];
    if (!(Ext.isNumber(nextX) && Ext.isNumber(nextY))) {
      smoothX.push(x, curX, curX);
      smoothY.push(y, curY, curY);
      break;
    }
    anchors = this.getAnchors(prevX, prevY, curX, curY, nextX, nextY, value);
    smoothX.push(x, anchors.x1, curX);
    smoothY.push(y, anchors.y1, curY);
    x = anchors.x2;
    y = anchors.y2;
  }
  return {smoothX:smoothX, smoothY:smoothY};
}, beginUpdateIOS:Ext.os.is.iOS ? function() {
  this.iosUpdateEl = Ext.getBody().createChild({'data-sticky':true, style:'position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px; background: rgba(0,0,0,0.001); z-index: 100000'});
} : Ext.emptyFn, endUpdateIOS:function() {
  this.iosUpdateEl = Ext.destroy(this.iosUpdateEl);
}});
Ext.define('Ext.draw.gradient.Gradient', {requires:['Ext.draw.Color'], isGradient:true, config:{stops:[]}, applyStops:function(newStops) {
  var stops = [], ln = newStops.length, i, stop, color;
  for (i = 0; i < ln; i++) {
    stop = newStops[i];
    color = stop.color;
    if (!(color && color.isColor)) {
      color = Ext.util.Color.fly(color || Ext.util.Color.NONE);
    }
    stops.push({offset:Math.min(1, Math.max(0, 'offset' in stop ? stop.offset : stop.position || 0)), color:color.toString()});
  }
  stops.sort(function(a, b) {
    return a.offset - b.offset;
  });
  return stops;
}, onClassExtended:function(subClass, member) {
  if (!member.alias && member.type) {
    member.alias = 'gradient.' + member.type;
  }
}, constructor:function(config) {
  this.initConfig(config);
}, generateGradient:Ext.emptyFn});
Ext.define('Ext.draw.gradient.GradientDefinition', {singleton:true, urlStringRe:/^url\(#([\w\-]+)\)$/, gradients:{}, add:function(gradients) {
  var store = this.gradients, i, n, gradient;
  for (i = 0, n = gradients.length; i < n; i++) {
    gradient = gradients[i];
    if (Ext.isString(gradient.id)) {
      store[gradient.id] = gradient;
    }
  }
}, get:function(str) {
  var store = this.gradients, match = str.match(this.urlStringRe), gradient;
  if (match && match[1] && (gradient = store[match[1]])) {
    return gradient || str;
  }
  return str;
}});
Ext.define('Ext.draw.sprite.AttributeParser', {singleton:true, attributeRe:/^url\(#([a-zA-Z\-]+)\)$/, requires:['Ext.draw.Color', 'Ext.draw.gradient.GradientDefinition'], 'default':Ext.identityFn, string:function(n) {
  return String(n);
}, number:function(n) {
  if (Ext.isNumber(+n)) {
    return n;
  }
}, angle:function(n) {
  if (Ext.isNumber(n)) {
    n %= Math.PI * 2;
    if (n < -Math.PI) {
      n += Math.PI * 2;
    } else {
      if (n >= Math.PI) {
        n -= Math.PI * 2;
      }
    }
    return n;
  }
}, data:function(n) {
  if (Ext.isArray(n)) {
    return n.slice();
  } else {
    if (n instanceof Float32Array) {
      return new Float32Array(n);
    }
  }
}, bool:function(n) {
  return !!n;
}, color:function(n) {
  if (n && n.isColor) {
    return n.toString();
  } else {
    if (n && n.isGradient) {
      return n;
    } else {
      if (!n) {
        return Ext.util.Color.NONE;
      } else {
        if (Ext.isString(n)) {
          if (n.substr(0, 3) === 'url') {
            n = Ext.draw.gradient.GradientDefinition.get(n);
            if (Ext.isString(n)) {
              return n;
            }
          } else {
            return Ext.util.Color.fly(n).toString();
          }
        }
      }
    }
  }
  if (n.type === 'linear') {
    return Ext.create('Ext.draw.gradient.Linear', n);
  } else {
    if (n.type === 'radial') {
      return Ext.create('Ext.draw.gradient.Radial', n);
    } else {
      if (n.type === 'pattern') {
        return Ext.create('Ext.draw.gradient.Pattern', n);
      } else {
        return Ext.util.Color.NONE;
      }
    }
  }
}, limited:function(low, hi) {
  return function(n) {
    n = +n;
    return Ext.isNumber(n) ? Math.min(Math.max(n, low), hi) : undefined;
  };
}, limited01:function(n) {
  n = +n;
  return Ext.isNumber(n) ? Math.min(Math.max(n, 0), 1) : undefined;
}, enums:function() {
  var enums = {}, args = Array.prototype.slice.call(arguments, 0), i, ln;
  for (i = 0, ln = args.length; i < ln; i++) {
    enums[args[i]] = true;
  }
  return function(n) {
    return n in enums ? n : undefined;
  };
}});
Ext.define('Ext.draw.sprite.AttributeDefinition', {requires:['Ext.draw.sprite.AttributeParser', 'Ext.draw.sprite.AnimationParser'], config:{defaults:{$value:{}, lazy:true}, aliases:{}, animationProcessors:{}, processors:{$value:{}, lazy:true}, dirtyTriggers:{}, triggers:{}, updaters:{}}, inheritableStatics:{processorFactoryRe:/^(\w+)\(([\w\-,]*)\)$/}, spriteClass:null, constructor:function(config) {
  var me = this;
  me.initConfig(config);
}, applyDefaults:function(defaults, oldDefaults) {
  oldDefaults = Ext.apply(oldDefaults || {}, this.normalize(defaults));
  return oldDefaults;
}, applyAliases:function(aliases, oldAliases) {
  return Ext.apply(oldAliases || {}, aliases);
}, applyProcessors:function(processors, oldProcessors) {
  this.getAnimationProcessors();
  var result = oldProcessors || {}, defaultProcessor = Ext.draw.sprite.AttributeParser, processorFactoryRe = this.self.processorFactoryRe, animationProcessors = {}, anyAnimationProcessors, name, match, fn;
  for (name in processors) {
    fn = processors[name];
    if (typeof fn === 'string') {
      match = fn.match(processorFactoryRe);
      if (match) {
        fn = defaultProcessor[match[1]].apply(defaultProcessor, match[2].split(','));
      } else {
        if (defaultProcessor[fn]) {
          animationProcessors[name] = fn;
          anyAnimationProcessors = true;
          fn = defaultProcessor[fn];
        }
      }
    }
    if (!Ext.isFunction(fn)) {
      Ext.raise(this.spriteClass.$className + ": processor '" + name + "' has not been found.");
    }
    result[name] = fn;
  }
  if (anyAnimationProcessors) {
    this.setAnimationProcessors(animationProcessors);
  }
  return result;
}, applyAnimationProcessors:function(animationProcessors, oldAnimationProcessors) {
  var parser = Ext.draw.sprite.AnimationParser, name, item;
  if (!oldAnimationProcessors) {
    oldAnimationProcessors = {};
  }
  for (name in animationProcessors) {
    item = animationProcessors[name];
    if (item === 'none') {
      oldAnimationProcessors[name] = null;
    } else {
      if (Ext.isString(item) && !(name in oldAnimationProcessors)) {
        if (item in parser) {
          while (Ext.isString(parser[item])) {
            item = parser[item];
          }
          oldAnimationProcessors[name] = parser[item];
        }
      } else {
        if (Ext.isObject(item)) {
          oldAnimationProcessors[name] = item;
        }
      }
    }
  }
  return oldAnimationProcessors;
}, updateDirtyTriggers:function(dirtyTriggers) {
  this.setTriggers(dirtyTriggers);
}, applyTriggers:function(triggers, oldTriggers) {
  if (!oldTriggers) {
    oldTriggers = {};
  }
  for (var name in triggers) {
    oldTriggers[name] = triggers[name].split(',');
  }
  return oldTriggers;
}, applyUpdaters:function(updaters, oldUpdaters) {
  return Ext.apply(oldUpdaters || {}, updaters);
}, batchedNormalize:function(batchedChanges, keepUnrecognized) {
  if (!batchedChanges) {
    return {};
  }
  var processors = this.getProcessors(), aliases = this.getAliases(), translation = batchedChanges.translation || batchedChanges.translate, normalized = {}, i, ln, name, val, rotation, scaling, matrix, subVal, split;
  if ('rotation' in batchedChanges) {
    rotation = batchedChanges.rotation;
  } else {
    rotation = 'rotate' in batchedChanges ? batchedChanges.rotate : undefined;
  }
  if ('scaling' in batchedChanges) {
    scaling = batchedChanges.scaling;
  } else {
    scaling = 'scale' in batchedChanges ? batchedChanges.scale : undefined;
  }
  if (typeof scaling !== 'undefined') {
    if (Ext.isNumber(scaling)) {
      normalized.scalingX = scaling;
      normalized.scalingY = scaling;
    } else {
      if ('x' in scaling) {
        normalized.scalingX = scaling.x;
      }
      if ('y' in scaling) {
        normalized.scalingY = scaling.y;
      }
      if ('centerX' in scaling) {
        normalized.scalingCenterX = scaling.centerX;
      }
      if ('centerY' in scaling) {
        normalized.scalingCenterY = scaling.centerY;
      }
    }
  }
  if (typeof rotation !== 'undefined') {
    if (Ext.isNumber(rotation)) {
      rotation = Ext.draw.Draw.rad(rotation);
      normalized.rotationRads = rotation;
    } else {
      if ('rads' in rotation) {
        normalized.rotationRads = rotation.rads;
      } else {
        if ('degrees' in rotation) {
          if (Ext.isArray(rotation.degrees)) {
            normalized.rotationRads = Ext.Array.map(rotation.degrees, function(deg) {
              return Ext.draw.Draw.rad(deg);
            });
          } else {
            normalized.rotationRads = Ext.draw.Draw.rad(rotation.degrees);
          }
        }
      }
      if ('centerX' in rotation) {
        normalized.rotationCenterX = rotation.centerX;
      }
      if ('centerY' in rotation) {
        normalized.rotationCenterY = rotation.centerY;
      }
    }
  }
  if (typeof translation !== 'undefined') {
    if ('x' in translation) {
      normalized.translationX = translation.x;
    }
    if ('y' in translation) {
      normalized.translationY = translation.y;
    }
  }
  if ('matrix' in batchedChanges) {
    matrix = Ext.draw.Matrix.create(batchedChanges.matrix);
    split = matrix.split();
    normalized.matrix = matrix;
    normalized.rotationRads = split.rotation;
    normalized.rotationCenterX = 0;
    normalized.rotationCenterY = 0;
    normalized.scalingX = split.scaleX;
    normalized.scalingY = split.scaleY;
    normalized.scalingCenterX = 0;
    normalized.scalingCenterY = 0;
    normalized.translationX = split.translateX;
    normalized.translationY = split.translateY;
  }
  for (name in batchedChanges) {
    val = batchedChanges[name];
    if (typeof val === 'undefined') {
      continue;
    } else {
      if (Ext.isArray(val)) {
        if (name in aliases) {
          name = aliases[name];
        }
        if (name in processors) {
          normalized[name] = [];
          for (i = 0, ln = val.length; i < ln; i++) {
            subVal = processors[name].call(this, val[i]);
            if (typeof subVal !== 'undefined') {
              normalized[name][i] = subVal;
            }
          }
        } else {
          if (keepUnrecognized) {
            normalized[name] = val;
          }
        }
      } else {
        if (name in aliases) {
          name = aliases[name];
        }
        if (name in processors) {
          val = processors[name].call(this, val);
          if (typeof val !== 'undefined') {
            normalized[name] = val;
          }
        } else {
          if (keepUnrecognized) {
            normalized[name] = val;
          }
        }
      }
    }
  }
  return normalized;
}, normalize:function(changes, keepUnrecognized) {
  if (!changes) {
    return {};
  }
  var processors = this.getProcessors(), aliases = this.getAliases(), translation = changes.translation || changes.translate, normalized = {}, name, val, rotation, scaling, matrix, split;
  if ('rotation' in changes) {
    rotation = changes.rotation;
  } else {
    rotation = 'rotate' in changes ? changes.rotate : undefined;
  }
  if ('scaling' in changes) {
    scaling = changes.scaling;
  } else {
    scaling = 'scale' in changes ? changes.scale : undefined;
  }
  if (translation) {
    if ('x' in translation) {
      normalized.translationX = translation.x;
    }
    if ('y' in translation) {
      normalized.translationY = translation.y;
    }
  }
  if (typeof scaling !== 'undefined') {
    if (Ext.isNumber(scaling)) {
      normalized.scalingX = scaling;
      normalized.scalingY = scaling;
    } else {
      if ('x' in scaling) {
        normalized.scalingX = scaling.x;
      }
      if ('y' in scaling) {
        normalized.scalingY = scaling.y;
      }
      if ('centerX' in scaling) {
        normalized.scalingCenterX = scaling.centerX;
      }
      if ('centerY' in scaling) {
        normalized.scalingCenterY = scaling.centerY;
      }
    }
  }
  if (typeof rotation !== 'undefined') {
    if (Ext.isNumber(rotation)) {
      rotation = Ext.draw.Draw.rad(rotation);
      normalized.rotationRads = rotation;
    } else {
      if ('rads' in rotation) {
        normalized.rotationRads = rotation.rads;
      } else {
        if ('degrees' in rotation) {
          normalized.rotationRads = Ext.draw.Draw.rad(rotation.degrees);
        }
      }
      if ('centerX' in rotation) {
        normalized.rotationCenterX = rotation.centerX;
      }
      if ('centerY' in rotation) {
        normalized.rotationCenterY = rotation.centerY;
      }
    }
  }
  if ('matrix' in changes) {
    matrix = Ext.draw.Matrix.create(changes.matrix);
    split = matrix.split();
    normalized.matrix = matrix;
    normalized.rotationRads = split.rotation;
    normalized.rotationCenterX = 0;
    normalized.rotationCenterY = 0;
    normalized.scalingX = split.scaleX;
    normalized.scalingY = split.scaleY;
    normalized.scalingCenterX = 0;
    normalized.scalingCenterY = 0;
    normalized.translationX = split.translateX;
    normalized.translationY = split.translateY;
  }
  for (name in changes) {
    val = changes[name];
    if (typeof val === 'undefined') {
      continue;
    }
    if (name in aliases) {
      name = aliases[name];
    }
    if (name in processors) {
      val = processors[name].call(this, val);
      if (typeof val !== 'undefined') {
        normalized[name] = val;
      }
    } else {
      if (keepUnrecognized) {
        normalized[name] = val;
      }
    }
  }
  return normalized;
}, setBypassingNormalization:function(attr, modifierStack, changes) {
  return modifierStack.pushDown(attr, changes);
}, set:function(attr, modifierStack, changes) {
  changes = this.normalize(changes);
  return this.setBypassingNormalization(attr, modifierStack, changes);
}});
Ext.define('Ext.draw.Matrix', {isMatrix:true, statics:{createAffineMatrixFromTwoPair:function(x0, y0, x1, y1, x0p, y0p, x1p, y1p) {
  var dx = x1 - x0, dy = y1 - y0, dxp = x1p - x0p, dyp = y1p - y0p, r = 1 / (dx * dx + dy * dy), a = dx * dxp + dy * dyp, b = dxp * dy - dx * dyp, c = -a * x0 - b * y0, f = b * x0 - a * y0;
  return new this(a * r, -b * r, b * r, a * r, c * r + x0p, f * r + y0p);
}, createPanZoomFromTwoPair:function(x0, y0, x1, y1, x0p, y0p, x1p, y1p) {
  if (arguments.length === 2) {
    return this.createPanZoomFromTwoPair.apply(this, x0.concat(y0));
  }
  var dx = x1 - x0, dy = y1 - y0, cx = (x0 + x1) * 0.5, cy = (y0 + y1) * 0.5, dxp = x1p - x0p, dyp = y1p - y0p, cxp = (x0p + x1p) * 0.5, cyp = (y0p + y1p) * 0.5, r = dx * dx + dy * dy, rp = dxp * dxp + dyp * dyp, scale = Math.sqrt(rp / r);
  return new this(scale, 0, 0, scale, cxp - scale * cx, cyp - scale * cy);
}, fly:function() {
  var flyMatrix = null, simplefly = function(elements) {
    flyMatrix.elements = elements;
    return flyMatrix;
  };
  return function(elements) {
    if (!flyMatrix) {
      flyMatrix = new Ext.draw.Matrix;
    }
    flyMatrix.elements = elements;
    Ext.draw.Matrix.fly = simplefly;
    return flyMatrix;
  };
}(), create:function(mat) {
  if (mat instanceof this) {
    return mat;
  }
  return new this(mat);
}}, constructor:function(xx, xy, yx, yy, dx, dy) {
  if (xx && xx.length === 6) {
    this.elements = xx.slice();
  } else {
    if (xx !== undefined) {
      this.elements = [xx, xy, yx, yy, dx, dy];
    } else {
      this.elements = [1, 0, 0, 1, 0, 0];
    }
  }
}, prepend:function(xx, xy, yx, yy, dx, dy) {
  var elements = this.elements, xx0 = elements[0], xy0 = elements[1], yx0 = elements[2], yy0 = elements[3], dx0 = elements[4], dy0 = elements[5];
  elements[0] = xx * xx0 + yx * xy0;
  elements[1] = xy * xx0 + yy * xy0;
  elements[2] = xx * yx0 + yx * yy0;
  elements[3] = xy * yx0 + yy * yy0;
  elements[4] = xx * dx0 + yx * dy0 + dx;
  elements[5] = xy * dx0 + yy * dy0 + dy;
  return this;
}, prependMatrix:function(matrix) {
  return this.prepend.apply(this, matrix.elements);
}, append:function(xx, xy, yx, yy, dx, dy) {
  var elements = this.elements, xx0 = elements[0], xy0 = elements[1], yx0 = elements[2], yy0 = elements[3], dx0 = elements[4], dy0 = elements[5];
  elements[0] = xx * xx0 + xy * yx0;
  elements[1] = xx * xy0 + xy * yy0;
  elements[2] = yx * xx0 + yy * yx0;
  elements[3] = yx * xy0 + yy * yy0;
  elements[4] = dx * xx0 + dy * yx0 + dx0;
  elements[5] = dx * xy0 + dy * yy0 + dy0;
  return this;
}, appendMatrix:function(matrix) {
  return this.append.apply(this, matrix.elements);
}, set:function(xx, xy, yx, yy, dx, dy) {
  var elements = this.elements;
  elements[0] = xx;
  elements[1] = xy;
  elements[2] = yx;
  elements[3] = yy;
  elements[4] = dx;
  elements[5] = dy;
  return this;
}, inverse:function(target) {
  var elements = this.elements, a = elements[0], b = elements[1], c = elements[2], d = elements[3], e = elements[4], f = elements[5], rDim = 1 / (a * d - b * c);
  a *= rDim;
  b *= rDim;
  c *= rDim;
  d *= rDim;
  if (target) {
    target.set(d, -b, -c, a, c * f - d * e, b * e - a * f);
    return target;
  } else {
    return new Ext.draw.Matrix(d, -b, -c, a, c * f - d * e, b * e - a * f);
  }
}, translate:function(x, y, prepend) {
  if (prepend) {
    return this.prepend(1, 0, 0, 1, x, y);
  } else {
    return this.append(1, 0, 0, 1, x, y);
  }
}, scale:function(sx, sy, scx, scy, prepend) {
  var me = this;
  if (sy == null) {
    sy = sx;
  }
  if (scx === undefined) {
    scx = 0;
  }
  if (scy === undefined) {
    scy = 0;
  }
  if (prepend) {
    return me.prepend(sx, 0, 0, sy, scx - scx * sx, scy - scy * sy);
  } else {
    return me.append(sx, 0, 0, sy, scx - scx * sx, scy - scy * sy);
  }
}, rotate:function(angle, rcx, rcy, prepend) {
  var me = this, cos = Math.cos(angle), sin = Math.sin(angle);
  rcx = rcx || 0;
  rcy = rcy || 0;
  if (prepend) {
    return me.prepend(cos, sin, -sin, cos, rcx - cos * rcx + rcy * sin, rcy - cos * rcy - rcx * sin);
  } else {
    return me.append(cos, sin, -sin, cos, rcx - cos * rcx + rcy * sin, rcy - cos * rcy - rcx * sin);
  }
}, rotateFromVector:function(x, y, prepend) {
  var me = this, d = Math.sqrt(x * x + y * y), cos = x / d, sin = y / d;
  if (prepend) {
    return me.prepend(cos, sin, -sin, cos, 0, 0);
  } else {
    return me.append(cos, sin, -sin, cos, 0, 0);
  }
}, clone:function() {
  return new Ext.draw.Matrix(this.elements);
}, flipX:function() {
  return this.append(-1, 0, 0, 1, 0, 0);
}, flipY:function() {
  return this.append(1, 0, 0, -1, 0, 0);
}, skewX:function(angle) {
  return this.append(1, 0, Math.tan(angle), 1, 0, 0);
}, skewY:function(angle) {
  return this.append(1, Math.tan(angle), 0, 1, 0, 0);
}, shearX:function(factor) {
  return this.append(1, 0, factor, 1, 0, 0);
}, shearY:function(factor) {
  return this.append(1, factor, 0, 1, 0, 0);
}, reset:function() {
  return this.set(1, 0, 0, 1, 0, 0);
}, precisionCompensate:function(devicePixelRatio, comp) {
  var elements = this.elements, x2x = elements[0], x2y = elements[1], y2x = elements[2], y2y = elements[3], newDx = elements[4], newDy = elements[5], r = x2y * y2x - x2x * y2y;
  comp.b = devicePixelRatio * x2y / x2x;
  comp.c = devicePixelRatio * y2x / y2y;
  comp.d = devicePixelRatio;
  comp.xx = x2x / devicePixelRatio;
  comp.yy = y2y / devicePixelRatio;
  comp.dx = (newDy * x2x * y2x - newDx * x2x * y2y) / r / devicePixelRatio;
  comp.dy = (newDx * x2y * y2y - newDy * x2x * y2y) / r / devicePixelRatio;
}, precisionCompensateRect:function(devicePixelRatio, comp) {
  var elements = this.elements, x2x = elements[0], x2y = elements[1], y2x = elements[2], y2y = elements[3], newDx = elements[4], newDy = elements[5], yxOnXx = y2x / x2x;
  comp.b = devicePixelRatio * x2y / x2x;
  comp.c = devicePixelRatio * yxOnXx;
  comp.d = devicePixelRatio * y2y / x2x;
  comp.xx = x2x / devicePixelRatio;
  comp.yy = x2x / devicePixelRatio;
  comp.dx = (newDy * y2x - newDx * y2y) / (x2y * yxOnXx - y2y) / devicePixelRatio;
  comp.dy = -(newDy * x2x - newDx * x2y) / (x2y * yxOnXx - y2y) / devicePixelRatio;
}, x:function(x, y) {
  var elements = this.elements;
  return x * elements[0] + y * elements[2] + elements[4];
}, y:function(x, y) {
  var elements = this.elements;
  return x * elements[1] + y * elements[3] + elements[5];
}, get:function(i, j) {
  return +this.elements[i + j * 2].toFixed(4);
}, transformPoint:function(point) {
  var elements = this.elements, x, y;
  if (point.isPoint) {
    x = point.x;
    y = point.y;
  } else {
    x = point[0];
    y = point[1];
  }
  return [x * elements[0] + y * elements[2] + elements[4], x * elements[1] + y * elements[3] + elements[5]];
}, transformBBox:function(bbox, radius, target) {
  var elements = this.elements, l = bbox.x, t = bbox.y, w0 = bbox.width * 0.5, h0 = bbox.height * 0.5, xx = elements[0], xy = elements[1], yx = elements[2], yy = elements[3], cx = l + w0, cy = t + h0, w, h, scales;
  if (radius) {
    w0 -= radius;
    h0 -= radius;
    scales = [Math.sqrt(elements[0] * elements[0] + elements[2] * elements[2]), Math.sqrt(elements[1] * elements[1] + elements[3] * elements[3])];
    w = Math.abs(w0 * xx) + Math.abs(h0 * yx) + Math.abs(scales[0] * radius);
    h = Math.abs(w0 * xy) + Math.abs(h0 * yy) + Math.abs(scales[1] * radius);
  } else {
    w = Math.abs(w0 * xx) + Math.abs(h0 * yx);
    h = Math.abs(w0 * xy) + Math.abs(h0 * yy);
  }
  if (!target) {
    target = {};
  }
  target.x = cx * xx + cy * yx + elements[4] - w;
  target.y = cx * xy + cy * yy + elements[5] - h;
  target.width = w + w;
  target.height = h + h;
  return target;
}, transformList:function(list) {
  var elements = this.elements, xx = elements[0], yx = elements[2], dx = elements[4], xy = elements[1], yy = elements[3], dy = elements[5], ln = list.length, p, i;
  for (i = 0; i < ln; i++) {
    p = list[i];
    list[i] = [p[0] * xx + p[1] * yx + dx, p[0] * xy + p[1] * yy + dy];
  }
  return list;
}, isIdentity:function() {
  var elements = this.elements;
  return elements[0] === 1 && elements[1] === 0 && elements[2] === 0 && elements[3] === 1 && elements[4] === 0 && elements[5] === 0;
}, isEqual:function(matrix) {
  var elements = matrix && matrix.isMatrix ? matrix.elements : matrix, myElements = this.elements;
  return myElements[0] === elements[0] && myElements[1] === elements[1] && myElements[2] === elements[2] && myElements[3] === elements[3] && myElements[4] === elements[4] && myElements[5] === elements[5];
}, equals:function(matrix) {
  return this.isEqual(matrix);
}, toArray:function() {
  var elements = this.elements;
  return [elements[0], elements[2], elements[4], elements[1], elements[3], elements[5]];
}, toVerticalArray:function() {
  return this.elements.slice();
}, toString:function() {
  var me = this;
  return [me.get(0, 0), me.get(0, 1), me.get(1, 0), me.get(1, 1), me.get(2, 0), me.get(2, 1)].join(',');
}, toContext:function(ctx) {
  ctx.transform.apply(ctx, this.elements);
  return this;
}, toSvg:function() {
  var elements = this.elements;
  return 'matrix(' + elements[0].toFixed(9) + ',' + elements[1].toFixed(9) + ',' + elements[2].toFixed(9) + ',' + elements[3].toFixed(9) + ',' + elements[4].toFixed(9) + ',' + elements[5].toFixed(9) + ')';
}, getScaleX:function() {
  var elements = this.elements;
  return Math.sqrt(elements[0] * elements[0] + elements[2] * elements[2]);
}, getScaleY:function() {
  var elements = this.elements;
  return Math.sqrt(elements[1] * elements[1] + elements[3] * elements[3]);
}, getXX:function() {
  return this.elements[0];
}, getXY:function() {
  return this.elements[1];
}, getYX:function() {
  return this.elements[2];
}, getYY:function() {
  return this.elements[3];
}, getDX:function() {
  return this.elements[4];
}, getDY:function() {
  return this.elements[5];
}, split:function() {
  var el = this.elements, xx = el[0], xy = el[1], yy = el[3], out = {translateX:el[4], translateY:el[5]};
  out.rotate = out.rotation = Math.atan2(xy, xx);
  out.scaleX = xx / Math.cos(out.rotate);
  out.scaleY = yy / xx * out.scaleX;
  return out;
}}, function() {
  function registerName(properties, name, i) {
    properties[name] = {get:function() {
      return this.elements[i];
    }, set:function(val) {
      this.elements[i] = val;
    }};
  }
  if (Object.defineProperties) {
    var properties = {};
    registerName(properties, 'a', 0);
    registerName(properties, 'b', 1);
    registerName(properties, 'c', 2);
    registerName(properties, 'd', 3);
    registerName(properties, 'e', 4);
    registerName(properties, 'f', 5);
    Object.defineProperties(this.prototype, properties);
  }
  this.prototype.multiply = this.prototype.appendMatrix;
});
Ext.define('Ext.draw.modifier.Modifier', {isModifier:true, mixins:{observable:'Ext.mixin.Observable'}, config:{lower:null, upper:null, sprite:null}, constructor:function(config) {
  this.mixins.observable.constructor.call(this, config);
}, updateUpper:function(upper) {
  if (upper) {
    upper.setLower(this);
  }
}, updateLower:function(lower) {
  if (lower) {
    lower.setUpper(this);
  }
}, prepareAttributes:function(attr) {
  if (this._lower) {
    this._lower.prepareAttributes(attr);
  }
}, popUp:function(attr, changes) {
  if (this._upper) {
    this._upper.popUp(attr, changes);
  } else {
    Ext.apply(attr, changes);
  }
}, filterChanges:function(attr, changes, receiver) {
  var targets = attr.targets, name, value;
  if (receiver) {
    for (name in changes) {
      value = changes[name];
      if (value !== attr[name] || targets && value !== targets[name]) {
        receiver[name] = value;
      }
    }
  } else {
    for (name in changes) {
      value = changes[name];
      if (value === attr[name] && (!targets || value === targets[name])) {
        delete changes[name];
      }
    }
  }
  return receiver || changes;
}, pushDown:function(attr, changes) {
  return this._lower ? this._lower.pushDown(attr, changes) : this.filterChanges(attr, changes);
}});
Ext.define('Ext.draw.modifier.Target', {requires:['Ext.draw.Matrix'], extend:'Ext.draw.modifier.Modifier', alias:'modifier.target', statics:{uniqueId:0}, prepareAttributes:function(attr) {
  if (this._lower) {
    this._lower.prepareAttributes(attr);
  }
  attr.attributeId = 'attribute-' + Ext.draw.modifier.Target.uniqueId++;
  if (!attr.hasOwnProperty('canvasAttributes')) {
    attr.bbox = {plain:{dirty:true}, transform:{dirty:true}};
    attr.dirty = true;
    attr.pendingUpdaters = {};
    attr.canvasAttributes = {};
    attr.matrix = new Ext.draw.Matrix;
    attr.inverseMatrix = new Ext.draw.Matrix;
  }
}, applyChanges:function(attr, changes) {
  Ext.apply(attr, changes);
  var sprite = this.getSprite(), pendingUpdaters = attr.pendingUpdaters, triggers = sprite.self.def.getTriggers(), updaters, instances, instance, name, hasChanges, canvasAttributes, i, j, ln;
  for (name in changes) {
    hasChanges = true;
    if (updaters = triggers[name]) {
      sprite.scheduleUpdaters(attr, updaters, [name]);
    }
    if (attr.template && changes.removeFromInstance && changes.removeFromInstance[name]) {
      delete attr[name];
    }
  }
  if (!hasChanges) {
    return;
  }
  if (pendingUpdaters.canvas) {
    canvasAttributes = pendingUpdaters.canvas;
    delete pendingUpdaters.canvas;
    for (i = 0, ln = canvasAttributes.length; i < ln; i++) {
      name = canvasAttributes[i];
      attr.canvasAttributes[name] = attr[name];
    }
  }
  if (attr.hasOwnProperty('children')) {
    instances = attr.children;
    for (i = 0, ln = instances.length; i < ln; i++) {
      instance = instances[i];
      Ext.apply(instance.pendingUpdaters, pendingUpdaters);
      if (canvasAttributes) {
        for (j = 0; j < canvasAttributes.length; j++) {
          name = canvasAttributes[j];
          instance.canvasAttributes[name] = instance[name];
        }
      }
      sprite.callUpdaters(instance);
    }
  }
  sprite.setDirty(true);
  sprite.callUpdaters(attr);
}, popUp:function(attr, changes) {
  this.applyChanges(attr, changes);
}, pushDown:function(attr, changes) {
  if (this._lower) {
    changes = this._lower.pushDown(attr, changes);
  }
  this.applyChanges(attr, changes);
  return changes;
}});
Ext.define('Ext.draw.TimingFunctions', function() {
  var pow = Math.pow, sin = Math.sin, cos = Math.cos, sqrt = Math.sqrt, pi = Math.PI, poly = ['quad', 'cube', 'quart', 'quint'], easings = {pow:function(p, x) {
    return pow(p, x || 6);
  }, expo:function(p) {
    return pow(2, 8 * (p - 1));
  }, circ:function(p) {
    return 1 - sqrt(1 - p * p);
  }, sine:function(p) {
    return 1 - sin((1 - p) * pi / 2);
  }, back:function(p, n) {
    n = n || 1.616;
    return p * p * ((n + 1) * p - n);
  }, bounce:function(p) {
    for (var a = 0, b = 1; 1; a += b, b /= 2) {
      if (p >= (7 - 4 * a) / 11) {
        return b * b - pow((11 - 6 * a - 11 * p) / 4, 2);
      }
    }
  }, elastic:function(p, x) {
    return pow(2, 10 * --p) * cos(20 * p * pi * (x || 1) / 3);
  }}, easingsMap = {}, name, len, i;
  function createPoly(times) {
    return function(p) {
      return pow(p, times);
    };
  }
  function addEasing(name, easing) {
    easingsMap[name + 'In'] = function(pos) {
      return easing(pos);
    };
    easingsMap[name + 'Out'] = function(pos) {
      return 1 - easing(1 - pos);
    };
    easingsMap[name + 'InOut'] = function(pos) {
      return pos <= 0.5 ? easing(2 * pos) / 2 : (2 - easing(2 * (1 - pos))) / 2;
    };
  }
  for (i = 0, len = poly.length; i < len; ++i) {
    easings[poly[i]] = createPoly(i + 2);
  }
  for (name in easings) {
    addEasing(name, easings[name]);
  }
  easingsMap.linear = Ext.identityFn;
  easingsMap.easeIn = easingsMap.quadIn;
  easingsMap.easeOut = easingsMap.quadOut;
  easingsMap.easeInOut = easingsMap.quadInOut;
  return {singleton:true, easingMap:easingsMap};
}, function(Cls) {
  Ext.apply(Cls, Cls.easingMap);
});
Ext.define('Ext.draw.Animator', {uses:['Ext.draw.Draw'], singleton:true, frameCallbacks:{}, frameCallbackId:0, scheduled:0, frameStartTimeOffset:Ext.now(), animations:[], running:false, animationTime:function() {
  return Ext.AnimationQueue.frameStartTime - this.frameStartTimeOffset;
}, add:function(animation) {
  var me = this;
  if (!me.contains(animation)) {
    me.animations.push(animation);
    me.ignite();
    if ('fireEvent' in animation) {
      animation.fireEvent('animationstart', animation);
    }
  }
}, remove:function(animation) {
  var me = this, animations = me.animations, i = 0, l = animations.length;
  for (; i < l; ++i) {
    if (animations[i] === animation) {
      animations.splice(i, 1);
      if ('fireEvent' in animation) {
        animation.fireEvent('animationend', animation);
      }
      return;
    }
  }
}, contains:function(animation) {
  return Ext.Array.indexOf(this.animations, animation) > -1;
}, empty:function() {
  return this.animations.length === 0;
}, idle:function() {
  return this.scheduled === 0 && this.animations.length === 0;
}, step:function(frameTime) {
  var me = this, animations = me.animations, animation, i = 0, ln = animations.length;
  for (; i < ln; i++) {
    animation = animations[i];
    animation.step(frameTime);
    if (!animation.animating) {
      animations.splice(i, 1);
      i--;
      ln--;
      if (animation.fireEvent) {
        animation.fireEvent('animationend', animation);
      }
    }
  }
}, schedule:function(callback, scope) {
  scope = scope || this;
  var id = 'frameCallback' + this.frameCallbackId++;
  if (Ext.isString(callback)) {
    callback = scope[callback];
  }
  Ext.draw.Animator.frameCallbacks[id] = {fn:callback, scope:scope, once:true};
  this.scheduled++;
  Ext.draw.Animator.ignite();
  return id;
}, scheduleIf:function(callback, scope) {
  scope = scope || this;
  var frameCallbacks = Ext.draw.Animator.frameCallbacks, cb, id;
  if (Ext.isString(callback)) {
    callback = scope[callback];
  }
  for (id in frameCallbacks) {
    cb = frameCallbacks[id];
    if (cb.once && cb.fn === callback && cb.scope === scope) {
      return null;
    }
  }
  return this.schedule(callback, scope);
}, cancel:function(id) {
  if (Ext.draw.Animator.frameCallbacks[id] && Ext.draw.Animator.frameCallbacks[id].once) {
    this.scheduled = Math.max(--this.scheduled, 0);
    delete Ext.draw.Animator.frameCallbacks[id];
    Ext.draw.Draw.endUpdateIOS();
  }
  if (this.idle()) {
    this.extinguish();
  }
}, clear:function() {
  this.animations.length = 0;
  Ext.draw.Animator.frameCallbacks = {};
  this.extinguish();
}, addFrameCallback:function(callback, scope) {
  scope = scope || this;
  if (Ext.isString(callback)) {
    callback = scope[callback];
  }
  var id = 'frameCallback' + this.frameCallbackId++;
  Ext.draw.Animator.frameCallbacks[id] = {fn:callback, scope:scope};
  return id;
}, removeFrameCallback:function(id) {
  delete Ext.draw.Animator.frameCallbacks[id];
  if (this.idle()) {
    this.extinguish();
  }
}, fireFrameCallbacks:function() {
  var callbacks = this.frameCallbacks, id, fn, cb;
  for (id in callbacks) {
    cb = callbacks[id];
    fn = cb.fn;
    if (Ext.isString(fn)) {
      fn = cb.scope[fn];
    }
    fn.call(cb.scope);
    if (callbacks[id] && cb.once) {
      this.scheduled = Math.max(--this.scheduled, 0);
      delete callbacks[id];
    }
  }
}, handleFrame:function() {
  var me = this;
  me.step(me.animationTime());
  me.fireFrameCallbacks();
  if (me.idle()) {
    me.extinguish();
  }
}, ignite:function() {
  if (!this.running) {
    this.running = true;
    Ext.AnimationQueue.start(this.handleFrame, this);
    Ext.draw.Draw.beginUpdateIOS();
  }
}, extinguish:function() {
  this.running = false;
  Ext.AnimationQueue.stop(this.handleFrame, this);
  Ext.draw.Draw.endUpdateIOS();
}});
Ext.define('Ext.draw.modifier.Animation', {extend:'Ext.draw.modifier.Modifier', alias:'modifier.animation', requires:['Ext.draw.TimingFunctions', 'Ext.draw.Animator'], config:{easing:Ext.identityFn, duration:0, customEasings:{}, customDurations:{}}, constructor:function(config) {
  var me = this;
  me.anyAnimation = me.anySpecialAnimations = false;
  me.animating = 0;
  me.animatingPool = [];
  me.callParent([config]);
}, prepareAttributes:function(attr) {
  if (!attr.hasOwnProperty('timers')) {
    attr.animating = false;
    attr.timers = {};
    attr.targets = Ext.Object.chain(attr);
    attr.targets.prototype = attr;
  }
  if (this._lower) {
    this._lower.prepareAttributes(attr.targets);
  }
}, updateSprite:function(sprite) {
  this.setConfig(sprite.config.animation);
}, updateDuration:function(duration) {
  this.anyAnimation = duration > 0;
}, applyEasing:function(easing) {
  if (typeof easing === 'string') {
    easing = Ext.draw.TimingFunctions.easingMap[easing];
  }
  return easing;
}, applyCustomEasings:function(newEasings, oldEasings) {
  oldEasings = oldEasings || {};
  var any, key, attrs, easing, i, ln;
  for (key in newEasings) {
    any = true;
    easing = newEasings[key];
    attrs = key.split(',');
    if (typeof easing === 'string') {
      easing = Ext.draw.TimingFunctions.easingMap[easing];
    }
    for (i = 0, ln = attrs.length; i < ln; i++) {
      oldEasings[attrs[i]] = easing;
    }
  }
  if (any) {
    this.anySpecialAnimations = any;
  }
  return oldEasings;
}, setEasingOn:function(attrs, easing) {
  attrs = Ext.Array.from(attrs).slice();
  var customEasings = {}, ln = attrs.length, i = 0;
  for (; i < ln; i++) {
    customEasings[attrs[i]] = easing;
  }
  this.setCustomEasings(customEasings);
}, clearEasingOn:function(attrs) {
  attrs = Ext.Array.from(attrs, true);
  var i = 0, ln = attrs.length;
  for (; i < ln; i++) {
    delete this._customEasings[attrs[i]];
  }
}, applyCustomDurations:function(newDurations, oldDurations) {
  oldDurations = oldDurations || {};
  var any, key, duration, attrs, i, ln;
  for (key in newDurations) {
    any = true;
    duration = newDurations[key];
    attrs = key.split(',');
    for (i = 0, ln = attrs.length; i < ln; i++) {
      oldDurations[attrs[i]] = duration;
    }
  }
  if (any) {
    this.anySpecialAnimations = any;
  }
  return oldDurations;
}, setDurationOn:function(attrs, duration) {
  attrs = Ext.Array.from(attrs).slice();
  var customDurations = {}, i = 0, ln = attrs.length;
  for (; i < ln; i++) {
    customDurations[attrs[i]] = duration;
  }
  this.setCustomDurations(customDurations);
}, clearDurationOn:function(attrs) {
  attrs = Ext.Array.from(attrs, true);
  for (var i = 0, ln = attrs.length; i < ln; i++) {
    delete this._customDurations[attrs[i]];
  }
}, setAnimating:function(attr, animating) {
  var me = this, pool = me.animatingPool;
  if (attr.animating !== animating) {
    attr.animating = animating;
    if (animating) {
      pool.push(attr);
      if (me.animating === 0) {
        Ext.draw.Animator.add(me);
      }
      me.animating++;
    } else {
      for (var i = pool.length; i--;) {
        if (pool[i] === attr) {
          pool.splice(i, 1);
        }
      }
      me.animating = pool.length;
    }
  }
}, setAttrs:function(attr, changes) {
  var me = this, timers = attr.timers, parsers = me._sprite.self.def._animationProcessors, defaultEasing = me._easing, defaultDuration = me._duration, customDurations = me._customDurations, customEasings = me._customEasings, anySpecial = me.anySpecialAnimations, any = me.anyAnimation || anySpecial, targets = attr.targets, ignite = false, timer, name, newValue, startValue, parser, easing, duration;
  if (!any) {
    for (name in changes) {
      if (attr[name] === changes[name]) {
        delete changes[name];
      } else {
        attr[name] = changes[name];
      }
      delete targets[name];
      delete timers[name];
    }
    return changes;
  } else {
    for (name in changes) {
      newValue = changes[name];
      startValue = attr[name];
      if (newValue !== startValue && startValue !== undefined && startValue !== null && (parser = parsers[name])) {
        easing = defaultEasing;
        duration = defaultDuration;
        if (anySpecial) {
          if (name in customEasings) {
            easing = customEasings[name];
          }
          if (name in customDurations) {
            duration = customDurations[name];
          }
        }
        if (startValue && startValue.isGradient || newValue && newValue.isGradient) {
          duration = 0;
        }
        if (duration) {
          if (!timers[name]) {
            timers[name] = {};
          }
          timer = timers[name];
          timer.start = 0;
          timer.easing = easing;
          timer.duration = duration;
          timer.compute = parser.compute;
          timer.serve = parser.serve || Ext.identityFn;
          timer.remove = changes.removeFromInstance && changes.removeFromInstance[name];
          if (parser.parseInitial) {
            var initial = parser.parseInitial(startValue, newValue);
            timer.source = initial[0];
            timer.target = initial[1];
          } else {
            if (parser.parse) {
              timer.source = parser.parse(startValue);
              timer.target = parser.parse(newValue);
            } else {
              timer.source = startValue;
              timer.target = newValue;
            }
          }
          targets[name] = newValue;
          delete changes[name];
          ignite = true;
          continue;
        } else {
          delete targets[name];
        }
      } else {
        delete targets[name];
      }
      delete timers[name];
    }
  }
  if (ignite && !attr.animating) {
    me.setAnimating(attr, true);
  }
  return changes;
}, updateAttributes:function(attr) {
  if (!attr.animating) {
    return {};
  }
  var changes = {}, any = false, timers = attr.timers, targets = attr.targets, now = Ext.draw.Animator.animationTime(), name, timer, delta;
  if (attr.lastUpdate === now) {
    return null;
  }
  for (name in timers) {
    timer = timers[name];
    if (!timer.start) {
      timer.start = now;
      delta = 0;
    } else {
      delta = (now - timer.start) / timer.duration;
    }
    if (delta >= 1) {
      changes[name] = targets[name];
      delete targets[name];
      if (timers[name].remove) {
        changes.removeFromInstance = changes.removeFromInstance || {};
        changes.removeFromInstance[name] = true;
      }
      delete timers[name];
    } else {
      changes[name] = timer.serve(timer.compute(timer.source, timer.target, timer.easing(delta), attr[name]));
      any = true;
    }
  }
  attr.lastUpdate = now;
  this.setAnimating(attr, any);
  return changes;
}, pushDown:function(attr, changes) {
  changes = this.callParent([attr.targets, changes]);
  return this.setAttrs(attr, changes);
}, popUp:function(attr, changes) {
  attr = attr.prototype;
  changes = this.setAttrs(attr, changes);
  if (this._upper) {
    return this._upper.popUp(attr, changes);
  } else {
    return Ext.apply(attr, changes);
  }
}, step:function(frameTime) {
  var me = this, pool = me.animatingPool.slice(), ln = pool.length, i = 0, attr, changes;
  for (; i < ln; i++) {
    attr = pool[i];
    changes = me.updateAttributes(attr);
    if (changes && me._upper) {
      me._upper.popUp(attr, changes);
    }
  }
}, stop:function() {
  this.step();
  var me = this, pool = me.animatingPool, i, ln;
  for (i = 0, ln = pool.length; i < ln; i++) {
    pool[i].animating = false;
  }
  me.animatingPool.length = 0;
  me.animating = 0;
  Ext.draw.Animator.remove(me);
}, destroy:function() {
  Ext.draw.Animator.remove(this);
  this.callParent();
}});
Ext.define('Ext.draw.modifier.Highlight', {extend:'Ext.draw.modifier.Modifier', alias:'modifier.highlight', config:{enabled:false, style:null}, preFx:true, applyStyle:function(style, oldStyle) {
  oldStyle = oldStyle || {};
  if (this.getSprite()) {
    Ext.apply(oldStyle, this.getSprite().self.def.normalize(style));
  } else {
    Ext.apply(oldStyle, style);
  }
  return oldStyle;
}, prepareAttributes:function(attr) {
  if (!attr.hasOwnProperty('highlightOriginal')) {
    attr.highlighted = false;
    attr.highlightOriginal = Ext.Object.chain(attr);
    attr.highlightOriginal.prototype = attr;
    attr.highlightOriginal.removeFromInstance = {};
  }
  if (this._lower) {
    this._lower.prepareAttributes(attr.highlightOriginal);
  }
}, updateSprite:function(sprite, oldSprite) {
  var me = this, style = me.getStyle(), attributeDefinitions;
  if (sprite) {
    attributeDefinitions = sprite.self.def;
    if (style) {
      me._style = attributeDefinitions.normalize(style);
    }
    me.setStyle(sprite.config.highlight);
    attributeDefinitions.setConfig({defaults:{highlighted:false}, processors:{highlighted:'bool'}});
  }
  this.setSprite(sprite);
}, filterChanges:function(attr, changes) {
  var me = this, highlightOriginal = attr.highlightOriginal, style = me.getStyle(), name;
  if (attr.highlighted) {
    for (name in changes) {
      if (style.hasOwnProperty(name)) {
        highlightOriginal[name] = changes[name];
        delete changes[name];
      }
    }
  }
  return changes;
}, pushDown:function(attr, changes) {
  var style = this.getStyle(), highlightOriginal = attr.highlightOriginal, removeFromInstance = highlightOriginal.removeFromInstance, highlighted, name, tplAttr, timer;
  if (changes.hasOwnProperty('highlighted')) {
    highlighted = changes.highlighted;
    delete changes.highlighted;
    if (this._lower) {
      changes = this._lower.pushDown(highlightOriginal, changes);
    }
    changes = this.filterChanges(attr, changes);
    if (highlighted !== attr.highlighted) {
      if (highlighted) {
        for (name in style) {
          if (name in changes) {
            highlightOriginal[name] = changes[name];
          } else {
            tplAttr = attr.template && attr.template.ownAttr;
            if (tplAttr && !attr.prototype.hasOwnProperty(name)) {
              removeFromInstance[name] = true;
              highlightOriginal[name] = tplAttr.targets[name];
            } else {
              timer = highlightOriginal.timers[name];
              if (timer && timer.remove) {
                removeFromInstance[name] = true;
              }
              highlightOriginal[name] = attr[name];
            }
          }
          if (highlightOriginal[name] !== style[name]) {
            changes[name] = style[name];
          }
        }
      } else {
        for (name in style) {
          if (!(name in changes)) {
            changes[name] = highlightOriginal[name];
          }
          delete highlightOriginal[name];
        }
        changes.removeFromInstance = changes.removeFromInstance || {};
        Ext.apply(changes.removeFromInstance, removeFromInstance);
        highlightOriginal.removeFromInstance = {};
      }
      changes.highlighted = highlighted;
    }
  } else {
    if (this._lower) {
      changes = this._lower.pushDown(highlightOriginal, changes);
    }
    changes = this.filterChanges(attr, changes);
  }
  return changes;
}, popUp:function(attr, changes) {
  changes = this.filterChanges(attr, changes);
  this.callParent([attr, changes]);
}});
Ext.define('Ext.draw.sprite.Sprite', {alias:'sprite.sprite', mixins:{observable:'Ext.mixin.Observable'}, requires:['Ext.draw.Draw', 'Ext.draw.gradient.Gradient', 'Ext.draw.sprite.AttributeDefinition', 'Ext.draw.modifier.Target', 'Ext.draw.modifier.Animation', 'Ext.draw.modifier.Highlight'], isSprite:true, $configStrict:false, statics:{defaultHitTestOptions:{fill:true, stroke:true}, debug:false}, inheritableStatics:{def:{processors:{debug:'default', strokeStyle:'color', fillStyle:'color', strokeOpacity:'limited01', 
fillOpacity:'limited01', lineWidth:'number', lineCap:'enums(butt,round,square)', lineJoin:'enums(round,bevel,miter)', lineDash:'data', lineDashOffset:'number', miterLimit:'number', shadowColor:'color', shadowOffsetX:'number', shadowOffsetY:'number', shadowBlur:'number', globalAlpha:'limited01', globalCompositeOperation:'enums(source-over,destination-over,source-in,destination-in,source-out,destination-out,source-atop,destination-atop,lighter,xor,copy)', hidden:'bool', transformFillStroke:'bool', 
zIndex:'number', translationX:'number', translationY:'number', rotationRads:'number', rotationCenterX:'number', rotationCenterY:'number', scalingX:'number', scalingY:'number', scalingCenterX:'number', scalingCenterY:'number', constrainGradients:'bool'}, aliases:{'stroke':'strokeStyle', 'fill':'fillStyle', 'color':'fillStyle', 'stroke-width':'lineWidth', 'stroke-linecap':'lineCap', 'stroke-linejoin':'lineJoin', 'stroke-miterlimit':'miterLimit', 'text-anchor':'textAlign', 'opacity':'globalAlpha', translateX:'translationX', 
translateY:'translationY', rotateRads:'rotationRads', rotateCenterX:'rotationCenterX', rotateCenterY:'rotationCenterY', scaleX:'scalingX', scaleY:'scalingY', scaleCenterX:'scalingCenterX', scaleCenterY:'scalingCenterY'}, defaults:{hidden:false, zIndex:0, strokeStyle:'none', fillStyle:'none', lineWidth:1, lineDash:[], lineDashOffset:0, lineCap:'butt', lineJoin:'miter', miterLimit:10, shadowColor:'none', shadowOffsetX:0, shadowOffsetY:0, shadowBlur:0, globalAlpha:1, strokeOpacity:1, fillOpacity:1, 
transformFillStroke:false, translationX:0, translationY:0, rotationRads:0, rotationCenterX:null, rotationCenterY:null, scalingX:1, scalingY:1, scalingCenterX:null, scalingCenterY:null, constrainGradients:false}, triggers:{zIndex:'zIndex', globalAlpha:'canvas', globalCompositeOperation:'canvas', transformFillStroke:'canvas', strokeStyle:'canvas', fillStyle:'canvas', strokeOpacity:'canvas', fillOpacity:'canvas', lineWidth:'canvas', lineCap:'canvas', lineJoin:'canvas', lineDash:'canvas', lineDashOffset:'canvas', 
miterLimit:'canvas', shadowColor:'canvas', shadowOffsetX:'canvas', shadowOffsetY:'canvas', shadowBlur:'canvas', translationX:'transform', translationY:'transform', rotationRads:'transform', rotationCenterX:'transform', rotationCenterY:'transform', scalingX:'transform', scalingY:'transform', scalingCenterX:'transform', scalingCenterY:'transform', constrainGradients:'canvas'}, updaters:{bbox:'bboxUpdater', zIndex:function(attr) {
  attr.dirtyZIndex = true;
}, transform:function(attr) {
  attr.dirtyTransform = true;
  attr.bbox.transform.dirty = true;
}}}}, config:{parent:null, surface:null}, onClassExtended:function(subClass, data) {
  var superclassCfg = subClass.superclass.self.def.initialConfig, ownCfg = data.inheritableStatics && data.inheritableStatics.def, cfg;
  if (ownCfg) {
    cfg = Ext.Object.merge({}, superclassCfg, ownCfg);
    subClass.def = new Ext.draw.sprite.AttributeDefinition(cfg);
    delete data.inheritableStatics.def;
  } else {
    subClass.def = new Ext.draw.sprite.AttributeDefinition(superclassCfg);
  }
  subClass.def.spriteClass = subClass;
}, constructor:function(config) {
  if (Ext.getClassName(this) === 'Ext.draw.sprite.Sprite') {
    throw 'Ext.draw.sprite.Sprite is an abstract class';
  }
  var me = this, attributeDefinition = me.self.def, defaults = attributeDefinition.getDefaults(), processors = attributeDefinition.getProcessors(), modifiers, name;
  config = Ext.isObject(config) ? config : {};
  me.id = config.id || Ext.id(null, 'ext-sprite-');
  me.attr = {};
  me.mixins.observable.constructor.apply(me, arguments);
  modifiers = Ext.Array.from(config.modifiers, true);
  me.createModifiers(modifiers);
  me.initializeAttributes();
  me.setAttributes(defaults, true);
  for (name in config) {
    if (name in processors && me['get' + name.charAt(0).toUpperCase() + name.substr(1)]) {
      Ext.raise('The ' + me.$className + ' sprite has both a config and an attribute with the same name: ' + name + '.');
    }
  }
  me.setAttributes(config);
}, updateSurface:function(surface, oldSurface) {
  if (oldSurface) {
    oldSurface.remove(this);
  }
}, getDirty:function() {
  return this.attr.dirty;
}, setDirty:function(dirty) {
  this.attr.dirty = dirty;
  if (dirty) {
    var parent = this.getParent();
    if (parent) {
      parent.setDirty(true);
    }
  }
}, addModifier:function(modifier, reinitializeAttributes) {
  var me = this, mods = me.modifiers, animation = mods.animation, target = mods.target, type;
  if (!(modifier instanceof Ext.draw.modifier.Modifier)) {
    type = typeof modifier === 'string' ? modifier : modifier.type;
    if (type && !mods[type]) {
      mods[type] = modifier = Ext.factory(modifier, null, null, 'modifier');
    }
  }
  modifier.setSprite(me);
  if (modifier.preFx || modifier.config && modifier.config.preFx) {
    if (animation._lower) {
      animation._lower.setUpper(modifier);
    }
    modifier.setUpper(animation);
  } else {
    target._lower.setUpper(modifier);
    modifier.setUpper(target);
  }
  if (reinitializeAttributes) {
    me.initializeAttributes();
  }
  return modifier;
}, createModifiers:function(modifiers) {
  var me = this, Modifier = Ext.draw.modifier, animation = me.getInitialConfig().animation, mods, i, ln;
  me.modifiers = mods = {target:new Modifier.Target({sprite:me}), animation:new Modifier.Animation(Ext.apply({sprite:me}, animation))};
  mods.animation.setUpper(mods.target);
  for (i = 0, ln = modifiers.length; i < ln; i++) {
    me.addModifier(modifiers[i], false);
  }
  return mods;
}, getAnimation:function() {
  return this.modifiers.animation;
}, setAnimation:function(config) {
  if (!this.isConfiguring) {
    this.modifiers.animation.setConfig(config || {duration:0});
  }
}, initializeAttributes:function() {
  this.modifiers.target.prepareAttributes(this.attr);
}, callUpdaters:function(attr) {
  attr = attr || this.attr;
  var me = this, pendingUpdaters = attr.pendingUpdaters, updaters = me.self.def.getUpdaters(), any = false, dirty = false, flags, updater, fn;
  me.callUpdaters = Ext.emptyFn;
  do {
    any = false;
    for (updater in pendingUpdaters) {
      any = true;
      flags = pendingUpdaters[updater];
      delete pendingUpdaters[updater];
      fn = updaters[updater];
      if (typeof fn === 'string') {
        fn = me[fn];
      }
      if (fn) {
        fn.call(me, attr, flags);
      }
    }
    dirty = dirty || any;
  } while (any);
  delete me.callUpdaters;
  if (dirty) {
    me.setDirty(true);
  }
}, callUpdater:function(attr, updater, triggers) {
  this.scheduleUpdater(attr, updater, triggers);
  this.callUpdaters(attr);
}, scheduleUpdaters:function(attr, updaters, triggers) {
  var updater;
  attr = attr || this.attr;
  if (triggers) {
    for (var i = 0, ln = updaters.length; i < ln; i++) {
      updater = updaters[i];
      this.scheduleUpdater(attr, updater, triggers);
    }
  } else {
    for (updater in updaters) {
      triggers = updaters[updater];
      this.scheduleUpdater(attr, updater, triggers);
    }
  }
}, scheduleUpdater:function(attr, updater, triggers) {
  triggers = triggers || [];
  attr = attr || this.attr;
  var pendingUpdaters = attr.pendingUpdaters;
  if (updater in pendingUpdaters) {
    if (triggers.length) {
      pendingUpdaters[updater] = Ext.Array.merge(pendingUpdaters[updater], triggers);
    }
  } else {
    pendingUpdaters[updater] = triggers;
  }
}, setAttributes:function(changes, bypassNormalization, avoidCopy) {
  var me = this, changesToPush;
  if (me.destroyed) {
    Ext.Error.raise('Setting attributes of a destroyed sprite.');
  }
  if (bypassNormalization) {
    if (avoidCopy) {
      changesToPush = changes;
    } else {
      changesToPush = Ext.apply({}, changes);
    }
  } else {
    changesToPush = me.self.def.normalize(changes);
  }
  me.modifiers.target.pushDown(me.attr, changesToPush);
}, setAttributesBypassingNormalization:function(changes, avoidCopy) {
  return this.setAttributes(changes, true, avoidCopy);
}, bboxUpdater:function(attr) {
  var hasRotation = attr.rotationRads !== 0, hasScaling = attr.scalingX !== 1 || attr.scalingY !== 1, noRotationCenter = attr.rotationCenterX === null || attr.rotationCenterY === null, noScalingCenter = attr.scalingCenterX === null || attr.scalingCenterY === null;
  attr.bbox.plain.dirty = true;
  attr.bbox.transform.dirty = true;
  if (hasRotation && noRotationCenter || hasScaling && noScalingCenter) {
    this.scheduleUpdater(attr, 'transform');
  }
}, getBBox:function(isWithoutTransform) {
  var me = this, attr = me.attr, bbox = attr.bbox, plain = bbox.plain, transform = bbox.transform;
  if (plain.dirty) {
    me.updatePlainBBox(plain);
    plain.dirty = false;
  }
  if (!isWithoutTransform) {
    me.applyTransformations();
    if (transform.dirty) {
      me.updateTransformedBBox(transform, plain);
      transform.dirty = false;
    }
    return transform;
  }
  return plain;
}, updatePlainBBox:Ext.emptyFn, updateTransformedBBox:function(transform, plain) {
  this.attr.matrix.transformBBox(plain, 0, transform);
}, getBBoxCenter:function(isWithoutTransform) {
  var bbox = this.getBBox(isWithoutTransform);
  if (bbox) {
    return [bbox.x + bbox.width * 0.5, bbox.y + bbox.height * 0.5];
  } else {
    return [0, 0];
  }
}, hide:function() {
  this.attr.hidden = true;
  this.setDirty(true);
  return this;
}, show:function() {
  this.attr.hidden = false;
  this.setDirty(true);
  return this;
}, useAttributes:function(ctx, rect) {
  this.applyTransformations(this.isSpriteInstance);
  var attr = this.attr, canvasAttributes = attr.canvasAttributes, strokeStyle = canvasAttributes.strokeStyle, fillStyle = canvasAttributes.fillStyle, lineDash = canvasAttributes.lineDash, lineDashOffset = canvasAttributes.lineDashOffset, id;
  if (strokeStyle) {
    if (strokeStyle.isGradient) {
      ctx.strokeStyle = 'black';
      ctx.strokeGradient = strokeStyle;
    } else {
      ctx.strokeGradient = false;
    }
  }
  if (fillStyle) {
    if (fillStyle.isGradient) {
      ctx.fillStyle = 'black';
      ctx.fillGradient = fillStyle;
    } else {
      ctx.fillGradient = false;
    }
  }
  if (lineDash) {
    ctx.setLineDash(lineDash);
  }
  if (Ext.isNumber(lineDashOffset) && Ext.isNumber(ctx.lineDashOffset)) {
    ctx.lineDashOffset = lineDashOffset;
  }
  for (id in canvasAttributes) {
    if (canvasAttributes[id] !== undefined && canvasAttributes[id] !== ctx[id]) {
      ctx[id] = canvasAttributes[id];
    }
  }
  this.setGradientBBox(ctx, rect);
}, setGradientBBox:function(ctx, rect) {
  var attr = this.attr;
  if (attr.constrainGradients) {
    ctx.setGradientBBox({x:rect[0], y:rect[1], width:rect[2], height:rect[3]});
  } else {
    ctx.setGradientBBox(this.getBBox(attr.transformFillStroke));
  }
}, applyTransformations:function(force) {
  if (!force && !this.attr.dirtyTransform) {
    return;
  }
  var me = this, attr = me.attr, center = me.getBBoxCenter(true), centerX = center[0], centerY = center[1], tx = attr.translationX, ty = attr.translationY, sx = attr.scalingX, sy = attr.scalingY === null ? attr.scalingX : attr.scalingY, scx = attr.scalingCenterX === null ? centerX : attr.scalingCenterX, scy = attr.scalingCenterY === null ? centerY : attr.scalingCenterY, rad = attr.rotationRads, rcx = attr.rotationCenterX === null ? centerX : attr.rotationCenterX, rcy = attr.rotationCenterY === null ? 
  centerY : attr.rotationCenterY, cos = Math.cos(rad), sin = Math.sin(rad), tx_4, ty_4;
  if (sx === 1 && sy === 1) {
    scx = 0;
    scy = 0;
  }
  if (rad === 0) {
    rcx = 0;
    rcy = 0;
  }
  tx_4 = scx * (1 - sx) - rcx;
  ty_4 = scy * (1 - sy) - rcy;
  attr.matrix.elements = [cos * sx, sin * sx, -sin * sy, cos * sy, cos * tx_4 - sin * ty_4 + rcx + tx, sin * tx_4 + cos * ty_4 + rcy + ty];
  attr.matrix.inverse(attr.inverseMatrix);
  attr.dirtyTransform = false;
  attr.bbox.transform.dirty = true;
}, transform:function(matrix, isSplit) {
  var attr = this.attr, spriteMatrix = attr.matrix, elements;
  if (matrix && matrix.isMatrix) {
    elements = matrix.elements;
  } else {
    elements = matrix;
  }
  if (!(Ext.isArray(elements) && elements.length === 6)) {
    Ext.raise('An instance of Ext.draw.Matrix or an array of 6 numbers is expected.');
  }
  spriteMatrix.prepend.apply(spriteMatrix, elements.slice());
  spriteMatrix.inverse(attr.inverseMatrix);
  if (isSplit) {
    this.updateTransformAttributes();
  }
  attr.dirtyTransform = false;
  attr.bbox.transform.dirty = true;
  this.setDirty(true);
  return this;
}, updateTransformAttributes:function() {
  var attr = this.attr, split = attr.matrix.split();
  attr.rotationRads = split.rotate;
  attr.rotationCenterX = 0;
  attr.rotationCenterY = 0;
  attr.scalingX = split.scaleX;
  attr.scalingY = split.scaleY;
  attr.scalingCenterX = 0;
  attr.scalingCenterY = 0;
  attr.translationX = split.translateX;
  attr.translationY = split.translateY;
}, resetTransform:function(isSplit) {
  var attr = this.attr;
  attr.matrix.reset();
  attr.inverseMatrix.reset();
  if (!isSplit) {
    this.updateTransformAttributes();
  }
  attr.dirtyTransform = false;
  attr.bbox.transform.dirty = true;
  this.setDirty(true);
  return this;
}, setTransform:function(matrix, isSplit) {
  this.resetTransform(true);
  this.transform.call(this, matrix, isSplit);
  return this;
}, preRender:Ext.emptyFn, render:Ext.emptyFn, renderBBox:function(surface, ctx) {
  var bbox = this.getBBox();
  ctx.beginPath();
  ctx.moveTo(bbox.x, bbox.y);
  ctx.lineTo(bbox.x + bbox.width, bbox.y);
  ctx.lineTo(bbox.x + bbox.width, bbox.y + bbox.height);
  ctx.lineTo(bbox.x, bbox.y + bbox.height);
  ctx.closePath();
  ctx.strokeStyle = 'red';
  ctx.strokeOpacity = 1;
  ctx.lineWidth = 0.5;
  ctx.stroke();
}, hitTest:function(point, options) {
  if (this.isVisible()) {
    var x = point[0], y = point[1], bbox = this.getBBox(), isBBoxHit = bbox && x >= bbox.x && x <= bbox.x + bbox.width && y >= bbox.y && y <= bbox.y + bbox.height;
    if (isBBoxHit) {
      return {sprite:this};
    }
  }
  return null;
}, isVisible:function() {
  var attr = this.attr, parent = this.getParent(), hasParent = parent && (parent.isSurface || parent.isVisible()), isSeen = hasParent && !attr.hidden && attr.globalAlpha, none1 = Ext.util.Color.NONE, none2 = Ext.util.Color.RGBA_NONE, hasFill = attr.fillOpacity && attr.fillStyle !== none1 && attr.fillStyle !== none2, hasStroke = attr.strokeOpacity && attr.strokeStyle !== none1 && attr.strokeStyle !== none2, result = isSeen && (hasFill || hasStroke);
  return !!result;
}, repaint:function() {
  var surface = this.getSurface();
  if (surface) {
    surface.renderFrame();
  }
}, remove:function() {
  var surface = this.getSurface();
  if (surface && surface.isSurface) {
    return surface.remove(this);
  }
  return null;
}, destroy:function() {
  var me = this, modifier = me.modifiers.target, currentModifier;
  while (modifier) {
    currentModifier = modifier;
    modifier = modifier._lower;
    currentModifier.destroy();
  }
  delete me.attr;
  me.remove();
  if (me.fireEvent('beforedestroy', me) !== false) {
    me.fireEvent('destroy', me);
  }
  me.callParent();
}}, function() {
  this.def = new Ext.draw.sprite.AttributeDefinition(this.def);
  this.def.spriteClass = this;
});
Ext.define('Ext.draw.Path', {requires:['Ext.draw.Draw'], statics:{pathRe:/,?([achlmqrstvxz]),?/gi, pathRe2:/-/gi, pathSplitRe:/\s|,/g}, svgString:'', constructor:function(pathString) {
  var me = this;
  me.commands = [];
  me.params = [];
  me.cursor = null;
  me.startX = 0;
  me.startY = 0;
  if (pathString) {
    me.fromSvgString(pathString);
  }
}, clear:function() {
  var me = this;
  me.params.length = 0;
  me.commands.length = 0;
  me.cursor = null;
  me.startX = 0;
  me.startY = 0;
  me.dirt();
}, dirt:function() {
  this.svgString = '';
}, moveTo:function(x, y) {
  var me = this;
  if (!me.cursor) {
    me.cursor = [x, y];
  }
  me.params.push(x, y);
  me.commands.push('M');
  me.startX = x;
  me.startY = y;
  me.cursor[0] = x;
  me.cursor[1] = y;
  me.dirt();
}, lineTo:function(x, y) {
  var me = this;
  if (!me.cursor) {
    me.cursor = [x, y];
    me.params.push(x, y);
    me.commands.push('M');
  } else {
    me.params.push(x, y);
    me.commands.push('L');
  }
  me.cursor[0] = x;
  me.cursor[1] = y;
  me.dirt();
}, bezierCurveTo:function(cx1, cy1, cx2, cy2, x, y) {
  var me = this;
  if (!me.cursor) {
    me.moveTo(cx1, cy1);
  }
  me.params.push(cx1, cy1, cx2, cy2, x, y);
  me.commands.push('C');
  me.cursor[0] = x;
  me.cursor[1] = y;
  me.dirt();
}, quadraticCurveTo:function(cx, cy, x, y) {
  var me = this;
  if (!me.cursor) {
    me.moveTo(cx, cy);
  }
  me.bezierCurveTo((2 * cx + me.cursor[0]) / 3, (2 * cy + me.cursor[1]) / 3, (2 * cx + x) / 3, (2 * cy + y) / 3, x, y);
}, closePath:function() {
  var me = this;
  if (me.cursor) {
    me.cursor = null;
    me.commands.push('Z');
    me.dirt();
  }
}, arcTo:function(x1, y1, x2, y2, rx, ry, rotation) {
  var me = this;
  if (ry === undefined) {
    ry = rx;
  }
  if (rotation === undefined) {
    rotation = 0;
  }
  if (!me.cursor) {
    me.moveTo(x1, y1);
    return;
  }
  if (rx === 0 || ry === 0) {
    me.lineTo(x1, y1);
    return;
  }
  x2 -= x1;
  y2 -= y1;
  var x0 = me.cursor[0] - x1, y0 = me.cursor[1] - y1, area = x2 * y0 - y2 * x0, cos, sin, xx, yx, xy, yy, l0 = Math.sqrt(x0 * x0 + y0 * y0), l2 = Math.sqrt(x2 * x2 + y2 * y2), dist, cx, cy;
  if (area === 0) {
    me.lineTo(x1, y1);
    return;
  }
  if (ry !== rx) {
    cos = Math.cos(rotation);
    sin = Math.sin(rotation);
    xx = cos / rx;
    yx = sin / ry;
    xy = -sin / rx;
    yy = cos / ry;
    var temp = xx * x0 + yx * y0;
    y0 = xy * x0 + yy * y0;
    x0 = temp;
    temp = xx * x2 + yx * y2;
    y2 = xy * x2 + yy * y2;
    x2 = temp;
  } else {
    x0 /= rx;
    y0 /= ry;
    x2 /= rx;
    y2 /= ry;
  }
  cx = x0 * l2 + x2 * l0;
  cy = y0 * l2 + y2 * l0;
  dist = 1 / (Math.sin(Math.asin(Math.abs(area) / (l0 * l2)) * 0.5) * Math.sqrt(cx * cx + cy * cy));
  cx *= dist;
  cy *= dist;
  var k0 = (cx * x0 + cy * y0) / (x0 * x0 + y0 * y0), k2 = (cx * x2 + cy * y2) / (x2 * x2 + y2 * y2);
  var cosStart = x0 * k0 - cx, sinStart = y0 * k0 - cy, cosEnd = x2 * k2 - cx, sinEnd = y2 * k2 - cy, startAngle = Math.atan2(sinStart, cosStart), endAngle = Math.atan2(sinEnd, cosEnd);
  if (area > 0) {
    if (endAngle < startAngle) {
      endAngle += Math.PI * 2;
    }
  } else {
    if (startAngle < endAngle) {
      startAngle += Math.PI * 2;
    }
  }
  if (ry !== rx) {
    cx = cos * cx * rx - sin * cy * ry + x1;
    cy = sin * cy * ry + cos * cy * ry + y1;
    me.lineTo(cos * rx * cosStart - sin * ry * sinStart + cx, sin * rx * cosStart + cos * ry * sinStart + cy);
    me.ellipse(cx, cy, rx, ry, rotation, startAngle, endAngle, area < 0);
  } else {
    cx = cx * rx + x1;
    cy = cy * ry + y1;
    me.lineTo(rx * cosStart + cx, ry * sinStart + cy);
    me.ellipse(cx, cy, rx, ry, rotation, startAngle, endAngle, area < 0);
  }
}, ellipse:function(cx, cy, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
  var me = this, params = me.params, start = params.length, count, i, j;
  if (endAngle - startAngle >= Math.PI * 2) {
    me.ellipse(cx, cy, radiusX, radiusY, rotation, startAngle, startAngle + Math.PI, anticlockwise);
    me.ellipse(cx, cy, radiusX, radiusY, rotation, startAngle + Math.PI, endAngle, anticlockwise);
    return;
  }
  if (!anticlockwise) {
    if (endAngle < startAngle) {
      endAngle += Math.PI * 2;
    }
    count = me.approximateArc(params, cx, cy, radiusX, radiusY, rotation, startAngle, endAngle);
  } else {
    if (startAngle < endAngle) {
      startAngle += Math.PI * 2;
    }
    count = me.approximateArc(params, cx, cy, radiusX, radiusY, rotation, endAngle, startAngle);
    for (i = start, j = params.length - 2; i < j; i += 2, j -= 2) {
      var temp = params[i];
      params[i] = params[j];
      params[j] = temp;
      temp = params[i + 1];
      params[i + 1] = params[j + 1];
      params[j + 1] = temp;
    }
  }
  if (!me.cursor) {
    me.cursor = [params[params.length - 2], params[params.length - 1]];
    me.commands.push('M');
  } else {
    me.cursor[0] = params[params.length - 2];
    me.cursor[1] = params[params.length - 1];
    me.commands.push('L');
  }
  for (i = 2; i < count; i += 6) {
    me.commands.push('C');
  }
  me.dirt();
}, arc:function(x, y, radius, startAngle, endAngle, anticlockwise) {
  this.ellipse(x, y, radius, radius, 0, startAngle, endAngle, anticlockwise);
}, rect:function(x, y, width, height) {
  if (width == 0 || height == 0) {
    return;
  }
  var me = this;
  me.moveTo(x, y);
  me.lineTo(x + width, y);
  me.lineTo(x + width, y + height);
  me.lineTo(x, y + height);
  me.closePath();
}, approximateArc:function(result, cx, cy, rx, ry, phi, theta1, theta2) {
  var cosPhi = Math.cos(phi), sinPhi = Math.sin(phi), cosTheta1 = Math.cos(theta1), sinTheta1 = Math.sin(theta1), xx = cosPhi * cosTheta1 * rx - sinPhi * sinTheta1 * ry, yx = -cosPhi * sinTheta1 * rx - sinPhi * cosTheta1 * ry, xy = sinPhi * cosTheta1 * rx + cosPhi * sinTheta1 * ry, yy = -sinPhi * sinTheta1 * rx + cosPhi * cosTheta1 * ry, rightAngle = Math.PI / 2, count = 2, exx = xx, eyx = yx, exy = xy, eyy = yy, rho = 0.547443256150549, temp, y1, x3, y3, x2, y2;
  theta2 -= theta1;
  if (theta2 < 0) {
    theta2 += Math.PI * 2;
  }
  result.push(xx + cx, xy + cy);
  while (theta2 >= rightAngle) {
    result.push(exx + eyx * rho + cx, exy + eyy * rho + cy, exx * rho + eyx + cx, exy * rho + eyy + cy, eyx + cx, eyy + cy);
    count += 6;
    theta2 -= rightAngle;
    temp = exx;
    exx = eyx;
    eyx = -temp;
    temp = exy;
    exy = eyy;
    eyy = -temp;
  }
  if (theta2) {
    y1 = (0.3294738052815987 + 0.012120855841304373 * theta2) * theta2;
    x3 = Math.cos(theta2);
    y3 = Math.sin(theta2);
    x2 = x3 + y1 * y3;
    y2 = y3 - y1 * x3;
    result.push(exx + eyx * y1 + cx, exy + eyy * y1 + cy, exx * x2 + eyx * y2 + cx, exy * x2 + eyy * y2 + cy, exx * x3 + eyx * y3 + cx, exy * x3 + eyy * y3 + cy);
    count += 6;
  }
  return count;
}, arcSvg:function(rx, ry, rotation, fA, fS, x2, y2) {
  if (rx < 0) {
    rx = -rx;
  }
  if (ry < 0) {
    ry = -ry;
  }
  var me = this, x1 = me.cursor[0], y1 = me.cursor[1], hdx = (x1 - x2) / 2, hdy = (y1 - y2) / 2, cosPhi = Math.cos(rotation), sinPhi = Math.sin(rotation), xp = hdx * cosPhi + hdy * sinPhi, yp = -hdx * sinPhi + hdy * cosPhi, ratX = xp / rx, ratY = yp / ry, lambda = ratX * ratX + ratY * ratY, cx = (x1 + x2) * 0.5, cy = (y1 + y2) * 0.5, cpx = 0, cpy = 0;
  if (lambda >= 1) {
    lambda = Math.sqrt(lambda);
    rx *= lambda;
    ry *= lambda;
  } else {
    lambda = Math.sqrt(1 / lambda - 1);
    if (fA === fS) {
      lambda = -lambda;
    }
    cpx = lambda * rx * ratY;
    cpy = -lambda * ry * ratX;
    cx += cosPhi * cpx - sinPhi * cpy;
    cy += sinPhi * cpx + cosPhi * cpy;
  }
  var theta1 = Math.atan2((yp - cpy) / ry, (xp - cpx) / rx), deltaTheta = Math.atan2((-yp - cpy) / ry, (-xp - cpx) / rx) - theta1;
  if (fS) {
    if (deltaTheta <= 0) {
      deltaTheta += Math.PI * 2;
    }
  } else {
    if (deltaTheta >= 0) {
      deltaTheta -= Math.PI * 2;
    }
  }
  me.ellipse(cx, cy, rx, ry, rotation, theta1, theta1 + deltaTheta, 1 - fS);
}, fromSvgString:function(pathString) {
  if (!pathString) {
    return;
  }
  var me = this, parts, paramCounts = {a:7, c:6, h:1, l:2, m:2, q:4, s:4, t:2, v:1, z:0, A:7, C:6, H:1, L:2, M:2, Q:4, S:4, T:2, V:1, Z:0}, lastCommand = '', lastControlX, lastControlY, lastX = 0, lastY = 0, part = false, i, partLength, relative;
  if (Ext.isString(pathString)) {
    parts = pathString.replace(Ext.draw.Path.pathRe, ' $1 ').replace(Ext.draw.Path.pathRe2, ' -').split(Ext.draw.Path.pathSplitRe);
  } else {
    if (Ext.isArray(pathString)) {
      parts = pathString.join(',').split(Ext.draw.Path.pathSplitRe);
    }
  }
  for (i = 0, partLength = 0; i < parts.length; i++) {
    if (parts[i] !== '') {
      parts[partLength++] = parts[i];
    }
  }
  parts.length = partLength;
  me.clear();
  for (i = 0; i < parts.length;) {
    lastCommand = part;
    part = parts[i];
    relative = part.toUpperCase() !== part;
    i++;
    switch(part) {
      case 'M':
        me.moveTo(lastX = +parts[i], lastY = +parts[i + 1]);
        i += 2;
        while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
          me.lineTo(lastX = +parts[i], lastY = +parts[i + 1]);
          i += 2;
        }
        break;
      case 'L':
        me.lineTo(lastX = +parts[i], lastY = +parts[i + 1]);
        i += 2;
        while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
          me.lineTo(lastX = +parts[i], lastY = +parts[i + 1]);
          i += 2;
        }
        break;
      case 'A':
        while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
          me.arcSvg(+parts[i], +parts[i + 1], +parts[i + 2] * Math.PI / 180, +parts[i + 3], +parts[i + 4], lastX = +parts[i + 5], lastY = +parts[i + 6]);
          i += 7;
        }
        break;
      case 'C':
        while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
          me.bezierCurveTo(+parts[i], +parts[i + 1], lastControlX = +parts[i + 2], lastControlY = +parts[i + 3], lastX = +parts[i + 4], lastY = +parts[i + 5]);
          i += 6;
        }
        break;
      case 'Z':
        me.closePath();
        break;
      case 'm':
        me.moveTo(lastX += +parts[i], lastY += +parts[i + 1]);
        i += 2;
        while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
          me.lineTo(lastX += +parts[i], lastY += +parts[i + 1]);
          i += 2;
        }
        break;
      case 'l':
        me.lineTo(lastX += +parts[i], lastY += +parts[i + 1]);
        i += 2;
        while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
          me.lineTo(lastX += +parts[i], lastY += +parts[i + 1]);
          i += 2;
        }
        break;
      case 'a':
        while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
          me.arcSvg(+parts[i], +parts[i + 1], +parts[i + 2] * Math.PI / 180, +parts[i + 3], +parts[i + 4], lastX += +parts[i + 5], lastY += +parts[i + 6]);
          i += 7;
        }
        break;
      case 'c':
        while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
          me.bezierCurveTo(lastX + +parts[i], lastY + +parts[i + 1], lastControlX = lastX + +parts[i + 2], lastControlY = lastY + +parts[i + 3], lastX += +parts[i + 4], lastY += +parts[i + 5]);
          i += 6;
        }
        break;
      case 'z':
        me.closePath();
        break;
      case 's':
        if (!(lastCommand === 'c' || lastCommand === 'C' || lastCommand === 's' || lastCommand === 'S')) {
          lastControlX = lastX;
          lastControlY = lastY;
        }
        while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
          me.bezierCurveTo(lastX + lastX - lastControlX, lastY + lastY - lastControlY, lastControlX = lastX + +parts[i], lastControlY = lastY + +parts[i + 1], lastX += +parts[i + 2], lastY += +parts[i + 3]);
          i += 4;
        }
        break;
      case 'S':
        if (!(lastCommand === 'c' || lastCommand === 'C' || lastCommand === 's' || lastCommand === 'S')) {
          lastControlX = lastX;
          lastControlY = lastY;
        }
        while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
          me.bezierCurveTo(lastX + lastX - lastControlX, lastY + lastY - lastControlY, lastControlX = +parts[i], lastControlY = +parts[i + 1], lastX = +parts[i + 2], lastY = +parts[i + 3]);
          i += 4;
        }
        break;
      case 'q':
        while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
          me.quadraticCurveTo(lastControlX = lastX + +parts[i], lastControlY = lastY + +parts[i + 1], lastX += +parts[i + 2], lastY += +parts[i + 3]);
          i += 4;
        }
        break;
      case 'Q':
        while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
          me.quadraticCurveTo(lastControlX = +parts[i], lastControlY = +parts[i + 1], lastX = +parts[i + 2], lastY = +parts[i + 3]);
          i += 4;
        }
        break;
      case 't':
        if (!(lastCommand === 'q' || lastCommand === 'Q' || lastCommand === 't' || lastCommand === 'T')) {
          lastControlX = lastX;
          lastControlY = lastY;
        }
        while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
          me.quadraticCurveTo(lastControlX = lastX + lastX - lastControlX, lastControlY = lastY + lastY - lastControlY, lastX += +parts[i + 1], lastY += +parts[i + 2]);
          i += 2;
        }
        break;
      case 'T':
        if (!(lastCommand === 'q' || lastCommand === 'Q' || lastCommand === 't' || lastCommand === 'T')) {
          lastControlX = lastX;
          lastControlY = lastY;
        }
        while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
          me.quadraticCurveTo(lastControlX = lastX + lastX - lastControlX, lastControlY = lastY + lastY - lastControlY, lastX = +parts[i + 1], lastY = +parts[i + 2]);
          i += 2;
        }
        break;
      case 'h':
        while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
          me.lineTo(lastX += +parts[i], lastY);
          i++;
        }
        break;
      case 'H':
        while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
          me.lineTo(lastX = +parts[i], lastY);
          i++;
        }
        break;
      case 'v':
        while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
          me.lineTo(lastX, lastY += +parts[i]);
          i++;
        }
        break;
      case 'V':
        while (i < partLength && !paramCounts.hasOwnProperty(parts[i])) {
          me.lineTo(lastX, lastY = +parts[i]);
          i++;
        }
        break;
    }
  }
}, clone:function() {
  var me = this, path = new Ext.draw.Path;
  path.params = me.params.slice(0);
  path.commands = me.commands.slice(0);
  path.cursor = me.cursor ? me.cursor.slice(0) : null;
  path.startX = me.startX;
  path.startY = me.startY;
  path.svgString = me.svgString;
  return path;
}, transform:function(matrix) {
  if (matrix.isIdentity()) {
    return;
  }
  var xx = matrix.getXX(), yx = matrix.getYX(), dx = matrix.getDX(), xy = matrix.getXY(), yy = matrix.getYY(), dy = matrix.getDY(), params = this.params, i = 0, ln = params.length, x, y;
  for (; i < ln; i += 2) {
    x = params[i];
    y = params[i + 1];
    params[i] = x * xx + y * yx + dx;
    params[i + 1] = x * xy + y * yy + dy;
  }
  this.dirt();
}, getDimension:function(target) {
  if (!target) {
    target = {};
  }
  if (!this.commands || !this.commands.length) {
    target.x = 0;
    target.y = 0;
    target.width = 0;
    target.height = 0;
    return target;
  }
  target.left = Infinity;
  target.top = Infinity;
  target.right = -Infinity;
  target.bottom = -Infinity;
  var i = 0, j = 0, commands = this.commands, params = this.params, ln = commands.length, x, y;
  for (; i < ln; i++) {
    switch(commands[i]) {
      case 'M':
      case 'L':
        x = params[j];
        y = params[j + 1];
        target.left = Math.min(x, target.left);
        target.top = Math.min(y, target.top);
        target.right = Math.max(x, target.right);
        target.bottom = Math.max(y, target.bottom);
        j += 2;
        break;
      case 'C':
        this.expandDimension(target, x, y, params[j], params[j + 1], params[j + 2], params[j + 3], x = params[j + 4], y = params[j + 5]);
        j += 6;
        break;
    }
  }
  target.x = target.left;
  target.y = target.top;
  target.width = target.right - target.left;
  target.height = target.bottom - target.top;
  return target;
}, getDimensionWithTransform:function(matrix, target) {
  if (!this.commands || !this.commands.length) {
    if (!target) {
      target = {};
    }
    target.x = 0;
    target.y = 0;
    target.width = 0;
    target.height = 0;
    return target;
  }
  target.left = Infinity;
  target.top = Infinity;
  target.right = -Infinity;
  target.bottom = -Infinity;
  var xx = matrix.getXX(), yx = matrix.getYX(), dx = matrix.getDX(), xy = matrix.getXY(), yy = matrix.getYY(), dy = matrix.getDY(), i = 0, j = 0, commands = this.commands, params = this.params, ln = commands.length, x, y;
  for (; i < ln; i++) {
    switch(commands[i]) {
      case 'M':
      case 'L':
        x = params[j] * xx + params[j + 1] * yx + dx;
        y = params[j] * xy + params[j + 1] * yy + dy;
        target.left = Math.min(x, target.left);
        target.top = Math.min(y, target.top);
        target.right = Math.max(x, target.right);
        target.bottom = Math.max(y, target.bottom);
        j += 2;
        break;
      case 'C':
        this.expandDimension(target, x, y, params[j] * xx + params[j + 1] * yx + dx, params[j] * xy + params[j + 1] * yy + dy, params[j + 2] * xx + params[j + 3] * yx + dx, params[j + 2] * xy + params[j + 3] * yy + dy, x = params[j + 4] * xx + params[j + 5] * yx + dx, y = params[j + 4] * xy + params[j + 5] * yy + dy);
        j += 6;
        break;
    }
  }
  if (!target) {
    target = {};
  }
  target.x = target.left;
  target.y = target.top;
  target.width = target.right - target.left;
  target.height = target.bottom - target.top;
  return target;
}, expandDimension:function(target, x1, y1, cx1, cy1, cx2, cy2, x2, y2) {
  var me = this, l = target.left, r = target.right, t = target.top, b = target.bottom, dim = me.dim || (me.dim = []);
  me.curveDimension(x1, cx1, cx2, x2, dim);
  l = Math.min(l, dim[0]);
  r = Math.max(r, dim[1]);
  me.curveDimension(y1, cy1, cy2, y2, dim);
  t = Math.min(t, dim[0]);
  b = Math.max(b, dim[1]);
  target.left = l;
  target.right = r;
  target.top = t;
  target.bottom = b;
}, curveDimension:function(a, b, c, d, dim) {
  var qa = 3 * (-a + 3 * (b - c) + d), qb = 6 * (a - 2 * b + c), qc = -3 * (a - b), x, y, min = Math.min(a, d), max = Math.max(a, d), delta;
  if (qa === 0) {
    if (qb === 0) {
      dim[0] = min;
      dim[1] = max;
      return;
    } else {
      x = -qc / qb;
      if (0 < x && x < 1) {
        y = this.interpolate(a, b, c, d, x);
        min = Math.min(min, y);
        max = Math.max(max, y);
      }
    }
  } else {
    delta = qb * qb - 4 * qa * qc;
    if (delta >= 0) {
      delta = Math.sqrt(delta);
      x = (delta - qb) / 2 / qa;
      if (0 < x && x < 1) {
        y = this.interpolate(a, b, c, d, x);
        min = Math.min(min, y);
        max = Math.max(max, y);
      }
      if (delta > 0) {
        x -= delta / qa;
        if (0 < x && x < 1) {
          y = this.interpolate(a, b, c, d, x);
          min = Math.min(min, y);
          max = Math.max(max, y);
        }
      }
    }
  }
  dim[0] = min;
  dim[1] = max;
}, interpolate:function(a, b, c, d, t) {
  if (t === 0) {
    return a;
  }
  if (t === 1) {
    return d;
  }
  var rate = (1 - t) / t;
  return t * t * t * (d + rate * (3 * c + rate * (3 * b + rate * a)));
}, fromStripes:function(stripes) {
  var me = this, i = 0, ln = stripes.length, j, ln2, stripe;
  me.clear();
  for (; i < ln; i++) {
    stripe = stripes[i];
    me.params.push.apply(me.params, stripe);
    me.commands.push('M');
    for (j = 2, ln2 = stripe.length; j < ln2; j += 6) {
      me.commands.push('C');
    }
  }
  if (!me.cursor) {
    me.cursor = [];
  }
  me.cursor[0] = me.params[me.params.length - 2];
  me.cursor[1] = me.params[me.params.length - 1];
  me.dirt();
}, toStripes:function(target) {
  var stripes = target || [], curr, x, y, lastX, lastY, startX, startY, i, j, commands = this.commands, params = this.params, ln = commands.length;
  for (i = 0, j = 0; i < ln; i++) {
    switch(commands[i]) {
      case 'M':
        curr = [startX = lastX = params[j++], startY = lastY = params[j++]];
        stripes.push(curr);
        break;
      case 'L':
        x = params[j++];
        y = params[j++];
        curr.push((lastX + lastX + x) / 3, (lastY + lastY + y) / 3, (lastX + x + x) / 3, (lastY + y + y) / 3, lastX = x, lastY = y);
        break;
      case 'C':
        curr.push(params[j++], params[j++], params[j++], params[j++], lastX = params[j++], lastY = params[j++]);
        break;
      case 'Z':
        x = startX;
        y = startY;
        curr.push((lastX + lastX + x) / 3, (lastY + lastY + y) / 3, (lastX + x + x) / 3, (lastY + y + y) / 3, lastX = x, lastY = y);
        break;
    }
  }
  return stripes;
}, updateSvgString:function() {
  var result = [], commands = this.commands, params = this.params, ln = commands.length, i = 0, j = 0;
  for (; i < ln; i++) {
    switch(commands[i]) {
      case 'M':
        result.push('M' + params[j] + ',' + params[j + 1]);
        j += 2;
        break;
      case 'L':
        result.push('L' + params[j] + ',' + params[j + 1]);
        j += 2;
        break;
      case 'C':
        result.push('C' + params[j] + ',' + params[j + 1] + ' ' + params[j + 2] + ',' + params[j + 3] + ' ' + params[j + 4] + ',' + params[j + 5]);
        j += 6;
        break;
      case 'Z':
        result.push('Z');
        break;
    }
  }
  this.svgString = result.join('');
}, toString:function() {
  if (!this.svgString) {
    this.updateSvgString();
  }
  return this.svgString;
}});
Ext.define('Ext.draw.overrides.hittest.Path', {override:'Ext.draw.Path', rayOrigin:{x:-10000, y:-10000}, isPointInPath:function(x, y) {
  var me = this, commands = me.commands, solver = Ext.draw.PathUtil, origin = me.rayOrigin, params = me.params, ln = commands.length, firstX = null, firstY = null, lastX = 0, lastY = 0, count = 0, i, j;
  for (i = 0, j = 0; i < ln; i++) {
    switch(commands[i]) {
      case 'M':
        if (firstX !== null) {
          if (solver.linesIntersection(firstX, firstY, lastX, lastY, origin.x, origin.y, x, y)) {
            count += 1;
          }
        }
        firstX = lastX = params[j];
        firstY = lastY = params[j + 1];
        j += 2;
        break;
      case 'L':
        if (solver.linesIntersection(lastX, lastY, params[j], params[j + 1], origin.x, origin.y, x, y)) {
          count += 1;
        }
        lastX = params[j];
        lastY = params[j + 1];
        j += 2;
        break;
      case 'C':
        count += solver.cubicLineIntersections(lastX, params[j], params[j + 2], params[j + 4], lastY, params[j + 1], params[j + 3], params[j + 5], origin.x, origin.y, x, y).length;
        lastX = params[j + 4];
        lastY = params[j + 5];
        j += 6;
        break;
      case 'Z':
        if (firstX !== null) {
          if (solver.linesIntersection(firstX, firstY, lastX, lastY, origin.x, origin.y, x, y)) {
            count += 1;
          }
        }
        break;
    }
  }
  return count % 2 === 1;
}, isPointOnPath:function(x, y) {
  var me = this, commands = me.commands, solver = Ext.draw.PathUtil, params = me.params, ln = commands.length, firstX = null, firstY = null, lastX = 0, lastY = 0, i, j;
  for (i = 0, j = 0; i < ln; i++) {
    switch(commands[i]) {
      case 'M':
        if (firstX !== null) {
          if (solver.pointOnLine(firstX, firstY, lastX, lastY, x, y)) {
            return true;
          }
        }
        firstX = lastX = params[j];
        firstY = lastY = params[j + 1];
        j += 2;
        break;
      case 'L':
        if (solver.pointOnLine(lastX, lastY, params[j], params[j + 1], x, y)) {
          return true;
        }
        lastX = params[j];
        lastY = params[j + 1];
        j += 2;
        break;
      case 'C':
        if (solver.pointOnCubic(lastX, params[j], params[j + 2], params[j + 4], lastY, params[j + 1], params[j + 3], params[j + 5], x, y)) {
          return true;
        }
        lastX = params[j + 4];
        lastY = params[j + 5];
        j += 6;
        break;
      case 'Z':
        if (firstX !== null) {
          if (solver.pointOnLine(firstX, firstY, lastX, lastY, x, y)) {
            return true;
          }
        }
        break;
    }
  }
  return false;
}, getSegmentIntersections:function(x1, y1, x2, y2, x3, y3, x4, y4) {
  var me = this, count = arguments.length, solver = Ext.draw.PathUtil, commands = me.commands, params = me.params, ln = commands.length, firstX = null, firstY = null, lastX = 0, lastY = 0, intersections = [], i, j, points;
  for (i = 0, j = 0; i < ln; i++) {
    switch(commands[i]) {
      case 'M':
        if (firstX !== null) {
          switch(count) {
            case 4:
              points = solver.linesIntersection(firstX, firstY, lastX, lastY, x1, y1, x2, y2);
              if (points) {
                intersections.push(points);
              }
              break;
            case 8:
              points = solver.cubicLineIntersections(x1, x2, x3, x4, y1, y2, y3, y4, firstX, firstY, lastX, lastY);
              intersections.push.apply(intersections, points);
              break;
          }
        }
        firstX = lastX = params[j];
        firstY = lastY = params[j + 1];
        j += 2;
        break;
      case 'L':
        switch(count) {
          case 4:
            points = solver.linesIntersection(lastX, lastY, params[j], params[j + 1], x1, y1, x2, y2);
            if (points) {
              intersections.push(points);
            }
            break;
          case 8:
            points = solver.cubicLineIntersections(x1, x2, x3, x4, y1, y2, y3, y4, lastX, lastY, params[j], params[j + 1]);
            intersections.push.apply(intersections, points);
            break;
        }lastX = params[j];
        lastY = params[j + 1];
        j += 2;
        break;
      case 'C':
        switch(count) {
          case 4:
            points = solver.cubicLineIntersections(lastX, params[j], params[j + 2], params[j + 4], lastY, params[j + 1], params[j + 3], params[j + 5], x1, y1, x2, y2);
            intersections.push.apply(intersections, points);
            break;
          case 8:
            points = solver.cubicsIntersections(lastX, params[j], params[j + 2], params[j + 4], lastY, params[j + 1], params[j + 3], params[j + 5], x1, x2, x3, x4, y1, y2, y3, y4);
            intersections.push.apply(intersections, points);
            break;
        }lastX = params[j + 4];
        lastY = params[j + 5];
        j += 6;
        break;
      case 'Z':
        if (firstX !== null) {
          switch(count) {
            case 4:
              points = solver.linesIntersection(firstX, firstY, lastX, lastY, x1, y1, x2, y2);
              if (points) {
                intersections.push(points);
              }
              break;
            case 8:
              points = solver.cubicLineIntersections(x1, x2, x3, x4, y1, y2, y3, y4, firstX, firstY, lastX, lastY);
              intersections.push.apply(intersections, points);
              break;
          }
        }
        break;
    }
  }
  return intersections;
}, getIntersections:function(path) {
  var me = this, commands = me.commands, params = me.params, ln = commands.length, firstX = null, firstY = null, lastX = 0, lastY = 0, intersections = [], i, j, points;
  for (i = 0, j = 0; i < ln; i++) {
    switch(commands[i]) {
      case 'M':
        if (firstX !== null) {
          points = path.getSegmentIntersections.call(path, firstX, firstY, lastX, lastY);
          intersections.push.apply(intersections, points);
        }
        firstX = lastX = params[j];
        firstY = lastY = params[j + 1];
        j += 2;
        break;
      case 'L':
        points = path.getSegmentIntersections.call(path, lastX, lastY, params[j], params[j + 1]);
        intersections.push.apply(intersections, points);
        lastX = params[j];
        lastY = params[j + 1];
        j += 2;
        break;
      case 'C':
        points = path.getSegmentIntersections.call(path, lastX, lastY, params[j], params[j + 1], params[j + 2], params[j + 3], params[j + 4], params[j + 5]);
        intersections.push.apply(intersections, points);
        lastX = params[j + 4];
        lastY = params[j + 5];
        j += 6;
        break;
      case 'Z':
        if (firstX !== null) {
          points = path.getSegmentIntersections.call(path, firstX, firstY, lastX, lastY);
          intersections.push.apply(intersections, points);
        }
        break;
    }
  }
  return intersections;
}});
Ext.define('Ext.draw.sprite.Path', {extend:'Ext.draw.sprite.Sprite', requires:['Ext.draw.Draw', 'Ext.draw.Path'], alias:['sprite.path', 'Ext.draw.Sprite'], type:'path', isPath:true, inheritableStatics:{def:{processors:{path:function(n, o) {
  if (!(n instanceof Ext.draw.Path)) {
    n = new Ext.draw.Path(n);
  }
  return n;
}}, aliases:{d:'path'}, triggers:{path:'bbox'}, updaters:{path:function(attr) {
  var path = attr.path;
  if (!path || path.bindAttr !== attr) {
    path = new Ext.draw.Path;
    path.bindAttr = attr;
    attr.path = path;
  }
  path.clear();
  this.updatePath(path, attr);
  this.scheduleUpdater(attr, 'bbox', ['path']);
}}}}, updatePlainBBox:function(plain) {
  if (this.attr.path) {
    this.attr.path.getDimension(plain);
  }
}, updateTransformedBBox:function(transform) {
  if (this.attr.path) {
    this.attr.path.getDimensionWithTransform(this.attr.matrix, transform);
  }
}, render:function(surface, ctx) {
  var mat = this.attr.matrix, attr = this.attr;
  if (!attr.path || attr.path.params.length === 0) {
    return;
  }
  mat.toContext(ctx);
  ctx.appendPath(attr.path);
  ctx.fillStroke(attr);
  var debug = attr.debug || this.statics().debug || Ext.draw.sprite.Sprite.debug;
  if (debug) {
    debug.bbox && this.renderBBox(surface, ctx);
    debug.xray && this.renderXRay(surface, ctx);
  }
}, renderXRay:function(surface, ctx) {
  var attr = this.attr, mat = attr.matrix, imat = attr.inverseMatrix, path = attr.path, commands = path.commands, params = path.params, ln = commands.length, twoPi = Math.PI * 2, size = 2, i, j;
  mat.toContext(ctx);
  ctx.beginPath();
  for (i = 0, j = 0; i < ln; i++) {
    switch(commands[i]) {
      case 'M':
        ctx.moveTo(params[j] - size, params[j + 1] - size);
        ctx.rect(params[j] - size, params[j + 1] - size, size * 2, size * 2);
        j += 2;
        break;
      case 'L':
        ctx.moveTo(params[j] - size, params[j + 1] - size);
        ctx.rect(params[j] - size, params[j + 1] - size, size * 2, size * 2);
        j += 2;
        break;
      case 'C':
        ctx.moveTo(params[j] + size, params[j + 1]);
        ctx.arc(params[j], params[j + 1], size, 0, twoPi, true);
        j += 2;
        ctx.moveTo(params[j] + size, params[j + 1]);
        ctx.arc(params[j], params[j + 1], size, 0, twoPi, true);
        j += 2;
        ctx.moveTo(params[j] + size * 2, params[j + 1]);
        ctx.rect(params[j] - size, params[j + 1] - size, size * 2, size * 2);
        j += 2;
        break;
      default:
    }
  }
  imat.toContext(ctx);
  ctx.strokeStyle = 'black';
  ctx.strokeOpacity = 1;
  ctx.lineWidth = 1;
  ctx.stroke();
  mat.toContext(ctx);
  ctx.beginPath();
  for (i = 0, j = 0; i < ln; i++) {
    switch(commands[i]) {
      case 'M':
        ctx.moveTo(params[j], params[j + 1]);
        j += 2;
        break;
      case 'L':
        ctx.moveTo(params[j], params[j + 1]);
        j += 2;
        break;
      case 'C':
        ctx.lineTo(params[j], params[j + 1]);
        j += 2;
        ctx.moveTo(params[j], params[j + 1]);
        j += 2;
        ctx.lineTo(params[j], params[j + 1]);
        j += 2;
        break;
      default:
    }
  }
  imat.toContext(ctx);
  ctx.lineWidth = 0.5;
  ctx.stroke();
}, updatePath:function(path, attr) {
}});
Ext.define('Ext.draw.overrides.hittest.sprite.Path', {override:'Ext.draw.sprite.Path', requires:['Ext.draw.Color'], isPointInPath:function(x, y) {
  var attr = this.attr;
  if (attr.fillStyle === Ext.util.Color.RGBA_NONE) {
    return this.isPointOnPath(x, y);
  }
  var path = attr.path, matrix = attr.matrix, params, result;
  if (!matrix.isIdentity()) {
    params = path.params.slice(0);
    path.transform(attr.matrix);
  }
  result = path.isPointInPath(x, y);
  if (params) {
    path.params = params;
  }
  return result;
}, isPointOnPath:function(x, y) {
  var attr = this.attr, path = attr.path, matrix = attr.matrix, params, result;
  if (!matrix.isIdentity()) {
    params = path.params.slice(0);
    path.transform(attr.matrix);
  }
  result = path.isPointOnPath(x, y);
  if (params) {
    path.params = params;
  }
  return result;
}, hitTest:function(point, options) {
  var me = this, attr = me.attr, path = attr.path, matrix = attr.matrix, x = point[0], y = point[1], parentResult = me.callParent([point, options]), result = null, params, isFilled;
  if (!parentResult) {
    return result;
  }
  options = options || Ext.draw.sprite.Sprite.defaultHitTestOptions;
  if (!matrix.isIdentity()) {
    params = path.params.slice(0);
    path.transform(attr.matrix);
  }
  if (options.fill && options.stroke) {
    isFilled = attr.fillStyle !== Ext.util.Color.NONE && attr.fillStyle !== Ext.util.Color.RGBA_NONE;
    if (isFilled) {
      if (path.isPointInPath(x, y)) {
        result = {sprite:me};
      }
    } else {
      if (path.isPointInPath(x, y) || path.isPointOnPath(x, y)) {
        result = {sprite:me};
      }
    }
  } else {
    if (options.stroke && !options.fill) {
      if (path.isPointOnPath(x, y)) {
        result = {sprite:me};
      }
    } else {
      if (options.fill && !options.stroke) {
        if (path.isPointInPath(x, y)) {
          result = {sprite:me};
        }
      }
    }
  }
  if (params) {
    path.params = params;
  }
  return result;
}, getIntersections:function(path) {
  if (!(path.isSprite && path.isPath)) {
    return [];
  }
  var aAttr = this.attr, bAttr = path.attr, aPath = aAttr.path, bPath = bAttr.path, aMatrix = aAttr.matrix, bMatrix = bAttr.matrix, aParams, bParams, intersections;
  if (!aMatrix.isIdentity()) {
    aParams = aPath.params.slice(0);
    aPath.transform(aAttr.matrix);
  }
  if (!bMatrix.isIdentity()) {
    bParams = bPath.params.slice(0);
    bPath.transform(bAttr.matrix);
  }
  intersections = aPath.getIntersections(bPath);
  if (aParams) {
    aPath.params = aParams;
  }
  if (bParams) {
    bPath.params = bParams;
  }
  return intersections;
}});
Ext.define('Ext.draw.sprite.Circle', {extend:'Ext.draw.sprite.Path', alias:'sprite.circle', type:'circle', inheritableStatics:{def:{processors:{cx:'number', cy:'number', r:'number'}, aliases:{radius:'r', x:'cx', y:'cy', centerX:'cx', centerY:'cy'}, defaults:{cx:0, cy:0, r:4}, triggers:{cx:'path', cy:'path', r:'path'}}}, updatePlainBBox:function(plain) {
  var attr = this.attr, cx = attr.cx, cy = attr.cy, r = attr.r;
  plain.x = cx - r;
  plain.y = cy - r;
  plain.width = r + r;
  plain.height = r + r;
}, updateTransformedBBox:function(transform) {
  var attr = this.attr, cx = attr.cx, cy = attr.cy, r = attr.r, matrix = attr.matrix, scaleX = matrix.getScaleX(), scaleY = matrix.getScaleY(), rx, ry;
  rx = scaleX * r;
  ry = scaleY * r;
  transform.x = matrix.x(cx, cy) - rx;
  transform.y = matrix.y(cx, cy) - ry;
  transform.width = rx + rx;
  transform.height = ry + ry;
}, updatePath:function(path, attr) {
  path.arc(attr.cx, attr.cy, attr.r, 0, Math.PI * 2, false);
}});
Ext.define('Ext.draw.sprite.Arc', {extend:'Ext.draw.sprite.Circle', alias:'sprite.arc', type:'arc', inheritableStatics:{def:{processors:{startAngle:'number', endAngle:'number', anticlockwise:'bool'}, aliases:{from:'startAngle', to:'endAngle', start:'startAngle', end:'endAngle'}, defaults:{startAngle:0, endAngle:Math.PI * 2, anticlockwise:false}, triggers:{startAngle:'path', endAngle:'path', anticlockwise:'path'}}}, updatePath:function(path, attr) {
  path.arc(attr.cx, attr.cy, attr.r, attr.startAngle, attr.endAngle, attr.anticlockwise);
}});
Ext.define('Ext.draw.sprite.Arrow', {extend:'Ext.draw.sprite.Path', alias:'sprite.arrow', inheritableStatics:{def:{processors:{x:'number', y:'number', size:'number'}, defaults:{x:0, y:0, size:4}, triggers:{x:'path', y:'path', size:'path'}}}, updatePath:function(path, attr) {
  var s = attr.size * 1.5, x = attr.x - attr.lineWidth / 2, y = attr.y;
  path.fromSvgString('M'.concat(x - s * 0.7, ',', y - s * 0.4, 'l', [s * 0.6, 0, 0, -s * 0.4, s, s * 0.8, -s, s * 0.8, 0, -s * 0.4, -s * 0.6, 0], 'z'));
}});
Ext.define('Ext.draw.sprite.Composite', {extend:'Ext.draw.sprite.Sprite', alias:'sprite.composite', type:'composite', isComposite:true, config:{sprites:[]}, constructor:function(config) {
  this.sprites = [];
  this.map = {};
  this.callParent([config]);
}, addSprite:function(sprite) {
  var i = 0, results;
  if (Ext.isArray(sprite)) {
    results = [];
    while (i < sprite.length) {
      results.push(this.addSprite(sprite[i++]));
    }
    return results;
  }
  if (sprite && sprite.type && !sprite.isSprite) {
    sprite = Ext.create('sprite.' + sprite.type, sprite);
  }
  if (!sprite || !sprite.isSprite || sprite.isComposite) {
    return null;
  }
  sprite.setSurface(null);
  sprite.setParent(this);
  var attr = this.attr, oldTransformations = sprite.applyTransformations;
  sprite.applyTransformations = function(force) {
    if (sprite.attr.dirtyTransform) {
      attr.dirtyTransform = true;
      attr.bbox.plain.dirty = true;
      attr.bbox.transform.dirty = true;
    }
    oldTransformations.call(sprite, force);
  };
  this.sprites.push(sprite);
  this.map[sprite.id] = sprite.getId();
  attr.bbox.plain.dirty = true;
  attr.bbox.transform.dirty = true;
  return sprite;
}, add:function(sprite) {
  return this.addSprite(sprite);
}, removeSprite:function(sprite, isDestroy) {
  var me = this, id, isOwnSprite;
  if (sprite) {
    if (sprite.charAt) {
      sprite = me.map[sprite];
    }
    if (!sprite || !sprite.isSprite) {
      return null;
    }
    if (sprite.destroyed || sprite.destroying) {
      return sprite;
    }
    id = sprite.getId();
    isOwnSprite = me.map[id];
    delete me.map[id];
    if (isDestroy) {
      sprite.destroy();
    }
    if (!isOwnSprite) {
      return sprite;
    }
    sprite.setParent(null);
    Ext.Array.remove(me.sprites, sprite);
    me.dirtyZIndex = true;
    me.setDirty(true);
  }
  return sprite || null;
}, addAll:function(sprites) {
  if (sprites.isSprite || sprites.type) {
    this.add(sprites);
  } else {
    if (Ext.isArray(sprites)) {
      var i = 0;
      while (i < sprites.length) {
        this.add(sprites[i++]);
      }
    }
  }
}, updatePlainBBox:function(plain) {
  var me = this, left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity, sprite, bbox, i, ln;
  for (i = 0, ln = me.sprites.length; i < ln; i++) {
    sprite = me.sprites[i];
    sprite.applyTransformations();
    bbox = sprite.getBBox();
    if (left > bbox.x) {
      left = bbox.x;
    }
    if (right < bbox.x + bbox.width) {
      right = bbox.x + bbox.width;
    }
    if (top > bbox.y) {
      top = bbox.y;
    }
    if (bottom < bbox.y + bbox.height) {
      bottom = bbox.y + bbox.height;
    }
  }
  plain.x = left;
  plain.y = top;
  plain.width = right - left;
  plain.height = bottom - top;
}, isVisible:function() {
  var attr = this.attr, parent = this.getParent(), hasParent = parent && (parent.isSurface || parent.isVisible()), isSeen = hasParent && !attr.hidden && attr.globalAlpha;
  return !!isSeen;
}, render:function(surface, ctx, rect) {
  var me = this, attr = me.attr, mat = me.attr.matrix, sprites = me.sprites, ln = sprites.length, i = 0;
  mat.toContext(ctx);
  for (; i < ln; i++) {
    surface.renderSprite(sprites[i], rect);
  }
  var debug = attr.debug || me.statics().debug || Ext.draw.sprite.Sprite.debug;
  if (debug) {
    attr.inverseMatrix.toContext(ctx);
    if (debug.bbox) {
      me.renderBBox(surface, ctx);
    }
  }
}, destroy:function() {
  var me = this, sprites = me.sprites, ln = sprites.length, i;
  for (i = 0; i < ln; i++) {
    sprites[i].destroy();
  }
  sprites.length = 0;
  me.callParent();
}});
Ext.define('Ext.draw.sprite.Cross', {extend:'Ext.draw.sprite.Path', alias:'sprite.cross', inheritableStatics:{def:{processors:{x:'number', y:'number', size:'number'}, defaults:{x:0, y:0, size:4}, triggers:{x:'path', y:'path', size:'path'}}}, updatePath:function(path, attr) {
  var s = attr.size / 1.7, x = attr.x - attr.lineWidth / 2, y = attr.y;
  path.fromSvgString('M'.concat(x - s, ',', y, 'l', [-s, -s, s, -s, s, s, s, -s, s, s, -s, s, s, s, -s, s, -s, -s, -s, s, -s, -s, 'z']));
}});
Ext.define('Ext.draw.sprite.Diamond', {extend:'Ext.draw.sprite.Path', alias:'sprite.diamond', inheritableStatics:{def:{processors:{x:'number', y:'number', size:'number'}, defaults:{x:0, y:0, size:4}, triggers:{x:'path', y:'path', size:'path'}}}, updatePath:function(path, attr) {
  var s = attr.size * 1.25, x = attr.x - attr.lineWidth / 2, y = attr.y;
  path.fromSvgString(['M', x, y - s, 'l', s, s, -s, s, -s, -s, s, -s, 'z']);
}});
Ext.define('Ext.draw.sprite.Ellipse', {extend:'Ext.draw.sprite.Path', alias:'sprite.ellipse', type:'ellipse', inheritableStatics:{def:{processors:{cx:'number', cy:'number', rx:'number', ry:'number', axisRotation:'number'}, aliases:{radius:'r', x:'cx', y:'cy', centerX:'cx', centerY:'cy', radiusX:'rx', radiusY:'ry'}, defaults:{cx:0, cy:0, rx:1, ry:1, axisRotation:0}, triggers:{cx:'path', cy:'path', rx:'path', ry:'path', axisRotation:'path'}}}, updatePlainBBox:function(plain) {
  var attr = this.attr, cx = attr.cx, cy = attr.cy, rx = attr.rx, ry = attr.ry;
  plain.x = cx - rx;
  plain.y = cy - ry;
  plain.width = rx + rx;
  plain.height = ry + ry;
}, updateTransformedBBox:function(transform) {
  var attr = this.attr, cx = attr.cx, cy = attr.cy, rx = attr.rx, ry = attr.ry, rxy = ry / rx, matrix = attr.matrix.clone(), xx, xy, yx, yy, dx, dy, w, h;
  matrix.append(1, 0, 0, rxy, 0, cy * (1 - rxy));
  xx = matrix.getXX();
  yx = matrix.getYX();
  dx = matrix.getDX();
  xy = matrix.getXY();
  yy = matrix.getYY();
  dy = matrix.getDY();
  w = Math.sqrt(xx * xx + yx * yx) * rx;
  h = Math.sqrt(xy * xy + yy * yy) * rx;
  transform.x = cx * xx + cy * yx + dx - w;
  transform.y = cx * xy + cy * yy + dy - h;
  transform.width = w + w;
  transform.height = h + h;
}, updatePath:function(path, attr) {
  path.ellipse(attr.cx, attr.cy, attr.rx, attr.ry, attr.axisRotation, 0, Math.PI * 2, false);
}});
Ext.define('Ext.draw.sprite.EllipticalArc', {extend:'Ext.draw.sprite.Ellipse', alias:'sprite.ellipticalArc', type:'ellipticalArc', inheritableStatics:{def:{processors:{startAngle:'number', endAngle:'number', anticlockwise:'bool'}, aliases:{from:'startAngle', to:'endAngle', start:'startAngle', end:'endAngle'}, defaults:{startAngle:0, endAngle:Math.PI * 2, anticlockwise:false}, triggers:{startAngle:'path', endAngle:'path', anticlockwise:'path'}}}, updatePath:function(path, attr) {
  path.ellipse(attr.cx, attr.cy, attr.rx, attr.ry, attr.axisRotation, attr.startAngle, attr.endAngle, attr.anticlockwise);
}});
Ext.define('Ext.draw.sprite.Rect', {extend:'Ext.draw.sprite.Path', alias:'sprite.rect', type:'rect', inheritableStatics:{def:{processors:{x:'number', y:'number', width:'number', height:'number', radius:'number'}, aliases:{}, triggers:{x:'path', y:'path', width:'path', height:'path', radius:'path'}, defaults:{x:0, y:0, width:8, height:8, radius:0}}}, updatePlainBBox:function(plain) {
  var attr = this.attr;
  plain.x = attr.x;
  plain.y = attr.y;
  plain.width = attr.width;
  plain.height = attr.height;
}, updateTransformedBBox:function(transform, plain) {
  this.attr.matrix.transformBBox(plain, this.attr.radius, transform);
}, updatePath:function(path, attr) {
  var x = attr.x, y = attr.y, width = attr.width, height = attr.height, radius = Math.min(attr.radius, Math.abs(height) * 0.5, Math.abs(width) * 0.5);
  if (radius === 0) {
    path.rect(x, y, width, height);
  } else {
    path.moveTo(x + radius, y);
    path.arcTo(x + width, y, x + width, y + height, radius);
    path.arcTo(x + width, y + height, x, y + height, radius);
    path.arcTo(x, y + height, x, y, radius);
    path.arcTo(x, y, x + radius, y, radius);
    path.closePath();
  }
}});
Ext.define('Ext.draw.sprite.Image', {extend:'Ext.draw.sprite.Rect', alias:'sprite.image', type:'image', statics:{imageLoaders:{}}, inheritableStatics:{def:{processors:{src:'string'}, triggers:{src:'src'}, updaters:{src:'updateSource'}, defaults:{src:'', width:null, height:null}}}, updateSurface:function(surface) {
  if (surface) {
    this.updateSource(this.attr);
  }
}, updateSource:function(attr) {
  var me = this, src = attr.src, surface = me.getSurface(), loadingStub = Ext.draw.sprite.Image.imageLoaders[src], width = attr.width, height = attr.height, imageLoader, i;
  if (!surface) {
    return;
  }
  if (!loadingStub) {
    imageLoader = new Image;
    loadingStub = Ext.draw.sprite.Image.imageLoaders[src] = {image:imageLoader, done:false, pendingSprites:[me], pendingSurfaces:[surface]};
    imageLoader.width = width;
    imageLoader.height = height;
    imageLoader.onload = function() {
      var item;
      if (!loadingStub.done) {
        loadingStub.done = true;
        for (i = 0; i < loadingStub.pendingSprites.length; i++) {
          item = loadingStub.pendingSprites[i];
          if (!item.destroyed) {
            item.setDirty(true);
          }
        }
        for (i = 0; i < loadingStub.pendingSurfaces.length; i++) {
          item = loadingStub.pendingSurfaces[i];
          if (!item.destroyed) {
            item.renderFrame();
          }
        }
      }
    };
    imageLoader.src = src;
  } else {
    Ext.Array.include(loadingStub.pendingSprites, me);
    Ext.Array.include(loadingStub.pendingSurfaces, surface);
  }
}, render:function(surface, ctx) {
  var me = this, attr = me.attr, mat = attr.matrix, src = attr.src, x = attr.x, y = attr.y, width = attr.width, height = attr.height, loadingStub = Ext.draw.sprite.Image.imageLoaders[src], image;
  if (loadingStub && loadingStub.done) {
    mat.toContext(ctx);
    image = loadingStub.image;
    ctx.drawImage(image, x, y, width || (image.naturalWidth || image.width) / surface.devicePixelRatio, height || (image.naturalHeight || image.height) / surface.devicePixelRatio);
  }
  var debug = attr.debug || this.statics().debug || Ext.draw.sprite.Sprite.debug;
  if (debug) {
    debug.bbox && this.renderBBox(surface, ctx);
  }
}, isVisible:function() {
  var attr = this.attr, parent = this.getParent(), hasParent = parent && (parent.isSurface || parent.isVisible()), isSeen = hasParent && !attr.hidden && attr.globalAlpha;
  return !!isSeen;
}});
Ext.define('Ext.draw.sprite.Instancing', {extend:'Ext.draw.sprite.Sprite', alias:'sprite.instancing', type:'instancing', isInstancing:true, config:{template:null, instances:null}, instances:null, applyTemplate:function(template) {
  if (!Ext.isObject(template)) {
    Ext.raise('A template of an instancing sprite must either be ' + 'a sprite instance or a valid config object from which a template ' + 'sprite will be created.');
  } else {
    if (template.isInstancing || template.isComposite) {
      Ext.raise("Can't use an instancing or composite sprite " + 'as a template for an instancing sprite.');
    }
  }
  if (!template.isSprite) {
    if (!template.xclass && !template.type) {
      template.type = 'circle';
    }
    template = Ext.create(template.xclass || 'sprite.' + template.type, template);
  }
  var surface = template.getSurface();
  if (surface) {
    surface.remove(template);
  }
  template.setParent(this);
  return template;
}, updateTemplate:function(template, oldTemplate) {
  if (oldTemplate) {
    delete oldTemplate.ownAttr;
  }
  template.setSurface(this.getSurface());
  template.ownAttr = template.attr;
  this.clearAll();
}, updateInstances:function(instances) {
  this.clearAll();
  if (Ext.isArray(instances)) {
    for (var i = 0, ln = instances.length; i < ln; i++) {
      this.add(instances[i]);
    }
  }
}, updateSurface:function(surface) {
  var template = this.getTemplate();
  if (template && !template.destroyed) {
    template.setSurface(surface);
  }
}, get:function(index) {
  return this.instances[index];
}, getCount:function() {
  return this.instances.length;
}, clearAll:function() {
  var template = this.getTemplate();
  template.attr.children = this.instances = [];
  this.position = 0;
}, createInstance:function(config, bypassNormalization, avoidCopy) {
  return this.add(config, bypassNormalization, avoidCopy);
}, add:function(config, bypassNormalization, avoidCopy) {
  var me = this, template = me.getTemplate(), originalAttr = template.attr, attr = Ext.Object.chain(originalAttr);
  template.modifiers.target.prepareAttributes(attr);
  template.attr = attr;
  template.setAttributes(config, bypassNormalization, avoidCopy);
  attr.template = template;
  me.instances.push(attr);
  template.attr = originalAttr;
  me.position++;
  return attr;
}, getBBox:function() {
  return null;
}, getBBoxFor:function(index, isWithoutTransform) {
  var template = this.getTemplate(), originalAttr = template.attr, bbox;
  template.attr = this.instances[index];
  bbox = template.getBBox(isWithoutTransform);
  template.attr = originalAttr;
  return bbox;
}, isVisible:function() {
  var attr = this.attr, parent = this.getParent(), result;
  result = parent && parent.isSurface && !attr.hidden && attr.globalAlpha;
  return !!result;
}, isInstanceVisible:function(index) {
  var me = this, template = me.getTemplate(), originalAttr = template.attr, instances = me.instances, result = false;
  if (!Ext.isNumber(index) || index < 0 || index >= instances.length || !me.isVisible()) {
    return result;
  }
  template.attr = instances[index];
  result = template.isVisible(point, options);
  template.attr = originalAttr;
  return result;
}, render:function(surface, ctx, rect) {
  if (!this.getTemplate()) {
    Ext.raise('An instancing sprite must have a template.');
  }
  var me = this, template = me.getTemplate(), surfaceRect = surface.getRect(), mat = me.attr.matrix, originalAttr = template.attr, instances = me.instances, ln = me.position, i;
  mat.toContext(ctx);
  template.preRender(surface, ctx, rect);
  template.useAttributes(ctx, surfaceRect);
  template.isSpriteInstance = true;
  for (i = 0; i < ln; i++) {
    if (instances[i].hidden) {
      continue;
    }
    ctx.save();
    template.attr = instances[i];
    template.useAttributes(ctx, surfaceRect);
    template.render(surface, ctx, rect);
    ctx.restore();
  }
  template.isSpriteInstance = false;
  template.attr = originalAttr;
}, setAttributesFor:function(index, changes, bypassNormalization) {
  var template = this.getTemplate(), originalAttr = template.attr, attr = this.instances[index];
  if (!attr) {
    return;
  }
  template.attr = attr;
  if (bypassNormalization) {
    changes = Ext.apply({}, changes);
  } else {
    changes = template.self.def.normalize(changes);
  }
  template.modifiers.target.pushDown(attr, changes);
  template.attr = originalAttr;
}, destroy:function() {
  var me = this, template = me.getTemplate();
  me.instances = null;
  if (template) {
    template.destroy();
  }
  me.callParent();
}});
Ext.define('Ext.draw.overrides.hittest.sprite.Instancing', {override:'Ext.draw.sprite.Instancing', hitTest:function(point, options) {
  var me = this, template = me.getTemplate(), originalAttr = template.attr, instances = me.instances, ln = instances.length, i = 0, result = null;
  if (!me.isVisible()) {
    return result;
  }
  for (; i < ln; i++) {
    template.attr = instances[i];
    result = template.hitTest(point, options);
    if (result) {
      result.isInstance = true;
      result.template = result.sprite;
      result.sprite = this;
      result.instance = instances[i];
      result.index = i;
      return result;
    }
  }
  template.attr = originalAttr;
  return result;
}});
Ext.define('Ext.draw.sprite.Line', {extend:'Ext.draw.sprite.Sprite', alias:'sprite.line', type:'line', inheritableStatics:{def:{processors:{fromX:'number', fromY:'number', toX:'number', toY:'number', crisp:'bool'}, defaults:{fromX:0, fromY:0, toX:1, toY:1, crisp:false, strokeStyle:'black'}, aliases:{x1:'fromX', y1:'fromY', x2:'toX', y2:'toY'}, triggers:{crisp:'bbox'}}}, updateLineBBox:function(bbox, isTransform, x1, y1, x2, y2) {
  var attr = this.attr, matrix = attr.matrix, halfLineWidth = attr.lineWidth / 2, fromX, fromY, toX, toY, p;
  if (attr.crisp) {
    x1 = this.align(x1);
    x2 = this.align(x2);
    y1 = this.align(y1);
    y2 = this.align(y2);
  }
  if (isTransform) {
    p = matrix.transformPoint([x1, y1]);
    x1 = p[0];
    y1 = p[1];
    p = matrix.transformPoint([x2, y2]);
    x2 = p[0];
    y2 = p[1];
  }
  fromX = Math.min(x1, x2);
  toX = Math.max(x1, x2);
  fromY = Math.min(y1, y2);
  toY = Math.max(y1, y2);
  var angle = Math.atan2(toX - fromX, toY - fromY), sin = Math.sin(angle), cos = Math.cos(angle), dx = halfLineWidth * cos, dy = halfLineWidth * sin;
  fromX -= dx;
  fromY -= dy;
  toX += dx;
  toY += dy;
  bbox.x = fromX;
  bbox.y = fromY;
  bbox.width = toX - fromX;
  bbox.height = toY - fromY;
}, updatePlainBBox:function(plain) {
  var attr = this.attr;
  this.updateLineBBox(plain, false, attr.fromX, attr.fromY, attr.toX, attr.toY);
}, updateTransformedBBox:function(transform, plain) {
  var attr = this.attr;
  this.updateLineBBox(transform, true, attr.fromX, attr.fromY, attr.toX, attr.toY);
}, align:function(x) {
  return Math.round(x) - 0.5;
}, render:function(surface, ctx) {
  var me = this, attr = me.attr, matrix = attr.matrix;
  matrix.toContext(ctx);
  ctx.beginPath();
  if (attr.crisp) {
    ctx.moveTo(me.align(attr.fromX), me.align(attr.fromY));
    ctx.lineTo(me.align(attr.toX), me.align(attr.toY));
  } else {
    ctx.moveTo(attr.fromX, attr.fromY);
    ctx.lineTo(attr.toX, attr.toY);
  }
  ctx.stroke();
  var debug = attr.debug || this.statics().debug || Ext.draw.sprite.Sprite.debug;
  if (debug) {
    this.attr.inverseMatrix.toContext(ctx);
    debug.bbox && this.renderBBox(surface, ctx);
  }
}});
Ext.define('Ext.draw.sprite.Plus', {extend:'Ext.draw.sprite.Path', alias:'sprite.plus', inheritableStatics:{def:{processors:{x:'number', y:'number', size:'number'}, defaults:{x:0, y:0, size:4}, triggers:{x:'path', y:'path', size:'path'}}}, updatePath:function(path, attr) {
  var s = attr.size / 1.3, x = attr.x - attr.lineWidth / 2, y = attr.y;
  path.fromSvgString('M'.concat(x - s / 2, ',', y - s / 2, 'l', [0, -s, s, 0, 0, s, s, 0, 0, s, -s, 0, 0, s, -s, 0, 0, -s, -s, 0, 0, -s, 'z']));
}});
Ext.define('Ext.draw.sprite.Sector', {extend:'Ext.draw.sprite.Path', alias:'sprite.sector', type:'sector', inheritableStatics:{def:{processors:{centerX:'number', centerY:'number', startAngle:'number', endAngle:'number', startRho:'number', endRho:'number', margin:'number'}, aliases:{rho:'endRho'}, triggers:{centerX:'path,bbox', centerY:'path,bbox', startAngle:'path,bbox', endAngle:'path,bbox', startRho:'path,bbox', endRho:'path,bbox', margin:'path,bbox'}, defaults:{centerX:0, centerY:0, startAngle:0, 
endAngle:0, startRho:0, endRho:150, margin:0, path:'M 0,0'}}}, getMidAngle:function() {
  return this.midAngle || 0;
}, updatePath:function(path, attr) {
  var startAngle = Math.min(attr.startAngle, attr.endAngle), endAngle = Math.max(attr.startAngle, attr.endAngle), midAngle = this.midAngle = (startAngle + endAngle) * 0.5, fullPie = Ext.Number.isEqual(Math.abs(endAngle - startAngle), Ext.draw.Draw.pi2, 1.0E-10), margin = attr.margin, centerX = attr.centerX, centerY = attr.centerY, startRho = Math.min(attr.startRho, attr.endRho), endRho = Math.max(attr.startRho, attr.endRho);
  if (margin) {
    centerX += margin * Math.cos(midAngle);
    centerY += margin * Math.sin(midAngle);
  }
  if (!fullPie) {
    path.moveTo(centerX + startRho * Math.cos(startAngle), centerY + startRho * Math.sin(startAngle));
    path.lineTo(centerX + endRho * Math.cos(startAngle), centerY + endRho * Math.sin(startAngle));
  }
  path.arc(centerX, centerY, endRho, startAngle, endAngle, false);
  path[fullPie ? 'moveTo' : 'lineTo'](centerX + startRho * Math.cos(endAngle), centerY + startRho * Math.sin(endAngle));
  path.arc(centerX, centerY, startRho, endAngle, startAngle, true);
}});
Ext.define('Ext.draw.sprite.Square', {extend:'Ext.draw.sprite.Path', alias:'sprite.square', inheritableStatics:{def:{processors:{x:'number', y:'number', size:'number'}, defaults:{x:0, y:0, size:4}, triggers:{x:'path', y:'path', size:'size'}}}, updatePath:function(path, attr) {
  var size = attr.size * 1.2, s = size * 2, x = attr.x - attr.lineWidth / 2, y = attr.y;
  path.fromSvgString('M'.concat(x - size, ',', y - size, 'l', [s, 0, 0, s, -s, 0, 0, -s, 'z']));
}});
Ext.define('Ext.draw.TextMeasurer', {singleton:true, requires:['Ext.util.TextMetrics'], measureDiv:null, measureCache:{}, precise:Ext.isIE8, measureDivTpl:{id:'ext-draw-text-measurer', tag:'div', style:{overflow:'hidden', position:'relative', 'float':'left', width:0, height:0}, 'data-sticky':true, children:{tag:'div', style:{display:'block', position:'absolute', x:-100000, y:-100000, padding:0, margin:0, 'z-index':-100000, 'white-space':'nowrap'}}}, actualMeasureText:function(text, font) {
  var me = Ext.draw.TextMeasurer, measureDiv = me.measureDiv, FARAWAY = 100000, size;
  if (!measureDiv) {
    var parent = Ext.Element.create({'data-sticky':true, style:{'overflow':'hidden', 'position':'relative', 'float':'left', 'width':0, 'height':0}});
    me.measureDiv = measureDiv = Ext.Element.create({style:{'position':'absolute', 'x':FARAWAY, 'y':FARAWAY, 'z-index':-FARAWAY, 'white-space':'nowrap', 'display':'block', 'padding':0, 'margin':0}});
    Ext.getBody().appendChild(parent);
    parent.appendChild(measureDiv);
  }
  if (font) {
    measureDiv.setStyle({font:font, lineHeight:'normal'});
  }
  measureDiv.setText('(' + text + ')');
  size = measureDiv.getSize();
  measureDiv.setText('()');
  size.width -= measureDiv.getSize().width;
  return size;
}, measureTextSingleLine:function(text, font) {
  if (this.precise) {
    return this.preciseMeasureTextSingleLine(text, font);
  }
  text = text.toString();
  var cache = this.measureCache, chars = text.split(''), width = 0, height = 0, cachedItem, charactor, i, ln, size;
  if (!cache[font]) {
    cache[font] = {};
  }
  cache = cache[font];
  if (cache[text]) {
    return cache[text];
  }
  for (i = 0, ln = chars.length; i < ln; i++) {
    charactor = chars[i];
    if (!(cachedItem = cache[charactor])) {
      size = this.actualMeasureText(charactor, font);
      cachedItem = cache[charactor] = size;
    }
    width += cachedItem.width;
    height = Math.max(height, cachedItem.height);
  }
  return cache[text] = {width:width, height:height};
}, preciseMeasureTextSingleLine:function(text, font) {
  text = text.toString();
  var measureDiv = this.measureDiv || (this.measureDiv = Ext.getBody().createChild(this.measureDivTpl).down('div'));
  measureDiv.setStyle({font:font || ''});
  return Ext.util.TextMetrics.measure(measureDiv, text);
}, measureText:function(text, font) {
  var lines = text.split('\n'), ln = lines.length, height = 0, width = 0, line, i, sizes;
  if (ln === 1) {
    return this.measureTextSingleLine(text, font);
  }
  sizes = [];
  for (i = 0; i < ln; i++) {
    line = this.measureTextSingleLine(lines[i], font);
    sizes.push(line);
    height += line.height;
    width = Math.max(width, line.width);
  }
  return {width:width, height:height, sizes:sizes};
}});
Ext.define('Ext.draw.sprite.Text', function() {
  var fontSizes = {'xx-small':true, 'x-small':true, 'small':true, 'medium':true, 'large':true, 'x-large':true, 'xx-large':true};
  var fontWeights = {normal:true, bold:true, bolder:true, lighter:true, 100:true, 200:true, 300:true, 400:true, 500:true, 600:true, 700:true, 800:true, 900:true};
  var textAlignments = {start:'start', left:'start', center:'center', middle:'center', end:'end', right:'end'};
  var textBaselines = {top:'top', hanging:'hanging', middle:'middle', center:'middle', alphabetic:'alphabetic', ideographic:'ideographic', bottom:'bottom'};
  return {extend:'Ext.draw.sprite.Sprite', requires:['Ext.draw.TextMeasurer', 'Ext.draw.Color'], alias:'sprite.text', type:'text', lineBreakRe:/\r?\n/g, statics:{debug:false, fontSizes:fontSizes, fontWeights:fontWeights, textAlignments:textAlignments, textBaselines:textBaselines}, inheritableStatics:{def:{animationProcessors:{text:'text'}, processors:{x:'number', y:'number', text:'string', fontSize:function(n) {
    if (Ext.isNumber(+n)) {
      return n + 'px';
    } else {
      if (n.match(Ext.dom.Element.unitRe)) {
        return n;
      } else {
        if (n in fontSizes) {
          return n;
        }
      }
    }
  }, fontStyle:'enums(,italic,oblique)', fontVariant:'enums(,small-caps)', fontWeight:function(n) {
    if (n in fontWeights) {
      return String(n);
    } else {
      return '';
    }
  }, fontFamily:'string', textAlign:function(n) {
    return textAlignments[n] || 'center';
  }, textBaseline:function(n) {
    return textBaselines[n] || 'alphabetic';
  }, font:'string', debug:'default'}, aliases:{'font-size':'fontSize', 'font-family':'fontFamily', 'font-weight':'fontWeight', 'font-variant':'fontVariant', 'text-anchor':'textAlign', 'dominant-baseline':'textBaseline'}, defaults:{fontStyle:'', fontVariant:'', fontWeight:'', fontSize:'10px', fontFamily:'sans-serif', font:'10px sans-serif', textBaseline:'alphabetic', textAlign:'start', strokeStyle:'rgba(0, 0, 0, 0)', fillStyle:'#000', x:0, y:0, text:''}, triggers:{fontStyle:'fontX,bbox', fontVariant:'fontX,bbox', 
  fontWeight:'fontX,bbox', fontSize:'fontX,bbox', fontFamily:'fontX,bbox', font:'font,bbox,canvas', textBaseline:'bbox', textAlign:'bbox', x:'bbox', y:'bbox', text:'bbox'}, updaters:{fontX:'makeFontShorthand', font:'parseFontShorthand'}}}, config:{preciseMeasurement:undefined}, constructor:function(config) {
    if (config && config.font) {
      config = Ext.clone(config);
      for (var key in config) {
        if (key !== 'font' && key.indexOf('font') === 0) {
          delete config[key];
        }
      }
    }
    Ext.draw.sprite.Sprite.prototype.constructor.call(this, config);
  }, fontValuesMap:{'italic':'fontStyle', 'oblique':'fontStyle', 'small-caps':'fontVariant', 'bold':'fontWeight', 'bolder':'fontWeight', 'lighter':'fontWeight', 100:'fontWeight', 200:'fontWeight', 300:'fontWeight', 400:'fontWeight', 500:'fontWeight', 600:'fontWeight', 700:'fontWeight', 800:'fontWeight', 900:'fontWeight', 'xx-small':'fontSize', 'x-small':'fontSize', 'small':'fontSize', 'medium':'fontSize', 'large':'fontSize', 'x-large':'fontSize', 'xx-large':'fontSize'}, makeFontShorthand:function(attr) {
    var parts = [];
    if (attr.fontStyle) {
      parts.push(attr.fontStyle);
    }
    if (attr.fontVariant) {
      parts.push(attr.fontVariant);
    }
    if (attr.fontWeight) {
      parts.push(attr.fontWeight);
    }
    if (attr.fontSize) {
      parts.push(attr.fontSize);
    }
    if (attr.fontFamily) {
      parts.push(attr.fontFamily);
    }
    this.setAttributes({font:parts.join(' ')}, true);
  }, parseFontShorthand:function(attr) {
    var value = attr.font, ln = value.length, changes = {}, dispatcher = this.fontValuesMap, start = 0, end, slashIndex, part, fontProperty;
    while (start < ln && end !== -1) {
      end = value.indexOf(' ', start);
      if (end < 0) {
        part = value.substr(start);
      } else {
        if (end > start) {
          part = value.substr(start, end - start);
        } else {
          continue;
        }
      }
      slashIndex = part.indexOf('/');
      if (slashIndex > 0) {
        part = part.substr(0, slashIndex);
      } else {
        if (slashIndex === 0) {
          continue;
        }
      }
      if (part !== 'normal' && part !== 'inherit') {
        fontProperty = dispatcher[part];
        if (fontProperty) {
          changes[fontProperty] = part;
        } else {
          if (part.match(Ext.dom.Element.unitRe)) {
            changes.fontSize = part;
          } else {
            changes.fontFamily = value.substr(start);
            break;
          }
        }
      }
      start = end + 1;
    }
    if (!changes.fontStyle) {
      changes.fontStyle = '';
    }
    if (!changes.fontVariant) {
      changes.fontVariant = '';
    }
    if (!changes.fontWeight) {
      changes.fontWeight = '';
    }
    this.setAttributes(changes, true);
  }, fontProperties:{fontStyle:true, fontVariant:true, fontWeight:true, fontSize:true, fontFamily:true}, setAttributes:function(changes, bypassNormalization, avoidCopy) {
    var key, obj;
    if (changes && changes.font) {
      obj = {};
      for (key in changes) {
        if (!(key in this.fontProperties)) {
          obj[key] = changes[key];
        }
      }
      changes = obj;
    }
    this.callParent([changes, bypassNormalization, avoidCopy]);
  }, getBBox:function(isWithoutTransform) {
    var me = this, plain = me.attr.bbox.plain, surface = me.getSurface();
    if (plain.dirty) {
      me.updatePlainBBox(plain);
      plain.dirty = false;
    }
    if (surface && surface.getInherited().rtl && surface.getFlipRtlText()) {
      me.updatePlainBBox(plain, true);
    }
    return me.callParent([isWithoutTransform]);
  }, rtlAlignments:{start:'end', center:'center', end:'start'}, updatePlainBBox:function(plain, useOldSize) {
    var me = this, attr = me.attr, x = attr.x, y = attr.y, dx = [], font = attr.font, text = attr.text, baseline = attr.textBaseline, alignment = attr.textAlign, precise = me.getPreciseMeasurement(), size, textMeasurerPrecision;
    if (useOldSize && me.oldSize) {
      size = me.oldSize;
    } else {
      textMeasurerPrecision = Ext.draw.TextMeasurer.precise;
      if (Ext.isBoolean(precise)) {
        Ext.draw.TextMeasurer.precise = precise;
      }
      size = me.oldSize = Ext.draw.TextMeasurer.measureText(text, font);
      Ext.draw.TextMeasurer.precise = textMeasurerPrecision;
    }
    var surface = me.getSurface(), isRtl = surface && surface.getInherited().rtl || false, flipRtlText = isRtl && surface.getFlipRtlText(), sizes = size.sizes, blockHeight = size.height, blockWidth = size.width, ln = sizes ? sizes.length : 0, lineWidth, rect, i = 0;
    switch(baseline) {
      case 'hanging':
      case 'top':
        break;
      case 'ideographic':
      case 'bottom':
        y -= blockHeight;
        break;
      case 'alphabetic':
        y -= blockHeight * 0.8;
        break;
      case 'middle':
        y -= blockHeight * 0.5;
        break;
    }
    if (flipRtlText) {
      rect = surface.getRect();
      x = rect[2] - rect[0] - x;
      alignment = me.rtlAlignments[alignment];
    }
    switch(alignment) {
      case 'start':
        if (isRtl) {
          for (; i < ln; i++) {
            lineWidth = sizes[i].width;
            dx.push(-(blockWidth - lineWidth));
          }
        }
        break;
      case 'end':
        x -= blockWidth;
        if (isRtl) {
          break;
        }
        for (; i < ln; i++) {
          lineWidth = sizes[i].width;
          dx.push(blockWidth - lineWidth);
        }
        break;
      case 'center':
        x -= blockWidth * 0.5;
        for (; i < ln; i++) {
          lineWidth = sizes[i].width;
          dx.push((isRtl ? -1 : 1) * (blockWidth - lineWidth) * 0.5);
        }
        break;
    }
    attr.textAlignOffsets = dx;
    plain.x = x;
    plain.y = y;
    plain.width = blockWidth;
    plain.height = blockHeight;
  }, setText:function(text) {
    this.setAttributes({text:text}, true);
  }, render:function(surface, ctx, rect) {
    var me = this, attr = me.attr, mat = Ext.draw.Matrix.fly(attr.matrix.elements.slice(0)), bbox = me.getBBox(true), dx = attr.textAlignOffsets, none = Ext.util.Color.RGBA_NONE, x, y, i, lines, lineHeight;
    if (attr.text.length === 0) {
      return;
    }
    lines = attr.text.split(me.lineBreakRe);
    lineHeight = bbox.height / lines.length;
    x = attr.bbox.plain.x;
    y = attr.bbox.plain.y + lineHeight * 0.78;
    mat.toContext(ctx);
    if (surface.getInherited().rtl) {
      x += attr.bbox.plain.width;
    }
    for (i = 0; i < lines.length; i++) {
      if (ctx.fillStyle !== none) {
        ctx.fillText(lines[i], x + (dx[i] || 0), y + lineHeight * i);
      }
      if (ctx.strokeStyle !== none) {
        ctx.strokeText(lines[i], x + (dx[i] || 0), y + lineHeight * i);
      }
    }
    var debug = attr.debug || this.statics().debug || Ext.draw.sprite.Sprite.debug;
    if (debug) {
      this.attr.inverseMatrix.toContext(ctx);
      debug.bbox && me.renderBBox(surface, ctx);
    }
  }};
});
Ext.define('Ext.draw.sprite.Tick', {extend:'Ext.draw.sprite.Line', alias:'sprite.tick', inheritableStatics:{def:{processors:{x:'number', y:'number', size:'number'}, defaults:{x:0, y:0, size:4}, triggers:{x:'tick', y:'tick', size:'tick'}, updaters:{tick:function(attr) {
  var size = attr.size * 1.5, halfLineWidth = attr.lineWidth / 2, x = attr.x, y = attr.y;
  this.setAttributes({fromX:x - halfLineWidth, fromY:y - size, toX:x - halfLineWidth, toY:y + size});
}}}}});
Ext.define('Ext.draw.sprite.Triangle', {extend:'Ext.draw.sprite.Path', alias:'sprite.triangle', inheritableStatics:{def:{processors:{x:'number', y:'number', size:'number'}, defaults:{x:0, y:0, size:4}, triggers:{x:'path', y:'path', size:'path'}}}, updatePath:function(path, attr) {
  var s = attr.size * 2.2, x = attr.x, y = attr.y;
  path.fromSvgString('M'.concat(x, ',', y, 'm0-', s * 0.48, 'l', s * 0.5, ',', s * 0.87, '-', s, ',0z'));
}});
Ext.define('Ext.draw.gradient.Linear', {extend:'Ext.draw.gradient.Gradient', requires:['Ext.draw.Color'], type:'linear', config:{degrees:0, radians:0}, applyRadians:function(radians, oldRadians) {
  if (Ext.isNumber(radians)) {
    return radians;
  }
  return oldRadians;
}, applyDegrees:function(degrees, oldDegrees) {
  if (Ext.isNumber(degrees)) {
    return degrees;
  }
  return oldDegrees;
}, updateRadians:function(radians) {
  this.setDegrees(Ext.draw.Draw.degrees(radians));
}, updateDegrees:function(degrees) {
  this.setRadians(Ext.draw.Draw.rad(degrees));
}, generateGradient:function(ctx, bbox) {
  var angle = this.getRadians(), cos = Math.cos(angle), sin = Math.sin(angle), w = bbox.width, h = bbox.height, cx = bbox.x + w * 0.5, cy = bbox.y + h * 0.5, stops = this.getStops(), ln = stops.length, gradient, l, i;
  if (Ext.isNumber(cx) && Ext.isNumber(cy) && h > 0 && w > 0) {
    l = Math.sqrt(h * h + w * w) * Math.abs(Math.cos(angle - Math.atan(h / w))) / 2;
    gradient = ctx.createLinearGradient(cx + cos * l, cy + sin * l, cx - cos * l, cy - sin * l);
    for (i = 0; i < ln; i++) {
      gradient.addColorStop(stops[i].offset, stops[i].color);
    }
    return gradient;
  }
  return Ext.util.Color.NONE;
}});
Ext.define('Ext.draw.gradient.Radial', {extend:'Ext.draw.gradient.Gradient', type:'radial', config:{start:{x:0, y:0, r:0}, end:{x:0, y:0, r:1}}, applyStart:function(newStart, oldStart) {
  if (!oldStart) {
    return newStart;
  }
  var circle = {x:oldStart.x, y:oldStart.y, r:oldStart.r};
  if ('x' in newStart) {
    circle.x = newStart.x;
  } else {
    if ('centerX' in newStart) {
      circle.x = newStart.centerX;
    }
  }
  if ('y' in newStart) {
    circle.y = newStart.y;
  } else {
    if ('centerY' in newStart) {
      circle.y = newStart.centerY;
    }
  }
  if ('r' in newStart) {
    circle.r = newStart.r;
  } else {
    if ('radius' in newStart) {
      circle.r = newStart.radius;
    }
  }
  return circle;
}, applyEnd:function(newEnd, oldEnd) {
  if (!oldEnd) {
    return newEnd;
  }
  var circle = {x:oldEnd.x, y:oldEnd.y, r:oldEnd.r};
  if ('x' in newEnd) {
    circle.x = newEnd.x;
  } else {
    if ('centerX' in newEnd) {
      circle.x = newEnd.centerX;
    }
  }
  if ('y' in newEnd) {
    circle.y = newEnd.y;
  } else {
    if ('centerY' in newEnd) {
      circle.y = newEnd.centerY;
    }
  }
  if ('r' in newEnd) {
    circle.r = newEnd.r;
  } else {
    if ('radius' in newEnd) {
      circle.r = newEnd.radius;
    }
  }
  return circle;
}, generateGradient:function(ctx, bbox) {
  var start = this.getStart(), end = this.getEnd(), w = bbox.width * 0.5, h = bbox.height * 0.5, x = bbox.x + w, y = bbox.y + h, gradient = ctx.createRadialGradient(x + start.x * w, y + start.y * h, start.r * Math.max(w, h), x + end.x * w, y + end.y * h, end.r * Math.max(w, h)), stops = this.getStops(), ln = stops.length, i;
  for (i = 0; i < ln; i++) {
    gradient.addColorStop(stops[i].offset, stops[i].color);
  }
  return gradient;
}});
Ext.define('Ext.draw.Surface', {extend:'Ext.draw.SurfaceBase', xtype:'surface', requires:['Ext.draw.sprite.*', 'Ext.draw.gradient.*', 'Ext.draw.sprite.AttributeDefinition', 'Ext.draw.Matrix', 'Ext.draw.Draw'], uses:['Ext.draw.engine.Canvas'], devicePixelRatio:window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI, deprecated:{'5.1.0':{statics:{methods:{stableSort:function(list) {
  return Ext.Array.sort(list, function(a, b) {
    return a.attr.zIndex - b.attr.zIndex;
  });
}}}}}, cls:Ext.baseCSSPrefix + 'surface', config:{rect:null, background:null, items:[], dirty:false, flipRtlText:false}, isSurface:true, isPendingRenderFrame:false, dirtyPredecessorCount:0, emptyRect:[0, 0, 0, 0], constructor:function(config) {
  var me = this;
  me.predecessors = [];
  me.successors = [];
  me.map = {};
  me.callParent([config]);
  me.matrix = new Ext.draw.Matrix;
  me.inverseMatrix = me.matrix.inverse();
}, roundPixel:function(num) {
  return Math.round(this.devicePixelRatio * num) / this.devicePixelRatio;
}, waitFor:function(surface) {
  var me = this, predecessors = me.predecessors;
  if (!Ext.Array.contains(predecessors, surface)) {
    predecessors.push(surface);
    surface.successors.push(me);
    if (surface.getDirty()) {
      me.dirtyPredecessorCount++;
    }
  }
}, updateDirty:function(dirty) {
  var successors = this.successors, ln = successors.length, i = 0, successor;
  for (; i < ln; i++) {
    successor = successors[i];
    if (dirty) {
      successor.dirtyPredecessorCount++;
      successor.setDirty(true);
    } else {
      successor.dirtyPredecessorCount--;
      if (successor.dirtyPredecessorCount === 0 && successor.isPendingRenderFrame) {
        successor.renderFrame();
      }
    }
  }
}, applyBackground:function(background, oldBackground) {
  this.setDirty(true);
  if (Ext.isString(background)) {
    background = {fillStyle:background};
  }
  return Ext.factory(background, Ext.draw.sprite.Rect, oldBackground);
}, applyRect:function(rect, oldRect) {
  if (oldRect && rect[0] === oldRect[0] && rect[1] === oldRect[1] && rect[2] === oldRect[2] && rect[3] === oldRect[3]) {
    return oldRect;
  }
  if (Ext.isArray(rect)) {
    return [rect[0], rect[1], rect[2], rect[3]];
  } else {
    if (Ext.isObject(rect)) {
      return [rect.x || rect.left, rect.y || rect.top, rect.width || rect.right - rect.left, rect.height || rect.bottom - rect.top];
    }
  }
}, updateRect:function(rect) {
  var me = this, l = rect[0], t = rect[1], r = l + rect[2], b = t + rect[3], background = me.getBackground(), element = me.element;
  element.setLocalXY(Math.floor(l), Math.floor(t));
  element.setSize(Math.ceil(r - Math.floor(l)), Math.ceil(b - Math.floor(t)));
  if (background) {
    background.setAttributes({x:0, y:0, width:Math.ceil(r - Math.floor(l)), height:Math.ceil(b - Math.floor(t))});
  }
  me.setDirty(true);
}, resetTransform:function() {
  this.matrix.set(1, 0, 0, 1, 0, 0);
  this.inverseMatrix.set(1, 0, 0, 1, 0, 0);
  this.setDirty(true);
}, get:function(id) {
  return this.map[id] || this.getItems()[id];
}, add:function() {
  var me = this, args = Array.prototype.slice.call(arguments), argIsArray = Ext.isArray(args[0]), map = me.map, results = [], items, item, sprite, oldSurface, i, ln;
  items = Ext.Array.clean(argIsArray ? args[0] : args);
  if (!items.length) {
    return results;
  }
  for (i = 0, ln = items.length; i < ln; i++) {
    item = items[i];
    if (!item || item.destroyed) {
      continue;
    }
    sprite = null;
    if (item.isSprite && !map[item.getId()]) {
      sprite = item;
    } else {
      if (!map[item.id]) {
        sprite = this.createItem(item);
      }
    }
    if (sprite) {
      map[sprite.getId()] = sprite;
      results.push(sprite);
      oldSurface = sprite.getSurface();
      if (oldSurface && oldSurface.isSurface) {
        oldSurface.remove(sprite);
      }
      sprite.setParent(me);
      sprite.setSurface(me);
      me.onAdd(sprite);
    }
  }
  items = me.getItems();
  if (items) {
    items.push.apply(items, results);
  }
  me.dirtyZIndex = true;
  me.setDirty(true);
  if (!argIsArray && results.length === 1) {
    return results[0];
  } else {
    return results;
  }
}, onAdd:Ext.emptyFn, remove:function(sprite, isDestroy) {
  var me = this, destroying = me.clearing, id, isOwnSprite;
  if (sprite) {
    if (sprite.charAt) {
      sprite = me.map[sprite];
    }
    if (!sprite || !sprite.isSprite) {
      return null;
    }
    id = sprite.id;
    isOwnSprite = me.map[id];
    delete me.map[id];
    if (sprite.destroyed || sprite.destroying) {
      if (isOwnSprite && !destroying) {
        Ext.Array.remove(me.getItems(), sprite);
      }
      return sprite;
    }
    if (!isOwnSprite) {
      if (isDestroy) {
        sprite.destroy();
      }
      return sprite;
    }
    sprite.setParent(null);
    sprite.setSurface(null);
    if (isDestroy) {
      sprite.destroy();
    }
    if (!destroying) {
      Ext.Array.remove(me.getItems(), sprite);
      me.dirtyZIndex = true;
      me.setDirty(true);
    }
  }
  return sprite || null;
}, removeAll:function(isDestroy) {
  var me = this, items = me.getItems(), item, ln, i;
  me.clearing = !!isDestroy;
  for (i = items.length - 1; i >= 0; i--) {
    item = items[i];
    if (isDestroy) {
      item.destroy();
    } else {
      item.setParent(null);
      item.setSurface(null);
    }
  }
  me.clearing = false;
  items.length = 0;
  me.map = {};
  me.dirtyZIndex = true;
  if (!me.destroying) {
    me.setDirty(true);
  }
}, applyItems:function(items) {
  if (this.getItems()) {
    this.removeAll(true);
  }
  return Ext.Array.from(this.add(items));
}, createItem:function(config) {
  return Ext.create(config.xclass || 'sprite.' + config.type, config);
}, getBBox:function(sprites, isWithoutTransform) {
  sprites = Ext.Array.from(sprites);
  var left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity, ln = sprites.length, sprite, bbox, i;
  for (i = 0; i < ln; i++) {
    sprite = sprites[i];
    bbox = sprite.getBBox(isWithoutTransform);
    if (left > bbox.x) {
      left = bbox.x;
    }
    if (right < bbox.x + bbox.width) {
      right = bbox.x + bbox.width;
    }
    if (top > bbox.y) {
      top = bbox.y;
    }
    if (bottom < bbox.y + bbox.height) {
      bottom = bbox.y + bbox.height;
    }
  }
  return {x:left, y:top, width:right - left, height:bottom - top};
}, getEventXY:function(e) {
  var me = this, isRtl = me.getInherited().rtl, pageXY = e.getXY(), container = me.getOwnerBody(), xy = container.getXY(), rect = me.getRect() || me.emptyRect, result = [], width;
  if (isRtl) {
    width = container.getWidth();
    result[0] = xy[0] - pageXY[0] - rect[0] + width;
  } else {
    result[0] = pageXY[0] - xy[0] - rect[0];
  }
  result[1] = pageXY[1] - xy[1] - rect[1];
  return result;
}, clear:Ext.emptyFn, orderByZIndex:function() {
  var me = this, items = me.getItems(), dirtyZIndex = false, i, ln;
  if (me.getDirty()) {
    for (i = 0, ln = items.length; i < ln; i++) {
      if (items[i].attr.dirtyZIndex) {
        dirtyZIndex = true;
        break;
      }
    }
    if (dirtyZIndex) {
      Ext.Array.sort(items, function(a, b) {
        return a.attr.zIndex - b.attr.zIndex;
      });
      this.setDirty(true);
    }
    for (i = 0, ln = items.length; i < ln; i++) {
      items[i].attr.dirtyZIndex = false;
    }
  }
}, repaint:function() {
  var me = this;
  me.repaint = Ext.emptyFn;
  Ext.defer(function() {
    delete me.repaint;
    me.element.repaint();
  }, 1);
}, renderFrame:function() {
  var me = this;
  if (!(me.element && me.getDirty() && me.getRect())) {
    return;
  }
  if (me.dirtyPredecessorCount > 0) {
    me.isPendingRenderFrame = true;
    return;
  }
  var background = me.getBackground(), items = me.getItems(), item, i, ln;
  me.orderByZIndex();
  if (me.getDirty()) {
    me.clear();
    me.clearTransform();
    if (background) {
      me.renderSprite(background);
    }
    for (i = 0, ln = items.length; i < ln; i++) {
      item = items[i];
      if (me.renderSprite(item) === false) {
        return;
      }
      item.attr.textPositionCount = me.textPosition;
    }
    me.setDirty(false);
  }
}, renderSprite:Ext.emptyFn, clearTransform:Ext.emptyFn, destroy:function() {
  var me = this;
  me.destroying = true;
  me.removeAll(true);
  me.destroying = false;
  me.predecessors = me.successors = null;
  if (me.hasListeners.destroy) {
    me.fireEvent('destroy', me);
  }
  me.callParent();
}});
Ext.define('Ext.draw.overrides.hittest.Surface', {override:'Ext.draw.Surface', hitTest:function(point, options) {
  var me = this, sprites = me.getItems(), i, sprite, result;
  options = options || Ext.draw.sprite.Sprite.defaultHitTestOptions;
  for (i = sprites.length - 1; i >= 0; i--) {
    sprite = sprites[i];
    if (sprite.hitTest) {
      result = sprite.hitTest(point, options);
      if (result) {
        return result;
      }
    }
  }
  return null;
}, hitTestEvent:function(event, options) {
  var xy = this.getEventXY(event);
  return this.hitTest(xy, options);
}});
Ext.define('Ext.draw.engine.SvgContext', {requires:['Ext.draw.Color'], toSave:['strokeOpacity', 'strokeStyle', 'fillOpacity', 'fillStyle', 'globalAlpha', 'lineWidth', 'lineCap', 'lineJoin', 'lineDash', 'lineDashOffset', 'miterLimit', 'shadowOffsetX', 'shadowOffsetY', 'shadowBlur', 'shadowColor', 'globalCompositeOperation', 'position', 'fillGradient', 'strokeGradient'], strokeOpacity:1, strokeStyle:'none', fillOpacity:1, fillStyle:'none', lineDas:[], lineDashOffset:0, globalAlpha:1, lineWidth:1, lineCap:'butt', 
lineJoin:'miter', miterLimit:10, shadowOffsetX:0, shadowOffsetY:0, shadowBlur:0, shadowColor:'none', globalCompositeOperation:'src', urlStringRe:/^url\(#([\w\-]+)\)$/, constructor:function(SvgSurface) {
  var me = this;
  me.surface = SvgSurface;
  me.state = [];
  me.matrix = new Ext.draw.Matrix;
  me.path = null;
  me.clear();
}, clear:function() {
  this.group = this.surface.mainGroup;
  this.position = 0;
  this.path = null;
}, getElement:function(tag) {
  return this.surface.getSvgElement(this.group, tag, this.position++);
}, save:function() {
  var toSave = this.toSave, obj = {}, group = this.getElement('g'), key, i;
  for (i = 0; i < toSave.length; i++) {
    key = toSave[i];
    if (key in this) {
      obj[key] = this[key];
    }
  }
  this.position = 0;
  obj.matrix = this.matrix.clone();
  this.state.push(obj);
  this.group = group;
  return group;
}, restore:function() {
  var toSave = this.toSave, obj = this.state.pop(), group = this.group, children = group.dom.childNodes, key, i;
  while (children.length > this.position) {
    group.last().destroy();
  }
  for (i = 0; i < toSave.length; i++) {
    key = toSave[i];
    if (key in obj) {
      this[key] = obj[key];
    } else {
      delete this[key];
    }
  }
  this.setTransform.apply(this, obj.matrix.elements);
  this.group = group.getParent();
}, transform:function(xx, yx, xy, yy, dx, dy) {
  if (this.path) {
    var inv = Ext.draw.Matrix.fly([xx, yx, xy, yy, dx, dy]).inverse();
    this.path.transform(inv);
  }
  this.matrix.append(xx, yx, xy, yy, dx, dy);
}, setTransform:function(xx, yx, xy, yy, dx, dy) {
  if (this.path) {
    this.path.transform(this.matrix);
  }
  this.matrix.reset();
  this.transform(xx, yx, xy, yy, dx, dy);
}, scale:function(x, y) {
  this.transform(x, 0, 0, y, 0, 0);
}, rotate:function(angle) {
  var xx = Math.cos(angle), yx = Math.sin(angle), xy = -Math.sin(angle), yy = Math.cos(angle);
  this.transform(xx, yx, xy, yy, 0, 0);
}, translate:function(x, y) {
  this.transform(1, 0, 0, 1, x, y);
}, setGradientBBox:function(bbox) {
  this.bbox = bbox;
}, beginPath:function() {
  this.path = new Ext.draw.Path;
}, moveTo:function(x, y) {
  if (!this.path) {
    this.beginPath();
  }
  this.path.moveTo(x, y);
  this.path.element = null;
}, lineTo:function(x, y) {
  if (!this.path) {
    this.beginPath();
  }
  this.path.lineTo(x, y);
  this.path.element = null;
}, rect:function(x, y, width, height) {
  this.moveTo(x, y);
  this.lineTo(x + width, y);
  this.lineTo(x + width, y + height);
  this.lineTo(x, y + height);
  this.closePath();
}, strokeRect:function(x, y, width, height) {
  this.beginPath();
  this.rect(x, y, width, height);
  this.stroke();
}, fillRect:function(x, y, width, height) {
  this.beginPath();
  this.rect(x, y, width, height);
  this.fill();
}, closePath:function() {
  if (!this.path) {
    this.beginPath();
  }
  this.path.closePath();
  this.path.element = null;
}, arcSvg:function(r1, r2, rotation, large, swipe, x2, y2) {
  if (!this.path) {
    this.beginPath();
  }
  this.path.arcSvg(r1, r2, rotation, large, swipe, x2, y2);
  this.path.element = null;
}, arc:function(x, y, radius, startAngle, endAngle, anticlockwise) {
  if (!this.path) {
    this.beginPath();
  }
  this.path.arc(x, y, radius, startAngle, endAngle, anticlockwise);
  this.path.element = null;
}, ellipse:function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
  if (!this.path) {
    this.beginPath();
  }
  this.path.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
  this.path.element = null;
}, arcTo:function(x1, y1, x2, y2, radiusX, radiusY, rotation) {
  if (!this.path) {
    this.beginPath();
  }
  this.path.arcTo(x1, y1, x2, y2, radiusX, radiusY, rotation);
  this.path.element = null;
}, bezierCurveTo:function(x1, y1, x2, y2, x3, y3) {
  if (!this.path) {
    this.beginPath();
  }
  this.path.bezierCurveTo(x1, y1, x2, y2, x3, y3);
  this.path.element = null;
}, strokeText:function(text, x, y) {
  text = String(text);
  if (this.strokeStyle) {
    var element = this.getElement('text'), tspan = this.surface.getSvgElement(element, 'tspan', 0);
    this.surface.setElementAttributes(element, {'x':x, 'y':y, 'transform':this.matrix.toSvg(), 'stroke':this.strokeStyle, 'fill':'none', 'opacity':this.globalAlpha, 'stroke-opacity':this.strokeOpacity, 'style':'font: ' + this.font, 'stroke-dasharray':this.lineDash.join(','), 'stroke-dashoffset':this.lineDashOffset});
    if (this.lineDash.length) {
      this.surface.setElementAttributes(element, {'stroke-dasharray':this.lineDash.join(','), 'stroke-dashoffset':this.lineDashOffset});
    }
    if (tspan.dom.firstChild) {
      tspan.dom.removeChild(tspan.dom.firstChild);
    }
    this.surface.setElementAttributes(tspan, {'alignment-baseline':'alphabetic'});
    tspan.dom.appendChild(document.createTextNode(Ext.String.htmlDecode(text)));
  }
}, fillText:function(text, x, y) {
  text = String(text);
  if (this.fillStyle) {
    var element = this.getElement('text'), tspan = this.surface.getSvgElement(element, 'tspan', 0);
    this.surface.setElementAttributes(element, {'x':x, 'y':y, 'transform':this.matrix.toSvg(), 'fill':this.fillStyle, 'opacity':this.globalAlpha, 'fill-opacity':this.fillOpacity, 'style':'font: ' + this.font});
    if (tspan.dom.firstChild) {
      tspan.dom.removeChild(tspan.dom.firstChild);
    }
    this.surface.setElementAttributes(tspan, {'alignment-baseline':'alphabetic'});
    tspan.dom.appendChild(document.createTextNode(Ext.String.htmlDecode(text)));
  }
}, drawImage:function(image, sx, sy, sw, sh, dx, dy, dw, dh) {
  var me = this, element = me.getElement('image'), x = sx, y = sy, width = typeof sw === 'undefined' ? image.width : sw, height = typeof sh === 'undefined' ? image.height : sh, viewBox = null;
  if (typeof dh !== 'undefined') {
    viewBox = sx + ' ' + sy + ' ' + sw + ' ' + sh;
    x = dx;
    y = dy;
    width = dw;
    height = dh;
  }
  element.dom.setAttributeNS('http:/' + '/www.w3.org/1999/xlink', 'href', image.src);
  me.surface.setElementAttributes(element, {viewBox:viewBox, x:x, y:y, width:width, height:height, opacity:me.globalAlpha, transform:me.matrix.toSvg()});
}, fill:function() {
  var me = this;
  if (!me.path) {
    return;
  }
  if (me.fillStyle) {
    var path, fillGradient = me.fillGradient, element = me.path.element, bbox = me.bbox, fill;
    if (!element) {
      path = me.path.toString();
      element = me.path.element = me.getElement('path');
      me.surface.setElementAttributes(element, {'d':path, 'transform':me.matrix.toSvg()});
    }
    if (fillGradient && bbox) {
      fill = fillGradient.generateGradient(me, bbox);
    } else {
      fill = me.fillStyle;
    }
    me.surface.setElementAttributes(element, {'fill':fill, 'fill-opacity':me.fillOpacity * me.globalAlpha});
  }
}, stroke:function() {
  var me = this;
  if (!me.path) {
    return;
  }
  if (me.strokeStyle) {
    var path, strokeGradient = me.strokeGradient, element = me.path.element, bbox = me.bbox, stroke;
    if (!element || !me.path.svgString) {
      path = me.path.toString();
      if (!path) {
        return;
      }
      element = me.path.element = me.getElement('path');
      me.surface.setElementAttributes(element, {'fill':'none', 'd':path, 'transform':me.matrix.toSvg()});
    }
    if (strokeGradient && bbox) {
      stroke = strokeGradient.generateGradient(me, bbox);
    } else {
      stroke = me.strokeStyle;
    }
    me.surface.setElementAttributes(element, {'stroke':stroke, 'stroke-linecap':me.lineCap, 'stroke-linejoin':me.lineJoin, 'stroke-width':me.lineWidth, 'stroke-opacity':me.strokeOpacity * me.globalAlpha, 'stroke-dasharray':me.lineDash.join(','), 'stroke-dashoffset':me.lineDashOffset});
    if (me.lineDash.length) {
      me.surface.setElementAttributes(element, {'stroke-dasharray':me.lineDash.join(','), 'stroke-dashoffset':me.lineDashOffset});
    }
  }
}, fillStroke:function(attr, transformFillStroke) {
  var ctx = this, fillStyle = ctx.fillStyle, strokeStyle = ctx.strokeStyle, fillOpacity = ctx.fillOpacity, strokeOpacity = ctx.strokeOpacity;
  if (transformFillStroke === undefined) {
    transformFillStroke = attr.transformFillStroke;
  }
  if (!transformFillStroke) {
    attr.inverseMatrix.toContext(ctx);
  }
  if (fillStyle && fillOpacity !== 0) {
    ctx.fill();
  }
  if (strokeStyle && strokeOpacity !== 0) {
    ctx.stroke();
  }
}, appendPath:function(path) {
  this.path = path.clone();
}, setLineDash:function(lineDash) {
  this.lineDash = lineDash;
}, getLineDash:function() {
  return this.lineDash;
}, createLinearGradient:function(x0, y0, x1, y1) {
  var me = this, element = me.surface.getNextDef('linearGradient'), gradient;
  me.surface.setElementAttributes(element, {'x1':x0, 'y1':y0, 'x2':x1, 'y2':y1, 'gradientUnits':'userSpaceOnUse'});
  gradient = new Ext.draw.engine.SvgContext.Gradient(me, me.surface, element);
  return gradient;
}, createRadialGradient:function(x0, y0, r0, x1, y1, r1) {
  var me = this, element = me.surface.getNextDef('radialGradient'), gradient;
  me.surface.setElementAttributes(element, {fx:x0, fy:y0, cx:x1, cy:y1, r:r1, gradientUnits:'userSpaceOnUse'});
  gradient = new Ext.draw.engine.SvgContext.Gradient(me, me.surface, element, r0 / r1);
  return gradient;
}});
Ext.define('Ext.draw.engine.SvgContext.Gradient', {isGradient:true, constructor:function(ctx, surface, element, compression) {
  var me = this;
  me.ctx = ctx;
  me.surface = surface;
  me.element = element;
  me.position = 0;
  me.compression = compression || 0;
}, addColorStop:function(offset, color) {
  var me = this, stop = me.surface.getSvgElement(me.element, 'stop', me.position++), compression = me.compression;
  me.surface.setElementAttributes(stop, {'offset':(((1 - compression) * offset + compression) * 100).toFixed(2) + '%', 'stop-color':color, 'stop-opacity':Ext.util.Color.fly(color).a.toFixed(15)});
}, toString:function() {
  var children = this.element.dom.childNodes;
  while (children.length > this.position) {
    Ext.fly(children[children.length - 1]).destroy();
  }
  return 'url(#' + this.element.getId() + ')';
}});
Ext.define('Ext.draw.engine.Svg', {extend:'Ext.draw.Surface', requires:['Ext.draw.engine.SvgContext'], isSVG:true, config:{highPrecision:false}, getElementConfig:function() {
  return {reference:'element', style:{position:'absolute'}, children:[{reference:'bodyElement', style:{width:'100%', height:'100%', position:'relative'}, children:[{tag:'svg', reference:'svgElement', namespace:'http://www.w3.org/2000/svg', width:'100%', height:'100%', version:1.1}]}]};
}, constructor:function(config) {
  var me = this;
  me.callParent([config]);
  me.mainGroup = me.createSvgNode('g');
  me.defsElement = me.createSvgNode('defs');
  me.svgElement.appendChild(me.mainGroup);
  me.svgElement.appendChild(me.defsElement);
  me.ctx = new Ext.draw.engine.SvgContext(me);
}, createSvgNode:function(type) {
  var node = document.createElementNS('http://www.w3.org/2000/svg', type);
  return Ext.get(node);
}, getSvgElement:function(group, tag, position) {
  var childNodes = group.dom.childNodes, length = childNodes.length, element;
  if (position < length) {
    element = childNodes[position];
    if (element.tagName === tag) {
      return Ext.get(element);
    } else {
      Ext.destroy(element);
    }
  } else {
    if (position > length) {
      Ext.raise('Invalid position.');
    }
  }
  element = Ext.get(this.createSvgNode(tag));
  if (position === 0) {
    group.insertFirst(element);
  } else {
    element.insertAfter(Ext.fly(childNodes[position - 1]));
  }
  element.cache = {};
  return element;
}, setElementAttributes:function(element, attributes) {
  var dom = element.dom, cache = element.cache, name, value;
  for (name in attributes) {
    value = attributes[name];
    if (cache[name] !== value) {
      cache[name] = value;
      dom.setAttribute(name, value);
    }
  }
}, getNextDef:function(tagName) {
  return this.getSvgElement(this.defsElement, tagName, this.defsPosition++);
}, clearTransform:function() {
  var me = this;
  me.mainGroup.set({transform:me.matrix.toSvg()});
}, clear:function() {
  this.ctx.clear();
  this.removeSurplusDefs();
  this.defsPosition = 0;
}, removeSurplusDefs:function() {
  var defsElement = this.defsElement, defs = defsElement.dom.childNodes, ln = defs.length, i;
  for (i = ln - 1; i > this.defsPosition; i--) {
    defsElement.removeChild(defs[i]);
  }
}, renderSprite:function(sprite) {
  var me = this, rect = me.getRect(), ctx = me.ctx;
  if (sprite.attr.hidden || sprite.attr.globalAlpha === 0) {
    ctx.save();
    ctx.restore();
    return;
  }
  sprite.element = ctx.save();
  sprite.preRender(this);
  sprite.useAttributes(ctx, rect);
  if (false === sprite.render(this, ctx, [0, 0, rect[2], rect[3]])) {
    return false;
  }
  sprite.setDirty(false);
  ctx.restore();
}, toSVG:function(size, surfaces) {
  var className = Ext.getClassName(this), svg, surface, rect, i;
  svg = '\x3csvg version\x3d"1.1" baseProfile\x3d"full" xmlns\x3d"http://www.w3.org/2000/svg"' + ' width\x3d"' + size.width + '"' + ' height\x3d"' + size.height + '"\x3e';
  for (i = 0; i < surfaces.length; i++) {
    surface = surfaces[i];
    if (Ext.getClassName(surface) !== className) {
      continue;
    }
    rect = surface.getRect();
    svg += '\x3cg transform\x3d"translate(' + rect[0] + ',' + rect[1] + ')"\x3e';
    svg += this.serializeNode(surface.svgElement.dom);
    svg += '\x3c/g\x3e';
  }
  svg += '\x3c/svg\x3e';
  return svg;
}, b64EncodeUnicode:function(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode('0x' + p1);
  }));
}, flatten:function(size, surfaces) {
  var svg = '\x3c?xml version\x3d"1.0" standalone\x3d"yes"?\x3e';
  svg += this.toSVG(size, surfaces);
  return {data:'data:image/svg+xml;base64,' + this.b64EncodeUnicode(svg), type:'svg'};
}, serializeNode:function(node) {
  var result = '', i, n, attr, child;
  if (node.nodeType === document.TEXT_NODE) {
    return node.nodeValue;
  }
  result += '\x3c' + node.nodeName;
  if (node.attributes.length) {
    for (i = 0, n = node.attributes.length; i < n; i++) {
      attr = node.attributes[i];
      result += ' ' + attr.name + '\x3d"' + Ext.String.htmlEncode(attr.value) + '"';
    }
  }
  result += '\x3e';
  if (node.childNodes && node.childNodes.length) {
    for (i = 0, n = node.childNodes.length; i < n; i++) {
      child = node.childNodes[i];
      result += this.serializeNode(child);
    }
  }
  result += '\x3c/' + node.nodeName + '\x3e';
  return result;
}, destroy:function() {
  var me = this;
  me.ctx.destroy();
  me.mainGroup.destroy();
  me.defsElement.destroy();
  delete me.mainGroup;
  delete me.defsElement;
  delete me.ctx;
  me.callParent();
}, remove:function(sprite, destroySprite) {
  if (sprite && sprite.element) {
    sprite.element.destroy();
    sprite.element = null;
  }
  this.callParent(arguments);
}});
Ext.draw || (Ext.draw = {});
Ext.draw.engine || (Ext.draw.engine = {});
Ext.draw.engine.excanvas = true;
if (!document.createElement('canvas').getContext) {
  (function() {
    var m = Math;
    var mr = m.round;
    var ms = m.sin;
    var mc = m.cos;
    var abs = m.abs;
    var sqrt = m.sqrt;
    var Z = 10;
    var Z2 = Z / 2;
    var IE_VERSION = +navigator.userAgent.match(/MSIE ([\d.]+)?/)[1];
    function getContext() {
      return this.context_ || (this.context_ = new CanvasRenderingContext2D_(this));
    }
    var slice = Array.prototype.slice;
    function bind(f, obj, var_args) {
      var a = slice.call(arguments, 2);
      return function() {
        return f.apply(obj, a.concat(slice.call(arguments)));
      };
    }
    function encodeHtmlAttribute(s) {
      return String(s).replace(/&/g, '\x26amp;').replace(/"/g, '\x26quot;');
    }
    function addNamespace(doc, prefix, urn) {
      Ext.onReady(function() {
        if (!doc.namespaces[prefix]) {
          doc.namespaces.add(prefix, urn, '#default#VML');
        }
      });
    }
    function addNamespacesAndStylesheet(doc) {
      addNamespace(doc, 'g_vml_', 'urn:schemas-microsoft-com:vml');
      addNamespace(doc, 'g_o_', 'urn:schemas-microsoft-com:office:office');
      if (!doc.styleSheets['ex_canvas_']) {
        var ss = doc.createStyleSheet();
        ss.owningElement.id = 'ex_canvas_';
        ss.cssText = 'canvas{display:inline-block;overflow:hidden;' + 'text-align:left;width:300px;height:150px}';
      }
    }
    addNamespacesAndStylesheet(document);
    var G_vmlCanvasManager_ = {init:function(opt_doc) {
      var doc = opt_doc || document;
      doc.createElement('canvas');
      doc.attachEvent('onreadystatechange', bind(this.init_, this, doc));
    }, init_:function(doc) {
      var els = doc.getElementsByTagName('canvas');
      for (var i = 0; i < els.length; i++) {
        this.initElement(els[i]);
      }
    }, initElement:function(el) {
      if (!el.getContext) {
        el.getContext = getContext;
        addNamespacesAndStylesheet(el.ownerDocument);
        el.innerHTML = '';
        el.attachEvent('onpropertychange', onPropertyChange);
        el.attachEvent('onresize', onResize);
        var attrs = el.attributes;
        if (attrs.width && attrs.width.specified) {
          el.style.width = attrs.width.nodeValue + 'px';
        } else {
          el.width = el.clientWidth;
        }
        if (attrs.height && attrs.height.specified) {
          el.style.height = attrs.height.nodeValue + 'px';
        } else {
          el.height = el.clientHeight;
        }
      }
      return el;
    }};
    function onPropertyChange(e) {
      var el = e.srcElement;
      switch(e.propertyName) {
        case 'width':
          el.getContext().clearRect();
          el.style.width = el.attributes.width.nodeValue + 'px';
          el.firstChild.style.width = el.clientWidth + 'px';
          break;
        case 'height':
          el.getContext().clearRect();
          el.style.height = el.attributes.height.nodeValue + 'px';
          el.firstChild.style.height = el.clientHeight + 'px';
          break;
      }
    }
    function onResize(e) {
      var el = e.srcElement;
      if (el.firstChild) {
        el.firstChild.style.width = el.clientWidth + 'px';
        el.firstChild.style.height = el.clientHeight + 'px';
      }
    }
    G_vmlCanvasManager_.init();
    var decToHex = [];
    for (var i = 0; i < 16; i++) {
      for (var j = 0; j < 16; j++) {
        decToHex[i * 16 + j] = i.toString(16) + j.toString(16);
      }
    }
    function createMatrixIdentity() {
      return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    }
    function matrixMultiply(m1, m2) {
      var result = createMatrixIdentity();
      for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
          var sum = 0;
          for (var z = 0; z < 3; z++) {
            sum += m1[x][z] * m2[z][y];
          }
          result[x][y] = sum;
        }
      }
      return result;
    }
    function copyState(o1, o2) {
      o2.fillStyle = o1.fillStyle;
      o2.lineCap = o1.lineCap;
      o2.lineJoin = o1.lineJoin;
      o2.lineDash = o1.lineDash;
      o2.lineWidth = o1.lineWidth;
      o2.miterLimit = o1.miterLimit;
      o2.shadowBlur = o1.shadowBlur;
      o2.shadowColor = o1.shadowColor;
      o2.shadowOffsetX = o1.shadowOffsetX;
      o2.shadowOffsetY = o1.shadowOffsetY;
      o2.strokeStyle = o1.strokeStyle;
      o2.globalAlpha = o1.globalAlpha;
      o2.font = o1.font;
      o2.textAlign = o1.textAlign;
      o2.textBaseline = o1.textBaseline;
      o2.arcScaleX_ = o1.arcScaleX_;
      o2.arcScaleY_ = o1.arcScaleY_;
      o2.lineScale_ = o1.lineScale_;
    }
    var colorData = {aliceblue:'#F0F8FF', antiquewhite:'#FAEBD7', aquamarine:'#7FFFD4', azure:'#F0FFFF', beige:'#F5F5DC', bisque:'#FFE4C4', black:'#000000', blanchedalmond:'#FFEBCD', blueviolet:'#8A2BE2', brown:'#A52A2A', burlywood:'#DEB887', cadetblue:'#5F9EA0', chartreuse:'#7FFF00', chocolate:'#D2691E', coral:'#FF7F50', cornflowerblue:'#6495ED', cornsilk:'#FFF8DC', crimson:'#DC143C', cyan:'#00FFFF', darkblue:'#00008B', darkcyan:'#008B8B', darkgoldenrod:'#B8860B', darkgray:'#A9A9A9', darkgreen:'#006400', 
    darkgrey:'#A9A9A9', darkkhaki:'#BDB76B', darkmagenta:'#8B008B', darkolivegreen:'#556B2F', darkorange:'#FF8C00', darkorchid:'#9932CC', darkred:'#8B0000', darksalmon:'#E9967A', darkseagreen:'#8FBC8F', darkslateblue:'#483D8B', darkslategray:'#2F4F4F', darkslategrey:'#2F4F4F', darkturquoise:'#00CED1', darkviolet:'#9400D3', deeppink:'#FF1493', deepskyblue:'#00BFFF', dimgray:'#696969', dimgrey:'#696969', dodgerblue:'#1E90FF', firebrick:'#B22222', floralwhite:'#FFFAF0', forestgreen:'#228B22', gainsboro:'#DCDCDC', 
    ghostwhite:'#F8F8FF', gold:'#FFD700', goldenrod:'#DAA520', grey:'#808080', greenyellow:'#ADFF2F', honeydew:'#F0FFF0', hotpink:'#FF69B4', indianred:'#CD5C5C', indigo:'#4B0082', ivory:'#FFFFF0', khaki:'#F0E68C', lavender:'#E6E6FA', lavenderblush:'#FFF0F5', lawngreen:'#7CFC00', lemonchiffon:'#FFFACD', lightblue:'#ADD8E6', lightcoral:'#F08080', lightcyan:'#E0FFFF', lightgoldenrodyellow:'#FAFAD2', lightgreen:'#90EE90', lightgrey:'#D3D3D3', lightpink:'#FFB6C1', lightsalmon:'#FFA07A', lightseagreen:'#20B2AA', 
    lightskyblue:'#87CEFA', lightslategray:'#778899', lightslategrey:'#778899', lightsteelblue:'#B0C4DE', lightyellow:'#FFFFE0', limegreen:'#32CD32', linen:'#FAF0E6', magenta:'#FF00FF', mediumaquamarine:'#66CDAA', mediumblue:'#0000CD', mediumorchid:'#BA55D3', mediumpurple:'#9370DB', mediumseagreen:'#3CB371', mediumslateblue:'#7B68EE', mediumspringgreen:'#00FA9A', mediumturquoise:'#48D1CC', mediumvioletred:'#C71585', midnightblue:'#191970', mintcream:'#F5FFFA', mistyrose:'#FFE4E1', moccasin:'#FFE4B5', 
    navajowhite:'#FFDEAD', oldlace:'#FDF5E6', olivedrab:'#6B8E23', orange:'#FFA500', orangered:'#FF4500', orchid:'#DA70D6', palegoldenrod:'#EEE8AA', palegreen:'#98FB98', paleturquoise:'#AFEEEE', palevioletred:'#DB7093', papayawhip:'#FFEFD5', peachpuff:'#FFDAB9', peru:'#CD853F', pink:'#FFC0CB', plum:'#DDA0DD', powderblue:'#B0E0E6', rosybrown:'#BC8F8F', royalblue:'#4169E1', saddlebrown:'#8B4513', salmon:'#FA8072', sandybrown:'#F4A460', seagreen:'#2E8B57', seashell:'#FFF5EE', sienna:'#A0522D', skyblue:'#87CEEB', 
    slateblue:'#6A5ACD', slategray:'#708090', slategrey:'#708090', snow:'#FFFAFA', springgreen:'#00FF7F', steelblue:'#4682B4', tan:'#D2B48C', thistle:'#D8BFD8', tomato:'#FF6347', turquoise:'#40E0D0', violet:'#EE82EE', wheat:'#F5DEB3', whitesmoke:'#F5F5F5', yellowgreen:'#9ACD32'};
    function getRgbHslContent(styleString) {
      var start = styleString.indexOf('(', 3);
      var end = styleString.indexOf(')', start + 1);
      var parts = styleString.substring(start + 1, end).split(',');
      if (parts.length != 4 || styleString.charAt(3) != 'a') {
        parts[3] = 1;
      }
      return parts;
    }
    function percent(s) {
      return parseFloat(s) / 100;
    }
    function clamp(v, min, max) {
      return Math.min(max, Math.max(min, v));
    }
    function hslToRgb(parts) {
      var r, g, b, h, s, l;
      h = parseFloat(parts[0]) / 360 % 360;
      if (h < 0) {
        h++;
      }
      s = clamp(percent(parts[1]), 0, 1);
      l = clamp(percent(parts[2]), 0, 1);
      if (s == 0) {
        r = g = b = l;
      } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hueToRgb(p, q, h + 1 / 3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1 / 3);
      }
      return '#' + decToHex[Math.floor(r * 255)] + decToHex[Math.floor(g * 255)] + decToHex[Math.floor(b * 255)];
    }
    function hueToRgb(m1, m2, h) {
      if (h < 0) {
        h++;
      }
      if (h > 1) {
        h--;
      }
      if (6 * h < 1) {
        return m1 + (m2 - m1) * 6 * h;
      } else {
        if (2 * h < 1) {
          return m2;
        } else {
          if (3 * h < 2) {
            return m1 + (m2 - m1) * (2 / 3 - h) * 6;
          } else {
            return m1;
          }
        }
      }
    }
    var processStyleCache = {};
    function processStyle(styleString) {
      if (styleString in processStyleCache) {
        return processStyleCache[styleString];
      }
      var str, alpha = 1;
      styleString = String(styleString);
      if (styleString.charAt(0) == '#') {
        str = styleString;
      } else {
        if (/^rgb/.test(styleString)) {
          var parts = getRgbHslContent(styleString);
          var str = '#', n;
          for (var i = 0; i < 3; i++) {
            if (parts[i].indexOf('%') != -1) {
              n = Math.floor(percent(parts[i]) * 255);
            } else {
              n = +parts[i];
            }
            str += decToHex[clamp(n, 0, 255)];
          }
          alpha = +parts[3];
        } else {
          if (/^hsl/.test(styleString)) {
            var parts = getRgbHslContent(styleString);
            str = hslToRgb(parts);
            alpha = parts[3];
          } else {
            str = colorData[styleString] || styleString;
          }
        }
      }
      return processStyleCache[styleString] = {color:str, alpha:alpha};
    }
    var DEFAULT_STYLE = {style:'normal', variant:'normal', weight:'normal', size:10, family:'sans-serif'};
    var fontStyleCache = {};
    function processFontStyle(styleString) {
      if (fontStyleCache[styleString]) {
        return fontStyleCache[styleString];
      }
      var el = document.createElement('div');
      var style = el.style;
      try {
        style.font = styleString;
      } catch (ex) {
      }
      return fontStyleCache[styleString] = {style:style.fontStyle || DEFAULT_STYLE.style, variant:style.fontVariant || DEFAULT_STYLE.variant, weight:style.fontWeight || DEFAULT_STYLE.weight, size:style.fontSize || DEFAULT_STYLE.size, family:style.fontFamily || DEFAULT_STYLE.family};
    }
    function getComputedStyle(style, element) {
      var computedStyle = {};
      for (var p in style) {
        computedStyle[p] = style[p];
      }
      var canvasFontSize = parseFloat(element.currentStyle.fontSize), fontSize = parseFloat(style.size);
      if (typeof style.size == 'number') {
        computedStyle.size = style.size;
      } else {
        if (style.size.indexOf('px') != -1) {
          computedStyle.size = fontSize;
        } else {
          if (style.size.indexOf('em') != -1) {
            computedStyle.size = canvasFontSize * fontSize;
          } else {
            if (style.size.indexOf('%') != -1) {
              computedStyle.size = canvasFontSize / 100 * fontSize;
            } else {
              if (style.size.indexOf('pt') != -1) {
                computedStyle.size = fontSize / 0.75;
              } else {
                computedStyle.size = canvasFontSize;
              }
            }
          }
        }
      }
      computedStyle.size *= 0.981;
      return computedStyle;
    }
    function buildStyle(style) {
      return style.style + ' ' + style.variant + ' ' + style.weight + ' ' + style.size + 'px ' + style.family;
    }
    var lineCapMap = {'butt':'flat', 'round':'round'};
    function processLineCap(lineCap) {
      return lineCapMap[lineCap] || 'square';
    }
    function CanvasRenderingContext2D_(canvasElement) {
      this.m_ = createMatrixIdentity();
      this.mStack_ = [];
      this.aStack_ = [];
      this.currentPath_ = [];
      this.strokeStyle = '#000';
      this.fillStyle = '#000';
      this.lineWidth = 1;
      this.lineJoin = 'miter';
      this.lineDash = [];
      this.lineCap = 'butt';
      this.miterLimit = Z * 1;
      this.globalAlpha = 1;
      this.font = '10px sans-serif';
      this.textAlign = 'left';
      this.textBaseline = 'alphabetic';
      this.canvas = canvasElement;
      var cssText = 'width:' + canvasElement.clientWidth + 'px;height:' + canvasElement.clientHeight + 'px;overflow:hidden;position:absolute';
      var el = canvasElement.ownerDocument.createElement('div');
      el.style.cssText = cssText;
      canvasElement.appendChild(el);
      var overlayEl = el.cloneNode(false);
      overlayEl.style.backgroundColor = 'red';
      overlayEl.style.filter = 'alpha(opacity\x3d0)';
      canvasElement.appendChild(overlayEl);
      this.element_ = el;
      this.arcScaleX_ = 1;
      this.arcScaleY_ = 1;
      this.lineScale_ = 1;
    }
    var contextPrototype = CanvasRenderingContext2D_.prototype;
    contextPrototype.clearRect = function() {
      if (this.textMeasureEl_) {
        this.textMeasureEl_.removeNode(true);
        this.textMeasureEl_ = null;
      }
      this.element_.innerHTML = '';
    };
    contextPrototype.beginPath = function() {
      this.currentPath_ = [];
    };
    contextPrototype.moveTo = function(aX, aY) {
      var p = getCoords(this, aX, aY);
      this.currentPath_.push({type:'moveTo', x:p.x, y:p.y});
      this.currentX_ = p.x;
      this.currentY_ = p.y;
    };
    contextPrototype.lineTo = function(aX, aY) {
      var p = getCoords(this, aX, aY);
      this.currentPath_.push({type:'lineTo', x:p.x, y:p.y});
      this.currentX_ = p.x;
      this.currentY_ = p.y;
    };
    contextPrototype.bezierCurveTo = function(aCP1x, aCP1y, aCP2x, aCP2y, aX, aY) {
      var p = getCoords(this, aX, aY);
      var cp1 = getCoords(this, aCP1x, aCP1y);
      var cp2 = getCoords(this, aCP2x, aCP2y);
      bezierCurveTo(this, cp1, cp2, p);
    };
    function bezierCurveTo(self, cp1, cp2, p) {
      self.currentPath_.push({type:'bezierCurveTo', cp1x:cp1.x, cp1y:cp1.y, cp2x:cp2.x, cp2y:cp2.y, x:p.x, y:p.y});
      self.currentX_ = p.x;
      self.currentY_ = p.y;
    }
    contextPrototype.quadraticCurveTo = function(aCPx, aCPy, aX, aY) {
      var cp = getCoords(this, aCPx, aCPy);
      var p = getCoords(this, aX, aY);
      var cp1 = {x:this.currentX_ + 2 / 3 * (cp.x - this.currentX_), y:this.currentY_ + 2 / 3 * (cp.y - this.currentY_)};
      var cp2 = {x:cp1.x + (p.x - this.currentX_) / 3, y:cp1.y + (p.y - this.currentY_) / 3};
      bezierCurveTo(this, cp1, cp2, p);
    };
    contextPrototype.arc = function(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
      aRadius *= Z;
      var arcType = aClockwise ? 'at' : 'wa';
      var xStart = aX + mc(aStartAngle) * aRadius - Z2;
      var yStart = aY + ms(aStartAngle) * aRadius - Z2;
      var xEnd = aX + mc(aEndAngle) * aRadius - Z2;
      var yEnd = aY + ms(aEndAngle) * aRadius - Z2;
      if (xStart == xEnd && !aClockwise) {
        xStart += 0.125;
      }
      var p = getCoords(this, aX, aY);
      var pStart = getCoords(this, xStart, yStart);
      var pEnd = getCoords(this, xEnd, yEnd);
      this.currentPath_.push({type:arcType, x:p.x, y:p.y, radius:aRadius, xStart:pStart.x, yStart:pStart.y, xEnd:pEnd.x, yEnd:pEnd.y});
    };
    contextPrototype.rect = function(aX, aY, aWidth, aHeight) {
      this.moveTo(aX, aY);
      this.lineTo(aX + aWidth, aY);
      this.lineTo(aX + aWidth, aY + aHeight);
      this.lineTo(aX, aY + aHeight);
      this.closePath();
    };
    contextPrototype.strokeRect = function(aX, aY, aWidth, aHeight) {
      var oldPath = this.currentPath_;
      this.beginPath();
      this.moveTo(aX, aY);
      this.lineTo(aX + aWidth, aY);
      this.lineTo(aX + aWidth, aY + aHeight);
      this.lineTo(aX, aY + aHeight);
      this.closePath();
      this.stroke();
      this.currentPath_ = oldPath;
    };
    contextPrototype.fillRect = function(aX, aY, aWidth, aHeight) {
      var oldPath = this.currentPath_;
      this.beginPath();
      this.moveTo(aX, aY);
      this.lineTo(aX + aWidth, aY);
      this.lineTo(aX + aWidth, aY + aHeight);
      this.lineTo(aX, aY + aHeight);
      this.closePath();
      this.fill();
      this.currentPath_ = oldPath;
    };
    contextPrototype.createLinearGradient = function(aX0, aY0, aX1, aY1) {
      var gradient = new CanvasGradient_('gradient');
      gradient.x0_ = aX0;
      gradient.y0_ = aY0;
      gradient.x1_ = aX1;
      gradient.y1_ = aY1;
      return gradient;
    };
    contextPrototype.createRadialGradient = function(aX0, aY0, aR0, aX1, aY1, aR1) {
      var gradient = new CanvasGradient_('gradientradial');
      gradient.x0_ = aX0;
      gradient.y0_ = aY0;
      gradient.r0_ = aR0;
      gradient.x1_ = aX1;
      gradient.y1_ = aY1;
      gradient.r1_ = aR1;
      return gradient;
    };
    contextPrototype.drawImage = function(image, var_args) {
      var dx, dy, dw, dh, sx, sy, sw, sh;
      var oldRuntimeWidth = image.runtimeStyle.width;
      var oldRuntimeHeight = image.runtimeStyle.height;
      image.runtimeStyle.width = 'auto';
      image.runtimeStyle.height = 'auto';
      var w = image.width;
      var h = image.height;
      image.runtimeStyle.width = oldRuntimeWidth;
      image.runtimeStyle.height = oldRuntimeHeight;
      if (arguments.length == 3) {
        dx = arguments[1];
        dy = arguments[2];
        sx = sy = 0;
        sw = dw = w;
        sh = dh = h;
      } else {
        if (arguments.length == 5) {
          dx = arguments[1];
          dy = arguments[2];
          dw = arguments[3];
          dh = arguments[4];
          sx = sy = 0;
          sw = w;
          sh = h;
        } else {
          if (arguments.length == 9) {
            sx = arguments[1];
            sy = arguments[2];
            sw = arguments[3];
            sh = arguments[4];
            dx = arguments[5];
            dy = arguments[6];
            dw = arguments[7];
            dh = arguments[8];
          } else {
            throw Error('Invalid number of arguments');
          }
        }
      }
      var d = getCoords(this, dx, dy);
      var vmlStr = [];
      var W = 10;
      var H = 10;
      var m = this.m_;
      vmlStr.push(' \x3cg_vml_:group', ' coordsize\x3d"', Z * W, ',', Z * H, '"', ' coordorigin\x3d"0,0"', ' style\x3d"width:', mr(W * m[0][0]), 'px;height:', mr(H * m[1][1]), 'px;position:absolute;', 'top:', mr(d.y / Z), 'px;left:', mr(d.x / Z), 'px; rotation:', mr(Math.atan(m[0][1] / m[1][1]) * 180 / Math.PI), ';');
      vmlStr.push('" \x3e', '\x3cg_vml_:image src\x3d"', image.src, '"', ' style\x3d"width:', Z * dw, 'px;', ' height:', Z * dh, 'px"', ' cropleft\x3d"', sx / w, '"', ' croptop\x3d"', sy / h, '"', ' cropright\x3d"', (w - sx - sw) / w, '"', ' cropbottom\x3d"', (h - sy - sh) / h, '"', ' /\x3e', '\x3c/g_vml_:group\x3e');
      this.element_.insertAdjacentHTML('BeforeEnd', vmlStr.join(''));
    };
    contextPrototype.setLineDash = function(lineDash) {
      if (lineDash.length === 1) {
        lineDash = lineDash.slice();
        lineDash[1] = lineDash[0];
      }
      this.lineDash = lineDash;
    };
    contextPrototype.getLineDash = function() {
      return this.lineDash;
    };
    contextPrototype.stroke = function(aFill) {
      var lineStr = [];
      var W = 10;
      var H = 10;
      lineStr.push('\x3cg_vml_:shape', ' filled\x3d"', !!aFill, '"', ' style\x3d"position:absolute;width:', W, 'px;height:', H, 'px;left:0px;top:0px;"', ' coordorigin\x3d"0,0"', ' coordsize\x3d"', Z * W, ',', Z * H, '"', ' stroked\x3d"', !aFill, '"', ' path\x3d"');
      var min = {x:null, y:null};
      var max = {x:null, y:null};
      for (var i = 0; i < this.currentPath_.length; i++) {
        var p = this.currentPath_[i];
        var c;
        switch(p.type) {
          case 'moveTo':
            c = p;
            lineStr.push(' m ', mr(p.x), ',', mr(p.y));
            break;
          case 'lineTo':
            lineStr.push(' l ', mr(p.x), ',', mr(p.y));
            break;
          case 'close':
            lineStr.push(' x ');
            p = null;
            break;
          case 'bezierCurveTo':
            lineStr.push(' c ', mr(p.cp1x), ',', mr(p.cp1y), ',', mr(p.cp2x), ',', mr(p.cp2y), ',', mr(p.x), ',', mr(p.y));
            break;
          case 'at':
          case 'wa':
            lineStr.push(' ', p.type, ' ', mr(p.x - this.arcScaleX_ * p.radius), ',', mr(p.y - this.arcScaleY_ * p.radius), ' ', mr(p.x + this.arcScaleX_ * p.radius), ',', mr(p.y + this.arcScaleY_ * p.radius), ' ', mr(p.xStart), ',', mr(p.yStart), ' ', mr(p.xEnd), ',', mr(p.yEnd));
            break;
        }
        if (p) {
          if (min.x == null || p.x < min.x) {
            min.x = p.x;
          }
          if (max.x == null || p.x > max.x) {
            max.x = p.x;
          }
          if (min.y == null || p.y < min.y) {
            min.y = p.y;
          }
          if (max.y == null || p.y > max.y) {
            max.y = p.y;
          }
        }
      }
      lineStr.push(' "\x3e');
      if (!aFill) {
        appendStroke(this, lineStr);
      } else {
        appendFill(this, lineStr, min, max);
      }
      lineStr.push('\x3c/g_vml_:shape\x3e');
      this.element_.insertAdjacentHTML('beforeEnd', lineStr.join(''));
    };
    function appendStroke(ctx, lineStr) {
      var a = processStyle(ctx.strokeStyle);
      var color = a.color;
      var opacity = a.alpha * ctx.globalAlpha;
      var lineWidth = ctx.lineScale_ * ctx.lineWidth;
      if (lineWidth < 1) {
        opacity *= lineWidth;
      }
      lineStr.push('\x3cg_vml_:stroke', ' opacity\x3d"', opacity, '"', ' joinstyle\x3d"', ctx.lineJoin, '"', ' dashstyle\x3d"', ctx.lineDash.join(' '), '"', ' miterlimit\x3d"', ctx.miterLimit, '"', ' endcap\x3d"', processLineCap(ctx.lineCap), '"', ' weight\x3d"', lineWidth, 'px"', ' color\x3d"', color, '" /\x3e');
    }
    function appendFill(ctx, lineStr, min, max) {
      var fillStyle = ctx.fillStyle;
      var arcScaleX = ctx.arcScaleX_;
      var arcScaleY = ctx.arcScaleY_;
      var width = max.x - min.x;
      var height = max.y - min.y;
      if (fillStyle instanceof CanvasGradient_) {
        var angle = 0;
        var focus = {x:0, y:0};
        var shift = 0;
        var expansion = 1;
        if (fillStyle.type_ == 'gradient') {
          var x0 = fillStyle.x0_ / arcScaleX;
          var y0 = fillStyle.y0_ / arcScaleY;
          var x1 = fillStyle.x1_ / arcScaleX;
          var y1 = fillStyle.y1_ / arcScaleY;
          var p0 = getCoords(ctx, x0, y0);
          var p1 = getCoords(ctx, x1, y1);
          var dx = p1.x - p0.x;
          var dy = p1.y - p0.y;
          angle = Math.atan2(dx, dy) * 180 / Math.PI;
          if (angle < 0) {
            angle += 360;
          }
          if (angle < 1.0E-6) {
            angle = 0;
          }
        } else {
          var p0 = getCoords(ctx, fillStyle.x0_, fillStyle.y0_);
          focus = {x:(p0.x - min.x) / width, y:(p0.y - min.y) / height};
          width /= arcScaleX * Z;
          height /= arcScaleY * Z;
          var dimension = m.max(width, height);
          shift = 2 * fillStyle.r0_ / dimension;
          expansion = 2 * fillStyle.r1_ / dimension - shift;
        }
        var stops = fillStyle.colors_;
        stops.sort(function(cs1, cs2) {
          return cs1.offset - cs2.offset;
        });
        var length = stops.length;
        var color1 = stops[0].color;
        var color2 = stops[length - 1].color;
        var opacity1 = stops[0].alpha * ctx.globalAlpha;
        var opacity2 = stops[length - 1].alpha * ctx.globalAlpha;
        var colors = [];
        for (var i = 0; i < length; i++) {
          var stop = stops[i];
          colors.push(stop.offset * expansion + shift + ' ' + stop.color);
        }
        lineStr.push('\x3cg_vml_:fill type\x3d"', fillStyle.type_, '"', ' method\x3d"none" focus\x3d"100%"', ' color\x3d"', color1, '"', ' color2\x3d"', color2, '"', ' colors\x3d"', colors.join(','), '"', ' opacity\x3d"', opacity2, '"', ' g_o_:opacity2\x3d"', opacity1, '"', ' angle\x3d"', angle, '"', ' focusposition\x3d"', focus.x, ',', focus.y, '" /\x3e');
      } else {
        if (fillStyle instanceof CanvasPattern_) {
          if (width && height) {
            var deltaLeft = -min.x;
            var deltaTop = -min.y;
            lineStr.push('\x3cg_vml_:fill', ' position\x3d"', deltaLeft / width * arcScaleX * arcScaleX, ',', deltaTop / height * arcScaleY * arcScaleY, '"', ' type\x3d"tile"', ' src\x3d"', fillStyle.src_, '" /\x3e');
          }
        } else {
          var a = processStyle(ctx.fillStyle);
          var color = a.color;
          var opacity = a.alpha * ctx.globalAlpha;
          lineStr.push('\x3cg_vml_:fill color\x3d"', color, '" opacity\x3d"', opacity, '" /\x3e');
        }
      }
    }
    contextPrototype.fill = function() {
      this.$stroke(true);
    };
    contextPrototype.closePath = function() {
      this.currentPath_.push({type:'close'});
    };
    function getCoords(ctx, aX, aY) {
      var m = ctx.m_;
      return {x:Z * (aX * m[0][0] + aY * m[1][0] + m[2][0]) - Z2, y:Z * (aX * m[0][1] + aY * m[1][1] + m[2][1]) - Z2};
    }
    contextPrototype.save = function() {
      var o = {};
      copyState(this, o);
      this.aStack_.push(o);
      this.mStack_.push(this.m_);
    };
    contextPrototype.restore = function() {
      if (this.aStack_.length) {
        copyState(this.aStack_.pop(), this);
        this.m_ = this.mStack_.pop();
      }
    };
    function matrixIsFinite(m) {
      return isFinite(m[0][0]) && isFinite(m[0][1]) && isFinite(m[1][0]) && isFinite(m[1][1]) && isFinite(m[2][0]) && isFinite(m[2][1]);
    }
    function setM(ctx, m, updateLineScale) {
      if (!matrixIsFinite(m)) {
        return;
      }
      ctx.m_ = m;
      if (updateLineScale) {
        var det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
        ctx.lineScale_ = sqrt(abs(det));
      }
    }
    contextPrototype.translate = function(aX, aY) {
      var m1 = [[1, 0, 0], [0, 1, 0], [aX, aY, 1]];
      setM(this, matrixMultiply(m1, this.m_), false);
    };
    contextPrototype.rotate = function(aRot) {
      var c = mc(aRot);
      var s = ms(aRot);
      var m1 = [[c, s, 0], [-s, c, 0], [0, 0, 1]];
      setM(this, matrixMultiply(m1, this.m_), false);
    };
    contextPrototype.scale = function(aX, aY) {
      this.arcScaleX_ *= aX;
      this.arcScaleY_ *= aY;
      var m1 = [[aX, 0, 0], [0, aY, 0], [0, 0, 1]];
      setM(this, matrixMultiply(m1, this.m_), true);
    };
    contextPrototype.transform = function(m11, m12, m21, m22, dx, dy) {
      var m1 = [[m11, m12, 0], [m21, m22, 0], [dx, dy, 1]];
      setM(this, matrixMultiply(m1, this.m_), true);
    };
    contextPrototype.setTransform = function(m11, m12, m21, m22, dx, dy) {
      var m = [[m11, m12, 0], [m21, m22, 0], [dx, dy, 1]];
      setM(this, m, true);
    };
    contextPrototype.drawText_ = function(text, x, y, maxWidth, stroke) {
      var m = this.m_, delta = 1000, left = 0, right = delta, offset = {x:0, y:0}, lineStr = [];
      var fontStyle = getComputedStyle(processFontStyle(this.font), this.element_);
      var fontStyleString = buildStyle(fontStyle);
      var elementStyle = this.element_.currentStyle;
      var textAlign = this.textAlign.toLowerCase();
      switch(textAlign) {
        case 'left':
        case 'center':
        case 'right':
          break;
        case 'end':
          textAlign = elementStyle.direction == 'ltr' ? 'right' : 'left';
          break;
        case 'start':
          textAlign = elementStyle.direction == 'rtl' ? 'right' : 'left';
          break;
        default:
          textAlign = 'left';
      }
      switch(this.textBaseline) {
        case 'hanging':
        case 'top':
          offset.y = fontStyle.size / 1.75;
          break;
        case 'middle':
          break;
        default:
        case null:
        case 'alphabetic':
        case 'ideographic':
        case 'bottom':
          offset.y = -fontStyle.size / 3;
          break;
      }
      switch(textAlign) {
        case 'right':
          left = delta;
          right = 0.05;
          break;
        case 'center':
          left = right = delta / 2;
          break;
      }
      var d = getCoords(this, x + offset.x, y + offset.y);
      lineStr.push('\x3cg_vml_:line from\x3d"', -left, ' 0" to\x3d"', right, ' 0.05" ', ' coordsize\x3d"100 100" coordorigin\x3d"0 0"', ' filled\x3d"', !stroke, '" stroked\x3d"', !!stroke, '" style\x3d"position:absolute;width:1px;height:1px;left:0px;top:0px;"\x3e');
      if (stroke) {
        appendStroke(this, lineStr);
      } else {
        appendFill(this, lineStr, {x:-left, y:0}, {x:right, y:fontStyle.size});
      }
      var skewM = m[0][0].toFixed(3) + ',' + m[1][0].toFixed(3) + ',' + m[0][1].toFixed(3) + ',' + m[1][1].toFixed(3) + ',0,0';
      var skewOffset = mr(d.x / Z) + ',' + mr(d.y / Z);
      lineStr.push('\x3cg_vml_:skew on\x3d"t" matrix\x3d"', skewM, '" ', ' offset\x3d"', skewOffset, '" origin\x3d"', left, ' 0" /\x3e', '\x3cg_vml_:path textpathok\x3d"true" /\x3e', '\x3cg_vml_:textpath on\x3d"true" string\x3d"', encodeHtmlAttribute(text), '" style\x3d"v-text-align:', textAlign, ';font:', encodeHtmlAttribute(fontStyleString), '" /\x3e\x3c/g_vml_:line\x3e');
      this.element_.insertAdjacentHTML('beforeEnd', lineStr.join(''));
    };
    contextPrototype.fillText = function(text, x, y, maxWidth) {
      this.drawText_(text, x, y, maxWidth, false);
    };
    contextPrototype.strokeText = function(text, x, y, maxWidth) {
      this.drawText_(text, x, y, maxWidth, true);
    };
    contextPrototype.measureText = function(text) {
      if (!this.textMeasureEl_) {
        var s = '\x3cspan style\x3d"position:absolute;' + 'top:-20000px;left:0;padding:0;margin:0;border:none;' + 'white-space:pre;"\x3e\x3c/span\x3e';
        this.element_.insertAdjacentHTML('beforeEnd', s);
        this.textMeasureEl_ = this.element_.lastChild;
      }
      var doc = this.element_.ownerDocument;
      this.textMeasureEl_.innerHTML = '';
      this.textMeasureEl_.style.font = this.font;
      this.textMeasureEl_.appendChild(doc.createTextNode(text));
      return {width:this.textMeasureEl_.offsetWidth};
    };
    contextPrototype.clip = function() {
    };
    contextPrototype.arcTo = function() {
    };
    contextPrototype.createPattern = function(image, repetition) {
      return new CanvasPattern_(image, repetition);
    };
    function CanvasGradient_(aType) {
      this.type_ = aType;
      this.x0_ = 0;
      this.y0_ = 0;
      this.r0_ = 0;
      this.x1_ = 0;
      this.y1_ = 0;
      this.r1_ = 0;
      this.colors_ = [];
    }
    CanvasGradient_.prototype.addColorStop = function(aOffset, aColor) {
      aColor = processStyle(aColor);
      this.colors_.push({offset:aOffset, color:aColor.color, alpha:aColor.alpha});
    };
    function CanvasPattern_(image, repetition) {
      assertImageIsValid(image);
      switch(repetition) {
        case 'repeat':
        case null:
        case '':
          this.repetition_ = 'repeat';
          break;
        case 'repeat-x':
        case 'repeat-y':
        case 'no-repeat':
          this.repetition_ = repetition;
          break;
        default:
          throwException('SYNTAX_ERR');
      }
      this.src_ = image.src;
      this.width_ = image.width;
      this.height_ = image.height;
    }
    function throwException(s) {
      throw new DOMException_(s);
    }
    function assertImageIsValid(img) {
      if (!img || img.nodeType != 1 || img.tagName != 'IMG') {
        throwException('TYPE_MISMATCH_ERR');
      }
      if (img.readyState != 'complete') {
        throwException('INVALID_STATE_ERR');
      }
    }
    function DOMException_(s) {
      this.code = this[s];
      this.message = s + ': DOM Exception ' + this.code;
    }
    var p = DOMException_.prototype = new Error;
    p.INDEX_SIZE_ERR = 1;
    p.DOMSTRING_SIZE_ERR = 2;
    p.HIERARCHY_REQUEST_ERR = 3;
    p.WRONG_DOCUMENT_ERR = 4;
    p.INVALID_CHARACTER_ERR = 5;
    p.NO_DATA_ALLOWED_ERR = 6;
    p.NO_MODIFICATION_ALLOWED_ERR = 7;
    p.NOT_FOUND_ERR = 8;
    p.NOT_SUPPORTED_ERR = 9;
    p.INUSE_ATTRIBUTE_ERR = 10;
    p.INVALID_STATE_ERR = 11;
    p.SYNTAX_ERR = 12;
    p.INVALID_MODIFICATION_ERR = 13;
    p.NAMESPACE_ERR = 14;
    p.INVALID_ACCESS_ERR = 15;
    p.VALIDATION_ERR = 16;
    p.TYPE_MISMATCH_ERR = 17;
    G_vmlCanvasManager = G_vmlCanvasManager_;
    CanvasRenderingContext2D = CanvasRenderingContext2D_;
    CanvasGradient = CanvasGradient_;
    CanvasPattern = CanvasPattern_;
    DOMException = DOMException_;
  })();
}
Ext.define('Ext.draw.engine.Canvas', {extend:'Ext.draw.Surface', isCanvas:true, requires:['Ext.draw.engine.excanvas', 'Ext.draw.Animator', 'Ext.draw.Color'], config:{highPrecision:false}, statics:{contextOverrides:{setGradientBBox:function(bbox) {
  this.bbox = bbox;
}, fill:function() {
  var fillStyle = this.fillStyle, fillGradient = this.fillGradient, fillOpacity = this.fillOpacity, alpha = this.globalAlpha, bbox = this.bbox;
  if (fillStyle !== Ext.util.Color.RGBA_NONE && fillOpacity !== 0) {
    if (fillGradient && bbox) {
      this.fillStyle = fillGradient.generateGradient(this, bbox);
    }
    if (fillOpacity !== 1) {
      this.globalAlpha = alpha * fillOpacity;
    }
    this.$fill();
    if (fillOpacity !== 1) {
      this.globalAlpha = alpha;
    }
    if (fillGradient && bbox) {
      this.fillStyle = fillStyle;
    }
  }
}, stroke:function() {
  var strokeStyle = this.strokeStyle, strokeGradient = this.strokeGradient, strokeOpacity = this.strokeOpacity, alpha = this.globalAlpha, bbox = this.bbox;
  if (strokeStyle !== Ext.util.Color.RGBA_NONE && strokeOpacity !== 0) {
    if (strokeGradient && bbox) {
      this.strokeStyle = strokeGradient.generateGradient(this, bbox);
    }
    if (strokeOpacity !== 1) {
      this.globalAlpha = alpha * strokeOpacity;
    }
    this.$stroke();
    if (strokeOpacity !== 1) {
      this.globalAlpha = alpha;
    }
    if (strokeGradient && bbox) {
      this.strokeStyle = strokeStyle;
    }
  }
}, fillStroke:function(attr, transformFillStroke) {
  var ctx = this, fillStyle = this.fillStyle, fillOpacity = this.fillOpacity, strokeStyle = this.strokeStyle, strokeOpacity = this.strokeOpacity, shadowColor = ctx.shadowColor, shadowBlur = ctx.shadowBlur, none = Ext.util.Color.RGBA_NONE;
  if (transformFillStroke === undefined) {
    transformFillStroke = attr.transformFillStroke;
  }
  if (!transformFillStroke) {
    attr.inverseMatrix.toContext(ctx);
  }
  if (fillStyle !== none && fillOpacity !== 0) {
    ctx.fill();
    ctx.shadowColor = none;
    ctx.shadowBlur = 0;
  }
  if (strokeStyle !== none && strokeOpacity !== 0) {
    ctx.stroke();
  }
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = shadowBlur;
}, setLineDash:function(dashList) {
  if (this.$setLineDash) {
    this.$setLineDash(dashList);
  }
}, getLineDash:function() {
  if (this.$getLineDash) {
    return this.$getLineDash();
  }
}, ellipse:function(cx, cy, rx, ry, rotation, start, end, anticlockwise) {
  var cos = Math.cos(rotation), sin = Math.sin(rotation);
  this.transform(cos * rx, sin * rx, -sin * ry, cos * ry, cx, cy);
  this.arc(0, 0, 1, start, end, anticlockwise);
  this.transform(cos / rx, -sin / ry, sin / rx, cos / ry, -(cos * cx + sin * cy) / rx, (sin * cx - cos * cy) / ry);
}, appendPath:function(path) {
  var me = this, i = 0, j = 0, commands = path.commands, params = path.params, ln = commands.length;
  me.beginPath();
  for (; i < ln; i++) {
    switch(commands[i]) {
      case 'M':
        me.moveTo(params[j], params[j + 1]);
        j += 2;
        break;
      case 'L':
        me.lineTo(params[j], params[j + 1]);
        j += 2;
        break;
      case 'C':
        me.bezierCurveTo(params[j], params[j + 1], params[j + 2], params[j + 3], params[j + 4], params[j + 5]);
        j += 6;
        break;
      case 'Z':
        me.closePath();
        break;
    }
  }
}, save:function() {
  var toSave = this.toSave, ln = toSave.length, obj = ln && {}, i = 0, key;
  for (; i < ln; i++) {
    key = toSave[i];
    if (key in this) {
      obj[key] = this[key];
    }
  }
  this.state.push(obj);
  this.$save();
}, restore:function() {
  var obj = this.state.pop(), key;
  if (obj) {
    for (key in obj) {
      this[key] = obj[key];
    }
  }
  this.$restore();
}}}, splitThreshold:3000, toSave:['fillGradient', 'strokeGradient'], element:{reference:'element', children:[{reference:'bodyElement', style:{width:'100%', height:'100%', position:'relative'}}]}, createCanvas:function() {
  var canvas = Ext.Element.create({tag:'canvas', cls:Ext.baseCSSPrefix + 'surface-canvas'});
  if (window['G_vmlCanvasManager']) {
    G_vmlCanvasManager.initElement(canvas.dom);
    this.isVML = true;
  }
  var overrides = Ext.draw.engine.Canvas.contextOverrides, ctx = canvas.dom.getContext('2d'), name;
  if (ctx.ellipse) {
    delete overrides.ellipse;
  }
  ctx.state = [];
  ctx.toSave = this.toSave;
  for (name in overrides) {
    ctx['$' + name] = ctx[name];
  }
  Ext.apply(ctx, overrides);
  if (this.getHighPrecision()) {
    this.enablePrecisionCompensation(ctx);
  } else {
    this.disablePrecisionCompensation(ctx);
  }
  this.bodyElement.appendChild(canvas);
  this.canvases.push(canvas);
  this.contexts.push(ctx);
}, updateHighPrecision:function(highPrecision) {
  var contexts = this.contexts, ln = contexts.length, i, context;
  for (i = 0; i < ln; i++) {
    context = contexts[i];
    if (highPrecision) {
      this.enablePrecisionCompensation(context);
    } else {
      this.disablePrecisionCompensation(context);
    }
  }
}, precisionNames:['rect', 'fillRect', 'strokeRect', 'clearRect', 'moveTo', 'lineTo', 'arc', 'arcTo', 'save', 'restore', 'updatePrecisionCompensate', 'setTransform', 'transform', 'scale', 'translate', 'rotate', 'quadraticCurveTo', 'bezierCurveTo', 'createLinearGradient', 'createRadialGradient', 'fillText', 'strokeText', 'drawImage'], disablePrecisionCompensation:function(ctx) {
  var regularOverrides = Ext.draw.engine.Canvas.contextOverrides, precisionOverrides = this.precisionNames, ln = precisionOverrides.length, i, name;
  for (i = 0; i < ln; i++) {
    name = precisionOverrides[i];
    if (!(name in regularOverrides)) {
      delete ctx[name];
    }
  }
  this.setDirty(true);
}, enablePrecisionCompensation:function(ctx) {
  var surface = this, xx = 1, yy = 1, dx = 0, dy = 0, matrix = new Ext.draw.Matrix, transStack = [], comp = {}, regularOverrides = Ext.draw.engine.Canvas.contextOverrides, originalCtx = ctx.constructor.prototype;
  var precisionOverrides = {toSave:surface.toSave, rect:function(x, y, w, h) {
    return originalCtx.rect.call(this, x * xx + dx, y * yy + dy, w * xx, h * yy);
  }, fillRect:function(x, y, w, h) {
    this.updatePrecisionCompensateRect();
    originalCtx.fillRect.call(this, x * xx + dx, y * yy + dy, w * xx, h * yy);
    this.updatePrecisionCompensate();
  }, strokeRect:function(x, y, w, h) {
    this.updatePrecisionCompensateRect();
    originalCtx.strokeRect.call(this, x * xx + dx, y * yy + dy, w * xx, h * yy);
    this.updatePrecisionCompensate();
  }, clearRect:function(x, y, w, h) {
    return originalCtx.clearRect.call(this, x * xx + dx, y * yy + dy, w * xx, h * yy);
  }, moveTo:function(x, y) {
    return originalCtx.moveTo.call(this, x * xx + dx, y * yy + dy);
  }, lineTo:function(x, y) {
    return originalCtx.lineTo.call(this, x * xx + dx, y * yy + dy);
  }, arc:function(x, y, radius, startAngle, endAngle, anticlockwise) {
    this.updatePrecisionCompensateRect();
    originalCtx.arc.call(this, x * xx + dx, y * xx + dy, radius * xx, startAngle, endAngle, anticlockwise);
    this.updatePrecisionCompensate();
  }, arcTo:function(x1, y1, x2, y2, radius) {
    this.updatePrecisionCompensateRect();
    originalCtx.arcTo.call(this, x1 * xx + dx, y1 * yy + dy, x2 * xx + dx, y2 * yy + dy, radius * xx);
    this.updatePrecisionCompensate();
  }, save:function() {
    transStack.push(matrix);
    matrix = matrix.clone();
    regularOverrides.save.call(this);
    originalCtx.save.call(this);
  }, restore:function() {
    matrix = transStack.pop();
    regularOverrides.restore.call(this);
    originalCtx.restore.call(this);
    this.updatePrecisionCompensate();
  }, updatePrecisionCompensate:function() {
    matrix.precisionCompensate(surface.devicePixelRatio, comp);
    xx = comp.xx;
    yy = comp.yy;
    dx = comp.dx;
    dy = comp.dy;
    originalCtx.setTransform.call(this, surface.devicePixelRatio, comp.b, comp.c, comp.d, 0, 0);
  }, updatePrecisionCompensateRect:function() {
    matrix.precisionCompensateRect(surface.devicePixelRatio, comp);
    xx = comp.xx;
    yy = comp.yy;
    dx = comp.dx;
    dy = comp.dy;
    originalCtx.setTransform.call(this, surface.devicePixelRatio, comp.b, comp.c, comp.d, 0, 0);
  }, setTransform:function(x2x, x2y, y2x, y2y, newDx, newDy) {
    matrix.set(x2x, x2y, y2x, y2y, newDx, newDy);
    this.updatePrecisionCompensate();
  }, transform:function(x2x, x2y, y2x, y2y, newDx, newDy) {
    matrix.append(x2x, x2y, y2x, y2y, newDx, newDy);
    this.updatePrecisionCompensate();
  }, scale:function(sx, sy) {
    this.transform(sx, 0, 0, sy, 0, 0);
  }, translate:function(dx, dy) {
    this.transform(1, 0, 0, 1, dx, dy);
  }, rotate:function(radians) {
    var cos = Math.cos(radians), sin = Math.sin(radians);
    this.transform(cos, sin, -sin, cos, 0, 0);
  }, quadraticCurveTo:function(cx, cy, x, y) {
    originalCtx.quadraticCurveTo.call(this, cx * xx + dx, cy * yy + dy, x * xx + dx, y * yy + dy);
  }, bezierCurveTo:function(c1x, c1y, c2x, c2y, x, y) {
    originalCtx.bezierCurveTo.call(this, c1x * xx + dx, c1y * yy + dy, c2x * xx + dx, c2y * yy + dy, x * xx + dx, y * yy + dy);
  }, createLinearGradient:function(x0, y0, x1, y1) {
    this.updatePrecisionCompensateRect();
    var grad = originalCtx.createLinearGradient.call(this, x0 * xx + dx, y0 * yy + dy, x1 * xx + dx, y1 * yy + dy);
    this.updatePrecisionCompensate();
    return grad;
  }, createRadialGradient:function(x0, y0, r0, x1, y1, r1) {
    this.updatePrecisionCompensateRect();
    var grad = originalCtx.createLinearGradient.call(this, x0 * xx + dx, y0 * xx + dy, r0 * xx, x1 * xx + dx, y1 * xx + dy, r1 * xx);
    this.updatePrecisionCompensate();
    return grad;
  }, fillText:function(text, x, y, maxWidth) {
    originalCtx.setTransform.apply(this, matrix.elements);
    if (typeof maxWidth === 'undefined') {
      originalCtx.fillText.call(this, text, x, y);
    } else {
      originalCtx.fillText.call(this, text, x, y, maxWidth);
    }
    this.updatePrecisionCompensate();
  }, strokeText:function(text, x, y, maxWidth) {
    originalCtx.setTransform.apply(this, matrix.elements);
    if (typeof maxWidth === 'undefined') {
      originalCtx.strokeText.call(this, text, x, y);
    } else {
      originalCtx.strokeText.call(this, text, x, y, maxWidth);
    }
    this.updatePrecisionCompensate();
  }, fill:function() {
    var fillGradient = this.fillGradient, bbox = this.bbox;
    this.updatePrecisionCompensateRect();
    if (fillGradient && bbox) {
      this.fillStyle = fillGradient.generateGradient(this, bbox);
    }
    originalCtx.fill.call(this);
    this.updatePrecisionCompensate();
  }, stroke:function() {
    var strokeGradient = this.strokeGradient, bbox = this.bbox;
    this.updatePrecisionCompensateRect();
    if (strokeGradient && bbox) {
      this.strokeStyle = strokeGradient.generateGradient(this, bbox);
    }
    originalCtx.stroke.call(this);
    this.updatePrecisionCompensate();
  }, drawImage:function(img_elem, arg1, arg2, arg3, arg4, dst_x, dst_y, dw, dh) {
    switch(arguments.length) {
      case 3:
        return originalCtx.drawImage.call(this, img_elem, arg1 * xx + dx, arg2 * yy + dy);
      case 5:
        return originalCtx.drawImage.call(this, img_elem, arg1 * xx + dx, arg2 * yy + dy, arg3 * xx, arg4 * yy);
      case 9:
        return originalCtx.drawImage.call(this, img_elem, arg1, arg2, arg3, arg4, dst_x * xx + dx, dst_y * yy * dy, dw * xx, dh * yy);
    }
  }};
  Ext.apply(ctx, precisionOverrides);
  this.setDirty(true);
}, updateRect:function(rect) {
  this.callParent([rect]);
  var me = this, l = Math.floor(rect[0]), t = Math.floor(rect[1]), r = Math.ceil(rect[0] + rect[2]), b = Math.ceil(rect[1] + rect[3]), devicePixelRatio = me.devicePixelRatio, canvases = me.canvases, w = r - l, h = b - t, splitThreshold = Math.round(me.splitThreshold / devicePixelRatio), xSplits = me.xSplits = Math.ceil(w / splitThreshold), ySplits = me.ySplits = Math.ceil(h / splitThreshold), i, j, k, offsetX, offsetY, dom, width, height;
  for (j = 0, offsetY = 0; j < ySplits; j++, offsetY += splitThreshold) {
    for (i = 0, offsetX = 0; i < xSplits; i++, offsetX += splitThreshold) {
      k = j * xSplits + i;
      if (k >= canvases.length) {
        me.createCanvas();
      }
      dom = canvases[k].dom;
      dom.style.left = offsetX + 'px';
      dom.style.top = offsetY + 'px';
      height = Math.min(splitThreshold, h - offsetY);
      if (height * devicePixelRatio !== dom.height) {
        dom.height = height * devicePixelRatio;
        dom.style.height = height + 'px';
      }
      width = Math.min(splitThreshold, w - offsetX);
      if (width * devicePixelRatio !== dom.width) {
        dom.width = width * devicePixelRatio;
        dom.style.width = width + 'px';
      }
      me.applyDefaults(me.contexts[k]);
    }
  }
  me.activeCanvases = k = xSplits * ySplits;
  while (canvases.length > k) {
    canvases.pop().destroy();
  }
  me.clear();
}, clearTransform:function() {
  var me = this, xSplits = me.xSplits, ySplits = me.ySplits, contexts = me.contexts, splitThreshold = me.splitThreshold, devicePixelRatio = me.devicePixelRatio, i, j, k, ctx;
  for (i = 0; i < xSplits; i++) {
    for (j = 0; j < ySplits; j++) {
      k = j * xSplits + i;
      ctx = contexts[k];
      ctx.translate(-splitThreshold * i, -splitThreshold * j);
      ctx.scale(devicePixelRatio, devicePixelRatio);
      me.matrix.toContext(ctx);
    }
  }
}, renderSprite:function(sprite) {
  var me = this, rect = me.getRect(), surfaceMatrix = me.matrix, parent = sprite.getParent(), matrix = Ext.draw.Matrix.fly([1, 0, 0, 1, 0, 0]), splitThreshold = me.splitThreshold / me.devicePixelRatio, xSplits = me.xSplits, ySplits = me.ySplits, offsetX, offsetY, ctx, bbox, width, height, left = 0, right, top = 0, bottom, w = rect[2], h = rect[3], i, j, k;
  while (parent && parent.isSprite) {
    matrix.prependMatrix(parent.matrix || parent.attr && parent.attr.matrix);
    parent = parent.getParent();
  }
  matrix.prependMatrix(surfaceMatrix);
  bbox = sprite.getBBox();
  if (bbox) {
    bbox = matrix.transformBBox(bbox);
  }
  sprite.preRender(me);
  if (sprite.attr.hidden || sprite.attr.globalAlpha === 0) {
    sprite.setDirty(false);
    return;
  }
  for (j = 0, offsetY = 0; j < ySplits; j++, offsetY += splitThreshold) {
    for (i = 0, offsetX = 0; i < xSplits; i++, offsetX += splitThreshold) {
      k = j * xSplits + i;
      ctx = me.contexts[k];
      width = Math.min(splitThreshold, w - offsetX);
      height = Math.min(splitThreshold, h - offsetY);
      left = offsetX;
      right = left + width;
      top = offsetY;
      bottom = top + height;
      if (bbox) {
        if (bbox.x > right || bbox.x + bbox.width < left || bbox.y > bottom || bbox.y + bbox.height < top) {
          continue;
        }
      }
      ctx.save();
      sprite.useAttributes(ctx, rect);
      if (false === sprite.render(me, ctx, [left, top, width, height])) {
        return false;
      }
      ctx.restore();
    }
  }
  sprite.setDirty(false);
}, flatten:function(size, surfaces) {
  var targetCanvas = document.createElement('canvas'), className = Ext.getClassName(this), ratio = this.devicePixelRatio, ctx = targetCanvas.getContext('2d'), surface, canvas, rect, i, j, xy;
  targetCanvas.width = Math.ceil(size.width * ratio);
  targetCanvas.height = Math.ceil(size.height * ratio);
  for (i = 0; i < surfaces.length; i++) {
    surface = surfaces[i];
    if (Ext.getClassName(surface) !== className) {
      continue;
    }
    rect = surface.getRect();
    for (j = 0; j < surface.canvases.length; j++) {
      canvas = surface.canvases[j];
      xy = canvas.getOffsetsTo(canvas.getParent());
      ctx.drawImage(canvas.dom, (rect[0] + xy[0]) * ratio, (rect[1] + xy[1]) * ratio);
    }
  }
  return {data:targetCanvas.toDataURL(), type:'png'};
}, applyDefaults:function(ctx) {
  var none = Ext.util.Color.RGBA_NONE;
  ctx.strokeStyle = none;
  ctx.fillStyle = none;
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';
  ctx.miterLimit = 1;
}, clear:function() {
  var me = this, activeCanvases = me.activeCanvases, i, canvas, ctx;
  for (i = 0; i < activeCanvases; i++) {
    canvas = me.canvases[i].dom;
    ctx = me.contexts[i];
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  me.setDirty(true);
}, destroy:function() {
  var me = this, canvases = me.canvases, ln = canvases.length, i;
  for (i = 0; i < ln; i++) {
    me.contexts[i] = null;
    canvases[i].destroy();
    canvases[i] = null;
  }
  me.contexts = me.canvases = null;
  me.callParent();
}, privates:{initElement:function() {
  var me = this;
  me.callParent();
  me.canvases = [];
  me.contexts = [];
  me.activeCanvases = me.xSplits = me.ySplits = 0;
}}}, function() {
  var me = this, proto = me.prototype, splitThreshold = 1.0E10;
  if (Ext.os.is.Android4 && Ext.browser.is.Chrome) {
    splitThreshold = 3000;
  } else {
    if (Ext.is.iOS) {
      splitThreshold = 2200;
    }
  }
  proto.splitThreshold = splitThreshold;
});
Ext.define('Ext.draw.Container', {extend:'Ext.draw.ContainerBase', alternateClassName:'Ext.draw.Component', xtype:'draw', defaultType:'surface', isDrawContainer:true, requires:['Ext.draw.Surface', 'Ext.draw.engine.Svg', 'Ext.draw.engine.Canvas', 'Ext.draw.gradient.GradientDefinition'], engine:'Ext.draw.engine.Canvas', config:{cls:[Ext.baseCSSPrefix + 'draw-container', Ext.baseCSSPrefix + 'unselectable'], resizeHandler:null, sprites:null, gradients:[], downloadServerUrl:undefined, touchAction:{panX:false, 
panY:false, pinchZoom:false, doubleTapZoom:false}, surfaceZIndexes:{main:1}}, defaultDownloadServerUrl:'http://svg.sencha.io', supportedFormats:['png', 'pdf', 'jpeg', 'gif'], supportedOptions:{version:Ext.isNumber, data:Ext.isString, format:function(format) {
  return Ext.Array.indexOf(this.supportedFormats, format) >= 0;
}, filename:Ext.isString, width:Ext.isNumber, height:Ext.isNumber, scale:Ext.isNumber, pdf:Ext.isObject, jpeg:Ext.isObject}, initAnimator:function() {
  this.frameCallbackId = Ext.draw.Animator.addFrameCallback('renderFrame', this);
}, applyDownloadServerUrl:function(url) {
  var defaultUrl = this.defaultDownloadServerUrl;
  if (!url) {
    url = defaultUrl;
    if (!window.jasmine) {
      Ext.log.warn("Using Sencha's download server could expose your data and pose a security risk. " + 'Please see Ext.draw.Container#download method docs for more info. (component id\x3d' + this.getId() + ')');
    }
  }
  return url;
}, applyGradients:function(gradients) {
  var result = [], i, n, gradient, offset;
  if (!Ext.isArray(gradients)) {
    return result;
  }
  for (i = 0, n = gradients.length; i < n; i++) {
    gradient = gradients[i];
    if (!Ext.isObject(gradient)) {
      continue;
    }
    if (typeof gradient.type !== 'string') {
      gradient.type = 'linear';
    }
    if (gradient.angle) {
      gradient.degrees = gradient.angle;
      delete gradient.angle;
    }
    if (Ext.isObject(gradient.stops)) {
      gradient.stops = function(stops) {
        var result = [], stop;
        for (offset in stops) {
          stop = stops[offset];
          stop.offset = offset / 100;
          result.push(stop);
        }
        return result;
      }(gradient.stops);
    }
    result.push(gradient);
  }
  Ext.draw.gradient.GradientDefinition.add(result);
  return result;
}, applySprites:function(sprites) {
  if (!sprites) {
    return;
  }
  sprites = Ext.Array.from(sprites);
  var ln = sprites.length, result = [], i, surface, sprite;
  for (i = 0; i < ln; i++) {
    sprite = sprites[i];
    surface = sprite.surface;
    if (!(surface && surface.isSurface)) {
      if (Ext.isString(surface)) {
        surface = this.getSurface(surface);
        delete sprite.surface;
      } else {
        surface = this.getSurface('main');
      }
    }
    sprite = surface.add(sprite);
    result.push(sprite);
  }
  return result;
}, resizeDelay:500, resizeTimerId:0, lastResizeTime:null, size:null, handleResize:function(size, instantly) {
  var me = this, el = me.element, resizeHandler = me.getResizeHandler() || me.defaultResizeHandler, resizeDelay = me.resizeDelay, lastResizeTime = me.lastResizeTime, defer, result;
  if (!el) {
    return;
  }
  size = size || el.getSize();
  if (!(size.width && size.height)) {
    return;
  }
  me.size = size;
  me.stopResizeTimer();
  defer = !instantly && lastResizeTime && Ext.Date.now() - lastResizeTime < resizeDelay;
  if (defer) {
    me.resizeTimerId = Ext.defer(me.handleResize, resizeDelay, me, [size, true]);
    return;
  }
  me.fireEvent('bodyresize', me, size);
  Ext.callback(resizeHandler, null, [size], 0, me);
  if (result !== false) {
    me.renderFrame();
  }
  me.lastResizeTime = Ext.Date.now();
}, stopResizeTimer:function() {
  if (this.resizeTimerId) {
    Ext.undefer(this.resizeTimerId);
    this.resizeTimerId = 0;
  }
}, defaultResizeHandler:function(size) {
  this.getItems().each(function(surface) {
    surface.setRect([0, 0, size.width, size.height]);
  });
}, getSurface:function(id, type) {
  id = id || 'main';
  type = type || id;
  var me = this, surfaces = me.getItems(), oldCount = surfaces.getCount(), zIndexes = me.getSurfaceZIndexes(), surface;
  surface = me.createSurface(id);
  if (type in zIndexes) {
    surface.element.setStyle('zIndex', zIndexes[type]);
  }
  if (surfaces.getCount() > oldCount) {
    me.handleResize(null, true);
  }
  return surface;
}, createSurface:function(id) {
  id = this.getId() + '-' + (id || 'main');
  var me = this, surfaces = me.getItems(), surface = surfaces.get(id);
  if (!surface) {
    surface = me.add({xclass:me.engine, id:id});
  }
  return surface;
}, renderFrame:function() {
  var me = this, surfaces = me.getItems(), i, ln, item;
  for (i = 0, ln = surfaces.length; i < ln; i++) {
    item = surfaces.items[i];
    if (item.isSurface) {
      item.renderFrame();
    }
  }
}, getSurfaces:function(sort) {
  var surfaces = Array.prototype.slice.call(this.items.items), zIndexes = this.getSurfaceZIndexes(), i, j, surface, zIndex;
  if (sort) {
    for (j = 1; j < surfaces.length; j++) {
      surface = surfaces[j];
      zIndex = zIndexes[surface.type];
      i = j - 1;
      while (i >= 0 && zIndexes[surfaces[i].type] > zIndex) {
        surfaces[i + 1] = surfaces[i];
        i--;
      }
      surfaces[i + 1] = surface;
    }
  }
  return surfaces;
}, getImage:function(format) {
  var size = this.bodyElement.getSize(), surfaces = this.getSurfaces(true), surface = surfaces[0], image, imageElement;
  if ((Ext.isIE || Ext.isEdge) && surface.isSVG) {
    image = {data:surface.toSVG(size, surfaces), type:'svg-markup'};
  } else {
    image = surface.flatten(size, surfaces);
    if (format === 'image') {
      imageElement = new Image;
      imageElement.src = image.data;
      image.data = imageElement;
      return image;
    }
    if (format === 'stream') {
      image.data = image.data.replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
      return image;
    }
  }
  return image;
}, download:function(config) {
  var me = this, inputs = [], markup, name, value;
  if (Ext.isIE8) {
    return false;
  }
  config = config || {};
  config.version = 2;
  if (!config.data) {
    config.data = me.getImage().data;
  }
  for (name in config) {
    if (config.hasOwnProperty(name)) {
      value = config[name];
      if (name in me.supportedOptions) {
        if (me.supportedOptions[name].call(me, value)) {
          inputs.push({tag:'input', type:'hidden', name:name, value:Ext.String.htmlEncode(Ext.isObject(value) ? Ext.JSON.encode(value) : value)});
        } else {
          Ext.log.error('Invalid value for image download option "' + name + '": ' + value);
        }
      } else {
        Ext.log.error('Invalid image download option: "' + name + '"');
      }
    }
  }
  markup = Ext.dom.Helper.markup({tag:'html', children:[{tag:'head'}, {tag:'body', children:[{tag:'form', method:'POST', action:config.url || me.getDownloadServerUrl(), children:inputs}, {tag:'script', type:'text/javascript', children:'document.getElementsByTagName("form")[0].submit();'}]}]});
  window.open('', 'ImageDownload_' + Date.now()).document.write(markup);
}, doDestroy:function() {
  var me = this, callbackId = me.frameCallbackId;
  if (callbackId) {
    Ext.draw.Animator.removeFrameCallback(callbackId);
  }
  me.stopResizeTimer();
  me.callParent();
}}, function() {
  if (location.search.match('svg')) {
    Ext.draw.Container.prototype.engine = 'Ext.draw.engine.Svg';
  } else {
    if (Ext.os.is.BlackBerry && Ext.os.version.getMajor() === 10 || Ext.browser.is.AndroidStock4 && (Ext.os.version.getMinor() === 1 || Ext.os.version.getMinor() === 2 || Ext.os.version.getMinor() === 3)) {
      Ext.draw.Container.prototype.engine = 'Ext.draw.engine.Svg';
    }
  }
});
Ext.define('Ext.chart.theme.BaseTheme', {defaultsDivCls:'x-component'});
Ext.define('Ext.chart.theme.Base', {extend:'Ext.chart.theme.BaseTheme', mixins:{factoryable:'Ext.mixin.Factoryable'}, requires:['Ext.draw.Color'], factoryConfig:{type:'chart.theme'}, isTheme:true, isBase:true, config:{baseColor:null, colors:undefined, gradients:null, chart:{defaults:{captions:{title:{docked:'top', padding:5, style:{textAlign:'center', fontFamily:'default', fontWeight:'500', fillStyle:'black', fontSize:'default*1.6'}}, subtitle:{docked:'top', style:{textAlign:'center', fontFamily:'default', 
fontWeight:'normal', fillStyle:'black', fontSize:'default*1.3'}}, credits:{docked:'bottom', padding:5, style:{textAlign:'left', fontFamily:'default', fontWeight:'lighter', fillStyle:'black', fontSize:'default'}}}, background:'white'}}, axis:{defaults:{label:{x:0, y:0, textBaseline:'middle', textAlign:'center', fontSize:'default', fontFamily:'default', fontWeight:'default', fillStyle:'black'}, title:{fillStyle:'black', fontSize:'default*1.23', fontFamily:'default', fontWeight:'default'}, style:{strokeStyle:'black'}, 
grid:{strokeStyle:'rgb(221, 221, 221)'}}, top:{style:{textPadding:5}}, bottom:{style:{textPadding:5}}}, series:{defaults:{label:{fillStyle:'black', strokeStyle:'none', fontFamily:'default', fontWeight:'default', fontSize:'default*1.077', textBaseline:'middle', textAlign:'center'}, labelOverflowPadding:5}}, sprites:{text:{fontSize:'default', fontWeight:'default', fontFamily:'default', fillStyle:'black'}}, legend:{label:{fontSize:14, fontWeight:'default', fontFamily:'default', fillStyle:'black'}, border:{lineWidth:1, 
radius:4, fillStyle:'none', strokeStyle:'gray'}, background:'white'}, seriesThemes:undefined, markerThemes:{type:['circle', 'cross', 'plus', 'square', 'triangle', 'diamond']}, useGradients:false, background:null}, colorDefaults:['#94ae0a', '#115fa6', '#a61120', '#ff8809', '#ffd13e', '#a61187', '#24ad9a', '#7c7474', '#a66111'], constructor:function(config) {
  this.initConfig(config);
  this.resolveDefaults();
}, defaultRegEx:/^default([+\-/\*]\d+(?:\.\d+)?)?$/, defaultOperators:{'*':function(v1, v2) {
  return v1 * v2;
}, '+':function(v1, v2) {
  return v1 + v2;
}, '-':function(v1, v2) {
  return v1 - v2;
}}, resolveChartDefaults:function() {
  var chart = Ext.clone(this.getChart()), chartType, captionName, chartConfig, captionConfig;
  for (chartType in chart) {
    chartConfig = chart[chartType];
    if ('captions' in chartConfig) {
      for (captionName in chartConfig.captions) {
        captionConfig = chartConfig.captions[captionName];
        if (captionConfig) {
          this.replaceDefaults(captionConfig.style);
        }
      }
    }
  }
  this.setChart(chart);
}, resolveDefaults:function() {
  var me = this;
  Ext.onInternalReady(function() {
    var sprites = Ext.clone(me.getSprites()), legend = Ext.clone(me.getLegend()), axis = Ext.clone(me.getAxis()), series = Ext.clone(me.getSeries()), div, key, config;
    if (!me.superclass.defaults) {
      div = Ext.getBody().createChild({tag:'div', cls:me.defaultsDivCls});
      me.superclass.defaults = {fontFamily:div.getStyle('fontFamily'), fontWeight:div.getStyle('fontWeight'), fontSize:parseFloat(div.getStyle('fontSize')), fontVariant:div.getStyle('fontVariant'), fontStyle:div.getStyle('fontStyle')};
      div.destroy();
    }
    me.resolveChartDefaults();
    me.replaceDefaults(sprites.text);
    me.setSprites(sprites);
    me.replaceDefaults(legend.label);
    me.setLegend(legend);
    for (key in axis) {
      config = axis[key];
      me.replaceDefaults(config.label);
      me.replaceDefaults(config.title);
    }
    me.setAxis(axis);
    for (key in series) {
      config = series[key];
      me.replaceDefaults(config.label);
    }
    me.setSeries(series);
  });
}, replaceDefaults:function(target) {
  var me = this, defaults = me.superclass.defaults, defaultRegEx = me.defaultRegEx, key, value, match, binaryFn;
  if (Ext.isObject(target)) {
    for (key in defaults) {
      match = defaultRegEx.exec(target[key]);
      if (match) {
        value = defaults[key];
        match = match[1];
        if (match) {
          binaryFn = me.defaultOperators[match.charAt(0)];
          value = Math.round(binaryFn(value, parseFloat(match.substr(1))));
        }
        target[key] = value;
      }
    }
  }
}, applyBaseColor:function(baseColor) {
  var midColor, midL;
  if (baseColor) {
    midColor = baseColor.isColor ? baseColor : Ext.util.Color.fromString(baseColor);
    midL = midColor.getHSL()[2];
    if (midL < 0.15) {
      midColor = midColor.createLighter(0.3);
    } else {
      if (midL < 0.3) {
        midColor = midColor.createLighter(0.15);
      } else {
        if (midL > 0.85) {
          midColor = midColor.createDarker(0.3);
        } else {
          if (midL > 0.7) {
            midColor = midColor.createDarker(0.15);
          }
        }
      }
    }
    this.setColors([midColor.createDarker(0.3).toString(), midColor.createDarker(0.15).toString(), midColor.toString(), midColor.createLighter(0.12).toString(), midColor.createLighter(0.24).toString(), midColor.createLighter(0.31).toString()]);
  }
  return baseColor;
}, applyColors:function(newColors) {
  return newColors || this.colorDefaults;
}, updateUseGradients:function(useGradients) {
  if (useGradients) {
    this.updateGradients({type:'linear', degrees:90});
  }
}, updateBackground:function(background) {
  if (background) {
    var chart = this.getChart();
    chart.defaults.background = background;
    this.setChart(chart);
  }
}, updateGradients:function(gradients) {
  var colors = this.getColors(), items = [], gradient, midColor, color, i, ln;
  if (Ext.isObject(gradients)) {
    for (i = 0, ln = colors && colors.length || 0; i < ln; i++) {
      midColor = Ext.util.Color.fromString(colors[i]);
      if (midColor) {
        color = midColor.createLighter(0.15).toString();
        gradient = Ext.apply(Ext.Object.chain(gradients), {stops:[{offset:1, color:midColor.toString()}, {offset:0, color:color.toString()}]});
        items.push(gradient);
      }
    }
    this.setColors(items);
  }
}, applySeriesThemes:function(newSeriesThemes) {
  this.getBaseColor();
  this.getUseGradients();
  this.getGradients();
  var colors = this.getColors();
  if (!newSeriesThemes) {
    newSeriesThemes = {fillStyle:Ext.Array.clone(colors), strokeStyle:Ext.Array.map(colors, function(value) {
      var color = Ext.util.Color.fromString(value.stops ? value.stops[0].color : value);
      return color.createDarker(0.15).toString();
    })};
  }
  return newSeriesThemes;
}});
Ext.define('Ext.chart.theme.Default', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.default', 'chart.theme.Default', 'chart.theme.Base']});
Ext.define('Ext.chart.Util', {singleton:true, expandRange:function(range, data) {
  var length = data.length, min = range[0], max = range[1], i, value;
  for (i = 0; i < length; i++) {
    value = data[i];
    if (!isFinite(value)) {
      continue;
    }
    if (value < min || !isFinite(min)) {
      min = value;
    }
    if (value > max || !isFinite(max)) {
      max = value;
    }
  }
  range[0] = min;
  range[1] = max;
}, validateRange:function(range, defaultRange, padding) {
  if (!range) {
    return defaultRange;
  }
  if (range[0] === range[1]) {
    padding = padding || 0.5;
    range = [range[0] - padding, range[0] + padding];
  }
  if (range[0] === range[1]) {
    return defaultRange;
  }
  return [isFinite(range[0]) ? range[0] : defaultRange[0], isFinite(range[1]) ? range[1] : defaultRange[1]];
}, applyAnimation:function(animation, oldAnimation) {
  if (!animation) {
    animation = {duration:0};
  } else {
    if (animation === true) {
      animation = {easing:'easeInOut', duration:500};
    }
  }
  return oldAnimation ? Ext.apply({}, animation, oldAnimation) : animation;
}});
Ext.define('Ext.chart.Markers', {extend:'Ext.draw.sprite.Instancing', isMarkers:true, defaultCategory:'default', constructor:function() {
  this.callParent(arguments);
  this.categories = {};
  this.revisions = {};
}, destroy:function() {
  this.categories = null;
  this.revisions = null;
  this.callParent();
}, getMarkerFor:function(category, index) {
  if (category in this.categories) {
    var categoryInstances = this.categories[category];
    if (index in categoryInstances) {
      return this.get(categoryInstances[index]);
    }
  }
}, clear:function(category) {
  category = category || this.defaultCategory;
  if (!(category in this.revisions)) {
    this.revisions[category] = 1;
  } else {
    this.revisions[category]++;
  }
}, putMarkerFor:function(category, attr, index, bypassNormalization, keepRevision) {
  category = category || this.defaultCategory;
  var me = this, categoryInstances = me.categories[category] || (me.categories[category] = {}), instance;
  if (index in categoryInstances) {
    me.setAttributesFor(categoryInstances[index], attr, bypassNormalization);
  } else {
    categoryInstances[index] = me.getCount();
    me.add(attr, bypassNormalization);
  }
  instance = me.get(categoryInstances[index]);
  if (instance) {
    instance.category = category;
    if (!keepRevision) {
      instance.revision = me.revisions[category] || (me.revisions[category] = 1);
    }
  }
}, getMarkerBBoxFor:function(category, index, isWithoutTransform) {
  if (category in this.categories) {
    var categoryInstances = this.categories[category];
    if (index in categoryInstances) {
      return this.getBBoxFor(categoryInstances[index], isWithoutTransform);
    }
  }
}, getBBox:function() {
  return null;
}, render:function(surface, ctx, rect) {
  var me = this, surfaceRect = surface.getRect(), revisions = me.revisions, mat = me.attr.matrix, template = me.getTemplate(), templateAttr = template.attr, ln = me.instances.length, instance, i;
  mat.toContext(ctx);
  template.preRender(surface, ctx, rect);
  template.useAttributes(ctx, surfaceRect);
  for (i = 0; i < ln; i++) {
    instance = me.get(i);
    if (instance.hidden || instance.revision !== revisions[instance.category]) {
      continue;
    }
    ctx.save();
    template.attr = instance;
    template.useAttributes(ctx, surfaceRect);
    template.render(surface, ctx, rect);
    ctx.restore();
  }
  template.attr = templateAttr;
}});
Ext.define('Ext.chart.modifier.Callout', {extend:'Ext.draw.modifier.Modifier', alternateClassName:'Ext.chart.label.Callout', prepareAttributes:function(attr) {
  if (!attr.hasOwnProperty('calloutOriginal')) {
    attr.calloutOriginal = Ext.Object.chain(attr);
    attr.calloutOriginal.prototype = attr;
  }
  if (this._lower) {
    this._lower.prepareAttributes(attr.calloutOriginal);
  }
}, setAttrs:function(attr, changes) {
  var callout = attr.callout, origin = attr.calloutOriginal, bbox = attr.bbox.plain, width = (bbox.width || 0) + attr.labelOverflowPadding, height = (bbox.height || 0) + attr.labelOverflowPadding, dx, dy;
  if ('callout' in changes) {
    callout = changes.callout;
  }
  if ('callout' in changes || 'calloutPlaceX' in changes || 'calloutPlaceY' in changes || 'x' in changes || 'y' in changes) {
    var rotationRads = 'rotationRads' in changes ? origin.rotationRads = changes.rotationRads : origin.rotationRads, x = 'x' in changes ? origin.x = changes.x : origin.x, y = 'y' in changes ? origin.y = changes.y : origin.y, calloutPlaceX = 'calloutPlaceX' in changes ? changes.calloutPlaceX : attr.calloutPlaceX, calloutPlaceY = 'calloutPlaceY' in changes ? changes.calloutPlaceY : attr.calloutPlaceY, calloutVertical = 'calloutVertical' in changes ? changes.calloutVertical : attr.calloutVertical, temp;
    rotationRads %= Math.PI * 2;
    if (Math.cos(rotationRads) < 0) {
      rotationRads = (rotationRads + Math.PI) % (Math.PI * 2);
    }
    if (rotationRads > Math.PI) {
      rotationRads -= Math.PI * 2;
    }
    if (calloutVertical) {
      rotationRads = rotationRads * (1 - callout) - Math.PI / 2 * callout;
      temp = width;
      width = height;
      height = temp;
    } else {
      rotationRads = rotationRads * (1 - callout);
    }
    changes.rotationRads = rotationRads;
    changes.x = x * (1 - callout) + calloutPlaceX * callout;
    changes.y = y * (1 - callout) + calloutPlaceY * callout;
    dx = calloutPlaceX - x;
    dy = calloutPlaceY - y;
    if (Math.abs(dy * width) > Math.abs(dx * height)) {
      if (dy > 0) {
        changes.calloutEndX = changes.x - height / 2 * (dx / dy) * callout;
        changes.calloutEndY = changes.y - height / 2 * callout;
      } else {
        changes.calloutEndX = changes.x + height / 2 * (dx / dy) * callout;
        changes.calloutEndY = changes.y + height / 2 * callout;
      }
    } else {
      if (dx > 0) {
        changes.calloutEndX = changes.x - width / 2;
        changes.calloutEndY = changes.y - width / 2 * (dy / dx) * callout;
      } else {
        changes.calloutEndX = changes.x + width / 2;
        changes.calloutEndY = changes.y + width / 2 * (dy / dx) * callout;
      }
    }
    if (changes.calloutStartX && changes.calloutStartY) {
      changes.calloutHasLine = dx > 0 && changes.calloutStartX < changes.calloutEndX || dx <= 0 && changes.calloutStartX > changes.calloutEndX || dy > 0 && changes.calloutStartY < changes.calloutEndY || dy <= 0 && changes.calloutStartY > changes.calloutEndY;
    } else {
      changes.calloutHasLine = true;
    }
  }
  return changes;
}, pushDown:function(attr, changes) {
  changes = this.callParent([attr.calloutOriginal, changes]);
  return this.setAttrs(attr, changes);
}, popUp:function(attr, changes) {
  attr = attr.prototype;
  changes = this.setAttrs(attr, changes);
  if (this._upper) {
    return this._upper.popUp(attr, changes);
  } else {
    return Ext.apply(attr, changes);
  }
}});
Ext.define('Ext.chart.sprite.Label', {extend:'Ext.draw.sprite.Text', alternateClassName:'Ext.chart.label.Label', requires:['Ext.chart.modifier.Callout'], inheritableStatics:{def:{processors:{callout:'limited01', calloutHasLine:'bool', calloutPlaceX:'number', calloutPlaceY:'number', calloutStartX:'number', calloutStartY:'number', calloutEndX:'number', calloutEndY:'number', calloutColor:'color', calloutWidth:'number', calloutVertical:'bool', labelOverflowPadding:'number', display:'enums(none,under,over,rotate,insideStart,insideEnd,inside,outside)', 
orientation:'enums(horizontal,vertical)', renderer:'default'}, defaults:{callout:0, calloutHasLine:true, calloutPlaceX:0, calloutPlaceY:0, calloutStartX:0, calloutStartY:0, calloutEndX:0, calloutEndY:0, calloutWidth:1, calloutVertical:false, calloutColor:'black', labelOverflowPadding:5, display:'none', orientation:'', renderer:null}, triggers:{callout:'transform', calloutPlaceX:'transform', calloutPlaceY:'transform', labelOverflowPadding:'transform', calloutRotation:'transform', display:'hidden'}, 
updaters:{hidden:function(attr) {
  attr.hidden = attr.display === 'none';
}}}}, config:{animation:{customDurations:{callout:200}}, field:null, calloutLine:true, hideLessThan:20}, applyCalloutLine:function(calloutLine) {
  if (calloutLine) {
    return Ext.apply({}, calloutLine);
  }
}, createModifiers:function() {
  var me = this, mods = me.callParent(arguments);
  mods.callout = new Ext.chart.modifier.Callout({sprite:me});
  mods.animation.setUpper(mods.callout);
  mods.callout.setUpper(mods.target);
}, render:function(surface, ctx) {
  var me = this, attr = me.attr, calloutColor = attr.calloutColor;
  ctx.save();
  ctx.globalAlpha *= attr.callout;
  if (ctx.globalAlpha > 0 && attr.calloutHasLine) {
    if (calloutColor && calloutColor.isGradient) {
      calloutColor = calloutColor.getStops()[0].color;
    }
    ctx.strokeStyle = calloutColor;
    ctx.fillStyle = calloutColor;
    ctx.lineWidth = attr.calloutWidth;
    ctx.beginPath();
    ctx.moveTo(me.attr.calloutStartX, me.attr.calloutStartY);
    ctx.lineTo(me.attr.calloutEndX, me.attr.calloutEndY);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(me.attr.calloutStartX, me.attr.calloutStartY, 1 * attr.calloutWidth, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(me.attr.calloutEndX, me.attr.calloutEndY, 1 * attr.calloutWidth, 0, 2 * Math.PI, true);
    ctx.fill();
  }
  ctx.restore();
  Ext.draw.sprite.Text.prototype.render.apply(me, arguments);
}});
Ext.define('Ext.chart.series.Series', {requires:['Ext.chart.Util', 'Ext.chart.Markers', 'Ext.chart.sprite.Label', 'Ext.tip.ToolTip'], mixins:['Ext.mixin.Observable', 'Ext.mixin.Bindable'], isSeries:true, defaultBindProperty:'store', type:null, seriesType:'sprite', identifiablePrefix:'ext-line-', observableType:'series', darkerStrokeRatio:0.15, config:{chart:null, title:null, renderer:null, showInLegend:true, triggerAfterDraw:false, theme:null, style:{}, subStyle:{}, themeStyle:{}, colors:null, useDarkerStrokeColor:true, 
store:null, label:null, labelOverflowPadding:null, showMarkers:true, marker:null, markerSubStyle:null, itemInstancing:null, background:null, surface:null, overlaySurface:null, hidden:false, highlight:false, highlightCfg:{merge:function(value) {
  return value;
}, $value:{fillStyle:'yellow', strokeStyle:'red'}}, animation:null, tooltip:null}, directions:[], sprites:null, themeColorCount:function() {
  return 1;
}, isStoreDependantColorCount:false, themeMarkerCount:function() {
  return 0;
}, getFields:function(fieldCategory) {
  var me = this, fields = [], ln = fieldCategory.length, i, field;
  for (i = 0; i < ln; i++) {
    field = me['get' + fieldCategory[i] + 'Field']();
    if (Ext.isArray(field)) {
      fields.push.apply(fields, field);
    } else {
      fields.push(field);
    }
  }
  return fields;
}, applyAnimation:function(animation, oldAnimation) {
  var chart = this.getChart();
  if (!chart.isSettingSeriesAnimation) {
    this.isUserAnimation = true;
  }
  return Ext.chart.Util.applyAnimation(animation, oldAnimation);
}, updateAnimation:function(animation) {
  var sprites = this.getSprites(), itemsMarker, markersMarker, i, ln, sprite;
  for (i = 0, ln = sprites.length; i < ln; i++) {
    sprite = sprites[i];
    if (sprite.isMarkerHolder) {
      itemsMarker = sprite.getMarker('items');
      if (itemsMarker) {
        itemsMarker.getTemplate().setAnimation(animation);
      }
      markersMarker = sprite.getMarker('markers');
      if (markersMarker) {
        markersMarker.getTemplate().setAnimation(animation);
      }
    }
    sprite.setAnimation(animation);
  }
}, getAnimation:function() {
  var chart = this.getChart(), animation;
  if (chart && chart.animationSuspendCount) {
    animation = {duration:0};
  } else {
    if (this.isUserAnimation) {
      animation = this.callParent();
    } else {
      animation = chart.getAnimation();
    }
  }
  return animation;
}, updateTitle:function() {
  var me = this, chart = me.getChart();
  if (chart && !chart.isInitializing) {
    chart.refreshLegendStore();
  }
}, applyHighlight:function(highlight, oldHighlight) {
  var me = this, highlightCfg = me.getHighlightCfg();
  if (Ext.isObject(highlight)) {
    highlight = Ext.merge({}, highlightCfg, highlight);
  } else {
    if (highlight === true) {
      highlight = highlightCfg;
    }
  }
  if (highlight) {
    highlight.type = 'highlight';
  }
  return highlight && Ext.merge({}, oldHighlight, highlight);
}, updateHighlight:function(highlight) {
  var me = this, sprites = me.sprites, highlightCfg = me.getHighlightCfg(), i, ln, sprite, items, markers;
  me.getStyle();
  if (!Ext.Object.isEmpty(highlight)) {
    me.addItemHighlight();
    for (i = 0, ln = sprites.length; i < ln; i++) {
      sprite = sprites[i];
      if (sprite.isMarkerHolder) {
        items = sprite.getMarker('items');
        if (items) {
          items.getTemplate().modifiers.highlight.setStyle(highlight);
        }
        markers = sprite.getMarker('markers');
        if (markers) {
          markers.getTemplate().modifiers.highlight.setStyle(highlight);
        }
      }
    }
  } else {
    if (!Ext.Object.equals(highlightCfg, this.defaultConfig.highlightCfg)) {
      this.addItemHighlight();
    }
  }
}, updateHighlightCfg:function(highlightCfg) {
  if (!this.isConfiguring && !Ext.Object.equals(highlightCfg, this.defaultConfig.highlightCfg)) {
    this.addItemHighlight();
  }
}, applyItemInstancing:function(instancing, oldInstancing) {
  return Ext.merge(oldInstancing || {}, instancing);
}, setAttributesForItem:function(item, change) {
  var sprite = item && item.sprite, i;
  if (sprite) {
    if (sprite.isMarkerHolder && item.category === 'items') {
      sprite.putMarker(item.category, change, item.index, false, true);
    }
    if (sprite.isMarkerHolder && item.category === 'markers') {
      sprite.putMarker(item.category, change, item.index, false, true);
    } else {
      if (sprite.isInstancing) {
        sprite.setAttributesFor(item.index, change);
      } else {
        if (Ext.isArray(sprite)) {
          for (i = 0; i < sprite.length; i++) {
            sprite[i].setAttributes(change);
          }
        } else {
          sprite.setAttributes(change);
        }
      }
    }
  }
}, getBBoxForItem:function(item) {
  var sprite = item && item.sprite, result = null;
  if (sprite) {
    if (sprite.getMarker('items') && item.category === 'items') {
      result = sprite.getMarkerBBox(item.category, item.index);
    } else {
      if (sprite instanceof Ext.draw.sprite.Instancing) {
        result = sprite.getBBoxFor(item.index);
      } else {
        result = sprite.getBBox();
      }
    }
  }
  return result;
}, dataRange:null, constructor:function(config) {
  var me = this, id;
  config = config || {};
  if (config.tips) {
    config = Ext.apply({tooltip:config.tips}, config);
  }
  if (config.highlightCfg) {
    config = Ext.apply({highlight:config.highlightCfg}, config);
  }
  if ('id' in config) {
    id = config.id;
  } else {
    if ('id' in me.config) {
      id = me.config.id;
    } else {
      id = me.getId();
    }
  }
  me.setId(id);
  me.sprites = [];
  me.dataRange = [];
  me.mixins.observable.constructor.call(me, config);
  me.initBindable();
}, lookupViewModel:function(skipThis) {
  var chart = this.getChart();
  return chart ? chart.lookupViewModel(skipThis) : null;
}, applyTooltip:function(tooltip, oldTooltip) {
  var config = Ext.apply({xtype:'tooltip', renderer:Ext.emptyFn, constrainPosition:true, shrinkWrapDock:true, autoHide:true, hideDelay:200, mouseOffset:[20, 20], trackmouse:true}, tooltip);
  return Ext.create(config);
}, updateTooltip:function() {
  this.addItemHighlight();
}, addItemHighlight:function() {
  var chart = this.getChart();
  if (!chart) {
    return;
  }
  var interactions = chart.getInteractions(), i, interaction, hasRequiredInteraction;
  for (i = 0; i < interactions.length; i++) {
    interaction = interactions[i];
    if (interaction.isItemHighlight || interaction.isItemEdit) {
      hasRequiredInteraction = true;
      break;
    }
  }
  if (!hasRequiredInteraction) {
    interactions.push('itemhighlight');
    chart.setInteractions(interactions);
  }
}, showTooltip:function(item, event) {
  var me = this, tooltip = me.getTooltip();
  if (!tooltip) {
    return;
  }
  Ext.callback(tooltip.renderer, tooltip.scope, [tooltip, item.record, item], 0, me);
  tooltip.showBy(event);
}, showTooltipAt:function(item, x, y) {
  var me = this, tooltip = me.getTooltip(), mouseOffset = tooltip.config.mouseOffset;
  if (!tooltip || !tooltip.showAt) {
    return;
  }
  if (mouseOffset) {
    x += mouseOffset[0];
    y += mouseOffset[1];
  }
  Ext.callback(tooltip.renderer, tooltip.scope, [tooltip, item.record, item], 0, me);
  tooltip.showAt([x, y]);
}, hideTooltip:function(item, immediate) {
  var me = this, tooltip = me.getTooltip();
  if (!tooltip) {
    return;
  }
  if (immediate) {
    tooltip.hide();
  } else {
    tooltip.delayHide();
  }
}, applyStore:function(store) {
  return store && Ext.StoreManager.lookup(store);
}, getStore:function() {
  return this._store || this.getChart() && this.getChart().getStore();
}, updateStore:function(newStore, oldStore) {
  var me = this, chart = me.getChart(), chartStore = chart && chart.getStore(), sprites, sprite, len, i;
  oldStore = oldStore || chartStore;
  if (oldStore && oldStore !== newStore) {
    oldStore.un({datachanged:'onDataChanged', update:'onDataChanged', scope:me});
  }
  if (newStore) {
    newStore.on({datachanged:'onDataChanged', update:'onDataChanged', scope:me});
    sprites = me.getSprites();
    for (i = 0, len = sprites.length; i < len; i++) {
      sprite = sprites[i];
      if (sprite.setStore) {
        sprite.setStore(newStore);
      }
    }
    me.onDataChanged();
  }
  me.fireEvent('storechange', me, newStore, oldStore);
}, onStoreChange:function(chart, newStore, oldStore) {
  if (!this._store) {
    this.updateStore(newStore, oldStore);
  }
}, defaultRange:[0, 1], coordinate:function(direction, directionOffset, directionCount) {
  var me = this, store = me.getStore(), hidden = me.getHidden(), items = store.getData().items, axis = me['get' + direction + 'Axis'](), dataRange = [NaN, NaN], fieldCategory = me['fieldCategory' + direction] || [direction], fields = me.getFields(fieldCategory), i, field, data, style = {}, sprites = me.getSprites(), axisRange;
  if (sprites.length && !Ext.isBoolean(hidden) || !hidden) {
    for (i = 0; i < fieldCategory.length; i++) {
      field = fields[i];
      data = me.coordinateData(items, field, axis);
      Ext.chart.Util.expandRange(dataRange, data);
      style['data' + fieldCategory[i]] = data;
    }
    dataRange = Ext.chart.Util.validateRange(dataRange, me.defaultRange);
    me.dataRange[directionOffset] = dataRange[0];
    me.dataRange[directionOffset + directionCount] = dataRange[1];
    style['dataMin' + direction] = dataRange[0];
    style['dataMax' + direction] = dataRange[1];
    if (axis) {
      axisRange = axis.getRange(true);
      axis.setBoundSeriesRange(axisRange);
    }
    for (i = 0; i < sprites.length; i++) {
      sprites[i].setAttributes(style);
    }
  }
}, coordinateData:function(items, field, axis) {
  var data = [], length = items.length, layout = axis && axis.getLayout(), i, x;
  for (i = 0; i < length; i++) {
    x = items[i].data[field];
    if (!Ext.isEmpty(x, true)) {
      if (layout) {
        data[i] = layout.getCoordFor(x, field, i, items);
      } else {
        x = +x;
        data[i] = Ext.isNumber(x) ? x : i;
      }
    } else {
      data[i] = x;
    }
  }
  return data;
}, updateLabelData:function() {
  var label = this.getLabel();
  if (!label) {
    return;
  }
  var store = this.getStore(), items = store.getData().items, sprites = this.getSprites(), labelTpl = label.getTemplate(), labelFields = Ext.Array.from(labelTpl.getField()), i, j, ln, labels, sprite, field;
  if (!sprites.length || !labelFields.length) {
    return;
  }
  for (i = 0; i < sprites.length; i++) {
    sprite = sprites[i];
    if (!sprite.getField) {
      continue;
    }
    labels = [];
    field = sprite.getField();
    if (Ext.Array.indexOf(labelFields, field) < 0) {
      field = labelFields[i];
    }
    for (j = 0, ln = items.length; j < ln; j++) {
      labels.push(items[j].get(field));
    }
    sprite.setAttributes({labels:labels});
  }
}, processData:function() {
  var me = this;
  if (me.isProcessingData || !me.getStore()) {
    return;
  }
  var directions = this.directions, i, ln = directions.length, direction, axis, name;
  me.isProcessingData = true;
  for (i = 0; i < ln; i++) {
    direction = directions[i];
    axis = me['get' + direction + 'Axis']();
    if (axis) {
      axis.processData(me);
      continue;
    }
    name = 'coordinate' + direction;
    if (me[name]) {
      me[name]();
    }
  }
  me.updateLabelData();
  me.isProcessingData = false;
}, applyBackground:function(background) {
  var surface, result;
  if (this.getChart()) {
    surface = this.getSurface();
    surface.setBackground(background);
    result = surface.getBackground();
  } else {
    result = background;
  }
  return result;
}, updateChart:function(newChart, oldChart) {
  var me = this, store = me._store;
  if (oldChart) {
    oldChart.un('axeschange', 'onAxesChange', me);
    me.clearSprites();
    me.setSurface(null);
    me.setOverlaySurface(null);
    oldChart.unregister(me);
    me.onChartDetached(oldChart);
    if (!store) {
      me.updateStore(null);
    }
  }
  if (newChart) {
    me.setSurface(newChart.getSurface('series'));
    me.setOverlaySurface(newChart.getSurface('overlay'));
    newChart.on('axeschange', 'onAxesChange', me);
    if (newChart.getAxes()) {
      me.onAxesChange(newChart);
    }
    me.onChartAttached(newChart);
    newChart.register(me);
    if (!store) {
      me.updateStore(newChart.getStore());
    }
  }
}, onAxesChange:function(chart, force) {
  if (chart.destroying || chart.destroyed) {
    return;
  }
  var me = this, axes = chart.getAxes(), axis, directionToAxesMap = {}, directionToFieldsMap = {}, needHighPrecision = false, directions = this.directions, direction, i, ln;
  for (i = 0, ln = directions.length; i < ln; i++) {
    direction = directions[i];
    directionToFieldsMap[direction] = me.getFields(me['fieldCategory' + direction]);
  }
  for (i = 0, ln = axes.length; i < ln; i++) {
    axis = axes[i];
    direction = axis.getDirection();
    if (!directionToAxesMap[direction]) {
      directionToAxesMap[direction] = [axis];
    } else {
      directionToAxesMap[direction].push(axis);
    }
  }
  for (i = 0, ln = directions.length; i < ln; i++) {
    direction = directions[i];
    if (!force && me['get' + direction + 'Axis']()) {
      continue;
    }
    if (directionToAxesMap[direction]) {
      axis = me.findMatchingAxis(directionToAxesMap[direction], directionToFieldsMap[direction]);
      if (axis) {
        me['set' + direction + 'Axis'](axis);
        if (axis.getNeedHighPrecision()) {
          needHighPrecision = true;
        }
      }
    }
  }
  this.getSurface().setHighPrecision(needHighPrecision);
}, findMatchingAxis:function(directionAxes, directionFields) {
  var axis, axisFields, i, j;
  for (i = 0; i < directionAxes.length; i++) {
    axis = directionAxes[i];
    axisFields = axis.getFields();
    if (!axisFields.length) {
      return axis;
    } else {
      if (directionFields) {
        for (j = 0; j < directionFields.length; j++) {
          if (Ext.Array.indexOf(axisFields, directionFields[j]) >= 0) {
            return axis;
          }
        }
      }
    }
  }
}, onChartDetached:function(oldChart) {
  var me = this;
  me.fireEvent('chartdetached', oldChart, me);
  oldChart.un('storechange', 'onStoreChange', me);
}, onChartAttached:function(chart) {
  var me = this;
  me.fireEvent('chartattached', chart, me);
  chart.on('storechange', 'onStoreChange', me);
  me.processData();
}, updateOverlaySurface:function(overlaySurface) {
  var label = this.getLabel();
  if (overlaySurface && label) {
    overlaySurface.add(label);
  }
}, getLabel:function() {
  return this.labelMarker;
}, setLabel:function(label) {
  var me = this, chart = me.getChart(), marker = me.labelMarker, template;
  if (!label && marker) {
    marker.getTemplate().destroy();
    marker.destroy();
    me.labelMarker = marker = null;
  }
  if (label) {
    if (!marker) {
      marker = me.labelMarker = new Ext.chart.Markers({zIndex:10});
      marker.setTemplate(new Ext.chart.sprite.Label);
      me.getOverlaySurface().add(marker);
    }
    template = marker.getTemplate();
    template.setAttributes(label);
    template.setConfig(label);
    if (label.field) {
      template.setField(label.field);
    }
    if (label.display) {
      marker.setAttributes({hidden:label.display === 'none'});
    }
    marker.setDirty(true);
  }
  me.updateLabelData();
  if (chart && !chart.isInitializing && !me.isConfiguring) {
    chart.redraw();
  }
}, createItemInstancingSprite:function(sprite, itemInstancing) {
  var me = this, markers = new Ext.chart.Markers, config = Ext.apply({modifiers:'highlight'}, itemInstancing), style = me.getStyle(), template, animation;
  markers.setAttributes({zIndex:Number.MAX_VALUE});
  markers.setTemplate(config);
  template = markers.getTemplate();
  template.setAttributes(style);
  animation = template.getAnimation();
  animation.on('animationstart', 'onSpriteAnimationStart', this);
  animation.on('animationend', 'onSpriteAnimationEnd', this);
  sprite.bindMarker('items', markers);
  me.getSurface().add(markers);
  return markers;
}, getDefaultSpriteConfig:function() {
  return {type:this.seriesType, renderer:this.getRenderer()};
}, updateRenderer:function(renderer) {
  var me = this, chart = me.getChart();
  if (chart && chart.isInitializing) {
    return;
  }
  if (me.sprites.length) {
    me.sprites[0].setAttributes({renderer:renderer || null});
    if (chart && !chart.isInitializing) {
      chart.redraw();
    }
  }
}, updateShowMarkers:function(showMarkers) {
  var sprite = this.getSprite(), markers = sprite && sprite.getMarker('markers');
  if (markers) {
    markers.getTemplate().setAttributes({hidden:!showMarkers});
  }
}, createSprite:function() {
  var me = this, surface = me.getSurface(), itemInstancing = me.getItemInstancing(), sprite = surface.add(me.getDefaultSpriteConfig()), markerCfg = me.getMarker(), marker, animation, label;
  sprite.setAttributes(me.getStyle());
  sprite.setSeries(me);
  if (itemInstancing) {
    me.createItemInstancingSprite(sprite, itemInstancing);
  }
  if (sprite.bindMarker) {
    if (markerCfg) {
      marker = new Ext.chart.Markers;
      markerCfg = Ext.Object.merge({modifiers:'highlight'}, markerCfg);
      marker.setTemplate(markerCfg);
      marker.getTemplate().getAnimation().setCustomDurations({translationX:0, translationY:0});
      sprite.dataMarker = marker;
      sprite.bindMarker('markers', marker);
      me.getOverlaySurface().add(marker);
    }
    label = me.getLabel();
    if (label && label.getTemplate().getField()) {
      sprite.bindMarker('labels', label);
    }
  }
  if (sprite.setStore) {
    sprite.setStore(me.getStore());
  }
  animation = sprite.getAnimation();
  animation.on('animationstart', 'onSpriteAnimationStart', me);
  animation.on('animationend', 'onSpriteAnimationEnd', me);
  me.sprites.push(sprite);
  return sprite;
}, getSprites:Ext.emptyFn, getSprite:function() {
  var sprites = this.getSprites();
  return sprites && sprites[0];
}, withSprite:function(fn) {
  var sprite = this.getSprite();
  return sprite && fn(sprite) || undefined;
}, forEachSprite:function(fn) {
  var sprites = this.getSprites(), i, ln;
  for (i = 0, ln = sprites.length; i < ln; i++) {
    fn(sprites[i]);
  }
}, onDataChanged:function() {
  var me = this, chart = me.getChart(), chartStore = chart && chart.getStore(), seriesStore = me.getStore();
  if (seriesStore !== chartStore) {
    me.processData();
  }
}, isXType:function(xtype) {
  return xtype === 'series';
}, getItemId:function() {
  return this.getId();
}, applyThemeStyle:function(theme, oldTheme) {
  var me = this, fill, stroke;
  fill = theme && theme.subStyle && theme.subStyle.fillStyle;
  stroke = fill && theme.subStyle.strokeStyle;
  if (fill && !stroke) {
    theme.subStyle.strokeStyle = me.getStrokeColorsFromFillColors(fill);
  }
  fill = theme && theme.markerSubStyle && theme.markerSubStyle.fillStyle;
  stroke = fill && theme.markerSubStyle.strokeStyle;
  if (fill && !stroke) {
    theme.markerSubStyle.strokeStyle = me.getStrokeColorsFromFillColors(fill);
  }
  return Ext.apply(oldTheme || {}, theme);
}, applyStyle:function(style, oldStyle) {
  return Ext.apply({}, style, oldStyle);
}, applySubStyle:function(subStyle, oldSubStyle) {
  var name = Ext.ClassManager.getNameByAlias('sprite.' + this.seriesType), cls = Ext.ClassManager.get(name);
  if (cls && cls.def) {
    subStyle = cls.def.batchedNormalize(subStyle, true);
  }
  return Ext.merge({}, oldSubStyle, subStyle);
}, applyMarker:function(marker, oldMarker) {
  var type = marker && marker.type || oldMarker && oldMarker.type || 'circle', cls = Ext.ClassManager.get(Ext.ClassManager.getNameByAlias('sprite.' + type));
  if (cls && cls.def) {
    marker = cls.def.normalize(Ext.isObject(marker) ? marker : {}, true);
    marker.type = type;
  }
  return Ext.merge(oldMarker || {}, marker);
}, applyMarkerSubStyle:function(marker, oldMarker) {
  var type = marker && marker.type || oldMarker && oldMarker.type || 'circle', cls = Ext.ClassManager.get(Ext.ClassManager.getNameByAlias('sprite.' + type));
  if (cls && cls.def) {
    marker = cls.def.batchedNormalize(marker, true);
  }
  return Ext.merge(oldMarker || {}, marker);
}, updateHidden:function(hidden) {
  var me = this;
  me.getColors();
  me.getSubStyle();
  me.setSubStyle({hidden:hidden});
  me.processData();
  me.doUpdateStyles();
  if (!Ext.isArray(hidden)) {
    me.updateLegendStore(hidden);
  }
}, updateLegendStore:function(hidden, index) {
  var me = this, chart = me.getChart(), legendStore = chart && chart.getLegendStore(), id = me.getId(), record;
  if (legendStore) {
    if (arguments.length > 1) {
      record = legendStore.findBy(function(rec) {
        return rec.get('series') === id && rec.get('index') === index;
      });
      if (record !== -1) {
        record = legendStore.getAt(record);
      }
    } else {
      record = legendStore.findRecord('series', id);
    }
    if (record && record.get('disabled') !== hidden) {
      record.set('disabled', hidden);
    }
  }
}, setHiddenByIndex:function(index, value) {
  var me = this;
  if (Ext.isArray(me.getHidden())) {
    me.getHidden()[index] = value;
    me.updateHidden(me.getHidden());
    me.updateLegendStore(value, index);
  } else {
    me.setHidden(value);
  }
}, getStrokeColorsFromFillColors:function(colors) {
  var me = this, darker = me.getUseDarkerStrokeColor(), darkerRatio = Ext.isNumber(darker) ? darker : me.darkerStrokeRatio, strokeColors;
  if (darker) {
    strokeColors = Ext.Array.map(colors, function(color) {
      color = Ext.isString(color) ? color : color.stops[0].color;
      color = Ext.util.Color.fromString(color);
      return color.createDarker(darkerRatio).toString();
    });
  } else {
    strokeColors = Ext.Array.clone(colors);
  }
  return strokeColors;
}, updateThemeColors:function(colors) {
  var me = this, theme = me.getThemeStyle(), fillColors = Ext.Array.clone(colors), strokeColors = me.getStrokeColorsFromFillColors(colors), newSubStyle = {fillStyle:fillColors, strokeStyle:strokeColors};
  theme.subStyle = Ext.apply(theme.subStyle || {}, newSubStyle);
  theme.markerSubStyle = Ext.apply(theme.markerSubStyle || {}, newSubStyle);
  me.doUpdateStyles();
  if (!me.isConfiguring) {
    me.getChart().refreshLegendStore();
  }
}, themeOnlyIfConfigured:{}, updateTheme:function(theme) {
  var me = this, seriesTheme = theme.getSeries(), initialConfig = me.getInitialConfig(), defaultConfig = me.defaultConfig, configs = me.self.getConfigurator().configs, genericSeriesTheme = seriesTheme.defaults, specificSeriesTheme = seriesTheme[me.type], themeOnlyIfConfigured = me.themeOnlyIfConfigured, key, value, isObjValue, isUnusedConfig, initialValue, cfg;
  seriesTheme = Ext.merge({}, genericSeriesTheme, specificSeriesTheme);
  for (key in seriesTheme) {
    value = seriesTheme[key];
    cfg = configs[key];
    if (value !== null && value !== undefined && cfg) {
      initialValue = initialConfig[key];
      isObjValue = Ext.isObject(value);
      isUnusedConfig = initialValue === defaultConfig[key];
      if (isObjValue) {
        if (isUnusedConfig && themeOnlyIfConfigured[key]) {
          continue;
        }
        value = Ext.merge({}, value, initialValue);
      }
      if (isUnusedConfig || isObjValue) {
        me[cfg.names.set](value);
      }
    }
  }
}, updateChartColors:function(colors) {
  var me = this;
  if (!me.getColors()) {
    me.updateThemeColors(colors);
  }
}, updateColors:function(colors) {
  this.updateThemeColors(colors);
  if (!this.isConfiguring) {
    var chart = this.getChart();
    if (chart) {
      chart.refreshLegendStore();
    }
  }
}, updateStyle:function() {
  this.doUpdateStyles();
}, updateSubStyle:function() {
  this.doUpdateStyles();
}, updateThemeStyle:function() {
  this.doUpdateStyles();
}, doUpdateStyles:function() {
  var me = this, sprites = me.sprites, itemInstancing = me.getItemInstancing(), i = 0, ln = sprites && sprites.length, showMarkers = me.getConfig('showMarkers', true), markerCfg = me.getMarker(), style;
  for (; i < ln; i++) {
    style = me.getStyleByIndex(i);
    if (itemInstancing) {
      sprites[i].getMarker('items').getTemplate().setAttributes(style);
    }
    sprites[i].setAttributes(style);
    if (markerCfg && sprites[i].dataMarker) {
      sprites[i].dataMarker.getTemplate().setAttributes(me.getMarkerStyleByIndex(i));
    }
  }
}, getStyleWithTheme:function() {
  var me = this, theme = me.getThemeStyle(), style = Ext.clone(me.getStyle());
  if (theme && theme.style) {
    Ext.applyIf(style, theme.style);
  }
  return style;
}, getSubStyleWithTheme:function() {
  var me = this, theme = me.getThemeStyle(), subStyle = Ext.clone(me.getSubStyle());
  if (theme && theme.subStyle) {
    Ext.applyIf(subStyle, theme.subStyle);
  }
  return subStyle;
}, getStyleByIndex:function(i) {
  var me = this, theme = me.getThemeStyle(), style, themeStyle, subStyle, themeSubStyle, result = {};
  style = me.getStyle();
  themeStyle = theme && theme.style || {};
  subStyle = me.styleDataForIndex(me.getSubStyle(), i);
  themeSubStyle = me.styleDataForIndex(theme && theme.subStyle, i);
  Ext.apply(result, themeStyle);
  Ext.apply(result, themeSubStyle);
  Ext.apply(result, style);
  Ext.apply(result, subStyle);
  return result;
}, getMarkerStyleByIndex:function(i) {
  var me = this, theme = me.getThemeStyle(), style, themeStyle, subStyle, themeSubStyle, markerStyle, themeMarkerStyle, markerSubStyle, themeMarkerSubStyle, result = {};
  style = me.getStyle();
  themeStyle = theme && theme.style || {};
  subStyle = me.styleDataForIndex(me.getSubStyle(), i);
  if (subStyle.hasOwnProperty('hidden')) {
    subStyle.hidden = subStyle.hidden || !this.getConfig('showMarkers', true);
  }
  themeSubStyle = me.styleDataForIndex(theme && theme.subStyle, i);
  markerStyle = me.getMarker();
  themeMarkerStyle = theme && theme.marker || {};
  markerSubStyle = me.getMarkerSubStyle();
  themeMarkerSubStyle = me.styleDataForIndex(theme && theme.markerSubStyle, i);
  Ext.apply(result, themeStyle);
  Ext.apply(result, themeSubStyle);
  Ext.apply(result, themeMarkerStyle);
  Ext.apply(result, themeMarkerSubStyle);
  Ext.apply(result, style);
  Ext.apply(result, subStyle);
  Ext.apply(result, markerStyle);
  Ext.apply(result, markerSubStyle);
  return result;
}, styleDataForIndex:function(style, i) {
  var value, name, result = {};
  if (style) {
    for (name in style) {
      value = style[name];
      if (Ext.isArray(value)) {
        result[name] = value[i % value.length];
      } else {
        result[name] = value;
      }
    }
  }
  return result;
}, getItemForPoint:Ext.emptyFn, getItemByIndex:function(index, category) {
  var me = this, sprites = me.getSprites(), sprite = sprites && sprites[0], item;
  if (!sprite) {
    return;
  }
  if (category === undefined && sprite.isMarkerHolder) {
    category = me.getItemInstancing() ? 'items' : 'markers';
  } else {
    if (!category || category === '' || category === 'sprites') {
      sprite = sprites[index];
    }
  }
  if (sprite) {
    item = {series:me, category:category, index:index, record:me.getStore().getData().items[index], field:me.getYField(), sprite:sprite};
    return item;
  }
}, onSpriteAnimationStart:function(sprite) {
  this.fireEvent('animationstart', this, sprite);
}, onSpriteAnimationEnd:function(sprite) {
  this.fireEvent('animationend', this, sprite);
}, resolveListenerScope:function(defaultScope) {
  var me = this, namedScope = Ext._namedScopes[defaultScope], chart = me.getChart(), scope;
  if (!namedScope) {
    scope = chart ? chart.resolveListenerScope(defaultScope, false) : defaultScope || me;
  } else {
    if (namedScope.isThis) {
      scope = me;
    } else {
      if (namedScope.isController) {
        scope = chart ? chart.resolveListenerScope(defaultScope, false) : me;
      } else {
        if (namedScope.isSelf) {
          scope = chart ? chart.resolveListenerScope(defaultScope, false) : me;
          if (scope === chart && !chart.getInheritedConfig('defaultListenerScope')) {
            scope = me;
          }
        }
      }
    }
  }
  return scope;
}, provideLegendInfo:function(target) {
  var me = this, style = me.getSubStyleWithTheme(), fill = style.fillStyle;
  if (Ext.isArray(fill)) {
    fill = fill[0];
  }
  target.push({name:me.getTitle() || me.getYField() || me.getId(), mark:(Ext.isObject(fill) ? fill.stops && fill.stops[0].color : fill) || style.strokeStyle || 'black', disabled:me.getHidden(), series:me.getId(), index:0});
}, clearSprites:function() {
  var sprites = this.sprites, sprite, i, ln;
  for (i = 0, ln = sprites.length; i < ln; i++) {
    sprite = sprites[i];
    if (sprite && sprite.isSprite) {
      sprite.destroy();
    }
  }
  this.sprites = [];
}, destroy:function() {
  var me = this, store = me._store, tooltip = me.getConfig('tooltip', true);
  if (store && store.getAutoDestroy()) {
    Ext.destroy(store);
  }
  me.setChart(null);
  me.clearListeners();
  if (tooltip) {
    Ext.destroy(tooltip);
  }
  me.callParent();
}});
Ext.define('Ext.chart.interactions.Abstract', {xtype:'interaction', mixins:{observable:'Ext.mixin.Observable'}, config:{gestures:{tap:'onGesture'}, chart:null, enabled:true}, throttleGap:0, stopAnimationBeforeSync:false, constructor:function(config) {
  var me = this, id;
  config = config || {};
  if ('id' in config) {
    id = config.id;
  } else {
    if ('id' in me.config) {
      id = me.config.id;
    } else {
      id = me.getId();
    }
  }
  me.setId(id);
  me.mixins.observable.constructor.call(me, config);
}, updateChart:function(newChart, oldChart) {
  var me = this;
  if (oldChart === newChart) {
    return;
  }
  if (oldChart) {
    oldChart.unregister(me);
    me.removeChartListener(oldChart);
  }
  if (newChart) {
    newChart.register(me);
    me.addChartListener();
  }
}, updateEnabled:function(enabled) {
  var me = this, chart = me.getChart();
  if (chart) {
    if (enabled) {
      me.addChartListener();
    } else {
      me.removeChartListener(chart);
    }
  }
}, onGesture:Ext.emptyFn, getItemForEvent:function(e) {
  var me = this, chart = me.getChart(), chartXY = chart.getEventXY(e);
  return chart.getItemForPoint(chartXY[0], chartXY[1]);
}, getItemsForEvent:function(e) {
  var me = this, chart = me.getChart(), chartXY = chart.getEventXY(e);
  return chart.getItemsForPoint(chartXY[0], chartXY[1]);
}, addChartListener:function() {
  var me = this, chart = me.getChart(), gestures = me.getGestures(), gesture;
  if (!me.getEnabled()) {
    return;
  }
  function insertGesture(name, fn) {
    chart.addElementListener(name, me.listeners[name] = function(e) {
      var locks = me.getLocks(), result;
      if (me.getEnabled() && (!(name in locks) || locks[name] === me)) {
        result = (Ext.isFunction(fn) ? fn : me[fn]).apply(this, arguments);
        if (result === false && e && e.stopPropagation) {
          e.stopPropagation();
        }
        return result;
      }
    }, me);
  }
  me.listeners = me.listeners || {};
  for (gesture in gestures) {
    insertGesture(gesture, gestures[gesture]);
  }
}, removeChartListener:function(chart) {
  var me = this, gestures = me.getGestures(), gesture;
  function removeGesture(name) {
    var fn = me.listeners[name];
    if (fn) {
      chart.removeElementListener(name, fn);
      delete me.listeners[name];
    }
  }
  if (me.listeners) {
    for (gesture in gestures) {
      removeGesture(gesture);
    }
  }
}, lockEvents:function() {
  var me = this, locks = me.getLocks(), args = Array.prototype.slice.call(arguments), i = args.length;
  while (i--) {
    locks[args[i]] = me;
  }
}, unlockEvents:function() {
  var locks = this.getLocks(), args = Array.prototype.slice.call(arguments), i = args.length;
  while (i--) {
    delete locks[args[i]];
  }
}, getLocks:function() {
  var chart = this.getChart();
  return chart.lockedEvents || (chart.lockedEvents = {});
}, doSync:function() {
  var me = this, chart = me.getChart();
  if (me.syncTimer) {
    Ext.undefer(me.syncTimer);
    me.syncTimer = null;
  }
  if (me.stopAnimationBeforeSync) {
    chart.animationSuspendCount++;
  }
  chart.redraw();
  if (me.stopAnimationBeforeSync) {
    chart.animationSuspendCount--;
  }
  me.syncThrottle = Date.now() + me.throttleGap;
}, sync:function() {
  var me = this;
  if (me.throttleGap && Ext.frameStartTime < me.syncThrottle) {
    if (me.syncTimer) {
      return;
    }
    me.syncTimer = Ext.defer(function() {
      me.doSync();
    }, me.throttleGap);
  } else {
    me.doSync();
  }
}, getItemId:function() {
  return this.getId();
}, isXType:function(xtype) {
  return xtype === 'interaction';
}, destroy:function() {
  var me = this;
  me.setChart(null);
  delete me.listeners;
  me.callParent();
}}, function() {
  if (Ext.os.is.Android4) {
    this.prototype.throttleGap = 40;
  }
});
Ext.define('Ext.chart.MarkerHolder', {extend:'Ext.Mixin', requires:['Ext.chart.Markers'], mixinConfig:{id:'markerHolder', after:{constructor:'constructor', preRender:'preRender'}, before:{destroy:'destroy'}}, isMarkerHolder:true, surfaceMatrix:null, inverseSurfaceMatrix:null, deprecated:{6:{methods:{getBoundMarker:{message:"Please use the 'getMarker' method instead.", fn:function(name) {
  var marker = this.boundMarkers[name];
  return marker ? [marker] : marker;
}}}}}, constructor:function() {
  this.boundMarkers = {};
  this.cleanRedraw = false;
}, bindMarker:function(name, marker) {
  var me = this, markers = me.boundMarkers;
  if (marker && marker.isMarkers) {
    if (markers[name] && markers[name] === marker) {
      Ext.log.warn(me.getId(), " (MarkerHolder): the Markers instance '", marker.getId(), "' is already bound under the name '", name, "'.");
    }
    me.releaseMarker(name);
    markers[name] = marker;
    marker.on('destroy', me.onMarkerDestroy, me);
  }
}, onMarkerDestroy:function(marker) {
  this.releaseMarker(marker);
}, releaseMarker:function(marker) {
  var markers = this.boundMarkers, name;
  if (marker && marker.isMarkers) {
    for (name in markers) {
      if (markers[name] === marker) {
        delete markers[name];
        break;
      }
    }
  } else {
    name = marker;
    marker = markers[name];
    delete markers[name];
  }
  return marker || null;
}, getMarker:function(name) {
  return this.boundMarkers[name] || null;
}, preRender:function(surface, ctx, rect) {
  var me = this, id = me.getId(), boundMarkers = me.boundMarkers, parent = me.getParent(), name, marker, matrix;
  if (me.surfaceMatrix) {
    matrix = me.surfaceMatrix.set(1, 0, 0, 1, 0, 0);
  } else {
    matrix = me.surfaceMatrix = new Ext.draw.Matrix;
  }
  me.cleanRedraw = !me.attr.dirty;
  if (!me.cleanRedraw) {
    for (name in boundMarkers) {
      marker = boundMarkers[name];
      if (marker) {
        marker.clear(id);
      }
    }
  }
  while (parent && parent.attr && parent.attr.matrix) {
    matrix.prependMatrix(parent.attr.matrix);
    parent = parent.getParent();
  }
  matrix.prependMatrix(parent.matrix);
  me.surfaceMatrix = matrix;
  me.inverseSurfaceMatrix = matrix.inverse(me.inverseSurfaceMatrix);
}, putMarker:function(name, attr, index, bypassNormalization, keepRevision) {
  var marker = this.boundMarkers[name];
  if (marker) {
    marker.putMarkerFor(this.getId(), attr, index, bypassNormalization, keepRevision);
  }
}, getMarkerBBox:function(name, index, isWithoutTransform) {
  var marker = this.boundMarkers[name];
  if (marker) {
    return marker.getMarkerBBoxFor(this.getId(), index, isWithoutTransform);
  }
}, destroy:function() {
  var boundMarkers = this.boundMarkers, name, marker;
  for (name in boundMarkers) {
    marker = boundMarkers[name];
    marker.destroy();
  }
}});
Ext.define('Ext.chart.axis.sprite.Axis', {extend:'Ext.draw.sprite.Sprite', alias:'sprite.axis', type:'axis', mixins:{markerHolder:'Ext.chart.MarkerHolder'}, requires:['Ext.draw.sprite.Text'], inheritableStatics:{def:{processors:{grid:'bool', axisLine:'bool', minorTicks:'bool', minorTickSize:'number', majorTicks:'bool', majorTickSize:'number', length:'number', startGap:'number', endGap:'number', dataMin:'number', dataMax:'number', visibleMin:'number', visibleMax:'number', position:'enums(left,right,top,bottom,angular,radial,gauge)', 
minStepSize:'number', estStepSize:'number', titleOffset:'number', textPadding:'number', min:'number', max:'number', centerX:'number', centerY:'number', radius:'number', totalAngle:'number', baseRotation:'number', data:'default', enlargeEstStepSizeByText:'bool'}, defaults:{grid:false, axisLine:true, minorTicks:false, minorTickSize:3, majorTicks:true, majorTickSize:5, length:0, startGap:0, endGap:0, visibleMin:0, visibleMax:1, dataMin:0, dataMax:1, position:'', minStepSize:0, estStepSize:20, min:0, 
max:1, centerX:0, centerY:0, radius:1, baseRotation:0, data:null, titleOffset:0, textPadding:0, scalingCenterY:0, scalingCenterX:0, strokeStyle:'black', enlargeEstStepSizeByText:false}, triggers:{minorTickSize:'bbox', majorTickSize:'bbox', position:'bbox,layout', axisLine:'bbox,layout', minorTicks:'layout', min:'layout', max:'layout', length:'layout', minStepSize:'layout', estStepSize:'layout', data:'layout', dataMin:'layout', dataMax:'layout', visibleMin:'layout', visibleMax:'layout', enlargeEstStepSizeByText:'layout'}, 
updaters:{layout:'layoutUpdater'}}}, config:{label:null, labelOffset:10, layout:null, segmenter:null, renderer:null, layoutContext:null, axis:null}, thickness:0, stepSize:0, getBBox:function() {
  return null;
}, defaultRenderer:function(v) {
  return this.segmenter.renderer(v, this);
}, layoutUpdater:function() {
  var me = this, chart = me.getAxis().getChart();
  if (chart.isInitializing) {
    return;
  }
  var attr = me.attr, layout = me.getLayout(), isRtl = chart.getInherited().rtl, dataRange = attr.dataMax - attr.dataMin, min = attr.dataMin + dataRange * attr.visibleMin, max = attr.dataMin + dataRange * attr.visibleMax, range = max - min, position = attr.position, context = {attr:attr, segmenter:me.getSegmenter(), renderer:me.defaultRenderer};
  if (position === 'left' || position === 'right') {
    attr.translationX = 0;
    attr.translationY = max * attr.length / range;
    attr.scalingX = 1;
    attr.scalingY = -attr.length / range;
    attr.scalingCenterY = 0;
    attr.scalingCenterX = 0;
    me.applyTransformations(true);
  } else {
    if (position === 'top' || position === 'bottom') {
      if (isRtl) {
        attr.translationX = attr.length + min * attr.length / range + 1;
      } else {
        attr.translationX = -min * attr.length / range;
      }
      attr.translationY = 0;
      attr.scalingX = (isRtl ? -1 : 1) * attr.length / range;
      attr.scalingY = 1;
      attr.scalingCenterY = 0;
      attr.scalingCenterX = 0;
      me.applyTransformations(true);
    }
  }
  if (layout) {
    layout.calculateLayout(context);
    me.setLayoutContext(context);
  }
}, iterate:function(snaps, fn) {
  var i, position, id, axis, floatingAxes, floatingValues, some = Ext.Array.some, abs = Math.abs, threshold;
  if (snaps.getLabel) {
    if (snaps.min < snaps.from) {
      fn.call(this, snaps.min, snaps.getLabel(snaps.min), -1, snaps);
    }
    for (i = 0; i <= snaps.steps; i++) {
      fn.call(this, snaps.get(i), snaps.getLabel(i), i, snaps);
    }
    if (snaps.max > snaps.to) {
      fn.call(this, snaps.max, snaps.getLabel(snaps.max), snaps.steps + 1, snaps);
    }
  } else {
    var isTickVisible = function(position) {
      return !floatingValues.length || some(floatingValues, function(value) {
        return abs(value - position) > threshold;
      });
    };
    axis = this.getAxis();
    floatingAxes = axis.floatingAxes;
    floatingValues = [];
    threshold = (snaps.to - snaps.from) / (snaps.steps + 1);
    if (axis.getFloating()) {
      for (id in floatingAxes) {
        floatingValues.push(floatingAxes[id]);
      }
    }
    if (snaps.min < snaps.from && isTickVisible(snaps.min)) {
      fn.call(this, snaps.min, snaps.min, -1, snaps);
    }
    for (i = 0; i <= snaps.steps; i++) {
      position = snaps.get(i);
      if (isTickVisible(position)) {
        fn.call(this, position, position, i, snaps);
      }
    }
    if (snaps.max > snaps.to && isTickVisible(snaps.max)) {
      fn.call(this, snaps.max, snaps.max, snaps.steps + 1, snaps);
    }
  }
}, renderTicks:function(surface, ctx, layout, clipRect) {
  var me = this, attr = me.attr, docked = attr.position, matrix = attr.matrix, halfLineWidth = 0.5 * attr.lineWidth, xx = matrix.getXX(), dx = matrix.getDX(), yy = matrix.getYY(), dy = matrix.getDY(), majorTicks = layout.majorTicks, majorTickSize = attr.majorTickSize, minorTicks = layout.minorTicks, minorTickSize = attr.minorTickSize;
  if (majorTicks) {
    switch(docked) {
      case 'right':
        var getRightTickFn = function(size) {
          return function(position, labelText, i) {
            position = surface.roundPixel(position * yy + dy) + halfLineWidth;
            ctx.moveTo(0, position);
            ctx.lineTo(size, position);
          };
        };
        me.iterate(majorTicks, getRightTickFn(majorTickSize));
        minorTicks && me.iterate(minorTicks, getRightTickFn(minorTickSize));
        break;
      case 'left':
        var getLeftTickFn = function(size) {
          return function(position, labelText, i) {
            position = surface.roundPixel(position * yy + dy) + halfLineWidth;
            ctx.moveTo(clipRect[2] - size, position);
            ctx.lineTo(clipRect[2], position);
          };
        };
        me.iterate(majorTicks, getLeftTickFn(majorTickSize));
        minorTicks && me.iterate(minorTicks, getLeftTickFn(minorTickSize));
        break;
      case 'bottom':
        var getBottomTickFn = function(size) {
          return function(position, labelText, i) {
            position = surface.roundPixel(position * xx + dx) - halfLineWidth;
            ctx.moveTo(position, 0);
            ctx.lineTo(position, size);
          };
        };
        me.iterate(majorTicks, getBottomTickFn(majorTickSize));
        minorTicks && me.iterate(minorTicks, getBottomTickFn(minorTickSize));
        break;
      case 'top':
        var getTopTickFn = function(size) {
          return function(position, labelText, i) {
            position = surface.roundPixel(position * xx + dx) - halfLineWidth;
            ctx.moveTo(position, clipRect[3]);
            ctx.lineTo(position, clipRect[3] - size);
          };
        };
        me.iterate(majorTicks, getTopTickFn(majorTickSize));
        minorTicks && me.iterate(minorTicks, getTopTickFn(minorTickSize));
        break;
      case 'angular':
        me.iterate(majorTicks, function(position, labelText, i) {
          position = position / (attr.max + 1) * Math.PI * 2 + attr.baseRotation;
          ctx.moveTo(attr.centerX + attr.length * Math.cos(position), attr.centerY + attr.length * Math.sin(position));
          ctx.lineTo(attr.centerX + (attr.length + majorTickSize) * Math.cos(position), attr.centerY + (attr.length + majorTickSize) * Math.sin(position));
        });
        break;
      case 'gauge':
        var gaugeAngles = me.getGaugeAngles();
        me.iterate(majorTicks, function(position, labelText, i) {
          position = (position - attr.min) / (attr.max - attr.min) * attr.totalAngle - attr.totalAngle + gaugeAngles.start;
          ctx.moveTo(attr.centerX + attr.length * Math.cos(position), attr.centerY + attr.length * Math.sin(position));
          ctx.lineTo(attr.centerX + (attr.length + majorTickSize) * Math.cos(position), attr.centerY + (attr.length + majorTickSize) * Math.sin(position));
        });
        break;
    }
  }
}, renderLabels:function(surface, ctx, layoutContext, clipRect) {
  var me = this, attr = me.attr, halfLineWidth = 0.5 * attr.lineWidth, docked = attr.position, matrix = attr.matrix, textPadding = attr.textPadding, xx = matrix.getXX(), dx = matrix.getDX(), yy = matrix.getYY(), dy = matrix.getDY(), thickness = 0, majorTicks = layoutContext.majorTicks, tickPadding = Math.max(attr.majorTickSize, attr.minorTickSize) + attr.lineWidth, isBBoxIntersect = Ext.draw.Draw.isBBoxIntersect, label = me.getLabel(), font, labelOffset = me.getLabelOffset(), lastLabelText = null, 
  textSize = 0, textCount = 0, segmenter = layoutContext.segmenter, renderer = me.getRenderer(), axis = me.getAxis(), title = axis.getTitle(), titleBBox = title && title.attr.text !== '' && title.getBBox(), labelInverseMatrix, lastBBox = null, bbox, fly, text, titlePadding, translation, gaugeAngles;
  if (majorTicks && label && !label.attr.hidden) {
    font = label.attr.font;
    if (ctx.font !== font) {
      ctx.font = font;
    }
    label.setAttributes({translationX:0, translationY:0}, true);
    label.applyTransformations();
    labelInverseMatrix = label.attr.inverseMatrix.elements.slice(0);
    switch(docked) {
      case 'left':
        titlePadding = titleBBox ? titleBBox.x + titleBBox.width : 0;
        switch(label.attr.textAlign) {
          case 'start':
            translation = surface.roundPixel(titlePadding + dx) - halfLineWidth;
            break;
          case 'end':
            translation = surface.roundPixel(clipRect[2] - tickPadding + dx) - halfLineWidth;
            break;
          default:
            translation = surface.roundPixel(titlePadding + (clipRect[2] - titlePadding - tickPadding) / 2 + dx) - halfLineWidth;
        }label.setAttributes({translationX:translation}, true);
        break;
      case 'right':
        titlePadding = titleBBox ? clipRect[2] - titleBBox.x : 0;
        switch(label.attr.textAlign) {
          case 'start':
            translation = surface.roundPixel(tickPadding + dx) + halfLineWidth;
            break;
          case 'end':
            translation = surface.roundPixel(clipRect[2] - titlePadding + dx) + halfLineWidth;
            break;
          default:
            translation = surface.roundPixel(tickPadding + (clipRect[2] - tickPadding - titlePadding) / 2 + dx) + halfLineWidth;
        }label.setAttributes({translationX:translation}, true);
        break;
      case 'top':
        titlePadding = titleBBox ? titleBBox.y + titleBBox.height : 0;
        label.setAttributes({translationY:surface.roundPixel(titlePadding + (clipRect[3] - titlePadding - tickPadding) / 2) - halfLineWidth}, true);
        break;
      case 'bottom':
        titlePadding = titleBBox ? clipRect[3] - titleBBox.y : 0;
        label.setAttributes({translationY:surface.roundPixel(tickPadding + (clipRect[3] - tickPadding - titlePadding) / 2) + halfLineWidth}, true);
        break;
      case 'radial':
        label.setAttributes({translationX:attr.centerX}, true);
        break;
      case 'angular':
        label.setAttributes({translationY:attr.centerY}, true);
        break;
      case 'gauge':
        label.setAttributes({translationY:attr.centerY}, true);
        break;
    }
    if (docked === 'left' || docked === 'right') {
      me.iterate(majorTicks, function(position, labelText, i) {
        if (labelText === undefined) {
          return;
        }
        if (renderer) {
          text = Ext.callback(renderer, null, [axis, labelText, layoutContext, lastLabelText], 0, axis);
        } else {
          text = segmenter.renderer(labelText, layoutContext, lastLabelText);
        }
        lastLabelText = labelText;
        label.setAttributes({text:String(text), translationY:surface.roundPixel(position * yy + dy)}, true);
        label.applyTransformations();
        thickness = Math.max(thickness, label.getBBox().width + tickPadding);
        fly = Ext.draw.Matrix.fly(label.attr.matrix.elements.slice(0));
        bbox = fly.prepend.apply(fly, labelInverseMatrix).transformBBox(label.getBBox(true));
        if (lastBBox && !isBBoxIntersect(bbox, lastBBox, textPadding)) {
          return;
        }
        surface.renderSprite(label);
        lastBBox = bbox;
        textSize += bbox.height;
        textCount++;
      });
    } else {
      if (docked === 'top' || docked === 'bottom') {
        me.iterate(majorTicks, function(position, labelText, i) {
          if (labelText === undefined) {
            return;
          }
          if (renderer) {
            text = Ext.callback(renderer, null, [axis, labelText, layoutContext, lastLabelText], 0, axis);
          } else {
            text = segmenter.renderer(labelText, layoutContext, lastLabelText);
          }
          lastLabelText = labelText;
          label.setAttributes({text:String(text), translationX:surface.roundPixel(position * xx + dx)}, true);
          label.applyTransformations();
          thickness = Math.max(thickness, label.getBBox().height + tickPadding);
          fly = Ext.draw.Matrix.fly(label.attr.matrix.elements.slice(0));
          bbox = fly.prepend.apply(fly, labelInverseMatrix).transformBBox(label.getBBox(true));
          if (lastBBox && !isBBoxIntersect(bbox, lastBBox, textPadding)) {
            return;
          }
          surface.renderSprite(label);
          lastBBox = bbox;
          textSize += bbox.width;
          textCount++;
        });
      } else {
        if (docked === 'radial') {
          me.iterate(majorTicks, function(position, labelText, i) {
            if (labelText === undefined) {
              return;
            }
            if (renderer) {
              text = Ext.callback(renderer, null, [axis, labelText, layoutContext, lastLabelText], 0, axis);
            } else {
              text = segmenter.renderer(labelText, layoutContext, lastLabelText);
            }
            lastLabelText = labelText;
            if (typeof text !== 'undefined') {
              label.setAttributes({text:String(text), translationX:attr.centerX - surface.roundPixel(position) / attr.max * attr.length * Math.cos(attr.baseRotation + Math.PI / 2), translationY:attr.centerY - surface.roundPixel(position) / attr.max * attr.length * Math.sin(attr.baseRotation + Math.PI / 2)}, true);
              label.applyTransformations();
              bbox = label.attr.matrix.transformBBox(label.getBBox(true));
              if (lastBBox && !isBBoxIntersect(bbox, lastBBox)) {
                return;
              }
              surface.renderSprite(label);
              lastBBox = bbox;
              textSize += bbox.width;
              textCount++;
            }
          });
        } else {
          if (docked === 'angular') {
            labelOffset += attr.majorTickSize + attr.lineWidth * 0.5;
            me.iterate(majorTicks, function(position, labelText, i) {
              if (labelText === undefined) {
                return;
              }
              if (renderer) {
                text = Ext.callback(renderer, null, [axis, labelText, layoutContext, lastLabelText], 0, axis);
              } else {
                text = segmenter.renderer(labelText, layoutContext, lastLabelText);
              }
              lastLabelText = labelText;
              thickness = Math.max(thickness, Math.max(attr.majorTickSize, attr.minorTickSize) + (attr.lineCap !== 'butt' ? attr.lineWidth * 0.5 : 0));
              if (typeof text !== 'undefined') {
                var angle = position / (attr.max + 1) * Math.PI * 2 + attr.baseRotation;
                label.setAttributes({text:String(text), translationX:attr.centerX + (attr.length + labelOffset) * Math.cos(angle), translationY:attr.centerY + (attr.length + labelOffset) * Math.sin(angle)}, true);
                label.applyTransformations();
                bbox = label.attr.matrix.transformBBox(label.getBBox(true));
                if (lastBBox && !isBBoxIntersect(bbox, lastBBox)) {
                  return;
                }
                surface.renderSprite(label);
                lastBBox = bbox;
                textSize += bbox.width;
                textCount++;
              }
            });
          } else {
            if (docked === 'gauge') {
              gaugeAngles = me.getGaugeAngles();
              labelOffset += attr.majorTickSize + attr.lineWidth * 0.5;
              me.iterate(majorTicks, function(position, labelText, i) {
                if (labelText === undefined) {
                  return;
                }
                if (renderer) {
                  text = Ext.callback(renderer, null, [axis, labelText, layoutContext, lastLabelText], 0, axis);
                } else {
                  text = segmenter.renderer(labelText, layoutContext, lastLabelText);
                }
                lastLabelText = labelText;
                if (typeof text !== 'undefined') {
                  var angle = (position - attr.min) / (attr.max - attr.min) * attr.totalAngle - attr.totalAngle + gaugeAngles.start;
                  label.setAttributes({text:String(text), translationX:attr.centerX + (attr.length + labelOffset) * Math.cos(angle), translationY:attr.centerY + (attr.length + labelOffset) * Math.sin(angle)}, true);
                  label.applyTransformations();
                  bbox = label.attr.matrix.transformBBox(label.getBBox(true));
                  if (lastBBox && !isBBoxIntersect(bbox, lastBBox)) {
                    return;
                  }
                  surface.renderSprite(label);
                  lastBBox = bbox;
                  textSize += bbox.width;
                  textCount++;
                }
              });
            }
          }
        }
      }
    }
    if (attr.enlargeEstStepSizeByText && textCount) {
      textSize /= textCount;
      textSize += tickPadding;
      textSize *= 2;
      if (attr.estStepSize < textSize) {
        attr.estStepSize = textSize;
      }
    }
    if (Math.abs(me.thickness - thickness) > 1) {
      me.thickness = thickness;
      attr.bbox.plain.dirty = true;
      attr.bbox.transform.dirty = true;
      me.doThicknessChanged();
      return false;
    }
  }
}, renderAxisLine:function(surface, ctx, layout, clipRect) {
  var me = this, attr = me.attr, halfLineWidth = attr.lineWidth * 0.5, docked = attr.position, position, gaugeAngles;
  if (attr.axisLine && attr.length) {
    switch(docked) {
      case 'left':
        position = surface.roundPixel(clipRect[2]) - halfLineWidth;
        ctx.moveTo(position, -attr.endGap);
        ctx.lineTo(position, attr.length + attr.startGap + 1);
        break;
      case 'right':
        ctx.moveTo(halfLineWidth, -attr.endGap);
        ctx.lineTo(halfLineWidth, attr.length + attr.startGap + 1);
        break;
      case 'bottom':
        ctx.moveTo(-attr.startGap, halfLineWidth);
        ctx.lineTo(attr.length + attr.endGap, halfLineWidth);
        break;
      case 'top':
        position = surface.roundPixel(clipRect[3]) - halfLineWidth;
        ctx.moveTo(-attr.startGap, position);
        ctx.lineTo(attr.length + attr.endGap, position);
        break;
      case 'angular':
        ctx.moveTo(attr.centerX + attr.length, attr.centerY);
        ctx.arc(attr.centerX, attr.centerY, attr.length, 0, Math.PI * 2, true);
        break;
      case 'gauge':
        gaugeAngles = me.getGaugeAngles();
        ctx.moveTo(attr.centerX + Math.cos(gaugeAngles.start) * attr.length, attr.centerY + Math.sin(gaugeAngles.start) * attr.length);
        ctx.arc(attr.centerX, attr.centerY, attr.length, gaugeAngles.start, gaugeAngles.end, true);
        break;
    }
  }
}, getGaugeAngles:function() {
  var me = this, angle = me.attr.totalAngle, offset;
  if (angle <= Math.PI) {
    offset = (Math.PI - angle) * 0.5;
  } else {
    offset = -(Math.PI * 2 - angle) * 0.5;
  }
  offset = Math.PI * 2 - offset;
  return {start:offset, end:offset - angle};
}, renderGridLines:function(surface, ctx, layout, clipRect) {
  var me = this, axis = me.getAxis(), attr = me.attr, matrix = attr.matrix, startGap = attr.startGap, endGap = attr.endGap, xx = matrix.getXX(), yy = matrix.getYY(), dx = matrix.getDX(), dy = matrix.getDY(), position = attr.position, alignment = axis.getGridAlignment(), majorTicks = layout.majorTicks, anchor, j, lastAnchor;
  if (attr.grid) {
    if (majorTicks) {
      if (position === 'left' || position === 'right') {
        lastAnchor = attr.min * yy + dy + endGap + startGap;
        me.iterate(majorTicks, function(position, labelText, i) {
          anchor = position * yy + dy + endGap;
          me.putMarker(alignment + '-' + (i % 2 ? 'odd' : 'even'), {y:anchor, height:lastAnchor - anchor}, j = i, true);
          lastAnchor = anchor;
        });
        j++;
        anchor = 0;
        me.putMarker(alignment + '-' + (j % 2 ? 'odd' : 'even'), {y:anchor, height:lastAnchor - anchor}, j, true);
      } else {
        if (position === 'top' || position === 'bottom') {
          lastAnchor = attr.min * xx + dx + startGap;
          if (startGap) {
            me.putMarker(alignment + '-even', {x:0, width:lastAnchor}, -1, true);
          }
          me.iterate(majorTicks, function(position, labelText, i) {
            anchor = position * xx + dx + startGap;
            me.putMarker(alignment + '-' + (i % 2 ? 'odd' : 'even'), {x:anchor, width:lastAnchor - anchor}, j = i, true);
            lastAnchor = anchor;
          });
          j++;
          anchor = attr.length + attr.startGap + attr.endGap;
          me.putMarker(alignment + '-' + (j % 2 ? 'odd' : 'even'), {x:anchor, width:lastAnchor - anchor}, j, true);
        } else {
          if (position === 'radial') {
            me.iterate(majorTicks, function(position, labelText, i) {
              if (!position) {
                return;
              }
              anchor = position / attr.max * attr.length;
              me.putMarker(alignment + '-' + (i % 2 ? 'odd' : 'even'), {scalingX:anchor, scalingY:anchor}, i, true);
              lastAnchor = anchor;
            });
          } else {
            if (position === 'angular') {
              me.iterate(majorTicks, function(position, labelText, i) {
                if (!attr.length) {
                  return;
                }
                anchor = position / (attr.max + 1) * Math.PI * 2 + attr.baseRotation;
                me.putMarker(alignment + '-' + (i % 2 ? 'odd' : 'even'), {rotationRads:anchor, rotationCenterX:0, rotationCenterY:0, scalingX:attr.length, scalingY:attr.length}, i, true);
                lastAnchor = anchor;
              });
            }
          }
        }
      }
    }
  }
}, renderLimits:function(clipRect) {
  var me = this, attr = me.attr, axis = me.getAxis(), limits = Ext.Array.from(axis.getLimits());
  if (!limits.length || attr.dataMin === attr.dataMax) {
    if (axis.limits) {
      axis.limits.titles.attr.hidden = true;
    }
    return;
  }
  var chart = axis.getChart(), innerPadding = chart.getInnerPadding(), limitsRect = axis.limits.surface.getRect(), matrix = attr.matrix, position = attr.position, chain = Ext.Object.chain, titles = axis.limits.titles, titleBBox, titlePosition, titleFlip, limit, value, i, ln, x, y;
  titles.attr.hidden = false;
  titles.instances = [];
  titles.position = 0;
  if (position === 'left' || position === 'right') {
    for (i = 0, ln = limits.length; i < ln; i++) {
      limit = chain(limits[i]);
      !limit.line && (limit.line = {});
      value = Ext.isString(limit.value) ? axis.getCoordFor(limit.value) : limit.value;
      value = value * matrix.getYY() + matrix.getDY();
      limit.line.y = value + innerPadding.top;
      limit.line.strokeStyle = limit.line.strokeStyle || attr.strokeStyle;
      me.putMarker('horizontal-limit-lines', limit.line, i, true);
      if (limit.line.title) {
        titles.add(limit.line.title);
        titleBBox = titles.getBBoxFor(titles.position - 1);
        titlePosition = limit.line.title.position || (position === 'left' ? 'start' : 'end');
        switch(titlePosition) {
          case 'start':
            x = 10;
            break;
          case 'end':
            x = limitsRect[2] - 10;
            break;
          case 'middle':
            x = limitsRect[2] / 2;
            break;
        }
        titles.setAttributesFor(titles.position - 1, {x:x, y:limit.line.y - titleBBox.height / 2, textAlign:titlePosition, fillStyle:limit.line.title.fillStyle || limit.line.strokeStyle});
      }
    }
  } else {
    if (position === 'top' || position === 'bottom') {
      for (i = 0, ln = limits.length; i < ln; i++) {
        limit = chain(limits[i]);
        !limit.line && (limit.line = {});
        value = Ext.isString(limit.value) ? axis.getCoordFor(limit.value) : limit.value;
        value = value * matrix.getXX() + matrix.getDX();
        limit.line.x = value + innerPadding.left;
        limit.line.strokeStyle = limit.line.strokeStyle || attr.strokeStyle;
        me.putMarker('vertical-limit-lines', limit.line, i, true);
        if (limit.line.title) {
          titles.add(limit.line.title);
          titleBBox = titles.getBBoxFor(titles.position - 1);
          titlePosition = limit.line.title.position || (position === 'top' ? 'end' : 'start');
          switch(titlePosition) {
            case 'start':
              y = limitsRect[3] - titleBBox.width / 2 - 10;
              break;
            case 'end':
              y = titleBBox.width / 2 + 10;
              break;
            case 'middle':
              y = limitsRect[3] / 2;
              break;
          }
          titles.setAttributesFor(titles.position - 1, {x:limit.line.x + titleBBox.height / 2, y:y, fillStyle:limit.line.title.fillStyle || limit.line.strokeStyle, rotationRads:Math.PI / 2});
        }
      }
    } else {
      if (position === 'radial') {
        for (i = 0, ln = limits.length; i < ln; i++) {
          limit = chain(limits[i]);
          !limit.line && (limit.line = {});
          value = Ext.isString(limit.value) ? axis.getCoordFor(limit.value) : limit.value;
          if (value > attr.max) {
            continue;
          }
          value = value / attr.max * attr.length;
          limit.line.cx = attr.centerX;
          limit.line.cy = attr.centerY;
          limit.line.scalingX = value;
          limit.line.scalingY = value;
          limit.line.strokeStyle = limit.line.strokeStyle || attr.strokeStyle;
          me.putMarker('circular-limit-lines', limit.line, i, true);
          if (limit.line.title) {
            titles.add(limit.line.title);
            titleBBox = titles.getBBoxFor(titles.position - 1);
            titles.setAttributesFor(titles.position - 1, {x:attr.centerX, y:attr.centerY - value - titleBBox.height / 2, fillStyle:limit.line.title.fillStyle || limit.line.strokeStyle});
          }
        }
      } else {
        if (position === 'angular') {
          for (i = 0, ln = limits.length; i < ln; i++) {
            limit = chain(limits[i]);
            !limit.line && (limit.line = {});
            value = Ext.isString(limit.value) ? axis.getCoordFor(limit.value) : limit.value;
            value = value / (attr.max + 1) * Math.PI * 2 + attr.baseRotation;
            limit.line.translationX = attr.centerX;
            limit.line.translationY = attr.centerY;
            limit.line.rotationRads = value;
            limit.line.rotationCenterX = 0;
            limit.line.rotationCenterY = 0;
            limit.line.scalingX = attr.length;
            limit.line.scalingY = attr.length;
            limit.line.strokeStyle = limit.line.strokeStyle || attr.strokeStyle;
            me.putMarker('radial-limit-lines', limit.line, i, true);
            if (limit.line.title) {
              titles.add(limit.line.title);
              titleBBox = titles.getBBoxFor(titles.position - 1);
              titleFlip = value > -0.5 * Math.PI && value < 0.5 * Math.PI || value > 1.5 * Math.PI && value < 2 * Math.PI ? 1 : -1;
              titles.setAttributesFor(titles.position - 1, {x:attr.centerX + 0.5 * attr.length * Math.cos(value) + titleFlip * titleBBox.height / 2 * Math.sin(value), y:attr.centerY + 0.5 * attr.length * Math.sin(value) - titleFlip * titleBBox.height / 2 * Math.cos(value), rotationRads:titleFlip === 1 ? value : value - Math.PI, fillStyle:limit.line.title.fillStyle || limit.line.strokeStyle});
            }
          }
        } else {
          if (position === 'gauge') {
          }
        }
      }
    }
  }
}, doThicknessChanged:function() {
  var axis = this.getAxis();
  if (axis) {
    axis.onThicknessChanged();
  }
}, render:function(surface, ctx, rect) {
  var me = this, layoutContext = me.getLayoutContext();
  if (layoutContext) {
    if (false === me.renderLabels(surface, ctx, layoutContext, rect)) {
      return false;
    }
    ctx.beginPath();
    me.renderTicks(surface, ctx, layoutContext, rect);
    me.renderAxisLine(surface, ctx, layoutContext, rect);
    me.renderGridLines(surface, ctx, layoutContext, rect);
    me.renderLimits(rect);
    ctx.stroke();
  }
}});
Ext.define('Ext.chart.axis.segmenter.Segmenter', {config:{axis:null}, constructor:function(config) {
  this.initConfig(config);
}, renderer:function(value, context) {
  return String(value);
}, from:function(value) {
  return value;
}, diff:Ext.emptyFn, align:Ext.emptyFn, add:Ext.emptyFn, preferredStep:Ext.emptyFn});
Ext.define('Ext.chart.axis.segmenter.Names', {extend:'Ext.chart.axis.segmenter.Segmenter', alias:'segmenter.names', renderer:function(value, context) {
  return value;
}, diff:function(min, max, unit) {
  return Math.floor(max - min);
}, align:function(value, step, unit) {
  return Math.floor(value);
}, add:function(value, step, unit) {
  return value + step;
}, preferredStep:function(min, estStepSize, minIdx, data) {
  return {unit:1, step:1};
}});
Ext.define('Ext.chart.axis.segmenter.Numeric', {extend:'Ext.chart.axis.segmenter.Segmenter', alias:'segmenter.numeric', isNumeric:true, renderer:function(value, context) {
  return value.toFixed(Math.max(0, context.majorTicks.unit.fixes));
}, diff:function(min, max, unit) {
  return Math.floor((max - min) / unit.scale);
}, align:function(value, step, unit) {
  var scaledStep = unit.scale * step;
  return Math.floor(value / scaledStep) * scaledStep;
}, add:function(value, step, unit) {
  return value + step * unit.scale;
}, preferredStep:function(min, estStepSize) {
  var order = Math.floor(Math.log(estStepSize) * Math.LOG10E), scale = Math.pow(10, order);
  estStepSize /= scale;
  if (estStepSize < 2) {
    estStepSize = 2;
  } else {
    if (estStepSize < 5) {
      estStepSize = 5;
    } else {
      if (estStepSize < 10) {
        estStepSize = 10;
        order++;
      }
    }
  }
  return {unit:{fixes:-order, scale:scale}, step:estStepSize};
}, leadingZeros:function(n) {
  return -Math.floor(Ext.Number.log10(Math.abs(n)));
}, exactStep:function(min, estStepSize) {
  var stepZeros = this.leadingZeros(estStepSize), scale = Math.pow(10, stepZeros);
  return {unit:{fixes:stepZeros + (estStepSize % scale === 0 ? 0 : 1), scale:estStepSize < 1 ? estStepSize : 1}, step:estStepSize < 1 ? 1 : estStepSize};
}, adjustByMajorUnit:function(step, scale, range) {
  var min = range[0], max = range[1], increment = step * scale, remainder, multiplier;
  multiplier = Math.max(1 / (min || 1), 1 / (increment || 1));
  multiplier = multiplier > 1 ? multiplier : 1;
  remainder = min * multiplier % (increment * multiplier) / multiplier;
  if (remainder !== 0) {
    range[0] = min - remainder + (min < 0 ? -increment : 0);
  }
  multiplier = Math.max(1 / (max || 1), 1 / (increment || 1));
  multiplier = multiplier > 1 ? multiplier : 1;
  remainder = max * multiplier % (increment * multiplier) / multiplier;
  if (remainder !== 0) {
    range[1] = max - remainder + (max > 0 ? increment : 0);
  }
}});
Ext.define('Ext.chart.axis.segmenter.Time', {extend:'Ext.chart.axis.segmenter.Segmenter', alias:'segmenter.time', config:{step:null}, renderer:function(value, context) {
  var ExtDate = Ext.Date;
  switch(context.majorTicks.unit) {
    case 'y':
      return ExtDate.format(value, 'Y');
    case 'mo':
      return ExtDate.format(value, 'Y-m');
    case 'd':
      return ExtDate.format(value, 'Y-m-d');
  }
  return ExtDate.format(value, 'Y-m-d\nH:i:s');
}, from:function(value) {
  return new Date(value);
}, diff:function(min, max, unit) {
  if (isFinite(min)) {
    min = new Date(min);
  }
  if (isFinite(max)) {
    max = new Date(max);
  }
  return Ext.Date.diff(min, max, unit);
}, updateStep:function() {
  var axis = this.getAxis();
  if (axis && !this.isConfiguring) {
    axis.performLayout();
  }
}, align:function(date, step, unit) {
  if (unit === 'd' && step >= 7) {
    date = Ext.Date.align(date, 'd', step);
    date.setDate(date.getDate() - date.getDay() + 1);
    return date;
  } else {
    return Ext.Date.align(date, unit, step);
  }
}, add:function(value, step, unit) {
  return Ext.Date.add(new Date(value), unit, step);
}, timeBuckets:[{unit:Ext.Date.YEAR, steps:[1, 2, 5, 10, 20, 50, 100, 200, 500]}, {unit:Ext.Date.MONTH, steps:[1, 3, 6]}, {unit:Ext.Date.DAY, steps:[1, 7, 14]}, {unit:Ext.Date.HOUR, steps:[1, 6, 12]}, {unit:Ext.Date.MINUTE, steps:[1, 5, 15, 30]}, {unit:Ext.Date.SECOND, steps:[1, 5, 15, 30]}, {unit:Ext.Date.MILLI, steps:[1, 2, 5, 10, 20, 50, 100, 200, 500]}], getTimeBucket:function(min, max) {
  var buckets = this.timeBuckets, unit, unitCount, steps, step, result, i, j;
  for (i = 0; i < buckets.length; i++) {
    unit = buckets[i].unit;
    unitCount = this.diff(min, max, unit);
    if (unitCount > 0) {
      steps = buckets[i].steps;
      for (j = 0; j < steps.length; j++) {
        step = steps[j];
        if (unitCount <= step) {
          break;
        }
      }
      result = {unit:unit, step:step};
      break;
    }
  }
  if (!result) {
    result = {unit:Ext.Date.MILLI, step:1};
  }
  return result;
}, preferredStep:function(min, estStepSize) {
  var step = this.getStep();
  return step ? step : this.getTimeBucket(new Date(+min), new Date(+min + Math.ceil(estStepSize)));
}});
Ext.define('Ext.chart.axis.layout.Layout', {mixins:{observable:'Ext.mixin.Observable'}, config:{axis:null}, constructor:function(config) {
  this.mixins.observable.constructor.call(this, config);
}, processData:function(series) {
  var me = this, axis = me.getAxis(), direction = axis.getDirection(), boundSeries = axis.boundSeries, i, ln;
  if (series) {
    series['coordinate' + direction]();
  } else {
    for (i = 0, ln = boundSeries.length; i < ln; i++) {
      boundSeries[i]['coordinate' + direction]();
    }
  }
}, calculateMajorTicks:function(context) {
  var me = this, attr = context.attr, range = attr.max - attr.min, zoom = range / Math.max(1, attr.length) * (attr.visibleMax - attr.visibleMin), viewMin = attr.min + range * attr.visibleMin, viewMax = attr.min + range * attr.visibleMax, estStepSize = attr.estStepSize * zoom, majorTicks = me.snapEnds(context, attr.min, attr.max, estStepSize);
  if (majorTicks) {
    me.trimByRange(context, majorTicks, viewMin, viewMax);
    context.majorTicks = majorTicks;
  }
}, calculateMinorTicks:function(context) {
  if (this.snapMinorEnds) {
    context.minorTicks = this.snapMinorEnds(context);
  }
}, calculateLayout:function(context) {
  var me = this, attr = context.attr;
  if (attr.length === 0) {
    return null;
  }
  if (attr.majorTicks) {
    me.calculateMajorTicks(context);
    if (attr.minorTicks) {
      me.calculateMinorTicks(context);
    }
  }
}, snapEnds:Ext.emptyFn, trimByRange:function(context, ticks, trimMin, trimMax) {
  var segmenter = context.segmenter, unit = ticks.unit, beginIdx = segmenter.diff(ticks.from, trimMin, unit), endIdx = segmenter.diff(ticks.from, trimMax, unit), begin = Math.max(0, Math.ceil(beginIdx / ticks.step)), end = Math.min(ticks.steps, Math.floor(endIdx / ticks.step));
  if (end < ticks.steps) {
    ticks.to = segmenter.add(ticks.from, end * ticks.step, unit);
  }
  if (ticks.max > trimMax) {
    ticks.max = ticks.to;
  }
  if (ticks.from < trimMin) {
    ticks.from = segmenter.add(ticks.from, begin * ticks.step, unit);
    while (ticks.from < trimMin) {
      begin++;
      ticks.from = segmenter.add(ticks.from, ticks.step, unit);
    }
  }
  if (ticks.min < trimMin) {
    ticks.min = ticks.from;
  }
  ticks.steps = end - begin;
}});
Ext.define('Ext.chart.axis.layout.Discrete', {extend:'Ext.chart.axis.layout.Layout', alias:'axisLayout.discrete', isDiscrete:true, processData:function() {
  var me = this, axis = me.getAxis(), seriesList = axis.boundSeries, direction = axis.getDirection(), i, ln, series;
  me.labels = [];
  me.labelMap = {};
  for (i = 0, ln = seriesList.length; i < ln; i++) {
    series = seriesList[i];
    if (series['get' + direction + 'Axis']() === axis) {
      series['coordinate' + direction]();
    }
  }
  axis.getSprites()[0].setAttributes({data:me.labels});
  me.fireEvent('datachange', me.labels);
}, calculateLayout:function(context) {
  context.data = this.labels;
  this.callParent([context]);
}, calculateMajorTicks:function(context) {
  var me = this, attr = context.attr, data = context.data, range = attr.max - attr.min, viewMin = attr.min + range * attr.visibleMin, viewMax = attr.min + range * attr.visibleMax, out;
  out = me.snapEnds(context, Math.max(0, attr.min), Math.min(attr.max, data.length - 1), 1);
  if (out) {
    me.trimByRange(context, out, viewMin, viewMax);
    context.majorTicks = out;
  }
}, snapEnds:function(context, min, max, estStepSize) {
  estStepSize = Math.ceil(estStepSize);
  var steps = Math.floor((max - min) / estStepSize), data = context.data;
  return {min:min, max:max, from:min, to:steps * estStepSize + min, step:estStepSize, steps:steps, unit:1, getLabel:function(currentStep) {
    return data[this.from + this.step * currentStep];
  }, get:function(currentStep) {
    return this.from + this.step * currentStep;
  }};
}, trimByRange:function(context, out, trimMin, trimMax) {
  var unit = out.unit, beginIdx = Math.ceil((trimMin - out.from) / unit) * unit, endIdx = Math.floor((trimMax - out.from) / unit) * unit, begin = Math.max(0, Math.ceil(beginIdx / out.step)), end = Math.min(out.steps, Math.floor(endIdx / out.step));
  if (end < out.steps) {
    out.to = end;
  }
  if (out.max > trimMax) {
    out.max = out.to;
  }
  if (out.from < trimMin && out.step > 0) {
    out.from = out.from + begin * out.step * unit;
    while (out.from < trimMin) {
      begin++;
      out.from += out.step * unit;
    }
  }
  if (out.min < trimMin) {
    out.min = out.from;
  }
  out.steps = end - begin;
}, getCoordFor:function(value, field, idx, items) {
  this.labels.push(value);
  return this.labels.length - 1;
}});
Ext.define('Ext.chart.axis.layout.CombineByIndex', {extend:'Ext.chart.axis.layout.Discrete', alias:'axisLayout.combineByIndex', getCoordFor:function(value, field, idx, items) {
  var labels = this.labels, result = idx;
  if (labels[idx] !== value) {
    result = labels.push(value) - 1;
  }
  return result;
}});
Ext.define('Ext.chart.axis.layout.CombineDuplicate', {extend:'Ext.chart.axis.layout.Discrete', alias:'axisLayout.combineDuplicate', getCoordFor:function(value, field, idx, items) {
  if (!(value in this.labelMap)) {
    var result = this.labelMap[value] = this.labels.length;
    this.labels.push(value);
    return result;
  }
  return this.labelMap[value];
}});
Ext.define('Ext.chart.axis.layout.Continuous', {extend:'Ext.chart.axis.layout.Layout', alias:'axisLayout.continuous', isContinuous:true, config:{adjustMinimumByMajorUnit:false, adjustMaximumByMajorUnit:false}, getCoordFor:function(value, field, idx, items) {
  return +value;
}, snapEnds:function(context, min, max, estStepSize) {
  var segmenter = context.segmenter, axis = this.getAxis(), noAnimation = !axis.spriteAnimationCount, majorTickSteps = axis.getMajorTickSteps(), bucket = majorTickSteps && segmenter.exactStep ? segmenter.exactStep(min, (max - min) / majorTickSteps) : segmenter.preferredStep(min, estStepSize), unit = bucket.unit, step = bucket.step, diffSteps = segmenter.diff(min, max, unit), steps = (majorTickSteps || diffSteps) + 1, from;
  if (majorTickSteps || noAnimation && +segmenter.add(min, diffSteps, unit) === max) {
    from = min;
  } else {
    from = segmenter.align(min, step, unit);
  }
  return {min:segmenter.from(min), max:segmenter.from(max), from:from, to:segmenter.add(from, steps, unit), step:step, steps:steps, unit:unit, get:function(currentStep) {
    return segmenter.add(this.from, this.step * currentStep, this.unit);
  }};
}, snapMinorEnds:function(context) {
  var majorTicks = context.majorTicks, minorTickSteps = this.getAxis().getMinorTickSteps(), segmenter = context.segmenter, min = majorTicks.min, max = majorTicks.max, from = majorTicks.from, unit = majorTicks.unit, step = majorTicks.step / minorTickSteps, scaledStep = step * unit.scale, fromMargin = from - min, offset = Math.floor(fromMargin / scaledStep), extraSteps = offset + Math.floor((max - majorTicks.to) / scaledStep) + 1, steps = majorTicks.steps * minorTickSteps + extraSteps;
  return {min:min, max:max, from:min + fromMargin % scaledStep, to:segmenter.add(from, steps * step, unit), step:step, steps:steps, unit:unit, get:function(current) {
    return current % minorTickSteps + offset + 1 !== 0 ? segmenter.add(this.from, this.step * current, unit) : null;
  }};
}});
Ext.define('Ext.chart.axis.Axis', {xtype:'axis', mixins:{observable:'Ext.mixin.Observable'}, requires:['Ext.chart.axis.sprite.Axis', 'Ext.chart.axis.segmenter.*', 'Ext.chart.axis.layout.*', 'Ext.chart.Util'], isAxis:true, config:{position:'bottom', fields:[], label:undefined, grid:false, limits:null, renderer:null, chart:null, style:null, margin:0, titleMargin:4, background:null, minimum:NaN, maximum:NaN, reconcileRange:false, minZoom:1, maxZoom:10000, layout:'continuous', segmenter:'numeric', hidden:false, 
majorTickSteps:0, minorTickSteps:0, adjustByMajorUnit:true, title:null, expandRangeBy:0, length:0, center:null, radius:null, totalAngle:Math.PI, rotation:null, visibleRange:[0, 1], needHighPrecision:false, linkedTo:null, floating:null}, titleOffset:0, spriteAnimationCount:0, boundSeries:[], sprites:null, surface:null, range:null, defaultRange:[0, 1], rangePadding:0.5, xValues:[], yValues:[], masterAxis:null, applyRotation:function(rotation) {
  var twoPie = Math.PI * 2;
  return (rotation % twoPie + Math.PI) % twoPie - Math.PI;
}, updateRotation:function(rotation) {
  var sprites = this.getSprites(), position = this.getPosition();
  if (!this.getHidden() && position === 'angular' && sprites[0]) {
    sprites[0].setAttributes({baseRotation:rotation});
  }
}, applyTitle:function(title, oldTitle) {
  var surface;
  if (Ext.isString(title)) {
    title = {text:title};
  }
  if (!oldTitle) {
    oldTitle = Ext.create('sprite.text', title);
    if (surface = this.getSurface()) {
      surface.add(oldTitle);
    }
  } else {
    oldTitle.setAttributes(title);
  }
  return oldTitle;
}, applyFloating:function(floating, oldFloating) {
  if (floating === null) {
    floating = {value:null, alongAxis:null};
  } else {
    if (Ext.isNumber(floating)) {
      floating = {value:floating, alongAxis:null};
    }
  }
  if (Ext.isObject(floating)) {
    if (oldFloating && oldFloating.alongAxis) {
      delete this.getChart().getAxis(oldFloating.alongAxis).floatingAxes[this.getId()];
    }
    return floating;
  }
  return oldFloating;
}, constructor:function(config) {
  var me = this, id;
  me.sprites = [];
  me.labels = [];
  me.floatingAxes = {};
  config = config || {};
  if (config.position === 'angular') {
    config.style = config.style || {};
    config.style.estStepSize = 1;
  }
  if ('id' in config) {
    id = config.id;
  } else {
    if ('id' in me.config) {
      id = me.config.id;
    } else {
      id = me.getId();
    }
  }
  me.setId(id);
  me.mixins.observable.constructor.apply(me, arguments);
}, getAlignment:function() {
  switch(this.getPosition()) {
    case 'left':
    case 'right':
      return 'vertical';
    case 'top':
    case 'bottom':
      return 'horizontal';
    case 'radial':
      return 'radial';
    case 'angular':
      return 'angular';
  }
}, getGridAlignment:function() {
  switch(this.getPosition()) {
    case 'left':
    case 'right':
      return 'horizontal';
    case 'top':
    case 'bottom':
      return 'vertical';
    case 'radial':
      return 'circular';
    case 'angular':
      return 'radial';
  }
}, getSurface:function() {
  var me = this, chart = me.getChart();
  if (chart && !me.surface) {
    var surface = me.surface = chart.getSurface(me.getId(), 'axis'), gridSurface = me.gridSurface = chart.getSurface('main');
    gridSurface.waitFor(surface);
    me.getGrid();
    me.createLimits();
  }
  return me.surface;
}, createLimits:function() {
  var me = this, chart = me.getChart(), axisSprite = me.getSprites()[0], gridAlignment = me.getGridAlignment(), limits;
  if (me.getLimits() && gridAlignment) {
    gridAlignment = gridAlignment.replace('3d', '');
    me.limits = limits = {surface:chart.getSurface('overlay'), lines:new Ext.chart.Markers, titles:new Ext.draw.sprite.Instancing};
    limits.lines.setTemplate({xclass:'grid.' + gridAlignment});
    limits.lines.getTemplate().setAttributes({strokeStyle:'black'}, true);
    limits.surface.add(limits.lines);
    axisSprite.bindMarker(gridAlignment + '-limit-lines', me.limits.lines);
    me.limitTitleTpl = new Ext.draw.sprite.Text;
    limits.titles.setTemplate(me.limitTitleTpl);
    limits.surface.add(limits.titles);
  }
}, applyGrid:function(grid) {
  if (grid === true) {
    return {};
  }
  return grid;
}, updateGrid:function(grid) {
  var me = this, chart = me.getChart();
  if (!chart) {
    me.on({chartattached:Ext.bind(me.updateGrid, me, [grid]), single:true});
    return;
  }
  var gridSurface = me.gridSurface, axisSprite = me.getSprites()[0], gridAlignment = me.getGridAlignment(), gridSprite;
  if (grid) {
    gridSprite = me.gridSpriteEven;
    if (!gridSprite) {
      gridSprite = me.gridSpriteEven = new Ext.chart.Markers;
      gridSprite.setTemplate({xclass:'grid.' + gridAlignment});
      gridSurface.add(gridSprite);
      axisSprite.bindMarker(gridAlignment + '-even', gridSprite);
    }
    if (Ext.isObject(grid)) {
      gridSprite.getTemplate().setAttributes(grid);
      if (Ext.isObject(grid.even)) {
        gridSprite.getTemplate().setAttributes(grid.even);
      }
    }
    gridSprite = me.gridSpriteOdd;
    if (!gridSprite) {
      gridSprite = me.gridSpriteOdd = new Ext.chart.Markers;
      gridSprite.setTemplate({xclass:'grid.' + gridAlignment});
      gridSurface.add(gridSprite);
      axisSprite.bindMarker(gridAlignment + '-odd', gridSprite);
    }
    if (Ext.isObject(grid)) {
      gridSprite.getTemplate().setAttributes(grid);
      if (Ext.isObject(grid.odd)) {
        gridSprite.getTemplate().setAttributes(grid.odd);
      }
    }
  }
}, updateMinorTickSteps:function(minorTickSteps) {
  var me = this, sprites = me.getSprites(), axisSprite = sprites && sprites[0], surface;
  if (axisSprite) {
    axisSprite.setAttributes({minorTicks:!!minorTickSteps});
    surface = me.getSurface();
    if (!me.isConfiguring && surface) {
      surface.renderFrame();
    }
  }
}, getCoordFor:function(value, field, idx, items) {
  return this.getLayout().getCoordFor(value, field, idx, items);
}, applyPosition:function(pos) {
  return pos.toLowerCase();
}, applyLength:function(length, oldLength) {
  return length > 0 ? length : oldLength;
}, applyLabel:function(label, oldLabel) {
  if (!oldLabel) {
    oldLabel = new Ext.draw.sprite.Text({});
  }
  if (label) {
    if (this.limitTitleTpl) {
      this.limitTitleTpl.setAttributes(label);
    }
    oldLabel.setAttributes(label);
  }
  return oldLabel;
}, applyLayout:function(layout, oldLayout) {
  layout = Ext.factory(layout, null, oldLayout, 'axisLayout');
  layout.setAxis(this);
  return layout;
}, applySegmenter:function(segmenter, oldSegmenter) {
  segmenter = Ext.factory(segmenter, null, oldSegmenter, 'segmenter');
  segmenter.setAxis(this);
  return segmenter;
}, updateMinimum:function() {
  this.range = null;
}, updateMaximum:function() {
  this.range = null;
}, hideLabels:function() {
  this.getSprites()[0].setDirty(true);
  this.setLabel({hidden:true});
}, showLabels:function() {
  this.getSprites()[0].setDirty(true);
  this.setLabel({hidden:false});
}, renderFrame:function() {
  this.getSurface().renderFrame();
}, updateChart:function(newChart, oldChart) {
  var me = this, surface;
  if (oldChart) {
    oldChart.unregister(me);
    oldChart.un('serieschange', me.onSeriesChange, me);
    me.linkAxis();
    me.fireEvent('chartdetached', oldChart, me);
  }
  if (newChart) {
    newChart.on('serieschange', me.onSeriesChange, me);
    me.surface = null;
    surface = me.getSurface();
    me.getLabel().setSurface(surface);
    surface.add(me.getSprites());
    surface.add(me.getTitle());
    newChart.register(me);
    me.fireEvent('chartattached', newChart, me);
  }
}, applyBackground:function(background) {
  var rect = Ext.ClassManager.getByAlias('sprite.rect');
  return rect.def.normalize(background);
}, processData:function() {
  this.getLayout().processData();
  this.range = null;
}, getDirection:function() {
  return this.getChart().getDirectionForAxis(this.getPosition());
}, isSide:function() {
  var position = this.getPosition();
  return position === 'left' || position === 'right';
}, applyFields:function(fields) {
  return Ext.Array.from(fields);
}, applyVisibleRange:function(visibleRange, oldVisibleRange) {
  this.getChart();
  if (visibleRange[0] > visibleRange[1]) {
    var temp = visibleRange[0];
    visibleRange[0] = visibleRange[1];
    visibleRange[0] = temp;
  }
  if (visibleRange[1] === visibleRange[0]) {
    visibleRange[1] += 1 / this.getMaxZoom();
  }
  if (visibleRange[1] > visibleRange[0] + 1) {
    visibleRange[0] = 0;
    visibleRange[1] = 1;
  } else {
    if (visibleRange[0] < 0) {
      visibleRange[1] -= visibleRange[0];
      visibleRange[0] = 0;
    } else {
      if (visibleRange[1] > 1) {
        visibleRange[0] -= visibleRange[1] - 1;
        visibleRange[1] = 1;
      }
    }
  }
  if (oldVisibleRange && visibleRange[0] === oldVisibleRange[0] && visibleRange[1] === oldVisibleRange[1]) {
    return undefined;
  }
  return visibleRange;
}, updateVisibleRange:function(visibleRange) {
  this.fireEvent('visiblerangechange', this, visibleRange);
}, onSeriesChange:function(chart) {
  var me = this, series = chart.getSeries(), boundSeries = [], linkedTo, masterAxis, getAxisMethod, i, ln;
  if (series) {
    getAxisMethod = 'get' + me.getDirection() + 'Axis';
    for (i = 0, ln = series.length; i < ln; i++) {
      if (this === series[i][getAxisMethod]()) {
        boundSeries.push(series[i]);
      }
    }
  }
  me.boundSeries = boundSeries;
  linkedTo = me.getLinkedTo();
  masterAxis = !Ext.isEmpty(linkedTo) && chart.getAxis(linkedTo);
  if (masterAxis) {
    me.linkAxis(masterAxis);
  } else {
    me.getLayout().processData();
  }
}, linkAxis:function(masterAxis) {
  var me = this;
  function link(action, slave, master) {
    master.getLayout()[action]('datachange', 'onDataChange', slave);
    master[action]('rangechange', 'onMasterAxisRangeChange', slave);
  }
  if (me.masterAxis) {
    if (!me.masterAxis.destroyed) {
      link('un', me, me.masterAxis);
    }
    me.masterAxis = null;
  }
  if (masterAxis) {
    if (masterAxis.type !== this.type) {
      Ext.Error.raise('Linked axes must be of the same type.');
    }
    link('on', me, masterAxis);
    me.onDataChange(masterAxis.getLayout().labels);
    me.onMasterAxisRangeChange(masterAxis, masterAxis.range);
    me.setStyle(Ext.apply({}, me.config.style, masterAxis.config.style));
    me.setTitle(Ext.apply({}, me.config.title, masterAxis.config.title));
    me.setLabel(Ext.apply({}, me.config.label, masterAxis.config.label));
    me.masterAxis = masterAxis;
  }
}, onDataChange:function(data) {
  this.getLayout().labels = data;
}, onMasterAxisRangeChange:function(masterAxis, range) {
  this.range = range;
}, applyRange:function(newRange) {
  if (!newRange) {
    return this.dataRange.slice(0);
  } else {
    return [newRange[0] === null ? this.dataRange[0] : newRange[0], newRange[1] === null ? this.dataRange[1] : newRange[1]];
  }
}, setBoundSeriesRange:function(range) {
  var boundSeries = this.boundSeries, style = {}, series, i, sprites, j, ln;
  style['range' + this.getDirection()] = range;
  for (i = 0, ln = boundSeries.length; i < ln; i++) {
    series = boundSeries[i];
    if (series.getHidden() === true) {
      continue;
    }
    sprites = series.getSprites();
    for (j = 0; j < sprites.length; j++) {
      sprites[j].setAttributes(style);
    }
  }
}, getRange:function(recalculate) {
  var me = this, range = recalculate ? null : me.range, oldRange = me.oldRange, minimum, maximum;
  if (!range) {
    if (me.masterAxis) {
      range = me.masterAxis.range;
    } else {
      minimum = me.getMinimum();
      maximum = me.getMaximum();
      if (Ext.isNumber(minimum) && Ext.isNumber(maximum)) {
        range = [minimum, maximum];
      } else {
        range = me.calculateRange();
      }
      me.range = range;
    }
  }
  if (range && (!oldRange || range[0] !== oldRange[0] || range[1] !== oldRange[1])) {
    me.fireEvent('rangechange', me, range, oldRange);
    me.oldRange = range;
  }
  return range;
}, calculateRange:function() {
  var me = this, boundSeries = me.boundSeries, layout = me.getLayout(), segmenter = me.getSegmenter(), minimum = me.getMinimum(), maximum = me.getMaximum(), visibleRange = me.getVisibleRange(), getRangeMethod = 'get' + me.getDirection() + 'Range', expandRangeBy = me.getExpandRangeBy(), context, attr, majorTicks, series, i, ln, seriesRange, range = [NaN, NaN];
  for (i = 0, ln = boundSeries.length; i < ln; i++) {
    series = boundSeries[i];
    if (series.getHidden() === true) {
      continue;
    }
    seriesRange = series[getRangeMethod]();
    if (seriesRange) {
      Ext.chart.Util.expandRange(range, seriesRange);
    }
  }
  range = Ext.chart.Util.validateRange(range, me.defaultRange, me.rangePadding);
  if (expandRangeBy && range[0] + me.rangePadding !== range[1] - me.rangePadding) {
    range[0] -= expandRangeBy;
    range[1] += expandRangeBy;
  }
  if (isFinite(minimum)) {
    range[0] = minimum;
  }
  if (isFinite(maximum)) {
    range[1] = maximum;
  }
  range[0] = Ext.Number.correctFloat(range[0]);
  range[1] = Ext.Number.correctFloat(range[1]);
  me.range = range;
  if (me.getReconcileRange()) {
    me.reconcileRange();
  }
  if (range[0] !== range[1] && me.getAdjustByMajorUnit() && segmenter.adjustByMajorUnit && !me.getMajorTickSteps()) {
    attr = Ext.Object.chain(me.getSprites()[0].attr);
    attr.min = range[0];
    attr.max = range[1];
    attr.visibleMin = visibleRange[0];
    attr.visibleMax = visibleRange[1];
    context = {attr:attr, segmenter:segmenter};
    layout.calculateLayout(context);
    majorTicks = context.majorTicks;
    if (majorTicks) {
      segmenter.adjustByMajorUnit(majorTicks.step, majorTicks.unit.scale, range);
      attr.min = range[0];
      attr.max = range[1];
      context.majorTicks = null;
      layout.calculateLayout(context);
      majorTicks = context.majorTicks;
      segmenter.adjustByMajorUnit(majorTicks.step, majorTicks.unit.scale, range);
    } else {
      if (!me.hasClearRangePending) {
        me.hasClearRangePending = true;
        me.getChart().on('layout', 'clearRange', me);
      }
    }
  }
  return range;
}, clearRange:function() {
  this.hasClearRangePending = null;
  this.range = null;
}, reconcileRange:function() {
  var me = this, axes = me.getChart().getAxes(), direction = me.getDirection(), i, ln, axis, range;
  if (!axes) {
    return;
  }
  for (i = 0, ln = axes.length; i < ln; i++) {
    axis = axes[i];
    range = axis.getRange();
    if (axis === me || axis.getDirection() !== direction || !range || !axis.getReconcileRange()) {
      continue;
    }
    if (range[0] < me.range[0]) {
      me.range[0] = range[0];
    }
    if (range[1] > me.range[1]) {
      me.range[1] = range[1];
    }
  }
}, applyStyle:function(style, oldStyle) {
  var cls = Ext.ClassManager.getByAlias('sprite.' + this.seriesType);
  if (cls && cls.def) {
    style = cls.def.normalize(style);
  }
  oldStyle = Ext.apply(oldStyle || {}, style);
  return oldStyle;
}, themeOnlyIfConfigured:{grid:true}, updateTheme:function(theme) {
  var me = this, axisTheme = theme.getAxis(), position = me.getPosition(), initialConfig = me.getInitialConfig(), defaultConfig = me.defaultConfig, configs = me.self.getConfigurator().configs, genericAxisTheme = axisTheme.defaults, specificAxisTheme = axisTheme[position], themeOnlyIfConfigured = me.themeOnlyIfConfigured, key, value, isObjValue, isUnusedConfig, initialValue, cfg;
  axisTheme = Ext.merge({}, genericAxisTheme, specificAxisTheme);
  for (key in axisTheme) {
    value = axisTheme[key];
    cfg = configs[key];
    if (value !== null && value !== undefined && cfg) {
      initialValue = initialConfig[key];
      isObjValue = Ext.isObject(value);
      isUnusedConfig = initialValue === defaultConfig[key];
      if (isObjValue) {
        if (isUnusedConfig && themeOnlyIfConfigured[key]) {
          continue;
        }
        value = Ext.merge({}, value, initialValue);
      }
      if (isUnusedConfig || isObjValue) {
        me[cfg.names.set](value);
      }
    }
  }
}, updateCenter:function(center) {
  var me = this, sprites = me.getSprites(), axisSprite = sprites[0], centerX = center[0], centerY = center[1];
  if (axisSprite) {
    axisSprite.setAttributes({centerX:centerX, centerY:centerY});
  }
  if (me.gridSpriteEven) {
    me.gridSpriteEven.getTemplate().setAttributes({translationX:centerX, translationY:centerY, rotationCenterX:centerX, rotationCenterY:centerY});
  }
  if (me.gridSpriteOdd) {
    me.gridSpriteOdd.getTemplate().setAttributes({translationX:centerX, translationY:centerY, rotationCenterX:centerX, rotationCenterY:centerY});
  }
}, getSprites:function() {
  if (!this.getChart()) {
    return;
  }
  var me = this, range = me.getRange(), position = me.getPosition(), chart = me.getChart(), animation = chart.getAnimation(), length = me.getLength(), axisClass = me.superclass, mainSprite, style, animationModifier;
  if (animation === false) {
    animation = {duration:0};
  }
  style = Ext.applyIf({position:position, axis:me, length:length, grid:me.getGrid(), hidden:me.getHidden(), titleOffset:me.titleOffset, layout:me.getLayout(), segmenter:me.getSegmenter(), totalAngle:me.getTotalAngle(), label:me.getLabel()}, me.getStyle());
  if (range) {
    style.min = range[0];
    style.max = range[1];
  }
  if (!me.sprites.length) {
    while (!axisClass.xtype) {
      axisClass = axisClass.superclass;
    }
    mainSprite = Ext.create('sprite.' + axisClass.xtype, style);
    animationModifier = mainSprite.getAnimation();
    animationModifier.setCustomDurations({baseRotation:0});
    animationModifier.on('animationstart', 'onAnimationStart', me);
    animationModifier.on('animationend', 'onAnimationEnd', me);
    mainSprite.setLayout(me.getLayout());
    mainSprite.setSegmenter(me.getSegmenter());
    mainSprite.setLabel(me.getLabel());
    me.sprites.push(mainSprite);
    me.updateTitleSprite();
  } else {
    mainSprite = me.sprites[0];
    mainSprite.setAnimation(animation);
    mainSprite.setAttributes(style);
  }
  if (me.getRenderer()) {
    mainSprite.setRenderer(me.getRenderer());
  }
  return me.sprites;
}, performLayout:function() {
  if (this.isConfiguring) {
    return;
  }
  var me = this, sprites = me.getSprites(), surface = me.getSurface(), chart = me.getChart(), sprite = sprites && sprites[0];
  if (chart && surface && sprite) {
    sprite.callUpdater(null, 'layout');
    chart.scheduleLayout();
  }
}, updateTitleSprite:function() {
  var me = this, length = me.getLength();
  if (!me.sprites[0] || !Ext.isNumber(length)) {
    return;
  }
  var thickness = this.sprites[0].thickness, surface = me.getSurface(), title = me.getTitle(), position = me.getPosition(), margin = me.getMargin(), titleMargin = me.getTitleMargin(), anchor = surface.roundPixel(length / 2);
  if (title) {
    switch(position) {
      case 'top':
        title.setAttributes({x:anchor, y:margin + titleMargin / 2, textBaseline:'top', textAlign:'center'}, true);
        title.applyTransformations();
        me.titleOffset = title.getBBox().height + titleMargin;
        break;
      case 'bottom':
        title.setAttributes({x:anchor, y:thickness + titleMargin / 2, textBaseline:'top', textAlign:'center'}, true);
        title.applyTransformations();
        me.titleOffset = title.getBBox().height + titleMargin;
        break;
      case 'left':
        title.setAttributes({x:margin + titleMargin / 2, y:anchor, textBaseline:'top', textAlign:'center', rotationCenterX:margin + titleMargin / 2, rotationCenterY:anchor, rotationRads:-Math.PI / 2}, true);
        title.applyTransformations();
        me.titleOffset = title.getBBox().width + titleMargin;
        break;
      case 'right':
        title.setAttributes({x:thickness - margin + titleMargin / 2, y:anchor, textBaseline:'bottom', textAlign:'center', rotationCenterX:thickness + titleMargin / 2, rotationCenterY:anchor, rotationRads:Math.PI / 2}, true);
        title.applyTransformations();
        me.titleOffset = title.getBBox().width + titleMargin;
        break;
    }
  }
}, onThicknessChanged:function() {
  this.getChart().onThicknessChanged();
}, getThickness:function() {
  if (this.getHidden()) {
    return 0;
  }
  return (this.sprites[0] && this.sprites[0].thickness || 1) + this.titleOffset + this.getMargin();
}, onAnimationStart:function() {
  this.spriteAnimationCount++;
  if (this.spriteAnimationCount === 1) {
    this.fireEvent('animationstart', this);
  }
}, onAnimationEnd:function() {
  this.spriteAnimationCount--;
  if (this.spriteAnimationCount === 0) {
    this.fireEvent('animationend', this);
  }
}, getItemId:function() {
  return this.getId();
}, getAncestorIds:function() {
  return [this.getChart().getId()];
}, isXType:function(xtype) {
  return xtype === 'axis';
}, resolveListenerScope:function(defaultScope) {
  var me = this, namedScope = Ext._namedScopes[defaultScope], chart = me.getChart(), scope;
  if (!namedScope) {
    scope = chart ? chart.resolveListenerScope(defaultScope, false) : defaultScope || me;
  } else {
    if (namedScope.isThis) {
      scope = me;
    } else {
      if (namedScope.isController) {
        scope = chart ? chart.resolveListenerScope(defaultScope, false) : me;
      } else {
        if (namedScope.isSelf) {
          scope = chart ? chart.resolveListenerScope(defaultScope, false) : me;
          if (scope === chart && !chart.getInheritedConfig('defaultListenerScope')) {
            scope = me;
          }
        }
      }
    }
  }
  return scope;
}, destroy:function() {
  var me = this;
  me.setChart(null);
  me.surface.destroy();
  me.surface = null;
  me.callParent();
}});
Ext.define('Ext.chart.legend.LegendBase', {extend:'Ext.view.View', config:{tpl:['\x3cdiv class\x3d"', Ext.baseCSSPrefix, 'legend-inner"\x3e', '\x3cdiv class\x3d"', Ext.baseCSSPrefix, 'legend-container"\x3e', '\x3ctpl for\x3d"."\x3e', '\x3cdiv class\x3d"', Ext.baseCSSPrefix, 'legend-item"\x3e', '\x3cspan ', 'class\x3d"', Ext.baseCSSPrefix, "legend-item-marker {[ values.disabled ? Ext.baseCSSPrefix + 'legend-item-inactive' : '' ]}\" ", 'style\x3d"background:{mark};"\x3e', '\x3c/span\x3e{name}', '\x3c/div\x3e', 
'\x3c/tpl\x3e', '\x3c/div\x3e', '\x3c/div\x3e'], nodeContainerSelector:'div.' + Ext.baseCSSPrefix + 'legend-inner', itemSelector:'div.' + Ext.baseCSSPrefix + 'legend-item', docked:'bottom'}, setDocked:function(docked) {
  var me = this, panel = me.ownerCt;
  me.docked = me.dock = docked;
  switch(docked) {
    case 'top':
    case 'bottom':
      me.addCls(me.horizontalCls);
      me.removeCls(me.verticalCls);
      break;
    case 'left':
    case 'right':
      me.addCls(me.verticalCls);
      me.removeCls(me.horizontalCls);
      break;
  }
  if (panel) {
    panel.setDock(docked);
  }
}, setStore:function(store) {
  this.bindStore(store);
}, clearViewEl:function() {
  this.callParent(arguments);
  Ext.removeNode(this.getNodeContainer());
}, onItemClick:function(record, item, index, e) {
  this.callParent(arguments);
  this.toggleItem(index);
}});
Ext.define('Ext.chart.legend.Legend', {extend:'Ext.chart.legend.LegendBase', alternateClassName:'Ext.chart.Legend', xtype:'legend', alias:'legend.dom', type:'dom', isLegend:true, isDomLegend:true, config:{rect:null, toggleable:true}, baseCls:Ext.baseCSSPrefix + 'legend', horizontalCls:Ext.baseCSSPrefix + 'legend-horizontal', verticalCls:Ext.baseCSSPrefix + 'legend-vertical', toggleItem:function(index) {
  if (!this.getToggleable()) {
    return;
  }
  var store = this.getStore(), disabledCount = 0, disabled, canToggle = true, i, count, record;
  if (store) {
    count = store.getCount();
    for (i = 0; i < count; i++) {
      record = store.getAt(i);
      if (record.get('disabled')) {
        disabledCount++;
      }
    }
    canToggle = count - disabledCount > 1;
    record = store.getAt(index);
    if (record) {
      disabled = record.get('disabled');
      if (disabled || canToggle) {
        record.set('disabled', !disabled);
      }
    }
  }
}});
Ext.define('Ext.chart.legend.sprite.Item', {extend:'Ext.draw.sprite.Composite', alias:'sprite.legenditem', type:'legenditem', isLegendItem:true, requires:['Ext.draw.sprite.Text', 'Ext.draw.sprite.Circle'], inheritableStatics:{def:{processors:{enabled:'limited01', markerLabelGap:'number'}, animationProcessors:{enabled:null, markerLabelGap:null}, defaults:{enabled:true, markerLabelGap:5}, triggers:{enabled:'enabled', markerLabelGap:'layout'}, updaters:{layout:'layoutUpdater', enabled:'enabledUpdater'}}}, 
config:{label:{$value:{type:'text'}, lazy:true}, marker:{$value:{type:'circle'}, lazy:true}, legend:null, store:null, record:null, series:null}, applyLabel:function(label, oldLabel) {
  var sprite;
  if (label) {
    if (label.isSprite && label.type === 'text') {
      sprite = label;
    } else {
      if (oldLabel && label.type === oldLabel.type) {
        oldLabel.setConfig(label);
        sprite = oldLabel;
        this.scheduleUpdater(this.attr, 'layout');
      } else {
        sprite = new Ext.draw.sprite.Text(label);
      }
    }
  }
  return sprite;
}, defaultMarkerSize:10, updateLabel:function(label, oldLabel) {
  var me = this;
  me.removeSprite(oldLabel);
  label.setAttributes({textBaseline:'middle'});
  me.addSprite(label);
  me.scheduleUpdater(me.attr, 'layout');
}, applyMarker:function(config) {
  var marker;
  if (config) {
    if (config.isSprite) {
      marker = config;
    } else {
      marker = this.createMarker(config);
    }
  }
  marker = this.resetMarker(marker, config);
  return marker;
}, createMarker:function(config) {
  var marker;
  delete config.animation;
  if (config.type === 'image') {
    delete config.width;
    delete config.height;
  }
  marker = Ext.create('sprite.' + config.type, config);
  return marker;
}, resetMarker:function(sprite, config) {
  var size = config.size || this.defaultMarkerSize, bbox, max, scale;
  sprite.setTransform([1, 0, 0, 1, 0, 0], true);
  if (config.type === 'image') {
    sprite.setAttributes({width:size, height:size});
  } else {
    bbox = sprite.getBBox();
    max = Math.max(bbox.width, bbox.height);
    scale = size / max;
    sprite.setAttributes({scalingX:scale, scalingY:scale});
  }
  return sprite;
}, updateMarker:function(marker, oldMarker) {
  var me = this;
  me.removeSprite(oldMarker);
  me.addSprite(marker);
  me.scheduleUpdater(me.attr, 'layout');
}, updateSurface:function(surface, oldSurface) {
  var me = this;
  me.callParent([surface, oldSurface]);
  if (surface) {
    me.scheduleUpdater(me.attr, 'layout');
  }
}, enabledUpdater:function(attr) {
  var marker = this.getMarker();
  if (marker) {
    marker.setAttributes({globalAlpha:attr.enabled ? 1 : 0.3});
  }
}, layoutUpdater:function() {
  var me = this, attr = me.attr, label = me.getLabel(), marker = me.getMarker(), labelBBox, markerBBox, totalHeight;
  markerBBox = marker.getBBox();
  labelBBox = label.getBBox();
  totalHeight = Math.max(markerBBox.height, labelBBox.height);
  marker.transform([1, 0, 0, 1, -markerBBox.x, -markerBBox.y + (totalHeight - markerBBox.height) / 2], true);
  label.transform([1, 0, 0, 1, -labelBBox.x + markerBBox.width + attr.markerLabelGap, -labelBBox.y + (totalHeight - labelBBox.height) / 2], true);
  me.bboxUpdater(attr);
}});
Ext.define('Ext.chart.legend.sprite.Border', {extend:'Ext.draw.sprite.Rect', alias:'sprite.legendborder', type:'legendborder', isLegendBorder:true});
Ext.define('Ext.draw.PathUtil', function() {
  var abs = Math.abs, pow = Math.pow, cos = Math.cos, acos = Math.acos, sqrt = Math.sqrt, PI = Math.PI;
  return {singleton:true, requires:['Ext.draw.overrides.hittest.Path', 'Ext.draw.overrides.hittest.sprite.Path'], cubicRoots:function(P) {
    var a = P[0], b = P[1], c = P[2], d = P[3];
    if (a === 0) {
      return this.quadraticRoots(b, c, d);
    }
    var A = b / a, B = c / a, C = d / a, Q = (3 * B - pow(A, 2)) / 9, R = (9 * A * B - 27 * C - 2 * pow(A, 3)) / 54, D = pow(Q, 3) + pow(R, 2), t = [], S, T, Im, th, i, sign = Ext.Number.sign;
    if (D >= 0) {
      S = sign(R + sqrt(D)) * pow(abs(R + sqrt(D)), 1 / 3);
      T = sign(R - sqrt(D)) * pow(abs(R - sqrt(D)), 1 / 3);
      t[0] = -A / 3 + (S + T);
      t[1] = -A / 3 - (S + T) / 2;
      t[2] = t[1];
      Im = abs(sqrt(3) * (S - T) / 2);
      if (Im !== 0) {
        t[1] = -1;
        t[2] = -1;
      }
    } else {
      th = acos(R / sqrt(-pow(Q, 3)));
      t[0] = 2 * sqrt(-Q) * cos(th / 3) - A / 3;
      t[1] = 2 * sqrt(-Q) * cos((th + 2 * PI) / 3) - A / 3;
      t[2] = 2 * sqrt(-Q) * cos((th + 4 * PI) / 3) - A / 3;
    }
    for (i = 0; i < 3; i++) {
      if (t[i] < 0 || t[i] > 1) {
        t[i] = -1;
      }
    }
    return t;
  }, quadraticRoots:function(a, b, c) {
    var D, rD, t, i;
    if (a === 0) {
      return this.linearRoot(b, c);
    }
    D = b * b - 4 * a * c;
    if (D === 0) {
      t = [-b / (2 * a)];
    } else {
      if (D > 0) {
        rD = sqrt(D);
        t = [(-b - rD) / (2 * a), (-b + rD) / (2 * a)];
      } else {
        return [];
      }
    }
    for (i = 0; i < t.length; i++) {
      if (t[i] < 0 || t[i] > 1) {
        t[i] = -1;
      }
    }
    return t;
  }, linearRoot:function(a, b) {
    var t = -b / a;
    if (a === 0 || t < 0 || t > 1) {
      return [];
    }
    return [t];
  }, bezierCoeffs:function(P0, P1, P2, P3) {
    var Z = [];
    Z[0] = -P0 + 3 * P1 - 3 * P2 + P3;
    Z[1] = 3 * P0 - 6 * P1 + 3 * P2;
    Z[2] = -3 * P0 + 3 * P1;
    Z[3] = P0;
    return Z;
  }, cubicLineIntersections:function(px1, px2, px3, px4, py1, py2, py3, py4, x1, y1, x2, y2) {
    var P = [], intersections = [], A = y1 - y2, B = x2 - x1, C = x1 * (y2 - y1) - y1 * (x2 - x1), bx = this.bezierCoeffs(px1, px2, px3, px4), by = this.bezierCoeffs(py1, py2, py3, py4), i, r, s, t, tt, ttt, cx, cy;
    P[0] = A * bx[0] + B * by[0];
    P[1] = A * bx[1] + B * by[1];
    P[2] = A * bx[2] + B * by[2];
    P[3] = A * bx[3] + B * by[3] + C;
    r = this.cubicRoots(P);
    for (i = 0; i < r.length; i++) {
      t = r[i];
      if (t < 0 || t > 1) {
        continue;
      }
      tt = t * t;
      ttt = tt * t;
      cx = bx[0] * ttt + bx[1] * tt + bx[2] * t + bx[3];
      cy = by[0] * ttt + by[1] * tt + by[2] * t + by[3];
      if (x2 - x1 !== 0) {
        s = (cx - x1) / (x2 - x1);
      } else {
        s = (cy - y1) / (y2 - y1);
      }
      if (!(s < 0 || s > 1)) {
        intersections.push([cx, cy]);
      }
    }
    return intersections;
  }, splitCubic:function(P1, P2, P3, P4, z) {
    var zz = z * z, zzz = z * zz, iz = z - 1, izz = iz * iz, izzz = iz * izz, P = zzz * P4 - 3 * zz * iz * P3 + 3 * z * izz * P2 - izzz * P1;
    return [[P1, z * P2 - iz * P1, zz * P3 - 2 * z * iz * P2 + izz * P1, P], [P, zz * P4 - 2 * z * iz * P3 + izz * P2, z * P4 - iz * P3, P4]];
  }, cubicDimension:function(a, b, c, d) {
    var qa = 3 * (-a + 3 * (b - c) + d), qb = 6 * (a - 2 * b + c), qc = -3 * (a - b), x, y, min = Math.min(a, d), max = Math.max(a, d), delta;
    if (qa === 0) {
      if (qb === 0) {
        return [min, max];
      } else {
        x = -qc / qb;
        if (0 < x && x < 1) {
          y = this.interpolateCubic(a, b, c, d, x);
          min = Math.min(min, y);
          max = Math.max(max, y);
        }
      }
    } else {
      delta = qb * qb - 4 * qa * qc;
      if (delta >= 0) {
        delta = sqrt(delta);
        x = (delta - qb) / 2 / qa;
        if (0 < x && x < 1) {
          y = this.interpolateCubic(a, b, c, d, x);
          min = Math.min(min, y);
          max = Math.max(max, y);
        }
        if (delta > 0) {
          x -= delta / qa;
          if (0 < x && x < 1) {
            y = this.interpolateCubic(a, b, c, d, x);
            min = Math.min(min, y);
            max = Math.max(max, y);
          }
        }
      }
    }
    return [min, max];
  }, interpolateCubic:function(a, b, c, d, t) {
    if (t === 0) {
      return a;
    }
    if (t === 1) {
      return d;
    }
    var rate = (1 - t) / t;
    return t * t * t * (d + rate * (3 * c + rate * (3 * b + rate * a)));
  }, cubicsIntersections:function(ax1, ax2, ax3, ax4, ay1, ay2, ay3, ay4, bx1, bx2, bx3, bx4, by1, by2, by3, by4) {
    var me = this, axDim = me.cubicDimension(ax1, ax2, ax3, ax4), ayDim = me.cubicDimension(ay1, ay2, ay3, ay4), bxDim = me.cubicDimension(bx1, bx2, bx3, bx4), byDim = me.cubicDimension(by1, by2, by3, by4), splitAx, splitAy, splitBx, splitBy, points = [];
    if (axDim[0] > bxDim[1] || axDim[1] < bxDim[0] || ayDim[0] > byDim[1] || ayDim[1] < byDim[0]) {
      return [];
    }
    if (abs(ay1 - ay2) < 1 && abs(ay3 - ay4) < 1 && abs(ax1 - ax4) < 1 && abs(ax2 - ax3) < 1 && abs(by1 - by2) < 1 && abs(by3 - by4) < 1 && abs(bx1 - bx4) < 1 && abs(bx2 - bx3) < 1) {
      return [[(ax1 + ax4) * 0.5, (ay1 + ay2) * 0.5]];
    }
    splitAx = me.splitCubic(ax1, ax2, ax3, ax4, 0.5);
    splitAy = me.splitCubic(ay1, ay2, ay3, ay4, 0.5);
    splitBx = me.splitCubic(bx1, bx2, bx3, bx4, 0.5);
    splitBy = me.splitCubic(by1, by2, by3, by4, 0.5);
    points.push.apply(points, me.cubicsIntersections.apply(me, splitAx[0].concat(splitAy[0], splitBx[0], splitBy[0])));
    points.push.apply(points, me.cubicsIntersections.apply(me, splitAx[0].concat(splitAy[0], splitBx[1], splitBy[1])));
    points.push.apply(points, me.cubicsIntersections.apply(me, splitAx[1].concat(splitAy[1], splitBx[0], splitBy[0])));
    points.push.apply(points, me.cubicsIntersections.apply(me, splitAx[1].concat(splitAy[1], splitBx[1], splitBy[1])));
    return points;
  }, linesIntersection:function(x1, y1, x2, y2, x3, y3, x4, y4) {
    var d = (x2 - x1) * (y4 - y3) - (y2 - y1) * (x4 - x3), ua, ub;
    if (d === 0) {
      return null;
    }
    ua = ((x4 - x3) * (y1 - y3) - (x1 - x3) * (y4 - y3)) / d;
    ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / d;
    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      return [x1 + ua * (x2 - x1), y1 + ua * (y2 - y1)];
    }
    return null;
  }, pointOnLine:function(x1, y1, x2, y2, x, y) {
    var t, _;
    if (abs(x2 - x1) < abs(y2 - y1)) {
      _ = x1;
      x1 = y1;
      y1 = _;
      _ = x2;
      x2 = y2;
      y2 = _;
      _ = x;
      x = y;
      y = _;
    }
    t = (x - x1) / (x2 - x1);
    if (t < 0 || t > 1) {
      return false;
    }
    return abs(y1 + t * (y2 - y1) - y) < 4;
  }, pointOnCubic:function(px1, px2, px3, px4, py1, py2, py3, py4, x, y) {
    var me = this, bx = me.bezierCoeffs(px1, px2, px3, px4), by = me.bezierCoeffs(py1, py2, py3, py4), i, j, rx, ry, t;
    bx[3] -= x;
    by[3] -= y;
    rx = me.cubicRoots(bx);
    ry = me.cubicRoots(by);
    for (i = 0; i < rx.length; i++) {
      t = rx[i];
      for (j = 0; j < ry.length; j++) {
        if (t >= 0 && t <= 1 && abs(t - ry[j]) < 0.05) {
          return true;
        }
      }
    }
    return false;
  }};
});
Ext.define('Ext.draw.overrides.hittest.All', {requires:['Ext.draw.PathUtil', 'Ext.draw.overrides.hittest.sprite.Instancing', 'Ext.draw.overrides.hittest.Surface']});
Ext.define('Ext.chart.legend.SpriteLegend', {alias:'legend.sprite', type:'sprite', isLegend:true, isSpriteLegend:true, mixins:['Ext.mixin.Observable'], requires:['Ext.chart.legend.sprite.Item', 'Ext.chart.legend.sprite.Border', 'Ext.draw.overrides.hittest.All', 'Ext.draw.Animator'], config:{docked:'bottom', store:null, chart:null, surface:null, size:{width:0, height:0}, toggleable:true, padding:10, label:{preciseMeasurement:true}, marker:{}, border:{$value:{type:'legendborder'}, lazy:true}, background:null, 
hidden:false}, sprites:null, spriteZIndexes:{background:0, border:1, item:2}, dockedValues:{left:true, right:true, top:true, bottom:true}, constructor:function(config) {
  var me = this;
  me.oldSize = {width:0, height:0};
  me.getId();
  me.mixins.observable.constructor.call(me, config);
}, applyStore:function(store) {
  return store && Ext.StoreManager.lookup(store);
}, updateStore:function(store, oldStore) {
  var me = this;
  if (oldStore) {
    oldStore.un('datachanged', me.onDataChanged, me);
    oldStore.un('update', me.onDataUpdate, me);
  }
  if (store) {
    store.on('datachanged', me.onDataChanged, me);
    store.on('update', me.onDataUpdate, me);
    me.onDataChanged(store);
  }
  me.performLayout();
}, applyDocked:function(docked) {
  if (!(docked in this.dockedValues)) {
    Ext.raise("Invalid 'docked' config value.");
  }
  return docked;
}, updateDocked:function(docked) {
  this.isTop = docked === 'top';
  if (!this.isConfiguring) {
    this.layoutChart();
  }
}, updateHidden:function(hidden) {
  this.getChart();
  var surface = this.getSurface();
  if (surface) {
    surface.setHidden(hidden);
  }
  if (!this.isConfiguring) {
    this.layoutChart();
  }
}, layoutChart:function() {
  if (!this.isConfiguring) {
    var chart = this.getChart();
    if (chart) {
      chart.scheduleLayout();
    }
  }
}, computeRect:function(chartRect) {
  if (this.getHidden()) {
    return null;
  }
  var rect = [0, 0, 0, 0], docked = this.getDocked(), size = this.getSize(), height = size.height, width = size.width;
  switch(docked) {
    case 'top':
      rect[1] = chartRect[1];
      rect[2] = chartRect[2];
      rect[3] = height;
      chartRect[1] += height;
      chartRect[3] -= height;
      break;
    case 'bottom':
      chartRect[3] -= height;
      rect[1] = chartRect[3];
      rect[2] = chartRect[2];
      rect[3] = height;
      break;
    case 'left':
      chartRect[0] += width;
      chartRect[2] -= width;
      rect[2] = width;
      rect[3] = chartRect[3];
      break;
    case 'right':
      chartRect[2] -= width;
      rect[0] = chartRect[2];
      rect[2] = width;
      rect[3] = chartRect[3];
      break;
  }
  return rect;
}, applyBorder:function(config) {
  var border;
  if (config) {
    if (config.isSprite) {
      border = config;
    } else {
      border = Ext.create('sprite.' + config.type, config);
    }
  }
  if (border) {
    border.isLegendBorder = true;
    border.setAttributes({zIndex:this.spriteZIndexes.border});
  }
  return border;
}, updateBorder:function(border, oldBorder) {
  var surface = this.getSurface();
  this.borderSprite = null;
  if (surface) {
    if (oldBorder) {
      surface.remove(oldBorder);
    }
    if (border) {
      this.borderSprite = surface.add(border);
    }
  }
}, scheduleLayout:function() {
  if (!this.scheduledLayoutId) {
    this.scheduledLayoutId = Ext.draw.Animator.schedule('performLayout', this);
  }
}, cancelLayout:function() {
  Ext.draw.Animator.cancel(this.scheduledLayoutId);
  this.scheduledLayoutId = null;
}, performLayout:function() {
  var me = this, size = me.getSize(), gap = me.getPadding(), sprites = me.getSprites(), surface = me.getSurface(), background = me.getBackground(), surfaceRect = surface.getRect(), store = me.getStore(), ln = sprites && sprites.length || 0, i, sprite;
  if (!surface || !surfaceRect || !store) {
    return false;
  }
  me.cancelLayout();
  var docked = me.getDocked(), surfaceWidth = surfaceRect[2], surfaceHeight = surfaceRect[3], border = me.borderSprite, bboxes = [], startX, startY, columnSize, columnCount, columnWidth, itemsWidth, itemsHeight, paddedItemsWidth, paddedItemsHeight, paddedBorderWidth, paddedBorderHeight, itemHeight, bbox, x, y;
  for (i = 0; i < ln; i++) {
    sprite = sprites[i];
    bbox = sprite.getBBox();
    bboxes.push(bbox);
  }
  if (bbox) {
    itemHeight = bbox.height;
  }
  switch(docked) {
    case 'bottom':
    case 'top':
      if (!surfaceWidth) {
        return false;
      }
      columnSize = 0;
      do {
        itemsWidth = 0;
        columnWidth = 0;
        columnCount = 0;
        columnSize++;
        for (i = 0; i < ln; i++) {
          bbox = bboxes[i];
          if (bbox.width > columnWidth) {
            columnWidth = bbox.width;
          }
          if ((i + 1) % columnSize === 0) {
            itemsWidth += columnWidth;
            columnWidth = 0;
            columnCount++;
          }
        }
        if (i % columnSize !== 0) {
          itemsWidth += columnWidth;
          columnCount++;
        }
        paddedItemsWidth = itemsWidth + (columnCount - 1) * gap;
        paddedBorderWidth = paddedItemsWidth + gap * 4;
      } while (paddedBorderWidth > surfaceWidth);
      paddedItemsHeight = itemHeight * columnSize + (columnSize - 1) * gap;
      break;
    case 'right':
    case 'left':
      if (!surfaceHeight) {
        return false;
      }
      columnSize = ln * 2;
      do {
        columnSize = (columnSize >> 1) + columnSize % 2;
        itemsWidth = 0;
        itemsHeight = 0;
        columnWidth = 0;
        columnCount = 0;
        for (i = 0; i < ln; i++) {
          bbox = bboxes[i];
          if (!columnCount) {
            itemsHeight += bbox.height;
          }
          if (bbox.width > columnWidth) {
            columnWidth = bbox.width;
          }
          if ((i + 1) % columnSize === 0) {
            itemsWidth += columnWidth;
            columnWidth = 0;
            columnCount++;
          }
        }
        if (i % columnSize !== 0) {
          itemsWidth += columnWidth;
          columnCount++;
        }
        paddedItemsWidth = itemsWidth + (columnCount - 1) * gap;
        paddedItemsHeight = itemsHeight + (columnSize - 1) * gap;
        paddedBorderWidth = paddedItemsWidth + gap * 4;
        paddedBorderHeight = paddedItemsHeight + gap * 4;
      } while (paddedItemsHeight > surfaceHeight);
      break;
  }
  startX = (surfaceWidth - paddedItemsWidth) / 2;
  startY = (surfaceHeight - paddedItemsHeight) / 2;
  x = 0;
  y = 0;
  columnWidth = 0;
  for (i = 0; i < ln; i++) {
    sprite = sprites[i];
    bbox = bboxes[i];
    sprite.setAttributes({translationX:startX + x, translationY:startY + y});
    if (bbox.width > columnWidth) {
      columnWidth = bbox.width;
    }
    if ((i + 1) % columnSize === 0) {
      x += columnWidth + gap;
      y = 0;
      columnWidth = 0;
    } else {
      y += bbox.height + gap;
    }
  }
  if (border) {
    border.setAttributes({hidden:!ln, x:startX - gap, y:startY - gap, width:paddedItemsWidth + gap * 2, height:paddedItemsHeight + gap * 2});
  }
  size.width = border.attr.width + gap * 2;
  size.height = border.attr.height + gap * 2;
  if (size.width !== me.oldSize.width || size.height !== me.oldSize.height) {
    Ext.apply(me.oldSize, size);
    me.getChart().scheduleLayout();
    return false;
  }
  if (background) {
    me.resizeBackground(surface, background);
  }
  surface.renderFrame();
  return true;
}, getSprites:function() {
  this.updateSprites();
  return this.sprites;
}, createSprite:function(surface, record) {
  var me = this, data = record.data, chart = me.getChart(), series = chart.get(data.series), seriesMarker = series.getMarker(), sprite = null, markerConfig, labelConfig, legendItemConfig;
  if (surface) {
    markerConfig = series.getMarkerStyleByIndex(data.index);
    markerConfig.fillStyle = data.mark;
    if (seriesMarker && seriesMarker.type) {
      markerConfig.type = seriesMarker.type;
    }
    Ext.apply(markerConfig, me.getMarker());
    markerConfig.surface = surface;
    labelConfig = me.getLabel();
    legendItemConfig = {type:'legenditem', zIndex:me.spriteZIndexes.item, text:data.name, enabled:!data.disabled, marker:markerConfig, label:labelConfig, series:data.series, record:record};
    sprite = surface.add(legendItemConfig);
  }
  return sprite;
}, updateSprites:function() {
  var me = this, chart = me.getChart(), store = me.getStore(), surface = me.getSurface(), item, items, itemSprite, i, ln, sprites, unusedSprites, border;
  if (!(chart && store && surface)) {
    return;
  }
  me.sprites = sprites = me.sprites || [];
  items = store.getData().items;
  ln = items.length;
  for (i = 0; i < ln; i++) {
    item = items[i];
    itemSprite = sprites[i];
    if (itemSprite) {
      me.updateSprite(itemSprite, item);
    } else {
      itemSprite = me.createSprite(surface, item);
      surface.add(itemSprite);
      sprites.push(itemSprite);
    }
  }
  unusedSprites = Ext.Array.splice(sprites, i, sprites.length);
  for (i = 0, ln = unusedSprites.length; i < ln; i++) {
    itemSprite = unusedSprites[i];
    itemSprite.destroy();
  }
  border = me.getBorder();
  if (border) {
    me.borderSprite = border;
  }
  me.updateTheme(chart.getTheme());
}, updateSprite:function(sprite, record) {
  var data = record.data, chart = this.getChart(), series = chart.get(data.series), marker, label, markerConfig;
  if (sprite) {
    label = sprite.getLabel();
    label.setAttributes({text:data.name});
    sprite.setAttributes({enabled:!data.disabled});
    sprite.setConfig({series:data.series, record:record});
    markerConfig = series.getMarkerStyleByIndex(data.index);
    markerConfig.fillStyle = data.mark;
    Ext.apply(markerConfig, this.getMarker());
    marker = sprite.getMarker();
    marker.setAttributes({fillStyle:markerConfig.fillStyle, strokeStyle:markerConfig.strokeStyle});
    sprite.layoutUpdater(sprite.attr);
  }
}, updateChart:function(newChart, oldChart) {
  var me = this;
  if (oldChart) {
    me.setSurface(null);
  }
  if (newChart) {
    me.setSurface(newChart.getSurface('legend'));
  }
}, updateSurface:function(surface, oldSurface) {
  if (oldSurface) {
    oldSurface.el.un('click', 'onClick', this);
    oldSurface.removeAll(true);
  }
  if (surface) {
    surface.isLegendSurface = true;
    surface.el.on('click', 'onClick', this);
  }
}, onClick:function(event) {
  var chart = this.getChart(), surface = this.getSurface(), result, point;
  if (chart && chart.hasFirstLayout && surface) {
    point = surface.getEventXY(event);
    result = surface.hitTest(point);
    if (result && result.sprite) {
      this.toggleItem(result.sprite);
    }
  }
}, applyBackground:function(newBackground, oldBackground) {
  var me = this, chart = me.getChart(), surface = me.getSurface(), background;
  background = chart.refreshBackground(surface, newBackground, oldBackground);
  if (background) {
    background.setAttributes({zIndex:me.spriteZIndexes.background});
  }
  return background;
}, resizeBackground:function(surface, background) {
  var width = background.attr.width, height = background.attr.height, surfaceRect = surface.getRect();
  if (surfaceRect && (width !== surfaceRect[2] || height !== surfaceRect[3])) {
    background.setAttributes({width:surfaceRect[2], height:surfaceRect[3]});
  }
}, themeableConfigs:{background:true}, updateTheme:function(theme) {
  var me = this, surface = me.getSurface(), sprites = surface.getItems(), legendTheme = theme.getLegend(), labelConfig = me.getLabel(), configs = me.self.getConfigurator().configs, themeableConfigs = me.themeableConfigs, initialConfig = me.getInitialConfig(), defaultConfig = me.defaultConfig, value, cfg, isObjValue, isUnusedConfig, initialValue, sprite, style, labelSprite, key, attr, i, ln;
  for (i = 0, ln = sprites.length; i < ln; i++) {
    sprite = sprites[i];
    if (sprite.isLegendItem) {
      style = legendTheme.label;
      if (style) {
        attr = null;
        for (key in style) {
          if (!(key in labelConfig)) {
            attr = attr || {};
            attr[key] = style[key];
          }
        }
        if (attr) {
          labelSprite = sprite.getLabel();
          labelSprite.setAttributes(attr);
        }
      }
      continue;
    } else {
      if (sprite.isLegendBorder) {
        style = legendTheme.border;
      } else {
        continue;
      }
    }
    if (style) {
      attr = {};
      for (key in style) {
        if (!(key in sprite.config)) {
          attr[key] = style[key];
        }
      }
      sprite.setAttributes(attr);
    }
  }
  value = legendTheme.background;
  cfg = configs.background;
  if (value !== null && value !== undefined && cfg) {
  }
  for (key in legendTheme) {
    if (!(key in themeableConfigs)) {
      continue;
    }
    value = legendTheme[key];
    cfg = configs[key];
    if (value !== null && value !== undefined && cfg) {
      initialValue = initialConfig[key];
      isObjValue = Ext.isObject(value);
      isUnusedConfig = initialValue === defaultConfig[key];
      if (isObjValue) {
        if (isUnusedConfig && themeOnlyIfConfigured[key]) {
          continue;
        }
        value = Ext.merge({}, value, initialValue);
      }
      if (isUnusedConfig || isObjValue) {
        me[cfg.names.set](value);
      }
    }
  }
}, onDataChanged:function(store) {
  this.updateSprites();
  this.scheduleLayout();
}, onDataUpdate:function(store, record) {
  var me = this, sprites = me.sprites, ln = sprites.length, i = 0, sprite, spriteRecord, match;
  for (; i < ln; i++) {
    sprite = sprites[i];
    spriteRecord = sprite.getRecord();
    if (spriteRecord === record) {
      match = sprite;
      break;
    }
  }
  if (match) {
    me.updateSprite(match, record);
    me.scheduleLayout();
  }
}, toggleItem:function(sprite) {
  if (!this.getToggleable() || !sprite.isLegendItem) {
    return;
  }
  var store = this.getStore(), disabledCount = 0, canToggle = true, i, count, record, disabled;
  if (store) {
    count = store.getCount();
    for (i = 0; i < count; i++) {
      record = store.getAt(i);
      if (record.get('disabled')) {
        disabledCount++;
      }
    }
    canToggle = count - disabledCount > 1;
    record = sprite.getRecord();
    if (record) {
      disabled = record.get('disabled');
      if (disabled || canToggle) {
        record.set('disabled', !disabled);
        sprite.setAttributes({enabled:disabled});
      }
    }
  }
}, destroy:function() {
  var me = this;
  me.destroying = true;
  me.cancelLayout();
  me.setChart(null);
  me.callParent();
}});
Ext.define('Ext.chart.Caption', {mixins:['Ext.mixin.Observable', 'Ext.mixin.Bindable'], isCaption:true, config:{weight:0, text:'', align:'center', alignTo:'series', padding:0, hidden:false, docked:'top', style:{fontSize:'14px', fontWeight:'bold', fontFamily:'Verdana, Aria, sans-serif'}, chart:null, sprite:{type:'text', preciseMeasurement:true, zIndex:10}, debug:false, rect:null}, surfaceName:'caption', constructor:function(config) {
  var me = this, id;
  if ('id' in config) {
    id = config.id;
  } else {
    if ('id' in me.config) {
      id = me.config.id;
    } else {
      id = me.getId();
    }
  }
  me.setId(id);
  me.mixins.observable.constructor.call(me, config);
  me.initBindable();
}, updateChart:function() {
  if (!this.isConfiguring) {
    this.setSprite({type:'text'});
  }
}, applySprite:function(sprite) {
  var me = this, chart = me.getChart(), surface = me.surface = chart.getSurface(me.surfaceName);
  me.rectSprite = surface.add({type:'rect', fillStyle:'yellow', strokeStyle:'red'});
  return sprite && surface.add(sprite);
}, updateSprite:function(sprite, oldSprite) {
  if (oldSprite) {
    oldSprite.destroy();
  }
}, updateText:function(text) {
  this.getSprite().setAttributes({text:text});
}, updateStyle:function(style) {
  this.getSprite().setAttributes(style);
}, updateDebug:function(debug) {
  var me = this, sprite = me.getSprite();
  if (debug && !me.rectSprite) {
    me.rectSprite = me.surface.add({type:'rect', fillStyle:'yellow', strokeStyle:'red'});
  }
  if (sprite) {
    sprite.setAttributes({debug:debug ? {bbox:true} : null});
  }
  if (me.rectSprite) {
    me.rectSprite.setAttributes({hidden:!debug});
  }
  if (!me.isConfiguring) {
    me.surface.renderFrame();
  }
}, updateRect:function(rect) {
  if (this.rectSprite) {
    this.rectSprite.setAttributes({x:rect[0], y:rect[1], width:rect[2], height:rect[3]});
  }
}, updateDocked:function() {
  var chart = this.getChart();
  if (chart && !this.isConfiguring) {
    chart.scheduleLayout();
  }
}, computeRect:function(chartRect, shrinkRect) {
  if (this.getHidden()) {
    return null;
  }
  var rect = [0, 0, chartRect[2], 0], docked = this.getDocked(), padding = this.getPadding(), textSize = this.getSprite().getBBox(), height = textSize.height + padding * 2;
  switch(docked) {
    case 'top':
      rect[1] = shrinkRect.top;
      rect[3] = height;
      chartRect[1] += height;
      chartRect[3] -= height;
      shrinkRect.top += height;
      break;
    case 'bottom':
      chartRect[3] -= height;
      shrinkRect.bottom -= height;
      rect[1] = shrinkRect.bottom;
      rect[3] = height;
      break;
  }
  this.setRect(rect);
}, alignRect:function(seriesRect) {
  var surfaceRect = this.surface.getRect(), rect = this.getRect();
  rect[0] = seriesRect[0] - surfaceRect[0];
  rect[2] = seriesRect[2];
  this.setRect(rect.slice());
}, performLayout:function() {
  var me = this, rect = me.getRect(), x = rect[0], y = rect[1], width = rect[2], height = rect[3], sprite = me.getSprite(), tx = sprite.attr.translationX, ty = sprite.attr.translationY, bbox = sprite.getBBox(), align = me.getAlign(), dx, dy;
  switch(align) {
    case 'left':
      dx = x - bbox.x;
      break;
    case 'right':
      dx = x + width - (bbox.x + bbox.width);
      break;
    case 'center':
      dx = x + (width - bbox.width) / 2 - bbox.x;
      break;
  }
  dy = y + (height - bbox.height) / 2 - bbox.y;
  sprite.setAttributes({translationX:tx + dx, translationY:ty + dy});
}, destroy:function() {
  var me = this;
  if (me.rectSprite) {
    me.rectSprite.destroy();
  }
  me.getSprite().destroy();
  me.callParent();
}});
Ext.define('Ext.chart.legend.store.Item', {extend:'Ext.data.Model', fields:['id', 'name', 'mark', 'disabled', 'series', 'index']});
Ext.define('Ext.chart.legend.store.Store', {extend:'Ext.data.Store', requires:['Ext.chart.legend.store.Item'], model:'Ext.chart.legend.store.Item', isLegendStore:true, config:{autoDestroy:true}});
Ext.define('Ext.chart.AbstractChart', {extend:'Ext.draw.Container', requires:['Ext.chart.theme.Default', 'Ext.chart.series.Series', 'Ext.chart.interactions.Abstract', 'Ext.chart.axis.Axis', 'Ext.chart.Util', 'Ext.data.StoreManager', 'Ext.chart.legend.Legend', 'Ext.chart.legend.SpriteLegend', 'Ext.chart.Caption', 'Ext.chart.legend.store.Store', 'Ext.data.Store'], isChart:true, defaultBindProperty:'store', config:{store:'ext-empty-store', theme:'default', captions:null, style:null, animation:!Ext.isIE8, 
series:[], axes:[], legend:null, colors:null, insetPadding:{top:10, left:10, right:10, bottom:10}, background:null, interactions:[], mainRect:null, resizeHandler:null, highlightItem:null, surfaceZIndexes:{background:0, main:1, grid:2, series:3, axis:4, chart:5, caption:6, overlay:7, legend:8}}, legendStore:null, animationSuspendCount:0, chartLayoutSuspendCount:0, chartLayoutCount:0, scheduledLayoutId:null, axisThicknessSuspendCount:0, isThicknessChanged:false, constructor:function(config) {
  var me = this;
  me.itemListeners = {};
  me.surfaceMap = {};
  me.chartComponents = {};
  me.isInitializing = true;
  me.suspendChartLayout();
  me.animationSuspendCount++;
  me.callParent(arguments);
  me.isInitializing = false;
  me.getSurface('main');
  me.getSurface('chart').setFlipRtlText(me.getInherited().rtl);
  me.getSurface('overlay').waitFor(me.getSurface('series'));
  me.animationSuspendCount--;
  me.resumeChartLayout();
}, applyAnimation:function(animation, oldAnimation) {
  return Ext.chart.Util.applyAnimation(animation, oldAnimation);
}, updateAnimation:function() {
  if (this.isConfiguring) {
    return;
  }
  var seriesList = this.getSeries(), ln = seriesList.length, i, series;
  this.isSettingSeriesAnimation = true;
  for (i = 0; i < ln; i++) {
    series = seriesList[i];
    if (!series.isUserAnimation || this.animationSuspendCount) {
      series.setAnimation(series.getAnimation());
    }
  }
  this.isSettingSeriesAnimation = false;
}, getAnimation:function() {
  var result;
  if (this.animationSuspendCount) {
    result = {duration:0};
  } else {
    result = this.callParent();
  }
  return result;
}, suspendAnimation:function() {
  this.animationSuspendCount++;
  if (this.animationSuspendCount === 1) {
    this.updateAnimation();
  }
}, resumeAnimation:function() {
  this.animationSuspendCount--;
  if (this.animationSuspendCount === 0) {
    this.updateAnimation();
  }
}, applyInsetPadding:function(padding, oldPadding) {
  var result;
  if (!Ext.isObject(padding)) {
    result = Ext.util.Format.parseBox(padding);
  } else {
    if (!oldPadding) {
      result = padding;
    } else {
      result = Ext.apply(oldPadding, padding);
    }
  }
  return result;
}, suspendChartLayout:function() {
  var me = this;
  me.chartLayoutSuspendCount++;
  if (me.chartLayoutSuspendCount === 1) {
    if (me.scheduledLayoutId) {
      me.layoutInSuspension = true;
      me.cancelChartLayout();
    } else {
      me.layoutInSuspension = false;
    }
  }
}, resumeChartLayout:function() {
  var me = this;
  me.chartLayoutSuspendCount--;
  if (me.chartLayoutSuspendCount === 0) {
    if (me.layoutInSuspension) {
      me.scheduleLayout();
    }
  }
}, cancelChartLayout:function() {
  if (this.scheduledLayoutId) {
    Ext.draw.Animator.cancel(this.scheduledLayoutId);
    this.scheduledLayoutId = null;
    this.checkLayoutEnd();
  }
}, scheduleLayout:function() {
  var me = this;
  if (me.allowSchedule() && !me.scheduledLayoutId) {
    me.scheduledLayoutId = Ext.draw.Animator.schedule('doScheduleLayout', me);
  }
}, allowSchedule:function() {
  return true;
}, doScheduleLayout:function() {
  var me = this;
  me.scheduledLayoutId = null;
  if (me.chartLayoutSuspendCount) {
    me.layoutInSuspension = true;
  } else {
    me.performLayout();
  }
}, suspendThicknessChanged:function() {
  this.axisThicknessSuspendCount++;
}, resumeThicknessChanged:function() {
  if (this.axisThicknessSuspendCount > 0) {
    this.axisThicknessSuspendCount--;
    if (this.axisThicknessSuspendCount === 0 && this.isThicknessChanged) {
      this.onThicknessChanged();
    }
  }
}, onThicknessChanged:function() {
  if (this.axisThicknessSuspendCount === 0) {
    this.isThicknessChanged = false;
    this.performLayout();
  } else {
    this.isThicknessChanged = true;
  }
}, applySprites:function(sprites) {
  var surface = this.getSurface('chart');
  sprites = Ext.Array.from(sprites);
  surface.removeAll(true);
  surface.add(sprites);
  return sprites;
}, initItems:function() {
  var items = this.items, i, ln, item;
  if (items && !items.isMixedCollection) {
    this.items = [];
    items = Ext.Array.from(items);
    for (i = 0, ln = items.length; i < ln; i++) {
      item = items[i];
      if (item.type) {
        Ext.raise("To add custom sprites to the chart use the 'sprites' config.");
      } else {
        this.items.push(item);
      }
    }
  }
  this.callParent();
}, applyBackground:function(newBackground, oldBackground) {
  var surface = this.getSurface('background');
  return this.refreshBackground(surface, newBackground, oldBackground);
}, refreshBackground:function(surface, newBackground, oldBackground) {
  var width, height, isUpdateOld;
  if (newBackground) {
    if (oldBackground) {
      width = oldBackground.attr.width;
      height = oldBackground.attr.height;
      isUpdateOld = oldBackground.type === (newBackground.type || 'rect');
    }
    if (newBackground.isSprite) {
      oldBackground = newBackground;
    } else {
      if (newBackground.type === 'image' && Ext.isString(newBackground.src)) {
        if (isUpdateOld) {
          oldBackground.setAttributes({src:newBackground.src});
        } else {
          surface.remove(oldBackground, true);
          oldBackground = surface.add(newBackground);
        }
      } else {
        if (isUpdateOld) {
          oldBackground.setAttributes({fillStyle:newBackground});
        } else {
          surface.remove(oldBackground, true);
          oldBackground = surface.add({type:'rect', fillStyle:newBackground, animation:{customDurations:{x:0, y:0, width:0, height:0}}});
        }
      }
    }
  }
  if (width && height) {
    oldBackground.setAttributes({width:width, height:height});
  }
  oldBackground.setAnimation(this.getAnimation());
  return oldBackground;
}, defaultResizeHandler:function(size) {
  this.scheduleLayout();
  return false;
}, applyMainRect:function(newRect, rect) {
  if (!rect) {
    return newRect;
  }
  this.getSeries();
  this.getAxes();
  if (newRect[0] === rect[0] && newRect[1] === rect[1] && newRect[2] === rect[2] && newRect[3] === rect[3]) {
    return rect;
  } else {
    return newRect;
  }
}, register:function(component) {
  var map = this.chartComponents, id = component.getId();
  if (id === undefined) {
    Ext.raise('Chart component id is undefined. ' + 'Please ensure the component has an id.');
  }
  if (id in map) {
    Ext.raise('Registering duplicate chart component id "' + id + '"');
  }
  map[id] = component;
}, unregister:function(component) {
  var map = this.chartComponents, id = component.getId();
  delete map[id];
}, get:function(id) {
  return this.chartComponents[id];
}, getAxis:function(axis) {
  if (axis instanceof Ext.chart.axis.Axis) {
    return axis;
  } else {
    if (Ext.isNumber(axis)) {
      return this.getAxes()[axis];
    } else {
      if (Ext.isString(axis)) {
        return this.get(axis);
      }
    }
  }
}, getSurface:function(id, type) {
  id = id || 'main';
  type = type || id;
  var me = this, surface = this.callParent([id, type]), map = me.surfaceMap;
  if (!map[type]) {
    map[type] = [];
  }
  if (Ext.Array.indexOf(map[type], surface) < 0) {
    surface.type = type;
    map[type].push(surface);
    surface.on('destroy', me.forgetSurface, me);
  }
  return surface;
}, forgetSurface:function(surface) {
  var map = this.surfaceMap;
  if (!map || this.destroying) {
    return;
  }
  var group = map[surface.type], index = group ? Ext.Array.indexOf(group, surface) : -1;
  if (index >= 0) {
    group.splice(index, 1);
  }
}, applyAxes:function(newAxes, oldAxes) {
  var me = this, positions = {left:'right', right:'left'}, result = [], axis, oldAxis, linkedTo, id, i, j, ln, oldMap, series;
  me.animationSuspendCount++;
  me.getStore();
  if (!oldAxes) {
    oldAxes = [];
    oldAxes.map = {};
  }
  oldMap = oldAxes.map;
  result.map = {};
  newAxes = Ext.Array.from(newAxes, true);
  for (i = 0, ln = newAxes.length; i < ln; i++) {
    axis = newAxes[i];
    if (!axis) {
      continue;
    }
    if (axis instanceof Ext.chart.axis.Axis) {
      oldAxis = oldMap[axis.getId()];
      axis.setChart(me);
    } else {
      axis = Ext.Object.chain(axis);
      linkedTo = axis.linkedTo;
      id = axis.id;
      if (Ext.isNumber(linkedTo)) {
        axis = Ext.merge({}, newAxes[linkedTo], axis);
      } else {
        if (Ext.isString(linkedTo)) {
          Ext.Array.each(newAxes, function(item) {
            if (item.id === axis.linkedTo) {
              axis = Ext.merge({}, item, axis);
              return false;
            }
          });
        }
      }
      axis.id = id;
      axis.chart = me;
      if (me.getInherited().rtl) {
        axis.position = positions[axis.position] || axis.position;
      }
      id = axis.getId && axis.getId() || axis.id;
      axis = Ext.factory(axis, null, oldAxis = oldMap[id], 'axis');
    }
    if (axis) {
      result.push(axis);
      result.map[axis.getId()] = axis;
    }
  }
  me.axesChangeSeries = {};
  for (i in oldMap) {
    if (!result.map[i]) {
      oldAxis = oldMap[i];
      if (oldAxis && !oldAxis.destroyed) {
        for (j = 0, ln = oldAxis.boundSeries.length; j < ln; j++) {
          series = oldAxis.boundSeries[j];
          me.axesChangeSeries[series.getId()] = series;
        }
        oldAxis.destroy();
      }
    }
  }
  me.animationSuspendCount--;
  return result;
}, updateAxes:function(axes) {
  var me = this, seriesMap = me.axesChangeSeries, series, id, i, ln, axis;
  for (id in seriesMap) {
    series = seriesMap[id];
    series.onAxesChange(me, true);
  }
  for (i = 0, ln = axes.length; i < ln; i++) {
    axis = axes[i];
    axis.onSeriesChange(me);
  }
  if (!me.isConfiguring && !me.destroying) {
    me.scheduleLayout();
  }
}, circularCopyArray:function(inArray, startIndex, count) {
  var outArray = [], i, len = inArray && inArray.length;
  if (len) {
    for (i = 0; i < count; i++) {
      outArray.push(inArray[(startIndex + i) % len]);
    }
  }
  return outArray;
}, circularCopyObject:function(inObject, startIndex, count) {
  var me = this, name, value, outObject = {};
  if (count) {
    for (name in inObject) {
      if (inObject.hasOwnProperty(name)) {
        value = inObject[name];
        if (Ext.isArray(value)) {
          outObject[name] = me.circularCopyArray(value, startIndex, count);
        } else {
          outObject[name] = value;
        }
      }
    }
  }
  return outObject;
}, getColors:function() {
  var me = this, configColors = me.config.colors, theme = me.getTheme();
  if (Ext.isArray(configColors) && configColors.length > 0) {
    configColors = me.applyColors(configColors);
  }
  return configColors || theme && theme.getColors();
}, applyColors:function(newColors) {
  newColors = Ext.Array.map(newColors, function(color) {
    if (Ext.isString(color)) {
      return color;
    } else {
      return color.toString();
    }
  });
  return newColors;
}, updateColors:function(newColors) {
  var me = this, theme = me.getTheme(), colors = newColors || theme && theme.getColors(), colorIndex = 0, series = me.getSeries(), seriesCount = series && series.length, i, seriesItem, seriesColors, seriesColorCount;
  if (colors.length) {
    for (i = 0; i < seriesCount; i++) {
      seriesItem = series[i];
      seriesColorCount = seriesItem.themeColorCount();
      seriesColors = me.circularCopyArray(colors, colorIndex, seriesColorCount);
      colorIndex += seriesColorCount;
      seriesItem.updateChartColors(seriesColors);
    }
  }
  if (!me.isConfiguring) {
    me.refreshLegendStore();
  }
}, applyTheme:function(theme) {
  if (theme && theme.isTheme) {
    return theme;
  }
  return Ext.Factory.chartTheme(theme);
}, updateGradients:function(gradients) {
  if (!Ext.isEmpty(gradients)) {
    this.updateTheme(this.getTheme());
  }
}, updateTheme:function(theme, oldTheme) {
  var me = this, axes = me.getAxes(), series = me.getSeries(), colors = me.getColors(), i;
  if (!series) {
    return;
  }
  me.updateChartTheme(theme);
  for (i = 0; i < axes.length; i++) {
    axes[i].updateTheme(theme);
  }
  for (i = 0; i < series.length; i++) {
    series[i].setTheme(theme);
  }
  me.updateSpriteTheme(theme);
  me.updateColors(colors);
  me.redraw();
  me.fireEvent('themechange', me, theme, oldTheme);
}, themeOnlyIfConfigured:{captions:true}, updateChartTheme:function(theme) {
  var me = this, chartTheme = theme.getChart(), initialConfig = me.getInitialConfig(), defaultConfig = me.defaultConfig, configs = me.self.getConfigurator().configs, genericChartTheme = chartTheme.defaults, specificChartTheme = chartTheme[me.xtype], themeOnlyIfConfigured = me.themeOnlyIfConfigured, key, value, isObjValue, isUnusedConfig, initialValue, cfg;
  chartTheme = Ext.merge({}, genericChartTheme, specificChartTheme);
  for (key in chartTheme) {
    value = chartTheme[key];
    cfg = configs[key];
    if (value !== null && value !== undefined && cfg) {
      initialValue = initialConfig[key];
      isObjValue = Ext.isObject(value);
      isUnusedConfig = initialValue === defaultConfig[key];
      if (isObjValue) {
        if (isUnusedConfig && themeOnlyIfConfigured[key]) {
          continue;
        }
        value = Ext.merge({}, value, initialValue);
      }
      if (isUnusedConfig || isObjValue) {
        me[cfg.names.set](value);
      }
    }
  }
}, updateSpriteTheme:function(theme) {
  this.getSprites();
  var me = this, chartSurface = me.getSurface('chart'), sprites = chartSurface.getItems(), styles = theme.getSprites(), sprite, style, key, attr, isText, i, ln;
  for (i = 0, ln = sprites.length; i < ln; i++) {
    sprite = sprites[i];
    style = styles[sprite.type];
    if (style) {
      attr = {};
      isText = sprite.type === 'text';
      for (key in style) {
        if (!(key in sprite.config)) {
          if (!(isText && key.indexOf('font') === 0 && sprite.config.font)) {
            attr[key] = style[key];
          }
        }
      }
      sprite.setAttributes(attr);
    }
  }
}, addSeries:function(newSeries) {
  var series = this.getSeries();
  series = series.concat(Ext.Array.from(newSeries));
  this.setSeries(series);
}, removeSeries:function(series) {
  series = Ext.Array.from(series);
  var existingSeries = this.getSeries(), newSeries = [], len = series.length, removeMap = {}, i, s;
  for (i = 0; i < len; i++) {
    s = series[i];
    if (typeof s !== 'string') {
      s = s.getId();
    }
    removeMap[s] = true;
  }
  for (i = 0, len = existingSeries.length; i < len; i++) {
    if (!removeMap[existingSeries[i].getId()]) {
      newSeries.push(existingSeries[i]);
    }
  }
  this.setSeries(newSeries);
}, applySeries:function(newSeries, oldSeries) {
  var me = this, theme = me.getTheme(), result = [], oldMap, oldSeriesItem, i, ln, series;
  me.animationSuspendCount++;
  me.getAxes();
  if (oldSeries) {
    oldMap = oldSeries.map;
  } else {
    oldSeries = [];
    oldMap = oldSeries.map = {};
  }
  result.map = {};
  newSeries = Ext.Array.from(newSeries, true);
  for (i = 0, ln = newSeries.length; i < ln; i++) {
    series = newSeries[i];
    if (!series) {
      continue;
    }
    oldSeriesItem = oldMap[series.getId && series.getId() || series.id];
    if (series instanceof Ext.chart.series.Series) {
      if (oldSeriesItem && oldSeriesItem !== series) {
        oldSeriesItem.destroy();
      }
      series.setChart(me);
    } else {
      if (Ext.isObject(series)) {
        if (oldSeriesItem) {
          oldSeriesItem.setConfig(series);
          series = oldSeriesItem;
        } else {
          if (Ext.isString(series)) {
            series = {type:series};
          }
          series.chart = me;
          series.theme = theme;
          series = Ext.create(series.xclass || 'series.' + series.type, series);
        }
      }
    }
    result.push(series);
    result.map[series.getId()] = series;
  }
  for (i in oldMap) {
    if (!result.map[oldMap[i].id]) {
      oldMap[i].destroy();
    }
  }
  me.animationSuspendCount--;
  return result;
}, updateSeries:function(newSeries, oldSeries) {
  var me = this;
  if (me.destroying) {
    return;
  }
  me.animationSuspendCount++;
  me.fireEvent('serieschange', me, newSeries, oldSeries);
  if (!Ext.isEmpty(newSeries)) {
    me.updateTheme(me.getTheme());
  }
  me.refreshLegendStore();
  if (!me.isConfiguring && !me.destroying) {
    me.scheduleLayout();
  }
  me.animationSuspendCount--;
}, defaultLegendType:'sprite', applyLegend:function(legend, oldLegend) {
  var me = this, result = null, alias;
  if (oldLegend && !(oldLegend.destroyed || oldLegend.destroying)) {
    if (me.legendStoreListeners) {
      me.legendStoreListeners.destroy();
    }
    if (me.legendStore) {
      me.legendStore.destroy();
    }
    oldLegend.destroy();
  }
  if (legend) {
    if (Ext.isBoolean(legend)) {
      result = Ext.create('legend.' + me.defaultLegendType, {docked:'bottom', chart:me});
    } else {
      legend.docked = legend.docked || 'bottom';
      legend.chart = me;
      alias = 'legend.' + (legend.type || me.defaultLegendType);
      result = Ext.create(alias, legend);
    }
  }
  return result;
}, updateLegend:function(legend) {
  var me = this;
  me.destroyLegendStore();
  if (legend) {
    me.getItems();
    legend.setStore(me.refreshLegendStore());
  }
  if (!me.isConfiguring) {
    me.scheduleLayout();
  }
}, captionApplier:function(caption, oldCaption) {
  var me = this, result;
  if (oldCaption && !(oldCaption.destroyed || oldCaption.destroying)) {
    oldCaption.destroy();
  }
  if (caption) {
    caption.chart = me;
    result = new Ext.chart.Caption(caption);
  }
  return result;
}, applyCaptions:function(captions, oldCaptions) {
  var map = {}, caption, oldCaption, name, any;
  for (name in captions) {
    caption = captions[name];
    if (caption && !caption.length && !(caption.text && caption.text.length)) {
      caption = null;
    } else {
      if (typeof caption === 'string') {
        caption = {text:caption};
        this.getInitialConfig().captions[name] = caption;
      }
    }
    oldCaption = oldCaptions && oldCaptions[name];
    caption = this.captionApplier(caption, oldCaption);
    if (caption) {
      any = true;
      map[name] = caption;
    }
  }
  return any && map;
}, updateCaptions:function() {
  var me = this;
  if (!me.isConfiguring) {
    me.scheduleLayout();
  }
}, getLegendStore:function() {
  var me = this, store = me.legendStore;
  if (!store) {
    store = me.legendStore = new Ext.chart.legend.store.Store({chart:me});
    me.legendStoreListeners = store.on({scope:me, update:'onLegendStoreUpdate', destroyable:true});
  }
  return store;
}, destroyLegendStore:function() {
  var store = this.legendStore;
  if (store && !(store.destroyed || store.destroying)) {
    store.destroy();
  }
  this.legendStore = null;
}, refreshLegendStore:function() {
  var me = this, legendStore = me.getLegendStore(), series;
  if (legendStore) {
    var seriesList = me.getSeries(), ln = seriesList.length, legendData = [], i = 0;
    for (; i < ln; i++) {
      series = seriesList[i];
      if (series.getShowInLegend()) {
        series.provideLegendInfo(legendData);
      }
    }
    legendStore.setData(legendData);
  }
  return legendStore;
}, onLegendStoreUpdate:function(store, record) {
  var me = this, series;
  if (record) {
    series = this.getSeries().map[record.get('series')];
    if (series) {
      series.setHiddenByIndex(record.get('index'), record.get('disabled'));
      me.redraw();
    }
  }
}, applyInteractions:function(interactions, oldInteractions) {
  interactions = Ext.Array.from(interactions, true);
  if (!oldInteractions) {
    oldInteractions = [];
    oldInteractions.map = {};
  }
  var me = this, result = [], oldMap = oldInteractions.map, i, ln, interaction;
  result.map = {};
  for (i = 0, ln = interactions.length; i < ln; i++) {
    interaction = interactions[i];
    if (!interaction) {
      continue;
    }
    interaction = Ext.factory(interaction, null, oldMap[interaction.getId && interaction.getId() || interaction.id], 'interaction');
    if (interaction) {
      interaction.setChart(me);
      result.push(interaction);
      result.map[interaction.getId()] = interaction;
    }
  }
  for (i in oldMap) {
    if (!result.map[i]) {
      oldMap[i].destroy();
    }
  }
  return result;
}, getInteraction:function(type) {
  var interactions = this.getInteractions(), len = interactions && interactions.length, out = null, interaction, i;
  if (len) {
    for (i = 0; i < len; ++i) {
      interaction = interactions[i];
      if (interaction.type === type) {
        out = interaction;
        break;
      }
    }
  }
  return out;
}, applyStore:function(store) {
  return store && Ext.StoreManager.lookup(store);
}, updateStore:function(newStore, oldStore) {
  var me = this;
  if (oldStore && !oldStore.destroyed) {
    oldStore.un({datachanged:'onDataChanged', update:'onDataChanged', scope:me, order:'after'});
    if (oldStore.autoDestroy) {
      oldStore.destroy();
    }
  }
  if (newStore) {
    newStore.on({datachanged:'onDataChanged', update:'onDataChanged', scope:me, order:'after'});
  }
  me.fireEvent('storechange', me, newStore, oldStore);
  me.onDataChanged();
}, redraw:function() {
  this.fireEvent('redraw', this);
}, performLayout:function() {
  if (this.destroying || this.destroyed) {
    Ext.raise('Attempting to lay out a dead chart: ' + this.getId());
    return false;
  }
  var me = this, legend = me.getLegend(), chartRect = me.getChartRect(true), background = me.getBackground(), result = true, legendRect;
  me.cancelChartLayout();
  me.fireEvent('beforelayout', me);
  if (background) {
    me.getSurface('background').setRect(chartRect.slice());
    background.setAttributes({width:chartRect[2], height:chartRect[3]});
  }
  if (legend && legend.isSpriteLegend && !legend.isTop) {
    legendRect = legend.computeRect(chartRect);
  }
  me.layoutCaptions(chartRect);
  if (legend && legend.isSpriteLegend && legend.isTop) {
    legendRect = legend.computeRect(chartRect);
  }
  if (legendRect) {
    me.getSurface('legend').setRect(legendRect);
    result = legend.performLayout();
  }
  me.getSurface('chart').setRect(chartRect);
  if (result) {
    me.hasFirstLayout = true;
  }
  return result;
}, layoutCaptions:function(chartRect) {
  var captions = this.getCaptions(), shrinkRect = {left:0, top:0, right:chartRect[2], bottom:chartRect[3]}, caption, captionName, captionList, i, ln;
  if (captions) {
    captionList = [];
    for (captionName in captions) {
      captionList.push(captions[captionName]);
    }
    captionList.sort(function(a, b) {
      return a.getWeight() - b.getWeight();
    });
    for (i = 0, ln = captionList.length; i < ln; i++) {
      caption = captionList[i];
      if (!i) {
        this.getSurface(caption.surfaceName).setRect(chartRect.slice());
      }
      caption.computeRect(chartRect, shrinkRect);
    }
    this.captionList = captionList;
  }
}, checkLayoutEnd:function() {
  if (!this.chartLayoutCount && !this.scheduledLayoutId) {
    this.onLayoutEnd();
  }
}, onLayoutEnd:function() {
  var me = this;
  me.fireEvent('layout', me);
}, getChartRect:function(isRecompute) {
  var me = this, chartRect, bodySize;
  if (isRecompute) {
    me.chartRect = null;
  }
  if (me.chartRect) {
    chartRect = me.chartRect;
  } else {
    bodySize = me.bodyElement.getSize();
    chartRect = me.chartRect = [0, 0, bodySize.width, bodySize.height];
  }
  return chartRect;
}, getEventXY:function(e) {
  return this.getSurface().getEventXY(e);
}, getItemForPoint:function(x, y) {
  var me = this, seriesList = me.getSeries(), rect = me.getMainRect(), ln = seriesList.length, item = null, i;
  if (!(me.hasFirstLayout && rect && x >= 0 && x <= rect[2] && y >= 0 && y <= rect[3])) {
    return null;
  }
  for (i = ln - 1; i >= 0; i--) {
    item = seriesList[i].getItemForPoint(x, y);
    if (item) {
      break;
    }
  }
  return item;
}, getItemsForPoint:function(x, y) {
  var me = this, seriesList = me.getSeries(), ln = seriesList.length, i = me.hasFirstLayout ? ln - 1 : -1, items = [], series, item;
  for (; i >= 0; i--) {
    series = seriesList[i];
    item = series.getItemForPoint(x, y);
    if (item) {
      items.push(item);
    }
  }
  return items;
}, onDataChanged:function() {
  var me = this;
  if (me.isInitializing) {
    return;
  }
  var rect = me.getMainRect(), store = me.getStore(), series = me.getSeries(), axes = me.getAxes();
  if (!store || !axes || !series) {
    return;
  }
  if (!rect) {
    me.on({redraw:me.onDataChanged, scope:me, single:true});
    return;
  }
  me.processData();
  me.redraw();
}, recordCount:0, processData:function() {
  var me = this, recordCount = me.getStore().getCount(), seriesList = me.getSeries(), ln = seriesList.length, isNeedUpdateColors = false, i = 0, series;
  for (; i < ln; i++) {
    series = seriesList[i];
    series.processData();
    if (!isNeedUpdateColors && series.isStoreDependantColorCount) {
      isNeedUpdateColors = true;
    }
  }
  if (isNeedUpdateColors && recordCount > me.recordCount) {
    me.updateColors(me.getColors());
    me.recordCount = recordCount;
  }
  if (!me.isConfiguring) {
    me.refreshLegendStore();
  }
}, bindStore:function(store) {
  this.setStore(store);
}, applyHighlightItem:function(newHighlightItem, oldHighlightItem) {
  if (newHighlightItem === oldHighlightItem) {
    return;
  }
  if (Ext.isObject(newHighlightItem) && Ext.isObject(oldHighlightItem)) {
    var i1 = newHighlightItem, i2 = oldHighlightItem, s1 = i1.sprite && (i1.sprite[0] || i1.sprite), s2 = i2.sprite && (i2.sprite[0] || i2.sprite);
    if (s1 === s2 && i1.index === i2.index) {
      return;
    }
  }
  return newHighlightItem;
}, updateHighlightItem:function(newHighlightItem, oldHighlightItem) {
  var newHighlight, oldHighlight;
  if (oldHighlightItem) {
    oldHighlight = oldHighlightItem.series.getHighlight();
    if (oldHighlight) {
      oldHighlightItem.series.setAttributesForItem(oldHighlightItem, {highlighted:false});
    }
  }
  if (newHighlightItem) {
    newHighlight = newHighlightItem.series.getHighlight();
    if (newHighlight) {
      newHighlightItem.series.setAttributesForItem(newHighlightItem, {highlighted:true});
    }
  }
  if (oldHighlight || newHighlight) {
    this.fireEvent('itemhighlight', this, newHighlightItem, oldHighlightItem);
  }
}, destroyChart:function() {
  var me = this;
  me.setInteractions(null);
  me.setAxes(null);
  me.setSeries(null);
  me.setLegend(null);
  me.setStore(null);
  me.cancelChartLayout();
}, getRefItems:function(deep) {
  var me = this, series = me.getSeries(), axes = me.getAxes(), interaction = me.getInteractions(), ans = [], i, ln;
  for (i = 0, ln = series.length; i < ln; i++) {
    ans.push(series[i]);
    if (series[i].getRefItems) {
      ans.push.apply(ans, series[i].getRefItems(deep));
    }
  }
  for (i = 0, ln = axes.length; i < ln; i++) {
    ans.push(axes[i]);
    if (axes[i].getRefItems) {
      ans.push.apply(ans, axes[i].getRefItems(deep));
    }
  }
  for (i = 0, ln = interaction.length; i < ln; i++) {
    ans.push(interaction[i]);
    if (interaction[i].getRefItems) {
      ans.push.apply(ans, interaction[i].getRefItems(deep));
    }
  }
  return ans;
}});
Ext.define('Ext.chart.overrides.AbstractChart', {override:'Ext.chart.AbstractChart', updateLegend:function(legend, oldLegend) {
  this.callParent([legend, oldLegend]);
  if (legend && legend.isDomLegend) {
    this.addDocked(legend);
  }
}, performLayout:function() {
  if (this.isVisible(true)) {
    return this.callParent();
  }
  this.cancelChartLayout();
  return false;
}, afterComponentLayout:function(width, height, oldWidth, oldHeight) {
  this.callParent([width, height, oldWidth, oldHeight]);
  if (!this.hasFirstLayout) {
    this.scheduleLayout();
  }
}, allowSchedule:function() {
  return this.rendered;
}, doDestroy:function() {
  this.destroyChart();
  this.callParent();
}});
Ext.define('Ext.chart.grid.HorizontalGrid', {extend:'Ext.draw.sprite.Sprite', alias:'grid.horizontal', inheritableStatics:{def:{processors:{x:'number', y:'number', width:'number', height:'number'}, defaults:{x:0, y:0, width:1, height:1, strokeStyle:'#DDD'}}}, render:function(surface, ctx, rect) {
  var attr = this.attr, y = surface.roundPixel(attr.y), halfLineWidth = ctx.lineWidth * 0.5;
  ctx.beginPath();
  ctx.rect(rect[0] - surface.matrix.getDX(), y + halfLineWidth, +rect[2], attr.height);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(rect[0] - surface.matrix.getDX(), y + halfLineWidth);
  ctx.lineTo(rect[0] + rect[2] - surface.matrix.getDX(), y + halfLineWidth);
  ctx.stroke();
}});
Ext.define('Ext.chart.grid.VerticalGrid', {extend:'Ext.draw.sprite.Sprite', alias:'grid.vertical', inheritableStatics:{def:{processors:{x:'number', y:'number', width:'number', height:'number'}, defaults:{x:0, y:0, width:1, height:1, strokeStyle:'#DDD'}}}, render:function(surface, ctx, rect) {
  var attr = this.attr, x = surface.roundPixel(attr.x), halfLineWidth = ctx.lineWidth * 0.5;
  ctx.beginPath();
  ctx.rect(x - halfLineWidth, rect[1] - surface.matrix.getDY(), attr.width, rect[3]);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - halfLineWidth, rect[1] - surface.matrix.getDY());
  ctx.lineTo(x - halfLineWidth, rect[1] + rect[3] - surface.matrix.getDY());
  ctx.stroke();
}});
Ext.define('Ext.chart.CartesianChart', {extend:'Ext.chart.AbstractChart', alternateClassName:'Ext.chart.Chart', requires:['Ext.chart.grid.HorizontalGrid', 'Ext.chart.grid.VerticalGrid'], xtype:['cartesian', 'chart'], isCartesian:true, config:{flipXY:false, innerRect:[0, 0, 1, 1], innerPadding:{top:0, left:0, right:0, bottom:0}}, applyInnerPadding:function(padding, oldPadding) {
  if (!Ext.isObject(padding)) {
    return Ext.util.Format.parseBox(padding);
  } else {
    if (!oldPadding) {
      return padding;
    } else {
      return Ext.apply(oldPadding, padding);
    }
  }
}, getDirectionForAxis:function(position) {
  var flipXY = this.getFlipXY(), direction;
  if (position === 'left' || position === 'right') {
    direction = flipXY ? 'X' : 'Y';
  } else {
    direction = flipXY ? 'Y' : 'X';
  }
  return direction;
}, performLayout:function() {
  var me = this;
  if (me.callParent() === false) {
    return;
  }
  me.chartLayoutCount++;
  me.suspendAnimation();
  var chartRect = me.getSurface('chart').getRect(), left = chartRect[0], top = chartRect[1], width = chartRect[2], height = chartRect[3], captionList = me.captionList, axes = me.getAxes(), axis, seriesList = me.getSeries(), series, axisSurface, thickness, insetPadding = me.getInsetPadding(), innerPadding = me.getInnerPadding(), surface, gridSurface, shrinkBox = Ext.apply({}, insetPadding), mainRect, innerWidth, innerHeight, elements, floating, floatingValue, matrix, i, ln, isRtl = me.getInherited().rtl, 
  flipXY = me.getFlipXY(), caption;
  if (width <= 0 || height <= 0) {
    return;
  }
  me.suspendThicknessChanged();
  for (i = 0; i < axes.length; i++) {
    axis = axes[i];
    axisSurface = axis.getSurface();
    floating = axis.getFloating();
    floatingValue = floating ? floating.value : null;
    thickness = axis.getThickness();
    switch(axis.getPosition()) {
      case 'top':
        axisSurface.setRect([left, top + shrinkBox.top + 1, width, thickness]);
        break;
      case 'bottom':
        axisSurface.setRect([left, top + height - (shrinkBox.bottom + thickness), width, thickness]);
        break;
      case 'left':
        axisSurface.setRect([left + shrinkBox.left, top, thickness, height]);
        break;
      case 'right':
        axisSurface.setRect([left + width - (shrinkBox.right + thickness), top, thickness, height]);
        break;
    }
    if (floatingValue === null) {
      shrinkBox[axis.getPosition()] += thickness;
    }
  }
  width -= shrinkBox.left + shrinkBox.right;
  height -= shrinkBox.top + shrinkBox.bottom;
  mainRect = [left + shrinkBox.left, top + shrinkBox.top, width, height];
  shrinkBox.left += innerPadding.left;
  shrinkBox.top += innerPadding.top;
  shrinkBox.right += innerPadding.right;
  shrinkBox.bottom += innerPadding.bottom;
  innerWidth = width - innerPadding.left - innerPadding.right;
  innerHeight = height - innerPadding.top - innerPadding.bottom;
  me.setInnerRect([shrinkBox.left, shrinkBox.top, innerWidth, innerHeight]);
  if (innerWidth <= 0 || innerHeight <= 0) {
    return;
  }
  me.setMainRect(mainRect);
  me.getSurface().setRect(mainRect);
  for (i = 0, ln = me.surfaceMap.grid && me.surfaceMap.grid.length; i < ln; i++) {
    gridSurface = me.surfaceMap.grid[i];
    gridSurface.setRect(mainRect);
    gridSurface.matrix.set(1, 0, 0, 1, innerPadding.left, innerPadding.top);
    gridSurface.matrix.inverse(gridSurface.inverseMatrix);
  }
  for (i = 0; i < axes.length; i++) {
    axis = axes[i];
    axis.getRange(true);
    axisSurface = axis.getSurface();
    matrix = axisSurface.matrix;
    elements = matrix.elements;
    switch(axis.getPosition()) {
      case 'top':
      case 'bottom':
        elements[4] = shrinkBox.left;
        axis.setLength(innerWidth);
        break;
      case 'left':
      case 'right':
        elements[5] = shrinkBox.top;
        axis.setLength(innerHeight);
        break;
    }
    axis.updateTitleSprite();
    matrix.inverse(axisSurface.inverseMatrix);
  }
  for (i = 0, ln = seriesList.length; i < ln; i++) {
    series = seriesList[i];
    surface = series.getSurface();
    surface.setRect(mainRect);
    if (flipXY) {
      if (isRtl) {
        surface.matrix.set(0, -1, -1, 0, innerPadding.left + innerWidth, innerPadding.top + innerHeight);
      } else {
        surface.matrix.set(0, -1, 1, 0, innerPadding.left, innerPadding.top + innerHeight);
      }
    } else {
      surface.matrix.set(1, 0, 0, -1, innerPadding.left, innerPadding.top + innerHeight);
    }
    surface.matrix.inverse(surface.inverseMatrix);
    series.getOverlaySurface().setRect(mainRect);
  }
  if (captionList) {
    for (i = 0, ln = captionList.length; i < ln; i++) {
      caption = captionList[i];
      if (caption.getAlignTo() === 'series') {
        caption.alignRect(mainRect);
      }
      caption.performLayout();
    }
  }
  me.afterChartLayout();
  me.redraw();
  me.resumeAnimation();
  me.resumeThicknessChanged();
  me.chartLayoutCount--;
  me.checkLayoutEnd();
}, afterChartLayout:Ext.emptyFn, refloatAxes:function() {
  var me = this, axes = me.getAxes(), axesCount = axes && axes.length || 0, axis, axisSurface, axisRect, floating, value, alongAxis, matrix, chartRect = me.getChartRect(), inset = me.getInsetPadding(), inner = me.getInnerPadding(), width = chartRect[2] - inset.left - inset.right, height = chartRect[3] - inset.top - inset.bottom, isHorizontal, i;
  for (i = 0; i < axesCount; i++) {
    axis = axes[i];
    floating = axis.getFloating();
    value = floating ? floating.value : null;
    if (value === null) {
      axis.floatingAtCoord = null;
      continue;
    }
    axisSurface = axis.getSurface();
    axisRect = axisSurface.getRect();
    if (!axisRect) {
      continue;
    }
    axisRect = axisRect.slice();
    alongAxis = me.getAxis(floating.alongAxis);
    if (alongAxis) {
      isHorizontal = alongAxis.getAlignment() === 'horizontal';
      if (Ext.isString(value)) {
        value = alongAxis.getCoordFor(value);
      }
      alongAxis.floatingAxes[axis.getId()] = value;
      matrix = alongAxis.getSprites()[0].attr.matrix;
      if (isHorizontal) {
        value = value * matrix.getXX() + matrix.getDX();
        axis.floatingAtCoord = value + inner.left + inner.right;
      } else {
        value = value * matrix.getYY() + matrix.getDY();
        axis.floatingAtCoord = value + inner.top + inner.bottom;
      }
    } else {
      isHorizontal = axis.getAlignment() === 'horizontal';
      if (isHorizontal) {
        axis.floatingAtCoord = value + inner.top + inner.bottom;
      } else {
        axis.floatingAtCoord = value + inner.left + inner.right;
      }
      value = axisSurface.roundPixel(0.01 * value * (isHorizontal ? height : width));
    }
    switch(axis.getPosition()) {
      case 'top':
        axisRect[1] = inset.top + inner.top + value - axisRect[3] + 1;
        break;
      case 'bottom':
        axisRect[1] = inset.top + inner.top + (alongAxis ? value : height - value);
        break;
      case 'left':
        axisRect[0] = inset.left + inner.left + value - axisRect[2];
        break;
      case 'right':
        axisRect[0] = inset.left + inner.left + (alongAxis ? value : width - value) - 1;
        break;
    }
    axisSurface.setRect(axisRect);
  }
}, redraw:function() {
  var me = this, seriesList = me.getSeries(), axes = me.getAxes(), rect = me.getMainRect(), innerWidth, innerHeight, innerPadding = me.getInnerPadding(), sprites, xRange, yRange, isSide, attr, i, j, ln, axis, axisX, axisY, range, visibleRange, flipXY = me.getFlipXY(), zBase = 1000, zIndex, markersZIndex, series, sprite, markers;
  if (!rect) {
    return;
  }
  innerWidth = rect[2] - innerPadding.left - innerPadding.right;
  innerHeight = rect[3] - innerPadding.top - innerPadding.bottom;
  for (i = 0; i < seriesList.length; i++) {
    series = seriesList[i];
    axisX = series.getXAxis();
    if (axisX) {
      visibleRange = axisX.getVisibleRange();
      xRange = axisX.getRange();
      xRange = [xRange[0] + (xRange[1] - xRange[0]) * visibleRange[0], xRange[0] + (xRange[1] - xRange[0]) * visibleRange[1]];
    } else {
      xRange = series.getXRange();
    }
    axisY = series.getYAxis();
    if (axisY) {
      visibleRange = axisY.getVisibleRange();
      yRange = axisY.getRange();
      yRange = [yRange[0] + (yRange[1] - yRange[0]) * visibleRange[0], yRange[0] + (yRange[1] - yRange[0]) * visibleRange[1]];
    } else {
      yRange = series.getYRange();
    }
    attr = {visibleMinX:xRange[0], visibleMaxX:xRange[1], visibleMinY:yRange[0], visibleMaxY:yRange[1], innerWidth:innerWidth, innerHeight:innerHeight, flipXY:flipXY};
    sprites = series.getSprites();
    for (j = 0, ln = sprites.length; j < ln; j++) {
      sprite = sprites[j];
      zIndex = sprite.attr.zIndex;
      if (zIndex < zBase) {
        zIndex += (i + 1) * 100 + zBase;
        sprite.attr.zIndex = zIndex;
        markers = sprite.getMarker('items');
        if (markers) {
          markersZIndex = markers.attr.zIndex;
          if (markersZIndex === Number.MAX_VALUE) {
            markers.attr.zIndex = zIndex;
          } else {
            if (markersZIndex < zBase) {
              markers.attr.zIndex = zIndex + markersZIndex;
            }
          }
        }
      }
      sprite.setAttributes(attr, true);
    }
  }
  for (i = 0; i < axes.length; i++) {
    axis = axes[i];
    isSide = axis.isSide();
    sprites = axis.getSprites();
    range = axis.getRange();
    visibleRange = axis.getVisibleRange();
    attr = {dataMin:range[0], dataMax:range[1], visibleMin:visibleRange[0], visibleMax:visibleRange[1]};
    if (isSide) {
      attr.length = innerHeight;
      attr.startGap = innerPadding.bottom;
      attr.endGap = innerPadding.top;
    } else {
      attr.length = innerWidth;
      attr.startGap = innerPadding.left;
      attr.endGap = innerPadding.right;
    }
    for (j = 0, ln = sprites.length; j < ln; j++) {
      sprites[j].setAttributes(attr, true);
    }
  }
  me.renderFrame();
  me.callParent();
}, renderFrame:function() {
  this.refloatAxes();
  this.callParent();
}});
Ext.define('Ext.chart.grid.CircularGrid', {extend:'Ext.draw.sprite.Circle', alias:'grid.circular', inheritableStatics:{def:{defaults:{r:1, strokeStyle:'#DDD'}}}});
Ext.define('Ext.chart.grid.RadialGrid', {extend:'Ext.draw.sprite.Path', alias:'grid.radial', inheritableStatics:{def:{processors:{startRadius:'number', endRadius:'number'}, defaults:{startRadius:0, endRadius:1, scalingCenterX:0, scalingCenterY:0, strokeStyle:'#DDD'}, triggers:{startRadius:'path,bbox', endRadius:'path,bbox'}}}, render:function() {
  this.callParent(arguments);
}, updatePath:function(path, attr) {
  var startRadius = attr.startRadius, endRadius = attr.endRadius;
  path.moveTo(startRadius, 0);
  path.lineTo(endRadius, 0);
}});
Ext.define('Ext.chart.PolarChart', {extend:'Ext.chart.AbstractChart', requires:['Ext.chart.grid.CircularGrid', 'Ext.chart.grid.RadialGrid'], xtype:'polar', isPolar:true, config:{center:[0, 0], radius:0, innerPadding:0}, getDirectionForAxis:function(position) {
  return position === 'radial' ? 'Y' : 'X';
}, updateCenter:function(center) {
  var me = this, axes = me.getAxes(), series = me.getSeries(), i, ln, axis, seriesItem;
  for (i = 0, ln = axes.length; i < ln; i++) {
    axis = axes[i];
    axis.setCenter(center);
  }
  for (i = 0, ln = series.length; i < ln; i++) {
    seriesItem = series[i];
    seriesItem.setCenter(center);
  }
}, applyInnerPadding:function(padding, oldPadding) {
  return Ext.isNumber(padding) ? padding : oldPadding;
}, updateInnerPadding:function() {
  if (!this.isConfiguring) {
    this.performLayout();
  }
}, doSetSurfaceRect:function(surface, rect) {
  var mainRect = this.getMainRect();
  surface.setRect(rect);
  surface.matrix.set(1, 0, 0, 1, mainRect[0] - rect[0], mainRect[1] - rect[1]);
  surface.inverseMatrix.set(1, 0, 0, 1, rect[0] - mainRect[0], rect[1] - mainRect[1]);
}, applyAxes:function(newAxes, oldAxes) {
  var me = this, firstSeries = Ext.Array.from(me.config.series)[0], i, ln, axis, foundAngular;
  if (firstSeries && firstSeries.type === 'radar' && newAxes && newAxes.length) {
    for (i = 0, ln = newAxes.length; i < ln; i++) {
      axis = newAxes[i];
      if (axis.position === 'angular') {
        foundAngular = true;
        break;
      }
    }
    if (!foundAngular) {
      newAxes.push({type:'category', position:'angular', fields:firstSeries.xField || firstSeries.angleField, style:{estStepSize:1}, grid:true});
    }
  }
  return this.callParent([newAxes, oldAxes]);
}, performLayout:function() {
  var me = this, applyThickness = true;
  try {
    me.chartLayoutCount++;
    me.suspendAnimation();
    if (this.callParent() === false) {
      applyThickness = false;
      return;
    }
    me.suspendThicknessChanged();
    var chartRect = me.getSurface('chart').getRect(), inset = me.getInsetPadding(), inner = me.getInnerPadding(), shrinkBox = Ext.apply({}, inset), width = Math.max(1, chartRect[2] - chartRect[0] - inset.left - inset.right), height = Math.max(1, chartRect[3] - chartRect[1] - inset.top - inset.bottom), mainRect = [chartRect[0] + inset.left, chartRect[1] + inset.top, width + chartRect[0], height + chartRect[1]], seriesList = me.getSeries(), innerWidth = width - inner * 2, innerHeight = height - inner * 
    2, center = [(chartRect[0] + innerWidth) * 0.5 + inner, (chartRect[1] + innerHeight) * 0.5 + inner], radius = Math.min(innerWidth, innerHeight) * 0.5, axes = me.getAxes(), angularAxes = [], radialAxes = [], seriesRadius = radius - inner, grid = me.surfaceMap.grid, captionList = me.captionList, i, ln, shrinkRadius, floating, floatingValue, gaugeSeries, gaugeRadius, side, series, axis, thickness, halfLineWidth, caption;
    me.setMainRect(mainRect);
    me.doSetSurfaceRect(me.getSurface(), mainRect);
    if (grid) {
      for (i = 0, ln = grid.length; i < ln; i++) {
        me.doSetSurfaceRect(grid[i], chartRect);
      }
    }
    for (i = 0, ln = axes.length; i < ln; i++) {
      axis = axes[i];
      switch(axis.getPosition()) {
        case 'angular':
          angularAxes.push(axis);
          break;
        case 'radial':
          radialAxes.push(axis);
          break;
      }
    }
    for (i = 0, ln = angularAxes.length; i < ln; i++) {
      axis = angularAxes[i];
      floating = axis.getFloating();
      floatingValue = floating ? floating.value : null;
      me.doSetSurfaceRect(axis.getSurface(), chartRect);
      thickness = axis.getThickness();
      for (side in shrinkBox) {
        shrinkBox[side] += thickness;
      }
      width = chartRect[2] - shrinkBox.left - shrinkBox.right;
      height = chartRect[3] - shrinkBox.top - shrinkBox.bottom;
      shrinkRadius = Math.min(width, height) * 0.5;
      if (i === 0) {
        seriesRadius = shrinkRadius - inner;
      }
      axis.setMinimum(0);
      axis.setLength(shrinkRadius);
      axis.getSprites();
      halfLineWidth = axis.sprites[0].attr.lineWidth * 0.5;
      for (side in shrinkBox) {
        shrinkBox[side] += halfLineWidth;
      }
    }
    for (i = 0, ln = radialAxes.length; i < ln; i++) {
      axis = radialAxes[i];
      me.doSetSurfaceRect(axis.getSurface(), chartRect);
      axis.setMinimum(0);
      axis.setLength(seriesRadius);
      axis.getSprites();
    }
    for (i = 0, ln = seriesList.length; i < ln; i++) {
      series = seriesList[i];
      if (series.type === 'gauge' && !gaugeSeries) {
        gaugeSeries = series;
      } else {
        series.setRadius(seriesRadius);
      }
      me.doSetSurfaceRect(series.getSurface(), mainRect);
    }
    me.doSetSurfaceRect(me.getSurface('overlay'), chartRect);
    if (gaugeSeries) {
      gaugeSeries.setRect(mainRect);
      gaugeRadius = gaugeSeries.getRadius() - inner;
      me.setRadius(gaugeRadius);
      me.setCenter(gaugeSeries.getCenter());
      gaugeSeries.setRadius(gaugeRadius);
      if (axes.length && axes[0].getPosition() === 'gauge') {
        axis = axes[0];
        me.doSetSurfaceRect(axis.getSurface(), chartRect);
        axis.setTotalAngle(gaugeSeries.getTotalAngle());
        axis.setLength(gaugeRadius);
      }
    } else {
      me.setRadius(radius);
      me.setCenter(center);
    }
    if (captionList) {
      for (i = 0, ln = captionList.length; i < ln; i++) {
        caption = captionList[i];
        if (caption.getAlignTo() === 'series') {
          caption.alignRect(mainRect);
        }
        caption.performLayout();
      }
    }
    me.redraw();
  } finally {
    me.resumeAnimation();
    if (applyThickness) {
      me.resumeThicknessChanged();
    }
    me.chartLayoutCount--;
    me.checkLayoutEnd();
  }
}, refloatAxes:function() {
  var me = this, axes = me.getAxes(), mainRect = me.getMainRect(), floating, value, alongAxis, i, n, axis, radius;
  if (!mainRect) {
    return;
  }
  radius = 0.5 * Math.min(mainRect[2], mainRect[3]);
  for (i = 0, n = axes.length; i < n; i++) {
    axis = axes[i];
    floating = axis.getFloating();
    value = floating ? floating.value : null;
    if (value !== null) {
      alongAxis = me.getAxis(floating.alongAxis);
      if (axis.getPosition() === 'angular') {
        if (alongAxis) {
          value = alongAxis.getLength() * value / alongAxis.getRange()[1];
        } else {
          value = 0.01 * value * radius;
        }
        axis.sprites[0].setAttributes({length:value}, true);
      } else {
        if (alongAxis) {
          if (Ext.isString(value)) {
            value = alongAxis.getCoordFor(value);
          }
          value = value / (alongAxis.getRange()[1] + 1) * Math.PI * 2 - Math.PI * 1.5 + axis.getRotation();
        } else {
          value = Ext.draw.Draw.rad(value);
        }
        axis.sprites[0].setAttributes({baseRotation:value}, true);
      }
    }
  }
}, redraw:function() {
  var me = this, axes = me.getAxes(), axis, seriesList = me.getSeries(), series, i, ln;
  for (i = 0, ln = axes.length; i < ln; i++) {
    axis = axes[i];
    axis.getSprites();
  }
  for (i = 0, ln = seriesList.length; i < ln; i++) {
    series = seriesList[i];
    series.getSprites();
  }
  me.renderFrame();
  me.callParent();
}, renderFrame:function() {
  this.refloatAxes();
  this.callParent();
}});
Ext.define('Ext.chart.SpaceFillingChart', {extend:'Ext.chart.AbstractChart', xtype:'spacefilling', config:{}, performLayout:function() {
  var me = this;
  try {
    me.chartLayoutCount++;
    me.suspendAnimation();
    if (me.callParent() === false) {
      return;
    }
    var chartRect = me.getSurface('chart').getRect(), padding = me.getInsetPadding(), width = chartRect[2] - padding.left - padding.right, height = chartRect[3] - padding.top - padding.bottom, mainRect = [padding.left, padding.top, width, height], seriesList = me.getSeries(), series, i, ln;
    me.getSurface().setRect(mainRect);
    me.setMainRect(mainRect);
    for (i = 0, ln = seriesList.length; i < ln; i++) {
      series = seriesList[i];
      series.getSurface().setRect(mainRect);
      if (series.setRect) {
        series.setRect(mainRect);
      }
      series.getOverlaySurface().setRect(chartRect);
    }
    me.redraw();
  } finally {
    me.resumeAnimation();
    me.chartLayoutCount--;
    me.checkLayoutEnd();
  }
}, redraw:function() {
  var me = this, seriesList = me.getSeries(), series, i, ln;
  for (i = 0, ln = seriesList.length; i < ln; i++) {
    series = seriesList[i];
    series.getSprites();
  }
  me.renderFrame();
  me.callParent();
}});
Ext.define('Ext.chart.axis.sprite.Axis3D', {extend:'Ext.chart.axis.sprite.Axis', alias:'sprite.axis3d', type:'axis3d', inheritableStatics:{def:{processors:{depth:'number'}, defaults:{depth:0}, triggers:{depth:'layout'}}}, config:{animation:{customDurations:{depth:0}}}, layoutUpdater:function() {
  var me = this, chart = me.getAxis().getChart();
  if (chart.isInitializing) {
    return;
  }
  var attr = me.attr, layout = me.getLayout(), depth = layout.isDiscrete ? 0 : attr.depth, isRtl = chart.getInherited().rtl, min = attr.dataMin + (attr.dataMax - attr.dataMin) * attr.visibleMin, max = attr.dataMin + (attr.dataMax - attr.dataMin) * attr.visibleMax, context = {attr:attr, segmenter:me.getSegmenter(), renderer:me.defaultRenderer};
  if (attr.position === 'left' || attr.position === 'right') {
    attr.translationX = 0;
    attr.translationY = max * (attr.length - depth) / (max - min) + depth;
    attr.scalingX = 1;
    attr.scalingY = (-attr.length + depth) / (max - min);
    attr.scalingCenterY = 0;
    attr.scalingCenterX = 0;
    me.applyTransformations(true);
  } else {
    if (attr.position === 'top' || attr.position === 'bottom') {
      if (isRtl) {
        attr.translationX = attr.length + min * attr.length / (max - min) + 1;
      } else {
        attr.translationX = -min * attr.length / (max - min);
      }
      attr.translationY = 0;
      attr.scalingX = (isRtl ? -1 : 1) * (attr.length - depth) / (max - min);
      attr.scalingY = 1;
      attr.scalingCenterY = 0;
      attr.scalingCenterX = 0;
      me.applyTransformations(true);
    }
  }
  if (layout) {
    layout.calculateLayout(context);
    me.setLayoutContext(context);
  }
}, renderAxisLine:function(surface, ctx, layout, clipRect) {
  var me = this, attr = me.attr, halfLineWidth = attr.lineWidth * 0.5, layout = me.getLayout(), depth = layout.isDiscrete ? 0 : attr.depth, docked = attr.position, position, gaugeAngles;
  if (attr.axisLine && attr.length) {
    switch(docked) {
      case 'left':
        position = surface.roundPixel(clipRect[2]) - halfLineWidth;
        ctx.moveTo(position, -attr.endGap + depth);
        ctx.lineTo(position, attr.length + attr.startGap);
        break;
      case 'right':
        ctx.moveTo(halfLineWidth, -attr.endGap);
        ctx.lineTo(halfLineWidth, attr.length + attr.startGap);
        break;
      case 'bottom':
        ctx.moveTo(-attr.startGap, halfLineWidth);
        ctx.lineTo(attr.length - depth + attr.endGap, halfLineWidth);
        break;
      case 'top':
        position = surface.roundPixel(clipRect[3]) - halfLineWidth;
        ctx.moveTo(-attr.startGap, position);
        ctx.lineTo(attr.length + attr.endGap, position);
        break;
      case 'angular':
        ctx.moveTo(attr.centerX + attr.length, attr.centerY);
        ctx.arc(attr.centerX, attr.centerY, attr.length, 0, Math.PI * 2, true);
        break;
      case 'gauge':
        gaugeAngles = me.getGaugeAngles();
        ctx.moveTo(attr.centerX + Math.cos(gaugeAngles.start) * attr.length, attr.centerY + Math.sin(gaugeAngles.start) * attr.length);
        ctx.arc(attr.centerX, attr.centerY, attr.length, gaugeAngles.start, gaugeAngles.end, true);
        break;
    }
  }
}});
Ext.define('Ext.chart.axis.Axis3D', {extend:'Ext.chart.axis.Axis', xtype:'axis3d', requires:['Ext.chart.axis.sprite.Axis3D'], config:{depth:0}, onSeriesChange:function(chart) {
  var me = this, eventName = 'depthchange', listenerName = 'onSeriesDepthChange', i, series;
  function toggle(action) {
    var boundSeries = me.boundSeries;
    for (i = 0; i < boundSeries.length; i++) {
      series = boundSeries[i];
      series[action](eventName, listenerName, me);
    }
  }
  toggle('un');
  me.callParent(arguments);
  toggle('on');
}, onSeriesDepthChange:function(series, depth) {
  var me = this, maxDepth = depth, boundSeries = me.boundSeries, i, item;
  if (depth > me.getDepth()) {
    maxDepth = depth;
  } else {
    for (i = 0; i < boundSeries.length; i++) {
      item = boundSeries[i];
      if (item !== series && item.getDepth) {
        depth = item.getDepth();
        if (depth > maxDepth) {
          maxDepth = depth;
        }
      }
    }
  }
  me.setDepth(maxDepth);
}, updateDepth:function(depth) {
  var me = this, sprites = me.getSprites(), attr = {depth:depth};
  if (sprites && sprites.length) {
    sprites[0].setAttributes(attr);
  }
  if (me.gridSpriteEven && me.gridSpriteOdd) {
    me.gridSpriteEven.getTemplate().setAttributes(attr);
    me.gridSpriteOdd.getTemplate().setAttributes(attr);
  }
}, getGridAlignment:function() {
  switch(this.getPosition()) {
    case 'left':
    case 'right':
      return 'horizontal3d';
    case 'top':
    case 'bottom':
      return 'vertical3d';
  }
}});
Ext.define('Ext.chart.axis.Category', {requires:['Ext.chart.axis.layout.CombineDuplicate', 'Ext.chart.axis.segmenter.Names'], extend:'Ext.chart.axis.Axis', alias:'axis.category', type:'category', isCategory:true, config:{layout:'combineDuplicate', segmenter:'names'}});
Ext.define('Ext.chart.axis.Category3D', {requires:['Ext.chart.axis.layout.CombineDuplicate', 'Ext.chart.axis.segmenter.Names'], extend:'Ext.chart.axis.Axis3D', alias:'axis.category3d', type:'category3d', config:{layout:'combineDuplicate', segmenter:'names'}});
Ext.define('Ext.chart.axis.Numeric', {extend:'Ext.chart.axis.Axis', type:'numeric', alias:['axis.numeric', 'axis.radial'], requires:['Ext.chart.axis.layout.Continuous', 'Ext.chart.axis.segmenter.Numeric'], config:{layout:'continuous', segmenter:'numeric', aggregator:'double'}});
Ext.define('Ext.chart.axis.Numeric3D', {extend:'Ext.chart.axis.Axis3D', alias:['axis.numeric3d'], type:'numeric3d', requires:['Ext.chart.axis.layout.Continuous', 'Ext.chart.axis.segmenter.Numeric'], config:{layout:'continuous', segmenter:'numeric', aggregator:'double'}});
Ext.define('Ext.chart.axis.Time', {extend:'Ext.chart.axis.Numeric', alias:'axis.time', type:'time', requires:['Ext.chart.axis.layout.Continuous', 'Ext.chart.axis.segmenter.Time'], config:{dateFormat:null, fromDate:null, toDate:null, layout:'continuous', segmenter:'time', aggregator:'time'}, updateDateFormat:function(format) {
  var renderer = this.getRenderer();
  if (!renderer || renderer.isDefault) {
    renderer = function(axis, date) {
      return Ext.Date.format(new Date(date), format);
    };
    renderer.isDefault = true;
    this.setRenderer(renderer);
    this.performLayout();
  }
}, updateRenderer:function(renderer) {
  var dateFormat = this.getDateFormat();
  if (renderer) {
    this.performLayout();
  } else {
    if (dateFormat) {
      this.updateDateFormat(dateFormat);
    }
  }
}, updateFromDate:function(date) {
  this.setMinimum(+date);
}, updateToDate:function(date) {
  this.setMaximum(+date);
}, getCoordFor:function(value) {
  if (Ext.isString(value)) {
    value = new Date(value);
  }
  return +value;
}});
Ext.define('Ext.chart.axis.Time3D', {extend:'Ext.chart.axis.Numeric3D', alias:'axis.time3d', type:'time3d', requires:['Ext.chart.axis.layout.Continuous', 'Ext.chart.axis.segmenter.Time'], config:{dateFormat:null, fromDate:null, toDate:null, layout:'continuous', segmenter:'time', aggregator:'time'}, updateDateFormat:function(format) {
  this.setRenderer(function(axis, date) {
    return Ext.Date.format(new Date(date), format);
  });
}, updateFromDate:function(date) {
  this.setMinimum(+date);
}, updateToDate:function(date) {
  this.setMaximum(+date);
}, getCoordFor:function(value) {
  if (Ext.isString(value)) {
    value = new Date(value);
  }
  return +value;
}});
Ext.define('Ext.chart.grid.HorizontalGrid3D', {extend:'Ext.chart.grid.HorizontalGrid', alias:'grid.horizontal3d', inheritableStatics:{def:{processors:{depth:'number'}, defaults:{depth:0}}}, render:function(surface, ctx, rect) {
  var attr = this.attr, x = surface.roundPixel(attr.x), y = surface.roundPixel(attr.y), dx = surface.matrix.getDX(), halfLineWidth = ctx.lineWidth * 0.5, height = attr.height, depth = attr.depth, left, top;
  if (y <= rect[1]) {
    return;
  }
  left = rect[0] + depth - dx;
  top = y + halfLineWidth - depth;
  ctx.beginPath();
  ctx.rect(left, top, rect[2], height);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left + rect[2], top);
  ctx.stroke();
  left = rect[0] + x - dx;
  top = y + halfLineWidth;
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left + depth, top - depth);
  ctx.lineTo(left + depth, top - depth + height);
  ctx.lineTo(left, top + height);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left + depth, top - depth);
  ctx.stroke();
}});
Ext.define('Ext.chart.grid.VerticalGrid3D', {extend:'Ext.chart.grid.VerticalGrid', alias:'grid.vertical3d', inheritableStatics:{def:{processors:{depth:'number'}, defaults:{depth:0}}}, render:function(surface, ctx, clipRect) {
  var attr = this.attr, x = surface.roundPixel(attr.x), dy = surface.matrix.getDY(), halfLineWidth = ctx.lineWidth * 0.5, width = attr.width, depth = attr.depth, left, top;
  if (x >= clipRect[2]) {
    return;
  }
  left = x - halfLineWidth + depth;
  top = clipRect[1] - depth - dy;
  ctx.beginPath();
  ctx.rect(left, top, width, clipRect[3]);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left, top + clipRect[3]);
  ctx.stroke();
  left = x - halfLineWidth;
  top = clipRect[3];
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left + depth, top - depth);
  ctx.lineTo(left + depth + width, top - depth);
  ctx.lineTo(left + width, top);
  ctx.closePath();
  ctx.fill();
  left = x - halfLineWidth;
  top = clipRect[3];
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left + depth, top - depth);
  ctx.stroke();
}});
Ext.define('Ext.chart.interactions.CrossZoom', {extend:'Ext.chart.interactions.Abstract', type:'crosszoom', alias:'interaction.crosszoom', isCrossZoom:true, config:{axes:true, gestures:{dragstart:'onGestureStart', drag:'onGesture', dragend:'onGestureEnd', dblclick:'onDoubleTap'}, undoButton:{}}, stopAnimationBeforeSync:false, zoomAnimationInProgress:false, constructor:function() {
  this.callParent(arguments);
  this.zoomHistory = [];
}, applyAxes:function(axesConfig) {
  var result = {};
  if (axesConfig === true) {
    return {top:{}, right:{}, bottom:{}, left:{}};
  } else {
    if (Ext.isArray(axesConfig)) {
      result = {};
      Ext.each(axesConfig, function(axis) {
        result[axis] = {};
      });
    } else {
      if (Ext.isObject(axesConfig)) {
        Ext.iterate(axesConfig, function(key, val) {
          if (val === true) {
            result[key] = {};
          } else {
            if (val !== false) {
              result[key] = val;
            }
          }
        });
      }
    }
  }
  return result;
}, applyUndoButton:function(button, oldButton) {
  var me = this;
  if (oldButton) {
    oldButton.destroy();
  }
  if (button) {
    return Ext.create('Ext.Button', Ext.apply({cls:[], text:'Undo Zoom', disabled:true, handler:function() {
      me.undoZoom();
    }}, button));
  }
}, getSurface:function() {
  return this.getChart() && this.getChart().getSurface('main');
}, setSeriesOpacity:function(opacity) {
  var surface = this.getChart() && this.getChart().getSurface('series');
  if (surface) {
    surface.element.setStyle('opacity', opacity);
  }
}, onGestureStart:function(e) {
  var me = this, chart = me.getChart(), surface = me.getSurface(), rect = chart.getInnerRect(), innerPadding = chart.getInnerPadding(), minX = innerPadding.left, maxX = minX + rect[2], minY = innerPadding.top, maxY = minY + rect[3], xy = chart.getEventXY(e), x = xy[0], y = xy[1];
  e.claimGesture();
  if (me.zoomAnimationInProgress) {
    return;
  }
  if (x > minX && x < maxX && y > minY && y < maxY) {
    me.gestureEvent = 'drag';
    me.lockEvents(me.gestureEvent);
    me.startX = x;
    me.startY = y;
    me.selectionRect = surface.add({type:'rect', globalAlpha:0.5, fillStyle:'rgba(80,80,140,0.5)', strokeStyle:'rgba(80,80,140,1)', lineWidth:2, x:x, y:y, width:0, height:0, zIndex:10000});
    me.setSeriesOpacity(0.8);
    return false;
  }
}, onGesture:function(e) {
  var me = this;
  if (me.zoomAnimationInProgress) {
    return;
  }
  if (me.getLocks()[me.gestureEvent] === me) {
    var chart = me.getChart(), surface = me.getSurface(), rect = chart.getInnerRect(), innerPadding = chart.getInnerPadding(), minX = innerPadding.left, maxX = minX + rect[2], minY = innerPadding.top, maxY = minY + rect[3], xy = chart.getEventXY(e), x = xy[0], y = xy[1];
    if (x < minX) {
      x = minX;
    } else {
      if (x > maxX) {
        x = maxX;
      }
    }
    if (y < minY) {
      y = minY;
    } else {
      if (y > maxY) {
        y = maxY;
      }
    }
    me.selectionRect.setAttributes({width:x - me.startX, height:y - me.startY});
    if (Math.abs(me.startX - x) < 11 || Math.abs(me.startY - y) < 11) {
      me.selectionRect.setAttributes({globalAlpha:0.5});
    } else {
      me.selectionRect.setAttributes({globalAlpha:1});
    }
    surface.renderFrame();
    return false;
  }
}, onGestureEnd:function(e) {
  var me = this;
  if (me.zoomAnimationInProgress) {
    return;
  }
  if (me.getLocks()[me.gestureEvent] === me) {
    var chart = me.getChart(), surface = me.getSurface(), rect = chart.getInnerRect(), innerPadding = chart.getInnerPadding(), minX = innerPadding.left, maxX = minX + rect[2], minY = innerPadding.top, maxY = minY + rect[3], rectWidth = rect[2], rectHeight = rect[3], xy = chart.getEventXY(e), x = xy[0], y = xy[1];
    if (x < minX) {
      x = minX;
    } else {
      if (x > maxX) {
        x = maxX;
      }
    }
    if (y < minY) {
      y = minY;
    } else {
      if (y > maxY) {
        y = maxY;
      }
    }
    if (Math.abs(me.startX - x) < 11 || Math.abs(me.startY - y) < 11) {
      surface.remove(me.selectionRect);
    } else {
      me.zoomBy([Math.min(me.startX, x) / rectWidth, 1 - Math.max(me.startY, y) / rectHeight, Math.max(me.startX, x) / rectWidth, 1 - Math.min(me.startY, y) / rectHeight]);
      me.selectionRect.setAttributes({x:Math.min(me.startX, x), y:Math.min(me.startY, y), width:Math.abs(me.startX - x), height:Math.abs(me.startY - y)});
      me.selectionRect.setAnimation(chart.getAnimation() || {duration:0});
      me.selectionRect.setAttributes({globalAlpha:0, x:0, y:0, width:rectWidth, height:rectHeight});
      me.zoomAnimationInProgress = true;
      chart.suspendThicknessChanged();
      me.selectionRect.getAnimation().on('animationend', function() {
        chart.resumeThicknessChanged();
        surface.remove(me.selectionRect);
        me.selectionRect = null;
        me.zoomAnimationInProgress = false;
      });
    }
    surface.renderFrame();
    me.sync();
    me.unlockEvents(me.gestureEvent);
    me.setSeriesOpacity(1);
    if (!me.zoomAnimationInProgress) {
      surface.remove(me.selectionRect);
      me.selectionRect = null;
    }
  }
}, zoomBy:function(rect) {
  var me = this, axisConfigs = me.getAxes(), chart = me.getChart(), axes = chart.getAxes(), isRtl = chart.getInherited().rtl, config, zoomMap = {}, x1, x2;
  if (isRtl) {
    rect = rect.slice();
    x1 = 1 - rect[0];
    x2 = 1 - rect[2];
    rect[0] = Math.min(x1, x2);
    rect[2] = Math.max(x1, x2);
  }
  for (var i = 0; i < axes.length; i++) {
    var axis = axes[i];
    config = axisConfigs[axis.getPosition()];
    if (config && config.allowZoom !== false) {
      var isSide = axis.isSide(), oldRange = axis.getVisibleRange();
      zoomMap[axis.getId()] = oldRange.slice(0);
      if (!isSide) {
        axis.setVisibleRange([(oldRange[1] - oldRange[0]) * rect[0] + oldRange[0], (oldRange[1] - oldRange[0]) * rect[2] + oldRange[0]]);
      } else {
        axis.setVisibleRange([(oldRange[1] - oldRange[0]) * rect[1] + oldRange[0], (oldRange[1] - oldRange[0]) * rect[3] + oldRange[0]]);
      }
    }
  }
  me.zoomHistory.push(zoomMap);
  me.getUndoButton().setDisabled(false);
}, undoZoom:function() {
  var zoomMap = this.zoomHistory.pop(), axes = this.getChart().getAxes();
  if (zoomMap) {
    for (var i = 0; i < axes.length; i++) {
      var axis = axes[i];
      if (zoomMap[axis.getId()]) {
        axis.setVisibleRange(zoomMap[axis.getId()]);
      }
    }
  }
  this.getUndoButton().setDisabled(this.zoomHistory.length === 0);
  this.sync();
}, onDoubleTap:function(e) {
  this.undoZoom();
}, destroy:function() {
  this.setUndoButton(null);
  this.callParent();
}});
Ext.define('Ext.chart.interactions.Crosshair', {extend:'Ext.chart.interactions.Abstract', requires:['Ext.chart.grid.HorizontalGrid', 'Ext.chart.grid.VerticalGrid', 'Ext.chart.CartesianChart', 'Ext.chart.axis.layout.Discrete'], type:'crosshair', alias:'interaction.crosshair', config:{axes:{top:{label:{}, rect:{}}, right:{label:{}, rect:{}}, bottom:{label:{}, rect:{}}, left:{label:{}, rect:{}}}, lines:{horizontal:{strokeStyle:'black', lineDash:[5, 5]}, vertical:{strokeStyle:'black', lineDash:[5, 5]}}, 
gesture:'drag'}, applyAxes:function(axesConfig, oldAxesConfig) {
  return Ext.merge(oldAxesConfig || {}, axesConfig);
}, applyLines:function(linesConfig, oldLinesConfig) {
  return Ext.merge(oldLinesConfig || {}, linesConfig);
}, updateChart:function(chart) {
  if (chart && !chart.isCartesian) {
    Ext.raise('Crosshair interaction can only be used on cartesian charts.');
  }
  this.callParent(arguments);
}, getGestures:function() {
  var me = this, gestures = {}, gesture = me.getGesture();
  gestures[gesture] = 'onGesture';
  gestures[gesture + 'start'] = 'onGestureStart';
  gestures[gesture + 'end'] = 'onGestureEnd';
  gestures[gesture + 'cancel'] = 'onGestureCancel';
  return gestures;
}, onGestureStart:function(e) {
  var me = this, chart = me.getChart(), axesTheme = chart.getTheme().getAxis(), axisTheme, surface = chart.getSurface('overlay'), rect = chart.getInnerRect(), chartWidth = rect[2], chartHeight = rect[3], xy = chart.getEventXY(e), x = xy[0], y = xy[1], axes = chart.getAxes(), axesConfig = me.getAxes(), linesConfig = me.getLines(), axis, axisSurface, axisRect, axisWidth, axisHeight, axisPosition, axisAlignment, axisLabel, axisLabelConfig, crosshairLabelConfig, tickPadding, axisSprite, attr, axisThickness, 
  lineWidth, halfLineWidth, title, titleBBox, horizontalLineCfg, verticalLineCfg, i;
  e.claimGesture();
  if (x > 0 && x < chartWidth && y > 0 && y < chartHeight) {
    me.lockEvents(me.getGesture());
    horizontalLineCfg = Ext.apply({xclass:'Ext.chart.grid.HorizontalGrid', x:0, y:y, width:chartWidth}, linesConfig.horizontal);
    verticalLineCfg = Ext.apply({xclass:'Ext.chart.grid.VerticalGrid', x:x, y:0, height:chartHeight}, linesConfig.vertical);
    me.axesLabels = me.axesLabels || {};
    for (i = 0; i < axes.length; i++) {
      axis = axes[i];
      axisSurface = axis.getSurface();
      axisRect = axisSurface.getRect();
      axisSprite = axis.getSprites()[0];
      axisWidth = axisRect[2];
      axisHeight = axisRect[3];
      axisPosition = axis.getPosition();
      axisAlignment = axis.getAlignment();
      title = axis.getTitle();
      titleBBox = title && title.attr.text !== '' && title.getBBox();
      attr = axisSprite.attr;
      axisThickness = axisSprite.thickness;
      lineWidth = attr.axisLine ? attr.lineWidth : 0;
      halfLineWidth = lineWidth / 2;
      tickPadding = Math.max(attr.majorTickSize, attr.minorTickSize) + lineWidth;
      axisLabel = me.axesLabels[axisPosition] = axisSurface.add({type:'composite'});
      axisLabel.labelRect = axisLabel.addSprite(Ext.apply({type:'rect', fillStyle:'white', x:axisPosition === 'right' ? lineWidth : 0, y:axisPosition === 'bottom' ? lineWidth : 0, width:axisWidth - lineWidth - (axisAlignment === 'vertical' && titleBBox ? titleBBox.width : 0), height:axisHeight - lineWidth - (axisAlignment === 'horizontal' && titleBBox ? titleBBox.height : 0), translationX:axisPosition === 'left' && titleBBox ? titleBBox.width : 0, translationY:axisPosition === 'top' && titleBBox ? 
      titleBBox.height : 0}, axesConfig.rect || axesConfig[axisPosition].rect));
      if (axisAlignment === 'vertical' && !verticalLineCfg.strokeStyle) {
        verticalLineCfg.strokeStyle = attr.strokeStyle;
      }
      if (axisAlignment === 'horizontal' && !horizontalLineCfg.strokeStyle) {
        horizontalLineCfg.strokeStyle = attr.strokeStyle;
      }
      axisTheme = Ext.merge({}, axesTheme.defaults, axesTheme[axisPosition]);
      axisLabelConfig = Ext.apply({}, axis.config.label, axisTheme.label);
      crosshairLabelConfig = axesConfig.label || axesConfig[axisPosition].label;
      axisLabel.labelText = axisLabel.addSprite(Ext.apply(axisLabelConfig, crosshairLabelConfig, {type:'text', x:me.calculateLabelTextPoint(false, axisPosition, tickPadding, titleBBox, axisWidth, halfLineWidth), y:me.calculateLabelTextPoint(true, axisPosition, tickPadding, titleBBox, axisHeight, halfLineWidth)}));
    }
    me.horizontalLine = surface.add(horizontalLineCfg);
    me.verticalLine = surface.add(verticalLineCfg);
    return false;
  }
}, onGesture:function(e) {
  var me = this;
  if (me.getLocks()[me.getGesture()] !== me) {
    return;
  }
  var chart = me.getChart(), surface = chart.getSurface('overlay'), rect = Ext.Array.slice(chart.getInnerRect()), padding = chart.getInnerPadding(), px = padding.left, py = padding.top, chartWidth = rect[2], chartHeight = rect[3], xy = chart.getEventXY(e), x = xy[0], y = xy[1], axes = chart.getAxes(), axis, axisPosition, axisAlignment, axisSurface, axisSprite, axisMatrix, axisLayoutContext, axisSegmenter, axisLabel, labelBBox, textPadding, xx, yy, dx, dy, xValue, yValue, text, i;
  if (x < 0) {
    x = 0;
  } else {
    if (x > chartWidth) {
      x = chartWidth;
    }
  }
  if (y < 0) {
    y = 0;
  } else {
    if (y > chartHeight) {
      y = chartHeight;
    }
  }
  x += px;
  y += py;
  for (i = 0; i < axes.length; i++) {
    axis = axes[i];
    axisPosition = axis.getPosition();
    axisAlignment = axis.getAlignment();
    axisSurface = axis.getSurface();
    axisSprite = axis.getSprites()[0];
    axisMatrix = axisSprite.attr.matrix;
    textPadding = axisSprite.attr.textPadding * 2;
    axisLabel = me.axesLabels[axisPosition];
    axisLayoutContext = axisSprite.getLayoutContext();
    axisSegmenter = axis.getSegmenter();
    if (axisLabel) {
      if (axisAlignment === 'vertical') {
        yy = axisMatrix.getYY();
        dy = axisMatrix.getDY();
        yValue = (y - dy - py) / yy;
        if (axis.getLayout() instanceof Ext.chart.axis.layout.Discrete) {
          y = Math.round(yValue) * yy + dy + py;
          yValue = axisSegmenter.from(Math.round(yValue));
          yValue = axisSprite.attr.data[yValue];
        } else {
          yValue = axisSegmenter.from(yValue);
        }
        text = axisSegmenter.renderer(yValue, axisLayoutContext);
        axisLabel.setAttributes({translationY:y - py});
        axisLabel.labelText.setAttributes({text:text});
        labelBBox = axisLabel.labelText.getBBox();
        axisLabel.labelRect.setAttributes({height:labelBBox.height + textPadding, y:-(labelBBox.height + textPadding) / 2});
        axisSurface.renderFrame();
      } else {
        xx = axisMatrix.getXX();
        dx = axisMatrix.getDX();
        xValue = (x - dx - px) / xx;
        if (axis.getLayout() instanceof Ext.chart.axis.layout.Discrete) {
          x = Math.round(xValue) * xx + dx + px;
          xValue = axisSegmenter.from(Math.round(xValue));
          xValue = axisSprite.attr.data[xValue];
        } else {
          xValue = axisSegmenter.from(xValue);
        }
        text = axisSegmenter.renderer(xValue, axisLayoutContext);
        axisLabel.setAttributes({translationX:x - px});
        axisLabel.labelText.setAttributes({text:text});
        labelBBox = axisLabel.labelText.getBBox();
        axisLabel.labelRect.setAttributes({width:labelBBox.width + textPadding, x:-(labelBBox.width + textPadding) / 2});
        axisSurface.renderFrame();
      }
    }
  }
  me.horizontalLine.setAttributes({y:y, strokeStyle:axisSprite.attr.strokeStyle});
  me.verticalLine.setAttributes({x:x, strokeStyle:axisSprite.attr.strokeStyle});
  surface.renderFrame();
  return false;
}, onGestureEnd:function(e) {
  var me = this, chart = me.getChart(), surface = chart.getSurface('overlay'), axes = chart.getAxes(), axis, axisPosition, axisSurface, axisLabel, i;
  surface.remove(me.verticalLine);
  surface.remove(me.horizontalLine);
  for (i = 0; i < axes.length; i++) {
    axis = axes[i];
    axisPosition = axis.getPosition();
    axisSurface = axis.getSurface();
    axisLabel = me.axesLabels[axisPosition];
    if (axisLabel) {
      delete me.axesLabels[axisPosition];
      axisSurface.remove(axisLabel);
    }
    axisSurface.renderFrame();
  }
  surface.renderFrame();
  me.unlockEvents(me.getGesture());
}, onGestureCancel:function(e) {
  this.onGestureEnd(e);
}, privates:{vertMap:{top:'start', bottom:'end'}, horzMap:{left:'start', right:'end'}, calculateLabelTextPoint:function(vertical, position, tickPadding, titleBBox, axisSize, halfLineWidth) {
  var titlePadding, sizeProp, pointProp;
  if (vertical) {
    pointProp = 'y';
    sizeProp = 'height';
    position = this.vertMap[position];
  } else {
    pointProp = 'x';
    sizeProp = 'width';
    position = this.horzMap[position];
  }
  switch(position) {
    case 'start':
      titlePadding = titleBBox ? titleBBox[pointProp] + titleBBox[sizeProp] : 0;
      return titlePadding + (axisSize - titlePadding - tickPadding) / 2 - halfLineWidth;
    case 'end':
      titlePadding = titleBBox ? axisSize - titleBBox[pointProp] : 0;
      return tickPadding + (axisSize - tickPadding - titlePadding) / 2 + halfLineWidth;
    default:
      return 0;
  }
}}});
Ext.define('Ext.chart.interactions.ItemHighlight', {extend:'Ext.chart.interactions.Abstract', type:'itemhighlight', alias:'interaction.itemhighlight', isItemHighlight:true, config:{gestures:{tap:'onTapGesture', mousemove:'onMouseMoveGesture', mousedown:'onMouseDownGesture', mouseup:'onMouseUpGesture', mouseleave:'onMouseUpGesture'}, sticky:false}, stickyHighlightItem:null, onMouseMoveGesture:function(e) {
  var me = this, oldItem = me.oldItem, isMousePointer = e.pointerType === 'mouse', item, tooltip;
  if (me.getSticky()) {
    return true;
  }
  if (isMousePointer && me.stickyHighlightItem) {
    me.stickyHighlightItem = null;
    me.highlight(null);
  }
  if (me.isDragging) {
    if (oldItem && isMousePointer) {
      oldItem.series.hideTooltip(oldItem);
      me.oldItem = null;
    }
  } else {
    if (!me.stickyHighlightItem) {
      item = me.getItemForEvent(e);
      if (item !== me.getChart().getHighlightItem()) {
        me.highlight(item);
        me.sync();
      }
      if (isMousePointer) {
        if (item) {
          tooltip = item.series.getTooltip();
          if (tooltip) {
            if (oldItem && oldItem !== item && oldItem.series.getTooltip() !== tooltip) {
              oldItem.series.hideTooltip(oldItem, true);
            }
            if (tooltip.getTrackMouse()) {
              item.series.showTooltip(item, e);
            } else {
              me.showUntracked(item);
            }
            me.oldItem = item;
          }
        } else {
          if (oldItem) {
            oldItem.series.hideTooltip(oldItem);
          }
        }
      }
      return false;
    }
  }
}, highlight:function(item) {
  this.getChart().setHighlightItem(item);
}, showTooltip:function(e, item) {
  item.series.showTooltip(item, e);
  this.oldItem = item;
}, showUntracked:function(item) {
  var marker = item.sprite.getMarker(item.category), surface, surfaceXY, isInverseY, itemBBox;
  if (marker) {
    surface = marker.getSurface();
    isInverseY = surface.matrix.elements[3] < 0;
    surfaceXY = surface.element.getXY();
    itemBBox = Ext.clone(marker.getBBoxFor(item.index));
    if (isInverseY) {
      itemBBox = surface.inverseMatrix.transformBBox(itemBBox);
    }
    itemBBox.x += surfaceXY[0];
    itemBBox.y += surfaceXY[1];
    item.series.showTooltipAt(item, itemBBox.x + itemBBox.width * 0.5, itemBBox.y + itemBBox.height * 0.5);
  }
}, onMouseDownGesture:function() {
  this.isDragging = true;
}, onMouseUpGesture:function() {
  this.isDragging = false;
}, isSameItem:function(a, b) {
  return a && b && a.series === b.series && a.field === b.field && a.index === b.index;
}, onTapGesture:function(e) {
  var me = this;
  if (e.pointerType === 'mouse' && !me.getSticky()) {
    return;
  }
  var item = me.getItemForEvent(e);
  if (me.isSameItem(me.stickyHighlightItem, item)) {
    item = null;
  }
  me.stickyHighlightItem = item;
  me.highlight(item);
}});
Ext.define('Ext.chart.interactions.ItemEdit', {extend:'Ext.chart.interactions.ItemHighlight', requires:['Ext.tip.ToolTip'], type:'itemedit', alias:'interaction.itemedit', isItemEdit:true, config:{style:null, renderer:null, tooltip:true, gestures:{dragstart:'onDragStart', drag:'onDrag', dragend:'onDragEnd'}, cursors:{ewResize:'ew-resize', nsResize:'ns-resize', move:'move'}}, item:null, applyTooltip:function(tooltip) {
  if (tooltip) {
    var config = Ext.apply({}, tooltip, {renderer:this.defaultTooltipRenderer, constrainPosition:true, shrinkWrapDock:true, autoHide:true, trackMouse:true, mouseOffset:[20, 20]});
    tooltip = new Ext.tip.ToolTip(config);
  }
  return tooltip;
}, defaultTooltipRenderer:function(tooltip, item, target, e) {
  var parts = [];
  if (target.xField) {
    parts.push(target.xField + ': ' + target.xValue);
  }
  if (target.yField) {
    parts.push(target.yField + ': ' + target.yValue);
  }
  tooltip.setHtml(parts.join('\x3cbr\x3e'));
}, onDragStart:function(e) {
  var me = this, chart = me.getChart(), item = chart.getHighlightItem();
  e.claimGesture();
  if (item) {
    chart.fireEvent('beginitemedit', chart, me, me.item = item);
    return false;
  }
}, onDrag:function(e) {
  var me = this, chart = me.getChart(), item = chart.getHighlightItem(), type = item && item.sprite.type;
  if (item) {
    switch(type) {
      case 'barSeries':
        return me.onDragBar(e);
      case 'scatterSeries':
        return me.onDragScatter(e);
    }
  }
}, highlight:function(item) {
  var me = this, chart = me.getChart(), flipXY = chart.getFlipXY(), cursors = me.getCursors(), type = item && item.sprite.type, style = chart.el.dom.style;
  me.callParent([item]);
  if (item) {
    switch(type) {
      case 'barSeries':
        if (flipXY) {
          style.cursor = cursors.ewResize;
        } else {
          style.cursor = cursors.nsResize;
        }
        break;
      case 'scatterSeries':
        style.cursor = cursors.move;
        break;
    }
  } else {
    chart.el.dom.style.cursor = 'default';
  }
}, onDragBar:function(e) {
  var me = this, chart = me.getChart(), isRtl = chart.getInherited().rtl, flipXY = chart.isCartesian && chart.getFlipXY(), item = chart.getHighlightItem(), marker = item.sprite.getMarker('items'), instance = marker.getMarkerFor(item.sprite.getId(), item.index), surface = item.sprite.getSurface(), surfaceRect = surface.getRect(), xy = surface.getEventXY(e), matrix = item.sprite.attr.matrix, renderer = me.getRenderer(), style, changes, params, positionY;
  if (flipXY) {
    positionY = isRtl ? surfaceRect[2] - xy[0] : xy[0];
  } else {
    positionY = surfaceRect[3] - xy[1];
  }
  style = {x:instance.x, y:positionY, width:instance.width, height:instance.height + (instance.y - positionY), radius:instance.radius, fillStyle:'none', lineDash:[4, 4], zIndex:100};
  Ext.apply(style, me.getStyle());
  if (Ext.isArray(item.series.getYField())) {
    positionY = positionY - instance.y - instance.height;
  }
  me.target = {index:item.index, yField:item.field, yValue:(positionY - matrix.getDY()) / matrix.getYY()};
  params = [chart, {target:me.target, style:style, item:item}];
  changes = Ext.callback(renderer, null, params, 0, chart);
  if (changes) {
    Ext.apply(style, changes);
  }
  item.sprite.putMarker('items', style, 'itemedit');
  me.showTooltip(e, me.target, item);
  surface.renderFrame();
}, onDragScatter:function(e) {
  var me = this, chart = me.getChart(), isRtl = chart.getInherited().rtl, flipXY = chart.isCartesian && chart.getFlipXY(), item = chart.getHighlightItem(), marker = item.sprite.getMarker('items'), instance = marker.getMarkerFor(item.sprite.getId(), item.index), surface = item.sprite.getSurface(), surfaceRect = surface.getRect(), xy = surface.getEventXY(e), matrix = item.sprite.attr.matrix, xAxis = item.series.getXAxis(), isEditableX = xAxis && xAxis.getLayout().isContinuous, renderer = me.getRenderer(), 
  style, changes, params, positionX, positionY;
  if (flipXY) {
    positionY = isRtl ? surfaceRect[2] - xy[0] : xy[0];
  } else {
    positionY = surfaceRect[3] - xy[1];
  }
  if (isEditableX) {
    if (flipXY) {
      positionX = surfaceRect[3] - xy[1];
    } else {
      positionX = xy[0];
    }
  } else {
    positionX = instance.translationX;
  }
  style = {translationX:positionX, translationY:positionY, scalingX:instance.scalingX, scalingY:instance.scalingY, r:instance.r, fillStyle:'none', lineDash:[4, 4], zIndex:100};
  Ext.apply(style, me.getStyle());
  me.target = {index:item.index, yField:item.field, yValue:(positionY - matrix.getDY()) / matrix.getYY()};
  if (isEditableX) {
    Ext.apply(me.target, {xField:item.series.getXField(), xValue:(positionX - matrix.getDX()) / matrix.getXX()});
  }
  params = [chart, {target:me.target, style:style, item:item}];
  changes = Ext.callback(renderer, null, params, 0, chart);
  if (changes) {
    Ext.apply(style, changes);
  }
  item.sprite.putMarker('items', style, 'itemedit');
  me.showTooltip(e, me.target, item);
  surface.renderFrame();
}, showTooltip:function(e, target, item) {
  var tooltip = this.getTooltip(), config, chart;
  if (tooltip && Ext.toolkit !== 'modern') {
    config = tooltip.config;
    chart = this.getChart();
    Ext.callback(config.renderer, null, [tooltip, item, target, e], 0, chart);
    tooltip.pointerEvent = e;
    if (tooltip.isVisible()) {
      tooltip.realignToTarget();
    } else {
      tooltip.show();
    }
  }
}, hideTooltip:function() {
  var tooltip = this.getTooltip();
  if (tooltip && Ext.toolkit !== 'modern') {
    tooltip.hide();
  }
}, onDragEnd:function(e) {
  var me = this, target = me.target, chart = me.getChart(), store = chart.getStore(), record;
  if (target) {
    record = store.getAt(target.index);
    if (target.yField) {
      record.set(target.yField, target.yValue, {convert:false});
    }
    if (target.xField) {
      record.set(target.xField, target.xValue, {convert:false});
    }
    if (target.yField || target.xField) {
      me.getChart().onDataChanged();
    }
    me.target = null;
  }
  me.hideTooltip();
  if (me.item) {
    chart.fireEvent('enditemedit', chart, me, me.item, target);
  }
  me.highlight(me.item = null);
}, destroy:function() {
  var tooltip = this.getConfig('tooltip', true);
  Ext.destroy(tooltip);
  this.callParent();
}});
Ext.define('Ext.chart.interactions.PanZoom', {extend:'Ext.chart.interactions.Abstract', type:'panzoom', alias:'interaction.panzoom', requires:['Ext.draw.Animator'], config:{axes:{top:{}, right:{}, bottom:{}, left:{}}, minZoom:null, maxZoom:null, showOverflowArrows:true, panGesture:'drag', zoomGesture:'pinch', zoomOnPanGesture:null, zoomOnPan:false, doubleTapReset:false, modeToggleButton:{xtype:'segmentedbutton', width:200, defaults:{ui:'default-toolbar'}, cls:Ext.baseCSSPrefix + 'panzoom-toggle', 
items:[{text:'Pan', value:'pan'}, {text:'Zoom', value:'zoom'}]}, hideLabelInGesture:false}, stopAnimationBeforeSync:true, applyAxes:function(axesConfig, oldAxesConfig) {
  return Ext.merge(oldAxesConfig || {}, axesConfig);
}, updateZoomOnPan:function(zoomOnPan) {
  var button = this.getModeToggleButton();
  button.setValue(zoomOnPan ? 'zoom' : 'pan');
}, updateZoomOnPanGesture:function(zoomOnPanGesture) {
  this.setZoomOnPan(zoomOnPanGesture);
}, getZoomOnPanGesture:function() {
  return this.getZoomOnPan();
}, applyModeToggleButton:function(button, oldButton) {
  return Ext.factory(button, 'Ext.button.Segmented', oldButton);
}, updateModeToggleButton:function(button) {
  if (button) {
    button.on('change', 'onModeToggleChange', this);
  }
}, onModeToggleChange:function(segmentedButton, value) {
  this.setZoomOnPan(value === 'zoom');
}, getGestures:function() {
  var me = this, gestures = {}, pan = me.getPanGesture(), zoom = me.getZoomGesture();
  gestures[zoom] = 'onZoomGestureMove';
  gestures[zoom + 'start'] = 'onZoomGestureStart';
  gestures[zoom + 'end'] = 'onZoomGestureEnd';
  gestures[pan] = 'onPanGestureMove';
  gestures[pan + 'start'] = 'onPanGestureStart';
  gestures[pan + 'end'] = 'onPanGestureEnd';
  gestures.doubletap = 'onDoubleTap';
  return gestures;
}, onDoubleTap:function(e) {
  var me = this, doubleTapReset = me.getDoubleTapReset(), chart, axes, axis, i, ln;
  if (doubleTapReset) {
    chart = me.getChart();
    axes = chart.getAxes();
    for (i = 0, ln = axes.length; i < ln; i++) {
      axis = axes[i];
      axis.setVisibleRange([0, 1]);
    }
    chart.redraw();
  }
}, onPanGestureStart:function(e) {
  if (!e || !e.touches || e.touches.length < 2) {
    var me = this, chart = me.getChart(), rect = chart.getInnerRect(), xy = chart.element.getXY();
    e.claimGesture();
    chart.suspendAnimation();
    me.startX = e.getX() - xy[0] - rect[0];
    me.startY = e.getY() - xy[1] - rect[1];
    me.oldVisibleRanges = null;
    me.hideLabels();
    chart.suspendThicknessChanged();
    me.lockEvents(me.getPanGesture());
    return false;
  }
}, onPanGestureMove:function(e) {
  var me = this, isMouse = e.pointerType === 'mouse', isZoomOnPan = isMouse && me.getZoomOnPan();
  if (me.getLocks()[me.getPanGesture()] === me) {
    var chart = me.getChart(), rect = chart.getInnerRect(), xy = chart.element.getXY();
    if (isZoomOnPan) {
      me.transformAxesBy(me.getZoomableAxes(e), 0, 0, (e.getX() - xy[0] - rect[0]) / me.startX, me.startY / (e.getY() - xy[1] - rect[1]));
    } else {
      me.transformAxesBy(me.getPannableAxes(e), e.getX() - xy[0] - rect[0] - me.startX, e.getY() - xy[1] - rect[1] - me.startY, 1, 1);
    }
    me.sync();
    return false;
  }
}, onPanGestureEnd:function(e) {
  var me = this, pan = me.getPanGesture(), chart;
  if (me.getLocks()[pan] === me) {
    chart = me.getChart();
    chart.resumeThicknessChanged();
    me.showLabels();
    me.sync();
    me.unlockEvents(pan);
    chart.resumeAnimation();
    return false;
  }
}, onZoomGestureStart:function(e) {
  if (e.touches && e.touches.length === 2) {
    var me = this, chart = me.getChart(), xy = chart.element.getXY(), rect = chart.getInnerRect(), x = xy[0] + rect[0], y = xy[1] + rect[1], newPoints = [e.touches[0].point.x - x, e.touches[0].point.y - y, e.touches[1].point.x - x, e.touches[1].point.y - y], xDistance = Math.max(44, Math.abs(newPoints[2] - newPoints[0])), yDistance = Math.max(44, Math.abs(newPoints[3] - newPoints[1]));
    e.claimGesture();
    chart.suspendAnimation();
    chart.suspendThicknessChanged();
    me.lastZoomDistances = [xDistance, yDistance];
    me.lastPoints = newPoints;
    me.oldVisibleRanges = null;
    me.hideLabels();
    me.lockEvents(me.getZoomGesture());
    return false;
  }
}, onZoomGestureMove:function(e) {
  var me = this;
  if (me.getLocks()[me.getZoomGesture()] === me) {
    var chart = me.getChart(), rect = chart.getInnerRect(), xy = chart.element.getXY(), x = xy[0] + rect[0], y = xy[1] + rect[1], abs = Math.abs, lastPoints = me.lastPoints, newPoints = [e.touches[0].point.x - x, e.touches[0].point.y - y, e.touches[1].point.x - x, e.touches[1].point.y - y], xDistance = Math.max(44, abs(newPoints[2] - newPoints[0])), yDistance = Math.max(44, abs(newPoints[3] - newPoints[1])), lastDistances = this.lastZoomDistances || [xDistance, yDistance], zoomX = xDistance / lastDistances[0], 
    zoomY = yDistance / lastDistances[1];
    me.transformAxesBy(me.getZoomableAxes(e), rect[2] * (zoomX - 1) / 2 + newPoints[2] - lastPoints[2] * zoomX, rect[3] * (zoomY - 1) / 2 + newPoints[3] - lastPoints[3] * zoomY, zoomX, zoomY);
    me.sync();
    return false;
  }
}, onZoomGestureEnd:function(e) {
  var me = this, zoom = me.getZoomGesture(), chart;
  if (me.getLocks()[zoom] === me) {
    chart = me.getChart();
    chart.resumeThicknessChanged();
    me.showLabels();
    me.sync();
    me.unlockEvents(zoom);
    chart.resumeAnimation();
    return false;
  }
}, hideLabels:function() {
  if (this.getHideLabelInGesture()) {
    this.eachInteractiveAxes(function(axis) {
      axis.hideLabels();
    });
  }
}, showLabels:function() {
  if (this.getHideLabelInGesture()) {
    this.eachInteractiveAxes(function(axis) {
      axis.showLabels();
    });
  }
}, isEventOnAxis:function(e, axis) {
  var rect = axis.getSurface().getRect();
  return rect[0] <= e.getX() && e.getX() <= rect[0] + rect[2] && rect[1] <= e.getY() && e.getY() <= rect[1] + rect[3];
}, getPannableAxes:function(e) {
  var me = this, axisConfigs = me.getAxes(), axes = me.getChart().getAxes(), i, ln = axes.length, result = [], isEventOnAxis = false, config;
  if (e) {
    for (i = 0; i < ln; i++) {
      if (this.isEventOnAxis(e, axes[i])) {
        isEventOnAxis = true;
        break;
      }
    }
  }
  for (i = 0; i < ln; i++) {
    config = axisConfigs[axes[i].getPosition()];
    if (config && config.allowPan !== false && (!isEventOnAxis || this.isEventOnAxis(e, axes[i]))) {
      result.push(axes[i]);
    }
  }
  return result;
}, getZoomableAxes:function(e) {
  var me = this, axisConfigs = me.getAxes(), axes = me.getChart().getAxes(), result = [], i, ln = axes.length, axis, isEventOnAxis = false, config;
  if (e) {
    for (i = 0; i < ln; i++) {
      if (this.isEventOnAxis(e, axes[i])) {
        isEventOnAxis = true;
        break;
      }
    }
  }
  for (i = 0; i < ln; i++) {
    axis = axes[i];
    config = axisConfigs[axis.getPosition()];
    if (config && config.allowZoom !== false && (!isEventOnAxis || this.isEventOnAxis(e, axis))) {
      result.push(axis);
    }
  }
  return result;
}, eachInteractiveAxes:function(fn) {
  var me = this, axisConfigs = me.getAxes(), axes = me.getChart().getAxes();
  for (var i = 0; i < axes.length; i++) {
    if (axisConfigs[axes[i].getPosition()]) {
      if (false === fn.call(this, axes[i])) {
        return;
      }
    }
  }
}, transformAxesBy:function(axes, panX, panY, sx, sy) {
  var rect = this.getChart().getInnerRect(), axesCfg = this.getAxes(), axisCfg, oldVisibleRanges = this.oldVisibleRanges, result = false;
  if (!oldVisibleRanges) {
    this.oldVisibleRanges = oldVisibleRanges = {};
    this.eachInteractiveAxes(function(axis) {
      oldVisibleRanges[axis.getId()] = axis.getVisibleRange();
    });
  }
  if (!rect) {
    return;
  }
  for (var i = 0; i < axes.length; i++) {
    axisCfg = axesCfg[axes[i].getPosition()];
    result = this.transformAxisBy(axes[i], oldVisibleRanges[axes[i].getId()], panX, panY, sx, sy, this.minZoom || axisCfg.minZoom, this.maxZoom || axisCfg.maxZoom) || result;
  }
  return result;
}, transformAxisBy:function(axis, oldVisibleRange, panX, panY, sx, sy, minZoom, maxZoom) {
  var me = this, visibleLength = oldVisibleRange[1] - oldVisibleRange[0], visibleRange = axis.getVisibleRange(), actualMinZoom = minZoom || me.getMinZoom() || axis.config.minZoom, actualMaxZoom = maxZoom || me.getMaxZoom() || axis.config.maxZoom, rect = me.getChart().getInnerRect(), left, right;
  if (!rect) {
    return;
  }
  var isSide = axis.isSide(), length = isSide ? rect[3] : rect[2], pan = isSide ? -panY : panX;
  visibleLength /= isSide ? sy : sx;
  if (visibleLength < 0) {
    visibleLength = -visibleLength;
  }
  if (visibleLength * actualMinZoom > 1) {
    visibleLength = 1;
  }
  if (visibleLength * actualMaxZoom < 1) {
    visibleLength = 1 / actualMaxZoom;
  }
  left = oldVisibleRange[0];
  right = oldVisibleRange[1];
  visibleRange = visibleRange[1] - visibleRange[0];
  if (visibleLength === visibleRange && visibleRange === 1) {
    return;
  }
  axis.setVisibleRange([(oldVisibleRange[0] + oldVisibleRange[1] - visibleLength) * 0.5 - pan / length * visibleLength, (oldVisibleRange[0] + oldVisibleRange[1] + visibleLength) * 0.5 - pan / length * visibleLength]);
  return Math.abs(left - axis.getVisibleRange()[0]) > 1.0E-10 || Math.abs(right - axis.getVisibleRange()[1]) > 1.0E-10;
}, destroy:function() {
  this.setModeToggleButton(null);
  this.callParent();
}});
Ext.define('Ext.chart.interactions.Rotate', {extend:'Ext.chart.interactions.Abstract', type:'rotate', alternateClassName:'Ext.chart.interactions.RotatePie3D', alias:['interaction.rotate', 'interaction.rotatePie3d'], config:{gesture:'rotate', gestures:{dragstart:'onGestureStart', drag:'onGesture', dragend:'onGestureEnd'}, rotation:0}, oldRotations:null, getAngle:function(e) {
  var me = this, chart = me.getChart(), xy = chart.getEventXY(e), center = chart.getCenter();
  return Math.atan2(xy[1] - center[1], xy[0] - center[0]);
}, onGestureStart:function(e) {
  var me = this;
  e.claimGesture();
  me.lockEvents('drag');
  me.angle = me.getAngle(e);
  me.oldRotations = {};
  me.getChart().suspendAnimation();
  me.fireEvent('rotatestart', me, me.getRotation());
  return false;
}, onGesture:function(e) {
  var me = this, angle = me.getAngle(e) - me.angle;
  if (me.getLocks().drag === me) {
    me.doRotateTo(angle, true);
    return false;
  }
}, doRotateTo:function(angle, relative) {
  var me = this, chart = me.getChart(), axes = chart.getAxes(), seriesList = chart.getSeries(), oldRotations = me.oldRotations, rotation, oldRotation, axis, series, id, i, ln;
  for (i = 0, ln = axes.length; i < ln; i++) {
    axis = axes[i];
    id = axis.getId();
    oldRotation = oldRotations[id] || (oldRotations[id] = axis.getRotation());
    rotation = angle + (relative ? oldRotation : 0);
    axis.setRotation(rotation);
  }
  for (i = 0, ln = seriesList.length; i < ln; i++) {
    series = seriesList[i];
    id = series.getId();
    oldRotation = oldRotations[id] || (oldRotations[id] = series.getRotation());
    rotation = Ext.draw.Draw.degrees(angle + (relative ? oldRotation : 0));
    series.setRotation(rotation);
  }
  me.setRotation(rotation);
  me.fireEvent('rotate', me, me.getRotation());
  me.sync();
}, rotateTo:function(angle, relative, animate) {
  var me = this, chart = me.getChart();
  if (!animate) {
    chart.suspendAnimation();
  }
  me.doRotateTo(angle, relative, animate);
  me.oldRotations = {};
  if (!animate) {
    chart.resumeAnimation();
  }
}, onGestureEnd:function(e) {
  var me = this;
  if (me.getLocks().drag === me) {
    me.onGesture(e);
    me.unlockEvents('drag');
    me.getChart().resumeAnimation();
    me.fireEvent('rotateend', me, me.getRotation());
    me.fireEvent('rotationEnd', me, me.getRotation());
    return false;
  }
}});
Ext.define('Ext.chart.navigator.ContainerBase', {extend:'Ext.panel.Panel'});
Ext.define('Ext.chart.navigator.NavigatorBase', {extend:'Ext.chart.CartesianChart', onRender:function() {
  this.callParent();
  this.setupEvents();
}, setDocked:function(docked) {
  var me = this, ownerCt = me.getNavigatorContainer();
  if (!(docked === 'top' || docked === 'bottom')) {
    Ext.raise("Can only dock to 'top' or 'bottom'.");
  }
  if (docked !== me.dock) {
    if (ownerCt && ownerCt.moveDocked) {
      ownerCt.moveDocked(me, docked);
    } else {
      me.dock = docked;
    }
  }
  return me;
}, getDocked:function() {
  return this.dock;
}});
Ext.define('Ext.chart.navigator.sprite.RangeMask', {extend:'Ext.draw.sprite.Sprite', alias:'sprite.rangemask', inheritableStatics:{def:{processors:{min:'limited01', max:'limited01', thumbOpacity:'limited01'}, defaults:{min:0, max:1, lineWidth:2, miterLimit:1, strokeStyle:'#787878', thumbOpacity:1}}}, getBBox:function(isWithoutTransform) {
  var me = this, attr = me.attr, bbox = attr.bbox;
  bbox.plain = {x:0, y:0, width:1, height:1};
  if (isWithoutTransform) {
    return bbox.plain;
  }
  return bbox.transform || (bbox.transform = attr.matrix.transformBBox(bbox.plain));
}, renderThumb:function(surface, ctx, x, y) {
  var me = this, shapeSprite = me.shapeSprite, textureSprite = me.textureSprite, thumbOpacity = me.attr.thumbOpacity, thumbAttributes = {opacity:thumbOpacity, translationX:x, translationY:y};
  if (!shapeSprite) {
    shapeSprite = me.shapeSprite = new Ext.draw.sprite.Rect({x:-9.5, y:-9.5, width:19, height:19, radius:4, lineWidth:1, fillStyle:{type:'linear', degrees:90, stops:[{offset:0, color:'#EEE'}, {offset:1, color:'#FFF'}]}, strokeStyle:'#999'});
    textureSprite = me.textureSprite = new Ext.draw.sprite.Path({path:'M -4, -5, -4, 5 M 0, -5, 0, 5 M 4, -5, 4, 5', strokeStyle:{type:'linear', degrees:90, stops:[{offset:0, color:'#CCC'}, {offset:1, color:'#BBB'}]}, lineWidth:2});
  }
  ctx.save();
  shapeSprite.setAttributes(thumbAttributes);
  shapeSprite.applyTransformations();
  textureSprite.setAttributes(thumbAttributes);
  textureSprite.applyTransformations();
  shapeSprite.useAttributes(ctx);
  shapeSprite.render(surface, ctx);
  textureSprite.useAttributes(ctx);
  textureSprite.render(surface, ctx);
  ctx.restore();
}, render:function(surface, ctx) {
  var me = this, attr = me.attr, matrix = attr.matrix.elements, sx = matrix[0], sy = matrix[3], tx = matrix[4], ty = matrix[5], min = attr.min, max = attr.max, s_min = min * sx + tx, s_max = max * sx + tx, s_y = Math.round(0.5 * sy + ty);
  ctx.beginPath();
  ctx.moveTo(tx, ty);
  ctx.lineTo(sx + tx, ty);
  ctx.lineTo(sx + tx, sy + ty);
  ctx.lineTo(tx, sy + ty);
  ctx.lineTo(tx, ty);
  ctx.moveTo(s_min, ty);
  ctx.lineTo(s_min, sy + ty);
  ctx.lineTo(s_max, sy + ty);
  ctx.lineTo(s_max, ty);
  ctx.lineTo(s_min, ty);
  ctx.fillStroke(attr, true);
  me.renderThumb(surface, ctx, Math.round(s_min), s_y);
  me.renderThumb(surface, ctx, Math.round(s_max), s_y);
}});
Ext.define('Ext.chart.navigator.Navigator', {extend:'Ext.chart.navigator.NavigatorBase', isNavigator:true, requires:['Ext.chart.navigator.sprite.RangeMask'], config:{docked:'bottom', span:'series', insetPadding:0, innerPadding:0, navigatorContainer:null, axis:null, tolerance:20, minimum:0.8, maximum:1, thumbGap:30, autoHideThumbs:true, width:'100%', height:75}, dragType:null, constructor:function(config) {
  config = config || {};
  var me = this, visibleRange = [config.minimum || 0.8, config.maximum || 1], overlay;
  me.callParent([config]);
  overlay = me.overlaySurface;
  overlay.element.setStyle({zIndex:100});
  me.rangeMask = overlay.add({type:'rangemask', min:visibleRange[0], max:visibleRange[1], fillStyle:'rgba(0, 0, 0, .25)'});
  me.onDragEnd();
  me.rangeMask.setAnimation({duration:500, customDurations:{min:0, max:0, translationX:0, translationY:0, scalingX:0, scalingY:0, scalingCenterX:0, scalingCenterY:0, fillStyle:0, strokeStyle:0}});
  me.setVisibleRange(visibleRange);
}, createSurface:function(id) {
  var surface = this.callParent([id]);
  if (id === 'overlay') {
    this.overlaySurface = surface;
  }
  return surface;
}, applyAxis:function(axis) {
  return this.getNavigatorContainer().getChart().getAxis(axis);
}, updateAxis:function(axis, oldAxis) {
  var me = this, eventName = 'visiblerangechange', eventHandler = 'onAxisVisibleRangeChange';
  if (oldAxis) {
    oldAxis.un(eventName, eventHandler, me);
  }
  if (axis) {
    axis.on(eventName, eventHandler, me);
  }
  me.axis = axis;
}, getAxis:function() {
  return this.axis;
}, onAxisVisibleRangeChange:function(axis, visibleRange) {
  this.setVisibleRange(visibleRange);
}, updateNavigatorContainer:function(navigatorContainer) {
  var me = this, oldChart = me.chart, chart = me.chart = navigatorContainer && navigatorContainer.getChart(), chartSeriesList = chart && chart.getSeries(), chartLegendStore = me.chartLegendStore, navigatorSeriesList = [], storeEventName = 'update', storeEventHandler = 'onChartLegendStoreUpdate', chartSeries, navigatorSeries, seriesConfig, i;
  if (oldChart) {
    oldChart.un('layout', 'afterBoundChartLayout', me);
    oldChart.un('themechange', 'onChartThemeChange', me);
    oldChart.un('storechange', 'onChartStoreChange', me);
  }
  chart.on('layout', 'afterBoundChartLayout', me);
  for (i = 0; i < chartSeriesList.length; i++) {
    chartSeries = chartSeriesList[i];
    seriesConfig = me.getSeriesConfig(chartSeries);
    navigatorSeries = Ext.create('series.' + seriesConfig.type, seriesConfig);
    navigatorSeries.parentSeries = chartSeries;
    chartSeries.navigatorSeries = navigatorSeries;
    navigatorSeriesList.push(navigatorSeries);
  }
  if (chartLegendStore) {
    chartLegendStore.un(storeEventName, storeEventHandler, me);
    me.chartLegendStore = null;
  }
  if (chart) {
    me.setStore(chart.getStore());
    me.chartLegendStore = chartLegendStore = chart.getLegendStore();
    if (chartLegendStore) {
      chartLegendStore.on(storeEventName, storeEventHandler, me);
    }
    chart.on('themechange', 'onChartThemeChange', me);
    chart.on('storechange', 'onChartStoreChange', me);
    me.onChartThemeChange(chart, chart.getTheme());
  }
  me.setSeries(navigatorSeriesList);
}, onChartThemeChange:function(chart, theme) {
  this.setTheme(theme);
}, onChartStoreChange:function(chart, store) {
  this.setStore(store);
}, addCustomStyle:function(config, style, subStyle) {
  var fillStyle, strokeStyle;
  style = style || {};
  subStyle = subStyle || {};
  config.style = config.style || {};
  config.subStyle = config.subStyle || {};
  fillStyle = style && (style.fillStyle || style.fill);
  strokeStyle = style && (style.strokeStyle || style.stroke);
  if (fillStyle) {
    config.style.fillStyle = fillStyle;
  }
  if (strokeStyle) {
    config.style.strokeStyle = strokeStyle;
  }
  fillStyle = subStyle && (subStyle.fillStyle || subStyle.fill);
  strokeStyle = subStyle && (subStyle.strokeStyle || subStyle.stroke);
  if (fillStyle) {
    config.subStyle.fillStyle = fillStyle;
  }
  if (strokeStyle) {
    config.subStyle.strokeStyle = strokeStyle;
  }
  return config;
}, getSeriesConfig:function(chartSeries) {
  var me = this, style = chartSeries.getStyle(), config;
  if (chartSeries.isLine) {
    config = me.addCustomStyle({type:'line', fill:true, xField:chartSeries.getXField(), yField:chartSeries.getYField(), smooth:chartSeries.getSmooth()}, style);
  } else {
    if (chartSeries.isCandleStick) {
      config = me.addCustomStyle({type:'line', fill:true, xField:chartSeries.getXField(), yField:chartSeries.getCloseField()}, style.raiseStyle);
    } else {
      if (chartSeries.isArea || chartSeries.isBar) {
        config = me.addCustomStyle({type:'area', xField:chartSeries.getXField(), yField:chartSeries.getYField()}, style, chartSeries.getSubStyle());
      } else {
        Ext.raise("Navigator only works with 'line', 'bar', 'candlestick' and 'area' series.");
      }
    }
  }
  config.style.fillOpacity = 0.2;
  return config;
}, onChartLegendStoreUpdate:function(store, record) {
  var me = this, chart = me.chart, series;
  if (chart && record) {
    series = chart.getSeries().map[record.get('series')];
    if (series && series.navigatorSeries) {
      series.navigatorSeries.setHiddenByIndex(record.get('index'), record.get('disabled'));
      me.redraw();
    }
  }
}, setupEvents:function() {
  var me = this, overlayEl = me.overlaySurface.element;
  overlayEl.on({scope:me, drag:'onDrag', dragstart:'onDragStart', dragend:'onDragEnd', dragcancel:'onDragEnd', mousemove:'onMouseMove'});
}, onMouseMove:function(e) {
  var me = this, overlayEl = me.overlaySurface.element, style = overlayEl.dom.style, dragType = me.getDragType(e.pageX - overlayEl.getXY()[0]);
  switch(dragType) {
    case 'min':
    case 'max':
      style.cursor = 'ew-resize';
      break;
    case 'pan':
      style.cursor = 'move';
      break;
    default:
      style.cursor = 'default';
  }
}, getDragType:function(x) {
  var me = this, t = me.getTolerance(), width = me.overlaySurface.element.getSize().width, rangeMask = me.rangeMask, min = width * rangeMask.attr.min, max = width * rangeMask.attr.max, dragType;
  if (x > min + t && x < max - t) {
    dragType = 'pan';
  } else {
    if (x <= min + t && x > min - t) {
      dragType = 'min';
    } else {
      if (x >= max - t && x < max + t) {
        dragType = 'max';
      }
    }
  }
  return dragType;
}, onDragStart:function(e) {
  if (this.dragType || e && e.touches && e.touches.length > 1) {
    return;
  }
  var me = this, x = e.touches[0].pageX - me.overlaySurface.element.getXY()[0], dragType = me.getDragType(x);
  me.rangeMask.attr.thumbOpacity = 1;
  if (dragType) {
    me.dragType = dragType;
    me.touchId = e.touches[0].identifier;
    me.dragX = x;
  }
}, onDrag:function(e) {
  if (e.touch.identifier !== this.touchId) {
    return;
  }
  var me = this, overlayEl = me.overlaySurface.element, width = overlayEl.getSize().width, x = e.touches[0].pageX - overlayEl.getXY()[0], thumbGap = me.getThumbGap() / width, rangeMask = me.rangeMask, min = rangeMask.attr.min, max = rangeMask.attr.max, delta = max - min, dragType = me.dragType, drag = me.dragX, dx = (x - drag) / width;
  if (dragType === 'pan') {
    min += dx;
    max += dx;
    if (min < 0) {
      min = 0;
      max = delta;
    }
    if (max > 1) {
      max = 1;
      min = max - delta;
    }
  } else {
    if (dragType === 'min') {
      min += dx;
      if (min < 0) {
        min = 0;
      }
      if (min > max - thumbGap) {
        min = max - thumbGap;
      }
    } else {
      if (dragType === 'max') {
        max += dx;
        if (max > 1) {
          max = 1;
        }
        if (max < min + thumbGap) {
          max = min + thumbGap;
        }
      } else {
        return;
      }
    }
  }
  me.dragX = x;
  me.setVisibleRange([min, max]);
}, onDragEnd:function() {
  var me = this, autoHideThumbs = me.getAutoHideThumbs();
  me.dragType = null;
  if (autoHideThumbs) {
    me.rangeMask.setAttributes({thumbOpacity:0});
  }
}, updateMinimum:function(mininum) {
  if (!this.isConfiguring) {
    this.setVisibleRange([mininum, this.getMaximum()]);
  }
}, updateMaximum:function(maximum) {
  if (!this.isConfiguring) {
    this.setVisibleRange([this.getMinimum(), maximum]);
  }
}, getMinimum:function() {
  return this.rangeMask.attr.min;
}, getMaximum:function() {
  return this.rangeMask.attr.max;
}, setVisibleRange:function(visibleRange) {
  var me = this, chart = me.chart;
  me.axis.setVisibleRange(visibleRange);
  me.rangeMask.setAttributes({min:visibleRange[0], max:visibleRange[1]});
  me.getSurface('overlay').renderFrame();
  chart.suspendAnimation();
  chart.redraw();
  chart.resumeAnimation();
}, afterBoundChartLayout:function() {
  var me = this, spanSeries = me.getSpan() === 'series', mainRect = me.chart.getMainRect(), size = me.element.getSize();
  if (mainRect && spanSeries) {
    me.setInsetPadding({left:mainRect[0], right:size.width - mainRect[2] - mainRect[0], top:0, bottom:0});
    me.performLayout();
  }
}, afterChartLayout:function() {
  var me = this, size = me.overlaySurface.element.getSize();
  me.rangeMask.setAttributes({scalingCenterX:0, scalingCenterY:0, scalingX:size.width, scalingY:size.height});
}, doDestroy:function() {
  var chart = this.chart;
  if (chart && !chart.destroyed) {
    chart.un('layout', 'afterBoundChartLayout', this);
  }
  this.callParent();
}});
Ext.define('Ext.chart.navigator.Container', {extend:'Ext.chart.navigator.ContainerBase', requires:['Ext.chart.CartesianChart', 'Ext.chart.navigator.Navigator'], xtype:'chartnavigator', config:{layout:'fit', chart:null, navigator:{}}, applyChart:function(chart, oldChart) {
  if (oldChart) {
    oldChart.destroy();
  }
  if (chart) {
    if (chart.isCartesian) {
      Ext.raise('Only cartesian charts are supported.');
    }
    if (!chart.isChart) {
      chart = new Ext.chart.CartesianChart(chart);
    }
  }
  return chart;
}, legendStore:null, surfaceRects:null, updateChart:function(chart, oldChart) {
  var me = this;
  if (chart) {
    me.legendStore = chart.getLegendStore();
    if (!me.items && me.initItems) {
      me.initItems();
    }
    me.add(chart);
  }
}, applyNavigator:function(navigator, oldNavigator) {
  var instance;
  if (oldNavigator) {
    oldNavigator.destroy();
  }
  if (navigator) {
    navigator.navigatorContainer = navigator.parent = this;
    instance = new Ext.chart.navigator.Navigator(navigator);
  }
  return instance;
}, preview:function() {
  this.getNavigator().preview(this.getImage());
}, download:function(config) {
  config = config || {};
  config.data = this.getImage().data;
  this.getNavigator().download(config);
}, setVisibleRange:function(visibleRange) {
  this.getNavigator().setVisibleRange(visibleRange);
}, getImage:function(format) {
  var me = this, chart = me.getChart(), navigator = me.getNavigator(), docked = navigator.getDocked(), chartImageSize = chart.bodyElement.getSize(), navigatorImageSize = navigator.bodyElement.getSize(), chartSurfaces = chart.getSurfaces(true), navigatorSurfaces = navigator.getSurfaces(true), size = {width:chartImageSize.width, height:chartImageSize.height + navigatorImageSize.height}, image, imageElement, surfaces, surface;
  if (docked === 'top') {
    me.shiftSurfaces(chartSurfaces, 0, navigatorImageSize.height);
  } else {
    me.shiftSurfaces(navigatorSurfaces, 0, chartImageSize.height);
  }
  surfaces = chartSurfaces.concat(navigatorSurfaces);
  surface = surfaces[0];
  if ((Ext.isIE || Ext.isEdge) && surface.isSVG) {
    image = {data:surface.toSVG(size, surfaces), type:'svg-markup'};
  } else {
    image = surface.flatten(size, surfaces);
    if (format === 'image') {
      imageElement = new Image;
      imageElement.src = image.data;
      image.data = imageElement;
      return image;
    }
    if (format === 'stream') {
      image.data = image.data.replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
      return image;
    }
  }
  me.unshiftSurfaces(surfaces);
  return image;
}, shiftSurfaces:function(surfaces, x, y) {
  var ln = surfaces.length, i = 0, surface;
  this.surfaceRects = {};
  for (; i < ln; i++) {
    surface = surfaces[i];
    this.shiftSurface(surface, x, y);
  }
}, shiftSurface:function(surface, x, y) {
  var rect = surface.getRect();
  this.surfaceRects[surface.getId()] = rect.slice();
  rect[0] += x;
  rect[1] += y;
}, unshiftSurfaces:function(surfaces) {
  var rects = this.surfaceRects, ln = surfaces.length, i = 0, surface, rect, oldRect;
  if (rects) {
    for (; i < ln; i++) {
      surface = surfaces[i];
      rect = surface.getRect();
      oldRect = rects[surface.getId()];
      if (oldRect) {
        rect[0] = oldRect[0];
        rect[1] = oldRect[1];
      }
    }
  }
  this.surfaceRects = null;
}});
Ext.define('Ext.chart.plugin.ItemEvents', {extend:'Ext.plugin.Abstract', alias:'plugin.chartitemevents', moveEvents:false, mouseMoveEvents:{mousemove:true, mouseover:true, mouseout:true}, itemMouseMoveEvents:{itemmousemove:true, itemmouseover:true, itemmouseout:true}, init:function(chart) {
  var handleEvent = 'handleEvent';
  this.chart = chart;
  chart.addElementListener({click:handleEvent, dblclick:handleEvent, mousedown:handleEvent, mousemove:handleEvent, mouseup:handleEvent, mouseover:handleEvent, mouseout:handleEvent, priority:1001, scope:this});
}, hasItemMouseMoveListeners:function() {
  var listeners = this.chart.hasListeners, name;
  for (name in this.itemMouseMoveEvents) {
    if (name in listeners) {
      return true;
    }
  }
  return false;
}, handleEvent:function(e) {
  var me = this, chart = me.chart, isMouseMoveEvent = e.type in me.mouseMoveEvents, lastItem = me.lastItem, chartXY, item;
  if (isMouseMoveEvent && !me.hasItemMouseMoveListeners() && !me.moveEvents) {
    return;
  }
  chartXY = chart.getEventXY(e);
  item = chart.getItemForPoint(chartXY[0], chartXY[1]);
  if (isMouseMoveEvent && !Ext.Object.equals(item, lastItem)) {
    if (lastItem) {
      chart.fireEvent('itemmouseout', chart, lastItem, e);
      lastItem.series.fireEvent('itemmouseout', lastItem.series, lastItem, e);
    }
    if (item) {
      chart.fireEvent('itemmouseover', chart, item, e);
      item.series.fireEvent('itemmouseover', item.series, item, e);
    }
  }
  if (item) {
    chart.fireEvent('item' + e.type, chart, item, e);
    item.series.fireEvent('item' + e.type, item.series, item, e);
  }
  me.lastItem = item;
}});
Ext.define('Ext.chart.series.Cartesian', {extend:'Ext.chart.series.Series', config:{xField:null, yField:null, xAxis:null, yAxis:null}, directions:['X', 'Y'], fieldCategoryX:['X'], fieldCategoryY:['Y'], applyXAxis:function(newAxis, oldAxis) {
  return this.getChart().getAxis(newAxis) || oldAxis;
}, applyYAxis:function(newAxis, oldAxis) {
  return this.getChart().getAxis(newAxis) || oldAxis;
}, updateXAxis:function(axis) {
  axis.processData(this);
}, updateYAxis:function(axis) {
  axis.processData(this);
}, coordinateX:function() {
  return this.coordinate('X', 0, 2);
}, coordinateY:function() {
  return this.coordinate('Y', 1, 2);
}, getItemForPoint:function(x, y) {
  if (this.getSprites()) {
    var me = this, sprite = me.getSprites()[0], store = me.getStore(), item, index;
    if (me.getHidden()) {
      return null;
    }
    if (sprite) {
      index = sprite.getIndexNearPoint(x, y);
      if (index !== -1) {
        item = {series:me, index:index, category:me.getItemInstancing() ? 'items' : 'markers', record:store.getData().items[index], field:me.getYField(), sprite:sprite};
        return item;
      }
    }
  }
}, createSprite:function() {
  var me = this, sprite = me.callParent(), chart = me.getChart(), xAxis = me.getXAxis();
  sprite.setAttributes({flipXY:chart.getFlipXY(), xAxis:xAxis});
  if (sprite.setAggregator && xAxis && xAxis.getAggregator) {
    if (xAxis.getAggregator) {
      sprite.setAggregator({strategy:xAxis.getAggregator()});
    } else {
      sprite.setAggregator({});
    }
  }
  return sprite;
}, getSprites:function() {
  var me = this, chart = this.getChart(), sprites = me.sprites;
  if (!chart) {
    return Ext.emptyArray;
  }
  if (!sprites.length) {
    me.createSprite();
  }
  return sprites;
}, getXRange:function() {
  return [this.dataRange[0], this.dataRange[2]];
}, getYRange:function() {
  return [this.dataRange[1], this.dataRange[3]];
}});
Ext.define('Ext.chart.series.StackedCartesian', {extend:'Ext.chart.series.Cartesian', config:{stacked:true, splitStacks:true, fullStack:false, fullStackTotal:100, hidden:[]}, reversedSpriteZOrder:true, spriteAnimationCount:0, themeColorCount:function() {
  var me = this, yField = me.getYField();
  return Ext.isArray(yField) ? yField.length : 1;
}, updateStacked:function() {
  this.processData();
}, updateSplitStacks:function() {
  this.processData();
}, coordinateY:function() {
  return this.coordinateStacked('Y', 1, 2);
}, coordinateStacked:function(direction, directionOffset, directionCount) {
  var me = this, store = me.getStore(), items = store.getData().items, itemCount = items.length, axis = me['get' + direction + 'Axis'](), hidden = me.getHidden(), splitStacks = me.getSplitStacks(), fullStack = me.getFullStack(), fullStackTotal = me.getFullStackTotal(), range = [0, 0], directions = me['fieldCategory' + direction], dataStart = [], posDataStart = [], negDataStart = [], dataEnd, stacked = me.getStacked(), sprites = me.getSprites(), coordinatedData = [], i, j, k, fields, fieldCount, posTotals, 
  negTotals, fieldCategoriesItem, data, attr;
  if (!sprites.length) {
    return;
  }
  for (i = 0; i < directions.length; i++) {
    fieldCategoriesItem = directions[i];
    fields = me.getFields([fieldCategoriesItem]);
    fieldCount = fields.length;
    for (j = 0; j < itemCount; j++) {
      dataStart[j] = 0;
      posDataStart[j] = 0;
      negDataStart[j] = 0;
    }
    for (j = 0; j < fieldCount; j++) {
      if (!hidden[j]) {
        coordinatedData[j] = me.coordinateData(items, fields[j], axis);
      }
    }
    if (stacked && fullStack) {
      posTotals = [];
      if (splitStacks) {
        negTotals = [];
      }
      for (j = 0; j < itemCount; j++) {
        posTotals[j] = 0;
        if (splitStacks) {
          negTotals[j] = 0;
        }
        for (k = 0; k < fieldCount; k++) {
          data = coordinatedData[k];
          if (!data) {
            continue;
          }
          data = data[j];
          if (data >= 0 || !splitStacks) {
            posTotals[j] += data;
          } else {
            if (data < 0) {
              negTotals[j] += data;
            }
          }
        }
      }
    }
    for (j = 0; j < fieldCount; j++) {
      attr = {};
      if (hidden[j]) {
        attr['dataStart' + fieldCategoriesItem] = dataStart;
        attr['data' + fieldCategoriesItem] = dataStart;
        sprites[j].setAttributes(attr);
        continue;
      }
      data = coordinatedData[j];
      if (stacked) {
        dataEnd = [];
        for (k = 0; k < itemCount; k++) {
          if (!data[k]) {
            data[k] = 0;
          }
          if (data[k] >= 0 || !splitStacks) {
            if (fullStack && posTotals[k]) {
              data[k] *= fullStackTotal / posTotals[k];
            }
            dataStart[k] = posDataStart[k];
            posDataStart[k] += data[k];
            dataEnd[k] = posDataStart[k];
          } else {
            if (fullStack && negTotals[k]) {
              data[k] *= fullStackTotal / negTotals[k];
            }
            dataStart[k] = negDataStart[k];
            negDataStart[k] += data[k];
            dataEnd[k] = negDataStart[k];
          }
        }
        attr['dataStart' + fieldCategoriesItem] = dataStart;
        attr['data' + fieldCategoriesItem] = dataEnd;
        Ext.chart.Util.expandRange(range, dataStart);
        Ext.chart.Util.expandRange(range, dataEnd);
      } else {
        attr['dataStart' + fieldCategoriesItem] = dataStart;
        attr['data' + fieldCategoriesItem] = data;
        Ext.chart.Util.expandRange(range, data);
      }
      sprites[j].setAttributes(attr);
    }
  }
  range = Ext.chart.Util.validateRange(range, me.defaultRange);
  me.dataRange[directionOffset] = range[0];
  me.dataRange[directionOffset + directionCount] = range[1];
  attr = {};
  attr['dataMin' + direction] = range[0];
  attr['dataMax' + direction] = range[1];
  for (i = 0; i < sprites.length; i++) {
    sprites[i].setAttributes(attr);
  }
}, getFields:function(fieldCategory) {
  var me = this, fields = [], ln = fieldCategory.length, i, fieldsItem;
  for (i = 0; i < ln; i++) {
    fieldsItem = me['get' + fieldCategory[i] + 'Field']();
    if (Ext.isArray(fieldsItem)) {
      fields.push.apply(fields, fieldsItem);
    } else {
      fields.push(fieldsItem);
    }
  }
  return fields;
}, updateLabelOverflowPadding:function(labelOverflowPadding) {
  var me = this, label;
  if (!me.isConfiguring) {
    label = me.getLabel();
    if (label) {
      label.setAttributes({labelOverflowPadding:labelOverflowPadding});
    }
  }
}, updateLabelData:function() {
  var me = this, label = me.getLabel();
  if (label) {
    label.setAttributes({labelOverflowPadding:me.getLabelOverflowPadding()});
  }
  me.callParent();
}, getSprites:function() {
  var me = this, chart = me.getChart(), fields = me.getFields(me.fieldCategoryY), itemInstancing = me.getItemInstancing(), sprites = me.sprites, hidden = me.getHidden(), spritesCreated = false, fieldCount = fields.length, i, sprite;
  if (!chart) {
    return [];
  }
  for (i = 0; i < fieldCount; i++) {
    sprite = sprites[i];
    if (!sprite) {
      sprite = me.createSprite();
      sprite.setAttributes({zIndex:(me.reversedSpriteZOrder ? -1 : 1) * i});
      sprite.setField(fields[i]);
      spritesCreated = true;
      hidden.push(false);
      if (itemInstancing) {
        sprite.getMarker('items').getTemplate().setAttributes(me.getStyleByIndex(i));
      } else {
        sprite.setAttributes(me.getStyleByIndex(i));
      }
    }
  }
  if (spritesCreated) {
    me.updateHidden(hidden);
  }
  return sprites;
}, getItemForPoint:function(x, y) {
  var sprites = this.getSprites();
  if (!sprites) {
    return null;
  }
  var me = this, store = me.getStore(), hidden = me.getHidden(), item = null, index, yField, i, ln, sprite;
  for (i = 0, ln = sprites.length; i < ln; i++) {
    if (hidden[i]) {
      continue;
    }
    sprite = sprites[i];
    index = sprite.getIndexNearPoint(x, y);
    if (index !== -1) {
      yField = me.getYField();
      item = {series:me, index:index, category:me.getItemInstancing() ? 'items' : 'markers', record:store.getData().items[index], field:typeof yField === 'string' ? yField : yField[i], sprite:sprite};
      break;
    }
  }
  return item;
}, provideLegendInfo:function(target) {
  var me = this, sprites = me.getSprites(), title = me.getTitle(), field = me.getYField(), hidden = me.getHidden(), single = sprites.length === 1, style, fill, i, name;
  for (i = 0; i < sprites.length; i++) {
    style = me.getStyleByIndex(i);
    fill = style.fillStyle;
    if (title) {
      if (Ext.isArray(title)) {
        name = title[i];
      } else {
        if (single) {
          name = title;
        }
      }
    }
    if (!title || !name) {
      if (Ext.isArray(field)) {
        name = field[i];
      } else {
        name = me.getId();
      }
    }
    target.push({name:name, mark:(Ext.isObject(fill) ? fill.stops && fill.stops[0].color : fill) || style.strokeStyle || 'black', disabled:hidden[i], series:me.getId(), index:i});
  }
}, onSpriteAnimationStart:function(sprite) {
  this.spriteAnimationCount++;
  if (this.spriteAnimationCount === 1) {
    this.fireEvent('animationstart');
  }
}, onSpriteAnimationEnd:function(sprite) {
  this.spriteAnimationCount--;
  if (this.spriteAnimationCount === 0) {
    this.fireEvent('animationend');
  }
}});
Ext.define('Ext.chart.series.sprite.Series', {extend:'Ext.draw.sprite.Sprite', mixins:{markerHolder:'Ext.chart.MarkerHolder'}, inheritableStatics:{def:{processors:{dataMinX:'number', dataMaxX:'number', dataMinY:'number', dataMaxY:'number', rangeX:'data', rangeY:'data', dataX:'data', dataY:'data', labels:'default', labelOverflowPadding:'number'}, defaults:{dataMinX:0, dataMaxX:1, dataMinY:0, dataMaxY:1, rangeX:null, rangeY:null, dataX:null, dataY:null, labels:null, labelOverflowPadding:10}, triggers:{dataX:'bbox', 
dataY:'bbox', dataMinX:'bbox', dataMaxX:'bbox', dataMinY:'bbox', dataMaxY:'bbox'}}}, config:{store:null, series:null, field:null}});
Ext.define('Ext.chart.series.sprite.Cartesian', {extend:'Ext.chart.series.sprite.Series', inheritableStatics:{def:{processors:{selectionTolerance:'number', flipXY:'bool', renderer:'default', visibleMinX:'number', visibleMinY:'number', visibleMaxX:'number', visibleMaxY:'number', innerWidth:'number', innerHeight:'number'}, defaults:{selectionTolerance:20, flipXY:false, renderer:null, transformFillStroke:false, visibleMinX:0, visibleMinY:0, visibleMaxX:1, visibleMaxY:1, innerWidth:1, innerHeight:1}, 
triggers:{dataX:'dataX,bbox', dataY:'dataY,bbox', visibleMinX:'panzoom', visibleMinY:'panzoom', visibleMaxX:'panzoom', visibleMaxY:'panzoom', innerWidth:'panzoom', innerHeight:'panzoom'}, updaters:{dataX:function(attr) {
  this.processDataX();
  this.scheduleUpdater(attr, 'dataY', ['dataY']);
}, dataY:function() {
  this.processDataY();
}, panzoom:function(attr) {
  var dx = attr.visibleMaxX - attr.visibleMinX, dy = attr.visibleMaxY - attr.visibleMinY, innerWidth = attr.flipXY ? attr.innerHeight : attr.innerWidth, innerHeight = !attr.flipXY ? attr.innerHeight : attr.innerWidth, surface = this.getSurface(), isRtl = surface ? surface.getInherited().rtl : false;
  if (isRtl && !attr.flipXY) {
    attr.translationX = innerWidth + attr.visibleMinX * innerWidth / dx;
  } else {
    attr.translationX = -attr.visibleMinX * innerWidth / dx;
  }
  attr.translationY = -attr.visibleMinY * innerHeight / dy;
  attr.scalingX = (isRtl && !attr.flipXY ? -1 : 1) * innerWidth / dx;
  attr.scalingY = innerHeight / dy;
  attr.scalingCenterX = 0;
  attr.scalingCenterY = 0;
  this.applyTransformations(true);
}}}}, processDataY:Ext.emptyFn, processDataX:Ext.emptyFn, updatePlainBBox:function(plain) {
  var attr = this.attr;
  plain.x = attr.dataMinX;
  plain.y = attr.dataMinY;
  plain.width = attr.dataMaxX - attr.dataMinX;
  plain.height = attr.dataMaxY - attr.dataMinY;
}, binarySearch:function(key) {
  var dx = this.attr.dataX, start = 0, end = dx.length;
  if (key <= dx[0]) {
    return start;
  }
  if (key >= dx[end - 1]) {
    return end - 1;
  }
  while (start + 1 < end) {
    var mid = start + end >> 1, val = dx[mid];
    if (val === key) {
      return mid;
    } else {
      if (val < key) {
        start = mid;
      } else {
        end = mid;
      }
    }
  }
  return start;
}, render:function(surface, ctx, surfaceClipRect) {
  var me = this, attr = me.attr, margin = 1, inverseMatrix = attr.inverseMatrix.clone();
  inverseMatrix.appendMatrix(surface.inverseMatrix);
  if (attr.dataX === null || attr.dataX === undefined) {
    return;
  }
  if (attr.dataY === null || attr.dataY === undefined) {
    return;
  }
  if (inverseMatrix.getXX() * inverseMatrix.getYX() || inverseMatrix.getXY() * inverseMatrix.getYY()) {
    Ext.Logger.warn('Cartesian Series sprite does not support rotation/sheering');
    return;
  }
  var dataClipRect = inverseMatrix.transformList([[surfaceClipRect[0] - margin, surfaceClipRect[3] + margin], [surfaceClipRect[0] + surfaceClipRect[2] + margin, -margin]]);
  dataClipRect = dataClipRect[0].concat(dataClipRect[1]);
  me.renderClipped(surface, ctx, dataClipRect, surfaceClipRect);
}, renderClipped:Ext.emptyFn, getIndexNearPoint:function(x, y) {
  var me = this, matrix = me.attr.matrix, dataX = me.attr.dataX, dataY = me.attr.dataY, selectionTolerance = me.attr.selectionTolerance, dx = Infinity, dy = Infinity, index = -1, inverseMatrix = matrix.clone().prependMatrix(me.surfaceMatrix).inverse(), center = inverseMatrix.transformPoint([x, y]), hitboxBL = inverseMatrix.transformPoint([x - selectionTolerance, y - selectionTolerance]), hitboxTR = inverseMatrix.transformPoint([x + selectionTolerance, y + selectionTolerance]), left = Math.min(hitboxBL[0], 
  hitboxTR[0]), right = Math.max(hitboxBL[0], hitboxTR[0]), bottom = Math.min(hitboxBL[1], hitboxTR[1]), top = Math.max(hitboxBL[1], hitboxTR[1]), xi, yi, i, ln;
  for (i = 0, ln = dataX.length; i < ln; i++) {
    xi = dataX[i];
    yi = dataY[i];
    if (xi >= left && xi < right && yi >= bottom && yi < top) {
      if (index === -1 || Math.abs(xi - center[0]) < dx && Math.abs(yi - center[1]) < dy) {
        dx = Math.abs(xi - center[0]);
        dy = Math.abs(yi - center[1]);
        index = i;
      }
    }
  }
  return index;
}});
Ext.define('Ext.chart.series.sprite.StackedCartesian', {extend:'Ext.chart.series.sprite.Cartesian', inheritableStatics:{def:{processors:{groupCount:'number', groupOffset:'number', dataStartY:'data'}, defaults:{selectionTolerance:20, groupCount:1, groupOffset:0, dataStartY:null}, triggers:{dataStartY:'dataY,bbox'}}}});
Ext.define('Ext.chart.series.sprite.Area', {alias:'sprite.areaSeries', extend:'Ext.chart.series.sprite.StackedCartesian', inheritableStatics:{def:{processors:{step:'bool'}, defaults:{step:false}}}, renderClipped:function(surface, ctx, dataClipRect) {
  var me = this, store = me.getStore(), series = me.getSeries(), attr = me.attr, dataX = attr.dataX, dataY = attr.dataY, dataStartY = attr.dataStartY, matrix = attr.matrix, x, y, i, lastX, lastY, startX, startY, xx = matrix.elements[0], dx = matrix.elements[4], yy = matrix.elements[3], dy = matrix.elements[5], surfaceMatrix = me.surfaceMatrix, markerCfg = {}, min = Math.min(dataClipRect[0], dataClipRect[2]), max = Math.max(dataClipRect[0], dataClipRect[2]), start = Math.max(0, this.binarySearch(min)), 
  end = Math.min(dataX.length - 1, this.binarySearch(max) + 1), renderer = attr.renderer, rendererData = {store:store}, rendererChanges;
  ctx.beginPath();
  startX = dataX[start] * xx + dx;
  startY = dataY[start] * yy + dy;
  ctx.moveTo(startX, startY);
  if (attr.step) {
    lastY = startY;
    for (i = start; i <= end; i++) {
      x = dataX[i] * xx + dx;
      y = dataY[i] * yy + dy;
      ctx.lineTo(x, lastY);
      ctx.lineTo(x, lastY = y);
    }
  } else {
    for (i = start; i <= end; i++) {
      x = dataX[i] * xx + dx;
      y = dataY[i] * yy + dy;
      ctx.lineTo(x, y);
    }
  }
  if (dataStartY) {
    if (attr.step) {
      lastX = dataX[end] * xx + dx;
      for (i = end; i >= start; i--) {
        x = dataX[i] * xx + dx;
        y = dataStartY[i] * yy + dy;
        ctx.lineTo(lastX, y);
        ctx.lineTo(lastX = x, y);
      }
    } else {
      for (i = end; i >= start; i--) {
        x = dataX[i] * xx + dx;
        y = dataStartY[i] * yy + dy;
        ctx.lineTo(x, y);
      }
    }
  } else {
    ctx.lineTo(dataX[end] * xx + dx, y);
    ctx.lineTo(dataX[end] * xx + dx, dy);
    ctx.lineTo(startX, dy);
    ctx.lineTo(startX, dataY[i] * yy + dy);
  }
  if (attr.transformFillStroke) {
    attr.matrix.toContext(ctx);
  }
  ctx.fill();
  if (attr.transformFillStroke) {
    attr.inverseMatrix.toContext(ctx);
  }
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  if (attr.step) {
    for (i = start; i <= end; i++) {
      x = dataX[i] * xx + dx;
      y = dataY[i] * yy + dy;
      ctx.lineTo(x, lastY);
      ctx.lineTo(x, lastY = y);
      markerCfg.translationX = surfaceMatrix.x(x, y);
      markerCfg.translationY = surfaceMatrix.y(x, y);
      if (renderer) {
        rendererChanges = Ext.callback(renderer, null, [me, markerCfg, rendererData, i], 0, series);
        Ext.apply(markerCfg, rendererChanges);
      }
      me.putMarker('markers', markerCfg, i, !renderer);
    }
  } else {
    for (i = start; i <= end; i++) {
      x = dataX[i] * xx + dx;
      y = dataY[i] * yy + dy;
      ctx.lineTo(x, y);
      markerCfg.translationX = surfaceMatrix.x(x, y);
      markerCfg.translationY = surfaceMatrix.y(x, y);
      if (renderer) {
        rendererChanges = Ext.callback(renderer, null, [me, markerCfg, rendererData, i], 0, series);
        Ext.apply(markerCfg, rendererChanges);
      }
      me.putMarker('markers', markerCfg, i, !renderer);
    }
  }
  if (attr.transformFillStroke) {
    attr.matrix.toContext(ctx);
  }
  ctx.stroke();
}});
Ext.define('Ext.chart.series.Area', {extend:'Ext.chart.series.StackedCartesian', alias:'series.area', type:'area', seriesType:'areaSeries', isArea:true, requires:['Ext.chart.series.sprite.Area'], config:{splitStacks:false}});
Ext.define('Ext.chart.series.sprite.Bar', {alias:'sprite.barSeries', extend:'Ext.chart.series.sprite.StackedCartesian', inheritableStatics:{def:{processors:{minBarWidth:'number', maxBarWidth:'number', minGapWidth:'number', radius:'number', inGroupGapWidth:'number'}, defaults:{minBarWidth:2, maxBarWidth:100, minGapWidth:5, inGroupGapWidth:3, radius:0}}}, drawLabel:function(text, dataX, dataStartY, dataY, labelId) {
  var me = this, attr = me.attr, label = me.getMarker('labels'), labelTpl = label.getTemplate(), labelCfg = me.labelCfg || (me.labelCfg = {}), surfaceMatrix = me.surfaceMatrix, labelOverflowPadding = attr.labelOverflowPadding, labelDisplay = labelTpl.attr.display, labelOrientation = labelTpl.attr.orientation, isVerticalText = labelOrientation === 'horizontal' && attr.flipXY || labelOrientation === 'vertical' && !attr.flipXY || !labelOrientation, calloutLine = labelTpl.getCalloutLine(), labelY, halfText, 
  labelBBox, calloutLineLength, changes, hasPendingChanges, params;
  labelCfg.x = surfaceMatrix.x(dataX, dataY);
  labelCfg.y = surfaceMatrix.y(dataX, dataY);
  if (calloutLine) {
    calloutLineLength = calloutLine.length;
  } else {
    calloutLineLength = 0;
  }
  if (!attr.flipXY) {
    labelCfg.rotationRads = -Math.PI * 0.5;
  } else {
    labelCfg.rotationRads = 0;
  }
  labelCfg.calloutVertical = !attr.flipXY;
  switch(labelOrientation) {
    case 'horizontal':
      labelCfg.rotationRads = 0;
      labelCfg.calloutVertical = false;
      break;
    case 'vertical':
      labelCfg.rotationRads = -Math.PI * 0.5;
      labelCfg.calloutVertical = true;
      break;
  }
  labelCfg.text = text;
  if (labelTpl.attr.renderer) {
    if (!label.get(labelId)) {
      label.putMarkerFor('labels', {}, labelId);
    }
    params = [text, label, labelCfg, {store:me.getStore()}, labelId];
    changes = Ext.callback(labelTpl.attr.renderer, null, params, 0, me.getSeries());
    if (typeof changes === 'string') {
      labelCfg.text = changes;
    } else {
      if (typeof changes === 'object') {
        if ('text' in changes) {
          labelCfg.text = changes.text;
        }
        hasPendingChanges = true;
      }
    }
  }
  labelBBox = me.getMarkerBBox('labels', labelId, true);
  if (!labelBBox) {
    me.putMarker('labels', labelCfg, labelId);
    labelBBox = me.getMarkerBBox('labels', labelId, true);
  }
  if (calloutLineLength > 0) {
    halfText = calloutLineLength;
  } else {
    if (calloutLineLength === 0) {
      halfText = (isVerticalText ? labelBBox.width : labelBBox.height) / 2;
    } else {
      halfText = (isVerticalText ? labelBBox.width : labelBBox.height) / 2 + labelOverflowPadding;
    }
  }
  if (dataStartY > dataY) {
    halfText = -halfText;
  }
  if (isVerticalText) {
    labelY = labelDisplay === 'insideStart' ? dataStartY + halfText : dataY - halfText;
  } else {
    labelY = labelDisplay === 'insideStart' ? dataStartY + labelOverflowPadding * 2 : dataY - labelOverflowPadding * 2;
  }
  labelCfg.x = surfaceMatrix.x(dataX, labelY);
  labelCfg.y = surfaceMatrix.y(dataX, labelY);
  labelY = labelDisplay === 'insideStart' ? dataStartY : dataY;
  labelCfg.calloutStartX = surfaceMatrix.x(dataX, labelY);
  labelCfg.calloutStartY = surfaceMatrix.y(dataX, labelY);
  labelY = labelDisplay === 'insideStart' ? dataStartY - halfText : dataY + halfText;
  labelCfg.calloutPlaceX = surfaceMatrix.x(dataX, labelY);
  labelCfg.calloutPlaceY = surfaceMatrix.y(dataX, labelY);
  labelCfg.calloutColor = calloutLine && calloutLine.color || me.attr.fillStyle;
  if (calloutLine) {
    if (calloutLine.width) {
      labelCfg.calloutWidth = calloutLine.width;
    }
  } else {
    labelCfg.calloutColor = 'none';
  }
  if (dataStartY > dataY) {
    halfText = -halfText;
  }
  if (Math.abs(dataY - dataStartY) <= halfText * 2 || labelDisplay === 'outside') {
    labelCfg.callout = 1;
  } else {
    labelCfg.callout = 0;
  }
  if (hasPendingChanges) {
    Ext.apply(labelCfg, changes);
  }
  me.putMarker('labels', labelCfg, labelId);
}, drawBar:function(ctx, surface, rect, left, top, right, bottom, index) {
  var me = this, itemCfg = {}, renderer = me.attr.renderer, changes;
  itemCfg.x = left;
  itemCfg.y = top;
  itemCfg.width = right - left;
  itemCfg.height = bottom - top;
  itemCfg.radius = me.attr.radius;
  if (renderer) {
    changes = Ext.callback(renderer, null, [me, itemCfg, {store:me.getStore()}, index], 0, me.getSeries());
    Ext.apply(itemCfg, changes);
  }
  me.putMarker('items', itemCfg, index, !renderer);
}, renderClipped:function(surface, ctx, dataClipRect) {
  if (this.cleanRedraw) {
    return;
  }
  var me = this, attr = me.attr, dataX = attr.dataX, dataY = attr.dataY, dataText = attr.labels, dataStartY = attr.dataStartY, groupCount = attr.groupCount, groupOffset = attr.groupOffset - (groupCount - 1) * 0.5, inGroupGapWidth = attr.inGroupGapWidth, lineWidth = ctx.lineWidth, matrix = attr.matrix, xx = matrix.elements[0], yy = matrix.elements[3], dx = matrix.elements[4], dy = surface.roundPixel(matrix.elements[5]) - 1, maxBarWidth = Math.abs(xx) - attr.minGapWidth, minBarWidth = (Math.min(maxBarWidth, 
  attr.maxBarWidth) - inGroupGapWidth * (groupCount - 1)) / groupCount, barWidth = surface.roundPixel(Math.max(attr.minBarWidth, minBarWidth)), surfaceMatrix = me.surfaceMatrix, left, right, bottom, top, i, center, halfLineWidth = 0.5 * attr.lineWidth, min = Math.min(dataClipRect[0], dataClipRect[2]), max = Math.max(dataClipRect[0], dataClipRect[2]), start = Math.max(0, Math.floor(min)), end = Math.min(dataX.length - 1, Math.ceil(max)), isDrawLabels = dataText && me.getMarker('labels'), yLow, yHi;
  for (i = start; i <= end; i++) {
    yLow = dataStartY ? dataStartY[i] : 0;
    yHi = dataY[i];
    center = dataX[i] * xx + dx + groupOffset * (barWidth + inGroupGapWidth);
    left = surface.roundPixel(center - barWidth / 2) + halfLineWidth;
    top = surface.roundPixel(yHi * yy + dy + lineWidth);
    right = surface.roundPixel(center + barWidth / 2) - halfLineWidth;
    bottom = surface.roundPixel(yLow * yy + dy + lineWidth);
    me.drawBar(ctx, surface, dataClipRect, left, top - halfLineWidth, right, bottom - halfLineWidth, i);
    if (isDrawLabels && dataText[i] != null) {
      me.drawLabel(dataText[i], center, bottom, top, i);
    }
    me.putMarker('markers', {translationX:surfaceMatrix.x(center, top), translationY:surfaceMatrix.y(center, top)}, i, true);
  }
}, getIndexNearPoint:function(x, y) {
  var sprite = this, attr = sprite.attr, dataX = attr.dataX, surface = sprite.getSurface(), surfaceRect = surface.getRect() || [0, 0, 0, 0], surfaceHeight = surfaceRect[3], hitX, hitY, i, bbox, index = -1;
  if (attr.flipXY) {
    hitX = surfaceHeight - y;
    if (surface.getInherited().rtl) {
      hitY = surfaceRect[2] - x;
    } else {
      hitY = x;
    }
  } else {
    hitX = x;
    hitY = surfaceHeight - y;
  }
  for (i = 0; i < dataX.length; i++) {
    bbox = sprite.getMarkerBBox('items', i);
    if (Ext.draw.Draw.isPointInBBox(hitX, hitY, bbox)) {
      index = i;
      break;
    }
  }
  return index;
}});
Ext.define('Ext.chart.series.Bar', {extend:'Ext.chart.series.StackedCartesian', alias:'series.bar', type:'bar', seriesType:'barSeries', isBar:true, requires:['Ext.chart.series.sprite.Bar', 'Ext.draw.sprite.Rect'], config:{itemInstancing:{type:'rect', animation:{customDurations:{x:0, y:0, width:0, height:0, radius:0}}}}, getItemForPoint:function(x, y) {
  if (this.getSprites()) {
    var me = this, chart = me.getChart(), padding = chart.getInnerPadding(), isRtl = chart.getInherited().rtl;
    arguments[0] = x + (isRtl ? padding.right : -padding.left);
    arguments[1] = y + padding.bottom;
    return me.callParent(arguments);
  }
}, updateXAxis:function(xAxis) {
  if (!this.is3D && !xAxis.isCategory) {
    Ext.raise("'bar' series should be used with a 'category' axis. Please refer to the bar series docs.");
  }
  xAxis.setExpandRangeBy(0.5);
  this.callParent(arguments);
}, updateHidden:function(hidden) {
  this.callParent(arguments);
  this.updateStacked();
}, updateStacked:function(stacked) {
  var me = this, attributes = {}, sprites = me.getSprites(), spriteCount = sprites.length, visibleSprites = [], visibleSpriteCount, i;
  for (i = 0; i < spriteCount; i++) {
    if (!sprites[i].attr.hidden) {
      visibleSprites.push(sprites[i]);
    }
  }
  visibleSpriteCount = visibleSprites.length;
  if (me.getStacked()) {
    attributes.groupCount = 1;
    attributes.groupOffset = 0;
    for (i = 0; i < visibleSpriteCount; i++) {
      visibleSprites[i].setAttributes(attributes);
    }
  } else {
    attributes.groupCount = visibleSpriteCount;
    for (i = 0; i < visibleSpriteCount; i++) {
      attributes.groupOffset = i;
      visibleSprites[i].setAttributes(attributes);
    }
  }
  me.callParent(arguments);
}});
Ext.define('Ext.chart.series.sprite.Bar3D', {extend:'Ext.chart.series.sprite.Bar', alias:'sprite.bar3dSeries', requires:['Ext.draw.gradient.Linear'], inheritableStatics:{def:{processors:{depthWidthRatio:'number', saturationFactor:'number', brightnessFactor:'number', colorSpread:'number'}, defaults:{depthWidthRatio:1 / 3, saturationFactor:1, brightnessFactor:1, colorSpread:1, transformFillStroke:true}, triggers:{groupCount:'panzoom'}, updaters:{panzoom:function(attr) {
  var me = this, dx = attr.visibleMaxX - attr.visibleMinX, dy = attr.visibleMaxY - attr.visibleMinY, innerWidth = attr.flipXY ? attr.innerHeight : attr.innerWidth, innerHeight = !attr.flipXY ? attr.innerHeight : attr.innerWidth, surface = me.getSurface(), isRtl = surface ? surface.getInherited().rtl : false;
  if (isRtl && !attr.flipXY) {
    attr.translationX = innerWidth + attr.visibleMinX * innerWidth / dx;
  } else {
    attr.translationX = -attr.visibleMinX * innerWidth / dx;
  }
  attr.translationY = -attr.visibleMinY * (innerHeight - me.depth) / dy;
  attr.scalingX = (isRtl && !attr.flipXY ? -1 : 1) * innerWidth / dx;
  attr.scalingY = (innerHeight - me.depth) / dy;
  attr.scalingCenterX = 0;
  attr.scalingCenterY = 0;
  me.applyTransformations(true);
}}}}, config:{showStroke:false}, depth:0, drawBar:function(ctx, surface, clip, left, top, right, bottom, index) {
  var me = this, attr = me.attr, itemCfg = {}, renderer = attr.renderer, changes, depth, series, params;
  itemCfg.x = (left + right) * 0.5;
  itemCfg.y = top;
  itemCfg.width = (right - left) * 0.75;
  itemCfg.height = bottom - top;
  itemCfg.depth = depth = itemCfg.width * attr.depthWidthRatio;
  itemCfg.orientation = attr.flipXY ? 'horizontal' : 'vertical';
  itemCfg.saturationFactor = attr.saturationFactor;
  itemCfg.brightnessFactor = attr.brightnessFactor;
  itemCfg.colorSpread = attr.colorSpread;
  if (depth !== me.depth) {
    me.depth = depth;
    series = me.getSeries();
    series.fireEvent('depthchange', series, depth);
  }
  if (renderer) {
    params = [me, itemCfg, {store:me.getStore()}, index];
    changes = Ext.callback(renderer, null, params, 0, me.getSeries());
    Ext.apply(itemCfg, changes);
  }
  me.putMarker('items', itemCfg, index, !renderer);
}});
Ext.define('Ext.chart.sprite.Bar3D', {extend:'Ext.draw.sprite.Sprite', alias:'sprite.bar3d', type:'bar3d', inheritableStatics:{def:{processors:{x:'number', y:'number', width:'number', height:'number', depth:'number', orientation:'enums(vertical,horizontal)', showStroke:'bool', saturationFactor:'number', brightnessFactor:'number', colorSpread:'number'}, triggers:{x:'bbox', y:'bbox', width:'bbox', height:'bbox', depth:'bbox', orientation:'bbox'}, defaults:{x:0, y:0, width:8, height:8, depth:8, orientation:'vertical', 
showStroke:false, saturationFactor:1, brightnessFactor:1, colorSpread:1, lineJoin:'bevel'}}}, constructor:function(config) {
  this.callParent([config]);
  this.topGradient = new Ext.draw.gradient.Linear({});
  this.rightGradient = new Ext.draw.gradient.Linear({});
  this.frontGradient = new Ext.draw.gradient.Linear({});
}, updatePlainBBox:function(plain) {
  var attr = this.attr, x = attr.x, y = attr.y, width = attr.width, height = attr.height, depth = attr.depth;
  plain.x = x - width * 0.5;
  plain.width = width + depth;
  if (height > 0) {
    plain.y = y;
    plain.height = height + depth;
  } else {
    plain.y = y + depth;
    plain.height = height - depth;
  }
}, render:function(surface, ctx) {
  var me = this, attr = me.attr, center = attr.x, top = attr.y, bottom = top + attr.height, isNegative = top < bottom, halfWidth = attr.width * 0.5, depth = attr.depth, isHorizontal = attr.orientation === 'horizontal', isTransparent = attr.globalAlpha < 1, fillStyle = attr.fillStyle, color = Ext.util.Color.create(fillStyle.isGradient ? fillStyle.getStops()[0].color : fillStyle), saturationFactor = attr.saturationFactor, brightnessFactor = attr.brightnessFactor, colorSpread = attr.colorSpread, hsv = 
  color.getHSV(), bbox = {}, roundX, roundY, temp;
  if (!attr.showStroke) {
    ctx.strokeStyle = Ext.util.Color.RGBA_NONE;
  }
  if (isNegative) {
    temp = top;
    top = bottom;
    bottom = temp;
  }
  me.topGradient.setDegrees(isHorizontal ? 0 : 80);
  me.topGradient.setStops([{offset:0, color:Ext.util.Color.fromHSV(hsv[0], Ext.Number.constrain(hsv[1] * saturationFactor, 0, 1), Ext.Number.constrain((0.5 + colorSpread * 0.1) * brightnessFactor, 0, 1))}, {offset:1, color:Ext.util.Color.fromHSV(hsv[0], Ext.Number.constrain(hsv[1] * saturationFactor, 0, 1), Ext.Number.constrain((0.5 - colorSpread * 0.11) * brightnessFactor, 0, 1))}]);
  me.rightGradient.setDegrees(isHorizontal ? 45 : 90);
  me.rightGradient.setStops([{offset:0, color:Ext.util.Color.fromHSV(hsv[0], Ext.Number.constrain(hsv[1] * saturationFactor, 0, 1), Ext.Number.constrain((0.5 - colorSpread * 0.14) * brightnessFactor, 0, 1))}, {offset:1, color:Ext.util.Color.fromHSV(hsv[0], Ext.Number.constrain(hsv[1] * (1 + colorSpread * 0.4) * saturationFactor, 0, 1), Ext.Number.constrain((0.5 - colorSpread * 0.32) * brightnessFactor, 0, 1))}]);
  if (isHorizontal) {
    me.frontGradient.setDegrees(0);
  } else {
    me.frontGradient.setRadians(Math.atan2(top - bottom, halfWidth * 2));
  }
  me.frontGradient.setStops([{offset:0, color:Ext.util.Color.fromHSV(hsv[0], Ext.Number.constrain(hsv[1] * (1 - colorSpread * 0.1) * saturationFactor, 0, 1), Ext.Number.constrain((0.5 + colorSpread * 0.1) * brightnessFactor, 0, 1))}, {offset:1, color:Ext.util.Color.fromHSV(hsv[0], Ext.Number.constrain(hsv[1] * (1 + colorSpread * 0.1) * saturationFactor, 0, 1), Ext.Number.constrain((0.5 - colorSpread * 0.23) * brightnessFactor, 0, 1))}]);
  if (isTransparent || isNegative) {
    ctx.beginPath();
    ctx.moveTo(center - halfWidth, bottom);
    ctx.lineTo(center - halfWidth + depth, bottom + depth);
    ctx.lineTo(center + halfWidth + depth, bottom + depth);
    ctx.lineTo(center + halfWidth, bottom);
    ctx.closePath();
    bbox.x = center - halfWidth;
    bbox.y = top;
    bbox.width = halfWidth + depth;
    bbox.height = depth;
    ctx.fillStyle = (isHorizontal ? me.rightGradient : me.topGradient).generateGradient(ctx, bbox);
    ctx.fillStroke(attr);
  }
  if (isTransparent) {
    ctx.beginPath();
    ctx.moveTo(center - halfWidth, top);
    ctx.lineTo(center - halfWidth + depth, top + depth);
    ctx.lineTo(center - halfWidth + depth, bottom + depth);
    ctx.lineTo(center - halfWidth, bottom);
    ctx.closePath();
    bbox.x = center + halfWidth;
    bbox.y = bottom;
    bbox.width = depth;
    bbox.height = top + depth - bottom;
    ctx.fillStyle = (isHorizontal ? me.topGradient : me.rightGradient).generateGradient(ctx, bbox);
    ctx.fillStroke(attr);
  }
  roundY = surface.roundPixel(top);
  ctx.beginPath();
  ctx.moveTo(center - halfWidth, roundY);
  ctx.lineTo(center - halfWidth + depth, top + depth);
  ctx.lineTo(center + halfWidth + depth, top + depth);
  ctx.lineTo(center + halfWidth, roundY);
  ctx.closePath();
  bbox.x = center - halfWidth;
  bbox.y = top;
  bbox.width = halfWidth + depth;
  bbox.height = depth;
  ctx.fillStyle = (isHorizontal ? me.rightGradient : me.topGradient).generateGradient(ctx, bbox);
  ctx.fillStroke(attr);
  roundX = surface.roundPixel(center + halfWidth);
  ctx.beginPath();
  ctx.moveTo(roundX, surface.roundPixel(top));
  ctx.lineTo(center + halfWidth + depth, top + depth);
  ctx.lineTo(center + halfWidth + depth, bottom + depth);
  ctx.lineTo(roundX, bottom);
  ctx.closePath();
  bbox.x = center + halfWidth;
  bbox.y = bottom;
  bbox.width = depth;
  bbox.height = top + depth - bottom;
  ctx.fillStyle = (isHorizontal ? me.topGradient : me.rightGradient).generateGradient(ctx, bbox);
  ctx.fillStroke(attr);
  roundX = surface.roundPixel(center + halfWidth);
  roundY = surface.roundPixel(top);
  ctx.beginPath();
  ctx.moveTo(center - halfWidth, bottom);
  ctx.lineTo(center - halfWidth, roundY);
  ctx.lineTo(roundX, roundY);
  ctx.lineTo(roundX, bottom);
  ctx.closePath();
  bbox.x = center - halfWidth;
  bbox.y = bottom;
  bbox.width = halfWidth * 2;
  bbox.height = top - bottom;
  ctx.fillStyle = me.frontGradient.generateGradient(ctx, bbox);
  ctx.fillStroke(attr);
}});
Ext.define('Ext.chart.series.Bar3D', {extend:'Ext.chart.series.Bar', requires:['Ext.chart.series.sprite.Bar3D', 'Ext.chart.sprite.Bar3D'], alias:'series.bar3d', type:'bar3d', seriesType:'bar3dSeries', is3D:true, config:{itemInstancing:{type:'bar3d', animation:{customDurations:{x:0, y:0, width:0, height:0, depth:0}}}, highlightCfg:{opacity:0.8}}, reversedSpriteZOrder:false, updateXAxis:function(xAxis, oldXAxis) {
  if (xAxis.type !== 'category3d') {
    Ext.raise("'bar3d' series should be used with a 'category3d' axis." + " Please refer to the 'bar3d' series docs.");
  }
  this.callParent([xAxis, oldXAxis]);
}, getDepth:function() {
  var sprite = this.getSprites()[0];
  return sprite ? sprite.depth || 0 : 0;
}, getItemForPoint:function(x, y) {
  var sprites = this.getSprites();
  if (!sprites) {
    return null;
  }
  var me = this, itemInstancing = me.getItemInstancing(), store = me.getStore(), hidden = me.getHidden(), chart = me.getChart(), padding = chart.getInnerPadding(), isRtl = chart.getInherited().rtl, item = null, index, yField, i, sprite;
  x = x + (isRtl ? padding.right : -padding.left);
  y = y + padding.bottom;
  for (i = sprites.length - 1; i >= 0; i--) {
    if (hidden[i]) {
      continue;
    }
    sprite = sprites[i];
    index = sprite.getIndexNearPoint(x, y);
    if (index !== -1) {
      yField = me.getYField();
      item = {series:me, index:index, category:itemInstancing ? 'items' : 'markers', record:store.getData().items[index], field:typeof yField === 'string' ? yField : yField[i], sprite:sprite};
      break;
    }
  }
  return item;
}});
Ext.define('Ext.chart.series.sprite.BoxPlot', {alias:'sprite.boxplotSeries', extend:'Ext.chart.series.sprite.Cartesian', inheritableStatics:{def:{processors:{dataLow:'data', dataQ1:'data', dataQ3:'data', dataHigh:'data', minBoxWidth:'number', maxBoxWidth:'number', minGapWidth:'number'}, aliases:{dataMedian:'dataY'}, defaults:{minBoxWidth:2, maxBoxWidth:40, minGapWidth:5}}}, renderClipped:function(surface, ctx, dataClipRect) {
  if (this.cleanRedraw) {
    return;
  }
  var me = this, attr = me.attr, series = me.getSeries(), renderer = attr.renderer, rendererData = {store:me.getStore()}, itemCfg = {}, dataX = attr.dataX, dataLow = attr.dataLow, dataQ1 = attr.dataQ1, dataMedian = attr.dataY, dataQ3 = attr.dataQ3, dataHigh = attr.dataHigh, min = Math.min(dataClipRect[0], dataClipRect[2]), max = Math.max(dataClipRect[0], dataClipRect[2]), start = Math.max(0, Math.floor(min)), end = Math.min(dataX.length - 1, Math.ceil(max)), matrix = attr.matrix, xx = matrix.elements[0], 
  yy = matrix.elements[3], dx = matrix.elements[4], dy = matrix.elements[5], maxBoxWidth = Math.abs(xx) - attr.minGapWidth, minBoxWidth = Math.min(maxBoxWidth, attr.maxBoxWidth), boxWidth = Math.round(Math.max(attr.minBoxWidth, minBoxWidth)), x, low, q1, median, q3, high, rendererParams, changes, i;
  if (renderer) {
    rendererParams = [me, itemCfg, rendererData];
  }
  for (i = start; i <= end; i++) {
    x = dataX[i] * xx + dx;
    low = dataLow[i] * yy + dy;
    q1 = dataQ1[i] * yy + dy;
    median = dataMedian[i] * yy + dy;
    q3 = dataQ3[i] * yy + dy;
    high = dataHigh[i] * yy + dy;
    itemCfg.x = x;
    itemCfg.low = low;
    itemCfg.q1 = q1;
    itemCfg.median = median;
    itemCfg.q3 = q3;
    itemCfg.high = high;
    itemCfg.boxWidth = boxWidth;
    if (renderer) {
      rendererParams[3] = i;
      changes = Ext.callback(renderer, null, rendererParams, 0, series);
      Ext.apply(itemCfg, changes);
    }
    me.putMarker('items', itemCfg, i, !renderer);
  }
}, getIndexNearPoint:function(x, y) {
  var sprite = this, attr = sprite.attr, dataX = attr.dataX, surface = sprite.getSurface(), surfaceRect = surface.getRect() || [0, 0, 0, 0], surfaceHeight = surfaceRect[3], index = -1, hitX, hitY, i, bbox;
  if (attr.flipXY) {
    hitX = surfaceHeight - y;
    if (surface.getInherited().rtl) {
      hitY = surfaceRect[2] - x;
    } else {
      hitY = x;
    }
  } else {
    hitX = x;
    hitY = surfaceHeight - y;
  }
  for (i = 0; i < dataX.length; i++) {
    bbox = sprite.getMarkerBBox('items', i);
    if (Ext.draw.Draw.isPointInBBox(hitX, hitY, bbox)) {
      index = i;
      break;
    }
  }
  return index;
}});
Ext.define('Ext.chart.sprite.BoxPlot', {extend:'Ext.draw.sprite.Sprite', alias:'sprite.boxplot', type:'boxplot', inheritableStatics:{def:{processors:{x:'number', low:'number', q1:'number', median:'number', q3:'number', high:'number', boxWidth:'number', whiskerWidth:'number', crisp:'bool'}, triggers:{x:'bbox', low:'bbox', high:'bbox', boxWidth:'bbox', whiskerWidth:'bbox', crisp:'bbox'}, defaults:{x:0, low:-20, q1:-10, median:0, q3:10, high:20, boxWidth:12, whiskerWidth:0.5, crisp:true, fillStyle:'#ccc', 
strokeStyle:'#000'}}}, updatePlainBBox:function(plain) {
  var me = this, attr = me.attr, halfLineWidth = attr.lineWidth / 2, x = attr.x - attr.boxWidth / 2 - halfLineWidth, y = attr.high - halfLineWidth, width = attr.boxWidth + attr.lineWidth, height = attr.low - attr.high + attr.lineWidth;
  plain.x = x;
  plain.y = y;
  plain.width = width;
  plain.height = height;
}, render:function(surface, ctx) {
  var me = this, attr = me.attr;
  attr.matrix.toContext(ctx);
  if (attr.crisp) {
    me.crispRender(surface, ctx);
  } else {
    me.softRender(surface, ctx);
  }
  var debug = attr.debug || this.statics().debug || Ext.draw.sprite.Sprite.debug;
  if (debug) {
    this.attr.inverseMatrix.toContext(ctx);
    debug.bbox && this.renderBBox(surface, ctx);
  }
}, softRender:function(surface, ctx) {
  var me = this, attr = me.attr, x = attr.x, low = attr.low, q1 = attr.q1, median = attr.median, q3 = attr.q3, high = attr.high, halfBoxWidth = attr.boxWidth / 2, halfWhiskerWidth = attr.boxWidth * attr.whiskerWidth / 2, dash = ctx.getLineDash();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(x - halfBoxWidth, q3);
  ctx.lineTo(x + halfBoxWidth, q3);
  ctx.lineTo(x + halfBoxWidth, q1);
  ctx.lineTo(x - halfBoxWidth, q1);
  ctx.closePath();
  ctx.fillStroke(attr, true);
  ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(x, q3);
  ctx.lineTo(x, high);
  ctx.moveTo(x, q1);
  ctx.lineTo(x, low);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(x - halfWhiskerWidth, low);
  ctx.lineTo(x + halfWhiskerWidth, low);
  ctx.moveTo(x - halfBoxWidth, median);
  ctx.lineTo(x + halfBoxWidth, median);
  ctx.moveTo(x - halfWhiskerWidth, high);
  ctx.lineTo(x + halfWhiskerWidth, high);
  ctx.stroke();
}, alignLine:function(x, lineWidth) {
  lineWidth = lineWidth || this.attr.lineWidth;
  x = Math.round(x);
  if (lineWidth % 2 === 1) {
    x -= 0.5;
  }
  return x;
}, crispRender:function(surface, ctx) {
  var me = this, attr = me.attr, x = attr.x, low = me.alignLine(attr.low), q1 = me.alignLine(attr.q1), median = me.alignLine(attr.median), q3 = me.alignLine(attr.q3), high = me.alignLine(attr.high), halfBoxWidth = attr.boxWidth / 2, halfWhiskerWidth = attr.boxWidth * attr.whiskerWidth / 2, stemX = me.alignLine(x), boxLeft = me.alignLine(x - halfBoxWidth), boxRight = me.alignLine(x + halfBoxWidth), whiskerLeft = stemX + Math.round(-halfWhiskerWidth), whiskerRight = stemX + Math.round(halfWhiskerWidth), 
  dash = ctx.getLineDash();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(boxLeft, q3);
  ctx.lineTo(boxRight, q3);
  ctx.lineTo(boxRight, q1);
  ctx.lineTo(boxLeft, q1);
  ctx.closePath();
  ctx.fillStroke(attr, true);
  ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(stemX, q3);
  ctx.lineTo(stemX, high);
  ctx.moveTo(stemX, q1);
  ctx.lineTo(stemX, low);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(whiskerLeft, low);
  ctx.lineTo(whiskerRight, low);
  ctx.moveTo(boxLeft, median);
  ctx.lineTo(boxRight, median);
  ctx.moveTo(whiskerLeft, high);
  ctx.lineTo(whiskerRight, high);
  ctx.stroke();
}});
Ext.define('Ext.chart.series.BoxPlot', {extend:'Ext.chart.series.Cartesian', alias:'series.boxplot', type:'boxplot', seriesType:'boxplotSeries', isBoxPlot:true, requires:['Ext.chart.series.sprite.BoxPlot', 'Ext.chart.sprite.BoxPlot'], config:{itemInstancing:{type:'boxplot', animation:{customDurations:{x:0, low:0, q1:0, median:0, q3:0, high:0}}}, lowField:'low', q1Field:'q1', medianField:'median', q3Field:'q3', highField:'high'}, fieldCategoryY:['Low', 'Q1', 'Median', 'Q3', 'High'], updateXAxis:function(xAxis) {
  xAxis.setExpandRangeBy(0.5);
  this.callParent(arguments);
}});
Ext.define('Ext.draw.LimitedCache', {config:{limit:40, feeder:function() {
  return 0;
}, scope:null}, cache:null, constructor:function(config) {
  this.cache = {};
  this.cache.list = [];
  this.cache.tail = 0;
  this.initConfig(config);
}, get:function(id) {
  var cache = this.cache, limit = this.getLimit(), feeder = this.getFeeder(), scope = this.getScope() || this;
  if (cache[id]) {
    return cache[id].value;
  }
  if (cache.list[cache.tail]) {
    delete cache[cache.list[cache.tail].cacheId];
  }
  cache[id] = cache.list[cache.tail] = {value:feeder.apply(scope, Array.prototype.slice.call(arguments, 1)), cacheId:id};
  cache.tail++;
  if (cache.tail === limit) {
    cache.tail = 0;
  }
  return cache[id].value;
}, clear:function() {
  this.cache = {};
  this.cache.list = [];
  this.cache.tail = 0;
}});
Ext.define('Ext.draw.SegmentTree', {config:{strategy:'double'}, time:function(result, last, dataX, dataOpen, dataHigh, dataLow, dataClose) {
  var start = 0, lastOffset, lastOffsetEnd, minimum = new Date(dataX[result.startIdx[0]]), maximum = new Date(dataX[result.endIdx[last - 1]]), extDate = Ext.Date, units = [[extDate.MILLI, 1, 'ms1', null], [extDate.MILLI, 2, 'ms2', 'ms1'], [extDate.MILLI, 5, 'ms5', 'ms1'], [extDate.MILLI, 10, 'ms10', 'ms5'], [extDate.MILLI, 50, 'ms50', 'ms10'], [extDate.MILLI, 100, 'ms100', 'ms50'], [extDate.MILLI, 500, 'ms500', 'ms100'], [extDate.SECOND, 1, 's1', 'ms500'], [extDate.SECOND, 10, 's10', 's1'], [extDate.SECOND, 
  30, 's30', 's10'], [extDate.MINUTE, 1, 'mi1', 's10'], [extDate.MINUTE, 5, 'mi5', 'mi1'], [extDate.MINUTE, 10, 'mi10', 'mi5'], [extDate.MINUTE, 30, 'mi30', 'mi10'], [extDate.HOUR, 1, 'h1', 'mi30'], [extDate.HOUR, 6, 'h6', 'h1'], [extDate.HOUR, 12, 'h12', 'h6'], [extDate.DAY, 1, 'd1', 'h12'], [extDate.DAY, 7, 'd7', 'd1'], [extDate.MONTH, 1, 'mo1', 'd1'], [extDate.MONTH, 3, 'mo3', 'mo1'], [extDate.MONTH, 6, 'mo6', 'mo3'], [extDate.YEAR, 1, 'y1', 'mo3'], [extDate.YEAR, 5, 'y5', 'y1'], [extDate.YEAR, 
  10, 'y10', 'y5'], [extDate.YEAR, 100, 'y100', 'y10']], unitIdx, currentUnit, plainStart = start, plainEnd = last, first = false, startIdxs = result.startIdx, endIdxs = result.endIdx, minIdxs = result.minIdx, maxIdxs = result.maxIdx, opens = result.open, closes = result.close, minXs = result.minX, minYs = result.minY, maxXs = result.maxX, maxYs = result.maxY, i, current;
  for (unitIdx = 0; last > start + 1 && unitIdx < units.length; unitIdx++) {
    minimum = new Date(dataX[startIdxs[0]]);
    currentUnit = units[unitIdx];
    minimum = extDate.align(minimum, currentUnit[0], currentUnit[1]);
    if (extDate.diff(minimum, maximum, currentUnit[0]) > dataX.length * 2 * currentUnit[1]) {
      continue;
    }
    if (currentUnit[3] && result.map['time_' + currentUnit[3]]) {
      lastOffset = result.map['time_' + currentUnit[3]][0];
      lastOffsetEnd = result.map['time_' + currentUnit[3]][1];
    } else {
      lastOffset = plainStart;
      lastOffsetEnd = plainEnd;
    }
    start = last;
    current = minimum;
    first = true;
    startIdxs[last] = startIdxs[lastOffset];
    endIdxs[last] = endIdxs[lastOffset];
    minIdxs[last] = minIdxs[lastOffset];
    maxIdxs[last] = maxIdxs[lastOffset];
    opens[last] = opens[lastOffset];
    closes[last] = closes[lastOffset];
    minXs[last] = minXs[lastOffset];
    minYs[last] = minYs[lastOffset];
    maxXs[last] = maxXs[lastOffset];
    maxYs[last] = maxYs[lastOffset];
    current = Ext.Date.add(current, currentUnit[0], currentUnit[1]);
    for (i = lastOffset + 1; i < lastOffsetEnd; i++) {
      if (dataX[endIdxs[i]] < +current) {
        endIdxs[last] = endIdxs[i];
        closes[last] = closes[i];
        if (maxYs[i] > maxYs[last]) {
          maxYs[last] = maxYs[i];
          maxXs[last] = maxXs[i];
          maxIdxs[last] = maxIdxs[i];
        }
        if (minYs[i] < minYs[last]) {
          minYs[last] = minYs[i];
          minXs[last] = minXs[i];
          minIdxs[last] = minIdxs[i];
        }
      } else {
        last++;
        startIdxs[last] = startIdxs[i];
        endIdxs[last] = endIdxs[i];
        minIdxs[last] = minIdxs[i];
        maxIdxs[last] = maxIdxs[i];
        opens[last] = opens[i];
        closes[last] = closes[i];
        minXs[last] = minXs[i];
        minYs[last] = minYs[i];
        maxXs[last] = maxXs[i];
        maxYs[last] = maxYs[i];
        current = Ext.Date.add(current, currentUnit[0], currentUnit[1]);
      }
    }
    if (last > start) {
      result.map['time_' + currentUnit[2]] = [start, last];
    }
  }
}, 'double':function(result, position, dataX, dataOpen, dataHigh, dataLow, dataClose) {
  var offset = 0, lastOffset, step = 1, i, startIdx, endIdx, minIdx, maxIdx, open, close, minX, minY, maxX, maxY;
  while (position > offset + 1) {
    lastOffset = offset;
    offset = position;
    step += step;
    for (i = lastOffset; i < offset; i += 2) {
      if (i === offset - 1) {
        startIdx = result.startIdx[i];
        endIdx = result.endIdx[i];
        minIdx = result.minIdx[i];
        maxIdx = result.maxIdx[i];
        open = result.open[i];
        close = result.close[i];
        minX = result.minX[i];
        minY = result.minY[i];
        maxX = result.maxX[i];
        maxY = result.maxY[i];
      } else {
        startIdx = result.startIdx[i];
        endIdx = result.endIdx[i + 1];
        open = result.open[i];
        close = result.close[i];
        if (result.minY[i] <= result.minY[i + 1]) {
          minIdx = result.minIdx[i];
          minX = result.minX[i];
          minY = result.minY[i];
        } else {
          minIdx = result.minIdx[i + 1];
          minX = result.minX[i + 1];
          minY = result.minY[i + 1];
        }
        if (result.maxY[i] >= result.maxY[i + 1]) {
          maxIdx = result.maxIdx[i];
          maxX = result.maxX[i];
          maxY = result.maxY[i];
        } else {
          maxIdx = result.maxIdx[i + 1];
          maxX = result.maxX[i + 1];
          maxY = result.maxY[i + 1];
        }
      }
      result.startIdx[position] = startIdx;
      result.endIdx[position] = endIdx;
      result.minIdx[position] = minIdx;
      result.maxIdx[position] = maxIdx;
      result.open[position] = open;
      result.close[position] = close;
      result.minX[position] = minX;
      result.minY[position] = minY;
      result.maxX[position] = maxX;
      result.maxY[position] = maxY;
      position++;
    }
    result.map['double_' + step] = [offset, position];
  }
}, none:Ext.emptyFn, aggregateData:function(dataX, dataOpen, dataHigh, dataLow, dataClose) {
  var length = dataX.length, startIdx = [], endIdx = [], minIdx = [], maxIdx = [], open = [], minX = [], minY = [], maxX = [], maxY = [], close = [], result = {startIdx:startIdx, endIdx:endIdx, minIdx:minIdx, maxIdx:maxIdx, open:open, minX:minX, minY:minY, maxX:maxX, maxY:maxY, close:close}, i;
  for (i = 0; i < length; i++) {
    startIdx[i] = i;
    endIdx[i] = i;
    minIdx[i] = i;
    maxIdx[i] = i;
    open[i] = dataOpen[i];
    minX[i] = dataX[i];
    minY[i] = dataLow[i];
    maxX[i] = dataX[i];
    maxY[i] = dataHigh[i];
    close[i] = dataClose[i];
  }
  result.map = {original:[0, length]};
  if (length) {
    this[this.getStrategy()](result, length, dataX, dataOpen, dataHigh, dataLow, dataClose);
  }
  return result;
}, binarySearchMin:function(items, start, end, key) {
  var dx = this.dataX;
  if (key <= dx[items.startIdx[0]]) {
    return start;
  }
  if (key >= dx[items.startIdx[end - 1]]) {
    return end - 1;
  }
  while (start + 1 < end) {
    var mid = start + end >> 1, val = dx[items.startIdx[mid]];
    if (val === key) {
      return mid;
    } else {
      if (val < key) {
        start = mid;
      } else {
        end = mid;
      }
    }
  }
  return start;
}, binarySearchMax:function(items, start, end, key) {
  var dx = this.dataX;
  if (key <= dx[items.endIdx[0]]) {
    return start;
  }
  if (key >= dx[items.endIdx[end - 1]]) {
    return end - 1;
  }
  while (start + 1 < end) {
    var mid = start + end >> 1, val = dx[items.endIdx[mid]];
    if (val === key) {
      return mid;
    } else {
      if (val < key) {
        start = mid;
      } else {
        end = mid;
      }
    }
  }
  return end;
}, constructor:function(config) {
  this.initConfig(config);
}, setData:function(dataX, dataOpen, dataHigh, dataLow, dataClose) {
  if (!dataHigh) {
    dataClose = dataLow = dataHigh = dataOpen;
  }
  this.dataX = dataX;
  this.dataOpen = dataOpen;
  this.dataHigh = dataHigh;
  this.dataLow = dataLow;
  this.dataClose = dataClose;
  if (dataX.length === dataHigh.length && dataX.length === dataLow.length) {
    this.cache = this.aggregateData(dataX, dataOpen, dataHigh, dataLow, dataClose);
  }
}, getAggregation:function(min, max, estStep) {
  if (!this.cache) {
    return null;
  }
  var minStep = Infinity, range = this.dataX[this.dataX.length - 1] - this.dataX[0], cacheMap = this.cache.map, result = cacheMap.original, name, positions, ln, step, minIdx, maxIdx;
  for (name in cacheMap) {
    positions = cacheMap[name];
    ln = positions[1] - positions[0] - 1;
    step = range / ln;
    if (estStep <= step && step < minStep) {
      result = positions;
      minStep = step;
    }
  }
  minIdx = Math.max(this.binarySearchMin(this.cache, result[0], result[1], min), result[0]);
  maxIdx = Math.min(this.binarySearchMax(this.cache, result[0], result[1], max) + 1, result[1]);
  return {data:this.cache, start:minIdx, end:maxIdx};
}});
Ext.define('Ext.chart.series.sprite.Aggregative', {extend:'Ext.chart.series.sprite.Cartesian', requires:['Ext.draw.LimitedCache', 'Ext.draw.SegmentTree'], inheritableStatics:{def:{processors:{dataHigh:'data', dataLow:'data', dataClose:'data'}, aliases:{dataOpen:'dataY'}, defaults:{dataHigh:null, dataLow:null, dataClose:null}}}, config:{aggregator:{}}, applyAggregator:function(aggregator, oldAggr) {
  return Ext.factory(aggregator, Ext.draw.SegmentTree, oldAggr);
}, constructor:function() {
  this.callParent(arguments);
}, processDataY:function() {
  var me = this, attr = me.attr, high = attr.dataHigh, low = attr.dataLow, close = attr.dataClose, open = attr.dataY, aggregator;
  me.callParent(arguments);
  if (attr.dataX && open && open.length > 0) {
    aggregator = me.getAggregator();
    if (high) {
      aggregator.setData(attr.dataX, attr.dataY, high, low, close);
    } else {
      aggregator.setData(attr.dataX, attr.dataY);
    }
  }
}, getGapWidth:function() {
  return 1;
}, renderClipped:function(surface, ctx, dataClipRect, surfaceClipRect) {
  var me = this, min = Math.min(dataClipRect[0], dataClipRect[2]), max = Math.max(dataClipRect[0], dataClipRect[2]), aggregator = me.getAggregator(), aggregates = aggregator && aggregator.getAggregation(min, max, (max - min) / surfaceClipRect[2] * me.getGapWidth());
  if (aggregates) {
    me.dataStart = aggregates.data.startIdx[aggregates.start];
    me.dataEnd = aggregates.data.endIdx[aggregates.end - 1];
    me.renderAggregates(aggregates.data, aggregates.start, aggregates.end, surface, ctx, dataClipRect, surfaceClipRect);
  }
}});
Ext.define('Ext.chart.series.sprite.CandleStick', {alias:'sprite.candlestickSeries', extend:'Ext.chart.series.sprite.Aggregative', inheritableStatics:{def:{processors:{raiseStyle:function(n, o) {
  return Ext.merge({}, o || {}, n);
}, dropStyle:function(n, o) {
  return Ext.merge({}, o || {}, n);
}, barWidth:'number', padding:'number', ohlcType:'enums(candlestick,ohlc)'}, defaults:{raiseStyle:{strokeStyle:'green', fillStyle:'green'}, dropStyle:{strokeStyle:'red', fillStyle:'red'}, barWidth:15, padding:3, lineJoin:'miter', miterLimit:5, ohlcType:'candlestick'}, triggers:{raiseStyle:'raiseStyle', dropStyle:'dropStyle'}, updaters:{raiseStyle:function() {
  var me = this, tpl = me.raiseTemplate;
  if (tpl) {
    tpl.setAttributes(me.attr.raiseStyle);
  }
}, dropStyle:function() {
  var me = this, tpl = me.dropTemplate;
  if (tpl) {
    tpl.setAttributes(me.attr.dropStyle);
  }
}}}}, candlestick:function(ctx, open, high, low, close, mid, halfWidth) {
  var minOC = Math.min(open, close), maxOC = Math.max(open, close);
  ctx.moveTo(mid, low);
  ctx.lineTo(mid, minOC);
  ctx.moveTo(mid + halfWidth, maxOC);
  ctx.lineTo(mid + halfWidth, minOC);
  ctx.lineTo(mid - halfWidth, minOC);
  ctx.lineTo(mid - halfWidth, maxOC);
  ctx.closePath();
  ctx.moveTo(mid, high);
  ctx.lineTo(mid, maxOC);
}, ohlc:function(ctx, open, high, low, close, mid, halfWidth) {
  ctx.moveTo(mid, high);
  ctx.lineTo(mid, low);
  ctx.moveTo(mid, open);
  ctx.lineTo(mid - halfWidth, open);
  ctx.moveTo(mid, close);
  ctx.lineTo(mid + halfWidth, close);
}, constructor:function() {
  var me = this, Rect = Ext.draw.sprite.Rect;
  me.callParent(arguments);
  me.raiseTemplate = new Rect({parent:me});
  me.dropTemplate = new Rect({parent:me});
}, getGapWidth:function() {
  var attr = this.attr, barWidth = attr.barWidth, padding = attr.padding;
  return barWidth + padding;
}, renderAggregates:function(aggregates, start, end, surface, ctx, clip) {
  var me = this, attr = me.attr, ohlcType = attr.ohlcType, series = me.getSeries(), matrix = attr.matrix, xx = matrix.getXX(), yy = matrix.getYY(), dx = matrix.getDX(), dy = matrix.getDY(), halfWidth = Math.round(attr.barWidth * 0.5), dataX = attr.dataX, opens = aggregates.open, closes = aggregates.close, maxYs = aggregates.maxY, minYs = aggregates.minY, startIdxs = aggregates.startIdx, pixelAdjust = attr.lineWidth * surface.devicePixelRatio / 2, renderer = attr.renderer, rendererConfig = renderer && 
  {}, rendererParams, rendererChanges, open, high, low, close, mid, i, template;
  me.rendererData = me.rendererData || {store:me.getStore()};
  pixelAdjust -= Math.floor(pixelAdjust);
  ctx.save();
  template = me.raiseTemplate;
  template.useAttributes(ctx, clip);
  if (!renderer) {
    ctx.beginPath();
  }
  for (i = start; i < end; i++) {
    if (opens[i] <= closes[i]) {
      open = Math.round(opens[i] * yy + dy) + pixelAdjust;
      high = Math.round(maxYs[i] * yy + dy) + pixelAdjust;
      low = Math.round(minYs[i] * yy + dy) + pixelAdjust;
      close = Math.round(closes[i] * yy + dy) + pixelAdjust;
      mid = Math.round(dataX[startIdxs[i]] * xx + dx) + pixelAdjust;
      if (renderer) {
        ctx.save();
        ctx.beginPath();
        rendererConfig.open = open;
        rendererConfig.high = high;
        rendererConfig.low = low;
        rendererConfig.close = close;
        rendererConfig.mid = mid;
        rendererConfig.halfWidth = halfWidth;
        rendererParams = [me, rendererConfig, me.rendererData, i];
        rendererChanges = Ext.callback(renderer, null, rendererParams, 0, series);
        Ext.apply(ctx, rendererChanges);
      }
      me[ohlcType](ctx, open, high, low, close, mid, halfWidth);
      if (renderer) {
        ctx.fillStroke(template.attr);
        ctx.restore();
      }
    }
  }
  if (!renderer) {
    ctx.fillStroke(template.attr);
  }
  ctx.restore();
  ctx.save();
  template = me.dropTemplate;
  template.useAttributes(ctx, clip);
  if (!renderer) {
    ctx.beginPath();
  }
  for (i = start; i < end; i++) {
    if (opens[i] > closes[i]) {
      open = Math.round(opens[i] * yy + dy) + pixelAdjust;
      high = Math.round(maxYs[i] * yy + dy) + pixelAdjust;
      low = Math.round(minYs[i] * yy + dy) + pixelAdjust;
      close = Math.round(closes[i] * yy + dy) + pixelAdjust;
      mid = Math.round(dataX[startIdxs[i]] * xx + dx) + pixelAdjust;
      if (renderer) {
        ctx.save();
        ctx.beginPath();
        rendererConfig.open = open;
        rendererConfig.high = high;
        rendererConfig.low = low;
        rendererConfig.close = close;
        rendererConfig.mid = mid;
        rendererConfig.halfWidth = halfWidth;
        rendererParams = [me, rendererConfig, me.rendererData, i];
        rendererChanges = Ext.callback(renderer, null, rendererParams, 0, me.getSeries());
        Ext.apply(ctx, rendererChanges);
      }
      me[ohlcType](ctx, open, high, low, close, mid, halfWidth);
      if (renderer) {
        ctx.fillStroke(template.attr);
        ctx.restore();
      }
    }
  }
  if (!renderer) {
    ctx.fillStroke(template.attr);
  }
  ctx.restore();
}});
Ext.define('Ext.chart.series.CandleStick', {extend:'Ext.chart.series.Cartesian', requires:['Ext.chart.series.sprite.CandleStick'], alias:'series.candlestick', type:'candlestick', seriesType:'candlestickSeries', isCandleStick:true, config:{openField:null, highField:null, lowField:null, closeField:null}, fieldCategoryY:['Open', 'High', 'Low', 'Close'], themeColorCount:function() {
  return 2;
}});
Ext.define('Ext.chart.series.Polar', {extend:'Ext.chart.series.Series', config:{rotation:0, radius:null, center:[0, 0], offsetX:0, offsetY:0, showInLegend:true, xField:null, yField:null, angleField:null, radiusField:null, xAxis:null, yAxis:null}, directions:['X', 'Y'], fieldCategoryX:['X'], fieldCategoryY:['Y'], deprecatedConfigs:{field:'angleField', lengthField:'radiusField'}, constructor:function(config) {
  var me = this, configurator = me.self.getConfigurator(), configs = configurator.configs, p;
  if (config) {
    for (p in me.deprecatedConfigs) {
      if (p in config && !(config in configs)) {
        Ext.raise("'" + p + "' config has been deprecated. Please use the '" + me.deprecatedConfigs[p] + "' config instead.");
      }
    }
  }
  me.callParent([config]);
}, getXField:function() {
  return this.getAngleField();
}, updateXField:function(value) {
  this.setAngleField(value);
}, getYField:function() {
  return this.getRadiusField();
}, updateYField:function(value) {
  this.setRadiusField(value);
}, applyXAxis:function(newAxis, oldAxis) {
  return this.getChart().getAxis(newAxis) || oldAxis;
}, applyYAxis:function(newAxis, oldAxis) {
  return this.getChart().getAxis(newAxis) || oldAxis;
}, getXRange:function() {
  return [this.dataRange[0], this.dataRange[2]];
}, getYRange:function() {
  return [this.dataRange[1], this.dataRange[3]];
}, themeColorCount:function() {
  var me = this, store = me.getStore(), count = store && store.getCount() || 0;
  return count;
}, isStoreDependantColorCount:true, getDefaultSpriteConfig:function() {
  return {type:this.seriesType, renderer:this.getRenderer(), centerX:0, centerY:0, rotationCenterX:0, rotationCenterY:0};
}, applyRotation:function(rotation) {
  return Ext.draw.sprite.AttributeParser.angle(Ext.draw.Draw.rad(rotation));
}, updateRotation:function(rotation) {
  var sprites = this.getSprites();
  if (sprites && sprites[0]) {
    sprites[0].setAttributes({baseRotation:rotation});
  }
}});
Ext.define('Ext.chart.series.Gauge', {alias:'series.gauge', extend:'Ext.chart.series.Polar', type:'gauge', seriesType:'pieslice', requires:['Ext.draw.sprite.Sector'], config:{needle:false, needleLength:90, needleWidth:4, donut:30, showInLegend:false, value:null, colors:null, sectors:null, minimum:0, maximum:100, rotation:0, totalAngle:Math.PI / 2, rect:[0, 0, 1, 1], center:[0.5, 0.75], radius:0.5, wholeDisk:false}, coordinateX:function() {
  return this.coordinate('X', 0, 2);
}, coordinateY:function() {
  return this.coordinate('Y', 1, 2);
}, updateNeedle:function(needle) {
  var me = this, sprites = me.getSprites(), angle = me.valueToAngle(me.getValue());
  if (sprites && sprites.length) {
    sprites[0].setAttributes({startAngle:needle ? angle : 0, endAngle:angle, strokeOpacity:needle ? 1 : 0, lineWidth:needle ? me.getNeedleWidth() : 0});
    me.doUpdateStyles();
  }
}, themeColorCount:function() {
  var me = this, store = me.getStore(), count = store && store.getCount() || 0;
  return count + (me.getNeedle() ? 0 : 1);
}, updateColors:function(colors, oldColors) {
  var me = this, sectors = me.getSectors(), sectorCount = sectors && sectors.length, sprites = me.getSprites(), newColors = Ext.Array.clone(colors), colorCount = colors && colors.length, i;
  if (!colorCount || !colors[0]) {
    return;
  }
  for (i = 0; i < sectorCount; i++) {
    newColors[i + 1] = sectors[i].color || newColors[i + 1] || colors[i % colorCount];
  }
  if (sprites.length) {
    sprites[0].setAttributes({strokeStyle:newColors[0]});
  }
  this.setSubStyle({fillStyle:newColors, strokeStyle:newColors});
  this.doUpdateStyles();
}, updateRect:function(rect) {
  var wholeDisk = this.getWholeDisk(), halfTotalAngle = wholeDisk ? Math.PI : this.getTotalAngle() / 2, donut = this.getDonut() / 100, width, height, radius;
  if (halfTotalAngle <= Math.PI / 2) {
    width = 2 * Math.sin(halfTotalAngle);
    height = 1 - donut * Math.cos(halfTotalAngle);
  } else {
    width = 2;
    height = 1 - Math.cos(halfTotalAngle);
  }
  radius = Math.min(rect[2] / width, rect[3] / height);
  this.setRadius(radius);
  this.setCenter([rect[2] / 2, radius + (rect[3] - height * radius) / 2]);
}, updateCenter:function(center) {
  this.setStyle({centerX:center[0], centerY:center[1], rotationCenterX:center[0], rotationCenterY:center[1]});
  this.doUpdateStyles();
}, updateRotation:function(rotation) {
  this.setStyle({rotationRads:rotation - (this.getTotalAngle() + Math.PI) / 2});
  this.doUpdateStyles();
}, doUpdateShape:function(radius, donut) {
  var me = this, sectors = me.getSectors(), sectorCount = sectors && sectors.length || 0, needleLength = me.getNeedleLength() / 100, endRhoArray;
  endRhoArray = [radius * needleLength, radius];
  while (sectorCount--) {
    endRhoArray.push(radius);
  }
  me.setSubStyle({endRho:endRhoArray, startRho:radius / 100 * donut});
  me.doUpdateStyles();
}, updateRadius:function(radius) {
  var donut = this.getDonut();
  this.doUpdateShape(radius, donut);
}, updateDonut:function(donut) {
  var radius = this.getRadius();
  this.doUpdateShape(radius, donut);
}, valueToAngle:function(value) {
  value = this.applyValue(value);
  return this.getTotalAngle() * (value - this.getMinimum()) / (this.getMaximum() - this.getMinimum());
}, applyValue:function(value) {
  return Math.min(this.getMaximum(), Math.max(value, this.getMinimum()));
}, updateValue:function(value) {
  var me = this, needle = me.getNeedle(), angle = me.valueToAngle(value), sprites = me.getSprites();
  sprites[0].getRendererData().value = value;
  sprites[0].setAttributes({startAngle:needle ? angle : 0, endAngle:angle});
  me.doUpdateStyles();
}, processData:function() {
  var me = this, store = me.getStore(), record = store && store.first(), animation, duration, axis, min, max, xField, value;
  if (record) {
    xField = me.getXField();
    if (xField) {
      value = record.get(xField);
    }
  }
  if (axis = me.getXAxis()) {
    min = axis.getMinimum();
    max = axis.getMaximum();
    animation = axis.getSprites()[0].getAnimation();
    duration = animation.getDuration();
    animation.setDuration(0);
    if (Ext.isNumber(min)) {
      me.setMinimum(min);
    } else {
      axis.setMinimum(me.getMinimum());
    }
    if (Ext.isNumber(max)) {
      me.setMaximum(max);
    } else {
      axis.setMaximum(me.getMaximum());
    }
    animation.setDuration(duration);
  }
  if (!Ext.isNumber(value)) {
    value = me.getMinimum();
  }
  me.setValue(value);
}, getDefaultSpriteConfig:function() {
  return {type:this.seriesType, renderer:this.getRenderer(), animation:{customDurations:{translationX:0, translationY:0, rotationCenterX:0, rotationCenterY:0, centerX:0, centerY:0, startRho:0, endRho:0, baseRotation:0}}};
}, normalizeSectors:function(sectors) {
  var me = this, sectorCount = sectors && sectors.length || 0, i, value, start, end;
  if (sectorCount) {
    for (i = 0; i < sectorCount; i++) {
      value = sectors[i];
      if (typeof value === 'number') {
        sectors[i] = {start:i > 0 ? sectors[i - 1].end : me.getMinimum(), end:Math.min(value, me.getMaximum())};
        if (i == sectorCount - 1 && sectors[i].end < me.getMaximum()) {
          sectors[i + 1] = {start:sectors[i].end, end:me.getMaximum()};
        }
      } else {
        if (typeof value.start === 'number') {
          start = Math.max(value.start, me.getMinimum());
        } else {
          start = i > 0 ? sectors[i - 1].end : me.getMinimum();
        }
        if (typeof value.end === 'number') {
          end = Math.min(value.end, me.getMaximum());
        } else {
          end = me.getMaximum();
        }
        sectors[i].start = start;
        sectors[i].end = end;
      }
    }
  } else {
    sectors = [{start:me.getMinimum(), end:me.getMaximum()}];
  }
  return sectors;
}, getSprites:function() {
  var me = this, store = me.getStore(), value = me.getValue(), label = me.getLabel(), i, ln;
  if (!store && !Ext.isNumber(value)) {
    return Ext.emptyArray;
  }
  var chart = me.getChart(), animation = me.getAnimation() || chart && chart.getAnimation(), sprites = me.sprites, spriteIndex = 0, sprite, sectors, attr, rendererData, lineWidths = [];
  if (sprites && sprites.length) {
    sprites[0].setAnimation(animation);
    return sprites;
  }
  rendererData = {store:store, field:me.getXField(), angleField:me.getXField(), value:value, series:me};
  me.needleSprite = sprite = me.createSprite();
  sprite.setAttributes({zIndex:10}, true);
  sprite.setRendererData(rendererData);
  sprite.setRendererIndex(spriteIndex++);
  lineWidths.push(me.getNeedleWidth());
  if (label) {
    label.getTemplate().setField(true);
  }
  sectors = me.normalizeSectors(me.getSectors());
  for (i = 0, ln = sectors.length; i < ln; i++) {
    attr = {startAngle:me.valueToAngle(sectors[i].start), endAngle:me.valueToAngle(sectors[i].end), label:sectors[i].label, fillStyle:sectors[i].color, strokeOpacity:0, doCallout:false, labelOverflowPadding:-1};
    Ext.apply(attr, sectors[i].style);
    sprite = me.createSprite();
    sprite.setRendererData(rendererData);
    sprite.setRendererIndex(spriteIndex++);
    sprite.setAttributes(attr, true);
    lineWidths.push(attr.lineWidth);
  }
  me.setSubStyle({lineWidth:lineWidths});
  me.doUpdateStyles();
  return sprites;
}, doUpdateStyles:function() {
  var me = this;
  me.callParent();
  if (me.sprites.length) {
    me.needleSprite.setAttributes({startRho:me.getNeedle() ? 0 : me.getRadius() / 100 * me.getDonut()});
  }
}});
Ext.define('Ext.chart.series.sprite.Line', {alias:'sprite.lineSeries', extend:'Ext.chart.series.sprite.Aggregative', inheritableStatics:{def:{processors:{curve:'default', fillArea:'bool', nullStyle:'enums(gap,connect,origin)', preciseStroke:'bool', xAxis:'default', yCap:'default'}, defaults:{curve:{type:'linear'}, nullStyle:'connect', fillArea:false, preciseStroke:true, xAxis:null, yCap:Math.pow(2, 20), yJump:50}, triggers:{dataX:'dataX,bbox,curve', dataY:'dataY,bbox,curve', curve:'curve'}, updaters:{curve:'curveUpdater'}}}, 
list:null, curveUpdater:function(attr) {
  var me = this, dataX = attr.dataX, dataY = attr.dataY, curve = attr.curve, smoothable = dataX && dataY && dataX.length > 2 && dataY.length > 2, type = curve.type;
  if (smoothable) {
    if (type === 'natural') {
      me.smoothX = Ext.draw.Draw.naturalSpline(dataX);
      me.smoothY = Ext.draw.Draw.naturalSpline(dataY);
    } else {
      if (type === 'cardinal') {
        me.smoothX = Ext.draw.Draw.cardinalSpline(dataX, curve.tension);
        me.smoothY = Ext.draw.Draw.cardinalSpline(dataY, curve.tension);
      } else {
        smoothable = false;
      }
    }
  }
  if (!smoothable) {
    delete me.smoothX;
    delete me.smoothY;
  }
}, updatePlainBBox:function(plain) {
  var attr = this.attr, ymin = Math.min(0, attr.dataMinY), ymax = Math.max(0, attr.dataMaxY);
  plain.x = attr.dataMinX;
  plain.y = ymin;
  plain.width = attr.dataMaxX - attr.dataMinX;
  plain.height = ymax - ymin;
}, drawStrip:function(ctx, strip) {
  ctx.moveTo(strip[0], strip[1]);
  for (var i = 2, ln = strip.length; i < ln; i += 2) {
    ctx.lineTo(strip[i], strip[i + 1]);
  }
}, drawStraightStroke:function(surface, ctx, start, end, list, xAxis) {
  var me = this, attr = me.attr, nullStyle = attr.nullStyle, isConnect = nullStyle === 'connect', isOrigin = nullStyle === 'origin', renderer = attr.renderer, curve = attr.curve, step = curve.type === 'step-after', needMoveTo = true, ln = list.length, lineConfig = {type:'line', smooth:false, step:step};
  var rendererChanges, params, stripStartX, isValidX0, isValidX, isValidX1, isValidPoint0, isValidPoint, isValidPoint1, isGap, lastValidPoint, px, py, x, y, x0, y0, x1, y1, i;
  var strip = [];
  ctx.beginPath();
  for (i = 3; i < ln; i += 3) {
    x0 = list[i - 3];
    y0 = list[i - 2];
    x = list[i];
    y = list[i + 1];
    x1 = list[i + 3];
    y1 = list[i + 4];
    isValidX0 = Ext.isNumber(x0);
    isValidX = Ext.isNumber(x);
    isValidX1 = Ext.isNumber(x1);
    isValidPoint0 = isValidX0 && Ext.isNumber(y0);
    isValidPoint = isValidX && Ext.isNumber(y);
    isValidPoint1 = isValidX1 && Ext.isNumber(y1);
    if (isOrigin) {
      if (!isValidPoint0 && isValidX0) {
        y0 = xAxis;
        isValidPoint0 = true;
      }
      if (!isValidPoint && isValidX) {
        y = xAxis;
        isValidPoint = true;
      }
      if (!isValidPoint1 && isValidX1) {
        y1 = xAxis;
        isValidPoint1 = true;
      }
    }
    if (renderer) {
      lineConfig.x = x;
      lineConfig.y = y;
      lineConfig.x0 = x0;
      lineConfig.y0 = y0;
      params = [me, lineConfig, me.rendererData, start + i / 3];
      rendererChanges = Ext.callback(renderer, null, params, 0, me.getSeries());
    }
    if (isGap && isConnect && isValidPoint0 && lastValidPoint) {
      px = lastValidPoint[0];
      py = lastValidPoint[1];
      if (needMoveTo) {
        ctx.beginPath();
        ctx.moveTo(px, py);
        strip.push(px, py);
        stripStartX = px;
        needMoveTo = false;
      }
      if (step) {
        ctx.lineTo(x0, py);
        strip.push(x0, py);
      }
      ctx.lineTo(x0, y0);
      strip.push(x0, y0);
      lastValidPoint = [x0, y0];
      isGap = false;
    }
    if (isConnect && lastValidPoint && isValidPoint && !isValidPoint0) {
      x0 = lastValidPoint[0];
      y0 = lastValidPoint[1];
      isValidPoint0 = true;
    }
    if (isValidPoint) {
      lastValidPoint = [x, y];
    }
    if (isValidPoint0 && isValidPoint) {
      if (needMoveTo) {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        strip.push(x0, y0);
        stripStartX = x0;
        needMoveTo = false;
      }
    } else {
      isGap = true;
      continue;
    }
    if (step) {
      ctx.lineTo(x, y0);
      strip.push(x, y0);
    }
    ctx.lineTo(x, y);
    strip.push(x, y);
    if (rendererChanges || !isValidPoint1) {
      ctx.save();
      Ext.apply(ctx, rendererChanges);
      rendererChanges = null;
      if (attr.fillArea) {
        ctx.lineTo(x, xAxis);
        ctx.lineTo(stripStartX, xAxis);
        ctx.closePath();
        ctx.fill();
      }
      ctx.beginPath();
      me.drawStrip(ctx, strip);
      strip = [];
      ctx.stroke();
      ctx.restore();
      ctx.beginPath();
      needMoveTo = true;
    }
  }
}, calculateScale:function(count, end) {
  var power = 0, n = count;
  while (n < end && count > 0) {
    power++;
    n += count >> power;
  }
  return Math.pow(2, power > 0 ? power - 1 : power);
}, drawSmoothStroke:function(surface, ctx, start, end, list, xAxis) {
  var me = this, attr = me.attr, step = attr.step, matrix = attr.matrix, renderer = attr.renderer, xx = matrix.getXX(), yy = matrix.getYY(), dx = matrix.getDX(), dy = matrix.getDY(), smoothX = me.smoothX, smoothY = me.smoothY, scale = me.calculateScale(attr.dataX.length, end), cx1, cy1, cx2, cy2, x, y, x0, y0, i, j, changes, params, lineConfig = {type:'line', smooth:true, step:step};
  ctx.beginPath();
  ctx.moveTo(smoothX[start * 3] * xx + dx, smoothY[start * 3] * yy + dy);
  for (i = 0, j = start * 3 + 1; i < list.length - 3; i += 3, j += 3 * scale) {
    cx1 = smoothX[j] * xx + dx;
    cy1 = smoothY[j] * yy + dy;
    cx2 = smoothX[j + 1] * xx + dx;
    cy2 = smoothY[j + 1] * yy + dy;
    x = surface.roundPixel(list[i + 3]);
    y = list[i + 4];
    x0 = surface.roundPixel(list[i]);
    y0 = list[i + 1];
    if (renderer) {
      lineConfig.x0 = x0;
      lineConfig.y0 = y0;
      lineConfig.cx1 = cx1;
      lineConfig.cy1 = cy1;
      lineConfig.cx2 = cx2;
      lineConfig.cy2 = cy2;
      lineConfig.x = x;
      lineConfig.y = y;
      params = [me, lineConfig, me.rendererData, start + i / 3 + 1];
      changes = Ext.callback(renderer, null, params, 0, me.getSeries());
      ctx.save();
      Ext.apply(ctx, changes);
    }
    if (attr.fillArea) {
      ctx.moveTo(x0, y0);
      ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
      ctx.lineTo(x, xAxis);
      ctx.lineTo(x0, xAxis);
      ctx.lineTo(x0, y0);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
    }
    ctx.moveTo(x0, y0);
    ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
    ctx.stroke();
    ctx.moveTo(x0, y0);
    ctx.closePath();
    if (renderer) {
      ctx.restore();
    }
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
  ctx.beginPath();
}, drawLabel:function(text, dataX, dataY, labelId, rect) {
  var me = this, attr = me.attr, label = me.getMarker('labels'), labelTpl = label.getTemplate(), labelCfg = me.labelCfg || (me.labelCfg = {}), surfaceMatrix = me.surfaceMatrix, labelX, labelY, labelOverflowPadding = attr.labelOverflowPadding, halfHeight, labelBBox, changes, params, hasPendingChanges;
  labelCfg.x = surfaceMatrix.x(dataX, dataY);
  labelCfg.y = surfaceMatrix.y(dataX, dataY);
  if (attr.flipXY) {
    labelCfg.rotationRads = Math.PI * 0.5;
  } else {
    labelCfg.rotationRads = 0;
  }
  labelCfg.text = text;
  if (labelTpl.attr.renderer) {
    params = [text, label, labelCfg, me.rendererData, labelId];
    changes = Ext.callback(labelTpl.attr.renderer, null, params, 0, me.getSeries());
    if (typeof changes === 'string') {
      labelCfg.text = changes;
    } else {
      if (typeof changes === 'object') {
        if ('text' in changes) {
          labelCfg.text = changes.text;
        }
        hasPendingChanges = true;
      }
    }
  }
  labelBBox = me.getMarkerBBox('labels', labelId, true);
  if (!labelBBox) {
    me.putMarker('labels', labelCfg, labelId);
    labelBBox = me.getMarkerBBox('labels', labelId, true);
  }
  halfHeight = labelBBox.height / 2;
  labelX = dataX;
  switch(labelTpl.attr.display) {
    case 'under':
      labelY = dataY - halfHeight - labelOverflowPadding;
      break;
    case 'rotate':
      labelX += labelOverflowPadding;
      labelY = dataY - labelOverflowPadding;
      labelCfg.rotationRads = -Math.PI / 4;
      break;
    default:
      labelY = dataY + halfHeight + labelOverflowPadding;
  }
  labelCfg.x = surfaceMatrix.x(labelX, labelY);
  labelCfg.y = surfaceMatrix.y(labelX, labelY);
  if (hasPendingChanges) {
    Ext.apply(labelCfg, changes);
  }
  me.putMarker('labels', labelCfg, labelId);
}, drawMarker:function(x, y, index) {
  var me = this, attr = me.attr, renderer = attr.renderer, surfaceMatrix = me.surfaceMatrix, markerCfg = {}, changes, params;
  if (renderer && me.getMarker('markers')) {
    markerCfg.type = 'marker';
    markerCfg.x = x;
    markerCfg.y = y;
    params = [me, markerCfg, me.rendererData, index];
    changes = Ext.callback(renderer, null, params, 0, me.getSeries());
    if (changes) {
      Ext.apply(markerCfg, changes);
    }
  }
  markerCfg.translationX = surfaceMatrix.x(x, y);
  markerCfg.translationY = surfaceMatrix.y(x, y);
  delete markerCfg.x;
  delete markerCfg.y;
  me.putMarker('markers', markerCfg, index, !renderer);
}, drawStroke:function(surface, ctx, start, end, list, xAxis) {
  var me = this, isSmooth = me.smoothX && me.smoothY;
  if (isSmooth) {
    me.drawSmoothStroke(surface, ctx, start, end, list, xAxis);
  } else {
    me.drawStraightStroke(surface, ctx, start, end, list, xAxis);
  }
}, renderAggregates:function(aggregates, start, end, surface, ctx, clip, rect) {
  var me = this, attr = me.attr, dataX = attr.dataX, dataY = attr.dataY, labels = attr.labels, xAxis = attr.xAxis, yCap = attr.yCap, isSmooth = attr.smooth && me.smoothX && me.smoothY, isDrawLabels = labels && me.getMarker('labels'), isDrawMarkers = me.getMarker('markers'), matrix = attr.matrix, pixel = surface.devicePixelRatio, xx = matrix.getXX(), yy = matrix.getYY(), dx = matrix.getDX(), dy = matrix.getDY(), list = me.list || (me.list = []), minXs = aggregates.minX, maxXs = aggregates.maxX, minYs = 
  aggregates.minY, maxYs = aggregates.maxY, idx = aggregates.startIdx, isContinuousLine = true, isValidMinX, isValidMaxX, isValidMinY, isValidMaxY, xAxisOrigin, isVerticalX, x, y, i, index;
  me.rendererData = {store:me.getStore()};
  list.length = 0;
  for (i = start; i < end; i++) {
    var minX = minXs[i], maxX = maxXs[i], minY = minYs[i], maxY = maxYs[i];
    isValidMinX = Ext.isNumber(minX);
    isValidMinY = Ext.isNumber(minY);
    isValidMaxX = Ext.isNumber(maxX);
    isValidMaxY = Ext.isNumber(maxY);
    if (minX < maxX) {
      list.push(isValidMinX ? minX * xx + dx : null, isValidMinY ? minY * yy + dy : null, idx[i]);
      list.push(isValidMaxX ? maxX * xx + dx : null, isValidMaxY ? maxY * yy + dy : null, idx[i]);
    } else {
      if (minX > maxX) {
        list.push(isValidMaxX ? maxX * xx + dx : null, isValidMaxY ? maxY * yy + dy : null, idx[i]);
        list.push(isValidMinX ? minX * xx + dx : null, isValidMinY ? minY * yy + dy : null, idx[i]);
      } else {
        list.push(isValidMaxX ? maxX * xx + dx : null, isValidMaxY ? maxY * yy + dy : null, idx[i]);
      }
    }
  }
  if (list.length) {
    for (i = 0; i < list.length; i += 3) {
      x = list[i];
      y = list[i + 1];
      if (Ext.isNumber(x) && Ext.isNumber(y)) {
        if (y > yCap) {
          y = yCap;
        } else {
          if (y < -yCap) {
            y = -yCap;
          }
        }
        list[i + 1] = y;
      } else {
        isContinuousLine = false;
        continue;
      }
      index = list[i + 2];
      if (isDrawMarkers) {
        me.drawMarker(x, y, index);
      }
      if (isDrawLabels && labels[index]) {
        me.drawLabel(labels[index], x, y, index, rect);
      }
    }
    me.isContinuousLine = isContinuousLine;
    if (isSmooth && !isContinuousLine) {
      Ext.raise('Line smoothing in only supported for gapless data, ' + 'where all data points are finite numbers.');
    }
    if (xAxis) {
      isVerticalX = xAxis.getAlignment() === 'vertical';
      if (Ext.isNumber(xAxis.floatingAtCoord)) {
        xAxisOrigin = (isVerticalX ? rect[2] : rect[3]) - xAxis.floatingAtCoord;
      } else {
        xAxisOrigin = isVerticalX ? rect[0] : rect[1];
      }
    } else {
      xAxisOrigin = attr.flipXY ? rect[0] : rect[1];
    }
    if (attr.preciseStroke) {
      if (attr.fillArea) {
        ctx.fill();
      }
      if (attr.transformFillStroke) {
        attr.inverseMatrix.toContext(ctx);
      }
      me.drawStroke(surface, ctx, start, end, list, xAxisOrigin);
      if (attr.transformFillStroke) {
        attr.matrix.toContext(ctx);
      }
      ctx.stroke();
    } else {
      me.drawStroke(surface, ctx, start, end, list, xAxisOrigin);
      if (isContinuousLine && isSmooth && attr.fillArea && !attr.renderer) {
        var lastPointX = dataX[dataX.length - 1] * xx + dx + pixel, lastPointY = dataY[dataY.length - 1] * yy + dy, firstPointX = dataX[0] * xx + dx - pixel, firstPointY = dataY[0] * yy + dy;
        ctx.lineTo(lastPointX, lastPointY);
        ctx.lineTo(lastPointX, xAxisOrigin - attr.lineWidth);
        ctx.lineTo(firstPointX, xAxisOrigin - attr.lineWidth);
        ctx.lineTo(firstPointX, firstPointY);
      }
      if (attr.transformFillStroke) {
        attr.matrix.toContext(ctx);
      }
      if (attr.fillArea) {
        ctx.fillStroke(attr, true);
      } else {
        ctx.stroke(true);
      }
    }
  }
}});
Ext.define('Ext.chart.series.Line', {extend:'Ext.chart.series.Cartesian', alias:'series.line', type:'line', seriesType:'lineSeries', isLine:true, requires:['Ext.chart.series.sprite.Line'], config:{selectionTolerance:5, curve:{type:'linear'}, smooth:null, step:null, nullStyle:'gap', fill:undefined, aggregator:{strategy:'double'}}, themeMarkerCount:function() {
  return 1;
}, getDefaultSpriteConfig:function() {
  var me = this, parentConfig = me.callParent(arguments), style = Ext.apply({}, me.getStyle()), styleWithTheme, fillArea = false;
  if (me.config.fill !== undefined) {
    if (me.config.fill) {
      fillArea = true;
      if (style.fillStyle === undefined) {
        if (style.strokeStyle === undefined) {
          styleWithTheme = me.getStyleWithTheme();
          style.fillStyle = styleWithTheme.fillStyle;
          style.strokeStyle = styleWithTheme.strokeStyle;
        } else {
          style.fillStyle = style.strokeStyle;
        }
      }
    }
  } else {
    if (style.fillStyle) {
      fillArea = true;
    }
  }
  if (!fillArea) {
    delete style.fillStyle;
  }
  style = Ext.apply(parentConfig || {}, style);
  return Ext.apply(style, {fillArea:fillArea, selectionTolerance:me.config.selectionTolerance});
}, updateFill:function(fill) {
  this.withSprite(function(sprite) {
    return sprite.setAttributes({fillArea:fill});
  });
}, updateCurve:function(curve) {
  this.withSprite(function(sprite) {
    return sprite.setAttributes({curve:curve});
  });
}, getCurve:function() {
  return this.withSprite(function(sprite) {
    return sprite.attr.curve;
  });
}, updateNullStyle:function(nullStyle) {
  this.withSprite(function(sprite) {
    return sprite.setAttributes({nullStyle:nullStyle});
  });
}, updateSmooth:function(smooth) {
  this.setCurve({type:smooth ? 'natural' : 'linear'});
}, updateStep:function(step) {
  this.setCurve({type:step ? 'step-after' : 'linear'});
}});
Ext.define('Ext.chart.series.sprite.PieSlice', {extend:'Ext.draw.sprite.Sector', mixins:{markerHolder:'Ext.chart.MarkerHolder'}, alias:'sprite.pieslice', inheritableStatics:{def:{processors:{doCallout:'bool', label:'string', rotateLabels:'bool', labelOverflowPadding:'number', renderer:'default'}, defaults:{doCallout:true, rotateLabels:true, label:'', labelOverflowPadding:10, renderer:null}}}, config:{rendererData:null, rendererIndex:0, series:null}, setGradientBBox:function(ctx, rect) {
  var me = this, attr = me.attr, hasGradients = attr.fillStyle && attr.fillStyle.isGradient || attr.strokeStyle && attr.strokeStyle.isGradient;
  if (hasGradients && !attr.constrainGradients) {
    var midAngle = me.getMidAngle(), margin = attr.margin, cx = attr.centerX, cy = attr.centerY, r = attr.endRho, matrix = attr.matrix, scaleX = matrix.getScaleX(), scaleY = matrix.getScaleY(), w = scaleX * r, h = scaleY * r, bbox = {width:w + w, height:h + h};
    if (margin) {
      cx += margin * Math.cos(midAngle);
      cy += margin * Math.sin(midAngle);
    }
    bbox.x = matrix.x(cx, cy) - w;
    bbox.y = matrix.y(cx, cy) - h;
    ctx.setGradientBBox(bbox);
  } else {
    me.callParent([ctx, rect]);
  }
}, render:function(surface, ctx, rect) {
  var me = this, attr = me.attr, itemCfg = {}, changes;
  if (attr.renderer) {
    itemCfg = {type:'sector', centerX:attr.centerX, centerY:attr.centerY, margin:attr.margin, startAngle:Math.min(attr.startAngle, attr.endAngle), endAngle:Math.max(attr.startAngle, attr.endAngle), startRho:Math.min(attr.startRho, attr.endRho), endRho:Math.max(attr.startRho, attr.endRho)};
    changes = Ext.callback(attr.renderer, null, [me, itemCfg, me.getRendererData(), me.getRendererIndex()], 0, me.getSeries());
    me.setAttributes(changes);
    me.useAttributes(ctx, rect);
  }
  me.callParent([surface, ctx, rect]);
  if (attr.label && me.getMarker('labels')) {
    me.placeLabel();
  }
}, placeLabel:function() {
  var me = this, attr = me.attr, attributeId = attr.attributeId, startAngle = Math.min(attr.startAngle, attr.endAngle), endAngle = Math.max(attr.startAngle, attr.endAngle), midAngle = (startAngle + endAngle) * 0.5, margin = attr.margin, centerX = attr.centerX, centerY = attr.centerY, sinMidAngle = Math.sin(midAngle), cosMidAngle = Math.cos(midAngle), startRho = Math.min(attr.startRho, attr.endRho) + margin, endRho = Math.max(attr.startRho, attr.endRho) + margin, midRho = (startRho + endRho) * 0.5, 
  surfaceMatrix = me.surfaceMatrix, labelCfg = me.labelCfg || (me.labelCfg = {}), label = me.getMarker('labels'), labelTpl = label.getTemplate(), hideLessThan = labelTpl.getHideLessThan(), calloutLine = labelTpl.getCalloutLine(), labelBox, x, y, changes, params, calloutLineLength;
  if (calloutLine) {
    calloutLineLength = calloutLine.length || 40;
  } else {
    calloutLineLength = 0;
  }
  surfaceMatrix.appendMatrix(attr.matrix);
  labelCfg.text = attr.label;
  x = centerX + cosMidAngle * midRho;
  y = centerY + sinMidAngle * midRho;
  labelCfg.x = surfaceMatrix.x(x, y);
  labelCfg.y = surfaceMatrix.y(x, y);
  x = centerX + cosMidAngle * endRho;
  y = centerY + sinMidAngle * endRho;
  labelCfg.calloutStartX = surfaceMatrix.x(x, y);
  labelCfg.calloutStartY = surfaceMatrix.y(x, y);
  x = centerX + cosMidAngle * (endRho + calloutLineLength);
  y = centerY + sinMidAngle * (endRho + calloutLineLength);
  labelCfg.calloutPlaceX = surfaceMatrix.x(x, y);
  labelCfg.calloutPlaceY = surfaceMatrix.y(x, y);
  if (!attr.rotateLabels) {
    labelCfg.rotationRads = 0;
    Ext.log.warn("'series.style.rotateLabels' config is deprecated. " + "Use 'series.label.orientation' config instead.");
  } else {
    switch(labelTpl.attr.orientation) {
      case 'horizontal':
        labelCfg.rotationRads = midAngle + Math.atan2(surfaceMatrix.y(1, 0) - surfaceMatrix.y(0, 0), surfaceMatrix.x(1, 0) - surfaceMatrix.x(0, 0)) + Math.PI / 2;
        break;
      case 'vertical':
        labelCfg.rotationRads = midAngle + Math.atan2(surfaceMatrix.y(1, 0) - surfaceMatrix.y(0, 0), surfaceMatrix.x(1, 0) - surfaceMatrix.x(0, 0));
        break;
    }
  }
  labelCfg.calloutColor = calloutLine && calloutLine.color || me.attr.fillStyle;
  if (calloutLine) {
    if (calloutLine.width) {
      labelCfg.calloutWidth = calloutLine.width;
    }
  } else {
    labelCfg.calloutColor = 'none';
  }
  labelCfg.globalAlpha = attr.globalAlpha * attr.fillOpacity;
  if (labelTpl.display !== 'none') {
    labelCfg.hidden = attr.startAngle == attr.endAngle;
  }
  if (labelTpl.attr.renderer) {
    params = [me.attr.label, label, labelCfg, me.getRendererData(), me.getRendererIndex()];
    changes = Ext.callback(labelTpl.attr.renderer, null, params, 0, me.getSeries());
    if (typeof changes === 'string') {
      labelCfg.text = changes;
    } else {
      Ext.apply(labelCfg, changes);
    }
  }
  me.putMarker('labels', labelCfg, attributeId);
  labelBox = me.getMarkerBBox('labels', attributeId, true);
  if (labelBox) {
    if (attr.doCallout && ((endAngle - startAngle) * endRho > hideLessThan || attr.highlighted)) {
      if (labelTpl.attr.display === 'outside') {
        me.putMarker('labels', {callout:1}, attributeId);
      } else {
        if (labelTpl.attr.display === 'inside') {
          me.putMarker('labels', {callout:0}, attributeId);
        } else {
          me.putMarker('labels', {callout:1 - me.sliceContainsLabel(attr, labelBox)}, attributeId);
        }
      }
    } else {
      me.putMarker('labels', {globalAlpha:me.sliceContainsLabel(attr, labelBox)}, attributeId);
    }
  }
}, sliceContainsLabel:function(attr, bbox) {
  var padding = attr.labelOverflowPadding, middle = (attr.endRho + attr.startRho) / 2, outer = middle + (bbox.width + padding) / 2, inner = middle - (bbox.width + padding) / 2, sliceAngle, l1, l2, l3;
  if (padding < 0) {
    return 1;
  }
  if (bbox.width + padding * 2 > attr.endRho - attr.startRho) {
    return 0;
  }
  l1 = Math.sqrt(attr.endRho * attr.endRho - outer * outer);
  l2 = Math.sqrt(attr.endRho * attr.endRho - inner * inner);
  sliceAngle = Math.abs(attr.endAngle - attr.startAngle);
  l3 = sliceAngle > Math.PI / 2 ? inner : Math.abs(Math.tan(sliceAngle / 2)) * inner;
  if (bbox.height + padding * 2 > Math.min(l1, l2, l3) * 2) {
    return 0;
  }
  return 1;
}});
Ext.define('Ext.chart.series.Pie', {extend:'Ext.chart.series.Polar', requires:['Ext.chart.series.sprite.PieSlice'], type:'pie', alias:'series.pie', seriesType:'pieslice', isPie:true, config:{donut:0, rotation:0, clockwise:true, totalAngle:2 * Math.PI, hidden:[], radiusFactor:100, highlightCfg:{margin:20}, style:{}}, directions:['X'], applyLabel:function(newLabel, oldLabel) {
  if (Ext.isObject(newLabel) && !Ext.isString(newLabel.orientation)) {
    Ext.apply(newLabel = Ext.Object.chain(newLabel), {orientation:'vertical'});
  }
  return this.callParent([newLabel, oldLabel]);
}, updateLabelData:function() {
  var me = this, store = me.getStore(), items = store.getData().items, sprites = me.getSprites(), label = me.getLabel(), labelField = label && label.getTemplate().getField(), hidden = me.getHidden(), i, ln, labels, sprite;
  if (sprites.length && labelField) {
    labels = [];
    for (i = 0, ln = items.length; i < ln; i++) {
      labels.push(items[i].get(labelField));
    }
    for (i = 0, ln = sprites.length; i < ln; i++) {
      sprite = sprites[i];
      sprite.setAttributes({label:labels[i]});
      sprite.putMarker('labels', {hidden:hidden[i]}, sprite.attr.attributeId);
    }
  }
}, coordinateX:function() {
  var me = this, store = me.getStore(), records = store.getData().items, recordCount = records.length, xField = me.getXField(), yField = me.getYField(), x, sumX = 0, unit, y, maxY = 0, hidden = me.getHidden(), summation = [], i, lastAngle = 0, totalAngle = me.getTotalAngle(), clockwise = me.getClockwise() ? 1 : -1, sprites = me.getSprites(), sprite, labels;
  if (!sprites) {
    return;
  }
  for (i = 0; i < recordCount; i++) {
    x = Math.abs(Number(records[i].get(xField))) || 0;
    y = yField && Math.abs(Number(records[i].get(yField))) || 0;
    if (!hidden[i]) {
      sumX += x;
      if (y > maxY) {
        maxY = y;
      }
    }
    summation[i] = sumX;
    if (i >= hidden.length) {
      hidden[i] = false;
    }
  }
  hidden.length = recordCount;
  me.maxY = maxY;
  if (sumX !== 0) {
    unit = totalAngle / sumX;
  }
  for (i = 0; i < recordCount; i++) {
    sprites[i].setAttributes({startAngle:lastAngle, endAngle:lastAngle = unit ? clockwise * summation[i] * unit : 0, globalAlpha:1});
  }
  if (recordCount < sprites.length) {
    for (i = recordCount; i < sprites.length; i++) {
      sprite = sprites[i];
      labels = sprite.getMarker('labels');
      if (labels) {
        labels.clear(sprite.getId());
        sprite.releaseMarker('labels');
      }
      sprite.destroy();
    }
    sprites.length = recordCount;
  }
  for (i = recordCount; i < sprites.length; i++) {
    sprites[i].setAttributes({startAngle:totalAngle, endAngle:totalAngle, globalAlpha:0});
  }
}, updateCenter:function(center) {
  this.setStyle({translationX:center[0] + this.getOffsetX(), translationY:center[1] + this.getOffsetY()});
  this.doUpdateStyles();
}, updateRadius:function(radius) {
  this.setStyle({startRho:radius * this.getDonut() * 0.01, endRho:radius * this.getRadiusFactor() * 0.01});
  this.doUpdateStyles();
}, getStyleByIndex:function(i) {
  var me = this, store = me.getStore(), item = store.getAt(i), yField = me.getYField(), radius = me.getRadius(), style = {}, startRho, endRho, y;
  if (item) {
    y = yField && Math.abs(Number(item.get(yField))) || 0;
    startRho = radius * me.getDonut() * 0.01;
    endRho = radius * me.getRadiusFactor() * 0.01;
    style = me.callParent([i]);
    style.startRho = startRho;
    style.endRho = me.maxY ? startRho + (endRho - startRho) * y / me.maxY : endRho;
  }
  return style;
}, updateDonut:function(donut) {
  var radius = this.getRadius();
  this.setStyle({startRho:radius * donut * 0.01, endRho:radius * this.getRadiusFactor() * 0.01});
  this.doUpdateStyles();
}, rotationOffset:-Math.PI / 2, updateRotation:function(rotation) {
  this.setStyle({rotationRads:rotation + this.rotationOffset});
  this.doUpdateStyles();
}, updateTotalAngle:function(totalAngle) {
  this.processData();
}, getSprites:function() {
  var me = this, chart = me.getChart(), store = me.getStore();
  if (!chart || !store) {
    return Ext.emptyArray;
  }
  me.getColors();
  me.getSubStyle();
  var items = store.getData().items, length = items.length, animation = me.getAnimation() || chart && chart.getAnimation(), sprites = me.sprites, sprite, spriteCreated = false, spriteIndex = 0, label = me.getLabel(), labelTpl = label && label.getTemplate(), i, rendererData;
  rendererData = {store:store, field:me.getXField(), angleField:me.getXField(), radiusField:me.getYField(), series:me};
  for (i = 0; i < length; i++) {
    sprite = sprites[i];
    if (!sprite) {
      sprite = me.createSprite();
      if (me.getHighlight()) {
        sprite.config.highlight = me.getHighlight();
        sprite.addModifier('highlight', true);
      }
      if (labelTpl && labelTpl.getField()) {
        labelTpl.setAttributes({labelOverflowPadding:me.getLabelOverflowPadding()});
        labelTpl.getAnimation().setCustomDurations({'callout':200});
      }
      sprite.setAttributes(me.getStyleByIndex(i));
      sprite.setRendererData(rendererData);
      spriteCreated = true;
    }
    sprite.setRendererIndex(spriteIndex++);
    sprite.setAnimation(animation);
  }
  if (spriteCreated) {
    me.doUpdateStyles();
  }
  return me.sprites;
}, betweenAngle:function(x, a, b) {
  var pp = Math.PI * 2, offset = this.rotationOffset;
  if (a === b) {
    return false;
  }
  if (!this.getClockwise()) {
    x *= -1;
    a *= -1;
    b *= -1;
    a -= offset;
    b -= offset;
  } else {
    a += offset;
    b += offset;
  }
  x -= a;
  b -= a;
  x %= pp;
  b %= pp;
  x += pp;
  b += pp;
  x %= pp;
  b %= pp;
  return x < b || Ext.Number.isEqual(b, 0, 1.0E-8);
}, getItemByIndex:function(index, category) {
  category = category || 'sprites';
  return this.callParent([index, category]);
}, getItemForAngle:function(angle) {
  var me = this, sprites = me.getSprites(), attr;
  angle %= Math.PI * 2;
  while (angle < 0) {
    angle += Math.PI * 2;
  }
  if (sprites) {
    var store = me.getStore(), items = store.getData().items, hidden = me.getHidden(), i = 0, ln = store.getCount();
    for (; i < ln; i++) {
      if (!hidden[i]) {
        attr = sprites[i].attr;
        if (attr.startAngle <= angle && attr.endAngle >= angle) {
          return {series:me, sprite:sprites[i], index:i, record:items[i], field:me.getXField()};
        }
      }
    }
  }
  return null;
}, getItemForPoint:function(x, y) {
  var me = this, sprites = me.getSprites();
  if (sprites) {
    var center = me.getCenter(), offsetX = me.getOffsetX(), offsetY = me.getOffsetY(), dx = x - center[0] + offsetX, dy = y - center[1] + offsetY, store = me.getStore(), donut = me.getDonut(), records = store.getData().items, direction = Math.atan2(dy, dx) - me.getRotation(), radius = Math.sqrt(dx * dx + dy * dy), startRadius = me.getRadius() * donut * 0.01, hidden = me.getHidden(), i, ln, attr;
    for (i = 0, ln = records.length; i < ln; i++) {
      if (!hidden[i]) {
        attr = sprites[i].attr;
        if (radius >= startRadius + attr.margin && radius <= attr.endRho + attr.margin) {
          if (me.betweenAngle(direction, attr.startAngle, attr.endAngle)) {
            return {series:me, sprite:sprites[i], index:i, record:records[i], field:me.getXField()};
          }
        }
      }
    }
    return null;
  }
}, provideLegendInfo:function(target) {
  var me = this, store = me.getStore();
  if (store) {
    var items = store.getData().items, labelField = me.getLabel().getTemplate().getField(), xField = me.getXField(), hidden = me.getHidden(), i, style, fill;
    for (i = 0; i < items.length; i++) {
      style = me.getStyleByIndex(i);
      fill = style.fillStyle;
      if (Ext.isObject(fill)) {
        fill = fill.stops && fill.stops[0].color;
      }
      target.push({name:labelField ? String(items[i].get(labelField)) : xField + ' ' + i, mark:fill || style.strokeStyle || 'black', disabled:hidden[i], series:me.getId(), index:i});
    }
  }
}});
Ext.define('Ext.chart.series.sprite.Pie3DPart', {extend:'Ext.draw.sprite.Path', mixins:{markerHolder:'Ext.chart.MarkerHolder'}, alias:'sprite.pie3dPart', inheritableStatics:{def:{processors:{centerX:'number', centerY:'number', startAngle:'number', endAngle:'number', startRho:'number', endRho:'number', margin:'number', thickness:'number', bevelWidth:'number', distortion:'number', baseColor:'color', colorSpread:'number', baseRotation:'number', part:'enums(top,bottom,start,end,innerFront,innerBack,outerFront,outerBack)', 
label:'string'}, aliases:{rho:'endRho'}, triggers:{centerX:'path,bbox', centerY:'path,bbox', startAngle:'path,partZIndex', endAngle:'path,partZIndex', startRho:'path', endRho:'path,bbox', margin:'path,bbox', thickness:'path', distortion:'path', baseRotation:'path,partZIndex', baseColor:'partZIndex,partColor', colorSpread:'partColor', part:'path,partZIndex', globalAlpha:'canvas,alpha', fillOpacity:'canvas,alpha'}, defaults:{centerX:0, centerY:0, startAngle:Math.PI * 2, endAngle:Math.PI * 2, startRho:0, 
endRho:150, margin:0, thickness:35, distortion:0.5, baseRotation:0, baseColor:'white', colorSpread:0.5, miterLimit:1, bevelWidth:5, strokeOpacity:0, part:'top', label:''}, updaters:{alpha:'alphaUpdater', partColor:'partColorUpdater', partZIndex:'partZIndexUpdater'}}}, config:{renderer:null, rendererData:null, rendererIndex:0, series:null}, bevelParams:[], constructor:function(config) {
  this.callParent([config]);
  this.bevelGradient = new Ext.draw.gradient.Linear({stops:[{offset:0, color:'rgba(255,255,255,0)'}, {offset:0.7, color:'rgba(255,255,255,0.6)'}, {offset:1, color:'rgba(255,255,255,0)'}]});
}, updateRenderer:function() {
  this.setDirty(true);
}, updateRendererData:function() {
  this.setDirty(true);
}, updateRendererIndex:function() {
  this.setDirty(true);
}, alphaUpdater:function(attr) {
  var me = this, opacity = attr.globalAlpha, fillOpacity = attr.fillOpacity, oldOpacity = me.oldOpacity, oldFillOpacity = me.oldFillOpacity;
  if (opacity !== oldOpacity && (opacity === 1 || oldOpacity === 1) || fillOpacity !== oldFillOpacity && (fillOpacity === 1 || oldFillOpacity === 1)) {
    me.scheduleUpdater(attr, 'path', ['globalAlpha']);
    me.oldOpacity = opacity;
    me.oldFillOpacity = fillOpacity;
  }
}, partColorUpdater:function(attr) {
  var color = Ext.util.Color.fly(attr.baseColor), colorString = color.toString(), colorSpread = attr.colorSpread, fillStyle;
  switch(attr.part) {
    case 'top':
      fillStyle = new Ext.draw.gradient.Radial({start:{x:0, y:0, r:0}, end:{x:0, y:0, r:1}, stops:[{offset:0, color:color.createLighter(0.1 * colorSpread)}, {offset:1, color:color.createDarker(0.1 * colorSpread)}]});
      break;
    case 'bottom':
      fillStyle = new Ext.draw.gradient.Radial({start:{x:0, y:0, r:0}, end:{x:0, y:0, r:1}, stops:[{offset:0, color:color.createDarker(0.2 * colorSpread)}, {offset:1, color:color.toString()}]});
      break;
    case 'outerFront':
    case 'outerBack':
      fillStyle = new Ext.draw.gradient.Linear({stops:[{offset:0, color:color.createDarker(0.15 * colorSpread).toString()}, {offset:0.3, color:colorString}, {offset:0.8, color:color.createLighter(0.2 * colorSpread).toString()}, {offset:1, color:color.createDarker(0.25 * colorSpread).toString()}]});
      break;
    case 'start':
      fillStyle = new Ext.draw.gradient.Linear({stops:[{offset:0, color:color.createDarker(0.1 * colorSpread).toString()}, {offset:1, color:color.createLighter(0.2 * colorSpread).toString()}]});
      break;
    case 'end':
      fillStyle = new Ext.draw.gradient.Linear({stops:[{offset:0, color:color.createDarker(0.1 * colorSpread).toString()}, {offset:1, color:color.createLighter(0.2 * colorSpread).toString()}]});
      break;
    case 'innerFront':
    case 'innerBack':
      fillStyle = new Ext.draw.gradient.Linear({stops:[{offset:0, color:color.createDarker(0.1 * colorSpread).toString()}, {offset:0.2, color:color.createLighter(0.2 * colorSpread).toString()}, {offset:0.7, color:colorString}, {offset:1, color:color.createDarker(0.1 * colorSpread).toString()}]});
      break;
  }
  attr.fillStyle = fillStyle;
  attr.canvasAttributes.fillStyle = fillStyle;
}, partZIndexUpdater:function(attr) {
  var normalize = Ext.draw.sprite.AttributeParser.angle, rotation = attr.baseRotation, startAngle = attr.startAngle, endAngle = attr.endAngle, depth;
  switch(attr.part) {
    case 'top':
      attr.zIndex = 6;
      break;
    case 'outerFront':
      startAngle = normalize(startAngle + rotation);
      endAngle = normalize(endAngle + rotation);
      if (startAngle >= 0 && endAngle < 0) {
        depth = Math.sin(startAngle);
      } else {
        if (startAngle <= 0 && endAngle > 0) {
          depth = Math.sin(endAngle);
        } else {
          if (startAngle >= 0 && endAngle > 0) {
            if (startAngle > endAngle) {
              depth = 0;
            } else {
              depth = Math.max(Math.sin(startAngle), Math.sin(endAngle));
            }
          } else {
            depth = 1;
          }
        }
      }
      attr.zIndex = 4 + depth;
      break;
    case 'outerBack':
      attr.zIndex = 1;
      break;
    case 'start':
      attr.zIndex = 4 + Math.sin(normalize(startAngle + rotation));
      break;
    case 'end':
      attr.zIndex = 4 + Math.sin(normalize(endAngle + rotation));
      break;
    case 'innerFront':
      attr.zIndex = 2;
      break;
    case 'innerBack':
      attr.zIndex = 4 + Math.sin(normalize((startAngle + endAngle) / 2 + rotation));
      break;
    case 'bottom':
      attr.zIndex = 0;
      break;
  }
  attr.dirtyZIndex = true;
}, updatePlainBBox:function(plain) {
  var attr = this.attr, part = attr.part, baseRotation = attr.baseRotation, centerX = attr.centerX, centerY = attr.centerY, rho, angle, x, y, sin, cos;
  if (part === 'start') {
    angle = attr.startAngle + baseRotation;
  } else {
    if (part === 'end') {
      angle = attr.endAngle + baseRotation;
    }
  }
  if (Ext.isNumber(angle)) {
    sin = Math.sin(angle);
    cos = Math.cos(angle);
    x = Math.min(centerX + cos * attr.startRho, centerX + cos * attr.endRho);
    y = centerY + sin * attr.startRho * attr.distortion;
    plain.x = x;
    plain.y = y;
    plain.width = cos * (attr.endRho - attr.startRho);
    plain.height = attr.thickness + sin * (attr.endRho - attr.startRho) * 2;
    return;
  }
  if (part === 'innerFront' || part === 'innerBack') {
    rho = attr.startRho;
  } else {
    rho = attr.endRho;
  }
  plain.width = rho * 2;
  plain.height = rho * attr.distortion * 2 + attr.thickness;
  plain.x = attr.centerX - rho;
  plain.y = attr.centerY - rho * attr.distortion;
}, updateTransformedBBox:function(transform) {
  if (this.attr.part === 'start' || this.attr.part === 'end') {
    return this.callParent(arguments);
  }
  return this.updatePlainBBox(transform);
}, updatePath:function(path) {
  if (!this.attr.globalAlpha) {
    return;
  }
  if (this.attr.endAngle < this.attr.startAngle) {
    return;
  }
  this[this.attr.part + 'Renderer'](path);
}, render:function(surface, ctx, rect) {
  var me = this, renderer = me.getRenderer(), attr = me.attr, part = attr.part, itemCfg, changes;
  if (!attr.globalAlpha || Ext.Number.isEqual(attr.startAngle, attr.endAngle, 1.0E-8)) {
    return;
  }
  if (renderer) {
    itemCfg = {type:'pie3dPart', part:attr.part, margin:attr.margin, distortion:attr.distortion, centerX:attr.centerX, centerY:attr.centerY, baseRotation:attr.baseRotation, startAngle:attr.startAngle, endAngle:attr.endAngle, startRho:attr.startRho, endRho:attr.endRho};
    changes = Ext.callback(renderer, null, [me, itemCfg, me.getRendererData(), me.getRendererIndex()], 0, me.getSeries());
    if (changes) {
      if (changes.part) {
        changes.part = part;
      }
      me.setAttributes(changes);
      me.useAttributes(ctx, rect);
    }
  }
  me.callParent([surface, ctx]);
  me.bevelRenderer(surface, ctx);
  if (attr.label && me.getMarker('labels')) {
    me.placeLabel();
  }
}, placeLabel:function() {
  var me = this, attr = me.attr, attributeId = attr.attributeId, margin = attr.margin, distortion = attr.distortion, centerX = attr.centerX, centerY = attr.centerY, baseRotation = attr.baseRotation, startAngle = attr.startAngle + baseRotation, endAngle = attr.endAngle + baseRotation, midAngle = (startAngle + endAngle) / 2, startRho = attr.startRho + margin, endRho = attr.endRho + margin, midRho = (startRho + endRho) / 2, sin = Math.sin(midAngle), cos = Math.cos(midAngle), surfaceMatrix = me.surfaceMatrix, 
  label = me.getMarker('labels'), labelTpl = label.getTemplate(), calloutLine = labelTpl.getCalloutLine(), calloutLineLength = calloutLine && calloutLine.length || 40, labelCfg = {}, rendererParams, rendererChanges, x, y;
  surfaceMatrix.appendMatrix(attr.matrix);
  labelCfg.text = attr.label;
  x = centerX + cos * midRho;
  y = centerY + sin * midRho * distortion;
  labelCfg.x = surfaceMatrix.x(x, y);
  labelCfg.y = surfaceMatrix.y(x, y);
  x = centerX + cos * endRho;
  y = centerY + sin * endRho * distortion;
  labelCfg.calloutStartX = surfaceMatrix.x(x, y);
  labelCfg.calloutStartY = surfaceMatrix.y(x, y);
  x = centerX + cos * (endRho + calloutLineLength);
  y = centerY + sin * (endRho + calloutLineLength) * distortion;
  labelCfg.calloutPlaceX = surfaceMatrix.x(x, y);
  labelCfg.calloutPlaceY = surfaceMatrix.y(x, y);
  labelCfg.calloutWidth = 2;
  if (labelTpl.attr.renderer) {
    rendererParams = [me.attr.label, label, labelCfg, me.getRendererData(), me.getRendererIndex()];
    rendererChanges = Ext.callback(labelTpl.attr.renderer, null, rendererParams, 0, me.getSeries());
    if (typeof rendererChanges === 'string') {
      labelCfg.text = rendererChanges;
    } else {
      Ext.apply(labelCfg, rendererChanges);
    }
  }
  me.putMarker('labels', labelCfg, attributeId);
  me.putMarker('labels', {callout:1}, attributeId);
}, bevelRenderer:function(surface, ctx) {
  var me = this, attr = me.attr, bevelWidth = attr.bevelWidth, params = me.bevelParams, i;
  for (i = 0; i < params.length; i++) {
    ctx.beginPath();
    ctx.ellipse.apply(ctx, params[i]);
    ctx.save();
    ctx.lineWidth = bevelWidth;
    ctx.strokeOpacity = bevelWidth ? 1 : 0;
    ctx.strokeGradient = me.bevelGradient;
    ctx.stroke(attr);
    ctx.restore();
  }
}, lidRenderer:function(path, thickness) {
  var attr = this.attr, margin = attr.margin, distortion = attr.distortion, centerX = attr.centerX, centerY = attr.centerY, baseRotation = attr.baseRotation, startAngle = attr.startAngle + baseRotation, endAngle = attr.endAngle + baseRotation, midAngle = (startAngle + endAngle) / 2, startRho = attr.startRho, endRho = attr.endRho, sinEnd = Math.sin(endAngle), cosEnd = Math.cos(endAngle);
  centerX += Math.cos(midAngle) * margin;
  centerY += Math.sin(midAngle) * margin * distortion;
  path.ellipse(centerX, centerY + thickness, startRho, startRho * distortion, 0, startAngle, endAngle, false);
  path.lineTo(centerX + cosEnd * endRho, centerY + thickness + sinEnd * endRho * distortion);
  path.ellipse(centerX, centerY + thickness, endRho, endRho * distortion, 0, endAngle, startAngle, true);
  path.closePath();
}, topRenderer:function(path) {
  this.lidRenderer(path, 0);
}, bottomRenderer:function(path) {
  var attr = this.attr, none = Ext.util.Color.RGBA_NONE;
  if (attr.globalAlpha < 1 || attr.fillOpacity < 1 || attr.shadowColor !== none) {
    this.lidRenderer(path, attr.thickness);
  }
}, sideRenderer:function(path, position) {
  var attr = this.attr, margin = attr.margin, centerX = attr.centerX, centerY = attr.centerY, distortion = attr.distortion, baseRotation = attr.baseRotation, startAngle = attr.startAngle + baseRotation, endAngle = attr.endAngle + baseRotation, isFullPie = !attr.startAngle && Ext.Number.isEqual(Math.PI * 2, attr.endAngle, 1.0E-7), thickness = attr.thickness, startRho = attr.startRho, endRho = attr.endRho, angle = position === 'start' && startAngle || position === 'end' && endAngle, sin = Math.sin(angle), 
  cos = Math.cos(angle), isTranslucent = attr.globalAlpha < 1, isVisible = position === 'start' && cos < 0 || position === 'end' && cos > 0 || isTranslucent, midAngle;
  if (isVisible && !isFullPie) {
    midAngle = (startAngle + endAngle) / 2;
    centerX += Math.cos(midAngle) * margin;
    centerY += Math.sin(midAngle) * margin * distortion;
    path.moveTo(centerX + cos * startRho, centerY + sin * startRho * distortion);
    path.lineTo(centerX + cos * endRho, centerY + sin * endRho * distortion);
    path.lineTo(centerX + cos * endRho, centerY + sin * endRho * distortion + thickness);
    path.lineTo(centerX + cos * startRho, centerY + sin * startRho * distortion + thickness);
    path.closePath();
  }
}, startRenderer:function(path) {
  this.sideRenderer(path, 'start');
}, endRenderer:function(path) {
  this.sideRenderer(path, 'end');
}, rimRenderer:function(path, radius, isDonut, isFront) {
  var me = this, attr = me.attr, margin = attr.margin, centerX = attr.centerX, centerY = attr.centerY, distortion = attr.distortion, baseRotation = attr.baseRotation, normalize = Ext.draw.sprite.AttributeParser.angle, startAngle = attr.startAngle + baseRotation, endAngle = attr.endAngle + baseRotation, midAngle = normalize((startAngle + endAngle) / 2), thickness = attr.thickness, isTranslucent = attr.globalAlpha < 1, isAllFront, isAllBack, params;
  me.bevelParams = [];
  startAngle = normalize(startAngle);
  endAngle = normalize(endAngle);
  centerX += Math.cos(midAngle) * margin;
  centerY += Math.sin(midAngle) * margin * distortion;
  isAllFront = startAngle >= 0 && endAngle >= 0;
  isAllBack = startAngle <= 0 && endAngle <= 0;
  function renderLeftFrontChunk() {
    path.ellipse(centerX, centerY + thickness, radius, radius * distortion, 0, Math.PI, startAngle, true);
    path.lineTo(centerX + Math.cos(startAngle) * radius, centerY + Math.sin(startAngle) * radius * distortion);
    params = [centerX, centerY, radius, radius * distortion, 0, startAngle, Math.PI, false];
    if (!isDonut) {
      me.bevelParams.push(params);
    }
    path.ellipse.apply(path, params);
    path.closePath();
  }
  function renderRightFrontChunk() {
    path.ellipse(centerX, centerY + thickness, radius, radius * distortion, 0, 0, endAngle, false);
    path.lineTo(centerX + Math.cos(endAngle) * radius, centerY + Math.sin(endAngle) * radius * distortion);
    params = [centerX, centerY, radius, radius * distortion, 0, endAngle, 0, true];
    if (!isDonut) {
      me.bevelParams.push(params);
    }
    path.ellipse.apply(path, params);
    path.closePath();
  }
  function renderLeftBackChunk() {
    path.ellipse(centerX, centerY + thickness, radius, radius * distortion, 0, Math.PI, endAngle, false);
    path.lineTo(centerX + Math.cos(endAngle) * radius, centerY + Math.sin(endAngle) * radius * distortion);
    params = [centerX, centerY, radius, radius * distortion, 0, endAngle, Math.PI, true];
    if (isDonut) {
      me.bevelParams.push(params);
    }
    path.ellipse.apply(path, params);
    path.closePath();
  }
  function renderRightBackChunk() {
    path.ellipse(centerX, centerY + thickness, radius, radius * distortion, 0, startAngle, 0, false);
    path.lineTo(centerX + radius, centerY);
    params = [centerX, centerY, radius, radius * distortion, 0, 0, startAngle, true];
    if (isDonut) {
      me.bevelParams.push(params);
    }
    path.ellipse.apply(path, params);
    path.closePath();
  }
  if (isFront) {
    if (!isDonut || isTranslucent) {
      if (startAngle >= 0 && endAngle < 0) {
        renderLeftFrontChunk();
      } else {
        if (startAngle <= 0 && endAngle > 0) {
          renderRightFrontChunk();
        } else {
          if (startAngle <= 0 && endAngle < 0) {
            if (startAngle > endAngle) {
              path.ellipse(centerX, centerY + thickness, radius, radius * distortion, 0, 0, Math.PI, false);
              path.lineTo(centerX - radius, centerY);
              params = [centerX, centerY, radius, radius * distortion, 0, Math.PI, 0, true];
              if (!isDonut) {
                me.bevelParams.push(params);
              }
              path.ellipse.apply(path, params);
              path.closePath();
            }
          } else {
            if (startAngle > endAngle) {
              renderLeftFrontChunk();
              renderRightFrontChunk();
            } else {
              params = [centerX, centerY, radius, radius * distortion, 0, startAngle, endAngle, false];
              if (isAllFront && !isDonut || isAllBack && isDonut) {
                me.bevelParams.push(params);
              }
              path.ellipse.apply(path, params);
              path.lineTo(centerX + Math.cos(endAngle) * radius, centerY + Math.sin(endAngle) * radius * distortion + thickness);
              path.ellipse(centerX, centerY + thickness, radius, radius * distortion, 0, endAngle, startAngle, true);
              path.closePath();
            }
          }
        }
      }
    }
  } else {
    if (isDonut || isTranslucent) {
      if (startAngle >= 0 && endAngle < 0) {
        renderLeftBackChunk();
      } else {
        if (startAngle <= 0 && endAngle > 0) {
          renderRightBackChunk();
        } else {
          if (startAngle <= 0 && endAngle < 0) {
            if (startAngle > endAngle) {
              renderLeftBackChunk();
              renderRightBackChunk();
            } else {
              path.ellipse(centerX, centerY + thickness, radius, radius * distortion, 0, startAngle, endAngle, false);
              path.lineTo(centerX + Math.cos(endAngle) * radius, centerY + Math.sin(endAngle) * radius * distortion);
              params = [centerX, centerY, radius, radius * distortion, 0, endAngle, startAngle, true];
              if (isDonut) {
                me.bevelParams.push(params);
              }
              path.ellipse.apply(path, params);
              path.closePath();
            }
          } else {
            if (startAngle > endAngle) {
              path.ellipse(centerX, centerY + thickness, radius, radius * distortion, 0, -Math.PI, 0, false);
              path.lineTo(centerX + radius, centerY);
              params = [centerX, centerY, radius, radius * distortion, 0, 0, -Math.PI, true];
              if (isDonut) {
                me.bevelParams.push(params);
              }
              path.ellipse.apply(path, params);
              path.closePath();
            }
          }
        }
      }
    }
  }
}, innerFrontRenderer:function(path) {
  this.rimRenderer(path, this.attr.startRho, true, true);
}, innerBackRenderer:function(path) {
  this.rimRenderer(path, this.attr.startRho, true, false);
}, outerFrontRenderer:function(path) {
  this.rimRenderer(path, this.attr.endRho, false, true);
}, outerBackRenderer:function(path) {
  this.rimRenderer(path, this.attr.endRho, false, false);
}});
Ext.define('Ext.chart.series.Pie3D', {extend:'Ext.chart.series.Polar', requires:['Ext.chart.series.sprite.Pie3DPart', 'Ext.draw.PathUtil'], type:'pie3d', seriesType:'pie3d', alias:'series.pie3d', is3D:true, config:{rect:[0, 0, 0, 0], thickness:35, distortion:0.5, donut:0, hidden:[], highlightCfg:{margin:20}, shadow:false}, rotationOffset:-Math.PI / 2, setField:function(value) {
  return this.setXField(value);
}, getField:function() {
  return this.getXField();
}, updateRotation:function(rotation) {
  var attributes = {baseRotation:rotation + this.rotationOffset};
  this.forEachSprite(function(sprite) {
    sprite.setAttributes(attributes);
  });
}, updateColors:function(colors) {
  this.setSubStyle({baseColor:colors});
  if (!this.isConfiguring) {
    var chart = this.getChart();
    if (chart) {
      chart.refreshLegendStore();
    }
  }
}, applyShadow:function(shadow) {
  if (shadow === true) {
    shadow = {shadowColor:'rgba(0,0,0,0.8)', shadowBlur:30};
  } else {
    if (!Ext.isObject(shadow)) {
      shadow = {shadowColor:Ext.util.Color.RGBA_NONE};
    }
  }
  return shadow;
}, updateShadow:function(shadow) {
  var me = this, sprites = me.getSprites(), spritesPerSlice = me.spritesPerSlice, ln = sprites && sprites.length, i, sprite;
  for (i = 1; i < ln; i += spritesPerSlice) {
    sprite = sprites[i];
    if (sprite.attr.part = 'bottom') {
      sprite.setAttributes(shadow);
    }
  }
}, getStyleByIndex:function(i) {
  var indexStyle = this.callParent([i]), style = this.getStyle(), fillStyle = indexStyle.fillStyle || indexStyle.fill || indexStyle.color, strokeStyle = style.strokeStyle || style.stroke;
  if (fillStyle) {
    indexStyle.baseColor = fillStyle;
    delete indexStyle.fillStyle;
    delete indexStyle.fill;
    delete indexStyle.color;
  }
  if (strokeStyle) {
    indexStyle.strokeStyle = strokeStyle;
  }
  return indexStyle;
}, doUpdateStyles:function() {
  var me = this, sprites = me.getSprites(), spritesPerSlice = me.spritesPerSlice, ln = sprites && sprites.length, i = 0, j = 0, k, style;
  for (; i < ln; i += spritesPerSlice, j++) {
    style = me.getStyleByIndex(j);
    for (k = 0; k < spritesPerSlice; k++) {
      sprites[i + k].setAttributes(style);
    }
  }
}, coordinateX:function() {
  var me = this, store = me.getStore(), records = store.getData().items, recordCount = records.length, xField = me.getXField(), animation = me.getAnimation(), rotation = me.getRotation(), hidden = me.getHidden(), sprites = me.getSprites(true), spriteCount = sprites.length, spritesPerSlice = me.spritesPerSlice, center = me.getCenter(), offsetX = me.getOffsetX(), offsetY = me.getOffsetY(), radius = me.getRadius(), thickness = me.getThickness(), distortion = me.getDistortion(), renderer = me.getRenderer(), 
  rendererData = me.getRendererData(), highlight = me.getHighlight(), lastAngle = 0, twoPi = Math.PI * 2, delta = 1.0E-10, endAngles = [], sum = 0, value, unit, sprite, style, i, j;
  for (i = 0; i < recordCount; i++) {
    value = Math.abs(+records[i].get(xField)) || 0;
    if (!hidden[i]) {
      sum += value;
    }
    endAngles[i] = sum;
    if (i >= hidden.length) {
      hidden[i] = false;
    }
  }
  if (sum === 0) {
    return;
  }
  unit = 2 * Math.PI / sum;
  for (i = 0; i < recordCount; i++) {
    endAngles[i] *= unit;
  }
  for (i = 0; i < recordCount; i++) {
    style = this.getStyleByIndex(i);
    for (j = 0; j < spritesPerSlice; j++) {
      sprite = sprites[i * spritesPerSlice + j];
      sprite.setAnimation(animation);
      sprite.setAttributes({centerX:center[0] + offsetX, centerY:center[1] + offsetY - thickness / 2, endRho:radius, startRho:radius * me.getDonut() / 100, baseRotation:rotation + me.rotationOffset, startAngle:lastAngle, endAngle:endAngles[i] - delta, thickness:thickness, distortion:distortion, globalAlpha:1});
      sprite.setAttributes(style);
      sprite.setConfig({renderer:renderer, rendererData:rendererData, rendererIndex:i});
    }
    lastAngle = endAngles[i];
  }
  for (i *= spritesPerSlice; i < spriteCount; i++) {
    sprite = sprites[i];
    sprite.setAnimation(animation);
    sprite.setAttributes({startAngle:twoPi, endAngle:twoPi, globalAlpha:0, baseRotation:rotation + me.rotationOffset});
  }
}, updateHighlight:function(highlight, oldHighlight) {
  this.callParent([highlight, oldHighlight]);
  this.forEachSprite(function(sprite) {
    if (highlight) {
      if (sprite.modifiers.highlight) {
        sprite.modifiers.highlight.setConfig(highlight);
      } else {
        sprite.config.highlight = highlight;
        sprite.addModifier(highlight, true);
      }
    }
  });
}, updateLabelData:function() {
  var me = this, store = me.getStore(), items = store.getData().items, sprites = me.getSprites(), label = me.getLabel(), labelField = label && label.getTemplate().getField(), hidden = me.getHidden(), spritesPerSlice = me.spritesPerSlice, ln, labels, sprite, name = 'labels', i, j;
  if (sprites.length) {
    if (labelField) {
      labels = [];
      for (j = 0, ln = items.length; j < ln; j++) {
        labels.push(items[j].get(labelField));
      }
    }
    for (i = 0, j = 0, ln = sprites.length; i < ln; i += spritesPerSlice, j++) {
      sprite = sprites[i];
      if (label) {
        if (!sprite.getMarker(name)) {
          sprite.bindMarker(name, label);
        }
        if (labels) {
          sprite.setAttributes({label:labels[j]});
        }
        sprite.putMarker(name, {hidden:hidden[j]}, sprite.attr.attributeId);
      } else {
        sprite.releaseMarker(name);
      }
    }
  }
}, applyRadius:function() {
  var me = this, chart = me.getChart(), padding = chart.getInnerPadding(), rect = chart.getMainRect() || [0, 0, 1, 1], width = rect[2] - padding * 2, height = rect[3] - padding * 2 - me.getThickness(), horizontalRadius = width / 2, verticalRadius = horizontalRadius * me.getDistortion(), result;
  if (verticalRadius > height / 2) {
    result = height / (me.getDistortion() * 2);
  } else {
    result = horizontalRadius;
  }
  return Math.max(result, 0);
}, forEachSprite:function(fn) {
  var sprites = this.sprites, ln = sprites.length, i;
  for (i = 0; i < ln; i++) {
    fn(sprites[i], Math.floor(i / this.spritesPerSlice));
  }
}, updateRadius:function(radius) {
  this.getChart();
  var donut = this.getDonut();
  this.forEachSprite(function(sprite) {
    sprite.setAttributes({endRho:radius, startRho:radius * donut / 100});
  });
}, updateDonut:function(donut) {
  this.getChart();
  var radius = this.getRadius();
  this.forEachSprite(function(sprite) {
    sprite.setAttributes({startRho:radius * donut / 100});
  });
}, updateCenter:function(center) {
  this.getChart();
  var offsetX = this.getOffsetX(), offsetY = this.getOffsetY(), thickness = this.getThickness();
  this.forEachSprite(function(sprite) {
    sprite.setAttributes({centerX:center[0] + offsetX, centerY:center[1] + offsetY - thickness / 2});
  });
}, updateThickness:function(thickness) {
  this.getChart();
  this.setRadius();
  var center = this.getCenter(), offsetY = this.getOffsetY();
  this.forEachSprite(function(sprite) {
    sprite.setAttributes({thickness:thickness, centerY:center[1] + offsetY - thickness / 2});
  });
}, updateDistortion:function(distortion) {
  this.getChart();
  this.setRadius();
  this.forEachSprite(function(sprite) {
    sprite.setAttributes({distortion:distortion});
  });
}, updateOffsetX:function(offsetX) {
  this.getChart();
  var center = this.getCenter();
  this.forEachSprite(function(sprite) {
    sprite.setAttributes({centerX:center[0] + offsetX});
  });
}, updateOffsetY:function(offsetY) {
  this.getChart();
  var center = this.getCenter(), thickness = this.getThickness();
  this.forEachSprite(function(sprite) {
    sprite.setAttributes({centerY:center[1] + offsetY - thickness / 2});
  });
}, updateAnimation:function(animation) {
  this.getChart();
  this.forEachSprite(function(sprite) {
    sprite.setAnimation(animation);
  });
}, updateRenderer:function(renderer) {
  this.getChart();
  var rendererData = this.getRendererData();
  this.forEachSprite(function(sprite, itemIndex) {
    sprite.setConfig({renderer:renderer, rendererData:rendererData, rendererIndex:itemIndex});
  });
}, getRendererData:function() {
  return {store:this.getStore(), angleField:this.getXField(), radiusField:this.getYField(), series:this};
}, getSprites:function(createMissing) {
  var me = this, store = me.getStore(), sprites = me.sprites;
  if (!store) {
    return Ext.emptyArray;
  }
  if (sprites && !createMissing) {
    return sprites;
  }
  var surface = me.getSurface(), records = store.getData().items, spritesPerSlice = me.spritesPerSlice, partCount = me.partNames.length, recordCount = records.length, sprite, i, j;
  for (i = 0; i < recordCount; i++) {
    if (!sprites[i * spritesPerSlice]) {
      for (j = 0; j < partCount; j++) {
        sprite = surface.add({type:'pie3dPart', part:me.partNames[j], series:me});
        sprite.getAnimation().setDurationOn('baseRotation', 0);
        sprites.push(sprite);
      }
    }
  }
  return sprites;
}, betweenAngle:function(x, a, b) {
  var pp = Math.PI * 2, offset = this.rotationOffset;
  a += offset;
  b += offset;
  x -= a;
  b -= a;
  x %= pp;
  b %= pp;
  x += pp;
  b += pp;
  x %= pp;
  b %= pp;
  return x < b || b === 0;
}, getItemForPoint:function(x, y) {
  var me = this, sprites = me.getSprites(), result = null;
  if (!sprites) {
    return result;
  }
  var store = me.getStore(), records = store.getData().items, spritesPerSlice = me.spritesPerSlice, hidden = me.getHidden(), i, ln, sprite, topPartIndex;
  for (i = 0, ln = records.length; i < ln; i++) {
    if (hidden[i]) {
      continue;
    }
    topPartIndex = i * spritesPerSlice;
    sprite = sprites[topPartIndex];
    if (sprite.hitTest([x, y])) {
      result = {series:me, sprite:sprites.slice(topPartIndex, topPartIndex + spritesPerSlice), index:i, record:records[i], category:'sprites', field:me.getXField()};
      break;
    }
  }
  return result;
}, provideLegendInfo:function(target) {
  var me = this, store = me.getStore();
  if (store) {
    var items = store.getData().items, labelField = me.getLabel().getTemplate().getField(), field = me.getField(), hidden = me.getHidden(), i, style, color;
    for (i = 0; i < items.length; i++) {
      style = me.getStyleByIndex(i);
      color = style.baseColor;
      target.push({name:labelField ? String(items[i].get(labelField)) : field + ' ' + i, mark:color || 'black', disabled:hidden[i], series:me.getId(), index:i});
    }
  }
}}, function() {
  var proto = this.prototype, definition = Ext.chart.series.sprite.Pie3DPart.def.getInitialConfig().processors.part;
  proto.partNames = definition.replace(/^enums\(|\)/g, '').split(',');
  proto.spritesPerSlice = proto.partNames.length;
});
Ext.define('Ext.chart.series.sprite.Polar', {extend:'Ext.chart.series.sprite.Series', inheritableStatics:{def:{processors:{centerX:'number', centerY:'number', startAngle:'number', endAngle:'number', startRho:'number', endRho:'number', baseRotation:'number'}, defaults:{centerX:0, centerY:0, startAngle:0, endAngle:Math.PI, startRho:0, endRho:150, baseRotation:0}, triggers:{centerX:'bbox', centerY:'bbox', startAngle:'bbox', endAngle:'bbox', startRho:'bbox', endRho:'bbox', baseRotation:'bbox'}}}, updatePlainBBox:function(plain) {
  var attr = this.attr;
  plain.x = attr.centerX - attr.endRho;
  plain.y = attr.centerY + attr.endRho;
  plain.width = attr.endRho * 2;
  plain.height = attr.endRho * 2;
}});
Ext.define('Ext.chart.series.sprite.Radar', {alias:'sprite.radar', extend:'Ext.chart.series.sprite.Polar', getDataPointXY:function(index) {
  var me = this, attr = me.attr, centerX = attr.centerX, centerY = attr.centerY, matrix = attr.matrix, minX = attr.dataMinX, maxX = attr.dataMaxX, dataX = attr.dataX, dataY = attr.dataY, endRho = attr.endRho, startRho = attr.startRho, baseRotation = attr.baseRotation, x, y, r, th, ox, oy, maxY;
  if (attr.rangeY) {
    maxY = attr.rangeY[1];
  } else {
    maxY = attr.dataMaxY;
  }
  th = (dataX[index] - minX) / (maxX - minX + 1) * 2 * Math.PI + baseRotation;
  r = dataY[index] / maxY * (endRho - startRho) + startRho;
  ox = centerX + Math.cos(th) * r;
  oy = centerY + Math.sin(th) * r;
  x = matrix.x(ox, oy);
  y = matrix.y(ox, oy);
  return [x, y];
}, render:function(surface, ctx) {
  var me = this, attr = me.attr, dataX = attr.dataX, length = dataX.length, surfaceMatrix = me.surfaceMatrix, markerCfg = {}, i, x, y, xy;
  ctx.beginPath();
  for (i = 0; i < length; i++) {
    xy = me.getDataPointXY(i);
    x = xy[0];
    y = xy[1];
    if (i === 0) {
      ctx.moveTo(x, y);
    }
    ctx.lineTo(x, y);
    markerCfg.translationX = surfaceMatrix.x(x, y);
    markerCfg.translationY = surfaceMatrix.y(x, y);
    me.putMarker('markers', markerCfg, i, true);
  }
  ctx.closePath();
  ctx.fillStroke(attr);
}});
Ext.define('Ext.chart.series.Radar', {extend:'Ext.chart.series.Polar', type:'radar', seriesType:'radar', alias:'series.radar', requires:['Ext.chart.series.sprite.Radar'], themeColorCount:function() {
  return 1;
}, isStoreDependantColorCount:false, themeMarkerCount:function() {
  return 1;
}, updateAngularAxis:function(axis) {
  axis.processData(this);
}, updateRadialAxis:function(axis) {
  axis.processData(this);
}, coordinateX:function() {
  return this.coordinate('X', 0, 2);
}, coordinateY:function() {
  return this.coordinate('Y', 1, 2);
}, updateCenter:function(center) {
  this.setStyle({translationX:center[0] + this.getOffsetX(), translationY:center[1] + this.getOffsetY()});
  this.doUpdateStyles();
}, updateRadius:function(radius) {
  this.setStyle({endRho:radius});
  this.doUpdateStyles();
}, updateRotation:function(rotation) {
  var me = this, chart = me.getChart(), axes = chart.getAxes(), i, ln, axis;
  for (i = 0, ln = axes.length; i < ln; i++) {
    axis = axes[i];
    axis.setRotation(rotation);
  }
  me.setStyle({rotationRads:rotation});
  me.doUpdateStyles();
}, updateTotalAngle:function(totalAngle) {
  this.processData();
}, getItemForPoint:function(x, y) {
  var me = this, sprite = me.sprites && me.sprites[0], attr = sprite.attr, dataX = attr.dataX, length = dataX.length, store = me.getStore(), marker = me.getMarker(), threshhold, item, xy, i, bbox, markers;
  if (me.getHidden()) {
    return null;
  }
  if (sprite && marker) {
    markers = sprite.getMarker('markers');
    for (i = 0; i < length; i++) {
      bbox = markers.getBBoxFor(i);
      threshhold = (bbox.width + bbox.height) * 0.25;
      xy = sprite.getDataPointXY(i);
      if (Math.abs(xy[0] - x) < threshhold && Math.abs(xy[1] - y) < threshhold) {
        item = {series:me, sprite:sprite, index:i, category:'markers', record:store.getData().items[i], field:me.getYField()};
        return item;
      }
    }
  }
  return me.callParent(arguments);
}, getDefaultSpriteConfig:function() {
  var config = this.callParent(), animation = {customDurations:{translationX:0, translationY:0, rotationRads:0, dataMinX:0, dataMaxX:0}};
  if (config.animation) {
    Ext.apply(config.animation, animation);
  } else {
    config.animation = animation;
  }
  return config;
}, getSprites:function() {
  var me = this, chart = me.getChart(), sprites = me.sprites;
  if (!chart) {
    return Ext.emptyArray;
  }
  if (!sprites.length) {
    me.createSprite();
  }
  return sprites;
}, provideLegendInfo:function(target) {
  var me = this, style = me.getSubStyleWithTheme(), fill = style.fillStyle;
  if (Ext.isArray(fill)) {
    fill = fill[0];
  }
  target.push({name:me.getTitle() || me.getYField() || me.getId(), mark:(Ext.isObject(fill) ? fill.stops && fill.stops[0].color : fill) || style.strokeStyle || 'black', disabled:me.getHidden(), series:me.getId(), index:0});
}});
Ext.define('Ext.chart.series.sprite.Scatter', {alias:'sprite.scatterSeries', extend:'Ext.chart.series.sprite.Cartesian', renderClipped:function(surface, ctx, dataClipRect, surfaceClipRect) {
  if (this.cleanRedraw) {
    return;
  }
  var me = this, attr = me.attr, dataX = attr.dataX, dataY = attr.dataY, labels = attr.labels, series = me.getSeries(), isDrawLabels = labels && me.getMarker('labels'), matrix = me.attr.matrix, xx = matrix.getXX(), yy = matrix.getYY(), dx = matrix.getDX(), dy = matrix.getDY(), markerCfg = {}, changes, params, xScalingDirection = surface.getInherited().rtl && !attr.flipXY ? -1 : 1, left, right, top, bottom, x, y, i;
  if (attr.flipXY) {
    left = surfaceClipRect[1] - xx * xScalingDirection;
    right = surfaceClipRect[1] + surfaceClipRect[3] + xx * xScalingDirection;
    top = surfaceClipRect[0] - yy;
    bottom = surfaceClipRect[0] + surfaceClipRect[2] + yy;
  } else {
    left = surfaceClipRect[0] - xx * xScalingDirection;
    right = surfaceClipRect[0] + surfaceClipRect[2] + xx * xScalingDirection;
    top = surfaceClipRect[1] - yy;
    bottom = surfaceClipRect[1] + surfaceClipRect[3] + yy;
  }
  for (i = 0; i < dataX.length; i++) {
    x = dataX[i];
    y = dataY[i];
    x = x * xx + dx;
    y = y * yy + dy;
    if (left <= x && x <= right && top <= y && y <= bottom) {
      if (attr.renderer) {
        markerCfg = {type:'items', translationX:x, translationY:y};
        params = [me, markerCfg, {store:me.getStore()}, i];
        changes = Ext.callback(attr.renderer, null, params, 0, series);
        markerCfg = Ext.apply(markerCfg, changes);
      } else {
        markerCfg.translationX = x;
        markerCfg.translationY = y;
      }
      me.putMarker('items', markerCfg, i, !attr.renderer);
      if (isDrawLabels && labels[i]) {
        me.drawLabel(labels[i], x, y, i, surfaceClipRect);
      }
    }
  }
}, drawLabel:function(text, dataX, dataY, labelId, rect) {
  var me = this, attr = me.attr, label = me.getMarker('labels'), labelTpl = label.getTemplate(), labelCfg = me.labelCfg || (me.labelCfg = {}), surfaceMatrix = me.surfaceMatrix, labelX, labelY, labelOverflowPadding = attr.labelOverflowPadding, flipXY = attr.flipXY, halfHeight, labelBox, changes, params;
  labelCfg.text = text;
  labelBox = me.getMarkerBBox('labels', labelId, true);
  if (!labelBox) {
    me.putMarker('labels', labelCfg, labelId);
    labelBox = me.getMarkerBBox('labels', labelId, true);
  }
  if (flipXY) {
    labelCfg.rotationRads = Math.PI * 0.5;
  } else {
    labelCfg.rotationRads = 0;
  }
  halfHeight = labelBox.height / 2;
  labelX = dataX;
  switch(labelTpl.attr.display) {
    case 'under':
      labelY = dataY - halfHeight - labelOverflowPadding;
      break;
    case 'rotate':
      labelX += labelOverflowPadding;
      labelY = dataY - labelOverflowPadding;
      labelCfg.rotationRads = -Math.PI / 4;
      break;
    default:
      labelY = dataY + halfHeight + labelOverflowPadding;
  }
  labelCfg.x = surfaceMatrix.x(labelX, labelY);
  labelCfg.y = surfaceMatrix.y(labelX, labelY);
  if (labelTpl.attr.renderer) {
    params = [text, label, labelCfg, {store:me.getStore()}, labelId];
    changes = Ext.callback(labelTpl.attr.renderer, null, params, 0, me.getSeries());
    if (typeof changes === 'string') {
      labelCfg.text = changes;
    } else {
      Ext.apply(labelCfg, changes);
    }
  }
  me.putMarker('labels', labelCfg, labelId);
}});
Ext.define('Ext.chart.series.Scatter', {extend:'Ext.chart.series.Cartesian', alias:'series.scatter', type:'scatter', seriesType:'scatterSeries', requires:['Ext.chart.series.sprite.Scatter'], config:{itemInstancing:{animation:{customDurations:{translationX:0, translationY:0}}}}, themeMarkerCount:function() {
  return 1;
}, applyMarker:function(marker, oldMarker) {
  this.getItemInstancing();
  this.setItemInstancing(marker);
  return this.callParent(arguments);
}, provideLegendInfo:function(target) {
  var me = this, style = me.getMarkerStyleByIndex(0), fill = style.fillStyle;
  target.push({name:me.getTitle() || me.getYField() || me.getId(), mark:(Ext.isObject(fill) ? fill.stops && fill.stops[0].color : fill) || style.strokeStyle || 'black', disabled:me.getHidden(), series:me.getId(), index:0});
}});
Ext.define('Ext.chart.theme.Blue', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.blue', 'chart.theme.Blue'], config:{baseColor:'#4d7fe6'}});
Ext.define('Ext.chart.theme.BlueGradients', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.blue-gradients', 'chart.theme.Blue:gradients'], config:{baseColor:'#4d7fe6', gradients:{type:'linear', degrees:90}}});
Ext.define('Ext.chart.theme.Category1', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.category1', 'chart.theme.Category1'], config:{colors:['#f0a50a', '#c20024', '#2044ba', '#810065', '#7eae29']}});
Ext.define('Ext.chart.theme.Category1Gradients', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.category1-gradients', 'chart.theme.Category1:gradients'], config:{colors:['#f0a50a', '#c20024', '#2044ba', '#810065', '#7eae29'], gradients:{type:'linear', degrees:90}}});
Ext.define('Ext.chart.theme.Category2', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.category2', 'chart.theme.Category2'], config:{colors:['#6d9824', '#87146e', '#2a9196', '#d39006', '#1e40ac']}});
Ext.define('Ext.chart.theme.Category2Gradients', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.category2-gradients', 'chart.theme.Category2:gradients'], config:{colors:['#6d9824', '#87146e', '#2a9196', '#d39006', '#1e40ac'], gradients:{type:'linear', degrees:90}}});
Ext.define('Ext.chart.theme.Category3', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.category3', 'chart.theme.Category3'], config:{colors:['#fbbc29', '#ce2e4e', '#7e0062', '#158b90', '#57880e']}});
Ext.define('Ext.chart.theme.Category3Gradients', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.category3-gradients', 'chart.theme.Category3:gradients'], config:{colors:['#fbbc29', '#ce2e4e', '#7e0062', '#158b90', '#57880e'], gradients:{type:'linear', degrees:90}}});
Ext.define('Ext.chart.theme.Category4', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.category4', 'chart.theme.Category4'], config:{colors:['#ef5773', '#fcbd2a', '#4f770d', '#1d3eaa', '#9b001f']}});
Ext.define('Ext.chart.theme.Category4Gradients', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.category4-gradients', 'chart.theme.Category4:gradients'], config:{colors:['#ef5773', '#fcbd2a', '#4f770d', '#1d3eaa', '#9b001f'], gradients:{type:'linear', degrees:90}}});
Ext.define('Ext.chart.theme.Category5', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.category5', 'chart.theme.Category5'], config:{colors:['#7eae29', '#fdbe2a', '#910019', '#27b4bc', '#d74dbc']}});
Ext.define('Ext.chart.theme.Category5Gradients', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.category5-gradients', 'chart.theme.Category5:gradients'], config:{colors:['#7eae29', '#fdbe2a', '#910019', '#27b4bc', '#d74dbc'], gradients:{type:'linear', degrees:90}}});
Ext.define('Ext.chart.theme.Category6', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.category6', 'chart.theme.Category6'], config:{colors:['#44dce1', '#0b2592', '#996e05', '#7fb325', '#b821a1']}});
Ext.define('Ext.chart.theme.Category6Gradients', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.category6-gradients', 'chart.theme.Category6:gradients'], config:{colors:['#44dce1', '#0b2592', '#996e05', '#7fb325', '#b821a1'], gradients:{type:'linear', degrees:90}}});
Ext.define('Ext.chart.theme.DefaultGradients', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.default-gradients', 'chart.theme.Base:gradients'], config:{gradients:{type:'linear', degrees:90}}});
Ext.define('Ext.chart.theme.Green', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.green', 'chart.theme.Green'], config:{baseColor:'#b1da5a'}});
Ext.define('Ext.chart.theme.GreenGradients', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.green-gradients', 'chart.theme.Green:gradients'], config:{baseColor:'#b1da5a', gradients:{type:'linear', degrees:90}}});
Ext.define('Ext.chart.theme.Midnight', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.midnight', 'chart.theme.Midnight'], config:{colors:['#a837ff', '#4ac0f2', '#ff4d35', '#ff8809', '#61c102', '#ff37ea'], chart:{defaults:{captions:{title:{docked:'top', padding:5, style:{textAlign:'center', fontFamily:'default', fontWeight:'bold', fillStyle:'rgb(224, 224, 227)', fontSize:'default*1.6'}}, subtitle:{docked:'top', style:{textAlign:'center', fontFamily:'default', fontWeight:'normal', 
fillStyle:'rgb(224, 224, 227)', fontSize:'default*1.3'}}, credits:{docked:'bottom', padding:5, style:{textAlign:'left', fontFamily:'default', fontWeight:'lighter', fillStyle:'rgb(224, 224, 227)', fontSize:'default'}}}, background:'rgb(52, 52, 53)'}}, axis:{defaults:{style:{strokeStyle:'rgb(224, 224, 227)'}, label:{fillStyle:'rgb(224, 224, 227)'}, title:{fillStyle:'rgb(224, 224, 227)'}, grid:{strokeStyle:'rgb(112, 112, 115)'}}}, series:{defaults:{label:{fillStyle:'rgb(224, 224, 227)'}}}, sprites:{text:{fillStyle:'rgb(224, 224, 227)'}}, 
legend:{label:{fillStyle:'white'}, border:{lineWidth:2, fillStyle:'rgba(255, 255, 255, 0.3)', strokeStyle:'rgb(150, 150, 150)'}, background:'rgb(52, 52, 53)'}}});
Ext.define('Ext.chart.theme.Muted', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.muted', 'chart.theme.Muted'], config:{colors:['#8ca640', '#974144', '#4091ba', '#8e658e', '#3b8d8b', '#b86465', '#d2af69', '#6e8852', '#3dcc7e', '#a6bed1', '#cbaa4b', '#998baa']}});
Ext.define('Ext.chart.theme.Purple', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.purple', 'chart.theme.Purple'], config:{baseColor:'#da5abd'}});
Ext.define('Ext.chart.theme.PurpleGradients', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.purple-gradients', 'chart.theme.Purple:gradients'], config:{baseColor:'#da5abd', gradients:{type:'linear', degrees:90}}});
Ext.define('Ext.chart.theme.Red', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.red', 'chart.theme.Red'], config:{baseColor:'#e84b67'}});
Ext.define('Ext.chart.theme.RedGradients', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.red-gradients', 'chart.theme.Red:gradients'], config:{baseColor:'#e84b67', gradients:{type:'linear', degrees:90}}});
Ext.define('Ext.chart.theme.Sky', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.sky', 'chart.theme.Sky'], config:{baseColor:'#4ce0e7'}});
Ext.define('Ext.chart.theme.SkyGradients', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.sky-gradients', 'chart.theme.Sky:gradients'], config:{baseColor:'#4ce0e7', gradients:{type:'linear', degrees:90}}});
Ext.define('Ext.chart.theme.Yellow', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.yellow', 'chart.theme.Yellow'], config:{baseColor:'#fec935'}});
Ext.define('Ext.chart.theme.YellowGradients', {extend:'Ext.chart.theme.Base', singleton:true, alias:['chart.theme.yellow-gradients', 'chart.theme.Yellow:gradients'], config:{baseColor:'#fec935', gradients:{type:'linear', degrees:90}}});
Ext.define('Ext.draw.Point', {requires:['Ext.draw.Draw', 'Ext.draw.Matrix'], isPoint:true, x:0, y:0, length:0, angle:0, angleUnits:'degrees', statics:{fly:function() {
  var point = null;
  return function(x, y) {
    if (!point) {
      point = new Ext.draw.Point;
    }
    point.constructor(x, y);
    return point;
  };
}()}, constructor:function(x, y) {
  var me = this;
  if (typeof x === 'number') {
    me.x = x;
    if (typeof y === 'number') {
      me.y = y;
    } else {
      me.y = x;
    }
  } else {
    if (Ext.isArray(x)) {
      me.x = x[0];
      me.y = x[1];
    } else {
      if (x) {
        me.x = x.x;
        me.y = x.y;
      }
    }
  }
  me.calculatePolar();
}, calculateCartesian:function() {
  var me = this, length = me.length, angle = me.angle;
  if (me.angleUnits === 'degrees') {
    angle = Ext.draw.Draw.rad(angle);
  }
  me.x = Math.cos(angle) * length;
  me.y = Math.sin(angle) * length;
}, calculatePolar:function() {
  var me = this, x = me.x, y = me.y;
  me.length = Math.sqrt(x * x + y * y);
  me.angle = Math.atan2(y, x);
  if (me.angleUnits === 'degrees') {
    me.angle = Ext.draw.Draw.degrees(me.angle);
  }
}, setX:function(x) {
  this.x = x;
  this.calculatePolar();
}, setY:function(y) {
  this.y = y;
  this.calculatePolar();
}, set:function(x, y) {
  this.constructor(x, y);
}, setAngle:function(angle) {
  this.angle = angle;
  this.calculateCartesian();
}, setLength:function(length) {
  this.length = length;
  this.calculateCartesian();
}, setPolar:function(angle, length) {
  this.angle = angle;
  this.length = length;
  this.calculateCartesian();
}, clone:function() {
  return new Ext.draw.Point(this.x, this.y);
}, add:function(x, y) {
  var fly = Ext.draw.Point.fly(x, y);
  return new Ext.draw.Point(this.x + fly.x, this.y + fly.y);
}, sub:function(x, y) {
  var fly = Ext.draw.Point.fly(x, y);
  return new Ext.draw.Point(this.x - fly.x, this.y - fly.y);
}, mul:function(n) {
  return new Ext.draw.Point(this.x * n, this.y * n);
}, div:function(n) {
  return new Ext.draw.Point(this.x / n, this.y / n);
}, dot:function(x, y) {
  var fly = Ext.draw.Point.fly(x, y);
  return this.x * fly.x + this.y * fly.y;
}, equals:function(x, y) {
  var fly = Ext.draw.Point.fly(x, y);
  return this.x === fly.x && this.y === fly.y;
}, rotate:function(angle, center) {
  var sin, cos, cx, cy, point;
  if (this.angleUnits === 'degrees') {
    angle = Ext.draw.Draw.rad(angle);
    sin = Math.sin(angle);
    cos = Math.cos(angle);
  }
  if (center) {
    cx = center.x;
    cy = center.y;
  } else {
    cx = 0;
    cy = 0;
  }
  point = Ext.draw.Matrix.fly([cos, sin, -sin, cos, cx - cos * cx + cy * sin, cy - cos * cy + cx * -sin]).transformPoint(this);
  return new Ext.draw.Point(point);
}, transform:function(matrix) {
  if (matrix && matrix.isMatrix) {
    return new Ext.draw.Point(matrix.transformPoint(this));
  } else {
    if (arguments.length === 6) {
      return new Ext.draw.Point(Ext.draw.Matrix.fly(arguments).transformPoint(this));
    } else {
      Ext.raise('Invalid parameters.');
    }
  }
}, round:function() {
  return new Ext.draw.Point(Math.round(this.x), Math.round(this.y));
}, ceil:function() {
  return new Ext.draw.Point(Math.ceil(this.x), Math.ceil(this.y));
}, floor:function() {
  return new Ext.draw.Point(Math.floor(this.x), Math.floor(this.y));
}, abs:function(x, y) {
  return new Ext.draw.Point(Math.abs(this.x), Math.abs(this.y));
}, normalize:function(factor) {
  var x = this.x, y = this.y, k = (factor || 1) / Math.sqrt(x * x + y * y);
  return new Ext.draw.Point(x * k, y * k);
}, getDistanceToLine:function(p1, p2) {
  if (arguments.length === 4) {
    p1 = new Ext.draw.Point(arguments[0], arguments[1]);
    p2 = new Ext.draw.Point(arguments[2], arguments[3]);
  }
  var n = p2.sub(p1).normalize(), pp1 = p1.sub(this);
  return pp1.sub(n.mul(pp1.dot(n)));
}, isZero:function() {
  return this.x === 0 && this.y === 0;
}, isNumber:function() {
  return Ext.isNumber(this.x) && Ext.isNumber(this.y);
}});
Ext.define('Ext.draw.plugin.SpriteEvents', {extend:'Ext.plugin.Abstract', alias:'plugin.spriteevents', requires:['Ext.draw.overrides.hittest.All'], mouseMoveEvents:{mousemove:true, mouseover:true, mouseout:true}, spriteMouseMoveEvents:{spritemousemove:true, spritemouseover:true, spritemouseout:true}, init:function(drawContainer) {
  var handleEvent = 'handleEvent';
  this.drawContainer = drawContainer;
  drawContainer.addElementListener({click:handleEvent, dblclick:handleEvent, mousedown:handleEvent, mousemove:handleEvent, mouseup:handleEvent, mouseover:handleEvent, mouseout:handleEvent, priority:1001, scope:this});
}, hasSpriteMouseMoveListeners:function() {
  var listeners = this.drawContainer.hasListeners, name;
  for (name in this.spriteMouseMoveEvents) {
    if (name in listeners) {
      return true;
    }
  }
  return false;
}, hitTestEvent:function(e) {
  var items = this.drawContainer.getItems(), surface, sprite, i;
  for (i = items.length - 1; i >= 0; i--) {
    surface = items.get(i);
    sprite = surface.hitTestEvent(e);
    if (sprite) {
      return sprite;
    }
  }
  return null;
}, handleEvent:function(e) {
  var me = this, drawContainer = me.drawContainer, isMouseMoveEvent = e.type in me.mouseMoveEvents, lastSprite = me.lastSprite, sprite;
  if (isMouseMoveEvent && !me.hasSpriteMouseMoveListeners()) {
    return;
  }
  sprite = me.hitTestEvent(e);
  if (isMouseMoveEvent && !Ext.Object.equals(sprite, lastSprite)) {
    if (lastSprite) {
      drawContainer.fireEvent('spritemouseout', lastSprite, e);
    }
    if (sprite) {
      drawContainer.fireEvent('spritemouseover', sprite, e);
    }
  }
  if (sprite) {
    drawContainer.fireEvent('sprite' + e.type, sprite, e);
  }
  me.lastSprite = sprite;
}});
Ext.define('Ext.chart.interactions.ItemInfo', {extend:'Ext.chart.interactions.Abstract', type:'iteminfo', alias:'interaction.iteminfo', config:{extjsGestures:{'start':{event:'click', handler:'onInfoGesture'}, 'move':{event:'mousemove', handler:'onInfoGesture'}, 'end':{event:'mouseleave', handler:'onInfoGesture'}}}, item:null, onInfoGesture:function(e, element) {
  var me = this, item = me.getItemForEvent(e), tooltip = item && item.series.tooltip;
  if (tooltip) {
    tooltip.onMouseMove.call(tooltip, e);
  }
  if (item !== me.item) {
    if (item) {
      item.series.showTip(item);
    } else {
      me.item.series.hideTip(me.item);
    }
    me.item = item;
  }
  return false;
}});
