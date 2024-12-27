import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const kupci = await prisma.kupci.findMany({
      select: {
        pol: true,
        starosnaGrupa: true,
        Grad: true,
      },
    });

    return NextResponse.json(kupci, { status: 200 });
  } catch (error) {
    console.error("Error fetching kupci data:", error);
    return NextResponse.json(
      { error: "Failed to fetch kupci data" },
      { status: 500 }
    );
  }
}
