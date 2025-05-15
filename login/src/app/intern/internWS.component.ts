import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InternService } from '../services/intern.service';
import { InternWorkSchedule } from '../models/intern.model';

interface CalendarDay {
  date: number;
  month: string;
}

interface Task {
  date: number;
  name: string;
}

@Component({
  selector: 'app-intern-ws',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './internWS.component.html',
  styleUrls: ['./internWS.component.css']
})
export class InternWSComponent implements OnInit {
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  selectedMonth = 'April';
  selectedYear = 2025;
  calendarDays: CalendarDay[] = [];
  selectedDay: number | null = null;
  schedules: InternWorkSchedule[] = [];
  showModal: boolean = false;
  isLoading: boolean = true;
  animationKey: number = 0;
  errorMessage: string = '';

  constructor(private internService: InternService) {}

  ngOnInit() {
    this.fetchSchedules();
    this.updateCalendar();
  }

  fetchSchedules() {
    this.isLoading = true;
    this.animationKey++;
    this.internService.getAllInternWorkSchedules().subscribe({
      next: (schedules) => {
        this.schedules = schedules;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi khi lấy lịch làm việc:', err);
        this.errorMessage = 'Không thể tải lịch làm việc. Vui lòng thử lại sau.';
        this.isLoading = false;
      }
    });
  }

  updateCalendar() {
    this.calendarDays = [];
    const monthIndex = this.months.indexOf(this.selectedMonth);
    const firstDay = new Date(this.selectedYear, monthIndex, 1).getDay();
    const daysInMonth = new Date(this.selectedYear, monthIndex + 1, 0).getDate();

    const offset = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < offset; i++) {
      this.calendarDays.push({ date: 0, month: '' });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      this.calendarDays.push({ date: i, month: this.selectedMonth });
    }
  }

  changeMonth(direction: number) {
    let monthIndex = this.months.indexOf(this.selectedMonth);
    monthIndex += direction;
    if (monthIndex < 0) {
      monthIndex = 11;
      this.selectedYear--;
    } else if (monthIndex > 11) {
      monthIndex = 0;
      this.selectedYear++;
    }
    this.selectedMonth = this.months[monthIndex];
    this.updateCalendar();
  }

  goToToday() {
    const today = new Date();
    this.selectedYear = today.getFullYear();
    this.selectedMonth = this.months[today.getMonth()];
    this.selectedDay = today.getDate();
    this.showModal = true;
    this.updateCalendar();
  }

  selectDay(day: CalendarDay) {
    if (day.date === 0) return;
    this.selectedDay = day.date;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedDay = null;
  }

  getTaskNameForDay(date: number): string {
    if (this.getInternCountForDay(date) === 0) return 'Không có';
    const monthIndex = this.months.indexOf(this.selectedMonth);
    const day = new Date(this.selectedYear, monthIndex, date);
    const dayOfWeek = day.getDay();
    if (dayOfWeek === 0) return 'Nghỉ';
    if (dayOfWeek === 6) return 'Thực Tập - Họp';
    return 'Thực tập';
  }

  getTasksForDay(date: number): Task[] {
    if (date === 0) return [];
    return [{ date, name: this.getTaskNameForDay(date) }];
  }

  getInternCountForDay(date: number): number {
    if (date === 0) return 0;
    const monthIndex = this.months.indexOf(this.selectedMonth);
    const day = new Date(this.selectedYear, monthIndex, date);
    return this.schedules.filter(schedule => {
      const startDate = new Date(schedule.startDate);
      const endDate = schedule.endDate ? new Date(schedule.endDate) : new Date(9999, 11, 31);
      return day >= startDate && day <= endDate && day.getDay() !== 0;
    }).length;
  }

  getSchedulesForDay(date: number): InternWorkSchedule[] {
    const monthIndex = this.months.indexOf(this.selectedMonth);
    const day = new Date(this.selectedYear, monthIndex, date);
    return this.schedules.filter(schedule => {
      const startDate = new Date(schedule.startDate);
      const endDate = schedule.endDate ? new Date(schedule.endDate) : new Date(9999, 11, 31);
      return day >= startDate && day <= endDate && day.getDay() !== 0;
    });
  }

  trackByDate(index: number, day: CalendarDay): number {
    return day.date;
  }
}