import {Browser, chromium, Page} from 'playwright';

(async () => {
    const browser: Browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://test.jusan.kz:8476/business/kk/osim/articles/onlayn-tapsyrystardy-tabys-etu-punktin-ashu');

    // Находим все ссылки на странице
    const links = await page.$$eval('a', anchors => anchors.map(anchor => anchor.href));

    // Фильтруем ссылки, чтобы оставить только ссылки на PDF
    const pdfLinks = links.filter(link => link.endsWith('.pdf'));

    // Проверяем каждую PDF-ссылку
    for (const link of pdfLinks) {
        const response = await page.goto(link);
        if (response && response.ok()) {
            console.log(`Ссылка на PDF ${link} доступна.`);
        } else {
            console.error(`Ссылка на PDF ${link} недоступна.`);
        }

        // Возвращаемся на исходную страницу перед проверкой следующей ссылки

        await page.goto('https://test.jusan.kz:8476/business/kk/osim/articles/onlayn-tapsyrystardy-tabys-etu-punktin-ashu');
    }

    await browser.close();
})();
