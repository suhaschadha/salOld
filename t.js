var count = 0;
setInterval(SendTempratureData, 9000);
function SendTempratureData(){
count= count + 1;
console.log(count);
}
