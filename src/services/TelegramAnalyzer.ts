//@ts-nocheck
import { parse, eachDayOfInterval, isSameDay, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string,
  name: string,
};

export interface UserInfo extends User {
  total: number,
  averageMessagesPerDay: number,
  medianMessagesPerDay: number,
}

class TelegramAnalyzer {
  html?: string
  users: User[] | []
  messages: [{id: string, userId: string, body: string, date: Date}] | []

  constructor() {
    this.html = null;
    this.users = [];
    this.messages = [];
  }

  initialize(html: string) {
    this.html = html;
    const document = this.parseHtml();
    const messages = document.querySelectorAll('.message.default');
    messages.forEach((message) => {
      const name = message.querySelector('.from_name')?.innerHTML?.trim();
      const body = message.querySelector('.text')?.innerHTML?.trim();
      const date = parse(message.querySelector('.date.details')?.title, 'dd.MM.yyyy HH:mm:ss', new Date(), {locale: fr});
      let userId = uuidv4();
      if (name) {
        if (this.users.filter(user => user.name === name).length === 0) {
          this.users.push({id: userId, name});
        } else {
          userId = this.users.filter(user => user.name === name)[0].id;
        }
      }
      if (date && body) {
        const messageId = uuidv4();
        this.messages.push({id: messageId, userId, body, date});
      }
    });
  }

  reset() {
    this.html = null;
    this.users = [];
    this.messages = [];
  } 

  parseHtml() {
    const parser = new DOMParser();
    const document = parser.parseFromString(this.html, "text/html");
    return document;
  }

  getUserInfos() {
    const data = this.users.map((user, index) => {
      const { id, name } = user;
      const total = this.messages.filter(message => message.userId === user.id).length;
      const days = eachDayOfInterval(
        { start: this.messages[0].date, end: this.messages[this.messages.length - 1].date }
      );
      const messagesPerDay = days.map(day => {
        return this.messages.filter(message => message.userId === user.id && isSameDay(message.date, day)).length;
      });
      if (user.name === "Hubert MED L 25200") {
        debugger
      }
      const averageMessagesPerDay = this.messages.filter(message => message.userId === user.id).length / days.length;
      const medianMessagesPerDay = this.median(messagesPerDay);
      return {id, name, total, medianMessagesPerDay, averageMessagesPerDay};
    });
    return data;
  }

  getMessagesCountPerUser() {
    const data = this.users.map(user => {
      return {name: user.name, value: this.messages.filter(message => message.userId === user.id).length};
    });
    return data;
  }

  getMessagesPerUserPerDay() {
    const days = eachDayOfInterval(
      { start: this.messages[0].date, end: this.messages[this.messages.length - 1].date }
    );
    const data = days.map(day => {
      const dayData = {name: format(day, 'dd/MM/yyyy')};
      this.users.map(user => {
        dayData[user.name] = this.messages.filter(message => message.userId === user.id && isSameDay(message.date, day)).length;
        return null;
      })
      return dayData;
    });
    return data;
  }

  median(numbers: number[]) {
    const sorted = numbers.slice().sort((a: number, b: number) => a - b);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
  }


}

export default TelegramAnalyzer;