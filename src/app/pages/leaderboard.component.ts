import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import {
  MatCellDef, MatColumnDef, MatHeaderCellDef, MatHeaderRowDef, MatRowDef,
  MatTable, MatHeaderCell, MatHeaderRow, MatRow, MatCell
} from '@angular/material/table';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    MatTable,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatCell,
    MatColumnDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatSelect,
    MatOption,
    NgIf
  ]
})
export class LeaderboardComponent implements OnInit {
  adminName: string | null = null;
  leaderboard: any[] = [];
  filterForm: FormGroup;
  loading = false;
  error: string | null = null;
  hasSearched = false;

  displayedColumns: string[] = ['sl', 'name', 'class', 'roll', 'yesCount'];


  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      selectedClass: ['']
    });
  }

  ngOnInit(): void {
    const studentJson = localStorage.getItem('student');
    if (!studentJson) {
      this.router.navigate(['/']);
      return;
    }

    const student = JSON.parse(studentJson);
    if (student.class !== 3 || student.roll !== 996999) {
      this.router.navigate(['/']);
      return;
    }

    this.adminName = student.name || 'Admin User';
  }

  loadLeaderboard(): void {
    this.loading = true;
    this.error = null;

    const { fromDate, toDate, selectedClass } = this.filterForm.value;

    const from = fromDate ? new Date(fromDate).toISOString() : undefined;
    const to = toDate ? new Date(toDate).toISOString() : undefined;
    const cls = selectedClass ? +selectedClass : undefined; // convert to number

    this.api.getLeaderboard(from, to, cls).subscribe({
      next: data => {
        this.leaderboard = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load leaderboard';
        this.loading = false;
      }
    });
  }

  exportCSV(): void {
    const header = ['SL No', 'Name', 'Class', 'Roll', 'YesCount'];
    const rows = this.leaderboard.map((item, index) => [
      index + 1,
      item.name,
      item.class,
      item.roll,
      item.yesCount
    ]);

    let csvContent = '';
    csvContent += header.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leaderboard.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

