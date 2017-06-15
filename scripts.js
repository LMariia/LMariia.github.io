var table = document.getElementsByTagName('tbody');
var loadUsers = getUsers();

loadUsers();

function getUsers() {
    var since = 0 ;

    return function() {
        var request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    addRecords(JSON.parse(request.responseText));
                } else {
                    alert('Request error');
                }
            }
        }

        request.open('Get', 'https://api.github.com/users?since=' + since);
        request.send();

        since += 31;
    }
}

function addRecords(users) {
    users.forEach(function(user){
        var tr = document.createElement('tr');
        var trDetails = document.createElement('tr');

        tr.className += 'user';
        tr.addEventListener('click', showDetails);
        trDetails.className += 'hide';

        tr.appendChild( createRow('img', {src: user.avatar_url}) );
        tr.appendChild( createRow('a', {href: user.url}, user.login) );
        tr.appendChild( createRow('span', {}, user.site_admin) );

        table[0].appendChild(tr);
        table[0].appendChild(trDetails);
    });
}

function createRow(tagName, attrs, text) {
    var td = document.createElement('td');
    td.appendChild(createEl(tagName, attrs, text));

    return td;
};

function createEl(tagName, attrs, text) {
    var el = document.createElement(tagName);

    Object.assign(el, attrs);
    if (arguments.length == 3) {
        el.innerText = text;
    }

    return el;
}

function showDetails(){
    this.classList.toggle('user-selected');
    this.nextSibling.classList.toggle('hide');
}

