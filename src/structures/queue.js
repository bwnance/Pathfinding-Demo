export default class Queue{
    constructor(){
        this.queue = [];
    }
    enqueue(item){
        this.queue.unshift(item);
    }
    dequeue(item){
        return this.queue.pop(item);
    }
    peek(item){
        return this.queue[this.queue.length-1]
    }
    isEmpty(){
        return this.queue.length === 0;
    }
}