var log = new XLog({mode: 'DEV'})
var test = {
    testError: function (test) {
        var a;
        a.b = 10
    }
}

var test2 = {
    initVal: 0,
    testA: function(val){
        this.initVal = val || 'testA'
    },
    testB: function(){
        this.testA('testB')
        throw new Error('it a Error from xxx')
    }
}

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
log.send()

//add try catch for all test2 function
log.catchModule(test2);
test2.testB()

log.catch(test.start)()
test.start()
var a = {}
a.b[0] = 123