import bunyan from 'bunyan';
interface ITxrConfig {
    filepath: string;
    server: ITxrConfigServer;
    redis: ITxrConfigRedis;
    logger: ITxrConfigLogger;
}
interface ITxrConfigServer {
    port: number | string;
    web_conc: number | string;
    host: string;
}
interface ITxrConfigRedis {
    url: string;
}
interface ITxrConfigLogger {
    options: bunyan.LoggerOptions;
}
declare const opts: ITxrConfig;
export default opts;
