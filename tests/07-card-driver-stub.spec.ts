import { test, expect, BrowserContext, Page } from '@playwright/test';
import * as path from 'path';

// =====================================================
// DRIVER: driverOpenCardStub
// ทำหน้าที่เป็น Test Driver ในการโหลดและเปิด Stub card.html
// เพื่อทดสอบการทำงานของ Inventory Card Stub
// =====================================================
async function driverOpenCardStub(context: BrowserContext): Promise<Page> {
  const page = await context.newPage();
  
  // แปลง path เป็น file:// URL เพื่อให้ Browser สามารถเปิดไฟล์ card.html ได้โดยตรง
  const cardPath = path.resolve(__dirname, '../card.html');
  const fileUrl = `file://${cardPath.replace(/\\/g, '/')}`;

  await page.goto(fileUrl);
  await expect(page.locator('[data-test="inventory-card"]')).toBeVisible();

  return page;
}

test.describe('Inventory Card Stub & Driver Test', () => {

  test('Driver เรียก card.html และทดสอบว่ามีชื่อ-นามสกุล "นายณัฏฐ์ชพงศ์ ใจพงษ์"', async ({ browser }) => {
    const context = await browser.newContext();

    try {
      // 1. เรียกใช้ Driver เพื่อเปิด stub card.html
      const page = await driverOpenCardStub(context);

      // 2. ตรวจสอบองค์ประกอบของ Stub Inventory Card
      const card = page.locator('[data-test="inventory-card"]');
      await expect(card).toBeVisible();

      // 3. ตรวจสอบชื่อสินค้าใน Stub
      await expect(page.locator('[data-test="item-name"]')).toHaveText('Sauce Labs Backpack (Stub)');

      // 4. ตรวจสอบว่ามีชื่อและนามสกุล "นายณัฏฐ์ชพงศ์ ใจพงษ์" หรือไม่
      const studentNameLocator = page.locator('[data-test="student-name"]');
      await expect(studentNameLocator).toBeVisible();
      await expect(studentNameLocator).toHaveText('นายณัฏฐ์ชพงศ์ ใจพงษ์');

      // ตรวจสอบทั้งส่วนข้อความ author info
      await expect(page.locator('[data-test="author-info"]')).toContainText('นายณัฏฐ์ชพงศ์ ใจพงษ์');

      // 5. ตรวจสอบปุ่ม Add to Cart และราคา
      await expect(page.locator('[data-test="item-price"]')).toHaveText('$29.99');
      await expect(page.locator('[data-test="add-to-cart-btn"]')).toBeVisible();

    } finally {
      await context.close();
    }
  });

});
