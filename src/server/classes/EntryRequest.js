const Refusal = require ('./Refusal')

class EntryRequest {
    constructor (game, player, callback, socket) {
        this.game = game;
        this.player = player;
        this.callback = callback
        this.requestTime = new Date();
        this.status = 'PENDING'
        this.socket = socket
    }
    get type() {return 'ENTRY_REQUEST'}

    grant() {
        this.status = 'GRANTED'
        this.player.joinSession(this.game, this.socket)
        this.callback(this.player.clientSafeVersion)
    }

    refuse() {
        this.status = 'REFUSED'
        this.callback(new Refusal('GM_REFUSED').clientSafeVersion)
    }

    get clientSafeVersion () {
        return {
            type: this.type,
            player: this.player.clientSafeVersion,
            requestTime: this.requestTime,
        }
    }
}

module.exports = EntryRequest