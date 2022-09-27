const DESCRIPTION_GAME = `Приветствуем вас в приложении для знакомств 1703. Здесь не только находят себе пару, но и… жертву. 
Лера из нашей истории сходила на свидание с убийцей и осталась жива. Но так везёт не всем. Будьте осторожны, когда свайпаете пользователей,
 некоторые не те, кем кажутся. За красивым профилем может скрываться убийца. Получится ли у вас не попасться?`;

const GAME_RULES = [
    { text: 'Просматривайте профили пользователей' },
    { text: 'Смахивайте влево — если считайте пользователя убийцей, вправо — если нет' },
    { text: 'Распознайте как можно больше пользователей' },
    { text: 'Поделитесь результатом у себя в соцсетях и получите промокод в Okko' }
];
const cards = [
    { name: 'Имя 1', status: true, url: 'images/people/people-1.webp', drag: true, story: 'История персонажа 1', correctAnswer: 'Угадал - 1', wrongAnswer: 'Не угадал - 1' },
    { name: 'Имя 2', status: true, url: 'images/people/people-1.webp', drag: false, story: 'История персонажа 2', correctAnswer: 'Угадал - 2', wrongAnswer: 'Не угадал - 2' },
    { name: 'Имя 3', status: true, url: 'images/people/people-1.webp', drag: false, story: 'История персонажа 3', correctAnswer: 'Угадал - 3', wrongAnswer: 'Не угадал - 3' },
    { name: 'Имя 4', status: true, url: 'images/people/people-1.webp', drag: false, story: 'История персонажа 4', correctAnswer: 'Угадал - 4', wrongAnswer: 'Не угадал - 4' },
    { name: 'Имя 5', status: true, url: 'images/people/people-1.webp', drag: false, story: 'История персонажа 5', correctAnswer: 'Угадал - 5', wrongAnswer: 'Не угадал - 5' },
    { name: 'Имя 6', status: true, url: 'images/people/people-1.webp', drag: false, story: 'История персонажа 6', correctAnswer: 'Угадал - 6', wrongAnswer: 'Не угадал - 6' },
    { name: 'Имя 7', status: true, url: 'images/people/people-1.webp', drag: false, story: 'История персонажа 7', correctAnswer: 'Угадал - 7', wrongAnswer: 'Не угадал - 7' },
    { name: 'Имя 8', status: true, url: 'images/people/people-1.webp', drag: false, story: 'История персонажа 8', correctAnswer: 'Угадал - 8', wrongAnswer: 'Не угадал - 8' },
    { name: 'Имя 9', status: true, url: 'images/people/people-1.webp', drag: false, story: 'История персонажа 9', correctAnswer: 'Угадал - 9', wrongAnswer: 'Не угадал - 9' },
    { name: 'Имя 10', status: true, url: 'images/people/people-1.webp', drag: false, story: 'История персонажа 10', correctAnswer: 'Угадал - 10', wrongAnswer: 'Не угадал - 10' }
];

const RAITING_FOR_WIN = 6;
const TEXT_WIN = 'Ура, вы победили.';
const TEXT_LOOSE = 'Уууупс! В следующий раз повезет.';

let raiting = 0;
let attempt = 0;

let diffPoints;
let startPoint;

const cartToPage = 4;
const PIXEL_TO_STATUS_CARD = window.innerWidth > 960 ? 50 : 25;

const isTouchDevice = 'ontouchstart' in document.documentElement;

function getStartCard(element) {
    const coordinate = element.getBoundingClientRect();
    return coordinate.x + coordinate.width / 2;
}

function createElement({ tagName='div', classList=false, handler, onceStatus=true, text }) {
    const element = document.createElement(tagName);

    if (classList) element.classList.add(...classList);
    
    if (text) element.textContent = text;

    if (handler) element.addEventListener('click', handler, { once: onceStatus });

    return element;
}
function createCard({ name, drag, url }) {

    const listClasses = ['window-game_content_block_element'];
    if (drag && !isTouchDevice) listClasses.push('drag-cursor', 'background-person');

    const contentElement = createElement({ classList: listClasses });
    contentElement.style.backgroundImage = `url(${url})`;

    const elementName = createElement({ classList: ['window-game_content_block_element__name'], text: name });

    const elementStatus = createElement({ classList: ['window-game_content_block_element_status'] });
    const statusState = createElement({ classList: ['window-game_content_block_element_status__state'] });
    const statusName = createElement({ classList: ['window-game_content_block_element_status__name'], text: 'недавно онлайн' });
    elementStatus.append(statusState, statusName);

    contentElement.append(elementName, elementStatus);

    if (drag) dragAndDrop(contentElement);

    return contentElement

}

