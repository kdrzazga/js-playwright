class Example {
    constructor(name, source, input = '') {
        this.name = name;
        this.source = source;
        this.input = input;
    }
}

class ExampleLibrary {
    constructor(examples) {
        this.examples = examples;
    }

    static createDefault() {
        return new ExampleLibrary([
            new Example(
                'Hello World!',
                '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.'
            ),
            new Example(
                'Digits 0-9',
                '++++++++[>++++++<-]\n++++++++++[>.+<-]\n++++++++++.'
            ),
            new Example(
                'Multiply 6 x 7 = 42 (prints "*")',
                '++++++[>+++++++<-]>.'
            ),
            new Example(
                'Nested loops 4 x 4 x 4 = 64 (prints "@")',
                '++++[>++++[>++++<-]<-]>>.'
            ),
            new Example(
                'Echo input (cat)',
                ',[.,]',
                'Echo me!'
            ),
            new Example(
                'Reverse input',
                '>,[>,]<[.<]',
                'stressed'
            ),
            new Example(
                'Uppercase input',
                ',[>++++[<-------->-]<.,]',
                'shout'
            ),
            new Example(
                'Add two digits',
                ',>,[<+>-]<\n------------------------------------------------.',
                '34'
            ),
            new Example(
                'Cell wrap-around 0 - 1 = 255',
                '>>->-->--->---->-----'
            ),
            new Example(
                'Echo three characters',
                '>,.>,.>,.',
                'abc'
            ),
            new Example(
                'Syntax error: unmatched [',
                '+[[-]'
            ),
            new Example(
                'Runtime error: move left of cell 0',
                '+<'
            ),
        ]);
    }

    get names() {
        return this.examples.map(example => example.name);
    }

    exampleAt(index) {
        return this.examples[index];
    }
}
