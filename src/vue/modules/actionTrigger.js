

class Action {
    constructor(config={}) {
        this.type = config.type || 'DICE_ROLL'
        this.customMessageTemplate = config.customMessageTemplate
        this.data = config.data || {}
        this.toolTipContent = config.toolTipContent || false
    }

    getCustomMessage(datum) {
        const {customMessageTemplate} = this
        if (!customMessageTemplate || !datum) {return ""}

        const wildCards = customMessageTemplate.match(/{{\w*}}/g)

        let output =customMessageTemplate
        wildCards.forEach(wildCard => {
            let propName = wildCard.replace("{{","").replace("}}","")
            let content = (datum[propName] && datum[propName].toString) ? datum[propName].toString() : "??"
            output = output.replace(wildCard, content)
        })
        return output
    }
}


export {Action}