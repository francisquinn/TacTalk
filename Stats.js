module.exports =
{
    getCurrentStats: function(json)
    {
        var teamGoal = 0;
        var teamPoints = 0;
        var teamShots = 0;
        var teamKickouts = 0;
        var teamTurnover = 0;
        var teamWides = 0;
        var oppTeamGoal = 0;
        var oppTeamPoints = 0;
        var oppTeamShots = 0;
        var oppTeamTurnover = 0;
        
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
                                    teamPoints++;
                                    teamShots++;
                                } else if (event.teamID === 1)
                                {
                                    oppTeamPoints++;
                                    oppTeamShots++;
                                }
                            } else if (event.outcomeID === 7)
                            {
                                //goal
                                if (event.teamID === 0)
                                {
                                    teamPoints += 3;
                                    teamShots++;
                                } else if (event.teamID === 1)
                                {
                                    oppTeamPoints += 3;
                                    oppTeamShots++;
                                }
                            }        
                }        
                        
                
            }
        }
    },
    
    getEventTypeById: function(eventID)
    {
        const enums = require('./enums');
        for (var i = 0; i < enums.event.length; i++)
        {
            if (enums.event[i].eventID === eventID)
            {
                return enums.event[i].statType;
            }
        }
    },
    

}