class LiveText {
    constructor(element) {
        this.element = element;
        this.displayedText = null;
    }

    set(text) {
        const textValue = String(text);
        if (textValue !== this.displayedText) {
            this.displayedText = textValue;
            this.element.textContent = textValue;
        }
    }
}

class ElementFactory {
    static create(tagName, { className = '', text = '', title = '' } = {}) {
        const element = document.createElement(tagName);
        if (className) {
            element.className = className;
        }
        if (text !== '') {
            element.textContent = text;
        }
        if (title) {
            element.title = title;
        }
        return element;
    }

    static tableWithHeader(headerLabels) {
        const table = ElementFactory.create('table', { className: 'debug-table' });
        const headerRow = ElementFactory.create('tr');
        headerLabels.forEach(label => headerRow.append(ElementFactory.create('th', { text: label })));
        table.append(headerRow);
        return table;
    }

    static liveCell(row, className = '') {
        const cell = ElementFactory.create('td', { className });
        row.append(cell);
        return new LiveText(cell);
    }
}

class ChangeHighlighter {
    constructor(element, highlightDurationRefreshes = 30, highlightClassName = 'changed') {
        this.element = element;
        this.highlightDurationRefreshes = highlightDurationRefreshes;
        this.highlightClassName = highlightClassName;
        this.previousValue = null;
        this.remainingHighlightRefreshes = 0;
    }

    forget() {
        this.previousValue = null;
        this.remainingHighlightRefreshes = 0;
        this.element.classList.remove(this.highlightClassName);
    }

    observe(value) {
        if (this.previousValue !== null && value !== this.previousValue) {
            this.remainingHighlightRefreshes = this.highlightDurationRefreshes;
        }
        this.previousValue = value;
        if (this.remainingHighlightRefreshes > 0) {
            this.remainingHighlightRefreshes--;
        }
        this.element.classList.toggle(this.highlightClassName, this.remainingHighlightRefreshes > 0);
    }
}
