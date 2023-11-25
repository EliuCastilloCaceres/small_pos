export function hasOnlyNumbers(number){
    let NumericRegEx = /^[0-9]+$/
    if(number!=''){
        let numberSplited = number.split('.')
        if(numberSplited.length>1){
            if(NumericRegEx.test(numberSplited[0])&&NumericRegEx.test(numberSplited[1])){
                return true
            }else{
                return false
            }
        }else{
            if(NumericRegEx.test(numberSplited[0])){
                return true
            }else{
                return false
            }
        }
        
    }else{
        return false
    }
}