import { WIN_MESSAGE, LOSE_MESSAGE } from '../lang/messages/en/user.js';

class Timer {
    constructor() {
        this.timeoutId = null;
    }

    /*
    chatGPT is used here to remind me correct syntax for the timeout function.
    */
    pause(time) {
        this.cancel();
        return new Promise(resolve => {
            this.timeoutId = setTimeout(() => {
                this.timeoutId = null;
                resolve();
            }, time * 1000);
        });
    }

    cancel() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }
}

class Game {
    constructor() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.colors = ['red', 'orange', 'yellow', 'green', 'blue', 'pink', 'purple'];
        this.timer = new Timer();
        this.buttons = [];
        this.minButtons = 3;
        this.maxButtons = 7;
        this.init();
    }

    init() {
        this.buttonContainer = document.getElementById('buttonContainer');
        this.shuffledButtonContainer = document.getElementById('shuffledButtonContainer');
        this.buttonCountInput = document.getElementById('buttonCountInput');
        this.buttonCount = this.minButtons;
        this.messageContainer = document.getElementById('messageContainer');
        this.goButton = document.getElementById('goButton');
        this.goButton.addEventListener('click', () => this.start());
    }

    async start() {
        console.log('Game started');
        this.reset();
        const shuffledColor = this.colors.sort(() => 0.5 - Math.random());
        this.buttonCount = parseInt(this.buttonCountInput.value);
        if (isNaN(this.buttonCount) || this.buttonCount < this.minButtons || this.buttonCount > this.maxButtons) {
            this.messageContainer.innerHTML = `Please enter a number between ${this.minButtons} and ${this.maxButtons}.`;
            this.buttonCountInput.value = '';
            return;
        }
        const width = Math.min(Math.max(this.windowWidth / this.buttonCount - 10, 50), 100);
        const height = 50;
        for (let i = 0; i < this.buttonCount; i++) {
            const button = new Button(shuffledColor[i], width + 'px', height + 'px', i + 1, this.buttonCount, this);
            this.buttonContainer.appendChild(button.btn);
            this.buttons.push(button);
        }
        await this.timer.pause(this.buttonCount);
        this.clearContainer(this.buttonContainer);
        for (let i = 0; i < this.buttonCount; i++) {
            this.shuffle();
            await this.timer.pause(2);
        }
        this.quiz();
    }

    shuffle() {
        this.clearContainer(this.shuffledButtonContainer);
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.buttons.sort(() => 0.5 - Math.random());
        this.buttons.forEach((button) => {
            const marginLeft = Math.max(Math.random() * this.windowWidth - 100, 0);
            this.shuffledButtonContainer.appendChild(button.move(marginLeft));
        });
    }

    quiz() {
        let order = 1;
        this.buttons.forEach((button) => {
            button.hideOrder();
            button.btn.addEventListener('click', () => button.click(order++));
        })
    }

    clearContainer(container) {
        container.innerHTML = '';
    }

    reset() {
        this.buttons = [];
        this.clearContainer(this.buttonContainer);
        this.clearContainer(this.shuffledButtonContainer);
        this.clearContainer(this.messageContainer);
    }

    over(completed, currentOrder) {
        if (completed) {
            this.messageContainer.innerHTML = WIN_MESSAGE;
        } else {
            this.messageContainer.innerHTML = LOSE_MESSAGE;
            for (let i = currentOrder; i <= this.buttonCount; i++) {
                this.buttons[i - 1].revealOrder(i);
            }
        }
    }
}

class Button {
    constructor(color, width, height, order, max, game) {
        console.log('Button created:', color, width, height, order);
        this.order = order
        this.btn = document.createElement('button');
        this.btn.style.backgroundColor = color;
        this.btn.style.width = width;
        this.btn.style.height = height;
        this.btn.style.position = 'relative';
        this.btn.style.marginTop = '20px';
        this.revealOrder(this.order);
        this.max = max;
        this.game = game;
    }

    click(currentOrder) {
        if (currentOrder == this.order) {
            this.revealOrder(this.order);
            if (this.order == this.max) {
                this.game.over(1, currentOrder);
            }
        } else {
            this.game.over(0, currentOrder);
        }
    }

    move(marginLeft) {
        this.btn.style.marginLeft = marginLeft + 'px';
        return this.btn;
    }

    hideOrder() {
        this.btn.textContent = '';
    }

    revealOrder(order) {
        this.btn.textContent = order;
    }
}

new Game();