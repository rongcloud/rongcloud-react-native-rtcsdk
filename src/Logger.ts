 class Logger {
  enable = false
  public readonly tag: string
  /**
   *
   * @param tag 标签
   */
  constructor(tag: string) {
    this.tag = tag
  }

  public log(str: string) {
    if (this.enable)
      console.log(`[${this.tag}] ${new Date().toISOString()} ${str}`)
  }

  public toString(obj: any) {
   return JSON.stringify(obj)
  }
}


export default new Logger('RCRNRtcLib')
