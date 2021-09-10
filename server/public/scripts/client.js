console.log('js ready');
$(readyNow);
function readyNow() {
    console.log('DOM loaded.');
    getListItems();
    // handleClickEvents();
}

function getListItems() {
    console.log('in getListItems');
    $.ajax({
        method: 'GET',
        url: '/list'
    }).then(function(serverResponse) {
        appendListToDom(serverResponse);
    }).catch(function(error){
        console.log('error in client GET', error);
    });
}

function appendListToDom(list) {
    console.table(list);
    //change boolean to yes or no response

    let isComplete = '';
    for (let i = 0; i < list.length; i++) {
        if (list[i].isComplete === true) {
            isComplete = 'Yes'
        } else {
            isComplete = 'No';
        }
        //append list to DOM
        $('#to-do-list').append(`
        <tr>
            <td>${list[i].note}</td>
            <td>${list[i].category}</td>
            <td>${list[i].priority}</td>
            <td>${isComplete}</td>
            <td>${list[i].timeCompleted}</td>
        </tr>
        `)
    }


}