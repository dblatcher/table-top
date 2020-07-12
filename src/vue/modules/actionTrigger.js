

class Action {
    constructor(config={}) {

        this.type = config.type || 'DICE_ROLL'
        this.data = config.data || {}
        this.toolTipContent = config.toolTipContent || false
    }
}


export {Action}