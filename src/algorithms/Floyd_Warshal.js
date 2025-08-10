export function floydWarshall(grid, startNode, finishNode) {
  const rows = grid.length;
  const cols = grid[0].length;
  const nodeCount = rows * cols;

  const dist = Array(nodeCount)
    .fill(null)
    .map(() => Array(nodeCount).fill(Infinity));
  const next = Array(nodeCount)
    .fill(null)
    .map(() => Array(nodeCount).fill(null));

  const index = (r, c) => r * cols + c;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c].isWall) continue;
      const u = index(r, c);
      dist[u][u] = 0;
      next[u][u] = u;
      const neighbors = getNeighbors(grid, grid[r][c]);
      for (const neighbor of neighbors) {
        const v = index(neighbor.row, neighbor.col);
        dist[u][v] = 1;
        next[u][v] = v;
      }
    }
  }

  let visitedNodesInOrder = [];

  for (let k = 0; k < nodeCount; k++) {
    for (let i = 0; i < nodeCount; i++) {
      for (let j = 0; j < nodeCount; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];

          const { row, col } = fromIndex(i, cols);
          if (!visitedNodesInOrder.some(n => n.row === row && n.col === col)) {
            visitedNodesInOrder.push({ row, col });
          }
        }
      }
    }
  }

  const path = reconstructPath(
    index(startNode.row, startNode.col),
    index(finishNode.row, finishNode.col),
    next,
    cols
  );

  return { visitedNodesInOrder: sortVertical(visitedNodesInOrder), path };
}

export function getFWPathNodes(grid, path) {
  return path.map(([r, c]) => grid[r][c]);
}

function getNeighbors(grid, node) {
  const { row, col } = node;
  const neighbors = [];
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(n => !n.isWall);
}

function reconstructPath(u, v, next, cols) {
  if (next[u][v] === null) return [];
  const path = [];
  let current = u;
  while (current !== v) {
    path.push(fromIndex(current, cols, true));
    current = next[current][v];
  }
  path.push(fromIndex(v, cols, true));
  return path;
}

function fromIndex(index, cols, asArray = false) {
  const row = Math.floor(index / cols);
  const col = index % cols;
  return asArray ? [row, col] : { row, col };
}

function sortVertical(nodes) {
  return [...nodes].sort((a, b) =>
    a.col === b.col ? a.row - b.row : a.col - b.col
  );
}
