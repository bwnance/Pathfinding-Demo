import * as Heuristics from './algorithms/heuristics'
export default class Settings{
    constructor(){
        this.algorithm = "DIJKSTRA";
        this.mode = 1;
        this.heuristic = "MANHATTAN";

    }
    getHeuristic(){
        switch(this.heuristic){
            case "MANHATTAN":
                return Heuristics.ManhattanDistance
            case "CHEBYSHEV":
                return Heuristics.ChebyshevDistance
        }
    }
}