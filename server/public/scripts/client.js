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
    $('#to-do-list').on('click', '.complete-button', putMarkComplete);
    $('#to-do-list').on('click', '.delete-button', deleteListItem);

}

function deleteListItem() {
    console.log('in deleteListItem', $(this).data('id'));
    let thisButton = $(this);
    $.ajax({
        method: 'DELETE',
        url: `/list/${$(this).data('id')}`
    })
        .then(function (response) {
            console.log('Deleted it!');
            thisButton.parent().remove();
            getListItems();
        })
        .catch(function (error) {
            alert('Error on delete.', error);
        })
}

function putMarkComplete() {
    console.log('in putMarkComplete', $(this).data('id'));
    
    $.ajax({
        method: 'PUT',
        url: `/list/${$(this).data('id')}`
    })
        .then(function (response) {
            console.log('Updated it!');
            getListItems();
        })
        .catch(function (error) {
            alert('Error on put.', error);
        })
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
    //variables to track item completion
    let isComplete = '';
    let addCheckMark = ''; 

    $('#to-do-list').empty(); //empty the list on DOM
    
    //iterate through the list
    for (let i = 0; i < list.length; i++) {
        //if this item is completed...
        if (list[i].isComplete === true) {
            isComplete = 'Yes' //text to appear on DOM
            completeClass = 'isComplete'; //CSS class to change style
            addCheckMark = '&check;' //HTML entity code for a checkmark
        } else {
            isComplete = 'No';
            completeClass = 'isNotComplete';
            addCheckMark = '';
        }
        //append list to DOM
        $('#to-do-list').append(`
        <tr class="${completeClass}">
            <td>${list[i].note}</td>
            <td>${list[i].category}</td>
            <td>${list[i].priority}</td>
            <td>${isComplete}</td>
            <td>${list[i].timeCompleted}</td>
            <td>${addCheckMark}
                <button class="complete-button" data-id="${list[i].id}">Mark Complete</button
            </td>
            <td>
                <button class="delete-button" data-id="${list[i].id}">Delete Item</button
                </td>
        </tr>
        `)
    }


}