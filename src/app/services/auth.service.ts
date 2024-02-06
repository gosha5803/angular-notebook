import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

//Сервис регистрации и авторизации.
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiKey = 'AIzaSyCibqA73JZc_GW76fe9IpX7o-UC9A8AK5A'
  private user: string | undefined | null 
 
  constructor(
    private storage: StorageService
  ) {}

  //Метод регистрации и логина отличаются только эндпоинтами запросов, получив ответ проверяют его на наличие ошибок, и если таковые имеются, пробрасывают объект с ошибкой на страницу регистрации, далее через сервис локального хранилища регистрируют пользователя, которые прилетает в теле ответа от сервера.
  async register(password: string, email:string) {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await res.json()
      if(data.error) {
        return {errorMessage: Error(data.error.errors[0].message)}
      }
      
      this.storage.saveUser(data.email)
      return data
    }
    
    
    async login(password: string, email:string) {
      const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`, {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await res.json()
      if(data.error) {
        return {errorMessage: Error(data.error.errors[0].message)}
      }
      
      this.storage.saveUser(data.email)

      return data
  }

  //Данные метод проверяет авторизован ли пользователь, если в хранилище нет ключа user, все страницы перебрасываю клиента на страницу регистрации.
  chekForUser() {
    this.user = this.storage.getUser()
    return this.user
  }

  //Метод для удаления ключа user из localStorage.
  logout() {
    this.storage.logout()
  }

}
