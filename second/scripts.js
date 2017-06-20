$(document).ready(function () {
    var USERS_URL = 'https://api.github.com/users?since=';
    var USER_URL = 'https://api.github.com/users/';
    var USER_PER_PAGE = 30;
    var LINK_LIST = [
        'followers_url',
        'following_url',
        'starred_url',
        'subscriptions_url',
        'organizations_url',
        'repos_url',
    ];

    var table = $('#table');

    var getUser = function (userUrl, callback) {
        $.ajax({
            url: userUrl,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                if (typeof callback === 'function') {
                    callback(data);
                }
            },
            error: function () {
                console.log('Request error');
            },
        });
    }

    var getUsers = function (callback) {
        var since = 0;

        return function () {
            var url = USERS_URL + since;
            getUser(url, callback);

            since += USER_PER_PAGE;
        };
    }

    var showDetails = function (userBlock) {
        var detailsBlock = $(userBlock).next();
        var userUrl = USER_URL + $(userBlock).find('a').text();
        var name = $(detailsBlock.find('.cell'))[0];
        var email = $(detailsBlock.find('.cell'))[1];
        var links = detailsBlock.find('li a');

        $(userBlock).toggleClass('user-selected');
        detailsBlock.collapse('toggle');
        if (name.innerHTML === '') {
            $(userBlock).addClass('disabled');
            getUser(userUrl, function (user) {
                $(userBlock).removeClass('disabled');
                $(name).text(user.name || '(no name)');
                $(email).text(user.email || '(no email)');
                for (i = 0; i < LINK_LIST.length; i++) {
                    $(links[i]).attr('href', user[LINK_LIST[i]]);
                }
            });
        }
    }

    var renderUsers = function (users) {
        var template = $('#user_tmp')[0];
        var avatar = $(template.content.querySelector('.user img'));
        var login = $(template.content.querySelector('.user a'));
        var isAdmin = $(template.content.querySelector('.user span'));

        users.forEach(function (user) {
            avatar.attr('src', user.avatar_url);
            login.text(user.login).attr('href', user.html_url);
            isAdmin.text(user.site_admin);
            table.append($(template).html());
        });
        $('.user').on('click', function () {
            showDetails(this);
        });
        $('.user a').on('click', function (event) {
            event.stopPropagation();
        });
    }

    var loadUsers = getUsers(function (users) {
        renderUsers(users);
    });

    loadUsers();
    $('#load_more').on('click', loadUsers);
});
