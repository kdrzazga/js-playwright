class ProgramObjectPool{

    constructor(){
      this.programs = {
        '0':{
            'description': 'Hello Brainfuck',
            'code': '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.>+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.'
                 + '>++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.'
                 + '>++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.'
                 + '>+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.'
            },
        '1':{
            'description': '0 255 254 253 252',
            'code': '>>->-->--->---->-----'
            },
        '2':{
            'description': '123',
            'code': '>+>++>+++>'
            },
        '3':{
            'description': '3 inputs',
            'code': '>,.>,.>,.'
        }
      }
    }

    getProgram(index){
        let correctIndex = index % this.programs.length;
        return this.programs[correctIndex];
    }

}

function populatePredefinedProgramsSelect(){

    const pool = new ProgramObjectPool();
    const keys = Object.keys(pool.programs);

    let predefinedProgramsSelect = document.getElementById('predefined-programs');
    var i = 1;

    keys.forEach(k => {
        var option = document.createElement("option");
        option.value = pool.programs[k].description;
        option.textContent = pool.programs[k].description;
        predefinedProgramsSelect.appendChild(option);
    });
}

function loadPredefinedProgram(){
    const predefinedProgramsSelect = document.getElementById('predefined-programs');
    let programToBeLoadedIndex = predefinedProgramsSelect.selectedIndex;
    let programToBeLoaded = predefinedProgramsSelect.selectedOptions[0].text;

    console.log(`Loading ${programToBeLoadedIndex}. ${programToBeLoaded}`);

    const pool = new ProgramObjectPool();
    const programTextArea = document.getElementById('program');
    programTextArea.value = '';
    const outputTextArea = document.getElementById('output');
    outputTextArea.value = '';
    programTextArea.value = pool.programs[programToBeLoadedIndex].code;
}

document.addEventListener('DOMContentLoaded', (event) => {
    populatePredefinedProgramsSelect();
});
