console.log('js ready');
$(readyNow);
function readyNow() {
    console.log('DOM loaded.');
     //get data from server and display it
    getListItems();
    handleClickEvents();
}

function handleClickEvents() {
    $('#submit-button').on('click', postListToServer);
}

function postListToServer() {
    console.log('in postListToServer');
    let newListItem = {
        note: $('#input-note').val(),
        category: $('#input-category').val(),
        priority: $('#input-priority').val(),
        isComplete: $('#input-isComplete').val(),
        timeCompleted: $('#input-timeCompleted').val(),
    };
    console.log(newListItem);
    if (newListItem.isComplete.toUpperCase() ==='YES') {
        newListItem.isComplete = true;
    } else if (newListItem.isComplete.toUpperCase() === 'NO') {
        newListItem.isComplete = false;
    } else {
    alert('Please enter "yes" or "no".');   
    }
    $.ajax({
        method: 'POST',
        url: '/list',
        data: newListItem,
    }).then(function(serverResponse){
        console.log(serverResponse);
        getListItems();
    })
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