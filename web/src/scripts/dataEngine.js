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
    var table = buildStateTable(dominoMapping);

    var baseIntersectionsArray =  d3.values(intersections);
    var baseIntersections = intersections;

    var datas = {
        intersections : intersections,
        intersectionsArray: baseIntersectionsArray.slice(),
        distinctElements : elements,
        numberOfSets : numberOfSets,
        currentMapping : dominoMapping,
        currentInvertedMapping : invertedMapping,
        originalMapping : originalMapping ? originalMapping : dominoMapping,
        originalInvertedMapping : originalInvertedMapping,
        numberOfDominos : limit,
        stateTable : table,
        turnOnSet : turnOnSet,
        turnOffSet : turnOffSet
    }
    return datas;

    function turnOnSet(setName) {
        // we must find up the original and add it back to the datas


        datas.numberOfSets++;
        //datas.numberOfDominos = (newIntersections.length)

    }

    // all the stuff is too tied to our universe, try to make it more
    // independant
    function turnOffSet(setName) {
        // we must fund up the original and ad it back to the datas
        // First step computes which intersection have to merge
        console.log(setName,datas);
        var indexOfSet = datas.originalMapping[setName] - 1;
        var numberOfSets = datas.numberOfSets;
        var intersections = datas.intersectionsArray;
        console.log(intersections);
        var bitMask = 0;
        for (var i=0;i<numberOfSets;i++) {
            bitMask = bitMask +  ( i == indexOfSet ? 0 : Math.pow(2,i) )
        }
        var mergeMapping = []; // used for debugging purpose
        var originalIdToMergedId = [];     // index is the orignal Id, value is the destination Id

        console.log(bitMask.toString(2));
        for (var i=0;i<intersections.length;i++) {
            var originalId = intersections[i].id;
            var mergedId = intersections[i].id & bitMask;
            mergeMapping.push({
                originalId: originalId,
                mergedId: mergedId
            });
            if (originalId != mergedId) {
                originalIdToMergedId[originalId] = mergedId;
            }
        }
        // Second step merge intersections
        var numberOfIntersections = intersections.length;
        console.log(originalIdToMergedId);
        var newIntersections = [];
        for (var j=0;j<numberOfIntersections;j++) {
            console.log(j,numberOfIntersections);
            var interToMerge = intersections[j];

            if (originalIdToMergedId[j] >= 0 ) {
                console.log("merge",j,"into",originalIdToMergedId[j]);
                var targetIntersection = intersections[originalIdToMergedId[j]];
                for (var k = 0;k< interToMerge.elements.length;k++) {
                //
                    addElementToSet(targetIntersection.elements, interToMerge.elements[k])
                }
                newIntersections.push(targetIntersection);
                targetIntersection.id = remove_bit(targetIntersection.id,indexOfSet);
                targetIntersection.dominoRepresentation.splice(indexOfSet,1);
                interToMerge.elements = null;
            // we remove the merged intersection
                console.log('removing',j,targetIntersection)
            }

        }

        // remove all useless intersections

        datas.intersectionsArray = newIntersections;
        var map = {};
        for (var i=0; i<newIntersections.length;i++) {
            map[newIntersections[i].id]=newIntersections[i];
        }
        datas.numberOfSets--;
        datas.numberOfDominos = (newIntersections.length)
        datas.intersections = map;

        // Third step turn off inactive element
    }
    // set is currently just an array, but we plan to have some kind of representation
    function addElementToSet(set, element) {
        console.log('add to set',element)
        set.push(element);
    }

    // a little gem :)
    function remove_bit (x,n) { return x ^ (((x >> 1) ^ x) & (0xffffffff << n)); }

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

    function buildStateTable(mapping) {
        var table = {};
        var keys = d3.keys(mapping);
        for (var i=0;i<keys.length;i++) {
            table[keys[i]]= {
                active : true
            }
        }
        return table;
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

  // le filtrage devrait aussi se faire ici


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
  console.log('NA',newArray);
   return newArray
}


