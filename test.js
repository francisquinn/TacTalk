var statObject = 
        {
    hello:null,
    world:0        
}

for (var prop in statObject) {
            if (Object.prototype.hasOwnProperty.call(statObject, prop)) {
                if (statObject[prop] === null)
                {
                    statObject[prop] = 0;
                }
            }
        }
        
        console.log(statObject)