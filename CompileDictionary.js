const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoDB = require('mongodb');
const uri = process.env.DB_CONNECT;
module.exports =
{
    
    dictionary:async function(req,res)
    {
        
        
            const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
            const dbo = db.db("TacTalk");
            res.setHeader('Content-Type', 'application/json');
            try
            {
                var keyword = req.query.keyword;

                var searchQuery = {keyword:keyword};

                var arr = [];
                await dbo.collection("dictionary").find(searchQuery).toArray(function(e,result){
                    arr = arr.concat(result);

                    for (var i = 0;i<arr.length;i++)
                    {
                        if (arr[i].text.length !== 0)
                        {
                            var sText = arr[i].text[0];
                            for (var j = 1; j < arr[i].text.length;j++)
                            {
                                sText+= " "+arr[i].text[j];
                            }
                            var parseResult = cp.compareLangX(sText,keyword);
                            arr[i].parseResult = parseResult;

                        }
                    }
                    res.end(JSON.stringify({code:200,result:arr}));
                    db.close();
                });

            }catch(ex)
            {
                res.end(JSON.stringify({code:500, error: ex.toString()}));
                db.close();
            }   


        
    },
    createDictionary :async function(req,res)
    {
        
        
            const db = await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
            const dbo = db.db("TacTalk");
            res.setHeader('Content-Type', 'application/json');
            try
            {

                
                var jsonObj = JSON.parse(req.query.package);
                console.log(jsonObj);

                var fullText = [];

                for (var i = 0;i < jsonObj.length; i++)
                {
                    console.log(jsonObj[i].text);
                    fullText.push(jsonObj[i].text);
                }

                var keyword = req.query.keyword;

                var uniqueNumber = req.query.uniqueNumber;

                var newDictionaryObject = 
                        {
                            keyword: keyword,
                            text: fullText,
                            unique_number: uniqueNumber
                        }

                await dbo.collection("dictionary").insertOne(newDictionaryObject, function(err){
                    if (err) return;
                    // Object inserted successfully.



                    res.end(JSON.stringify({code:200}));
                });

            }catch(ex)
            {
                console.log("eror");
                res.end(JSON.stringify({code:500,error:ex.toString()}));
            }
        
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