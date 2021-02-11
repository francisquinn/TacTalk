module.exports =
{
    
    
    compileDictionary: function(kw)
    {
        var table = "<table>";       
        var tableSize = 100;
        
        for (var i = 0;i < kw.length; i++)
        {
            for (var j = 0;j<kw[i].dictionary.length;j++)
            {
                table += "<tr><td>"+kw[i].keywords[0]+"</td>";
                var result = compareLange(kw[i].keywords[0],kw[i].dictionary[j]);
                if (result.result)
                {
                    table += "<td style='color:green;'>"+kw[i].dictionary[j]+result.jw+result.sw+"</td>";
                }
                else
                {
                    table += "<td style='color:red;'>"+kw[i].dictionary[j]+result.jw+result.sw+"</td>";
                }
                table += "</tr>";
            }
            
            for (var k = 0;j<100-kw[i].dictionary.length;k++)
            {
                table += "<td></td>";
            }
            
        }
        
        table += "</table>";
        return table;
    }
    
}

function generateTable()
{
    
}

function compareLang(input, compare)
{
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


    return {result:(input.includes(compare) || smithWatermanDistance >= 17 || jaroWinklerDistance >= 0.9),jw:"("+jaroWinklerDistance+")",sw:"("+smithWatermanDistance+")"} 
}