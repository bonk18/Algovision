import React, { useState, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Shuffle, Search } from 'lucide-react';
import { SearchingAlgorithms } from '../algorithms/searching';
import { generateRandomArray } from '../utils/arrayHelpers';
import { AlgorithmState, SearchingAlgorithm } from '../types';

const ALGORITHMS = [
  { id: 'linear', name: 'Linear Search', complexity: 'O(n)', description: 'Searches sequentially through the array' },
  { id: 'binary', name: 'Binary Search', complexity: 'O(log n)', description: 'Requires sorted array, divides search space in half' },
  { id: 'jump', name: 'Jump Search', complexity: 'O(√n)', description: 'Jumps by fixed steps, then linear search in block' }
];

export default function SearchingVisualizer() {
  const [state, setState] = useState<AlgorithmState>({
    array: generateRandomArray(30, 1, 100),
    comparing: [],
    swapping: [],
    sorted: [],
    found: [],
    current: [],
    isRunning: false,
    isCompleted: false
  });
  
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SearchingAlgorithm>('linear');
  const [speed, setSpeed] = useState(5);
  const [arraySize, setArraySize] = useState(30);
  const [target, setTarget] = useState(50);
  
  const animationRef = useRef<{ isRunning: boolean }>({
    isRunning: false
  });

  const generateNewArray = useCallback(() => {
    if (state.isRunning) return;
    
    const newArray = generateRandomArray(arraySize, 1, 100);
    setTarget(newArray[Math.floor(Math.random() * newArray.length)]);
    setState(prev => ({
      ...prev,
      array: newArray,
      comparing: [],
      found: [],
      current: [],
      isCompleted: false
    }));
  }, [arraySize, state.isRunning]);

  const resetSearch = useCallback(() => {
    animationRef.current.isRunning = false;
    setState(prev => ({
      ...prev,
      comparing: [],
      found: [],
      current: [],
      isRunning: false,
      isCompleted: false
    }));
  }, []);

  const startSearching = useCallback(async () => {
    if (state.isRunning) {
      animationRef.current.isRunning = false;
      setState(prev => ({ ...prev, isRunning: false }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isRunning: true, 
      isCompleted: false,
      comparing: [],
      found: [],
      current: []
    }));
    animationRef.current.isRunning = true;

    let generator;
    switch (selectedAlgorithm) {
      case 'linear':
        generator = SearchingAlgorithms.linearSearch(state.array, target, speed);
        break;
      case 'binary':
        generator = SearchingAlgorithms.binarySearch(state.array, target, speed);
        break;
      case 'jump':
        generator = SearchingAlgorithms.jumpSearch(state.array, target, speed);
        break;
      default:
        generator = SearchingAlgorithms.linearSearch(state.array, target, speed);
    }

    try {
      for await (const step of generator) {
        if (!animationRef.current.isRunning) break;
        
        setState(prev => ({
          ...prev,
          array: step.array,
          comparing: step.comparing,
          found: step.found,
          current: step.current
        }));
      }
    } catch (error) {
      console.error('Searching error:', error);
    }

    setState(prev => ({ 
      ...prev, 
      isRunning: false, 
      isCompleted: true,
      comparing: [],
      current: []
    }));
    animationRef.current.isRunning = false;
  }, [state.array, selectedAlgorithm, speed, target, state.isRunning]);

  const getBarColor = (index: number) => {
    if (state.found.includes(index)) return 'bg-green-500';
    if (state.comparing.includes(index)) return 'bg-red-500';
    if (state.current.includes(index)) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const maxHeight = Math.max(...state.array);

  return (
    <div className="space-y-6">
      {/* Algorithm Selection */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Searching Algorithms</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {ALGORITHMS.map((algo) => (
            <button
              key={algo.id}
              onClick={() => !state.isRunning && setSelectedAlgorithm(algo.id as SearchingAlgorithm)}
              disabled={state.isRunning}
              className={`p-4 rounded-lg text-left transition-all duration-200 ${
                selectedAlgorithm === algo.id
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              } ${state.isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="font-medium">{algo.name}</div>
              <div className="text-sm opacity-75 mb-1">{algo.complexity}</div>
              <div className="text-xs opacity-60">{algo.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={startSearching}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200"
          >
            {state.isRunning ? <Pause size={20} /> : <Search size={20} />}
            {state.isRunning ? 'Pause' : 'Search'}
          </button>

          <button
            onClick={resetSearch}
            disabled={state.isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <RotateCcw size={20} />
            Reset
          </button>

          <button
            onClick={generateNewArray}
            disabled={state.isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <Shuffle size={20} />
            New Array
          </button>

          <div className="flex items-center gap-2">
            <label className="text-white font-medium">Target:</label>
            <input
              type="number"
              min="1"
              max="100"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              disabled={state.isRunning}
              className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white disabled:opacity-50"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-white font-medium">Speed:</label>
            <input
              type="range"
              min="1"
              max="10"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={state.isRunning}
              className="w-20 accent-purple-500 disabled:opacity-50"
            />
            <span className="text-white">{speed}</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-white font-medium">Size:</label>
            <input
              type="range"
              min="10"
              max="50"
              value={arraySize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                setArraySize(newSize);
                if (!state.isRunning) {
                  const newArray = generateRandomArray(newSize, 1, 100);
                  setTarget(newArray[Math.floor(Math.random() * newArray.length)]);
                  setState(prev => ({
                    ...prev,
                    array: newArray,
                    comparing: [],
                    found: [],
                    current: [],
                    isCompleted: false
                  }));
                }
              }}
              disabled={state.isRunning}
              className="w-20 accent-purple-500 disabled:opacity-50"
            />
            <span className="text-white">{arraySize}</span>
          </div>
        </div>
      </div>

      {/* Target Display */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
        <span className="text-white text-lg">
          Searching for: <span className="font-bold text-purple-300 text-2xl">{target}</span>
          {state.isCompleted && (
            <span className="ml-4 text-sm">
              {state.found.length > 0 ? (
                <span className="text-green-400">✓ Found at position {state.found[0]}</span>
              ) : (
                <span className="text-red-400">✗ Not found</span>
              )}
            </span>
          )}
        </span>
      </div>

      {/* Visualization */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-end justify-center gap-1 h-80 overflow-hidden">
          {state.array.map((value, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`transition-all duration-200 ${getBarColor(index)} rounded-t-sm relative`}
                style={{
                  height: `${(value / maxHeight) * 280}px`,
                  width: `${Math.max(20, Math.floor(600 / state.array.length))}px`,
                }}
              >
                {(state.array.length <= 30) && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium">
                    {value}
                  </div>
                )}
              </div>
              <div className="text-white text-xs mt-2">{index}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
        <div className="flex flex-wrap gap-4 items-center justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-white">Unsearched</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-white">Current Range</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-white">Comparing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-white">Found</span>
          </div>
        </div>
      </div>

      {/* Algorithm Info */}
      {selectedAlgorithm === 'binary' && (
        <div className="bg-yellow-500/10 backdrop-blur-lg rounded-xl p-4 border border-yellow-500/20">
          <p className="text-yellow-200 text-sm">
            <strong>Note:</strong> Binary search requires a sorted array. The array will be automatically sorted before searching.
          </p>
        </div>
      )}
      
      {selectedAlgorithm === 'jump' && (
        <div className="bg-blue-500/10 backdrop-blur-lg rounded-xl p-4 border border-blue-500/20">
          <p className="text-blue-200 text-sm">
            <strong>Jump Search:</strong> First jumps by √n steps to find the block containing the target, then performs linear search within that block.
          </p>
        </div>
      )}
    </div>
  );
}