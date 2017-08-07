$(function() {
    $('#messages').on('click', '.nice-alert-button.dismiss', function() {
        $('#message-' + $(this).attr('data-id')).remove();
    });
    $('form').on('submit', function() {
        $(this).find('.nice-login-loading').addClass('shown');
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
});
