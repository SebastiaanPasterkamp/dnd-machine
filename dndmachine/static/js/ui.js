function switchNiceTab(parent, name) {
    $('#' + parent + ' > ul > li.current')
        .removeClass('current');
    $('#' + parent + ' > ul > li[data-name="' + name + '"]')
        .addClass('current');
};

$(function() {
    $('#messages').on('click', '.nice-alert-button.dismiss', function() {
        $('#message-' + $(this).attr('data-id')).remove();
    });
    $('form').on('submit', function() {
        $(this).find('.nice-login-loading').addClass('shown');
    });
    $('body').on('a.fa-trash', 'click', function() {
        return confirm('Are you sure?');
    });
    $('form div.nice-tags-container select.add-tag').on('change', function(e) {
        var target = $(this).attr('data-target'),
            name = $(this).attr('data-name'),
            value = $(this).val(),
            next =  $(this).attr('data-next'),
            tag = $('<div class="nice-tag muted"><input type="hidden" /><span class="nice-tag-label"></span><button class="nice-tag-btn"><i class="icon fa-trash-o"></i></button></div>');
        if (value == "") {
            return false;
        }

        $(tag).find('input')
            .attr('value', value)
            .attr('name', name + next);
        $(tag).find('span')
            .text(value);
        $('#'+target)
            .append($(tag));
        $(this)
            .val('')
            .attr('data-next', parseInt(next) + 1);

        return false;
    });
    $('div.nice-tags-container').on('click', 'div.nice-tag button', function() {
        $(this).parent().remove();
        return false;
    });

    $(document).on('click.dd', function(e){
        if (!$(e.target).closest('.dropdown-menu').length) {
            $('.nice-dropdown').removeClass('shown');
        }
    });
    $('.nice-header .nice-header-toggle').bind('click', function(e){
        var toggle = $(this),
            menu = $('.nice-header-collapse'),
            state = toggle.is('.collapsed');

        toggle.toggleClass('collapsed', !state);
        $('body').toggleClass('expanded', state);
    });
    $('.nice-dropdown').on('click', '.nice-btn', function(){
        var btn = $(this),
            dd = btn.closest('.nice-dropdown');
        var isShown = dd.is('.shown');
        if (!isShown) {
            $(document).trigger('click.dd');
        }
        dd.toggleClass('shown', !isShown);
        return false;
    });

    $('.nice-tabs li').bind('click', function(e) {
        var name = $(this).attr('data-name'),
            parent = $(this).closest('div.nice-tabs-wrapper').attr('id');
            switchNiceTab(parent, name);
    });
    $('#statsblockeditor select').on('change', function(e) {
        var budget = $("#budget").attr('data-total');

        $('#statsblockeditor select').each(function(){
            var stat = $(this).attr('data-stat'),
                val = parseInt($(this).find('option:selected').val()),
                cost = (val-8) + Math.max(0, val-13),
                modifier = $('#statsblockeditor input[data-modifier="' + stat + '"]'),
                bonus = $(modifier).attr('data-bonus');
            if (bonus) {
                bonus = parseInt(bonus);
            } else {
                bonus = 0;
            }

            budget -= cost;
            $(modifier).val( bonus + Math.floor((val - 10) / 2) );
        });

        $('#statsblockeditor select').each(function(){
            var val = parseInt($(this).find('option:selected').val()),
                cost = (val-8) + Math.max(0, val-13)

            $(this).find('option').each(function(){
                var optval = parseInt($(this).val()),
                    optcost = (optval-8) + Math.max(0, optval-13);

                $(this).attr('disabled', optval > val && optcost > budget + cost);
            });
        });

        $('#budget').val(budget);
    });
    $('table.itemset input[type="radio"]').on('change', function() {
        var table = $(this).closest('table.itemset'),
            active = $(this).closest('tr');

        $(table)
            .find('input, select')
            .not('input[type="radio"]')
            .each(function(){
                $(this).attr('disabled', true);
            });
        $(active)
            .find('input, select')
            .not('input[type="radio"]')
            .each(function(){
                $(this).attr('disabled', false);
            });
    });
});
