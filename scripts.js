var table = document.getElementsByTagName('tbody');
var loadUsers = getUsers(function (users) {
    renderUsers(users);
});

loadUsers();

function getUsers(callback) {
    var since = 0 ;

    return function() {
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

        request.open('Get', 'https://api.github.com/users?since=' + since);
        request.send();

        since += 31;
    }
}

function renderUsers(users) {
    users.forEach(function(user){
        var userBlock = document.createElement('tr');
        var detailsBlock = document.createElement('tr');
        detailsBlock.className += 'hide';

        userBlock.appendChild( createRow('img', {src: user.avatar_url}) );
        userBlock.appendChild( createRow('a', {href: user.html_url, onclick: function () { event.stopPropagation(); }}, user.login) );
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
            var fragment = document.createDocumentFragment();

            links.className += ' links';

            fragment.appendChild( createEl('a', {href: user.followers_url}, 'Followers') );
            fragment.appendChild( createEl('a', {href: user.following_url}, 'Followings') );
            fragment.appendChild( createEl('a', {href: user.starred_url}, 'Starred') );
            fragment.appendChild( createEl('a', {href: user.subscriptions_url}, 'Subscriptions') );
            fragment.appendChild( createEl('a', {href: user.organizations_url}, 'Organizations') );
            fragment.appendChild( createEl('a', {href: user.repos_url}, 'Repos') );

            links.appendChild( fragment );

            detailsBlock.appendChild( createRow('span', {}, user.name || '(no name)'));
            detailsBlock.appendChild( createRow('span', {}, user.email || '(no email)'));
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

