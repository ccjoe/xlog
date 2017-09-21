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
        "use strict";

        //THE LEVEL OF LOG
        var LOG = {}
        /**
         * The LEVEL OF　THE　LOG
        * @readonly
        * @enum {number}
        */
        LOG.LEVEL = {
            0: 'EMERGENCY',  //system unusable
            1: 'ALERT',      //immediate action required
            2: 'CRITICAL',   //condition critical
            3: 'ERROR',      //condition error
            4: 'WARN',       //condition warning
            5: 'NOTICE',     //condition normal, but significant
            6: 'INFO',       //a purely informational message
            7: 'LOG'         // LOG or debugging information
        }

        LOG.LEVEL_UI = {
            0: '#0054a5',
            1: '#662e91',
            2: '#fef200',
            3: '#ed1b24',
            4: '#f36523',
            5: '#00adef',
            6: '#00a652',
            7: '#0054a5'
        }

        LOG.NAMES = {}
        for(var level in LOG.LEVEL){
            LOG.NAMES[LOG.LEVEL[level]] = level
        }

        LOG.MODE = {
            0: 'DEV',     //show in console
            1: 'PROD',    //NOT show in console
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
         * @param {number} [opt.level=3] - log level {@link LOG.LEVEL}
         * @param {string} [opt.mode='DEV'] - arguments object
         * @param {function} [opt.send=function(){}] - if u need to send log to remote, u need to define send function
         */
        function XLog(opt) {
            opt = opt || {}
            this.level =  opt.level || defaults.level     //
            this.mode = opt.mode || defaults.mode
            this.send = opt.send || defaults.send
            this.data = LOG.DATA
            this.init()
            this._onError()
        }

        function Errors(opt) {
            this.url = opt.url
            this.line = opt.line
            this.col = opt.col
            this.msg = opt.msg
            this.stack = opt.stack
        }

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
            return ["%c"+time+' '+type, "background-color: "+ LOG.LEVEL_UI[level]+";  border-radius:2px;"]
        }

        /**
         * init reset XLog data
         */
        XLog.prototype.init = function () {
            reset()
        }

        /**
         * 添加对应的日志
         * XLog#error
         * XLog#warn
         * XLog#info
         * XLog#log
         */
        LOG.REMAIN.forEach(function(type){
            XLog.prototype[type.toLowerCase()] = function(){
                this.add(LOG.NAMES[type], arguments)
            }
        })

        /**  Get the size of all local log */
        XLog.prototype.size = function () {
            return JSON.stringify(this.data).length
        }

        /**
         * add a log to log data
         *
         * @param {number} level - the level of log item
         * @param {any} loginfo
         */
        XLog.prototype.add = function (level, loginfo) {
            var time = new Date()
            var logPrefix = XLog.setPrefix(level)
            //假设这种模型就是参数
            if(!Array.isArray(loginfo) && typeof loginfo !== 'string' && loginfo.length){
                logPrefix = logPrefix.concat(toArray(loginfo))
            }else{
                logPrefix.push(loginfo)
            }
            logPrefix.time = time
            loginfo = logPrefix
            if(this.mode === 'DEV'){
                this._itemShow(level, loginfo)
            }
            this.data[LOG.LEVEL[level]].push(loginfo)
        }

        /**
         * Get the log data by `level`
         *
         * @param {number} level - the level of log item
         * @returns XLog.data
         */
        XLog.prototype.get = function (level) {
            return this.data[LOG.LEVEL[level]] || []
        }

        /**
         * set log level, just show log below level number
         * @param {number} level - the level of log item
         */
        XLog.prototype.set = function (level) {
            this.level = level
        }

        XLog.prototype._itemShow = function(level, loginfo,  only){
            if (!only ? level >= this.level : level === this.level) {
                var levelKey = LOG.LEVEL[level]
                var hasMatch = ~LOG.REMAIN.indexOf(levelKey)
                console[hasMatch ? levelKey.toLowerCase() : 'log'].apply(null, Array.isArray(loginfo) ? loginfo : [loginfo])
            }
        }

        /**
         * Show All XLogs 显示所有日志信息
         * @param {number} level - the level of log item
         * @param {object} opt
         * @param {string} [opt.sort='time'] time or type- show log by time sorted
         * @param {boolean} [opt.only=false]  just show level number only
         */
        XLog.prototype.show = function (level, opt) {
            opt = opt || {sort: 'time'}
            var that = this
            var sortTime = opt.sort === 'time'
            var timeArr = []
            level = level === void 0 ? this.level : level

            for (var infoKey in this.data) {
                var keyData = this.data[infoKey]
                var keyLevel = Number(LOG.NAMES[infoKey])
                if(sortTime){
                    timeArr = timeArr.concat(keyData)
                }else{
                    keyData.forEach(function (info) {
                        that._itemShow(keyLevel, info, opt.only)
                    })
                }
            }

            if(sortTime){
                timeArr.sort(function(item){return -(+item.time)}).forEach(function (info) {
                    that._itemShow(keyLevel, info, opt.only)
                })
            }

        }

        /**
         * @desc 重置所有日志内容
         * @param {number} level - the level of log item
         */
        XLog.prototype.reset = function (level) {
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
            return function () {
                try {
                    f.apply(this, arguments);
                } catch (e) {
                    that.add(3, new Errors({ msg: e.message, stack: e.stack }))
                }
            }
        }

        /**
         * decorate every function of module m with try catch wrapper
         * @param {object} m - module with functions
         */
        XLog.prototype.catchModule = function (m) {
        for(var i in m){
            if(typeof m[i] === 'function'){
                    m[i] =this.catch(m[i])
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