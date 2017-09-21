var log = new XLog({mode: 'PROD'})
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

log.catch(test.start)()

log.log('this is show by log.log')
log.info('this is show by log.info')
log.warn('this is show by log.warn')
log.error('this is show by log.error')

log.add(0, 'this is a 0 by add')
log.add(1, 'this is a 1 by add')
log.add(2, 'this is a 2 by add')
log.add(3, 'this is a 3 by add')
log.add(4, 'this is a 4 by add')
log.add(5, 'this is a 5 by add')
log.add(6, 'this is a 6 by add')
log.add(7, 'this is a 7 by add')

setTimeout(function () { log.add(5, 'this is a info by async') }, 200)
log.catch(test.testError)('test show')
log.send()

//add try catch for all test2 function
log.catchModule(test2);
test2.testB()

test.start()