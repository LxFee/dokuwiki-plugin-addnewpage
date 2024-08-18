/**
 * Rename dialog for end users
 *
 * @author Andreas Gohr <gohr@cosmocode.de>
 */
(function () {
    if (!JSINFO || !JSINFO.move_renameokay) return;


    // basic dialog template
    const $dialog = jQuery(
        '<div>' +
        '<form>' +
        '<label>' + '新页面名称' + '<br>' +
        '<input type="text" name="id" style="width:100%">' +
        '</label>' +
        '</form>' +
        '</div>'
    );

    /**
     * Executes the renaming based on the form contents
     * @return {boolean}
     */
    const createFN = function () {
        let newid = $dialog.find('input[name=id]').val();
        if (!newid) return false;

        newid = JSINFO.id + ':' + newid;

        // remove buttons and show throbber
        $dialog.html(
            '<img src="' + DOKU_BASE + 'lib/images/throbber.gif" /> ' +
            '正在创建'
        );
        $dialog.dialog('option', 'buttons', []);
        
        const url = window.location.host + "?id=" + newid + "&do=edit";

        window.location.href = url;
        
        return false;
    };

    /**
     * Create the actual dialog modal and show it
     */
    const showDialog = function () {
        $dialog.dialog({
            title: JSINFO.id + ' -> ' + '创建新页面',
            width: 800,
            height: 200,
            dialogClass: 'plugin_add_dialog',
            modal: true,
            buttons: [
                {
                    text: '取消',
                    click: function () {
                        $dialog.dialog("close");
                    }
                },
                {
                    text: '创建',
                    click: createFN
                }
            ],
            // remove HTML from DOM again
            close: function () {
                jQuery(this).remove();
            }
        });
        $dialog.find('form').submit(createFN);
    };

    /**
     * Bind an event handler as the first handler
     *
     * @param {jQuery} $owner
     * @param {string} event
     * @param {function} handler
     * @link https://stackoverflow.com/a/4700103
     */
    const bindFirst = function ($owner, event, handler) {
        $owner.unbind(event, handler);
        $owner.bind(event, handler);

        const events = jQuery._data($owner[0])['events'][event];
        events.unshift(events.pop());

        jQuery._data($owner[0])['events'][event] = events;
    };


    // attach handler to menu item
    jQuery('.plugin_add_page')
        .show()
        .click(function (e) {
            e.preventDefault();
            showDialog();
        });

    // attach handler to mobile menu entry
    const $mobileMenuOption = jQuery('form select[name=do] option[value=plugin_add]');
    if ($mobileMenuOption.length === 1) {
        bindFirst($mobileMenuOption.closest('select[name=do]'), 'change', function (e) {
            const $select = jQuery(this);
            if ($select.val() !== 'plugin_add') return;
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            $select.val('');
            showDialog();
        });
    }

})();
