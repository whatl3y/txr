import { Request, Response } from 'express';
interface IRoutesOptions {
    app: any;
}
export default function Routes({ app }: IRoutesOptions): {
    "/clients"(req: Request, res: Response): Promise<void>;
    "*"(req: Request, res: Response): void;
};
export {};
