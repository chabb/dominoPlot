d3.computeIntersections = function(maps,originalMapping)
{
  //http://stackoverflow.com/questions/26028124/the-intersection-of-all-combinations-of-n-sets
  var list = [], dominoMapping = {}, _i = 1, intersections = {}, elements = 0,
    numberOfSets = maps.keys().length;

  maps.forEach(function(k,v){
    dominoMapping[k] = _i++;
    for(var i=0;i<v.content.length;i++)
        list.push({set:k,element:v.content[i]});
    }),

  // create each intersections
  var limit = Math.pow(2,_i-1)
  for (var t=0;t<limit;t++) {
        intersections[t+''] = {
            elements:[],
            dominoRepresentation : computeDominoRepresentation(t),
            id:t
        };
    }

    var listA = d3.nest()
        .key(function(d) { return d.element })
        .map(list);

    elements = list.length;
    var keys = d3.keys(listA);
    for (var i=0;i<keys.length;i++) {
        var arrayOfSets = (listA[keys[i]]);
        var setId = computeIntersectionID(arrayOfSets);
        intersections[setId+''].elements.push(keys[i]);
    }
    return {
        intersections : intersections,
        distinctElements : elements,
        numberOfSets : numberOfSets,
        dominoMapping : dominoMapping,
        currentMapping : currentMapping
        numberOfDominos : limit
    }

    function computeIntersectionID(array) {
        var total = 0;
        for (var i=0;i<array.length;i++) {
            var mapping = dominoMapping[array[i].set];
            total = total + Math.pow(2,mapping-1);
        }
        return total;
    }
    function computeDominoRepresentation(setsId) {
        var domino = [];
        //console.log('Trying to compute',setsId,numberOfSets);
        for (var l=0;l<numberOfSets;l++) {
            id = (1 << l);
            var value =  id & setsId;
            var newValue = (value >> l);
            domino.push(newValue);
        }
        return domino;
    }
}
