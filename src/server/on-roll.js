function onRoll (state){
    return function (data) {
        console.log(`user rolled a d${data.number} and got a ${data.result} `);
    }
}

module.exports = onRoll