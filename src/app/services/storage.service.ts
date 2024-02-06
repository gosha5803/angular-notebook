import { Injectable } from '@angular/core';
import { Note } from '../../models/Inote';

// В данном файле находится сервис для работы с локальным хранилищем браузера. Модель хранения записей следующая ключу data соответствует объект, ключами которого явялются имена пользователей user: string, значение каждого ключа это массив записей конкретного пользователя.

//Функция предназначена для того, чтобы получать объект даты из localStorage в формате объекта
const storageParser = () => {
  const jsonData = localStorage.getItem('data')
  let data
  if(jsonData) {
    data = JSON.parse(jsonData)
  }

  return data
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  user: string = ''

  constructor() { 
    //В конструкторе класса проверяется наличие вообще поля data в localStorage, если его нет то создаётся объект с ключом [user],
    // Значение ключа - пустой массив.
    const user = this.getUser()
    if(user) {
      this.user = user
    }

    const existingData = localStorage.getItem('data')
    if(!existingData){
      localStorage.setItem('data', JSON.stringify({
        [`${this.user}`]: []
      }))
    }
  }

  //Метод проверяет наличие ключа user, своего рода токен, обозначающий факт авторизации пользователя. Также необходим для получения
  getUser() {
    return localStorage.getItem('user')
  }
  
  //Данный метод смотрит в объекте наличие ключа [user], если его нет, то создаёт  его, присваивает ему пустой массив и возвращет уже значение данного ключа. То есть записи текущего пользователя. 
  getNotes(): Note[] {
    // const user = this.getUser()
    const data = storageParser()

    let userNotes

    if(this.user) {
      if(!data[this.user]) {
        data[this.user] = []
      }
      userNotes = data[this.user]
    }
  
    return userNotes
  }

  //Метод сохраняет авторизованного пользователя в localeStorage и в текущее состояние.
  saveUser(user: string) {
    this.user = user
    localStorage.setItem('user', user)
  }

  //Метод достаёт записи текущего пользователя и через метод filter присваивает отфильтрованный масси ключу [user] объекта data. Возвращает отфильтрованные записи пользователя.
  removeNote(id: number) {
    const data = storageParser()
      data[this.user] = data[this.user].filter((note: Note) => note.id !== id)
      
      localStorage.setItem('data', JSON.stringify(data))
      return data[this.user]
  }

  //Метод ищет запись у пользователя по её id.
  findById(id: number) {
    const data = storageParser()
    return data[this.user].find((note: Note) => note.id === id)
  }

//Метод добавляет записи. Если ключа [user] нет он его создаёт и присваивает пустой массив, в который затем пушит новую запись. Если же ключ существует метод проверяет добавляет ли пользователь новую запись или запись с таким id не имеется, то в массив добавляется новая запись, иначе она ищется повторно, но уже со своим индексом, на индекс уже существующей записи и сохраняется отредактировання щапись. В конце всё сохраняется в localStorage.
  addNote(note: Note) {
    console.log(note)
      const data = storageParser()
      if(!data[this.user]) {
        data[this.user] = []
        data[this.user].push(note)
      } else {
        const existingNote = this.findById(note.id)
        
        if(!existingNote) {
          data[this.user].push(note)
        } else {
          data[this.user].find((oldNote: Note, index: number) => {
            if(oldNote.id === existingNote.id) {
              data[this.user][index] = note;
              return
            }
          })
        }
      }
        
      localStorage.setItem('data', JSON.stringify(data))
  }

  //Метод удаляет ключ user из состояния и из localStorage.
    logout() {
      this.user = ''
      localStorage.removeItem('user')
    }
}
