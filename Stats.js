module.exports =
{
    getCurrentStats: function(json)
    {
        var statReaction =
        [
            {
                statType:"shot",
                field:["teamShots","oppTeamShots"]
            },
            {
                statType:"point",
                field:["teamPoints","oppTeamPoints"]
            },
            {
                statType:"goal",
                field:["teamGoals","oppTeamGoals"]
            },
            {
                statType:"turnover",
                field:["teamTurnover","oppTeamTurnover"]
            }
        ];
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
                
                for (var k = 0; k < statReaction.length; k++)
                {
                    if (statReaction[k].statType === this.getEventTypeById(event.event_type_id))
                    {
                        if (event.team_id === 0)
                        {
                            statObject[statReaction[k].field[0]] += 1;
                        }
                        else
                        {
                            statObject[statReaction[k].field[1]] += 1;
                        }
                    }
                    
                    if (statReaction[k].statType === this.getOutcomeTypeById(event.outcome_id))
                    {
                        if (event.team_id === 0)
                        {
                            statObject[statReaction[k].field[0]] += 1;
                        }
                        else
                        {
                            statObject[statReaction[k].field[1]] += 1;
                        }
                    }
                }
                        
                
            }
        }
        
        return statObject;
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
    getOutcomeTypeById: function(outcomeID)
    {
        const enums = require('./enums');
        for (var i = 0; i < enums.outcome.length; i++)
        {
            if (enums.event[i].outcomeID === outcomeID)
            {
                return enums.outcome[i].statType;
            }
        }
    }
    
    
    
    
    
    
    

}