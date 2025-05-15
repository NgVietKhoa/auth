import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InternService } from '../services/intern.service';
import { Intern } from '../models/intern.model';

@Component({
  selector: 'app-intern',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './intern.component.html',
  styleUrls: ['./intern.component.css'],
})
export class InternComponent implements OnInit {
  interns: Intern[] = [];
  isLoading: boolean = true;
  animationKey: number = 0; // Để reset animation

  constructor(private internService: InternService) {}

  ngOnInit(): void {
    this.loadInterns();
  }

  loadInterns(): void {
    this.isLoading = true;
    this.animationKey++; // Reset animation
    this.internService.getAllInterns().subscribe({
      next: (data) => {
        this.interns = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching interns:', error);
        this.isLoading = false;
      },
    });
  }

  trackById(index: number, intern: Intern): number {
    return intern.id;
  }
}