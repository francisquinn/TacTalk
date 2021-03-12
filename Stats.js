
module.exports =
{
    getCurrentStats: function(json)
    {
        var statObject =
        {
            teamGoal : 0,
            teamPoints : 0,
            teamShots : 0,
            teamKickouts : 0,
            teamTurnover : 0,
            teamWides : 0,
            teamPass:0,
            oppTeamGoal : 0,
            oppTeamPoints : 0,
            oppTeamShots : 0,
            oppTeamKickouts:0,
            oppTeamTurnover : 0,
            oppTeamPass:0,
            oppTeamWides:0
        }
        
        
        for (var i = 0;i < json.possessions.length; i++)
        {
            for (var j = 0; j < json.possessions[i].events.length; j++)
            {
                
                var event = json.possessions[i].events[j];

                processEvent(event, statObject);
                
                processOutcome(event, statObject);
                    
                
                
            }
        }
        return statObject;
    }

}

function getEventTypeById(eventID)
{
    const enums = require('./enums');
    for (var i = 0; i < enums.event.length; i++)
    {
        if (enums.event[i].eventID === eventID)
        {
            return enums.event[i].statType;
        }
    }
}
    
function getOutcomeTypeByID(outcomeID)
{
    const enums = require('./enums');
    for (var i = 0; i < enums.outcome.length; i++)
    {
        if (enums.outcome[i].outcomeID === outcomeID)
        {
            return enums.outcome[i].statType;
        }
    }
}

function processEvent(event, statObject)
{
    console.log("Stat "+event.outcome_id);
    switch(getEventTypeById(event.event_type_id))
    {
        case "kickout":
            if (event.team_id === 0)
            {
                statObject.teamKickouts++;
            }
            else if (event.team_id === 1)
            {
                statObject.oppTeamKickouts++;
            }
            break;
        case "shot":
            if (event.team_id === 0)
            {
                statObject.teamShots++;
            }
            else if (event.team_id === 1)
            {
                statObject.oppTeamShots++;
            }
            break;
        case "handpass":
            if (event.team_id === 0)
            {
                statObject.teamPass++;
            }
            else if (event.team_id === 1)
            {
                statObject.oppTeamPass++;
            }
            break;
        default:
            break;
    }
}

function processOutcome(event, statObject)
{
    
    switch(event.outcome_id)
    {
        case 2:
        case 3:
        case 4:
            if (event.team_id === 0)
            {
                statObject.teamWides++;
            }
            else if (event.team_id === 1)
            {
                statObject.oppTeamWides++;
            }
            break;
        case 6:
            if (event.team_id === 0)
            {
                statObject.teamPoints++;
            }
            else if (event.team_id === 1)
            {
                statObject.oppTeamPoints++;
            }
            break;
        case 7:
            
            if (event.team_id === 0)
            {
                statObject.teamGoal++;
            }
            else if (event.team_id === 1)
            {
                statObject.oppTeamGoal++;
            }
            break;
        case 8:
            if (event.team_id === 0)
            {
                statObject.teamTurnover++;
            }
            else if (event.team_id === 1)
            {
                statObject.oppTeamTurnover++;
            }
            break;
        
    }
}