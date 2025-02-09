import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'hello angular 2';
  selectedRadio: string = 'radio 1';

  onOkClick(){
    window.alert('OKAY');
  }

  onCheckboxChange(optionValue: string, isChecked: boolean) {
    console.log(optionValue);
  }
}
