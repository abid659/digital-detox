import { Component, OnInit } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'digital-detox';
  canViewLeaderboard = false;

  ngOnInit(): void {
    const studentJson = localStorage.getItem('student');
    if (studentJson) {
      const student = JSON.parse(studentJson);
      this.canViewLeaderboard = student.class === 3 && student.roll === 996999;
    }
  }
}
