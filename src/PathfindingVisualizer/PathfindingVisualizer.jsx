import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { bellmanFord } from '../algorithms/bmf';
import { floydWarshall, getFWPathNodes } from '../algorithms/Floyd_Warshal';
import './PathfindingVisualizer.css';

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      startNodePos: null,
      endNodePos: null,
      selectingMode: 'start',
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const { selectingMode, grid } = this.state;

    if (selectingMode === 'start') {
      const newGrid = grid.map(r =>
        r.map(node => ({
          ...node,
          isStart: node.row === row && node.col === col,
        }))
      );
      this.setState({
        grid: newGrid,
        startNodePos: { row, col },
        selectingMode: 'end',
      });
      return;
    }

    if (selectingMode === 'end') {
      const newGrid = grid.map(r =>
        r.map(node => ({
          ...node,
          isFinish: node.row === row && node.col === col,
        }))
      );
      this.setState({
        grid: newGrid,
        endNodePos: { row, col },
        selectingMode: 'walls',
      });
      return;
    }

    const newGrid = getNewGridWithWallToggled(grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed || this.state.selectingMode !== 'walls') return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, speed = 10) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, speed * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, speed * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const { grid, startNodePos, endNodePos } = this.state;
    if (!startNodePos || !endNodePos) {
      alert('Please select both start and end nodes before running the algorithm!');
      return;
    }
    const startNode = grid[startNodePos.row][startNodePos.col];
    const finishNode = grid[endNodePos.row][endNodePos.col];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, 10);
  }

  visualizeBellmanFord() {
    const { grid, startNodePos, endNodePos } = this.state;
    if (!startNodePos || !endNodePos) {
      alert('Please select both start and end nodes before running the algorithm!');
      return;
    }
    const startNode = grid[startNodePos.row][startNodePos.col];
    const finishNode = grid[endNodePos.row][endNodePos.col];
    const visitedNodesInOrder = bellmanFord(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, 10);
  }

  visualizeFloydWarshall() {
    const { grid, startNodePos, endNodePos } = this.state;
    if (!startNodePos || !endNodePos) {
      alert('Please select both start and end nodes before running the algorithm!');
      return;
    }
    const startNode = grid[startNodePos.row][startNodePos.col];
    const finishNode = grid[endNodePos.row][endNodePos.col];

    const { visitedNodesInOrder, path } = floydWarshall(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getFWPathNodes(grid, path);

    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, 1);
  }

  render() {
    const { grid, mouseIsPressed, selectingMode } = this.state;

    return (
      <>
        <p style={{ fontWeight: 'bold' }}>
          {selectingMode === 'start' && 'Click a cell to select START node'}
          {selectingMode === 'end' && 'Click a cell to select END node'}
          {selectingMode === 'walls' && 'Click and drag to add/remove walls'}
        </p>
        <button onClick={() => this.visualizeDijkstra()}>Visualize Dijkstra</button>
        <button onClick={() => this.visualizeBellmanFord()}>Visualize Bellman-Ford</button>
        <button onClick={() => this.visualizeFloydWarshall()}>Visualize Floyd-Warshall</button>
        <div className="grid">
          {grid.map((row, rowIdx) => (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const { row, col, isFinish, isStart, isWall } = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    mouseIsPressed={mouseIsPressed}
                    onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                    onMouseUp={() => this.handleMouseUp()}
                    row={row}
                  ></Node>
                );
              })}
            </div>
          ))}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: false,
    isFinish: false,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
