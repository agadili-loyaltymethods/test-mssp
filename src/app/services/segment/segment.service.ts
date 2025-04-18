import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../app.config';
import { Segment } from '../../models/segment';

@Injectable({
  providedIn: 'root'
})
export class SegmentService {
  appConfig = inject(APP_CONFIG);

  constructor(private http: HttpClient) { }

  getAllSegments(query: string = '', limit: number = 10): Observable<Segment[]> {
    return this.http.get<Segment[]>(`${this.appConfig.config.REST_URL}/api/v1/segments?limit=${limit}&query=${query}`);
  }

  getMemberSegments(limit: number = 10, query: string) {
    return this.http.get<Segment[]>(`${this.appConfig.config.REST_URL}/api/v1/membersegments?limit=${limit}&query=${query}`);
  }

  addMemberSegment(memberId: string, segmentId: string) {
    const payload = {
      member: memberId,
      segment: segmentId,
      ext: {}
    }
    return this.http.post(`${this.appConfig.config.REST_URL}/api/v1/membersegments`, payload);
  }

  deleteMemberSegment(id: string) {
    return this.http.delete(`${this.appConfig.config.REST_URL}/api/v1/membersegments/${id}`);
  }

}
