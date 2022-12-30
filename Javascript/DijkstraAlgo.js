import { MinHeap } from "./MinheapClass.js";
import { adjList, distances, nodeList } from "./logic.js";
var visitNodes = [];
var calculatedNodes = [];
var path;
var speed;

export function dijkstraAlgo() {
    // Create a MinHeap to store the nodes and their corresponding
    // distances from the start node
    var minHeap = new MinHeap();
    var graph = adjList;
    var startNode = nodeList[0];

    // Initialize the distances of all nodes to infinity, except
    // for the start node, which has a distance of 0
    for (const [node, neighbours] of graph.entries()) {
        distances.set(node, Number.POSITIVE_INFINITY);
    }
    distances.set(startNode, 0); //start node has a distance of 0.

    // Add all the nodes to the min heap
    for (const [node, distance] of distances.entries()) {
        minHeap.insert(node, distance, null);
    }

    // Create a map to store the previous node for each node
    // in the shortest path from the start node
    const previousNodes = new Map();

    // While the min heap is not empty, extract the minimum element
    // from the heap and update the distances of its neighbours
    while (minHeap.heap.length > 0) {
        // Extract the minimum element from the min heap
        const min = minHeap.extractMin();
        if (!calculatedNodes.includes(min.node)){
            calculatedNodes.push(min.node);
        }
        // Update the distances of the neighbours
        const neighbours = graph.get(min.node);
        for (const [neighbour, weight] of neighbours) { //needs to be fixed.
            // Calculate the new distance to the neighbour
            var newDistance = Infinity;
            if(neighbour.style.backgroundColor != 'black')
            {
            newDistance = distances.get(min.node) + weight;
            if (!visitNodes.includes(neighbour)){
                visitNodes.push(neighbour);
            }
            }
            // If the new distance is shorter than the current distance,
            // update the distance and the previous node for the neighbour
            if (newDistance < distances.get(neighbour)) {
                minHeap.update(neighbour, newDistance, min.node) //needs work
                distances.set(neighbour, newDistance);
                previousNodes.set(neighbour, min.node);
            }
        }

    }

    path = {distances, previousNodes, calculatedNodes, visitNodes};
    console.log(path);
    VisualColor(visitNodes);
    return path;
}

function VisualColor(iterable) {
    speed = 100; //slow: 100, medium: 75; fast; 50
    var counter = 1000;
    for(const node of iterable) {
        if (node != nodeList[249] && node != nodeList[0] && distances.get(node) != Infinity){
            counter = counter + speed;
            setTimeout(() => {node.classList.add('visited');} , counter);
        }
    } 
}