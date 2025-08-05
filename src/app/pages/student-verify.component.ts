import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, VerifiedStudent } from '../services/api.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-student-verify',
  standalone: true,
  templateUrl: './student-verify.component.html',
  styleUrls: ['./student-verify.component.scss'],
  imports: [
    MatFormField,
    MatFormField,
    MatFormField,
    ReactiveFormsModule,
    MatFormField,
    MatOption,
    MatLabel,
    MatSelect,
    MatInput,
    MatButton,
    NgIf
  ]
})
export class StudentVerifyComponent {
  verifyForm: FormGroup;
  verifiedStudent: VerifiedStudent | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.verifyForm = this.fb.group({
      class: [null, Validators.required],
      roll: [null, [Validators.required, Validators.min(1)]]
    });
  }

  verify() {
    if (this.verifyForm.invalid) return;

    const { class: cls, roll } = this.verifyForm.value;

    this.api.verifyStudent(cls, roll).subscribe({
      next: (student) => {
        this.verifiedStudent = student;
        this.errorMessage = null;
        localStorage.setItem('student', JSON.stringify(student));

        // 🔁 Redirect based on admin or student
        if (student.class === 3 && student.roll === 996999) {
          this.router.navigate(['/leaderboard']); // Admin → Leaderboard
        } else {
          this.router.navigate(['/submit']); // Student → Submission
        }
      },
      error: () => {
        this.verifiedStudent = null;
        this.errorMessage = 'Student not found.';
      }
    });
  }
}
