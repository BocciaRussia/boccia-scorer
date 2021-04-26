export type QueryParams =  { [key: string]: string | number | boolean };
export class Query{
    endPoint: string
    query: QueryParams
    callback: (error: Error|null, data?: any) => void;
    method: 'GET'|'POST';
    constructor(endPoint: string, method:'GET'|'POST', query:QueryParams, callback:(error:Error|null, data?:any)=>void){
        this.endPoint = endPoint
        this.method = method
        this.query = query
        this.callback = callback
    }
}