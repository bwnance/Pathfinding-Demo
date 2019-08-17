import * as Heuristics from './algorithms/heuristics'
import Two from "two.js";
export default class Settings{
    constructor(){
        this.algorithm = "A_STAR";
        this.mode = 1;
        this.heuristic = "OCTILE";
        this.renderType = Two.Types.svg
    }
    // getHeuristic(){
    //     switch(this.mode){
    //         case 0:
    //             return Heuristics.ManhattanDistance
    //         case 1:
    //         case 2:
    //             // return Heuristics.EuclidianDistance
    //             return Heuristics.OctileDistance
    //     }
    // }
    getHeuristic(){
        switch(this.heuristic){
            case "MANHATTAN":
                return Heuristics.ManhattanDistance
            case "CHEBYSHEV":
                return Heuristics.ChebyshevDistance
            case "EUCLIDEAN":
                return Heuristics.EuclidianDistance
            case "OCTILE":
                return Heuristics.OctileDistance
        }
    }
}