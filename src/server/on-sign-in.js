
class Player {
    constructor (userName) {
        this.userName = userName;
    } 
    get type() {return 'PLAYER'}

    get clientSafeVersion () {
        return {
            type: this.type,
            userName: this.userName,
        }
    }
}

class Refusal {
    constructor (reason, details) {
        this.reason = reason
        this.details = details
    }

    get type() {return 'REFUSAL'}

    get message () {
        if (this.reason === 'NAME_ALREADY_TAKEN') {
            return `The name '${this.details}' is already in use.`
        }
        return this.reason
    }

    get clientSafeVersion () {
        return {
            type: this.type,
            message: this.message,
        }
    }
}

function onSignIn(state){
    return function (data, callback) {
        console.log(`user requested sign in with user name ${data.userName} `);
        
        if (state.users.map(item=>item.userName).indexOf (data.userName) > -1 ) {
            console.log('refusing: NAME_ALREADY_TAKEN')
            const refusal = new Refusal('NAME_ALREADY_TAKEN', data.userName)
            callback( refusal.clientSafeVersion )
            return false
        }
        
        console.log('adding player to state')
        const newPlayer = new Player(data.userName)
        state.users.push(newPlayer)
        console.log(state.users)
        callback(newPlayer.clientSafeVersion)
    }
}

module.exports = onSignIn