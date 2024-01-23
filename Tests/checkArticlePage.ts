import { chromium, Browser, Page, Response } from 'playwright';

(async () => {
    const browser: Browser = await chromium.launch({ headless: false });
    const page: Page = await browser.newPage();

    const urlToCheck: string = 'https://test.jusan.kz:8476/business/kk/osim/articles/onlayn-tapsyrystardy-tabys-etu-punktin-ashu';

    await page.goto(urlToCheck);

    const links: string[] = await page.$$eval('a', (elements: HTMLAnchorElement[]) =>
        elements.map((element) => element.href)
    );

    for (const link of links) {
        if (link === 'tel:88000800711' || link === 'tel:7711' || link === 'mailto:business@jusan.kz'
/* ||  link === 'https://jusan.kz/file-server/filename?dir=documents&filename=politika-konfidencial-nosti-kz.pdf' */ ) {
 continue;
}

const maxAttempts = 5; // Количество попыток
let attempt = 0;

while (attempt < maxAttempts) {
 try {
     const newPage: Page = await browser.newPage();
     const response: Response | null = await newPage.goto(link, { waitUntil: 'domcontentloaded' });

     // Проверяем HTTP-статус ответа, чтобы узнать, существует ли страница.
     if (response && response.status() === 200) {
         //console.log(`Ссылка ${link} рабочая.`);
         await newPage.close();
         break; // Выходим из цикла, если страница загружена успешно
     } else {
         console.error(`Ссылка ${link} не существует или возвращает ошибку.`);
         await newPage.close();
     }
 } catch (error) {
     console.error(`Ошибка при загрузке страницы: ${error}. Попытка ${attempt + 1} из ${maxAttempts}.`);
     // Если произошла ошибка, закрываем страницу и повторяем попытку
     if (attempt === maxAttempts - 1) {
         console.error(`Все попытки загрузить страницу ${link} неудачны.`);
     }
 } finally {
     attempt++;
 }
}
}

await browser.close();
})();
