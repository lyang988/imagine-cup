var elements = document.getElementsByClassName("lesson")

function onServerResponse (responseText) {
    window.location.href = 'lesson'
}

var myFunction = function() {
    // console.log(this.id);
    // // window.location.href = 'atest'
    // console.log(lang1)
    // console.log(lang2)
    console.log('hello')
    data = new URLSearchParams({"lang1":lang1, "lang2":lang2, "num": this.id})
    console.log('lesson?'+ data.toString())
    window.location.href = 'lesson?'+ data.toString()
    // var ajax_params = {
    //     'url'     : "atest",
    //     'type'    : "get",
    //     'data'    : {"lang1":lang1, "lang2":lang2, "num": this.id},
    //     'success' : onServerResponse
    // }
    
    // $.ajax( ajax_params )
};

for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', myFunction, false)
}