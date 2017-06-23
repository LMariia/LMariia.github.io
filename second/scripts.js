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

    var showDetails = function (userHeader, detailsBlock, url) {
        var name = detailsBlock.find('.cell').eq(0);
        var email = detailsBlock.find('.cell').eq(1);
        var links = detailsBlock.find('li a');

        userHeader.toggleClass('user-selected');
        detailsBlock.collapse('toggle');
        if (!name.html()) {
            userHeader.addClass('disabled');
            getUser(url, function (user) {
                userHeader.removeClass('disabled');
                name.text(user.name || '(no name)');
                email.text(user.email || '(no email)');
                LINK_LIST.forEach(function (link, i) {
                    links.eq(i).attr('href', user[link]);
                });
            });
        }
    }

    var renderUsers = function (users) {
        var template = $($('#user_tmp').get(0).content);

        users.forEach(function (user) {
            var userBlock = template.clone();
            var userHeader = userBlock.find('.user');
            var userDetail = userBlock.find('.user-detailed')

            userHeader.find('img').attr('src', user.avatar_url);
            userHeader.find('a').text(user.login).attr('href', user.html_url);
            userHeader.find('span').text(user.site_admin);
            table.append(userBlock);

            userHeader.on('click', function () {
                showDetails(userHeader, userDetail, USER_URL + user.login);
            });
            userHeader.find('a').on('click', function (event) {
                event.stopPropagation();
            });
        });
    }

    var loadUsers = getUsers(function (users) {
        renderUsers(users);
    });

    loadUsers();
    $('#load_more').on('click', loadUsers);
});
