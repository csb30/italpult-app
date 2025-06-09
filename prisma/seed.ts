import { prisma } from "@/lib/prisma";

async function main() {
  await prisma.drink.createMany({
    data: [
      { name: 'Cuba Libre', price: 900, description: "Citrom, Mudler, Jég, 4cl Fehér rum, többi kóla" },
      { name: 'Gin Tonic / Gyömbér', price: 900, description: "Citrom, Mudler, Jég, 4cl Gin, többi Tonicok / gyömbér" },
      { name: 'Jager kicsi', price: 300, description:  "2cl jager"},
    ],
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());