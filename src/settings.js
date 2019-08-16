import * as Heuristics from './algorithms/heuristics'
import Two from "two.js";
export default class Settings{
    constructor(){
        this.algorithm = "A_STAR";
        this.mode = 1;
        this.heuristic = "MANHATTAN";
        this.renderType = Two.Types.svg
    }
    getHeuristic(){
        switch(this.mode){
            case 0:
                return Heuristics.ManhattanDistance
            case 1:
            case 2:
                return Heuristics.ChebyshevDistance
        }
    }
    // getHeuristic(){
    //     switch(this.heuristic){
    //         case "MANHATTAN":
    //             return Heuristics.ManhattanDistance
    //         case "CHEBYSHEV":
    //             return Heuristics.ChebyshevDistance
    //     }
    // }
}