import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Intern, InternWorkSchedule } from '../models/intern.model';

@Injectable({
  providedIn: 'root'
})
export class InternService {
  private internApiUrl = 'https://apiecoit.onrender.com/api/intern';
  private scheduleApiUrl = 'https://apiecoit.onrender.com/api/internWS';

  constructor(private http: HttpClient) {}

  getAllInterns(): Observable<Intern[]> {
    return this.http.get<Intern[]>(this.internApiUrl);
  }

  getAllInternWorkSchedules(): Observable<InternWorkSchedule[]> {
    return this.http.get<InternWorkSchedule[]>(this.scheduleApiUrl);
  }
}