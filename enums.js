module.exports.event = 
[
    {
        keywords:["kickout","kick out"],
        eventID:1,
        defaultOutcome:1,
        defaultTeam:0,
        statType:"kickout"
    },
    {
        keywords:["sideline","side line"],
        eventID:2,
        defaultOutcome:1,
        defaultTeam:1,
        statType:"shot"
    },
    {
        keywords:["sideline shot","side line shot"],
        eventID:3,
        defaultOutcome:1,
        defaultTeam:1,
        statType:"shot"
    },
    {
        keywords:["free shot"],
        eventID:5,
        defaultTeam:1,
        statType:"shot"
    },
    {
        keywords:["free"],
        eventID:4,
        defaultOutcome:1,
        defaultTeam:1
    },
    {
        keywords:["45 shot","forty-five shot","forty five shot","fortify shot"],
        eventID:7,
        defaultOutcome:1,
        defaultTeam:0,
        defaultPosition:12,
        statType:"shot"
    },
    {
        keywords:["45","forty-five","forty five","fortify"],
        eventID:6,
        defaultOutcome:1,
        defaultTeam:0,
        defaultPosition:12,
        statType:"shot"
    },
    {
        keywords:["kickpass","kick pass","kick past","kickpast", "capace", "keepass"],
        eventID:8,
        defaultOutcome:1,
        defaultTeam:0,
        statType:"pass"
    },
    {
        keywords:["handpass shot","hand pass shot","handpast shot","hand past shot"],
        eventID:11,
        defaultOutcome:1,
        defaultTeam:1,
        statType:"shot"
    },
    {
        keywords:["shot","shocked","shop"],
        eventID:9,
        defaultOutcome:1,
        defaultTeam:1,
        statType:"shot"
    },
    {
        keywords:["handpass","hand pass","handpast","hand past"],
        eventID:10,
        defaultOutcome:1,
        defaultTeam:0,
        statType:"pass"
    },
    {
        keywords:["advanced mark kick pass","advance mark kick past","advanced mark kick past","advanced mark kick past", "advanced mark capace", "advance mark capace"],
        eventID:13,
        defaultOutcome:1,
        defaultTeam:0
    },
    {
        keywords:["mark kick pass","mark kick past", "mark capace"],
        eventID:12,
        defaultOutcome:1,
        defaultTeam:0
    },
    {
        keywords:["advanced mark shot","advance mark shot"],
        eventID:14,
        defaultOutcome:1,
        defaultTeam:1,
        statType:"shot"
    },
    {
        keywords:["carry ball","curry bowl","caribou","carrie ball"],
        eventID:15,
        defaultOutcome:1,
        defaultTeam:0,
        statType:"carry"
    },
    {
        keywords:["start game"],
        eventID:21,
        defaultOutcome:1,
        defaultTeam:-1
    },
    {
        keywords:["throw in"],
        eventID:22,
        defaultOutcome:1,
        defaultTeam:-1
    },
    {
        keywords:["pause game"],
        eventID:23,
        defaultOutcome:1,
        defaultTeam:-1
    },
    {
        keywords:["stop game"],
        eventID:24,
        defaultOutcome:1,
        defaultTeam:-1
    },
    {
        keywords:["pass","past"],
        eventID:25,
        statType:"pass"
    }
];

module.exports.position = 
[
    {
        keywords:["short left"],
        positionID:1
    },
    {
        keywords:["short centre","short center"],
        positionID:2
    },
    {
        keywords:["short right"],
        positionID:3
    },
    {
        keywords:["mid left","mid-left"],
        positionID:4
    },
    {
        keywords:["mid centre","mid center","mid-center"],
        positionID:5
    },
    {
        keywords:["mid right","mid-right"],
        positionID:6
    },
    {
        keywords:["long left"],
        positionID:7
    },
    {
        keywords:["long centre","long center"],
        positionID:8
    },
    {
        keywords:["long right"],
        positionID:9
    },
    {
        keywords:["attack sixty-five","attack sixty five","attack 65"],
        positionID:10
    },
    {
        keywords:["attack forty-five","attack forty five","attack 45", "tap 45", "tap forty five", "tap forty-five"],
        positionID:11
    },
    {
        keywords:["attack twenty","attack 20", "tap twenty", "tap 20"],
        positionID:12
    }
];

moduel.exports.misc =
[
    {
        keywords:["ball", "bowl", "bawl", "paul"]
    },
    {
        keywords:["team","theme"]
    },
    {
        keyword:"player",
        regexs:[/player(?:$|\W)+[^(\s)]+/,/play(?:$|\W)+[^(\s)]+/,/prayer(?:$|\W)+[^(\s)]+/]
    }
]

module.exports.outcome =
[
    {
        keywords:["pass successful","past successful"],
        outcomeID:1,
        statType:"pass"
    },
    {
        keywords:["ball wide"],
        outcomeID:2,
        statType:"shot fail"
    },
    {
        keywords:["ball out side line","ball out sideline"],
        outcomeID:3,
        statType:"shot fail"
    },
    {
        keywords:["ball out forty five","ball out forty-five","ball out 45"],
        outcomeID:4,
        statType:"shot fail"
    },
    {
        keywords:["free"],
        outcomeID:5
    },
    {
        keywords:["free off ball","free of ball"],
        outcomeID:9
    },
    {
        keywords:["point"],
        outcomeID:6,
        statType:"score 1"
    },
    {
        keywords:["goal"],
        outcomeID:7,
        statType:"score 3"
    },
    {
        keywords:["turnover"],
        outcomeID:8,
        statType:"turnover"
    },
    {
        keywords:["mark"],
        outcomeID:10
    },
    {
        keywords:["advance mark","advanced mark"],
        outcomeID:11
    },
    {
        keywords:["won throw in"],
        outcomeID:12,
        statType:"take initiative"
    },
    {
        keywords:["throw in awarded","throw in award"],
        outcomeID:13
    },
    {
        keywrods:["save","saved"],
        outcomeID:14
    }
    
    
]