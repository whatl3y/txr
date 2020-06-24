import { Response } from 'express';
declare const _default: {
    getFileName(fileName: string, extraText?: number | string): string;
    expressjs: {
        convertReadmeToHtml(res: Response): Promise<Response<any>>;
        createHtmlPage(bodyHtml: string): string;
    };
};
export default _default;
