import { chromium, Browser, Page, Response } from 'playwright';

(async () => {
    const browser: Browser = await chromium.launch({ headless: false });
    const page: Page = await browser.newPage();

    const urlToCheck: string = 'https://jusan.kz/business/osim/articles/kak-prinimat-mobilnye-platezhi-i-ne-narushat-zakon';

    await page.goto(urlToCheck);

    const links: string[] = await page.$$eval('a', (elements: HTMLAnchorElement[]) =>
        elements.map((element) => element.href)
    );

    for (const link of links) {
        const newPage: Page = await browser.newPage();
        const response: Response | null = await newPage.goto(link, { waitUntil: 'domcontentloaded' });

        // Проверяем HTTP-статус ответа, чтобы узнать, существует ли страница.
        if (response && response.status() === 200) {
            //console.log(`Ссылка ${link} рабочая.`);
        } else {
            console.error(`Ссылка ${link} не существует или возвращает ошибку.`);
        }

        await newPage.close();
    }

    await browser.close();
})();
