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
    $('#to-do-list').on('click', '.delete-button', sweetAlertForDelete);
    $('#to-do-list').on('click', '.form-check-input', toggleChangePut);
    $('#sort-button').on('click', getAndSortByOption);
}

//I WANTED TO MAKE THIS A GET!! could not send "data" property with GET
//take sort option and send it to the server to return the results
function getAndSortByOption() {
    let option = $('#input-sort').val(); //option is based on the input
    console.log('option:', option);
    $.ajax({
        method: 'POST',
        url: '/list/sort',
        data: {option: $('#input-sort').val()} //payload
    }).then(function (serverResponse) { //receive sorted array
        console.table(serverResponse);
        console.log('sort get success');
        appendListToDom(serverResponse); //append list to DOM
    })
}

//Check to ensure the user wants to delete, if so, then send ajax call and delete
//I wanted to break this into 2 functions but this is the only way I could get it to work
//Source: https://sweetalert.js.org/guides/
function sweetAlertForDelete() {
    //show alert
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this To-Do!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        //take response from user action and use it as a parameter in this function
        .then((willDelete) => {
            if (willDelete) { //if delete confirmed..
                let thisButton = $(this); //assign button to a variable
                //begin ajax call to DELETE
                $.ajax({
                    method: 'DELETE',
                    url: `/list/${thisButton.data('id')}`
                })
                    //then, remove the row from the DOM and refresh list from the server
                    .then(function (response) {
                        console.log('Deleted it!');
                        thisButton.parent().remove();
                        getListItems();
                    })
                    .catch(function (error) { //catch error is ajax call fails
                        alert('Error on delete.', error);
                    })
                    //show confirmation
                swal("Poof! Your To-Do has been deleted!", {
                    icon: "success",
                });
            } else { //if delete denied, show confirmation that nothing was deleted
                swal("Your To-Do is safe!");
            }
        });
} 


//send PUT call to the server to change task complete status to true or false
function toggleChangePut() {
    console.log('in toggleChange', $(this).data('id'));
    console.log($(this).data('is-complete'));

    $.ajax({
        method: 'PUT',
        url: `/list/${$(this).data('id')}`,
        data: {isComplete: $(this).data('is-complete')}
    })
        .then(function (response) {
            console.log('Updated it!');
            getListItems();
        })
        .catch(function (error) {
            alert('Error on put.', error);
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
    let toggleSwitch ='';
    let timeCompleted ='';

    $('#to-do-list').empty(); //empty the list on DOM
    
    //iterate through the list
    for (let i = 0; i < list.length; i++) {
        console.log('in loop', list[i].isComplete);
        //if this item is completed...
        if (list[i].isComplete === true) {
            isComplete = '&check;' //text to appear on DOM
            completeClass = 'isComplete'; //CSS class to change style
            addCheckMark = '&check;' //HTML entity code for a checkmark
            timeCompleted = list[i].timeCompleted;
            toggleSwitch = `<input class="form-check-input" type="checkbox" data-is-complete="${list[i].isComplete}" data-id="${list[i].id}" checked>`;
        } else {
            timeCompleted = '';
            isComplete = '';
            completeClass = 'isNotComplete';
            addCheckMark = '';
            toggleSwitch = `<input class="form-check-input" type="checkbox" data-is-complete="${list[i].isComplete}" data-id="${list[i].id}">`;
            
        }
        //append list to DOM
        $('#to-do-list').append(`
        <tr class="${completeClass}">
            <td>${list[i].note}</td>
            <td>${list[i].category}</td>
            <td>${list[i].priority}</td>
            <td>${isComplete}</td>
            <td>${timeCompleted}</td>
            <td>
                <div class="form-check form-switch">${toggleSwitch}</div>
            </td>
            <td>
                <button class="delete-button" data-id="${list[i].id}">Delete Item</button
            </td>
        </tr>
        `)
    }


}