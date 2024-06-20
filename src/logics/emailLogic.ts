import { Request, Response } from "express";
import emailjs from "@emailjs/browser";
import {
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
} from "../configs/emalConfigs";
import { URL } from "../configs/envConfigs";

interface TemplateParam {
    name: string;
    message: string;
}

function generateTemplateParams(userId: Number, name: string) {
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }

    const message = `Please click on this magic link to validate your email: ${URL}/${result}`;

    const templateParams: TemplateParam = {
        name,
        message,
    };
}

export async function profileEditEmailVErification(
    req: Request,
    res: Response
) {
    //@ts-ignore
    const userId = req.userId;
    const { name, imageURL, bio, email } = req.body;

    // emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
    // .then(function(response) {
    //    console.log('SUCCESS!', response.status, response.text);
    // }, function(error) {
    //    console.log('FAILED...', error);
    // });

    const templateParam: any = generateTemplateParams(userId, name);
    const response = emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParam
    );
}
