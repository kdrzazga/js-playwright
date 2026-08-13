import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-two',
  standalone: true,
  imports: [],
  templateUrl: './two.component.html',
  styleUrl: './two.component.css'
})
export class TwoComponent {
  name = '';
  color = '';
  gender = '';
  hobbiesSelected: string[] = [];
  age = 25;

  colors = ['Red', 'Green', 'Blue'];
  genders = ['Male', 'Female'];
  hobbies = ['Reading', 'Gaming'];

  get data() {
    return {
      name: this.name,
      color: this.color,
      gender: this.gender,
      hobbies: this.hobbiesSelected,
      age: this.age
    };
  }

  toggleHobby(hobby: string, event: any) {
    if (event.target.checked) {
      this.hobbiesSelected.push(hobby);
    } else {
      this.hobbiesSelected = this.hobbiesSelected.filter(h => h !== hobby);
    }
  }
}

bootstrapApplication(TwoComponent);
