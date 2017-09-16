function switchNiceTab(parent, name) {
    $('#' + parent + ' > ul > li')
        .removeClass('current')
        .find('input, select, textarea')
        .each(function(){
            $(this).attr('disabled', true);
        });
    $('#' + parent + ' > ul > li[data-name="' + name + '"]')
        .addClass('current')
        .find('input, select, textarea')
        .each(function(){
            $(this).attr('disabled', false);
        });
};

$(function() {
    $('#messages').on('click', '.nice-alert-button.dismiss', function() {
        $('#message-' + $(this).attr('data-id')).remove();
    });
    $('form').on('submit', function() {
        $(this).find('.nice-login-loading').addClass('shown');
    });
    $('body').on('.fa-trash', 'click', function() {
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

    $('.nice-tabs').on('click', '> li:not(.disabled)', function(e) {
        var name = $(this).attr('data-name'),
            parent = $(this).closest('div.nice-tabs-wrapper').attr('id');
        if (name == null) {
            return false;
        }
        switchNiceTab(parent, name);
    });
    $('#statsblockeditor select').on('change', function(e) {
        var budget = $("#statsblockeditor #budget").attr('data-total');

        $('#statsblockeditor select').each(function(){
            var row = $(this).closest('tr'),
                base_val = parseInt($(this).find('option:selected').val()),
                cost = (base_val-8) + Math.max(0, base_val-13),
                bonus = $(row).find('input[data-field="bonus"]'),
                bonus_val = parseInt($(bonus).val()),
                final = $(row).find('input[data-field="final"]'),
                modifier = $(row).find('input[data-field="modifier"]');

            budget -= cost;
            $(final).val(base_val + bonus_val);
            $(modifier).val(Math.floor(((base_val + bonus_val) - 10) / 2) );
        });

        $('#statsblockeditor select').each(function(){
            var base_val = parseInt($(this).find('option:selected').val()),
                cost = (base_val-8) + Math.max(0, base_val-13)

            $(this).find('option').each(function(){
                var optval = parseInt($(this).val()),
                    optcost = (optval-8) + Math.max(0, optval-13);

                $(this).attr('disabled', optval > base_val && optcost > budget + cost);
            });
        });

        $('#budget').val(budget);
    });
    $('table.itemset input[type="radio"]').on('change', function() {
        var name = $(this).attr('name'),
            table = $(this).closest('table.itemset'),
            active = $(this).closest('tr');

        $(table)
            .find('input, select, textarea')
            .not('input[type="radio"][name="' + name + '"]')
            .each(function(){
                $(this).attr('disabled', true);
            });
        $(table)
            .find('> tbody > tr > td')
            .toggleClass('disabled');
        $(active)
            .find('input, select, textarea')
            .not('input[type="radio"][name="' + name + '"]')
            .each(function(){
                $(this).attr('disabled', false);
            });
    });

    $('div.nice-panel.hidden').each(function(){
        var link = $(this).attr('data-link'),
            id = $(this).attr('id');

        if (link) {
            $('a[href="'+link+'"]')
                .addClass('inview')
                .attr('data-link-id', id)
                .on('inview', function(event, isInView) {
                    var linked_id = $(this).attr('data-link-id');
                    if (isInView) {
                        // element is now visible in the viewport
                        $('#' + linked_id).removeClass('hidden');
                    } else {
                        // element has gone out of viewport
                        $('#' + linked_id).addClass('hidden');
                    }
                });
        }
    });

    $('#party > div.nice-panel-heading, #npc > div.nice-panel-heading').each(function(){
        $(this).addClass('hiding');
        $(this).on('click', function() {
            $(this)
                .closest('div.nice-panel')
                .toggleClass('hiding');
        });
    });
});
