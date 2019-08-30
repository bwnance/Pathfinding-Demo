export default class PriorityQueue{
    constructor(){
        this.pq = [];
    }
    enqueue(item, priority){
        // debugger
        // this.removeDuplicate(item);
        const el = new PriorityQueueItem(item, priority);
        let inserted = false;
        for(let i = 0; i < this.pq.length; i++){
            const curItem = this.pq[i];
            // if(curItem.priority  el.priority){

            // }
            if(curItem.priority > el.priority){
                this.pq.splice(i, 0, el)
                inserted = true;
                break;
            }
        }
        if(!inserted){
            this.pq.push(el);
        }
    }
    removeDuplicate(item){
        for(let i = 0; i < this.pq.length; i++){
            if(this.pq[i].val.posKey === item.posKey){
                this.pq.splice(i, 1);
                break;
            }
        }
    }
    dequeue(){
        return this.pq.shift().val;
    }
    isEmpty(){
        return this.pq.length === 0;
    }
}
class PriorityQueueItem{
    constructor(val, priority){
        this.val = val;
        this.priority = priority;
    }
}