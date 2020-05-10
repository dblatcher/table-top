
const validDatumValueTypes = ['string', 'number', 'list']
const keyPrefix = 'k_'

class SheetDatum {
    constructor (name, value, config={}) {
        this.name = name
        this.value = value
        this.type = config.type && validDatumValueTypes.indexOf(config.type) !== -1  ? config.type : 'string'
        this.groupName = config.groupName || undefined
        this.group = false;

        if (this.type === 'number' && config.max) {
            this.max = config.max
        }

        if (this.type === 'list' && config.quantity) {
            this.quantity = config.quantity
        }
    }
    get keyName() {return keyPrefix + this.name}

    serialise() {
        const keysToLeaveOut = ['group']
        let output = {}
        let keys = Object.keys(this).filter(key => keysToLeaveOut.indexOf(key) === -1)

        keys.forEach(key => output[key] = this[key])
        return output
    }

    static deserialise(serialisedDatum) {
        const datum =  new SheetDatum( serialisedDatum.name, serialisedDatum.value, serialisedDatum)
        return datum
    }

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
        this.label = typeof config.label !== 'undefined' ?  config.label : name
        this.priority = config.priority || 0
        this.layout = config.layout
        this.onlyDisplayNonEmpty = config.onlyDisplayNonEmpty
    }
    get keyName() {return keyPrefix + this.name}

    serialise() {
        let output = {}
        Object.keys(this).forEach(key => output[key] = this[key])
        return output
    }

    static deserialise(serialisedGroup) {
        const group =  new DataGroup( serialisedGroup.name, serialisedGroup )
        return group
    }
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

    static groupedData (serialisedSheet) {
        let output = []
        if (serialisedSheet.values) {
            let ungroupedValues = []
            for (const property in serialisedSheet.values) {
                if (serialisedSheet.values[property].groupName == undefined) {ungroupedValues.push(serialisedSheet.values[property])}
            }
            if (ungroupedValues.length > 0) {
                output.push({group:undefined, values: ungroupedValues} )
            }
        }
        if (serialisedSheet.groups) {
            serialisedSheet.groups.forEach(group => {
                let values = []
                for (const property in serialisedSheet.values) {
                    if (serialisedSheet.values[property].groupName == group.name) {values.push(serialisedSheet.values[property])}
                }
                output.push ({group, values})
            })
        }
        return output
    }

    serialise () {
        let output = {
            groups: [],
            values: {}
        }
        this.groups.forEach(group => {output.groups.push(group.serialise())})
        Object.keys (this.values).forEach(key => {output.values[key] = this.values[key].serialise()} )
        return output
    }

    toJson () {
        return JSON.stringify(this.serialise())
    }

    static deserialise (serialisedSheet) {
        const data = Object.keys(serialisedSheet.values).map(key => SheetDatum.deserialise(serialisedSheet.values[key]) )
        const groups = serialisedSheet.groups.map(group => DataGroup.deserialise(group) )
        return new CharacterSheet( data , groups)
    }

}

CharacterSheet.Datum = SheetDatum 

export {CharacterSheet, SheetDatum, DataGroup}