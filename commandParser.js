module.exports =
{
    parseCommand: function(input,time,previousEvent)
    {
        const wtn = require('words-to-numbers');
        const enums = require('./enums');
        const playerRegex = /player(?:$|\W)+[^(\s)]+/;

        var hasEvent = false;
        var hasPosition = false;
        var hasOutcome = false;

        input = input.toLowerCase();

        

        var newEvent =
                {
                    eventID:-1,
                    time:time,
                    eventTypeID:-1,
                    eventPositionID:-1,
                    playerID:-1,
                    teamID:-1,
                    outcomeID:-1,
                    outcomeTeamID:-1,
                    outcomePlayerID:-1
                }

        if (input.includes("blue"))
        {
            newEvent.teamID = 0;
        }
        else if (input.includes("green"))
        {
            newEvent.teamID = 1;
        }


        if (input == "free")
        {
            newEvent.outcomeID = 5;
            input = "";
        }


        for (var i = 0;i < enums.event.length;i++)
        {
            for (var j = 0;j < enums.event[i].keywords.length; j++)
            {
                if (input.includes(enums.event[i].keywords[j]))
                {
                    newEvent.eventTypeID = enums.event[i].eventID;
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
                    newEvent.eventPositionID = enums.position[i].positionID;
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
                    newEvent.outcomeID = enums.outcome[i].outcomeID;
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
                    newEvent.outcomeID = enums.event[i].defaultOutcome;
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
                            newEvent.outcomeTeamID = 0;
                        }
                        else
                        {
                            newEvent.outcomeTeamID = 1;
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
                        newEvent.eventPositionID = enums.event[i].defaultPosition;
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
            newEvent.playerID =  playerNum;
        }
        
        
        
        


        return newEvent;

    }
}