let crypto = require('crypto');

const secret = 'abcdefg';
const hash = crypto.createHash('md5')
    .update('123456789')
    .digest('hex');
console.log(hash);
process.on('exit', function() {
    setTimeout(function() {
        console.log('This will not run');
    }, 100);
    console.log('Bye.');
});

process.on('start')