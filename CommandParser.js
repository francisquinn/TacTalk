module.exports =
{
    
    parseCommand: function(input,time,previousEvent)
    {
        var ObjectID = require('mongodb').ObjectID;
        const wtn = require('words-to-numbers');
        const enums = require('./enums');
        const playerRegex = /player(?:$|\W)+[^(\s)]+/;

        var hasEvent = false;
        var hasPosition = false;
        var hasOutcome = false;

        input = input.toLowerCase();

        

        var newEvent =
                {
                    event_id: new ObjectID(),
                    time:time,
                    event_type_id:-1,
                    event_position_id:-1,
                    player_id:-1,
                    team_id:-1,
                    outcome_id:-1,
                    outcome_team_id:-1,
                    outcome_player_id:-1
                }

        if (input.includes("blue"))
        {
            newEvent.team_id = 0;
        }
        else if (input.includes("green"))
        {
            newEvent.team_id = 1;
        }


        if (input == "free")
        {
            newEvent.outcome_id = 5;
            input = "";
        }


        for (var i = 0;i < enums.event.length;i++)
        {
            for (var j = 0;j < enums.event[i].keywords.length; j++)
            {
                if (input.includes(enums.event[i].keywords[j]))
                {
                    newEvent.event_type_id = enums.event[i].eventID;
                    input.replace(enums.event[i].keywords[j],"");
                    hasEvent = true;
                    break;
                }
            }
        }

        for (var i = 0;i < enums.position.length;i++)
        {
            for (var j = 0;j < enums.position[i].keywords.length; j++)
            {
                if (input.includes(enums.position[i].keywords[j]))
                {
                    newEvent.event_position_id = enums.position[i].positionID;
                    input.replace(enums.position[i].keywords[j],"");
                    hasPosition = true;
                    break;
                }
            }
        }

        for (var i = 0;i < enums.outcome.length;i++)
        {
            for (var j = 0;j < enums.outcome[i].keywords.length; j++)
            {
                if (input.includes(enums.outcome[i].keywords[j]))
                {
                    newEvent.outcome_id = enums.outcome[i].outcomeID;
                    input.replace(enums.outcome[i].keywords[j],"");
                    hasOutcome = true;
                    break;
                }
            }
        }
        
        if (!hasOutcome)
        {
            for (var i = 0; i < enums.event.length; i++)
            {
                if (enums.event[i].eventID === newEvent.eventID)
                {
                    newEvent.outcome_id = enums.event[i].defaultOutcome;
                    break;
                }
            }
        }
        
        for (var i = 0; i < enums.event.length; i++)
        {
            if (enums.event[i].eventID === newEvent.eventID)
            {
                if (enums.event[i].hasOwnProperty("defaultTeam"))
                {
                    if (enums.event[i].defaultTeam === 1)
                    {
                        if (newEvent.teamID === 1)
                        {
                            newEvent.outcome_team_id = 0;
                        }
                        else
                        {
                            newEvent.outcome_team_id = 1;
                        }
                    }
                }
                break;
            }
        }
        
        if (!hasPosition)
        {
            for (var i = 0; i < enums.event.length; i++)
            {
                if (enums.event[i].eventID === newEvent.eventID)
                {
                    if (enums.event[i].hasOwnProperty("defaultPosition"))
                    {
                        newEvent.event_position_id = enums.event[i].defaultPosition;
                    }
                    break;
                }
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
            newEvent.player_id =  playerNum;
        }
        
        
        
        


        return newEvent;

    }
}