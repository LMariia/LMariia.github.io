const USERS_URL = 'https://api.github.com/users';
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

let getUser = function (url, params) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url + (params || ''), true);

        xhr.onload = function () {
            if (this.status === 200) {
                resolve(JSON.parse(this.response));
            } else {
                let error = new Error(this.statusText);
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

let showDetails = function (userHeader, detailsBlock, userUrl) {
    let name = detailsBlock.querySelectorAll('.cell')[0];
    let email = detailsBlock.querySelectorAll('.cell')[1];
    let links = detailsBlock.querySelectorAll('li a');

    userHeader.classList.toggle('user-selected');
    detailsBlock.classList.toggle('hide');
    if (!name.textContent) {
        userHeader.classList.add('disabled');
        getUser(userUrl).then(
            (user) => {
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
    let template = document.querySelector('#user_tmp');
    users.forEach((user) => {
        let userBlock = document.importNode(template.content, true);
        let userHeader = userBlock.querySelector('.user');
        let userDetail = userBlock.querySelector('.user-detailed');
        let login = userHeader.querySelector('a');

        userHeader.querySelector('img').setAttribute('src', user.avatar_url);
        login.setAttribute('href', user.html_url);
        login.textContent = user.login;
        userHeader.querySelector('span').textContent = user.site_admin;
        table.appendChild(userBlock);

        userHeader.onclick = function () {
            showDetails(userHeader, userDetail, `${USERS_URL}/${user.login}`);
        };
    });
}

let getUsers = function () {
    let since = 0;

    return function () {
        getUser(USERS_URL, `?since=${since}`)
            .then(
                response => renderUsers(response),
                error => alert(`Rejected: ${error}`),
            );

        since += USER_PER_PAGE;
    };
}

let loadUsers = getUsers();

loadUsers();
