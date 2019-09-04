function replace_at(string, index, character) {
    return string.substr(0, index) + character + string.substr(index + character.length);
}

function arrays_equal(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function load_player() {
    var d = new $.Deferred();
    $.ajax({
        headers: {
            'Authentic-XHR': true
        },
        method: 'get',
        url: '/game/load_player',
        dataType: 'json',
        data: {},
        success: function(response) {
            d.resolve(response);
        }
    });
    return d;
}

function load_names(player) {
    var d = new $.Deferred();
    $.ajax({
        headers: {
            'Authentic-XHR': true
        },
        method: 'get',
        url: '/game/load_data',
        dataType: 'json',
        data: {
            q: 'names'
        },
        success: function(response) {
            d.resolve(player, response);
        }
    });
    return d;
}

function load_bases(player, names) {
    var d = new $.Deferred();
    $.ajax({
        headers: {
            'Authentic-XHR': true
        },
        method: 'get',
        url: '/game/load_data',
        dataType: 'json',
        data: {
            q: 'bases'
        },
        success: function(response) {
            d.resolve(player, names, response);
        }
    });
    return d;
}

function load_image0(player, names, bases) {
    var d = new $.Deferred();
    $.ajax({
        headers: {
            'Authentic-XHR': true
        },
        method: 'get',
        url: '/game/load_data',
        dataType: 'json',
        data: {
            q: 'image0'
        },
        success: function(response) {
            d.resolve(player, names, bases, response);
        }
    });
    return d;
}

function load_images(player, names, bases, image0) {
    var d = new $.Deferred();
    $.ajax({
        headers: {
            'Authentic-XHR': true
        },
        method: 'get',
        url: '/game/load_data',
        dataType: 'json',
        data: {
            q: 'images'
        },
        success: function(response) {
            d.resolve(image0, {
                player: player,
                names: names,
                bases: bases,
                images: response
            });
        }
    });
    return d;
}

function load_done(image0, game_obj) {
    var d = $.Deferred();
    for (var i in game_obj.player.elements_found) {
        var j = +i + 1;
        if (+game_obj.player.elements_found[i]) {
            $('#panel div ul')
                .append(
                    $('<li>')
                    .addClass('element')
                    .append(
                        $('<span>')
                        .append($('<img>')
                            .addClass('ico passive')
                            .data('base', j)
                            .attr('src', 'data:image/png;base64,' + game_obj.images[j])
                        )
                    )
                    .append($('<span>')
                        .html(game_obj.names[j])
                    )
                );
        }
    }
    $('.ico.passive').draggable({
        helper: 'clone',
    });
    $('#arena').droppable({
        accept: '.ico.passive',
        drop: function(event, ui) {
            var $target = add_to_arena(this, ui, game_obj);
            check_overlap($target, game_obj);
        },
    });
    $('#panel').droppable({
        accept: '.ico.active',
        drop: function(event, ui) {
            $(ui.draggable).animate({
                    height: 0,
                    marginLeft: 25,
                    marginTop: 25,
                    width: 0,
                },
                500,
                function() {
                    $(this).remove();
                });
        }
    });
    return d.resolve().promise();
}

function add_to_arena(_this, ui, game_obj) {
    var $target = $(ui.draggable).clone()
        .attr('id', (new Date()).getTime())
        .removeClass('passive')
        .addClass('active')
        .css({
            left: ui.position.left + 'px',
            top: ui.position.top + 'px',
            position: 'absolute',
        })
        .data('base', $(ui.draggable).data('base'));
    $(_this).append($target);
    reset_draggable(game_obj);
    return $target;
}

function reset_draggable(game_obj) {
    $('.ico.passive').draggable({
        helper: 'clone',
    });
    $('.ico.active').draggable({
        stack: ".ico.active",
        containment: "body",
        scroll: false,
        stop: function() {
            check_overlap($(this), game_obj);
        }
    });
}

function check_overlap($target, game_obj) {
    var d_min = Number.POSITIVE_INFINITY;
    var $x_min = null;
    $('.ico.active').each(function(i, x) {
        if ($target.attr('id') !== $(x).attr('id')) {
            var d = Math.sqrt(Math.pow($(x).position().left - $target.position().left, 2) +
                Math.pow($(x).position().top - $target.position().top, 2));
            if (d < d_min) {
                d_min = d;
                $x_min = $(x);
            }
        }
    });
    if (d_min <= 50) {
        check_merge($target, $x_min, game_obj);
    }
}

function check_merge($target, $x_min, game_obj) {
    for (var k in game_obj.bases) {
        for (var i in game_obj.bases[k]['parents']) {
            var parent_pair = game_obj.bases[k]['parents'][i];
            if (arrays_equal([$x_min.data('base'), $target.data('base')], parent_pair) ||
                arrays_equal([$x_min.data('base'), $target.data('base')], parent_pair.reverse())) {
                if (+game_obj.player.elements_found[k - 1] === 1) {
                    show_notif(0, game_obj.names[k].toUpperCase());
                    return;
                }
                show_notif(1, game_obj.names[k]);
                merge(k, $target, $x_min, game_obj);
                $x_min.animate({
                        height: 0,
                        marginLeft: 25,
                        marginTop: 25,
                        width: 0,
                    },
                    500,
                    function() {
                        $(this).remove();
                    });
                $target.animate({
                        height: 0,
                        marginLeft: 25,
                        marginTop: 25,
                        width: 0,
                    },
                    500,
                    function() {
                        $(this).remove();
                    });
                return;
            }
        }
    }
    show_notif(-1);
}

function merge(k, $target, $x_min, game_obj) {
    if (!((+game_obj.player.elements_found[+$target.data('base') - 1]) &&
            (+game_obj.player.elements_found[+$x_min.data('base') - 1]))) {
        alert('chor!');
        return;
    }
    var position = $target.position();
    game_obj.player.elements_found = replace_at(game_obj.player.elements_found, +k - 1, '1');
    game_obj.player.score += 5;
    $.ajax({
        headers: {
            'Authentic-XHR': true
        },
        method: 'post',
        url: '/game/score',
        data: {
            a: $target.data('base'),
            b: k,
            c: $x_min.data('base'),
        },
    });
    $('#score span').last().html(game_obj.player.score);
    var $result = $('<img>')
        .addClass('ico passive')
        .attr('src', 'data:image/png;base64,' + game_obj.images[k])
        .data('base', +k);
    $('#panel div ul')
        .append(
            $('<li>')
            .addClass('element')
            .append(
                $('<span>')
                .append($result.clone(true))
            )
            .append($('<span>')
                .html(game_obj.names[k])
            )
        );
    $('#arena')
        .append(
            $result
            .attr('id', (new Date()).getTime())
            .removeClass('passive')
            .addClass('active')
            .css({
                left: position.left + 'px',
                top: position.top + 'px',
                position: 'absolute',
            })
        );
    reset_draggable(game_obj);
}

function show_notif(type, response_name) {
    var message;
    switch (type) {
        case -1:
            type = 'error';
            message = 'No new element formed';
            break;
        case 0:
            type = 'warn';
            message = 'Element already formed: <strong>' + response_name + '</strong>';
            break;
        case 1:
            type = 'success';
            message = 'New element formed: <strong>' + response_name + '</strong>';
    };
    $.notify(message, type, {
        position: 'center'
    });
}
load_player()
    .then(load_names)
    .then(load_bases)
    .then(load_image0)
    .then(load_images)
    .then(load_done);