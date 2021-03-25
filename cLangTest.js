
var input = "blueball";
var compare = "blue ball";

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


    console.log( (input.includes(compare) || smithWatermanDistance >= 17 || jaroWinklerDistance >= 0.9)); 
