export class TimeFormatter{

  formatTime(time: string): string {
    return new Date(Date.parse(time)).toString();
  }

  formatTimeDifference(dateString: string): string {
    const pastTimeMs = Date.parse(dateString);
    const nowMs = Date.now();
    const now = new Date(nowMs);
    const pastTime = new Date(pastTimeMs);

    const months = (now.getMonth() - pastTime.getMonth()) + (now.getFullYear() - pastTime.getFullYear()) * 12;
    const minutes = Math.round((nowMs - pastTimeMs) / 1000 / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (months >= 12) {
      return this.pluralize(months / 12, 'year') + ' ago';
    } else if (days >= 31) {
      return this.pluralize(months, 'month') + ' ago';
    } else if (hours >= 24) {
      return this.pluralize(days, 'day') + ' ago';
    } else if (minutes >= 60) {
      return this.pluralize(hours, 'hour') + ' ago';
    } else if (minutes >= 1) {
      return this.pluralize(minutes, 'minute') + ' ago';
    }

    return 'just now';
  }

  pluralize(n: number, singular: string): string {
    return (n === 1 ? n + ' ' + singular : n + ' ' + singular + 's');
  }
}
