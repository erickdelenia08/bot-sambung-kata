let time;
await new Promise((res, rej) => {
    time=setTimeout(() => {
        console.log('bentar'); 
        res()
    }, 3000);
   
})
console.log('sudahh');
console.log(time);
clearTimeout(time)
console.log('sssetelah clear');
await new Promise((res, rej) => {
    time=setTimeout(() => {
        console.log('bentar  222'); 
        res()
    }, 3000);
   
})
console.log(time);
