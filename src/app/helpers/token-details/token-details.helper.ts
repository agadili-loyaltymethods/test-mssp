
import { Injectable } from "@angular/core";
import { State } from "@ngrx/store";

@Injectable({
  providedIn: 'root'
})
export class TokenDetailsHelper {
  constructor(private state: State<any>) {}

  openExternalLink(path: string, query: string = '') {
    //const msspUrl = window.location.origin.replace('msspng', 'mssp');
    const msspUrl = 'http://localhost:3001';
    
    // Get the loyaltyID from localStorage
    const loyaltyID = localStorage.getItem('loyaltyId');
    const location = this.state.getValue().location.location;
    console.log(location);
    
    // Build the URL with loyalty ID as a parameter
    let targetUrl = `${msspUrl}/${path}`;
    
    // Add query parameters
    const params = new URLSearchParams();
    
    if (loyaltyID) {
      params.append('loyaltyId', loyaltyID);
    }

    if (location) {
      params.append('location', location);
    }
    
    if (query) {
      params.append('coupon', btoa(query));
    }
    
    // Add parameters to URL if there are any
    if (params.toString()) {
      targetUrl += `?${params.toString()}`;
    }
    window.open(targetUrl);
  }
}