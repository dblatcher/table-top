
const validDatumValueTypes = ['string', 'number', 'list', 'QUANTIFIED_LIST', 'NUM_&_MAX']
const validGroupLayouts = ['2-col', 'full-width']
const keyPrefix = 'k_'

class SheetDatum {
    constructor (name, value, config={}) {
        this.name = name
        this.type = config.type && validDatumValueTypes.indexOf(config.type) !== -1  ? config.type : 'string'

        this.value = value || getDefaultValue(this.type)

        this.groupName = config.groupName || undefined
        this.group = false;

        if (this.type === 'NUM_&_MAX') {
            this.max = config.max || value
        }

        if (this.type === 'QUANTIFIED_LIST') {
            this.quantity = config.quantity || value.map(item => 1)
        }

        function getDefaultValue(type) {
            switch (type) {
                case 'string':
                return "?"
                case 'number':
                return 0
                case 'list':
                case 'QUANTIFIED_LIST':
                return []
            }
        }
    }
    get keyName() {return keyPrefix + this.name}

    get isListType() { return (this.type === 'list' || this.type === 'QUANTIFIED_LIST') }

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
        if (serialisedDatum.type === 'NUM_&_MAX') {
            return ` / ${serialisedDatum.max}`
        }
        return ''
    }

    static get validTypes () {
        return validDatumValueTypes
    }
}

class DataGroup {
    constructor (name, config ) {
        this.name = name
        this.label = typeof config.label !== 'undefined' ?  config.label : name
        this.priority = config.priority || 0
        this.layout = config.layout || '[default]'
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

    static get layoutOptions() {
        return  ['[default]'].concat(validGroupLayouts)
    } 
}

class CharacterSheet {
    constructor (sheetData = [], groups =[]) {
        this.groups = groups
        this.values = []
        sheetData.forEach(sheetDatum => {
            this.addDatum(sheetDatum)
        })
    }
    get type() {return 'CharacterSheet'}

    get valuesAsObject() {
        let output = {}
        this.values.forEach(datum => {output[datum.keyName] = datum})
        return output
    }

    addDatum( sheetDatum) {
        if (sheetDatum.groupName && this.groups.map(group => group.name).includes(sheetDatum.groupName)) {
            sheetDatum.group = this.groups.filter(group => group.name === sheetDatum.groupName)[0]
        }
        this.values.push (sheetDatum)
    }

    removeValue (keyName) {
        let validatedKeyName = keyName.startsWith(keyPrefix) ? keyName : keyPrefix + keyName
        const indexOfValue = this.values.map(value => value.keyName).indexOf(validatedKeyName)

        if (indexOfValue !== -1) {
            this.values.splice(indexOfValue,1)
        }
    }

    moveDatum (keyName,instruction) {
        const indexOfValue = this.values.map(value => value.keyName).indexOf(keyName)
        if (indexOfValue === -1) {return false}

        if (instruction.before) {
            const indexOfValueToGoBefore = this.values.map(value => value.keyName).indexOf(instruction.before)
            if (indexOfValueToGoBefore === -1) {return false}
            const movedDatumArray = this.values.splice(indexOfValue,1)
            this.values.splice(indexOfValueToGoBefore,0,movedDatumArray[0])
        }
    }

    getGroupData (groupName) {
        if (groupName) {
            if (!this.groups.filter(group => group.name === groupName)[0]) return false
        }

        const data = this.values
        .filter(datum => datum.groupName === groupName)

        return data
    }


    static groupedData (serialisedSheet) {
        let output = []
        if (serialisedSheet.values) {
            let ungroupedValues = []

            serialisedSheet.values.forEach (datum => {
                if (datum.groupName == undefined) {ungroupedValues.push(datum)}
            })

            if (ungroupedValues.length > 0) {
                output.push({group:undefined, values: ungroupedValues} )
            }
        }
        if (serialisedSheet.groups) {
            serialisedSheet.groups.forEach(group => {
                let values = []
                serialisedSheet.values.forEach (datum => {
                    if (datum.groupName == group.name) {values.push(datum)}
                })
                output.push ({group, values})
            })
        }
        return output
    }

    serialise () {
        let output = {
            groups: [],
            values: [],
        }
        this.groups.forEach(group => {output.groups.push(group.serialise())})
        this.values.forEach(value => {output.values.push(value.serialise())})
        return output
    }

    clone () {
        return CharacterSheet.deserialise(this.serialise())
    }

    toJson () {
        return JSON.stringify(this.serialise())
    }

    static deserialise (serialisedSheet) {
        const data   = serialisedSheet.values ? serialisedSheet.values.map(value => SheetDatum.deserialise(value) ) : []
        const groups = serialisedSheet.groups ? serialisedSheet.groups.map(group => DataGroup.deserialise(group) ) : []
        return new CharacterSheet( data , groups)
    }

}

CharacterSheet.Datum = SheetDatum 

export {CharacterSheet, SheetDatum, DataGroup}