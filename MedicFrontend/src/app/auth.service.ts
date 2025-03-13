import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface AuthResponse {
  success: boolean;
  data: {
    user: {
      name: string;
      email: string;
      admin: number;
    };
    token: string;
    time?: string;
  };
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = 'http://localhost:8000/api';
  private token = '';
  private user: any = {};
  private userSub = new BehaviorSubject<any>(null);
  public SadminSub = new BehaviorSubject<boolean>(false);
  private adminSub = new BehaviorSubject<boolean>(false);
  private loggedUserSub = new BehaviorSubject<boolean>(false);
  private isLoggedUser = false;
  private isLoading = new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient) { 
    this.checkAuthStatus(); 
  }

  private checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
      this.token = token;
      this.isLoggedUser = true;
      this.loggedUserSub.next(true);

      this.http.get(`${this.apiUrl}/getprofile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.user = response.data;
            this.userSub.next(this.user);
          } else {
            this.handleAuthFailure();
          }
          this.isLoading.next(false);
        },
        error: () => {
          this.handleAuthFailure();
          this.isLoading.next(false);
        }
      });
    } else {
      this.isLoading.next(false);
    }
  }

  isLoading$(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  private handleAuthFailure() {
    localStorage.removeItem('token');
    sessionStorage.clear();
    this.token = '';
    this.isLoggedUser = false;
    this.loggedUserSub.next(false);
    this.userSub.next(null);
  }
  
  Register(userData: any): Observable<any> {
    const registerData = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.password_confirmation 
    };
    
    console.log('Sending registration data:', registerData); 
    
    return this.http.post(`${this.apiUrl}/register`, registerData);
  }


  Login(loginData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      email: loginData.email,
      password: loginData.password
    }).pipe(
      tap((response: AuthResponse) => {
        console.log('Login response:', response, this.token);
        if (response.success) {
          const adminLevel = response.data.user.admin;
          localStorage.setItem('token', response.data.token);
          sessionStorage.setItem('email', response.data.user.email);
          sessionStorage.setItem('role', adminLevel.toString());
          this.token = response.data.token;
          this.user = response.data.user;
          this.isLoggedUser = true;
          this.loggedUserSub.next(true);
          this.userSub.next(response.data.user);
        }
      })
    );
  }
  
  getLoggedUser(): Observable<any> {
    return this.userSub.asObservable();
  }

  getIsLoggedUserObservable(): Observable<boolean> {
    return this.loggedUserSub.asObservable();
  }

  getIsLoggedUser(): boolean {
    return this.isLoggedUser;
  }

  signOut(): void {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    this.http.post(`${this.apiUrl}/logout`, {}, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Logout successful:', response);
          localStorage.removeItem('token');
          sessionStorage.clear();
          this.token = '';
          this.isLoggedUser = false;
          this.loggedUserSub.next(false);
          this.userSub.next(null);
        },
        error: (error) => {
          console.error('Logout error:', error);
          localStorage.removeItem('token');
          sessionStorage.clear();
          this.token = '';
          this.isLoggedUser = false;
          this.loggedUserSub.next(false);
          this.userSub.next(null);
        }
      });
  }

  update(user: any): Observable<any> {
    console.log('Updating user:', user);
  
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.put(`${this.apiUrl}/${user.id}`, user, { headers });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/sendpassreset`, { email });
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/passreset`, data);
  }
}
