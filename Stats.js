
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
            oppTeamWides:0,
            poessession:0,
            passCompletion:0,
            shotConversion:0,
            turnoverInOurHalf:0,
            kickoutsWon:0,
            zoneWithMostShots:0,
            zoneWithMostKickouts:0,
            poessesion:0
            
        }
        
        var zoneShots = [0,0,0,0,0,0,0,0,0,0,0,0];
        var zoneKickouts = [0,0,0,0,0,0,0,0,0,0,0,0];
        
        var completedPass = 0;
        
        for (var i = 0;i < json.possessions.length; i++)
        {
            var hasKickout = false;
            var hasTurnover = false;
            for (var j = 0; j < json.possessions[i].events.length; j++)
            {
                var event = json.possessions[i].events[j];
                
                if (getEventTypeById(event.event_type_id) === "kickout")
                {
                    hasKickout = true;
                }
                
                if (getOutcomeTypeByID(event.outcome_id === "turnover"))
                {
                    hasTurnover = true;
                }

                processEvent(event, statObject);
                
                processOutcome(event, statObject);                   
                
                if (getEventTypeById(event.event_type_id) === "pass" && getOutcomeTypeByID(event.outcome_id) != "turnover" && event.team_id == 0)
                {
                    completedPass++;
                }
                
                if (getEventTypeById(event.event_type_id) === "shot" && event.position_id !== -1 && event.team_id == 0)
                {
                    zoneShots[event.position_id-1]++;
                }
                
                if (getEventTypeById(event.event_type_id) === "kickout" && event.position_id !== -1 && event.team_id == 0)
                {
                    zoneKickouts[event.position_id-1]++;
                }
                
                
            }
            
            if (hasKickout && !hasTurnover)
            {
                statObject.kickoutsWon++;
            }
        }
        
        var maxIndex = -1;
        var maxValue = -1;
        
        for (var i = 0; i < zoneShots.length; i++)
        {
            if (zoneShots[i] > maxValue)
            {
                maxValue = zoneShots[i];
                maxIndex = i+1;
            }
        }
        
        statObject.zoneWithMostShots = maxIndex;
        
        maxIndex = -1;
        maxValue = -1;
        
        for (var i = 0; i < zoneKickouts.length; i++)
        {
            if (zoneKickouts[i] > maxValue)
            {
                maxValue = zoneKickouts[i];
                maxIndex = i+1;
            }
        }
        
        statObject.zoneWithMostKickouts = maxIndex;
        
        statObject.passCompletion = completedPass/statObject.teamPass
        
        statObject.shotConversion = (statObject.teamGoal/statObject.teamShot) * 100;
        
        statObject.poessesion = statObject.teamPass/(statObject.teamPass+statObject.oppTeamPass);
        
        
        
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
            if (enums.event[i].hasOwnProperty("statType"))
            {
                return enums.event[i].statType;
            }
            else
            {
                return "null";
            }
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
            if (enums.outcome[i].hasOwnProperty("statType"))
            {
                return enums.outcome[i].statType;
            }
            else
            {
                return "null";
            }
        }
    }
}

function processEvent(event, statObject)
{
    
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
    console.log("Stat "+event.outcome_id);
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
                statObject.teamGoal++;
            }
            else if (event.team_id === 1)
            {
                statObject.oppTeamGoal++;
            }
            break;
        case 7:
            if (event.team_id === 0)
            {
                statObject.teamPoints++;
            }
            else if (event.team_id === 1)
            {
                statObject.oppTeamPoints++;
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