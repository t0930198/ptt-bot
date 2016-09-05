function getList() {
    let payload = {
        id: $('#id')[0].value
    };
    var data = new FormData();
    data.append("json", JSON.stringify(payload));
    $('.list.record').empty()
    $('.list.related').empty()
    fetch('http://localhost:3000/findsame', {
            method: 'post',
            body: JSON.stringify(payload),
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
        })
        .then(res => {
            return res.json()
        })
        .then(data => {
            data.record.forEach(function(ele){
                $('.list.record').append('<div class="item">'+ele.ID+" "+ele.lastIP+'</p>')
            })
            data.related.forEach(function(ele){
                 $('.list.related').append('<div class="item">'+ele.ID+" "+ele.lastIP+'</p>')
            })
        })
    
}
$('documet').ready(function() {

})