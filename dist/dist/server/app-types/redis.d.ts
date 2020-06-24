import IORedis from 'ioredis';
import { ITxrApp } from './index';
export default function redisApp(redis: IORedis.Redis): ITxrApp;
