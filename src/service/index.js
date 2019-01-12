export default ({get,post},urls) => {
    return new class {
        async test(params){
            return await get()
        }
    }
}
