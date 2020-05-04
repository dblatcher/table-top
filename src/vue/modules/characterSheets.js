
const validDatumValueTypes = ['string', 'number']
const keyPrefix = 'k_'

class SheetDatum {
    constructor (name, value, config={}) {
        this.name = name
        this.value = value
        this.type = config.type && validDatumValueTypes.indexOf(config.type) !== -1  ? config.type : 'string'

        if (this.type === 'number' && config.max) {
            this.max = config.max
        }
    }
    get keyName() {return keyPrefix + this.name}

    static getDisplayValue (serialisedDatum) {

        if (serialisedDatum.type === 'number' && serialisedDatum.max) {
            return `${serialisedDatum.value} / ${serialisedDatum.max}`
        }

        return `${serialisedDatum.value ? serialisedDatum.value : '??'}`
    }

}

class CharacterSheet {
    constructor (sheetData = []) {
        sheetData.forEach(sheetDatum => {
            console.log(sheetDatum.keyName, sheetDatum)
            this[sheetDatum.keyName] = sheetDatum 
        })
    }
    get type() {return 'CharacterSheet'}

    addDatum( sheetDatum) {
        this[sheetDatum.keyName] = sheetDatum 
    }

    removeValue (keyName) {
        let validatedKeyName = keyName.startsWith(keyPrefix) ? keyName : keyPrefix + keyName
        if (this[validatedKeyName]) {this[validatedKeyName] === null}
    }
}

CharacterSheet.Datum = SheetDatum 

export {CharacterSheet, SheetDatum}