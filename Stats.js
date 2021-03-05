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
            oppTeamGoal : 0,
            oppTeamPoints : 0,
            oppTeamShots : 0,
            oppTeamTurnover : 0
        }
        
        for (var i = 0;i < json.possessions.length; i++)
        {
            for (var j = 0; j < json.possessions[i].events.length; j++)
            {
                var event = json.possessions[i].events[j];
                if (getEventTypeById(event.eventID) === "shot")
                {
                    if (event.outcomeID === 6)
                            {
                                //point
                                if (event.teamID === 0)
                                {
                                    statObject.teamPoints++;
                                    statObject.teamShots++;
                                } else if (event.teamID === 1)
                                {
                                    statObject.oppTeamPoints++;
                                    statObject.oppTeamShots++;
                                }
                            } else if (event.outcomeID === 7)
                            {
                                //goal
                                if (event.teamID === 0)
                                {
                                    statObject.teamPoints += 3;
                                    statObject.teamShots++;
                                } else if (event.teamID === 1)
                                {
                                    statObject.oppTeamPoints += 3;
                                    statObject.oppTeamShots++;
                                }
                            }        
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