// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;

// Расширяем на весь экран
tg.expand();

// Настраиваем основную кнопку
tg.MainButton.setText("Отправить данные в бот");
tg.MainButton.textColor = "#FFFFFF";
tg.MainButton.color = "#2481cc";

// Переменные для хранения выбора
let selectedData = {
    type: null,
    value: null,
    label: null
};

// Элементы DOM
const selectButtons = document.querySelectorAll('.select-btn');
const priceButtons = document.querySelectorAll('.price-btn');
const actionButtons = document.querySelectorAll('.action-btn');
const showTopBtn = document.getElementById('showTop');
const showHelpBtn = document.getElementById('showHelp');

// Обработчики для кнопок выбора бренда
selectButtons.forEach(button => {
    button.addEventListener('click', function() {
        const brand = this.getAttribute('data-brand');
        const brandName = this.closest('.brand-card').querySelector('h3').textContent;

        selectedData = {
            type: 'brand',
            value: brand,
            label: brandName
        };

        updateMainButton(`Выбрать ${brandName}`);
    });
});

// Обработчики для кнопок фильтра цены
priceButtons.forEach(button => {
    button.addEventListener('click', function() {
        const priceRange = this.getAttribute('data-price');
        const priceLabel = this.textContent;

        selectedData = {
            type: 'price',
            value: priceRange,
            label: priceLabel
        };

        updateMainButton(`Поиск: ${priceLabel}`);
    });
});

// Обработчики для action кнопок
showTopBtn.addEventListener('click', function() {
    selectedData = {
        type: 'action',
        value: 'top_models',
        label: 'Топ модели'
    };

    updateMainButton("Показать топ модели");
});

showHelpBtn.addEventListener('click', function() {
    selectedData = {
        type: 'action',
        value: 'help',
        label: 'Помощь'
    };

    updateMainButton("Показать справку");
});

// Функция обновления основной кнопки
function updateMainButton(text) {
    if (selectedData.type && selectedData.value) {
        tg.MainButton.setText(text);
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

// Обработчик клика по основной кнопке
tg.MainButton.onClick(function() {
    if (selectedData.type && selectedData.value) {
        // Формируем данные для отправки
        const dataToSend = {
            action: selectedData.type,
            value: selectedData.value,
            label: selectedData.label,
            timestamp: new Date().toISOString()
        };

        console.log("Отправка данных:", dataToSend);

        // Отправляем данные в бот
        tg.sendData(JSON.stringify(dataToSend));

        // Показываем подтверждение
        showNotification(`Запрос отправлен: ${selectedData.label}`);

        // Сбрасываем выбор через 2 секунды
        setTimeout(() => {
            selectedData = { type: null, value: null, label: null };
            tg.MainButton.hide();
        }, 2000);
    }
});

// Функция показа уведомления
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--tg-theme-button-color, #2481cc);
        color: var(--tg-theme-button-text-color, #ffffff);
        padding: 12px 20px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideDown 0.3s ease-out;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Добавляем стили для анимаций уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Обработчик событий от Telegram
tg.onEvent('viewportChanged', function() {
    console.log('Viewport changed');
});

tg.onEvent('themeChanged', function() {
    console.log('Theme changed');
    // Можно добавить логику для обновления стилей при смене темы
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('Web App initialized');
    console.log('Platform:', tg.platform);
    console.log('Color scheme:', tg.colorScheme);
    console.log('Theme params:', tg.themeParams);

    // Скрываем кнопку при загрузке
    tg.MainButton.hide();
});

// Обработка закрытия веб-приложения
tg.onEvent('mainButtonClicked', function() {
    console.log('Main button clicked');
});

// Дополнительные функции для улучшения UX
function vibrate() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

// Добавляем вибрацию при кликах
selectButtons.forEach(btn => {
    btn.addEventListener('click', vibrate);
});

priceButtons.forEach(btn => {
    btn.addEventListener('click', vibrate);
});

actionButtons.forEach(btn => {
    btn.addEventListener('click', vibrate);
});