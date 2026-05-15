export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      message: "Method not allowed"
    });
  }

  try {
    const { email, deviceId } = req.body;

    console.log("EMAIL LOGIN:", email);
    console.log("DEVICE:", deviceId);

    return res.status(200).json({
      ok: true,
      message: "Success"
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      message: "Internal server error"
    });
  }
}
