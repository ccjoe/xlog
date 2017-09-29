/**
* XLog - https://github.com/ccjoe/XLog
* @author ccjoe
* Copyright (c) 2017 Joe Liu
* Licensed under the MIT license.
*/
(function (root, f) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define(f);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = f();
    } else {
        root.XLog = f();
    }
}(this,
    function () {

        var LOG = {}
        LOG.LEVEL = ['EMERGENCY','ALERT','CRITICAL','ERROR','WARN','NOTICE','INFO','LOG']
        LOG.LEVEL_UI = {
            0: '#800156',
            1: '#ff0272',
            2: '#f38c03',
            3: '#ed1b24',
            4: '#f36523',
            5: '#00adef',
            6: '#00a652',
            7: '#0054a5'
        }

        LOG.NAMES = {}
        for(var level in LOG.LEVEL){
            LOG.NAMES[LOG.LEVEL[level]] = +level
        }

        LOG.MODE = {
            0: 'DEV',     //show in console
            1: 'PROD',    //NOT show in console
            2: 'CLOSE'    //close global try catch and remove onerror
        }
        //THE DATA OF LOG, attention: prodcution needs to
        LOG.DATA = {}
        LOG.REMAIN = ['ERROR', 'WARN', 'INFO', 'LOG']
        //clean log by level, level is null clean all level
        function reset(level) {
            if (LOG.LEVEL[level]) {
                LOG.DATA[LOG.LEVEL[level]] = []
            }

            if (level === void 0) {
                '01234567'.split('').forEach(function (levelNo) {
                    LOG.DATA[LOG.LEVEL[levelNo]] = []
                })
            }
            return LOG.DATA
        }

        function toArray(arrayLike) {
            return Array.prototype.slice.call(arrayLike);
        }

        var defaults = {
            level: 3,
            mode:  LOG.MODE[0],
            send: function(){}
        }

        /**
         * create a XLog instance
         * @constructor
         * @param {object} opt - arguments object
         * @param {number} [opt.level=3] - log level {@link LOG.LEVEL} below level not show auto or manual, but set() to change LEVEL
         * @param {string} [opt.mode=DEV] - 'CLOSE' OR 'DEV' OR 'PROD' {@link LOG.MODE}
         * DEV mode show log realtime,
         * PROD mode show log manual by show() method
         * CLOSE will be all Xlog.js and error monitor
         * @param {function} [opt.send=function(){}] - if u need to send log to remote, u need to define send function
         */
        function XLog(opt) {
            opt = opt || {}
            this.level =  opt.level || defaults.level     //
            this.mode = opt.mode || defaults.mode
            this.send = opt.send || defaults.send
            this.close = this.mode === LOG.MODE[2]
            this.data = LOG.DATA
            this.init()
            if(!this.close){
                this._onError()
            }
        }

        function Errors(opt) {
            this.url = opt.url
            this.line = opt.line
            this.col = opt.col
            this.msg = opt.msg
            this.stack = opt.stack
        }
        /**
         * THE LEVEL OF THE LOG
         * XLog.LOG.LEVEL
         * @enum {number}
         * @example
0: 'EMERGENCY',  //system unusable
1: 'ALERT',      //immediate action required
2: 'CRITICAL',   //condition critical
3: 'ERROR',      //condition error
4: 'WARN',       //condition warning
5: 'NOTICE',     //condition normal, but significant
6: 'INFO',       //a purely informational message
7: 'LOG'         // LOG or debugging information
        */
        XLog.LOG = LOG
        /**
         * @private
         * @param {number} level - the level of log item
         * @returns {array} prefix string by console format
         */
        XLog.setPrefix = function(level){
            var now = new Date()
            var time = '['+now.toLocaleTimeString()+ ' ' + now.getMilliseconds() + ']'
            var type = LOG.LEVEL[level]
            return ["%c"+time+' '+type, "background-color: "+ LOG.LEVEL_UI[level]+";  border-radius:2px; padding: 0 2px;"]
        }

        /**
         * init reset XLog data
         */
        XLog.prototype.init = function () {
            reset()
        }

        /**
         * 添加对应的日志
         * @method XLog#error console.error
         * @method XLog#warn console.error
         * @method XLog#info console.info
         * @method XLog#log console.log
         */
        LOG.LEVEL.forEach(function(type){
            XLog.prototype[type.toLowerCase()] = function(){
                this.add(LOG.NAMES[type], arguments)
            }
        })

        /**
         * Get the size of all local log
         * @return {obejct} - Object {len: 2827, byte: 2903, size: 2.8349609375}
         */
        XLog.prototype.size = function () {
            var str = JSON.stringify(this.data)
            var byte = encodeURI(str).split(/%..|./).length - 1
            return {
                len: str.length,
                byte: byte, //utf-8 characters 3 bytes
                size: byte/1024 //kb
            }
        }

        /**
         * add a log to log data
         * @param {number} level - the level of log item
         * @param {any} loginfo
         */
        XLog.prototype.add = function (level, loginfo) {
            if(this.close) return
            var time = new Date()
            var logPrefix = XLog.setPrefix(level)
            //假设这种模型就是参数
            if(!Array.isArray(loginfo) && typeof loginfo !== 'string' && loginfo.length){
                logPrefix = logPrefix.concat(toArray(loginfo))
            }else{
                logPrefix.push(loginfo)
            }
            logPrefix.time = time
            logPrefix.level = level
            loginfo = logPrefix
            if(this.mode === 'DEV'){
                this._itemShow(loginfo)
            }
            this.data[LOG.LEVEL[level]].push(loginfo)
        }

        /**
         * Get the log data by `level`
         * @param {number|string} level - the level Number or Name String of log item
         * @returns  {object} XLog.data
         */
        XLog.prototype.get = function (level) {
            level = typeof level === 'number' ? LOG.LEVEL[level] : level
            return this.data[level] || []
        }

        /**
         * set log level, just show log below level number
         * @param {number|string} level - the level Number or Name String of log item
         */
        XLog.prototype.set = function (level) {
            level = typeof level === 'number' ? level : LOG.NAMES[level]
            this.level = level
        }

        XLog.prototype._itemShow = function(loginfo){
            var level = loginfo.level
            // if (!limit || (limit && (level <= this.level))) { }
            var levelKey = LOG.LEVEL[level]
            var hasMatch = ~LOG.REMAIN.indexOf(levelKey)
            console[hasMatch ? levelKey.toLowerCase() : 'log'].apply(null, Array.isArray(loginfo) ? loginfo : [loginfo])

        }

        /**
         * Show All XLogs 显示所有日志信息(受限不能大于XLOG.level), 传入level则显示level: 0~number, level name则仅显示name 对应的level
         * @param {number|string} level - the level Number or Name String of log item
         * @param {string} [sort='time'] time or group- show log by time sorted
         * @example
         * XLOG.show()  print level 0~3 [this.level=3]
         * XLOG.show(0)  print level 0
         * XLOG.show(1)  print level 0-1
         * XLOG.show(n)  print level 0-n, n max is 7
         * XLOG.show('EMERGENCY') optional ['ALERT','CRITICAL','ERROR','WARN','NOTICE','INFO','LOG'] print corresponding level
         */
        XLog.prototype.show = function (level, sort) {
            sort = sort || 'time'
            level = level===void 0 ? this.level : level

            var that = this
            var sortTime = sort === 'time'
            var timeArr = []

            if(typeof level !== 'number'){
                this.find(null, LOG.NAMES[level])
                return
            }

            for (var infoKey in this.data) {
                var keyData = this.data[infoKey]
                var keyLevel = Number(LOG.NAMES[infoKey])
                if(keyLevel <= level){
                    if(sortTime){
                        timeArr = timeArr.concat(keyData)
                    }else{
                        keyData.forEach(function (info) {
                            that._itemShow(info)
                        })
                    }
                }
            }

            if(sortTime){
                 timeArr.sort(function(i1, i2){ return i1.time > i2.time}).forEach(function (info) {
                    that._itemShow(info)
                })
            }
        }

       /**
         * Show and Print the log info by str or level
         * @param {string} str - find log by str, find log by console， level，stack info, etc...
         * @param {number|string} level - the level Number or Name String of log item find, if null no level limited
         */
        XLog.prototype.find = function (str, level) {
            level = typeof level === 'number' ? LOG.LEVEL[level] : level
            var that = this

            var filterShow = function(levelData){
                return levelData.filter(function(levelItem){
                    if(!str){
                        that._itemShow(levelItem)
                        return true
                    }

                    var show = levelItem.filter(function(item, index){
                        //1 is console style
                        if(index!==1 && item){
                            if(typeof item==='string')
                                return !!~item.indexOf(str)
                            else
                                return (item.msg && !!~item.msg.indexOf(str)) || (item.stack && !!~item.stack.indexOf(str))
                        }
                    }).length ? true : false
                    show && that._itemShow(levelItem)

                    return show
                })
            }

            var filteredData = {}
            if(level){
                var data = this.data[level] || []
                filteredData[level] = filterShow(data)
            }else{
                for(var key in this.data){
                    filteredData[key] = filterShow(this.data[key])
                }
            }
            // return filteredData
        }

        /**
         * @desc reset log data 重置所有日志内容
         * @param {number|string} level - the level Number or Name String of log item
         */
        XLog.prototype.reset = function (level) {
            level = typeof level === 'number' ? level : LOG.NAMES[level]
            reset(level)
        }

        /**
         * decorate function f with try catch wrapper
         *
         * @param {function} f
         * @returns {function} f - return try catch wrappered f
         */
        XLog.prototype.catch = function (f) {
            var that = this
            return this.close ? f : function () {
                try {
                   return f.apply(this, arguments);
                } catch (e) {
                    that.add(3, new Errors({ msg: e.message, stack: e.stack }))
                    throw e; // re-throw the error
                }
            }
        }

        /**
         * decorate every function of module m with try catch wrapper
         * @param {object} m - module with functions
         */
        XLog.prototype.catchModule = function (m) {
            if(!this.close){
                for(var i in m){
                    if(typeof m[i] === 'function'){
                            m[i] =this.catch(m[i])
                    }
                }
            }
        }


        XLog.prototype._onError = function () {
            var that = this;
            window.onerror = function (msg, url, line, col, error) {
                if (msg != "Script error." && !url) {
                    return true;
                }
                //@todo window.onerror 在离开页面时会执行？ 异步事件去执行避免这种捕获
                setTimeout(function () {
                    col = col || (window.event && window.event.errorCharacter) || 0; //浏览器col参数
                    var errors = new Errors({
                        url: url,
                        line: line,
                        col: col
                    })
                    if (!!error && !!error.stack) {
                        //如果浏览器有堆栈信息 直接使用
                        errors.msg = error.stack.toString();
                    } else if (!!arguments.callee) {
                        //尝试通过callee拿堆栈信息
                        var ext = [];
                        var f = arguments.callee.caller, c = 3;
                        //这里只拿三层堆栈信息
                        while (f && (--c > 0)) {
                            ext.push(f.toString());
                            if (f === f.caller) {
                                break;//如果有环
                            }
                            f = f.caller;
                        }
                        ext = ext.join(",");
                        errors.msg = ext;
                    }
                    that.add(3, errors)
                }, 0);

                return true;
            };
        }
        return XLog
    }
));