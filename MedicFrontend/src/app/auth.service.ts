import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = 'http://localhost:3000/users';
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
    return this.http.post(this.apiUrl, userData);
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

  Login(loginModel: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?email=${loginModel.email}&password=${loginModel.password}`).pipe(
      tap(response => {
        if (response && response.length > 0) {
          const user = response[0];
          sessionStorage.setItem('email', loginModel.email); 
          this.isLoggedUser = true;
          this.loggedUserSub.next(true);
          this.userSub.next(user);  
        } else {
          this.isLoggedUser = false;
          this.loggedUserSub.next(false);
          this.userSub.next(null);
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
