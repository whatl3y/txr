export default {
  getFileName(fileName, extraText=Date.now()) {
    const lastPeriod  = fileName.lastIndexOf(".")
    const extension   = fileName.substring(lastPeriod)
    return `${fileName.substring(0,lastPeriod)}_${extraText}${extension}`
  }
}
