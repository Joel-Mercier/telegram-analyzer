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
  averageCharactersPerDay: number,
  medianCharactersPerDay: number,
}

class TelegramAnalyzer {

  // Find occurences of substring in string https://gist.github.com/lsauer/2757250
  html?: string
  users: User[] | []
  messages: [{id: string, userId: string, body: string, date: Date}] | []
  keywords: string[] | []

  constructor() {
    this.html = null;
    this.users = [];
    this.messages = [];
    this.keywords = [];
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
      const userMessages = this.messages.filter(message => message.userId === id);
      const total = userMessages.length;
      const days = eachDayOfInterval(
        { start: this.messages[0].date, end: this.messages[this.messages.length - 1].date }
      );
      const messagesPerDay = days.map(day => {
        return userMessages.filter(message => isSameDay(message.date, day)).length;
      });
      const charactersPerDay = days.map(day => {
        return userMessages.filter(message => isSameDay(message.date, day)).reduce((sum, message) => sum += message.body.replace( /\s/g, '' ).length, 0);
      });
      const averageMessagesPerDay = userMessages.length / days.length;
      const medianMessagesPerDay = this.median(messagesPerDay);
      const averageCharactersPerDay = userMessages.reduce((sum, message) => sum += message.body.replace( /\s/g, '' ).length, 0) / days.length;
      const medianCharactersPerDay = this.median(charactersPerDay);
      return {id, name, total, medianMessagesPerDay, averageMessagesPerDay, averageCharactersPerDay, medianCharactersPerDay};
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
      });
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

  analyzeKeywords(keywords: string[]) {
    const data = this.users.map(user => {
      const { id, name } = user;
      const userMessages = this.messages.filter(message => message.userId === id);
      userMessages.map(message => {
        const keywordOccurences = keywords.map(keyword => {
          return {name: keyword, value: this.occurrences(message.body.toLowerCase(), keyword.toLowerCase())};
        });
        return keywordOccurences;
      });
      return {id, name, keywordOccurences};
    });
    debugger
    return data;
  }

  addKeyword(keyword: string) {
    this.keywords = [...this.keywords, keyword];
  }

  removeKeyword(keyword: string) {
    this.keywords = this.keywords.filter(word => keyword !== word);
  }

  occurrences(string: string, subString: string, allowOverlapping?: boolean) {
    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
      pos = 0,
      step = allowOverlapping ? 1 : subString.length;

    while (true) {
      pos = string.indexOf(subString, pos);
      if (pos >= 0) {
        ++n;
        pos += step;
      } else break;
    }
    return n;
  }


}

export default TelegramAnalyzer;