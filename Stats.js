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
            oppTeamTurnover : 0,
            oppTeamPass:0
        }
        
        console.log("I am called");
        
        for (var i = 0;i < json.possessions.length; i++)
        {
            console.log("looping possessions");
            for (var j = 0; j < json.possessions[i].events.length; j++)
            {
                
                console.log("looping events")
                var event = json.possessions[i].events[j];
                if (getEventTypeById(event.event_type_id) === "shot")
                {
                    processShotTypeEvent(event, statObject);
                }
                else if (getEventTypeById(event.event_type_id) === "kickout")
                {
                    processKickoutTypeEvent(event, statObject);
                    
                }
                
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

function processShotTypeEvent(event, statObject)
{
    if (event.outcome_id === 6)
                    {
                        //point
                        if (event.team_id === 0)
                        {
                            statObject.teamPoints++;
                            statObject.teamShots++;
                        } else if (event.team_id === 1)
                        {
                            statObject.oppTeamPoints++;
                            statObject.oppTeamShots++;
                        }
                    } else if (event.outcome_id === 7)
                    {
                        //goal
                        if (event.team_id === 0)
                        {
                            statObject.teamPoints += 3;
                            statObject.teamShots++;
                        } else if (event.team_id === 1)
                        {
                            statObject.oppTeamPoints += 3;
                            statObject.oppTeamShots++;
                        }
                    }
                    else if (getOutcomeTypeByID(event.outcome_id) === "shot fail")
                    {
                        //wide, shot fail
                        if (event.team_id === 0)
                        {
                            statObject.teamShots++;
                            statObject.teamWides++;
                        }
                        else if (event.team_id === 1)
                        {
                            statObject.oppTeamShots++;
                            statObject.oppTeamWides++;
                        }
                    }
                    else if (getOutcomeTypeByID(event.outcome_id) === "turnover")
                    {
                        //turnover
                        if (event.team_id === 0)
                        {
                            statObject.teamShots++;
                            statObject.teamTurnover++;
                        }
                        else if (event.team_id === 1)
                        {
                            statObject.oppTeamShots++;
                            statObject.oppTeamTurnover++;
                        }
                    }
}

function processKickoutTypeEvent(event, statObject)
{
   
        if (event.team_id === 0)
        {
            statObject.teamKickouts++;
        }
        else if (event.team_id === 1)
        {
            statObject.oppTeamKickouts++;
            
        }
    
}