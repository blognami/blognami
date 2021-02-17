
function benchmark(times, fn, ...args){
    const start = new Date().getTime()
    for(let i = 0; i < times; i++){
        fn(...args)
    }
    const end = new Date().getTime()

    console.log('benchmark', end - start);
} 
