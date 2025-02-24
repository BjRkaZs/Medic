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

  constructor(private http: HttpClient) { }

  signOut(): void {
    sessionStorage.removeItem('email');
    this.token = ''; 
    this.isLoggedUser = false;
    this.loggedUserSub.next(false);
    this.userSub.next(null);
}


  getCurrentUser() {
    return this.userSub;
  }

  getUsers() {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
    return this.http.get(this.apiUrl + 'userlist', { headers: headers });
  }

  getUser(id: any) {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
    return this.http.get(this.apiUrl + 'user/' + id, { headers: headers });
  }

  getClaims(id: any) {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
    return this.http.get(this.apiUrl + 'userClaims/' + id, { headers: headers });
  }

  setClaims(id: any, claims: any) {
    let body = { id: id, roles: claims };
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
    return this.http.post(this.apiUrl + 'userClaims/', body, { headers: headers });
  }

  Register(userData: any): Observable<any> {
    const registerData = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.password_confirmation // Change this line
    };
    
    console.log('Sending registration data:', registerData); // Debug log
    
    return this.http.post(`${this.apiUrl}/register`, registerData);
  }

  update(user: any) {
    console.log('update', user);
    let head = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token,
        'Content-Type': 'application/json'
      })
    };
    return this.http.put(`${this.apiUrl}/${user.id}`, user, head);
  }

  Login(loginData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      email: loginData.email,
      password: loginData.password
    }).pipe(
      tap((response: AuthResponse) => {
        console.log('Login response:', response, this.token);
  
        if (response.success) {
          localStorage.setItem('token', response.data.token);
          sessionStorage.setItem('email', response.data.user.email);
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

  signIn(): void {
    this.isLoggedUser = true;
    this.loggedUserSub.next(true);
  }

}
