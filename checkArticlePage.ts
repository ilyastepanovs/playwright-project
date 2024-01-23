import { chromium, Browser, Page, Response } from 'playwright';

(async () => {
    const browser: Browser = await chromium.launch({ headless: true });
    const page: Page = await browser.newPage();

    const urlToCheck: string = 'https://test.jusan.kz:8476/business/kk/osim/articles/onlayn-tapsyrystardy-tabys-etu-punktin-ashu';

    await page.goto(urlToCheck);

    const links: string[] = await page.$$eval('a', (elements: HTMLAnchorElement[]) =>
        elements.map((element) => element.href)
    );

    for (const link of links) {
        if (link === 'tel:88000800711' || link == 'tel:7711' || link == 'mailto:business@jusan.kz') {
            continue;
        }

        const newPage: Page = await browser.newPage();
        const response: Response | null = await newPage.goto(link, { waitUntil: 'domcontentloaded' });

        // Проверяем HTTP-статус ответа, чтобы узнать, существует ли страница.
        if (response && response.status() === 200) {
            console.log(`Ссылка ${link} рабочая.`);
        } else {
            console.error(`Ссылка ${link} не существует или возвращает ошибку.`);
        }

        await newPage.close();
    }


    await browser.close();
})();
