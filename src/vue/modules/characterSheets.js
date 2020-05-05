
const validDatumValueTypes = ['string', 'number']
const keyPrefix = 'k_'

class SheetDatum {
    constructor (name, value, config={}) {
        this.name = name
        this.value = value
        this.type = config.type && validDatumValueTypes.indexOf(config.type) !== -1  ? config.type : 'string'
        this.groupName = config.group || undefined
        this.group = false;

        if (this.type === 'number' && config.max) {
            this.max = config.max
        }
    }
    get keyName() {return keyPrefix + this.name}


    static getDisplaySuffix (serialisedDatum) {
        if (serialisedDatum.type === 'number' && serialisedDatum.max) {
            return ` / ${serialisedDatum.max}`
        }

        return ''
    }

}

class DataGroup {
    constructor (name, config ) {
        this.name = name
        this.label = config.label || name
        this.priority = config.priority || 0
    }
    get keyName() {return keyPrefix + this.name}
}

class CharacterSheet {
    constructor (sheetData = [], groups =[]) {
        this.groups = groups
        this.values = {}
        sheetData.forEach(sheetDatum => {
            this.addDatum(sheetDatum)
        })
    }
    get type() {return 'CharacterSheet'}

    addDatum( sheetDatum) {
        if (sheetDatum.groupName && this.groups.map(group => group.name).includes(sheetDatum.groupName)) {
            sheetDatum.group = this.groups.filter(group => group.name === sheetDatum.groupName)[0]
        }
        this.values[sheetDatum.keyName] = sheetDatum 
    }

    removeValue (keyName) {
        let validatedKeyName = keyName.startsWith(keyPrefix) ? keyName : keyPrefix + keyName
        if (this[validatedKeyName]) {this[validatedKeyName] === null}
    }

    getGroupData (groupName) {
        if (groupName) {
            if (!this.groups.filter(group => group.name === groupName)[0]) return false
        }

        const data = Object.keys(this.values)
        .filter(key => key.startsWith(keyPrefix))
        .map(key => this.values[key])
        .filter(datum => datum.groupName === groupName)

        return data
    }

    getGroupDisplay (groupName) {
        const groupData = this.getGroupData(groupName)
        if (!groupData) return {}

        return groupData.map (datum => { return { 
            name:datum.name, 
            value: datum.value + SheetDatum.getDisplaySuffix(datum) 
        }}) 
    }
}

CharacterSheet.Datum = SheetDatum 

export {CharacterSheet, SheetDatum, DataGroup}