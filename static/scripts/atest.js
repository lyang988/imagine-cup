function submitMCQ(questionId){
    console.log(questionId)

    formid = "form"+questionId
    
    console.log(formid)
    var selected = document.getElementById(formid)
    console.log(selected)
    var x = document.querySelector(
        'input[name="form'+questionId+'"]:checked').value;
    console.log(x)
    data = {"questionId": questionId, 
            "selectedAnswer": x}
    console.log('hello');
    var ajax_params = {
        'url'     : "multipleChoiceAnswer",
        'type'    : "get",
        'data'    : data,
        'success' : function(msg) {
            var resid = "res"+questionId
            var res = document.getElementById(resid)
            res.innerHTML = msg
        }
    }   
    $.ajax( ajax_params )
}
function successMCQ(questionId, x){
    console.log("success" + questionId+ x)
    var resid = "res"+questionId
    var res = document.getElementById(resid)
    if(x == "A")
    res.innerHTML = "yay submitted"
}
function onLoadFunction(){
    console.log("page loaded")
    for (var elem of arr){
        if(elem.isMultipleChoice){
            console.log(elem)
            // if(elem.currentAnswer != null){
            //     var radioid = "submit."+elem.questionId
            // }
            var i = 0;
            for(var opt of elem.options){
                console.log(opt)
                if(opt.option == elem.currentAnswer){
                    var radioid = elem.questionId+"."+i
                    document.getElementById(radioid).checked = true
                }
                i++
            }
        }
    }
}