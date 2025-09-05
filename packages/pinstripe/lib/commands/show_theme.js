export default {
  async run() {
    console.log(JSON.stringify(await this.theme, null, 2));
  },
};
