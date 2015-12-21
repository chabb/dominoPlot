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

    //var transientMapping = originalMapping;

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
        //var indexOfSet = datas.originalMapping[setName] - 1;
        // WE GOT TO CHECK IF SOME SETS WERE REMOVED AND UPDATE THE INDEX ACCORDINGLY !!!
        var indexOfSet = 0;
        $.each(datas.originalMapping,function(k,v) {
            if (k == setName) return false;
            if (table[k].active) indexOfSet++;
        })
        alert(indexOfSet);


        var addedSet = maps.get(setName);
        var numberOfSets = datas.numberOfSets;
        var intersections = datas.intersectionsArray;

        // First, we compute the id of the new intersections
        var spawnedIds = [];
        var newIntersections = [];
        console.log(setName,addedSet);
        datas.numberOfSets = datas.numberOfSets+1; // we do it now or we could not compute the domino representation
        for (var i=0;i<intersections.length;i++) {
            var id = intersections[i].id;
            var newId = insertBit(id, indexOfSet, 1);
            var oldId = insertBit(id, indexOfSet, 0);
            spawnedIds.push({
                idWithoutNewSet: newId,
                idWithNewSet: oldId
            });
            // we compute the common elements between the old intersection
            // and the new set. Common elements are pushed in the new Intersections
            var commons = computeElementsInCommon(addedSet.content,intersections[i].elements);
            var a = {
                id : newId,
                elements : commons.elementInCommon,
                dominoRepresentation : computeDominoRepresentation(newId)
            };
            var b = {
                id : oldId,
                elements : commons.elementNotInCommon,
                dominoRepresentation : computeDominoRepresentation(oldId)
            };
            newIntersections[a.id]=a;
            newIntersections[b.id]=b;
        }

        var map = {};
        console.log('ADD',newIntersections);
        for (var i=0; i<newIntersections.length;i++) {
            if (!newIntersections[i]) continue;
            map[newIntersections[i].id]=newIntersections[i];
        }

        datas.numberOfDominos = (newIntersections.length)
        datas.intersections = map
        datas.intersectionsArray = newIntersections;
        // add the set to the current view Mapping
        var newMapping = {};
        var newInvertedMapping = {};
        var delta = 0;
        $.each(datas.originalMapping,function(k,v){

            if (table[k].active) {
                newMapping[k] = v+delta;
                newInvertedMapping[v+delta] = k;
            } else {
                delta--;
            }
        });

        datas.currentMapping = newMapping;
        datas.currentInvertedMapping = newInvertedMapping;

    }

    // all the stuff is too tied to our universe, try to make it more
    // independant
    function turnOffSet(setName) {
        // we must fund up the original and ad it back to the datas
        // First step computes which intersection have to merge
        console.log(setName,datas);
        var indexOfSet = datas.currentMapping[setName] - 1;
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
        datas.numberOfSets = datas.numberOfSets-1;
        datas.numberOfDominos = (newIntersections.length)
        datas.intersections = map;


        // we compute the new view mappings
        var newMapping = {};
        var newInvertedMapping = {};
        var target = datas.originalMapping[setName];
        var delta = 0;
        $.each(datas.originalMapping,function(k,v){
            if (table[k].active) {
                newMapping[k] = v-delta;
                newInvertedMapping[v-delta] = k;
            } else {
                delta++;
            }

        });
        datas.currentMapping = newMapping;
        datas.currentInvertedMapping = newInvertedMapping;
    }

    // set is currently just an array, but we plan to have some kind of representation
    function addElementToSet(set, element) {
        console.log(set);
        if (set.indexOf(element) == -1) { set.push(element); }
    }

    // first array contains the element NOT in common
    // second array contains the element in common
    function computeElementsInCommon(setA,setB) {
        //setA = set to add
        //setB = set of the old intersection
        var elA = setB;
        var elB = setA;
        console.log(elA,elB);
        var histogram = {};
        var returnObject = {
            elementInCommon:[],
            elementNotInCommon:[]
        };

        //compute histogram
        for (var i=0;i<elA.length;i++) {
            histogram[elA[i]] = 1;
        }
        for (var j=0;j<elB.length;j++) {
            if (!histogram[elB[j]]) continue;
            histogram[elB[j]] = ++histogram[elB[j]];
        }
        $.each(histogram,function(k,v){
            if (v==1) {
                returnObject.elementNotInCommon.push(k);
            } else {
                returnObject.elementInCommon.push(k);
            }
        })
        return returnObject;
    }


    // a little gem :)
    function remove_bit (x,n) { return x ^ (((x >> 1) ^ x) & (0xffffffff << n)); }


    function insertBit(n,   // The integer we are going to insert into
                 position, // position is the position of the new bit to be inserted
                 new_bit) // whether the newly inserted bit is true or false
    {
        var x = n;
        var y = x;
        x <<= 1;
        if (new_bit)
            x |= (( 1) << position);
        else
            x &= ~(( 1) << position);
        x &= ((~( 0)) << position);
        y &= ~((~( 0)) << position);
        x |= y;
        return x;
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
        console.log('Trying to compute',setsId,numberOfSets,datas);
        if (datas) numberOfSets=datas.numberOfSets;
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
    var baseMAPPING = context.currentMapping; // name -> index of set
    var invertedResult = context.currentInvertedMapping;
    console.log('working on',datum,invertedResult,context);


    for (var i=0;i<baseArray.length;i++) {
        //var mappedSet= invertedBaseMAPPING[i+1];
        //var mappedIndex = result.dominoMapping[mappedSet]-1;
        var mappedSet = invertedResult[i+1]; // nom du set
        var mappedIndex =  i;
        console.log('working CIRCLE FOR',mappedSet,mappedIndex);
        newArray.push ({
            baseId: datum.id,
            hasCircle: baseArray[mappedIndex],
            set: mappedSet,
            compoundId: datum.id+invertedResult[i+1]
        });
    }
    console.log('working',newArray);

    return newArray
}


