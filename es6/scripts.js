const USERS_URL = 'https://api.github.com/users?since=';
const USER_URL = 'https://api.github.com/users/';
const USER_PER_PAGE = 30;
const LINK_LIST = [
    'followers_url',
    'following_url',
    'starred_url',
    'subscriptions_url',
    'organizations_url',
    'repos_url',
];

let table = document.getElementById('table');

let getUser = function (url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);

        xhr.onload = function () {
            if (this.status === 200) {
                resolve(JSON.parse(this.response));
            } else {
                var error = new Error(this.statusText);
                error.code = this.status;
                reject(error);
            }
        };

        xhr.onerror = function () {
            reject(new Error('Network Error'));
        };

        xhr.send();
    });
}

var showDetails = function (userHeader, detailsBlock, userUrl) {
    var name = detailsBlock.querySelectorAll('.cell')[0];
    var email = detailsBlock.querySelectorAll('.cell')[1];
    var links = detailsBlock.querySelectorAll('li a');

    userHeader.classList.toggle('user-selected');
    detailsBlock.classList.toggle('hide');
    if (!name.textContent) {
        userHeader.classList.add('disabled');
        getUser(userUrl).then(
            (response) => {
                var user = response;
                userHeader.classList.remove('disabled');
                name.textContent = user.name || '(no name)';
                email.textContent = user.email || '(no email)';
                LINK_LIST.forEach(function (link, i) {
                    links[i].setAttribute('href', user[link]);
                });
            },
            error => alert(`Rejected: ${error}`),
        );
    }
}

let renderUsers = function (users) {
    var template = document.querySelector('#user_tmp');
    users.forEach((user) => {
        var userBlock = document.importNode(template.content, true);
        var userHeader = userBlock.querySelector('.user');
        var userDetail = userBlock.querySelector('.user-detailed');
        var login = userHeader.querySelector('a');

        userHeader.querySelector('img').setAttribute('src', user.avatar_url);
        login.setAttribute('href', user.html_url);
        login.textContent = user.login;
        userHeader.querySelector('span').textContent = user.site_admin;
        table.appendChild(userBlock);

        userHeader.onclick = function () {
            showDetails(userHeader, userDetail, USER_URL + user.login);
        };
    });
}

let getUsers = function () {
    let since = 0;

    return function () {
        getUser(USERS_URL + since)
            .then(
                response => renderUsers(response),
                error => alert(`Rejected: ${error}`),
            );

        since += USER_PER_PAGE;
    };
}

let loadUsers = getUsers();

loadUsers();
