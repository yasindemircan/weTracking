const crypto = require('crypto');

const codeGenerator = len => {
    return new Promise((resolve, reject)=>{
        let data = crypto.randomBytes(len).toString('hex');
        data = data.toUpperCase();
        resolve(data);
    });
};

module.exports = codeGenerator;