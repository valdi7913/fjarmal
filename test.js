function getWeightedRandom(weights, values) {
    let rollingWeights = [weights[0]]
    let length = weights.length;
    for(let i = 1; i<length; i++) {
        rollingWeights.push(weights[i] + weights[i-1]); 
    }

    let rng = Math.random()
    for(let j = 0; j<lenght; j++) {
        if(rng < rollingWeights[j]) {
            return values[j]
        }
    }
    return values[length];
}


weights =[0.4,0.1,0.50]
points = [1,2,3]

random = getWeightedRandom(weights, points);
