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
                    addUsersList(JSON.parse(request.responseText));
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

function addUsersList(users) {
    users.forEach(function(user){
        var userBlock = document.createElement('tr');
        var detailsBlock = document.createElement('tr');
        detailsBlock.className += 'hide';

        // userBlock.className += 'user';

        userBlock.appendChild( createRow('img', {src: user.avatar_url}) );
        userBlock.appendChild( createRow('a', {href: user.html_url}, user.login) );
        userBlock.appendChild( createRow('span', {}, user.site_admin) );

        userBlock.addEventListener('click', function(){
            showDetails(this, user.url);
        });

        table[0].appendChild(userBlock);
        table[0].appendChild(detailsBlock);
    });
}

function createRow(tagName, attrs, text) {
    var td = document.createElement('td');

    td.appendChild( createEl(tagName, attrs, text) );

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

function showDetails(userBlock, userUrl){
    var detailsBlock = userBlock.nextSibling;
    var user;

    userBlock.classList.toggle('user-selected');
    detailsBlock.classList.toggle('hide');

    if ( detailsBlock.innerHTML === "" ) {
        getUser(userUrl, function (user) {
            var links = document.createElement('td');

            links.className += ' links';

            links.appendChild( createEl('a', {href: user.followers_url}, 'Followers') );
            links.appendChild( createEl('a', {href: user.following_url}, 'Followings') );
            links.appendChild( createEl('a', {href: user.starred_url}, 'Starred') );
            links.appendChild( createEl('a', {href: user.subscriptions_url}, 'Subscriptions') );
            links.appendChild( createEl('a', {href: user.organizations_url}, 'Organizations') );
            links.appendChild( createEl('a', {href: user.repos_url}, 'Repos') );

            detailsBlock.appendChild( user.name ? createRow('span', {}, user.name) : createRow('span', {}, '(no name)'));
            detailsBlock.appendChild( user.email ? createRow('span', {}, user.email) : createRow('span', {}, '(no email)') );
            detailsBlock.appendChild( links );
        });
    }
}

function getUser(userUrl, callback) {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                if (typeof callback == "function") {
                    callback(JSON.parse(request.responseText));
                }
            } else {
                alert('Request error');
            }
        }
    }

    request.open('Get', userUrl);
    request.send();
}

