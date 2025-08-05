import { Component, OnInit } from '@angular/core';
import { ApiService, Question, SubmitAnswersDto, AnswerDto, VerifiedStudent } from '../services/api.service';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatButton} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-submit-questions',
  standalone: true,
  templateUrl: './submit-questions.component.html',
  styleUrls: ['./submit-questions.component.scss'],
  imports: [
    FormsModule,
    MatRadioGroup,
    MatRadioButton,
    MatButton,
    NgIf,
    NgForOf
  ]
})
export class SubmitQuestionsComponent implements OnInit {
  student: VerifiedStudent | null = null;
  questions: Question[] = [];
  answers: { [key: number]: boolean | null } = {};
  error: string | null = null;
  success: string | null = null;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    const studentJson = localStorage.getItem('student');
    if (!studentJson) {
      this.router.navigate(['/']);
      return;
    }
    this.student = JSON.parse(studentJson);
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.api.getQuestions().subscribe({
      next: (data) => {
        this.questions = data;
        this.questions.forEach(q => (this.answers[q.questionId] = null));
      },
      error: () => this.error = 'Could not load questions'
    });
  }

  submit(): void {
    if (!this.student) return;

    const allAnswered = this.questions.every(q => this.answers[q.questionId] !== null);
    if (!allAnswered) {
      this.error = 'Please answer all questions.';
      return;
    }

    const dto: SubmitAnswersDto = {
      studentId: this.student.studentId,
      answers: this.questions.map(q => ({
        questionId: q.questionId,
        answer: this.answers[q.questionId]!
      }))
    };

    this.api.submitAnswers(dto).subscribe({
      next: () => {
        this.success = '✅ Your answers have been submitted!';
        this.error = null;
        setTimeout(() => this.router.navigate(['/leaderboard']), 1500);
      },
      error: (err) => {
        this.success = null;
        this.error = err.error || '❌ Submission failed or already submitted.';
      }
    });
  }
}
