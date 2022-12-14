import { nodeStartId, nodeEndId} from "./boardCreation.js";
import { adjList, setRuntime, precison, speed} from "./main.js";
import { animEnd, setanimEnd } from "./DijkstraAlgo.js";
var finalPath;
var intervalId;
var visitNodes; //to preserve the order
var nodesList;


export function floydAlgo() {
    nodesList = Array.from(document.getElementById('Grid').childNodes, x => x)
    let runTime = performance.now();
    visitNodes = [];
    finalPath = [];
    let startN = document.querySelector('[data-node = "Start"]');
    let endN = document.querySelector('[data-node = "End"]');

    let vNum = nodesList.length;
    //these variables must be assigned in order to allow the function to be repeatable.
    var dist = Array.from(Array(vNum), () => new Array(vNum).fill(0)); //in order of nodelist.
    var predecessor = Array.from(Array(vNum), () => new Array(vNum).fill(null)); //in order of nodelist.

    for (let i = 0; i < vNum; i++) 
    { //matrix setup, horizontal
        let node = nodesList[i];
        let neighbourNodes = Array.from(adjList.get(node), x => x[0]);
        let neighbourWeights = Array.from(adjList.get(node), x => x[1]);
        for (let j = 0; j < vNum; j++) 
        {
            if(neighbourNodes.includes(nodesList[j]) && node.getAttribute('phase') == 1){
                let idx = neighbourNodes.indexOf(nodesList[j]);
                dist[i][j] = neighbourWeights[idx];
            }
            else if (nodesList[j] === node) {
                dist[i][j] = 0;;
                predecessor[i][j] = nodesList[j];
            }
            else{
                dist[i][j] = Infinity;
                predecessor[i][j] = nodesList[j];
            }
        }
    
    }

    for (let k = 0; k < vNum; k++) 
    {
        if (!visitNodes.includes(nodesList[k]) && nodesList[k].getAttribute('phase') == 1){
            visitNodes.push(nodesList[k]);
        }
        for (let i = 0; i < vNum; i++) 
        {
            for (let j = 0; j < vNum; j++) 
            {
                if (dist[i][k] + dist[k][j] < dist[i][j]) 
                {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    predecessor[i][j] = nodesList[k];
                }
            }
        }
    }

    cleanVN(dist)
    findFP(startN, endN, predecessor, dist); 
    setanimEnd(false);
    VisualColor(startN, endN, visitNodes, dist, VisualiseFP);
    let runTimeEnd  = performance.now();
    setRuntime(Math.trunc((runTimeEnd - runTime)*precison)/precison);
    return dist[nodesList.indexOf(startN)][nodesList.indexOf(endN)];
}

function VisualColor(startN,endN, iterable, dist, callback) {
    var counter = 0;
    for(const node of iterable) {
        let startIdx = nodesList.indexOf(startN);
        let nodeEndId = nodesList.indexOf(endN); 
        let nodeidx = nodesList.indexOf(node);
        if (node != nodesList[nodeEndId] && node != nodesList[nodeStartId] && dist[startIdx][nodeidx] !== Infinity){ //randomstart changed
            counter = counter + speed;
            setTimeout(() => {node.classList.add('visited');} , counter);
        }
    } 
    intervalId = setInterval(() => { //solves async problem of final path loading before the end of first anim.
        let i = iterable.length - 3;
        if(iterable[i].classList.contains('visited')){
            setanimEnd(true);
            callback(finalPath)
        }
    },500)   
}


function VisualiseFP(Fp){
    var counter = 0;
    for(let i = 1; i < Fp.length-1; i++) {
        counter = counter + speed;
        setTimeout(() => {Fp[i].classList.add('finalPath');} , counter);
    } 
    clearInterval(intervalId);
}



function findFP(startN, endN, predecessor, dist){
    var lowID = 0;
    finalPath.push(startN, endN);
    while(lowID !== finalPath.length - 1 && dist[nodesList.indexOf(startN)][nodesList.indexOf(endN)] !== Infinity) {
        let intermediateResult = getIntermediateNode(finalPath[lowID], finalPath[lowID + 1], predecessor);
        if (!intermediateResult[1]){ //if no intermediate
            lowID = lowID + 1;
        }
        else {
                finalPath.splice(lowID + 1, 0, intermediateResult[0]);
        }
    }
}

function getIntermediateNode(node1, node2, predecessor) {
    let node1id = nodesList.indexOf(node1);
    let node2id = nodesList.indexOf(node2);
    let intermediate = predecessor[node1id][node2id];
    if(intermediate !== undefined && intermediate !== node1 && intermediate !== null){
        return [intermediate, true];
    }
    else {
        return [null, false];
    }
}

function cleanVN(dist) {
    let row = dist[0]; //if the first node cannot reach ele, no other node can.
    for (let i = 0; i < row.length; i++) {
        if (row[i] === Infinity) {
            let index = visitNodes.indexOf(nodesList[i]);
            debugger;
            if (index > -1) { // only splice array when item is found
                visitNodes.splice(index, 1); // 2nd parameter means remove one item only
            }
        }
    }
}