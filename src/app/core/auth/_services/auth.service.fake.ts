// Angular
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
// RxJS
import {Observable, of, forkJoin} from 'rxjs';
import {map, catchError, mergeMap, tap} from 'rxjs/operators';
// Lodash
import {filter, some, find, each} from 'lodash';
// Environment
import {environment} from '../../../../environments/environment';
// CRUD
import {QueryParamsModel, QueryResultsModel, HttpUtilsService} from '../../_base/crud';
// Models
import {User} from '../_models/user.model';
import {Permission} from '../_models/permission.model';
import {Role} from '../_models/role.model';
import {v4 as uuid} from 'uuid';

const API_USERS_URL = 'api/users';
const USERS_URL = 'http://localhost:8080/users';
const API_PERMISSION_URL = 'api/permissions';
const API_ROLES_URL = 'api/roles';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient,
              private httpUtils: HttpUtilsService) {
  }

  // Authentication/Authorization
  login(email: string, password: string): Observable<User> {
    if (!email || !password) {
      return of(null);
    }

    return this.getAllUsers().pipe(
      map((result: User[]) => {
        if (result.length <= 0) {
          return null;
        }

        const user = find(result, (item: User) => {
          return (item.email.toLowerCase() === email.toLowerCase() && item.password === password);
        });

        if (!user) {
          return null;
        }

        user.password = undefined;
        return user;
      })
    );

  }

  register(user: User): Observable<any> {
    //user.roles = [2]; // Manager
    user.accessToken = 'access-token-' + Math.random();
    user.refreshToken = 'access-token-' + Math.random();

    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<User>(API_USERS_URL, user, {headers: httpHeaders})
      .pipe(
        map((res: User) => {
          return res;
        }),
        catchError(err => {
          return null;
        })
      );
  }

  requestPassword(email: string): Observable<any> {
    return this.http.get(API_USERS_URL).pipe(
      map((users: User[]) => {
        if (users.length <= 0) {
          return null;
        }

        const user = find(users, (item: User) => {
          return (item.email.toLowerCase() === email.toLowerCase());
        });

        if (!user) {
          return null;
        }

        user.password = undefined;
        return user;
      }),
      catchError(this.handleError('forgot-password', []))
    );
  }

  getUserByToken(): Observable<User> {
    const userToken = localStorage.getItem(environment.authTokenKey);
    if (!userToken) {
      return of(null);
    }

    return this.getAllUsers().pipe(
      map((result: User[]) => {
        if (result.length <= 0) {
          return null;
        }

        const user = find(result, (item: User) => {
          return (item.accessToken === userToken.toString());
        });

        if (!user) {
          return null;
        }

        user.password = undefined;
        return user;
      })
    );
  }

  // Users

  // CREATE =>  POST: add a new user to the server
  createUser(user: User): Observable<User> {
    const httpHeaders = new HttpHeaders();
    // Note: Add headers if needed (tokens/bearer)
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<User>(USERS_URL, user, {headers: httpHeaders});
  }

  // READ
  getAllUsers(): Observable<User[]> {
    return this.http.get<any>(USERS_URL).pipe(map(res => {
      const users = res._embedded.users;
      return users.map(user => {
        user.id = uuid().substring(0, 8);
        return user;
      });
    }));
  }

  getUserById(userId: number): Observable<User> {
    if (!userId) {
      return of(null);
    }

    return this.http.get<User>(API_USERS_URL + `/${userId}`);
  }

  // DELETE => delete the user from the server
  deleteUser(userId: number) {
    const url = `${API_USERS_URL}/${userId}`;
    return this.http.delete(url);
  }

  // UPDATE => PUT: update the user on the server
  updateUser(_user: User): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.put(API_USERS_URL, _user, {headers: httpHeaders}).pipe(
      catchError(err => {
        return of(null);
      })
    );
  }

  // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
  // items => filtered/sorted result
  findUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // This code imitates server calls
    return this.getAllUsers().pipe(
      mergeMap((response: User[]) => {
        const result = this.httpUtils.baseFilter(response, queryParams, []);
        return of(result);
      })
    );
  }


  // Roles
  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(API_ROLES_URL);
  }

  getRoleById(roleId: number): Observable<Role> {
    return this.http.get<Role>(API_ROLES_URL + `/${roleId}`);
  }

  // CREATE =>  POST: add a new role to the server
  createRole(role: Role): Observable<Role> {
    // Note: Add headers if needed (tokens/bearer)
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<Role>(API_ROLES_URL, role, {headers: httpHeaders});
  }

  // UPDATE => PUT: update the role on the server
  updateRole(role: Role): Observable<any> {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    return this.http.put(API_ROLES_URL, role, {headers: httpHeaders});
  }

  // DELETE => delete the role from the server
  deleteRole(roleId: number): Observable<Role> {
    const url = `${API_ROLES_URL}/${roleId}`;
    return this.http.delete<Role>(url);
  }

  findRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // This code imitates server calls
    return this.http.get<Role[]>(API_ROLES_URL).pipe(
      mergeMap(res => {
        const result = this.httpUtils.baseFilter(res, queryParams, []);
        return of(result);
      })
    );
  }

  // Check Role Before deletion
  isRoleAssignedToUsers(roleId: number): Observable<boolean> {
    return this.getAllUsers().pipe(
      map((users: User[]) => {
        if (some(users, (user: User) => some(user.roles, (_roleId: number) => _roleId === roleId))) {
          return true;
        }

        return false;
      })
    );
  }

  private handleError<T>(operation = 'operation', result?: any) {
    return (error: any): Observable<any> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result);
    };
  }
}
