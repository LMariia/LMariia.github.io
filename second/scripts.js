$(document).ready(function () {
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
            var url = 'https://api.github.com/users?since=' + since;
            getUser(url, callback);

            since += 31;
        };
    }

    var showDetails = function (userBlock) {
        var detailsBlock = $(userBlock).next();
        var userUrl = 'https://api.github.com/users/' + $(userBlock).find('a').text();
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
                $(links[0]).attr({ 'href': user.followers_url });
                $(links[1]).attr({ 'href': user.following_url });
                $(links[2]).attr({ 'href': user.starred_url });
                $(links[3]).attr({ 'href': user.subscriptions_url });
                $(links[4]).attr({ 'href': user.organizations_url });
                $(links[5]).attr({ 'href': user.repos_url });
            });
        }
    }

    var renderUsers = function (users) {
        var template = $('#user_tmp')[0];
        var img = $(template.content.querySelector('.user img'));
        var login = $(template.content.querySelector('.user a'));
        var isAdmin = $(template.content.querySelector('.user span'));

        users.forEach(function (user) {
            img.attr({ 'src': user.avatar_url });
            login.text(user.login).attr({ href: user.html_url });
            isAdmin.text(user.site_admin);
            table.append($(template).html());
        });
    }
    //onclick: function () { event.stopPropagation(); }

    var loadUsers = getUsers(function (users) {
        renderUsers(users);
        $('.user').on('click', function () {
            showDetails(this);
        });
    });

    loadUsers();
    $('#load_more').on('click', loadUsers);
});
