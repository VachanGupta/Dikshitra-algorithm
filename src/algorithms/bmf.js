export function bellmanFord(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    const nodes = getAllNodes(grid);
  
    for (const node of nodes) {
      node.distance = Infinity;
      node.previousNode = null;
    }
    startNode.distance = 0;
  
    const V = nodes.length;
    for (let i = 0; i < V - 1; i++) {
      let updated = false;
      for (const node of nodes) {
        if (node.distance === Infinity || node.isWall) continue;
  
        const neighbors = getNeighbors(node, grid);
        for (const neighbor of neighbors) {
          if (neighbor.isWall) continue;
          const newDist = node.distance + 1;
          if (newDist < neighbor.distance) {
            neighbor.distance = newDist;
            neighbor.previousNode = node;
            updated = true;
          }
        }
      }
      if (!updated) break; 
    }
  
    for (const node of nodes) {
      if (node.distance !== Infinity) {
        node.isVisited = true;
        visitedNodesInOrder.push(node);
      }
    }
  
    return visitedNodesInOrder;
  }
  
  function getNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors;
  }
  
  function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
  }
  
  export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }
  