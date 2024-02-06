import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext'
import { AuthService } from '../../services/auth.service';
import { AlertComponent } from '../../components/alert/alert.component';
import { IAlert } from '../../../models/customAlert';
import { Router } from '@angular/router';

//Компонент страницы с формой регистрации и логина.

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    InputTextModule,
    CardModule,
    ButtonModule, 
    AlertComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  private password = signal('')
  private email = signal('')
  //Два сигнала для организации двустороннего связывания формы и состояния компонента.
  process: 'signIn' | 'signUp' = 'signIn' //Переменная процесса обозначающая процесс входа или регистрации.
  
  alert: IAlert = {} as IAlert // Состояние окна с подсказкой, с помощбю которого можно выводить ошибки запросов пользователю.

  constructor(
    private auth: AuthService, //Сервиc отвечает непосредственно за осуществление запросов на API Firebase.
    private router: Router 
  ) {}

  passwordChangeHandler(ev: any) {
    this.password.set(ev.target.value)
  }
  
  emailChangeHandler(ev: any) {
    this.email.set(ev.target.value)
  }

  //Два метода, каждый из которых следит за состоянием своего инпута.
  
  //Ниже представлен метод логина/регистрации, в зависимости от значения переменной процесса, вызывает разные методы сервиса. Также обрабатывает ошибки и инициализирует окно подсказки, проверяет, заполнил ли пользователь поля формы. В случае успешной регистрации с помощбю роутера перенаправляет пользователя на домашнюю страницу.
  async login() {
    if(!this.email().trim()) {
      this.initAlert({
        message: 'Email обязателен!', color: 'red'
      }) 
      return
    } else if(!this.password().trim()) {
      this.initAlert({
        message: 'Пароль обязателен!', color: 'red'
      }) 
      return
    }

      if(this.process === 'signIn') {
        const res = await this.auth.login(this.password(), this.email())
        if(res.errorMessage) {
          this.initAlert({color: 'red', message: res.errorMessage})
        } else {
          this.initAlert({color: 'green', message: 'Вы успешно вошли, для продолжения обновите страницу.'})
          this.router.navigate(['/'])
        }
        
        
      } else {
        
        
        const res = await this.auth.register(this.password(), this.email())
        if(res.errorMessage) {
          this.initAlert({color: 'red', message: res.errorMessage})
        } else {
          this.initAlert({color: 'green', message: 'Вы успешно зарегистрированы!'})
          this.router.navigate(['/'])
        }
      }
  }

  swithProcess() {
    this.process = this.process === 'signIn' ? 'signUp' : 'signIn'
  }
  //В форме есть кнопки переключения режима c регистрации на вход и наоборот.

  initAlert({message, color}: IAlert) {
    this.alert.message = message
    this.alert.color = color
    setTimeout(() => {
      this.alert.message = ''
    }, 3000) 
  }
  // Данный метод инициализирует подсказку. Подсказка кастомная, её модель описана в src/models/customAlert. В компонент она монтируется только когда сообщение истинно, и через 3 секунды оно делается ложным. Монтаж компонента необходим так, как внутри себя при инициализации он переключает флаг isVisible, который служит для того, чтобы можно было скрывать алерт по нажатию на него переключая флаг в ложное состояние.

}
