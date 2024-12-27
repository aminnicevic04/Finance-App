import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({
      error: "User ne postoji",
    });
  }

  const userId = parseInt(session?.user?.id);
  const salesDataToSend = await request.json();

  try {
    const salesData = salesDataToSend.salesData;
    const kupacInfo = salesDataToSend.kupacInfo;
    console.log(kupacInfo);

    // Get the user's current rekordProdaja (record sales)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { rekordProdaja: true },
    });

    if (!user) {
      return NextResponse.json({
        error: "User not found",
      });
    }

    //  // Proveri da li kupac već postoji
    //  const existingKupac = await prisma.kupci.findUnique({
    //   where: {
    //     userId: userId,
    //     pol: kupacInfo.pol,
    //     grad: kupacInfo.grad,
    //     starosnaGrupa: kupacInfo.starosnaGrupa,
    //   },
    // });

    // let kupacId;
    // if (existingKupac) {
    //   // Ako kupac već postoji, koristimo njegov ID
    //   kupacId = existingKupac.id;
    // }
    // Ako kupac ne postoji, kreiraj novog kupca
    const newKupac = await prisma.kupci.create({
      data: {
        pol: kupacInfo.pol,
        starosnaGrupa: kupacInfo.starosnaGrupa,
        Grad: kupacInfo.grad,
        userId: userId,
      },
    });
    // kupacId = newKupac.id;

    let newRecord = false;

    // Calculate the total sales from the incoming data
    const totalSalesAmount = salesData.reduce(
      (acc: number, sale: { kolicina: number }) => {
        return acc + sale.kolicina; // Assuming `kolicina` is the sale amount
      },
      0
    );

    // Check if the total sales exceed the current rekordProdaja
    if (totalSalesAmount > user.rekordProdaja) {
      // Update the user's rekordProdaja
      await prisma.user.update({
        where: { id: userId },
        data: { rekordProdaja: totalSalesAmount },
      });

      // Set the flag to true, so we can notify the user
      newRecord = true;
    }

    // Create the sales entries
    const sales = await Promise.all(
      salesData.map(
        async (sale: { id: number; kolicina: number; prodId: number }) => {
          const { id, kolicina, prodId } = sale;

          // Assuming `amount` is based on the sale quantity
          const amount = kolicina;
          const productId = prodId;

          return await prisma.sale.create({
            data: {
              user: { connect: { id: userId } },
              amount,
              description: `Prodaja artikla ID: ${id}`,
              product: { connect: { id: productId } },
            },
          });
        }
      )
    );

    // If a new record was set, create a notification
    if (newRecord) {
      await prisma.notification.create({
        data: {
          userId,
          message: "Ostvarili ste novi rekord dnevne prodaje!",
          type: "good",
        },
      });
    }

    return NextResponse.json(sales, { status: 201 });
  } catch (error) {
    console.error("Error saving sales:", error);
    return NextResponse.json(
      { error: "Failed to save sales data" },
      { status: 500 }
    );
  }
}
