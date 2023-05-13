type LoopFunction = (func:Function,array:any[],...params:any[])=>Promise<any[]>
export const loopFunction:LoopFunction = async (func,array,...params) => {
    const data:any[] = []
    for (const element of array){
        const result = await func(element,...params)
        if (!result) continue
        data.push(result)
    }
    return data
}
type SyncLoopFunction = (func:Function,array:any[])=>Function
export const syncLoopFunction:SyncLoopFunction = (func,array) => {
    return (...params:any[])=>{
        const data:any[] = []
        for (const element of array){
            const result = func(element,...params)
            if (!result) continue
            data.push(result)
        }
        return data
    }
}

type VariablesCurry = (...args:any[])=>(func:Function)=>(...funcArgs:any[])=>any
export const variablesCurry:VariablesCurry = (...args) => func => (...funcArgs)=>{
    return func(...funcArgs,...args)    
}

type AsyncVariablesCurry = (...args:any[])=>(func:Function)=>(...funcArgs:any[])=>Promise<any>
export const asyncVariablesCurry:AsyncVariablesCurry = (...args) =>  func => async (...funcArgs)=>{
    return await func(...funcArgs,...args)    
}
