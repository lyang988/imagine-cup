var lang1menu = document.getElementById('lang1select')
var lang2menu = document.getElementById('lang2select')
var submit = document.getElementById('submit')
lang1menu.addEventListener('change',modifylang2)
lang2menu.addEventListener('change',modifylang1)
submit.addEventListener('click',submitlangs)

function submitlangs(){
    data = {"lang1": lang1menu.value, "lang2": lang2menu.value}
    console.log('hello');
    var ajax_params = {
        'url'     : "setLanguage",
        'type'    : "get",
        'data'    : data,
        'success' : onServerResponse
    }
        
    $.ajax( ajax_params )
}
function onServerResponse (responseText) {
    window.location.href = "/"
}
function modifylang1(){
    option1 = lang1menu.value
    option2 = lang2menu.value
    console.log(option1)
    console.log(option2)
}
function modifylang2(){
    option1 = lang1menu.value
    option2 = lang2menu.value
    console.log(option1)
    console.log(option2)
    lang2list = langMap[option1]
    if(option1 == "choose"){
        console.log("hi")
        lang2list = []
    } 
    $("#lang2select").empty()
    for (var i = 0; i < lang2s.length; i++){
        cur = lang2s[i]
        console.log(cur);
        if(lang2list.includes(cur)){
            $("#lang2select").append('<option value="'+cur+'">'+cur+'</option>')
        } else {
            $("#lang2select").append('<option disabled value="'+cur+'">' + cur+'</option>')
        }
    }
}