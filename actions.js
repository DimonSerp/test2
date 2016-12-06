/**
 * Тестовая задача №2
 * Функция которая принимает URL, делает GET-запрос на сервер и отображает ответ (или ошибку) в модальном окне
 *
 * Методы:
 * Загрузка содержимого через фрейм (для обхода ограничений на кросс-доменные запросы и передачу куки)
 * showUrl(url)
 *
 * Загрузка содержимого через Ajax.get - отлично работает ля адресов в одном домене или с настрояками CORS
 * showUrlAjax(url)
 *
 * Передача в скрипт существующего модального окна и/или своего лоадера
 *      modalId - идентификатор модали (например '#modal1')
 *      loaderSrc - URL картинки-анимации для лоадера ('http://loading.io/assets/img/hourglass.svg')
 * bindModal(modalId, loaderSrc)
 */

var actions = (function() {
    var modal = null,
        loader = null,
        loaderImg = 'http://loading.io/assets/img/hourglass.svg',
        errorMessage = '<h2>Ошибка загрузки URL</h2>',

        // Создание модального окна, если оно не было подключено
        buildModal = function () {
            modal = jQuery('<div/>').addClass('modal fade').attr({tabindex:"-1", role: "dialog", "aria-labelledby": "actionsModalLabel", "aria-hidden": "true"}).append(
                jQuery('<div/>').addClass('modal-dialog').css('height', '90%').append(
                    jQuery('<div/>').addClass('modal-content').css('height', '100%').append(
                        jQuery('<div/>').addClass('modal-body').css('height', '100%')
                    )
                )
            );
            jQuery('body').append(modal);
        },

        // Загрузка HTML в модальное окно
        htmlToModal = function (htmlContent) {
          jQuery('.modal-body', modal).html(htmlContent);
        },

        // Создание лоадера
        buildLoader = function(img){
            loader = jQuery('<img/>').attr({src: img}).css({margin: 'auto', left: 0, right: 0, top: 0, bottom: 0, position: 'absolute'});
        },

        // Показ лоадера
        showLoader = function() {
            if (loader === null || loader === undefined) {
                buildLoader(loaderImg);
            }
            jQuery('.modal-body', modal).append(loader);
        };


    return {
        //Загрузка через iframe
        showUrl: function (url) {
            if (modal === null) {
                buildModal();
            }
            // Очистка модального окна
            htmlToModal('');
            modal.modal('show');

            // Создаем таймер для проверки загрузки фрейма, если за указанное время не загрузится содержимое фрейма, выдается ошибка
            var timer = setTimeout(function() {
                iframe.remove();
                htmlToModal(errorMessage);
            }, 10000);

            var iframe = jQuery('<iframe/>').css({width: '100%', height: '100%', border: 'none'}).on('load', function(){
                // При успешной загрузке, очищаем таймер по которому выдает ошибку
                if (timer) clearTimeout(timer);
                loader.remove();
            });

            iframe.attr('src', url);
            htmlToModal(iframe);
            showLoader();
        },
        // Загрузка через Ajax
        showUrlAjax: function (url) {
            if (modal === null) {
                buildModal();
            }
            // Очистка модального окна
            htmlToModal('');
            modal.modal('show');
            showLoader();

            var jqxhr = jQuery.get(url, function(data) {
                    htmlToModal(data);
                })
                .fail(function() {
                    htmlToModal(errorMessage);
                })
                .always(function() {
                    loader.remove();
                });
        },
        // Привязка существующего модального окна и лоадера
        bindModal: function (modalId, loaderSrc) {
            modal = jQuery(modalId);
            if (loaderSrc !== null && loaderSrc !== undefined && loaderSrc.length > 0) {
                loaderImg = loaderSrc;
            }
        }
    }
})();