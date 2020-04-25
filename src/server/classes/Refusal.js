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
        if (this.reason === 'ALREADY_PLAYING_ANOTHER_GAME') {
            return `You are already in abother game, called '${this.details.gameName}'. Please leave that game before entering another.`
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

module.exports = Refusal