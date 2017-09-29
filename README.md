<a name="XLog"></a>

## XLog
_XLog_ is a log management by PROD or DEV,
- IN PROD Mode, just collect the log info, donot print in console
- IN DEV Mode, console info will be show real time
- IN CLOSE Mode, console will be not effected

## Feature
- log ui
- log level
- log group and sort by time
- log find and filter
- log show by real-time(DEV) or manual call at console(PROD)
- error catch auto

## Example
<img src="./example.png" alt="xlog example">

## Classes

<dl>
<dt><a href="#XLog">XLog</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#LOG">LOG</a></dt>
<dd><p>XLog - <a href="https://github.com/ccjoe/XLog">https://github.com/ccjoe/XLog</a></p>
</dd>
</dl>

<a name="XLog"></a>

## XLog
**Kind**: global class

* [XLog](#XLog)
    * [new XLog(opt)](#new_XLog_new)
    * _instance_
        * [.init()](#XLog+init)
        * [.size()](#XLog+size) ⇒ <code>obejct</code>
        * [.get(level)](#XLog+get) ⇒ <code>object</code>
        * [.set(level)](#XLog+set)
        * [.show(level, [sort])](#XLog+show)
        * [.find(str, level)](#XLog+find)
        * [.reset(level)](#XLog+reset)
        * [.catch(f)](#XLog+catch) ⇒ <code>function</code>
        * [.catchModule(m)](#XLog+catchModule)
    * _static_
        * [.LOG](#XLog.LOG) : <code>enum</code>

<a name="new_XLog_new"></a>

### new XLog(opt)

```js
eg: var xLog = new XLog(opt)
```

create a XLog instance


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| opt | <code>object</code> |  | arguments object |
| [opt.level] | <code>number</code> | <code>3</code> | log level [LOG.LEVEL](LOG.LEVEL) below level not show auto or manual, but set() to change LEVEL |
| [opt.mode] | <code>string</code> | <code>&quot;DEV&quot;</code> | 'CLOSE' OR 'DEV' OR 'PROD' [LOG.MODE](LOG.MODE) DEV mode show log realtime, PROD mode show log manual by sh
ow() method CLOSE will be all Xlog.js and error monitor |
| [opt.send] | <code>function</code> | <code>function(){}</code> | if u need to send log to remote, u need to define send function |

### Collection Log Data(pls see: run index.html or visit test.js)

```js

log.emergency('this is show by log.emergency')
log.alert('this is show by log.alert')
log.critical('this is show by log.critical')
log.error('this is show by log.error')
log.warn('this is show by log.warn')
log.notice('this is show by log.notice')
log.info('this is show by log.info')
log.log('this is show by log.log')

log.add(0, 'this is a 0 by log.add')
log.add(1, 'this is a 1 by log.add')
log.add(2, 'this is a 2 by log.add')
log.add(3, 'this is a 3 by log.add')
log.add(4, 'this is a 4 by log.add')
log.add(5, 'this is a 5 by log.add')
log.add(6, 'this is a 6 by log.add')
log.add(7, 'this is a 7 by log.add')

setTimeout(function () { log.add(5, 'this is a info by async') }, 200)
log.catch(test.testError)('test show')

//add try catch for all test2 modules function and test.start function
log.catchModule(test2);
log.catch(test.start)()
```


<a name="XLog+init"></a>

### xLog.init()
init reset XLog data

**Kind**: instance method of [<code>XLog</code>](#XLog)
<a name="XLog+size"></a>

### xLog.size() ⇒ <code>obejct</code>
Get the size of all local log

**Kind**: instance method of [<code>XLog</code>](#XLog)
**Returns**: <code>obejct</code> - - Object {len: 2827, byte: 2903, size: 2.8349609375}
<a name="XLog+get"></a>

### xLog.get(level) ⇒ <code>object</code>
Get the log data by `level`

**Kind**: instance method of [<code>XLog</code>](#XLog)
**Returns**: <code>object</code> - XLog.data

| Param | Type | Description |
| --- | --- | --- |
| level | <code>number</code> \| <code>string</code> | the level Number or Name String of log item |

<a name="XLog+set"></a>

### xLog.set(level)
set log level, just show log below level number

**Kind**: instance method of [<code>XLog</code>](#XLog)

| Param | Type | Description |
| --- | --- | --- |
| level | <code>number</code> \| <code>string</code> | the level Number or Name String of log item |

<a name="XLog+show"></a>

### xLog.show(level, [sort])
Show All XLogs 显示所有日志信息(受限不能大于XLOG.level), 传入level则显示level: 0~number, level name则仅显示name 对应的level

**Kind**: instance method of [<code>XLog</code>](#XLog)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| level | <code>number</code> \| <code>string</code> |  | the level Number or Name String of log item |
| [sort] | <code>string</code> | <code>&quot;&#x27;time&#x27;&quot;</code> | time or group- show log by time sorted |

**Example**
```js
XLOG.show()  print level 0~3 [this.level=3]
XLOG.show(0)  print level 0
XLOG.show(1)  print level 0-1
XLOG.show(n)  print level 0-n, n max is 7
XLOG.show('EMERGENCY') optional ['ALERT','CRITICAL','ERROR','WARN','NOTICE','INFO','LOG'] print corresponding level
```
<a name="XLog+find"></a>

### xLog.find(str, level)
Show and Print the log info by str or level

**Kind**: instance method of [<code>XLog</code>](#XLog)

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | find log by str, find log by console， level，stack info, etc... |
| level | <code>number</code> \| <code>string</code> | the level Number or Name String of log item find, if null no level limited |

<a name="XLog+reset"></a>

### xLog.reset(level)
reset log data 重置所有日志内容

**Kind**: instance method of [<code>XLog</code>](#XLog)

| Param | Type | Description |
| --- | --- | --- |
| level | <code>number</code> \| <code>string</code> | the level Number or Name String of log item |

<a name="XLog+catch"></a>

### xLog.catch(f) ⇒ <code>function</code>
decorate function f with try catch wrapper

**Kind**: instance method of [<code>XLog</code>](#XLog)
**Returns**: <code>function</code> - f - return try catch wrappered f

| Param | Type |
| --- | --- |
| f | <code>function</code> |

<a name="XLog+catchModule"></a>

### xLog.catchModule(m)
decorate every function of module m with try catch wrapper

**Kind**: instance method of [<code>XLog</code>](#XLog)

| Param | Type | Description |
| --- | --- | --- |
| m | <code>object</code> | module with functions |

<a name="XLog.LOG"></a>

### XLog.LOG : <code>enum</code>
XLog.LOG.LEVELHE LOG

**Kind**: static enum of [<code>XLog</code>](#XLog)
**Example**
```js
0: 'EMERGENCY',  //system unusable
1: 'ALERT',      //immediate action required
2: 'CRITICAL',   //condition critical
3: 'ERROR',      //condition error
4: 'WARN',       //condition warning
5: 'NOTICE',     //condition normal, but significant
6: 'INFO',       //a purely informational message
7: 'LOG'         // LOG or debugging information
```
<a name="LOG"></a>

## LOG
XLog - https://github.com/ccjoe/XLog

**Kind**: global variable

Licensed under the MIT license.