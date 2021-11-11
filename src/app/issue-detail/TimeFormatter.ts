/**
 * This class contains functionality for time formatting which is needed for correct time representation
 */
export class TimeFormatter{

  /**
   * E.g. converts (2021-10-01T19:44:04.813Z) to
   * (Fri Oct 01 2021 21:44:04 GMT+0200 (Mitteleuropäische Sommerzeit))
   * @param time
   */
  formatTime(time: string): string {
    return new Date(Date.parse(time)).toString();
  }

  /**
   * E.g. converts (2021-11-02T12:27:58.192Z) to (8 days ago)
   * @param dateString
   */
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

  /**
   * Change singular form of a word into pluralized form if necessary.
   * @param n number of entities
   * @param singular singular form of the word
   */
  pluralize(n: number, singular: string): string {
    return (n === 1 ? n + ' ' + singular : n + ' ' + singular + 's');
  }
}
