export function floydWarshall(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    const nodes = getAllNodes(grid);
    const n = nodes.length;
  
    // Map each node to an index
    const indexMap = new Map();
    nodes.forEach((node, idx) => {
      indexMap.set(node, idx);
    });
  
    // Initialize distance and next arrays
    const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
    const next = Array.from({ length: n }, () => Array(n).fill(null));
  
    // Distance from node to itself = 0
    for (let i = 0; i < n; i++) {
      dist[i][i] = 0;
    }
  
    // Add edges for grid neighbors
    for (const node of nodes) {
      if (node.isWall) continue;
      const neighbors = getNeighbors(node, grid);
      for (const neighbor of neighbors) {
        if (neighbor.isWall) continue;
        const u = indexMap.get(node);
        const v = indexMap.get(neighbor);
        dist[u][v] = 1; // weight = 1
        next[u][v] = neighbor;
      }
    }
  
    // Floyd–Warshall main loop
    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            next[i][j] = next[i][k];
          }
        }
      }
    }
  
    // Reconstruct path from start to finish
    const path = [];
    const startIdx = indexMap.get(startNode);
    const endIdx = indexMap.get(finishNode);
  
    if (next[startIdx][endIdx] === null) {
      return visitedNodesInOrder; // no path
    }
  
    let current = startNode;
    while (current !== finishNode) {
      path.push(current);
      visitedNodesInOrder.push(current);
      current = next[indexMap.get(current)][endIdx];
      if (!current) break;
    }
    path.push(finishNode);
    visitedNodesInOrder.push(finishNode);
  
    // Mark visited nodes for visualization
    visitedNodesInOrder.forEach(node => (node.isVisited = true));
  
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
  
  export function getNodesInShortestPathOrderFW(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }
  