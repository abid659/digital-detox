import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VerifiedStudent {
  studentId: number;
  name: string;
  class: number;
  roll: number;
}

export interface Question {
  questionId: number;
  questionText: string;
}

export interface AnswerDto {
  questionId: number;
  answer: boolean;
}

export interface SubmitAnswersDto {
  studentId: number;
  answers: AnswerDto[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'https://digitaldetoxapi.onrender.com/api';


  constructor(private http: HttpClient) {}

  verifyStudent(cls: number, roll: number): Observable<VerifiedStudent> {
    return this.http.get<VerifiedStudent>(`${this.baseUrl}/Students/verify?class=${cls}&roll=${roll}`);
  }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/Questions`);
  }

  submitAnswers(dto: SubmitAnswersDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/StudentResponses/submit`, dto);
  }

  getLeaderboard(fromDate?: string, toDate?: string, classFilter?: number): Observable<any[]> {
    const params: any = {};

    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    if (classFilter !== undefined) params.classFilter = classFilter;

    return this.http.get<any[]>(`${this.baseUrl}/Leaderboard`, { params });
  }
}
