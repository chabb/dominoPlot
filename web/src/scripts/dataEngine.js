d3.computeIntersections = function(maps,originalMapping)
{
  //http://stackoverflow.com/questions/26028124/the-intersection-of-all-combinations-of-n-sets
  var list = [], dominoMapping = {}, _i = 1, intersections = {}, elements = 0,
    numberOfSets = maps.keys().length;

    maps.forEach(function(k,v){
        dominoMapping[k] = _i++;
        for(var i=0;i<v.content.length;i++)
            list.push({set:k,element:v.content[i]});
    });
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

    var invertedMapping = computeInvertedDictionnary(dominoMapping);
    var originalInvertedMapping = computeInvertedDictionnary(originalMapping ? originalMapping : dominoMapping);


    return {
        intersections : intersections,
        intersectionsArray: d3.values(intersections),
        distinctElements : elements,
        numberOfSets : numberOfSets,
        currentMapping : dominoMapping,
        currentInvertedMapping : invertedMapping,
        originalMapping : originalMapping ? originalMapping : dominoMapping,
        originalInvertedMapping : originalInvertedMapping,
        numberOfDominos : limit
    }

    function computeInvertedDictionnary(map) {
        var invertedMap = {};
        var mapKeys = Object.keys(map);
        var invertedResult = {};
        for (var i=0;i<mapKeys.length;i++) {
            var key = mapKeys[i], value =  map[mapKeys[i]];
            invertedMap[value] = key;
        }
        return invertedMap;
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

function reprojectArray(datum, context) {

    var baseArray = datum.dominoRepresentation;
    var newArray = [];
    var baseMAPPING = context.originalMapping;
    var invertedResult = context.currentInvertedMapping;
     console.log('working on',datum,invertedResult,context);
  // comme on itere sur le tableau, chaque element correspond a un ensemble
  // ca devrait marcher car l'id est l'id d'une intersection donnée et ne change pas
  // MAIS l'element de l'intersection change

  // le mieux c'est de garder cette id, ca garde l'idee de "RAJOUT", et quand on rajoute un set
  // celui-ci vient se mettre automatiquement a la fing


  for (var i=0;i<baseArray.length;i++) {
    //var mappedSet= invertedBaseMAPPING[i+1];
    //var mappedIndex = result.dominoMapping[mappedSet]-1;
    var mappedSet = invertedResult[i+1];
    var mappedIndex =  baseMAPPING[mappedSet]-1;
    console.log('CHECKING CIRCLE FOR',mappedSet,mappedIndex);
    newArray.push ( {
      baseId: datum.id,
      hasCircle: baseArray[mappedIndex],
      set: mappedSet,
      compoundId: datum.id+invertedResult[i+1]
    })
  }
   return newArray
}


