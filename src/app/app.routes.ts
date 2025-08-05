import { Routes } from '@angular/router';
import { StudentVerifyComponent } from './pages/student-verify.component';
import { SubmitQuestionsComponent } from './pages/submit-questions.component';
import { LeaderboardComponent } from './pages/leaderboard.component';

export const routes: Routes = [
  { path: '', component: StudentVerifyComponent },
  { path: 'submit', component: SubmitQuestionsComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: '**', redirectTo: '' }
];
