import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TwoComponent} from './two/two.component';
import {ThreeComponent} from './three/three.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TwoComponent, ThreeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'hello angular 2';
  selectedRadio: string = 'radio 1';

  onOkClick(text: string){
    window.alert(`Textbox ${text}`);
  }

  onCheckboxChange(optionValue: string, event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    const checked = target.checked;
    console.log(optionValue + ', checked = ' + checked);
  }

  onRadioClick(event: Event){
    const target = event.currentTarget as HTMLInputElement;
    const name = target.value;
    const checked = target.checked;
    console.log(`Radio ${name} - ${checked}.`);
  }
}
