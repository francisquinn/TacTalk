module.exports =
{
    parseCommand: function(input,game)
    {
        var ObjectID = require('mongodb').ObjectID;
        const wtn = require('words-to-numbers');
        const enums = require('./enums');
        const playerRegex = /player(?:$|\W)+[^(\s)]+/;
        
        var teamColor = game.team_color;
        var oppTeamColor = game.opp_team_color;
 

        var hasEvent = false;
        var hasPosition = false;
        var hasOutcome = false;

        input = input.toLowerCase();

        if (compareLang(input,teamColor+" possession") || compareLang(input,teamColor+" team possession") || compareLang(input,teamColor+" ball"))
        {
            console.log("New P")
            return {result:1,team_id:0};
        }
        else if (compareLang(input,oppTeamColor+" possession") || compareLang(input,oppTeamColor+" team possession") || compareLang(input,oppTeamColor+" ball"))
        {
            console.log("New P")
            return {result:1,team_id:1};
        }


        if (input == "free")
        {
            return {result:1,outcome_id:5};
            input = "";
        }


        for (var i = 0;i < enums.event.length;i++)
        {
            for (var j = 0;j < enums.event[i].keywords.length; j++)
            {
                if (compareLang(input,enums.event[i].keywords[j]))
                {
                    return {event_type_id:enums.event[i].eventID};
                }
            }
        }

        for (var i = 0;i < enums.position.length;i++)
        {
            for (var j = 0;j < enums.position[i].keywords.length; j++)
            {
                if (compareLang(input,enums.position[i].keywords[j]))
                {
                    return {event_position_id:enums.position[i].positionID};
                }
            }
        }

        for (var i = 0;i < enums.outcome.length;i++)
        {
            for (var j = 0;j < enums.outcome[i].keywords.length; j++)
            {
                if (compareLang(input,enums.outcome[i].keywords[j]))
                {
                    return {outcome_id:enums.outcome[i].outcomeID}
                }
            }
        }
        
        var singlePlayerNumber = wtn.wordsToNumbers(input);
        if (singlePlayerNumber !== null)
        {
            if (singlePlayerNumber < 45)
            {
                return {player_id:singlePlayerNumber};
            }
        }

        var playerMatch = input.match(playerRegex);
        var playerText = "";

        if (playerMatch !== null)
        {
            if (Array.isArray(playerMatch))
            {
                playerText = playerMatch[0];
            }
            else
            {
                playerText = playerMatch;
            }
            playerText = wtn.wordsToNumbers(playerText.replace(/player(?:$|\W)/,""));

            var playerNum = parseInt(playerText);
            if (playerNum !== null)
            {
                return {player_id: playerNum};
            }
        }
        
        
        return null;

    }
    ,
    compareLangX: function(input, compare)
    {
        //node modules for natural language processing
        const natural = require('natural');
        const SWaligner = require('graphic-smith-waterman');
        const defaultAligner = SWaligner();

        const smithWatermanDistance = defaultAligner.align(input, compare);
        console.log(input+" + "+compare);
        const jaroWinklerDistance = natural.JaroWinklerDistance(input,compare);

            

        return {result:(input.includes(compare) || smithWatermanDistance >= 17 || jaroWinklerDistance >= 0.9),jw:jaroWinklerDistance,sw:smithWatermanDistance.score}; 
    }   
    
    
    
    
}

function compareLang(input, compare)
{
    //node modules for natural language processing
    const natural = require('natural');
        const SWaligner = require('graphic-smith-waterman');
        const defaultAligner = SWaligner();
        
        const smithWatermanDistance = defaultAligner.align(input, compare);
        const jaroWinklerDistance = natural.JaroWinklerDistance(input,compare);

        if ( (input.includes(compare) || smithWatermanDistance >= 17 || jaroWinklerDistance >= 0.9) )
        {
            console.log(input+"|||"+compare+"|Jaro:"+jaroWinklerDistance+"|Smith:"+smithWatermanDistance.score+"|inlcusion:"+input.includes(compare));
        }    


    return (input.includes(compare) || smithWatermanDistance >= 17 || jaroWinklerDistance >= 0.9) 
}    