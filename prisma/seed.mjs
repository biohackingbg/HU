import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@healthupgrade.bg";
const DEMO_PASSWORD = "demo1234";
const ADMIN_EMAIL = "admin@healthupgrade.bg";
const ADMIN_PASSWORD = "admin1234";

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {
      passwordHash,
      firstName: "Демо",
      lastName: "Потребител",
      role: "customer",
    },
    create: {
      email: DEMO_EMAIL,
      passwordHash,
      firstName: "Демо",
      lastName: "Потребител",
      role: "customer",
    },
  });

  const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash: adminHash, role: "admin" },
    create: {
      email: ADMIN_EMAIL,
      passwordHash: adminHash,
      firstName: "Админ",
      lastName: "",
      role: "admin",
    },
  });

  // Reset demo data so re-running the seed stays idempotent.
  await prisma.order.deleteMany({ where: { userId: user.id } });
  await prisma.address.deleteMany({ where: { userId: user.id } });

  await prisma.address.create({
    data: {
      userId: user.id,
      label: "Вкъщи",
      fullName: "Демо Потребител",
      line1: "ул. Примерна 12, ет. 3, ап. 5",
      city: "София",
      postcode: "1000",
      country: "BG",
      phone: "0888 123 456",
      isDefault: true,
    },
  });

  const image = "/brand/neuromag6-jar.png";
  const day = 24 * 60 * 60 * 1000;

  await prisma.order.create({
    data: {
      orderNumber: "HU-1001",
      userId: user.id,
      status: "delivered",
      subtotal: 4000,
      shipping: 499,
      total: 4499,
      shipName: "Демо Потребител",
      shipLine1: "ул. Примерна 12, ет. 3, ап. 5",
      shipCity: "София",
      shipPostcode: "1000",
      carrier: "Еконт",
      trackingNo: "1053 7788 9900",
      placedAt: new Date(Date.now() - 21 * day),
      items: {
        create: [
          {
            productName: "Neuromag 6™",
            variant: "60 капсули · еднократна покупка",
            unitPrice: 4000,
            quantity: 1,
            imageUrl: image,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: "HU-1002",
      userId: user.id,
      status: "processing",
      subtotal: 6400,
      shipping: 0,
      total: 6400,
      shipName: "Демо Потребител",
      shipLine1: "ул. Примерна 12, ет. 3, ап. 5",
      shipCity: "София",
      shipPostcode: "1000",
      placedAt: new Date(Date.now() - 2 * day),
      items: {
        create: [
          {
            productName: "Neuromag 6™",
            variant: "60 капсули · абонамент",
            unitPrice: 3200,
            quantity: 2,
            imageUrl: image,
          },
        ],
      },
    },
  });

  console.log(`Seeded demo user:  ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  console.log(`Seeded admin user: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
