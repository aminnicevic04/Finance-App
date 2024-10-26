// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
<<<<<<< HEAD
  res: NextApiResponse<Data>,
=======
  res: NextApiResponse<Data>
>>>>>>> hasan-branch
) {
  res.status(200).json({ name: "John Doe" });
}
