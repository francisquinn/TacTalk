function parseTextCommand(input)
{
    var commandSegments = [];
    var segmentBuilding = "";
//    for (var i = 0; i < input.length; i++)
//    {
//        if (input.charAt(i) !== " ")
//        {   
//            segmentBuilding += input.charAt(i);
//        }
//        
//        if (findMatchingSegment(segmentBuilding))
//        {
//            commandSegments.push(segmentBuilding);
//            segmentBuilding = "";
//        }
//    }

    var result = findMatchingSegment(input);
    
    console.log(result);
    
    for (var i = 0; i < commandSegments.length; i++)
    {
        console.log(commandSegments[i]);
    }

}

function findMatchingSegment(input)
{   
    var stringSimilarity = require('string-similarity');
    var segments = ["game start", "game end", "opposing team possesion","our team possesion","opposing team scores","our team scores", "our team free","opposing team free", "kick pass"];
    input.toLowerCase();
    
    var result = stringSimilarity.findBestMatch(input,segments);
    console.log(result);
    if (result.bestMatch.rating >= 0.8)
    {
        console.log("found matching: "+result.bestMatch.rating);
        return result;
    }
    else
    {
        console.log("denied: "+result.bestMatch.rating);
    }
    
    return null;
}

parseTextCommand("game starch");


