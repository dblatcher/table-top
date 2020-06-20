import {CharacterSheet, SheetDatum, DataGroup, DerivedStat, FormulaExpression} from './characterSheets'

const blank = function() {return new CharacterSheet(
    [
        new SheetDatum('Action',"wait"),
        new SheetDatum('test_a',1,{type:'number'}),
        new SheetDatum('test_b',2,{type:'number'}),
        new DerivedStat( 'test_der', [
            new FormulaExpression('test_a',2),
            new FormulaExpression('test_b',1),
            new FormulaExpression(undefined,1),
        ],{})
    ],
    [

    ],
)}

const dungeons = function() {return new CharacterSheet(
    [
        new SheetDatum('HP',Math.floor(Math.random() * 20), {type : 'NUM_&_MAX', max:20}),
        new SheetDatum('Status',"normal"),
        new SheetDatum('Action',"wait"),
        new SheetDatum('Str',Math.floor(Math.random() * 6)+ Math.floor(Math.random() * 6)+6, {type : 'number', groupName:'attributes'} ),
        new SheetDatum('Dex',Math.floor(Math.random() * 6)+ Math.floor(Math.random() * 6)+6, {type : 'number', groupName:'attributes'} ),
        new SheetDatum('Con',Math.floor(Math.random() * 6)+ Math.floor(Math.random() * 6)+6, {type : 'number', groupName:'attributes'} ),
        new SheetDatum('Int',Math.floor(Math.random() * 6)+ Math.floor(Math.random() * 6)+6, {type : 'number', groupName:'attributes'} ),
        new SheetDatum('Wis',Math.floor(Math.random() * 6)+ Math.floor(Math.random() * 6)+6, {type : 'number', groupName:'attributes'} ),
        new SheetDatum('Chr',Math.floor(Math.random() * 6)+ Math.floor(Math.random() * 6)+6, {type : 'number', groupName:'attributes'} ),
        new SheetDatum('bluff','okay', {groupName:'skills'} ),
        new SheetDatum('repair','great', {groupName:'skills'} ),
        new SheetDatum('items', ['+1 mace', 'iron ration', 'blue key'], {type: 'list', groupName:'inventory'}),
        new SheetDatum('money', ['gold', 'copper',], {type: 'QUANTIFIED_LIST', quantity:[7,32], groupName:'inventory'}),
    ],[
        new DataGroup('attributes',{priority:1, layout: '2-col', label:"stats"}),
        new DataGroup('skills',{priority:0}),
        new DataGroup('inventory',{priority:0}),
    ]
)}


const wrathAndGlory = function() {

    const attributeSkillMap = {
        'S':['Athletics'],
        'T':[],
        'A':['Ballistic Skill','Pilot'],
        'I':['Weapon Skill'],
        'Wil':['Leadership','Psychic Mastery','Survival'],
        'Int':['Awareness','Medicae','Scholar','Stealth','Tech'],
        'Fel':['Cunning','Deception','Insight','Intimidation','Investigation','Persuation'],
    }

    const makeAttributeStat = (attribute) => new SheetDatum(attribute,1,{type:'number', groupName:'attributes'});
    const makeSkillStat = (skill) => new SheetDatum(skill,0,{type:'number', groupName:'skills'});
    const makeSkillPoolStat = (skill, attribute) => new DerivedStat(`${skill}(${attribute})`,[ new FormulaExpression(attribute,1), new FormulaExpression(skill,1)],{groupName:'skillsDice'});

    const skillPoolStats = [], attributeStats = [], skillStats = []


    Object.keys(attributeSkillMap).forEach(attribute => {
        attributeStats.push (makeAttributeStat(attribute))
        attributeSkillMap[attribute].forEach (skill => {
            skillStats.push(makeSkillStat(skill))
            skillPoolStats.push(makeSkillPoolStat(skill, attribute))
        })
    })

    skillStats.sort( (a,b) => a.name<b.name ? -1 : 1 )
    skillPoolStats.sort( (a,b) => a.name<b.name ? -1 : 1 )

    return new CharacterSheet(
    [
        new SheetDatum('Character Name',""),
        new SheetDatum('Faction',""),
        new SheetDatum('Rank',1,{type:Number}),
        new SheetDatum('Archetype',""),
    ].concat(
        ...skillPoolStats, ...attributeStats, ...skillStats
    ),[
        new DataGroup('skillsDice',{priority:1, layout: 'full-width', label:"Skills Dice Pools"}),
        new DataGroup('attributes',{priority:1, layout: '2-col', label:"Attributes"}),
        new DataGroup('skills',{priority:1, layout: 'full-width', label:"Skills", onlyDisplayNonEmpty:true}),
    ]
)}

export {blank, dungeons, wrathAndGlory}