function toggleVisibilityyGame() {
    const gameWindow = document.querySelector('.window-game');

    if (gameWindow) {
        gameWindow.remove();
    } else {
        initialGameWindow();
    }
}
function initialGameWindow() {

    function createWindow() {
        const win = createWindowBlock();
        const iconClose = createWindowIconClose();
        const content = createWindowContent(createWindowDescription);

        win.append(iconClose, content);

        return win;
    }
    function createWindowBlock() {
        return createElement({ classList: ['window-game'] })
    }
    function createWindowIconClose() {
        return createElement({ classList: ['window-game__icon-close'], handler: toggleVisibilityyGame });
    }
    function createWindowContent(callback) {
        const winBody = createElement({ classList: ['window-game_content'] });
        return callback(winBody);
    }

    function createWindowDescription(block) {

        function handlerButton() {
            const blockGame = document.querySelector('.window-game_content');
            blockGame.textContent = '';

            createWindowHowToPlay(blockGame);

        }

        const contentBlockOne = createElement({ classList: ['window-game_content_block', 'heigth--max', 'width--max', 'background-start-game'] });
        const contentBlockTwo = createElement({ classList: ['window-game_content_block', 'width--two-thirds'] });

        const contentBlockOneTitle = createElement({ classList: ['window-game_content_block__title'] });
        const imgTitle = document.createElement('img');
        imgTitle.src = 'images/logos/name-game.png';
        contentBlockOneTitle.append(imgTitle);
        
        const contentBlockOneDescription = createElement({ tagName: 'p', classList: ['window-game_content_block__description'], text: DESCRIPTION_GAME });
        
        const contentBlockOneAction = createElement({ classList: ['window-game_content_block__action'] });
        contentBlockOneAction.append(createElement({ tagName: 'button', classList: ['action-button', 'game-button'], handler: handlerButton, text: 'Начать' }));

        contentBlockOne.append(contentBlockOneTitle, contentBlockOneDescription, contentBlockOneAction);

        contentBlockTwo.append(
            createElement({ classList: ['window-game_content_block_element__people'] }),
        );

        block.append(contentBlockOne, contentBlockTwo);

        return block;
    }
    function createWindowHowToPlay(block) {
        function handlerButton() {
            const blockGame = document.querySelector('.window-game_content');
            blockGame.textContent = '';

            createWindowGamePlay(blockGame);

        }
        function setListRules(block) {
            const ulBlock = createElement({ tagName: 'ul' });

            GAME_RULES.forEach((item, index) => {
                const span = createElement({ tagName: 'span', text: index + 1 })
                const p = createElement({ tagName: 'p', text: item.text });
                const li = document.createElement('li');
                li.append(span, p);

                ulBlock.append(li);
            })

            block.append(ulBlock);
        }

        const background = createElement({ classList: ['background-how-to-play'] });
        block.append(background);

        const contentBlockOne = createElement({ classList: ['window-game_content_block', 'heigth--max', 'width--max'] });

        const contentBlockOneTitle = createElement({ classList: ['window-game_content_block__title'] });
        const imgTitle = document.createElement('img');
        imgTitle.src = 'images/logos/how-to-play.png';
        contentBlockOneTitle.append(imgTitle);
        
        const contentBlockRules = createElement({ classList: ['window-game_content_block_rules'] });
        setListRules(contentBlockRules);
        
        const contentBlockOneAction = createElement({ classList: ['window-game_content_block__action'] });
        contentBlockOneAction.append(createElement({ tagName: 'button', classList: ['game-button', 'action-button', 'game-button--mod'], handler: handlerButton, text: 'Играть' }));

        contentBlockOne.append(contentBlockOneTitle, contentBlockRules, contentBlockOneAction);

        block.append(contentBlockOne);
    }
    function createWindowGamePlay(block) {
        function createCards(block) {

            const myCards = cards.slice(0, cartToPage);

            for (let card of myCards) {
                card.urlTrue = true;
                card.nameTrue = true;
                block.append(createCard(card));
            }

            return block;

        }
        const contentBlock = createElement({ classList: ['window-game_content_block'] });
        createCards(contentBlock);

        const story = createElement({ classList: ['window-game_content_block__story'] });
        const pStory = createElement({ tagName: 'p', text: cards[0].story });

        story.append(pStory);
        contentBlock.append(story);

        block.append(contentBlock);

    }
    
    document.body.append(createWindow());
}
function dragAndDrop(element) {
    function reverseDiffPoints(value) {
        return  (value > 0) ? -value : Math.abs(value);
    }
    function getResultCard(value) {
        return value > 0 ? false : true;
    }
    function moveAt(e) {
        function setStatusCard(diffPoints) {
            const isLike = diffPoints < 0;
            
            const absDiffPoints = Math.abs(diffPoints);

            if (absDiffPoints > PIXEL_TO_STATUS_CARD) {
                const typePerson = isLike ? 'positive-person' : 'negative-person';
                element.classList.add(typePerson);
            } else {
                element.classList.remove('positive-person', 'negative-person');
            }

        }

        const clientX = e.clientX >= 0 ? e.clientX : e.touches[0].clientX;

        diffPoints = startPoint - clientX;

        const revDiffPoints = reverseDiffPoints(diffPoints);

        element.style.transform = `scale(1.08) rotate(${revDiffPoints / 50}deg) translateX(${reverseDiffPoints(diffPoints)}px)`;
        
        setStatusCard(diffPoints);

        return false

    }
    function actionCard() {
        function resetCardPosition() {
            element.style.transform = '';
        }
        function nextCard(result) {
            function getAnswerStatus() {
                const statusCard = cards[attempt - 1].status;
                return statusCard === result;
            }
            function raitingAfterRound() {
                const status = getAnswerStatus();

                raiting += status ? 1 : 0;
            }
            function createdElementsForResultCard() {

                const cardRow = cards[attempt - 1];
                description = getAnswerStatus() ? cardRow.correctAnswer : cardRow.wrongAnswer;

                const nextBackground = createElement({ classList: ['window-game_content_block_element___next-background'] });

                const descriptionBlock = createElement({ classList: ['window-game_content_block_element_content'] });
                const p = createElement({ tagName: 'p', text: description });
                const btn = createElement({ tagName: 'Button', classList: ['action-button', 'next-card'], handler: nextCardGame });
                descriptionBlock.append(p, btn);

                element.prepend(nextBackground, descriptionBlock);
            }

            let xCoord = diffPoints > 0 ? -2000 : 2000;
            let startCoord = reverseDiffPoints(diffPoints);

            element.classList.remove('positive-person', 'negative-person');

            const timer = setInterval(() => {

                element.style.transform = `rotate(${startCoord / 100}deg) translateX(${startCoord}px)`;

                const status = diffPoints > 0 ? startCoord < xCoord : startCoord > xCoord;

                if (status) {
                    element.style.transform = '';
                    setTimeout(() => {
                        element.style.opacity = '';
                    }, 100)
                    element.classList.remove('drag-cursor');

                    if (isTouchDevice) {
                        element.removeEventListener('touchstart', startDrag);
                    } else {
                        element.removeEventListener('mousedown', startDrag);
                    }

                    clearInterval(timer);

                    raitingAfterRound();

                    createdElementsForResultCard();

                } else {
                    startCoord = diffPoints > 0 ? startCoord - 50 : startCoord + 50;

                    if (Math.abs(startCoord) > 1000) element.style.opacity = '0';
                }

            }, 10);
        }
        
        const absDiffPoints = Math.abs(diffPoints);

        if (absDiffPoints > PIXEL_TO_STATUS_CARD) {

            const resultCard = getResultCard(diffPoints);

            if (cards.length > attempt + cartToPage) {
                const storyBlock = document.querySelector('.window-game_content_block .window-game_content_block__story');
                const card = createCard(cards[attempt + cartToPage]);
                storyBlock.before(card);
            }

            attempt += 1;
            return nextCard(resultCard);
        }

        return resetCardPosition();
    }

    function startDrag() {

        startPoint = getStartCard(element);

        if (isTouchDevice) {
            document.addEventListener('touchmove', moveAt);
            element.addEventListener('touchend', () => {
                document.removeEventListener('touchmove', moveAt);

                actionCard();
            }, { once: true });
        } else {
            document.addEventListener('mousemove', moveAt);
            element.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', moveAt);

                actionCard();
            }, { once: true });
        }
    }

    document.addEventListener('dragstart', () => {
        return false;
    })

    if (isTouchDevice) {
        element.addEventListener('touchstart', startDrag, { once: false });
    } else {
        element.addEventListener('mousedown', startDrag, { once: false });
    }
    
}
function nextCardGame() {

    const currentCard = document.querySelector('.window-game_content_block_element');
    currentCard.remove();
    const nextCard = document.querySelector('.window-game_content_block_element');

    if (!nextCard) return resultGame();

    dragAndDrop(nextCard);

    const storyText = cards.length > attempt ? cards[attempt].story : '';
    const pStory = document.querySelector('.window-game_content_block__story p');
    if (pStory) pStory.textContent = storyText;

    nextCard.classList.add('drag-cursor');
}
function resultGame() {
    function setSocials(block) {
        
        const socials = [{ ico: 'images/social/icon-vk.svg' }, { ico: 'images/social/icon-tg.svg' }, { ico: 'images/social/icon-ok.svg' }];

        for (let row of socials) {
            const img = document.createElement('img');
            img.src = row.ico;

            const socialItem = createElement({ classList: ['window-game_content_raiting_social__item'], handler: isIWonGame ? promocodeGame : null });
            socialItem.append(img);

            block.append(socialItem);
        }

        return block;

    }

    const isIWonGame = raiting >= RAITING_FOR_WIN;

    const discription = isIWonGame ? TEXT_WIN : TEXT_LOOSE;

    const gameContent = document.querySelector('.window-game_content');
    gameContent.textContent = '';

    const raitingBlock = createElement({ classList: ['window-game_content_raiting'] });
    const raitingTitle = createElement({ tagName: 'p', classList: ['window-game_content_raiting__title'], text: 'Ваши баллы' });
    const raitingResult = createElement({ tagName: 'p', classList: ['window-game_content_raiting__result'], text: `${raiting}/10` });
    const raitingDescription = createElement({ tagName: 'p', classList: ['window-game_content_raiting__description'], text: discription });
    const socials = createElement({ classList: ['window-game_content_raiting_social'] });
    setSocials(socials);
    const promoText = createElement({ tagName: 'p', classList: ['window-game_content_raiting__promocode-text'], text: 'Поделитесь результатом, чтобы получить промокод в Okko' });
    const backBlock = createElement({ classList: ['window-game_content_raiting__back'] });
    const backButton = createElement({ tagName: 'button', classList: ['action-button'], text: 'Вернутся на главную' });
    backBlock.append(backButton);

    raitingBlock.append(
        raitingTitle, 
        raitingResult,
        raitingDescription,
        socials
    );

    if (isIWonGame) {
        raitingBlock.append(promoText)
    }

    raitingBlock.append(backBlock);

    gameContent.append(raitingBlock);

    attempt = 0;
    raiting = 0;

}
function promocodeGame() {

    function handlerCopy(e) {
        const input = document.querySelector('.input-copy');
        if (input) {
            const value = input.value;

            try {
                navigator.clipboard.writeText(value);
            } catch(e) {
                console.error(e);
            }
        }
    }

    const gameContent = document.querySelector('.window-game_content');
    gameContent.textContent = '';

    const background = createElement({ classList: ['background-how-to-play'] });
    gameContent.append(background)

    const contentBlock = createElement({ classList: ['window-game_content_block', 'width--max'] });

    const title = createElement({ classList: ['window-game_content_block__title'] });
    const imgTitle = document.createElement('img');
    imgTitle.src = 'images/logos/promocode.png';
    title.append(imgTitle);

    const description = createElement({ classList: ['window-game_content_block__description'] });
    const label = createElement({ tagName: 'label', classList: ['promocode-copy'], handler: handlerCopy, onceStatus: false });
    const input = createElement({ tagName: 'input', classList: ['input-copy'] });
    input.value = 'PROMOCODE';
    label.append(input);
    description.append(label);

    const service = createElement({ classList: ['window-game_content_block_service-block'] });
    const servicdeLogo = createElement({ classList: ['window-game_content_block_service-block__logo'] });
    const imgServicdeLogo = document.createElement('img');
    imgServicdeLogo.src = 'images/logos/logo.png';
    servicdeLogo.append(imgServicdeLogo);

    const serviceTitle = createElement({ classList: ['window-game_content_block_service-block__title'] });
    const pServiceTitle = createElement({ tagName: 'p', text: 'Смотрите в okko' });
    serviceTitle.append(pServiceTitle);

    const serviceDescription = createElement({ classList: ['window-game_content_block_service-block__description'] });
    const pServiceDescription = createElement({ tagName: 'p', text: 'Смотрите 1703 с 29 сентября' });
    serviceDescription.append(pServiceDescription);

    service.append(servicdeLogo, serviceTitle, serviceDescription);

    contentBlock.append(title, description, service);

    gameContent.append(contentBlock);
}

window.onload = () => {

    //alert('Версия 10');

    const buttonShowGame = document.querySelector('.button-open-game');
    if (buttonShowGame) buttonShowGame.addEventListener('click', toggleVisibilityyGame);
}