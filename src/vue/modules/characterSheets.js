
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
            this.max = config.max || this.value
        }

        if (this.type === 'QUANTIFIED_LIST') {
            this.quantity = config.quantity || this.value.map(item => 1)
        }

        function getDefaultValue(type) {
            switch (type) {
                case 'string':
                return "?"
                case 'number':
                return 0
                case 'list':
                case 'QUANTIFIED_LIST':
                return ["?"]
            }
        }
    }

    get keyName() {return keyPrefix + this.name}
    get isDerived() {return false}
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

class DerivedStat {
    constructor (name, expressions, config) {
        this.name = name

        this.getSheetValues = function() {return undefined}
        this.groupName = config.groupName || undefined
        this.group = false;

        this.expressions = []
        expressions.forEach(formulaExpression => {
            this.addFormulaExpression(formulaExpression)
        })
    }

    get keyName() {return keyPrefix + this.name}
    get isDerived() {return true}

    get description() {
        let descriptionString = ""
        this.expressions.forEach(formulaExpression => {
            descriptionString += formulaExpression.description
        })
        if (descriptionString.startsWith('+')) {descriptionString = descriptionString.substr(1)}
        return descriptionString
    }

    get value () {
        const mySheetValues = this.getSheetValues()
        if (!mySheetValues) {return undefined}
        if (!this.expressions) { return 0 }

        let total = 0, index=0, value;
        for (index = 0; index < this.expressions.length; index++) {
            value = this.expressions[index].calculate(mySheetValues)
            if (typeof value !== 'number') {return "[ERROR]"}
            total += value
        }
        return total
    }

    get missingExpressionValues() {
        let output = []
        const mySheetValues = this.getSheetValues()
        this.expressions.forEach( formulaExpression => {
            if (!formulaExpression.datumName) {return}
            if (mySheetValues[keyPrefix + formulaExpression.datumName]) {return}
            output.push(formulaExpression.datumName)
        })
        return output
    }

    addFormulaExpression(formulaExpression) {
        this.expressions.push(formulaExpression)
    }

    removeFormulaExpression (formulaExpression) {
        const indexOfExpression = this.expressions.indexOf(formulaExpression)
        if (indexOfExpression !== -1) {
            this.expressions.splice(indexOfExpression,1)
        }
    }

    serialise() {
        const keysToLeaveOut = ['group', 'sheet', 'getSheetValues']
        let output = {isDerived:true}
        let keys = Object.keys(this).filter(key => keysToLeaveOut.indexOf(key) === -1)

        keys.forEach(key => output[key] = this[key])
        return output
    }

    static deserialise(serialisedStat) {
        const stat =  new DerivedStat( 
            serialisedStat.name,
            serialisedStat.expressions.map(serialisedExpression => new FormulaExpression(serialisedExpression.datumName, serialisedExpression.multiplier)), 
            serialisedStat
        )
        return stat
    }
}

class FormulaExpression {
    constructor (datumName, multiplier) {
        this.datumName = datumName || false
        this.multiplier = multiplier
    }

    calculate(sheetValues) {

        if (typeof this.multiplier !== 'number') {return undefined}
        if (!this.datumName) {return this.multiplier}
        if (!sheetValues[keyPrefix+this.datumName] ) {return undefined}

        const rawValue = sheetValues[keyPrefix+this.datumName].value
        const castValue = Number (rawValue)
        if ( isNaN(castValue)) { return undefined }

        return castValue * (this.multiplier)
    }

    evaluate(sheetValues) {
        if (typeof this.multiplier !== 'number') {return `[error - non numeric multiplier]`}
        if (!this.datumName) return `${Math.abs(this.multiplier)}`
        if (!sheetValues[keyPrefix+this.datumName]) return `[error - no ${this.datumName}]`
        const rawValue = sheetValues[keyPrefix+this.datumName].value
        const castValue = Number (rawValue)
        if ( isNaN(castValue)) { return `[error - ${this.datumName} is not a number]` }
        return `${Math.abs(this.multiplier)} x ${sheetValues[keyPrefix+this.datumName].value}`
    }

    get description() {
        if (this.multiplier == 0) {return '+ 0'}
        if (!this.datumName) {return `${this.multiplier >0 ? '+':'-'}${Math.abs(this.multiplier)}`}
        if (Math.abs(this.multiplier) == 1) {return `${this.multiplier >= 0 ? '+':'-'}${this.datumName}`}
        return `${this.multiplier >= 0 ? '+':'-'}(${Math.abs(this.multiplier)} x ${this.datumName})`
    }
}


class CharacterSheet {
    constructor (values = [], groups =[] ) {
        this.groups = groups
        this.values = []
        values.forEach(value => {
            this.addValue(value)
        })
    }
    get type() {return 'CharacterSheet'}

    get valuesAsObject() {
        let output = {}
        this.values.forEach(datum => {output[datum.keyName] = datum})
        return output
    }

    addValue(value) {
        if (value.isDerived) {return this.addDerivedStat(value)}
        return this.addDatum(value)
    }

    addDatum( sheetDatum) {
        if (sheetDatum.groupName && this.groups.map(group => group.name).includes(sheetDatum.groupName)) {
            sheetDatum.group = this.groups.filter(group => group.name === sheetDatum.groupName)[0]
        }
        this.values.push (sheetDatum)
    }

    addDerivedStat (derivedStat) {
        const sheet = this
        if (derivedStat.groupName && this.groups.map(group => group.name).includes(derivedStat.groupName)) {
            derivedStat.group = this.groups.filter(group => group.name === derivedStat.groupName)[0]
        }
        derivedStat.getSheetValues = function() {return sheet.valuesAsObject}
        this.values.push (derivedStat)
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
        return {
            groups: this.groups.map(group => group.serialise()),
            values: this.values.map(value => value.serialise()),
        }
    }

    clone () {
        return CharacterSheet.deserialise(this.serialise())
    }

    toJson () {
        return JSON.stringify(this.serialise())
    }

    static validateSerialisedSheet (serialisedSheet) {
        if (!serialisedSheet) {return false}
        if (typeof serialisedSheet !== 'object') {return false}
        if (Array.isArray(serialisedSheet)) {return false}
        if (serialisedSheet.values && !Array.isArray(serialisedSheet.values)) {return false}
        if (serialisedSheet.groups && !Array.isArray(serialisedSheet.groups)) {return false}

        let index
        if (serialisedSheet.values) {
            for (index = 0; index < serialisedSheet.values.length; index++) {
                if (serialisedSheet.values[index].isDerived) {
                    // test if is a valid serialised derived stat, if not return false
                } else {
                    // test if is a valid datum , if not return false
                }
            }
        }

        if (serialisedSheet.groups) {
            for (index = 0; index < serialisedSheet.groups.length; index++) {
                // test if is a valid serialised group stat, if not return false
            }
        }

        return true
    }

    static deserialise (serialisedSheet) {
        const data = serialisedSheet.values ? serialisedSheet.values.map(
            value => (value.isDerived || value.expressions ) ? DerivedStat.deserialise(value) : SheetDatum.deserialise(value) 
        ) : []
        const groups = serialisedSheet.groups ? serialisedSheet.groups.map(group => DataGroup.deserialise(group) ) : []
        return new CharacterSheet(data, groups)
    }

}

CharacterSheet.Datum = SheetDatum 

export {CharacterSheet, SheetDatum, DataGroup, DerivedStat, FormulaExpression}