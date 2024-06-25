import cron from 'node-cron';

abstract class CronProvider {
  constructor(
    private cronTimes: string[],
    private timezone: string = 'UTC',
  ) {
    this.startCron();
  }

  startCron() {
    this.cronTimes.forEach((time) => {
      cron.schedule(time, this.checkCron.bind(this), {
        timezone: this.timezone,
      });
    });
  }

  protected abstract checkCron(): Promise<void>;
}

export default CronProvider;
