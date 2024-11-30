import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({
      error: "User not logged in",
    });
  }

  const userId = parseInt(session?.user?.id);

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }, // Newest notifications first
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({
      error: "User not logged in",
    });
  }

  const { notificationId } = await req.json(); // Assuming the body contains the notification ID
  const userId = parseInt(session?.user?.id);

  try {
    const notification = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId: userId,
      },
      data: { isNew: false },
    });

    if (notification.count > 0) {
      return NextResponse.json({ message: "Notification marked as read" });
    } else {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
