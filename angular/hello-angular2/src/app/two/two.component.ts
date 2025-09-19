import { Component } from '@angular/core';

@Component({
  selector: 'app-two',
  standalone: true,
  imports: [],
  templateUrl: './two.component.html',
  styleUrl: './two.component.css'
})
export class TwoComponent {
  name = '2';

  constructor(){
    window.alert('constructor ' + this.name);
  }
}
