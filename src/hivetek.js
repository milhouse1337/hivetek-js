/**
 *
 * HiveTek jQuery Toolkit (hivetek.js)
 * Version: 1.0.1
 * Required: jQuery 1.5+
 * Optional: fancyBox 2.x
 * URL: https://github.com/milhouse1337/hivetek-js
 *
 * Author: Pascal Meunier (@milhouse1337)
 * Copyright 2019 HiveTek - hivetek.com
 * License: MIT
 *
 */

(function (window, $) {

    "use strict";

    // Check if jQuery is loaded.
    if (!$) {
        return;
    }

    // Check if already initialized.
    if ($.fn.hivetek || $.hivetek) {
        console.log('HiveTek jQuery Toolkit already initialized.');
        return;
    }

    // Base object.
    $.fn.hivetek = {};

    // Default settings.
    $.fn.hivetek.settings = {
        text_loading: 'Loading...',
        fadein_delay: 200,
    };

    // Configuration setter.
    $.fn.hivetek.config = function(key, value) {
        $.fn.hivetek.settings[key] = value;
    };

    // Test function.
    $.fn.hivetek.test = function(a) {
        console.log('tested');
        console.log(a, this, $.fn.hivetek.settings);
        return true;
    };

    // Simple GET.
    $.fn.hivetek.doAjaxGet = function(url, args, callback, error) {

        var args = typeof args !== 'undefined' ? args : {};
        var callback = typeof callback !== 'undefined' ? callback : function() {};
        var error = typeof error !== 'undefined' ? error : function() {};

        $.ajax({

            url: url,
            type: 'GET',
            data: args,

        }).done(function (output) {

            callback(output);

        }).fail(function (e) {

            error(e);
            // console.log(e);

        });

        return true;
    };

    // Simple POST.
    $.fn.hivetek.doAjaxPost = function(url, args, callback, error) {

        var args = typeof args !== 'undefined' ? args : {};
        var callback = typeof callback !== 'undefined' ? callback : function() {};
        var error = typeof error !== 'undefined' ? error : function() {};

        $.ajax({

            url: url,
            type: 'POST',
            data: args,

        }).done(function (output) {

            callback(output);

        }).error(function (e) {

            error(e);
            // console.log(e);

        });

        return true;
    };

    // Simple AJAX loader for HTML content.
    $.fn.hivetek.doAjax = function(url, args, element, callback, error) {

        var args = typeof args !== 'undefined' ? args : {};
        // var element = typeof element !== 'undefined' ? element : function() {};
        var callback = typeof callback !== 'undefined' ? callback : function() {};
        var error = typeof error !== 'undefined' ? error : function() {};

        $(element).html($.fn.hivetek.settings.text_loading);

        $.fn.hivetek.doAjaxGet(url, args, function(output) {

            $(element).hide();
            $(element).html(output);
            $(element).fadeIn($.fn.hivetek.settings.fadein_delay);

            callback(output);

        }, function(e) {

            $(element).hide();
            $(element).html(e.responseText);
            $(element).fadeIn($.fn.hivetek.settings.fadein_delay);

            error(e);

        });

        return true;
    };

    // fancyBox modal (fancyModal).
    $.fn.hivetek.doAjaxFancybox = function(url, args, lock, callback, error) {

        // Default.
        args = typeof args !== 'undefined' ? args : {};
        lock = typeof lock !== 'undefined' ? lock : false;
        callback = typeof callback !== 'undefined' ? callback : function() {};
        error = typeof error !== 'undefined' ? error : function() {};

        // Check if fancyBox is loaded.
        if (!$.fancybox) {
            console.log('HiveTek jQuery Toolkit: fancyBox is not loaded.');
            return false;
        }

        // Loading.
        $.fancybox.showLoading();

        // Make AJAX query.
        $.ajax({

            url: url,
            type: 'GET',
            data: args

        }).done(function (output) {

            // Show fancyBox.
            $.fn.hivetek.showFancybox(output, lock);

            // Bind submit.
            $('.fancybox-inner form').on('submit', function(e){

                e.preventDefault();
                // var form = $(e.delegateTarget);
                // var args = form.serialize();
                var args = new FormData($(this)[0]);
                $.fn.hivetek.ajaxSubmitFancyboxForm(url, args, lock, callback, error);

                return false;
            });

            callback(output);

        }).fail(function (e) {

            $.fn.hivetek.showFancybox(e.responseText, lock);

            error(e);

        });

        return true;
    };

    $.fn.hivetek.ajaxSubmitFancyboxForm = function(url, args, lock, callback, error) {

        // Default.
        args = typeof args !== 'undefined' ? args : {};
        lock = typeof lock !== 'undefined' ? lock : false;
        callback = typeof callback !== 'undefined' ? callback : function() {};
        error = typeof error !== 'undefined' ? error : function() {};

        // Lock buttons.
        $('.fancybox-inner form button[type="submit"]').attr('disabled', '');
        $('.fancybox-inner form button[type="submit"]').html('...');

        // Make AJAX query.
        $.ajax({

            url: url,
            type: 'POST',
            data: args,
            // async: false,
            cache: false,
            contentType: false,
            processData: false

        }).done(function (output) {

            // Show fancyBox.
            $.fn.hivetek.showFancybox(output, lock);

            // Bind submit.
            $('.fancybox-inner form').on('submit', function(e){

                e.preventDefault();
                // var form = $(e.delegateTarget);
                // var args = form.serialize();
                var args = new FormData($(this)[0]);
                $.fn.hivetek.ajaxSubmitFancyboxForm(url, args, lock, callback, error);

                return false;
            });

            callback(output);

        }).fail(function (e) {

            $.fn.hivetek.showFancybox(e.responseText, lock);

            error(e);

        });

        return true;
    };

    $.fn.hivetek.showFancybox = function(output, lock) {

        // Options for fancyBox.
        var fancybox_options = {
            'content': output,
            //'minHeight': 'auto',
            //'maxWidth' : 'auto',
            'autoWidth': true,
            'autoHeight': true,
            'autoResize': true,
            //'padding': 0,
            'helpers': { overlay: { locked: false } }
        }

        // Check for locked popup.
        if (lock) {
            fancybox_options.closeBtn = false;
            fancybox_options.closeClick = false;
            fancybox_options.keys = {
                close : null
            };
            fancybox_options.helpers = {
                overlay : {closeClick: false, locked: false} // Prevent outside click.
            };
        }

        // Invoke fancyBox.
        $.fancybox(fancybox_options);

        // Rebind stuff.
        $('.fancybox-inner .fancyclose').on('click', function(){
            $.fancybox.close(); // true = force.
        });

        return false;
    };

    $.fn.hivetek.closeModal = function() {

        // Fixed with a setTimeout() to avoid this FancyBug. Need another workaround here :\
        setTimeout(function(){
            $.fancybox.close();
        }, 1);

    };

    // Bootstrap modal.
    $.fn.hivetek.doAjaxModal = function(url, args, lock, callback, error) {

        // Default.
        url = typeof url !== 'undefined' ? url : '';
        args = typeof args !== 'undefined' ? args : {};
        lock = typeof lock !== 'undefined' ? lock : false;
        callback = typeof callback !== 'undefined' ? callback : function() {};
        error = typeof error !== 'undefined' ? error : function() {};

        $.fn.hivetek.initModal();

        $('#modalax-spinner').show();

        // Make AJAX query.
        $.ajax({

            url: url,
            type: 'GET',
            data: args

        }).done(function (output) {

            $('#modalax-spinner').hide();

            // Show modal.
            $.fn.hivetek.showModal(output, lock);

            // Bind submit.
            $('#modalax-wrap .modal-body form').on('submit', function(e){

                e.preventDefault();
                // var form = $(e.delegateTarget);
                // var args = form.serialize();
                var args = new FormData($(this)[0]);
                $.fn.hivetek.doAjaxModalPostForm(url, args, lock, callback, error);

                return false;
            });

            callback(output);

        }).fail(function (e) {

            $.fn.hivetek.showModal(e.responseText, lock);

            error(e);

        });

        return true;
    }

    $.fn.hivetek.doAjaxModalPostForm = function(url, args, lock, callback, error) {

        // Default.
        url = typeof url !== 'undefined' ? url : '';
        args = typeof args !== 'undefined' ? args : {};
        lock = typeof lock !== 'undefined' ? lock : false;
        callback = typeof callback !== 'undefined' ? callback : function() {};
        error = typeof error !== 'undefined' ? error : function() {};

        $('#modalax-wrap').modal('hide');

        // Lock buttons.
        $('#modalax-wrap .modal-body form button[type="submit"]').attr('disabled', '');
        $('#modalax-wrap .modal-body form button[type="submit"]').html('...');

        $('#modalax-spinner').show();

        // Make AJAX query.
        $.ajax({

            url: url,
            type: 'POST',
            data: args,
            cache: false,
            contentType: false,
            processData: false

        }).done(function (output) {

            $('#modalax-spinner').hide();

            // Show modal.
            $.fn.hivetek.showModal(output, lock);

            // Bind submit.
            $('#modalax-wrap .modal-body form').on('submit', function(e){

                e.preventDefault();
                // var form = $(e.delegateTarget);
                // var args = form.serialize();
                var args = new FormData($(this)[0]);
                $.fn.hivetek.doAjaxModalPostForm(url, args, lock, callback, error);

                return false;
            });

            callback(output);

        }).fail(function (e) {

            $.fn.hivetek.showModal(e.responseText, lock);

            error(e);

        });

        return true;
    }

    $.fn.hivetek.showModal = function(output, lock) {

        var modal = $('#modalax-wrap');
        modal.find('.modal-body').html(output);

        var options = {};
        if (lock) {
            options = {backdrop: 'static', keyboard: false};
        }

        modal.modal(options);

        return true;
    }

    $.fn.hivetek.initModal = function() {

        if ($('#modalax-wrap').length == 0) {

            $('body').append(`
                <div id="modalax-wrap" class="modal" tabindex="-1" role="dialog" aria-labelledby="modalaxLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content animated fadeIn">
                        <!--
                        <div class="modal-header">
                        <h5 class="modal-title" id="modalaxLabel">New message</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        -->
                        <div class="modal-body">
                            <!-- AJAX -->
                        </div>
                        <!--
                        <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Valider</button>
                        </div>
                        -->
                        </div>
                    </div>
                </div>`);

        }

        if ($('#modalax-spinner').length == 0) {

            $('body').append('<div id="modalax-spinner" style="position: fixed; background-color: #666; padding: 18px; border-radius: 8px; top: 50%; left: 50%; transform: translate(-50%, -50%); display: none; z-index: 999;"><img src="//cdn.jsdelivr.net/gh/SamHerbert/SVG-Loaders/svg-loaders/spinning-circles.svg" width="58" height="58" alt="..." /></div>');

            // var spinner = new Spin.Spinner({
            //     lines: 12, // The number of lines to draw
            //     length: 27, // The length of each line
            //     width: 15, // The line thickness
            //     radius: 39, // The radius of the inner circle
            //     scale: 1, // Scales overall size of the spinner
            //     corners: 1, // Corner roundness (0..1)
            //     color: '#7f7f7f', // CSS color or array of colors
            //     fadeColor: 'transparent', // CSS color or array of colors
            //     speed: 1, // Rounds per second
            //     rotate: 0, // The rotation offset
            //     animation: 'spinner-line-fade-default', // The CSS animation name for the lines
            //     direction: 1, // 1: clockwise, -1: counterclockwise
            //     zIndex: 2e9, // The z-index (defaults to 2000000000)
            //     className: 'spinner', // The CSS class to assign to the spinner
            //     top: '50%', // Top position relative to parent
            //     left: '50%', // Left position relative to parent
            //     shadow: '0 0 1px transparent', // Box-shadow for the lines
            //     position: 'absolute' // Element positioning
            // }).spin();
            // $('#modalax-spinner').append(spinner.el);
        }

        return true;
    }

    $.fn.hivetek.fixAjaxToken = function() {

        $.ajaxSetup({ headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }});

    };

    $.fn.hivetek.loadLegacy = function() {

        window.doAjaxFancybox = $.fn.hivetek.doAjaxFancybox;
        window.doAjaxGet = $.fn.hivetek.doAjaxGet;
        window.doAjaxPost = $.fn.hivetek.doAjaxPost;
        window.doAjax = $.fn.hivetek.doAjax;
        window.closeModal = $.fn.hivetek.closeModal;

    }

    // Attach on main jQuery object.
    $.hivetek = $.fn.hivetek;

    // EOF.

})(window, jQuery);
