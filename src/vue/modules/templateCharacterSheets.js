import {CharacterSheet, SheetDatum, DataGroup, DerivedStat} from './characterSheets'

const blank = function() {return new CharacterSheet(
    [
        new SheetDatum('Action',"wait"),
        new SheetDatum('test_a',1,{type:'number'}),
        new SheetDatum('test_b',2,{type:'number'}),
        new DerivedStat( 'test_2a+b+1', {
            sum: [{datumName:'test_a', multiplier:2}, {datumName:'test_b'},1 ]
        },{})
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

const wrathAndGlory = function() {return new CharacterSheet(
    [
        new SheetDatum('Character Name',""),
        new SheetDatum('Faction',""),
        new SheetDatum('Rank',1,{type:Number}),
        new SheetDatum('Archetype',""),
        new SheetDatum('S',1,{type:'number', groupName:'attributes'}),
        new SheetDatum('T',1,{type:'number', groupName:'attributes'}),
        new SheetDatum('A',1,{type:'number', groupName:'attributes'}),
        new SheetDatum('I',1,{type:'number', groupName:'attributes'}),
        new SheetDatum('Wil',1,{type:'number', groupName:'attributes'}),
        new SheetDatum('Int',1,{type:'number', groupName:'attributes'}),
        new SheetDatum('Fel',1,{type:'number', groupName:'attributes'}),
        new SheetDatum('Athletics(s)',0,{type:'number', groupName:'skills'}),
        new SheetDatum('Awareness(Int)',0,{type:'number', groupName:'skills'}),
        new SheetDatum('Ballistic Skill(A)',0,{type:'number', groupName:'skills'}),
        new SheetDatum('Cunning(Fel)',0,{type:'number', groupName:'skills'}),
        new SheetDatum('Deception(Fel)',0,{type:'number', groupName:'skills'}),
        new SheetDatum('Insight(Fel)',0,{type:'number', groupName:'skills'}),
        new SheetDatum('Intimidation(Fel)',0,{type:'number', groupName:'skills'}),
        new SheetDatum('Investigation(Fel)',0,{type:'number', groupName:'skills'}),
        new SheetDatum('Leadership(Wil)',0,{type:'number', groupName:'skills'}),
        new SheetDatum('Medicae(Int)',0,{type:'number', groupName:'skills'}),
        new SheetDatum('Persuation(Fel)',0,{type:'number', groupName:'skills'}),
        new SheetDatum('Pilot(A)',0,{type:'number', groupName:'skills'}),
        new SheetDatum('Psychic Mastery(Wil)',0,{type:'number', groupName:'skills'}),
        new SheetDatum('Scholar(Int)',0,{type:'number', groupName:'skills'}),
        new SheetDatum('Stealth(Int)',0,{type:'number', groupName:'skills'}),
        new SheetDatum('Survival(Will)',0,{type:'number', groupName:'skills'}),
        new SheetDatum('Tech(Int)',0,{type:'number', groupName:'skills'}),
        new SheetDatum('Weapon Skill(I)',0,{type:'number', groupName:'skills'}),
    ],[
        new DataGroup('attributes',{priority:1, layout: '2-col', label:"Attributes"}),
        new DataGroup('skills',{priority:1, layout: 'full-width', label:"Skills", onlyDisplayNonEmpty:true}),
    ]
)}

export {blank, dungeons, wrathAndGlory}
